<template>
  <div v-show="scrollPos > 50" id="footer" class="container">
    <div :class="'footer-' + theme">
      <footer class="card-footer no-select">
        <span class="card-footer-item" @click.prevent="contactModal = !contactModal">
          <div class="level">
            <span class="level-item">
              <fa :icon="['fas', 'address-book']" class="icon fa-x"></fa>Contact
            </span>
          </div>
        </span>
        <span class="map-icon" @click.prevent="locationModal = !locationModal">
          <fa icon="map-marked-alt"></fa>
        </span>
        <span class="card-footer-item" @click.prevent="calendarModal = !calendarModal">
          <div class="level">
            <div class="level-item">
              <fa icon="calendar-alt" class="icon fa-1x"></fa>Calendar
            </div>
          </div>
        </span>
      </footer>

      <!-- contact modal -->
      <div
        class="modal modal-fx-slideBottom modal-pos-bottom"
        :class="{'is-active' : contactModal}"
      >
        <div class="modal-background" @click.prevent="contactModal = !contactModal"></div>
        <div class="modal-content">
          <div class="box" :class="'bgi-' + theme">
            <div
              v-for="(cont, index) in c.contacts"
              :key="index"
              class="level is-mobile contact-level"
            >
              <div class="level-item is-narrow is-capitalized">
                {{cont.name}}
                <span
                  v-if="cont.rel"
                  class="relay has-text-weight-light is-size-7"
                >({{cont.rel}})</span>
              </div>
              <div class="level-right no-select">
                <div class="level-item">
                  <a
                    v-if="cont.whatsapp"
                    :href="'https://api.whatsapp.com/send?phone=' + cont.tel"
                    @click="contactModal = !contactModal"
                  >
                    <fa
                      :icon="['fab', 'whatsapp']"
                      class="contact-icon fa-2x"
                      :class="{'whatsapp': !c.override_icons_color}"
                    ></fa>
                  </a>

                  <a
                    v-if="cont.telegram"
                    :href="'https://t.me/' + cont.telegram"
                    @click="contactModal = !contactModal"
                  >
                    <fa
                      :icon="['fab', 'telegram-plane']"
                      class="contact-icon fa-2x"
                      :class="{'telegram': !c.override_icons_color}"
                    ></fa>
                  </a>
                  <a :href="'tel:+' + cont.tel" @click="contactModal = !contactModal">
                    <fa icon="phone-square" class="contact-icon fa-2x"></fa>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- calendar modal -->
      <div
        class="modal modal-fx-slideBottom modal-pos-bottom"
        :class="{'is-active' : calendarModal}"
      >
        <div class="modal-background" @click.prevent="calendarModal = !calendarModal"></div>
        <div class="modal-content has-text-centered">
          <div class="box" :class="'bgi-' + theme">
            <div class="date is-capitalized">
              <span class="icon">
                <fa icon="calendar-check"></fa>
              </span>
              {{date.greg}}
              <span v-if="day">{{day}}</span>
            </div>
            <div class="time is-uppercase">{{time.from}} - {{time.to}}</div>

            <footer v-if="ics.enabled" class="card-footer has-text-weight-bold no-select">
              <a @click="downloadCal()" class="card-footer-item">
                <span class="loc-icon">
                  <img src="~assets/icons/gcal.png" width="35" alt="Add to Google Calendar" />
                </span>
                Add to Calendar
              </a>
            </footer>
          </div>
        </div>
      </div>

      <!-- location modal -->
      <div
        class="modal modal-fx-slideBottom modal-pos-bottom"
        :class="{'is-active' : locationModal}"
      >
        <div class="modal-background" @click.prevent="locationModal = !locationModal"></div>
        <div class="modal-content">
          <div class="box is-paddingless" :class="'bgi-' + theme">
            <header class="card-header">
              <p class="card-header-title is-size-5" :class="'txt-' + theme">{{stripAddr}}</p>
            </header>
            <div class="content is-marginless">
              <span class v-html="address.map_embed"></span>
            </div>
            <footer class="card-footer has-text-weight-bold no-select">
              <a
                :href="address.gmaps_link"
                target="_blank"
                @click="locationModal = !locationModal"
                class="card-footer-item"
              >
                <span class="loc-icon">
                  <img src="~assets/icons/gmaps.png" width="35" alt="Google Maps icon" />
                </span>
                GMaps
              </a>
              <a
                :href="address.waze_link"
                target="_blank"
                @click="locationModal = !locationModal"
                class="card-footer-item"
              >
                <span class="loc-icon">
                  <img src="~assets/icons/waze.png" width="35" alt="Waze icon" />
                </span> Waze
              </a>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import ics from "~/plugins/ics";
