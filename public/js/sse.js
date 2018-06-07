/**
 * @file sse.js
 * @author zhouhongxuan (zhouhongxuan@baidu.com)
 * @description
 * File Created 2018-06-02 12:26:22, Saturday
 * -----
 * Last Modified 2018-06-02 12:26:22, Saturday
 * Modified By zhouhongxuan (zhouhongxuan@baidu.com>)
 * -----
*/

(function () {
    var insertMsg = window.utils.insertMsg;

    var source = new EventSource('/sse');

    source.addEventListener('open', function (e) {
        console.log('open sse');
        console.log(e);
    }, false);

    source.addEventListener('my_msg', function (e) {
        var data = JSON.parse(e.data);
        var msg = data.st + ' : ' + decodeURIComponent(data.msg);
        insertMsg('js-sse-list', msg);
    }, false);

    source.addEventListener('error', function (e) {
        console.log('error');
        console.log(e);
    });
})();