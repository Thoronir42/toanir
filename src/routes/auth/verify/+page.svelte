<script lang="ts">
    import { onMount } from "svelte";
    import QrScanner from 'qr-scanner';

    import type { TokenContent } from "../jwt.server";

    let status = $state<'idle'|'busy' |'error'>('idle')
    let tokenContent = $state<null|TokenContent>(null)

    let iat = $derived(tokenContent?.payload?.iat ? new Date(tokenContent?.payload?.iat) : null)
    let exp = $derived(tokenContent?.payload?.exp ? new Date(tokenContent?.payload?.exp) : null)

    async function checkCode(e: SubmitEvent) {
        e.preventDefault()
        if (!(e.target instanceof HTMLFormElement)) {
            console.error(e.target, 'not a form')
            status = "error"
            return
        }

        const formData = new FormData(e.target)
        
        if (status !== "idle") {
            return
        }

        tokenContent = null
        status = 'busy'
        try {
            const response = await fetch(new URL(window.location.toString()), {
                method: "POST",
                body: JSON.stringify(Object.fromEntries(formData.entries())),
            })
            tokenContent = await response.json()

        } finally {
            status = 'idle'
        }
    }

    let videoEl = $state<HTMLVideoElement>()
    let scanner: QrScanner|null = null
    onMount(() => {
        if (!videoEl) {
            return
        }

        scanner = new QrScanner(videoEl, (result) => {
            const textarea = document.querySelector('[name="code"]') as HTMLTextAreaElement
            if (textarea) textarea.value = result.data
            document.querySelector("button")?.click()
            scanner?.stop()
        }, {})
    })
</script>
<a href="generate">generate</a>
<h1>Verify <small>{status}</small></h1>

<div class="row">
    <div class="col">
        <form method="POST" onsubmit={checkCode}>
            <label for="code">Code</label>
            <textarea id="code" name="code"></textarea>
            <button type="submit">Check</button>
        </form>
    </div>
    <div class="col">
        <div class="scanner">
            <button onclick={() => scanner?.start()}>Start</button>
            <button onclick={() => scanner?.stop()}>Stop</button>
            <video bind:this={videoEl}></video>
        </div>
    </div>
</div>


{#if tokenContent}
<table>
    <tbody>
    <tr>
        <th>Valid</th><td>{tokenContent.valid}</td>
    </tr>
    <tr>
        <th>IAT</th><td>{iat?.toISOString()}</td>
    </tr>
    <tr>
        <th>EXP</th><td>{exp?.toISOString()}</td>
    </tr>
    </tbody>
</table>
<code style="background-color: #efefef; border: 1px solid #ddd;">
    <hr>
    <pre>{JSON.stringify(tokenContent.payload, null, 2)}</pre>
</code>
{/if}