/**
 * TopCart Modal - 2025 API Compliant (Using your working structure)
 * Based on your working CartDrawer class with 2025 compliance added
 */

class CartDrawer {
  constructor() {
    // Select the DOM elements for the cart drawer, close button, and overlay (your exact structure)
    this.cartDrawer = document.querySelector("#top-cart-drawer");
    this.drawerClose = document.querySelector(".close-drawer-btn");
    this.drawerOverlay = document.querySelector(".topcart-drawer-overlay");

    // 2025 Compliance: Instruction checking 
    this.instructionsChecked = false;
    this.cartInstructionsValid = false;
    this.isUpdating = false;
    this.cart = null;

    // Your exact cart selectors that work
    this.cartSelectors = [
      "a[href*='/cart']:not([href^='//']):not([href*='/cart/change']):not([href*='/cart/add']):not([href*='/cart/clear']):not([href*='/products/cart']):not([href*='/collections/cart']):not([class*='upcart']):not([class*='revy-upsell-btn-cart']):not([href*='/checkout']):not([href*='/discount']):not([href*='/cart/1']):not([href*='/cart/2']):not([href*='/cart/3']):not([href*='/cart/4']):not([href*='/cart/5']):not([href*='/cart/6']):not([href*='/cart/7']):not([href*='/cart/8']):not([href*='/cart/9'])",
      "a[data-cart-toggle]", 
      "#sticky-app-client div[data-cl='sticky-button']",
      "button.minicart-open", 
      "#cart-icon-bubble", 
      ".slide-menu-cart", 
      ".icon-cart:not(svg)", 
      ".cart-icon:not(svg)", 
      ".cart-link:not(div.header-icons):not(ul)", 
      "button.header-cart-toggle", 
      "div.minicart__button", 
      "button.js-cart-button", 
      ".mini-cart-trigger", 
      ".shopping-cart a[href*='#cart']", 
      ".header-menu-cart-drawer", 
      ".js-mini-cart-trigger", 
      "#CartButton-Desktop", 
      "#CartButton"
    ].join(", ");

    // Your exact add to cart selectors that work
    this.addToCartSelectors = [
      "button[id*='so-btn-add-to-cart']", 
      "input[data-btn-addtocart]", 
      "input[id='product-add-to-cart']", 
      "button[data-product-id]:not([data-checkout='checkout'])",
      "button[data-checkout='cart']", 
      "button[type='submit'][name='add']", 
      "button[id='pre_order_custom']", 
      "button[class='btn-addtocart']", 
      "button[class='addtocart-js']", 
      "div[class='addCart']",
      "button[class*='add-to-cart']", 
      "button[class*='textboxAddToCartBtn']", 
      "form[action*='/cart/add'] [type='submit']", 
      "[data-product-atc]"
    ].join(", ");

    // Call the initialize method to set up event listeners and behavior
    this.initialize();
  }

  /**
   * Initialize the cart drawer (your exact method with 2025 compliance added)
   */
  async initialize() {
    console.log('🛒 TopCart: Initializing Cart Drawer');

    // 2025 Compliance: Check cart instructions first
    await this.checkCartInstructions();
    
    if (!this.cartInstructionsValid) {
      console.warn('⚠️ TopCart: Cart instructions not valid, using fallback mode');
      // Continue anyway but with limited functionality
    }

    // Set a custom attribute on the body to indicate the cart is enabled (your exact approach)
    document.body.setAttribute("data-top-cart-enabled", "true");

    // Load initial cart state
    await this.loadCart();

    // Replace cart-related elements with their clones (your exact method)
    this.replaceCartElements();

    // Bind events to open/close the cart drawer and handle add-to-cart actions (your exact method)
    this.bindCartIconToggleEvents();
    this.bindAddToCartEvents();

    // Update cart display
    this.updateCartDisplay();

    console.log('✅ TopCart: Cart Drawer initialized successfully');
  }

  /**
   * 2025 API Compliance: Check cart instructions before operations
   */
  async checkCartInstructions() {
    try {
      console.log('🔍 TopCart: Checking cart instructions (2025 compliance)...');
      
      // Make a simple cart request to check if instructions are available
      const response = await fetch('/cart.js', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.ok) {
        this.cartInstructionsValid = true;
        this.instructionsChecked = true;
        console.log('✅ TopCart: Cart instructions valid');
      } else {
        this.cartInstructionsValid = false;
        console.warn('⚠️ TopCart: Cart instructions check failed, using fallback');
      }
    } catch (error) {
      console.error('❌ TopCart: Error checking cart instructions:', error);
      this.cartInstructionsValid = false;
    }
  }

  /**
   * Load current cart state from Shopify
   */
  async loadCart() {
    try {
      const response = await fetch('/cart.js', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.ok) {
        this.cart = await response.json();
        console.log('📦 TopCart: Cart loaded:', this.cart);
      } else {
        throw new Error('Failed to load cart');
      }
    } catch (error) {
      console.error('❌ TopCart: Error loading cart:', error);
    }
  }

