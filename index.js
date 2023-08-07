
const { token } = require('./secrets')
const { Bot, ParseMode } = require('./TelegramApi')
const { Regions, getPirce, gameInfo, allGames } = require('./SteamApi')

const main = async () => {
    const bot = new Bot(token)

    bot.registerCommand('start', async (message) => {
        await message.reply("Это страт!!!")
    })

    bot.registerText(async (message) => {
        const replyPrices = async appid => {
            await gameInfo(appid).then(async game => {
                if (!game) {
                    await message.reply(`Игрулю с Steam App ID '${appid}' не нашел, увы`)
                    return
                }

                linkedName = `[${game.name}](https://store.steampowered.com/app/${appid})`

                await getPirce(appid, Regions.Turkey).then(async lira => {
                    await getPirce(appid, Regions.Euro).then(async eur => {
                        await message.reply(`Прайсы на ${linkedName}:\nЛира: ${lira?.final_formatted}\nЕвро: ${eur?.final_formatted}`, ParseMode.MarkdownV2)
                    }).catch(async () => {
                        await message.reply('Походу, форматирование Markdown V2 нас нагнуло.')
                    })
                })
            })
        }

        appid = Number(message.text)

        if (isNaN(appid) == false) 
            await replyPrices(appid)
        else {
            await allGames()
                .then(games => games.find(game => game.name === message.text))
                .then(async game => {
                    if (game)
                        await replyPrices(game.appid)
                    else
                        await message.reply(`Слушай, ну я пытался найти по '${message.text}' хоть что-то, но ничерта`)
                })
        }    
    })

	console.debug('Polling started')
	bot.startPolling()
}

main()