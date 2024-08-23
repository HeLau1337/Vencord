/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";


const settings = definePluginSettings({
    hideGiftButton: {
        type: OptionType.BOOLEAN,
        description: "Whether the gift button should be hidden.",
        default: true,
        restartNeeded: true
    },
    hideAppLauncherButton: {
        type: OptionType.BOOLEAN,
        description: "Whether the button for the app and command launcher should be hidden.",
        default: true,
        restartNeeded: true
    }
});

export default definePlugin({
    name: "HideChatInputButtons",
    authors: [],
    description: "Hides the buttons in the chat input area.",
    settings: settings,
    patches: [
        {
            find: "Messages.PREMIUM_GIFT_BUTTON_TOOLTIP",
            replacement: {
                match: /(\i.memo\(function\(\i\){)(let{disabled:\i,channel:\i}=\i,{analyticsLocations:\i}=\(0,\i.ZP\)\(\i.Z.GIFT_BUTTON\))/,
                replace: "$1return null;$2"
            },
            predicate: () => settings.store.hideGiftButton
        },
        {
            find: "S.Z.Messages.APP_LAUNCHER_ENTRYPOINT_BUTTON_ARIA_LABEL",
            replacement: {
                match: /(\i\.memo\(function\(\i\){)(let{channel:\i,type:\i,animateRef:\i}=\i)/,
                replace: "$1return null;$2"
            },
            predicate: () => settings.store.hideAppLauncherButton
        }
    ]
});
