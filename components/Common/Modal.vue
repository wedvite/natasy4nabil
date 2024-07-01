<template>
  <div class="modal" :class="{ 'is-active': show }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <button
          class="delete"
          aria-label="close"
          @click="closeModal()"
        ></button>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
        <slot />
      </section>
      <footer class="modal-card-foot" style="justify-content: end">
        <button class="button" @click="closeModal()">Cancel</button>
        <slot name="confirm">
          <button
            class="button is-success"
            @click="$emit('on-confirm')"
            :disabled="btnDisabled"
          >
            Save
          </button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  model: { prop: "value", event: "update" },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "title",
    },
    btnDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("update", v);
      },
    },
  },
  methods: {
    closeModal() {
      this.show = false;
      this.$emit("on-close");
    },
  },
};
</script>

<style>
</style>