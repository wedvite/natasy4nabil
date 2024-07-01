<template>
  <section
    data-aos="flip-left"
    data-aos-easing="ease-out-cubic"
    data-aos-offset="300"
    id="doa-section"
    class="section has-text-centered"
    v-html="doa.text"
  />
</template>


<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      doa: (state) => state.info.doa_section,
    }),
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/var.scss";
#doa-section {
  font-family: $primary-font;
  font-size: 1rem;
  font-style: italic;
  // font-weight: 300;
}
</style>

