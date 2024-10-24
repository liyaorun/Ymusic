import { getMusicUrl, getGuoHeMusicUrl } from '@/assets/js/ajaxMusicApi';

export async function giveMusicUrl(id, source) {
    let url = null
    if (source == 'netease') {
        url = (await getMusicUrl(id)).data.url
    }

    if (source == 'guohe') {
        url = (await getGuoHeMusicUrl(id)).data.data
    }

    return url
}