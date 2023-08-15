
export default async function gameInfo(appid) {
    const uri = `https://store.steampowered.com/api/appdetails?appids=${appid}`

    console.debug(`Request: '${uri}'`)

    return await fetch(uri)
        .then(response => response.json()).then(game => game[appid]?.data)
        .catch(reason => console.error(reason))
}