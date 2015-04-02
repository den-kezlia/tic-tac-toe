window.onload = function() {
    var messages = [];
    var socket = io.connect('http://localhost:3700');
    var field = document.getElementById('field');
    var sendButton = document.getElementById('send');
    var content = document.getElementById('content');
    var name = document.getElementById('name');

    socket.on('message', function(data) {
        if (data.message) {
            messages.push(data);
            var html = '';

            for (var iterator = 0; iterator < messages.length; iterator++) {
                html += '<b>' + (messages[iterator].username ? messages[iterator].username : 'Server') + ': </b>';
                html += messages[iterator].message + '<br />';
            }

            content.innerHTML = html;
            content.scrollTop = content.scrollHeight;
        } else {
            console.log("There is problem:", data);
        }
    });

    sendButton.onclick = function() {
        var text = field.value;
        var username = name.value;
        socket.emit('send', {message: text, username: username});
    };
};