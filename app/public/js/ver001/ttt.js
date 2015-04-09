$(document).ready(function() {
    App = {
        matrix: [],
        layout: $('#ttt'),
        cell: $('.cell'),
        tic: 10,
        toe: 100,
        lastTurn: 'toe',
        winners: [30, 300],
        winnerDiv: $('#winner'),

        init: function() {
           this.initBaseLayout();
           this.initPlayers();
        },

        initBaseLayout: function() {
           App.matrix =
               [[0, 0, 0],
               [0, 0, 0],
               [0, 0, 0]];
        },

        initPlayers: function() {
            App.cell.on('click', function() {
                var cell = $(this);
                var newTurn = '';

                if ( !cell.hasClass("disabled") ) {
                    if (App.lastTurn == 'toe') {
                        newTurn = 'tic';
                    } else {
                        newTurn = 'toe';
                    }

                    cell.addClass("disabled").addClass(newTurn);
                    App.matrix[cell.data("row")][cell.data("column")] = App[newTurn];
                    App.lastTurn = newTurn;

                    App.checkWinner();
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
            App.cell.addClass('disable');
        }
    };

    App.init();
});