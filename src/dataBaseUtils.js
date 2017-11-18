import mongoose from 'mongoose';
import './models/stickerpack';
import './models/users';
const db = mongoose.connection;
const stickerpack = mongoose.model('stickerpack');
const users = mongoose.model('users');
db.on('error', console.error.bind(console, 'connection error:'));

export function setupConnection() {
    return mongoose.connect('mongodb://localhost:27017/BOT_DB');
}

export function stickerpackList() {
   return stickerpack.find();
}

export function addStickerpack(data) {
    //console.log(data);
   return stickerpack
        .findOneAndUpdate(
            { name: data.name },
            { $inc: { sendCount: 1 } },
            { returnNewDocument: true },
        )
        .then(result => {
            //console.log(result);
            if (!result) {
                const newStickerpack = new stickerpack({
                    name: data.name,
                    author: data.author,
                    sendCount: 1,
                });
                users
                    .findOneAndUpdate(
                        { username: data.author },
                        { $inc: { sendedPacks: 1 } },
                        { returnNewDocument: true },
                    )
                    .then(result => {
                        //console.log(result);
                        if (!result) {
                            const user = new users({
                                username: data.author,
                                sendedPacks: 1,
                            });
                            user.save();
                        }
                    });
                 return newStickerpack.save();
            } else{
                return 0;
            }
        });
}
