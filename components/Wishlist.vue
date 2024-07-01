<template>
  <section id="wishlist" class="section">
    <div
      data-aos="zoom-in"
      v-if="!hideTitle"
      class="main-title has-text-centered"
      :class="'txt-dark-' + theme"
    >
      Wishlist
    </div>

    <div class="is-italic has-text-centered" style="margin-bottom: 2rem">
      Ini adalah bertujuan untuk memberi beberapa idea jika anda tertanya-tanya apa yang boleh anda hadiahkan kepada kami. Tidak mengapa jika anda tidak merujuk kepada senarai ini dan ianya juga bukanlah perkara yang wajib untuk dilaksanakan.
    </div>

    <table
      data-aos="flip-up"
      data-aos-offset="200"
      class="table is-bordered is-narrow is-hoverable is-fullwidth"
    >
      <thead>
        <tr>
          <th class="has-background-light" style="width: 50%">ITEM</th>
          <th class="has-background-light" style="width: 50%">SPONSOR</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Have something else in mind?</b></td>
          <td>
            <button
                class="button is-small is-fullwidth bg-custom"
                @click.prevent="openSponsorModalNew()"
              >
                CLICK TO SPONSOR
              </button>
          </td>
        </tr>
        <tr v-for="list in filteredWishlist" :key="list.id">
          <td>{{ list.item }}</td>
          <td>
            <template v-if="list.sponsoredBy">
              {{ list.sponsoredBy }}
            </template>
            <template v-else>
              <button
                class="button is-small is-fullwidth bg-custom"
                @click.prevent="openSponsorModal(list)"
              >
                CLICK TO SPONSOR
              </button>
            </template>
          </td>
        </tr>
        <tr v-if="!filteredWishlist.length && !isLoading">
          <td colspan="2" class="has-text-centered">No data found!</td>
        </tr>
      </tbody>
    </table>

    <div
      data-aos="zoom-in"
      v-if="wishlist.length > filteredWishlist.length"
      class="buttons is-centered more"
    >
      <a class="has-text-link pointer no-select" href="/wishlist">
        Semua Wishlist
      </a>
    </div>

    <!-- sponsor modal -->
    <div
      v-if="(list && (list.byGuest || list.id))"
      class="modal modal-fx-slideBottom modal-pos-bottom"
      :class="{ 'is-active': sponsorModal }"
    >
      <div
        class="modal-background"
        @click.prevent="sponsorModal = !sponsorModal"
      ></div>
      <div class="modal-content">
        <div class="box" :class="'bgi-' + theme">
          <div v-show="list.item && list.id" class="title is-3">{{ list.item }}</div>

          <div v-show="list.byGuest" class="columns is-mobile">
            <div class="column">
              <div class="field">
                <label class="label">Hadiah</label>
                <div class="control">
                  <input
                    class="input is-rounded"
                    type="text"
                    v-model="list.item"
                    placeholder="Hadiah"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="columns is-mobile">
            <div class="column">
              <div class="field">
                <label class="checkbox">
                  <input v-model="list.anon" type="checkbox" />
                  Stay Anonymous
                </label>
              </div>
            </div>
          </div>
          <div v-show="!list.anon" class="columns is-mobile">
            <div class="column">
              <div class="field">
                <label class="label">Nama</label>
                <div class="control">
                  <input
                    class="input is-rounded"
                    type="text"
                    v-model="list.sponsoredBy"
                    placeholder="Nama"
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
</template>

<script>
import { mapState } from "vuex";
import { cloneDeep } from "lodash";

export default {
  props: {
    showAll: {
      type: Boolean,
      default: false,
    },
    hideTitle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: {
        anon: false,
        item: "",
        sponsoredBy: "",
      },
      selectedListIndex: null,
      sponsorModal: false,
    };
  },
  computed: {
    ...mapState({
      theme: (state) => state.info.theme,
      wishlist: (state) => state.wishlist.list,
      isLoading: (state) => state.wishlist.loading,
    }),
    isValid() {
      return Boolean((this.list.sponsoredBy || this.list.anon) && this.list.item);
    },
    filteredWishlist() {
      if (this.showAll) {
        return this.wishlist;
      }
      return this.wishlist.slice(0, 5);
    },
  },
  created() {
    try {
      const rsvpData = JSON.parse(
        localStorage.getItem(`rsvp_${window.location.href}`)
      );

      this.list.sponsoredBy = rsvpData?.details.name || "";
    } catch (error) {}

    this.initialList = cloneDeep(this.list);

    this.$store.dispatch("wishlist/getWishlist");
  },
  methods: {
    openSponsorModalNew() {
      this.list = cloneDeep({
        ...this.initialList,
        byGuest: true
      })
      this.sponsorModal = true;
    },
    openSponsorModal(list) {
      this.list = cloneDeep(this.wishlist.find((e) => e.id === list.id));
      this.sponsorModal = true;
    },
    cancel() {
      this.sponsorModal = false;
    },
    confirm() {
      this.sponsorModal = false;
      if (this.list.anon) {
        this.list.anon = false;
        this.list.sponsoredBy = "Anonymous";
      }

      // console.log(({
      //   ...this.list,
      //   sponsoredBy: this.list.sponsoredBy,
      // }));
      // return

      const list = cloneDeep({
        ...this.list,
        sponsoredBy: this.list.sponsoredBy,
      });

      this.$store.dispatch("wishlist/updateList", list);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/var.scss";

#wishlist {
  font-family: $primary-font;

  table {
    td,
    th {
      vertical-align: middle;
    }
  }

  .checkbox:hover,
  .radio:hover {
    color: unset !important;
  }
}

.section * {
  font-family: $primary-font !important;
}

section,
.text-confirm,
.label,
.title {
  color: unset !important;
}

.main-title {
  font-family: $countdown-font !important;
  font-size: 3.5rem;
  margin-bottom: 2rem;
  line-height: 1;
}
</style>