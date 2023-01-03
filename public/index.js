//========================
// global variables
//========================
const demo = document.getElementById("demo");
const audio = document.getElementById("audio");
const play = document.getElementById("play");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const mode = document.getElementById("mode");
const savePlaylist = document.getElementById("save-playlist");
const volumeUp = document.getElementById("volume-up");
const volumeDown = document.getElementById("volume-down");
const volume = document.getElementById("volume");
const audioTime = document.getElementById("audioTime");
const currentTime = document.getElementById("currentTime");
const title = document.getElementById("music-title");
const artist = document.getElementById("artist");
const timeline = document.getElementById("timeline");
const init = document.getElementById("init");
const songList = document.getElementById("song-list");
const albumList = document.getElementById("album-list");
const playlist = document.getElementById("playlist");
const playlistName = document.getElementById("playlist-name");
const saveNewPlaylist = document.getElementById("save-new-playlist");
const savedPlaylist = document.getElementById("custom-playlist");
const modal = document.getElementById("modal");


// 播放模式
const PLAY_MODE = {
	ORDER: 0,
	LOOP: 1,
	REPEAT: 2,
	SHUFFLE: 3
};

const modeList = [PLAY_MODE.LOOP,
	PLAY_MODE.ORDER,
	PLAY_MODE.REPEAT,
	PLAY_MODE.SHUFFLE];

let modeIndex = 0;

// 播放列表
let currentPlaylist = [];
let playingIndex = 0;

audio.volume = 0.5;

//========================
// functions
//========================

function setPlay() {
	play.innerHTML = "[pause]";
}

function setPause() {
	play.innerHTML = "[play]";
}

function transTime(time) {
	var duration = parseInt(time);
	var minute = parseInt(duration / 60);
	var sec = duration % 60 + '';
	var isM0 = ':';
	if (minute == 0) {
		minute = '00';
	} else if (minute < 10) {
		minute = '0' + minute;
	}
	if (sec.length == 1) {
		sec = '0' + sec;
	}
	return minute + isM0 + sec
}

//更新进度条
function updateProgress() {
	var value = Math.round((Math.floor(audio.currentTime) / Math.floor(audio.duration)) * 100, 0);
	// TODO: 进度条动画
	// $('.pgs-play').css('width', value * 0.907 + '%');
	currentTime.innerHTML = transTime(audio.currentTime);
}

