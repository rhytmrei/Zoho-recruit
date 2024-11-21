<template>
  <div class="p-6">
    <ol class="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
      <li
          v-for="(step, index) in steps"
          :key="index"
          :class="[
              'flex items-center',
              index !== steps.length - 1 && 'stepper'
          ]"
      >
        <span
            :class="[
            'flex items-center',
            index <= currentStage ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-400',
            index === currentStage ? 'font-bold' : ''
          ]"
        >
          <check-mark v-if="index < currentStage"/>
          {{ step }}
        </span>
      </li>
    </ol>
    <div class="mt-8">
      <Stage1
          v-if="currentStage === 0"
          :formData="stage1Data"
          @proceed="goToStage"
      />
      <Stage2
          v-if="currentStage === 1"
          :formData="stage2Data"
          :position="stage1Data.position"
          @confirmForm="confirmForm"
          @proceed="goToStage"
          @updateSkills="clearStage2Skills"
      />
      <div v-if="currentStage === 2">
        <h2 class="text-xl font-semibold text-gray-700">Confirmation</h2>
        <p>Your form has been submitted successfully!</p>
      </div>
    </div>
  </div>
</template>

<script>
import CheckMark from "../svg/CheckMark.vue";
import Stage1 from "./Stage1.vue";
import Stage2 from "./Stage2.vue";
import apiClient from "../../apiClient";

export default {
  components: {CheckMark, Stage1, Stage2},
  data() {
    return {
      steps: ["Candidate Information", "Professional Details", "Confirmation"],
      currentStage: 0,
      stage1Data: {
        First_Name: "",
        Last_Name: "",
        Email: "",
        Phone: "",
        currentAddress: "",
        Date_of_Birth: "",
        position: "",
        resume: null,
        LinkedIn__s: "",
      },
      stage2Data: {
        education: "",
        Experience_in_Years: 0,
        Skill_Set: [],
        previousEmployer: "",
        Current_Job_Title: "",
        noticePeriod: "Immediate",
        Expected_Salary: 0,
        interviewAvailability: "",
        preferredLocation: "",
        coverLetter: "",
        Source: "",
      },
      initialForm: {},
    };
  },
  computed: {
    fullFormData() {
      return {...this.stage1Data, ...this.stage2Data};
    },
    isFormDirty() {
      return JSON.stringify(this.stage1Data) !== JSON.stringify(this.initialForm);
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isFormDirty) {
      return next();
    }

    const answer = window.confirm("You have unsaved changes. Are you sure want to leave?");

    if (answer) {
      next();
    } else {
      if (next)
        next(false);
    }
  },
  created() {
    window.addEventListener('beforeunload', this.showConfirm);

    this.initialForm = JSON.parse(JSON.stringify(this.stage1Data));
  },
  methods: {
    async confirmForm() {
      const formData = new FormData();

      formData.append('resume', this.stage1Data.resume);

      const dataWithoutResume = { ...this.fullFormData };
      delete dataWithoutResume.resume;

      formData.append('data', JSON.stringify(dataWithoutResume));

      apiClient.post('stages/confirm', formData)
        .then(response => {
          this.initialForm = this.stage1Data;

          window.removeEventListener('beforeunload', this.showConfirm);

          this.$emit('refresh-forms')

          this.goToStage(2);
        })
        .catch(error => {
          console.error(error);
        });
    },
    clearStage2Skills() {
      this.stage2Data.skills = [];
    },
    showConfirm(e) {
      if (this.isFormDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    },
    goToStage(index) {
      if (this.currentStage < this.steps.length - 1 && index <= this.steps.length - 1) {
        this.currentStage = index;
      }
    },
  },
};
</script>
