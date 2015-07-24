$(document).ready(function() {
    App = {
        port: '3700',
        host: 'localhost',
        matrix: [],
        layout: $('#game-board'),
        cells: $('.cell'),
        tic: 10,
        toe: 100,
        lastTurn: 'toe',
        winners: [30, 300],
        winnerDiv: $('#winner'),
        resetButton: $("#reset"),
        socket: io.connect('http://localhost:3700'),
        team: $(".team"),
        start: $("#startgame"),
        username: $("#username"),

        init: function() {
            this.hideGameBoard();
            this.selectTeam();
            this.initSockets();
            this.initPlayers();
            this.initResetButton();
        },

        hideGameBoard: function() {
            $('#main').hide();
        },

        showGameBoard: function() {
            $("#waitingForPlayer").hide();
            $('#main').show();
        },

        selectTeam: function() {
            App.start.on("click", function() {
                App.socket.emit('selectTeam', {
                    team: App.team.filter(':checked').val(),
                    name: App.username.val()
                });

                var xhr = new XMLHttpRequest();
                xhr.open("POST", "/", true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    //login: this.elements.login.value,
                    //password: this.elements.password.value
                }));

                xhr.onload = function() {
                    if (this.responseText === "ok") {
                        document.location = "/";
                    }
                    else{
                        alert(this.responseText);
                    }
                };
            });
        },

        initSockets: function() {
            App.socket.on('matrix', function(data) {
                var matrix = data.matrix;
                App.matrix = matrix;
                App.lastTurn = data.lastTurn;

                for (var row = 0; row < matrix.length; row++) {
                    for (var column = 0; column < matrix[row].length; column++) {
                        if (matrix[row][column] == 0) {
                            App.cells.filter('[data-row="' + row + '"]')
                                     .filter('[data-column="' + column + '"]').removeClass("tic tac disabled");
                        } else if (matrix[row][column] == App.tic) {
                            App.cells.filter('[data-row="' + row + '"]')
                                .filter('[data-column="' + column + '"]').addClass("tic disabled");
                        } else if (matrix[row][column] == App.toe) {
                            App.cells.filter('[data-row="' + row + '"]')
                                .filter('[data-column="' + column + '"]').addClass("toe disabled");
                        }
                    }
                }

                App.checkWinner();
            });

            App.socket.on("noFreeSpace", function() {
                $("#room").show().html('no free space');
            });

            App.socket.on("startGame", function(roomId) {
                $("#select-team").hide();
                $("#room").show().find('.value').html(roomId);

                App.showGameBoard();
                App.initBaseLayout();
            });

            App.socket.on("waitingForPlayer", function(data) {
                $("#select-team").hide();
                $("#waitingForPlayer").show();
                $("#players").show();
                $("#first-player").html(data.name);
                $("#room").show().find('.value').html(data.roomId);
            });

            App.socket.on("rivalInfo", function(data) {
                $("#players").show();
                $("#first-player").html(data.name);
                $("#second-player").html(data.rival);
            });

            App.socket.on("sendGameBoard", function(layout) {
                App.updateLayout(layout);
            });
        },

        initBaseLayout: function() {
            App.matrix =
               [[0, 0, 0],
               [0, 0, 0],
               [0, 0, 0]];

            App.lastTurn = 'toe';
            App.cells.removeClass("tic toe disabled");
            App.sendGameBoard();
        },

        sendGameBoard: function() {
            App.socket.emit('updateMatrix', {
                matrix: App.matrix,
                lastTurn: App.lastTurn
            });
        },

        sendStep: function(data) {
            App.socket.emit('getStep', data);
        },

        initPlayers: function() {
            $('.cell').on('click', function() {
                App.sendStep({row: $(this).data("row"), column: $(this).data("column")});
            });
        },

        checkWinner: function() {
            var matrix = App.matrix;
            var variations = [];

            variations.push( $.inArray(( matrix[0][0] + matrix[0][1] + matrix[0][2]), App.winners ) );
            variations.push( $.inArray(( matrix[1][0] + matrix[1][1] + matrix[1][2]), App.winners ) );
            variations.push( $.inArray(( matrix[2][0] + matrix[2][1] + matrix[2][2]), App.winners ) );

            variations.push( $.inArray(( matrix[0][0] + matrix[1][0] + matrix[2][0]), App.winners ) );
            variations.push( $.inArray(( matrix[0][1] + matrix[1][1] + matrix[2][1]), App.winners ) );
            variations.push( $.inArray(( matrix[0][2] + matrix[1][2] + matrix[2][2]), App.winners ) );

            variations.push( $.inArray(( matrix[0][0] + matrix[1][1] + matrix[2][2]), App.winners ) );
            variations.push( $.inArray(( matrix[0][2] + matrix[1][1] + matrix[2][0]), App.winners ) );

            for (var iterator = 0; iterator < variations.length; iterator++) {
                if (variations[iterator] == 0) {
                    App.setWinner('tic');
                }

                if (variations[iterator] == 1) {
                    App.setWinner('toe');
                }
            }
        },

        setWinner: function(winner) {
            App.winnerDiv.html(winner + ' is winner!');
            App.disableGame();
        },

        disableGame: function() {
            App.cells.addClass('disabled');
        },

        initResetButton: function() {
            App.resetButton.on("click", function() {
                App.initBaseLayout();
                App.winnerDiv.html('');
            });
        },

        updateLayout: function(layout) {
            var html = '';

            for (var row = 0; row < layout.length; row++) {
                html += '<ul class="row">';

                for (var column = 0; column < layout.length; column++) {
                    var cellClass = '';
                    if (layout[row][column] == App.tic) {
                        cellClass = 'tic';
                    } else if (layout[row][column] == App.toe) {
                        cellClass = 'toe';
                    }

                    html += '<li class="cell ' + cellClass + '" data-row="' + row + '" data-column="' + column + '"></li>';
                }

                html += '</ul>';
            }

            App.layout.html(html);
            App.initPlayers();
        }
    };

    App.init();
});