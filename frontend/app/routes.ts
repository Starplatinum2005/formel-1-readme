import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/startseite/startseite.tsx"),
    route("shop", "routes/shop/shop.tsx"),
    route("admin/add-product", "routes/admin/add-product.tsx"),
    route("tracks", "routes/Bahnen/bahnen.tsx"),
    route("tracks/:id", "routes/Bahnen/track.tsx"),
    
] satisfies RouteConfig;
