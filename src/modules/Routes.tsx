export const ROUTES = {
    START: "/",
    HOME: "/cards",
  }
  export type RouteKeyType = keyof typeof ROUTES;
  export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    START: "Старт",
    HOME: "Карты",
  };