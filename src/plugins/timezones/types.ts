/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export interface LocalUserTimestamp {
    userId: string;
    timestamp?: string;
    type: "message" | "profile";
}

export interface TimezoneDataStore {
    // key: userId, value: name of user's timezone
    [key: string]: string | null;
}
