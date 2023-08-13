
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
            .then(game => this._price = game[this.appid]?.data.price_overview.final / 100)
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
        const formatter = new Intl.NumberFormat('ru-RU', {
            style: "decimal",
            minimumFractionDigits: 2
        })

        return formatter.format(this._price) + ' ' + this._region.Currency.Symbol
    }
}

export class PriceInRubles extends Price {
    _rubleRate = undefined

    get price() {
        return this._price * this._rubleRate
    }
    
    get formattedPrice() {
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

        const uri = `https://api.exchangerate.host/latest?base=${this._region.Currency.Iso}&symbols=RUB`

        console.debug(`URI: '${uri}'`)

        const processFetchError = reason => { 
            const message = "Couldn't fetch the price in RUB. Reason: " + reason
            console.error(message)
            throw new Error(message) 
        }

        await fetch(uri)
            .then(response => response.json(), processFetchError)
            .then(data => this._rubleRate = data.rates.RUB)
            .catch(processFetchError)
    }
}

export class PriceInRublesWithCommission extends PriceInRubles {
    constructor(appid, region, commission) {
        super(appid, region)
        this.commission = commission ?? 0
    }

    get commission() {
        return this._commission
    }

    set commission(value) {
        value = Number(value)
        this._commission = value
    }

    get price() {
        return super.price + super.price * this._commission
    }
}