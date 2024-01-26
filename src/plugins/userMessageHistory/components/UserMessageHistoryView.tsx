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

import { LazyComponent, useAwaiter, useForceUpdater } from "@utils/react";
import { find, findByPropsLazy } from "@webpack";
import { Forms, React, RestAPI, SelectedGuildStore, UserStore } from "@webpack/common";
import { Message, User } from "discord-types/general";

import { DiscordSearchQuery, SearchResults } from "../interfaces";
import { cl } from "../utils";
import MessageComponent from "./MessageComponent";

const REVIEWS_PER_PAGE = 25;

const { Editor, Transforms } = findByPropsLazy("Editor", "Transforms");
const { ChatInputTypes } = findByPropsLazy("ChatInputTypes");

const InputComponent = LazyComponent(() => find(m => m.default?.type?.render?.toString().includes("default.CHANNEL_TEXT_AREA")).default);

interface UserProps {
    user: User;
}

interface Props extends UserProps {
    onFetchResults(searchResults: SearchResults): void;
    refetchSignal?: unknown;
    page?: number;
}

async function getMessageSearchResults(user: User, offset: number): Promise<SearchResults> {
    const guildId = SelectedGuildStore.getLastSelectedGuildId(); // 449706194140135444n;
    const { body } = await RestAPI.get({
        url: `/guilds/${guildId}/messages/search`, // ?content=hendrik3812&include_nsfw=true
        query: {
            author_id: user.id,
            include_nsfw: true,
            offset: offset,
            sort_by: "timestamp",
            sort_order: "desc"
        } as DiscordSearchQuery
    });
    return body as SearchResults;
}

export default function UserMessageHistoryView({
    user,
    onFetchResults: onFetchResults,
    refetchSignal,
    page = 1
}: Props) {
    const [signal, refetch] = useForceUpdater(true);

    const [searchResults] = useAwaiter(() => getMessageSearchResults(user, (page - 1) * REVIEWS_PER_PAGE), {
        fallbackValue: null,
        deps: [refetchSignal, signal, page],
        onSuccess: data => {
            onFetchResults(data!);
        }
    });

    if (!searchResults) return null;

    return (
        <MessageList
            refetch={refetch}
            messages={searchResults!.messages}
        />
    );
}

function MessageList({ refetch, messages }: { refetch(): void; messages: Message[][]; }) {
    const myId = UserStore.getCurrentUser().id;

    return (
        <div className={cl("message-component-wrapper")}>
            {messages.map(msg =>
                <MessageComponent
                    key={msg.at(0)!.id}
                    message={msg.at(0)!}
                    refetch={refetch}
                />
            )}

            {messages.length === 0 && (
                <Forms.FormText className={cl("placeholder")}>
                    Looks like the user didn't send any messages on this server yet.
                </Forms.FormText>
            )}
        </div>
    );
}
