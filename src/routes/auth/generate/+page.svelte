<script lang="ts">
    import { onMount } from "svelte";
    import encodeQr from "qr";
    import type { PageProps } from "./$types";

    const {
        data,
        form
    }: PageProps = $props();

    let barcodeImg = $state<Image>()

    onMount(() => {
        if (form?.token && barcodeImg) {
            const svg = encodeQr(form.token, 'svg')
            barcodeImg.src= 'data:image/svg+xml;base64,' + btoa(svg)
        }
    })
</script>

<a href="verify" class="no-print">verify</a>
<h1 class="no-print">Generate</h1>
{#if !form?.token}
<form method="POST" action="">
<label for="claims">Claims</label>
<textarea name="claims" id="claims" style="width: 100%; min-height: 20ch;">{JSON.stringify(data.tokenDefaults, null, 2)}</textarea>
<button type="submit">Authorize</button>
</form>
{:else}
<div class="card">
    <img class="barcode" alt="" bind:this={barcodeImg}/>
    <img src="/pics/sunset-boy.jpg" alt=""/>
</div>
<br>
<textarea name="token" id="token" readonly class="no-print">{form.token}</textarea>
{/if}

<style>
.card {
    width: 90mm; height: 50mm;
    padding: 5mm;
    
    display: grid;
    gap: 10mm;
    grid-template-areas: 'barcode rest';
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

@media print {
    .no-print {
        display: none;
    }

    .card {
        margin: 1cm;
    }
}

</style>
