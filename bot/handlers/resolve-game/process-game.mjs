
import escape from "../../../string-utils/markdown-v2/escape.mjs"
import join from "../../../string-utils/join.mjs"
import getPricesKeyboardMarkup from "../../keyboards/reply/prices-keyboard.mjs"
import getBaseGameInfo from "../../../steam/get-base-game-info.mjs"
import allGames from "../../../steam/all-games.mjs"
import appendNameWithLink from "../../../steam/append-name-with-link.mjs"
import replyCouldNotWithReasonLogging from "../../replies/reply-could-not-with-reason-logging.mjs"

export default async function (message, appid) {
    appid = Number(appid)

    const game = await getBaseGameInfo(appid)

    const handleError = async reason => await replyCouldNotWithReasonLogging(message, reason)

    if (!game) {
        await allGames()
            .then(games => games.find(game => game.appid === appid))
            .then(async game => {
                appendNameWithLink(game)
                await message.editTextMd2(`Похоже, Steam нас обманул\\! Игры ${game.nameWithLink} не существует\\. 🫠`)
        }, handleError)
        .catch(handleError)

        return
    }

    if (game.isFree) {
        await message.editTextMd2(`🆓 ${game.nameWithLink} бесплатная`)
        return
    }

    message.session.game = game
    
    await message.delete()

    await message.replyMd2(
        join('',
            escape('Так, нашел '),
            game.nameWithLink,
            escape('. Какую стоимость игры ты хочешь увидеть?')
        ),
        {
            reply_markup: getPricesKeyboardMarkup
        }
    )
}