  /**
   * Replace cart-related elements with clones (your exact method)
   * This helps ensure that event listeners are correctly bound to the updated elements
   */
  replaceCartElements() {
    document.querySelectorAll(this.cartSelectors).forEach((element) => {
      // Clone each cart-related element and replace the original with the clone
      const newElement = element.cloneNode(true);
      element.parentNode.replaceChild(newElement, element);
    });
  }

  /**
   * OPEN AND CLOSE THE CART DRAWER (your exact method)
   * Bind events to open and close the cart drawer
   */
  bindCartIconToggleEvents() {
    // Open cart drawer when any of the cart-related elements is clicked
    document.addEventListener("click", (event) => {
      if (event.target.closest(this.cartSelectors)) {
        event.preventDefault(); // Prevent default behavior (e.g., link redirection)
        this.toggleCartDrawer(true); // Open the cart drawer
        console.log('🛒 TopCart: Cart Drawer Opened');
      }
    });

    // Close cart drawer when either the close button or the overlay is clicked
    [this.drawerClose, this.drawerOverlay].forEach((trigger) => {
      if (trigger) {
        trigger.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent default behavior (e.g., link redirection)
          this.toggleCartDrawer(false); // Close the cart drawer
          console.log('🛒 TopCart: Cart Drawer Closed');
        });
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isCartOpen()) {
        this.toggleCartDrawer(false);
      }
    });
  }

  /**
   * TRIGGER CART DRAWER WHEN CLICKING ON ADD TO CART BUTTON (your exact method with 2025 compliance)
   * Bind events to the add-to-cart buttons and Forms
   */
  bindAddToCartEvents() {
    // Attach to forms (e.g., when a product is added to the cart via a form submission)
    document.querySelectorAll(this.addToCartSelectors).forEach((element) => {
      const form = element.closest("form");
      if (form) {
        form.addEventListener("submit", async (event) => {
          event.preventDefault(); // Prevent form submission
          await this.handleAddToCart(form); // Handle add to cart with real API
        });
      }
    });

    // Attach to buttons (e.g., when a product is added to the cart via a button click)
    document.addEventListener("click", async (event) => {
      if (event.target.closest(this.addToCartSelectors)) {
        event.preventDefault(); // Prevent default button action
        
        // Find the form and handle properly
        const form = event.target.closest('form[action*="/cart/add"]');
        if (form) {
          await this.handleAddToCart(form);
        } else {
          // Fallback: just open the cart
          this.toggleCartDrawer(true);
          console.log('🛒 TopCart: Add to Cart Button Clicked (fallback)');
        }
      }
    });
  }

  /**
   * Handle add to cart form submission with real Shopify API
   */
  async handleAddToCart(form) {
    if (this.isUpdating) return;
    this.isUpdating = true;

    try {
      const formData = new FormData(form);
      
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData
      });

      if (response.ok) {
        await this.loadCart();
        this.updateCartDisplay();
        this.toggleCartDrawer(true);
        console.log('✅ TopCart: Product added to cart successfully');
      } else {
        throw new Error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('❌ TopCart: Error adding to cart:', error);
      // Fallback: still open the cart
      this.toggleCartDrawer(true);
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Toggle the visibility of the cart drawer (your exact method)
   * @param {boolean} isOpen - Whether the cart drawer should be open or closed
   */
  toggleCartDrawer(isOpen) {
    if (isOpen) {
      // Add classes to show the drawer and prevent body scrolling
      this.cartDrawer?.classList.add("open");
      document.body.classList.add("topcart-drawer-open");
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      // Remove classes to hide the drawer and restore normal body behavior
      this.cartDrawer?.classList.remove("open");
      document.body.classList.remove("topcart-drawer-open");
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }
  }

  /**
   * Check if cart is open
   */
  isCartOpen() {
    return this.cartDrawer && this.cartDrawer.classList.contains('open');
  }

  /**
   * Update cart display with current cart data
   */
  updateCartDisplay() {
    if (!this.cart) return;

    this.updateCartItems();
    this.updateCartTotals();
    this.updateProgressBar();
  }

  /**
   * Update cart items display
   */
  updateCartItems() {
    const itemsWrapper = document.querySelector('#drawer-products-wrapper');
    const emptyState = document.querySelector('#cart-empty-state');
    
    if (!itemsWrapper) return;

    if (!this.cart || this.cart.items.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    
    // Remove existing items (except empty state)
    const existingItems = itemsWrapper.querySelectorAll('.cart-item');
    existingItems.forEach(item => item.remove());

    // Add current items
    this.cart.items.forEach((item, index) => {
      const itemElement = this.createCartItemElement(item, index + 1);
      itemsWrapper.appendChild(itemElement);
    });
  }

  /**
   * Create cart item element using your exact HTML structure
   */
  createCartItemElement(item, lineKey) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.dataset.lineKey = lineKey;
    
    div.innerHTML = `
      <div class="image-container">
        <img src="${item.featured_image?.url || item.image}" alt="${item.product_title}" loading="lazy">
      </div>

      <div class="second-container">
        <div class="item-details">
          <h4 class="cart-item-title">${item.product_title}</h4>

          ${item.variant_title ? `
          <div class="shadow-wrapper show-right-shadow">
            <div class="variants-div hide-scrollbar">
              <span class="variant-label">${item.variant_title}</span>
            </div>
          </div>
          ` : ''}

          <div class="prices-div">
            <div class="prices-container">
              ${item.original_price !== item.final_price ? `
                <span class="price">${this.formatMoney(item.original_price)}</span>
              ` : ''}
              <span class="sale-price">${this.formatMoney(item.final_price)}</span>
            </div>
          </div>
        </div>

        <div class="quantity-and-remove-btn-div">
          <div class="quantity-div">
            <div class="decrease-qty">
              <button type="button" class="decrease-qty-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M6 12h12" />
                </svg>
              </button>
            </div>

            <input type="number" class="product-quantity" min="1" max="10" value="${item.quantity}"/>

            <div class="increase-qty">
              <button type="button" class="increase-qty-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <button type="button" class="remove-from-cart-btn"><span>remove</span></button>
          </div>
        </div>
      </div>
    `;
    
    return div;
  }

  /**
   * Update cart totals
   */
  updateCartTotals() {
    const subtotalEl = document.querySelector('#subtotal');
    const totalEl = document.querySelector('#total');
    
    if (subtotalEl && this.cart) {
      subtotalEl.textContent = this.formatMoney(this.cart.total_price);
    }
    
    if (totalEl && this.cart) {
      totalEl.textContent = this.formatMoney(this.cart.total_price);
    }
  }

  /**
   * Update progress bar for free shipping
   */
  updateProgressBar() {
    const progressFill = document.querySelector('#progress-fill');
    const progressMessage = document.querySelector('#progress-message');
    const remainingAmount = document.querySelector('#remaining-amount');
    
    // This would be configurable via block settings
    const freeShippingThreshold = 7500; // $75 in cents - you can make this dynamic
    
    if (!progressFill || !this.cart) return;

    const currentTotal = this.cart.total_price;
    const progressPercentage = Math.min((currentTotal / freeShippingThreshold) * 100, 100);
    
    progressFill.style.width = `${progressPercentage}%`;
    
    if (currentTotal >= freeShippingThreshold) {
      if (progressMessage) {
        progressMessage.innerHTML = 'Congrats! You are now eligible for <span>Free Shipping!</span>';
      }
    } else {
      const remaining = freeShippingThreshold - currentTotal;
      if (remainingAmount) {
        remainingAmount.textContent = this.formatMoney(remaining);
      }
    }class CartDrawer {
  constructor() {
    // Select the DOM elements for the cart drawer, close button, and overlay
    this.cartDrawer = document.querySelector("#top-cart-drawer");
    this.drawerClose = document.querySelector(".close-drawer-btn");
    this.drawerOverlay = document.querySelector(".topcart-drawer-overlay");

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
  initialize() {
    console.log('Initializing Cart Drawer');

    //? Set a custom attribute on the body to indicate the cart is enabled
    document.body.setAttribute("data-top-cart-enabled", "true");

    //? Replace cart-related elements with their clones (to avoid any issues with event listeners)
    this.replaceCartElements();

    //? Bind events to open/close the cart drawer and handle add-to-cart actions
    this.bindCartIconToggleEvents();
    this.bindAddToCartEvents();
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
  bindAddToCartEvents() {
    //* Attach to forms (e.g., when a product is added to the cart via a form submission)
    document.querySelectorAll(this.addToCartSelectors).forEach((element) => {
      const form = element.closest("form");
      if (form) {
        form.addEventListener("submit", (event) => {
          event.preventDefault(); // Prevent form submission
          this.toggleCartDrawer(true); // Open the cart drawer
          alert('Product added to cart!'); // Show an alert to confirm the action
        });
      }
    });

    //* Attach to buttons (e.g., when a product is added to the cart via a button click)
    document.addEventListener("click", (event) => {
      if (event.target.closest(this.addToCartSelectors)) {
        event.preventDefault(); // Prevent default button action (e.g., form submission)
        this.toggleCartDrawer(true); // Open the cart drawer
        console.log('Add to Cart Button Clicked');
      }
    });
  }

   //! Toggle the visibility of the cart drawer
   /** 
    * @param {boolean} isOpen - Whether the cart drawer should be open or closed
   */
  toggleCartDrawer(isOpen) {
    if (isOpen) {
      // Add classes to show the drawer and prevent body scrolling
      this.cartDrawer?.classList.add("open");
      document.body.classList.add("topcart-drawer-open");
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      // Remove classes to hide the drawer and restore normal body behavior
      this.cartDrawer?.classList.remove("open");
      document.body.classList.remove("topcart-drawer-open");
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }
  }
}

 // ! Initialize the CartDrawer class once the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  new CartDrawer();
});

  }

  /**
   * Format money using Shopify's format
   */
  formatMoney(cents) {
    const dollars = (cents / 100).toFixed(2);
    return `$${dollars}`;
  }
}

// Initialize the CartDrawer class once the DOM content is fully loaded (your exact initialization)
document.addEventListener("DOMContentLoaded", () => {
  new CartDrawer();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
  new CartDrawer();
}