
import startHandler from './handlers/start-handler.mjs'
import anyTextHandler from './handlers/any-text-handler.mjs'
import localPricesButtonHandler from './handlers/get-prices-keyboard-handler/local-prices-button-handler.mjs'
import rublePricesButtonHandler from './handlers/get-prices-keyboard-handler/ruble-prices-button-handler.mjs'
import rublePricesWithCommissionButtonHandler from './handlers/get-prices-keyboard-handler/ruble-prices-with-commission-button-handler.mjs'
import { localPricesButton, rublePricesButton, rublePricesWithCommissionButton } from './keyboards/get-prices-keyboard-markup.mjs'
import { token } from '../secrets.mjs'
import Bot from '../telegram/bot.mjs'

const bot = new Bot(token)

bot.registerCommandHandler('start', startHandler)
bot.registerAnyTextHandler(anyTextHandler)
bot.textHandler(localPricesButton.text, localPricesButtonHandler)
bot.textHandler(rublePricesButton.text, rublePricesButtonHandler)
bot.textHandler(rublePricesWithCommissionButton.text, rublePricesWithCommissionButtonHandler)

export default bot