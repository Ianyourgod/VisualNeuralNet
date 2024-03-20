<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import InputContainer from "$lib/InputArray/InputContainer.svelte";
    import NetworkColumn from "$lib/NetworkColumn/NetworkColumn.svelte";
    import Line from "$lib/Line/Line.svelte";
    import Input from "$lib/InputArray/Input.svelte";

    let columnUpdates = [];
    let updateColumnValues = [];
    let nodes = [];
    let addNode = [];
    let toggleFuncs;
    let weights = [];
    let nodeElements = [];
    let bias;
    let use_gpu = false;
    const gpu = browser ? new GPU() : null;
    console.log("Dont mind these warnings, they're from the gpu library.");

    const trainingURL = "/lines.json"

    let trainingCount = 2000;

    let trainingData = [];

    function sig(x) {
        return 1/(1+Math.exp(-x))
    }
    
    onMount(() => {
        fetch(trainingURL).then((res) => res.json())
        .then((data) => {
            trainingData = data;
        });

        // go through all the nodes of the first layer
        for (let i=0;i<nodeElements.length-1;i++) {
            nodeElements[i].forEach((node) => {
                // go through all the nodes of the second layer
                nodeElements[i+1].forEach((node2) => {
                });
            });
        }

        setTimeout(() => {
            onUpdate();
        }, 100);
    });

    function runThrough(update, use_gpu=true) {

        let prev = [];
        nodes[0].forEach((input) => {
            prev.push(Number(input)*2-1);
        });
        
        if (use_gpu) {
            prev = prev.concat([1]);

            let vals = [];

            const columnOutput = gpu.createKernel(function(input_weights) {
                let sum = 0;
                for (let i = 0; i < this.constants.size; i++) {
                    sum += input_weights[0][i] * input_weights[this.thread.x+1][i];
                }

                return 1/(1+Math.exp(-sum));
            });

            columnOutput.setDynamicOutput(true);
            columnOutput.setDynamicArguments(true);

            for (let i=0;i<nodes.length-1;i++) {
                columnOutput.setOutput([nodes[i+1].length])
                            .setConstants({size: nodes[i].length+1}); 
                            
                let shaderInputs = [prev].concat(weights[i]);

                let output = Array.from(columnOutput(shaderInputs));
                
                vals.push(output);

                prev = output.concat([1]);
            }

            if (update) {
                vals.forEach((val, i) => {
                    nodes[i+1] = val;
                });
            }

            return vals[vals.length-1];
        } else {
            columnUpdates.forEach((func) => {
                prev = func(prev);
            });

            return prev;
        }
    }

    function test() {
        let final = 0;
        trainingData.forEach((data) => {
            nodes[0] = data.inputs;
            let outputs = data.outputs;
            let out = runThrough(false, use_gpu);

            for (let i = 0; i < out.length; i++) {
                final += Math.pow(out[i] - outputs[i], 2);
            }
        });
        return final;
    }

    function trainOnce() {
        // loop over all the weights, fiddle with em and see what works
        let best = [0, 0, 0, 0, 9999999]; // [column, node, weight, change, total]
        weights.forEach((column, i) => {
            column.forEach((node, j) => {
                node.forEach((weight, k) => {
                    let testVal;
                    weights[i][j][k] += .1;
                    testVal = test();
                    if (testVal < best[4]) {
                        best = [i, j, k, 1, testVal];
                    }
                    weights[i][j][k] = weight - .1;
                    testVal = test();
                    if (testVal < best[4]) {
                        best = [i, j, k, 0, testVal];
                    }
                    weights[i][j][k] = weight; // reset
                });
            });
        });

        // apply the best change
        weights[best[0]][best[1]][best[2]] += best[3] ? .1 : -.1;
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
        runThrough(true, use_gpu);
    }
</script>

<button on:click={() => {trainWithoutLag(trainingCount);runThrough(true, use_gpu);}}>Train</button>

<button on:click={() => {
    let start=Date.now();
    trainOnce();
    console.log(Date.now()-start);
    runThrough(true, use_gpu);
}}>Train Once</button>

<button on:click={() => {
    let res = test();
    runThrough(true, use_gpu);
    console.log(res);
    alert(res);
    
}}>Test</button>

<button on:click={() => {
    let start = Date.now();
    let res = runThrough(true, use_gpu);
    console.log("Time Taken:", Date.now()-start);
    console.log(res);
    alert(res);

}}>Run Through</button>

10<input type="range" min=10 max=5000 step=10 bind:value={trainingCount} />5000
({trainingCount})

<input type="checkbox" bind:checked={use_gpu} />
use gpu (only for <b>VERY LARGE</b> networks)


<div class="input-container">
    <InputContainer
     inputsWidth={3}
     inputsHeight={3} 
     onUpdate={onUpdate}
     bind:inputs={nodes[0]}
     bind:toggleFuncs={toggleFuncs}
     bind:inputElements={nodeElements[0]}
    />
    <Input
     onclick={()=>{}}
     value={true}
     enabled={false}
     bind:button={bias}
    /> <!-- bias -->
</div>

<div class="network">
    <NetworkColumn
     bind:output={columnUpdates[0]} 
     bind:nodes={nodes[1]}
     inputFunction={sig}
     bind:addNode={addNode[0]}
     bind:nodeWeights={weights[0]}
     bind:nodeElements={nodeElements[1]}
     inputSize={9}
     startingNeurons={4}
     bind:updateNodes={updateColumnValues[0]}
    />

    <NetworkColumn
     bind:output={columnUpdates[1]} 
     bind:nodes={nodes[2]}
     inputFunction={sig}
     bind:addNode={addNode[1]}
     bind:nodeWeights={weights[1]}
     bind:nodeElements={nodeElements[2]}
     inputSize={4}
     startingNeurons={3}
     bind:updateNodes={updateColumnValues[1]}
    />
</div>

{#each nodeElements as _, i}
    {#each nodeElements[i] as node1, j}
        {#if i < nodeElements.length-1}
            {#each nodeElements[i+1] as node2, k}
                <Line
                 bind:element1={node1}
                 bind:element2={node2}
                 width={1+weights[i][k][j]/5}
                 color={`#${(Math.floor((-nodes[i][j]*15)+15)).toString(16).repeat(3)}`}
                />
            {/each}
        {/if}
        {#if i > 0}
            <Line
             bind:element1={bias}
             bind:element2={node1}
             width={1+weights[i-1][j][weights[i-1][j].length-1]/5}
             color="black"
            />
        {/if}
    {/each}
{/each}

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
        background-color: rgb(69, 69, 117);
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