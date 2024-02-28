/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import { Flex } from "@components/Flex";
import { Margins } from "@utils/margins";
import {
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalProps,
    ModalRoot,
    ModalSize,
    openModal
} from "@utils/modal";
import {
    Button,
    Forms,
    React,
    Select,
    Switch,
    Text, Tooltip,
    useRef,
    useState
} from "@webpack/common";
import { User } from "discord-types/general";
import moment from "moment-timezone";

import { muiStoreService } from "../index";
import { UserTimestampConfig } from "../types";

export function openUserModal(user: User) {
    openModal(props =>
        <UserModal modalProps={props} user={user} />
    );
}

function UserModal({ modalProps, user }: { modalProps: ModalProps; user: User; }) {
    const { onClose } = modalProps;
    const [errors, setErrors] = React.useState<Record<string, boolean>>({});
    const [saveError, setSaveError] = React.useState<string | null>(null);

    const canSubmit = () => Object.values(errors).every(e => !e);


    const userTimestampConfig = muiStoreService.getUserTimezoneConfigCache(user.id);
    const ref = useRef<HTMLDivElement>(null);
    const [selectedTimezone, setSelectedTimezone] = useState<string>(userTimestampConfig.timezone);
    const [showLocalTimestampsInMessages, setShowLocalTimestampsInMessages] = useState<boolean>(userTimestampConfig.showInMessages);

    const tzNames = moment.tz.names();
    const tzNamesSelection = tzNames.map(name => {
        return { label: name, value: name };
    });

    async function saveAndClose() {
        const newConfig: UserTimestampConfig = {
            ...userTimestampConfig,
            timezone: selectedTimezone,
            showInMessages: showLocalTimestampsInMessages
        };
        await muiStoreService.storeUserTimezoneConfig(newConfig);
        onClose();
    }

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
                                select={v => setSelectedTimezone(v)}
                                isSelected={v => v === selectedTimezone}
                                serialize={v => v}
                            ></Select>
                            <Forms.FormText></Forms.FormText>
                            <Switch
                                value={showLocalTimestampsInMessages}
                                onChange={v => setShowLocalTimestampsInMessages(v)}
                            >Show {user.username}'s local time next to their messages</Switch>
                        </Forms.FormSection>
                    </div>
                </ModalContent>
                <ModalFooter>
                    <Flex flexDirection="column" style={{ width: "100%" }}>
                        <Flex style={{ marginLeft: "auto" }}>
                            <Button
                                onClick={onClose}
                                size={Button.Sizes.SMALL}
                                color={Button.Colors.PRIMARY}
                                look={Button.Looks.LINK}
                            >
                                Cancel
                            </Button>
                            <Tooltip text="You must fix all errors before saving" shouldShow={!canSubmit()}>
                                {({ onMouseEnter, onMouseLeave }) => (
                                    <Button
                                        size={Button.Sizes.SMALL}
                                        color={Button.Colors.BRAND}
                                        onClick={saveAndClose}
                                        onMouseEnter={onMouseEnter}
                                        onMouseLeave={onMouseLeave}
                                        disabled={!canSubmit()}
                                    >
                                        Save & Close
                                    </Button>
                                )}
                            </Tooltip>
                        </Flex>
                        {saveError && <Text variant="text-md/semibold" style={{ color: "var(--text-danger)" }}>Error while saving: {saveError}</Text>}
                    </Flex>
                </ModalFooter>
            </ModalRoot>
        </ErrorBoundary>
    );
}
