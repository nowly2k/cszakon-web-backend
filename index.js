const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '6333179341:AAGDuXJXNCdCs-Teol4IUutsc6KGRV9C1Fk';
const webAppUrl = 'https://jovial-crumble-d429d8.netlify.app'

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    // Создаем клавиатуру для кнопки "Баланс"
    const keyboard = {
        inline_keyboard: [
            [{ text: 'Баланс', callback_data: 'balance' }],
            [{ text: 'Магазин', web_app: { url: webAppUrl } }],
        ],
    };

    // Отправляем сообщение с клавиатурой
    await bot.sendMessage(chatId, 'Приветствую тебя, друг! Я рада приветствовать тебя в нашем телеграм боте, который поможет тебе получить баллы за приглашение друзей в наш канал. Каждое новое приглашение позволит тебе заработать больше баллов, которые впоследствии можно будет обменять на скины ксго и товары нашего магазина. Не упусти свой шанс получить дополнительные бонусы и приглашай своих друзей в наш канал уже сегодня!', {
        reply_markup: keyboard,
    });
});

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === 'balance') {
        // Здесь вы должны получить баланс пользователя из вашей базы данных или другого источника данных
        const userBalance = 0; // Здесь предполагается, что баланс пользователя равен 100 (замените на реальное значение)

        // Отправляем баланс пользователю немедленно
        await bot.sendMessage(chatId, `Ваш текущий баланс: ${userBalance} баллов`);
    }
});

app.post('/web-data', async (req, res) => {
    const { queryId, products, totalPrice } = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: { message_text: `Поздравляем с покупкой, вы приобрели товар на сумму ${totalPrice}` },
        });
        return res.status(200).json({});
    } catch (e) {
        return res.status(500).json({});
    }
});

const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT));
