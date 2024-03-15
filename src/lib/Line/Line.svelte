<script>
    import { onMount, afterUpdate } from "svelte";

    export let element1;
    export let element2;

    let startPos = {x: 0, y: 0};
    let pos = {x: 0, y: 0};

    function updateLine() {
        let el1Rect = element1.getBoundingClientRect();
        let el2Rect = element2.getBoundingClientRect();

        let pos1 = {
            x: el1Rect.left+el1Rect.width/2,
            y: el1Rect.top+el1Rect.height/2
        };

        let pos2 = {
            x: el2Rect.left+el2Rect.width/2,
            y: el2Rect.top+el2Rect.height/2
        };

        let line = document.getElementById("line");

        line.setAttribute('width', Math.abs(pos2.x-pos1.x)+3);
        
        line.setAttribute('height', Math.abs(pos1.y-pos2.y)+3);

        line.style.left = Math.min(pos1.x, pos2.x)-1 + "px";
        line.style.top = Math.min(pos1.y, pos2.y)-1 + "px";

        let topLeft = {
            x: Math.min(pos1.x, pos2.x),
            y: Math.min(pos1.y, pos2.y)
        };

        startPos = {
            x: pos1.x-topLeft.x,
            y: pos1.y-topLeft.y
        };

        pos = {
            x: pos2.x-topLeft.x,
            y: pos2.y-topLeft.y
        };
    
        let lineEl = document.getElementById("lineEl");

        lineEl.setAttribute('x1', startPos.x);
        lineEl.setAttribute('y1', startPos.y);
        lineEl.setAttribute('x2', pos.x);
        lineEl.setAttribute('y2', pos.y);
    }

    onMount(updateLine);
    afterUpdate(updateLine);

</script>

<svg id="line" class="line-svg">
    <line id="lineEl" class="line" x1={0} y1={0} x2={0} y2={0} />
</svg>

<style>
    .line-svg {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    }

    .line {
        stroke: #000;
        stroke-width:2;
    }
</style>