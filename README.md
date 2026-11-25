# waline-notification-slack-app

A [**Waline**](https://waline.js.org/) plugin that provide **email** notification spport.

[中文文档](./README_CN.md) | English Doc

## How to install
```shell
npm install waline-notification-email
```

## How to use

Edit your Waline File:

index.js
```js
const Application = require('@waline/vercel');
const Email = require('waline-notification-email');

module.exports = Application({
  plugins: [Email],
  async postSave(comment) {
    // do what ever you want after comment saved
  },
});
```

### package.json
Add `"waline-notification-email": "latest"` into package.json dependencies.


## Environment Variables

| ENV name      | Mandatory | Default value | comments |
| :------------ | :--: | :--------------------------------------- | :--------------------------------- |
| SMTP_HOST     |  Y  |                                          | SMTP Host                           |
| SMTP_PORT     |  N  | `587`                                    | SMTP Port                           |
| SMTP_SECURE   |  N  | `true`                                   | Use SSL/TLS?                            |
| SMTP_USER     |  Y  |                                          | SMTP User                           |
| SMTP_PASS     |  Y  |                                          | Password of SMTP user               |
| MAIL_FROM     |  N  | Default use the value of`SMTP_USER`      | Display of `from` in the mail       |
| MAIL_TO       |  Y  |                                          | An email address, where the nitification send to. |
| SITE_NAME     |  Y  |                                          | Your site name, used for display in notification message. |
| SITE_URL      |  Y  |                                          | Your site URL, used for display in notification message. |
| MAIL_TEMPLATE |  N  | 详见 [默认模板](./README.md#default-template) | Your custom notification template, please refer [this document](https://waline.js.org/en/guide/features/notification.html#notification-template). |

### Default template

The default template is as below:

```html
<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
  <h2>{{site.name|safe}} - 新评论通知</h2>
  <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p><strong>昵称：</strong>{{self.nick}}</p>
    <p><strong>邮箱：</strong>{{self.mail}}</p>
    <p><strong>内容：</strong></p>
    <p style="background: #fff; padding: 10px; border-radius: 3px;">
      {{self.comment}}
    </p>
    {% if parent %}
    <p><strong>回复评论：</strong></p>
    <p style="background: #fff; padding: 10px; border-radius: 3px;">
      {{parent.comment}}
    </p>
    {% endif %}
  </div>
  <p>
    <a href="{{site.postUrl}}" style="background: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      查看评论
    </a>
  </p>
</div>
```


You need **REDEPLOY** after change environment variables.
