/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import { ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalRoot, ModalSize, openModal } from "@utils/modal";
import { useForceUpdater } from "@utils/react";
import {
    Forms,
    GuildStore,
    Paginator, React,
    Select,
    SelectedGuildStore,
    Switch,
    Text,
    useRef,
    useState
} from "@webpack/common";
import { Guild, User } from "discord-types/general";
import moment from "moment-timezone";

import { muiStoreService } from "../index";
import { UserTimestampConfig } from "../types";
import { cl } from "../utils";
import { Margins } from "@utils/margins";
import { settings } from "../settings";


const pageSize: number = 25;

export function openUserModal(user: User) {
    openModal(props =>
        <UserModal modalProps={props} user={user} />
    );
}

function UserModal({ modalProps, user }: { modalProps: any; user: User; }) {
    const userTimestampConfig = muiStoreService.getUserTimezoneConfigCache(user.id);
    const ref = useRef<HTMLDivElement>(null);
    const [selectedTimezone, setSelectedTimezone] = useState<string>(userTimestampConfig.timezone);
    const [showLocalTimestampsInMessages, setShowLocalTimestampsInMessages] = useState<boolean>(userTimestampConfig.showInMessages);

    const tzNames = moment.tz.names();
    const tzNamesSelection = tzNames.map(name => {
        return { label: name, value: name };
    });


    const saveUserTimezone = (newValue: string) => {
        setSelectedTimezone(newValue);
        const newConfig: UserTimestampConfig = {
            ...userTimestampConfig,
            timezone: newValue
        };
        muiStoreService.storeUserTimezoneConfig(newConfig);
    };

    const saveShowInMessages = (newValue: boolean) => {
        setShowLocalTimestampsInMessages(newValue);
        const newConfig: UserTimestampConfig = {
            ...userTimestampConfig,
            showInMessages: newValue
        };
        muiStoreService.storeUserTimezoneConfig(newConfig);
    };

    return (
        <ErrorBoundary>
            <ModalRoot {...modalProps} size={ModalSize.MEDIUM}>
                <ModalHeader>
                    <Text variant="heading-lg/semibold" style={{ flexGrow: 1 }}>Manage MoreUserInfo for {user.username}</Text>
                    <ModalCloseButton onClick={modalProps.onClose} />
                </ModalHeader>
                <ModalContent>
                    <div style={{ padding: "0.5rem" }}>
                        <Forms.FormSection>
                            <Forms.FormTitle tag="h5">
                                Options for showing timestamps in this user's local timezone
                            </Forms.FormTitle>
                            <Select
                                className={Margins.bottom20}
                                placeholder={`${user.username}'s timezone`}
                                options={tzNamesSelection}
                                select={v => saveUserTimezone(v)}
                                isSelected={v => v === selectedTimezone}
                                serialize={v => v}
                            ></Select>
                            <Forms.FormText></Forms.FormText>
                            <Switch
                                value={showLocalTimestampsInMessages}
                                onChange={v => saveShowInMessages(v)}
                            >Show {user.username}'s local time next to their messages</Switch>
                        </Forms.FormSection>
                    </div>
                </ModalContent>
                <ModalFooter>

                </ModalFooter>
            </ModalRoot>
        </ErrorBoundary>
    );
}
