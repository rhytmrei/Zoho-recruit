<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg w-full max-w-md">
      <div class="flex justify-around border-b">
        <button
            class="w-1/2 py-2 text-center text-gray-600 hover:text-blue-500 border-b-2 transition-all"
            :class="activeTab === 'login' ? 'border-blue-500 text-blue-500' : 'border-transparent'"
            @click="switchTab('login')"
        >
          Login
        </button>
        <button
            class="w-1/2 py-2 text-center text-gray-600 hover:text-blue-500 border-b-2 transition-all"
            :class="activeTab === 'register' ? 'border-blue-500 text-blue-500' : 'border-transparent'"
            @click="switchTab('register')"
        >
          Register
        </button>
      </div>

      <div class="p-6">
        <div v-if="errors.length" class="mb-4 text-sm text-red-500">
          <ul>
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
          </ul>
        </div>
        <LoginForm
            v-if="activeTab === 'login'"
            :form="loginForm"
            @submit.prevent="handleLogin"
        />
        <RegisterForm
            v-if="activeTab === 'register'"
            :form="registerForm"
            @submit.prevent="handleRegister"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import LoginForm from "@/components/auth/LoginForm.vue";
import RegisterForm from "@/components/auth/RegisterForm.vue";

export default {
  data() {
    return {
      activeTab: "login",
      loginForm: {
        login: "",
        password: "",
      },
      registerForm: {
        login: "",
        password: "",
      },
      errors: [],
    };
  },
  components: {
    LoginForm,
    RegisterForm,
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
      this.errors = [];
    },
    handleLogin() {
      axios.post('http://localhost:5050/auth/login', this.loginForm)
          .then((res) => {
            const token = res.data.token;
            if (token) {
              localStorage.setItem('jwt_token', token);
              this.$router.push('/');
            } else {
              this.errors = ["Authentication token is missing in response"];
            }
          })
          .catch((err) => {
            const errors = err.response?.data?.error;
            if (errors) {
              this.errors = [errors];
            } else {
              this.errors = ["An unexpected error occurred."];
            }
          });
    },
    handleRegister() {
      axios.post('http://localhost:5050/auth/register', this.registerForm)
          .then((res) => {
            this.switchTab('login');
          })
          .catch((err) => {
            const errors = err.response?.data?.error;
            if (errors) {
              this.errors = typeof errors === 'string' ? [errors] : errors;
            } else {
              this.errors = ["An unexpected error occurred."];
            }
          });
    }
  },
};
</script>
