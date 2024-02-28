/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { DataStore } from "@api/index";

import { UserTimeZoneConfig, UserTimeZoneStore } from "./types";


export class UtzStoreService {
    private readonly PLUGIN_PREFIX = "UserTimeZone_";
    private readonly USER_TIME_ZONE_STORE_KEY = this.PLUGIN_PREFIX + "UserTimeZoneConfig";

    private userTimeZoneCache: UserTimeZoneStore;

    constructor() {
        this.userTimeZoneCache = {};
    }

    getUserTimeZoneConfigCache(userId: string) {
        if (!this.userTimeZoneCache[userId])
            return this.getDefaultUserTimeZoneConfig(userId);
        return this.userTimeZoneCache[userId];
    }

    refreshCache() {
        this.getAllUserTimeZoneConfigs();
    }

    async storeUserTimezoneConfig(config: UserTimeZoneConfig) {
        try {
            await DataStore.update<UserTimeZoneStore>(this.USER_TIME_ZONE_STORE_KEY, storedConfigs => {
                storedConfigs ??= {};
                storedConfigs[config.userId] = {
                    ...storedConfigs?.[config.userId] ?? this.getDefaultUserTimeZoneConfig(config.userId),
                    ...config
                };
                this.userTimeZoneCache = storedConfigs;
                return storedConfigs;
            });
            console.log(`Successfully updated user time zone config for ${config.userId}`);
        } catch (error) {
            console.error("Error while storing user time zone config:", error);
        }
    }

    async getUserTimeZoneConfig(userId: string) {
        const configs: UserTimeZoneStore | undefined = await DataStore.get(this.USER_TIME_ZONE_STORE_KEY);
        if (configs)
            this.userTimeZoneCache = configs;
        else
            return configs;

        if (!configs[userId])
            return this.getDefaultUserTimeZoneConfig(userId);
        return configs[userId];
    }

    async getAllUserTimeZoneConfigs() {
        return DataStore
            .get<UserTimeZoneStore>(this.USER_TIME_ZONE_STORE_KEY)
            .then(configs => {
                if (configs) this.userTimeZoneCache = configs;
                return configs;
            });
    }

    private getDefaultUserTimeZoneConfig(userId: string): UserTimeZoneConfig {
        const { timeZone, locale } = Intl.DateTimeFormat().resolvedOptions();
        return {
            userId: userId,
            timeZone: "Universal",
            showInMessages: false,
            locale: locale
        };
    }
}


