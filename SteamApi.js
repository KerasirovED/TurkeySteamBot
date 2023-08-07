
const Regions = {
    Euro: 'eur',
    Turkey: 'tr'
}

const getPirce = async (appid, region) => {
    const uri = `https://store.steampowered.com/api/appdetails?filters=price_overview&appids=${appid}&cc=${region}`
    return await fetch(uri).then(responce => responce.json()).then(game => game[appid]?.data.price_overview)
} 

const gameInfo = async (appid) => {
    const uri = `https://store.steampowered.com/api/appdetails?appids=${appid}`
    return await fetch(uri).then(responce => responce.json()).then(game => game[appid]?.data)
}

const fetchAllGames = async () => {
    const uri = 'http://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json'
    return await fetch(uri).then(response => response.json()).then(data => {
        console.debug(data)
        return data?.applist?.apps
    })
}

let games = undefined
const allGames = async () => {
    if (games) return games

    games = await fetchAllGames()
    return games
}

module.exports = {
    Regions: Regions,
    getPirce: getPirce,
    gameInfo: gameInfo,
    allGames: allGames
}