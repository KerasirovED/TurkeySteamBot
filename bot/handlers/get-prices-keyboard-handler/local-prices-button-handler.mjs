
import processButtonClick from "./process-button-click.mjs"
import Price from "../../../steam/Price.mjs"
import Region from "../../../steam/region.mjs"

export default async function localPricesButtonHandler(message) {
    await processButtonClick(message, appid => [
        new Price(appid, Region.Europe),
        new Price(appid, Region.Turkey),
        new Price(appid, Region.Kazakhstan),
        new Price(appid, Region.Russia)
    ])
}