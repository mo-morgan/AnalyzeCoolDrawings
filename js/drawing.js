
// Initialize Variables
var path, ink, guesses;
// var chart, scores;
var timer = 0, lastTimestamp = 0, lastTimestamp_check = 0, idx_guess = 0;
var d_scores = {};

// Install Paper.js
paper.install(window);

// Initialize...
window.onload = function() {

    initInk();              // Initialize Ink array ()
    paper.setup('canvas');  // Setup Paper #canvas

    var tool = new Tool();  // Inititalize Paper Tool

    // Paper Tool Mouse Down Event
    tool.onMouseDown = function(event) {
        // New Paper Path and Settings
        path = new Path();
        path.strokeColor = 'black';
        path.strokeWidth = 7;

        // Get Time [ms] for each Guess (needed for accurate Google AI Guessing)
        var thisTimestamp = event.event.timeStamp;
        if(timer === 0){
            timer = 1;
            var time = 0;
        }else{
            var timeDelta = thisTimestamp - lastTimestamp;
            var time = ink[2][ink[2].length-1] + timeDelta;
        }

        // Get XY point from event w/ time [ms] to update Ink Array
        updateInk(event.point, time);
        // Draw XY point to Paper Path
        path.add(event.point);

        // Reset Timestamps
        lastTimestamp = thisTimestamp;
    }

    // Paper Tool Mouse Drag Event
    tool.onMouseDrag = function(event) {
        // Get Event Timestamp and Timestamp Delta
        var thisTimestamp = event.event.timeStamp ;
        var timeDelta = thisTimestamp - lastTimestamp;
        // Get new Time for Ink Array
        var time = ink[2][ink[2].length-1] + timeDelta;

        // Get XY point from event w/ time [ms] to update Ink Array
        updateInk(event.point, time);
        // Draw XY point to Paper Path
        path.add(event.point);

        // Reset Timestamps
        lastTimestamp = thisTimestamp;

        // Check Google AI Quickdraw every 250 m/s
        if(thisTimestamp - lastTimestamp_check > 250){
            checkQuickDraw();
            lastTimestamp_check = thisTimestamp;
        }
    }
}

// Initialize Ink Array
function initInk(){
    ink = [[],[],[]];
}

// Clear Paper Drawing Canvas
function clearDrawing() {

    // Remove Paper Path Layer
    paper.project.activeLayer.removeChildren();
    paper.view.draw();

    // Init Ink Array
    initInk();

    // Resert Variables
    timer = 0;
    idx_guess = 0;
    d_scores = {};
}

// Update Ink Array w/ XY Point + Time
function updateInk(point, time){
    ink[0].push(point.x);
    ink[1].push(point.y);
    ink[2].push(time);
}

// Get Paper Canvas Dimensions Width/Height
function getCanvasDimensions(){
    var w = document.getElementById('canvas').offsetWidth;
    var h = document.getElementById('canvas').offsetHeight;
    return {height: h, width: w};
}

// Check Quickdraw Google AI API
function checkQuickDraw(){

    // Get Paper Canvas Weight/Height
    var c_dims = getCanvasDimensions();

    // Set Base URL for Quickdraw Google AI API
    var url = 'https://inputtools.google.com/request?ime=handwriting&app=quickdraw&dbg=1&cs=1&oe=UTF-8'

    // Set HTTP Headers
    var headers = {
        'Accept': '*/*',
        'Content-Type': 'application/json'
    };

    // Init HTTP Request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    Object.keys(headers).forEach(function(key,index) {
        xhr.setRequestHeader(key, headers[key]);
    });

    // HTTP Request On Load
    xhr.onload = function() {
        if (xhr.status === 200) {
            res = xhr.responseText; // HTTP Response Text
            parseResponse(res);     // Parse Response
            idx_guess += 1;         // Iterate Guess Index
        }
        else if (xhr.status !== 200) {
            console.log('Request failed.  Returned status of ' + xhr.status);
        }
    };

    // Create New Data Payload for Quickdraw Google AI API
    var data = {
        "input_type":0,
        "requests":[
            {
                "language":"quickdraw",
                "writing_guide":{"width": c_dims.width, "height":c_dims.height},
                "ink": [ink]
            }
        ]
    };

    // Convert Data Payload to JSON String
    var request_data = JSON.stringify(data);

    // Send HTTP Request w/ Data Payload
    xhr.send(request_data);

}

// Parse Quickdraw Google AI API Response
function parseResponse(res) {
    // // Convert Response String to JSON
    var arr = JSON.parse(res);
    var success = arr[0];
    if (success !== "SUCCESS") {
        throw "Error in request";
    }

    guesses = arr[1][0][1];
    console.log(guesses);
    updateGuesses();
}

function updateGuesses() {
    var list = document.getElementById("options");
    for (let i = 0; i < list.)
}

// Create and Fill Array
function createArray(len, itm) {
    var arr1 = [itm],
        arr2 = [];
    while (len > 0) {
        if (len & 1) arr2 = arr2.concat(arr1);
        arr1 = arr1.concat(arr1);
        len >>>= 1;
    }
    return arr2;
}