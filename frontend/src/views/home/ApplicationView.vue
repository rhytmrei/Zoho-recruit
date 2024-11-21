<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Applicant Details</h2>
    <div class="space-y-4">
      <p><span class="font-medium text-gray-700">Name:</span> {{ applicant.first_name }} {{ applicant.last_name }}</p>
      <p><span class="font-medium text-gray-700">Email:</span> {{ applicant.email }}</p>
      <p><span class="font-medium text-gray-700">Phone:</span> {{ applicant.phone }}</p>
      <p><span class="font-medium text-gray-700">Position:</span> {{ applicant.position }}</p>
      <p><span class="font-medium text-gray-700" v-html="'Education: ' + applicant.education"></span></p>
      <p><span class="font-medium text-gray-700">Experience:</span> {{ applicant.experience_in_years }} years</p>
      <p><span class="font-medium text-gray-700">Skills:</span> {{ applicant.skill_set?.join(", ") }}</p>
      <p><span class="font-medium text-gray-700">Expected Salary:</span> ${{ applicant.expected_salary }}</p>
      <p><span class="font-medium text-gray-700">Date of Birth:</span> {{ formatDate(applicant.date_of_birth) }}</p>
      <p><span class="font-medium text-gray-700">Preferred Location:</span> {{ applicant.preferredlocation }}</p>
      <p>
        <span class="font-medium text-gray-700">Interview Availability:</span>
        {{ formatDateTime(applicant.interviewavailability) || "Not provided" }}
      </p>
      <p><span class="font-medium text-gray-700">Notice Period:</span> {{ applicant.noticeperiod }}</p>
      <p><span class="font-medium text-gray-700">Source:</span> {{ applicant.source }}</p>
      <p>
        <span class="font-medium text-gray-700">Application Submitted:</span>
        {{ formatDateTime(applicant.created_at) }}
      </p>
    </div>
  </div>
</template>

<script>
import apiClient from "../../apiClient";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      applicant: {},
    };
  },
  mounted() {
    this.getApplication();
  },
  watch: {
    'id': function () {
      this.getApplication();
    }
  },
  methods: {
    getApplication() {
      apiClient.get('applications/get?id=' + this.id)
          .then(response => {
            this.applicant = response.data;
          })
          .catch(error => {
            this.$router.push('/');
          });
    },
    formatDate(date) {
      if (!date) return "Not provided";
      return new Date(date).toLocaleDateString();
    },
    formatDateTime(datetime) {
      if (!datetime) return "Not provided";
      return new Date(datetime).toLocaleString();
    }
  }
};
</script>
