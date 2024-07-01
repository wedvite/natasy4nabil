<template>
  <div>
    <div v-if="mode === 'addGuestlist'">
      <GuestlistForm @cancel="mode = 'index'" />
    </div>

    <div v-if="mode === 'setInvitationText'">
      <InvitationTextForm @cancel="mode = 'index'" />
    </div>

    <div v-show="mode === 'index'">
      <div class="box">
        <div class="box-title">
          <div class="has-text-right">
            <button
              type="button"
              class="button is-small is-success"
              @click.prevent.stop="mode = 'setInvitationText'"
            >
              Set
            </button>
          </div>
          <div class="title is-4">Invitation Text</div>
        </div>

        <div
          v-html="invitationText || '- Not set..'"
          class="invitation-text"
          :class="{ none: !invitationText }"
        ></div>
      </div>

      <div class="box">
        <div class="box-title">
          <div class="has-text-right">
            <button
              type="button"
              class="button is-small is-success"
              @click.prevent.stop="mode = 'addGuestlist'"
            >
              Add / Import
            </button>

            <button
              type="button"
              class="button is-small is-danger"
              @click.prevent.stop="deleteAllGuestlist()"
            >
              Clear All
            </button>
          </div>

          <div class="title is-4">Guestlist</div>
        </div>

        <Datatable />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import GuestlistForm from "./GuestlistForm.vue";
import InvitationTextForm from "./InvitationTextForm.vue";
import Datatable from "./Datatable.vue";

export default {
  components: { GuestlistForm, InvitationTextForm, Datatable },
  data() {
    return {
      mode: "index",
    };
  },
  computed: {
    ...mapState({
      invitationText: (state) => state.protected.invitationText,
      guestlist: (state) => state.protected.guestlist,
    }),
  },
  created() {
    this.$store.dispatch("protected/getProtectedInfo");
  },
  methods: {
    deleteAllGuestlist() {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: `Delete all from guestlist`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          confirmButtonColor: "#f14668",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$store.dispatch("protected/deleteGuest");

            this.$swal.fire({
              position: "top-end",
              icon: "success",
              text: "Item successfully deleted!",
              showConfirmButton: false,
              timer: 3000,
            });

            setTimeout(() => {
              window.location.reload(true);
            }, 3000);
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.box-title {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.invitation-text {
  border: 1px solid #dbdbdb;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  white-space: pre-line;

  &.none {
    color: #b5b5b5;
    font-style: italic;
  }
}
</style>