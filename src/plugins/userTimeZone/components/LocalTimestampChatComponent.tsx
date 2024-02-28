/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
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

import ErrorBoundary from "@components/ErrorBoundary";
import { classes } from "@utils/misc";
import { findByPropsLazy } from "@webpack";
import { Timestamp, UserStore } from "@webpack/common";
import { Message } from "discord-types/general";

import { utzStoreService } from "../index";
import { settings } from "../settings";
import { convertUtcDateToUsersLocalDate } from "../utils";

const styles: Record<string, string> = findByPropsLazy("timestampInline");

const AUTO_MODERATION_ACTION = 24;

function shouldShow(message: Message): boolean {
    if (!settings.store.enableUserTimestamps)
        return false;
    if (message.author.bot || message.author.system || message.type === AUTO_MODERATION_ACTION)
        return false;
    if (message.author.id === UserStore.getCurrentUser().id)
        return false;
    const config = utzStoreService.getUserTimeZoneConfigCache(message.author.id);
    if (!config || !config.showInMessages)
        return false;
    if (config.timeZone === Intl.DateTimeFormat().resolvedOptions().timeZone)
        return false;

    return true;
}

export const LocalTimestampChatComponentWrapper = ErrorBoundary.wrap(({ message }: { message: Message; }) => {
    return shouldShow(message)
        ? <LocalTimestampChatComponent message={message} />
        : null;
}, { noop: true });

export const CompactLocalTimestampChatComponentWrapper = ErrorBoundary.wrap(({ message }: { message: Message; }) => {
    return shouldShow(message)
        ? <CompactLocalTimestampChatComponent message={message} />
        : null;
}, { noop: true });

function LocalTimestampChatComponent({ message }: { message: Message; }) {
    const messageTimestampUtc = new Date(message.timestamp.valueOf());
    const config = utzStoreService.getUserTimeZoneConfigCache(message.author.id);
    if (!config || config.timeZone === "Universal") return null;

    const convertedTimestamp = convertUtcDateToUsersLocalDate(messageTimestampUtc, config);

    return convertedTimestamp
        ? (
            <span
                className={classes(styles.timestampInline, styles.timestamp)}
            >• Their local time:<Timestamp timestamp={convertedTimestamp}></Timestamp></span>
        )
        : null;
}

export const CompactLocalTimestampChatComponent = ErrorBoundary.wrap(({ message }: { message: Message; }) => {
    const result = "<t:1708913880> ";

    return result
        ? (
            <span
                className={classes(styles.timestampInline, styles.timestamp, "vc-pronoundb-compact")}
            >• {result}</span>
        )
        : null;
}, { noop: true });
