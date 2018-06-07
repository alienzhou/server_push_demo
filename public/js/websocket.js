/**
 * @file message.js
 * @author zhouhongxuan (zhouhongxuan@baidu.com)
 * @description
 * File Created 2018-05-31 16:51:25, Thursday
 * -----
 * Last Modified 2018-05-31 16:52:58, Thursday
 * Modified By zhouhongxuan (zhouhongxuan@baidu.com>)
 * -----
*/

(function() {
    var insertMsg = window.utils.insertMsg;

    var ws = new WebSocket('ws://127.0.0.1:8080');

    ws.onopen = function () {
        console.log('open websocket');
    };

    ws.onmessage = function (e) {
        var data = JSON.parse(e.data);
        var msg = data.st + ' : ' + decodeURIComponent(data.msg);
        insertMsg('js-ws-list', msg);
    }
})();