
import processGame from "./process-game.mjs"

export default async function (callback) {
    await processGame(callback.message, callback.data)
}