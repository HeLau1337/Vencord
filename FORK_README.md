# Vencord

### forked by HeLau1337

This fork of the original Vencord repository bundles all my (HeLau1337's) modifications to existing Vencord plugins.

## Installation Guide

### Sections

-   [Dependencies](#dependencies)
-   [Installing Vencord](#installing-vencord)
-   [Updating Vencord](#updating-vencord)
-   [Uninstalling Vencord](#uninstalling-vencord)

### Dependencies

-   Install Git from https://git-scm.com/download
-   Install Node.JS LTS from here: https://nodejs.dev/en/

### Installing Vencord

Install `pnpm`:

> :exclamation: This next command may need to be run as admin/root depending on your system, and you may need to close and reopen your terminal for pnpm to be in your PATH.

```shell
npm i -g pnpm
```

> :exclamation: **IMPORTANT** Make sure you aren't using an admin/root terminal from here onwards. It **will** mess up your Discord/Vencord instance and you **will** most likely have to reinstall.

Clone HeLau1337's Vencord fork:

```shell
git clone https://github.com/HeLau1337/Vencord
cd Vencord
```

Now you need to decide which of my available branches you want use. Current choices are:

-   the "**textreplace**" branch which only applies my changes to the TextReplace plugin

    -   All TextReplace rules will now be stored in Vencord's settings.json file. This allows easier import/export of many rules at once. You can find the settings.json file by going into your Discord settings (when Vencord is already installed), in the Vencord section click on the Vencord category, then click on the "Open Settings Folder" button in the Quick Actions box.
    -   If you use Vencord's existing Cloud Sync feature, your TextReplace rules will now be synced too!
    -   If you also use the [Vendetta](https://github.com/vendetta-mod/Vendetta#vendetta) mod for Discord on mobile phones, feel free to check out [my forked TextReplace plugin for Vendetta](https://github.com/HeLau1337/vendetta-text-replace/blob/releases/README.md#how-to-install). It allows you to easily import the TextReplace rules from the Vencord Cloud with a simple tap of a button!

-   the "**messagelogger**" branch which only applies my changes to the MessageLogger plugin

    -   This features a new context menu option which allows you to clear the entire message history that was logged by MessageLogger in the current channel. The only tiny flaw of this is that you need to move your mouse over edited messages (after you selected the new context menu option) so they will be re-rendered without the edit history. Deleted messages that have been logged by MessageLogger will be all automatically completely deleted immediately.

-   the "**develop**" branch which bundles all of my modifications to the original Vencord project

    -   currently this only affects the changes to the two plugins mentioned above

-   (the "main" branch which is currently matching the state of the original Vencord repository's main branch - so there are no modifications included)

Switch to the branch of your choice using `git checkout <branch-name>`. For example:

```
git checkout develop
```

Now install the dependencies:

```shell
pnpm install --frozen-lockfile
```

Build Vencord:

```shell
pnpm build
```

Inject Vencord into your client:

```shell
pnpm inject
```

Then fully close Discord from your taskbar or task manager, and restart it. Vencord should be injected - you can check this by looking for the Vencord section in Discord settings.

### Updating Vencord

To pull latest changes:

```shell
git pull
```

and then to build the changes:

```shell
pnpm build
```

Then just refresh your client.

### Uninstalling Vencord

Simply run:

```shell
pnpm uninject
```

<i>Credits go to Megu's installation guides in the original Vencord repository. I used them as a template for these installation instructions.</i>

### Disclaimer

Discord is trademark of Discord Inc. and solely mentioned for the sake of descriptivity.
Mention of it does not imply any affiliation with or endorsement by Discord Inc.

<details>
<summary>Using Vencord violates Discord's terms of service</summary>

Client modifications are against Discord’s Terms of Service.

However, Discord is pretty indifferent about them and there are no known cases of users getting banned for using client mods! So you should generally be fine as long as you don’t use any plugins that implement abusive behaviour. But no worries, all inbuilt plugins are safe to use!

Regardless, if your account is very important to you and it getting disabled would be a disaster for you, you should probably not use any client mods (not exclusive to Vencord), just to be safe

Additionally, make sure not to post screenshots with Vencord in a server where you might get banned for it

</details>
