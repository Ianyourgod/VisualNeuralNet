<script>
    import { onMount } from "svelte";
    import InputContainer from "../lib/InputArray/InputContainer.svelte";
    import NetworkColumn from "../lib/NetworkColumn/NetworkColumn.svelte";
    import Line from "../lib/Line/Line.svelte";

    let inputs;
    let nodes;

    let nodeElements = [];

    let inputContainer;
    let networkColumn;

    let addNode;

    let lines = [];

    onMount(() => {
        addNode();
    });

</script>

<div class="input-container" bind:this={inputContainer}>
    <InputContainer inputsWidth={3} inputsHeight={3} bind:inputs={inputs}/>
</div>

<div class="network-column" bind:this={networkColumn}>
    <NetworkColumn
     bind:nodes={nodes}
     bind:this={networkColumn}
     bind:nodeElements={nodeElements}
     bind:addNode={addNode}
    />
</div>

{#key nodes}
    {#each nodeElements as element, i}
        <Line bind:this={lines[i]} element1={inputContainer} element2={element}/>
    {/each}
{/key}

<style>
    .input-container {
        position: absolute;
        top: 50%;
        left: 5%;
        transform: translate(0%, -50%);
    }

    .network-column {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>