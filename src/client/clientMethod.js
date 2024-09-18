import bot from "../methods/connection";
import connection from "../db";
import moment from "moment-timezone";

class ClientMethod {
    //Поиск клиента по tg_id
    async searchClientByTgId(chatId){
        return new Promise( async (resolve) => {
            const sql = 'SELECT * FROM CLIENT WHERE TG_CLIENT_ID = ?';
            await connection.get(sql, [chatId], async (err, result) => {
                if (err) {
                    console.log(err);
                }else {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    //Поиск клиента по tg_id
    async searchClientByTopicId(topicId){
        return new Promise( async (resolve) => {
            const sql = 'SELECT * FROM CLIENT WHERE TG_TOPIC_ID = ?';
            await connection.get(sql, [topicId], async (err, result) => {
                if (err) {
                    console.log(err);
                }else {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    //Добавить клиента
    async addClient(topicId, chatId){
        const sql = 'INSERT INTO CLIENT (TG_TOPIC_ID, TG_CLIENT_ID) VALUES ($1, $2)';
        await connection.run(sql, [topicId, chatId], async (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}
export default ClientMethod;