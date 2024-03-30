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

import { addContextMenuPatch, NavContextMenuPatchCallback, removeContextMenuPatch } from "@api/ContextMenu";
import { definePluginSettings } from "@api/Settings";
import { CopyIcon, LinkIcon } from "@components/Icons";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { Clipboard, Menu } from "@webpack/common";
import type { Channel, User } from "discord-types/general";

interface UserContextProps {
    channel: Channel;
    guildId?: string;
    user: User;
}

const UserContextMenuPatch: NavContextMenuPatchCallback = (children, { user }: UserContextProps) => () => {
    if (!user) return;

    if (settings.store.addCopyUserUrl)
        children.push(
            <Menu.MenuItem
                id="vc-copy-user-url"
                label="Copy User URL"
                action={() => Clipboard.copy(`<https://discord.com/users/${user.id}>`)}
                icon={LinkIcon}
            />
        );

    if (settings.store.addCopyUsername)
        children.push(
            <Menu.MenuItem
                id="vc-copy-username"
                label="Copy Username"
                action={() => Clipboard.copy(user.username)}
                icon={CopyIcon}
            />
        );
};


const settings = definePluginSettings({
    addCopyUserUrl: {
        type: OptionType.BOOLEAN,
        description: "Add the 'Copy User URL' option to the user context menu",
        default: true
    },
    addCopyUsername: {
        type: OptionType.BOOLEAN,
        description: "Add the 'Copy Username' option to the user context menu",
        default: true
    },
});

export default definePlugin({
    name: "CopyUserInfo",
    authors: [Devs.castdrian],
    description: "Adds options for quickly copying user info (like the username or URL to the user's profile) to the user context menu.",
    settings: settings,
    start() {
        addContextMenuPatch("user-context", UserContextMenuPatch);
    },

    stop() {
        removeContextMenuPatch("user-context", UserContextMenuPatch);
    },
});