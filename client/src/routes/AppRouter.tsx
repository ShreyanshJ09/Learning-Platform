import { Route, Routes } from "react-router-dom";

import LandingPage from "@/pages/LandingPage";
import { paths } from "@/routes/paths";

/**
 * Application route tree.
 * Auth guards, AppShell, and lazy pages are added in later phases.
 */
export function AppRouter() {
  return (
    <Routes>
      <Route path={paths.landing} element={<LandingPage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
