<script lang="ts">
    import FlipContent from "$lib/components/FlipContent.svelte";

    import { TokenCheck } from "$lib/token.svelte";
    import Scanner from "$lib/components/Scanner.svelte";

    let scanner = $state<Scanner>()

    const tokenCheck = new TokenCheck({
        onSuccess: () => {
            scanner?.reset()
        },
    });
</script>

<div class="container block-flow">
    <div class="heading">
        <h1>Verify</h1>
        <div class="actions">
            <a href="generate">generate</a>
        </div>
    </div>

    <FlipContent
        active={tokenCheck.status === "done" ? "back" : "front"}
        class="tile -rounded"
    >
        {#snippet front()}
            <Scanner onScan={(result) => tokenCheck.run(result.data)} data-side="front" />
        {/snippet}
        {#snippet back()}
            <div class="hero-align" data-side="back">
                <div class="actions">
                    <button onclick={() => tokenCheck.reset()}>Reset</button>
                </div>
                {#if tokenCheck.contentParsed}
                    <table>
                        <tbody>
                            {#each tokenCheck.contentParsed.entries as entry (entry.label)}
                                <tr>
                                    <th>{entry.label}</th><td>{entry.value}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                    {#if tokenCheck.contentParsed.rest}
                        <code
                            style="background-color: #efefef; border: 1px solid #ddd;"
                        >
                            <pre>{JSON.stringify(
                                    tokenCheck.contentParsed.rest,
                                    null,
                                    2,
                                )}</pre>
                        </code>
                    {/if}
                {/if}
            </div>
        {/snippet}
    </FlipContent>
</div>
