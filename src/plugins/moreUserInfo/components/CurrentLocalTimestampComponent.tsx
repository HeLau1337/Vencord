import { Message, User } from "discord-types/general";
import { settings } from "../settings";
import { React, Timestamp, UserStore, Text } from "@webpack/common";
import { muiStoreService } from "../index";
import ErrorBoundary from "@components/ErrorBoundary";
import { classes } from "@utils/misc";
import { findByPropsLazy } from "@webpack";


const styles: Record<string, string> = findByPropsLazy("timestampInline");


function shouldShow(userId: string): boolean {
    const user: User = UserStore.getUser(userId);
    if (!settings.store.enableUserTimestamps)
        return false;
    if (user.bot || user.system)
        return false;
    if (user.id === UserStore.getCurrentUser().id)
        return false;
    const config = muiStoreService.getUserTimezoneConfigCache(user.id);
    if (!config || !config.showInMessages)
        return false;
    if (config.timezone === DiscordNative.timeZone)
        return false;

    return true;
}

export const CurrentLocalTimestampComponentWrapper = ErrorBoundary.wrap(({ userId }: { userId: string; }) => {
    return shouldShow(userId)
        ? <CurrentLocalTimestampComponent userId={userId} />
        : null;
}, { noop: true });

function CurrentLocalTimestampComponent({ userId }: { userId: string; }) {
    const currentTimestampUtc = new Date(Date.now());
    const config = muiStoreService.getUserTimezoneConfigCache(userId);
    if (!config) return null;

    const desiredTimeZoneDate = new Date(currentTimestampUtc.toLocaleString(
        config.locale ?? DiscordNative.locale,
        { timeZone: config.timezone })
    );

    return desiredTimeZoneDate
        ? (
            <>
                <Text
                    tag="h2"
                    variant="eyebrow"
                    style={{ color: "var(--header-primary)" }}
                >Timezone Info</Text>
                <Text tag="p">
                    Their local time: <Timestamp timestamp={desiredTimeZoneDate}></Timestamp>
                </Text>
            </>
        )
        : null;
}

