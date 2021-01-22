const functions = require("firebase-functions");
const admin = require("firebase-admin");
const paypal = require("@paypal/checkout-server-sdk");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

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

// Sandbox URL
let paypalAPI = "https://api-m.sandbox.paypal.com";

// Production URL
// let paypalAPI = "https://api-m.paypal.com"

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(
  paypalClientId,
  paypalClientSecret
);
let client = new paypal.core.PayPalHttpClient(environment);
app.post("/paypal", async (request, response) => {
  let duplicate = false;
  const webhooksReference = db.collection("webhooks");
  const usersReference = db.collection("users");
  const subscriptionGroupReference = db.collectionGroup("subscriptions");

  webhooksReference
    .where("id", "==", request.body.id)
    .get()
    .then(function (querySnapshot) {
      if (!querySnapshot.docs.length) {
        duplicate = true;
      }
    });
  if (duplicate) {
    console.log("DUPLICATE");
    response.status(400).send("Webhook Duplicate");
  } else {
    const body = request.body;
    const resource = body.resource;

    const subscriptionId = resource.id;

    let updateDoc = {
      lastAction: body.summary,
      status: resource.status,
      site: resource.custom_id,
      created: resource.create_time,
    };
    let userRef;

    if (resource.links) {
      updateDoc = { ...updateDoc, links: resource.links };
    }
    if (resource.update_time) {
      updateDoc = { ...updateDoc, lastUpdated: resource.update_time };
    }
    subscriptionGroupReference
      .where("id", "==", subscriptionId)
      .get()
      .then(function (querySnapshot) {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const docRef = doc.ref.update(updateDoc);
        }
      });

    console.log(subscriptionId);
    webhooksReference.add({ id: request.body.id });
    response.status(200).send("Ok");
  }
});

app.get("/subscriptions", async (request, response) => {
  let { authorized, userData } = await checkAuth(request);

  if (authorized) {
    const subscriptionGroupReference = db.collectionGroup("subscriptions");
    const data = await subscriptionGroupReference
      .get()
      .then((querySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => {
          return doc.data();
        });
        return docs;
      });
    response.status(200).send(data);
  } else {
    response.status(500).send("Not Authorized");
  }
});

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
  let { authorized, userData } = checkAuth(request);

  const sitesRef = db.collection("sites");
  const snapshot = await sitesRef.get();

  let data = snapshot.docs.map((doc) => doc.data());
  if (!authorized || !userData.email == "admin@admin.com") {
    data = data.map((doc) => {
      return Object.assign({}, doc, { admin: undefined });
    });
  }

  data.sort(function (a, b) {
    return a.id - b.id;
  });

  response.status(200).send(data);
});

async function checkAuth(request) {
  let authorized = false;
  let userData = null;
  if (request.headers.authorization) {
    try {
      userData = await admin
        .auth()
        .verifyIdToken(request.headers.authorization);
      authorized = true;
    } catch (e) {
      return { authorized: authorized, userData: userData, error: e };
    }
  }
  return { authorized: authorized, userData: userData };
}
async function generatePaypalAccessToken() {
  try {
    const {
      data: { access_token },
    } = await axios({
      url: `${paypalAPI}/v1/oauth2/token`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Accept-Language": "en_US",
        "content-type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: paypalClientId,
        password: paypalClientSecret,
      },
      params: {
        grant_type: "client_credentials",
      },
    });

    console.log("access_token: ", access_token);
    return access_token;
  } catch (e) {
    return e;
  }
}

exports.webApi = functions.https.onRequest(app);

exports.firestorePaypalSync = functions.firestore
  .document("users/{user}/subscriptions/{subscription}")
  .onWrite((change, context) => {
    try {
      const status = change.after.get("status");
      const site = change.after.get("site");
      const subscriptionID = change.after.get("id");
      db.collection("sites")
        .doc(site)
        .collection("bookings")
        .where("paypalSubscriptionID", "==", subscriptionID)
        .get()
        .then(function (querySnapshot) {
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const docRef = doc.ref.update({
              status,
            });
          }
        });
      return true;
    } catch {
      return false;
    }
  });
