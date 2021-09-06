const proxy = require("http-proxy-middleware");
export default function(app){
app.use(proxy("/mail/**", {
    target:"http://127.0.0.1/3001/",
    secure:false
}));

}