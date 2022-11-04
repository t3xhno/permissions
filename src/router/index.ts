import {
  createRouter,
  RouteRecordRaw,
  createWebHistory,
} from "vue-router";
import { checkPermission } from "../components/common/permission/checkPermission";
// Components
const Home = () => import("../views/Home.vue");
const Admin = () => import("../views/Admin.vue");
const Moderator = () => import("../views/Moderator.vue");
const Forbidden = () => import("../views/Forbidden.vue");

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/forbidde",
    name: "Forbidden",
    component: Forbidden,
  },
  {
    path: "/moderator",
    name: "Moderator",
    component: Moderator,
    meta: {
      permission: {
        roles: ["moderator", "admin"],
        config: {
          noAccessRedirect: "/",
          debug: true,
        },
      },
    },
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: {
      permission: {
        roles: ["admin"],
        config: {
          type: "one-of",
          debug: true,
        },
      },
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  // to and from are both route objects. must call `next`.
  // If there are no permissions to check, proceed
  if (!to.meta.permission) return next();

  console.log("LOL: ", to.meta);

  const { roles = [], config = {} } = to.meta.permission;
  // If there are no roles, proceed
  if (!roles.length) return next();

  // Check if user should have access to the next page
  const hasAccess = checkPermission(roles, config);

  // Access granted
  if (hasAccess) return next();
  // Access denied
  next(to.meta.permission?.config.noAccessRedirect || "/forbidden");
})

export default router;