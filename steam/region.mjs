
const Region = Object.freeze({
    Europe: {
        Name: 'Европа',
        SteamCode: 'eur',
        Flag: '🇪🇺',
        Currency: {
            Name: 'Евро',
            Iso: 'EUR',
            Symbol: '€',
            ApiKey: 'eur'
        }
    },
    USA: {
        Name: 'США',
        SteamCode: 'us',
        Flag: '🇺🇸',
        Currency: {
            Name: 'Доллар',
            Iso: 'USD',
            Symbol: '$',
            ApiKey: 'usd'
        }
    },
    Turkey: {
        Name: 'Турция',
        SteamCode: 'tr',
        Flag: '🇹🇷',
        Currency: {
            Name: 'Доллар',
            Iso: 'USD',
            Symbol: '$',
            ApiKey: 'usd'
        }
    },
    Russia: {
        Name: 'Россия',
        SteamCode: 'ru',
        Flag: '🇷🇺',
        Currency: {
            Name: 'Российский Рубль',
            Iso: 'RUB',
            Symbol: '₽',
            ApiKey: 'rub'
        }
    },
    Kazakhstan: {
        Name: 'Казахстан',
        SteamCode: 'kz',
        Flag: '🇰🇿',
        Currency: {
            Name: 'Казахский Тенге',
            Iso: 'KZT',
            Symbol: '₸',
            ApiKey: 'kzt'
        }
    }
})

export const RegionArray = Object.values(Region) 

export default Region