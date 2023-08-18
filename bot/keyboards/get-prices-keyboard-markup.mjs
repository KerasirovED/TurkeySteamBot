
import ReplyKeyboardMarkup from "../../telegram/reply-keyboard-markup.mjs"
import KeyboardButton from "../../telegram/keyboard-button.mjs"

export const localPricesButton = new KeyboardButton('🌍 Локальные цены')
export const rublePricesButton = new KeyboardButton('🪆 Цены в рублях')
export const rublePricesWithCommissionButton = new KeyboardButton('󠀥󠀥󠀥💸 Цены в рублях с комиссией')

export const keyboard = [
    [localPricesButton],
    [rublePricesButton],
    [rublePricesWithCommissionButton],
]

const getPricesKeyboardMarkup = new ReplyKeyboardMarkup(keyboard)
export default getPricesKeyboardMarkup