<template>
  <div class="mb-4 ">
    <label
        :class="[
            'block text-sm font-medium',
            error ? 'text-red-500' : 'text-gray-700'
        ]"
    >
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :class="[
        'w-full px-4 py-2 mt-1 border rounded-lg',
        error
          ? 'border-red-500 text-red-500 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
      ]"
        :required="required"
        v-bind="$attrs"
    />
    <p v-if="error" class="text-sm text-red-500 mt-2">{{ error }}</p>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "text",
    },
    error: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
};
</script>