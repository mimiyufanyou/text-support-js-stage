const axios = require('axios')

const url = `https://api.sendblue.co/api/send-message`
const SEND_BLUE_API_KEY_ID = 'a4644ec3f8dcd68d2810d49b1af7448d';
const SEND_BLUE_API_SECRET_KEY = 'c2a8ce6b311f277ae3285971ebad6400';

axios
  .post(
    url,
    {
      number: '+16048189821',
      content: 'Hello world!',
      send_style: 'invisible',
      status_callback: 'https://example.com/message-status/1234abcd'
    },
    {
      headers: {
        'sb-api-key-id': SEND_BLUE_API_KEY_ID,
        'sb-api-secret-key': SEND_BLUE_API_SECRET_KEY,
        'content-type': 'application/json'
      }
    }
  )
  .then(response => {
    console.log(response.data)
  })
  .catch(error => {
    console.error(error)
  })