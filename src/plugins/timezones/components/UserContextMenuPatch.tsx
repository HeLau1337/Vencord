/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { User } from "@vencord/discord-types";
import { Menu, openModal } from "@webpack/common";

import { SetTimezoneModal } from "./TimezoneModal";


export const userContextMenuPatch: NavContextMenuPatchCallback = (children, { user }: { user: User; }) => {
    if (user?.id == null) return;

    const setTimezoneItem = (
        <Menu.MenuItem
            label="Set Timezone"
            id="set-timezone"
            action={() => openModal(modalProps => <SetTimezoneModal userId={user.id} modalProps={modalProps} />)}
        />
    );

    children.push(<Menu.MenuSeparator />, setTimezoneItem);

};
