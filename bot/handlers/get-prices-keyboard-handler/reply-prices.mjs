
import escapeChars from './../../../string-utils/markdown-v2/escape-chars.mjs'
import ParseMode from './../../../telegram/parse-mode.mjs'

export default async function replyPrices(message, game, getPrices) {
    const nameAsLink = `[${escapeChars(game.name)}](https://store.steampowered.com/app/${game.appid})`

    const prices = getPrices(game.appid)

    try {
        await Promise.all(prices.map(async price => await price.getPrice()))
    } catch {
        await message.reply('Не вышло, сорян.')
        return
    }
    const pricesString = prices.map(price => `${price.region.Flag} ${price.region.Name}: ${price.formattedPrice}`).join('\n')

    await message.reply(`Прайсы на ${nameAsLink}:\n${pricesString}`, { parseMode: ParseMode.MarkdownV2 })

    message.session = {
        appid: game.appid,
        nameAsLink: nameAsLink
    }
}