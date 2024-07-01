import { auth } from "~/plugins/firebase";


export const state = () => ({
  user: null
})

export const actions = {
  signInProvider({ }, provider) {
    return auth.signInWithPopup(provider)
      .catch((error) => {
        // // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // // The email of the user's account used.
        // var email = error.email;
        // // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        // // ...

        console.error(error);
      })
  },
  signOut({ }) {
    return auth.signOut();
  }
}

export const mutations = {
  SET_USER(state, user = null) {
    state.user = user;
  }
}