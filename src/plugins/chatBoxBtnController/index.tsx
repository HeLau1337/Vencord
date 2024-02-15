/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
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

import "./styles.css";

import { addContextMenuPatch, NavContextMenuPatchCallback, removeContextMenuPatch } from "@api/ContextMenu";
import { definePluginSettings } from "@api/Settings";
import { classNameFactory } from "@api/Styles";
import { useForceUpdater } from "@utils/react";
import definePlugin from "@utils/types";
import { Menu } from "@webpack/common";

interface ChatBoxButton {
    id: string;
    element: Element;
    hidden: boolean;
}

let chatBoxButtons: ChatBoxButton[] = [];

const settings = definePluginSettings({
    /* buttonsToHide: {
        description: "Choose which buttons should be hidden in the chat textarea",
        type: OptionType.COMPONENT,
        component: ButtonsToHideSelectionComponent
    }, */
});
/*
function ButtonsToHideSelectionComponent() {
    const update = useForceUpdater();
    return (
        <>
            <TextReplace
                title="Using String"
                rulesArray={stringRules}
                rulesKey={STRING_RULES_KEY}
                update={update}
            />
            <TextReplace
                title="Using Regex"
                rulesArray={regexRules}
                rulesKey={REGEX_RULES_KEY}
                update={update}
            />
            <TextReplaceTesting />
        </>
    );
} */

const cl = classNameFactory("vc-cbbc-");

function isBtnHidden(selector: string): boolean {
    const btn = document.querySelector(selector);
    if (btn !== null && btn.classList.contains("hidden"))
        return true;
    return false;
}

const TextAreaContextMenuPatch: NavContextMenuPatchCallback = children => () => {
    children.push(
        <>
            <Menu.MenuSeparator />
            <Menu.MenuGroup
                id="vc-visible-buttons"
                label="Visible buttons"
            >
                {Object.values(chatBoxButtons).map(btn => (

                    <Menu.MenuCheckboxItem
                        key={btn.id}
                        id={"multi-greet-" + btn.id}
                        label={btn.element.ariaLabel ?? "Button"}
                        checked={!btn.hidden}
                        action={() => {
                            chatBoxButtons = chatBoxButtons.map(cbb => {
                                if (cbb.id === btn.id) {
                                    toggleBtnVisibility(cbb.element);
                                    cbb.hidden = !cbb.hidden;
                                }
                                return cbb;
                            });
                        }}
                    />
                ))}
            </Menu.MenuGroup>
        </>
    );
};

function hideButton(btnElement: Element) {
}

function showButton(btnElement: Element) {
    btnElement.classList.remove("hidden");
}

function toggleBtnVisibility(btnElement: Element) {
    if (btnElement.classList.contains("hidden"))
        showButton(btnElement);
    else
        hideButton(btnElement);
}

function updateButtonList() {
    const update = useForceUpdater();
    if (chatBoxButtons.length > 0) {
        chatBoxButtons.forEach(btn => {
            if (btn.hidden)
                hideButton(btn.element);
        });
    }
    const buttons = document.querySelectorAll('div[class*="channelTextArea_"] div[class*="buttons_"] button[class*="button_"]');
    console.warn(">>> buttons:", buttons);
    buttons.forEach(btn => {
        chatBoxButtons.push({
            id: btn.ariaLabel!.replace(" ", "_"),
            element: btn,
            hidden: isBtnHidden(`[aria-label="${btn.ariaLabel}"]`)
        });
    });
    update();
}

function resetButtons() {
    const giftBtn = document.querySelector('[aria-label="Send a gift"]');
    giftBtn?.classList.remove("hidden");
}

export default definePlugin({
    name: "ChatBoxButtons",
    description: "Controls which buttons are displayed in the chat box!",
    authors: [{ id: 286208399786377216n, name: "hendrik3812" }],
    dependencies: ["ChatInputButtonAPI"],

    settings,

    start() {
        addContextMenuPatch("textarea-context", TextAreaContextMenuPatch);
        updateButtonList();
    },

    stop() {
        removeContextMenuPatch("textarea-context", TextAreaContextMenuPatch);
        resetButtons();
    },
});
