// 🛒 CART API MANAGER - Handles all cart operations
class CartAPIManager {
  constructor() {
    this.baseUrl = window.Shopify?.routes?.root || '/';
    this.cartData = null;
    this.loading = false;
    this.subscribers = [];
  }

  // Get current cart data from Shopify
  async getCart() {
    try {
      this.loading = true;
      const response = await fetch(`${this.baseUrl}cart.js`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        throw new Error(`Cart fetch failed: ${response.status}`);
      }

      this.cartData = await response.json();
      this.notifySubscribers();
      return this.cartData;
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  // Add item to cart
  async addToCart(items, options = {}) {
    try {
      const body = { 
        items: Array.isArray(items) ? items : [items],
        ...options 
      };

      const response = await fetch(`${this.baseUrl}cart/add.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.description || 'Add to cart failed');
      }

      const result = await response.json();
      await this.getCart(); // Refresh cart data
      return result;
    } catch (error) {
      console.error('Add to cart failed:', error);
      throw error;
    }
  }

  // Change specific line item
  async changeLineItem(lineKey, quantity, properties = {}) {
    try {
      const body = {
        id: lineKey,
        quantity: quantity,
        properties: properties
      };

      const response = await fetch(`${this.baseUrl}cart/change.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Line item change failed');
      }

      this.cartData = await response.json();
      this.notifySubscribers();
      return this.cartData;
    } catch (error) {
      console.error('Line item change failed:', error);
      throw error;
    }
  }

  // Subscribe to cart changes
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify subscribers of cart changes
  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.cartData));
    // Also update cart count in header whenever cart changes
    if (typeof this.updateCartCount === 'function') {
      this.updateCartCount();
    }
  }

  // Format price from cents to currency
  formatPrice(priceInCents, currency = 'USD') {
    if (priceInCents == null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || this.cartData?.currency || 'USD'
    }).format(priceInCents / 100);
  }

  // Get cart totals
  getCartTotals() {
    if (!this.cartData) return null;
    
    return {
      itemCount: this.cartData.item_count,
      subtotal: this.formatPrice(this.cartData.items_subtotal_price),
      total: this.formatPrice(this.cartData.total_price),
      totalDiscount: this.cartData.total_discount > 0 ? this.formatPrice(this.cartData.total_discount) : null,
      requiresShipping: this.cartData.requires_shipping
    };
  }
}

class TopCartDrawer extends CartAPIManager {
  constructor() {
    super(); // Initialize the CartAPIManager
    
    // Select the DOM elements for the cart drawer, close button, and overlay
    this.cartDrawer = document.querySelector("#top-cart-drawer");
    this.drawerClose = document.querySelector(".close-drawer-btn");
    this.drawerOverlay = document.querySelector(".top-drawer-overlay");
    this.cartItemsContainer = document.querySelector("#drawer-products-wrapper");
    this.subtotalElement = document.querySelector("#subtotal");
    this.discountElement = document.querySelector("#discount");
    this.totalElement = document.querySelector("#total");

     //! Select all elements that should toggle the cart drawer open (links, buttons, etc.)
    this.cartSelectors = [
      "a[href*='/cart']:not([href^='//']):not([href*='/cart/change']):not([href*='/cart/add']):not([href*='/cart/clear']):not([href*='/products/cart']):not([href*='/collections/cart']):not([class*='upcart']):not([class*='revy-upsell-btn-cart']):not([href*='/checkout']):not([href*='/discount']):not([href*='/cart/1']):not([href*='/cart/2']):not([href*='/cart/3']):not([href*='/cart/4']):not([href*='/cart/5']):not([href*='/cart/6']):not([href*='/cart/7']):not([href*='/cart/8']):not([href*='/cart/9'])",
      "a[data-cart-toggle]", "#sticky-app-client div[data-cl='sticky-button']",
      "button.minicart-open", "#cart-icon-bubble", ".slide-menu-cart", 
      ".icon-cart:not(svg)", ".cart-icon:not(svg)", 
      ".cart-link:not(div.header-icons):not(ul)", 
      "button.header-cart-toggle", "div.minicart__button", 
      "button.js-cart-button", ".mini-cart-trigger", 
      ".shopping-cart a[href*='#cart']", ".header-menu-cart-drawer", 
      ".js-mini-cart-trigger", "#CartButton-Desktop", "#CartButton"
    ].join(", ");

     //! Select all elements that are "Add to Cart" buttons or forms
    this.addToCartSelectors = [
      "button[id*='so-btn-add-to-cart']", "input[data-btn-addtocart]", 
      "input[id='product-add-to-cart']", "button[data-product-id]:not([data-checkout='checkout'])",
      "button[data-checkout='cart']", "button[type='submit'][name='add']", 
      "button[id='pre_order_custom']", "button[class='btn-addtocart']", 
      "button[class='addtocart-js']", "div[class='addCart']",
      "button[class*='add-to-cart']", "button[class*='textboxAddToCartBtn']", 
      "form[action*='/cart/add'] [type='submit']", "[data-product-atc]"
    ].join(", ");

    // 🚫 CHOOSE OPTIONS SELECTORS TO EXCLUDE (based on your HTML inspection)
    this.variantSelectionSelectors = [
      // Specific selectors from your HTML inspection
      ".quick-add__submit",                    // Quick add submit buttons
      "modal-opener button",                   // Buttons inside modal-opener
      "button[aria-haspopup='dialog']",        // Buttons that open dialogs
      ".quick-add .quick-add__submit",         // More specific quick add context
      
      // Common variant selection patterns (for other themes)
      "button[class*='choose-options']",
      "button[class*='select-options']", 
      "button[class*='quickview']",
      "button[class*='quick-view']",
      "button[data-quickview]",
      "button[data-open-modal]",
      "button[data-open-quickview]",
      "button[aria-label*='Choose']",
      "button[aria-label*='Select']",
      "button[aria-label*='Options']",
      "button[title*='Choose']",
      "button[title*='Select']",
      "button[title*='Options']",
      ".quick-add-button[data-quickview]",
      "[data-quick-add][data-quickview]"
    ].join(", ");

    //? Call the initialize method to set up event listeners and behavior
    this.initialize();
  }

