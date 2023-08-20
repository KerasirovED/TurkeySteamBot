
import replyCouldNotWithReasonLogging from "../../replies/reply-could-not-with-reason-logging.mjs"
import getGamesStartWithPaginator from "./get-games-start-with-paginator.mjs"
import processGame from "./process-game.mjs"

export default async function(message) {
    const handleError = async (reason) => await replyCouldNotWithReasonLogging(message, reason)

    const searchString = message.text

    delete message.session.game
    delete message.session.replyPrices

    await message.reply('Сек, ща поищу...')
        .then(async message => {
            const appid = Number(searchString)

            if (!isNaN(appid)) {
                processGame(message, appid)
                return
            }

            await getGamesStartWithPaginator(searchString).then(async paginator => {
                if (paginator.isEmpty) {
                    await message.editText(`Ничерта по запросу "${searchString}" не нашел, увы`)
                    return
                }

                if (paginator.keyboard.length === 1) {
                    const appid = paginator.keyboard[0][0].callback_data
                    await processGame(message, appid)
                    return
                }

                await message.editText(
                    `Тэкс, по запросу "${searchString}" нашел следуещее:`,
                    {reply_markup: paginator.getPage(1)}
                ), handleError
            })            
        }, handleError)
        .catch(handleError)
}