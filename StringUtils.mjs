

export function isString(value) {
    return value instanceof String || typeof value === 'string'
}

export class MarkdownV2 {
    static escapeChars(string) {
        if (!isString(string)) {
            return string
        }

        return string
            .split('')
            .map(c => /(_|\*|\[|\]|\(|\)|~|`|>|#|\+|-|=|\||{|}|\.|!)/g.test(c) ? '\\' + c : c)
            .join('')
    }
}