# Shopify Cart API Reference Documentation

## Overview

The Cart API is used to interact with a cart during a customer's session. This guide shows how to use the Cart API to update cart line items, add cart attributes and notes, and generate shipping rates.

All Ajax API requests should use locale-aware URLs to give visitors a consistent experience.

> **Note**: For simplicity, the code examples in this guide don't always use a callback.

## API Endpoints

### Base URL Pattern

```
/{locale}/cart/[endpoint]
```

All monetary properties are returned in the customer's presentment currency. To check the customer's presentment currency, you can use the `currency` field in the response.

---

## POST /{locale}/cart/add.js

Use the `POST /{locale}/cart/add.js` endpoint to add one or multiple variants to the cart.

### Basic Add to Cart

```javascript
let formData = {
  'items': [{
    'id': 36110175633573,
    'quantity': 2
  }]
};

fetch(window.Shopify.routes.root + 'cart/add.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(formData)
})
.then(response => {
  return response.json();
})
.catch((error) => {
  console.error('Error:', error);
});
```

### Alternative: Using FormData

```javascript
let addToCartForm = document.querySelector('form[action$="/cart/add"]');
let formData = new FormData(addToCartForm);

fetch(window.Shopify.routes.root + 'cart/add.js', {
  method: 'POST',
  body: formData
})
.then(response => {
  return response.json();
})
.catch((error) => {
  console.error('Error:', error);
});
```

### Response Format

```json
{
  "items": [
    {
      "id": 36110175633573,
      "title": "Red Rain Coat - Small",
      "key": "794864229:03af7a8cb59a4c3c45595c76fa8cb53c",
      "price": 12900,
      "line_price": 12900,
      "quantity": 2,
      "sku": null,
      "grams": 0,
      "vendor": "Shopify",
      "properties": {},
      "variant_id": 794864229,
      "gift_card": false,
      "url": "/products/red-rain-coat?variant=794864229",
      "featured_image": {
        "url": "http://cdn.shopify.com/s/files/1/0040/7092/products/red-rain-coat.jpeg?v=1402604893",
        "aspect_ratio": 1.0,
        "alt": "Red rain coat with a hood"
      },
      "image": "http://cdn.shopify.com/s/files/1/0040/7092/products/red-rain-coat.jpeg?v=1402604893",
      "handle": "red-rain-coat",
      "requires_shipping": true,
      "product_title": "Red Rain Coat",
      "product_description": "A bright red rain coat for rainy days!",
      "product_type": "Coat",
      "properties": null,
      "variant_title": "Red",
      "variant_options": ["Red"],
      "options_with_values": [
        {
          "name": "Color",
          "value": "Red"
        }
      ]
    }
  ]
}
```

### Adding Line Item Properties

```javascript
let items = [
  {
    quantity: 1,
    id: 794864229,
    properties: {
      'First name': 'Caroline'
    }
  }
];
```

### Adding with Selling Plan

```javascript
let items = [
  {
    quantity: 1,
    id: 794864229,
    selling_plan: 183638
  }
];
```

### Error Responses

#### Insufficient Stock

```json
{
  "status": 422,
  "message": "Cart Error",
  "description": "You can't add more #{item.name} to the cart."
}
```

#### Sold Out

```json
{
  "status": 422,
  "message": "Cart Error",
  "description": "The product '#{item.name}' is already sold out."
}
```

---

## GET /{locale}/cart.js

Use the `GET /{locale}/cart.js` endpoint to get the cart as JSON.

### Example Response (Cart with Items)

```json
{
  "token": "Z2NwLXVzLXdlc3QxOjAxSjBQTVk1Sjc5NVFKTjNOVlhLWENXQUI1?key=0d9909213054e22d092152de385763f0",
  "note": "Hello!",
  "attributes": {
    "Gift wrap": "Yes"
  },
  "original_total_price": 3399,
  "total_price": 2925,
  "total_discount": 474,
  "total_weight": 500,
  "item_count": 2,
  "items": [
    {
      "id": 39897499729985,
      "properties": {},
      "quantity": 1,
      "variant_id": 39897499729985,
      "key": "39897499729985:b1fca88d0e8bf5290f306f808785f744",
      "title": "Health potion - S / Low",
      "price": 900,
      "original_price": 900,
      "discounted_price": 900,
      "line_price": 900,
      "original_line_price": 900,
      "total_discount": 0,
      "discounts": [],
      "sku": "",
      "grams": 500,
      "vendor": "Polina's Potent Potions",
      "taxable": true,
      "product_id": 6786188247105,
      "product_has_only_default_variant": false,
      "gift_card": false,
      "final_price": 900,
      "final_line_price": 900,
      "url": "/products/health-potion?selling_plan=610435137&variant=39897499729985"
    }
  ]
}
```

