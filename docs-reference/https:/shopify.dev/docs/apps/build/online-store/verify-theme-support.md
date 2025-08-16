# Verify theme support

Before you start integrating your app, determine the method required for integrating an app with an online store by verifying whether its published theme supports app blocks.

> **Tip**: If a theme doesn't currently support app blocks, and you maintain the theme or a store where the theme is used, then you can also consider migrating the theme to support app blocks.

## Verification criteria

To verify whether a theme supports app blocks, you need to determine the following:

* Whether the template where your app is injected supports JSON.
* The main section in the template.
* Whether the section where your app is injected has a block of type `@app` in its schema.

For an example, refer to Shopify's sample product reviews app.

## Requirements

You've requested the `read_themes` GraphQL Admin API access scope.

## Verify support for app blocks

You can use the following code to verify that a theme supports app blocks. The code uses Shopify's Node library, which provides support for JavaScript apps to access the GraphQL Admin API.

```javascript
import {shopifyApi} from '@shopify/shopify-api';
// Create library object
const shopify = shopifyApi({
// The next four values are typically read from environment variables for added security
apiKey: 'APIKeyFromPartnerDashboard',
apiSecretKey: 'APISecretFromPartnerDashboard',
scopes: ['read_products'],
hostName: 'cloudflare-tunnel-address',
...
});
// Specify the name of the template that the app will integrate with
const APP_BLOCK_TEMPLATES = ["product", "collection", "index"];
const getMainThemeId = `
query getMainThemeId {
 themes(first: 1, roles: [MAIN]) {
 nodes {
 id
 }
 }
}`;
let response = await client.request(getMainThemeId);
const themeId = response.data.themes.nodes[0].id;
// Retrieve the JSON templates that we want to integrate with
const getFilesQuery = `
query getFiles($filenames: [String!]!, $themeId: ID!) {
 theme(id: $themeId) {
 files(filenames: $filenames) {
 nodes {
 filename
 body {
 ... on OnlineStoreThemeFileBodyText { content }
 ... on OnlineStoreThemeFileBodyBase64 { contentBase64 }
```

## Specify the method for integrating the app

| App integration methods | App block support | Integration method |
|------------------------|-------------------|-------------------|
| Yes | Skip requests made to the `ScriptTag` object. | No |

Make requests to the `ScriptTag` object, or provide instructions to add code using a custom Liquid section or block, or the custom CSS setting.

## Provide onboarding instructions

You need to provide merchants with post-installation instructions about onboarding your app.

To learn more about writing effective help documentation, refer to Help documentation in Shopify Polaris and to the theme app extension onboarding instruction guidelines.

### App block support and onboarding instruction examples

| App block support | Onboarding |
|------------------|------------|
| Yes | Provide merchants with instructions about using the app block.<br><br>For example, document instructions for adding the app block to the theme. |
| No | Provide merchants with instructions about any configurations required to integrate the app.<br><br>For example, document instructions for copying and pasting a code snippet to a page. |
