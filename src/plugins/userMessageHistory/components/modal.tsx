/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "../styles.css";

import ErrorBoundary from "@components/ErrorBoundary";
import { ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalRoot, ModalSize, openModal } from "@utils/modal";
import { useForceUpdater } from "@utils/react";
import { GuildStore, Paginator, SelectedGuildStore, Text, useRef, useState } from "@webpack/common";
import { Guild, User } from "discord-types/general";

import { SearchResults } from "../interfaces";
import { cl } from "../utils";
import UserMessageHistoryView from "./UserMessageHistoryView";


const pageSize: number = 25;

export function openUserMessagesHistoryModal(user: User) {
    openModal(props =>
        <UserMessagesHistoryModal modalProps={props} user={user} />
    );
}

function UserMessagesHistoryModal({ modalProps, user }: { modalProps: any; user: User; }) {
    const [page, setPage] = useState(1);
    // const [searchResults] = useAwaiter(() => fetchMessages(user, (page - 1) * pageSize));
    const guild: Guild = GuildStore.getGuild(SelectedGuildStore.getLastSelectedGuildId());
    const [searchResults, setSearchResults] = useState<SearchResults>();
    const [signal, refetch] = useForceUpdater(true);
    const ref = useRef<HTMLDivElement>(null);


    return (
        <ErrorBoundary>
            <ModalRoot {...modalProps} size={ModalSize.MEDIUM}>
                <ModalHeader>
                    <Text variant="heading-lg/semibold">Message history of {user.username} on {guild.name}</Text>
                    <ModalCloseButton onClick={modalProps.onClose} />
                </ModalHeader>
                <ModalContent>
                    <div className={cl("search-info-sticky")}>
                        <Text>Total results: {searchResults?.total_results}</Text>
                        <Text>&lt;@{user.id}&gt;</Text>
                    </div>
                    <UserMessageHistoryView
                        page={page}
                        refetchSignal={signal}
                        onFetchResults={setSearchResults}
                        user={user} />
                </ModalContent>
                <ModalFooter>
                    {!!searchResults && (
                        <Paginator
                            currentPage={page}
                            maxVisiblePages={5}
                            pageSize={pageSize}
                            totalCount={searchResults.total_results}
                            onPageChange={setPage}
                        />
                    )}
                </ModalFooter>
            </ModalRoot>
        </ErrorBoundary>
    );
}
