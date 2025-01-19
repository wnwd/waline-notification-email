# waline-notification-email

中文文档 | [English Doc](./README.md)

一个[**Waline**](https://waline.js.org/)插件，提供 **email** 通知功能。

## 如何安装

```shell
npm install waline-notification-email
```

## 如何使用

编辑你的服务端 Waline 文件:

index.js

```js
const Application = require("@waline/vercel");
const Email = require("waline-notification-email");

module.exports = Application({
  plugins: [Email],
  async postSave(comment) {
    // do what ever you want after comment saved
  },
});
```

### package.json

把 `"waline-notification-email": "latest"` 添加到 package.json 依赖中。

## 环境变量

| 变量名         | 必须 | 默认值                                    | 说明                          |
| :------------ | :--: | :-------------------------------------- | :--------------------------- |
| SMTP_HOST     |  是  |                                          | SMTP 发送地址                 |
| SMTP_PORT     |  否  | `587`                                    | SMTP 发送端口                 |
| SMTP_SECURE   |  否  | `true`                                   | 是否使用SSL/TLS(true/false)   |
| SMTP_USER     |  是  |                                          | 发送邮件所使用的邮箱账户         |
| SMTP_PASS     |  是  |                                          | 发送邮件所使用的账户密码         |
| MAIL_FROM     |  否  | 默认使用`SMTP_USER`的值                    | 显示的发件人                   |
| MAIL_TO       |  是  |                                          | 通知邮件发送到哪                |
| SITE_NAME     |  是  |                                          | 你的站点名字，用来显示在通知消息中 |
| SITE_URL      |  是  |                                          | 你的站点名字，用来显示在通知消息中 |
| MAIL_TEMPLATE |  否  | 详见 [默认模板](./README_CN.md#默认模板)    | 自定义通知模板，发送消息使用      |

### 默认模板

默认的通知模板如下：

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

在修改环境变量后，你需要 **重新部署** Waline 服务端。
