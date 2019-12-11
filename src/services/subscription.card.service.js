const { createCanvas, loadImage, registerFont } = require('canvas');
const { S3 } = require('aws-sdk');
const path = require('path');

module.exports = {
  name: 'subscription.card',

  actions: {
    fetchCardImage: {
      async handler(ctx) {
        const db = this.db;
        const { id } = ctx.params;
        const { user: authenticatedUser } = ctx.meta;
        const user = await db.User.findByPk(authenticatedUser.id, {
          include: [
            {
              as: 'accounts',
              model: db.Account,
              where: { id: id }
            }
          ]
        });
        if (!user) throw new Error('Conta não associada ao usuário em questão');
        const data = await db.SubscriptionAccount.findOne({
          where: {
            account_id: id
          },
          include: ['account', 'subscription']
        });
        if (data.uid_url) {
          return data.uid_url;
        } else {
          const path = await this.generateCardAsPNG({
            uid: data.subscription.uid,
            name: data.account.name,
            isHolder: data.as === 'holder',
            holderName: data.account.name,
            holderCPF: data.account.cpf
          });
          await data.update({ uid_url: path });
          return path;
        }
      }
    }
  },
  methods: {
    async generateCardAsPNG({ uid, name, holderName, holderCPF, isHolder }) {
      let image = await loadImage(path.join(__dirname, '../assets/images/card_front.png'));
      this.canvasCtx.drawImage(image, 0, 0, 1123, 756);
      this.canvasCtx.font = '68px MotivaSans-Thin';
      this.canvasCtx.fillStyle = '#fff';
      this.canvasCtx.fillText(uid.match(/.{1,4}/g).join('  '), 160, 380);
      this.canvasCtx.font = '48px MotivaSans-Bold';
      let [first, ...rest] = name
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ');
      let last = rest.pop();
      let fullName = [first, ...rest.map(n => n[0] + ''), last].join(' ');
      this.canvasCtx.fillText(fullName.toUpperCase(), 160, 475);
      this.canvasCtx.font = '24px MotivaSans-Thin';
      if (!isHolder) {
        this.canvasCtx.fillText('TITULAR', 160, 556);
      }
      this.canvasCtx.fillText('CPF', 612, 556);
      if (!isHolder) {
        this.canvasCtx.font = '24px MotivaSans-Bold';
        this.canvasCtx.fillText(holderName.toUpperCase(), 160, 592);
      }
      this.canvasCtx.font = '24px MotivaSans-Thin';
      this.canvasCtx.fillText(holderCPF, 612, 592);
      const stream = this.canvas.createPNGStream();
      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `card_${uid}.png`,
        Body: stream,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: `image/png`
      };
      const data = await this.s3.upload(params).promise();
      image = null;
      return data['Location'];
    }
  },

  started() {
    this.canvas = createCanvas(1123, 756);
    this.canvasCtx = this.canvas.getContext('2d');
    registerFont(path.join(__dirname, '../assets/fonts/MotivaSans-Regular.woff'), {
      family: 'MotivaSans-Regular'
    });
    registerFont(path.join(__dirname, '../assets/fonts/MotivaSans-SemiBold.woff'), {
      family: 'MotivaSans-Bold'
    });
    registerFont(path.join(__dirname, '../assets/fonts/MotivaSans-Thin.woff'), {
      family: 'MotivaSans-Thin'
    });
    this.db = require('../repository');
    this.s3 = new S3({
      accessKeyId: 'AKIAJS326JLTOYIY6LDQ',
      secretAccessKey: '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'
    });
  }
};
