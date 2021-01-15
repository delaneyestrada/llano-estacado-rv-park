const functions = require("firebase-functions");
const admin = require('firebase-admin')
const paypal = require("@paypal/checkout-server-sdk");

// Firebase Initialization
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore()

// Creating an environment
let paypalClientId =
  "AXgplH_FFZXB5FWHAhjurvcisj0uXHjyHAQvUnrjlUmSD7g5E4kNTU60nNCEttnFSNYYdhlkv99e0f77";
let paypalClientSecret =
  "EGDjdgtG8bepmIngcZYjtl0hIYEVVntmGBpBdDbnAdZJ39vRzd8BsQE-AarEOQ1fkRlazxKguic45TEx";
// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(paypalClientId, paypalClientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

exports.createPayPalOrder = functions.https.onRequest((request, response) => {
  //   functions.logger.info("Hello logs!", { structuredData: true });
  //   response.send("Hello from Firebase!");

  // Construct a request object and set desired parameters
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
exports.getSites = functions.https.onRequest((request, response) => {
  const sitesRef = db.collection('sites')
  const allSites = sitesRef.get().then(snapshot => {
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data())
    })
  })
  .catch(err => {
    console.log('Error getting documents', err)
  })
})