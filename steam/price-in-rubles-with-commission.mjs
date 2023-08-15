
import PriceInRubles from "./price-in-rubles.mjs"

export default class PriceInRublesWithCommission extends PriceInRubles {
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