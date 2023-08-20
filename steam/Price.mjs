
export default class Price {
    _price = undefined

    constructor(appid, region) {
        this._appid = appid
        this._region = Object.freeze(structuredClone(region))
    }

    async getPrice() {
        console.debug(`Getting price by appid: '${this._appid}', and region: '${this._region.SteamCode}'`)

        const uri = `https://store.steampowered.com/api/appdetails?filters=price_overview&appids=${this._appid}&cc=${this._region.SteamCode}`

        console.debug(`URI: '${uri}'`)

        const processFetchError = reason => { 
            const message = "Couldn't fetch the price. Reason: " + reason
            console.error(message)
            throw new Error(message) 
        }

        await fetch(uri)
            .then(response => response.json(), processFetchError)
            .then(game => this._price = game[this.appid]?.data?.price_overview?.final / 100)
            .catch(processFetchError)
    }

    get appid() {
        return this._appid
    }

    get region() {
        return this._region
    }

    get price() {
        return this._price
    }

    get formattedPrice() {
        if (!this._price) {
            return undefined
        }

        const formatter = new Intl.NumberFormat('ru-RU', {
            style: "decimal",
            minimumFractionDigits: 2
        })

        return formatter.format(this._price) + ' ' + this._region.Currency.Symbol
    }
}