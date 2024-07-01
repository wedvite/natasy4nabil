<template>
	<section id="social-section" class="section">
		<div class="social">
			<div class="level is-mobile" v-if="formattedIgTags">
				<div data-aos="zoom-in" class="level-item">
					<figure style="margin-right: 0.75rem">
						<img src="~assets/icons/ig.png" width="30" />
					</figure>
					<span class="tag-heading tag-title">
						<a
							:href="
								'https://www.instagram.com/explore/tags/' +
								formattedIgTags
							"
							target="_blank"
							class="has-text-link"
							>#{{ s.ig_tags }}</a
						>
					</span>
					<span
						v-if="s.ig_signature"
						class="tag-heading signature is-block-mobile"
						style="margin-left: 0.75rem"
						>{{ s.ig_signature }}</span
					>
				</div>
			</div>
			<div class="level is-mobile" v-if="s.fb_page">
				<div data-aos="zoom-in" class="level-item">
					<figure style="margin-right: 0.75rem">
						<img src="~assets/icons/fb.png" width="30" />
					</figure>
					<span class="tag-heading tag-title">
						<a
							:href="s.fb_page.link"
							target="_blank"
							class="has-text-link is-capitalized"
							>{{ s.fb_page.title || "Our Facebook Page" }}</a
						>
					</span>
				</div>
			</div>
		</div>

		<div
			ref="carousel"
			id="imagesCarousel"
			data-aos="zoom-in"
			v-if="s.images && s.images.length"
			class="carousel carousel-animated carousel-animate-slide"
		>
			<div class="carousel-container">
				<div
					v-for="(img, index) in s.images"
					:key="index"
					class="carousel-item has-background"
				>
					<img
						class="is-background"
						:src="img.src"
						alt
						width="640"
						height="310"
					/>
					<div
						v-if="img.htmlTitle"
						class="title"
						v-html="img.htmlTitle"
					></div>
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
			s: (state) => state.info.social_section,
		}),
		formattedIgTags() {
			return this.s?.ig_tags?.toLowerCase() || "";
		}
	},
	mounted() {
		bulmaAccordion.attach("#imagesCarousel", {
			autoplay: this.s?.carouselAutoplay === false ? false : true,
		});
	},
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
	font-family: $primary-font;
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
	font-family: $primary-font;
}

/* .photo {
  margin: 1.5rem 0;
} */
</style>
