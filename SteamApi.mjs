
export const Regions = {
    Euro: 'eur',
    Turkey: 'tr'
}

export const getPirce = async (appid, region) => {
    console.debug(`Получаем прайс по '${appid}', и '${region}'`)

    const uri = `https://store.steampowered.com/api/appdetails?filters=price_overview&appids=${appid}&cc=${region}`

    console.debug(`Ссыль: '${uri}'`)

    return await fetch(uri).then(response => response.json()).then(game => game[appid]?.data.price_overview)
} 

export const gameInfo = async (appid) => {
    const uri = `https://store.steampowered.com/api/appdetails?appids=${appid}`

    console.debug(`Request: '${uri}'`)

    return await fetch(uri)
        .then(response => response.json()).then(game => game[appid]?.data)
        .catch(reason => console.error(reason))
}

const fetchAllGames = async () => {
    console.debug('Достаем все игры')

    const uri = 'https://api.steampowered.com/ISteamApps/GetAppList/v2'

    console.debug(`Ссыль: '${uri}'`)

    return await fetch(uri)
        .then(response => response.json())
        .then(data => data?.applist?.apps)
        .catch(reason => console.log(reason))
}

let games = undefined
export const allGames = async () => {
    if (games) return games

    games = await fetchAllGames()
    return games
}