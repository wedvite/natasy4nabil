<template>
  <section class="hero has-background-grey-lighter">
    <div class="hero-body">
      <div class="container">
        <div class="box">
          <tree-view :data="i" :options="options"></tree-view>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { fireStore, userData as data } from "../wedvite.config";
import Vue from "vue";
import TreeView from "vue-json-tree-view";
Vue.use(TreeView);

import { mapState } from "vuex";

export default {
  data() {
    return {
      options: {
        // maxDepth: 4,
        rootObjectKey: fireStore.doc,
        link: true,
        modifiable: false
      }
    };
  },
  computed: {
    ...mapState({
      i: state => state.dbInfo
    })
  },
  async created() {
    try {
      // let data = await window.fetch(jsonDb).then(res => res.json());
      // let { data } = await this.$axios.get(jsonDb);
      this.$store.dispatch("getDBInfo", data);
    } catch (error) {
      this.$router.push("/404");
      console.log(error);
    }
  }
};
</script>


<style>
.tree-view-item-value {
  color: blue;
}
</style>

<style scoped>
section {
  height: 100%;
  min-height: 100vh;
}
@media only screen and (max-width: 768px) {
  .hero-body {
    padding: 0.5rem;
  }
}
</style>


