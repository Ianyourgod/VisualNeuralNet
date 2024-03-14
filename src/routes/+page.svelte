<script>
    import { browser } from '$app/environment'; 
    import { onMount } from "svelte";
    import InputContainer from "../lib/InputArray/InputContainer.svelte";
    import NetworkColumn from "../lib/NetworkRow/NetworkColumn.svelte";
    import LeaderLine from 'leader-line';

    let inputs;

    let nodes;

    onMount(() => {   
        nodes.push(.5);
    });
</script>

<div class="input-container">
    <InputContainer inputsWidth={3} inputsHeight={3} bind:inputs={inputs}/>
</div>

<NetworkColumn bind:nodes={nodes} />

<style>
    .input-container {
        position: absolute;
        top: 50%;
        left: 5%;
        transform: translate(0%, -50%);
    }
</style>