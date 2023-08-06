const { response } = require("express")

const token = ''
const botUri = `https://api.telegram.org/bot${token}`

const main = async () => {
	const getMe = async () => {
		return await fetch(botUri + "/getMe")
			.then(result => result.json())
	}
	
	let offset
	const getUpdates = async () => {
		const fetchUpdates = async (offset, limit) => {
			let params = []

			if (offset)
				params.push("?offset=" + offset)

			if (limit)
				params.push("?limit=" + limit)

			return await fetch(botUri + "/getUpdates" + params.join('&'))
				.then(result => result.json())
				.then(data => data.result)
		}
		
		return await fetchUpdates()
			.then(async updates => {		
				offset = updates.slice().pop()?.update_id ?? offset
		
				// clears currently fetched updates
				if (offset)
					await fetchUpdates(offset + 1, 1)
		
				return updates
			})
	}

	const sendMessage = async (chatId, text) => {
		return await fetch(botUri + '/sendMessage', { 
			method: 'POST',
			headers: {
				"Content-Type": "application/json" 
			},
			body: JSON.stringify({
				chat_id: chatId,
				text: text
			})
		})
		.then(response => response.json())
	}

	await getUpdates()
		.then(updates => updates.forEach(async update => {
			await sendMessage(update.message.chat.id, JSON.stringify(update, null, 4))
		}))
}

main()