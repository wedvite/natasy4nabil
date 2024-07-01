<template>
  <form @submit.prevent="setInvitationText()">
    <div class="field has-text-right">
      <button
        type="button"
        class="button is-small is-light"
        @click.prevent="$emit('cancel')"
      >
        Cancel
      </button>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Invitation Text</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <textarea
              class="textarea"
              rows="10"
              v-model="form.inviteText"
              placeholder="Invite Text (Optional)"
            />
          </div>
          <div class="help has-text-grey">
            {URL} will be replaced with actual wedding link, {GUEST} will be replaced with actual guest text (if any)
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal" style="margin-top: 1.5rem">
      <div class="field-label">
        <!-- Left empty for spacing -->
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <button
              type="submit"
              class="button is-success"
              :disabled="formDisable"
            >
              Set Invitation Text
            </button>
            <button
              type="button"
              class="button is-text"
              @click.prevent="resetForm()"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { mapState } from "vuex";
import { cloneDeep } from "lodash";

export default {
  data() {
    return {
      form: {
        inviteText: "",
      },
    };
  },
  created() {
    this.defaultForm = Object.freeze({ ...this.form });
    this.form.inviteText =
      cloneDeep(this.invitationText) ||
      "With great pleasure, we're inviting \n\n{GUEST}\n\nto join in the celebration of the marriage of our family members. \n\n{URL}\n\nThank you";
  },
  computed: {
    ...mapState({
      invitationText: (state) => state.protected.invitationText,
    }),
    formDisable() {
      return !this.form.inviteText;
    },
  },
  methods: {
    resetForm() {
      this.form = { ...this.defaultForm };
    },
    setInvitationText() {
      this.$store.dispatch("protected/setInvitationText", this.form.inviteText);
      this.$swal.fire({
        position: "top-end",
        icon: "success",
        text: "Invitation text successfully set!",
        showConfirmButton: false,
        timer: 3000,
      });
      this.resetForm();
      this.$emit("cancel");
    },
  },
};
</script>

<style>
</style>