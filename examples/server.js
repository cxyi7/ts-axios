const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const cookieParser = require('cookie-parser')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const multipart = require('connect-multiparty')
const path = require('path')
const atob = require('atob')

require('./servers2')

const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler,{
    publicPath: '/__build__/',
    stats: {
        colors: true,
        chunks: false
    }
}))

app.use(webpackHotMiddleware(compiler))

// app.use(express.static(__dirname))
app.use(express.static(__dirname,{
    setHeaders(res) {
        res.cookie('XSRF-TOKEN-D','1234abc')
    }
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(multipart({
    uploadDir: path.resolve(__dirname, 'upload-file')
}))


const router = express.Router()
// simple
router.get('/simple/get',function (req,res) {
    res.json({
        msg: `hello world`
    })
})

// base
router.get('/base/get',function (req,res) {
    res.json(req.query)
})

router.post('/base/post',function (req,res) {
    res.json(req.body)
})

router.post('/base/buffer', function (req,res) {
    let msg = []
    req.on('data',(chunk) => {
       if (chunk) msg.push(chunk)
   })
    req.on('end',() => {
        let buf = Buffer.concat(msg)
        res.json(buf.toJSON())
   })
})

// error
router.get('/error/get', function (req, res) {
    if (Math.random() > 0.5) {
        res.json({
            msg: 'hello world'
        })
    } else {
        res.status(500)
        res.end()
    }
})

router.get('/error/timeout', function (req, res) {
    setTimeout(() => {
        res.json({
            msg: 'hello world'
        })
    }, 3000);
})

// extend
router.get('/extend/get', function (req,res) {
    res.json({
        msg: 'it is get'
    })
})
router.options('/extend/options',function (req,res) {
    res.json({
        msg: 'it is options'
    })
})

router.delete('/extend/delete',function (req,res) {
    res.json({
        msg: 'it is delete'
    })
})

router.head('/extend/head',function (req,res) {
    res.json({
        msg: 'it is head'
    })
})

router.get('/extend/get',function (req,res) {
    res.json({
        msg: 'it is get'
    })
})

router.post('/extend/post',function (req,res) {
    res.json(req.body)
})

router.put('/extend/put',function (req,res) {
    res.json(req.body)
})

router.patch('/extend/patch',function (req,res) {
    res.json(req.body)
})

router.get('/extend/user', function (req,res) {
    res.json({
        code: 200,
        message: 'ok',
        result: {
            name: 'hei',
            age: 20
        }
    })
})

// interceptor
router.get('/interceptor/get', function (req, res) {
    res.end('hello')
})

// config
router.post('/config/post', function(req, res) {
    res.json(req.body)
})

// cancel
router.get('/cancel/get', function (req, res) {
    setTimeout(() => {
        res.json('hello')
    }, 1000);
})

router.post('/cancel/post', function (req, res) {
    setTimeout(() => {
        res.json(req.body)
    }, 1000);
})

// more
router.get('/more/get', function(req, res) {
    res.json(req.cookies)
})

router.post('/more/upload', function (req, res) {
    res.end('upload success!!')
})

router.post('/more/post',function (req,res) {
    const auth = req.headers.authorization
    const [type,credentials] = auth.split(' ')
    console.log(req.headers.authorization, 'req.headers.authorization')
    const [username,password] = atob(credentials).split(':')
    if (type === 'Basic' && username === 'Yee' && password === '123456') {
        res.json(req.body)
    } else {
        res.status(401)
        res.end('UnAuthorization')
    }
})

router.get('/more/304', function (req, res) {
    res.status(304)
    res.end()
})

router.get('/more/A', function (req, res) {
    res.end('A')
})
router.get('/more/B', function (req, res) {
    res.end('B')
})
app.use(router)

const port = process.env.PORT || 8081
module.exports = app.listen(port,() => {
    console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
