/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { Channel, User } from "discord-types/general";

export interface UserContextProps {
    channel: Channel;
    guildId?: string;
    user: User;
}

export interface CustomRole {
    id: number;
    name: string;
    description?: string;
    icon: string;
    showIconInProfileOnly?: boolean;
}
