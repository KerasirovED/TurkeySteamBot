
export const Region = Object.freeze({
    Europe: {
        Name: 'Европа',
        SteamCode: 'eur',
        Flag: '🇪🇺',
        Currency: {
            Name: 'Евро',
            Iso: 'EUR',
            Symbol: '€'
        }
    },
    Turkey: {
        Name: 'Турция',
        SteamCode: 'tr',
        Flag: '🇹🇷',
        Currency: {
            Name: 'Турецкая лира',
            Iso: 'TRY',
            Symbol: '₺'
        }
    },
    Russia: {
        Name: 'Россия',
        SteamCode: 'ru',
        Flag: '🇷🇺',
        Currency: {
            Name: 'Российский Рубль',
            Iso: 'RUB',
            Symbol: '₽'
        }
    },
    Kazakhstan: {
        Name: 'Казахстан',
        SteamCode: 'kz',
        Flag: '🇰🇿',
        Currency: {
            Name: 'Казахский Тенге',
            Iso: 'KZT',
            Symbol: '₸'
        }
    }
})

export const gameInfo = async (appid) => {
    const uri = `https://store.steampowered.com/api/appdetails?appids=${appid}`

    console.debug(`Request: '${uri}'`)

    return await fetch(uri)
        .then(response => response.json()).then(game => game[appid]?.data)
        .catch(reason => console.error(reason))
}

const fetchAllGames = async () => {
    console.debug('Достаем все игры')

    const uri = 'https://api.steampowered.com/ISteamApps/GetAppList/v2'

    console.debug(`Ссыль: '${uri}'`)

    return await fetch(uri)
        .then(response => response.json())
        .then(data => data?.applist?.apps)
        .catch(reason => console.log(reason))
}

let games = undefined
export const allGames = async () => {
    if (games) return games

    games = await fetchAllGames()
    return games
}

export class Price {
    _price = undefined

    constructor(appid, region) {
        this._appid = appid
        this._region = Object.freeze(structuredClone(region))
    }

    async getPrice() {
        console.debug(`Getting price by appid: '${this.appid}', and region: '${this.region.SteamCode}'`)

        const uri = `https://store.steampowered.com/api/appdetails?filters=price_overview&appids=${this.appid}&cc=${this.region.SteamCode}`

        console.debug(`URI: '${uri}'`)

        const processFetchError = reason => { 
            const message = "Couldn't fetch the price. Reason: " + reason
            console.error(message)
            throw new Error(message) 
        }

        await fetch(uri)
            .then(response => response.json(), reason => processFetchError(reason))
            .then(game => this._price = game[this.appid]?.data.price_overview.final / 100)
            .catch(reason => processFetchError(reason))
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
        const formatter = new Intl.NumberFormat('ru-RU', {
            style: "decimal",
            minimumFractionDigits: 2
        })

        return formatter.format(this.price) + ' ' + this.region.Currency.Symbol
    }
}

export class PriceComparedWithRuble extends Price {
    rubleRate = undefined

    get rublePrice() {
        return this.price * this.rubleRate   
    }
    
    get rubleFormattedPrice() {
        const formatter = new Intl.NumberFormat('ru-RU', {
            style: "decimal",
            minimumFractionDigits: 2
        })

        return formatter.format(this.rublePrice) + ' ' + Region.Russia.Currency.Symbol
    }

    async getRateToRub() {
        console.debug('Requesting rate in RUB')

        if (this.region === Region.Russia) {
            console.debug('The currency already RUB')
            this.rubleRate = 1
            return
        }

        const uri = `https://api.exchangerate.host/latest?base=${this.region.Currency.Iso}&symbols=RUB`

        console.debug(`URI: '${uri}'`)

        const processFetchError = reason => { 
            const message = "Couldn't fetch the price in RUB. Reason: " + reason
            console.error(message)
            throw new Error(message) 
        }

        await fetch(uri)
            .then(response => this.rubleRate = response.rates.RUB, reason => processFetchError(reason))
            .catch(reason => processFetchError(reason))
    }
}