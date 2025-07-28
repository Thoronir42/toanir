<script lang="ts">
    import { goto } from "$app/navigation";
    import type { PageData } from "./$types";


    const {data}: {data: PageData} = $props()

    const encodeIndex: Record<string, typeof data.buttons[0]> = Object.fromEntries(data.buttons.map((button) => [button.natural, button]))
    let message = $state("")

    function copyMessage() {
        navigator.clipboard.writeText(message)
    }
    function buttonToImage(button: typeof data.buttons[0]): string {
        return `/symbols/rift/${(button.file || button.natural + '.png')}`
    }
    function switchMode(mode: string) {
        const url = new URL(window.location.toString())
        url.searchParams.set('mode', mode)
        goto(url, {replaceState: true})
    }
</script>

<div class="container">
    <div class="controls">
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
        {#each data.buttons as button}
        {#if button.natural}
        <button aria-label={button.natural} data-key={button.natural}
            onclick={() => message += button.label || button.natural}>
            {#if data.mode === 'encode'}
                <span class="natural">{button.label || button.natural}</span>
            {:else}
              {#if button.natural !== ' '}
                <img src={buttonToImage(button)} alt=""/>
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
<button onclick={copyMessage}>Copy message</button>
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
        <img src={buttonToImage(button)} alt="">
    </div>
    {/if}

    {/each}
</div>
{/if}
</div>

<style lang="scss">
.keyboard {
    width: fit-content;
    margin: 0 auto;
    text-align: center;
    background-color: #3333;
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

    &[data-mode="decode"] > button {
        padding: 0;
    }
}
[name="message"] {
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
</style>