<template>
  <div class="flex bg-gray-100">
    <aside class="self-start sticky top-0 col-span-1 h-screen bg-white shadow-lg overflow-y-auto">
      <div class="sticky top-0 bg-white shadow p-4 z-10">
        <button
            @click="createNewForm"
            class="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          + Create New Form
        </button>
      </div>
      <ul class="divide-y">
        <li
            v-for="form in forms"
            :key="form.id"
            :class="[
            'p-4 cursor-pointer hover:bg-blue-100',
            isActiveForm(form.id) ? 'bg-blue-100' : ''
          ]"
            @click="selectForm(form.id)"
        >
          <div class="font-medium text-gray-800">{{ form.title }}</div>
          <div class="text-sm text-gray-600">{{ form.date }}</div>
        </li>
      </ul>
    </aside>

    <main class="flex-1 flex items-center justify-center p-6">
      <div class="bg-white shadow-lg rounded-lg w-full max-w-4xl">
        <router-view @refresh-forms="updateList"></router-view>
      </div>
    </main>
  </div>
</template>

<script>
import apiClient from "../../apiClient";

export default {
  data() {
    return {
      forms: [],
    };
  },
  methods: {
    updateList() {
      apiClient.get('applications/list').then(response => {
        const applicants = response?.data;

        const formattedApplicants = applicants?.map(applicant => ({
          id: applicant.id,
          title: `${applicant.full_name} - ${applicant.position}`,
          date: new Date(applicant.created_at).toISOString().split('T')[0],
        }));

        this.forms = formattedApplicants;
      });
    },
    selectForm(id) {
      this.$router.push(`/view/${id}`);
    },
    createNewForm() {
      this.$router.push("/new");
    },
    isActiveForm(id) {
      return parseInt(this.$route.params.id) === id;
    },
  },
  mounted() {
    this.updateList();
  },
};
</script>
