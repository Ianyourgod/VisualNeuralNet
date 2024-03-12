<script>
    import { onMount } from 'svelte';
    import Input from './Input.svelte';

    // get amount of inputs wanted (default 3x3)
    export let inputsWidth = 3;
    export let inputsHeight = 3;

    let container;

    export const inputs = [];

    // fill the array with width*height inputs
    for (let i = 0; i < inputsHeight*inputsHeight; i++) {
        inputs.push(false);
    }

    function inputOnclick(id, state) {
        inputs[id] = state;
    }

    onMount(() => {
        for (let i = 0; i < inputsHeight; i++) {
            let row = document.createElement('div');
            row.classList.add('row');
            container.appendChild(row);

            for (let j = 0; j < inputsWidth; j++) {
                new Input({
                    target: row,
                    props: {
                        onclick: (state) => inputOnclick(i*inputsWidth+j, state)
                    }
                });
            }
        }
    })
</script>

<div class="inputs-container" bind:this={container}>
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