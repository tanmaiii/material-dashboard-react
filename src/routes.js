/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Billing from "layouts/billing";
import Dashboard from "layouts/dashboard";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import RTL from "layouts/rtl";
import Tables from "layouts/tables";
import TodoList from "layouts/todo-list";
import UserTables from "layouts/user-tables";

// @mui icons
import Icon from "@mui/material/Icon";
import UserApi from "layouts/user-api";

// Protected routes - require authentication
const protectedRoutes = [
  {
    type: "collapse",
    name: "Todo List",
    key: "todo-list",
    icon: <FormatListBulletedIcon fontSize="small" />,
    route: "/todo-list",
    component: <TodoList />,
    protected: true,
  },
  {
    type: "collapse",
    name: "User Tables",
    key: "user-tables",
    icon: <AccountCircleIcon fontSize="small" />,
    route: "/user-tables",
    component: <UserTables />,
    protected: true,
  },
  {
    type: "collapse",
    name: "User API",
    key: "user-api",
    icon: <AccountCircleIcon fontSize="small" />,
    route: "/user-api",
    component: <UserApi />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
    protected: true,
  },
  {
    type: "collapse",
    name: "RTL",
    key: "rtl",
    icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    route: "/rtl",
    component: <RTL />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    protected: true,
  },
];

// Public routes - do not require authentication
// Use authenticatedRedirect: true to redirect authenticated users away from these pages
const publicRoutes = [
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
    protected: false,
    authenticatedRedirect: true, // Redirect authenticated users away from this page
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
    protected: false,
    authenticatedRedirect: true, // Redirect authenticated users away from this page
  },
];

// Combine all routes
const routes = [...protectedRoutes, ...publicRoutes];

export default routes;
