> some samples abount server push tech
> e.g. Polling, COMET, SSE, WebSocket

![sample](./sample.gif)

# How to start?

Firstly,

```
cd server

npm i 

npm start
```

Then visit http://127.0.0.1:8080/ & http://127.0.0.1:8080/post in your browser

- On http://127.0.0.1:8080/post you can post some messages.
- Then on http://127.0.0.1:8080/ you will recieve these messages posted just now.

😊 😊

# How it works?

These technologies include:

- [Ajax Polling](https://medium.com/system-design-blog/long-polling-vs-websockets-vs-server-sent-events-c43ba96df7c1#717e)
- [COMET](https://en.wikipedia.org/wiki/Comet_(programming))
    - HTTP long polling
    - iframe
- [SSE (Server-Sent Events)](https://www.w3.org/TR/2015/REC-eventsource-20150203/)
- [WebSocket](https://developer.mozilla.org/en-US/docs/Glossary/WebSockets)


And this is [a brief introduction of these server-side-push technologies (in Chinese).](https://juejin.im/post/5b135b78f265da6e420eab7d)