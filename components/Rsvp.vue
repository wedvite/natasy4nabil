<template>
  <section class="section">
    <div class="level is-mobile">
      <div class="level-item has-text-centered">
        <div>
          <p class="title">{{countRsvpStatus("Going")}}</p>
          <p class="heading" :class="'txt-dark-' + theme">Going</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title">{{countRsvpStatus("Maybe")}}</p>
          <p class="heading" :class="'txt-dark-' + theme">Maybe</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title">{{countRsvpStatus("Not Going")}}</p>
          <p class="heading" :class="'txt-dark-' + theme">Not Going</p>
        </div>
      </div>
    </div>

    <div class="section is-borderless" :class="{'is-paddingless': !myRsvp.status && endDate}">
      <div v-if="!myRsvp.status && !endDate" class="buttons is-centered no-select">
        <button
          class="button is-rounded is-large"
          :class="'bg-' + theme"
          @click.prevent="statusModal = !statusModal"
        >
          <span class="text-confirm is-size-6">Confirm Attandance</span>
        </button>
      </div>
      <div v-if="myRsvp.status">
        <div class="field is-grouped is-grouped-multiline is-grouped-centered">
          <div class="control">
            <div class="tags has-addons">
              <span class="tag is-dark">Status</span>
              <span
                class="tag"
                :class="{
                    'is-success': myRsvp.status === 'Going', 
                    'is-link': myRsvp.status === 'Maybe', 
                    'is-warning': myRsvp.status === 'Not Going'
                }"
              >{{myRsvp.status}}</span>
            </div>
          </div>

          <div class="control">
            <div class="tags has-addons">
              <span class="tag is-dark">Pax</span>
              <span class="tag is-primary">{{myRsvp.details.pax}}</span>
            </div>
          </div>
        </div>

        <article v-if="myRsvp.details.wishes" class="message">
          <div class="message-body">
            <strong>My message:</strong>
            {{myRsvp.details.wishes}}
          </div>
        </article>
      </div>
    </div>

    <!-- Recent comments -->
    <h1
      v-show="this.dbRsvp.length"
      class="is-size-4 has-text-weight-bold recent-comments"
      :class="'txt-dark-' + theme"
    >
      <fa icon="comments"></fa>Recent Comments...
    </h1>
    <article class="media" v-for="(i, index) in sortedRsvp" :key="index">
      <div class="media-content">
        <div class="content is-marginless">
          <div>
            <strong>{{i.details.name}}</strong>
            <small v-if="i.details.formattedDate">@ {{i.details.formattedDate}}</small>
            <div v-if="i.details.wishes" style="word-break: break-all;">{{i.details.wishes}}</div>
          </div>
        </div>
      </div>
    </article>

    <div class="buttons is-centered more">
      <a class="has-text-link pointer" href="./rsvp/">All RSVP...</a>
    </div>

    <!-- rsvp status -->
    <div class="modal modal-fx-slideBottom modal-pos-bottom" :class="{'is-active' : statusModal}">
      <div class="modal-background" @click.prevent="statusModal = !statusModal"></div>
      <div class="modal-content">
        <div class="box is-size-5" :class="'bgi-' + theme">
          <div class="level is-mobile pointer no-select" @click.prevent="ans('Going')">
            <div class="level-item is-narrow">
              <fa icon="smile-wink" class="fa fa-2x"></fa>
            </div>
            <div class="level-item">Going</div>
          </div>

          <div class="level is-mobile pointer no-select" @click.prevent="ans('Maybe')">
            <div class="level-item is-narrow">
              <fa icon="meh" class="fa fa-2x"></fa>
            </div>
            <div class="level-item">Maybe</div>
          </div>

          <div class="level is-mobile pointer no-select" @click.prevent="ans('Not Going')">
            <div class="level-item is-narrow">
              <fa icon="frown" class="fa fa-2x"></fa>
            </div>
            <div class="level-item">Not Going</div>
          </div>
        </div>
      </div>
    </div>

    <!-- rsvp details -->
    <div class="modal modal-fx-slideBottom modal-pos-bottom" :class="{'is-active' : detailsModal}">
      <div class="modal-background" @click.prevent="detailsModal = !detailsModal"></div>
      <div class="modal-content">
        <div class="box" :class="'bgi-' + theme">
          <h1 class="title is-3">{{rsvp.status}}</h1>
          <div class="columns is-mobile">
            <div class="column">
              <div class="field">
                <label class="label">Name</label>
                <div class="control">
                  <input
                    class="input is-rounded"
                    type="text"
                    v-model="rsvp.details.name"
                    placeholder="Name"
                  >
                </div>
              </div>
            </div>
            <div v-show="rsvp.status !== 'Not Going'" class="column is-4">
              <div class="field">
                <label class="label">Pax</label>
                <div class="control">
                  <input
                    class="input is-rounded"
                    type="number"
                    v-model="rsvp.details.pax"
                    placeholder="Pax"
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Wishes!</label>
                <div class="control">
                  <input
                    class="input is-rounded"
                    type="text"
                    v-model="rsvp.details.wishes"
                    placeholder="Congrats!"
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="columns is-mobile has-text-centered has-text-wight-bold is-size-4">
            <div class="column pointer no-select" @click.prevent="cancel()">Cancel</div>
            <div
              v-show="isValid"
              class="column pointer no-select"
              @click.prevent="confirm()"
            >Confirm</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import _sortBy from "lodash.sortby";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      statusModal: false,
      detailsModal: false,
      rsvp: {
        status: "",
        details: {
          name: "",
          pax: 1,
          wishes: ""
        }
      },
      myRsvp: { status: null }
    };
  },
  computed: {
    ...mapState({
      theme: state => state.info.theme,
      dbRsvp: state => state.rsvp,
      countdownEnd: state => state.info.countdown_end
    }),
    ...mapGetters(["countRsvpStatus"]),
    sortedRsvp() {
      return _sortBy(this.dbRsvp, "details.unix")
        .reverse()
        .slice(0, 10);
    },
    isValid() {
      return Boolean(this.rsvp.details.name && this.rsvp.details.pax > 0);
    },
    endDate() {
      return new Date() > new Date(this.countdownEnd)
    }
  },
  created() {
    try {
      this.myRsvp = JSON.parse(
        localStorage.getItem(`rsvp_${window.location.href}`)
      ) || {
        status: null
      };
    } catch (error) {}
  },
  methods: {
    ans(status) {
      this.rsvp.status = status;
      // this.statusModal = false;
      this.detailsModal = true;
    },
    cancel() {
      // this.statusModal = true;
      this.detailsModal = false;
    },
    confirm() {
      this.detailsModal = false;
      this.statusModal = false;
      this.myRsvp = this.rsvp;
      this.$store.dispatch("updateRsvp", this.rsvp);
    }
  },
  watch: {
    statusModal(val) {
      if (!val)
        this.rsvp = {
          status: "",
          details: {
            name: "",
            pax: 1,
            wishes: ""
          }
        };
    }
  }
};
</script>


<style lang="scss" scoped>
@import "~assets/scss/var.scss";

.section * {
  font-family: $secondary-font !important;
}

section,
.text-confirm,
.label,
.title,
.modal-content {
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
</style>

