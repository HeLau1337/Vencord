/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "@plugins/fixFilePreviewDefaults/styles.css";

import { definePluginSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { findCssClassesLazy } from "@webpack";
import { Clickable, i18n, Tooltip } from "@webpack/common";

const previewClasses = findCssClassesLazy("overflowIcon", "openFullPreviewSection");

const settings = definePluginSettings({
    defaultWordWrap: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "Wrap text by default (Discord defaults to enabled)",
        restartNeeded: false
    },
    showDownloadButton: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Show Download button in the preview footer",
        restartNeeded: false
    }
});

const DownloadIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
    >
        <path d="M12 2a1 1 0 0 1 1 1v10.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.42l3.3 3.3V3a1 1 0 0 1 1-1ZM3 20a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2H3Z" />
    </svg>
);

const DownloadButton = ErrorBoundary.wrap(function ({
    url,
    fileName,
    downloadRef
}: {
    url: string;
    fileName: string;
    downloadRef?: { current: HTMLAnchorElement | null; };
}) {
    const onDownload = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (downloadRef?.current) {
            downloadRef.current.click();
        } else {
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.target = "_blank";
            a.rel = "noreferrer noopener";
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    };

    const downloadLabel = (i18n.intl?.string?.(i18n.t?.DOWNLOAD) || "Download") as string;

    return (
        <Tooltip text={downloadLabel}>
            {tooltipProps => (
                <Clickable
                    {...tooltipProps}
                    className={`${previewClasses.overflowIcon ?? ""} vc-file-preview-download-btn`}
                    aria-label={downloadLabel}
                    onClick={onDownload}
                >
                    <DownloadIcon />
                </Clickable>
            )}
        </Tooltip>
    );
}, { noop: true });

export default definePlugin({
    name: "FixFilePreviewDefaults",
    description: "Restores the file preview download button to the preview footer and allows changing the default 'Wrap Text' behavior.",
    authors: [Devs.Hendrik],
    tags: ["Utility", "Media"],
    searchTerms: ["filePreview", "wordWrap", "download", "preview"],
    settings,

    get defaultWordWrap(): boolean {
        return settings.store.defaultWordWrap;
    },

    renderDownloadButton(props: { url: string; fileName: string; }, downloadRef?: { current: HTMLAnchorElement | null; }) {
        if (!settings.store.showDownloadButton) return null;
        return <DownloadButton url={props.url} fileName={props.fileName} downloadRef={downloadRef} />;
    },

    patches: [
        // Change the default wordWrap state in file previews (Discord defaults to true)
        {
            find: "plaintext-preview-overflow-menu",
            replacement: {
                match: /(?<=\.split\("\."\)\.slice\(-1\)\[0\]\),\[\i,\i\]=\i\.useState\()(!0|true)/,
                replace: "$self.defaultWordWrap"
            }
        },
        // Insert the Download button into the preview footer beside the overflow menu button
        {
            find: "plaintext-preview-overflow-menu",
            replacement: {
                match: /function \i\((\i)\)\{let\{[^}]+?\}=\1,\i=(?:\(0,)?\i\.useRef\)?\(null\),(\i)=(?:\(0,)?\i\.useRef\)?\(null\);return\(0,\i\.jsx(?:s)?\)\(\i\.Fragment,\{children:\[/,
                replace: "$&$self.renderDownloadButton($1,$2),"
            }
        }
    ]
});
