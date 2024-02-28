/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { Channel, User } from "discord-types/general";

export interface UserTimeZoneConfig {
    userId: string;
    timeZone: string;
    showInMessages: boolean;
    locale?: string;
}

export interface UserTimeZoneStore {
    [key: string]: UserTimeZoneConfig;
}

export interface UserContextProps {
    channel: Channel;
    guildId?: string;
    user: User;
}
