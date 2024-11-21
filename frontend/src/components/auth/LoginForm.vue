<template>
  <form>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Login</label>
      <input
          type="text"
          v-model="form.login"
          class="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your login"
          required
      />
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Password</label>
      <input
          type="password"
          v-model="form.password"
          class="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your password"
          required
      />
    </div>

    <button
        type="submit"
        class="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
    >
      Login
    </button>
  </form>
</template>

<script>
export default {
  props: {
    form: Object,
    errors: Array,
  }
}
</script>
