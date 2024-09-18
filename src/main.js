import bot from "./methods/connection";
import TgMethod from "./methods/tgMethod";
import ClientMethod from "./client/clientMethod";

import connection from "./db";
require('dotenv').config();

const tgMethod = new TgMethod();
const clientMethod = new ClientMethod();
const usersWithMenu = [Number(process.env.ADMIN)];


connection.run('CREATE TABLE IF NOT EXISTS CLIENT (ID SERIAL PRIMARY KEY, TG_TOPIC_ID TEXT, TG_CLIENT_ID TEXT)');

bot.on("polling_error", err => console.log(err.data.error.message));
const commands = [
    {
        command: "start",
        description: "Запустить чат"
    },
    {

        command: "help",
        description: "Как пользоваться чатом?"

    },
]

bot.setMyCommands(commands);

bot.on('message', async msg => {
    try {
        const chatId = msg.chat.id;
        let text = msg.text;
        const adminChat = usersWithMenu[0];
        const client = await clientMethod.searchClientByTgId(chatId);

        console.log(client)

        if(client) {
            if (text === '/start') {
                await tgMethod.sendMessageWithRetry(chatId, `Привет! 👋 \nЯ бот технической поддержки ONVI. Все, что вы напишите, будет направлена нашим администраторам и рассмотрена в ближайшее время. Чем могу помочь? 😊`);
            } else if (text === '/help') {
                await tgMethod.sendMessageWithRetry(chatId, 'Просто напишите свой вопрос или опишите проблему с которой столкнулись. Наши администраторы рассмотрят ваш запрос и ответят вам в ближайшее время💪');

            } else if (msg.photo && msg.photo.length > 0) {
                if (msg.caption !== undefined) {
                    text = msg.caption;
                } else {
                    text = 'Добавлено только фото.';
                }
                await tgMethod.sendMediaTopic(adminChat, client.TG_TOPIC_ID, msg.photo[msg.photo.length - 1].file_id, 'photo', text)

            } else if (msg.document) {
                if (msg.caption !== undefined) {
                    text = msg.caption;
                } else {
                    text = 'Добавлен только документ.';
                }
                await tgMethod.sendMediaTopic(adminChat, client.TG_TOPIC_ID, msg.document.file_id, 'doc', text)

            } else if (msg.video) {
                if (msg.caption !== undefined) {
                    text = msg.caption;
                } else {
                    text = 'Добавлено только видео.';
                }
                await tgMethod.sendMediaTopic(adminChat, client.TG_TOPIC_ID, msg.video.file_id, 'video', text)

            } else if (msg.sticker) {
                await tgMethod.sendMediaTopic(adminChat, client.TG_TOPIC_ID, msg.sticker.file_id, 'sticker')

            } else if (msg.video_note || msg.voice) {
                await tgMethod.sendMessageWithRetry(chatId, 'Я так не понимаю');

            } else {

                await tgMethod.sendMessageTopicWithRetry(adminChat, text, client.TG_TOPIC_ID);
            }




        } else if(adminChat === chatId) {
            const clientByTopic = await clientMethod.searchClientByTopicId(msg.message_thread_id);

            if (msg.photo && msg.photo.length > 0) {
                if (msg.caption !== undefined) {
                    text = msg.caption;
                } else {
                    text = 'Добавлено только фото.';
                }
                await tgMethod.sendMedia(clientByTopic.TG_CLIENT_ID, msg.photo[msg.photo.length - 1].file_id, 'photo', text)

            } else if (msg.document) {
                if (msg.caption !== undefined) {
                    text = msg.caption;
                } else {
                    text = 'Добавлен только документ.';
                }
                await tgMethod.sendMedia(clientByTopic.TG_CLIENT_ID, msg.document.file_id, 'doc', text)

            } else if (msg.video) {
                if (msg.caption !== undefined) {
                    text = msg.caption;
                } else {
                    text = 'Добавлено только видео.';
                }
                await tgMethod.sendMedia(clientByTopic.TG_CLIENT_ID, msg.video.file_id, 'video', text)

            } else if (msg.sticker) {
                await tgMethod.sendMedia(clientByTopic.TG_CLIENT_ID, msg.sticker.file_id, 'sticker')

            } else if (msg.video_note || msg.voice) {
                await tgMethod.sendMessageTopicWithRetry(adminChat, 'Я так не понимаю', msg.message_thread_id);

            } else {

                await tgMethod.sendMessageWithRetry(clientByTopic.TG_CLIENT_ID, text);
            }



        } else {
            const topicId = await tgMethod.createTopic(msg.from.first_name);
            await clientMethod.addClient(topicId, chatId);
        }
    } catch(error) {
        console.log(error);
    }
})