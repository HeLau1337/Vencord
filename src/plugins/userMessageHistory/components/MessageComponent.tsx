/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
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

import "../styles.css";

import { openUserProfile } from "@utils/discord";
import { LazyComponent } from "@utils/react";
import { filters, findBulk } from "@webpack";
import { Card, Text } from "@webpack/common";
import { Message } from "discord-types/general";

import { cl } from "../utils";


export default LazyComponent(() => {
    // this is terrible, blame mantika
    const p = filters.byProps;
    const [
        { cozyMessage, buttons, message, buttonsInner, groupStart },
        { container, isHeader },
        { avatar, clickable, username, wrapper, cozy },
        buttonClasses,
        botTag
    ] = findBulk(
        p("cozyMessage"),
        p("container", "isHeader"),
        p("avatar", "zalgo"),
        p("button", "wrapper", "selected"),
        p("botTag", "botTagRegular")
    );

    const dateFormat = new Intl.DateTimeFormat();

    return function MessageComponent({ message, refetch }: { message: Message; refetch(): void; }) {
        function openModal() {
            openUserProfile(message.author.id);
        }

        return (
            <Card className={cl("message-card")}>
                <Text variant="text-sm/normal">{message.timestamp.toLocaleString()}</Text>
                <Text>{message.content}</Text>
            </Card>
        );
    };
});
