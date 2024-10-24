<template>
    <div id="home" style="margin-top: 65px;">
        <div class="musiclist">
            <div class="item" v-for="(item, index) in SongSheet.list" :key="index"
                @click="goSongSheet(item.songSheetId)">
                <div class="img"><img :src="item.imgUrl" alt=""></div>
                <div class="text">{{ item.name }}</div>
            </div>
        </div>
        <div class="playlist">
            <p>{{ wyyMusicListStatus.text }}</p>
            <input type="button" :value="'[添加]'" @click="addWyyMusicSongSheet"
                v-show="!wyyMusicListStatus.aWMSShot"></input>
            <input type="button" :value="'[刷新]'" @click="refreshWyyMusicSongSheet(SongSheet.wyy.id)"
                v-show="wyyMusicListStatus.aWMSShot"></input>
            <input type="button" :value="'[退出]'" @click="quitWyyMusicSongSheet(undefined, undefined, undefined)"
                v-show="wyyMusicListStatus.aWMSShot"></input>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/router';
import { ElMessageBox } from 'element-plus'
import { wyySongSheet } from '@/stores/wyySongSheet';
import { getWyyId, getAllPlayList } from '@/assets/js/ajaxMusicApi';

// 获取存储的网易云信息
const SongSheet = wyySongSheet()

// 默认启动
let wyyMusicListStatus = ref({});

// 检测有没有网易云用户id判断是否添加
const detectionWyyUesrId = () => {
    wyyMusicListStatus.value = {
        text: SongSheet.wyy.id ? '网易云歌单' : '从网易云添加歌单',
        aWMSShot: !!SongSheet.wyy.id
    };
};

// 添加歌单
const addWyyMusicSongSheet = () => {
    ElMessageBox.prompt('', '输入网易云用户名(标点符号要带上)', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '不能为空',
    }).then(async ({ value }) => {
        const nickname = (await getWyyId(value)).data.nicknames[value]; // 通过名字获取网易云id
        SongSheet.wyy.id = nickname;
        refreshWyyMusicSongSheet(nickname); // 通过id获取全部歌单
        detectionWyyUesrId();
    });
}
// 获取所有歌单
const refreshWyyMusicSongSheet = async (wyyNameId) => {
    quitWyyMusicSongSheet(wyyNameId);

    // 获取全部歌单信息
    const data = (await getAllPlayList(wyyNameId)).data.playlist;

    // 存储歌单列表
    data.forEach(data => {
        SongSheet.list.push({
            songSheetId: data.id,
            imgUrl: data.coverImgUrl,
            name: data.name,
            description: data.description
        })
    });

    if (SongSheet.wyy.name) return
    // 获取网易云头像和名字(ps:上面函数添加不了名字)
    const { avatarUrl: avatar, nickname: name } = data[0].creator;
    Object.assign(SongSheet.wyy, { avatar, name });
}

//点击专辑后跳转
const goSongSheet = (songSheetId) => {
    const path = `/songSheet?id=${songSheetId}`;
    router.replace(SongSheet.menu = path);
}

// 清除旧歌单信息
const quitWyyMusicSongSheet = (id, name, avatar) => {
    Object.assign(SongSheet.wyy, { id, name, avatar });
    SongSheet.list.splice(2);
    detectionWyyUesrId();
}

// 初始化
detectionWyyUesrId()
</script>

<style lang="scss" scoped>
@use '../assets/css/musicStyle.scss' as *;

p {
    margin: 0;
}

#home {
    position: relative;
    padding: 0 30px;
    user-select: none;

    .musiclist {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 25px;
        width: 100%;
        margin-bottom: 50px;

        .item {
            @include flexCenter;
            flex-direction: column;
            width: 100%;
            cursor: pointer;

            img {
                width: 100%;
            }

            .text {
                @include textLineNum(1);
                font-size: 14px
            }
        }
    }

    .playlist {
        @include flexCenter;
        background-color: #e5e6eb;
        width: 100%;
        padding: 10px;

        input {
            border: 0;
            color: #000;
            background-color: #e5e6eb;
            font-size: 16px;
            padding: 0;
            cursor: pointer;

            &:hover {
                color: #409eff;
            }
        }
    }

    @include respond-to() {
        & {
            padding-bottom: 120px;
        }
    }
}
</style>