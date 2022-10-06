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

function dbInit(cfg) {
    console.log(cfg);
    SongModel.deleteMany({}, function (err) { });
    for (let folder of cfg.folders) {
        let songs = listFile(folder);
        for (let song of songs) {
            jsmediatags.read(song, {
                onSuccess: function (tag) {
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
                    })
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

module.exports = {
    dbInit,
    dbFind,
    SongModel
}