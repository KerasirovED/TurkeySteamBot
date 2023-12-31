
import Price from "./Price.mjs"
import Region from './../steam/region.mjs'

export default class PriceInRubles extends Price {
    _rubleRate = undefined

    get price() {
        return this._price * this._rubleRate
    }
    
    get formattedPrice() {
        if (!this._price) {
            return undefined
        }

        const formatter = new Intl.NumberFormat('ru-RU', {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })

        return formatter.format(this.price) + ' ' + Region.Russia.Currency.Symbol
    }

    async getPrice() {
        await super.getPrice()
        await this.getRateToRub()
    }

    async getRateToRub() {
        console.debug('Requesting rate in RUB for ' + this._region.Currency.Iso)

        if (this._region.Currency.Iso === Region.Russia.Currency.Iso) {
            console.debug('The currency already RUB')
            this._rubleRate = 1
            return
        }

        const uri = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${this._region.Currency.ApiKey}.json`

        console.debug(`URI: '${uri}'`)

        const processFetchError = reason => { 
            const message = "Couldn't fetch the price in RUB. Reason: " + reason
            console.error(message)
            throw new Error(message) 
        }

        await fetch(uri)
            .then(response => response.json(), processFetchError)
            .then(data => this._rubleRate = data[this._region.Currency.ApiKey].rub)
            .catch(processFetchError)
    }
}