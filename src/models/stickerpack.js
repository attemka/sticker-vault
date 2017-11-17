import mongoose from 'mongoose';

const stikerpack = mongoose.Schema({
    name: String,
    sender: String,
    sendCount: Number,
});

mongoose.model('stickerpack', stikerpack);
