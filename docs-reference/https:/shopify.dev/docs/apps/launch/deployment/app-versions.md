# About app versions

After you set up your app configuration or create one or more app extensions, you can deploy these components together and release a new app version to users. An app version is a snapshot of your app configuration and all extensions.

## Deployment workflow

Your app configuration and all extensions, including extensions created in the Partner Dashboard, are versioned together as a single app version.

When you run the deploy command using Shopify CLI, an app version is created and released. You can revert to a previous app version at any time. You can also create an app version from the Partner Dashboard.

Releasing an app version replaces the current active version that's served to stores that have your app installed. It might take several minutes for app users to be upgraded to the new version.

### Simplified Deployment Model Diagram

```
┌─────────────────┐    ┌──────────────────────────────────────┐    ┌─────────────────────┐
│   Shopify CLI   │    │                App                   │    │   Active App        │
│      💻         │    │        Bundle from Shopify CLI      │    │     Version         │
│                 │────┼─────────────────────────────────────┼───▶│        🧩          │
│ > shopify app   │    │  ┌─────────────────────────────────┐ │    │                     │
│   deploy        │    │  │      App configuration         │ │    │                     │
│                 │    │  └─────────────────────────────────┘ │    │                     │
└─────────────────┘    │  ┌─────────────────────────────────┐ │    └─────────────────────┘
                       │  │   CLI-managed extension 1      │ │
                       │  └─────────────────────────────────┘ │
                       │  ┌─────────────────────────────────┐ │
                       │  │   CLI-managed extension 2      │ │
                       │  └─────────────────────────────────┘ │
                       │  ┌─────────────────────────────────┐ │
                       │  │   CLI-managed extension 3      │ │
                       │  └─────────────────────────────────┘ │
                       │                                      │
                       │    Drafts in Partner Dashboard      │
                       │  ┌─────────────────────────────────┐ │
                       │  │ Dashboard-managed extension 1   │ │
                       │  └─────────────────────────────────┘ │
                       │  ┌─────────────────────────────────┐ │
                       │  │ Dashboard-managed extension 2   │ │
                       │  └─────────────────────────────────┘ │
                       └──────────────────────────────────────┘
                                         │
                                         ▼
                              New app version is
                              created and released
```

> **Tip**: If you want to deploy app configuration and extensions to Shopify regularly, then you can integrate Shopify CLI into your CI/CD pipeline to programmatically deploy your app components using the deploy command.

## How app versions are created

The contents of your app version are different depending where you create it.

For details about creating and managing app versions, refer to Deploy and release app versions.

| Tool | App version contents |
|------|---------------------|
| Shopify CLI | An app version created using Shopify CLI contains the following:<br>- The app configuration from the local configuration file. If the include_config_on_deploy flag is omitted or false, the configuration from the active app version will be used instead.<br>- The local version of the app's CLI-managed extensions. If you have an extension in your deployed app, but the extension code doesn't exist locally, then the extension isn't included in your app version. When the version is released, the extensions that aren't included in your app version are no longer available to users.<br>- The latest drafts of dashboard-managed extensions. |
| Partner Dashboard: Versions page | An app version created from the Versions page in the Partner Dashboard contains the following:<br>- The app configuration that is present in the active app version.<br>- The CLI-managed extensions that are present in the active app version.<br>- The latest drafts of dashboard-managed extensions. |
| Partner Dashboard: Configuration page | An app version created from the Configuration page in the Partner Dashboard contains the following:<br>- The app configuration that you saved in the Configuration page.<br>- The CLI-managed extensions that are present in the active app version.<br>- The dashboard-managed extensions that are present in the active app version. |

## Updates to the deployment model

On July 26th, 2023, we released several improvements to the extension deployment, versioning, and release process, known as simplified deployment.

On September 5, 2023, this new deployment model was applied to all apps.

On January 31, 2024, app configuration became versioned and is now included in app versions.

The simplified deployment model includes the following workflow enhancements:

