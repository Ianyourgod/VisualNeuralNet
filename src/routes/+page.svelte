<script>
    import { onMount } from "svelte";
    import InputContainer from "../lib/InputArray/InputContainer.svelte";
    import NetworkColumn from "../lib/NetworkColumn/NetworkColumn.svelte";

    let inputs;
    let columnUpdates = [];
    let nodes = [];
    let addNode = [];
    let toggleFuncs;

    let trainingData = [
        {
            /* 1 0 0
               0 1 0
               0 0 1 */
            inputs: [1, 0, 0, 0, 1, 0, 0, 0, 1],
            outputs: [1, 0, 0]
        },
        {
            /* 0 0 1
               0 1 0
               1 0 0 */
            inputs: [0, 0, 1, 0, 1, 0, 1, 0, 0],
            outputs: [1, 0, 0]
        },
        {
            /* 1 0 0
               1 0 0
               1 0 0 */
            inputs: [1, 0, 0, 1, 0, 0, 1, 0, 0],
            outputs: [0, 1, 0]
        },
        {
            /* 0 1 0
               0 1 0
               0 1 0 */
            inputs: [0, 1, 0, 0, 1, 0, 0, 1, 0],
            outputs: [0, 1, 0]
        },
        {
            /* 0 0 1
               0 0 1
               0 0 1 */
            inputs: [0, 0, 1, 0, 0, 1, 0, 0, 1],
            outputs: [0, 1, 0]
        },
        {
            /* 1 1 1
               0 0 0
               0 0 0 */
            inputs: [1, 1, 1, 0, 0, 0, 0, 0, 0],
            outputs: [0, 0, 1]
        },
        {
            /* 0 0 0
               1 1 1
               0 0 0 */
            inputs: [0, 0, 0, 1, 1, 1, 0, 0, 0],
            outputs: [0, 0, 1]
        },
        {
            /* 0 0 0
               0 0 0
               1 1 1 */
            inputs: [0, 0, 0, 0, 0, 0, 1, 1, 1],
            outputs: [0, 0, 1]
        }
    ];

    function sig(x) {
        return 1/(1+Math.exp(-x))
    }

    function addNodes(to, amount) {
        for (let i = 0; i < amount; i++) {
            addNode[to]();
        }
    }
    
    onMount(() => {
        addNodes(0, 9);
        addNodes(1, 9);
        addNodes(2, 3);

        toggleFuncs[0]();

        setTimeout(() => {
            onUpdate();
        }, 100);
    });

    function train() {
        trainingData.forEach((data) => {
            inputs = data.inputs;
            onUpdate();
            console.log(columnUpdates[2]);
        });
    }

    function onUpdate() {
        let prev = [];
        inputs.forEach((input) => {
            prev.push(Number(input)*2-1);
        });
        columnUpdates.forEach((func) => {
            prev = func(prev);
        });
    }
</script>

<div class="input-container">
    <InputContainer
     inputsWidth={3}
     inputsHeight={3} 
     onUpdate={onUpdate}
     bind:inputs={inputs}
     bind:toggleFuncs={toggleFuncs}
    />
</div>

<div class="network">
    <NetworkColumn
     bind:output={columnUpdates[0]} 
     bind:nodes={nodes[0]}
     inputFunction={sig}
     bind:addNode={addNode[0]}
     inputSize={9}
    />

    <NetworkColumn
     bind:output={columnUpdates[1]}
     bind:nodes={nodes[1]}
     inputFunction={sig}
     bind:addNode={addNode[1]}
     inputSize={9}
    />

    <NetworkColumn
     bind:output={columnUpdates[2]}
     bind:nodes={nodes[2]}
     inputFunction={sig}
     bind:addNode={addNode[2]}
     inputSize={9}
    />
</div>

<div class="rules">
    <img src="/diagRule.png" alt="diagonal rule">
    <img src="/vertRule.png" alt="vertical rule">
    <img src="/horiRule.png" alt="horizontal rule">
</div>

<style>
    .input-container {
        position: absolute;
        top: 50%;
        left: 5%;
        transform: translate(0%, -50%);
    }

    .network {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    :global(body) {
        background-color: rgb(34, 34, 49);
    }

    .rules {
        position: absolute;
        top: 84%;
        left: 25%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: row;
    }

    .rules img {
        align-self: center;
        width: 275px;
    }
</style>