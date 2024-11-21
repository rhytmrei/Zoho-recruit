<template>
  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        :rows="rows"
        :required="required"
        v-bind="$attrs"
    ></textarea>
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
    required: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: Number,
      default: 4,
    },
  },
};
</script>
