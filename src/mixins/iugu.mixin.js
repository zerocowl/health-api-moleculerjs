module.exports = {
  started() {
    const API_PASSWORD = process.env.IUGU_PASSWORD;
    const API_TOKEN = process.env.IUGU_API_TOKEN;
    const API_KEY = Buffer.from(`${API_TOKEN}:${API_PASSWORD}`).toString('base64');
    this.accountId = process.env.IUGU_ACCOUNT_ID;
    this.baseURL = 'https://api.iugu.com';
    this.requestOptions = {
      headers: {
        Authorization: `Basic ${API_KEY}`
      }
    };
  }
};
