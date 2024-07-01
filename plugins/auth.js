import { auth } from "~/plugins/firebase";

export default ({ store }) => {
  auth.onAuthStateChanged((user) => {
    // console.log("auth plugin:", { user });
    store.commit("auth/SET_USER", user);
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      let uid = user.uid;
      localStorage.setItem('loggedInUser', uid);
    } else {
      // User is signed out
      localStorage.removeItem('loggedInUser');
    }
  });
}