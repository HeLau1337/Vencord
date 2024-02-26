/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { DataStore } from "@api/index";

import { UserTimestampConfig, UserTimestampStore } from "./types";


export class MuiStoreService {
    private readonly PLUGIN_PREFIX = "MoreUserInfo_";
    private readonly USER_TIMESTAMP_STORE_KEY = this.PLUGIN_PREFIX + "UserTimezoneConfig";

    private userTimestampCache: UserTimestampStore;

    constructor() {
        this.userTimestampCache = {};
    }

    getUserTimezoneConfigCache(userId: string) {
        if (!this.userTimestampCache[userId])
            return this.getDefaultUserTimezoneConfig(userId);
        return this.userTimestampCache[userId];
    }

    refreshCache() {
        this.getAllUserTimezoneConfigs();
    }

    async storeUserTimezoneConfig(config: UserTimestampConfig) {
        try {
            await DataStore.update<UserTimestampStore>(this.USER_TIMESTAMP_STORE_KEY, storedConfigs => {
                storedConfigs ??= {};
                storedConfigs[config.userId] = {
                    ...storedConfigs?.[config.userId] ?? this.getDefaultUserTimezoneConfig(config.userId),
                    ...config
                };
                this.userTimestampCache = storedConfigs;
                return storedConfigs;
            });
            console.log(`Successfully updated user timezone config for ${config.userId}`);
        } catch (error) {
            console.error("Error while storing user timezone config:", error);
        }
    }

    async getUserTimezoneConfig(userId: string) {
        const configs: UserTimestampStore | undefined = await DataStore.get(this.USER_TIMESTAMP_STORE_KEY);
        if (configs)
            this.userTimestampCache = configs;
        else
            return configs;

        if (!configs[userId])
            return this.getDefaultUserTimezoneConfig(userId);
        return configs[userId];
    }

    async getAllUserTimezoneConfigs() {
        return DataStore
            .get<UserTimestampStore>(this.USER_TIMESTAMP_STORE_KEY)
            .then(configs => {
                if (configs) this.userTimestampCache = configs;
                return configs;
            });
    }

    private getDefaultUserTimezoneConfig(userId: string): UserTimestampConfig {
        const { timeZone, locale } = Intl.DateTimeFormat().resolvedOptions();
        return {
            userId: userId,
            timezone: timeZone,
            showInMessages: false,
            locale: locale
        };
    }
}


