(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{20:function(e,t,n){e.exports=n(32)},25:function(e,t,n){},32:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(17),o=n.n(c),l=(n(25),n(8)),i=n.n(l),u=n(10),s=n(11),m=n(1),h=n(9),f=n(18),p=n.n(f)()(Plotly);function b(e){var t={x:[],y:[]};return Object.keys(e).forEach((function(n){var a=Number(n),r=new Date(a).toLocaleTimeString();t.x.push(r);var c=Number(e[n]);t.y.push(c)})),t}function E(e,t){return v.apply(this,arguments)}function v(){return(v=Object(u.a)(i.a.mark((function e(t,n){var a;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/graph/".concat(t)).then((function(e){return e.json()}));case 2:a=b(a=e.sent),n(a);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var y=function(){var e=Object(m.f)().graphName,t=Object(a.useState)({x:[],y:[]}),n=Object(s.a)(t,2),c=n[0],o=n[1];return Object(a.useEffect)((function(){E(e,o)}),[e]),r.a.createElement("div",{style:{height:"100vh"}},r.a.createElement("ul",null,r.a.createElement("li",{className:"btn-link"},r.a.createElement(h.b,{to:"/"},"back")),r.a.createElement("li",{className:"btn-link"},r.a.createElement(h.b,{onClick:function(){return E(e,o)},className:"btn-link"},"refresh"))),r.a.createElement(p,{data:[{x:c.x,y:c.y,type:"scatter",mode:"lines+markers",marker:{color:"red"}}],layout:{title:"Light Levels by Time (UTC)"},style:{width:"100%",height:"85%"}}))};var d=function(){var e=Object(a.useState)([]),t=Object(s.a)(e,2),n=t[0],c=t[1],o=function(){var e=Object(u.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/listdata").then((function(e){return e.json()}));case 2:t=e.sent,c(t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(a.useEffect)((function(){o()}),[]),r.a.createElement(h.a,null,r.a.createElement(m.c,null,r.a.createElement(m.a,{path:"/graph/:graphName",children:r.a.createElement(y,null)}),r.a.createElement(m.a,{path:"/"},r.a.createElement("ul",null,n.map((function(e,t){return r.a.createElement("li",{className:"btn-link"},r.a.createElement(h.b,{to:"/graph/".concat(e),key:t},e))}))))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(d,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[20,1,2]]]);
//# sourceMappingURL=main.d23fba97.chunk.js.map