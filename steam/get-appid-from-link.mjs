
export default function (link) {
    return /(?<=https:\/\/store\.steampowered\.com\/app\/)\d+/.exec(link)?.[0]
}