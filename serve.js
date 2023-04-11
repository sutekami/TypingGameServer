const ip = require('ip');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
const PORT = 3001;
const randamStr = require('./randamStr').randamStr;

function generateUuid() {
    let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case "x":
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case "y":
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    return chars.join("");
}

let room_info = [];

io.on('connection', socket => {
    io.to(socket.id).emit('socket_id', socket.id);

    socket.on('matching', data => {
        if (room_info.length !== 0) {
            for (let i = 0; i < room_info.length; i++) {
                if (!room_info[i].matching) {
                    socket.join(room_info[i].roomId);
                    room_info[i].matching = true;
                    room_info[i].user2 = {
                        token: data.token,
                        userName: data.userName,
                    };
                    io.to(data.token).emit('room_id', room_info[i].roomId);
                    io.to(room_info[i].roomId).emit('match', {
                        room_info: room_info[i],
                        typingString: randamStr(),
                    });
                    console.log(room_info[i]);
                } else if (i + 1 === room_info.length) {
                    const roomId = generateUuid();
                    socket.join(roomId);
                    room_info.push({
                        roomId: roomId,
                        user1: {
                            token: data.token,
                            userName: data.userName,
                        },
                        user2: null,
                        matching: false,
                    });
                    io.to(data.token).emit('room_id', roomId);
                    break;
                }
            }
        } else {
            const roomId = generateUuid();
            socket.join(roomId);
            room_info.push({
                roomId: roomId,
                user1: {
                    token: data.token,
                    userName: data.userName,
                },
                user2: null,
                matching: false,
            });
            io.to(data.token).emit('room_id', roomId);
        }
    })

    socket.on('beColored', data => {
        const roomId = data.roomId;
        for (let i of room_info) {
            if (roomId === i.roomId) {
                (i.user1.token === data.token) ? io.to(i.user2.token).emit('coloring')
                    : io.to(i.user1.token).emit('coloring');
                break;
            }
        }
    });

    socket.on('changePartnerString', data => {
        const roomId = data.roomId;
        for (let i of room_info) {
            if (roomId === i.roomId) {
                (i.user1.token === data.token) ? io.to(i.user2.token).emit('changeString')
                    : io.to(i.user1.token).emit('changeString');
                break;
            }
        }
    });

    socket.on('backHome', data => {
        const roomId = data.roomId;
        for (let i of room_info) {
            if (roomId === i.roomId) {
                (i.user1.token === data.token) ? io.to(i.user2.token).emit('backHome')
                    : io.to(i.user1.token).emit('backHome');
                break;
            }
        }
    });

    socket.on('matchingStop', data => {
        for (let i = 0; i < room_info.length; i++) {
            if (room_info[i].roomId === data.roomId) {
                room_info.splice(i, 1);
                break;
            }
        }
    });

    socket.on("endMatching", data => {
        for (let i = 0; i < room_info.length; i++) {
            if (room_info[i].roomId === data.roomId) {
                room_info.splice(i, 1);
                break;
            }
        }
    });

    socket.on('disconnect', () => {
        // ウェブブラウザを閉じた際の処理
        // ゲームが終わった後の処理
    });
})

http.listen(PORT, ip.address(), () => {
    console.log(`Example app listening on port 3001, ${ip.address()}`);
})