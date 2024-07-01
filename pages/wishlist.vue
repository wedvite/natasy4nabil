<template>
  <div id="wishlist-page" class="container">
    <div class="section">
      <h1 class="title">
        Wishlist
        <a
          @click="$router.go(-1)"
          class="button is-text is-pulled-right is-shadowless"
          >Kembali</a
        >
      </h1>
    </div>

    <wishlist show-all hide-title />
  </div>
</template>

<script>
import Wishlist from "~/components/Wishlist";

export default {
  components: { Wishlist },
};
</script>