### Example Response (Empty Cart)

```json
{
  "token": "Z2NwLXVzLXdlc3QxOjAxSjBQTVk1Sjc5NVFKTjNOVlhLWENXQUI1?key=0d9909213054e22d092152de385763f0",
  "note": null,
  "attributes": {},
  "original_total_price": 0,
  "total_price": 0,
  "total_discount": 0,
  "total_weight": 0,
  "item_count": 0,
  "items": [],
  "requires_shipping": false,
  "currency": "CAD",
  "items_subtotal_price": 0,
  "cart_level_discount_applications": []
}
```

---

## POST /{locale}/cart/update.js

Use the `POST /{locale}/cart/update.js` endpoint to update the cart's line item quantities, note, or attributes.

### Update Line Item Quantities

```javascript
let updates = {
  794864053: 2,
  794864233: 3
};

fetch(window.Shopify.routes.root + 'cart/update.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ updates })
})
.then(response => {
  return response.json();
})
.catch((error) => {
  console.error('Error:', error);
});
```

### Alternative: Using FormData

```javascript
var formData = new FormData();
formData.append("updates[794864053]", 2);
formData.append("updates[794864233]", 3);

fetch(window.Shopify.routes.root + 'cart/update.js', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### Remove Items (Set Quantity to 0)

```javascript
let updates = {
  794864053: 0,
  794864233: 0
};

