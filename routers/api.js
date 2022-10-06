const Router = require('koa-router');
const router = new Router();
const fs = require('fs');
const { dbFind, dbInit, SongModel } = require('../db');



// audio play song api
router.get('/song', async (ctx, next) => {
    console.log("ctx.query:", ctx.query);
    let data = await SongModel.findById(ctx.query.id);
    var readerStream = fs.createReadStream(data.url);
    console.log(readerStream);
    ctx.body = readerStream;
});

// song tags api
router.get('/info', async (ctx, next) => {
    console.log("ctx.query:", ctx.query);
    let data = await SongModel.findById(ctx.query.id);
    ctx.body = {
        title: data.title,
        artist: data.artist,
        album: data.album,
        track: data.track
    };
})

router.get('/songs', async (ctx, next) => {
    let songs;
    if (ctx.query.album !== "") {
        songs = await SongModel.find({album: ctx.query.album});
    } else {
        songs = await SongModel.find();
    }
    
    console.log(songs);
    ctx.body = {
        songs
    };
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

router.get('/db/init', (ctx, next) => {
    dbInit(cfg);
    ctx.body = {
        ok: 1
    }
});

module.exports = router;

