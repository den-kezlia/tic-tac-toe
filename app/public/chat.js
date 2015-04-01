window.onload = function() {
    var messages = [];
    var socket = io.connect('http://localhost:3700');
    var field = document.getElementById('field');
    var sendButton = document.getElementById('send');
    var content = document.getElementById('content');

    socket.on('message', function(data) {
        if (data.message) {
            messages.push(data.message);
            var html = '';
            for (var iterator = 0; iterator < messages.length; iterator++) {
                html += messages[iterator] + '<br />';
            }
            console.log(html);
            content.innerHTML = html;
        } else {
            console.log("There is problem:", data);
        }
    });

    sendButton.onclick = function() {
        var text = field.value;
        socket.emit('send', {message: text});
    };
};