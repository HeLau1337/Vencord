/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
* This is a "fork" of the vc-timezones repository by Syncxv on GitHub: https://github.com/Syncxv/vc-timezones
*/

import "./styles.css";

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { Message, User } from "discord-types/general";

import { TimestampComponent } from "./components/TimestampComponent";
import { userContextMenuPatch } from "./components/UserContextMenuPatch";
import { settings } from "./settings";
import { TimezonesStoreService } from "./timezonesStoreService";
import { getTime } from "./utils";

export const classes = findByPropsLazy("timestamp", "compact", "contentOnly");

export const timezonesStoreService = new TimezonesStoreService();

export default definePlugin({
    name: "Timezones2",
    authors: [Devs.Aria],
    description: "[Hendrik's fork] Shows the local time of users in profiles and message headers",

    patches: [
        // stolen from ViewIcons
        ...[".NITRO_BANNER,", "=!1,canUsePremiumCustomization:"].map(find => ({
            find,
            replacement: {
                match: /(?<=hasProfileEffect.+?)children:\[/,
                replace: "$&$self.renderProfileTimezone(arguments[0]),"
            }
        })),
        {
            find: '"Message Username"',
            replacement: {
                // thanks https://github.com/Syncxv/vc-timezones/pull/4
                match: /(?<=isVisibleOnlyOnHover.+?)id:.{1,11},timestamp.{1,50}}\),/,
                replace: "$&,$self.renderMessageTimezone(arguments[0]),"
            }
        }
    ],
    settings,
    getTime,


    renderProfileTimezone: (props?: { user?: User; }) => {
        if (!settings.store.showProfileTime || !props?.user?.id) return null;

        return <TimestampComponent
            userId={props.user.id}
            type="profile"
        />;
    },

    renderMessageTimezone: (props?: { message?: Message; }) => {
        if (!settings.store.showMessageHeaderTime || !props?.message) return null;

        return <TimestampComponent
            userId={props.message.author.id}
            timestamp={props.message.timestamp.toISOString()}
            type="message"
        />;
    },

    contextMenus: {
        "user-context": userContextMenuPatch
    }
});
