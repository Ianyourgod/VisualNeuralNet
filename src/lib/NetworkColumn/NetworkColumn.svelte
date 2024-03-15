<script>
    import Node from "../Node/Node.svelte";

    export let nodes = [];

    export let nodeElements = [];
    let val = 0;

    let container;

    export function addNode() {
        nodes.push(val);
        val += .1;
        nodes = nodes;
    }

    export function removeNode() {
        nodes.pop();
        nodes = nodes;
    }

    export function updateNode(i, value) {
        nodes[i] = value;
        nodes = nodes;
    }
</script>

<div class="network-row" bind:this={container}>
    {#each nodes as node, i}
        <div class="node">
            <Node bind:value={nodes[i]} bind:element={nodeElements[i]} />
        </div>
    {/each}

    <button on:click={addNode}>Add Node</button>
</div>

<style>
    .network-row {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

    }

    .node {
        margin: 10px;
    }
</style>