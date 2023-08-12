
import { Bot, ParseMode } from './TelegramApi.mjs'
import { gameInfo, allGames, Region, Price } from './SteamApi.mjs'
import { token } from './secrets.mjs'

const bot = new Bot(token)

bot.registerCommand('start', async (message) => {
    await message.reply("Это страт!!!")
})

bot.registerText(async (message) => {
    const errorOccured = async reason => {
        console.error('Ooops! An error during Steam Info retrival occured!\n' + reason)
        await message.reply('Ууупс! Не смог достать данные из стима, сорян.')
    }

    const replyPrices = async appid => {
        await gameInfo(appid).then(async game => {
            if (!game) {
                console.debug(`The game with appid: 'appid' havn't been found.`)
                await message.reply(`Игрулю с Steam App ID '${appid}' не нашел, увы.`)
                return
            }

            const nameAsLink = `[${game.name}](https://store.steampowered.com/app/${appid})`

            const prices = [
                new Price(appid, Region.Europe),
                new Price(appid, Region.Turkey),
                new Price(appid, Region.Kazakhstan),
                new Price(appid, Region.Russia)
            ]

            await Promise.all(prices.map(async price => await price.getPrice()))

            const pricesString = prices.map(price => `${price.region.Flag} ${price.region.Name}: ${price.formattedPrice}`).join('\n')

            await message.reply(`Прайсы на ${nameAsLink}:\n${pricesString}`, ParseMode.MarkdownV2)
        }, reason => errorOccured(reason))
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