
export default async function replyPrices(message, getPrices) {
    if (!message.session.game) {
        message.reply('Я забыл игру, отправь еще раз, плез')
        return
    }
    
    let prices

    if (message.session.game === message.session.replyPrices?.game) 
        prices = message.session.replyPrices.prices[message.text]
    
    if (!prices) {
        prices = getPrices(message.session.game.appid)

        try {
            await Promise.all(prices.map(async price => await price.getPrice()))
        } catch {
            await message.reply('Не вышло, сорян.')
            return
        }

        if (!message.session.replyPrices) {
            message.session.replyPrices = {
                prices: {}
            }
        }

        message.session.replyPrices.prices[message.text] = prices
        message.session.replyPrices.game = message.session.game
    }

    const pricesString = prices.map(price => `${price.region.Flag} ${price.region.Name}: ${price.formattedPrice ?? 'не продается'}`).join('\n')

    await message.replyMd2(['🎮 ' + message.session.game.nameWithLink, message.text, '', pricesString].join('\n'))
}