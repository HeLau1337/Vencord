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

import { get, set } from "@api/DataStore";
import { addButton, removeButton } from "@api/MessagePopover";
import { definePluginSettings } from "@api/Settings";
import { ImageInvisible, ImageVisible } from "@components/Icons";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { ChannelStore, SelectedChannelStore } from "@webpack/common";
import { Message } from "discord-types/general";

let style: HTMLStyleElement;

interface IMessageCreate {
    type: "MESSAGE_CREATE";
    optimistic: boolean;
    isPushNotification: boolean;
    channelId: string;
    message: Message;
}

const KEY = "HideAttachments2_HiddenIds";

let hiddenMessages: Set<string> = new Set();
const getHiddenMessages = () => get(KEY).then(set => {
    hiddenMessages = set ?? new Set<string>();
    return hiddenMessages;
});
const saveHiddenMessages = (ids: Set<string>) => set(KEY, ids);

const settings = definePluginSettings({
    shouldHideAttachmentsFromListedUsers: {
        description: "Whether to hide attachments from listed users",
        type: OptionType.BOOLEAN,
        default: true,
    },
    userList: {
        description:
            "List of users whose attachments are to be displayed or hidden automatically (separated by commas or spaces)",
        type: OptionType.STRING,
        default: "598502511334260738,297669238779281408,410143798773940224",
    },
});


const buildCss = async () => {
    const elements = [...hiddenMessages].map(id => `#message-accessories-${id}`).join(",");
    style.textContent = `
        :is(${elements}) :is([class*="embedWrapper"], [class*="clickableSticker"]) {
            /* important is not necessary, but add it to make sure bad themes won't break it */
            display: none !important;
        }
        :is(${elements})::after {
            content: "Attachments hidden";
            color: var(--text-muted);
            font-size: 80%;
        }
        `;
};

const addHiddenMessage = async (messageId: string) => {
    const ids = await getHiddenMessages();
    if (!ids.has(messageId))
        ids.add(messageId);

    await saveHiddenMessages(ids);
};

export default definePlugin({
    name: "HideAttachments2",
    description: "[Hendrik's fork] Hide attachments and Embeds for individual messages via hover button. This fork allows to do this automatically for a list of given user ids.",
    authors: [Devs.Ven],
    dependencies: ["MessagePopoverAPI"],
    settings,

    flux: {
        async MESSAGE_CREATE({ optimistic, type, message, channelId }: IMessageCreate) {
            if (optimistic || type !== "MESSAGE_CREATE") return;
            if (message.state === "SENDING") return;
            if (!message.attachments && !message.embeds && !message.stickerItems) return;
            if (channelId !== SelectedChannelStore.getChannelId()) return;


            const isListed = settings.store.userList.includes(message.author.id);
            if (isListed) {
                await addHiddenMessage(message.id);
                await buildCss();
            }
        },
    },

    async start() {
        style = document.createElement("style");
        style.id = "VencordHideAttachments";
        document.head.appendChild(style);

        await getHiddenMessages();
        await buildCss();

        addButton("HideAttachments2", msg => {
            if (!msg.attachments.length && !msg.embeds.length && !msg.stickerItems.length) return null;

            const isHidden = hiddenMessages.has(msg.id);

            return {
                label: isHidden ? "Show Attachments" : "Hide Attachments",
                icon: isHidden ? ImageVisible : ImageInvisible,
                message: msg,
                channel: ChannelStore.getChannel(msg.channel_id),
                onClick: () => this.toggleHide(msg.id)
            };
        });
    },

    stop() {
        style.remove();
        hiddenMessages.clear();
        removeButton("HideAttachments");
    },

    async toggleHide(id: string) {
        const ids = await getHiddenMessages();
        if (!ids.delete(id))
            ids.add(id);

        await saveHiddenMessages(ids);
        await buildCss();
    }
});
