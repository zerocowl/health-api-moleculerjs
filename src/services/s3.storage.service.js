const Joi = require('joi');
const { S3 } = require('aws-sdk');
const sharp = require('sharp');

module.exports = {
  name: 's3.storage',

  actions: {
    upload: {
      params: Joi.object().keys({
        base64String: Joi.string().required(),
        identifier: Joi.any()
      }),
      async handler(ctx) {
        const { base64String, identifier } = ctx.params;
        try {
          const base64Data = Buffer.from(
            base64String.replace(/^data:image\/\w+;base64,/, ''),
            'base64'
          );
          const type = base64String.split(';')[0].split('/')[1];
          let resizedImage = null;
          switch (type) {
            case 'jpeg': {
              resizedImage = await sharp(base64Data)
                .resize(200, 200)
                .jpeg({ quality: 80 })
                .toBuffer();
              break;
            }
            case 'png': {
              resizedImage = await sharp(base64Data)
                .resize(200, 200)
                .png({ compressionLevel: 8 })
                .toBuffer();
              break;
            }
          }
          const params = {
            Bucket: process.env.S3_BUCKET,
            Key: `avatar_${identifier}.${type}`,
            Body: resizedImage,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: `image/${type}`
          };
          const data = await this.s3.upload(params).promise();
          return data['Location'];
        } catch (err) {
          this.logger.error(err);
          throw err;
        }
      }
    }
  },

  started() {
    this.s3 = new S3({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    });
  }
};
