<script>
    import { onMount } from "svelte";
    
    export let value = .5;

    export let element;
</script>

<div bind:this={element} id="element" class="node" style="background-color: #{(Math.floor((-value*15)+15)).toString(16).repeat(3)}"></div>

<style>
    .node {
        border: 1px solid #345;
        width: 75px;
        height: 75px;
        border-radius: 50%;
    }
</style>