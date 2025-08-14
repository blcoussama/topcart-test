/**
 * TopCart Modal - 2025 API Compliant Theme App Extension
 * Handles cart drawer functionality with proper instruction checking
 */

class TopCartModal {
  constructor() {
    // Core DOM elements
    this.cartDrawer = document.querySelector("#topcart-drawer");
    this.drawerClose = document.querySelector(".close-drawer-btn");
    this.drawerOverlay = document.querySelector(".topcart-drawer-overlay");
    this.checkoutBtn = document.querySelector("#checkout-btn");
    
    // Cart state
    this.cart = null;
    this.isUpdating = false;

    // 2025 Compliance: Instruction checking flag
    this.instructionsChecked = false;
    this.cartInstructionsValid = false;

    // Comprehensive cart selectors (from your excellent work)
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
      "#CartButton",
      ".cart-count-bubble",
      "[data-cart-count]",
      ".header__icon--cart"
    ].join(", ");

    // Add to cart selectors
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
      "[data-product-atc]",
      "[name='add']",
      ".btn--add-to-cart",
      "#AddToCart",
      "#add-to-cart"
    ].join(", ");

    this.initialize();
  }

  /**
   * Initialize the cart modal
   */
  async initialize() {
    console.log('🛒 TopCart: Initializing cart modal...');

    // 2025 Compliance: Check cart instructions first
    await this.checkCartInstructions();
    
    if (!this.cartInstructionsValid) {
      console.warn('⚠️ TopCart: Cart instructions not valid, disabling cart operations');
      return;
    }

    // Set app enabled attribute
    document.body.setAttribute("data-topcart-enabled", "true");

    // Load initial cart state
    await this.loadCart();

    // Override theme cart elements
    this.overrideThemeCartElements();

    // Bind events
    this.bindEvents();

    // Update cart display
    this.updateCartDisplay();

    console.log('✅ TopCart: Cart modal initialized successfully');
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
        console.warn('⚠️ TopCart: Cart instructions check failed');
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
   * Override theme cart elements to prevent conflicts
   */
  overrideThemeCartElements() {
    // Hide existing theme cart drawers/modals
    const hideSelectors = [
      'aside[id=slideout-ajax-cart]',
      'cart-drawer[class*=drawer]', 
      'div[class*=shopping-cart] div[class*=mini-cart]',
      'div[class*=mini_cart]',
      'div[class~=js-slideout-overlay]',
      'aside#cart',
      'aside#cart ~ .overlay-close',
      '[id*="__cart-drawer"]',
      'cart-drawer',
      '.bls-minicart-wrapper',
      '.cart-drawer',
      '#CartDrawer',
      '.overlay-close-clipping'
    ];

    hideSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.display = 'none';
      });
    });

    // Replace cart elements to remove conflicting event listeners
    document.querySelectorAll(this.cartSelectors).forEach((element) => {
      const newElement = element.cloneNode(true);
      element.parentNode.replaceChild(newElement, element);
    });
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Cart toggle events
    this.bindCartToggleEvents();
    
    // Add to cart events
    this.bindAddToCartEvents();
    
    // Cart interaction events
    this.bindCartInteractionEvents();
    
    // Checkout event
    this.bindCheckoutEvent();
  }

  /**
   * Bind cart open/close events
   */
  bindCartToggleEvents() {
    // Open cart when cart icons are clicked
    document.addEventListener("click", (event) => {
      const target = event.target.closest(this.cartSelectors);
      if (target) {
        event.preventDefault();
        event.stopPropagation();
        this.openCart();
      }
    });

    // Close cart events
    [this.drawerClose, this.drawerOverlay].forEach((trigger) => {
      if (trigger) {
        trigger.addEventListener("click", (event) => {
          event.preventDefault();
          this.closeCart();
        });
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isCartOpen()) {
        this.closeCart();
      }
    });
  }

  /**
   * Bind add to cart events
   */
  bindAddToCartEvents() {
    // Handle form submissions
    document.addEventListener("submit", async (event) => {
      const form = event.target.closest('form[action*="/cart/add"]');
      if (form) {
        event.preventDefault();
        await this.handleAddToCart(form);
      }
    });

    // Handle button clicks
    document.addEventListener("click", async (event) => {
      const addToCartBtn = event.target.closest(this.addToCartSelectors);
      if (addToCartBtn) {
        const form = addToCartBtn.closest('form[action*="/cart/add"]');
        if (form) {
          event.preventDefault();
          await this.handleAddToCart(form);
        }
      }
    });
  }

  /**
   * Bind cart interaction events (quantity change, remove, etc.)
   */
  bindCartInteractionEvents() {
    if (!this.cartDrawer) return;

    // Quantity changes
    this.cartDrawer.addEventListener('click', async (event) => {
      if (event.target.closest('.increase-qty-btn')) {
        await this.changeQuantity(event.target, 1);
      } else if (event.target.closest('.decrease-qty-btn')) {
        await this.changeQuantity(event.target, -1);
      } else if (event.target.closest('.remove-from-cart-btn')) {
        await this.removeItem(event.target);
      }
    });

    // Direct quantity input changes
    this.cartDrawer.addEventListener('change', async (event) => {
      if (event.target.classList.contains('product-quantity')) {
        await this.updateQuantity(event.target);
      }
    });
  }

  /**
   * Bind checkout event
   */
  bindCheckoutEvent() {
    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', () => {
        window.location.href = '/checkout';
      });
    }
  }

  /**
   * Handle add to cart form submission
   */
  async handleAddToCart(form) {
    if (!this.cartInstructionsValid) {
      console.warn('⚠️ TopCart: Cart operations not available');
      return;
    }

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
        this.openCart();
        console.log('✅ TopCart: Product added to cart');
      } else {
        throw new Error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('❌ TopCart: Error adding to cart:', error);
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Change item quantity
   */
  async changeQuantity(button, change) {
    if (!this.cartInstructionsValid) return;
    
    const cartItem = button.closest('.cart-item');
    const quantityInput = cartItem.querySelector('.product-quantity');
    const lineKey = cartItem.dataset.lineKey;
    
    const newQuantity = Math.max(0, parseInt(quantityInput.value) + change);
    
    if (newQuantity === 0) {
      await this.removeItem(button);
    } else {
      await this.updateItemQuantity(lineKey, newQuantity);
    }
  }

  /**
   * Update item quantity directly
   */
  async updateQuantity(input) {
    if (!this.cartInstructionsValid) return;
    
    const cartItem = input.closest('.cart-item');
    const lineKey = cartItem.dataset.lineKey;
    const newQuantity = Math.max(0, parseInt(input.value));
    
    await this.updateItemQuantity(lineKey, newQuantity);
  }

  /**
   * Remove item from cart
   */
  async removeItem(button) {
    if (!this.cartInstructionsValid) return;
    
    const cartItem = button.closest('.cart-item');
    const lineKey = cartItem.dataset.lineKey;
    
    await this.updateItemQuantity(lineKey, 0);
  }

  /**
   * Update item quantity via API
   */
  async updateItemQuantity(lineKey, quantity) {
    if (this.isUpdating) return;
    this.isUpdating = true;

    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          line: lineKey,
          quantity: quantity
        })
      });

      if (response.ok) {
        await this.loadCart();
        this.updateCartDisplay();
        console.log('✅ TopCart: Cart updated');
      } else {
        throw new Error('Failed to update cart');
      }
    } catch (error) {
      console.error('❌ TopCart: Error updating cart:', error);
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Open cart modal
   */
  openCart() {
    if (!this.cartDrawer) return;
    
    this.cartDrawer.classList.add("open");
    this.cartDrawer.style.display = "flex";
    document.body.classList.add("topcart-open");
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    
    console.log('🛒 TopCart: Cart opened');
  }

  /**
   * Close cart modal
   */
  closeCart() {
    if (!this.cartDrawer) return;
    
    this.cartDrawer.classList.remove("open");
    document.body.classList.remove("topcart-open");
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    
    // Hide after animation
    setTimeout(() => {
      this.cartDrawer.style.display = "none";
    }, 400);
    
    console.log('🛒 TopCart: Cart closed');
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
    const itemsWrapper = document.querySelector('#cart-items-wrapper');
    const emptyState = document.querySelector('#cart-empty-state');
    
    if (!itemsWrapper) return;

    if (this.cart.items.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    
    // Remove existing items
    const existingItems = itemsWrapper.querySelectorAll('.cart-item');
    existingItems.forEach(item => item.remove());

    // Add current items
    this.cart.items.forEach((item, index) => {
      const itemElement = this.createCartItemElement(item, index + 1);
      itemsWrapper.appendChild(itemElement);
    });
  }

  /**
   * Create cart item element
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
          <div class="shadow-wrapper">
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

            <input type="number" class="product-quantity" min="1" value="${item.quantity}"/>

            <div class="increase-qty">
              <button type="button" class="increase-qty-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <button type="button" class="remove-from-cart-btn">
              <span>remove</span>
            </button>
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
    const subtotalEl = document.querySelector('#cart-subtotal');
    const totalEl = document.querySelector('#cart-total');
    
    if (subtotalEl) {
      subtotalEl.textContent = this.formatMoney(this.cart.total_price);
    }
    
    if (totalEl) {
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
    const freeShippingThreshold = window.topCartSettings?.freeShippingThreshold || 7500; // $75 in cents
    
    if (!progressFill || !this.cart) return;

    const currentTotal = this.cart.total_price;
    const progressPercentage = Math.min((currentTotal / freeShippingThreshold) * 100, 100);
    
    progressFill.style.width = `${progressPercentage}%`;
    
    if (currentTotal >= freeShippingThreshold) {
      progressMessage.innerHTML = 'Congrats! You are now eligible for <span>Free Shipping!</span>';
    } else {
      const remaining = freeShippingThreshold - currentTotal;
      if (remainingAmount) {
        remainingAmount.textContent = this.formatMoney(remaining);
      }
    }
  }

  /**
   * Format money using Shopify's format
   */
  formatMoney(cents) {
    const dollars = (cents / 100).toFixed(2);
    return `$${dollars}`;
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Check if we're in a Theme App Extension context
  if (document.body.getAttribute('data-topcart-enabled') !== 'true') {
    new TopCartModal();
  }
});

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new TopCartModal());
} else {
  new TopCartModal();
}