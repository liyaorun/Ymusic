<template>
    <el-scrollbar height="100dvh" @scroll="scroll" ref="reference">
        <div class="nav" :class="{ 'navBg': scrollNum > 50 }">
            <div class="announcement" title="公告" @click="() => dialogTableVisible = !dialogTableVisible">
                <IconBookmark />
            </div>
            <div class="search" @click="router.push('/search')">
                <IconSearch /><span>搜索</span>
            </div>
        </div>
        <router-view></router-view>
    </el-scrollbar>

    <el-dialog v-model="dialogTableVisible" title="公告" width="600">
        <div>123123123</div>
    </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import debounce from '@/assets/js/debounce';
import { useMusicList } from '@/stores/musicList';
import { addMusicList } from '@/assets/js/ajaxMusicApi'
import { IconBookmark, IconSearch } from '@arco-design/web-vue/es/icon';

const route = useRoute(); // 获取路由信息
const router = useRouter(); // 获取路由信息
const musicList = useMusicList() // 导入音乐链接存储
const reference = ref(null); // 滚动组件本体
let id = ref(null) // 歌单id
let scrollNum = ref(null)
let dialogTableVisible = ref(false)

// 检测音乐id变化，更新id
watch(() => route.query.id, (newPath) => id = newPath);

let musicListListLength = null
const debounceFun = debounce(function () {
    if (musicListListLength == musicList.list.length) return
    addMusicList(id, 500, musicList.list.length)
    musicListListLength = musicList.list.length
}, 300)

/**
 * 下拉添加更多内容
 * 应该是到底部才开始添加内容
 * 可能是模板html结构部分被我写成答辩了，一直没办法从底部开始添加
 * 只能这样子处理
 */
const scroll = ({ scrollTop }) => {
    scrollNum.value = scrollTop
    // 获取歌曲列表的 DOM 元素
    const songSheet = reference.value.$el.querySelector('#songSheet');
    // 判断是否存在歌曲列表以及滚动位置是否过半
    if (songSheet && scrollTop >= songSheet.clientHeight / 2) debounceFun()
};
</script>

<style lang="scss" scoped>
.el-scrollbar {
    position: relative;

    .navBg {
        background-color: rgba(255, 255, 255, 0.85);
        border-bottom: 1px solid #ccc;
    }

    .nav {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        padding: 10px 50px;
        backdrop-filter: blur(6px);
        border-color: rgba(229, 230, 235, 0.85);
        z-index: 2;
        transition: all 0.5s ease;


        .announcement {
            padding: 10px;
            border-radius: 7px;
            font-size: 18px;
            cursor: pointer;

            &:hover {
                background-color: #ccc;
            }
        }

        .search {
            position: relative;
            display: flex;
            justify-content: left;
            align-items: center;
            width: 200px;
            height: 36px;
            padding: 0 16px;
            font-size: 14px;
            border-radius: 15px;
            background-color: rgba(39, 46, 59, .08);
            color: inherit;
            opacity: .8;
            z-index: 3;
            cursor: pointer;

            span {
                margin-left: 5px;
            }
        }

        .search:hover {
            background-color: rgba(39, 46, 59, .18)
        }
    }
}
</style>