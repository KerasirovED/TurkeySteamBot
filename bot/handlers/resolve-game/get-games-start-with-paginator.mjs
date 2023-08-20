
import InlineKeyboardPaginator from "../../../telegram/inline-keyboard-paginator.mjs"
import gameSelectKeyboard from "../../keyboards/inline/game-select-keyboard.mjs"
import allGames from "../../../steam/all-games.mjs"
import getLettersAndNumbers from "../../../string-utils/getLettersAndNumbers.mjs"

export default async function (searchText) {
    const handleError = (reason) => console.error(reason)

    searchText = getLettersAndNumbers(searchText).toLowerCase()

    return await allGames().then(async games => {
        const gamesStartWith = games
            .filter(game => getLettersAndNumbers(game.name).toLowerCase().startsWith(searchText))
            .sort((a, b) => a.name.length - b.name.length)

        const keyboard = gameSelectKeyboard(gamesStartWith)
        return new InlineKeyboardPaginator(keyboard).userCallbackData(searchText).callbackDataPrefix('ggswp')
    }, handleError)
    .catch(handleError)
}