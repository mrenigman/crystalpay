const { default: axios } = require("axios");

const httpBuildQuery = require("http-build-query");

const express = require("express"),
  http = require("http");

const crypto = require("crypto");

class CrystalPAY {
  constructor(
    login,
    secret1,
    secret2,
    webhook = false,
    webhookParams = {
      port: 5000,
      host: "127.0.0.1",
      path: "/",
    }
  ) {
    this.login = login;
    this.secret1 = secret1;
    this.secret2 = secret2;
    this.server = null;
    if (webhook) {
      this.startWebhook(...Object.values(webhookParams));
    }
  }

  request(o, data = {}) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `https://api.crystalpay.ru/v1/?${httpBuildQuery({
            o,
            s: this.secret1,
            n: this.login,
            ...data,
          })}`
        )
        .then((response) => {
          if (response.data.auth == "error") return reject("auth");
          if (response.data.error) return reject(response.data.error_message);

          return resolve(response.data);
        })
        .catch((err) => reject(err));
    });
  }

  createReceipt(amount, m = null, redirect = null, callback = null) {
    return this.request("receipt-create", {
      amount,
      m,
      redirect,
      callback,
    });
  }

  checkReceipt(i) {
    return this.request("receipt-check", { i });
  }

  balance() {
    return this.request("balance");
  }

  withdraw(amount, wallet, currency) {
    return this.request("withdraw", {
      secret: this.secret2,
      amount,
      wallet,
      currency,
    });
  }

  p2pTransfer(login, amount, currency) {
    return this.request("p2p-transfer", {
      login,
      amount,
      currency,
      secret: this.secret2,
    });
  }

  createVoucher(amount, currency, comment = null) {
    return this.request("voucher-create", {
      amount,
      currency,
      comment,
      secret: this.secret2,
    });
  }

  voucherInfo(code) {
    return this.request("voucher-info", {
      code,
    });
  }

  activateVoucher(code) {
    return this.request("voucher-activate", {
      code,
    });
  }

  startWebhook(port, host, path, callback = console.log) {
    const app = express();
    app.get(path, (req, res) => {
      try {
        const { ID, CURRENCY, HASH } = req.query;
        if (!ID || !CURRENCY | !HASH) return res.sendStatus(200);
        var hash = crypto
          .createHash("sha1")
          .update(`${ID}:${CURRENCY}:${this.secret2}`)
          .digest("hex");
        if (hash != HASH) return res.sendStatus(200);
        callback(ID, CURRENCY, HASH);
        return res.sendStatus(200);
      } catch (err) {
        return res.sendStatus(500);
      }
    });
    this.server = http.createServer(app);
    this.server.listen(port, host);
  }

  stopWebhook() {
    this.server.close();
    this.server = null;
    return true;
  }
}

module.exports = { CrystalPAY };
