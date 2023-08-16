
import bot from './bot/bot.mjs'

export const handler = async (event) => {
    await bot.processUpdates([JSON.parse(event.body)])
}