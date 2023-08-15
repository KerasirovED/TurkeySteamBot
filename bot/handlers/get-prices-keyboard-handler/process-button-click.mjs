
import allGames from "../../../steam/all-games.mjs"
import gameInfo from "../../../steam/game-info.mjs"
import replyError from "./reply-error.mjs"
import replyPrices from './reply-prices.mjs'

export default async function processButtonClick(message, getPrices) {
    const processError = async reason => await replyError(reason, message)

    const searchText = message.session.appid

    if (!searchText) {
        message.reply('Я забыл что ты мне там отправлял, отправь еще раз, плез')
        return
    }

    console.debug(`Trying to process: '${searchText}'`)

    const appid = Number(searchText)
    let foundedGame

    if (!isNaN(appid)) {
        console.debug("It's a number, proceeding as appid")
        await gameInfo(appid)
            .then(async game => foundedGame = {
                appid: appid,
                name: game.name
            }, processError)
            .catch(processError)
    }
    else {
        console.debug(`It's a text, proceeding with the searching of the full match`)
        
        await allGames()
            .then(games => games.find(game => game.name === searchText), processError)
            .then(async game => foundedGame = game)
            .catch(processError)
    }

    if (foundedGame) {
        console.debug(`Found, appid: '${foundedGame.appid}'`)
        await replyPrices(message, foundedGame, getPrices).catch(processError)
    }
    else {
        console.debug("Didn't find")
        await message.reply(`Слушай, ну я пытался найти по '${searchText}' хоть что-то, но ничерта`)
    }
}