// Handles canvas drawing

const CANVAS = document.getElementById("canvas");
let rect = CANVAS.getBoundingClientRect();
CANVAS.width = rect.width;
CANVAS.height = rect.height;
let LEFT = rect.left;
let TOP = rect.top;

console.log(CANVAS.getBoundingClientRect());
const Sketcher = new function() {
    const STROKE_SIZE = 5;
    const THRESHOLD = 3;   // Dist at which a new point will be added
    let time = performance.now();
    let ctx = CANVAS.getContext('2d');
    ctx.lineWidth = STROKE_SIZE;
    let strokes = [];
    let currentStroke = 0;
    let isMouseDown = false;
    this.startStroke = function(event) {
        if (!isMouseDown) {
            isMouseDown = true;
            strokes.push([getPoint(event)]);
        }
    };
    this.endStroke = function() {
        if (isMouseDown) {
            isMouseDown = false;
            if (strokes[currentStroke].length > 1) {
                currentStroke++;
                QuickDraw.search(CANVAS.width, CANVAS.height, getInk());
            } else {
                strokes.pop();
            }
        }
    };
    this.moveStroke = function(event) {
        if (isMouseDown) {
            let point = getPoint(event);
            let current = strokes[currentStroke];
            let lastPoint = current[current.length - 1];
            if (dist(point, lastPoint) > THRESHOLD) {
                ctx.beginPath();
                ctx.moveTo(lastPoint[0], lastPoint[1]);
                strokes[currentStroke].push(point);
                ctx.lineTo(point[0], point[1]);
                ctx.stroke();
            }
        }
    };
    this.clear = function() {
        strokes = [];
        currentStroke = 0;
        isMouseDown = false;
        time = performance.now();
        draw();
    };
    this.undo = function() {
        if (strokes.length > 0) {
            strokes.pop();
            currentStroke--;
            draw();
        }
    };
    let draw = function() {
        ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
        for (let i = 0; i < strokes.length; i++) {
            // Draw a stroke
            let stroke = strokes[i];
            ctx.beginPath();
            ctx.moveTo(stroke[0][0], stroke[0][1]);
            for (let j = 1; j < stroke.length; j++) {
                ctx.lineTo(stroke[j][0], stroke[j][1]);
            }
            ctx.stroke();
        }
    };

    let getPoint = function(event) {
        return [event.pageX - LEFT, event.pageY - TOP, event.timeStamp - time];
    };

    let dist = function(point1, point2) {
        let dx = point1[0] - point2[0];
        let dy = point1[1] - point2[1];
        return Math.sqrt(dx*dx + dy*dy);
    };

    let getInk = function() {
        let ink = [[],[],[]];
        for (let i = 0; i < strokes.length; i++) {
            let stroke = strokes[i];
            for (let j = 0; j < stroke.length; j++) {
                let point = stroke[j];
                ink[0].push(point[0]);
                ink[1].push(point[1]);
                ink[2].push(point[2]);
            }
        }
        return ink;
    }
};

// Register listeners
CANVAS.addEventListener("mousedown", Sketcher.startStroke);
CANVAS.addEventListener("mouseup", Sketcher.endStroke);
CANVAS.addEventListener("mouseleave", Sketcher.endStroke);
CANVAS.addEventListener("mousemove", Sketcher.moveStroke);

CANVAS.addEventListener("touchstart", Sketcher.startStroke);
CANVAS.addEventListener("touchend", Sketcher.endStroke);
CANVAS.addEventListener("touchcancel", Sketcher.endStroke);
CANVAS.addEventListener("touchmove", Sketcher.moveStroke);

// Key listeners
window.addEventListener("keypress", (e) => {
    console.log(e.key);
    if (e.key === 'z') {
        Sketcher.undo();
    } else if (e.key === 'x') {
        Sketcher.clear();
    }
});

window.addEventListener("resize", (e) => {
    rect = CANVAS.getBoundingClientRect();
    CANVAS.width = rect.width;
    CANVAS.height = rect.height;
    LEFT = rect.left;
    TOP = rect.top;
});