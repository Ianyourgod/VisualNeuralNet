<svelte:options accessors/>

<script>
    export let element1;
    export let element2;

    export let color;

    export let width;

    let el1Box = element1.getBoundingClientRect();
    let pos1 = {
        x: el1Box.x + el1Box.width/2,
        y: el1Box.y + el1Box.height/2
    }

    let el2Box = element2.getBoundingClientRect();
    let pos2 = {
        x: el2Box.x + el2Box.width/2,
        y: el2Box.y + el2Box.height/2
    }
</script>

<svg width="100vw" height="100vh" style="position: absolute; top: 0; left: 0;overflow: hidden;z-index: -1;">
    <line x1="{pos1.x}" y1="{pos1.y}" x2="{pos2.x}" y2="{pos2.y}" stroke="{color}" stroke-width="{Math.abs(width)+1}" />
</svg>