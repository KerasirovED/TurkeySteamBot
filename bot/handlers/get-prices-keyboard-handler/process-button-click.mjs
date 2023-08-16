
import replyPrices from './reply-prices.mjs'
import escapeChars from './../../../string-utils/markdown-v2/escape-chars.mjs'
import getBaseGameInfo from './get-base-game-info.mjs'

export default async function processButtonClick(message, getPrices) {
    const searchText = message.session.searchText
    
    if (!searchText) {
        message.reply('Я забыл что ты мне там отправлял, отправь еще раз, плез')
        return
    }
    
    if (searchText === message.session.replyPrices?.searchText) {
        await replyPrices(message, message.session.replyPrices.game, getPrices)
        return
    }
    
    const foundedGame = await getBaseGameInfo(searchText)
    
    if (foundedGame) {
        console.debug(`Found, appid: '${foundedGame.appid}'`)

        foundedGame.nameAsLink = `[${escapeChars(foundedGame.name)}](https://store.steampowered.com/app/${foundedGame.appid})`

        message.session.replyPrices = {
            game: foundedGame,
            searchText: searchText
        }

        await replyPrices(message, foundedGame, getPrices)
    }
    else {
        console.debug("Didn't find")
        await message.reply(`Слушай, ну я пытался найти по '${searchText}' хоть что-то, но ничерта`)
    }
}