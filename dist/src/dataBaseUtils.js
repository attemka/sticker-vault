'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setupConnection = setupConnection;
exports.stickerpackList = stickerpackList;
exports.addStickerpack = addStickerpack;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

require('./models/stickerpack');

require('./models/users');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = _mongoose2.default.connection;
var stickerpack = _mongoose2.default.model('stickerpack');
var users = _mongoose2.default.model('users');
db.on('error', console.error.bind(console, 'connection error:'));

function setupConnection() {
    return _mongoose2.default.connect('mongodb://localhost:27017/BOT_DB');
}

function stickerpackList() {
    return stickerpack.find();
}

function addStickerpack(data) {
    //console.log(data);
    stickerpack.findOneAndUpdate({ name: data.name }, { $inc: { sendCount: 1 } }, { returnNewDocument: true }).then(function (result) {
        //console.log(result);
        if (!result) {
            var newStickerpack = new stickerpack({
                name: data.name,
                author: data.author,
                sendCount: 1
            });
            users.findOneAndUpdate({ username: data.author }, { $inc: { sendedPacks: 1 } }, { returnNewDocument: true }).then(function (result) {
                //console.log(result);
                if (!result) {
                    var user = new users({
                        username: data.author,
                        sendedPacks: 1
                    });
                    user.save();
                }
            });
            newStickerpack.save();
            return true;
        } else return false;
    });
}
//# sourceMappingURL=dataBaseUtils.js.map