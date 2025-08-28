<script lang="ts">
    import "./flipContent.scss";

    import type { Snippet } from "svelte";

    const {
        front,
        back,
        active = 'front',
        class: className,
        ...rest
    }: {
        front: Snippet,
        back: Snippet,
        active: 'front' | 'back',
        class?: string,
    } & Record<string, any> = $props()
</script>

<div class={"flip-content" + (className ? ' ' + className : '')} data-show={active} {...rest}>
    {@render front()}
    {@render back()}
</div>
