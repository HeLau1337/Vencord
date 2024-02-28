/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { i18n } from "@webpack/common";

import { settings } from "./settings";

export function getTime(timezone: string, timestamp: string | number, props: Intl.DateTimeFormatOptions = {}) {
    const date = new Date(timestamp);
    const formatter = new Intl.DateTimeFormat(i18n?.getLocale?.() ?? "en-US", {
        hour12: !settings.store["24h Time"],
        timeZone: timezone,
        ...props
    });
    return formatter.format(date);
}

export function getCurrentDateForFileName(): string {
    const now = new Date(Date.now());
    const year = now.getFullYear().toString().padStart(4, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${year}${month}${day}-${hours}${minutes}`;
}
