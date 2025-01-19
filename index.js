const nodemailer = require('nodemailer');
const nunjucks = require('nunjucks');

module.exports = {
  hooks: {
    async postSave(comment, parent) {
      const { 
        SMTP_HOST,
        SMTP_PORT,
        SMTP_SECURE,
        SMTP_USER,
        SMTP_PASS,
        MAIL_FROM,
        MAIL_TO,
        SITE_NAME,
        SITE_URL,
        MAIL_TEMPLATE,
      } = process.env;

      if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_TO) {
        console.log('Missing email configuration');
        return false;
      }

      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT || '587'),
        secure: SMTP_SECURE === 'true',
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      comment.comment = comment.comment.replace(/(<([^>]+)>)/gi, '');

      const data = {
        self: comment,
        parent,
        site: {
          name: SITE_NAME,
          url: SITE_URL,
          postUrl: SITE_URL + comment.url + '#' + comment.objectId,
        },
      };

      const template = MAIL_TEMPLATE || `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2>{{site.name|safe}} - 新评论通知</h2>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>昵称：</strong>{{self.nick}}</p>
          <p><strong>邮箱：</strong>{{self.mail}}</p>
          <p><strong>内容：</strong></p>
          <p style="background: #fff; padding: 10px; border-radius: 3px;">{{self.comment}}</p>
          {% if parent %}
          <p><strong>回复评论：</strong></p>
          <p style="background: #fff; padding: 10px; border-radius: 3px;">{{parent.comment}}</p>
          {% endif %}
        </div>
        <p>
          <a href="{{site.postUrl}}" style="background: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            查看评论
          </a>
        </p>
      </div>`;

      const htmlContent = nunjucks.renderString(template, data);

      const textTemplate = `{{site.name|safe}} - 新评论通知
昵称：{{self.nick}}
邮箱：{{self.mail}}
内容：{{self.comment}}
{% if parent %}
回复评论：{{parent.comment}}
{% endif %}
查看链接：{{site.postUrl}}`;

      const textContent = nunjucks.renderString(textTemplate, data);

      const mailOptions = {
        from: MAIL_FROM || SMTP_USER,
        to: MAIL_TO,
        subject: `${SITE_NAME || '网站'} - 新评论通知`,
        text: textContent,
        html: htmlContent,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email notification SUCCESS:', info.messageId);
      } catch (error) {
        console.error('Send email notification ERROR:', error);
      }
    },
  },
};