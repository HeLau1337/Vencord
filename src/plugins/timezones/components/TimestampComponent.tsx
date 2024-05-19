/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import { Tooltip, useEffect, useState } from "@webpack/common";

import { classes, timezonesStoreService } from "../index";
import { LocalUserTimestamp } from "../types";
import { getTime } from "../utils";

export const TimestampComponent = ErrorBoundary.wrap(({ userId, timestamp, type }: LocalUserTimestamp) => {
    const [currentTime, setCurrentTime] = useState(timestamp || Date.now());
    const timezone = timezonesStoreService.getUserTimezone(userId);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (type === "profile") {
            setCurrentTime(Date.now());

            const now = new Date();
            const delay = (60 - now.getSeconds()) * 1000 + 1000 - now.getMilliseconds();

            timer = setTimeout(() => {
                setCurrentTime(Date.now());
            }, delay);
        }

        return () => timer && clearTimeout(timer);
    }, [type, currentTime]);

    if (!timezone) return null;

    const shortTime = getTime(timezone, currentTime, { hour: "numeric", minute: "numeric" });
    const longTime = getTime(timezone, currentTime, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    });
    return (
        <Tooltip
            position="top"
            // @ts-ignore
            delay={750}
            allowOverflow={false}
            spacing={8}
            hideOnClick={true}
            tooltipClassName="timezone-tooltip"
            text={longTime}
        >
            {toolTipProps => {
                return (
                    <span
                        {...toolTipProps}
                        className={type === "message" ? `timezone-message-item ${classes.timestamp}` : "timezone-profile-item"}
                    >
                        {
                            type === "message" ? `(${shortTime})` : shortTime
                        }
                    </span>
                );
            }}
        </Tooltip>
    );
}, { noop: true });
