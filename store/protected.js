import { fireStoreProtected as conf } from "~/wedvite.config";
import firebase from "firebase/app";
import { fireDb } from "~/plugins/firebase";
import { makeid } from '~/helpers/random';
import { pickBy } from "lodash";

const ID_SIZE = 8;

export const state = () => ({
  invitationText: "",
  guestlist: [],
  currentGuest: null,
})

export const actions = {
  getProtectedInfo({ commit }) {
    fireDb
      .collection(conf.collection)
      .doc(conf.doc)
      .onSnapshot(doc => {
        doc = doc.data();
        // console.log("Current data: ", doc);

        commit("SET_INVITATION_TEXT", doc.invitationText);
        if (doc?.guestlist) commit("SET_GUESTLIST", Object.values(doc.guestlist));
      });
  },
  setInvitationText({ }, invitationText) {
    fireDb
      .collection(conf.collection)
      .doc(conf.doc)
      .update({
        invitationText
      })
  },
  importGuestlist({ }, guestlist) {
    const updated = {};
    guestlist.forEach(list => {
      const id = makeid(ID_SIZE);
      let tel = String(list.tel).replace(/\D/g, "");
      tel = tel[0] === "6" ? tel : `6${tel}`;
      updated[`guestlist.${id}`] = {
        ...pickBy(list),
        tel: Number(tel),
        id,
      }

      if (updated[`guestlist.${id}`].pax) {
        updated[`guestlist.${id}`].pax = Number(updated[`guestlist.${id}`].pax)
      }
    });

    fireDb
      .collection(conf.collection)
      .doc(conf.doc)
      .update(updated)
  },
  updateGuest({ }, guest) {
    if (!guest?.id) {
      guest.id = makeid(ID_SIZE);
    }

    let tel = String(guest.tel).replace(/\D/g, "");
    tel = tel[0] === "6" ? tel : `6${tel}`;
    guest.tel = Number(tel);

    if (guest.pax) {
      guest.pax = Number(guest.pax)
    }

    fireDb
      .collection(conf.collection)
      .doc(conf.doc)
      .update({
        [`guestlist.${guest.id}`]: pickBy(guest)
      })
  },
  deleteGuest({ }, id) {
    let key = "guestlist"; // DELETE ALL!
    if (id) {
      key += `.${id}`;
    }
    console.log("deleteGuest", key);

    fireDb
      .collection(conf.collection)
      .doc(conf.doc)
      .update({
        [key]: firebase.firestore.FieldValue.delete()
      })
  },
  getGuestDetails({ commit }, id) {
    commit("SET_CURRENT_GUEST", null);
    return fireDb
      .collection(conf.collection)
      .doc(conf.doc)
      .onSnapshot(doc => {
        doc = doc.data();
        // console.log("Current data: ", doc);

        if (doc?.guestlist?.[id]) {
          commit("SET_CURRENT_GUEST", doc.guestlist[id]);
        }
      });
  }

}

export const mutations = {
  SET_INVITATION_TEXT(state, text) {
    state.invitationText = text || "";
  },
  SET_GUESTLIST(state, list) {
    list = list.map(l => ({
      ...l,
      guest: String(l?.guest || "")
    }))
    state.guestlist = list;
  },
  SET_CURRENT_GUEST(state, guest) {
    state.currentGuest = guest || null;
  }
}