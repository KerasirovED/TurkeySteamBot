
import replyPrices from "./reply-prices.mjs"
import PriceInRubles from "../../../steam/price-in-rubles.mjs"
import PriceInRublesWithCommission from "../../../steam/price-in-rubles-with-commission.mjs"
import Region from "../../../steam/region.mjs"

export default async function rublePricesWithCommissionButtonHandler(message) {
    await replyPrices(message, appid => [
        new PriceInRubles(appid, Region.Europe),
        new PriceInRubles(appid, Region.USA),
        new PriceInRublesWithCommission(appid, Region.Turkey, 0.092),
        new PriceInRubles(appid, Region.Kazakhstan),
        new PriceInRublesWithCommission(appid, Region.Russia, 0.17)
    ])
}