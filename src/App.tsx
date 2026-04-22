import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import HowToVideos from "./pages/HowToVideos";
import PlumbingServices from "./pages/PlumbingServices";
import HeatingServices from "./pages/HeatingServices";
import Services from "./pages/Services";
import TestimonialsPage from "./pages/TestimonialsPage";
import AboutUs from "./pages/AboutUs";
import WorkOrderForm from "./pages/WorkOrderForm";
import CustomerSurveyForm from "./pages/CustomerSurveyForm";
import FreeEstimateForm from "./pages/FreeEstimateForm";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import ProjectsGallery from "./pages/ProjectsGallery";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CouponPage from "./pages/CouponPage";
import SurveyThankYouCoupon from "./pages/SurveyThankYouCoupon";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import Financing from "./pages/Financing";
import Sitemap from "./pages/Sitemap";
import GoogleTagManager from "./components/GoogleTagManager";
import CookieConsent from "./components/CookieConsent";
import LiveChatEmbed from "./components/LiveChatEmbed";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GoogleTagManager />
          <CookieConsent />
          <LiveChatEmbed />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/plumbing-services" element={<PlumbingServices />} />
            <Route path="/heating-services" element={<HeatingServices />} />
            <Route path="/how-to-videos" element={<HowToVideos />} />
            <Route path="/reviews" element={<TestimonialsPage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/work-order" element={<WorkOrderForm />} />
            <Route path="/customer-survey" element={<CustomerSurveyForm />} />
            <Route path="/free-estimate" element={<FreeEstimateForm />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/projects-gallery" element={<ProjectsGallery />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/tenpercent-coupon" element={<CouponPage />} />
            <Route path="/survey-thank-you" element={<SurveyThankYouCoupon />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/financing" element={<Financing />} />
            <Route path="/sitemap" element={<Sitemap />} />
            {/* Old URL redirects */}
            <Route path="/authorized-navien-dealer" element={<Navigate to="/heating-services" replace />} />
            <Route path="/big-city-plumbing-heating/navien-group1" element={<Navigate to="/heating-services" replace />} />
            <Route path="/big-city-plumbing-heating" element={<Navigate to="/" replace />} />
            <Route path="/stay-warm-with-a-complete-boiler-checkup/boilers2" element={<Navigate to="/heating-services" replace />} />
            <Route path="/stay-warm-with-a-complete-boiler-checkup" element={<Navigate to="/heating-services" replace />} />
            <Route path="/plumbing-repair-service-and-installations" element={<Navigate to="/plumbing-services" replace />} />
            <Route path="/who-we-are" element={<Navigate to="/about-us" replace />} />
            <Route path="/estimate-form" element={<Navigate to="/free-estimate" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
