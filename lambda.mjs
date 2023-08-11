
import bot from './Bot.mjs'

export const handler = async (event) => {
    await bot.processUpdates([JSON.parse(event.body)])
}