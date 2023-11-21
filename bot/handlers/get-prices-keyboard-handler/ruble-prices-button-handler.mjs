
import replyPrices from "./reply-prices.mjs"
import PriceInRubles from "../../../steam/price-in-rubles.mjs"
import { RegionArray } from "../../../steam/region.mjs"

export default async function rublePricesButtonHandler(message) {
    await replyPrices(
        message, 
        appid => RegionArray.map(region => new PriceInRubles(appid, region))
    )
}