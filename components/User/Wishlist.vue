<template>
  <div>
    <vue-good-table
      id="wishlist-table"
      :columns="columns"
      :rows="wishlist"
      :line-numbers="true"
      :sort-options="sortOpts"
      :pagination-options="paginationOpts"
      theme="black-rhino"
      styleClass="vgt-table condensed bordered"
    >
      <template slot="table-actions">
        <div class="field is-grouped" style="padding: 0.5rem">
          <div class="control">
            <div class="file is-small">
              <label class="file-label">
                <input
                  ref="fileupload"
                  class="file-input"
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  @change="onFileChange"
                />
                <span class="file-cta">
                  <span class="file-icon">
                    <fa icon="upload" />
                  </span>
                  <span class="file-label"> Import (.csv) </span>
                </span>
              </label>
            </div>
          </div>

          <div class="control">
            <button
              class="button is-success is-small"
              @click.prevent.stop="
                openUpdateModal({
                  item: '',
                  sponsoredBy: '',
                })
              "
            >
              Add
            </button>
          </div>

          <div class="control">
            <button
              class="button is-danger is-small"
              @click.prevent.stop="deleteAllWishList()"
            >
              Clear All
            </button>
          </div>
        </div>
      </template>

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
            @click.prevent.stop="deleteList(props.row)"
          >
            Delete
          </button>
        </span>

        <span v-else>{{ props.formattedRow[props.column.field] }}</span>
      </template>
    </vue-good-table>

    <Modal v-model="addModal" title="Import Wishlist (.csv)">
      <div>
        <table class="table is-bordered is-narrow is-hoverable is-fullwidth">
          <tbody>
            <tr v-for="(list, index) in importedData" :key="index">
              <td>{{ list.item }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <template slot="confirm">
        <button class="button is-success" @click="doSaveWishlist()">
          Save Wishlist ({{ importedData.length }})
        </button>
      </template>
    </Modal>

    <Modal
      v-if="updatedData"
      v-model="updateModal"
      :title="`${!updatedData.id ? 'New' : 'Update'} List`"
      :btn-disabled="disableUpdateModalBtn"
      @on-confirm="doUpdateWishlist()"
      @on-close="updatedData = null"
    >
      <div class="field">
        <label class="label">Item</label>
        <div class="control">
          <input v-model="updatedData.item" class="input" type="text" />
        </div>
      </div>

      <div class="field">
        <label class="label">Sponsored By</label>
        <div class="control">
          <input v-model="updatedData.sponsoredBy" class="input" type="text" />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "~/components/Common/Modal";
import { VueGoodTable } from "vue-good-table";
import "vue-good-table/dist/vue-good-table.css";

import { mapState } from "vuex";
import * as XLSX from "xlsx/xlsx.mjs";

export default {
  components: {
    Modal,
    VueGoodTable,
  },
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
        initialSortBy: [{ field: "item", type: "asc" }],
      },
      columns: [
        {
          label: "Item",
          field: "item",
          thClass: "has-textcentered item-col",
          tdClass: "has-text-left",
          width: "200px",
          filterOptions: {
            enabled: true,
          },
        },
        {
          label: "Sponsored By",
          field: "sponsoredBy",
          thClass: "has-text-centered sponsor-col",
          tdClass: "has-text-left",
          width: "200px",
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
          width: "160px",
        },
        {
          label: "Timestamp",
          field: "details.unix",
          type: "number",
          hidden: true,
        },
      ],
      addModal: false,
      updateModal: false,
      importedData: [],
      updatedData: null,
    };
  },
  created() {
    this.$store.dispatch("wishlist/getWishlist");
  },
  computed: {
    ...mapState({
      wishlist: (state) => state.wishlist.list,
    }),
    disableUpdateModalBtn() {
      return !this.updatedData?.item;
    },
  },
  methods: {
    openUpdateModal(payload) {
      this.updatedData = {
        id: payload.id,
        item: payload.item,
        sponsoredBy: payload.sponsoredBy || "",
      };
      this.updateModal = true;
    },
    deleteAllWishList() {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: `Delete all from wishlist`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          confirmButtonColor: "#f14668",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$store.dispatch("wishlist/deleteList");
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
    deleteList(payload) {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: `Delete "${payload.item}" from wishlist`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          confirmButtonColor: "#f14668",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$store.dispatch("wishlist/deleteList", payload.id);
            this.$swal.fire({
              position: "top-end",
              icon: "success",
              text: "Item successfully deleted!",
              showConfirmButton: false,
              timer: 3000,
            });
          }
        });
    },
    doSaveWishlist() {
      this.$store.dispatch("wishlist/importWishlist", this.importedData);
      this.$swal.fire({
        position: "top-end",
        icon: "success",
        text: "Wishlist successfully imported!",
        showConfirmButton: false,
        timer: 3000,
      });
      this.importedData = [];
      this.addModal = false;
    },
    doUpdateWishlist() {
      this.$store.dispatch("wishlist/updateList", this.updatedData);
      this.$swal.fire({
        position: "top-end",
        icon: "success",
        text: `Wishlist successfully ${
          !this.updatedData.id ? "added" : "updated"
        }!`,
        showConfirmButton: false,
        timer: 3000,
      });
      this.updatedData = null;
      this.updateModal = false;
    },
    onFileChange(oEvent) {
      let oFile = oEvent.target.files[0];
      if (!oFile) return;

      this.importedData = [];
      let reader = new FileReader();

      let self = this;
      reader.onload = function (e) {
        let data = e.target.result;
        data = new Uint8Array(data);
        let workbook = XLSX.read(data, { type: "array" });
        // console.log(workbook);
        let result = {};
        workbook.SheetNames.forEach(function (sheetName) {
          let roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            raw: true,
          });
          if (roa.length) result[sheetName] = roa;
        });
        // see the result, caution: it works after reader event is done.
        self.importedData = Object.values(result)[0].reduce((out, e) => {
          // let TEL = String(e.TEL).replace(/\D/g, "");
          // TEL = TEL[0] === "6" ? TEL : `6${TEL}`;
          if (e.WISHLIST) {
            out.push({ item: e.WISHLIST });
          }

          return out;
        }, []);

        self.$refs.fileupload.value = null;

        if (!self.importedData.length) {
          self.$swal.fire({
            position: "top-end",
            icon: "error",
            text: "No wishlist found from imported file! Please ensure file is following correct column format. (WISHLIST)",
            // showConfirmButton: false,
            // timer: 3000,
          });
          return;
        }
        self.addModal = true;
      };
      reader.readAsArrayBuffer(oFile);
    },
  },
};
</script>

<style lang="scss">
#wishlist-table {
  .item-col,
  .sponsor-col {
    min-width: 200px;
  }
  .action-col {
    min-width: 160px;
  }
}
</style>