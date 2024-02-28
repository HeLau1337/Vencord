/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { CopyIcon } from "@components/Icons";
import { Clipboard, Menu } from "@webpack/common";

import { muiStoreService } from "../index";
import { settings } from "../settings";
import { UserContextProps, UserTimestampConfig } from "../types";
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


    const showLocalTimestampsInMessagesItem =
        <Menu.MenuItem
            id="vc-local-user-mngmnt"
            label="Local User Mngmnt"
            action={() => openUserModal(user)}
        ></Menu.MenuItem>;
    children.push(showLocalTimestampsInMessagesItem);


    if (settings.store.enableUserTimestamps) {
        const config = muiStoreService.getUserTimezoneConfigCache(user.id);
        const timestampInMessagesElement =
            <Menu.MenuCheckboxItem
                id="vc-show-local-timestamps-messages"
                checked={config?.showInMessages ?? false}
                label="Local time in msgs"
                action={async () => {
                    if (config) {
                        config.showInMessages = !config?.showInMessages;
                        await muiStoreService.storeUserTimezoneConfig(config);
                    } else {
                        const config: UserTimestampConfig = {
                            userId: user.id,
                            timeZone: "",
                            showInMessages: true
                        };
                        await muiStoreService.storeUserTimezoneConfig(config);
                    }
                }}
            />;
        children.push(timestampInMessagesElement);
    }
};
