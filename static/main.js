"use strict";
function rndint(t, n) {
    return Math.floor(t + (n - t + 1) * Math.random())
}
function rndfloat(t, n) {
    return t + (n - t) * Math.random()
}
function getGET() {
    var t = location.hash.toString();
    if (!t)
        return {};
    if (t = t.substring(1), !t)
        return {};
    var n = t.split("&"),
        e = {};
    for (var i in n) {
        var r = n[i].split("=");
        e[r[0]] = decodeURI(r[1])
    }
    return e
}
function DOM_p() {
    var t = document.createElement("p");
    return t
}
function DOM_i(t, n) {
    var e = document.createElement("i");
    switch (e.style.display = "inline-block", e.style.opacity = 0, e.style.transform = "\n        translate(" + rndint(-500, 500) + "%," + rndint(-500, 500) + "%)\n        scale(" + rndfloat(0, 2) + ")\n        rotate3d(" + Math.random() + ", " + Math.random() + ", " + Math.random() + ", " + rndint(-180, 180) + "deg)\n    ", e.innerText = t, n) {
    case "fast":
        e.style.transition = rndint(400, 600) + "ms " + rndint(0, 150) + "ms";
        break;
    case "normal":
    default:
        e.style.transition = rndint(1e3, 2e3) + "ms " + rndint(0, 300) + "ms";
        break;
    case "slow":
        e.style.transition = rndint(2e3, 4e3) + "ms " + rndint(0, 500) + "ms"
    }
    return e
}
function animate() {
    p_now != -1 && ps[p_now].map(function(t) {
        t.style.transform = "\n                translate(" + rndint(-500, 500) + "%," + rndint(-500, 500) + "%)\n                scale(" + rndfloat(0, 2) + ")\n                rotate3d(" + Math.random() + ", " + Math.random() + ", " + Math.random() + ", " + rndint(-180, 180) + "deg)\n            ", t.style.opacity = 0
    });
    do ++p_now >= ps.length && (p_now = 0);
    while (!ps[p_now]);
    ps[p_now].map(function(t) {
        t.style.opacity = 1, t.style.transform = "none"
    }), document.body.style.backgroundColor = "hsl(" + rndint(0, 359) + ",40%,40%)";
    var t = settings["time" + p_now] || settings.time;
    setTimeout(animate, t)
}
var GET = getGET(),
    ps = [],
    settings = {
        time: 5e3,
        size: 4,
        speed: "normal"
    };
var dates = new Date();
var now = dates.toLocaleString();//2018/
var hello = now.substring(0,10);

for (var key in GET)
    parseInt(key) == key ? ps[key] = GET[key] : settings[key] = GET[key];
ps.length || (ps = [hello+'我们在此相遇'+'>.<', "很开心 遇见您"], settings.size = 3);
var DOM_stage = document.getElementById("stage"),
    body_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    body_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
ps = ps.map(function(t, n) {
    var e = DOM_p(),
        i = t.split("");
    return i = i.map(function(t) {
        var i = DOM_i(t, settings.speed),
            r = settings["size" + n] || settings.size;
        return i.style.fontSize = r + "rem", e.appendChild(i), i
    }), DOM_stage.appendChild(e), i
});
var p_now = -1;
animate(), document.title = "您好 朋友";

