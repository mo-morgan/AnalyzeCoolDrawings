const TEST_BOT = new function() {
    const URL = "https://shard-bail.glitch.me/sketch/draw";
    const CHANNEL_ID = window.location.toString().split('?channel=')[1];

    this.sendResponse = function(answer) {
        console.log("Received: " + answer);
        let xhr = new XMLHttpRequest();
        let headers = {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        };
        xhr.open('POST', URL);
        Object.keys(headers).forEach((key, index) => {
            xhr.setRequestHeader(key, headers[key]);
        });

        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log("succ");
            } else {
                console.log('Request failed, status: ' + xhr.status);
            }
        };

        let data = {
            "channel": CHANNEL_ID,
            "word": answer
        };

        let request_data = JSON.stringify(data);
        // let request_data = "?channel=" + CHANNEL_ID + "&word=" + answer;

        // Send HTTP Request w/ Data Payload
        console.log("Sending data: " + request_data);
        xhr.send(request_data);
    };

    this.print = function() {
        console.log("channel_id: " + CHANNEL_ID);
    }
};

TEST_BOT.print();