<template>
  <div>
    <vue-good-table
      id="guestlist-table"
      :columns="columns"
      :rows="guestlist"
      :line-numbers="true"
      :sort-options="sortOpts"
      :pagination-options="paginationOpts"
      theme="black-rhino"
      styleClass="vgt-table condensed bordered"
    >
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field == 'action'">
          <button
            class="button is-link is-small"
            @click.prevent.stop="openUpdateModal(props.row)"
          >
            Update
          </button>

          <button
            class="button is-danger is-small"
            @click.prevent.stop="doDeleteGuest(props.row)"
          >
            Delete
          </button>
        </span>

        <span
          v-else-if="props.column.field == 'tel'"
          style="display: flex; align-items: center"
        >
          <div>{{ props.row.tel }}</div>
          <a
            :href="formatWhatsappLink(props.row)"
            target="_blank"
            style="margin-left: 0.5rem; line-height: 1"
          >
            <fa :icon="['fab', 'whatsapp-square']" class="whatsapp" />
          </a>

          <a
            @click.prevent.stop="
              copyStringToClipboard(
                inviteText(props.row),
                'Invitation text copied!'
              )
            "
            class="pointer"
            style="margin-left: 0.5rem; line-height: 1"
          >
            <fa icon="copy" />
          </a>
        </span>

        <span v-else>{{ props.formattedRow[props.column.field] }}</span>
      </template>
    </vue-good-table>

    <Modal
      v-if="updatedData"
      v-model="updateModal"
      :title="`${!updatedData.id ? 'New' : 'Update'} Guest`"
      :btn-disabled="disableUpdateModalBtn"
      @on-confirm="doUpdateGuest()"
      @on-close="updatedData = null"
    >
      <div class="field">
        <label class="label">Guest</label>
        <div class="control">
          <input v-model="updatedData.guest" class="input" type="text" />
        </div>
      </div>

      <div class="field">
        <label class="label">Tel</label>
        <div class="control">
          <input v-model="updatedData.tel" class="input" type="number" />
        </div>
      </div>

      <div class="field">
        <label class="label">Pax</label>
        <div class="control">
          <input v-model="updatedData.pax" class="input" type="number" />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from "vuex";

import Modal from "~/components/Common/Modal";
import { VueGoodTable } from "vue-good-table";
import "vue-good-table/dist/vue-good-table.css";

export default {
  components: { Modal, VueGoodTable },
  data() {
    return {
      paginationOpts: {
        enabled: true,
        mode: "records",
        position: "bottom",
        nextLabel: "next",
        prevLabel: "prev",
        rowsPerPageLabel: "Per page",
        ofLabel: "of",
        pageLabel: "page", // for 'pages' mode
      },
      sortOpts: {
        enabled: true,
        initialSortBy: [{ field: "guest", type: "asc" }],
      },
      columns: [
        {
          label: "ID",
          field: "id",
          thClass: "has-text-centered id-col",
          tdClass: "has-text-left",
          filterOptions: {
            enabled: true,
          },
        },
        {
          label: "Guest",
          field: "guest",
          thClass: "has-textcentered guest-col",
          tdClass: "has-text-left",
          width: "300px",
          filterOptions: {
            enabled: true,
          },
        },
        {
          label: "Tel",
          field: "tel",
          type: "number",
          thClass: "has-text-centered tel-col",
          tdClass: "has-text-left",
          width: "200px",
          filterOptions: {
            enabled: true,
          },
        },
        {
          label: "Pax Allowed",
          field: "pax",
          type: "number",
          thClass: "has-text-centered pax-col",
          tdClass: "has-text-left",
          width: "120px",
          filterOptions: {
            enabled: true,
          },
        },
        {
          label: "Action",
          field: "action",
          type: "string",
          thClass: "has-text-right",
          tdClass: "has-text-right",
          sortable: false,
          width: "200px",
        },
        {
          label: "Timestamp",
          field: "details.unix",
          type: "number",
          hidden: true,
        },
      ],
      updatedData: null,
    };
  },
  computed: {
    ...mapState({
      invitationText: (state) => state.protected.invitationText,
      guestlist: (state) => state.protected.guestlist,
    }),
    disableUpdateModalBtn() {
      return !this.updatedData?.guest || !this.updatedData.tel;
    },
  },
  methods: {
    openUpdateModal(payload) {
      this.updatedData = {
        id: payload.id,
        guest: payload.guest,
        tel: payload.tel,
        pax: payload.pax,
      };
      this.updateModal = true;
    },
    doUpdateGuest() {
      console.log("doUpdateGuest", this.updatedData);
      this.$store.dispatch("protected/updateGuest", this.updatedData);

      this.$swal.fire({
        position: "top-end",
        icon: "success",
        text: `Guest successfully ${
          !this.updatedData.id ? "added" : "updated"
        }!`,
        showConfirmButton: false,
        timer: 3000,
      });
      this.updatedData = null;
      this.updateModal = false;
    },
    doDeleteGuest(payload) {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: `Delete "${payload.guest}" from guestlist`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          confirmButtonColor: "#f14668",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$store.dispatch("protected/deleteGuest", payload.id);
            this.$swal.fire({
              position: "top-end",
              icon: "success",
              text: "Guest successfully deleted!",
              showConfirmButton: false,
              timer: 3000,
            });
          }
        });
    },
    inviteText(payload) {
      const inviteUrl = `${window.location.origin}/guest/${payload.id}`;

      let text = this.invitationText.replace("{URL}", inviteUrl);
      text = text.replace("{GUEST}", payload.guest || "");
      return text;
    },
    formatWhatsappLink(payload) {
      return `https://wa.me/${payload.tel}?text=${encodeURIComponent(
        this.inviteText(payload)
      )}`;
    },
    copyStringToClipboard(str, notifyMessage) {
      // Create new element
      var el = document.createElement("textarea");
      // Set value (string to be copied)
      el.value = str;
      // Set non-editable to avoid focus and move outside of view
      el.setAttribute("readonly", "");
      el.style = { position: "absolute", left: "-9999px" };
      document.body.appendChild(el);
      // Select text inside element
      el.select();
      // Copy text to clipboard
      document.execCommand("copy");
      // Remove temporary element
      document.body.removeChild(el);

      console.log("Text copied! --------");
      console.log(str);
      console.log("-------- End copy");

      if (notifyMessage) {
        this.$swal.fire({
          position: "top-end",
          icon: "success",
          text: notifyMessage,
          showConfirmButton: false,
          timer: 3000,
        });
      }
    },
  },
};
</script>

<style lang="scss">
#guestlist-table {
  .guest-col {
    min-width: 300px;
  }
  .tel-col {
    min-width: 200px;
  }
  .pax-col {
    min-width: 120px;
  }
  .action-col {
    min-width: 200px;
  }

  .whatsapp {
    color: #25d366;
  }

  svg {
    font-size: 1.5em;
  }
}
</style>