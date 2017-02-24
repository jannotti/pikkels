// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyD7XCiSz3toIGudX9eKJ2b2UIEkLvB-n_A",
  authDomain: "pikkels-eec0c.firebaseapp.com",
  databaseURL: "https://pikkels-eec0c.firebaseio.com",
  storageBucket: "pikkels-eec0c.appspot.com",
  messagingSenderId: "45401401652"
});

// FirebaseUI config.
var uiConfig = {
  signInSuccessUrl: '?success',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  tosUrl: '?tos'
};

window.addEventListener('load', function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log(user);
      user.getToken().then((accessToken) => {
        console.log(accessToken);
        setTimeout(() => {
          firebase.auth().signOut().then(function() {
            console.log("Sign-out successful.");
          }, function(error) {
            console.log("Error on signOut.", error);
          });
        }, 1000*1000);
        console.log("will logout in 1000 secs");
      });
    } else {
      console.log("signed out");
      // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig);
    }
  }, function(error) {
    console.log(error);
  });
});
