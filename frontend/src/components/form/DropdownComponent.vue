<template>
  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        class="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        :required="required"
    >
      <option value="" disabled selected>Select an option</option>
      <option
          v-for="option in options"
          :key="option"
          :value="option"
      >
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
