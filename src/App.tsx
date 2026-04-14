import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminLayout } from "@/components/AdminLayout";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Reviews from "./pages/Reviews";
import Analytics from "./pages/Analytics";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AdminLayout><Index /></AdminLayout>} />
          <Route path="/products" element={<AdminLayout><Products /></AdminLayout>} />
          <Route path="/categories" element={<AdminLayout><Categories /></AdminLayout>} />
          <Route path="/orders" element={<AdminLayout><Orders /></AdminLayout>} />
          <Route path="/customers" element={<AdminLayout><Customers /></AdminLayout>} />
          <Route path="/reviews" element={<AdminLayout><Reviews /></AdminLayout>} />
          <Route path="/analytics" element={<AdminLayout><Analytics /></AdminLayout>} />
          <Route path="/settings" element={<AdminLayout><SettingsPage /></AdminLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
