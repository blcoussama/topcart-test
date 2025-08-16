
# About the Shopify Ajax API

The Ajax API provides a suite of lightweight REST API endpoints for development of Shopify themes. The Ajax API can only be used by themes that are hosted by Shopify. You can't use the Ajax API on a Shopify custom storefront.

> **Tip**: To request the HTML markup for theme sections using an AJAX request, use the Section Rendering API.

## Use cases

Possible uses of the Ajax API include:

- Add products to the cart and update the cart item counter.
- Display related product recommendations.
- Suggest products and collections to visitors as they type in a search field.

Refer to the Ajax API reference for a full list of available API endpoints.

## Making requests to the API

The Ajax API accepts two types of HTTP requests:

- GET requests to read cart and some product data
- POST requests to update the cart for the current session

For instance, to fetch the current contents of the cart, send a client-side request to the store's /cart.js endpoint.

```javascript
var cartContents = fetch(window.Shopify.routes.root + 'cart.js')
.then(response => response.json())
.then(data => { return data });
```

## Locale-aware URLs

Stores can have dynamic URLs generated for them when they sell internationally or in multiple languages. When using the Ajax API, it's important to use dynamic, locale-aware URLs so that you can give visitors a consistent experience for the language and country that they've chosen.

The global value window.Shopify.routes.root is available to use as a base when building locale-aware URLs in JavaScript. The global value will always end in a / character, so you can safely use simple string concatenation to build the full URLs.

## Requirements and limitations

- This is an unauthenticated API. It doesn't require access tokens or a client ID to access.
- There are no hard rate limits on the Ajax API. It's still subject to Shopify's standard API abuse-prevention measures.
- All API responses return JSON-formatted data.
- Product JSON responses are limited to a maximum of 250 variants.
- The Ajax API can't be used to read any customer or order data, or update any store data. If you need more extensive access, check the GraphQL Admin API.

## Tutorials

Show product recommendations on product pages using the Ajax API
