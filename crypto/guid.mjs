
export default function guid() {
    let result = ""
    const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

    for (let i = 0; i <= 36; i++) {
        if ([9, 14, 19, 24].includes(i)) {
            result += '-'
            continue
        }

        const randomIndex = parseInt(Math.random() * (possibleChars.length - 1))

        result += possibleChars[randomIndex]
    }

    return result
}