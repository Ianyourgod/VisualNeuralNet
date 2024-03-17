<script>
    import Input from './Input.svelte';

    // get amount of inputs wanted (default 3x3)
    export let inputsWidth = 3;
    export let inputsHeight = 3;

    export let onUpdate;

    export let toggleFuncs = [];

    let container;

    export const inputs = [];
    export const inputElements = [];

    // fill the array with width*height inputs
    for (let i = 0; i < inputsHeight*inputsHeight; i++) {
        inputs.push(false);
    }

    function inputOnclick(id, state) {
        inputs[id] = state;
        onUpdate();
    }
</script>

<div class="inputs-container" bind:this={container}>
    {#each Array(inputsHeight) as input, i}
        <div class="row">
            {#each Array(inputsWidth) as _, j}
                <Input
                 bind:button={inputElements[i*inputsWidth+j]}
                 onclick={(state) => inputOnclick(i*inputsWidth+j, state)}
                 bind:toggle={toggleFuncs[i*inputsWidth+j]}
                />
            {/each}
        </div>
    {/each}
</div>

<style>
    .inputs-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
</style>