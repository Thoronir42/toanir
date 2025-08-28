<script lang="ts">
    import encodeQr from "qr";
    import type { PageProps } from "./$types";
    import { TokenGenerate } from "$lib/token.svelte";
    import FlipContent from "$lib/components/FlipContent.svelte";
    import { copyToClipboard } from "$lib/browser";

    const { data, form }: PageProps = $props();

    let barcodeImg = $state<HTMLImageElement>();
    const generate = new TokenGenerate(data.claims)

    $effect(() => {
        if (!barcodeImg || !generate.token) {
            return;
        }

        const svg = encodeQr(generate.token, "svg");
        barcodeImg.src = "data:image/svg+xml;base64," + btoa(svg);
    })
</script>

<div class="container block-flow">
    <div class="heading no-print">
        <h1>Generate</h1>
        <div class="actions">
            <a href="verify">verify</a>
        </div>
    </div>
    
    <FlipContent active={generate.token ? "back" : "front"} class="tile -rounded print-contents">
        {#snippet front()}
        <div data-side="front" class="no-print">
            <form method="POST" action="" onsubmit={(e) => {e.preventDefault(), generate.generate()}}
                    class="no-print" data-side="front"
                >
                <label for="claims">Claims</label>
                <table>
                    <tbody>
                    {#each generate.claims as claim (claim.name)}
                    {@const id = `claims[${claim.name}]`}
                    <tr>
                        <th><label for={id}>{claim.name}</label></th>
                        <td><input id={id} name={id} readonly={claim.readonly} bind:value={claim.value} /></td>
                    </tr>
                    {/each}
                    </tbody>
                </table>

                <button type="submit">Authorize</button>
            </form>
        </div>
        {/snippet}
        {#snippet back()}
        <div class="print-contents" data-side="back">
            <div class="card">
                <img class="barcode" alt="" bind:this={barcodeImg} />
                <img src="/pics/sunset-boy.jpg" alt="" />
            </div>
            <br class="no-print"/>
            <div class="actions no-print">
                <button onclick={() => copyToClipboard(generate.token)}>Copy str</button>
                <button onclick={() => generate.reset()}>Reset</button>
            </div>
        </div>
        {/snippet}
    </FlipContent>
</div>

<style>
    .card {
        width: 90mm;
        height: 50mm;
        padding: 5mm;

        display: grid;
        gap: 10mm;
        grid-template-areas: "barcode rest";
        grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
        place-items: center;

        border-radius: 0;
        background-color: #efefef;
        border: unset;

        img {
            max-height: 100%;
            max-width: 100%;
        }
    }

    :global(.flip-content) {
        [data-side] {
            display: grid;
            place-content: center;

            border-radius: inherit;
            background-color: white;
            padding: 0.5em;
        }
    }

    @media print {
        .card {
            margin: 1cm;
        }

        :global(.tile.-rounded) {
            display: contents;

            [data-side="back"] {
                transform: unset;
            }
        }
    }
</style>
