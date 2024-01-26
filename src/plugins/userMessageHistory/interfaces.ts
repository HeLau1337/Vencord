/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { Channel, GuildMember, Message, User } from "discord-types/general";

export interface UserContextProps {
    channel: Channel;
    guildId?: string;
    user: User;
}

export interface DiscordSearchQuery {
    content?: string;
    author_id?: string;
    include_nsfw: boolean;
    offset?: number;
    sort_by?: "timestamp" | "relevance",
    sort_order?: "desc" | "asc";
}

export interface SearchResults {
    analytics_id: number;
    members: GuildMember[];
    messages: Message[][];
    threads: any[];
    total_results: number;
}
