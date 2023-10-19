/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Flex } from "@components/Flex";
import { DeleteIcon } from "@components/Icons";
import { useForceUpdater } from "@utils/react";
import { Button, Forms, React, Select } from "@webpack/common";

import { getCustomRoles, setCustomRoles } from "../index";
import { storeCustomRoles } from "../store";
import { makeEmptyCustomRole } from "../utils";
import { CustomTextInput } from "./CustomTextInput";

export function CustomRolesComponent() {
    const update = useForceUpdater();

    let customRoles = getCustomRoles();

    if (customRoles.length >= 1) {
        const lastCustomRole = customRoles[customRoles.length - 1];
        if (lastCustomRole.name !== "" && lastCustomRole.icon !== "") {
            customRoles.push(makeEmptyCustomRole());
        }
    }

    async function onClickRemove(index: number) {
        customRoles = getCustomRoles();
        if (index === customRoles.length - 1) return;
        customRoles.splice(index, 1);

        // removeRoleFromAllUserAssignments();

        setCustomRoles(customRoles);
        await storeCustomRoles();
        update();
    }

    async function onChange(e: string, index: number, key: string) {
        customRoles = getCustomRoles();
        if (index === customRoles.length - 1)
            customRoles.push(makeEmptyCustomRole());

        customRoles[index][key] = e;

        if (customRoles[index].name === ""
            && customRoles[index].description === ""
            && customRoles[index].icon === ""
            && index !== customRoles.length - 1
        )
            customRoles.splice(index, 1);

        setCustomRoles(customRoles);
        await storeCustomRoles();
        update();
    }

    return (
        <>
            <Forms.FormTitle tag="h4">Manage Local Custom Roles</Forms.FormTitle>
            <Flex flexDirection="column" style={{ gap: "0.5em" }}>
                {
                    customRoles.map((role, index) =>
                        <React.Fragment key={`${role.id}-${index}`}>
                            <Flex flexDirection="row" style={{ gap: 0 }}>
                                <Flex flexDirection="row" style={{ flexGrow: 1, gap: "0.5em" }}>
                                    <CustomTextInput
                                        placeholder="Role name"
                                        initialValue={role.name}
                                        onChange={e => onChange(e, index, "name")}
                                    />
                                    <CustomTextInput
                                        placeholder="Description"
                                        initialValue={role.description ?? ""}
                                        onChange={e => onChange(e, index, "description")}
                                    />
                                    <Select
                                        options={
                                            /* Formats.map(m => ({
                                                    label: m,
                                                    value: m
                                                }))*/
                                            [{ label: "test1", value: 1 }, { label: "test2", value: 2 },]
                                        }
                                        isSelected={v => v === role.icon}
                                        select={e => onChange(e, index, "icon")}
                                        serialize={v => v}

                                    /* renderOptionLabel={o => (
                                        <div className={cl("format-label")}>
                                            {Parser.parse(formatTimestamp(time, o.value))}
                                        </div>
                                    )}
                                    renderOptionValue={() => rendered}*/
                                    />
                                    <input type="checkbox"
                                        checked={role.showIconInProfileOnly}
                                        onChange={change => { }}
                                    />
                                </Flex>
                                <Button
                                    size={Button.Sizes.MIN}
                                    onClick={() => onClickRemove(index)}
                                    style={{
                                        background: "none",
                                        color: "var(--status-danger)",
                                        ...(index === getCustomRoles().length - 1
                                            ? {
                                                visibility: "hidden",
                                                pointerEvents: "none"
                                            }
                                            : {}
                                        )
                                    }}
                                >
                                    <DeleteIcon />
                                </Button>
                            </Flex>
                        </React.Fragment>
                    )
                }
            </Flex>
        </>
    );
}
