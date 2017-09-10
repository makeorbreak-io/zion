# zion

We built a virtual jukebox called **Jukebify** on top of the Spotify API - completly network-independent. 

With this app a venue (for example a bar) can let the customers decide what the songs playing are while profiting from it. Jukebify works like an auction: each customer that wants to choose the next song can place a bid on the current round (~120s) and, at the end of each round, the customer that has the highest bid is the one whose song gets played, his or her bid is added to the venue tab and each venue can know what a customer owes. The venue connects its spotify account and a custom playlist is created and managed for them.

Jukebify is comprised of an [Ionic2](http://ionic.io/2) + [Angular2](https://angular.io/) + [Cordova](https://cordova.apache.org/) cross-platform (Android, Ios, Web, Windows Phone) application, a [Node.js](https://nodejs.org/en/) server and a [mysql-server](https://www.mysql.com/). To ensure real-time communication between the components we used a [WebSocket Server](https://github.com/websockets/ws) and Client approach. We also make use of the [Spotify REST API](https://developer.spotify.com/web-api/) to allow users to interact with a familiar interface.  


---

The MIT License (MIT)

Copyright (c) 2013 Thomas Park

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
