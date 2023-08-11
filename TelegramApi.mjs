
export class Bot {
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

	async sendMessage(chatId, text, parseMode) {
		const uri = this.botUri + '/sendMessage'

        let body = {
            chat_id: chatId,
            text: text,
            disable_web_page_preview: true
        }

        if (parseMode)
            body.parse_mode = parseMode

		const requestInfo = { 
			method: 'POST',
			headers: {
				"Content-Type": "application/json" 
			},
			body: JSON.stringify(body)
		}

		console.debug(`Request: '${uri}'`)
		console.debug(`requestInfo:\n'${JSON.stringify(requestInfo, null, 4)}'`)

		return await fetch(uri, requestInfo)
			.then(response => {
				const json = response.json() 
				console.debug(`Received:\n${JSON.stringify(json, null, 4)}`)
				return json
			}, _ => console.debug('Промис в sendMessage нагнули!'))
            .catch(reason => console.debug('sendMessage поймал ошибку' + reason))
	}

    async processUpdates(updates) {
        const commands = 
            updates.filter(update => update?.message?.entities?.map(entity => entity.type).includes('bot_command'))

        await Promise.all(
            commands.map(async command => 
                await this.commandCallbacks.find(x => x.command === command.message.text.substring(1))
                    ?.callback(this.appendReply(command.message)))
        )

        if (this.textCallback) {
            const texts = updates.filter(update => update?.message?.entities === undefined && update?.message?.text !== undefined)
            await Promise.all(texts.map(async text => await this.textCallback(this.appendReply(text.message))))
        }
    }

    commandCallbacks = []
    registerCommand(command, callback) {
        const addCommand = (command, callback) => {
            let sameCommand = this.commandCallbacks.find(x => x.command === command)

            const newCommand = {
                command: command,
                callback: callback
            }
            
            if (sameCommand) {
                sameCommand.callback = newCommand.callback

                console.debug(`Replaced callback` + JSON.stringify(newCommand, null, 4))
            }
            else {
                this.commandCallbacks.push(newCommand)

                console.debug('Registered new message handler\n' + JSON.stringify(newCommand, null, 4))
            }
        }

        if (command instanceof String || typeof command === 'string')
            addCommand(command, callback)

        if (command instanceof Array)
            command.forEach(command => addCommand(command, callback))
    }

    textCallback = undefined
    registerText(callback) {
        console.debug('Registered new text handler\n' + callback)
        this.textCallback = callback
    }

    startPolling(delay) {
        const polling = () => setTimeout(async () => {
            console.debug('Getting updates...')
            
            await this.getUpdates()
                .then(updates => this.processUpdates(updates))
    
            console.debug('Updates have got!')
    
            polling()
        }, delay)

        polling()
    }

    appendReply(message) {
        message.reply = async (text, parseMode) => await this.sendMessage(message.chat.id, text, parseMode)
        return message
    }
}

export const ParseMode = {
    MarkdownV2 : 'MarkdownV2',
    HTML: 'HTML',
    Markdown: 'Markdown'
}