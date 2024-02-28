/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import * as DataStore from "@api/DataStore";

export class TimezonesStoreService {
    private readonly DATASTORE_KEY = "vencord-timezones";

    private userTimezoneCache: Record<string, string | null> = {};

    constructor() {
        this.fetchTimezonesData().then(timezones => {
            if (timezones)
                this.userTimezoneCache = timezones;
        });
    }

    async fetchTimezonesData(): Promise<Record<string, string>> {
        return await DataStore.get<Record<string, string>>(this.DATASTORE_KEY) || {};
    }

    getUserTimezone(userId: string): string | null {
        return this.userTimezoneCache[userId];
    }

    async setUserTimezone(userId: string, timezone: string | null) {
        this.userTimezoneCache[userId] = timezone;
        await DataStore.set(this.DATASTORE_KEY, this.userTimezoneCache);
    }

    async overrideStoredData(newData: Record<string, string>) {
        this.userTimezoneCache = newData;
        await DataStore.set(this.DATASTORE_KEY, this.userTimezoneCache);
    }
}
