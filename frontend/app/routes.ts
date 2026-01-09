import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/startseite/startseite.tsx"),
    route("shop", "routes/shop/shop.tsx"),
    route("admin/add-product", "routes/admin/add-product.tsx"),
    route("tracks", "routes/Bahnen/bahnen.tsx"),  
    
] satisfies RouteConfig;
