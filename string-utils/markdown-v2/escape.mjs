
import isString from '../isString.mjs'

export default function(string) {
    if (!isString(string)) {
        return string
    }

    return string
        .split('')
        .map(c => /(_|\*|\[|\]|\(|\)|~|`|>|#|\+|-|=|\||{|}|\.|!)/g.test(c) ? '\\' + c : c)
        .join('')
}