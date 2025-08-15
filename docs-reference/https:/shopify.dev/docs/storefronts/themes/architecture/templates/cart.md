# Shopify Cart Template Documentation

## Overview

The cart template renders the `/cart` page, which provides an overview of the contents of a customer's cart. The overview is typically shown in a table format with a row for each line item.

> **Tip**: Refer to the cart template, its items section, and its footer section in Dawn for an example implementation.

## Template Location

The cart template is located in the templates directory of the theme:

```
└── theme
  ├── layout
  ├── templates
  |   ...
  |   ├── cart.json
  |   ...
  ...
```

## Template Content Structure

You should include the cart object in your cart template or a section inside of the template.

### The cart Object

You can access the Liquid `cart` object to display the cart details.

> **Note**: If you're using a JSON template, then any HTML or Liquid code needs to be included in a section that's referenced by the template.

## Key Cart Template Features

When working with the cart template, you should familiarize yourself with the following:

- Using cart line items
- Letting customers proceed to checkout from the cart
- Providing an option to remove line items from the cart
- Updating line item quantities
- Showing discounts
- Using cart notes and attributes
- Displaying line item properties in the cart

---

## Cart Line Items

A `line_item` is a single line in a shopping cart that records which variant of a product was added, and the associated quantity. For example, if a customer adds both a size medium and size large of the same t-shirt to their cart, then each t-shirt has its own line item.

### Basic Line Item Loop

The cart template should include a table where each line item has a row:

```liquid
{% for item in cart.items %}
  <!-- line item info -->
{% endfor %}
```

### Complete Line Item Display

```liquid
{% for item in cart.items %}
  <tr class="cart-item">
    <td class="cart-item__media">
      {% if item.image %}
        <img src="{{ item.image | image_url: width: 300 }}" 
             alt="{{ item.image.alt | escape }}" 
             width="150" height="150">
      {% endif %}
    </td>
    
    <td class="cart-item__details">
      <h3 class="cart-item__name">
        <a href="{{ item.url }}">{{ item.product.title }}</a>
      </h3>
      
      {% if item.variant.title != 'Default Title' %}
        <p class="cart-item__variant">{{ item.variant.title }}</p>
      {% endif %}
      
      <p class="cart-item__price">
        {{ item.final_price | money }}
        {% if item.original_price != item.final_price %}
          <s class="cart-item__old-price">{{ item.original_price | money }}</s>
        {% endif %}
      </p>
    </td>
    
    <td class="cart-item__quantity">
      <input type="number" name="updates[]" value="{{ item.quantity }}" min="0">
    </td>
    
    <td class="cart-item__total">
      {{ item.final_line_price | money }}
    </td>
    
    <td class="cart-item__remove">
      <a href="{{ item.url_to_remove }}" class="cart-item__remove-button">
        Remove
      </a>
    </td>
  </tr>
{% endfor %}
```

---

## Proceed to Checkout

To let customers proceed to checkout from the cart, you need to output the cart line items inside a `<form>` element.

### Required Form Structure

```liquid
<form action="{{ routes.cart_url }}" method="post" class="cart-form">
  {% for item in cart.items %}
    <!-- line item info -->
  {% endfor %}

  <input type="submit" name="checkout" value="Checkout" class="cart-checkout-button" />
</form>
```

### Form Requirements

- **Action**: `{{ routes.cart_url }}`
- **Method**: `post`
- **Checkout Input**: `type="submit"` and `name="checkout"`

---

## Remove Line Items from Cart

You should give customers the option to remove a line item from their cart using the `url_to_remove` attribute:

### Basic Remove Link

```liquid
{% for item in cart.items %}
  <!-- line item info -->
  <a href="{{ item.url_to_remove }}">Remove</a>
{% endfor %}
```

### Enhanced Remove Button

```liquid
{% for item in cart.items %}
  <!-- line item info -->
  
  <a href="{{ item.url_to_remove }}" 
     class="cart-item__remove-button"
     data-confirm="Are you sure you want to remove this item?">
    <span class="visually-hidden">Remove {{ item.product.title }}</span>
    <svg aria-hidden="true"><!-- Remove icon --></svg>
  </a>
{% endfor %}
```

> **Tip**: Refer to the Cart API to learn more about changing the cart using JavaScript.

