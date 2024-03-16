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

    const trainingURL = "/lines.json"

    let trainingCount = 2000;

    let trainingData = [];

    function sig(x) {
        return 1/(1+Math.exp(-x))
    }

    function addNodes(to, amount) {
        for (let i = 0; i < amount; i++) {
            addNode[to]();
        }
    }
    
    onMount(() => {
        fetch(trainingURL).then((res) => res.json())
        .then((data) => {
            trainingData = data;
        });

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
            inputs = data.inputs;
            let outputs = data.outputs;
            let out = runThrough();

            for (let i = 0; i < out.length; i++) {
                final += Math.pow(out[i] - outputs[i], 2);
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
                    weights[i][j][k] += .1;
                    total[0] = test();
                    weights[i][j][k] = weight - .1;
                    total[1] = test();
                    weights[i][j][k] = weight; // reset

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
        }
    }

    function trainWithoutLag(amount, startedAt) {
        if (!startedAt) {
            startedAt = Date.now();
        }
        if (amount > 0) {
            train(10);
            console.log(amount);
            setTimeout(() => {
                trainWithoutLag(amount - 10, startedAt);
            }, 0); // request animation frame pauses when the tab isn't active
        } else {
            alert(`done, took ${(Date.now() - startedAt)/1000} seconds`);
        }
    }

    function onUpdate() {
        runThrough();
    }
</script>

<button on:click={() => {trainWithoutLag(trainingCount)}}>Train</button>
<button on:click={() => {trainOnce()}}>Train Once</button>
<button on:click={() => {let res = test();console.log(res);console.log(weights);alert(res);}}>Test</button>
10<input type="range" min=10 max=5000 step=10 bind:value={trainingCount} />5000
({trainingCount})
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
     bind:nodeWeights={weights[0]}
     inputSize={9}
     startingNeurons={9}
    />

    <NetworkColumn
     bind:output={columnUpdates[1]} 
     bind:nodes={nodes[1]}
     inputFunction={sig}
     bind:addNode={addNode[1]}
     bind:nodeWeights={weights[1]}
     inputSize={9}
     startingNeurons={3}
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