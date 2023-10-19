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

// code copied from "CopyUserURLs" plugin

import { addContextMenuPatch, removeContextMenuPatch } from "@api/ContextMenu";
import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { User } from "discord-types/general";

import { CustomRolesComponent } from "./components/CustomRolesComponent";
import { UserContextMenuPatch } from "./components/UserContextMenu";
import type { CustomRole } from "./interfaces";
import { fetchCustomRoles, fetchUserRoleAssignments, storeAll } from "./store";
import { makeEmptyCustomRolesArray } from "./utils";

/* export const customRoles: CustomRole[] = [
    {
        id: 1,
        name: "Idiot",
        icon: "X",
        description: "User I'm annoyed by and I need a reminder to be careful around them."
    },
    {
        id: 2,
        name: "Reposter",
        icon: "recycling arrows",
        description: "User who tends to ask for tech support on multiple Discord servers at once."
    },
    {
        id: 3,
        name: "Nice Person",
        icon: "<3",
        description: "An user that stood out to me because of kindness, humor, etc.",
        showIconInProfileOnly: true
    },
]; */
let customRoles: CustomRole[] = makeEmptyCustomRolesArray();
let userRoleAssignments: Record<User["id"], number[]> = {};

export function getCustomRoles() {
    return customRoles;
}

export function setCustomRoles(newCustomRoles: CustomRole[]) {
    customRoles = newCustomRoles;
}

export function getCustomRoleIdsForUser(user: User): number[] {
    return userRoleAssignments[user.id] ?? [];
}

export function setCustomRoleIdsForUser(customRoleIds: number[], user: User) {
    userRoleAssignments[user.id] = customRoleIds;
}

export function getUserRoleAssignments() {
    return userRoleAssignments;
}

export function setUserRoleAssignments(newUserRoleAssignments: Record<User["id"], number[]>) {
    userRoleAssignments = newUserRoleAssignments;
}

export const settings = definePluginSettings({
    saveDataInSettings: {
        type: OptionType.BOOLEAN,
        description: "Save plugin data in settings.json instead of the browser's local storage. Using the settings.json allows the plugin settings to be synced using Vencord's Cloud Sync.",
        default: false,
        onChange: value => {
            settings.store.saveDataInSettings = value;
            storeAll();
        }
    },
    customRoles: {
        type: OptionType.COMPONENT,
        description: "",
        component: CustomRolesComponent
    },
    userRoleAssignments: {
        type: OptionType.COMPONENT,
        description: "",
        component: () => { return <></>; }
    }
});

export default definePlugin({
    name: "LocalRoleIcons",
    authors: [],
    description: "Adds custom role icons to any user on any server that are only visible locally.",
    settings: settings,

    start() {
        fetchCustomRoles();
        fetchUserRoleAssignments();
        addContextMenuPatch("user-context", UserContextMenuPatch);
    },

    stop() {
        removeContextMenuPatch("user-context", UserContextMenuPatch);
    },
});

