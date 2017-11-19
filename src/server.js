import { addStickerpack, setupConnection, getTopStickerpacks, getTopUsers } from "./dataBaseUtils";

const TelegramBot = require("node-telegram-bot-api");
import * as Schedule from "node-schedule";

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });
let topShowed = false;
let queryInterval;
let messageQuery = [];
setupConnection();

const userIsAdmin = (user, chat) => {
  return bot.getChatAdministrators(chat.id).then(response => {
    if (response) return response.some(el => el.user.id === user.id);
    else return false;
  });
};

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

const displayTopStickerpacks = () => {
  return getTopStickerpacks().then(response => {
    let messageText = "Топ-10 популярных стикерпаков: \n";
    response.forEach((el, index) => {
      messageText += `${index + 1}: https://t.me/addstickers/${el.name} был прислан ${el.sendCount} раз \n`;
    });
    return messageText;
  });
};

const displayTopUsers = () => {
  getTopUsers().then(response => {
    let messageText = "Топ-10 популярных юзеров: \n";
    response.forEach((el, index) => {
      messageText += `${index + 1}: ${el.username} прислал ${el.sendedPacks} стикерпаков \n`;
    });
    return messageText;
  });
};

//displayTopStickerpacks();
displayTopUsers();

bot.on("message", msg => {
  const chatId = msg.chat.id;
  if (!msg.sticker && !msg.text) {
    bot.deleteMessage(msg.chat.id, msg.message_id);
  }
});

bot.onText(/\/showtop/, msg => {
  const chatId = msg.chat.id;
  if (topShowed) {
    bot
      .sendMessage(chatId, "Топ-10 уже просили в этом часу.", { reply_to_message_id: msg.message_id })
      .then(response => {
        setTimeout(() => {
          bot.deleteMessage(chatId, msg.message_id);
          bot.deleteMessage(response.chat.id, response.message_id);
        }, 5000);
      });
  } else {
    displayTopStickerpacks().then(response => {
      bot.sendMessage(chatId, response);
      topShowed = true;
    });
  }
});

bot.on("text", msg => {
  const chatId = msg.chat.id;
  if (!userIsAdmin(msg.from, msg.chat)) {
    bot.deleteMessage(msg.chat.id, msg.message_id);
  }
});

bot.on("sticker", msg => {
  messageQuery.push(msg);
  console.log(messageQuery.length);
  if (messageQuery.length === 1) queryInterval = setInterval(handleQuery, 3000);
});

const handleQuery = () => {
  const msg = messageQuery[0];
  const chatId = msg.chat.id;
  addStickerpack({
    name: msg.sticker.set_name,
    author: msg.from.username
  }).then(res => {
    if (res) {
      bot
        .sendMessage(chatId, "принято", {reply_to_message_id: msg.message_id})
        .then(response => setTimeout(() => bot.deleteMessage(response.chat.id, response.message_id), 5000));
    } else
      bot.sendMessage(chatId, "уже было", {reply_to_message_id: msg.message_id}).then(response => {
        setTimeout(() => {
          bot.deleteMessage(msg.chat.id, msg.message_id);
          bot.deleteMessage(response.chat.id, response.message_id);
        }, 5000);
      });
  });
  messageQuery = messageQuery.splice(1);
  if (!messageQuery.length) clearInterval(queryInterval);
};

Schedule.scheduleJob("00 * * * *", () => {
  console.log("top cleaned");
  topShowed = false;
});
