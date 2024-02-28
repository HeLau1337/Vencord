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
    if (!config || config.timeZone === "Universal") return null;

    const desiredTimeZoneDate = new Date(currentTimestampUtc.toLocaleString(
        config.locale ?? DiscordNative.locale,
        { timeZone: config.timeZone })
    );

    const isSameAsYours = Intl.DateTimeFormat().resolvedOptions().timeZone === config.timeZone;

    return desiredTimeZoneDate
        ? (
            <>
                <Text
                    tag="h2"
                    variant="eyebrow"
                    style={{ color: "var(--header-primary)" }}
                >Timezone Info</Text>
                <Text tag="p">
                    Their local time: {isSameAsYours ? "same as yours" : <Timestamp timestamp={desiredTimeZoneDate}></Timestamp>}
                </Text>
            </>
        )
        : null;
}

