import { ADMIN_PAGES } from "@/config/pages/admin.config";
import { PUBLIC_PAGES } from "@/config/pages/public.config";
import { UserRole } from "@/services/auth/auth.types";
import { createBrowserRouter } from "react-router-dom";
import { AdminPage } from "./admin/Users/Admin";
import { LoginPage } from "./auth/login/Login";
import { DashboardPage } from "./dashboard/Dashboard";
import { HomePage } from "./home/Home";
import { ManagerPage } from "./manager/Manger";
import { PlansPage } from "./plans/Plans";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { RedirectIfAuth } from "./RedirectIfAuth";
import AirlineTable from "./user/UserSession";
import Sessions from "./admin/Sessions/Sessions";
import { Schedules } from "./admin/Schedules/Schedules";
import { SchedulesToBook } from "./admin/SchedulesToBook/SchedulesToBook";
import Survey from "./admin/Survey/Survey";
import PurchaseAmenities from "./admin/PurchaseAmenities/PurchaseAmenities";
import AmenitiesReport from "./admin/AmenitiesReport/AmenitiesReport";

export const router = createBrowserRouter([
  {
    element: <RedirectIfAuth />,
    children: [
      {
        path: PUBLIC_PAGES.LOGIN,
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: ADMIN_PAGES.SESSION_ERRORS,
        element: <Sessions />,
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: ADMIN_PAGES.MANAGE_SCHEDULES,
        element: <Schedules />,
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: ADMIN_PAGES.AMENITIES_REPORTS,
        element: <AmenitiesReport />,
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: ADMIN_PAGES.BOOK_SCHEDULES,
        element: <SchedulesToBook />,
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: ADMIN_PAGES.SURVEY_STATS,
        element: <Survey />,
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: ADMIN_PAGES.PURCHASE_AMENITIES,
        element: <PurchaseAmenities />,
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: ADMIN_PAGES.HOME,
        element: <AdminPage />,
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/manager",
        element: <ManagerPage />,
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: PUBLIC_PAGES.PLANS,
    element: <PlansPage />,
  },
  {
    path: PUBLIC_PAGES.SESSIONS_TABLE,
    element: <AirlineTable />,
  },
  {
    path: "*",
    element: <div>404 not found!</div>,
  },
]);
