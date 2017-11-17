import {
    addStickerpack,
    setupConnection,
    stickerpackList,
} from './dataBaseUtils';

const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

setupConnection();

const userIsAdmin = (user, chat) => {
    bot.getChatAdministrators(chat.id).then(response => {
        if (response) return response.some(el => el.user.id === user.id);
        else return false;
    });
};

bot.on('message', msg => {
    const chatId = msg.chat.id;
    if (!msg.sticker && !msg.text) {
        bot.deleteMessage(msg.chat.id, msg.message_id);
    }
});

bot.on('text', msg => {
    const chatId = msg.chat.id;
    if (userIsAdmin(msg.from, msg.chat)) {
        bot.deleteMessage(msg.chat.id, msg.message_id);
    }
});

bot.on('sticker', msg => {
    const chatId = msg.chat.id;
    if (
        addStickerpack({
            name: msg.sticker.set_name,
            author: msg.from.username,
        })
    )
        bot.sendMessage(chatId, 'принято');
    else bot.sendMessage(chatId, 'уже было');
});
