class CartDrawer {
  constructor() {
    // Select the DOM elements for the cart drawer, close button, and overlay
    this.cartDrawer = document.querySelector("#top-cart-drawer");
    this.drawerClose = document.querySelector(".close-drawer-btn");
    this.drawerOverlay = document.querySelector(".top-drawer-overlay");

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
      document.body.classList.add("top-drawer-open");
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      // Remove classes to hide the drawer and restore normal body behavior
      this.cartDrawer?.classList.remove("open");
      document.body.classList.remove("top-drawer-open");
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }
  }
}

 // ! Initialize the CartDrawer class once the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  new CartDrawer();
});
