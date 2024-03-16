<script>
    let button;
    export let value = false;

    export let onclick;

    export function toggle() {
        value = !value;
        button.style.backgroundColor = value ? "#000" : "#f3f2f0";
        onclick(value);
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