fetch(window.Shopify.routes.root + 'cart/update.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ updates })
})
.then(response => {
  return response.json();
})
.catch((error) => {
  console.error('Error:', error);
});
```

### Update Using Array (Position-based)

```javascript
fetch(window.Shopify.routes.root + 'cart/update.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ updates: [3, 2, 1] })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Update Cart Note

```json
{
  "note": "This is a note about my order"
}
```

### Update Cart Attributes

```json
{
  "attributes": {
    "Gift wrap": "Yes"
  }
}
```

### Update Discounts

```json
{
  "discount": "discount_code"
}
```

#### Multiple Discounts

```json
{
  "discount": "discount_code,discount_code2"
}
```

#### Remove All Discounts

```json
{
  "discount": ""
}
```

### Error Responses

```json
{
  "status": 404,
  "message": "Cart Error",
  "description": "Cannot find variant"
}
```

> **Caution**: The update.js endpoint doesn't validate the quantity on variants that are already in the cart. This means that it's possible to add more inventory than is available.

---

## POST /{locale}/cart/change.js

Use the `/{locale}/cart/change.js` endpoint to change the quantity, properties, and selling_plan properties of a cart line item. Only items already in your cart can be changed, and you can change only one line item at a time.

### Identify Line Item

#### Using Variant ID

```json
{
  "id": 794864053,
  "quantity": 3
}
```

#### Using Line Item Key

```json
{
  "id": "794864053:b1fca88d0e8bf5290f306f808785f744",
  "quantity": 3
}
```

#### Using Line Position (1-based)

```json
{
  "line": 1,
  "quantity": 3
}
```

### Update Properties

```json
{
  "line": 2,
  "properties": { 
    "gift_wrap": true 
  }
}
```

> **Note**: When a POST request includes properties, it overwrites the entire properties object. Any existing key-value pairs are erased.

### Update Selling Plans

#### Add Selling Plan

```json
{
  "line": 2,
  "quantity": 2,
  "selling_plan": 183638
}
```

#### Remove Selling Plan

```json
{
  "line": 2,
  "quantity": 2,
  "selling_plan": null
}
```

### Error Response

```json
{
  "status": "bad_request",
  "message": "no valid id or line parameter",
  "description": "no valid id or line parameter"
}
```

---

## POST /{locale}/cart/clear.js

Use the `POST /{locale}/cart/clear.js` endpoint to set all quantities of all line items in the cart to zero.

### Response

```json
{
  "token": "Z2NwLXVzLXdlc3QxOjAxSjBQTVk1Sjc5NVFKTjNOVlhLWENXQUI1?key=0d9909213054e22d092152de385763f0",
  "note": null,
  "attributes": {},
  "total_price": 0,
  "total_weight": 0,
  "item_count": 0,
  "items": [],
  "requires_shipping": false
}
```

> **Note**: This does not remove cart attributes or the cart note.

---

## Shipping Rates

### POST /{locale}/cart/prepare_shipping_rates.json

Initiates the process of calculating shipping rates for the cart given a destination.

```
/{locale}/cart/prepare_shipping_rates.json?shipping_address%5Bzip%5D=K1N+5T2&shipping_address%5Bcountry%5D=Canada&shipping_address%5Bprovince%5D=Ontario
```

**Response:** `null`

### GET /{locale}/cart/async_shipping_rates.json

Returns the shipping rates results if the calculations have finished.

```
/{locale}/cart/async_shipping_rates.json?shipping_address%5Bzip%5D=K1N+5T2&shipping_address%5Bcountry%5D=Canada&shipping_address%5Bprovince%5D=Ontario
```

#### Response

```json
{
  "shipping_rates": [
    {
      "name": "Generic Rate",
      "presentment_name": "Generic Rate", 
      "code": "Generic Rate",
      "price": "6.00",
      "markup": null,
      "source": "shopify",
      "delivery_date": null,
      "delivery_range": null,
      "delivery_days": [],
      "compare_price": null,
      "phone_required": false,
      "currency": null,
      "carrier_identifier": null,
      "delivery_category": null,
      "using_merchant_account": null,
      "carrier_service_id": null,
      "description": null,
      "api_client_id": null,
      "requested_fulfillment_service_id": null,
      "shipment_options": null,
      "charge_items": null,
      "has_restrictions": null,
      "rating_classification": null,
      "accepts_instructions": false
    }
  ]
}
```

### GET /{locale}/cart/shipping_rates.json

Alternative method to get estimated shipping rates (subject to throttling).

```
/{locale}/cart/shipping_rates.json?shipping_address%5Bzip%5D=K1N+5T2&shipping_address%5Bcountry%5D=Canada&shipping_address%5Bprovince%5D=Ontario
```

---

## Private Properties and Attributes

### Private Line Item Properties

To make a line item property private, prepend an underscore (`_`) to the key:

```javascript
items: [
  {
    'quantity': 2,
    'id': 794864229,
    'properties': {
      '_foo': 'bar'
    }
  }
]
```

#### Mixed Properties

```javascript
items: [
  {
    quantity: 2,
    id: 794864229,
    properties: {
      '_foo': 'bar',         // Private
      'gift_wrap': true      // Public
    }
  }
]
```

#### Hide Private Properties in Theme

```liquid
{% for property in line_item.properties %}
  {% assign first_character_in_key = property.first | slice: 0 %}
  {% unless first_character_in_key == '_' %}
    {{ property.first }}: {{ property.last }}
  {% endunless %}
{% endfor %}
```

### Private Cart Attributes

To make a cart attribute private, append a double underscore (`__`) to an attribute name.

Private cart attributes are not available in the Liquid `cart.attributes` object or the Ajax API, so no code modification is required to hide them.

---

## Bundled Section Rendering

Bundled section rendering allows you to request the HTML markup for up to five sections within the same API call.

Available for:

- `/{locale}/cart/add`
- `/{locale}/cart/change`
- `/{locale}/cart/clear`
- `/{locale}/cart/update`

### Request Sections

```javascript
{
  items: [
    {
      id: 36110175633573,
      quantity: 2
    }
  ],
  sections: "cart-items,cart-icon-bubble,cart-live-region-text,cart-footer"
}
```

### Specify Context Page

```javascript
{
  sections: "cart-items,cart-icon-bubble,cart-live-region-text,cart-footer",
  sections_url: "/cart?some_param=foo"
}
```

### Response with Sections

```json
{
  "attributes": {},
  "cart_level_discount_applications": [],
  "currency": "CAD",
  "item_count": 1,
  "items": [{"...": "..."}],
  "sections": {
    "cart-items": "<div id=\"shopify-section-template--14199693705272_…\">",
    "cart-icon-bubble": "<div id=\"shopify-section-cart-icon-bubble\"…\">",
    "cart-live-region-text": "<div id=\"shopify-section-cart-live-region-text\"…\">",
    "cart-footer": "<div id=\"shopify-section-template--14199693705272_…\">"
  },
  "token": "Z2NwLXVzLXdlc3QxOjAxSjBQTVk1Sjc5NVFKTjNOVlhLWENXQUI1?key=0d9909213054e22d092152de385763f0",
  "total_price": 100100
}
```

> **Note**: Sections that fail to render are returned as `null`.

---

## TopCart Implementation Examples

### Add Shipping Protection

```javascript
// Add shipping protection as a separate line item
const addShippingProtection = async (cartTotal) => {
  const protectionCost = Math.ceil(cartTotal * 0.05); // 5% of cart total
  
  const formData = {
    items: [{
      id: SHIPPING_PROTECTION_VARIANT_ID,
      quantity: 1,
      properties: {
        '_protection_cost': protectionCost.toString(),
        '_original_cart_total': cartTotal.toString()
      }
    }]
  };

  const response = await fetch(window.Shopify.routes.root + 'cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });

  return response.json();
};
```

### Update Cart with Gift Options

```javascript
const updateGiftOptions = async (giftWrap, giftMessage) => {
  const updateData = {
    attributes: {
      'gift_wrap': giftWrap ? 'Yes' : 'No',
      'gift_message': giftMessage || '',
      '_gift_options_updated': new Date().toISOString()
    }
  };

  const response = await fetch(window.Shopify.routes.root + 'cart/update.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });

  return response.json();
};
```

### Add Product with Add-ons

```javascript
const addProductWithAddons = async (productVariantId, quantity, selectedAddons) => {
  const items = [
    {
      id: productVariantId,
      quantity: quantity,
      properties: {
        '_has_addons': 'true',
        '_addon_count': selectedAddons.length.toString()
      }
    }
  ];

  // Add each addon as separate line item
  selectedAddons.forEach((addon, index) => {
    items.push({
      id: addon.variantId,
      quantity: 1,
      properties: {
        '_addon_for': productVariantId.toString(),
        '_addon_type': addon.type,
        '_addon_index': index.toString()
      }
    });
  });

  const response = await fetch(window.Shopify.routes.root + 'cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ items })
  });

  return response.json();
};
```

### Update Cart with Section Rendering

```javascript
const updateCartWithSections = async (updates) => {
  const updateData = {
    updates: updates,
    sections: "cart-drawer,cart-icon-bubble,cart-count"
  };

  const response = await fetch(window.Shopify.routes.root + 'cart/update.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });

  const data = await response.json();
  
  // Update UI sections
  Object.keys(data.sections).forEach(sectionId => {
    const element = document.getElementById(`shopify-section-${sectionId}`);
    if (element && data.sections[sectionId]) {
      element.outerHTML = data.sections[sectionId];
    }
  });

  return data;
};
```

### Error Handling Pattern

```javascript
const safeCartOperation = async (operation) => {
  try {
    const response = await operation();
    
    if (response.status && response.status !== 200) {
      console.error('Cart operation failed:', response.message);
      return { success: false, error: response.description };
    }
    
    return { success: true, data: response };
  } catch (error) {
    console.error('Cart operation error:', error);
    return { success: false, error: error.message };
  }
};

// Usage
const result = await safeCartOperation(() => 
  fetch(window.Shopify.routes.root + 'cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  }).then(res => res.json())
);

if (result.success) {
  console.log('Cart updated:', result.data);
} else {
  console.error('Failed to update cart:', result.error);
}
```

## Best Practices for TopCart

1. **Always use proper error handling** for all Cart API calls
2. **Validate inventory** before adding items to cart
3. **Use private properties** for internal tracking data
4. **Implement optimistic UI updates** for better user experience
5. **Cache cart state** appropriately but refresh when needed
6. **Use section rendering** to efficiently update multiple UI components
7. **Handle network failures** gracefully with retry logic
8. **Validate quantities** to prevent overselling
9. **Use locale-aware URLs** for international stores
10. **Test across different cart states** (empty, single item, multiple items)

## Rate Limiting and Performance

- The Cart API has built-in throttling for shipping rate requests
- Use the async shipping rates endpoints for better performance
- Implement debouncing for frequent cart updates
- Consider using bundled section rendering to reduce API calls
- Cache cart data when appropriate but ensure data freshness

This Cart API reference provides the foundation for implementing sophisticated cart functionality in TopCart, whether for direct cart manipulation, theme integration, or client-side cart enhancements.
