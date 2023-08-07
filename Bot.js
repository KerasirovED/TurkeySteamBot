
class Bot {
    constructor(token) {
        this.token = token
        this.botUri = `https://api.telegram.org/bot${token}`
    }

    getMe = async () => {
		return await fetch(this.botUri + "/getMe")
			.then(result => result.json())
	}
	
    #offset = 0
	async getUpdates(timeout = 100) {
        let params = []

        params.push("?offset=" + (this.#offset + 1))

        if (timeout)
            params.push("?timeout=" + timeout)

        const uri = this.botUri + "/getUpdates" + params.join('&')

        console.debug(`Request: '${uri}'`)

        return await fetch(uri)
            .then(result => result.json())
            .then(data => {
                const received = `Received:\n${JSON.stringify(data, null, 4)}`

                if (!data.result) {
                    console.error(received)
                    return []
                }

                console.debug(received)
                return data?.result
            })
            .then(updates => {
                if (updates?.length > 0)
                    this.#offset = updates.slice().pop().update_id
                return updates
            })
	}

	async sendMessage(chatId, text) {
		const uri = this.botUri + '/sendMessage'
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
}

module.exports = {
    Bot: Bot
}