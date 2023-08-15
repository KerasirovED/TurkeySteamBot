
export default async function replyError(reason, message) {
    console.error('Ooops! An error during Steam Info retrival occured!\n' + reason)
    await message.reply('Ууупс! Не смог достать данные из стима, сорян.')
}