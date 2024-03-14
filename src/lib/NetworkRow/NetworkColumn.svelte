<script>
    import Node from "../Node/Node.svelte";

    export let nodes = [];

    let container;

    function addNode() {
        nodes.push(.5);
    }

    function removeNode() {
        nodes.pop();
    }

    function updateNode(i, value) {
        nodes[i] = value;
    }
</script>

<div class="network-row" bind:this={container}>
    {#each nodes as node, i}
        <div class="node">
            <Node bind:value={nodes[i]} />
        </div>
    {/each}
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