# Build theme app extensions

Theme app extensions allow merchants to easily add dynamic elements to their themes without having to interact with Liquid templates or code. You can start building theme app extensions with Shopify CLI.

## What you'll learn

After you've finished this tutorial, you'll have accomplished the following tasks:

- Created a theme app extension
- Previewed the theme app extension
- Tested the theme app extension
- Added onboarding instructions in your app
- Deployed and released the theme app extension

## Requirements

- You've created a Partner account.
- You've created a development store that uses generated test data.
- You've created an app that uses Shopify CLI 3.0 or higher.
- You've installed an Online Store 2.0 theme, such as Horizon, that uses JSON templates and supports app blocks.
- You've installed the additional project dependencies (Ruby and Bundler).
- You understand the theme app extensions framework.

## Step 1: Create a new extension

You'll use Shopify CLI to generate a new theme app extension.

1. Navigate to the directory of the app that you want to add your extension to.

2. Run the following command to start creating the extension:

```terminal
shopify app generate extension
```

3. Select Theme app extension as the extension type.

4. Provide a name for your extension.

You should now have a new extension directory that includes a working example of a theme app extension that displays product ratings.

The generated extension requires a metafield definition with the following properties:

- Area: Products
- Namespace: demo
- Key: avg_rating
- Type: Integer

After you create the metafield definition, set a value for the metafield on at least one product in your development store.

## Step 2: Preview your theme app extension

You can preview your extension by running the dev command, which starts a local development server that supports hot reloading. This preview is available only in Google Chrome.

1. Navigate to your app directory.

2. Run the following command:

```terminal
shopify app dev
```

You can specify which theme you want to use to host your theme app extension using the `--theme <ID or name>` flag. If you don't specify a theme, then the command will upload Dawn, Shopify's example theme, to the development store.

When you run the dev command, Shopify CLI builds your app and bundles your app extensions. It also walks you through multiple configuration steps. If you've already run dev or deploy for this app, then some of these steps are skipped.

To learn about the processes that are executed when you run dev, refer to the Shopify CLI command reference.

3. Follow the instructions in the CLI output to preview the theme app extension. This includes the following steps:

   - Opening the host theme in the theme editor
   - Adding your app block to the theme
   - Saving the theme

4. Click the URL that's printed at the bottom of the CLI output to preview your extension.

## Step 3: Test your changes

Verify that your app looks and behaves correctly by testing your changes on a theme in your development store.

1. In your development store, go to an Online Store 2.0 theme and navigate to the theme editor.

2. Follow the procedures for:

   - Adding app blocks
   - Activating app embed blocks

3. Verify the app behaves as expected. For example, verify the following:

   - App embed blocks for floating components are positioned properly without obscuring page content.
   - You can use the theme editor to activate and deactivate app embed blocks and configure their settings.
   - You can use the theme editor to add, remove, and reposition app blocks and configure their settings.
   - App documentation, such as app onboarding instructions, is clear, accurate, and complete. To learn more about writing effective help documentation, refer to Help documentation in Shopify Polaris.

## Step 4: Include onboarding instructions in your app

Provide instructions for what merchants need to do after installing your app. For more information, refer to the UX guidelines.

## Step 5: Deploy and release the extension

When you're ready to release your changes to users, you can create and release an app version. An app version is a snapshot of your app configuration and all extensions.

> **Tip**: To verify that your theme app extension doesn't exceed any enforced limits before you deploy, you can run the Shopify CLI build command. Running the build command runs Theme Check against your extension to ensure that it's valid. For more information, refer to the enforced limits on theme app extensions.

1. Navigate to your app directory.

2. Run the following command.

   Optionally, you can provide a name or message for the version using the `--version` and `--message` flags.

```terminal
shopify app deploy
```

Releasing an app version replaces the current active version that's served to stores that have your app installed. It might take several minutes for app users to be upgraded to the new version.

> **Tip**: If you want to create a version, but avoid releasing it to users, then run the deploy command with a `--no-release` flag. You can release the unreleased app version using Shopify CLI's release command, or through the Partner Dashboard.
