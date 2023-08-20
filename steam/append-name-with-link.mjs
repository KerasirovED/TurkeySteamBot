import getNameWithLink from "./get-name-with-link.mjs"

export default function (game) {
     if (typeof(game) !== 'object')
        game = Object(game)

    if (game.appid && game.name) 
        game.nameWithLink = getNameWithLink(game.appid, game.name)

    return game
}