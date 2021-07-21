'use strict'

const mailgun = require('mailgun-js')
const DOMAIN = process.env.MG_DOMAIN
const mg = mailgun({
  apiKey: process.env.MG_API_KEY,
  domain: DOMAIN,
})

module.exports = {
  sendMail: async (recipient, subject, text) => {
    const data = {
      from: 'Admin <admin@TeamUp.mailgun.org>',
      to: recipient,
      subject: subject,
      text: text,
    }
    mg.messages().send(data, (error, body) => {
      console.log(body)
    })
  },
}
