/**
 * @file polling
 * @author zhouhongxuan (zhouhongxuan@baidu.com)
 * @description
 * File Created 2018-06-02 11:43:43, Saturday
 * -----
 * Last Modified 2018-06-02 11:43:43, Saturday
 * Modified By zhouhongxuan (zhouhongxuan@baidu.com>)
 * -----
*/

(function () {
    var INTERVAL_TIME = 5000;
    var LOADED = 'loaded';
    var tinyevent = window.utils.tinyevent;
    var insertMsg = window.utils.insertMsg;
    var fetchMsg = window.utils.fetchMsg;

    function polling() {
        fetchMsg('/interval_polling', {timeout: 3000})
            .then(function (list) {
                list.forEach(function (ele) {
                    var msg = ele.st + ' : ' + decodeURIComponent(ele.msg);
                    insertMsg('js-polling-list', msg);
                });
                return;
            })
            .catch(function (err) {
                console.log(err);
                return;
            })
            .then(function () {
                setTimeout(function () {
                    tinyevent.trigger(LOADED);
                }, INTERVAL_TIME);
            });
    }

    function intervalPolling() {
        tinyevent.on(LOADED, function () {
            polling();
        });
        polling();
    }

    intervalPolling();

})();