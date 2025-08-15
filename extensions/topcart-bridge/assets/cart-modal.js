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
      console.log('🌐 CartAPI: Preparing add to cart request');
      const body = { 
        items: Array.isArray(items) ? items : [items],
        ...options 
      };

      console.log('🌐 CartAPI: Request body:', JSON.stringify(body, null, 2));
      console.log('🌐 CartAPI: Making fetch request to:', `${this.baseUrl}cart/add.js`);

      const response = await fetch(`${this.baseUrl}cart/add.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(body)
      });

      console.log('🌐 CartAPI: Response status:', response.status);
      console.log('🌐 CartAPI: Response ok:', response.ok);

      if (!response.ok) {
        console.error('🌐 CartAPI: Response not ok, reading error...');
        const errorData = await response.json().catch(() => ({}));
        console.error('🌐 CartAPI: Error data:', errorData);
        throw new Error(errorData.description || `Add to cart failed: ${response.status}`);
      }

      console.log('🌐 CartAPI: Reading response JSON...');
      const result = await response.json();
      console.log('🌐 CartAPI: Response result:', result);
      
      console.log('🔄 CartAPI: Refreshing cart data...');
      await this.getCart(); // Refresh cart data
      console.log('✅ CartAPI: Add to cart completed successfully');
      return result;
    } catch (error) {
      console.error('❌ CartAPI: Add to cart failed:', error);
      console.error('❌ CartAPI: Error stack:', error.stack);
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
    
    // Debug: Log which elements were found
    console.log('🔍 TopCart: Element Detection:');
    console.log('- Cart Drawer:', this.cartDrawer ? '✅ Found' : '❌ Not Found');
    console.log('- Close Button:', this.drawerClose ? '✅ Found' : '❌ Not Found');
    console.log('- Overlay:', this.drawerOverlay ? '✅ Found' : '❌ Not Found');
    console.log('- Items Container:', this.cartItemsContainer ? '✅ Found' : '❌ Not Found');

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
    console.log('🛒 TopCart: Initializing Cart Drawer with Real Cart API');

    //? Set a custom attribute on the body to indicate the cart is enabled
    document.body.setAttribute("data-top-cart-enabled", "true");

    //? Add missing theme functions to prevent errors
    this.addThemeCompatibilityFixes();

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
    this.bindGlobalCartEvents();
  }

  //! Add theme compatibility fixes
  /**
   * Provides missing functions that theme scripts expect to prevent errors
   */
  addThemeCompatibilityFixes() {
    // Fix missing getCurrentSellingPlanId function that Dawn theme expects
    if (typeof window.getCurrentSellingPlanId === 'undefined') {
      window.getCurrentSellingPlanId = function() {
        try {
          // Return empty/null to prevent invalid selling plan IDs
          console.log('🔧 getCurrentSellingPlanId called - returning null for safety');
          return null;
        } catch (error) {
          console.error('Error in getCurrentSellingPlanId:', error);
          return null;
        }
      };
      console.log('✅ TopCart: Added safe getCurrentSellingPlanId function');
    }

    // Fix missing getActiveVariant function if needed  
    if (typeof window.getActiveVariant === 'undefined') {
      window.getActiveVariant = function() {
        try {
          // Return null to let the theme handle variant detection properly
          console.log('🔧 getActiveVariant called - returning null for theme compatibility');
          return null;
        } catch (error) {
          console.error('Error in getActiveVariant:', error);
          return null;
        }
      };
      console.log('✅ TopCart: Added safe getActiveVariant function');
    }

    // Ensure Shopify global object exists
    if (typeof window.Shopify === 'undefined') {
      window.Shopify = {};
    }
    if (typeof window.Shopify.routes === 'undefined') {
      window.Shopify.routes = { root: '/' };
    }

    console.log('🔧 TopCart: Theme compatibility fixes applied');
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
        console.log('🔼 TopCart: Cart icon/link clicked - opening drawer');
        event.preventDefault(); // Prevent default behavior (e.g., link redirection)
        event.stopPropagation(); // Prevent event bubbling that might cause conflicts
        this.toggleCartDrawer(true); // Open the cart drawer
      }
    });

    //* Close cart drawer when either the close button or the overlay is clicked
    [this.drawerClose, this.drawerOverlay].forEach((trigger, index) => {
      if (trigger) {
        const triggerName = index === 0 ? 'Close Button' : 'Overlay';
        trigger.addEventListener("click", (event) => {
          console.log(`🔽 TopCart: ${triggerName} clicked - closing drawer`);
          event.preventDefault(); // Prevent default behavior (e.g., link redirection)
          this.toggleCartDrawer(false); // Close the cart drawer
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
      
      // Get button text for analysis
      const buttonText = submitButton?.textContent?.toLowerCase().trim() || '';
      console.log('🔍 Form submission - button text:', buttonText);
      
      // If button clearly says "Add to Cart", intercept it regardless of other checks
      if (buttonText.includes('add to cart') || buttonText.includes('add to bag')) {
        console.log('🛒 Button says "Add to Cart" - intercepting for TopCart handling');
        // Continue to our form handling
      } else if (this.isVariantSelectionButton(submitButton) || 
          this.isVariantButtonByText(buttonText)) {
        console.log('✋ Variant selection button - allowing default form submission');
        return;
      }

      // Additional checks to make sure this is actually an add to cart we should handle
      const hasVariantInput = form.querySelector('input[name="id"], select[name="id"]');
      if (!hasVariantInput) {
        console.log('No variant input found - not handling this form');
        return;
      }
      
      // Check if this form submission should open a modal instead of adding to cart
      if (this.isQuickAddModalForm(form)) {
        console.log('Quick-add modal form - allowing default behavior');
        return;
      }

      // Prevent default and handle with our cart system
      event.preventDefault();
      event.stopImmediatePropagation(); // Stop other listeners from running
      console.log('🛒 TopCart: Intercepting add to cart form submission');
      console.log('🔍 Form action:', form.action);
      console.log('🔍 Form method:', form.method);
      
      // Store original button state and text to restore later
      const originalButtonText = submitButton?.innerHTML;
      const originalButtonDisabled = submitButton?.disabled;
      const originalButtonClasses = submitButton?.className;
      
      try {
        console.log('⏳ TopCart: Starting form submission handling...');
        await this.handleFormSubmission(form);
        console.log('✅ TopCart: Form submission completed successfully');
        
        // 🔧 RESTORE BUTTON STATE - Prevent "Sold Out" state after successful add
        setTimeout(() => {
          if (submitButton && originalButtonText) {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = originalButtonDisabled;
            submitButton.className = originalButtonClasses;
            console.log('🔄 TopCart: Restored original button state');
          }
        }, 100);
        
      } catch (error) {
        console.error('❌ TopCart form submission failed:', error);
        console.error('Error details:', error.stack);
        
        // Restore button state even on error
        if (submitButton && originalButtonText) {
          submitButton.innerHTML = originalButtonText;
          submitButton.disabled = originalButtonDisabled;
          submitButton.className = originalButtonClasses;
        }
        
        // If our custom handling fails, allow the form to submit normally
        console.log('🔄 TopCart: Falling back to default form submission');
        
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
      
      // Check if this is a quick-add button that should open a modal instead
      if (this.isQuickAddModalButton(clickedElement)) {
        console.log('Quick-add modal button - allowing default behavior');
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
      // First check the button text - if it's clearly "Add to Cart", it's not a variant selector
      const buttonText = element.textContent?.toLowerCase().trim() || '';
      if (buttonText.includes('add to cart') || buttonText.includes('add to bag')) {
        console.log('🔍 Button has "add to cart" text - not a variant selector:', buttonText);
        return false;
      }
      
      // Check if element matches any variant selection selectors
      const matches = element.matches && element.matches(this.variantSelectionSelectors);
      
      // Additional check for parent context - but be more specific
      const parentMatches = element.closest && (
        (element.closest('.quick-add') && element.getAttribute('aria-haspopup')) || // Only quick-add WITH modal popup
        element.closest('modal-opener') ||         // Modal opener container
        element.closest('[data-modal]')            // Modal trigger container
      );
      
      const result = matches || parentMatches;
      
      if (result) {
        console.log('🔍 Identified as variant selection button:', element);
      } else {
        console.log('🔍 NOT a variant selection button - treating as add to cart:', element);
      }
      
      return result;
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

  // 🔍 CHECK if this is a quick-add button that should open a modal
  isQuickAddModalButton(element) {
    if (!element) return false;
    
    // Check if button has modal-related attributes
    const hasModalAttributes = element.hasAttribute('aria-haspopup') || 
                              element.hasAttribute('data-modal') ||
                              element.closest('modal-opener') ||
                              element.closest('[data-modal]');
    
    // Check if it's in a quick-add context but should open modal
    const isQuickAddModal = element.closest('.quick-add') && hasModalAttributes;
    
    return hasModalAttributes || isQuickAddModal;
  }

  // 🔍 CHECK if this form should open a modal instead of adding to cart
  isQuickAddModalForm(form) {
    if (!form) return false;
    
    // Check if form is within a modal-opener or has modal attributes
    const hasModalContext = form.closest('modal-opener') ||
                           form.closest('[data-modal]') ||
                           form.hasAttribute('data-modal');
    
    return hasModalContext;
  }

  // 🧹 CLEAR UI BLOCKING - Remove any overlays or focus traps
  clearUIBlocking() {
    // Remove any theme modal overlays that might be lingering
    document.querySelectorAll('.modal-overlay, .backdrop, .overlay, [data-modal-overlay]').forEach(overlay => {
      if (overlay && overlay !== this.drawerOverlay) {
        overlay.remove();
      }
    });
    
    // Remove aria-hidden from body if set by modals
    document.body.removeAttribute('aria-hidden');
    
    // Reset any focus traps
    document.querySelectorAll('[inert]').forEach(element => {
      element.removeAttribute('inert');
    });
    
    // Comprehensive scroll restoration
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.height = '';
    document.documentElement.style.overflow = '';
    
    // Remove any classes that might be blocking scroll
    document.body.classList.remove('modal-open', 'no-scroll', 'overflow-hidden', 'fixed');
    
    // Force reflow to ensure changes take effect
    document.body.offsetHeight;
    
    console.log('🧹 UI blocking cleared comprehensively');
  }

   //! Toggle the visibility of the cart drawer
   /** 
    * @param {boolean} isOpen - Whether the cart drawer should be open or closed
   */
  async toggleCartDrawer(isOpen) {
    console.log(`🎯 TopCart: toggleCartDrawer called with isOpen=${isOpen}`);
    
    if (isOpen) {
      // Prevent rapid open/close cycles
      if (this.isToggling) {
        console.log('🚫 TopCart: Already toggling, ignoring request');
        return;
      }
      
      this.isToggling = true;
      
      // 🚀 INSTANT MODAL OPENING - Show modal immediately like UpCart
      console.log('🎨 TopCart: Opening modal instantly...');
      
      if (this.cartDrawer) {
        this.cartDrawer.classList.add("open");
        console.log('✅ TopCart: Added "open" class to cart drawer instantly');
      } else {
        console.error('❌ TopCart: Cart drawer element not found!');
      }
      
      document.body.classList.add("top-drawer-open");
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      
      // Load fresh cart data AFTER showing modal
      try {
        console.log('📊 TopCart: Loading cart data in background...');
        await this.getCart();
        this.renderCartContent();
        console.log('✅ TopCart: Cart data loaded and content rendered');
      } catch (error) {
        console.error('❌ TopCart: Failed to load cart data:', error);
      }
      
      console.log('✅ TopCart: Cart Drawer Opened instantly with background loading');
      console.log('🔍 TopCart: Current classes on body:', document.body.className);
      console.log('🔍 TopCart: Current classes on drawer:', this.cartDrawer?.className);
      
      this.isToggling = false;
      
    } else {
      console.log('🔽 TopCart: Closing cart drawer...');
      
      // Remove classes to hide the drawer and restore normal body behavior
      this.cartDrawer?.classList.remove("open");
      document.body.classList.remove("top-drawer-open");
      
      // Restore scrolling completely
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.height = "";
      
      // Clear any inline styles that might be interfering
      if (this.drawerOverlay) {
        this.drawerOverlay.style.display = "";
        this.drawerOverlay.style.opacity = "";
        console.log('✅ TopCart: Overlay styles cleared, relying on CSS');
      }
      
      // Clear any modal-related overlays or focus traps that might be blocking UI
      this.clearUIBlocking();
      
      console.log('✅ TopCart: Cart Drawer Closed');
      console.log('🔍 TopCart: Current classes on body after close:', document.body.className);
      console.log('🔍 TopCart: Current classes on drawer after close:', this.cartDrawer?.className);
      console.log('🔍 TopCart: Body overflow after close:', document.body.style.overflow);
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
            // Allow decreasing to 0 to remove items completely
            const newQuantity = Math.max(0, currentItem.quantity - 1);
            await this.changeLineItem(lineKey, newQuantity);
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
      console.log('📝 TopCart: Processing form submission');
      console.log('📝 Form element:', form);
      
      const formData = new FormData(form);
      
      // Debug: Log all form data
      console.log('📋 TopCart: Form data entries:');
      const formEntries = [];
      for (const [key, value] of formData.entries()) {
        formEntries.push(`${key}: ${value}`);
        console.log(`  ${key}: ${value}`);
      }
      
      if (formEntries.length === 0) {
        console.warn('⚠️ TopCart: No form data found - this might cause issues');
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
      
      console.log('🛒 TopCart: Adding to cart:', cartItem);
      
      // Add to cart using our API with timeout
      console.log('⏳ TopCart: Calling addToCart API...');
      const result = await Promise.race([
        this.addToCart(cartItem),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Add to cart timeout after 10 seconds')), 10000)
        )
      ]);
      console.log('✅ TopCart: Successfully added to cart:', result);
      
      // Update cart count in header
      console.log('🔄 TopCart: Updating cart count...');
      this.updateCartCount();
      
      // Show success message briefly, then open cart drawer
      console.log('🎉 TopCart: Showing success message...');
      this.showAddToCartSuccess();
      
      // Trigger custom event for successful add to cart
      this.triggerCartUpdateEvent('product_added', cartItem);
      
      // Open cart drawer after a brief delay to show success
      // But only if it's not already open from external events
      setTimeout(async () => {
        if (!document.body.classList.contains('top-drawer-open')) {
          console.log('🕒 TopCart: Opening cart drawer after add-to-cart delay...');
          await this.toggleCartDrawer(true);
          console.log('✅ TopCart: Cart drawer opened successfully after add to cart');
        } else {
          console.log('🔍 TopCart: Cart drawer already open, skipping delayed open');
        }
      }, 500);
      
      console.log('TopCart: Add to cart completed successfully');
      
    } catch (error) {
      console.error('TopCart: Handle form submission error:', error);
      throw error;
    }
  }

  //! UPDATE CART COUNT - Update cart icon count in header across all themes
  updateCartCount() {
    if (!this.cartData) return;
    
    const itemCount = this.cartData.item_count || 0;
    
    // 🚀 ENHANCED: Wait for DOM to be fully ready and retry if needed
    const performUpdate = () => {
      // Comprehensive selectors covering most Shopify themes
      const countSelectors = [
        // Standard Dawn and common theme selectors
        '#CartCount span', '#CartCount', '.cart-count', '[data-cart-count]', 
        '.cart-icon-count', '.header-cart-count', '.cart-counter', '.mini-cart-count',
        
        // Additional theme variations discovered via research
        '.cart-count-bubble', '.cart-item-count', '.cart-quantity', '.header-cart-bubble',
        '[data-cart-item-count]', '[data-items-count]', '.count-badge', '.badge-count',
        
        // Theme-specific patterns  
        '.shopify-section-header [data-cart-count]', 'cart-count', 'cart-icon-bubble',
        '.site-header .cart-count', '#mini-cart-count', '.header .cart-count',
        
        // Text-based selectors (items/item in cart)
        '[data-cart-render="item_count"]', '.cart-link [data-cart-count]',
        
        // Liquid template targets
        '#cart-item-count', '.js-cart-item-count', '[data-item-count]',
        
        // 🆕 FIRST LOAD FIX: Additional selectors for initial state
        '.header__icons .cart-count', '.header-item .cart-count',
        '[data-cart-bubble]', '.js-cart-count', '#header-cart-count'
      ];
      
      let updatedElements = 0;
      
      countSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (element) {
            // Update the count
            element.textContent = itemCount;
            
            // 🔧 IMPROVED VISIBILITY LOGIC
            if (itemCount > 0) {
              // Show the counter
              element.style.display = '';
              element.style.visibility = 'visible';
              element.style.opacity = '1';
              element.classList.remove('hidden', 'hide', 'cart-count--hidden');
              element.classList.add('visible', 'cart-count--visible');
            } else {
              // 🆕 HIDE WHEN EMPTY: Follow theme's original behavior
              element.style.display = 'none';
              element.style.visibility = 'hidden';
              element.style.opacity = '0';
              element.classList.add('hidden', 'cart-count--hidden');
              element.classList.remove('visible', 'cart-count--visible');
            }
            
            updatedElements++;
          }
        });
      });
      
      return updatedElements;
    };

    // Try updating immediately
    let updatedElements = performUpdate();
    
    // 🚀 FIRST LOAD FIX: If no elements found, wait for theme initialization
    if (updatedElements === 0) {
      console.log('🔄 No cart counter elements found, retrying after theme initialization...');
      
      // Try again after a short delay for theme to initialize
      setTimeout(() => {
        updatedElements = performUpdate();
        if (updatedElements === 0) {
          // Try one more time after longer delay
          setTimeout(() => {
            updatedElements = performUpdate();
            console.log(`🔄 Final attempt: Updated cart count to ${itemCount} on ${updatedElements} elements`);
          }, 1000);
        } else {
          console.log(`🔄 Retry successful: Updated cart count to ${itemCount} on ${updatedElements} elements`);
        }
      }, 200);
    }
    
    // Also trigger cart count update events that themes might be listening for
    // Mark our events so we don't listen to our own events
    document.dispatchEvent(new CustomEvent('cart:updated', {
      detail: { 
        itemCount: itemCount, 
        cart: this.cartData,
        source: 'topcart' // Mark as our event
      }
    }));
    
    document.dispatchEvent(new CustomEvent('cart-count:updated', {
      detail: { 
        count: itemCount,
        source: 'topcart' // Mark as our event  
      }
    }));
    
    console.log(`🔄 Updated cart count to ${itemCount} on ${updatedElements} elements`);
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

  //! BIND GLOBAL CART EVENTS - Listen for cart changes from any source
  bindGlobalCartEvents() {
    // Listen for successful fetch requests to cart endpoints
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch.apply(window, args);
      
      // Check if this was a cart operation
      if (response.ok && args[0] && typeof args[0] === 'string') {
        const url = args[0];
        if (url.includes('/cart/add.js') || url.includes('/cart/add')) {
          console.log('TopCart: Detected successful cart add via fetch');
          
          // Wait a bit for the operation to complete, then refresh our cart and show modal
          setTimeout(async () => {
            try {
              await this.getCart();
              console.log('TopCart: Cart refreshed after detected add');
              this.triggerCartUpdateEvent('external_add');
              
              // Show the modal
              setTimeout(async () => {
                await this.toggleCartDrawer(true);
                console.log('TopCart: Modal opened after external add');
              }, 300);
            } catch (error) {
              console.error('TopCart: Failed to refresh cart after external add:', error);
            }
          }, 200);
        }
      }
      
      return response;
    };

    // Listen for custom cart events from themes (but ignore our own events)
    document.addEventListener('cart:updated', (event) => {
      // Ignore events that we triggered ourselves
      if (event.detail && event.detail.source === 'topcart') {
        console.log('TopCart: Ignoring our own cart:updated event');
        return;
      }
      console.log('TopCart: Detected external cart:updated event');
      this.handleExternalCartUpdate();
    });

    // Listen for Ajax cart events
    document.addEventListener('ajaxCart:added', () => {
      console.log('TopCart: Detected ajaxCart:added event');
      this.handleExternalCartUpdate();
    });

    // Listen for variant add events
    document.addEventListener('variant:add', () => {
      console.log('TopCart: Detected variant:add event');
      this.handleExternalCartUpdate();
    });

    // Generic cart change listener
    document.addEventListener('cart:change', () => {
      console.log('TopCart: Detected cart:change event');
      this.handleExternalCartUpdate();
    });
  }

  //! HANDLE EXTERNAL CART UPDATE - Refresh cart data when updated externally
  async handleExternalCartUpdate() {
    try {
      await this.getCart();
      this.triggerCartUpdateEvent('external_update');
      
      // Only auto-open modal if it's not already open and not from our own actions
      if (!document.body.classList.contains('top-drawer-open') && !this.isToggling) {
        setTimeout(async () => {
          if (!document.body.classList.contains('top-drawer-open')) {
            await this.toggleCartDrawer(true);
            console.log('TopCart: Modal opened after external cart update');
          }
        }, 400);
      } else {
        console.log('TopCart: Skipping auto-open - modal already open or toggling');
      }
    } catch (error) {
      console.error('TopCart: Failed to handle external cart update:', error);
    }
  }

  //! TRIGGER CART UPDATE EVENT - Dispatch custom events for cart changes
  triggerCartUpdateEvent(eventType, data = {}) {
    const event = new CustomEvent('topcart:updated', {
      detail: {
        type: eventType,
        cart: this.cartData,
        ...data
      },
      bubbles: true
    });
    
    document.dispatchEvent(event);
    console.log(`TopCart: Triggered ${eventType} event`, data);
  }

  //! SHOW ADD TO CART SUCCESS - Brief success indication  
  showAddToCartSuccess() {
    // Create a subtle success indicator
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #198754;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    successMessage.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6L9 17l-5-5"></path>
        </svg>
        <span>Added to cart!</span>
      </div>
    `;
    
    // Add animation styles if not already present
    if (!document.querySelector('#topcart-success-styles')) {
      const styles = document.createElement('style');
      styles.id = 'topcart-success-styles';
      styles.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(styles);
    }
    
    document.body.appendChild(successMessage);
    
    // Remove after 2 seconds
    setTimeout(() => {
      successMessage.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (successMessage.parentNode) {
          successMessage.parentNode.removeChild(successMessage);
        }
      }, 300);
    }, 2000);
  }
}

 // ! Initialize the TopCartDrawer class once the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const topCart = new TopCartDrawer();
  
  // Make TopCart available globally for debugging
  window.TopCart = topCart;
  console.log('🛒 TopCart: Available globally as window.TopCart');
  console.log('🛒 TopCart: Use TopCart.debug() to see current status');
  
  // Add debug method
  topCart.debug = function() {
    console.log('🛒 TopCart Debug Info:');
    console.log('- Cart Data:', this.cartData);
    console.log('- Modal Element:', this.cartDrawer);
    console.log('- Extension Active:', document.body.hasAttribute('data-top-cart-enabled'));
    console.log('- Current Cart Count:', this.cartData?.item_count || 'No cart data');
    console.log('- Available Methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(name => typeof this[name] === 'function'));
  };
  
  // Add form debug method
  topCart.debugForms = function() {
    console.log('🔍 TopCart Form Debug:');
    const cartForms = document.querySelectorAll('form[action*="/cart/add"]');
    console.log(`- Found ${cartForms.length} cart forms`);
    cartForms.forEach((form, index) => {
      console.log(`  Form ${index + 1}:`, form);
      console.log(`    Action: ${form.action}`);
      console.log(`    Method: ${form.method}`);
      console.log(`    Variant Input:`, form.querySelector('input[name="id"], select[name="id"]'));
      console.log(`    Submit Button:`, form.querySelector('[type="submit"]'));
    });
  };
});
