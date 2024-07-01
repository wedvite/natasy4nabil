<template>
  <div>
    <!-- floating rsvp button -->
    <div class="container floating-container">
      <button
        v-show="scrollPos > 50 && !endDate"
        class="floating-button no-select"
        :class="`bg-${theme} text-dark-${theme}`"
        @click.prevent="statusModal = !statusModal"
      >
        <fa icon="calendar-check" class="fa-2x no-select" />
      </button>
    </div>

    <section class="section">
      <div class="level is-mobile">
        <div
          v-for="(opt, index) in rsvpOptions"
          :key="index"
          class="level-item has-text-centered"
        >
          <div data-aos="flip-down" data-aos-duration="1000">
            <p class="title">{{ countRsvpStatus(opt.value) }}</p>
            <p class="heading" :class="'txt-dark-' + theme">{{ opt.value }}</p>
          </div>
        </div>
      </div>

      <div
        class="section is-borderless"
        :class="{ 'is-paddingless': !myRsvp.status && endDate }"
      >
        <div v-if="!endDate" class="buttons is-centered no-select">
          <button
            data-aos="zoom-in"
            class="button is-rounded is-large"
            :class="'bg-' + theme"
            @click.prevent="statusModal = !statusModal"
            style="min-width: 130px"
          >
            <span class="text-confirm is-size-6">
              {{ myRsvp.status ? `${rsvp_section.updateRsvpText} ` : "" }}
              {{ rsvp_section.rsvpText }}
            </span>
          </button>
        </div>
        <div v-if="myRsvp.status">
          <div
            data-aos="zoom-in"
            class="field is-grouped is-grouped-multiline is-grouped-centered"
          >
            <div class="control">
              <div class="tags has-addons">
                <span class="tag is-dark">Status</span>
                <span class="tag" :class="getStatusClass(myRsvp.status)">
                  {{ myRsvp.status }}
                </span>
              </div>
            </div>

            <div class="control">
              <div class="tags has-addons">
                <span class="tag is-dark">Pax</span>
                <span class="tag is-primary">{{ myRsvp.details.pax }}</span>
              </div>
            </div>
          </div>

          <article
            data-aos="zoom-in"
            v-if="myRsvp.details.wishes"
            class="message"
          >
            <div class="message-body">
              <strong>Ucapan:</strong>
              {{ myRsvp.details.wishes }}
            </div>
          </article>
        </div>
      </div>

      <!-- Guestbook -->
      <h1
        data-aos="fade-right"
        v-show="dbRsvp.length"
        class="is-size-4 has-text-weight-bold recent-comments"
        :class="'txt-dark-' + theme"
      >
        <fa icon="comments"></fa>Guestbook
      </h1>
      <article class="media" v-for="(i, index) in sortedRsvp" :key="index">
        <div class="media-content">
          <div class="content is-marginless">
            <div data-aos="fade-right">
              <strong>{{ i.details.name }}</strong>
              <small v-if="i.details.formattedDate">
                @ {{ i.details.formattedDate }}
              </small>
              <div v-if="i.details.wishes" style="word-wrap: break-word">
                {{ i.details.wishes }}
              </div>
            </div>
          </div>
        </div>
      </article>

      <div
        data-aos="zoom-in"
        data-aos-offset="100"
        v-if="dbRsvp.length"
        class="buttons is-centered more"
      >
        <a class="has-text-link pointer no-select" href="/rsvp">Semua RSVP</a>
      </div>

      <!-- rsvp status -->
      <div
        class="modal modal-fx-slideBottom modal-pos-bottom"
        :class="{ 'is-active': statusModal }"
      >
        <div
          class="modal-background"
          @click.prevent="statusModal = !statusModal"
        ></div>
        <div class="modal-content">
          <div class="box is-size-5" :class="'bgi-' + theme">
            <div
              v-for="(opt, index) in rsvpOptions"
              :key="index + 'modal'"
              class="level is-mobile pointer no-select"
              @click.prevent="ans(opt.value)"
            >
              <div class="level-item is-narrow">
                <fa :icon="opt.faIcon" class="fa fa-2x"></fa>
              </div>
              <div class="level-item">{{ opt.value }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- rsvp details modal -->
      <div
        class="modal modal-fx-slideBottom modal-pos-bottom"
        :class="{ 'is-active': detailsModal }"
      >
        <div
          class="modal-background"
          @click.prevent="detailsModal = !detailsModal"
        ></div>
        <div class="modal-content">
          <div class="box" :class="'bgi-' + theme">
            <h1 class="title is-3">{{ rsvp.status }}</h1>
            <div class="columns is-mobile">
              <div class="column">
                <div class="field">
                  <label class="label">Nama</label>
                  <div class="control">
                    <input
                      class="input is-rounded"
                      type="text"
                      v-model="rsvp.details.name"
                      placeholder="Nama"
                    />
                  </div>
                </div>
              </div>
              <div v-show="!getStatusHidePax(rsvp.status)" class="column is-4">
                <div class="field">
                  <label class="label">Pax</label>
                  <div class="control">
                    <div
                      class="dropdown"
                      :class="{ 'is-active': showPaxDropdown }"
                      style="width: 100%"
                    >
                      <div class="dropdown-trigger" style="width: 100%">
                        <button
                          class="button is-rounded"
                          aria-haspopup="true"
                          aria-controls="dropdown-menu"
                          style="width: 100%; justify-content: start"
                          @click="showPaxDropdown = true"
                        >
                          <span>{{ rsvp.details.pax }}</span>
                          <span class="icon is-small">
                            <i class="fas fa-angle-down" aria-hidden="true"></i>
                          </span>
                        </button>
                      </div>
                      <div
                        class="dropdown-menu"
                        id="dropdown-menu"
                        role="menu"
                        style="min-width: 100%"
                      >
                        <div
                          class="dropdown-content"
                          style="max-height: 150px; overflow: hidden auto"
                        >
                          <a
                            v-for="i in rsvpPax"
                            :key="i"
                            class="dropdown-item"
                            :class="{ 'is-active': i == rsvp.details.pax }"
                            @click="
                              rsvp.details.pax = i;
                              showPaxDropdown = false;
                            "
                          >
                            {{ i }}
                          </a>
                        </div>
                      </div>
                    </div>
                    <!-- <input
                      class="input is-rounded"
                      type="number"
                      v-model="rsvp.details.pax"
                      placeholder="Pax"
                    /> -->
                  </div>
                </div>
              </div>
            </div>

            <div class="columns">
              <div class="column">
                <div class="field">
                  <label class="label">Ucapan!</label>
                  <div class="control">
                    <input
                      class="input is-rounded"
                      type="text"
                      v-model="rsvp.details.wishes"
                      placeholder="Tahniah!"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              class="
                columns
                is-mobile
                has-text-centered has-text-wight-bold
                is-size-4
              "
            >
              <div class="column pointer no-select" @click.prevent="cancel()">
                Cancel
              </div>
              <div
                v-show="isValid"
                class="column pointer no-select"
                @click.prevent="confirm()"
              >
                Confirm
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
import { rsvpOptions, rsvpMaxPax } from "~/wedvite.config";

import { cloneDeep, sortBy } from "lodash";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      statusModal: false,
      detailsModal: false,
      showPaxDropdown: false,
      rsvp: {
        status: "",
        details: {
          name: "",
          pax: 1,
          wishes: "",
        },
      },
      myRsvp: { status: null },
      scrollPos: 0,
      rsvpOptions,
      rsvpMaxPax,
    };
  },
  computed: {
    ...mapState({
      theme: (state) => state.info.theme,
      dbRsvp: (state) => state.rsvp,
      countdownEnd: (state) => state.info.countdown_end,
      rsvp_section: (state) => state.info.rsvp_section,
      currentGuest: (state) => state.protected.currentGuest,
    }),
    ...mapGetters(["countRsvpStatus"]),
    sortedRsvp() {
      return sortBy(this.dbRsvp, "details.unix").reverse().slice(0, 10);
    },
    isValid() {
      return Boolean(this.rsvp.details.name && this.rsvp.details.pax > 0);
    },
    endDate() {
      return new Date() > new Date(this.countdownEnd);
    },
    rsvpPax() {
      return this.currentGuest?.pax || this.rsvpMaxPax;
    },
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
    try {
      this.myRsvp = JSON.parse(
        localStorage.getItem(`rsvp_${window.location.href}`)
      ) || { status: null };

      if (this.myRsvp.status) this.rsvp = cloneDeep(this.myRsvp);
    } catch (error) {}
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrollPos = window.scrollY;
    },
    ans(status) {
      if (this.getStatusHidePax(status)) {
        this.rsvp.details.pax = 1;
      }

      this.rsvp.status = status;
      this.statusModal = false;
      this.detailsModal = true;
    },
    cancel() {
      this.statusModal = false;
      this.detailsModal = false;
    },
    confirm() {
      this.detailsModal = false;
      this.statusModal = false;
      this.myRsvp = cloneDeep(this.rsvp);

      this.$store.dispatch("updateRsvp", this.rsvp);
    },
    getStatusClass(status) {
      return (
        this.rsvpOptions.find((e) => e.value === status)?.class || "is-light"
      );
    },
    getStatusHidePax(status) {
      return !!this.rsvpOptions.find((e) => e.value === status)?.hidePax;
    },
  },
  watch: {
    statusModal(val) {
      if (!val) this.showPaxDropdown = false;
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/scss/var.scss";

.section * {
  font-family: $primary-font !important;
}

section,
.text-confirm,
.label,
.title {
  color: unset !important;
}

.fa {
  margin: 0 0.5rem;
}

.recent-comments {
  margin-bottom: 1rem;
  & > .fa-comments {
    margin-right: 0.5rem;
  }
}

.message {
  margin-bottom: 1rem;
  & > .message-body {
    padding: 0.5rem 1rem;
    & > strong {
      margin-right: 0.5rem;
    }
  }
}

.more {
  margin-top: 1rem;
  // & > a {
  //   // text-decoration: underline !important;
  // }
}

.floating-container {
  position: fixed;
  width: 100%;
  padding: 0 10px;
  bottom: 60px;
  z-index: 99;
  // text-align: right;
  -webkit-transform: translateZ(1);
  background: transparent;
  .floating-button {
    cursor: pointer;
    z-index: 99;
    float: right;
    width: 60px;
    height: 60px;
    border-radius: 50px;
    text-align: center;
  }
}
</style>

