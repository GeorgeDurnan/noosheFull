import './App.css';
import {Users} from "./components/pages/dashboard-pages/users/users"
import { Root } from './components/root';
import { ProtectedRoute } from './components/protected_route';
import { createRoutesFromElements, Route, RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
import { Dashboard } from './components/pages/dashboard';
import { Error } from './components/pages/error';
import { Login } from './components/pages/login';
import { Profile } from './components/pages/dashboard-pages/profile';
import { Products } from './components/pages/dashboard-pages/products/products';
const appRouter = createBrowserRouter(createRoutesFromElements(<>
  <Route path="/" element={<Root />}>
    {/* Public Route */}
    <Route index element={<Login />} />

    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="users" element={<Users />} />
      <Route path="products" element={<Products />} />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Error />} />
  </Route>
</>))
function App() {
  return (
    <RouterProvider router={appRouter} />
  );
}

export default App;
