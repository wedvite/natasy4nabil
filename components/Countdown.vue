<template>
  <section
    v-if="endDate"
    id="countdown-section"
    class="section has-text-centered"
  >
    <div data-aos="zoom-in" class="main-title" :class="'txt-dark-' + theme">
      Countdown
    </div>
    <div v-if="countEnd" class="tag is-success is-large">
      <p>{{ countdown_section.endText }} 🙂</p>
    </div>
    <nav v-if="!countEnd" class="level is-mobile">
      <div class="level-item has-text-centered">
        <div data-aos="flip-down" data-aos-duration="1000">
          <p class="title">
            {{ c.days }}
          </p>
          <p class="heading" :class="'txt-dark-' + theme">
            {{ countdown_section.days }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div data-aos="flip-down" data-aos-duration="1000">
          <p class="title">{{ c.hours }}</p>
          <p class="heading" :class="'txt-dark-' + theme">
            {{ countdown_section.hours }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div data-aos="flip-down" data-aos-duration="1000">
          <p class="title">{{ c.minutes }}</p>
          <p class="heading" :class="'txt-dark-' + theme">
            {{ countdown_section.minutes }}
          </p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div data-aos="flip-down" data-aos-duration="1000">
          <p class="title">{{ c.seconds }}</p>
          <p class="heading" :class="'txt-dark-' + theme">
            {{ countdown_section.seconds }}
          </p>
        </div>
      </div>
    </nav>
  </section>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      c: {
        days: "",
        hours: "",
        minutes: "",
        seconds: "",
      },
      endDate: "",
      countEnd: false,
    };
  },
  computed: {
    ...mapState({
      theme: (state) => state.info.theme,
      countdown_end: (state) => state.info.countdown_end,
      countdown_section: (state) => state.info.countdown_section,
    }),
  },
  created() {
    this.endDate = new Date(this.countdown_end.replace(/-/g, "/")).getTime();
    if (isNaN(this.endDate)) {
      return;
    }

    setInterval(this.calculate, 1000);
  },
  methods: {
    calculate() {
      let startDate = new Date();
      startDate = startDate.getTime();

      let timeRemaining = parseInt((this.endDate - startDate) / 1000);

      if (timeRemaining >= 0) {
        this.c.days = parseInt(timeRemaining / 86400);
        timeRemaining = timeRemaining % 86400;

        this.c.hours = parseInt(timeRemaining / 3600);
        timeRemaining = timeRemaining % 3600;

        this.c.minutes = parseInt(timeRemaining / 60);
        timeRemaining = timeRemaining % 60;

        this.c.seconds = parseInt(timeRemaining);
      } else {
        this.countEnd = true;
        return;
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/scss/var.scss";
.main-title {
  font-family: $countdown-font !important;
  font-size: 3.5rem;
  margin-bottom: 2rem;
  line-height: 1;
}

p.title,
p.heading,
.tag {
  font-family: $primary-font;
}
</style>




