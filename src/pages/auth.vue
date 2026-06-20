<template>
  <h2 class="text-center logo">Авторизація</h2>
  <v-row style="max-width: 500px; width: 100%; margin: 0 auto">
    <v-col cols="12">
      <v-card>
        <v-form class="auth-form" @submit="auth">
          <input
            placeholder="Ім'я:"
            class="auth-form-input"
            v-model="name"
            required
          />
          <input
            type="password"
            placeholder="Пароль:"
            class="mt-5 auth-form-input"
            v-model="password"
            required
          />
          <v-btn class="mt-5 bg-yellow-accent-4" type="submit">Вхід</v-btn>
          <v-alert v-if="errorMessage" class="bg-red text-center mt-5">
            {{ errorMessage }}
          </v-alert>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>
<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 500px;
  width: 95%;
  padding-top: 10px;
  padding-bottom: 10px;
}
.auth-form-input {
  border: 1px solid #000;
  border-radius: 5px;
  outline: none;
  padding: 5px;
}
.logo {
  margin-top: 100px;
  margin-bottom: 10px;
}
</style>
<script setup>
import Api from "@/lib/api.js";
import useUserStore from "../stores/user.js";

const userStore = useUserStore();

const name = ref("");
const password = ref("");
const errorMessage = ref("");

async function auth(e) {
  e.preventDefault();

  errorMessage.value = "";

  try {
    const response = await Api.post("/admin/auth", {
      name: name.value,
      password: password.value,
    });

    userStore.setRole(response.data.role);
    userStore.setToken(response.data.token);
    userStore.setIsAuthenticated(true);

    window.location.href = "/admin/orders";
  } catch (error) {
    errorMessage.value = error.response.data.message;
  }
}
</script>
