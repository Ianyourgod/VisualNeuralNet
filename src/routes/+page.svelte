<script>
    import { onMount } from "svelte";
    import InputContainer from "$lib/InputArray/InputContainer.svelte";
    import NetworkColumn from "$lib/NetworkColumn/NetworkColumn.svelte";
    import Line from "$lib/Line/Line.svelte";
    import Input from "$lib/InputArray/Input.svelte";
    import Gpgpu from "$lib/GPGPU/GPGPU.svelte";

    let columnUpdates = [];
    let nodes = [];
    let addNode = [];
    let toggleFuncs;
    let weights = [];
    let nodeElements = [];
    let bias;
    let shaderInputs = [];

    let output = [];
    let gpUpdate;

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

    function runThrough(gsdfs) {
        if (gsdfs) {
            shaderInputs = [nodes[1].concat([true])].concat(
                weights[1]
            );

            console.log(gpUpdate(shaderInputs));
        }

        let prev = [];
        nodes[0].forEach((input) => {
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
            nodes[0] = data.inputs;
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
        runThrough();
    }

    const shaderCode = `
        // for "getValueFrom2DTextureAs1DArray", the first item is the source texture, the second is the dimensions of the source texture, and the third is the index
        // srcDimensions is the dimensions of the source texture. Remember that everything is between 0 and 1, so you need the divide the dimensions by 255 to get the actual dimensions
        // srcTex is the source texture (inputs)

        // make a variable:
        vec4 ret = vec4(0.0, 0.0, 0.0, 0.0);

        highp int len = int(srcDimensions.x);

        for (int i = 0; i < MAXITS;i++) {
            if (i >= len) {
                break;
            }

            vec4 v1 = getValueFrom2DTextureAs1DArray(srcTex, srcDimensions, float(i));

            v1 *= getValueFrom2DTextureAs1DArray(srcTex, srcDimensions, (index+1.0)*srcDimensions.x+float(i));

            ret += v1;
        }


        ret = (1.0 / (1.0 + exp(-(ret / 255.0))));

        return ret;
    `
</script>

<button on:click={() => {trainWithoutLag(trainingCount)}}>Train</button>
<button on:click={() => {trainOnce()}}>Train Once</button>
<button on:click={() => {
    let res = test();
    console.log(res);
    alert(res);
}}>Test</button>
<button on:click={() => {runThrough(true)}}>Run Through</button>
10<input type="range" min=10 max=5000 step=10 bind:value={trainingCount} />5000
({trainingCount})
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

{#if nodes.length > 0}
    <Gpgpu
    outsize={3}
    glsl={shaderCode}
    bind:update={gpUpdate}
    />
{/if}

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