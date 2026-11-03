/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Heading } from "@components/Heading";
import { Margins } from "@components/margins";
import { timezonesStoreService } from "@plugins/timezones";
import { RenderModalProps } from "@vencord/discord-types";
import { Modal, SearchableSelect, useMemo, useState } from "@webpack/common";

export function SetTimezoneModal({ userId, modalProps }: { userId: string, modalProps: RenderModalProps; }) {
    const [currentValue, setCurrentValue] = useState<string | null>(timezonesStoreService.getUserTimezone(userId) ?? null);

    const options = useMemo(() => {
        return Intl.supportedValuesOf("timeZone").map(timezone => {
            const offset = new Intl.DateTimeFormat(undefined, { timeZone: timezone, timeZoneName: "short" })
                .formatToParts(new Date())
                .find(part => part.type === "timeZoneName")!.value;

            return { label: `${timezone} (${offset})`, value: timezone };
        });
    }, []);

    return (
        <Modal
            {...modalProps}
            title="Timezones"
            actions={[
                {
                    text: "Delete Timezone",
                    variant: "critical-primary",
                    onClick: async () => {
                        await timezonesStoreService.setUserTimezone(userId, null);
                        modalProps.onClose();
                    }
                },
                {
                    text: "Save",
                    variant: "primary",
                    disabled: currentValue === null,
                    onClick: async () => {
                        await timezonesStoreService.setUserTimezone(userId, currentValue!);
                        modalProps.onClose();
                    }
                }
            ]}
        >
            <section className={Margins.bottom16}>
                <Heading tag="h3">
                    Select Timezone
                </Heading>

                <SearchableSelect
                    options={options}
                    value={options.find(o => o.value === currentValue)}
                    placeholder={"Select a Timezone"}
                    maxVisibleItems={5}
                    closeOnSelect={true}
                    onChange={v => setCurrentValue(v)}
                    autoFocus={true}
                />
            </section>
        </Modal>
    );
}

