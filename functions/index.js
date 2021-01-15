const functions = require("firebase-functions");
const admin = require("firebase-admin");
const paypal = require("@paypal/checkout-server-sdk");
const express = require("express");
const cors = require("cors");

// Firebase Initialization
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

//initialize express server
const app = express();

app.use(cors({ origin: true }));

const db = admin.firestore();

// Creating an environment
let paypalClientId =
  "AXgplH_FFZXB5FWHAhjurvcisj0uXHjyHAQvUnrjlUmSD7g5E4kNTU60nNCEttnFSNYYdhlkv99e0f77";
let paypalClientSecret =
  "EGDjdgtG8bepmIngcZYjtl0hIYEVVntmGBpBdDbnAdZJ39vRzd8BsQE-AarEOQ1fkRlazxKguic45TEx";
// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(
  paypalClientId,
  paypalClientSecret
);
let client = new paypal.core.PayPalHttpClient(environment);

app.get("/payment", async (request, response) => {
  // Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
  let orderRequest = new paypal.orders.OrdersCreateRequest();
  orderRequest.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "1.00",
        },
      },
    ],
  });

  // Call API with your client and get a response for your call
  let createOrder = async function () {
    let orderResponse = await client.execute(orderRequest);
    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
    response.send(`Order: ${JSON.stringify(orderResponse.result)}`);
    response.redirect(orderResponse.result);
  };
  createOrder();
});

app.get("/sites", async (request, response) => {
  let authorized = false;
  let userData = null;
  if (request.headers.authorization) {
    try {
      userData = await admin
        .auth()
        .verifyIdToken(request.headers.authorization);
      authorized = true;
    } catch (e) {
      console.log(e);
    }
  }
  const sitesRef = db.collection("sites");
  const snapshot = await sitesRef.get();
  // .then((snapshot) => {
  //   snapshot.forEach((doc) => {
  //     console.log(doc.id, "=>", doc.data());
  //   });
  // })
  // .catch((err) => {
  //   console.log("Error getting documents", err);
  // });
  let data = snapshot.docs.map((doc) => doc.data());
  if (!authorized || !userData.email == "admin@admin.com") {
    data = data.map((doc) => {
      return Object.assign({}, doc, { admin: undefined });
    });
  }

  data.sort(function (a, b) {
    return a.id - b.id;
  });

  response.send(data);
});

exports.webApi = functions.https.onRequest(app);
