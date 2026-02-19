import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/startseite/startseite.tsx"),
  route("shop", "routes/shop/shop.tsx"),

  route("admin", "routes/admin/index.tsx"),
  route("admin/add-product", "routes/admin/add-product.tsx"),
  route("admin/delete-product", "routes/admin/delete-product.tsx"),

  route("tracks", "routes/Bahnen/bahnen.tsx"),
  route("tracks/:id", "routes/Bahnen/track.tsx"),

  route("login", "routes/login/login.tsx"),

  route("register", "routes/login/register.tsx"),

  route("account", "routes/account/account.tsx"),


] satisfies RouteConfig;
