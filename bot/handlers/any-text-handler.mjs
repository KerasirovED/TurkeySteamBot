
import getPricesKeyboardMarkup from "../keyboards/get-prices-keyboard-markup.mjs"
import replyCouldNotWithReasonLogging from "../replies/reply-could-not-with-reason-logging.mjs"
import getBaseGameInfo from './../../steam/get-base-game-info.mjs'
import ParseMode from "../../telegram/parse-mode.mjs"
import escape from "../../string-utils/markdown-v2/escape.mjs"
import join from "../../string-utils/join.mjs"

export default async function(message) {
    const handleError = async (reason) => await replyCouldNotWithReasonLogging(message, reason)

    const searchText = message.text

    delete message.session.game
    delete message.session.replyPrices

    await message.reply('Сек, ща поищу...')
        .then(async message => {
            const game = await getBaseGameInfo(searchText)

            if (!game) {
                await message.editText(`Игру по запросу "${searchText}" не нашел, увы`)
                return
            }

            if (game.isFree) {
                await message.editText(`🆓 ${game.nameWithLink} бесплатная`, { parseMode: ParseMode.MarkdownV2 })
                return
            }

            message.session.game = game
            
            await message.delete()

            await message.reply(
                join('',
                    escape('Так, нашел '),
                    game.nameWithLink,
                    escape('. Какую стоимость игры ты хочешь увидеть?')
                ),
                {
                    reply_markup: getPricesKeyboardMarkup,
                    parseMode: ParseMode.MarkdownV2
                }
            )
        }, handleError)
        .catch(handleError)
}