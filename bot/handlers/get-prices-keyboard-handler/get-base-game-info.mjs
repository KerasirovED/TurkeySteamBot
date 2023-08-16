
import allGames from "../../../steam/all-games.mjs"
import gameInfo from "../../../steam/game-info.mjs"
import replyError from "./reply-error.mjs"

export default async function getBaseGameInfo(searchText) {
    console.debug(`Trying to get game info by: '${searchText}'`)

    const processError = async reason => await replyError(reason, message)
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

        await gameInfo(foundedGame.appid)
            .then(game => foundedGame.isFree = game.is_free, processError)
            .catch(processError)
    }

    return foundedGame
} 