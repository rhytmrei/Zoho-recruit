<template>
  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Skills
    </label>
    <div class="border border-gray-300 rounded-lg p-4 bg-white">
      <div class="flex flex-wrap gap-2 mb-4">
        <span
            v-for="(item, index) in modelValue"
            :key="index"
            class="flex items-center bg-green-200 px-3 py-1 rounded-lg text-sm"
        >
          {{ item }}
          <button
              @click="removeSkill(item)"
              class="ml-2 hover:text-blue-700"
          >
            &times;
          </button>
        </span>
      </div>

      <div class="flex flex-wrap gap-2 mb-4">
        <span
            v-for="item in availableItems"
            :key="item"
            class="flex items-center bg-blue-100 px-3 py-1 rounded-lg text-sm"
        >
          {{ item }}
          <button
              @click="toggleSkill(item)"
              class="ml-2 hover:underline"
          >
            &#43;
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    availableItems() {
      return this.list.filter(
          (lang) => !this.modelValue.includes(lang)
      );
    },
  },
  methods: {
    toggleSkill(skill) {
      if (this.modelValue.includes(skill)) {
        this.removeSkill(skill);
      } else {
        this.addSkill(skill);
      }
    },
    addSkill(skill) {
      const updatedSkills = [...this.modelValue, skill];
      this.$emit("update:modelValue", updatedSkills);
    },
    removeSkill(skill) {
      const updatedSkills = this.modelValue.filter((s) => s !== skill);
      this.$emit("update:modelValue", updatedSkills);
    },
  },
};
</script>
