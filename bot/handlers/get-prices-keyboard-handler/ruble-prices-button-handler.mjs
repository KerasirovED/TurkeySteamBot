
import processButtonClick from "./process-button-click.mjs"
import PriceInRubles from "../../../steam/price-in-rubles.mjs"
import Region from "../../../steam/region.mjs"

export default async function rublePricesButtonHandler(message) {
    await processButtonClick(message, appid => [
        new PriceInRubles(appid, Region.Europe),
        new PriceInRubles(appid, Region.Turkey),
        new PriceInRubles(appid, Region.Kazakhstan),
        new PriceInRubles(appid, Region.Russia)
    ])
}