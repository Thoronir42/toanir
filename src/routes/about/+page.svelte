<script lang="ts">
    import { useEditable } from "$lib/editable.svelte";
    import { onMount, tick } from "svelte";
    import type { PageData } from "./$types";
    import EditableDialog from "$lib/EditableDialog.client.svelte";
    import { page } from "$app/state";
    // import {useEditable} from "$lib/editable.client";

    const {data}: {data: PageData} = $props()
    let editable: null | Awaited<ReturnType<typeof useEditable>> = $state(null)

    onMount(async () => {
        console.log(data.canEdit)
        if (data.canEdit) {
            editable = useEditable({
                save: {page: page.url.pathname},
            })
            console.log({editable})
        }

        document.querySelector('.btn.btn-outline-primary')?.click()
        await editable?.open({
            blocks: [
                {type: "header", data: {text: "Ahoj", level: 3}},
                {type: "paragraph", data: {text: "Toto"}},
            ]
        })
        document.querySelector('.editable-dialog > .actions .btn.btn-primary')?.click()
    })
</script>

<section class="heading">
    <h1>{data.pageTitle}</h1>
    {#if editable}
    <button class="btn btn-outline-primary" onclick={() => editable?.open(data.editable.data)}>Edit</button>
    {/if}
</section>

<section class="content">
{@html data.editable.html}
</section>

{#if editable}
<EditableDialog editable={editable} bind:this={editable.dialog}/>
{/if}
