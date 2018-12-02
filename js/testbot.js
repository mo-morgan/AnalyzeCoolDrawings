// Interface for communicating with the slack test bot

const TestBot = new function() {
    const URL = "https://shard-bail.glitch.me/sketch/draw";
    const MESSAGE_ID = window.location.toString().split('?key=')[1];

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
                window.alert("MESSAGE_ID can only be used once!");
            }
        };

        let data = {
            "message_id": MESSAGE_ID,
            "word": answer
        };

        let request_data = JSON.stringify(data);
        console.log("Sending data: " + request_data);
        xhr.send(request_data);
    };

    this.print = function() {
        console.log("message_id: " + MESSAGE_ID);
    }
};

TestBot.print();