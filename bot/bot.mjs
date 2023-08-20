
import startHandler from './handlers/start-handler.mjs'
import resolveGameHandler from './handlers/resolve-game/resolve-game-handler.mjs'
import localPricesButtonHandler from './handlers/get-prices-keyboard-handler/local-prices-button-handler.mjs'
import rublePricesButtonHandler from './handlers/get-prices-keyboard-handler/ruble-prices-button-handler.mjs'
import rublePricesWithCommissionButtonHandler from './handlers/get-prices-keyboard-handler/ruble-prices-with-commission-button-handler.mjs'
import { localPricesButton, rublePricesButton, rublePricesWithCommissionButton } from './keyboards/reply/prices-keyboard.mjs'
import { token } from '../secrets.mjs'
import Bot from '../telegram/bot.mjs'
import gamesStartWithPaginatorHandler from './handlers/resolve-game/games-start-with-paginator-handler.mjs'
import processGameHandler from './handlers/resolve-game/process-game-handler.mjs'


const bot = new Bot(token)

bot.registerCommandHandler('start', startHandler)
bot.registerAnyTextHandler(resolveGameHandler)
bot.textHandler(localPricesButton.text, localPricesButtonHandler)
bot.textHandler(rublePricesButton.text, rublePricesButtonHandler)
bot.textHandler(rublePricesWithCommissionButton.text, rublePricesWithCommissionButtonHandler)
bot.callbackHandler(/^ggswp.*/, gamesStartWithPaginatorHandler)
bot.callbackHandler(/^\d+.*/, processGameHandler)

export default bot