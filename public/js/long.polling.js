/**
 * @file long.polling.js
 * @author zhouhongxuan (zhouhongxuan@baidu.com)
 * @description
 * File Created 2018-06-02 10:18:39, Saturday
 * -----
 * Last Modified 2018-06-02 10:18:39, Saturday
 * Modified By zhouhongxuan (zhouhongxuan@baidu.com>)
 * -----
*/

(function () {
    var tinyevent = window.utils.tinyevent;
    var insertMsg = window.utils.insertMsg;
    var fetchMsg = window.utils.fetchMsg;
    var MSG = 'msg';
    
    function longPolling() {

        function query() {
            fetchMsg('/longpolling')
                .then(function(data) {
                    tinyevent.trigger(MSG, {data, status: 0});
                })
                .catch(function (err) {
                    tinyevent.trigger(MSG, {data: err, status: -1});
                });
        }

        tinyevent.on(MSG, function (result) {
            console.log(result);
            if (result.status === 0) {
                var data = result.data;
                var msg = data.st + ' : ' + decodeURIComponent(data.msg);
                insertMsg('js-lp-list', msg);
            }

            query();
        });

        query();
    }

    longPolling();
})();