/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { DataStore } from "@api/index";

import { getCustomRoles, getUserRoleAssignments, setCustomRoles, settings, setUserRoleAssignments } from "./index";
import { CustomRole } from "./interfaces";
import { makeEmptyCustomRolesArray } from "./utils";


export const CUSTOM_ROLES_KEY = "LocalRoleIcons_customRoles";
export const USER_ROLE_ASSIGNMENTS_KEY = "LocalRoleIcons_userRoleAssignments";


export async function fetchCustomRoles() {
    let newCustomRoles: CustomRole[] = makeEmptyCustomRolesArray();
    if (settings.store.saveDataInSettings) {
        newCustomRoles = settings.store.customRoles;
        // console.debug("Getting the following customRoles from settings.json:", newCustomRoles);
    } else {
        newCustomRoles = await DataStore.get(CUSTOM_ROLES_KEY) ?? makeEmptyCustomRolesArray();
        // console.debug("Getting the following customRoles from DataStore:", newCustomRoles);
    }

    setCustomRoles(newCustomRoles);
}

export async function storeCustomRoles() {
    const customRolesCopy = getCustomRoles();
    /* if (customRolesCopy.length >= 1) {
        const lastCustomRole = customRolesCopy[customRolesCopy.length - 1];
        if (lastCustomRole.name === "" && lastCustomRole.icon === "") {
            customRolesCopy.pop();
        }
    } */
    if (settings.store.saveDataInSettings && settings.store.customRoles) {
        settings.store.customRoles = customRolesCopy;
        // console.debug("Saving the following customRoles in settings.json:", customRolesCopy);
    } else {
        await DataStore.set(CUSTOM_ROLES_KEY, customRolesCopy);
        // console.debug("Saving the following customRoles in DataStore:", customRolesCopy);
    }
}

export async function fetchUserRoleAssignments() {
    let newUserRoleAssignements: Record<string, number[]> = {};
    if (settings.store.saveDataInSettings && settings.store.userRoleAssignments) {
        newUserRoleAssignements = settings.store.userRoleAssignments;
        // console.debug("Getting the following userRoleAssignments from settings.json:", newUserRoleAssignements);
    } else {
        newUserRoleAssignements = await DataStore.get(USER_ROLE_ASSIGNMENTS_KEY) ?? {};
        // console.debug("Getting the following userRoleAssignments from DataStore:", newUserRoleAssignements);
    }
    setUserRoleAssignments(newUserRoleAssignements);
}

export async function storeUserRoleAssignments() {
    if (settings.store.saveDataInSettings) {
        settings.store.userRoleAssignments = getUserRoleAssignments();
        // console.debug("Saving the following userRoleAssignments in settings.json:", getUserRoleAssignments());
    } else {
        await DataStore.set(USER_ROLE_ASSIGNMENTS_KEY, getUserRoleAssignments());
        // console.debug("Saving the following userRoleAssignments in DataStore:", getUserRoleAssignments());
    }
}

export async function storeAll() {
    await storeCustomRoles();
    await storeUserRoleAssignments();
}

