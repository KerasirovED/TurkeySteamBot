
import replyPrices from "./reply-prices.mjs"
import Price from "../../../steam/Price.mjs"
import { RegionArray } from "../../../steam/region.mjs"

export default async function localPricesButtonHandler(message) {
    await replyPrices(
        message, 
        appid => RegionArray.map(region => new Price(appid, region))
    )
}