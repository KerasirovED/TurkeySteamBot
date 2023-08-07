
const { token } = require('./secrets')
const { Bot } = require('./Bot')

const main = async () => {
    const bot = new Bot(token)

    bot.registerCommand('start', async (message) => {
        await message.reply("Это страт!!!")
    })

    bot.registerText((message) => message.reply(JSON.stringify(message, null, 4)))

	console.debug('Polling started')
	bot.startPolling()
}

main()