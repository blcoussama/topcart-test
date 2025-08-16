# ScriptTag functionality to be blocked as of February 1, 2025

There are upcoming changes, key dates and actions that app developers are required to take related to the use of ScriptTags.

## ScriptTag change highlights

> **Deprecated**: Since February 1, 2025, apps are longer be able to create ScriptTags on any merchants' Thank You or Order Status pages. This is to prevent additional merchants from being blocked or adding work to their future upgrade. ScriptTags created before February 1, 2025, will continue to work until August 28, 2025 for Plus shops and August 26, 2026 for non-Plus shops.

ScriptTags on the Order Status page have been deprecated and will be turned off on August 28, 2025, for Plus merchants and on August 26, 2026, for non-Plus merchants. Aligned to this deadline, Plus merchants are required to upgrade their Thank you and Order status pages and remove customizations made with ScriptTags. That functionality should instead be moved to apps, using UI extensions or web pixel extensions.

Apps that have not recreated their ScriptTag functionality using UI extensions and/or Web Pixels are blocking both Plus and non-Plus merchants from upgrading to the new Thank You and Order Status page. Merchants installing these apps are creating extra work for their future upgrades.

## Action required by February 1, 2025

- Upgrade your app's functionality for the Thank You and Order Status pages from ScriptTags to web pixel extensions and/or UI extensions.
- Update your app and documentation to indicate available functionality for merchants on each Thank You and Order Status pages version.
- Encourage merchants to upgrade to the new Thank You and Order Status pages. You can check whether a merchant has upgraded their Thank You and Order Status page using this API.

## Impact of this change on new and existing app installs

### Permitted functionality for new app installs

| App Functionality | Merchant has not upgraded their Thank You and Order Status page | Merchant has upgraded their Thank You and Order Status page |
|-------------------|----------------------------------------------------------------|-------------------------------------------------------------|
| ScriptTags | x | x |
| Web pixel extension | ✓ | ✓ |
| UI extensions | x | ✓ |

This change does not impact merchants who already had your app installed prior to February 1, 2025. However, when the Plus upgrade deadline passes in August and the non-Plus deadline passes on August 26, 2026, ScriptTags will no longer work for these merchants:

### Permitted functionality for existing app installs

| App Functionality | Before deadline | After deadline |
|-------------------|----------------|----------------|
| ScriptTags | ✓ (if not upgraded) | x |
| Web pixel extensions | ✓ | ✓ |
| UI Extensions | ✓ (if upgraded) | ✓ |

## Merchant-facing communication

To make merchants aware of the limited functionality of your app after February 1, 2025, we will display information when they install new apps. The functionality of your app is already displayed during the upgrade process for the Thank You and Order Status pages.

## Banner during install

The image below shows an example banner that will be displayed during app install.

Install Banner ScriptTags

The content of this banner will depend upon the merchants' Thank You and Order Status page upgrade state and whether you have implemented functionality in web pixel extensions and/or UI extensions:

### Banner content

| App migration status | Not upgraded | Upgraded |
|---------------------|--------------|----------|
| Has not implemented UI extensions or web pixel extensions | Merchant will be encouraged to contact the app developer to encourage development of UI extensions and/or web pixels. | |
| Has implemented UI extensions only | Merchant will be encouraged to upgrade to access all app functionality | No banner |
| Has implemented both UI extensions and web pixel extensions | Merchant will be encouraged to upgrade to access all app functionality | No banner |
| Has implemented web pixel extensions only | No banner: Web pixel extensions work on both versions | |

> **Caution**: If you do not implement UI extensions and/or web pixel extensions by February 1, 2025, we expect the number of new app installs for your app to significantly decrease.

## Customizations report

The upgrade guide is an AI-powered report that summarizes a merchant's customizations on the Thank You and Order Status pages. It guides merchants through their upgrade process.

Customizations Report ScriptTags

If your app uses ScriptTags with a display_scope of order_status or all without web pixel extension and/or UI extension functionality, it will be displayed under the "Requires update by app developer" section of the customizations report for all merchants with the app installed. Learn more about display_scope here.

This report allows merchants to review any deprecated customizations and encourages them to recreate them using UI extensions and/or web pixel extensions on the Thank you and Order status pages. When apps have not already upgraded their app to use UI extensions and/or web pixel extensions, we've observed merchants choosing to uninstall apps to unblock their upgrade.

We expect the uninstalls of apps that have not provided functionality through UI extensions and/or web pixel extensions to continue to increase as we get closer to the upgrade deadlines for Plus and non-Plus.

## Does your app still require ScriptTags on the Order Status page?

> **Tip**: If your app no longer requires a display_scope of order_status or all, then you can submit this form and we'll update or delete your ScriptTag for existing merchants:

If your app no longer requires a display_scope of order_status or all, then you can submit the following form and we'll update or delete your ScriptTag for existing merchants:

- If your ScriptTag's display_scope is all, then we'll update it to online_store.
- If your ScriptTag's display_scope is order_status, then we'll delete it.

This will prevent the banner from being shown for new app installs and will remove your app from the customizations report. Please ensure that your app doesn't implement any customizations on the Order Status page to avoid impacting your app's functionality for both new and existing merchants.

> **Caution**: If you submit the form, then you'll break your app's functionality for merchants who are still using the legacy Order Status pages.

We'll accept form submissions until August 28, 2025. Please allow up to one week after submitting the form for the changes to take effect.
