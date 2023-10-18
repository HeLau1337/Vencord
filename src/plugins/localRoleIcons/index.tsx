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

import { addContextMenuPatch, NavContextMenuPatchCallback, removeContextMenuPatch } from "@api/ContextMenu";
import { DataStore } from "@api/index";
import { definePluginSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Flex } from "@components/Flex";
import { DeleteIcon, InfoIcon } from "@components/Icons";
import { closeModal, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalRoot, ModalSize, openModal } from "@utils/modal";
import { useForceUpdater } from "@utils/react";
import definePlugin, { OptionType } from "@utils/types";
import { Button, Forms, Menu, React, Select, Text, TextInput, useState } from "@webpack/common";
import type { User } from "discord-types/general";

import type { CustomRole, UserContextProps } from "./interfaces";

const customRolesKey = "LocalRoleIcons_customRoles";
const userRoleAssignmentsKey = "LocalRoleIcons_userRoleAssignments";

const makeEmptyCustomRole: () => CustomRole = () => ({
    id: (customRoles === undefined || customRoles.length === 0) ? 1 : getNextRoleId(),
    name: "",
    description: "",
    icon: "",
    showIconInProfileOnly: false,
});
const makeEmptyCustomRolesArray = (): CustomRole[] => [makeEmptyCustomRole()];
// const customRoles: CustomRole[] = [];
const customRoles: CustomRole[] = [
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
];
let userRoleAssignments: Record<string, any> = {};

function getNextRoleId(): number {
    if (customRoles.length === 0) {
        // If the array is empty, start with ID 1
        return 1;
    }

    // Find the maximum ID in the array using the reduce function
    const maxId = customRoles.reduce((max, role) => (role.id > max ? role.id : max), 0);

    // Increment the maximum ID to get the next ID
    return maxId + 1;
}

function openLocalRoleManagementModal(user: User) {
    const key = openModal(props => (
        <ErrorBoundary>
            <ModalRoot {...props} size={ModalSize.MEDIUM}>
                <ModalHeader>
                    <Text variant="heading-lg/semibold" style={{ flexGrow: 1 }}>Manage local user roles for {user.username}</Text>
                    <ModalCloseButton onClick={() => closeModal(key)} />
                </ModalHeader>
                <ModalContent>
                    <div style={{ padding: "16px 0" }}>
                        <Text>
                            Username: {user.username} (id: {user.id})
                        </Text>
                    </div>
                </ModalContent >
                <ModalFooter>
                    <Flex cellSpacing={10}>
                        <Button onClick={() => closeModal(key)}>
                            Close
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalRoot >
        </ErrorBoundary >
    ));
}

function getCustomRolesForUser(user: User): CustomRole[] {
    if (userRoleAssignments !== undefined) {
        const customRoleIds = userRoleAssignments[user.id];
        if (customRoleIds === undefined) {
            return []; // No custom roles for this user
        }

        const customRolesForUser = customRoles.filter(role => customRoleIds.includes(role.id));
        return customRolesForUser;
    } else
        return [];
}

async function toggleRoleForUser(role: CustomRole, user: User) {
    userRoleAssignments = getUserRoleAssignments();
    console.debug("in toggleRoleForUser()");
    let customRoleIdsForUser: number[] = userRoleAssignments[user.id];
    console.debug("customRoleIdsForUser before:", customRoleIdsForUser);
    if (customRoleIdsForUser === undefined || customRoleIdsForUser.length === 0) {
        customRoleIdsForUser = [role.id,];
    } else if (role.id in customRoleIdsForUser) {
        // remove user-role-assignement
        const deleteIndex = customRoleIdsForUser.findIndex(userRoleId => userRoleId === role.id);
        customRoleIdsForUser = customRoleIdsForUser.splice(deleteIndex);
    } else if (!(role.id in customRoleIdsForUser)) {
        // add user-role-assignment
        customRoleIdsForUser.push(role.id);
    }
    userRoleAssignments[user.id] = customRoleIdsForUser;
    console.debug("customRoleIdsForUser after:", customRoleIdsForUser);
    await saveUserRoleAssignments();
}

const UserContextMenuPatch: NavContextMenuPatchCallback = (children, { user }: UserContextProps) => () => {
    // const update = useForceUpdater();
    children.push(
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
            {customRoles.length > 0 ? <Menu.MenuSeparator /> : <></>}
            {Object.values(customRoles).map(role => (
                <Menu.MenuCheckboxItem
                    key={role.id}
                    group="vc-manage-local-roles-quick-access"
                    id={"local-role-" + role.id}
                    label={role.name}
                    checked={(role.id in getCustomRolesForUser(user))}
                    // action={() => toggleRoleForUser(role, user)}
                    action={async () => {
                        console.debug("in action");
                        await toggleRoleForUser(role, user);
                        // update();
                    }}
                />
            ))}
        </Menu.MenuItem>
    );
};

