/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/*
* This is a "fork" of the vc-timezones repository by Syncxv on GitHub: https://github.com/Syncxv/vc-timezones
*/


import definePlugin from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { Message } from "discord-types/general";
import { MessageStore } from "@webpack/common";


export const classes = findByPropsLazy("timestamp", "compact", "contentOnly");

export default definePlugin({
    name: "ReplyPingIndicator",
    authors: [],
    description: "Adds an indicator to replies that shows whether the reply pinged someone.",

    patches: [
        {
            find: "\"Message Username\"",
            replacement: {
                // thanks https://github.com/Syncxv/vc-timezones/pull/4
                match: /(?<=isVisibleOnlyOnHover.+?)id:.{1,11},timestamp.{1,50}}\),/,
                replace: "$&,$self.renderPingIndicator(arguments[0]),"
            }
        }
    ],

    renderPingIndicator: (props?: { message?: Message; }) => {
        if (!props || !props.message) return <></>;
        const { mentions } = props.message;
        if (mentions.length > 0) {
            return <span
                style={{
                    marginLeft: ".25rem",
                    fontSize: "0.75rem",
                    lineHeight: "1.375rem",
                    color: "rgb(179,135,76)",
                }}
                title={"This reply pinged someone."}
            >
                {(mentions.length > 1) ? mentions.length : ""}&#64;
            </span>; // &#64; = @
        }
        return <></>;
    },
});
