<script lang="ts">
    import "reboot.css/dist/reboot.css";
    import "./transcribe.scss";
    import { goto } from "$app/navigation";
    import type { PageData } from "./$types";
    import { onMount } from "svelte";


    const {data}: {data: PageData} = $props()
    const buttons = $state(data.buttons.map((button) => ({
        ...button,
        href: buttonToImage(button),
        state: 'idle' as 'loading'|'ready'|'error',
    })
    ))

    const encodeIndex: Record<string, typeof buttons[0]> = Object.fromEntries(buttons.map((button) => [button.label || button.natural, button]))
    let message = $state("")

    function pressButton(button: typeof data.buttons[0]) {
        if (button.natural === 'back') {
            message = message.slice(0, -1)
            return
        }
        message += button.label || button.natural
    }
    function copyMessage() {
        navigator.clipboard.writeText(message)
    }
    function buttonToImage(button: typeof data.buttons[0]): string|null {
        if (button.file === null || button.natural === null) return null
        return `/awoo/symbols/rift/${(button.file || button.natural + '.png')}`
    }
    function formatStyle(button: typeof data.buttons[0], i?: number) {
        if (!button.style) return undefined;
        return Object.entries(button.style)
            .map(([key, value]) => `--${key}: ${value};`)
            .join(' ')
            + (i ? `--i: ${i};` :  '')
    }

    function switchMode(mode: string) {
        const url = new URL(window.location.toString())
        url.searchParams.set('mode', mode)
        goto(url, {replaceState: true})
    }

    async function inverseImageUrl(url: string): Promise<string> {
        const image = await new Promise<HTMLImageElement>((res, rej) => {
            const image = new Image();
            image.src = keyImageHref
            image.onload = () => res(image)
            image.onerror = (e) => rej(e)
        })
        const canvas = document.createElement("canvas")
        canvas.width = image.width
        canvas.height = image.height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(image, 0, 0)
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i] = 255 - imgData.data[i];
            imgData.data[i + 1] = 255 - imgData.data[i + 1];
            imgData.data[i + 2] = 255 - imgData.data[i + 2];
            // imgData.data[i + 3] = 255; // keep alpha channel same
        }
        ctx.putImageData(imgData, 0, 0)
        return canvas.toDataURL('jpg')
    }
    let keyImageHref = $state("/awoo/voidscript.jpg");
    let keyImageInverse  = $state('');
    onMount(async () => {
        keyImageInverse = await inverseImageUrl(keyImageHref)
        
        buttons.forEach((button) => {
            if (!button.href) return;

            const image = new Image()
            image.onload = () => button.state = 'ready'
            image.onerror = () => button.state = 'error'
            image.src = button.href
        })

        const styleEl = document.createElement("style");
        styleEl.id = "transcriber-keys";
        styleEl.appendChild(document.createTextNode(`
.transcriber {
    --key-image: url(${keyImageHref});
    --key-image-inverse: url(${keyImageInverse});
}
        `))
        document.head.appendChild(styleEl)
        return () => {
            styleEl.remove()
        }
    })

</script>

<div class="container transcriber">
    <h1>Rift transcriber v0.9</h1>
    <div class="controls radio-2">
        {#each data.modes as mode}
        <label>
            <input type="radio" name="mode" value={mode.name}
                onclick={() => switchMode(mode.name)}
                checked={mode.name === data.mode}
            >
            <span>{mode.label}</span>
        </label>
        {/each}
    </div>
    <div class="keyboard flex" data-mode={data.mode}>
        {#each buttons as button, i}
        {#if button.natural}
        <button class="key" aria-label={button.natural} data-key={button.natural}
            onclick={() => pressButton(button)} style={formatStyle(button, i)}>
            {#if button.style && data.mode === 'decode'}
                <span></span>
            {:else if button.natural === 'back'}
                <span>⌫</span>
            {:else if data.mode === 'encode'}
                <span class="natural">{button.label || button.natural}</span>
            {:else}
              {#if button.natural !== ' '}
                {@render glyph(button)}
              {/if}
            {/if}
        </button>
        {:else}
            <div role="separator"></div>
        {/if}
        {/each}
    </div>

<textarea name="message" bind:value={message}></textarea>
{#if data.mode === 'decode'}
<div class="controls">
    <button onclick={copyMessage}>Copy message</button>
</div>
{:else}
<div class="encoded">
    {#each message as letter, i}
    {@const button = encodeIndex[letter.toLowerCase()]}
    {#if letter === '\n'}
        <br>
    {:else if !button || button.natural === ' '}
    <div class="key">{letter}</div>
    {:else}
    <div class="key" style={formatStyle(button, i)}>
        {@render glyph(button, true)}
    </div>
    {/if}

    {/each}
</div>
{/if}

<hr>
<div class="credits">
    <p>Brought to you by the Society of Interdimensional Sciences</p>
    <img src="/awoo/sois.jpg" alt="Society of Interdimensional Sciences logo" width="1084" height="618" />
    <p style="opacity: 0.4; margin-block-start: 1rem;">
        Note: The glyphs are as caught in the wild. Should you have better quality, please send them over to
        <a target="_blank" href="https://t.me/Toanir">Toanir</a>.
    </p>
</div>

</div>

{#snippet glyph(button: typeof buttons[0], justSpan: boolean = false)}
    {#if justSpan}
        <span></span>
    {:else if button.state === 'ready'}
    <img src={button.href} alt="">
    {:else if button.state === 'error'}
    <span>❌</span>
    {:else}
    <span>⏳</span>
    {/if}
{/snippet}

