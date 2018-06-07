const fs = require('fs');
const http = require('http');
const EventEmitter = require('events');
const WebSocketServer = require('websocket').server;
const port = process.env.PORT || 8080;

const EVENT = new EventEmitter();
const MSG_POST = Symbol('msg_post');
const MSG_TO_SEND = []; // maintain msg for interval polling

const app = http.createServer((req, res) => {
    if (/^\/$/.test(req.url)) {
        req.url = '/index';
    }

    let path = req.url;

    /* process post message */
    if (/^\/post/.test(req.url) && req.method === 'POST') {
        let buffers = [];

        // listening on incoming data
        req.on('data', trunk => {
            buffers.push(trunk);  
        }).on('end', () => {
            let buffer = Buffer.concat(buffers).toString();
            let msg = buffer.split('=')[1];
            let data = {
                msg,
                st: (new Date()).toLocaleTimeString()
            };
    
            // emit msg_post event to trigger listener
            EVENT.emit(MSG_POST, data);

            // push data into array, wait for query
            MSG_TO_SEND.push(data);
    
            // response to client
            fs.createReadStream(`../public${path}.html`).pipe(res);
        });

        console.log(EVENT.listenerCount(MSG_POST));
        console.log(EVENT.listeners(MSG_POST));
    }
    /** **/

    /* interval polling */
    else if (/^\/interval_polling$/.test(path)) {
        let data = MSG_TO_SEND.splice(0);

        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify(data));
    }
    /** **/

    /* process long polling (iframe) */
    else if (/^\/long_iframe$/.test(path)) {
        const iframeSend = data => {
            let script = `<script type="text/javascript">
                            parent.showMsg(${JSON.stringify(data)})
                        </script>`;
            res.write(script);
        };

        res.setHeader('connection', 'keep-alive');
        res.setHeader('content-type', 'text/html; charset=utf-8');        

        EVENT.addListener(MSG_POST, iframeSend);

        req.socket.on('close', () => {
            console.log('iframe socket close');
            EVENT.removeListener(MSG_POST, iframeSend);
        });
    }
    /** **/

    /* process long polling (comet) */
    else if (/^\/longpolling$/.test(path)) {
        const longPollingSend = data => {
            res.end(JSON.stringify(data));
        };

        res.setHeader('connection', 'keep-alive');

        EVENT.once(MSG_POST, longPollingSend);

        req.socket.on('close', () => {
            console.log('long polling socket close');
            EVENT.removeListener(MSG_POST, longPollingSend);
        });
    }
    /** **/

    /* server sent event */
    else if (/^\/sse$/.test(path)) {
        const sseSend = data => {
            res.write('retry:10000\n');            
            res.write('event:my_msg\n');
            res.write(`data:${JSON.stringify(data)}\n\n`);
        };

        res.setHeader('content-type', 'text/event-stream');
        res.setHeader('cache-control', 'no-cache');
        res.setHeader('connection', 'keep-alive');
        res.statusCode = 200;

        res.write('retry:10000\n');
        res.write('event:my_msg\n\n');

        EVENT.addListener(MSG_POST, sseSend);

        req.socket.on('close', () => {
            console.log('sse socket close');
            EVENT.removeListener(MSG_POST, sseSend);
        });
    }
    /** **/

    /* static js resouce */
    else if (/public.*\.js/.test(path)) {
        res.setHeader('content-type', 'text/javascript; charset=utf-8');
        fs.createReadStream(`..${path}`).pipe(res);
    }
    /** **/

    /** static html resource **/
    else if (!/\./.test(path)) {
        fs.access(`../public${path}.html`, fs.constants.F_OK | fs.constants.R_OK,  err => {
            if (err) {
                res.statusCode = 404;
                res.end('404 not found');
                return;
            }
            fs.createReadStream(`../public${path}.html`).pipe(res);
        });
    }
    /** **/

    /** 404 **/
    else {
        res.statusCode = 404;
        res.end('404 not found');
    }
    /** **/

});

app.listen(port, () => console.log('listening on %s port', port));

app.on('connection', socket => {
    socket.on('close', () => {
        console.log('socket close');
    });
});

/* WebSocket */
const ws = new WebSocketServer({
    httpServer: app
});

ws.on('request', req => {
    let connection = req.accept(null, req.origin);

    let wsSend = data => {
        connection.send(JSON.stringify(data));
    };

    connection.on('message', msg => {
        console.log(msg);
    });
    connection.on('close', con => {
        console.log('websocket close');
        EVENT.removeListener(MSG_POST, wsSend);
    });

    EVENT.addListener(MSG_POST, wsSend);
});
/** **/