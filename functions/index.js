const functions = require("firebase-functions");
const admin = require("firebase-admin");
const paypal = require("@paypal/checkout-server-sdk");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const querystring = require("querystring");
const dotenv = require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const dayjs = require("dayjs");
const { nanoid } = require("nanoid");

// Firebase Initialization
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

//initialize express server
const app = express();

app.use(cors({ origin: true }));

const db = admin.firestore();
const {
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  SENDGRID_API_KEY,
  ENVIRONMENT,
  SENDGRID_EMAIL,
} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

// Creating an environment
let paypalClientId = PAYPAL_CLIENT_ID;
let paypalClientSecret = PAYPAL_CLIENT_SECRET;

// Sandbox URL
const SANDBOX_PAYPAL_URL = "https://api-m.sandbox.paypal.com";

// Production URL
const PRODUCTION_PAYPAL_URL = "https://api-m.paypal.com";

const sandbox = ENVIRONMENT == "DEV" ? true : false;

/** Production Postback URL */
const PRODUCTION_VERIFY_URI = "https://ipnpb.paypal.com/cgi-bin/webscr";
/** Sandbox Postback URL */
const SANDBOX_VERIFY_URI = "https://ipnpb.sandbox.paypal.com/cgi-bin/webscr";

function getPaypalURI() {
  return sandbox ? SANDBOX_VERIFY_URI : PRODUCTION_VERIFY_URI;
}

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(
  paypalClientId,
  paypalClientSecret
);
let client = new paypal.core.PayPalHttpClient(environment);
app.post("/paypal-ipn", async (req, res) => {
  if (req.method !== "POST") {
    console.error("Request method not allowed.");
    res.status(405).send("Method Not Allowed");
  } else {
    // Return empty 200 response to acknowledge IPN post success.
    console.log("IPN Notification Event received successfully.");
    res.status(200).send("ok");
  }
  // JSON object of the IPN message consisting of transaction details.
  let ipnTransactionMessage = req.body;
  // Convert JSON ipn data to a query string since Google Cloud Function does not expose raw request data.
  let formUrlEncodedBody = querystring.stringify(ipnTransactionMessage);
  // Build the body of the verification post message by prefixing 'cmd=_notify-validate'.
  let verificationBody = `cmd=_notify-validate&${formUrlEncodedBody}`;

  let options = {
    method: "POST",
    url: getPaypalURI(),
    data: verificationBody,
  };
  axios(options).then((res) => {
    console.log(res.data);
  });

  const body = req.body;
  const subscriptionGroupReference = db.collectionGroup("subscriptions");

  const subscriptionId = body.recurring_payment_id;

  let updateDoc = {
    status: body.profile_status,
  };

  switch (body.txn_type) {
    case "recurring_payment_profile_cancel":
    case "recurring_payment_expired":
    case "recurring_payment_suspended":
    case "recurring_payment_suspended_due_to_max_failed_payment":
    case "subscr_cancel":
    case "subscr_eot":
      console.log(body.profile_status);
      break;
    case "subscr_signup":
    case "recurring_payment_profile_created":
      console.log("signed up");
      console.log(body.profile_status);

      break;
    case "subscr_payment":
    case "recurring_payment":
      console.log("payment received");
      console.log(body.profile_status);

      break;
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
});
app.post("/paypal", async (request, response) => {
  // let duplicate = false;
  // const webhooksReference = db.collection("webhooks");
  // const usersReference = db.collection("users");
  // const subscriptionGroupReference = db.collectionGroup("subscriptions");

  // webhooksReference
  //   .where("id", "==", request.body.id)
  //   .get()
  //   .then(function (querySnapshot) {
  //     if (!querySnapshot.docs.length) {
  //       duplicate = true;
  //     }
  //   });
  // if (duplicate) {
  //   console.log("DUPLICATE");
  //   response.status(400).send("Webhook Duplicate");
  // } else {
  //   const body = request.body;
  //   const resource = body.resource;

  //   const subscriptionId = resource.id;

  //   let updateDoc = {
  //     lastAction: body.summary,
  //     status: resource.status,
  //     site: resource.custom_id,
  //     created: resource.create_time,
  //   };
  //   let userRef;

  //   if (resource.links) {
  //     updateDoc = { ...updateDoc, links: resource.links };
  //   }
  //   if (resource.update_time) {
  //     updateDoc = { ...updateDoc, lastUpdated: resource.update_time };
  //   }
  //   subscriptionGroupReference
  //     .where("id", "==", subscriptionId)
  //     .get()
  //     .then(function (querySnapshot) {
  //       if (!querySnapshot.empty) {
  //         const doc = querySnapshot.docs[0];
  //         const docRef = doc.ref.update(updateDoc);
  //       }
  //     });

  //   console.log(subscriptionId);
  //   webhooksReference.add({ id: request.body.id });
  response.status(200).send("ok");
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

app.get(
  "/subscription/:site/:subscriptionID/cancel",
  async (request, response) => {
    const { subscriptionID, site } = request.params;
    console.log(subscriptionID, site);
    const siteReference = db.collection("sites").doc(site);
    siteReference.get().then((snapshot) => {
      const { booked } = snapshot.data();
      if (booked.length) {
        siteReference
          .update({
            booked: booked.filter(
              (booking) => booking.paypalSubscriptionID !== subscriptionID
            ),
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });

    siteReference
      .collection("bookings")
      .where("paypalSubscriptionID", "==", subscriptionID)
      .get()
      .then(function (querySnapshot) {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          doc.ref.delete();
        }
      });

    response.status(200).send("OK");
  }
);

// app.post("/check-sites", async (request, response) => {
//   console.log(request);
//   response.status(200).send("OK");
// });

app.get("/bookings", async (request, response) => {
  const bookingsCollectionReference = db.collectionGroup("bookings");
  const snapshot = await bookingsCollectionReference.get();
  let data = snapshot.docs.map((doc) => doc.data());
  response.status(200).send(data);
});
app.post("/manual-entry", async (request, response) => {
  const { site, startDate, endDate, name, email, notes } = request.body.data;
  const FieldValue = admin.firestore.FieldValue;

  const manualId = nanoid();

  const bookDates = {
    start: startDate,
    end: endDate,
    manual: true,
    paypalSubscriptionID: manualId,
  };

  db.collection("sites")
    .doc(site.toString())
    .update("booked", FieldValue.arrayUnion(bookDates));

  db.collection("sites")
    .doc(site.toString())
    .collection("bookings")
    .doc()
    .set({
      site: site,
      manual: true,
      paypalSubscriptionID: manualId,
      startDate: startDate,
      endDate: endDate,
      status: "Manual",
      admin: {
        userEmail: email,
        userName: name,
        notes,
      },
    });
  response.status(200).send("OK");
});
app.post("/contact-email", async (request, response) => {
  const { name, email, message } = request.body.data.form;
  const { token } = request.body.data;
  const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) {
    response.status(500).send("No Token");
  } else {
    const res = await axios.get(
      `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`
    );
    console.log(res);
    if (res.data.success) {
      const msg = {
        to: SENDGRID_EMAIL,
        from: SENDGRID_EMAIL,
        subject: "Contact form submission from llanoestacadorvpark.com",
        html: `
      <div><strong>Name: </strong> ${name}</div>
      <div><strong>Email: </strong> ${email}</div>
      <div><strong>Message: </strong> ${message}</div>
      `,
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((err) => {
          console.error(err);
        });
      response.status(200).send("Message sent");
    } else {
      response.status(500).send("Invalid token");
    }
  }
});
app.get("/check-auth", async (request, response) => {
  let { authorized } = await checkAuth(request);
  if (authorized) {
    response.status(200).send({ success: true });
  } else {
    response.status(401).send({ success: false });
  }
});

app.post("/confirmation-email", async (request, response) => {
  const { subscriptionID, startDate, endDate, user, site } = request.body.data;
  const msg = {
    to: user.email,
    from: SENDGRID_EMAIL,
    subject: "Booking confirmation from llanoestacadorvpark.com",
    html: `
    <p>Hello, ${user.name}</p>
    <p>This email is being sent to confirm that your booking from ${dayjs(
      startDate
    ).format("MM-DD-YYYY")} through ${dayjs(endDate).format(
      "MM-DD-YYYY"
    )} for site ${site} has been completed.</p>
    <p>If you did not make this booking please email us at ${SENDGRID_EMAIL}.</p>
    <p>Booking ID: ${subscriptionID}</p>
    `,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((err) => {
      console.error(err);
    });
  response.status(200).send("OK");
});

app.get("/sites", async (request, response) => {
  let { authorized, userData } = await checkAuth(request);

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
// async function generatePaypalAccessToken() {
//   try {
//     const {
//       data: { access_token },
//     } = await axios({
//       url: `${paypalAPI}/v1/oauth2/token`,
//       method: "post",
//       headers: {
//         Accept: "application/json",
//         "Accept-Language": "en_US",
//         "content-type": "application/x-www-form-urlencoded",
//       },
//       auth: {
//         username: paypalClientId,
//         password: paypalClientSecret,
//       },
//       params: {
//         grant_type: "client_credentials",
//       },
//     });

//     console.log("access_token: ", access_token);
//     return access_token;
//   } catch (e) {
//     return e;
//   }
// }

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
