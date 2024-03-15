<script>
    import { onMount } from "svelte";
    import InputContainer from "../lib/InputArray/InputContainer.svelte";
    import NetworkColumn from "../lib/NetworkColumn/NetworkColumn.svelte";

    let inputs;

    let nodes;

    function sig(x) {
        return 1/(1+Math.exp(-x*100))
    }
    
    onMount(() => {   
        nodes.push(.5);
    });
</script>

<div class="input-container">
    <InputContainer inputsWidth={3} inputsHeight={3} bind:inputs={inputs}/>
</div>

<NetworkColumn bind:nodes={nodes} inputFunction={sig} />

<style>
    .input-container {
        position: absolute;
        top: 50%;
        left: 5%;
        transform: translate(0%, -50%);
    }
</style>