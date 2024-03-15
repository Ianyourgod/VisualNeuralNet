<script>
    export let value = .5;
    export let inputFunction;

    export function setValue(inputs) {
        let final;
        inputs.forEach((input) => {
            final += inputFunction(input);
        });
        final /= inputs.length;
        value = final
        return final
    }
</script>

<div class="node" style="background-color: #{(Math.floor((-value*15)+15)).toString(16).repeat(3)}">
</div>

<style>
    .node {
        border: 1px solid #345;
        width: 75px;
        height: 75px;
        border-radius: 50%;
    }
</style>