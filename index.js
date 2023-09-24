const TelegramBot = require('node-telegram-bot-api');

const token = '6333179341:AAGDuXJXNCdCs-Teol4IUutsc6KGRV9C1Fk';
const webAppUrl = 'https://jovial-crumble-d429d8.netlify.app/'
const bot = new TelegramBot(token, { polling: true });


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        await bot.sendMessage(chatId, 'ниже появится кнопка заполни форму', {
            reply_markup: {
                keyboard: [
                    [{ text: 'Заполнить форму', web_app: { url: webAppUrl + '/form' } }]
                ]
            }
        })

        await bot.sendMessage(chatId, 'Магазин', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Сделать заказ', web_app: { url: webAppUrl } }]
                ]
            }
        })
    }
});