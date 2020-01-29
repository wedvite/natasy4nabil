<template>
  <section id="invitation" class="section has-text-centered">
    <div v-if="i.invitation_section.title" class="main-title">{{i.invitation_section.title}}</div>

    <div v-if="i.invitation_section.show_parents" class="parents">
      <div>{{i.parents.father.fullname}}</div>
      <div>&amp;</div>
      <div>{{i.parents.mother.fullname}}</div>
    </div>

    <div class="intro" v-html="i.invitation_section.text"></div>
    <div class="couples" :class="{'reverse': i.groom_or_bride_first === 'bride'}">
      <template v-if="i.invitation_section.couple_name_type === 'fullname'">
        <div v-html="i.groom.fullname"></div>
        <div class="amp">&amp;</div>
        <div v-html="i.bride.fullname"></div>
      </template>
      <template v-else>
        <div>{{i.groom.nickname}}</div>
        <div class="amp">&amp;</div>
        <div>{{i.bride.nickname}}</div>
      </template>
    </div>

    <div class="place">
      <strong>{{i.lang === 'en' ? 'Place': 'Tempat'}}</strong>
      <div v-html="i.address.exact_html"></div>
    </div>

    <div class="date">
      <strong>{{i.lang === 'en' ? 'Date': 'Tarikh'}}</strong>
      <div>{{i.date.greg}}</div>
      <div v-if="i.day">{{i.day}}</div>
    </div>

    <div class="time">
      <strong>{{i.lang === 'en' ? 'Time': 'Masa'}}</strong>
      <div>{{i.time.from}} - {{i.time.to}}</div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      i: state => state.info
    })
  },
  mounted() {
    let g = this.$route.query.g;
    if (g) {
      let el = document.getElementsByClassName('guest')[0];
      if (el) {
        el.innerHTML = g;
        el.classList.add("available");
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/var.scss";
#invitation {
  font-family: $secondary-font;
  // text-transform: uppercase;
}

.main-title {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.intro {
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.parents,
.couples {
  display: flex;
  flex-direction: column;
  font-size: 1.2rem;
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

.place,
.date,
.time {
  font-size: 0.9rem;
  margin-bottom: 1.5rem;

  & > div {
    font-size: 0.85rem;
  }
}
</style>

<style>
.guest.available {
  display: block;
  margin: 1rem 0;
  text-transform: capitalize;
  font-weight: bold;
  font-size: 1.2rem;
}
</style>


