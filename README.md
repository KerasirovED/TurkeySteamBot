# TurkeySteamBot
The bot allows you to get the best price to top up a Turkey's Steam account

# Why?
The bot helps people with a Steam account to get the best way to buy Turkish Lira to top up a Turkish Steam account.

# How to buy Turkish Lira?
There are two ways easy ways to top up a Turkish Steam account:
1. Buy gift cards
    1. [Tokenstore](https://tokenstore.io/products/details/steam-wallet-code-try--turkey-13)
    1. [Coinsbee](https://www.coinsbee.com/en/Steam-bitcoin)
1. Buy liras for crypto using Binance 2p2
    1. OLDUBIL
    1. Ziraat

# How will it work?
1. User send:
    1. Steam AppID
    1. A link to a game on Steam
        1. By the link, the bot gets Steam AppID 
    1. A name of a game
        1. By the given name, the bot sends the top 5 matches
        1. The user selects one of them
1. Using Steam AppID, the bot takes Stem Price in TRY, and EUR
2. Calculate the difference
3. Collect the data
    4. From Tokenstore
    5. From Coinsbee
    6. From Binance
        7. p2p OLDUBIL
        8. p2p Ziraat
9. Calculate the best way to buy TRYs
1. Send a response

# Stack
The bot is written on Node.js without any telegram libraries for learning purposes. The source code is deploying to AWS lambda.
