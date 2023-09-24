const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '6333179341:AAGDuXJXNCdCs-Teol4IUutsc6KGRV9C1Fk';
const webAppUrl = 'https://jovial-crumble-d429d8.netlify.app'

const bot = new TelegramBot(token, { polling: true });
const app = express()

app.use(express.json())
app.use(cors())

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

        await bot.sendMessage(chatId, 'наш магазин', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Сделать заказ', web_app: { url: webAppUrl } }]
                ]
            }
        })
    }

    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            console.log(data)
            await bot.sendMessage(chatId, 'Спасибо за покупку!')
            await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country)
            await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street)

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'В ближайшее время с вами свяжется наш менеджер')
            }, 3000)
        } catch (e) {
            console.log(e)
        }
    } else {

    }
});

app.post('/web-data', async (req, res) => {
    const { queryId, products, totalPrice } = req.body
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: { message_text: 'Поздравляем с покупкой, вы приобрели товар на сумму ' + totalPrice }
        })
        return res.status(200).json({})

    } catch (e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Не удалось приобрести товар',
            input_message_content: { message_text: 'Не удалось приобрести товар' }
        })
        return res.status(500).json({})

    }
})

const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))