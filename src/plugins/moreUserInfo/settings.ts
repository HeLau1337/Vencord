/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    enableUserTimestamps: {
        type: OptionType.BOOLEAN,
        description: "Show user's local timestamps in their profile and add an option to enable it for messages (you will need to tell the plugin who is located in which timezone).",
        default: true
    },
    /* showInProfile: {
        type: OptionType.BOOLEAN,
        description: "Show in profile",
        default: true
    }
    timestampFormat: {
        type: OptionType.SELECT,
        description: "The format for the user's local timestamps",
        options: [
            {
                label: "Lowercase",
                value: PronounsFormat.Lowercase,
                default: true
            },
            {
                label: "Capitalized",
                value: PronounsFormat.Capitalized
            }
        ]
    },*/
});
