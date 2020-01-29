<template>
  <section id="social-section" class="section">
    <div class="social">
      <div class="level is-mobile" v-if="s.ig_tags">
        <div class="level-item is-narrow">
          <figure>
            <img src="~assets/icons/ig.png" width="30">
          </figure>
        </div>
        <div class="level-item">
          <p>
            <span class="tag-heading tag-title">
              <a
                :href="'https://www.instagram.com/explore/tags/' + s.ig_tags"
                target="_blank"
                class="has-text-link"
              >#{{s.ig_tags}}</a>
            </span>
            <span class="tag-heading signature is-block-mobile">Our Wedding Signature</span>
          </p>
        </div>
      </div>
      <div class="level is-mobile" v-if="s.fb_page">
        <div class="level-item is-narrow">
          <figure>
            <img src="~assets/icons/fb.png" width="30">
          </figure>
        </div>
        <div class="level-item">
          <p>
            <span class="tag-heading tag-title">
              <a
                :href="s.fb_page.link"
                target="_blank"
                class="has-text-link is-capitalized"
              >{{s.fb_page.title || 'Our Facebook Page'}}</a>
            </span>
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="s.images && s.images.length"
      :data-autoplay="s.carouselAutoplay === false ? false : true"
      class="carousel carousel-animated carousel-animate-slide"
    >
      <div class="carousel-container">
        <div v-for="(img, index) in s.images" :key="index" class="carousel-item has-background">
          <img class="is-background" :src="img.src" alt width="640" height="310">
          <div v-if="img.htmlTitle" class="title" v-html="img.htmlTitle"></div>
        </div>
      </div>
      <div class="carousel-navigation is-overlay">
        <div class="carousel-nav-left">
          <fa icon="chevron-left"></fa>
        </div>
        <div class="carousel-nav-right">
          <fa icon="chevron-right"></fa>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import bulmaAccordion from "bulma-carousel/dist/js/bulma-carousel.min.js";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      s: state => state.info.social_section
    })
  },
  mounted() {
    bulmaAccordion.attach();
  }
};
</script>


<style lang="scss" scoped>
@import "~assets/scss/var.scss";
@import "bulma-carousel/dist/css/bulma-carousel.min.css";

#social-section {
  padding: 1rem 0;
  // margin-bottom: 3rem;
}

.social {
  padding: 0 1.5rem;
  margin-bottom: 1rem;
}
.ig-icon {
  margin-bottom: 0.5rem;
}

.tag-heading {
  font-family: $secondary-font;
  // margin-bottom: 1rem;

  &.tag-title {
    font-weight: bold;
    font-size: 1.2rem;
  }

  &.signature {
    font-size: 0.9rem;
  }
}

.carousel-item .title {
  padding: 0.5rem 1rem !important;
  font-family: $secondary-font;
}

/* .photo {
  margin: 1.5rem 0;
} */
</style>
