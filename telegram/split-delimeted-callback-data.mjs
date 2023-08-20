
import { callbackDelimeter } from "./constants.mjs";

export default function (data) {
    const callback = data

    if (callback.data)
        data = callback.data

    return String(data).split(callbackDelimeter)
}