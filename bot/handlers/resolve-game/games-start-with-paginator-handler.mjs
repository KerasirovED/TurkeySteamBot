
import replyCouldNotWithReasonLogging from './../../replies/reply-could-not-with-reason-logging.mjs'
import getGamesStartWithPaginator from './get-games-start-with-paginator.mjs'
import splitDelimetedCallbackData from './../../../telegram/split-delimeted-callback-data.mjs'

export default async function (callback) {
    const handleError = reason => replyCouldNotWithReasonLogging(menubar, reason)

    const [_, currentPage, action, searchString] = splitDelimetedCallbackData(callback)

    await getGamesStartWithPaginator(searchString).then(async paginator => {
        await callback.message.editMarkup(paginator.getPageByAction(action, currentPage))
    }, handleError)
    .catch(handleError)
}