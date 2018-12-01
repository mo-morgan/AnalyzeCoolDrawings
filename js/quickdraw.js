const QuickDraw = new function() {
    const URL = 'https://inputtools.google.com/request?ime=handwriting&app=quickdraw&dbg=1&cs=1&oe=UTF-8';
    this.search = function(width, height, ink) {
        console.log("Searching: " + width + "x" + height);
        console.log(ink);
        let headers = {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        };

        let xhr = new XMLHttpRequest();
        xhr.open('POST', URL);
        Object.keys(headers).forEach((key, index) => {
            xhr.setRequestHeader(key, headers[key]);
        });

        xhr.onload = function() {
            if (xhr.status === 200) {
                parseResponse(xhr.responseText);
            } else {
                console.log('Request failed, status: ' + xhr.status);
            }
        };

        let data = {
            "input_type":0,
            "requests":[
                {
                    "language":"quickdraw",
                    "writing_guide":{"width": width, "height":height},
                    "ink": [ink]
                }
            ]
        };

        let request_data = JSON.stringify(data);

        // Send HTTP Request w/ Data Payload
        xhr.send(request_data);
    };

    let parseResponse = function(text) {
        console.log(text);
    };
};