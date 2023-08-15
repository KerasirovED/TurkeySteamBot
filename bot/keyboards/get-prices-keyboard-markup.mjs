
import ReplyKeyboardMarkup from "../../telegram/reply-keyboard-markup.mjs"
import KeyboardButton from "../../telegram/keyboard-button.mjs"

export const localPricesButton = new KeyboardButton('🌍 Локальные цены', {oneTimeKeyboard: true})
export const rublePricesButton = new KeyboardButton('🪆 Цены в рублях', {oneTimeKeyboard: true})
export const rublePricesWithCommissionButton = new KeyboardButton('󠀥󠀥󠀥💸 Цены в рублях с комиссией', {oneTimeKeyboard: true})

export const keyboard = [
    [localPricesButton],
    [rublePricesButton],
    [rublePricesWithCommissionButton],
]

const getPricesKeyboardMarkup = new ReplyKeyboardMarkup(keyboard, {oneTimeKeyboard: true})
export default getPricesKeyboardMarkup