import { projectTitle } from "~/wedvite.config";
import cloneDeep from "lodash.clonedeep";

import { mapState } from "vuex";
export default {
  data() {
    return {
      contactModal: false,
      calendarModal: false,
      locationModal: false,
      scrollPos: 0,
      cal: ics()
    };
  },
  computed: {
    ...mapState({
      theme: state => state.info.theme,
      c: state => state.info.contact_section,
      day: state => state.info.day,
      date: state => state.info.date,
      time: state => state.info.time,
      address: state => state.info.address,
      ics: state => state.info.ics
    }),
    stripAddr: function() {
      return this.address.general.replace(/<(?:.|\n)*?>/gm, "");
    }
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrollPos = window.scrollY;
    },
    downloadCal() {
      let { subject, begin, end } = cloneDeep(this.ics),
        location = this.address.general;

      this.cal.addEvent(subject, "", location, begin, end);
      this.cal.download('wedvite')
    }
    // addToGcal() {
    //   let { text, from, to, location } = this.gcal;
    //   let params = {
    //     text,
    //     dates: `${dayjs(from).format("YYYYMMDDThhmmss")}/${dayjs(to).format(
    //       "YYYYMMDDThhmmss"
    //     )}`,
    //     details: "",
    //     location,
    //     sf: true,
    //     output: "xml",
    //     pli: 1
    //   };

    //   // console.log(params);
    //   // return;
    //   let paramsText = "";
    //   Object.entries(params).forEach(e => {
    //     paramsText +=
    //       e[1] !== undefined ? `${e[0]}=${encodeURIComponent(e[1])}&` : "";
    //   });
    //   // let url = "https://calendar.google.com/calendar/r/eventedit?text=+Event+Title&dates=20190901T113000%2F20190902T163000&details=Details&location=Kidocode&sf=true&output=xml&pli=1";
    //   let url = `https://calendar.google.com/calendar/r/eventedit?${paramsText}`;
    //   let win = window.open(url, "_blank");
    //   win.focus();
    // }
  }
};
</script>


<style lang="scss" scoped>
@import "~assets/scss/var.scss";

#footer * {
  font-family: $secondary-font !important;
}
#footer {
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 99;
  -webkit-transform: translateZ(1);
}

.icon {
  margin-right: 0.5rem;
}

.card-footer,
.card-footer-item {
  cursor: pointer;
  border: none;
  outline: none;
}

.map-icon {
  cursor: pointer;
  background-color: #4a89f3;
  color: #fff;
  position: fixed;
  width: 60px;
  height: 60px;
  left: 0;
  right: 0;
  bottom: 18px;
  margin: auto;
  line-height: 60px;
  font-size: 2em;
  border-radius: 50%;
  text-align: center;
  z-index: 100;
}

a,
.button {
  color: unset !important;
}

.contact-level {
  margin-bottom: 1rem;
  &:last-child {
    margin-bottom: 0;
  }
}

.contact-icon {
  cursor: pointer;
  margin-left: 0.8rem;
}

.contact-icon.telegram {
  color: #0088cc;
}

.contact-icon.whatsapp {
  color: #4fce5d;
}

.loc-icon > img {
  margin-right: 0.25rem;
  font-size: 2rem;
}

.relay {
  margin-left: 0.25rem;
  font-size: 0.9rem;
}

.date {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.125;
  margin-bottom: 0.5rem;
}
.time {
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.25;
  margin-bottom: 0.5rem;
}
</style>


