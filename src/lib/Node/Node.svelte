<script>
    export let value = .5;
    export let inputFunction;
    export let connections;

    export function setValue(inputs) {
        let final = 0;
        inputs.forEach((input, i) => {
            final += Number(input)*connections[i];
        });
        final = inputFunction(final);
        value = final
        return final
    }
</script>

<div class="node" style="background-color: #{(Math.floor((-value*15)+15)).toString(16).repeat(3)}">
</div>

<style>
    .node {
        border: 1px solid #345;
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
</style>