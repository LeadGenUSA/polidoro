import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import GoogleAnalytics from "./components/GoogleAnalytics";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GoogleAnalytics />
          <CookieConsent />
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
