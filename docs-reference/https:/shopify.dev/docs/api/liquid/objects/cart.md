# cart

A customer's cart.

## Properties

### attributes

Additional attributes entered by the customer with the cart.

To learn more about capturing cart attributes, refer to the cart template.

#### Example

**Capture cart attributes**

To capture a cart attribute, include an HTML input with an attribute of name="attributes[attribute-name]" within the cart <form>.

```html
<label>What do you want engraved on your cauldron?</label>
<input type="text" name="attributes[cauldron-engraving]" value="{{ cart.attributes.cauldron-engraving }}" />
```

> **Tip**: You can add a double underscore __ prefix to an attribute name to make it private. Private attributes behave like other cart attributes, except that they can't be read from Liquid or the Ajax API. You can use them for data that doesn't affect the page rendering, which allows for more effective page caching.

### cart_level_discount_applications

array of discount_application

The cart-specific discount applications for the cart.

#### Example

**Display cart-level discount applications**

**Code**

```liquid
{% for discount_application in cart.cart_level_discount_applications %}
  Discount name: {{ discount_application.title }}
  Savings: -{{ discount_application.total_allocated_amount | money }}
{% endfor %}
```

**Data**

Data only reflects initial example state.

```json
{
  "cart": {
    "cart_level_discount_applications": [
      {
        "title": "Ingredient Sale",
        "total_allocated_amount": "42.24"
      }
    ]
  }
}
```

**Output**

```
Discount name: Ingredient Sale
  Savings: -$42.24
```

### checkout_charge_amount

number

The amount that the customer will be charged at checkout in the currency's subunit.

The value is output in the customer's local (presentment) currency.

For currencies without subunits, such as JPY and KRW, tenths and hundredths of a unit are appended. For example, 1000 Japanese yen is output as 100000.

> **Tip**: Use money filters to output a formatted price.

### currency

The currency of the cart.

If the store uses multi-currency, then this is the same as the customer's local (presentment) currency. Otherwise, it's the same as the store currency.

> **Tip**: You can output the store's available currencies using shop.enabled_currencies.

### discount_applications

array of discount_application

The discount applications for the cart.

#### Example

**Display discount applications**

**Code**

```liquid
{% for discount_application in cart.discount_applications %}
  Discount name: {{ discount_application.title }}
  Savings: -{{ discount_application.total_allocated_amount | money }}
{% endfor %}
```

**Data**

Data only reflects initial example state.

```json
{
  "cart": {
    "discount_applications": [
      {
        "title": "Bloodroot discount!",
        "total_allocated_amount": "2.50"
      },
      {
        "title": "Ingredient Sale",
        "total_allocated_amount": "42.24"
      }
    ]
  }
}
```

**Output**

```
Discount name: Bloodroot discount!
  Savings: -$2.50

  Discount name: Ingredient Sale
  Savings: -$42.24
```

### duties_included

boolean

Returns true if duties are included in the prices of products in the cart. Returns false if not.

### empty?

boolean

Returns true if there are no items in the cart. Return's false if there are.

### item_count

number

The number of items in the cart.

### items

array of line_item

The line items in the cart.

### items_subtotal_price

number

The total price of all of the items in the cart in the currency's subunit, after any line item discounts. This doesn't include taxes (unless taxes are included in the prices), cart discounts, or shipping costs.

The value is output in the customer's local (presentment) currency.

For currencies without subunits, such as JPY and KRW, tenths and hundredths of a unit are appended. For example, 1000 Japanese yen is output as 100000.

> **Tip**: Use money filters to output a formatted amount.

### note

string

Additional information captured with the cart.

To learn more about capturing cart notes, refer to the cart template.

#### Example

**Capture cart notes**

To capture a cart note, include an HTML input such as a <textarea> with an attribute of name="note" within the cart <form>.

```html
<label>Gift note:</label>
<textarea name="note"></textarea>
```

> **Note**: There can only be one instance of {{ cart.note }} on the cart page. If there are multiple instances, then the one that comes latest in the Document Object Model (DOM) will be submitted with the form.

### original_total_price

number

The total price of all of the items in the cart in the currency's subunit, before discounts have been applied.

The value is output in the customer's local (presentment) currency.

For currencies without subunits, such as JPY and KRW, tenths and hundredths of a unit are appended. For example, 1000 Japanese yen is output as 100000.

> **Tip**: Use money filters to output a formatted amount.

### requires_shipping

boolean

Returns true if any of the products in the cart require shipping. Returns false if not.

### taxes_included

boolean

Returns true if taxes are included in the prices of products in the cart. Returns false if not.

This can be set in a store's tax settings.

If the store includes or exclude tax based on the customer's country, then the value reflects the tax requirements of the customer's country.

### total_discount

number

The total amount of all discounts (the amount saved) for the cart in the currency's subunit.

The value is output in the customer's local (presentment) currency.

For currencies without subunits, such as JPY and KRW, tenths and hundredths of a unit are appended. For example, 1000 Japanese yen is output as 100000.

> **Tip**: Use money filters to output a formatted amount.

### total_price

number

The total price of all of the items in the cart in the currency's subunit, after discounts have been applied.

The value is output in the customer's local (presentment) currency.

For currencies without subunits, such as JPY and KRW, tenths and hundredths of a unit are appended. For example, 1000 Japanese yen is output as 100000.

> **Tip**: Use money filters to output a formatted amount.

### total_weight

number

The total weight of all of the items in the cart in grams.

> **Tip**: Use the weight_with_unit filter to format the weight in the store's format, or override the default unit.

## Deprecated Properties

### discounts

array of discount

**Deprecated**

The discounts applied to the cart.

**Deprecated**

Deprecated because not all discount types and details are available.

The cart.discounts property has been replaced by cart.discount_applications.

### Example

```json
{
  "attributes": {},
  "cart_level_discount_applications": [],
  "checkout_charge_amount": "380.25",
  "currency": {},
  "discount_applications": [],
  "discounts": [],
  "duties_included": false,
  "empty?": false,
  "item_count": 2,
  "items": [],
  "items_subtotal_price": "422.49",
  "note": "Hello this is a note",
  "original_total_price": "424.99",
  "requires_shipping": true,
  "taxes_included": false,
  "total_discount": "44.74",
  "total_price": "380.25",
  "total_weight": 0
}
```

## Access

Directly accessible in: Global

## Templates using cart

**Theme architecture**

cart template
