<template>
  <section id="wedvite" class="container" v-if="showPage">
    <!-- <keep-alive> -->
    <main-content v-if="check(sectionStatus.main)"></main-content>
    <invitation v-if="check(sectionStatus.invitation)"></invitation>
    <tentative v-if="check(sectionStatus.tentative)"></tentative>
    <doa v-if="check(sectionStatus.doa)"></doa>
    <countdown v-if="check(sectionStatus.countdown)"></countdown>
    <social v-if="check(sectionStatus.social)"></social>
    <rsvp v-if="check(sectionStatus.rsvp)"></rsvp>
    <app-footer></app-footer>
    <!-- </keep-alive> -->
  </section>
</template>

<script>
import "bulma-modal-fx/dist/js/modal-fx.min";
import { userData as data, themes } from "~/wedvite.config.js";

import MainContent from "~/components/MainContent";
import Invitation from "~/components/Invitation";
import Tentative from "~/components/Tentative";
import Doa from "~/components/Doa";
import Countdown from "~/components/Countdown";
import Social from "~/components/Social";
import Rsvp from "~/components/Rsvp";
import Footer from "~/components/Footer";
import { mapState } from "vuex";

export default {
  // asyncData({ store }) {
  //   return store.dispatch("getInfo");
  // },
  components: {
    MainContent,
    Invitation,
    Tentative,
    Doa,
    Countdown,
    Social,
    Rsvp,
    AppFooter: Footer
  },
  computed: {
    ...mapState({
      showPage: state => state.showPage,
      sectionStatus: state => state.info.section_status || {}
    })
  },
  async created() {
    let theme = themes.includes(this.$route.query.t)
      ? this.$route.query.t
      : null;
      
    this.$store.dispatch("getInfo", {
      info: data,
      // lang: data.lang
      overrideTheme: theme || data.theme
    });
  },
  methods: {
    check(s) {
      return s || s === undefined ? true : false;
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/var.scss";
@import url($font-url);
@import "~assets/scss/themes/index.scss";
@import "~assets/scss/modal.scss";
@import "bulma-modal-fx/dist/css/modal-fx.min.css";
html {
  position: relative;
  min-height: 100%;
}

body {
  margin-bottom: 3rem;
}

.no-select {
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
  -khtml-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
  -webkit-tap-highlight-color: transparent !important;
}

.pointer {
  cursor: pointer !important;
}

a,
.button {
  text-decoration: none !important; /* no underline */
  box-shadow: none !important;
  // border: none !important;
  border-color: unset !important;
}

.container {
  width: 100%;
  max-width: 520px;
  font-family: $primary-font !important;
}

@media only screen and (min-width: 520px) {
  #wedvite {
    border-right: #ddd 1px solid;
    border-left: #ddd 1px solid;
  }
}

</style>
