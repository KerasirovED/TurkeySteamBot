
const { token } = require('./secrets')
const { Bot } = require('./Bot')

const main = async () => {
    const bot = new Bot(token)

    bot.registerCommand('start', async (message) => {
        await bot.sendMessage(message.chat.id, "Это страт!!!")
    })

    bot.registerText((message) => bot.sendMessage(message.chat.id, JSON.stringify(message, null, 4)))

	console.debug('Polling started')
	bot.startPolling()
}

main()