<template>
  <form @submit.prevent="handleSubmit">

    <div class="flex gap-2">
      <dropdown-component class="w-1/2" v-model="formData.education" :options="educationLevels" label="Education Level"
                          required/>
      <input-component class="w-1/2 text-sm" v-model="formData.Experience_in_Years" min="0" label="Years of Experience"
                       type="number"/>
    </div>

    <multiselect-component :list="this.skills" v-model="formData.Skill_Set"></multiselect-component>

    <div class="flex gap-2">
      <input-component class="w-1/2" label="Previous Employer" v-model="formData.previousEmployer"/>
      <input-component class="w-1/2" label="Current Job Title" v-model="formData.Current_Job_Title"/>
    </div>

    <dropdown-component :options="noticePeriods" label="Notice Period" v-model="formData.noticePeriod"/>

    <input-component label="Expected Salary" type="number" min="0" v-model="formData.Expected_Salary"/>

    <input-component label="Availability for Interview" type="datetime-local" v-model="formData.interviewAvailability"/>

    <dropdown-component :options="preferredLocations" label="Preferred Location" v-model="formData.preferredLocation"/>

    <textarea-component label="Cover Letter" v-model="formData.coverLetter"/>

    <dropdown-component :options="sourcesOfApplication" label="Source of Application" v-model="formData.Source"
                        required/>

    <div class="flex justify-between gap-4">
      <button
          @click.prevent="$emit('proceed', 0)"
          class="w-full py-2 text-white bg-gray-400 rounded-lg hover:bg-blue-600"
      >
        Back
      </button>

      <button
          type="submit"
          class="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Next
      </button>
    </div>
  </form>
</template>

<script>
import axios from "axios";
import DropdownComponent from "../form/DropdownComponent.vue";
import InputComponent from "../form/InputComponent.vue";
import MultiselectComponent from "../form/MultiselectComponent.vue";
import TextareaComponent from "../form/TextareaComponent.vue";
import apiClient from "../../apiClient";

export default {
  components: {TextareaComponent, MultiselectComponent, InputComponent, DropdownComponent},
  props: {
    formData: Object,
    position: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // localForm: {...this.formData},
      skills: [],
      educationLevels: [
        "High School",
        "Associate's Degree",
        "Bachelor's Degree",
        "Master's Degree",
        "Doctorate",
      ],
      noticePeriods: [
        "Immediate",
        "1 Week",
        "2 Weeks",
        "1 Month",
        "More than 1 Month",
      ],
      preferredLocations: [
        "New York",
        "San Francisco",
        "Chicago",
        "Austin",
        "Remote",
      ],
      sourcesOfApplication: [
        "Company Website",
        "LinkedIn",
        "Job Board",
        "Referral",
        "Other",
      ],
      formErrors: {},
    };
  },
  mounted() {
    apiClient.get(`positions/skills/${this.position}`)
        .then((response) => {
          this.skills = response.data;
        });
  },
  methods: {
    handleSubmit() {
      apiClient.post("stages/second", this.formData)
          .then((response) => {
            this.$emit("confirmForm");
          })
          .catch((data) => {
            const errors = data.response?.data?.errors;

            if (errors) {
              errors.forEach((error) => {
                this.formErrors[error.path] = error.msg;
              });
            }
          });
    },
  },
};
</script>
