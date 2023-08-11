
import { Bot, ParseMode } from './TelegramApi.mjs'
import { gameInfo, getPirce, allGames, Regions } from './SteamApi.mjs'
import { token } from './secrets.mjs'

const bot = new Bot(token)

bot.registerCommand('start', async (message) => {
    await message.reply("Это страт!!!")
})

bot.registerText(async (message) => {
    const errorOccured = async reason => {
        const error = 'Ooops! An error during Steam Info retrival occured!'
        console.error(error + '\n' + reason)
        await message.reply(error)
    }
    const replyPrices = async appid => {
        await gameInfo(appid).then(async game => {
            if (!game) {
                console.debug('Игру не нашел')
                await message.reply(`Игрулю с Steam App ID '${appid}' не нашел, увы`)
                return
            }

            const nameAsLink = `[${game.name}](https://store.steampowered.com/app/${appid})`

            await getPirce(appid, Regions.Turkey).then(async lira => {
                console.debug(`Прайс на лиру: '${JSON.stringify(lira, null, 4)}'`)

                await getPirce(appid, Regions.Euro).then(async eur => {
                    console.debug(`Прайс на еврик: '${JSON.stringify(eur, null, 4)}'`)
                    await message.reply(`Прайсы на ${nameAsLink}:\nЛира: ${lira?.final_formatted}\nЕвро: ${eur?.final_formatted}`, ParseMode.MarkdownV2)
                }).catch(async reason => errorOccured(reason))
            }, async reason => errorOccured(reason)).catch(async reason => errorOccured(reason))
        }, reason => errorOccured(reason)).catch(reason => errorOccured(reason))
    }

    console.debug(`Trying to process: '${message.text}'`)

    const appid = Number(message.text)

    if (isNaN(appid) == false) {
        console.debug("It's a number, proceeding as appid")
        
        await replyPrices(appid).catch(async reason => errorOccured(reason))
    }
    else {
        console.debug(`It's a text, proceeding with the searching of the full match`)
        
        await allGames()
            .then(games => games.find(game => game.name === message.text))
            .then(async game => {
                if (game) {
                    console.debug(`Found, appid: '${game.appid}'`)
                    await replyPrices(game.appid).catch(async reason => errorOccured(reason))
                }
                else {
                    console.debug("Didn't find")
                    await message.reply(`Слушай, ну я пытался найти по '${message.text}' хоть что-то, но ничерта`)
                }
            }).catch(async reason => await errorOccured(reason))
    }    
})

export default bot