/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import { Flex } from "@components/Flex";
import { closeModal, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalRoot, ModalSize, openModal } from "@utils/modal";
import { Button, React, Text } from "@webpack/common";
import type { User } from "discord-types/general";

import { CustomRolesComponent } from "./CustomRolesComponent";

export function openLocalRoleManagementModal(user: User) {
    const key = openModal(props => (
        <ErrorBoundary>
            <ModalRoot {...props} size={ModalSize.MEDIUM}>
                <ModalHeader>
                    <Text variant="heading-lg/semibold" style={{ flexGrow: 1 }}>Manage local user roles for {user.username}</Text>
                    <ModalCloseButton onClick={() => closeModal(key)} />
                </ModalHeader>
                <ModalContent>
                    <div style={{ padding: "16px 0" }}>
                        <Text>
                            Username: {user.username} (id: {user.id})
                        </Text>
                    </div>
                    <CustomRolesComponent />
                </ModalContent >
                <ModalFooter>
                    <Flex cellSpacing={10}>
                        <Button onClick={() => closeModal(key)}>
                            Close
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalRoot >
        </ErrorBoundary >
    ));
}
