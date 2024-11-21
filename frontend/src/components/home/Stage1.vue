<template>
  <form @submit.prevent="handleSubmit">
    <div class="flex gap-2">
      <input-component
          class="w-1/2 inline-block"
          label="First Name"
          :error="formErrors.First_Name"
          required
          v-model="formData.First_Name"
      />

      <input-component
          class="w-1/2 inline-block"
          label="Last Name"
          :error="formErrors.Last_Name"
          required
          v-model="formData.Last_Name"
      />
    </div>

    <input-component
        label="Email Address"
        type="email"
        :error="formErrors.Email"
        required
        v-model="formData.Email"
    />

    <input-component
        label="Phone Number"
        :error="formErrors.Phone"
        required
        v-model="formData.Phone"
    />

    <textarea-component
        label="Current Address"
        v-model="formData.currentAddress"
    />

    <input-component
        label="Date of Birth"
        type="date"
        v-model="formData.Date_of_Birth"
        required
        :max="new Date().toISOString().substring(0, 10)"
    />

    <dropdown-component
        label="Position Applied For"
        v-model="formData.position"
        :options="positionsList"
        @change="handlePositionChange"
        required
    />

    <file-component
        label="Resume/CV Upload"
        v-model="formData.resume"
        accept=".pdf,.doc,.docx"
        :error="formErrors.resume"
    />

<!--    !!!!!!! required ^^^   -->

    <input-component
        label="LinkedIn Profile"
        type="url"
        v-model="formData.LinkedIn__s"
    />

    <button
        type="submit"
        class="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
    >
      Next
    </button>
  </form>
</template>

<script>

import InputComponent from "../form/InputComponent.vue";
import TextareaComponent from "../form/TextareaComponent.vue";
import DropdownComponent from "../form/DropdownComponent.vue";
import FileComponent from "../form/FileComponent.vue";
import apiClient from "../../apiClient";

export default {
  components: {FileComponent, DropdownComponent, TextareaComponent, InputComponent},
  props: {
    formData: Object,
  },
  data() {
    return {
      positionsList: [],
      formErrors: {},
    };
  },
  mounted() {
    apiClient.get("positions/all")
        .then((response) => {
          this.positionsList = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
  },
  methods: {
    handlePositionChange() {
      // Виклик події для очищення skills у stage2Data
      this.$emit("updateSkills");
    },
    handleSubmit() {

      apiClient.post("stages/first", this.formData)
          .then((response) => {
            this.$emit("proceed", 1);
          })
          .catch((data) => {
            data.response.data.errors.forEach((error) => {
              this.formErrors[error.path] = error.msg;
            });
          });
    },
  },
};
</script>
