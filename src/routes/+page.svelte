<script lang="ts">
    import type { PageData } from "./$types";

    const {data}: {data: PageData} = $props()
    const randI = (i: number) => (i + 7) * 51_398_509 % 211;
</script>

<section class="hero" id="landing">
    <div class="hero-name" aria-label={data.name} data-mood={data.mood}>
        {#each data.name.split('') as letter, i}
        <span style={`--i: ${randI(i)};`}>{letter}</span>
        {/each}
    </div>
</section>

<style lang="scss">
section#landing {
    display: grid;
    place-content: center;
}

.hero-name {
    font-size: var(--step-2);
    margin-block-end: -0.1em;
    > span {
        width: 1.5em; height: 1.5em;
        display: inline-grid;
        place-content: center;

        background-color: ivory;
        color: brown;
        box-shadow: 2px 2px 2px lightgray;
        border-radius: 0.2em;

        &:not(:first-child) {
            margin-inline-start: 0.1em;
            margin-block-end: 0.1em;
        }
    }

    &:is(:not([data-mood]), [data-mood="relaxed"]) {
        > span {
            animation: wave 2.4s forwards infinite;
            animation-delay: calc(0.004s * var(--i));
            translate: 0 var(--d-y);
        }
    }
    &[data-mood="excited"] {
        > span {
            animation: wiggle 0.2s forwards infinite;
            animation-delay: calc(0.007s * var(--i));
        }
    }
}
@keyframes wiggle {
    0%, 100% {
        rotate: 0;
    }
    20% {
        rotate: 2deg;
    }
    30% {
        rotate: 1deg;
    }
    60% {
        rotate: -2deg;
    }
    80% {
        rotate: 1deg;
    }
}

@keyframes wave {
    0%, 100% {
        rotate: 0;
        --d-x: -0.05em;
    }
    20% {
        rotate: 2deg;
        --d-y: 0.05em;
    }
    30% {
        rotate: 1deg;
    }
    50% {
        --d-x: 0.05em;
    }
    60% {
        rotate: -2deg;
        --d-y: -0.1em;
    }
    80% {
        rotate: 1deg;
    }
}

@property --d-x {
    syntax: "<length>";
    inherits: false;
    initial-value: 0px;
}

@property --d-y {
    syntax: "<length>";
    inherits: false;
    initial-value: 0px;
}

</style>