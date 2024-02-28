/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { Channel, User } from "discord-types/general";

export interface UserTimestampConfig {
    userId: string;
    timeZone: string;
    showInMessages: boolean;
    locale?: string;
}

export interface UserTimestampStore {
    [key: string]: UserTimestampConfig;
}

export interface UserContextProps {
    channel: Channel;
    guildId?: string;
    user: User;
}


export const PronounMapping = {
    hh: "He/Him",
    hi: "He/It",
    hs: "He/She",
    ht: "He/They",
    ih: "It/Him",
    ii: "It/Its",
    is: "It/She",
    it: "It/They",
    shh: "She/He",
    sh: "She/Her",
    si: "She/It",
    st: "She/They",
    th: "They/He",
    ti: "They/It",
    ts: "They/She",
    tt: "They/Them",
    any: "Any pronouns",
    other: "Other pronouns",
    ask: "Ask me my pronouns",
    avoid: "Avoid pronouns, use my name",
    unspecified: "Unspecified"
} as const;

