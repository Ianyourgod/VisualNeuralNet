<script>
    import InputContainer from "../lib/InputArray/InputContainer.svelte";

    let inputs;
</script>

<div class="input-container">
    <InputContainer inputsWidth={3} inputsHeight={3} bind:inputs={inputs}/>
</div>


<style>
    .input-container {
        position: absolute;
        top: 50%;
        left: 5%;
        transform: translate(0%, -50%);
    }
</style>