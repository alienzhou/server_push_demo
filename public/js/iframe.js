/**
 * @file iframe.js
 * @author zhouhongxuan (zhouhongxuan@baidu.com)
 * @description
 * File Created 2018-06-03 11:16:28, Sunday
 * -----
 * Last Modified 2018-06-03 11:16:28, Sunday
 * Modified By zhouhongxuan (zhouhongxuan@baidu.com>)
 * -----
*/

function showMsg(data) {
    var insertMsg = window.utils.insertMsg;
    var msg = data.st + ' : ' + decodeURIComponent(data.msg);
    insertMsg('js-iframe-list', msg);
}

var iframe = document.createElement('iframe');
iframe.style = 'display: none';
iframe.src = '/long_iframe';
document.body.appendChild(iframe);