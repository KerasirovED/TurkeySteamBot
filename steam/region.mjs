
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
    Turkey: {
        Name: 'Турция',
        SteamCode: 'tr',
        Flag: '🇹🇷',
        Currency: {
            Name: 'Турецкая лира',
            Iso: 'TRY',
            Symbol: '₺',
            ApiKey: 'try'
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

export default Region