---

## Update Line Item Quantities

You should give customers the option to update line item quantities in their cart.

### Quantity Input

```liquid
{% for item in cart.items %}
  <!-- line item info -->
  <input type="number" 
         name="updates[]" 
         value="{{ item.quantity }}" 
         min="0"
         data-quantity-input
         data-line="{{ forloop.index }}">
{% endfor %}
```

### Update Cart Button

```liquid
<input type="submit" value="Update cart" class="cart-update-button" />
```

### Advanced Quantity Controls

```liquid
{% for item in cart.items %}
  <div class="quantity-selector">
    <button type="button" 
            class="quantity-button quantity-button--minus"
            data-quantity-change="-1"
            data-line="{{ forloop.index }}">
      -
    </button>
    
    <input type="number" 
           name="updates[]" 
           value="{{ item.quantity }}" 
           min="0"
           max="{{ item.variant.inventory_quantity }}"
           class="quantity-input"
           data-quantity-input
           data-line="{{ forloop.index }}">
    
    <button type="button" 
            class="quantity-button quantity-button--plus"
            data-quantity-change="1"
            data-line="{{ forloop.index }}">
      +
    </button>
  </div>
{% endfor %}
```

> **Tip**: Refer to the `/{locale}/cart/update` endpoint of the Cart API to learn more about updating the cart using JavaScript.

---

## Show Cart and Line Item Discounts

Because discounts can apply to an entire cart or to individual line items, you should show discounts with the cart total summary and individual line item displays.

### Line Item Discounts

```liquid
{% for item in cart.items %}
  <div class="cart-item__pricing">
    <!-- Regular price display -->
    <span class="cart-item__price">
      {{ item.final_price | money }}
      {% if item.original_price != item.final_price %}
        <s class="cart-item__original-price">{{ item.original_price | money }}</s>
      {% endif %}
    </span>
    
    <!-- Line item discounts -->
    {% if item.line_level_discount_allocations.size > 0 %}
      <ul class="cart-item__discounts">
        {% for discount_allocation in item.line_level_discount_allocations %}
          <li class="cart-item__discount">
            {{ discount_allocation.discount_application.title }}
            (-{{ discount_allocation.amount | money }})
          </li>
        {% endfor %}
      </ul>
    {% endif %}
  </div>
{% endfor %}
```

### Cart-Level Discounts

```liquid
<div class="cart-summary">
  <div class="cart-summary__subtotal">
    Subtotal: {{ cart.items_subtotal_price | money }}
  </div>
  
  {% if cart.cart_level_discount_applications.size > 0 %}
    {% for discount_application in cart.cart_level_discount_applications %}
      <div class="cart-summary__discount">
        {{ discount_application.title }}: -{{ discount_application.total_allocated_amount | money }}
      </div>
    {% endfor %}
  {% endif %}
  
  <div class="cart-summary__total">
    <strong>Total: {{ cart.total_price | money }}</strong>
  </div>
</div>
```

---

## Support Cart Notes and Attributes

You can give customers the option to include additional information with their order through cart notes and attributes.

### Cart Notes

To capture a cart note, include an HTML input with `name="note"` and `form="cart"`:

```liquid
<div class="cart-note">
  <label for="cart-note">Order notes</label>
  <textarea name="note" 
            id="cart-note"
            form="cart"
            placeholder="Add special instructions for your order...">{{ cart.note }}</textarea>
</div>
```

This value is accessible through the `note` attribute of the cart object: `{{ cart.note }}`

### Cart Attributes

To capture a cart attribute, include an HTML input with `name="attributes[attribute-name]"` and `form="cart"`:

```liquid
<div class="cart-attributes">
  <p class="cart-attribute">
    <label for="favorite-color">Please let us know your favorite color</label>
    <input type="text" 
           name="attributes[Favorite color]" 
           id="favorite-color"
           form="cart" 
           value="{{ cart.attributes['Favorite color'] }}" />
  </p>
  
  <p class="cart-attribute">
    <label for="gift-wrap">
      <input type="checkbox" 
             name="attributes[Gift wrap]" 
             id="gift-wrap"
             form="cart"
             value="Yes"
             {% if cart.attributes['Gift wrap'] == 'Yes' %}checked{% endif %}>
      Add gift wrapping (+$5.00)
    </label>
  </p>
</div>
```