   //! Initialize the cart drawer
  /**
   * - Enable the cart functionality
   * - Replace cart elements in the DOM
   * - Bind click events to open and close the cart drawer
   * - Bind add-to-cart events to trigger cart drawer behavior
   */
  async initialize() {
    console.log('Initializing Cart Drawer with Real Cart API');

    //? Set a custom attribute on the body to indicate the cart is enabled
    document.body.setAttribute("data-top-cart-enabled", "true");

    //? Replace cart-related elements with their clones (to avoid any issues with event listeners)
    this.replaceCartElements();

    //? Load initial cart data
    try {
      await this.getCart();
      console.log('Initial cart data loaded:', this.cartData);
    } catch (error) {
      console.error('Failed to load initial cart data:', error);
    }

    //? Bind events to open/close the cart drawer and handle add-to-cart actions
    this.bindCartIconToggleEvents();
    this.bindAddToCartEvents();
    this.bindCartItemEvents();
    this.bindCheckoutButton();
  }

   //! Replace cart-related elements with clones
  /**
   * This helps ensure that event listeners are correctly bound to the updated elements
   */
  replaceCartElements() {
    document.querySelectorAll(this.cartSelectors).forEach((element) => {
       //* Clone each cart-related element and replace the original with the clone
       const newElement = element.cloneNode(true);
       element.parentNode.replaceChild(newElement, element);
    });
  }


