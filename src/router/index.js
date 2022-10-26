import { createRouter, createWebHistory } from "vue-router";
import Search from "@/views/Search.vue";
import WordPage from "@/views/WordPage.vue";
import History from "@/views/History.vue";
import Account from "@/views/Account.vue";

const routes = [
  {
    path: "/",
    name: "search",
    component: Search
  },
  {
    path: "/words/:simplified",
    name: "wordDetail",
    component: WordPage
  },
  {
    path: "/history",
    name: "history",
    component: History
  },
  {
    path: "/account",
    name: "account",
    component: Account
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
