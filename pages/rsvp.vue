<template>
  <div class="container">
    <div class="section">
      <h1 class="title">
        RSVP
        <a
          @click="$router.go(-1)"
          class="button is-text is-pulled-right is-shadowless"
          >Kembali</a
        >
      </h1>
    </div>
    <nav class="level is-mobile">
      <div
        v-for="(opt, index) in rsvpOptions"
        :key="index"
        class="level-item has-text-centered"
      >
        <div>
          <p class="heading">{{ opt.value }}</p>
          <p class="title">{{ countRsvpStatus(opt.value) }}</p>
        </div>
      </div>
    </nav>
    <vue-good-table
      id="rsvp-table"
      :columns="columns"
      :rows="dbRsvp"
      :line-numbers="true"
      :sort-options="sortOpts"
      :pagination-options="paginationOpts"
      theme="nocturnal"
      styleClass="vgt-table condensed bordered"
    >
      <template slot="table-row" slot-scope="props">
        <span
          v-if="props.column.field == 'status'"
          class="tag status"
          :class="getStatusClass(props.row.status)"
          >{{ props.row.status }}</span
        >

        <span v-else>{{ props.formattedRow[props.column.field] }}</span>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import { userData as data, rsvpOptions } from "~/wedvite.config";

import { VueGoodTable } from "vue-good-table";
import "vue-good-table/dist/vue-good-table.css";
import { mapState, mapGetters } from "vuex";

export default {
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
        initialSortBy: [
          { field: "details.unix", type: "desc" },
          { field: "details.formattedDate", type: "desc" },
        ],
      },
      columns: [
        {
          label: "Nama",
          field: "details.name",
          thClass: "has-textcentered name-col",
          tdClass: "has-text-left",
          width: "200px",
          filterOptions: {
            enabled: true,
          },
        },
        {
          label: "Ucapan",
          field: "details.wishes",
          thClass: "has-text-centered wishes-col",
          tdClass: "has-text-left",
          width: "300px",
          filterOptions: {
            enabled: true,
          },
        },
        {
          label: "Pax",
          field: "details.pax",
          type: "number",
          width: "60px",
          thClass: "has-text-centered",
          tdClass: "has-text-centered",
        },
        {
          label: "Status",
          field: "status",
          type: "string",
          thClass: "has-text-centered",
          tdClass: "has-text-centered",
          width: "100px",
          filterOptions: {
            enabled: true,
            placeholder: "All",
            filterDropdownItems: rsvpOptions.map((e) => e.value),
            filterFn: this.statusFilter,
          },
        },
        {
          label: "Created At",
          field: "details.formattedDate",
          type: "string",
          thClass: "has-text-centered",
          tdClass: "has-text-centered",
          width: "170px",
          //   dateInputFormat: "epoch",
          //   dateOutputFormat: "MMM Do YY"
        },
        {
          label: "Timestamp",
          field: "details.unix",
          type: "number",
          hidden: true,
        },
      ],
      rows: [],
      rsvpOptions,
    };
  },
  components: {
    VueGoodTable,
  },
  computed: {
    ...mapState({
      dbRsvp: (state) => state.rsvp,
    }),
    ...mapGetters(["countRsvpStatus"]),
  },
  async created() {
    // console.log(data);
    try {
      // let data = await window.fetch(jsonDb).then(res => res.json());
      // let { data } = await this.$axios.get(jsonDb);
      this.$store.dispatch("getInfo", { info: data });
    } catch (error) {
      this.$store.dispatch("getInfo", { info: undefined, lang: "ms" });
    }
  },
  methods: {
    statusFilter(data, fString) {
      return data === fString;
    },
    getStatusClass(status) {
      return (
        this.rsvpOptions.find((e) => e.value === status)?.class || "is-light"
      );
    },
  },
};
</script>

<style lang="scss">
#rsvp-table {
  .wishes-col {
    min-width: 300px;
  }
  .name-col {
    min-width: 150px;
  }
}
</style>

<style scoped>
.container {
  padding: 0;
}
.section {
  padding: 1.5rem;
}

@media only screen and (min-width: 768px) {
  .container {
    padding: 1rem;
  }
  .section {
    padding: 1.5rem 0;
  }
}

/* .tag.status {
  width: 100%;
} */
</style>


