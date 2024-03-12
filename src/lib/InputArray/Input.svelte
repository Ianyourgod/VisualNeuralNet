<script>
    let button;
    let state = false;

    export let onclick;

    function toggle() {
        state = !state;
        button.style.backgroundColor = state ? "#000" : "#f3f2f0";
        onclick(state);
    }
</script>

<button bind:this={button} on:click={toggle} class="input" />


<style>
    .input {
        border: 1px solid #345;
        background-color: #f0f0f0;
        width: 75px;
        height: 75px;
    }

    .input:hover {
        cursor: pointer;
    }
</style>