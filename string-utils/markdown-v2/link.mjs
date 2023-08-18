
import escape from "./escape.mjs"

export default function(string, link) {
    return `[${escape(string)}](${link})`
}