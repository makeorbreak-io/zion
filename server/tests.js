//2017-09-09T23:49:49.000Z

var p1 = (new Date(Date.parse("2017-09-09T02:11:49.000Z")).getTime() / 1000);
var p2 = (new Date().getTime() / 1000);


console.log(p1);
console.log(p2);
var duration = p2 - p1;
console.log(duration);