| Enhancement | Description |
|-------------|-------------|
| App-level versioning | The Shopify CLI deploy command creates an app version, which is a snapshot of your app configuration and all extensions, including dashboard-managed extensions. |
| Unified extension deployment | Deploy your CLI-managed extensions and dashboard-managed extensions in a single app version, instead of versioning and publishing them individually. |
| Release from Shopify CLI | Instead of visiting the Partner Dashboard to update app configuration and publish each extension, create and release a new app version to production directly from the command line using the Shopify CLI deploy command.<br><br>You can also create an app version and release it from the Partner Dashboard. |
| Function workflow improvements | Preview functions without deploying them using the Shopify CLI dev command. Version and release functions together with everything else using the deploy command. |
| Delete extensions | Delete most CLI-managed and dashboard-managed extensions, with the exception of payment app extensions. Learn more about removing extensions from your app. |
| Performance improvements for app users | Instead of storing your app in a central location where it can be accessed by stores, an app is stored directly with the stores on which it's installed, offering performance and stability benefits. |

## Workflow impacts

The following tables outline some of the key changes to the deployment process that might impact your development workflow. It also includes recommendations to help you to adapt to each change.

## Updating app configuration

| Before versioned app configuration | After versioned app configuration |
|------------------------------------|-----------------------------------|
| Changes to app configuration go live immediately. | All changes to app configuration are versioned and go live when the store is upgraded to the new app version. |
| When you run the Shopify CLI config push command, your local app configuration is pushed to your app, independently from app extensions. | The config push command is not supported. Instead, the deploy command includes your local app configuration and all extensions in the new app version. Learn how to Migrate from config push. |

## Deploying and releasing extensions

| Before simplified deployment | After simplified deployment | Recommendation |
|----------------------------|----------------------------|----------------|
| Dashboard-managed extensions are released independently, and aren't impacted by other extension releases. | When anyone creates and releases a new app version from the CLI or Partner Dashboard, the saved states of dashboard-managed extensions are released. | Make sure that your extensions in the Partner Dashboard are in a releasable state.<br><br>For extra control, we've added a --no-release flag on the deploy command. You can use this command to check your dashboard-managed extensions before releasing the app version through the Partner Dashboard. |
| When you run the Shopify CLI deploy command, all local copies of CLI-managed extensions are added as drafts in the Partner Dashboard. You can then release them individually from the Partner Dashboard. | When you run the Shopify CLI deploy command, all local copies of CLI-managed extensions are deployed and released. | Use source control to ensure that the extensions in your local project are up to date and ready to be released. |
| All extensions are released individually from the Partner Dashboard. | When you create and release an app version in the Partner Dashboard, only changes to dashboard-managed extensions are released. CLI-managed extensions remain unchanged from the active app version. | If you need to release changes to both dashboard-managed extensions and CLI-managed extensions at the same time, then save the changes to dashboard-managed extensions, and then run the deploy command using Shopify CLI. |
| Extensions are deployed independently, so they don't all need to be present in your environment at deployment time. | Extensions that aren't present in the environment where you're deploying from aren't included in your app version. | If you manage app extensions using multiple repositories, then consider one of the following options:<br><br>- Include all extensions in your app's source control repository.<br>- Including remote extension repositories as Git submodules.<br>- Make sure that other relevant repositories are available locally, and are up to date. Point to those directories using the extension_directories property of your app configuration file. |

## Testing extensions

| Before simplified deployment | After simplified deployment | Recommendation |
|----------------------------|----------------------------|----------------|
| You need to run the deploy command to test certain types of extensions on Shopify, including Shopify Functions and Web Pixel extensions. | The dev command builds these extensions and pushes drafts to Shopify. | Run the dev command to test your extension in a development store. The dev command enables development store preview while dev mode is running. |

## Deleting extensions

| Before simplified deployment | After simplified deployment | Recommendation |
|----------------------------|----------------------------|----------------|
| Functions are deleted through the Partner Dashboard. | Functions that aren't present in the environment where you're deploying are removed in your next app version on deploy. Associated function owners are deleted when the version is activated in installed stores. | Use one of the previously described options for managing app extensions from your app source. |
