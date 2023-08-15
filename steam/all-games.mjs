
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

export default async function allGames() {
    if (games) return games

    games = await fetchAllGames()
    return games
}