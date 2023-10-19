/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { User } from "discord-types/general";

import { getCustomRoleIdsForUser, getCustomRoles, getUserRoleAssignments, setCustomRoleIdsForUser } from ".";
import type { CustomRole } from "./interfaces";
import { storeUserRoleAssignments } from "./store";

export const makeEmptyCustomRole: () => CustomRole = () => ({
    id: (getCustomRoles() === undefined || getCustomRoles().length === 0) ? 1 : getNextRoleId(),
    name: "",
    description: "",
    icon: "",
    showIconInProfileOnly: false,
});
export const makeEmptyCustomRolesArray = (): CustomRole[] => [makeEmptyCustomRole()];

function getNextRoleId(): number {
    const customRoles = getCustomRoles();
    if (customRoles.length === 0) {
        // If the array is empty, start with ID 1
        return 1;
    }

    // Find the maximum ID in the array using the reduce function
    const maxId = customRoles.reduce((max, role) => (role.id > max ? role.id : max), 0);

    // Increment the maximum ID to get the next ID
    return maxId + 1;
}


export function getCustomRolesForUser(user: User): CustomRole[] {
    if (getUserRoleAssignments() !== undefined) {
        const customRoleIds = getCustomRoleIdsForUser(user);
        if (customRoleIds === undefined) {
            return []; // No custom roles for this user
        }

        const customRolesForUser = getCustomRoles().filter(role => customRoleIds.includes(role.id));
        return customRolesForUser;
    } else
        return [];
}

export async function toggleRoleForUser(role: CustomRole, user: User) {
    // userRoleAssignments = getUserRoleAssignments();
    // console.debug("in toggleRoleForUser()");
    let customRoleIdsForUser: number[] = getCustomRoleIdsForUser(user);
    // console.debug("customRolesForUser before:", customRoleIdsForUser);
    if (customRoleIdsForUser === undefined || customRoleIdsForUser.length === 0) {
        customRoleIdsForUser = [role.id,];
    } else if (customRoleIdsForUser.find(roleId => roleId === role.id) !== undefined) {
        // remove user-role-assignement
        customRoleIdsForUser = customRoleIdsForUser.filter(userRoleId => userRoleId !== role.id);
    } else if (customRoleIdsForUser.find(roleId => roleId === role.id) === undefined) {
        // add user-role-assignment
        customRoleIdsForUser.push(role.id);
    }
    setCustomRoleIdsForUser(customRoleIdsForUser, user);
    // console.debug("customRolesForUser after:", customRoleIdsForUser);
    return storeUserRoleAssignments();
}

