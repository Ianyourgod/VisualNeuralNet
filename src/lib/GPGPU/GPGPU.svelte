<script>

    import { webglUtils } from "./webglUtils.js"
    import { browser } from "$app/environment"

    export let glsl;
    export let outsize;

    let canvas;
    let gl;
    let program;
    let srcTexLoc;
    let srcDimensionsLoc;
    let dstDimensionsLoc;
    let dstWidth;
    let dstHeight;
    let positionLoc;


    if (browser) {
        const vs = `
        attribute vec4 position;
        void main() {
        gl_Position = position;
        }
        `;

        const fs = `
        #define MAXITS 1000

        precision highp float;

        uniform sampler2D srcTex;
        uniform vec2 srcDimensions;
        uniform vec2 dstDimensions;

        vec4 getValueFrom2DTextureAs1DArray(sampler2D tex, vec2 dimensions, float index) {
            float y = floor(index / dimensions.x);
            float x = mod(index, dimensions.x);
            vec2 texcoord = (vec2(x, y) + 0.5) / dimensions;
            return texture2D(tex, texcoord);
        }

        vec4 userfunc(float index) {
            ${glsl}
        }

        void main() {
            vec2 dstPixel = floor(gl_FragCoord.xy);
            float dstIndex = dstPixel.y * dstDimensions.x + dstPixel.x;

            gl_FragColor = userfunc(dstIndex);
        }
        `;

        dstWidth = 0;
        dstHeight = 0;

        canvas = document.createElement('canvas');
        canvas.width = dstWidth;
        canvas.height = dstHeight;

        gl = canvas.getContext('webgl');

        program = webglUtils.createProgramFromSources(gl, [vs, fs]);
        positionLoc = gl.getAttribLocation(program, 'position');
        srcTexLoc = gl.getUniformLocation(program, 'srcTex');
        srcDimensionsLoc = gl.getUniformLocation(program, 'srcDimensions');
        dstDimensionsLoc = gl.getUniformLocation(program, 'dstDimensions');

        // setup a full canvas clip space quad
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
        1, -1,
        -1,  1,
        -1,  1,
        1, -1,
        1,  1,
        ]), gl.STATIC_DRAW);

        // setup our attributes to tell WebGL how to pull
        // the data from the buffer above to the position attribute
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(
            positionLoc,
            2,         // size (num components)
            gl.FLOAT,  // type of data in buffer
            false,     // normalize
            0,         // stride (0 = auto)
            0,         // offset
        );

        // create our source texture;
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    }

    export function update(inputs) {
        dstWidth = outsize;
        dstHeight = 1;

        canvas.width = dstWidth;
        canvas.height = dstHeight;

        let workingInputs = (inputs.flat()).map((x) => Math.floor(x * 255));

        console.log(workingInputs);

        console.log(inputs[0].length, inputs.length);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,                // mip level
            gl.LUMINANCE,     // internal format
            inputs[0].length, // width
            inputs.length, // height
            0,                // border
            gl.LUMINANCE,     // format
            gl.UNSIGNED_BYTE, // type
            new Uint8Array(workingInputs));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.useProgram(program);
        gl.uniform1i(srcTexLoc, 0);  // tell the shader the src texture is on texture unit 0
        gl.uniform2f(srcDimensionsLoc, inputs[0].length, inputs.length);
        gl.uniform2f(dstDimensionsLoc, dstWidth, dstHeight);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
        const results = new Uint8Array(dstWidth * dstHeight * 4);
        gl.readPixels(0, 0, dstWidth, dstHeight, gl.RGBA, gl.UNSIGNED_BYTE, results);

        let out = [];
        console.log(results);
        for (let i = 0; i < dstWidth * dstHeight; ++i) {
            out.push(results[i * 4]);
        }

        return out;
    }
</script>