const fs = require('fs')
const http = require('http')
const pump = require('pump')

const host = process.argv[3] || '127.0.0.1'
const port = /^\d+$/.test(process.argv[4]) ? Number(process.argv[4]) : 50000
var stepper = 0

const cookieLifeTime = () => {
  return new Date(new Date().getTime() + 86409000).toUTCString()
}
const parseCookies = cookies => {
  const list = {}
  if (cookies) {
    cookies.split(';').forEach(cookie => {
      const parts = cookie.split('=')
      list[parts.shift().trim()] = decodeURI(parts.join('='))
    })
  }
  return list
}

const httpserver = http.createServer((req, res) => {
  const cookies = parseCookies(req.headers.cookie)
  const readStream = fs.createReadStream('./chatbot.html')
  if (!cookies.session) {
    res.setHeader('Set-Cookie', `session=${++stepper}; ` +
                  `expires=${cookieLifeTime()}`)
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  pump(readStream, res, err => {
    if (err) console.error(`[httpserver error:\n${err}\n]`)
  })
  console.log(`[http serving to: ${req.headers.host}]`)
})

httpserver.listen(port, () => {
  console.log(`[httpserver listening on port ${port}]`)
})
