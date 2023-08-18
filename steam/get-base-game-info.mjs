
import allGames from "./all-games.mjs"
import gameInfo from "./game-info.mjs"
import escape from '../string-utils/markdown-v2/escape.mjs'
import link from "../string-utils/markdown-v2/link.mjs"

export default async function getBaseGameInfo(searchText) {
    console.debug(`Trying to get game info by: '${searchText}'`)

    const processError = reason => console.debug(reason)
    const appid = Number(searchText)
    let foundedGame

    if (!isNaN(appid)) {
        console.debug("It's a number, proceeding as appid")
        
        await gameInfo(appid)
            .then(game => foundedGame = {
                appid: appid,
                name: game.name,
                isFree: game.is_free
            }, processError)
            .catch(processError)
    }
    else {
        console.debug(`It's a text, proceeding with the searching of the full match`)
        
        await allGames()
            .then(games => games.find(game => game.name === searchText), processError)
            .then(game => foundedGame = game)
            .catch(processError)

        if (!foundedGame) {
            return undefined
        }

        await gameInfo(foundedGame.appid)
            .then(game => foundedGame.isFree = game.is_free, processError)
            .catch(processError)
    }

    if (foundedGame) 
        foundedGame.nameWithLink = link(foundedGame.name, `https://store.steampowered.com/app/${foundedGame.appid}`)

    return foundedGame
} 