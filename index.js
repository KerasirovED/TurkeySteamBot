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

			const getUpdatesUri = botUri + "/getUpdates" + params.join('&')

			console.debug(`Request: '${getUpdatesUri}'`)

			return await fetch(getUpdatesUri)
				.then(result => result.json())
				.then(data => {
					console.debug(`Received:\n${JSON.stringify(data, null, 4)}`)
					return data.result
				})
		}
		
		return await fetchUpdates()
			.then(async updates => {		
				offset = updates.slice().pop()?.update_id ?? offset
		
				// clears currently fetched updates
				if (offset)
					console.debug('Clears currently fetched updates')
					await fetchUpdates(offset + 1, 1)
		
				return updates
			})
	}

	const sendMessage = async (chatId, text) => {
		const uri = botUri + '/sendMessage'
		const requestInfo = { 
			method: 'POST',
			headers: {
				"Content-Type": "application/json" 
			},
			body: JSON.stringify({
				chat_id: chatId,
				text: text
			})
		}

		console.debug(`Request: '${uri}'`)
		console.debug(`requestInfo:\n'${JSON.stringify(requestInfo, null, 4)}'`)

		return await fetch(uri, requestInfo)
			.then(response => {
				const json = response.json() 
				console.debug(`Received:\n${JSON.stringify(json, null, 4)}`)
				return json
			})
	}

	const delay = 5000

	const polling = () => setTimeout(async () => {
		console.debug('Getting updates...')

		await getUpdates()
			.then(updates => {
				console.debug('Received:\n' + updates)

				updates.forEach(async update => {
					await sendMessage(update.message.chat.id, JSON.stringify(update, null, 4))
			})})

		console.debug('Updates have got!')

		polling()
	}, delay)

	console.debug('Polling starged')
	polling()
}

main()