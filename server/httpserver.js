const fs = require('fs')
const http = require('http')
const pump = require('pump')

const host = process.argv[3] || '127.0.0.1'
const port = /^\d+$/.test(process.argv[4]) ? Number(process.argv[4]) : 50000
var stepper = 0

// helpers
function cookieExpiry(lifetime) {  // lifetime in minutes
  return new Date(new Date().getTime() + lifetime * 60000).toUTCString()
}
function parseCookies(cookies) {
  const list = {}
  if (cookies) {
    cookies.split(';').forEach(cookie => {
      const parts = cookie.split('=')
      list[parts.shift().trim()] = decodeURI(parts.join('='))
    })
  }
  return list
}

// httpserver connection handler
function httpServerConHandler(req, res) {
  const cookies = parseCookies(req.headers.cookie)
  const readStream = fs.createReadStream('./chatbot.html')
  if (!cookies.session) {
    res.setHeader('Set-Cookie', `session=${++stepper}; ` +
                  `expires=${cookieExpiry(10)}`)
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  pump(readStream, res, err => {
    if (err) console.error(`[httpserver error:\n${err}\n]`)
  })
  console.log(`[http serving to: ${req.headers.host}]`)
}

http.createServer(httpServerConHandler).listen(port, () => {
  console.log(`[httpserver listening on port ${port}]`)
})
