const firebase = require('firebase')

let firebaseConfig = {
        apiKey: "***REMOVED***",
        authDomain: "llano-estacado-rv-park.firebaseapp.com",
        projectId: "llano-estacado-rv-park",
        storageBucket: "llano-estacado-rv-park.appspot.com",
        messagingSenderId: "967435769392",
        appId: "1:967435769392:web:ea0d2e6dcdfce13c93bff5",
        databaseURL:
          "https://llano-estacado-rv-park-default-rtdb.firebaseio.com/",
      }
      firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var batch = db.batch();
let array = []
for (i=0; i <42; i++){
    array.push({id: i+1})
}
console.log(array)
array.forEach((doc) => {

  batch.set(db.collection('sites').doc(), doc);
})
// Commit the batch
batch.commit().then(function () {
    console.log('done')
});