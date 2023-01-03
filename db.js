const mongoose = require('mongoose');
var path = require("path");
const fs = require('fs');
const jsmediatags = require("jsmediatags");

// 新建 model
const Schema = mongoose.Schema

const SongType = {
    title: String,
    artist: String,
    album: String,
    track: String,
    url: String
}

const SongModel = mongoose.model("song", new Schema(SongType));

let cfg

fs.readFile('config.json',
    // 读取文件完成时调用的回调函数
    function (err, data) {
        // json数据
        var jsonData = data;
        // 解析json
        cfg = JSON.parse(jsonData);
        setInterval(dbInit, cfg.scanTime * 60 * 60 * 1000)
        // console.log(cfg);
        // console.log(listFile(cfg.folders[0]));
    });



function listFile(dir, list = []) {
    var arr = fs.readdirSync(dir);
    arr.forEach(function (item) {
        var fullpath = path.join(dir, item);
        var stats = fs.statSync(fullpath);
        if (stats.isDirectory()) {
            listFile(fullpath, list);
        } else {
            list.push(fullpath);
        }
    });
    return list;
}

// TODO: 第一次使用/执行刷新数据库操作 需要扫描文件夹生成数据库 包装成 api
// 从 json 配置文件读取音乐文件夹 url
// 在文件夹里读取 mp3 解析 tag
// 对 tag 整理信息并存数据库
// 创立 schema 存储 key 和基本信息

function dbInit() {
    // console.log(cfg);
    // SongModel.deleteMany({}, function (err) { });
    for (let folder of cfg.folders) {
        let songs = listFile(folder);
        for (let song of songs) {
            jsmediatags.read(song, {
                onSuccess: async function (tag) {
                    // 查找是否已经存在此音乐
                    let findSong = await SongModel.findOne({
                        title: tag.tags.title,
                        artist: tag.tags.artist,
                        album: tag.tags.album,
                        track: tag.tags.track
                    });
                    if (!findSong) {
                        console.log(findSong);
                        console.log("not exixts");
                        // 不存在创建
                        SongModel.create({
                            title: tag.tags.title,
                            artist: tag.tags.artist,
                            album: tag.tags.album,
                            track: tag.tags.track,
                            url: song
                        }, (err, docs) => {
                            if (!err) {
                                console.log('插入成功' + docs)
                            }
                        });
                    } else {
                        // 存在更新
                        console.log("exists");
                        findSong.title = tag.tags.title;
                        findSong.artist = tag.tags.artist;
                        findSong.album = tag.tags.album;
                        findSong.track = tag.tags.track;
                        findSong.url = tag.tags.url;

                        findSong.save();
                    }

                },
                onError: function (error) {
                    console.log(':(', error.type, error.info);
                }
            });
        }
    }
}


// TODO: 数据库查找
function dbFind(id) {

}

const PlaylistType = {
    name: String,
    list: []
}

const PlaylistModel = mongoose.model("playlist", new Schema(PlaylistType));

module.exports = {
    dbInit,
    dbFind,
    SongModel,
    PlaylistModel
}