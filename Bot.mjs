
import { Bot, ParseMode } from './TelegramApi.mjs'
import { gameInfo, allGames, Region, Price, PriceComparedWithRuble } from './SteamApi.mjs'
import { token } from './secrets.mjs'

const bot = new Bot(token)

bot.registerCommand('start', async (message) => {
    await message.reply("Это страт!!!")
})

const lastSuccessAppid = {}

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

            try {
                await Promise.all(prices.map(async price => await price.getPrice()))
            } catch {
                await message.reply('Не вышло, сорян.')
                return
            }
            const pricesString = prices.map(price => `${price.region.Flag} ${price.region.Name}: ${price.formattedPrice}`).join('\n')

            await message.reply(`Прайсы на ${nameAsLink}:\n${pricesString}`, ParseMode.MarkdownV2)

            lastSuccessAppid[message.chat.id] = {
                appid: appid,
                nameAsLink: nameAsLink
            }

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

bot.registerCommand('rub', async message => {
    const app = lastSuccessAppid[message.chat.id]

    if (!app) {
        message.reply('Я не нашел последнего удачного сообщения. Отправь айди или имя игры еще раз.')
        return
    }

    const prices = [
        new PriceComparedWithRuble(app.appid, Region.Europe),
        new PriceComparedWithRuble(app.appid, Region.Turkey),
        new PriceComparedWithRuble(app.appid, Region.Kazakhstan),
        new PriceComparedWithRuble(app.appid, Region.Russia)
    ]


    try {
        await Promise.all(prices.map(async price => await price.getPrice()))
        await Promise.all(prices.map(async price => await price.getRateToRub()))
    } catch {
      await message.reply('Не вышло, сорян.')
      return
    }

    const pricesString = prices.map(price => `${price.region.Flag} ${price.region.Name}: ${price.rubleFormattedPrice}`).join('\n')

    await message.reply(`Прайсы на ${app.nameAsLink}:\n${pricesString}`, ParseMode.MarkdownV2)
})

export default bot