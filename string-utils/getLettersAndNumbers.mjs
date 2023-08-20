
export default function (string) {
    return String(string).replace(/[^A-Za-z0-9]+/g, '')
}