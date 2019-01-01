const emailjs = require('emailjs')
const config = require('../config')
const server = emailjs.server.connect({
  user: config.email.user,
  password: config.email.password,
  host: config.email.host,
  ssl: true,
  timeout: 3000,
  port:465
})

exports.sendActiveEmail = user => {
  return new Promise((resolve, reject) => {
    server.send({
      from: `${config.site.name} <${config.email.user}>`,
      to: `${user.username} <${user.email}>`,
      subject: `【${config.site.name}】激活用户邮箱`,
      attachment: [{
        data: `
      <html>
        <head>
            <meta charset="UTF-8">
        </head>
        <body>
            <h3>【${config.site.name}】激活用户邮箱</h3>
            <strong> ${config.site.name} 感谢你的加入！请点击以下链接从而激活您的邮箱账户。</strong>
            <p>
              <a href="${config.site.url}active?v=${user.email_verify}">
                ${config.site.url}active?v=${user.email_verify}
              </a>
            </p>
            <p>如果这不是您的操作，请忽略此邮件</p>
        </body>
      </html>
    `, alternative: true
      }]
    }, (err, message) => {
      if (err) {
        return reject(new Error('发送邮件失败'))
      } else {
        return resolve(message)
      }
    })
  })
}