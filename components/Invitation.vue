<template>
  <section id="invitation" class="section has-text-centered">
    <img
      data-aos="zoom-in"
      src="~/assets/images/bismillah.png"
      alt="bismillahirrahmanirrahim"
      style="height: 50px; margin-bottom: 1rem"
    />
    <!-- <img
			data-aos="zoom-in"
			src="~/assets/images/assalamualaikum-white.png"
			alt="assalamualaikum"
			style="width: 50%; margin-bottom: 0"
		/> -->
    <div>
      <div
        data-aos="zoom-in"
        v-if="i.invitation_section.title"
        class="main-title"
      >
        {{ i.invitation_section.title }}
      </div>

      <div v-if="i.invitation_section.show_parents" class="parents">
        <div data-aos="zoom-out-left" data-aos-duration="1000">
          {{ i.parents.name }}
        </div>
        <template v-if="i.parents.andWith">
          <div data-aos="zoom-in">&amp;</div>
          <div data-aos="zoom-out-right" data-aos-duration="1000">
            {{ i.parents.andWith }}
          </div>
        </template>
      </div>

      <div
        data-aos="zoom-in"
        class="intro"
        v-html="i.invitation_section.text"
      />

      <div
        class="couples"
        :class="{ reverse: i.groom_or_bride_first === 'bride' }"
      >
        <div
          :data-aos="
            i.groom_or_bride_first === 'bride' ? 'fade-left' : 'fade-right'
          "
          data-aos-duration="1000"
          v-html="i.groom[i.invitation_section.couple_name_type]"
        ></div>
        <div data-aos="zoom-in" class="amp">&amp;</div>
        <div
          :data-aos="
            i.groom_or_bride_first === 'groom' ? 'fade-left' : 'fade-right'
          "
          data-aos-duration="1000"
          v-html="i.bride[i.invitation_section.couple_name_type]"
        ></div>
      </div>

      <div class="date">
        <div data-aos="zoom-in" class="heading-1">
          {{ i.lang === "en" ? "on" : "Pada" }}
        </div>
        <!-- <div data-aos="zoom-in" class="intro-sub">on</div> -->
        <div data-aos="zoom-in" class="heading-2">{{ i.date.greg }}</div>
        <div data-aos="zoom-in" class="heading-2" v-if="i.day">
          {{ i.day }}
        </div>
      </div>

      <div class="time">
        <div data-aos="zoom-in" class="heading-1">
          {{ i.lang === "en" ? "from" : "Masa" }}
        </div>
        <!-- <div data-aos="zoom-in" class="intro-sub">at</div> -->
        <div data-aos="zoom-in" class="heading-2">
          {{ i.time.from }} - {{ i.time.to }}
        </div>
      </div>

      <div class="place">
        <div data-aos="zoom-in" class="heading-1">
          {{ i.lang === "en" ? "at" : "Bertempat di" }}
        </div>
        <!-- <div data-aos="zoom-in" class="intro-sub">at</div> -->
        <div
          data-aos="zoom-in"
          class="heading-2"
          v-html="i.address.exact_html"
        ></div>
      </div>

      <div class="surah">
        "Dan kami menciptakan kamu berpasang-pasangan."
        <br />QS: An-Naba (78:8)
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      i: (state) => state.info,
      theme: (state) => state.info.theme,
      currentGuest: (state) => state.protected.currentGuest,
    }),
  },
  mounted() {
    // const { g } = this.$route.query;
    // if (g) {
    //   let el = document.getElementsByClassName("guest")[0];
    //   if (el) {
    //     el.innerHTML = g;
    //     el.classList.add("available");
    //   }
    // }

    const { id } = this.$route.params;
    if (id) {
      this.$store.dispatch("protected/getGuestDetails", id);
    }
  },
  watch: {
    currentGuest: {
      handler(nv) {
        if (nv) {
          let el = document.getElementsByClassName("guest")[0];
          if (el) {
            el.innerHTML = nv.guest;
            el.classList.add("available");
            el.classList.add(this.theme);
          }
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/var.scss";
#invitation {
  font-family: $primary-font;
  // text-transform: uppercase;
}

.main-title {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.intro {
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  margin-left: auto;
  margin-right: auto;
}

@media only screen and (min-width: 520px) {
  .intro {
    width: 80%;
  }
}

.parents,
.couples {
  display: flex;
  flex-direction: column;
  font-size: 1.3rem;
  font-weight: bold;

  &.reverse {
    flex-direction: column-reverse;
  }

  & > .amp {
    font-size: 1rem;
  }
}

.parents {
  margin-bottom: 1.5rem;
}

.couples {
  margin-bottom: 2.5rem;
}

.parents,
.couples,
.guest {
  font-family: $secondary-font;
  text-transform: uppercase;
  font-weight: bold;
}

.place,
.date,
.time {
  font-size: 1rem;
  margin-bottom: 1.5rem;

  .heading-1 {
    font-size: 0.9rem;
  }

  .heading-2 {
    text-transform: uppercase;
    font-family: $primary-font;
    font-weight: bold;
    font-size: 1.2rem;
  }
}
</style>

<style lang="scss">
@import "~assets/scss/var.scss";
.guest.available {
  display: block;
  margin: 1rem 0;
  text-transform: uppercase;
  font-size: 1.3rem;
  font-weight: bold;
  font-family: $secondary-font;

  &.guest-box {
    padding: 0.5rem 1rem;
    border-radius: 10px;
    border: 1px solid #4a4a4a;
    word-wrap: break-word;
  }
}

.surah {
  margin-top: 4rem !important;
  font-size: 0.85rem;
  font-style: italic;
  margin: auto;
}
</style>


