<script>
    import Node from "../Node/Node.svelte";

    export let nodes = [];
    const nodeUpdates = [];
    export let nodeWeights = [];
    export let inputFunction;
    export let inputSize;
    export let startingNeurons = 1;

    let container;

    function genArray(size, valFunc) {
        const arr = [];
        let val;
        for (let i=0;i<size;i++) {
            arr.push(valFunc(i));
        }
        return arr;
    }

    export function addNode() {
        nodes.push(.5);
        nodeWeights.push(genArray(inputSize+1, (i) => Math.random()*2-1)); // +1 for the bias
    }

    export function removeNode() {
        nodes.pop();
    }

    export function updateNode(i, value) {
        nodes[i] = value;
    }

    export function output(inputs) {
        const finInputs = inputs.concat([1]); // add the bias
        const out = [];
        nodeUpdates.forEach((func) => {
            out.push(func(finInputs));
        });
        return out;
    }

    for (let i=0;i<startingNeurons;i++) {
        addNode();
    }
</script>

<div class="network-column" bind:this={container}>
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
    .network-column {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

    }

    .node {
        margin: 10px;
    }
</style>