import mongoose from 'mongoose';

const users = mongoose.Schema({
    username: String,
    sendedPacks: Number,
});

mongoose.model('users', users);
