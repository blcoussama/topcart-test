# The ScriptTag resource (legacy)

> **Deprecated**: Script tags will be sunset for the **Order status** checkout page on August j28, 2025. Upgrade to Shopify Extensions in Checkout before this date.
>
> Shopify Scripts will continue to work alongside Shopify Extensions in Checkout until August 28, 2025.

## Overview

The `ScriptTag` resource allows your app to add JavaScript to a merchant's storefront without requiring any changes to the theme's code. This approach is essential when you need to support vintage themes that do not offer app block functionality.

## When to use ScriptTag

You should use ScriptTag only to support vintage themes, which do not support app blocks. For Online Store 2.0 themes, you must use theme app extensions and provide app blocks, as ScriptTag is not a substitute for app blocks.

> **Caution**: If your app integrates with a Shopify theme and you plan to submit it to the Shopify App Store, you must use theme app extensions.

## How ScriptTag works

ScriptTag loads JavaScript from a remote server into a theme section each time a page is viewed. Each script tag is tied to the app that created it. When a merchant uninstalls your app, Shopify automatically removes all script tags associated with that app.

You can do the following with the `ScriptTag` resource:

* Add functionality to a shop's page without having to manually edit a theme's template.
* Let merchants uninstall your app without needing to edit a theme's template to revert any changes the app made.

## Next steps

To get started, review the ScriptTag REST Admin API documentation or the ScriptTag GraphQL Admin API documentation. If you want to verify support for app blocks, see the verification guide.
