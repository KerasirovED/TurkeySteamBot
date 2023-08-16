
import getPricesKeyboardMarkup from "../keyboards/get-prices-keyboard-markup.mjs"

export default async function(message) {
    await message.reply('Какую стоимость игры ты хочешь увидеть?', {reply_markup: getPricesKeyboardMarkup})
    message.session.searchText = message.text
}