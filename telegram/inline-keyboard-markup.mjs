
export default class InlineKeyboardMarkup {
    constructor(keyboard) {
        if (keyboard instanceof InlineKeyboardMarkup)
            this.inline_keyboard = keyboard.inline_keyboard
        else if (keyboard instanceof Array && keyboard[0] instanceof Array)
            this.inline_keyboard = keyboard
        else if (keyboard instanceof Array)
            this.inline_keyboard = [keyboard]
        else
            this.inline_keyboard = [[keyboard]]
    }
}