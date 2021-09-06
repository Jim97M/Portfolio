'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var _require = require("./controller/mail"),
    sendMail = _require.sendMail;

router.post('/sendmail', sendMail);

module.exports = router;