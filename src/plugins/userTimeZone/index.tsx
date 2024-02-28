/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addContextMenuPatch, removeContextMenuPatch } from "@api/ContextMenu";
import definePlugin from "@utils/types";

import AboutComponent from "./components/AboutComponent";
import {
    CompactLocalTimestampChatComponentWrapper,
    LocalTimestampChatComponentWrapper
} from "./components/LocalTimestampChatComponent";
import { UserContextMenuPatch } from "./components/UserContextMenuPatch";
import { UtzStoreService } from "./utzStoreService";
import { settings } from "./settings";
import type { Guild, GuildMember } from "discord-types/general";
import UserPermissions from "../permissionsViewer/components/UserPermissions";
import { CurrentLocalTimestampComponentWrapper } from "./components/CurrentLocalTimestampComponent";

// Parts of the plugin used the PronounDB plugin's code as inspiration

export const utzStoreService = new UtzStoreService();

export default definePlugin({
    name: "UserTimeZone",
    authors: [{ name: "hendrik3812", id: 286208399786377216n }],
    description: "Allows you to show other user's current local timestamps (according to the time zone you set for the user).",

    start() {
        utzStoreService.refreshCache();
        addContextMenuPatch("user-context", UserContextMenuPatch);
    },

    stop() {
        removeContextMenuPatch("user-context", UserContextMenuPatch);
    },

    patches: [
        /*
        // Add user's local timestamp next to username (compact mode)
        {
            find: "showCommunicationDisabledStyles",
            replacement: {
                match: /("span",{id:\i,className:\i,children:\i}\))/,
                replace: "$1, $self.CompactLocalTimestampChatComponentWrapper(arguments[0])"
            }
        },
        */
        // Patch the chat timestamp element (normal mode) to add user's local timestamp
        {
            find: "showCommunicationDisabledStyles",
            replacement: {
                match: /(?<=return\s*\(0,\i\.jsxs?\)\(.+!\i&&)(\(0,\i.jsxs?\)\(.+?\{.+?\}\))/,
                replace: "[$1, $self.LocalTimestampChatComponentWrapper(arguments[0])]"
            }
        },
        {
            find: ".popularApplicationCommandIds,",
            replacement: {
                match: /showBorder:(.{0,60})}\),(?<=guild:(\i),guildMember:(\i),.+?)/,
                replace: (m, showBorder, guild, guildMember) => `${m}$self.CurrentLocalTimestampComponentWrapper(${guildMember}),`
            }
        }
        // Patch the profile popout username header to use our pronoun hook instead of Discord's pronouns
        /*
        {
            find: ".userTagNoNickname",
            replacement: [
                {
                    match: /{user:(\i),[^}]*,pronouns:(\i),[^}]*}=\i;/,
                    replace: "$&let vcPronounSource;[$2,vcPronounSource]=$self.useProfilePronouns($1.id);"
                },
                // PRONOUN_TOOLTIP_PATCH
            ]
        },
        */
        // Patch the profile modal username header to use our pronoun hook instead of Discord's pronouns
        /* {
            find: ".nameTagSmall)",
            replacement: [
                {
                    match: /\.getName\(\i\);(?<=displayProfile.{0,200})/,
                    replace: "$&const [vcPronounce,vcPronounSource]=$self.useProfilePronouns(arguments[0].user.id,true);if(arguments[0].displayProfile&&vcPronounce)arguments[0].displayProfile.pronouns=vcPronounce;"
                },
                PRONOUN_TOOLTIP_PATCH
            ]
        } */
    ],

    settings,

    settingsAboutComponent: AboutComponent,

    // Re-export the components on the plugin object so it is easily accessible in patches
    LocalTimestampChatComponentWrapper,
    CompactLocalTimestampChatComponentWrapper,
    // useProfilePronouns
    CurrentLocalTimestampComponentWrapper: (guildMember: GuildMember | undefined,) => !!guildMember && <CurrentLocalTimestampComponentWrapper userId={guildMember.userId} />,
});
