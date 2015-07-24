var Board = {
    tic: 10,
    toe: 100,
    lastTurn: 'toe',
    winners: [30, 300],
    firstPlayer: {},
    secondPlayer: {},
    layout: [[0, 0, 0],
             [0, 0, 0],
             [0, 0, 0]],

    makeStep: function(team, data) {
        this.layout[data.row][data.column] = Board[team];
    },

    checkWinner: function() {
        var layout = Board.layout;
        var variations = [];

        variations.push( $.inArray(( layout[0][0] + layout[0][1] + layout[0][2]), Board.winners ) );
        variations.push( $.inArray(( layout[1][0] + layout[1][1] + layout[1][2]), Board.winners ) );
        variations.push( $.inArray(( layout[2][0] + layout[2][1] + layout[2][2]), Board.winners ) );

        variations.push( $.inArray(( layout[0][0] + layout[1][0] + layout[2][0]), Board.winners ) );
        variations.push( $.inArray(( layout[0][1] + layout[1][1] + layout[2][1]), Board.winners ) );
        variations.push( $.inArray(( layout[0][2] + layout[1][2] + layout[2][2]), Board.winners ) );

        variations.push( $.inArray(( layout[0][0] + layout[1][1] + layout[2][2]), Board.winners ) );
        variations.push( $.inArray(( layout[0][2] + layout[1][1] + layout[2][0]), Board.winners ) );

        for (var iterator = 0; iterator < variations.length; iterator++) {
            if (variations[iterator] == 0) {
                Board.setWinner('tic');
            }

            if (variations[iterator] == 1) {
                Board.setWinner('toe');
            }
        }
    },

    setWinner: function(winner) {
        //Board.winnerDiv.html(winner + ' is winner!');
        Board.disableGame();
    },

    disableGame: function() {
        //Board.cells.addClass('disabled');
    }
};

module.exports.Board = Board;