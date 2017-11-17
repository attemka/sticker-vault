'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stikerpack = _mongoose2.default.Schema({
    name: String,
    sender: String,
    sendCount: Number
});

_mongoose2.default.model('stickerpack', stikerpack);
//# sourceMappingURL=stickerpack.js.map