const express = require('express');
const path = require('path');
const request = require('request');
const chalk = require('chalk');

const app = express();

//app dir setup
const app_dir = __dirname +"/STANDARD";

//static setup
app.use(express.static(app_dir + '/assets'));
app.use('/assets', express.static(app_dir + '/assets'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

//args support
let args = process.argv.slice(2);
if(!args.length) args = ['0'];

//configure url here
let proxyUrl = ""
let cleanProxyUrl = proxyUrl.replace(/\/$/, '');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api', function(req, res) {
    let origin = req.headers['access-control-allow-origin'];
    try {
        console.log(chalk.green('Request Proxied -> ' + req.baseUrl + req.url));
    } catch (e) {}
    req.pipe(
        request(cleanProxyUrl + req.baseUrl + req.url)
            .on('response', response => {
                // In order to avoid https://github.com/expressjs/cors/issues/134
                const accessControlAllowOriginHeader = response.headers['access-control-allow-origin'];
                if(accessControlAllowOriginHeader && accessControlAllowOriginHeader !== origin ){
                    console.log(chalk.blue('Override access-control-allow-origin header from proxified URL : ' + chalk.green(accessControlAllowOriginHeader) + '\n'));
                    // response.headers['access-control-allow-origin'] = origin;
                    response.headers['access-control-allow-origin'] = '*';
                }
            })
    ).pipe(res);
});
app.use('/storage', function(req, res) {
    let origin = req.headers['access-control-allow-origin'];
    try {
        console.log(chalk.green('Request Proxied -> ' + req.baseUrl + req.url));
    } catch (e) {}
    req.pipe(
        request(cleanProxyUrl + req.baseUrl + req.url)
            .on('response', response => {
                // In order to avoid https://github.com/expressjs/cors/issues/134
                const accessControlAllowOriginHeader = response.headers['access-control-allow-origin'];
                if(accessControlAllowOriginHeader && accessControlAllowOriginHeader !== origin ){
                    console.log(chalk.blue('Override access-control-allow-origin header from proxified URL : ' + chalk.green(accessControlAllowOriginHeader) + '\n'));
                    // response.headers['access-control-allow-origin'] = origin;
                    response.headers['access-control-allow-origin'] = '*';
                }
            })
    ).pipe(res);
});
app.use('/auth', function(req, res) {

    try {
        console.log(chalk.green('Request Proxied -> ' + req.baseUrl + req.url));
    } catch (e) {}
    req.pipe(
        request(cleanProxyUrl + req.baseUrl + req.url)
            .on('response', response => {
                // In order to avoid https://github.com/expressjs/cors/issues/134
                const accessControlAllowOriginHeader = response.headers['access-control-allow-origin']
                if(accessControlAllowOriginHeader && accessControlAllowOriginHeader !== origin ){
                    console.log(chalk.blue('Override access-control-allow-origin header from proxified URL : ' + chalk.green(accessControlAllowOriginHeader) + '\n'));
                    response.headers['access-control-allow-origin'] = origin;
                }
            })
    ).pipe(res);
});


app.get('/', function (req, res) {
    // res.sendFile(app_dir + '/index.html');
    res.sendFile(path.resolve(app_dir + '/index.html'));
});

app.listen(8070, "127.0.0.1", function (res, req, next) {
    // app.listen(8070, "172.16.100.64", function (res, req, next) {
    console.log('dev server init');
});
