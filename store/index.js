import { fireStore as conf } from "~/wedvite.config";
import { fireDb } from "~/plugins/firebase";
import { makeid } from '~/helpers/random';
import { merge } from "lodash";

import { INFO_MS, INFO_EN } from "@/middleware/jsonDefault/lang";

function formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return (
    date.getMonth() +
    1 +
    "/" +
    date.getDate() +
    "/" +
    date.getFullYear() +
    "  " +
    strTime
  );
}

export const strict = false;

export const state = () => ({
  info: {},
  dbInfo: {},
  showPage: null,
  rsvp: [],
  guestlist: []
});

export const getters = {
  countRsvpStatus: state => status => {
    return state.rsvp.reduce(
      (sum, curr) =>
        curr.status === status ? (sum += parseInt(curr.details.pax)) : sum,
      0
    );
  }
};

export const actions = {
  getInfo({ commit, dispatch }, { info, overrideTheme = null }) {
    overrideTheme ? (info.theme = overrideTheme) : "";
    dispatch("setInfo", info);
    // console.log("info", INFO_MS, info);

    fireDb
      .collection(conf.collection)
      .doc(conf.doc)
      .onSnapshot(doc => {
        doc = doc.data();
        // console.log("Current data: ", doc);
        if (doc?.rsvp) commit("SET_RSVP", Object.values(doc.rsvp));
      });
  },
  setInfo({ commit }, info) {
    let mergedInfo;
    if (info && info.lang.toLowerCase() === "en")
      mergedInfo = merge(INFO_EN, info);
    else mergedInfo = merge(INFO_MS, info);

    commit("SET_INFO", mergedInfo);
  },
  getDBInfo({ commit }, doc) {
    commit("SET_DB_INFO", doc);
  },
  updateRsvp({ }, newRsvp) {
    let dt = new Date();
    newRsvp.details.unix = dt.getTime();
    newRsvp.details.formattedDate = formatDate(dt);

    if (!newRsvp?.id) {
      // New record
      newRsvp.id = makeid();
    } 
    // console.log({ newRsvp });

    fireDb
      .collection(conf.collection)
      .doc(conf.doc)
      .update({
        [`rsvp.${newRsvp.id}`]: newRsvp
      })

    // Set localStorage
    localStorage.setItem(
      `rsvp_${window.location.href}`,
      JSON.stringify(newRsvp)
    );
  }
};

export const mutations = {
  SET_INFO(state, i) {
    state.info = i;
    state.showPage = true;
  },
  SET_DB_INFO(state, i) {
    state.dbInfo = i;
  },
  SET_RSVP(state, rsvp) {
    state.rsvp = rsvp;
  },
};
