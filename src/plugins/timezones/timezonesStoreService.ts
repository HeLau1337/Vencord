/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import * as DataStore from "@api/DataStore";

import { settings } from "./settings";
import { TimezoneDataStore } from "./types";

export class TimezonesStoreService {
    private readonly DATASTORE_KEY = "vencord-timezones";

    private userTimezoneCache: TimezoneDataStore = {};

    constructor() {
        let dbData;
        this.fetchTimezonesDataFromDb().then(timezones => {
            if (timezones)
                dbData = timezones;
        }).finally(() => {
            const settingsJsonData: TimezoneDataStore = settings.store.timezoneData;

            if (settings.store.useSettingsJsonForTimezoneData && settingsJsonData) {
                this.userTimezoneCache = settingsJsonData;
            } else if (!settings.store.useSettingsJsonForTimezoneData && dbData) {
                this.userTimezoneCache = dbData;
            } else if (!settings.store.useSettingsJsonForTimezoneData && !dbData && settingsJsonData) {
                this.userTimezoneCache = settingsJsonData;
            } else if (settings.store.useSettingsJsonForTimezoneData && !settingsJsonData && dbData) {
                this.userTimezoneCache = dbData;
            }
            this.overwriteStoredData(this.userTimezoneCache);
        });
    }

    private async fetchTimezonesDataFromDb(): Promise<TimezoneDataStore | undefined> {
        const data = await DataStore.get<TimezoneDataStore>(this.DATASTORE_KEY);
        if (data) {
            if (!settings.store.useSettingsJsonForTimezoneData) this.userTimezoneCache = data;
            return data;
        }
    }

    async getAllTimezonesData(): Promise<TimezoneDataStore> {
        if (settings.store.useSettingsJsonForTimezoneData) {
            return new Promise<TimezoneDataStore>((resolve, reject) => {
                this.userTimezoneCache = settings.store.timezoneData ?? {};
                resolve(this.userTimezoneCache);
            });
        } else {
            return await this.fetchTimezonesDataFromDb() ?? {};
        }
    }

    getUserTimezone(userId: string): string | null {
        return this.userTimezoneCache[userId];
    }

    async setUserTimezone(userId: string, timezone: string | null) {
        this.userTimezoneCache[userId] = timezone;
        await this.overwriteStoredData(this.userTimezoneCache);
    }

    async overwriteStoredData(newData: TimezoneDataStore) {
        this.userTimezoneCache = newData;
        if (settings.store.useSettingsJsonForTimezoneData) {
            await new Promise<void>((resolve, reject) => {
                settings.store.timezoneData = this.userTimezoneCache;
                resolve();
            });
        } else {
            await DataStore.set(this.DATASTORE_KEY, this.userTimezoneCache);
        }
    }
}
