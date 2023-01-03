const Router = require('koa-router');
const router = new Router();
const fs = require('fs');
const { dbFind, dbInit, SongModel, PlaylistModel } = require('../db');

function returnStream(body, stream) {
    body = stream;
}


// audio play song api
router.get('/song', async (ctx, next) => {
    console.log("ctx.query:", ctx.query);
    let data = await SongModel.findById(ctx.query.id);
    var readerStream = fs.createReadStream(data.url);
    // console.log(readerStream);
    ctx.body = readerStream;
});

// song tags api
router.get('/info', async (ctx, next) => {
    console.log("ctx.query:", ctx.query);
    let data = await SongModel.findById(ctx.query.id);
    ctx.body = {
        id: data._id,
        title: data.title,
        artist: data.artist,
        album: data.album,
        track: data.track
    };
})

router.get('/songs', async (ctx, next) => {
    let songs;
    if (ctx.query.album !== "") {
        songs = await SongModel.find({ album: ctx.query.album });
    } else {
        songs = await SongModel.find();
    }

    console.log(songs);
    ctx.body = {
        songs
    };
});

router.get('/playlists', async (ctx, next) => {
    let playlists = await PlaylistModel.find();

    console.log(playlists);
    ctx.body = {
        playlists
    };
});

router.get('/playlist', async (ctx, next) => {
    // console.log("ctx.query:", ctx.query);
    let data = await PlaylistModel.findById(ctx.query.id);
    ctx.body = {
        name: data.name,
        list: data.list
    }
});

// 保存为新的播放列表
router.post('/playlist/save', (ctx, next) => {
    console.log(typeof ctx.request.body);
    console.log(ctx.request.body);

    PlaylistModel.create({
        name: ctx.request.body.name,
        list: ctx.request.body.list
    }, (err, docs) => {
        if (!err) {
            console.log('插入成功' + docs);
        } else {
            console.log(err);
        }
    })

    ctx.body = {
        ok: 1
    }
});

// TODO: 添加一首歌到指定播放列表
router.post('/playlist/add', (ctx, next) => {

});

// TODO: 从指定播放列表删除一首歌
router.post('/playlist/delete', (ctx, next) => {

});
let cfg;

fs.readFile('config.json',
    // 读取文件完成时调用的回调函数
    function (err, data) {
        // json数据
        var jsonData = data;
        // 解析json
        cfg = JSON.parse(jsonData);
        console.log(cfg);
        // console.log(listFile(cfg.folders[0]));
    });

router.get('/db/init', async (ctx, next) => {
    await dbInit();
    ctx.body = {
        ok: 1
    }
});

module.exports = router;