Any values are accessible through the `attributes` attribute of the cart object: `{{ cart.attributes['Favorite color'] }}`

---

## Display Line Item Properties

When items are added to the cart, they can have line item properties included with them. You can display these properties on the cart page by looping through each property:

### Basic Properties Display

```liquid
{% for item in cart.items %}
  <!-- line item info -->

  {% unless item.properties == empty %}
    <div class="cart-item__properties">
      {% for property in item.properties %}
        <div class="cart-item__property">
          <span class="property-name">{{ property.first }}:</span>
          
          {% if property.last contains '/uploads/' %}
            <a href="{{ property.last }}" class="property-file-link">
              {{ property.last | split: '/' | last }}
            </a>
          {% else %}
            <span class="property-value">{{ property.last }}</span>
          {% endif %}
        </div>
      {% endfor %}
    </div>
  {% endunless %}
{% endfor %}
```

### Hide Private Properties

```liquid
{% for item in cart.items %}
  {% unless item.properties == empty %}
    <div class="cart-item__properties">
      {% for property in item.properties %}
        {% assign first_character = property.first | slice: 0 %}
        {% unless first_character == '_' %}
          <div class="cart-item__property">
            <span class="property-name">{{ property.first }}:</span>
            <span class="property-value">{{ property.last }}</span>
          </div>
        {% endunless %}
      {% endfor %}
    </div>
  {% endunless %}
{% endfor %}
```

> **Tip**: If two of the same item are added to the cart, but have unique line item properties, then they'll be split into separate line items.

---

## TopCart-Specific Template Enhancements

### Shipping Protection Display

```liquid
{% comment %} Check for shipping protection in cart attributes {% endcomment %}
{% if cart.attributes.shipping_protection == 'true' %}
  <div class="cart-protection">
    <div class="cart-protection__status">
      <svg class="cart-protection__icon"><!-- Shield icon --></svg>
      <span>Shipping protection added</span>
    </div>
    
    {% if cart.attributes.protection_cost %}
      <div class="cart-protection__cost">
        +{{ cart.attributes.protection_cost | money }}
      </div>
    {% endif %}
  </div>
{% else %}
  <div class="cart-protection-offer">
    <input type="checkbox" 
           name="attributes[shipping_protection]" 
           id="shipping-protection"
           form="cart"
           value="true">
    <label for="shipping-protection">
      Add shipping protection for {{ cart.total_price | times: 0.05 | money }}
    </label>
  </div>
{% endif %}
```

### Add-ons Detection and Display

```liquid
{% assign addon_skus = 'WARRANTY-2Y,SETUP-PRO,PROTECTION-PLUS' | split: ',' %}
{% assign main_products = '' %}
{% assign addon_products = '' %}

{% comment %} Separate main products from add-ons {% endcomment %}
{% for item in cart.items %}
  {% if addon_skus contains item.sku %}
    {% assign addon_products = addon_products | append: item.id | append: ',' %}
  {% else %}
    {% assign main_products = main_products | append: item.id | append: ',' %}
  {% endif %}
{% endfor %}

{% comment %} Display main products {% endcomment %}
<div class="cart-main-items">
  {% for item in cart.items %}
    {% unless addon_skus contains item.sku %}
      <div class="cart-item cart-item--main">
        <!-- Main product display -->
      </div>
    {% endunless %}
  {% endfor %}
</div>

{% comment %} Display add-ons separately {% endcomment %}
{% if addon_products != '' %}
  <div class="cart-addons">
    <h3 class="cart-addons__title">Add-ons & Services</h3>
    {% for item in cart.items %}
      {% if addon_skus contains item.sku %}
        <div class="cart-item cart-item--addon">
          <span class="cart-addon__label">Add-on:</span>
          {{ item.product.title }} - {{ item.final_price | money }}
        </div>
      {% endif %}
    {% endfor %}
  </div>
{% endif %}
```

### Gift Options Integration

