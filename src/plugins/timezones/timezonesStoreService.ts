/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import * as DataStore from "@api/DataStore";
import { isObject } from "@utils/misc";

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
            const dbDataValid = this.isValid(dbData);
            const jsonDataValid = this.isValid(settingsJsonData);
            if (settings.store.useSettingsJsonForTimezoneData && jsonDataValid) {
                this.userTimezoneCache = settingsJsonData;
            } else if (!settings.store.useSettingsJsonForTimezoneData && dbDataValid) {
                this.userTimezoneCache = dbData;
            } else if (!settings.store.useSettingsJsonForTimezoneData && !dbDataValid && jsonDataValid) {
                this.userTimezoneCache = settingsJsonData;
            } else if (settings.store.useSettingsJsonForTimezoneData && !jsonDataValid && dbDataValid) {
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
        if (timezone == null) {
            delete this.userTimezoneCache[userId];
        } else {
            this.userTimezoneCache[userId] = timezone;
        }
        await this.overwriteStoredData(this.userTimezoneCache);
    }

    private isValid(data: any): boolean {
        console.debug("[vc-timezones] Starting data validation for the following input:", data);
        if (isObject(data)) {
            for (const key in data) {
                const value = data[key];
                if (!/^[0-9]+$/.test(key) || (typeof value !== "string" && value !== null)) {
                    console.debug(`[vc-timezones] Data validation | INVALID key-value-pair found: ${key}: ${value}`);
                    return false; // Key not a string of digits or value not a string
                }
                console.debug(`[vc-timezones] Data validation | valid key-value-pair: ${key}: ${value}`);
            }
            console.debug("[vc-timezones] Data validation | Successfully completed!");
            return true;
        }
        console.debug("[vc-timezones] Data validation | input data is not an object");
        return false;
    }

    async overwriteStoredData(newData: TimezoneDataStore) {
        if (!this.isValid(newData)) {
            return new Promise<void>((resolve, reject) => reject("Invalid input data!"));
        }
        this.userTimezoneCache = newData;
        if (settings.store.useSettingsJsonForTimezoneData) {
            return new Promise<void>((resolve, reject) => {
                settings.store.timezoneData = this.userTimezoneCache;
                resolve();
            });
        } else {
            return DataStore.set(this.DATASTORE_KEY, this.userTimezoneCache);
        }
    }
}
