<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
export default {
  mounted() {
    this.$nextTick(function () {
      try {
        AOS.init({ duration: 600, offset: 160 });
      } catch (error) {
        console.error(error);
      }
    });
  },
};
</script>

<style>
html {
  /* font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif; */
  /* font-size: 16px; */
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  position: relative;
  min-height: 100%;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

body {
  font-size: 1rem !important;
  font-weight: normal !important;
}
</style>
