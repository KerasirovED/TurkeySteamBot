
import getPricesKeyboardMarkup from "../keyboards/get-prices-keyboard-markup.mjs"

export default async function(message) {
    await message.reply('Какую стоимость игры ты хочешь увидить?', {reply_markup: getPricesKeyboardMarkup})
    message.session.appid = message.text
}