   //! OPEN AND CLOSE THE CART DRAWER
  /**
   * Bind events to open and close the cart drawer
   * - Open the drawer when cart elements are clicked
   * - Close the drawer when the close button or overlay is clicked
   */
  bindCartIconToggleEvents() {
    //* Open cart drawer when any of the cart-related elements is clicked
    document.addEventListener("click", (event) => {
      if (event.target.closest(this.cartSelectors)) {
        event.preventDefault(); // Prevent default behavior (e.g., link redirection)
        this.toggleCartDrawer(true); // Open the cart drawer
        console.log('Cart Drawer Opened');
      }
    });

    //* Close cart drawer when either the close button or the overlay is clicked
    [this.drawerClose, this.drawerOverlay].forEach((trigger) => {
      if (trigger) {
        trigger.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent default behavior (e.g., link redirection)
          this.toggleCartDrawer(false); // Close the cart drawer
          console.log('Cart Drawer Closed');
        });
      }
    });
  }
   //! TRIGGER CART DRAWER WHEN CLICKING ON ADD TO CART BUTTON
  /**
   * Bind events to the add-to-cart buttons and Forms
   * - Trigger the cart drawer to open when a product is added to the cart
   * - Show an alert indicating the product was added
   */
  // 🎯 ENHANCED ADD TO CART EVENT BINDING - With proper cart integration
  bindAddToCartEvents() {
    // Handle form submissions with real cart integration - IMPROVED VERSION
    document.addEventListener("submit", async (event) => {
      const form = event.target;
      
      // Only handle forms that are specifically cart add forms
      if (!form.action || 
          (!form.action.includes('/cart/add') && !form.getAttribute('action')?.includes('/cart/add'))) {
        return;
      }
      
      // Check if any elements match our add-to-cart selectors
      const submitButton = event.submitter || form.querySelector('[type="submit"]');
      
      // Check if this is a variant selection button we should exclude
      if (this.isVariantSelectionButton(submitButton) || 
          this.isVariantButtonByText(submitButton?.textContent?.toLowerCase().trim() || '')) {
        console.log('Variant selection button - allowing default form submission');
        return;
      }

      // Additional checks to make sure this is actually an add to cart we should handle
      const hasVariantInput = form.querySelector('input[name="id"], select[name="id"]');
      if (!hasVariantInput) {
        console.log('No variant input found - not handling this form');
        return;
      }

      // Prevent default and handle with our cart system
      event.preventDefault();
      console.log('TopCart: Intercepting add to cart form submission');
      
      try {
        await this.handleFormSubmission(form);
      } catch (error) {
        console.error('TopCart form submission failed:', error);
        // If our custom handling fails, allow the form to submit normally
        console.log('TopCart: Falling back to default form submission');
        
        // Create a new form submission without our event listener
        const newForm = form.cloneNode(true);
        document.body.appendChild(newForm);
        newForm.submit();
        document.body.removeChild(newForm);
      }
    }, true); // Use capture phase to intercept before theme handlers

    //* Attach to individual buttons (for non-form add to cart buttons)
    document.addEventListener("click", async (event) => {
      const clickedElement = event.target.closest(this.addToCartSelectors);
      
      if (!clickedElement) return;
      
      // Check for variant selection buttons
      if (this.isVariantSelectionButton(clickedElement)) {
        console.log('Variant selection button clicked - not intercepting');
        return;
      }
      
      // Additional check for button text content
      const buttonText = clickedElement.textContent?.toLowerCase().trim() || '';
      if (this.isVariantButtonByText(buttonText)) {
        console.log('Variant selection button by text - not intercepting:', buttonText);
        return;
      }

      // Check if this button is part of a form (already handled above)
      const form = clickedElement.closest('form');
      if (form && form.action && form.action.includes('/cart/add')) {
        // Form submission will handle this
        return;
      }

      // Handle standalone add-to-cart buttons (rare, but possible)
      event.preventDefault();
      console.log('Intercepting standalone add to cart button');
      
      try {
        const variantId = clickedElement.dataset.variantId || 
                         clickedElement.dataset.productId ||
                         clickedElement.getAttribute('data-variant-id');
        
        if (variantId) {
          await this.addToCart({ id: variantId, quantity: 1 });
          await this.toggleCartDrawer(true);
        } else {
          console.warn('No variant ID found for standalone button');
        }
      } catch (error) {
        console.error('Standalone button add to cart failed:', error);
        alert('Failed to add product to cart. Please try again.');
      }
    });
  }

  // 🔍 CHECK if button is for variant selection (using real selectors)
  isVariantSelectionButton(element) {
    if (!element) return false;
    
    try {
      // Check if element matches any variant selection selectors
      const matches = element.matches && element.matches(this.variantSelectionSelectors);
      
      // Additional check for parent context
      const parentMatches = element.closest && (
        element.closest('.quick-add') ||           // Quick add container
        element.closest('modal-opener') ||         // Modal opener container
        element.closest('[data-modal]')            // Modal trigger container
      );
      
      return matches || parentMatches;
    } catch (e) {
      console.warn('Error checking variant selection button:', e);
      return false;
    }
  }

  // 🔍 CHECK button text for variant selection keywords
  isVariantButtonByText(buttonText) {
    const variantKeywords = [
      'choose options', 'select options', 'choose option', 'select option',
      'quick view', 'quickview', 'view options', 'see options',
      'choose', 'select', 'options', 'variants'
    ];
    
    return variantKeywords.some(keyword => 
      buttonText.includes(keyword) && !buttonText.includes('add to cart')
    );
  }

   //! Toggle the visibility of the cart drawer
   /** 
    * @param {boolean} isOpen - Whether the cart drawer should be open or closed
   */
  async toggleCartDrawer(isOpen) {
    if (isOpen) {
      // Load fresh cart data before showing
      try {
        await this.getCart();
        this.renderCartContent();
      } catch (error) {
        console.error('Failed to load cart data:', error);
      }

      // Add classes to show the drawer and prevent body scrolling
      this.cartDrawer?.classList.add("open");
      document.body.classList.add("top-drawer-open");
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      console.log('Cart Drawer Opened with real data');
    } else {
      // Remove classes to hide the drawer and restore normal body behavior
      this.cartDrawer?.classList.remove("open");
      document.body.classList.remove("top-drawer-open");
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      console.log('Cart Drawer Closed');
    }
  }

  //! RENDER CART CONTENT - Replace hardcoded HTML with real data
  renderCartContent() {
    if (!this.cartData || !this.cartItemsContainer) return;

    if (this.cartData.items.length === 0) {
      this.renderEmptyCart();
    } else {
      this.renderCartItems();
    }

    this.renderCartTotals();
  }

  //! RENDER EMPTY CART
  renderEmptyCart() {
    this.cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <p style="text-align: center; padding: 40px 20px; color: #666;">
          Your cart is empty
        </p>
      </div>
    `;
  }

  //! RENDER CART ITEMS with real data
  renderCartItems() {
    const itemsHTML = this.cartData.items.map(item => this.renderCartItem(item)).join('');
    this.cartItemsContainer.innerHTML = itemsHTML;
  }

  //! RENDER SINGLE CART ITEM
  renderCartItem(item) {
    const itemPrice = this.formatPrice(item.final_price);
    const originalPrice = item.original_price !== item.final_price ? this.formatPrice(item.original_price) : null;

    // Handle variant options display
    const variantsHTML = item.options_with_values && item.options_with_values.length > 0 
      ? item.options_with_values.map(option => 
          `<span class="variant-label">${option.name.toUpperCase()}:<span class="variant-value">${option.value.toUpperCase()}</span></span>`
        ).join('')
      : '';

    return `
      <div class="cart-item" data-line-key="${item.key}">
        <div class="image-container">
          ${item.featured_image ? 
            `<img src="${item.featured_image.url}" alt="${item.featured_image.alt || item.title}" height="100%" width="100%" loading="lazy">` :
            `<div style="width: 100%; height: 100%; background: #f5f5f5; display: flex; align-items: center; justify-content: center;">No Image</div>`
          }
        </div>

        <div class="second-container">
          <div class="item-details">
            <h4 class="cart-item-title">${item.product_title}</h4>

            ${variantsHTML ? `
              <div class="shadow-wrapper show-right-shadow">
                <div class="variants-div hide-scrollbar">
                  ${variantsHTML}
                </div>
              </div>
            ` : ''}

            <div class="prices-div">
              <div class="prices-container">
                ${originalPrice ? `<span class="price">${originalPrice}</span>` : ''}
                <span class="sale-price">${itemPrice}</span>
                ${item.line_level_total_discount > 0 ? `<span class="addon-price">DISCOUNT: -${this.formatPrice(item.line_level_total_discount)}</span>` : ''}
              </div>
            </div>
          </div>

          <div class="quantity-and-remove-btn-div">
            <div class="quantity-div">
              <div class="decrease-qty">
                <button type="button" class="decrease-qty-btn" data-line-key="${item.key}" data-action="decrease" ${item.quantity <= 1 ? 'disabled' : ''}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 12h12" />
                  </svg>
                </button>
              </div>

              <input type="number" class="product-quantity" min="1" value="${item.quantity}" data-line-key="${item.key}" />

              <div class="increase-qty">
                <button type="button" class="increase-qty-btn" data-line-key="${item.key}" data-action="increase">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <button type="button" class="remove-from-cart-btn" data-line-key="${item.key}" data-action="remove">
                <span>remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  //! RENDER CART TOTALS with real data
  renderCartTotals() {
    const totals = this.getCartTotals();
    if (!totals) return;

    if (this.subtotalElement) {
      this.subtotalElement.textContent = totals.subtotal;
    }

    if (this.discountElement && totals.totalDiscount) {
      this.discountElement.textContent = `- ${totals.totalDiscount}`;
      this.discountElement.closest('#discount-div').style.display = 'flex';
    } else if (this.discountElement) {
      this.discountElement.closest('#discount-div').style.display = 'none';
    }

    if (this.totalElement) {
      this.totalElement.textContent = totals.total;
    }
  }

  //! BIND CART ITEM EVENTS - Handle quantity changes and removals
  bindCartItemEvents() {
    if (!this.cartItemsContainer) return;

    // Handle quantity button clicks
    this.cartItemsContainer.addEventListener('click', async (e) => {
      const button = e.target.closest('[data-action]');
      if (!button) return;

      e.preventDefault();
      const action = button.dataset.action;
      const lineKey = button.dataset.lineKey;
      
      if (!lineKey) return;

      const currentItem = this.cartData.items.find(item => item.key === lineKey);
      if (!currentItem) return;

      try {
        button.disabled = true;
        
        switch (action) {
          case 'increase':
            await this.changeLineItem(lineKey, currentItem.quantity + 1);
            break;
          case 'decrease':
            if (currentItem.quantity > 1) {
              await this.changeLineItem(lineKey, currentItem.quantity - 1);
            }
            break;
          case 'remove':
            await this.changeLineItem(lineKey, 0);
            break;
        }
        
        this.renderCartContent();
      } catch (error) {
        console.error(`Failed to ${action} item:`, error);
        alert(`Failed to update cart. Please try again.`);
      } finally {
        button.disabled = false;
      }
    });

    // Handle direct quantity input changes
    this.cartItemsContainer.addEventListener('change', async (e) => {
      if (!e.target.classList.contains('product-quantity')) return;

      const input = e.target;
      const lineKey = input.dataset.lineKey;
      const newQuantity = parseInt(input.value, 10);

      if (!lineKey || isNaN(newQuantity) || newQuantity < 0) return;

      try {
        input.disabled = true;
        await this.changeLineItem(lineKey, newQuantity);
        this.renderCartContent();
      } catch (error) {
        console.error('Failed to update quantity:', error);
        alert('Failed to update quantity. Please try again.');
        // Restore original value
        const currentItem = this.cartData.items.find(item => item.key === lineKey);
        if (currentItem) {
          input.value = currentItem.quantity;
        }
      } finally {
        input.disabled = false;
      }
    });
  }

  //! HANDLE FORM SUBMISSION - Extract form data and add to cart
  async handleFormSubmission(form) {
    try {
      console.log('TopCart: Processing form submission');
      
      const formData = new FormData(form);
      
      // Debug: Log all form data
      console.log('TopCart: Form data entries:');
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
      }
      
      // Extract variant ID (try multiple possible input names)
      const variantId = formData.get('id') || 
                       formData.get('variant_id') || 
                       formData.get('product_id');
                       
      if (!variantId) {
        console.error('TopCart: No variant ID found in form data');
        throw new Error('No variant ID found in form');
      }
      
      // Extract quantity (default to 1)
      const quantity = parseInt(formData.get('quantity')) || 1;
      
      // Extract line item properties
      const properties = {};
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('properties[') && key.endsWith(']')) {
          const propKey = key.slice(11, -1);
          properties[propKey] = value;
        }
      }
      
      // Extract selling plan if present
      const sellingPlan = formData.get('selling_plan');
      
      // Build the cart item
      const cartItem = {
        id: parseInt(variantId),
        quantity: quantity
      };
      
      if (Object.keys(properties).length > 0) {
        cartItem.properties = properties;
      }
      
      if (sellingPlan) {
        cartItem.selling_plan = parseInt(sellingPlan);
      }
      
      console.log('TopCart: Adding to cart:', cartItem);
      
      // Add to cart using our API
      const result = await this.addToCart(cartItem);
      console.log('TopCart: Successfully added to cart:', result);
      
      // Update cart count in header
      this.updateCartCount();
      
      // Open cart drawer
      await this.toggleCartDrawer(true);
      
      console.log('TopCart: Cart drawer opened successfully');
      
    } catch (error) {
      console.error('TopCart: Handle form submission error:', error);
      throw error;
    }
  }

  //! UPDATE CART COUNT - Update cart icon count in header
  updateCartCount() {
    if (!this.cartData) return;
    
    // Common selectors for cart count elements
    const countSelectors = [
      '#CartCount span',
      '.cart-count',
      '[data-cart-count]',
      '.cart-icon-count',
      '.header-cart-count',
      '.cart-counter',
      '.mini-cart-count'
    ];
    
    countSelectors.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.textContent = this.cartData.item_count;
        
        // Show/hide based on count
        if (this.cartData.item_count > 0) {
          element.style.display = '';
          element.classList.remove('hidden');
        } else {
          element.style.display = 'none';
          element.classList.add('hidden');
        }
      }
    });
    
    console.log(`Updated cart count to: ${this.cartData.item_count}`);
  }

  //! BIND CHECKOUT BUTTON - Handle checkout redirection
  bindCheckoutButton() {
    const checkoutButton = document.querySelector('.footer-checkout-btn');
    if (checkoutButton) {
      checkoutButton.addEventListener('click', () => {
        console.log('Redirecting to checkout');
        window.location.href = `${this.baseUrl}checkout`;
      });
    }
  }
}

 // ! Initialize the TopCartDrawer class once the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  new TopCartDrawer();
});
