/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NotificationData, showNotification } from "@api/Notifications";
import { Flex } from "@components/Flex";
import { useForceUpdater } from "@utils/react";
import { Button, React, Text, Tooltip, useState } from "@webpack/common";

import { timezonesStoreService } from "../index";
import { getCurrentDateForFileName } from "../utils";

export function DataPortComponent() {
    const update = useForceUpdater();
    const [selectedFile, setSelectedFile] = useState<File>();

    const handleFileChange = event => {
        console.debug("[vc-timezones] File was selected");
        try {
            const file = event.target.files[0];
            setSelectedFile(file);
            if (file) {
                const reader = new FileReader();
                reader.readAsText(file); // Read the file content as text

                reader.onload = e => {
                    const fileContent = e.target?.result;
                    if (fileContent) {
                        const data = JSON.parse(fileContent.toString());
                        timezonesStoreService.overwriteStoredData(data).then(() => {
                            console.log("[vc-timezones] New data successfully imported into local db!");
                            showNotification({
                                title: "Success!",
                                body: `Timezone user data successfully imported from '${file.name}'!`,
                                color: "green"
                            } as NotificationData);
                        }).catch(reason => {
                            console.error("[vc-timezones] Data import failed:", reason);
                            showNotification({
                                title: "Error!",
                                body: `Importing timezone user data failed. Reason: ${reason}`,
                                color: "red"
                            } as NotificationData);
                        });
                    }
                };

                reader.onerror = error => {
                    console.error("[vc-timezones] Error reading file:", error);
                };
            }
        } catch (error) {
            console.error("[vc-timezones] Error handling file:", error);
            showNotification({
                title: "Error!",
                body: "Importing timezone user data failed for an unknown reason!",
                color: "red"
            } as NotificationData);
        }
    };
    const importData = () => {
        console.debug("[vc-timezones] Importing data...");
        document.getElementById("fileInput")?.click();
    };

    const exportData = async () => {
        console.debug("[vc-timezones] Exporting data...");
        const data = await timezonesStoreService.getAllTimezonesData();
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(data)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `vc-timezones_${getCurrentDateForFileName()}.json`;
        link.click();
        console.log("[vc-timezones] Data export successful!");
    };

    return (
        <>
            <Text variant="heading-md/semibold">Import and export your user timezone data</Text>
            <Flex flexDirection={"row"}>
                <Button
                    size={Button.Sizes.SMALL}
                    onClick={() => exportData()}
                >Export data</Button>

                <Tooltip
                    text="This will overwrite your local settings with the ones from the selected file. Use wisely!">
                    {({ onMouseLeave, onMouseEnter }) => (
                        <Button
                            onMouseLeave={onMouseLeave}
                            onMouseEnter={onMouseEnter}
                            size={Button.Sizes.SMALL}
                            color={Button.Colors.RED}
                            onClick={() => importData()}
                        >Import data</Button>
                    )}
                </Tooltip>
                <input
                    id="fileInput"
                    type="file"
                    accept=".json" // Accept only JSON files
                    onChange={handleFileChange} // Handle file selection
                    style={{ display: "none" }} // Hide the input element
                />
            </Flex>
        </>
    );
}
