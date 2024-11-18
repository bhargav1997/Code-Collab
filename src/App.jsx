import React, { useEffect, useState, Suspense } from "react";
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useSelector, useDispatch } from "react-redux";

import { setUser, setLoading } from "./redux/user/userSlice";
import styles from "./styles/App.module.css";

// Import components
import Sidebar from "./components/Sidebar";
import Onboarding from "./components/Onboarding";
// import SidebarSkeleton from "./components/Sidebar/SidebarSkeleton";
import LoadingSpinner from "./components/LoadingSpinner";
import PropTypes from "prop-types";
import TwoFactorAuth from "./components/TwoFactorAuth/TwoFactorAuth";
// import { fetchConnections } from "./redux/user/userHandle";

// Lazy load other components
const Header = React.lazy(() => import("./components/Header"));
const Home = React.lazy(() => import("./components/Home"));
const Leaderboard = React.lazy(() => import("./components/Leaderboard"));
const Calendar = React.lazy(() => import("./components/Calendar"));
const Setting = React.lazy(() => import("./components/Setting"));
const Dashboard = React.lazy(() => import("./components/Dashboard"));
const Message = React.lazy(() => import("./components/Message"));
const Report = React.lazy(() => import("./components/Report/Report"));
const Privacy = React.lazy(() => import("./components/Privacy"));
const Register = React.lazy(() => import("./components/Register"));
const Login = React.lazy(() => import("./components/Login"));
const UserProfile = React.lazy(() => import("./components/UserProfile"));
const LearningJourney = React.lazy(() => import("./components/LearningJourney"));
const Challenges = React.lazy(() => import("./components/Challenges"));
const ChallengeDetails = React.lazy(() => import("./components/Challenges/ChallengeDetails"));
import { CONFIG } from "./config";
import withMobileRestriction from "./components/MobileRestriction/withMobileRestriction";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import LandingPage from "./components/LandingPage";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfUse from "./components/TermsOfUse";
import Guidelines from "./components/Guidelines";
import AboutMe from "./components/AboutMe";
import ScrollToTop from "./components/common/ScrollToTop";

function ErrorFallback({ error }) {
   return (
      <div role='alert'>
         <p>Something went wrong:</p>
         <pre>{error.message}</pre>
      </div>
   );
}

ErrorFallback.propTypes = {
   error: PropTypes.object.isRequired,
};

// Modify AppDesktop to use these new components
function AppDesktop() {
   const [showOnboarding, setShowOnboarding] = useState(false);
   const [isInitialized, setIsInitialized] = useState(false);
   const dispatch = useDispatch();
   const { user, isLoading } = useSelector((state) => state.user);
   const API_URL = CONFIG.API_URL;
   const isAuthenticated = !!user;

   useEffect(() => {
      const checkAuthStatus = async () => {
         dispatch(setLoading(true));
         const token = localStorage.getItem("token");
         if (token) {
            try {
               const response = await fetch(`${API_URL}/users/profile`, {
                  headers: {
                     Authorization: `Bearer ${token}`,
                  },
               });
               if (response.ok) {
                  const userData = await response.json();
                  dispatch(setUser(userData));
                  const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding");
                  if (!hasCompletedOnboarding || hasCompletedOnboarding !== "true") {
                     setShowOnboarding(true);
                  }
               } else {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  dispatch(setUser(null));
               }
            } catch (error) {
               console.error("Error verifying token:", error);
               dispatch(setUser(null));
            }
         } else {
            dispatch(setUser(null));
         }
         dispatch(setLoading(false));
         setIsInitialized(true);
      };

      checkAuthStatus();
   }, [dispatch]);

   const handleOnboardingComplete = () => {
      setShowOnboarding(false);
      localStorage.setItem("hasCompletedOnboarding", "true");
   };

   if (isLoading || !isInitialized) {
      return <LoadingSpinner />;
   }

   return (
      <Router>
         <ScrollToTop />
         <ErrorBoundary FallbackComponent={ErrorFallback}>
            <ToastContainer />
            <div className={styles.appContainer}>
               {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
               <div className={`${styles.appContent} ${showOnboarding ? styles.blurred : ""}`}>
                  {isAuthenticated && <aside className={styles.sidebar}>{<Sidebar />}</aside>}
                  <div className={`${styles.mainArea} ${isAuthenticated ? styles.withSidebar : ""}`}>
                     <Suspense fallback={<LoadingSpinner />}>
                        <Routes>
                           {/* Landing page */}
                           {/* {!isAuthenticated && <Route path='/' element={<LandingPage />} />} */}
                           <Route path='/register' element={isAuthenticated ? <Navigate to='/' /> : <Register />} />
                           <Route path='/login' element={isAuthenticated ? <Navigate to='/' /> : <Login />} />
                           <Route path='/two-factor-auth' element={isAuthenticated ? <Navigate to='/' /> : <TwoFactorAuth />} />
                           <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                           <Route path='/terms-of-use' element={<TermsOfUse />} />
                           <Route path='/guidelines' element={<Guidelines />} />
                           <Route path='/about-me' element={<AboutMe />} />
                           <Route path='/landing-page' element={<LandingPage />} />
                           {/* Protected routes */}
                           {isAuthenticated && (
                              <Route element={<AuthenticatedLayout />}>
                                 <Route path='/' element={<Home />} />
                                 <Route path='/dashboard' element={<Dashboard />} />
                                 <Route path='/leaderboard' element={<Leaderboard />} />
                                 <Route path='/learning-journey' element={<LearningJourney />} />
                                 <Route path='/message' element={<Message />} />
                                 <Route path='/calendar' element={<Calendar />} />
                                 <Route path='/privacy' element={<Privacy />} />
                                 <Route path='/report' element={<Report />} />
                                 <Route path='/user-profile' element={<UserProfile />} />
                                 <Route path='/setting' element={<Setting />} />
                                 <Route path='/two-factor-auth' element={<TwoFactorAuth />} />
                                 <Route path='/challenges' element={<Challenges />} />
                                 <Route path='/challenges/:id' element={<ChallengeDetails />} />
                              </Route>
                           )}

                           {/* {!isLoading && !isAuthenticated && <Route path='*' element={<Login />} />} */}

                           {/* Catch-all route */}
                           <Route path='*' element={<Navigate to='/login' replace />} />
                        </Routes>
                     </Suspense>
                  </div>
               </div>
            </div>
         </ErrorBoundary>
      </Router>
   );
}

function AuthenticatedLayout() {
   return (
      <>
         <header className={styles.header}>
            <Suspense fallback={<LoadingSpinner />}>
               <Header />
            </Suspense>
         </header>
         <main className={styles.content}>
            <Outlet />
            <Analytics />
            <SpeedInsights />
         </main>
      </>
   );
}

const App = withMobileRestriction(AppDesktop);
export default App;
