<script>
    import { onMount } from "svelte";
    import InputContainer from "../lib/InputArray/InputContainer.svelte";
    import NetworkColumn from "../lib/NetworkColumn/NetworkColumn.svelte";

    let inputs;
    let columnUpdates = [];
    let nodes = [];
    let addNode = [];
    let toggleFuncs;
    let weights = [];

    let trainingCount = 2000;

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

    function runThrough() {
        let prev = [];
        inputs.forEach((input) => {
            prev.push(Number(input)*2-1);
        });
        columnUpdates.forEach((func) => {
            prev = func(prev);
        });
        return prev;
    }

    function test() {
        let final = 0;
        trainingData.forEach((data) => {
            let _inputs = data.inputs;
            let outputs = data.outputs;
            inputs = _inputs;
            let out = runThrough();

            for (let i = 0; i < out.length; i++) {
                final += Math.abs(out[i] - outputs[i]);
            }
        });
        return final;
    }

    function trainOnce() {
        // loop over all the weights, fiddle with em and see what works
        let changes = [];
        weights.forEach((column, i) => {
            let change = [];
            column.forEach((node, j) => {
                let nodeChange = [];
                node.forEach((weight, k) => {
                    let total = [0, 0];
                    weights[i][j][k] = weight + .1;
                    total[0] = test();
                    weights[i][j][k] = weight - .1;
                    total[1] = test();
                    weights[i][j][k] = weight;

                    nodeChange.push(total);
                });
                change.push(nodeChange);
            });
            changes.push(change);
        });

        // now find the best change
        let best = [0, 0, 0, 0, 9999999]; // [column, node, weight, change, total]
        changes.forEach((column, i) => {
            column.forEach((node, j) => {
                node.forEach((changes, k) => {
                    changes.forEach((change, l) => {
                        if (change < best[4]) {
                            best = [i, j, k, l, change];
                        }
                    });
                });
            });
        });

        // apply the best change
        weights[best[0]][best[1]][best[2]] += best[3] ? -.1 : .1;
    }

    function train(amount) {
        for (let i = 0; i < amount; i++) {
            trainOnce();
            onUpdate();
        }
    }

    function trainWithoutLag(amount) {
        if (amount > 0) {
            train(10);
            console.log(amount);
            requestAnimationFrame(() => {
                trainWithoutLag(amount - 10);
            });
        } else {
            alert("done");
        }
    }

    function onUpdate() {
        runThrough();
    }
</script>

<button on:click={() => {trainWithoutLag(trainingCount)}}>Train</button>
<button on:click={() => {console.log(test())}}>Test</button>
10<input type="range" min=10 max=5000 step=10 bind:value={trainingCount} />5000

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
     bind:nodeWeights={weights[0]}
    />

    <NetworkColumn
     bind:output={columnUpdates[1]}
     bind:nodes={nodes[1]}
     inputFunction={sig}
     bind:addNode={addNode[1]}
     inputSize={9}
     bind:nodeWeights={weights[1]}
    />

    <NetworkColumn
     bind:output={columnUpdates[2]}
     bind:nodes={nodes[2]}
     inputFunction={sig}
     bind:addNode={addNode[2]}
     inputSize={9}
     bind:nodeWeights={weights[2]}
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
        color: white;   
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