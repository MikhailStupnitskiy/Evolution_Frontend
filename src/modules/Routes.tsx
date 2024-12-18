export const ROUTES = {
  START: "/",
  HOME: "/cards",
  REGISTER: "/register",
  AUTHORIZATION: "/auth",
  PROFILE: "/profile",
  BASKET: "/basket",
  REQUESTS: "/requests"
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
  START: "Старт",
  HOME: "Карты",
  REGISTER: "Страница регистрации",
  AUTHORIZATION: "Страница авторизации",
  PROFILE: "Профиль",
  BASKET: "Ход",
  REQUESTS: "Заявки"
};