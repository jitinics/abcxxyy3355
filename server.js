var express = require('express')
var bodyParser = require('body-parser')

var app = express()

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json 
app.use(bodyParser.json())

var port = 8000
var request = require('request')

app.get('/webhook', function (req, res) {
  console.log(req.query['hub.verify_token'])
  if (req.query['hub.verify_token'] === 'test123') {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Error, wrong validation token')
  }
})
app.post('/webhook', function (req, res) {
  var body = req.body
  console.log(JSON.stringify(req.body))
  res.send('a')
  sendTextMessage(req.body.entry[0].messaging[0].sender.id, 'kub')
})

var token = 'CAAG4ZCpU9FlABAHLTZAxFwUtTjpJBc3A99oigUL5oyvQ3ZBa4sHbwU1ZBP0HcmdKM24nxStuvwl3KCCzPrtWhZCwHlRrfvky3nwX3Dn9EBg022GMYODlk8mkTPFJS7BZCiQVlZAztcjkSl2SK4YLrQPR5vA3sDZBgUMpSQHMWR4ZB9vIHR9zB3pA42bBiSAXZBwi39wTHZCX08xjgZDZD'

function sendTextMessage (sender, text) {
  var messageData = {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'generic',
        'elements': [{
          'title': 'First card',
          'subtitle': 'Element #1 of an hscroll',
          'image_url': 'http://messengerdemo.parseapp.com/img/rift.png',
          'buttons': [{
            'type': 'web_url',
            'url': 'https://www.messenger.com/',
            'title': 'Web url'
          }, {
            'type': 'postback',
            'title': 'Postback',
            'payload': 'http://messengerdemo.parseapp.com/img/rift.png'
          }]
        }, {
          'title': 'Second card',
          'subtitle': 'Element #2 of an hscroll',
          'image_url': 'http://messengerdemo.parseapp.com/img/gearvr.png',
          'buttons': [{
            'type': 'postback',
            'title': 'Postback',
            'payload': 'Payload for second element in a generic bubble'
          }]
        }]
      }
    }
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: token},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: messageData
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

app.listen(process.env.PORT || port, function () {
  console.log(' app listening on port %d!', port)
})
