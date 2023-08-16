
import ParseMode from './../../../telegram/parse-mode.mjs'

export default async function replyPrices(message, game, getPrices) {
    if (game.isFree === true) {
        await message.reply(`🆓 ${game.nameAsLink} бесплатная`, { parseMode: ParseMode.MarkdownV2 })
        return
    }
    
    let prices

    if (message.text === message.session.replyPrices.text) 
        prices = message.session.replyPrices.prices
    else {
        prices = getPrices(game.appid)

        try {
            await Promise.all(prices.map(async price => await price.getPrice()))
        } catch {
            await message.reply('Не вышло, сорян.')
            return
        }
    }

    const pricesString = prices.map(price => `${price.region.Flag} ${price.region.Name}: ${price.formattedPrice ?? 'не продается'}`).join('\n')

    await message.reply(`Прайсы на ${game.nameAsLink}:\n${pricesString}`, { parseMode: ParseMode.MarkdownV2 })

    message.session.replyPrices.prices = prices
    message.session.replyPrices.text = message.text
}