
import link from "../string-utils/markdown-v2/link.mjs"

export default function (appid, name) {
    return link(String(name), `https://store.steampowered.com/app/${Number(appid)}`)
}