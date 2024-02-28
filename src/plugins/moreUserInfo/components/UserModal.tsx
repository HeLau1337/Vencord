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
    Switch,
    Text,
    Tooltip,
    useRef,
    useState
} from "@webpack/common";
import { User } from "discord-types/general";
import moment from "moment-timezone";

import { muiStoreService } from "../index";
import { UserTimestampConfig } from "../types";
import { Common } from "webpack";
import { SelectOption } from "@webpack/types";


export function openUserModal(user: User) {
    openModal(props =>
        <UserModal modalProps={props} user={user} />
    );
}

function buildTimeZoneOption(tzName: string): SelectOption {
    const now = Date.now();
    const zone = moment.tz.zone(tzName);
    const abbr = zone?.abbr(now);

    let offset = zone?.utcOffset(now);
    let gmtOffset: string | undefined = undefined;
    if (offset) {
        // moment.js returns "inverted" utcOffsets https://momentjs.com/timezone/docs/#/zone-object/offset/
        // but since that's not what the normal user expects, I invert the inversion again (* -1) for generating the label
        offset = offset * -1;
        let sign = Math.sign(offset) === 1 ? "+" : "";
        let offsetHours = Math.floor(offset / 60);
        let offsetMinutes = Math.abs(offset % 60); // there are time zones with utcOffsets like 5:45
        gmtOffset = `GMT${sign}${offsetHours}`;
        if (offsetMinutes !== 0) gmtOffset += `:${offsetMinutes}`;
    }

    const spacer = "  |  ";
    let label = tzName;
    if (abbr) label += `${spacer}${abbr}`;
    if (gmtOffset) label += `${spacer}${gmtOffset}`;
    return {
        label: label,
        value: tzName
    } as SelectOption;
}

function getTimeZoneSelectOptions(): SelectOption[] {
    const tzNames = moment.tz.names();
    let selectOptions: SelectOption[] = [];

    tzNames.forEach(name => {
        selectOptions.push(buildTimeZoneOption(name));
    });
    return selectOptions;
}

function UserModal({ modalProps, user }: { modalProps: ModalProps; user: User; }) {
    const { onClose } = modalProps;
    const [errors, setErrors] = React.useState<Record<string, boolean>>({});
    const [saveError, setSaveError] = React.useState<string | null>(null);

    const canSubmit = () => Object.values(errors).every(e => !e);

    const userTimestampConfig = muiStoreService.getUserTimezoneConfigCache(user.id);
    const ref = useRef<HTMLDivElement>(null);
    const [selectedTimezone, setSelectedTimezone] = useState<string>(userTimestampConfig.timeZone);
    const [showLocalTimestampsInMessages, setShowLocalTimestampsInMessages] = useState<boolean>(userTimestampConfig.showInMessages);

    const tzSelectOptions: ReadonlyArray<SelectOption> = getTimeZoneSelectOptions();

    async function saveAndClose() {
        const newConfig: UserTimestampConfig = {
            ...userTimestampConfig,
            timeZone: selectedTimezone,
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
                            <div className={Margins.bottom20}>
                                <Common.SearchableSelect
                                    placeholder={`${user.username}'s timezone`}
                                    options={tzSelectOptions}
                                    onChange={v => setSelectedTimezone(v)}
                                    value={buildTimeZoneOption(selectedTimezone)}
                                ></Common.SearchableSelect>
                            </div>
                            <Switch
                                value={showLocalTimestampsInMessages}
                                onChange={v => setShowLocalTimestampsInMessages(v)}
                                note={"This will only work if their time zone is different to yours."}
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
