<script lang="ts">
    import "reboot.css/dist/reboot.css";
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

    const encodeIndex: Record<string, typeof buttons[0]> = Object.fromEntries(buttons.map((button) => [button.natural, button]))
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
    function buttonToImage(button: typeof data.buttons[0]): string {
        return `/awoo/symbols/rift/${(button.file || button.natural + '.png')}`
    }
    function switchMode(mode: string) {
        const url = new URL(window.location.toString())
        url.searchParams.set('mode', mode)
        goto(url, {replaceState: true})
    }

    onMount(() => {
        buttons.forEach((button) => {
            const image = new Image()
            image.onload = () => button.state = 'ready'
            image.onerror = () => button.state = 'error'
            image.src = button.href

        })
    })

</script>

<div class="container">
    <h1>Rift transcriber v0.2</h1>
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
    <div class="keyboard" data-mode={data.mode}>
        {#each buttons as button}
        {#if button.natural}
        <button aria-label={button.natural} data-key={button.natural}
            onclick={() => pressButton(button)}>
            {#if button.natural === 'back'}
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
            <br>
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
    {#each message as letter}
    {@const button = encodeIndex[letter]}
    {#if letter === '\n'}
        <br>
    {:else if !button || button.natural === ' '}
    <div class="key">{letter}</div>
    {:else}
    <div class="key">
        {@render glyph(button)}
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

{#snippet glyph(button: typeof buttons[0])}
    {#if button.state === 'ready'}
    <img src={button.href} alt="">
    {:else if button.state === 'error'}
    <span>❌</span>
    {:else}
    <span>⏳</span>
    {/if}
{/snippet}

<style lang="scss">
:global(body) {
    background-color: hsl(275, 59%, 28%);
    color: hsl(30, 95%, 53%);
}
:global(:is(input, textarea, button)) {
    accent-color: #f98917;
    background-color: hsl(275, 59%, 90%);
}

.controls {
    padding: 0.25rem 1rem;
    display: flex;
    justify-content: center;
    gap: 1rem;

    label {
        width: fit-content;
        display: flex;
        flex-direction: column;
        align-items: center;

        padding: 0.25rem;

        background-color: #aaa8;
    }

    &.radio-2 {
        > label {
            gap: 0.5rem;
        }
        > label:first-child {
            flex-direction: row-reverse;
        }
        > label:last-child {
            flex-direction: row;
        }
    }
}
.keyboard {
    width: fit-content;
    margin: 0 auto;
    text-align: center;
    background-color: #aaa8;
    padding: 0.5rem 0.2rem;

    > button {
        width: 1.75rem;
        
        margin: 0.1rem;

        > img {
            width: 100%;
            height: auto;
            aspect-ratio: 1;
            overflow: hidden;
        }

        &[data-key=" "] {
            width: 6rem;
            height: 1.2rem;
        }
        
    }

    > br:nth-of-type(3) + button {
        margin-inline-start: 1.5rem;
    }

    &[data-mode="decode"] > button {
        padding: 0;
    }
}
[name="message"] {
    margin-block-start: 1rem;
    width: 100%;
    resize: vertical;
    min-height: 20rem;
}

.encoded {
    > .key {
        display: inline-block;
        width: 2em;
        height: 2em;

        > img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
}

.credits {
    margin-block-end: 2rem;
    img {
        display: block;
        max-width: min(80vw, 100%);
        height: auto;
        margin: 0 auto;
        border: 4px groove #f98917;
    }
}

</style>
