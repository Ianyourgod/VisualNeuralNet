<script>
    import Node from "../Node/Node.svelte";

    export let nodes = [];
    const nodeUpdates = [];
    export let nodeWeights = [];
    export let inputFunction;
    export let inputSize;

    let container;

    function genArray(size, val) {
        const arr = [];
        for (let i=0;i<size;i++) {
            arr.push(val);
        }
        return arr;
    }

    export function addNode() {
        nodes.push(.5);
        nodeWeights.push(genArray(inputSize, 1));
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
             bind:connections={nodeWeights[i]}
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