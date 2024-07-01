<template>
  <div>
    <Navbar />

    <div class="container">
      <section class="user-content">
        <nuxt v-if="user" />
      </section>
    </div>
  </div>
</template>

<script>
import Navbar from "./user/Navbar.vue";
import { mapState } from "vuex";
export default {
  components: { Navbar },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },
};
</script>

<style lang="scss">
.user-content {
  padding: 2rem 1rem;
}

@media only screen and (min-width: 1024px) {
  .user-content {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>