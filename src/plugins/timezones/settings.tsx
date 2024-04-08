/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

import { DataPortComponent } from "./components/DataPortComponent";

export const settings = definePluginSettings({
    time24h: {
        type: OptionType.BOOLEAN,
        description: "Show time in 24h format",
        default: false
    },

    showMessageHeaderTime: {
        type: OptionType.BOOLEAN,
        description: "Show time in message headers",
        default: true
    },

    showProfileTime: {
        type: OptionType.BOOLEAN,
        description: "Show time in profiles",
        default: true
    },

    useSettingsJsonForTimezoneData: {
        type: OptionType.BOOLEAN,
        description: "Use Vencord's settings.json to store (and sync) the timezone data",
        default: false,
        restartNeeded: true,
    },

    exportImportData: {
        type: OptionType.COMPONENT,
        description: "Export and import your local data manually (using json files).",
        component: DataPortComponent
    },

    timezoneData: {
        type: OptionType.COMPONENT,
        description: "",
        component: () => <></>,
        hidden: true
    }
});
