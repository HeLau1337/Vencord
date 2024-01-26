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
import definePlugin from "@utils/types";
import { Menu } from "@webpack/common";

import { openUserMessagesHistoryModal } from "./components/modal";
import { UserContextProps } from "./interfaces";

const UserContextMenuPatch: NavContextMenuPatchCallback = (children, { user }: UserContextProps) => () => {
    if (!user) return;

    children.push(
        <Menu.MenuItem
            id="vc-show-user-message-history"
            label="Show user's message history"
            action={() => openUserMessagesHistoryModal(user)}
        />
    );
};

export default definePlugin({
    name: "UserMessageHistory",
    authors: [
        {
            name: "hendrik3812",
            id: 286208399786377216n
        },
    ],
    description: "Adds a \"Show user's message history\" option to the user context menu.",

    start() {
        addContextMenuPatch("user-context", UserContextMenuPatch);
    },

    stop() {
        removeContextMenuPatch("user-context", UserContextMenuPatch);
    },
});

