'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OnServerStart = undefined;

var _nodeNotifier = require('node-notifier');

var _nodeNotifier2 = _interopRequireDefault(_nodeNotifier);

var _opn = require('opn');

var _opn2 = _interopRequireDefault(_opn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const OnServerStart = exports.OnServerStart = (img, port) => {
    if (process.env.NODE_ENV === 'development') {
        _nodeNotifier2.default.notify({
            title: 'Dev Server Started!',
            message: 'Click To Open GraphiQL in Browser',
            contentImage: img,
            icon: true,
            sound: false,
            wait: false,
            timeout: 5,
            actions: 'Open',
            closeLabel: 'Close'
        });

        _nodeNotifier2.default.on('click', (notifierObject, options) => {
            (0, _opn2.default)(`http://localhost:${port}/graphql`);
        });
    }
};

exports.default = OnServerStart;