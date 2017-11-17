'use strict';

var _dataBaseUtils = require('./dataBaseUtils');

var TelegramBot = require('node-telegram-bot-api');

var token = process.env.BOT_TOKEN;

var bot = new TelegramBot(token, { polling: true });

(0, _dataBaseUtils.setupConnection)();

var userIsAdmin = function userIsAdmin(user, chat) {
    bot.getChatAdministrators(chat.id).then(function (response) {
        if (response) return response.some(function (el) {
            return el.user.id === user.id;
        });else return false;
    });
};

bot.on('message', function (msg) {
    var chatId = msg.chat.id;
    if (!msg.sticker && !msg.text) {
        bot.deleteMessage(msg.chat.id, msg.message_id);
    }
});

bot.on('text', function (msg) {
    var chatId = msg.chat.id;
    if (userIsAdmin(msg.from, msg.chat)) {
        bot.deleteMessage(msg.chat.id, msg.message_id);
    }
});

bot.on('sticker', function (msg) {
    var chatId = msg.chat.id;
    if ((0, _dataBaseUtils.addStickerpack)({
        name: msg.sticker.set_name,
        author: msg.from.username
    })) bot.sendMessage(chatId, 'принято');else bot.sendMessage(chatId, 'уже было');
});
//# sourceMappingURL=server.js.map