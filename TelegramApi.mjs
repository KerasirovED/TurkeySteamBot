
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

	async sendMessage(chatId, text, options) {
		const uri = this.botUri + '/sendMessage'

        let body = {
            chat_id: chatId,
            text: text,
            disable_web_page_preview: true
        }

        if (options?.parseMode)
            body.parse_mode = options?.parseMode

        if (options?.reply_markup)
            body.reply_markup = options?.reply_markup

		const requestInfo = { 
			method: 'POST',
			headers: {
				"Content-Type": "application/json" 
			},
			body: JSON.stringify(body)
		}

		console.debug(`Request: '${uri}'`)
		console.debug(`requestInfo:\n'${JSON.stringify(requestInfo, null, 4)}'`)

		await fetch(uri, requestInfo)
			.then(response => {
				const json = response.json() 
				console.debug(`Received:\n${JSON.stringify(json, null, 4)}`)
				return json
			}, reason => console.error('sendMessage rejected:' + reason))
            .catch(reason => console.error('sendMessage caught an exception:' + reason))
	}

    async processUpdates(updates) {
        updates.forEach(update => this.appendReply(update?.message))

        const commandUpdates = 
            updates.filter(update => update?.message?.entities?.map(entity => entity.type).includes('bot_command'))

        await Promise.all(
            commandUpdates.map(async update => 
                await this.commandHandlers.find(x => x.command === update.message.text.substring(1))
                    ?.handler(update.message))
        )

        const textUpdates = updates.filter(update => update?.message?.entities === undefined && update?.message?.text !== undefined)
        await Promise.all(textUpdates.map(async update => {
            const textHandler = this.textHandlers.find(x => x.text === update.message.text)

            if (textHandler)
                await textHandler.handler(update.message)
            else
                await this.anyTexthandler(update.message)
        }))  
    }

    commandHandlers = []
    registerCommandHandler(command, handler) {
        const addCommand = (command, handler) => {
            let sameCommand = this.commandHandlers.find(x => x.command === command)

            const newCommand = {
                command: command,
                handler: handler
            }
            
            if (sameCommand) {
                sameCommand.handler = newCommand.handler

                console.debug(`Replaced handler` + JSON.stringify(newCommand, null, 4))
            }
            else {
                this.commandHandlers.push(newCommand)

                console.debug('Registered new message handler\n' + JSON.stringify(newCommand, null, 4))
            }
        }
        
        if (typeof(handler) !== 'function')
            throw new HandlerTypeError()

        if (this.isString(command)) {
            addCommand(command, handler)
            return
        }

        if (command instanceof Array && command.every(x => this.isString(x))) {
            command.forEach(command => addCommand(command, handler))
            return
        }

        throw new TypeError('The command should be either a string or an array of strings!')
    }

    anyTexthandler = undefined
    registerAnyTextHandler(handler) {
        if (typeof(handler) !== 'function')
            throw new HandlerTypeError()

        console.debug('Registered new any text handler\n' + handler)
        this.anyTexthandler = handler
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
        if (message && typeof(message) === 'object')
            message.reply = async (text, options) => await this.sendMessage(message.chat.id, text, options)

        return message
    }

    textHandlers = []
    textHandler(text, handler) {
        if (!this.isString(text))
            throw new TypeError('The text should be a string!');

        if (typeof(handler) !== 'function')
            throw new HandlerTypeError();

        const prevHandler = this.textHandlers.find(x => x.text === text);

        if (prevHandler) {
            prevHandler.handler = handler
            return
        }

        this.textHandlers.push({
            text: text,
            handler: handler
        })
    }

    isString(value) {
        return value instanceof String || typeof value === 'string'
    }
}

export const ParseMode = {
    MarkdownV2 : 'MarkdownV2',
    HTML: 'HTML',
    Markdown: 'Markdown'
}

export class ReplyKeyboardMarkup {    
    constructor(keyboard, options) {
        this.keyboard = keyboard
        this.oneTimeKeyboard = options?.oneTimeKeyboard
        this.resizeKeyboard = options?.resizeKeyboard ?? true
    }

    /**
     * @param {Array[Array[KeyboardButton]]} value
     */
    set keyboard(value) {
        if (value instanceof Array === false)
            throw TypeError('The keyboard must be an array!')

        const nonArrayRowsCount = value.filter(row => row instanceof Array === false).length

        if (nonArrayRowsCount > 0) 
            throw TypeError('The keyboard must be an array of arrays!')

        value.forEach(row => {
            const nonKeyboardButtons = row.filter(key => key instanceof KeyboardButton === false)

            if (nonKeyboardButtons.length > 0)
                throw TypeError('The keyboard buttons must be instanses of KeyboardButton! Got: ' + nonArrayRowsCount.pop())
        })

        this._keyboard = value
    }

    get keyboard() {
        return this._keyboard
    }

    set oneTimeKeyboard(value) {
        this._oneTimeKeyboard = Boolean(value)
    }

    get oneTimeKeyboard() {
        return this._oneTimeKeyboard
    }

    set resizeKeyboard(value) {
        this._resizeKeyboard = Boolean(value)
    }

    get resizeKeyboard() {
        return this._resizeKeyboard
    }

    asJson() {
        const keyboard = this.keyboard.map(row => row.map(key => key.asJson()))

        const result = {
            keyboard: keyboard,
            resize_keyboard: this._resizeKeyboard
        }

        if (this.oneTimeKeyboard) {
            result.one_time_keyboard = this.oneTimeKeyboard
        }

        return result
    }
}

export class KeyboardButton {
    constructor(text) {
        this.text = text
    }

    /**
     * @param {string} value
     */
    set text(value) {
        if (value instanceof String === false && typeof value !== 'string')
            throw TypeError('The text should be a string!')

        this._text = value
    }

    get text() {
        return this._text
    }

    asJson() {
        const result = {
            text: this.text
        }

        return result
    }
}

export class HandlerTypeError extends TypeError {
    constructor() {
        const message = 'The handler should be a function!';
        super(message);
    }
}

export const ReplyKeyboardRemove = {
    remove_keyboard: true
}