const settings = definePluginSettings({
    saveDataInSettings: {
        type: OptionType.BOOLEAN,
        description: "Save plugin data in settings.json instead of the browser's local storage. Using the settings.json allows the plugin settings to be synced using Vencord's Cloud Sync.",
        default: false,
        onChange: value => {
            settings.store.saveDataInSettings = value;
            saveAll();
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

function CustomTextInput({ initialValue, onChange, placeholder }: {
    placeholder: string;
    initialValue: string;
    onChange(value: string): void;
}) {
    const [value, setValue] = useState(initialValue);
    return (
        <TextInput
            placeholder={placeholder}
            value={value}
            onChange={setValue}
            spellCheck={false}
            onBlur={() => value !== initialValue && onChange(value)}
        />
    );
}

function getCustomRoles() {
    if (settings.store.saveDataInSettings) {
        return settings.store.customRoles ?? makeEmptyCustomRolesArray();
    } else {
        DataStore.get(customRolesKey).then(storedCustomRoles => {
            return storedCustomRoles ?? makeEmptyCustomRolesArray();
        });
    }
}

async function saveCustomRoles() {
    if (settings.store.saveDataInSettings) {
        settings.store.customRoles = customRoles;
    } else {
        await DataStore.set(customRolesKey, customRoles);
    }
}

function getUserRoleAssignments(): Record<string, number[]> {
    if (settings.store.saveDataInSettings) {
        return settings.store.userRoleAssignments ?? {};
    } else {
        DataStore.get(userRoleAssignmentsKey).then(storedAssignments => {
            return storedAssignments ?? {};
        });
    }
    return {};
}

async function saveUserRoleAssignments() {
    if (settings.store.saveDataInSettings) {
        settings.store.userRoleAssignments = userRoleAssignments;
    } else {
        await DataStore.set(userRoleAssignmentsKey, userRoleAssignments);
    }
}

async function saveAll() {
    await saveUserRoleAssignments();
    await saveCustomRoles();
}

function CustomRolesComponent() {
    const update = useForceUpdater();

    async function onClickRemove(index: number) {
        if (index === customRoles.length - 1) return;
        customRoles.splice(index, 1);
        // removeRoleFromAllUserAssignments();

        await DataStore.set(customRolesKey, customRoles);
        update();
    }

    async function onChange(e: string, index: number, key: string) {
        if (index === customRoles.length - 1)
            customRoles.push(makeEmptyCustomRole());

        customRoles[index][key] = e;

        if (customRoles[index].id === undefined && customRoles[index].name === "" && customRoles[index].description === "" && customRoles[index].icon === "" && index !== customRoles.length - 1)
            customRoles.splice(index, 1);

        await DataStore.set(customRolesKey, customRoles);
        update();
    }

    return (
        <>
            <Forms.FormTitle tag="h4">Manage Local Custom Roles</Forms.FormTitle>
            <Flex flexDirection="column" style={{ gap: "0.5em" }}>
                {
                    customRoles.map((role, index) =>
                        <React.Fragment key={`${role.id}-${index}`}>
                            <Flex flexDirection="row" style={{ gap: 0 }}>
                                <Flex flexDirection="row" style={{ flexGrow: 1, gap: "0.5em" }}>
                                    <CustomTextInput
                                        placeholder="Role name"
                                        initialValue={role.name}
                                        onChange={e => onChange(e, index, "name")}
                                    />
                                    <CustomTextInput
                                        placeholder="Description"
                                        initialValue={role.description ?? ""}
                                        onChange={e => onChange(e, index, "description")}
                                    />
                                    <Select
                                        options={
                                            /* Formats.map(m => ({
                                                label: m,
                                                value: m
                                            }))*/
                                            [{ label: "test1", value: 1 }, { label: "test2", value: 2 },]
                                        }
                                        isSelected={v => v === role.icon}
                                        select={e => onChange(e, index, "icon")}
                                        serialize={v => v}
                                    /* renderOptionLabel={o => (
                                        <div className={cl("format-label")}>
                                            {Parser.parse(formatTimestamp(time, o.value))}
                                        </div>
                                    )}
                                    renderOptionValue={() => rendered}*/
                                    />
                                    <input type="checkbox"
                                        checked={role.showIconInProfileOnly}
                                        onChange={change => { }}
                                    />
                                </Flex>
                                <Button
                                    size={Button.Sizes.MIN}
                                    onClick={() => onClickRemove(index)}
                                    style={{
                                        background: "none",
                                        color: "var(--status-danger)",
                                        ...(index === customRoles.length - 1
                                            ? {
                                                visibility: "hidden",
                                                pointerEvents: "none"
                                            }
                                            : {}
                                        )
                                    }}
                                >
                                    <DeleteIcon />
                                </Button>
                            </Flex>
                        </React.Fragment>
                    )
                }
            </Flex>
        </>
    );
}

export default definePlugin({
    name: "Local Role Icons",
    authors: [],
    description: "Adds custom role icons to any user on any server that are only visible locally.",
    settings: settings,

    start() {
        addContextMenuPatch("user-context", UserContextMenuPatch);
        // customRoles = getCustomRoles();
        userRoleAssignments = getUserRoleAssignments();
    },

    stop() {
        removeContextMenuPatch("user-context", UserContextMenuPatch);
    },
});

