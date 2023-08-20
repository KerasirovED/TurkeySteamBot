
const dev = 'put your Telegram Token here'
const prod = 'put your Telegram Token here'

export const token = process.env.PROD === '1' ? prod : dev