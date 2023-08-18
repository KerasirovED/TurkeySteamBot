
import replyCouldNot from "./reply-could-not.mjs"

const replyCouldNotWithReasonLogging = async (message, reason) => {
    console.error(reason)
    await replyCouldNot(message)
}

export default replyCouldNotWithReasonLogging