var css_cors = document.createElement("link");
css_cors.setAttribute("type", "text/css");
css_cors.setAttribute("rel", "stylesheet");
css_cors.setAttribute("href", "https://pm.pstatic.net/css/webfont_v170623.css");
var head = document.getElementsByTagName('head')[0];
head.insertBefore(css_cors, head.getElementsByTagName("title")[0]);
