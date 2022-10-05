const jsmediatags = require("jsmediatags");

// 启动 websocket server
function start(server) {
    const io = require('socket.io')(server);
    io.on('connection', (socket) => {
        // 获取
        socket.on('music', (songid) => {

            jsmediatags.read("./public/Pay no mind.mp3", {
                onSuccess: function (tag) {
                    console.log(tag);
                },
                onError: function (error) {
                    console.log(':(', error.type, error.info);
                }
            });
            socket.emit('play-song', {
                id: songid,
                title: "Pay no mind",
                artist: "Madeon"
            });
        });
    });

}

module.exports = start;