async function getSong(id) {
	await fetch(`/api/song?id=${id}`, {
		method: 'GET',
	})
		.then(data => {
			audio.src = data;
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

function getSongs() {
	fetch(`/api/songs?album=`, {
		method: 'GET', // or 'PUT'
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => response.json())
		.then(data => {
			data.songs.sort((a, b) => {
				if (a.album == b.album) {
					return parseInt(a.track) - parseInt(b.track);
				} else {
					return a.album > b.album;
				}
			});
			// console.log(data.songs);
			let albumArr = [];
			let albumHTML = `<li class="album"><a href="javascript:;" class="blue album" onClick="albumOnclick('')">[all]</a></li>`;
			// songs = data.songs.slice(0);
			// 创建 list
			let listHTML = `<li class="song"><a href="javascript:;" class="blue song" onClick="playAllOnclick('')">[play all]</a></li>`;
			for (let li of data.songs) {
				// 按 album 分类
				if (!albumArr.includes(li.album)) {
					albumArr.push(li.album);
					albumHTML += `<li class="album"><a href="javascript:;" class="green album" onClick="albumOnclick('${li.album}')">${li.album}</a></li>`;
				}
				listHTML += `<li class="song"><a href="javascript:;" class="add yellow" onClick="addOnclick('${li._id}')">[+]</a><a href="javascript:;" class="green song" onClick="songOnclick('${li._id}')">${li.title} - ${li.artist}</a></li>`;
			}
			songList.innerHTML = listHTML;
			albumList.innerHTML = albumHTML;
		}).catch((error) => {
			console.error('Error:', error);
		});
}

function getPlaylists() {
	fetch(`/api/playlists`, {
		method: 'GET', // or 'PUT'
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => response.json())
		.then(data => {
			for (let list of data.playlists) {
				// console.log(typeof list.list, list.list);
				savedPlaylist.innerHTML += `<li class="album"><a href="javascript:;" class="green album" onClick="playlistOnclick('${list._id}')">${list.name}</a></li>`;
			}

		}).catch((error) => {
			console.error('Error:', error);
		});
}

function getInfo(id) {
	fetch(`/api/info?id=${id}`, {
		method: 'GET', // or 'PUT'
		headers: {
			'Content-Type': 'application/json',
		}
	})
		.then(response => response.json())
		.then(data => {
			// console.log(data);
			title.innerHTML = data.title;
			artist.innerHTML = data.artist;
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

function updateIndex() {
	for (let i in currentPlaylist) {
		// console.log(typeof i);
		if (currentPlaylist[i].playing) {
			playingIndex = parseInt(i);
			console.log("in updateIndex(), change index to:", i);
		}
	}
}

// 删除数组指定值的元素
function arrayRemove(arr, value) {
	return arr.filter(function (ele) {
		return ele.id != value;
	});
}

//========================
// event listener
//========================

window.onload = () => {
	getSongs();
	getPlaylists();
}

play.onclick = () => {
	if (audio.paused) {
		audio.play();
		// setPlay();
	} else {
		audio.pause();
		// setPause();
	}
};

next.onclick = () => {
	// console.log(currentPlaylist, playingIndex);
	console.log("in next.onclick(), playingIndex is:", playingIndex);
	currentPlaylist[playingIndex].playing = false;
	if (playingIndex === currentPlaylist.length - 1) {
		playingIndex = 0;
	} else {
		playingIndex += 1;
	}
	console.log("in next.onclick(), change index to:", playingIndex);
	currentPlaylist[playingIndex].playing = true;
	// console.log("after:", playindex);
	audio.src = `/api/song?id=${currentPlaylist[playingIndex].id}`;
	// console.log(audio.src);
	getInfo(currentPlaylist[playingIndex].id);
	audio.load();
	// setPlay();
	audio.play();
}

prev.onclick = () => {
	console.log("in prev.onclick(), playingIndex is:", playingIndex);
	currentPlaylist[playingIndex].playing = false;
	if (playingIndex === 0) {
		playingIndex = currentPlaylist.length - 1;
	} else {
		playingIndex -= 1;
	}
	console.log("in prev.onclick(), change index to:", playingIndex);
	currentPlaylist[playingIndex].playing = true;
	audio.src = `/api/song?id=${currentPlaylist[playingIndex].id}`;
	// console.log(audio.src);
	getInfo(currentPlaylist[playingIndex].id);
	audio.load();
	// setPlay();
	audio.play();
}

mode.onclick = () => {
	if (modeIndex === modeList.length - 1) {
		modeIndex = 0;
	} else {
		modeIndex += 1;
	}
	switch (modeList[modeIndex]) {
		case PLAY_MODE.LOOP:
			mode.innerHTML = '[LOOP]';
			break;
		case PLAY_MODE.ORDER:
			mode.innerHTML = '[ORDER]';
			break;
		case PLAY_MODE.REPEAT:
			mode.innerHTML = '[REPEAT]';
			break;
		case PLAY_MODE.SHUFFLE:
			mode.innerHTML = '[SHUFFLE]';
			break;
	}
}

// 弹出对话框
savePlaylist.onclick = () => {
	modal.style.display = "inline";
}

// TODO: 保存、读取播放列表到 json
// id 在后端生成
// 如果 id 为空 则保存为新的文档
// 如果 id 不为空 则更新文档
saveNewPlaylist.onclick = () => {
	// 使用 fetch 传输数据到
	let data = {
		name: playlistName.value,
		list: currentPlaylist
	}
	fetch(`/api/playlist/save`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	modal.style.display = "none";
}


init.onclick = () => {
	fetch('/api/db/init', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
			// 'Content-Type': 'application/x-www-form-urlencoded',
		}
	}).then((data) => {
		console.log(data);
	})
}

// volume controll
volumeUp.onclick = () => {
	if (audio.volume < 1) {
		if (audio.volume + 0.05 > 1) {
			audio.volume = 1;
		} else {
			audio.volume += 0.05;
		}
		volume.innerHTML = `[${(audio.volume * 100).toFixed(0)}%]`;
	}
};
volumeDown.onclick = () => {
	if (audio.volume > 0) {
		if (audio.volume - 0.05 < 0) {
			audio.volume = 0;
		} else {
			audio.volume -= 0.05;
		}

		console.log(audio.volume);
		volume.innerHTML = `[${(audio.volume * 100).toFixed(0)}%]`;
	}
	// let volumeValue = parseInt(volume.text().replace(/[^\d]/g, " "));
	// if (volumeValue > 0) {
	// 	volumeValue -= 5;
	// 	volume.innerHTML = `[${volumeValue}%]`;
	// }
};


// 更新时间
audio.addEventListener("loadedmetadata", () => {
	console.log("[event] loadedmetadata");
	// console.log(audio.duration);
	audioTime.innerHTML = transTime(audio.duration);
});
audio.addEventListener('timeupdate', updateProgress, false);


// 播放暂停结束
audio.addEventListener('playing', () => {
	console.log("[event] playing");
	setPlay();
}, false);

audio.addEventListener('pause', () => {
	console.log("[event] pause");
	// if (play_mode !== PLAY_MODE.REPEAT && playingIndex == currentPlaylist.length - 1) {
	setPause();
	// }
}, false);

// 一首歌播放结束，判断播放模式
audio.addEventListener('ended', () => {
	console.log("[event] ended");
	switch (modeList[modeIndex]) {
		case PLAY_MODE.REPEAT:
			audio.play();
			break;
		case PLAY_MODE.LOOP:
			console.log("in ended event, playingIndex is:", playingIndex);
			// console.log(currentPlaylist, playingIndex);
			currentPlaylist[playingIndex].playing = false;
			if (playingIndex === currentPlaylist.length - 1) {
				playingIndex = 0;
			} else {
				playingIndex += 1;
			}
			console.log("in ended event(), playingIndex is:", playingIndex);
			currentPlaylist[playingIndex].playing = true;
			audio.src = `/api/song?id=${currentPlaylist[playingIndex].id}`;
			audio.load();
			getInfo(currentPlaylist[playingIndex].id);
			audio.play();
			break;
		case PLAY_MODE.ORDER:
			console.log("order mode");
			currentPlaylist[playingIndex].playing = false;
			if (playingIndex === currentPlaylist.length - 1) {
				playingIndex = 0;
				audio.src = `/api/song?id=${currentPlaylist[playingIndex].id}`;
				audio.load();
				getInfo(currentPlaylist[playingIndex].id);
			} else {
				playingIndex += 1;
				audio.src = `/api/song?id=${currentPlaylist[playingIndex].id}`;
				audio.load();
				getInfo(currentPlaylist[playingIndex].id);
				audio.play();
			}
			currentPlaylist[playingIndex].playing = true;
			break;
		case PLAY_MODE.SHUFFLE:
			currentPlaylist[playingIndex].playing = false;
			// 随机生成索引
			playingIndex = Math.floor(Math.random() * currentPlaylist.length);
			console.log(playingIndex);
			audio.src = `/api/song?id=${currentPlaylist[playingIndex].id}`;
			audio.load();
			getInfo(currentPlaylist[playingIndex].id);
			audio.play();
			currentPlaylist[playingIndex].playing = true;
			break;

		default:
			// 默认 repeat
			audio.play();
			break;
	}
}, false);

//========================
// callbacks
//========================

async function songOnclick(id) {
	console.log(id);

	currentPlaylist.splice(0, currentPlaylist.length);
	playlist.innerHTML = "";

	await fetch(`/api/info?id=${id}`, {
		method: 'GET', // or 'PUT'
		headers: {
			'Content-Type': 'application/json',
		}
	})
		.then(response => response.json())
		.then(data => {
			currentPlaylist.push({
				id: data.id,
				playing: true
			});
			playlist.innerHTML = `<li class="song">${data.title}</li>`;
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	playingIndex = 0;
	console.log("in songOnclick(), change index to:", playingIndex);

	// getSong(currentPlaylist[playingIndex].id);
	

	audio.src = `/api/song?id=${currentPlaylist[playingIndex].id}`;
	// audio.src = 'http://localhost:8964/api/song?' + `id=${currentPlaylist[playingIndex].id}`;
	// console.log(audio.src);
	getInfo(id);
	audio.load();
	// setPlay();
	audio.play();
}

function albumOnclick(album) {
	// console.log(album);
	fetch(`/api/songs?album=${album}`, {
		method: 'GET', // or 'PUT'
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => response.json())
		.then(data => {
			data.songs.sort((a, b) => {
				if (a.album == b.album) {
					return parseInt(a.track) - parseInt(b.track);
				} else {
					return a.album > b.album;
				}
			});
			// console.log(data.songs);
			let listHTML = `<li class="song"><a href="javascript:;" class="blue song" onClick="playAllOnclick('${album}')">[play all]</a></li>`;
			for (let li of data.songs) {
				listHTML += `<li class="song"><a href="javascript:;" class="add yellow" onClick="addOnclick('${li._id}')">[+]</a><a href="javascript:;" class="green song" onClick="songOnclick('${li._id}')">${li.title} - ${li.artist}</a></li>`;
			}
			songList.innerHTML = listHTML;
		}).catch((error) => {
			console.error('Error:', error);
		});
}

function playAllOnclick(album) {
	fetch(`/api/songs?album=${album}`, {
		method: 'GET', // or 'PUT'
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => response.json())
		.then(data => {
			data.songs.sort((a, b) => {
				if (a.album == b.album) {
					return parseInt(a.track) - parseInt(b.track);
				} else {
					return a.album > b.album;
				}
			});

			currentPlaylist.splice(0, currentPlaylist.length);
			playlist.innerHTML = "";
			for (let li of data.songs) {
				currentPlaylist.push({
					id: li._id,
					playing: false
				});
				playlist.innerHTML += `<li class="song">${li.title}<a href="javascript:;" class="add yellow" onClick="deleteOnclick('${li._id}')">[-]</a></li>`;
			}
			// 更新第一个的播放状态
			playingIndex = 0;
			console.log("in playAllOnclick(), change index to:", playingIndex);
			currentPlaylist[playingIndex].playing = true;

			audio.src = `/api/song?id=${currentPlaylist[playingIndex].id}`;
			audio.load();
			getInfo(currentPlaylist[playingIndex].id);
			audio.play();
		}).catch((error) => {
			console.error('Error:', error);
		});

}

// TODO: 添加到播放列表
async function addOnclick(id) {
	// console.log("add:", id);
	if (!currentPlaylist.some((item => item.id == id))) { // TODO: 
		await fetch(`/api/info?id=${id}`, {
			method: 'GET', // or 'PUT'
			headers: {
				'Content-Type': 'application/json',
			}
		})
			.then(response => response.json())
			.then(data => {
				// console.log(data.title, ":", data.id);
				playlist.innerHTML += `<li class="song">${data.title}<a href="javascript:;" class="add yellow" onClick="deleteOnclick('${data.id}')">[-]</a></li>`;
				currentPlaylist.push({
					id: data.id,
					playing: false
				});
				if (currentPlaylist.length == 1) {
					// playlist.innerHTML = "";
					playingIndex = 0;
					console.log("in addOnclick(), change index to:", playingIndex);
					currentPlaylist[playingIndex].playing = true;
					audio.src = `/api/song?id=${currentPlaylist[playingIndex].id}`;
					audio.load();
					getInfo(currentPlaylist[playingIndex].id);
					audio.play();
				}
			})
			.catch((error) => {
				console.error('Error:', error);
			});
		updateIndex();


	} else {
		console.log("[error] Already exists");
	}

	// TODO: show list
}

// TODO: delete a song from playlist
async function deleteOnclick(id) {
	// console.log(id);
	let current = currentPlaylist.find(item => item.playing == true);
	console.log(current);
	if (current.id == id) {
		// 从播放列表删除的是当前播放的音乐
		// 将当前播放设置成下一个并立即切换

		if (playingIndex === currentPlaylist.length - 1) {
			playingIndex = 0;
		} else {
			playingIndex += 1;
		}
		if (currentPlaylist.length == 1) {
			audio.pause();
			title.innerHTML = "";
			artist.innerHTML = "";
			audioTime.innerHTML = "0";
		} else {
			currentPlaylist[playingIndex].playing = true;
			audio.src = `/api/song?id=${currentPlaylist[playingIndex].id}`;
			getInfo(currentPlaylist[playingIndex].id);
			audio.load();
			audio.play();
		}


	}
	currentPlaylist = arrayRemove(currentPlaylist, id);

	// console.log(currentPlaylist);
	playlist.innerHTML = "";
	for (let song of currentPlaylist) {
		await fetch(`/api/info?id=${song.id}`, {
			method: 'GET', // or 'PUT'
			headers: {
				'Content-Type': 'application/json',
			}
		})
			.then(response => response.json())
			.then(data => {
				console.log(data.title, ":", data.id);
				playlist.innerHTML += `<li class="song">${data.title}<a href="javascript:;" class="add yellow" onClick="deleteOnclick('${data.id}')">[-]</a></li>`;
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}
	updateIndex();
}

function playlistOnclick(id) {
	console.log(id);
	fetch(`/api/playlist?id=${id}`, {
		method: 'GET', // or 'PUT'
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => response.json())
		.then(data => {
			console.log(data.name, data.list);
			// TODO: 在 playlist 显示并播放
			currentPlaylist.splice(0, currentPlaylist.length);
			playlist.innerHTML = "";
			for (let li of data.list) {
				currentPlaylist.push({
					id: li.id,
					playing: false
				});
				fetch(`/api/info?id=${li.id}`, {
					method: 'GET', // or 'PUT'
					headers: {
						'Content-Type': 'application/json'
					}
				})
					.then(response => response.json())
					.then(data => {
						playlist.innerHTML += `<li class="song">${data.title}<a href="javascript:;" class="add yellow" onClick="deleteOnclick('${data.id}')">[-]</a></li>`;
					})
					.catch((error) => {
						console.error('Error:', error);
					});
			}
			// 更新第一个的播放状态
			playingIndex = 0;
			console.log("in playlistOnclick(), change index to:", playingIndex);
			currentPlaylist[playingIndex].playing = true;

			audio.src = `/api/song?id=${currentPlaylist[playingIndex].id}`;
			audio.load();
			getInfo(currentPlaylist[playingIndex].id);
			audio.play();
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

// TODO: 配置文件组织
// TODO: 登录鉴权
// TODO: 部署测试
// TODO: 代码工程化

// TODO: 响应式网页
// TODO: 网页美化
// TODO: 文档撰写
