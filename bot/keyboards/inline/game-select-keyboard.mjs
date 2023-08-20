
import InlineKeyboardButton from "../../../telegram/inline-keyboard-button.mjs";
import InlineKeyboardMarkup from "../../../telegram/inline-keyboard-markup.mjs";

export default function(games) {
    const buttons = games?.map(game => [new InlineKeyboardButton(game.name).callbackData(game.appid)])
    return new InlineKeyboardMarkup(buttons)
}