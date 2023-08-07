
const { token } = require('./secrets')
const { Bot } = require('./Bot')
const { Regions, getPirce, gameInfo } = require('./SteamApi')

const main = async () => {
    const bot = new Bot(token)

    bot.registerCommand('start', async (message) => {
        await message.reply("Это страт!!!")
    })

    bot.registerText(async (message) => {
        appId = Number(message.text)

        if (isNaN(appId)) {
            await message.reply(`Опа, '${message.text}' оказался не Steam AppID`)
            return
        }

        await gameInfo(appId).then(async game => {
            if (!game) {
                await message.reply(`Игрулю с Steam AppID '${appId}' не нашел, увы`)
                return
            }

            await getPirce(appId, Regions.Turkey).then(async lira => {
                await getPirce(appId, Regions.Euro).then(async eur => {
                    await message.reply(`Прайсы на ${game.name}:\nЛира: ${lira.final_formatted}\nЕвро: ${eur.final_formatted}`)
                })
            })
        })
    })

	console.debug('Polling started')
	bot.startPolling()
}

main()