'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var users = _mongoose2.default.Schema({
    username: String,
    sendedPacks: Number
});

_mongoose2.default.model('users', users);
//# sourceMappingURL=users.js.map