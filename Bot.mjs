
import { Bot, ParseMode, KeyboardButton, ReplyKeyboardMarkup } from './TelegramApi.mjs'
import { gameInfo, allGames, Region, Price, PriceInRubles, PriceInRublesWithCommission } from './SteamApi.mjs'
import { token } from './secrets.mjs'

const bot = new Bot(token)

bot.registerCommandHandler('start', async (message) => {
    await message.reply("Это страт!!!")
})

const lastSuccessAppid = {}
const lastAnyTextHanderMessage = {}

const localPricesButton = new KeyboardButton('🌍 Локальные цены', {oneTimeKeyboard: true})
const rublePricesButton = new KeyboardButton('🇷🇺 Цены в рублях', {oneTimeKeyboard: true})
const rublePricesWithPercentButton = new KeyboardButton('󠀥󠀥󠀥💸 Цены в рублях с комиссией', {oneTimeKeyboard: true})

bot.registerAnyTextHandler(async (message) => {
    const keyboard = [
        [localPricesButton],
        [rublePricesButton],
        [rublePricesWithPercentButton],
    ]

    const markup = new ReplyKeyboardMarkup(keyboard, {oneTimeKeyboard: true})

    await message.reply('Какую стоимость игры ты хочешь увидить?', {reply_markup: markup.asJson()})

    lastAnyTextHanderMessage[message.chat.id] = message.text
})

const replyPrices = async (message, game, getPrices) => {
    const nameAsLink = `[${game.name}](https://store.steampowered.com/app/${game.appid})`

    const prices = getPrices(game.appid)

    try {
        await Promise.all(prices.map(async price => await price.getPrice()))
    } catch {
        await message.reply('Не вышло, сорян.')
        return
    }
    const pricesString = prices.map(price => `${price.region.Flag} ${price.region.Name}: ${price.formattedPrice}`).join('\n')

    await message.reply(`Прайсы на ${nameAsLink}:\n${pricesString}`, { parseMode: ParseMode.MarkdownV2 })

    lastSuccessAppid[message.chat.id] = {
        appid: game.appid,
        nameAsLink: nameAsLink
    }
}

const replyError = async (reason, message) => {
    console.error('Ooops! An error during Steam Info retrival occured!\n' + reason)
    await message.reply('Ууупс! Не смог достать данные из стима, сорян.')
}

const processButtonClick = async (message, getPrices) => {
    const processError = async reason => await replyError(reason, message)

    const searchText = lastAnyTextHanderMessage[message.chat.id]

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

bot.textHandler(localPricesButton.text, async message => await processButtonClick(message, appid => [
    new Price(appid, Region.Europe),
    new Price(appid, Region.Turkey),
    new Price(appid, Region.Kazakhstan),
    new Price(appid, Region.Russia)
]))

bot.textHandler(rublePricesButton.text, async message => await processButtonClick(message, appid => [
    new PriceInRubles(appid, Region.Europe),
    new PriceInRubles(appid, Region.Turkey),
    new PriceInRubles(appid, Region.Kazakhstan),
    new PriceInRubles(appid, Region.Russia)
]))

bot.textHandler(rublePricesWithPercentButton.text, async message => await processButtonClick(message, appid => [
    new PriceInRublesWithCommission(appid, Region.Europe),
    new PriceInRublesWithCommission(appid, Region.Turkey, 0.092),
    new PriceInRublesWithCommission(appid, Region.Kazakhstan),
    new PriceInRublesWithCommission(appid, Region.Russia, 0.17)
]))

export default bot