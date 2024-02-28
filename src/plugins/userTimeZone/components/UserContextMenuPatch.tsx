/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { CopyIcon } from "@components/Icons";
import { Clipboard, Menu } from "@webpack/common";

import { UserContextProps, UserTimeZoneConfig } from "../types";
import { openUserModal } from "./UserModal";

export const UserContextMenuPatch: NavContextMenuPatchCallback = (children, { user }: UserContextProps) => () => {
    if (!user) return;
    const copyUsernameItem = <Menu.MenuItem
        id="vc-copy-username"
        label="Copy Username"
        action={() => Clipboard.copy(`${user.username}`)}
        icon={CopyIcon}
    />;
    children.push(copyUsernameItem);

    children.push(
        <Menu.MenuItem
            id="vc-user-time-zone-settings"
            label="User's time zone settings"
            action={() => openUserModal(user)}
        ></Menu.MenuItem>
    );
};
