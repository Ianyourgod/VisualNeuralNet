import { onMount } from 'svelte';

    let canvas;
    
    function drawSquare(ctx, s, color="#000", fill=false) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.rect(s.x, s.y, s.w, s.h);
        ctx.stroke();

        if (fill) {
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    function drawLine(ctx, p1, p2, color="#000", thickness=1) {
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }

    function drawCircle(ctx, c, color="#000", fill=false) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
        ctx.stroke();

        if (fill) {
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    onMount(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');

        const inputs = [
            { x: 100, y: 100, w: 100, h: 100, on: false },
            { x: 200, y: 100, w: 100, h: 100, on: false },
            { x: 300, y: 100, w: 100, h: 100, on: false },
            { x: 100, y: 200, w: 100, h: 100, on: false },
            { x: 200, y: 200, w: 100, h: 100, on: true },
            { x: 300, y: 200, w: 100, h: 100, on: false },
            { x: 100, y: 300, w: 100, h: 100, on: false },
            { x: 200, y: 300, w: 100, h: 100, on: false },
            { x: 300, y: 300, w: 100, h: 100, on: false },
        ]

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            inputs.forEach(s => {
                if (s.on)
                    drawSquare(ctx, s, "#000", true);
                drawSquare(ctx, s, "#0FF", false);
            });
        }

        draw();
    });