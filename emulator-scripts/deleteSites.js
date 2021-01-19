const firebase = require("firebase");

let firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "llano-estacado-rv-park.firebaseapp.com",
  projectId: "llano-estacado-rv-park",
  storageBucket: "llano-estacado-rv-park.appspot.com",
  messagingSenderId: "967435769392",
  appId: "1:967435769392:web:ea0d2e6dcdfce13c93bff5",
  databaseURL: "https://llano-estacado-rv-park-default-rtdb.firebaseio.com/",
};
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
db.useEmulator("localhost", 8080);

deleteCollection(db, "sites", 100);

async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}
