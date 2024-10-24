import { ref } from 'vue';
export default function musicPlayShowJs() {
    const showMenu = ref(false);

    const showMusicPlay = () => {
        console.log(1);
        showMenu.value = true;
    };

    const hideMusicPlay = () => {
        showMenu.value = false
    };

    return { showMenu, showMusicPlay, hideMusicPlay };
}