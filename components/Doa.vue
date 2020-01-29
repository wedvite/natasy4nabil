<template>
  <section
    id="doa-section"
    class="section has-text-centered"
    v-html="doa.text"
  />
</template>


<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      doa: state=> state.info.doa_section
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/var.scss";
#doa-section {
  font-family: $secondary-font;
  font-size: 0.9rem;
  font-weight: 300;
}
</style>