```liquid
<div class="cart-gift-options">
  <h3>Gift Options</h3>
  
  <div class="gift-option">
    <input type="checkbox" 
           name="attributes[is_gift]" 
           id="is-gift"
           form="cart"
           value="true"
           {% if cart.attributes.is_gift == 'true' %}checked{% endif %}>
    <label for="is-gift">This is a gift</label>
  </div>
  
  <div class="gift-option gift-option--conditional" 
       style="{% unless cart.attributes.is_gift == 'true' %}display: none;{% endunless %}">
    <label for="gift-message">Gift message:</label>
    <textarea name="attributes[gift_message]" 
              id="gift-message"
              form="cart"
              placeholder="Enter your gift message...">{{ cart.attributes.gift_message }}</textarea>
  </div>
  
  <div class="gift-option">
    <input type="checkbox" 
           name="attributes[gift_wrap]" 
           id="gift-wrap"
           form="cart"
           value="true"
           {% if cart.attributes.gift_wrap == 'true' %}checked{% endif %}>
    <label for="gift-wrap">Add gift wrapping (+$4.99)</label>
  </div>
</div>
```

### Cart Summary with Enhancements

```liquid
<div class="cart-summary">
  <!-- Subtotal -->
  <div class="cart-summary__line">
    <span>Subtotal</span>
    <span>{{ cart.items_subtotal_price | money }}</span>
  </div>
  
  <!-- Shipping protection -->
  {% if cart.attributes.shipping_protection == 'true' and cart.attributes.protection_cost %}
    <div class="cart-summary__line cart-summary__line--protection">
      <span>Shipping Protection</span>
      <span>{{ cart.attributes.protection_cost | money }}</span>
    </div>
  {% endif %}
  
  <!-- Gift wrapping -->
  {% if cart.attributes.gift_wrap == 'true' %}
    <div class="cart-summary__line cart-summary__line--gift">
      <span>Gift Wrapping</span>
      <span>$4.99</span>
    </div>
  {% endif %}
  
  <!-- Discounts -->
  {% if cart.total_discount > 0 %}
    <div class="cart-summary__line cart-summary__line--discount">
      <span>Discount</span>
      <span>-{{ cart.total_discount | money }}</span>
    </div>
  {% endif %}
  
  <!-- Tax estimate -->
  <div class="cart-summary__line cart-summary__line--tax">
    <span>Estimated tax</span>
    <span>Calculated at checkout</span>
  </div>
  
  <!-- Total -->
  <div class="cart-summary__line cart-summary__line--total">
    <span><strong>Total</strong></span>
    <span><strong>{{ cart.total_price | money }}</strong></span>
  </div>
</div>
```

### JavaScript Integration Hooks

```liquid
<script>
  // Cart data for JavaScript
  window.cartData = {
    item_count: {{ cart.item_count | json }},
    total_price: {{ cart.total_price | json }},
    currency: {{ cart.currency | json }},
    attributes: {{ cart.attributes | json }},
    has_shipping_protection: {{ cart.attributes.shipping_protection | json }},
    is_gift: {{ cart.attributes.is_gift | json }},
    items: [
      {% for item in cart.items %}
        {
          id: {{ item.id | json }},
          variant_id: {{ item.variant_id | json }},
          product_id: {{ item.product_id | json }},
          quantity: {{ item.quantity | json }},
          price: {{ item.final_price | json }},
          line_price: {{ item.final_line_price | json }},
          sku: {{ item.sku | json }},
          handle: {{ item.product.handle | json }},
          title: {{ item.product.title | json }},
          variant_title: {{ item.variant.title | json }},
          properties: {{ item.properties | json }}
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ]
  };
</script>
```

## Best Practices for TopCart Templates

### 1. Performance Optimization

- Use `{% liquid %}` tags for complex logic
- Minimize loops and conditions
- Cache expensive operations

### 2. Accessibility

- Include proper ARIA labels
- Use semantic HTML structure
- Ensure keyboard navigation works

### 3. Mobile Responsiveness

- Design mobile-first
- Use appropriate touch targets
- Optimize for smaller screens

### 4. Error Handling

- Show appropriate messages for empty carts
- Handle out-of-stock scenarios
- Provide fallbacks for missing data

### 5. Integration Points

- Add data attributes for JavaScript hooks
- Include structured data for SEO
- Ensure Theme App Extension compatibility

This cart template documentation provides the foundation for creating sophisticated cart pages that integrate seamlessly with TopCart's enhancement features while maintaining compatibility with existing Shopify themes.
