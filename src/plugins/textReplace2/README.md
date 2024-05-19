To install unofficial Vencord plugins like my TextReplace fork, you need to...

1. build Vencord yourself locally using the source code ("Vencord Installation Guide" section in this README)
2. and then install the TextReplace plugin included in this download into the "userplugins" folder ("Plugin Installation Guide" section in this README).

# 1. Vencord installation Guide

## Dependencies

-   Install Git from https://git-scm.com/download
-   Install Node.JS LTS from here: https://nodejs.dev/en/

## Installing Vencord

Install `pnpm`:

> :exclamation: This next command may need to be run as admin/root depending on your system, and you may need to close and reopen your terminal for pnpm to be in your PATH.

```shell
npm i -g pnpm
```

> :exclamation: **IMPORTANT** Make sure you aren't using an admin/root terminal from here onwards. It **will** mess up your Discord/Vencord instance and you **will** most likely have to reinstall.

Clone Vencord:

```shell
git clone https://github.com/Vendicated/Vencord
cd Vencord
```

Install dependencies:

```shell
pnpm install --frozen-lockfile
```

Build Vencord:

```shell
pnpm build
```

Inject vencord into your client:

```shell
pnpm inject
```

Then fully close Discord from your taskbar or task manager, and restart it. Vencord should be injected - you can check this by looking for the Vencord section in Discord settings.

## Updating Vencord

If you're using Discord already, go into the `Updater` tab in settings.

Sometimes it may be necessary to manually update if the GUI updater fails.

To pull latest changes:

```shell
git pull
```

If this fails, you likely need to reset your local changes to vencord to resolve merge errors:

> :exclamation: This command will remove any local changes you've made to vencord. Make sure you back up if you made any code changes you don't want to lose!

```shell
git reset --hard
git pull
```

and then to build the changes:

```shell
pnpm build
```

Then just refresh your client

## Uninstalling Vencord

Simply run:

```shell
pnpm uninject
```

# 2. Plugin Installation Guide

You don't need to run `pnpm build` every time you make a change. Instead, use `pnpm watch` - this will auto-compile Vencord whenever you make a change. If using code patches (recommended), you will need to CTRL+R to load the changes.

## Installing an unofficial Vencord plugin

1. Go into the `src/userplugins/` directory within the Vencord source code repository that you cloned earlier. If it doesn't already exist, create a folder called `userplugins` in the `src` directory.
2. Drag and drop the entire "TextReplace2" folder from this plugin download into the userplugins folder.
3. Either rebuild Vencord (`pnpm build`) or make sure that `pnpm watch` is still running.
4. Load/Reload Discord, go to Settings > Vencord > Plugins and search for "TextReplace". Make sure that the original TextReplace is disabled when using my TextReplace2.

Credits go to Megu's installation guides in the original Vencord repository. I used them as a template for this README.
