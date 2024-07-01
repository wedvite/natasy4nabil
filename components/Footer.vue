<template>
  <div v-show="scrollPos > 50" id="footer" class="container">
    <div :class="'footer-' + theme">
      <footer class="card-footer no-select">
        <span
          class="card-footer-item"
          @click.prevent="contactModal = !contactModal"
        >
          <div class="level">
            <span class="level-item">
              <fa :icon="['fas', 'address-book']" class="icon fa-x"></fa>
              <span style="margin-top: 2px">Hubungi</span>
            </span>
          </div>
        </span>
        <span class="map-icon" @click.prevent="locationModal = !locationModal">
          <fa icon="map-marked-alt"></fa>
        </span>
        <span
          class="card-footer-item"
          @click.prevent="calendarModal = !calendarModal"
        >
          <div class="level">
            <div class="level-item">
              <fa icon="calendar-alt" class="icon fa-1x"></fa>
              <span style="margin-top: 2px">Kalendar</span>
            </div>
          </div>
        </span>
      </footer>

      <!-- contact modal -->
      <div
        class="modal modal-fx-slideBottom modal-pos-bottom"
        :class="{ 'is-active': contactModal }"
      >
        <div
          class="modal-background"
          @click.prevent="contactModal = !contactModal"
        ></div>
        <div class="modal-content">
          <div class="box" :class="'bgi-' + theme">
            <div
              v-for="(cont, index) in c.contacts"
              :key="index"
              class="level is-mobile contact-level"
            >
              <div class="level-item is-narrow is-capitalized">
                {{ cont.name }}
                <span
                  v-if="cont.rel"
                  class="relay has-text-weight-light is-size-7"
                  >({{ cont.rel }})</span
                >
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
                      :class="{ whatsapp: !c.override_icons_color }"
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
                      :class="{ telegram: !c.override_icons_color }"
                    ></fa>
                  </a>
                  <a
                    :href="'tel:+' + cont.tel"
                    @click="contactModal = !contactModal"
                  >
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
        :class="{ 'is-active': calendarModal }"
      >
        <div
          class="modal-background"
          @click.prevent="calendarModal = !calendarModal"
        ></div>
        <div class="modal-content has-text-centered">
          <div class="box" :class="'bgi-' + theme">
            <div class="date is-capitalized">
              <span class="icon">
                <fa icon="calendar-check"></fa>
              </span>
              {{ date.greg }}
              <span v-if="day">{{ day }}</span>
            </div>
            <div class="time is-uppercase">{{ time.from }} - {{ time.to }}</div>

            <footer
              v-if="ics.enabled && icsUrl"
              class="card-footer has-text-weight-bold no-select"
            >
              <a
                :download="icsFilename"
                :href="icsUrl"
                class="card-footer-item"
              >
                <span class="loc-icon">
                  <img
                    src="~assets/icons/gcal.png"
                    width="35"
                    alt="Add to Google Calendar"
                  />
                </span>
                Simpan dalam Kalendar
              </a>
            </footer>
          </div>
        </div>
      </div>

      <!-- location modal -->
      <div
        class="modal modal-fx-slideBottom modal-pos-bottom"
        :class="{ 'is-active': locationModal }"
      >
        <div
          class="modal-background"
          @click.prevent="locationModal = !locationModal"
        ></div>
        <div class="modal-content">
          <div class="box is-paddingless" :class="'bgi-' + theme">
            <header class="card-header">
              <p class="card-header-title is-size-5" :class="'txt-' + theme">
                {{ stripAddr }}
              </p>
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
                  <img
                    src="~assets/icons/gmaps.png"
                    width="35"
                    alt="Google Maps icon"
                  />
                </span>
                Maps
              </a>
              <a
                :href="address.waze_link"
                target="_blank"
                @click="locationModal = !locationModal"
                class="card-footer-item"
              >
                <span class="loc-icon">
                  <img
                    src="~assets/icons/waze.png"
                    width="35"
                    alt="Waze icon"
                  />
                </span>
                Waze
              </a>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import dayjs from "dayjs";

const ics = require("ics");
import { cloneDeep, snakeCase } from "lodash";

import { mapState } from "vuex";
export default {
  data() {
    return {
      contactModal: false,
      calendarModal: false,
      locationModal: false,
      scrollPos: 0,
      icsUrl: "",
      // cal: ics(),
    };
  },
  computed: {
    ...mapState({
      theme: (state) => state.info.theme,
      c: (state) => state.info.contact_section,
      day: (state) => state.info.day,
      date: (state) => state.info.date,
      time: (state) => state.info.time,
      address: (state) => state.info.address,
      ics: (state) => state.info.ics,
    }),
    stripAddr: function () {
      return this.address.general.replace(/<(?:.|\n)*?>/gm, "");
    },
    icsFilename() {
      const { subject } = cloneDeep(this.ics);
      return `${`${snakeCase(subject || "wedvite")}_${Date.now()}`}.ics`;
    },
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);

    const { subject, start, duration } = cloneDeep(this.ics);
    const location = this.stripAddr;

    ics.createEvent(
      {
        title: subject,
        status: "CONFIRMED",
        start,
        duration,
        location,
      },
      (error, value) => {
        if (error) {
          console.log(error);
        }

        const blob = new Blob([value], {
          type: "text/calendar;charset=utf-8",
        });

        const icsUrl = URL.createObjectURL(blob);
        this.icsUrl = icsUrl;
      }
    );
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrollPos = window.scrollY;
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/scss/var.scss";

#footer * {
  font-family: $primary-font !important;
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


