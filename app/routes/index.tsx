/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { createElement } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { BaseLayout, MainLayout, RootError } from "../components";

/**
 * Application routes
 * https://reactrouter.com/en/main/routers/create-browser-router
 */
export const router = createBrowserRouter([
  {
    path: "",
    element: <BaseLayout />,
    errorElement: <RootError />,
    children: [
      { path: "login", lazy: () => import("./login") },
      { path: "privacy", lazy: () => import("./privacy") },
      { path: "terms", lazy: () => import("./terms") },
    ],
  },
  {
    path: "",
    element: <MainLayout />,
    errorElement: <RootError />,
    children: [
      { index: true, element: <Navigate to="/today" replace /> },
      { path: "today", lazy: () => import("./dashboard") },
      { path: "cfp-study", lazy: () => import("./cfp-study") },
      { path: "case-studies", lazy: () => import("./case-studies") },
      { path: "boundaries", lazy: () => import("./boundaries") },
      { path: "ai-news", lazy: () => import("./ai-news") },
      { path: "mental-health", lazy: () => import("./mental-health") },
      { path: "weekly-reset", lazy: () => import("./weekly-reset") },
      { path: "messages", lazy: () => import("./messages") },
    ],
  },
]);

export function Router(): JSX.Element {
  return createElement(RouterProvider, { router });
}

// Clean up on module reload (HMR)
// https://vitejs.dev/guide/api-hmr
if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
