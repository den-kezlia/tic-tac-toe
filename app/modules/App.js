var Board = require('./Board.js').Board;
var Room = require('./Room.js').Room;

var App = {
    rooms: [],
    matrix: [],

    selectTeam: function(req) {
        var session = req.session;

        this.setPlayerData(session, req.data);
        this.addToRoom(session);
        var data = this.getPlayerData(session);

        if (this.isRoomFull(data.roomId)) {
            this.setPlayerData(session, {team: 'toe'});
            this.startGame(session);
        } else {
            /* TODO remove isPlayerWaiting */
            this.setPlayerData(session, {isPlayerWaiting: true});
            this.setPlayerData(session, {playerStatus: 'onWaiting'});
            this.setPlayerData(session, {team: 'tic'});

            //req.io.route('/');
            App.io.route('/');
            //session.req.io.emit('waitingForPlayer', data);
        }
    },

    addToRoom: function(session) {
        if ( !this.isUserInRoom(session) ) {
            var roomId = this.rooms.length;

            if (roomId) {
                if (this.rooms[roomId - 1].length < 2) {
                    roomId--;
                } else {
                    this.rooms[roomId] = [];
                }
            } else {
                roomId = 1;
                this.rooms[roomId] = [];
            }

            this.rooms[roomId].push(session);
            this.setPlayerData(session, {roomId: roomId});
            session.req.io.join(roomId);
        }
    },

    isUserInRoom: function(session) {
        var isUserInRoom = false;

        for (var room in App.rooms) {
            for (var iterator = 0; iterator < App.rooms[room].length; iterator++) {
                if (App.rooms[room][iterator].id == session.id) {
                    isUserInRoom = true;
                }
            }
        }

        return isUserInRoom;
    },

    isRoomFull: function(room) {
        if (App.rooms[room].length == 2) {
            return true;
        } else {
            return false;
        }
    },

    isPlayerWaiting: function(session) {
        if (session.gameData == undefined) {
            return false
        } else if (session.gameData.isPlayerWaiting == undefined || session.gameData.isPlayerWaiting == false) {
            return false
        } else {
            return true
        }
    },

    setPlayerData: function(session, data) {
        if (!session.gameData) {
            session.gameData = {};
        }

        for (var param in data) {
            session.gameData[param] = data[param];
        }

        session.save();
    },

    getPlayerData: function(session) {
        var data = {};

        for (var param in session.gameData) {
            data[param] = session.gameData[param];
        }

        return data;
    },

    getPlayerStatus: function(session) {
        var playerStatus;

        if (session.gameData == undefined) {
            playerStatus = 'onSelectTeam';
        } else {
            playerStatus = session.gameData.playerStatus;
        }

        return playerStatus;
    },

    sendRivalInfo: function(room) {
        var firstPlayer = App.rooms[room][0];
        var secondPlayer = App.rooms[room][1];
        var firstPlayerInfo = App.getPlayerData(firstPlayer);
        var secondPlayerInfo = App.getPlayerData(secondPlayer);

        firstPlayerInfo.rival = secondPlayerInfo.name;
        secondPlayerInfo.rival = firstPlayerInfo.name;

        firstPlayer.req.io.emit('rivalInfo', firstPlayerInfo);
        secondPlayer.req.io.emit('rivalInfo', secondPlayerInfo);
    },

    startGame: function(session, app) {
        var data = this.getPlayerData(session);
        var room = data.roomId;

        this.setPlayerData(session, {isPlayerWaiting: false});
        this.sendRivalInfo(room);

        this.rooms[room].board = Object.create(Board, room);
        this.rooms[room].board.room = room;
        this.rooms[room].board.firstPlayer = this.getPlayerData(this.rooms[room][0]);
        this.rooms[room].board.secondPlayer = this.getPlayerData(this.rooms[room][1]);

        this.io.room(room).broadcast('startGame', room);
        this.sendGameBoard(room);
    },

    sendGameBoard: function(room) {
        this.io.room(room).broadcast('sendGameBoard', this.rooms[room].board.layout);
    },

    makeStep: function(req) {
        var data = this.getPlayerData(req.session);

        this.rooms[data.roomId].board.makeStep(data.team, req.data);
        this.sendGameBoard(data.roomId);
    }
};

module.exports.App = App;