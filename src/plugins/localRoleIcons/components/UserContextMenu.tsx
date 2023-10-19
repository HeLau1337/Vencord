/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { InfoIcon } from "@components/Icons";
import { Menu } from "@webpack/common";
import { User } from "discord-types/general";
import React from "react";

import { getCustomRoleIdsForUser, getCustomRoles } from "../index";
import { CustomRole, UserContextProps } from "../interfaces";
import { toggleRoleForUser } from "../utils";
import { openLocalRoleManagementModal } from "./Modal";

function getCustomRolesList(): CustomRole[] {
    const customRolesCopy = getCustomRoles();
    if (customRolesCopy.length >= 1) {
        const lastCustomRole = customRolesCopy[customRolesCopy.length - 1];
        if (lastCustomRole.name === "" && lastCustomRole.icon === "") {
            customRolesCopy.pop();
        }
    }
    return customRolesCopy;
}

export const UserContextMenuPatch: NavContextMenuPatchCallback = (children, { user }: UserContextProps) => () => {
    children.push(LocalRolesContextMenu(user));
};

function LocalRolesContextMenu(user: User) {
    /* async function getCustomRoleIdsForUserAsync(user: User): Promise<number[]> {
        return new Promise<number[]>(resolve => {
            resolve(getCustomRoleIdsForUser(user));
        });
    }
    const [customRoleIdsForUser, setCustomRoleIdsForUser] = React.useState<number[]>(getCustomRoleIdsForUser(user));

    React.useEffect(() => {
        getCustomRoleIdsForUserAsync(user).then(setCustomRoleIdsForUser);
    }, []); */
    const customRoleIdsForUser = getCustomRoleIdsForUser(user);
    return (
        <Menu.MenuItem
            id="vc-manage-local-roles-quick-access"
            label="Local Roles"
        >
            <Menu.MenuItem
                id="vc-manage-local-roles"
                label="Manage Local Roles"
                action={() => openLocalRoleManagementModal(user)}
                icon={InfoIcon}
            />
            {getCustomRolesList().length > 0 ? <Menu.MenuSeparator /> : <></>}
            {Object.values(getCustomRoles()).map(role => (
                <Menu.MenuCheckboxItem
                    key={role.id}
                    group="vc-manage-local-roles-quick-access"
                    id={"local-role-" + role.id}
                    label={role.name}
                    checked={(customRoleIdsForUser.find(roleId => roleId === role.id) !== undefined)}
                    // action={() => toggleRoleForUser(role, user)}
                    action={async () => await toggleRoleForUser(role, user)}
                />
            ))}
        </Menu.MenuItem>);
}
