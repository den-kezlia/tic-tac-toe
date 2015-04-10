$(document).ready(function() {
    App = {
        matrix: [],
        layout: $('#ttt'),
        cells: $('.cell'),
        tic: 10,
        toe: 100,
        lastTurn: 'toe',
        winners: [30, 300],
        winnerDiv: $('#winner'),
        resetButton: $("#reset"),
        socket: io.connect('http://localhost:3700'),

        init: function() {
            this.initBaseLayout();
            this.initSocket();
            this.initPlayers();
            this.initResetButton();
        },

        initSocket: function() {
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

        initPlayers: function() {
            App.cells.on('click', function() {
                var cell = $(this);
                var newTurn = '';

                if ( !cell.hasClass("disabled") ) {
                    if (App.lastTurn == 'toe') {
                        newTurn = 'tic';
                    } else {
                        newTurn = 'toe';
                    }

                    App.matrix[cell.data("row")][cell.data("column")] = App[newTurn];
                    App.lastTurn = newTurn;
                    App.sendGameBoard();
                }

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
        }
    };

    App.init();
});