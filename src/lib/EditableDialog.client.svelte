<script lang="ts">
    import { onMount } from "svelte";
    import type { useEditable } from "./editable.svelte";

    let {
        editable,
    }: {
        editable: Awaited<ReturnType<typeof useEditable>>,
    } = $props()

    let dialog = $state<HTMLDialogElement>();

    console.log('init EditableDialog');

    export function open() {
        console.log("EditableDialog.open")
        dialog?.showModal()
    }
    export function close() {
        console.log("EditableDialog.close")
        dialog?.close()
    }

    onMount(() => {
        console.log('mounted EditableDialog');
    })
</script>

<dialog class="editable-dialog" bind:this={dialog}>
    <div class="editor" id={editable.editorId}></div>
    <div class="actions">
        <button class="btn btn-primary" onclick={() => editable.save()}>Save</button>
    </div>
</dialog>

<style lang="scss">
    .editable-dialog[open] {
        width: 90vw;
        height: 90vh;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        > .editor {
            flex: 1;
            overflow: auto;
        }
    }
</style>