
const Regions = {
    Euro: 'eur',
    Turkey: 'tr'
}

const getPirce = async (appId, region) => {
    const uri = `https://store.steampowered.com/api/appdetails?filters=price_overview&appids=${appId}&cc=${region}`
    return await fetch(uri).then(responce => responce.json()).then(game => game[appId]?.data.price_overview)
} 

const gameInfo = async (appId) => {
    const uri = `https://store.steampowered.com/api/appdetails?appids=${appId}`
    return await fetch(uri).then(responce => responce.json()).then(game => game[appId]?.data)
}

module.exports = {
    Regions: Regions,
    getPirce: getPirce,
    gameInfo: gameInfo
}