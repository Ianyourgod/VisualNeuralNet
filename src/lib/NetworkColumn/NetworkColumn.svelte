<script>
    import Node from "../Node/Node.svelte";

    export const nodes = [];
    const nodeUpdates = [];
    export let inputFunction;

    let container;

    export function addNode() {
        nodes.push(.5);
    }

    export function removeNode() {
        nodes.pop();
    }

    export function updateNode(i, value) {
        nodes[i] = value;
    }

    export function output(inputs) {
        const out = [];
        nodeUpdates.forEach((func) => {
            out.push(func(inputs));
        });
        return out;
    }
</script>

<div class="network-row" bind:this={container}>
    {#each nodes as node, i}
        <div class="node">
            <Node
             bind:value={nodes[i]}
             inputFunction={inputFunction}
             bind:setValue={nodeUpdates[i]}
            />
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