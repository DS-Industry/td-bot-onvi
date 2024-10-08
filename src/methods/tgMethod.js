import bot from "./connection";
const adminChat = Number(process.env.ADMIN);


class TgMethod {
    //Проверка строки на число
    isNumeric(str) {
        if (typeof str != "string") return false // Убедитесь, что передана строка
        return !isNaN(str) && !isNaN(parseFloat(str)) // Проверьте, является ли строка числом
    }

    //Отправка сообщений с options и повторная отправка при ошибке
    async sendMessageWithRetry(chatId, messageText, retryCount = 3) {
        const options = {
            parse_mode: "HTML"
        };
        try {
            await bot.sendMessage(chatId, messageText, options);
        } catch (err) {
            console.error('Ошибка при отправке сообщения:', err);
            // Повторяем попытку отправки, если не достигнуто максимальное количество попыток
            if (retryCount > 0) {
                console.log(`Повторная попытка отправки сообщения. Осталось попыток: ${retryCount}`);
                await this.sendMessageWithRetry(chatId, messageText, retryCount - 1);
            } else {
                console.error('Достигнуто максимальное количество попыток. Сообщение не было отправлено.');
            }
        }
    }

    //Отправка сообщений в topic с options и повторная отправка при ошибке
    async sendMessageTopicWithRetry(chatId, messageText, topicId, retryCount = 3) {
        const options = {
            parse_mode: "HTML"
        };
        try {
            console.log(topicId)
            await bot.sendMessage(chatId, messageText, topicId, options);
        } catch (err) {
            console.error('Ошибка при отправке сообщения:', err);
            // Повторяем попытку отправки, если не достигнуто максимальное количество попыток
            if (retryCount > 0) {
                console.log(`Повторная попытка отправки сообщения. Осталось попыток: ${retryCount}`);
                await this.sendMessageWithRetry(chatId, messageText, retryCount - 1);
            } else {
                console.error('Достигнуто максимальное количество попыток. Сообщение не было отправлено.');
            }
        }
    }

    //Создание чата с клиентом
    async createTopic(clientName) {
        const topic = await bot.createForumTopic(adminChat, 'Пользователь ' + clientName)
        return topic.message_thread_id;
    }

    //Отправка медиа
    async sendMedia(chatId, url, filling, text) {
        if(filling === 'photo') {
            await bot.sendPhoto(chatId, url, {caption: text});
            await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка в миллисекундах
        } else if(filling === 'doc') {
            await bot.sendDocument(chatId, url, {caption: text});
            await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка в миллисекундах
        } else if(filling === 'video') {
            await bot.sendVideo(chatId, url, {caption: text});
            await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка в миллисекундах
        } else if(filling === 'sticker') {
            await bot.sendSticker(chatId, url)
            await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка в миллисекундах
        }
    }

    //Отправка медиа в topic
    async sendMediaTopic(chatId, topicId, url, filling, text) {
        if(filling === 'photo') {
            console.log(topicId)
            await bot.sendPhoto(chatId, url, {caption: text}, topicId);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка в миллисекундах
        } else if(filling === 'doc') {
            await bot.sendDocument(chatId, url, {caption: text}, topicId);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка в миллисекундах
        } else if(filling === 'video') {
            await bot.sendVideo(chatId, url, {caption: text}, topicId);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка в миллисекундах
        } else if(filling === 'sticker') {
            await bot.sendSticker(chatId, url, topicId)
            await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка в миллисекундах
        }
    }

    //Преобразование даты
    async formatDate(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Плюс 1, так как месяцы начинаются с 0
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }

    //Задержка при отправки сообщений
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default TgMethod;