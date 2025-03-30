import {useLocalStorage} from "@vueuse/core";
import { defineStore } from "pinia";

const store = defineStore("user", {
  state: () => ({
    token: useLocalStorage("token", ""),
    role: useLocalStorage("role", ""),
    isAuthenticated: useLocalStorage("isAuthenticated", false),
    id: useLocalStorage("id", "")
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    setRole(role) {
      this.role = role;
    },
    setIsAuthenticated(isAuthenticated) {
      this.isAuthenticated = isAuthenticated;
    },
    setId(id) {
      this.id = id;
    }
  },
  getters: {
    getIsAuthenticated: state => state.isAuthenticated,
    getToken: state => state.token,
    getRole: state => state.role,
    getId: state => state.id
  }
})

export default store;
