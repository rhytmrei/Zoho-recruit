<template>
  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div
        class="w-full py-9 my-2 bg-gray-50 rounded-2xl border border-gray-300 border-dashed"
        @dragover.prevent
        @drop.prevent="handleDrop"
    >
      <div class="grid gap-3">
        <file-icon />
        <div class="grid gap-1">
          <h4 class="text-center text-gray-900 text-sm font-medium leading-snug">
            Drag a file here
          </h4>
          <span
              class="text-center text-gray-400 text-xs font-light leading-4"
          >
            OR
          </span>
          <div class="flex items-center justify-center">
            <label>
              <input
                  type="file"
                  hidden
                  :accept="accept"
                  @change="handleFileChange"
              />
              <div class="file-input-button">
                Choose File
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div v-if="file" class="mt-4">
      <p class="text-sm text-gray-700">Selected File: {{ file.name }}</p>
      <button
          @click="removeFile"
          class="text-sm text-red-500 hover:underline"
      >
        Remove
      </button>
    </div>
    <p v-if="error" class="text-sm text-red-500 mt-2">{{ error }}</p>
  </div>
</template>

<script>
import FileIcon from "../svg/FileIcon.vue";

export default {
  components: {FileIcon},
  props: {
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Object, // Файл або null
      default: null,
    },
    accept: {
      type: String,
      default: "*",
    },
    error: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      file: this.modelValue,
    };
  },
  methods: {
    handleFileChange(event) {
      const selectedFile = event.target.files[0];

      console.log(selectedFile)
      if (selectedFile) {
        this.file = selectedFile;
        // this.modelValue = selectedFile;

        console.log("Selected file:", selectedFile); // Перевірка файлу
        this.$emit("update:modelValue", selectedFile);

        // console.log( this.$emit("update:modelValue", selectedFile) );
        //
        // console.log(this.modelValue)
      }
    },
    handleDrop(event) {
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile) {
        this.file = droppedFile;
        this.$emit("update:modelValue", droppedFile);
      }
    },
    removeFile() {
      this.file = null;
      this.$emit("update:modelValue", null);
    },
  },
};
</script>
