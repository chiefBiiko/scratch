const fs = require('fs')
const http = require('http')
const path = require('path')
const pump = require('pump')
const url = require('url')

const host = process.argv[3] || '127.0.0.1'
const port = /^\d+$/.test(process.argv[4]) ? Number(process.argv[4]) : 50000
const httpserver = new http.Server()
var stepper = 0  // session identification

// helpers
function makeCookieExpiry(lifetime) {  // lifetime in minutes
  return new Date(new Date().getTime() + lifetime * 60000).toUTCString()
}
function parseCookies(cookies) {
  const list = {}
  if (typeof(cookies) === 'string') {
    cookies.split(';').forEach(cookie => {
      const parts = cookie.split('=')
      list[parts.shift().trim()] = decodeURI(parts.join('='))
    })
  }
  return list
}

// httpserver handlers
function httpServerInitHandler() {
  console.log(`[httpserver listening on port ${port}]`)
}
function httpServerErrHandler(err) {
  console.error(`[httpserver error:\n${err}\n]`)
}
function httpClientErrHandler(err, tcpsocket) {
  console.error(`[httpclient error:\n${err}\n]`)
  tcpsocket.end('HTTP/1.1 400 Bad Request\r\n\r\n').destroy()
}
function httpReqHandler(req, res) {
  const cookies = parseCookies(req.headers.cookie)
  const htmlStream = fs.createReadStream(path.join(__dirname, 'chatbot.html'))
  if (url.parse(req.url).pathname === '/favicon.ico') {
    res.end()
    return
  }
  if (!cookies.session) {
    res.setHeader('Set-Cookie', `session=${++stepper}; ` +
                  `expires=${makeCookieExpiry(10)}`)
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  pump(htmlStream, res, err => {
    if (err) console.error(`[httpserver html pump error:\n${err}\n]`)
  })
  console.log(`[http serving to: ${req.headers.host}]`)
}

httpserver.on('error', httpServerErrHandler)
httpserver.on('clientError', httpClientErrHandler)
httpserver.on('request', httpReqHandler)
httpserver.listen(port, host, httpServerInitHandler)
