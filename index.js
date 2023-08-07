
const { token } = require('./secrets')
const { Bot } = require('./Bot')

const main = async () => {
    const bot = new Bot(token)

	const delay = 5000

	const polling = () => setTimeout(async () => {
		console.debug('Getting updates...')
        
        await bot.getUpdates()
            .then(updates => {
                updates = updates.filter(update => update.message)

                updates.forEach(async update => {
                    await bot.sendMessage(update.message.chat.id, JSON.stringify(update, null, 4))
            })})

        console.debug('Updates have got!')

		polling()
	}, delay)

	console.debug('Polling started')
	polling()
}

main()