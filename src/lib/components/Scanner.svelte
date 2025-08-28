<script lang="ts">
    import "./scanner.scss";
    import QrScanner from "qr-scanner";
    import type { PartialBy } from "$src/app";

    const {
        onScan,
        class: classes,
        ...rest
    }:  {
        onScan: (
            result: PartialBy<QrScanner.ScanResult, "cornerPoints">,
        ) => Promise<void> | void,
        class?: string,
    } & Record<string, any> = $props();

    let videoEl = $state<HTMLVideoElement>();
    let scanner: QrScanner | null = null;
    let manualInput = $state<null | string>(null);

    let resultProcess = $state<"idle" | "busy">("idle");

    function checkCode(result: Parameters<typeof onScan>[0]) {
        if (resultProcess === "busy") {
            return;
        }

        const processResult = onScan(result);
        if (typeof processResult?.then !== "function") {
            return;
        }

        resultProcess = "busy";
        processResult.finally(() => {
            resultProcess = "idle";
        });
    }

    async function submitcheckForm(e: SubmitEvent) {
        e.preventDefault();
        checkCode({data: manualInput || ""})
    }

    export function reset() {
        manualInput = null;
        scanner?.stop();
    }

    $effect(() => {
        if (!videoEl) {
            return;
        }

        scanner = new QrScanner(videoEl, checkCode, {
            highlightScanRegion: true,
        });
    });
</script>

<div class={["scanner hero-align", classes]} data-process={resultProcess} {...rest}>
    <div class="actions">
        <button onclick={() => scanner?.start()}>Start</button>
        <button onclick={() => scanner?.stop()}>Stop</button>
        <button onclick={() => (manualInput = manualInput === null ? "" : null)}
            >Manual</button
        >
    </div>
    <video bind:this={videoEl}></video>
    <div class="manual-drawer" aria-expanded={manualInput !== null}>
        <form method="POST" onsubmit={submitcheckForm}>
            <label for="code">Code</label>
            <textarea id="code" name="code" bind:value={manualInput}></textarea>
            <button type="submit">Check</button>
            <button type="button" onclick={() => (manualInput = null)}
                >Close</button
            >
        </form>
    </div>
</div>
