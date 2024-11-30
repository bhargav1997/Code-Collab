import React, { useEffect, useState, Suspense, useTransition } from "react";
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useSelector, useDispatch } from "react-redux";

import { setUser, setLoading } from "./redux/user/userSlice";
import styles from "./styles/App.module.css";

// Import components
const Sidebar = React.lazy(() => import("./components/Sidebar"));
const Onboarding = React.lazy(() => import("./components/Onboarding"));
// import SidebarSkeleton from "./components/Sidebar/SidebarSkeleton";
const LoadingSpinner = React.lazy(() => import("./components/LoadingSpinner"));
const TwoFactorAuth = React.lazy(() => import("./components/TwoFactorAuth/TwoFactorAuth"));

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
const AccountDeletion = React.lazy(() => import("./components/AccountDeletion"));
const LandingPage = React.lazy(() => import("./components/LandingPage"));
const PrivacyPolicy = React.lazy(() => import("./components/PrivacyPolicy"));
const TermsOfUse = React.lazy(() => import("./components/TermsOfUse"));
const Guidelines = React.lazy(() => import("./components/Guidelines"));
const AboutMe = React.lazy(() => import("./components/AboutMe"));
const ScrollToTop = React.lazy(() => import("./components/common/ScrollToTop"));
const ErrorFallback = React.lazy(() => import("./components/ErrorFallback"));

import { CONFIG } from "./config";
import withMobileRestriction from "./components/MobileRestriction/withMobileRestriction";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { HelmetProvider } from "react-helmet-async";

// Lazy load other components

// Modify AppDesktop to use these new components
function AppDesktop() {
   const [showOnboarding, setShowOnboarding] = useState(false);
   const [isInitialized, setIsInitialized] = useState(false);
   const [isPending, startAppTransition] = useTransition();
   const dispatch = useDispatch();
   const { user, isLoading } = useSelector((state) => state.user);
   const API_URL = CONFIG.API_URL;
   const isAuthenticated = !!user;

   useEffect(() => {
      const checkAuthStatus = async () => {
         try {
            dispatch(setLoading(true));
            const token = localStorage.getItem("token");

            if (!token) {
               startAppTransition(() => {
                  dispatch(setUser(null));
               });
               return;
            }

            const response = await fetch(`${API_URL}/users/profile`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });

            if (response.ok) {
               const userData = await response.json();
               startAppTransition(() => {
                  dispatch(setUser(userData));
               });

               const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding");
               if (!hasCompletedOnboarding || hasCompletedOnboarding !== "true") {
                  setShowOnboarding(true);
               }
            } else {
               localStorage.removeItem("token");
               localStorage.removeItem("user");
               startAppTransition(() => {
                  dispatch(setUser(null));
               });
            }
         } catch (error) {
            console.error("Error verifying token:", error);
            startAppTransition(() => {
               dispatch(setUser(null));
            });
         } finally {
            dispatch(setLoading(false));
            setIsInitialized(true);
         }
      };

      checkAuthStatus();
   }, [dispatch]);

   if (isLoading || !isInitialized || isPending) {
      return <LoadingSpinner />;
   }

   return (
      <Router>
         <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
               // Reset the state here
               window.location.reload();
            }}
         >
            <Suspense fallback={<LoadingSpinner />}>
               <ScrollToTop />
               <ToastContainer />
               <div className={styles.appContainer}>
                  {showOnboarding && (
                     <Suspense fallback={<LoadingSpinner />}>
                        <Onboarding onComplete={() => {
                           setShowOnboarding(false);
                           localStorage.setItem("hasCompletedOnboarding", "true");
                        }} />
                     </Suspense>
                  )}
                  <div className={`${styles.appContent} ${showOnboarding ? styles.blurred : ""}`}>
                     {isAuthenticated && (
                        <aside className={styles.sidebar}>
                           <Suspense fallback={<LoadingSpinner />}>
                              <Sidebar />
                           </Suspense>
                        </aside>
                     )}
                     <div className={`${styles.mainArea} ${isAuthenticated ? styles.withSidebar : ""}`}>
                        <Routes>
                           <Route path='/register' element={
                              <Suspense fallback={<LoadingSpinner />}>
                                 {isAuthenticated ? <Navigate to='/' /> : <Register />}
                              </Suspense>
                           } />
                           <Route path='/login' element={
                              <Suspense fallback={<LoadingSpinner />}>
                                 {isAuthenticated ? <Navigate to='/' /> : <Login />}
                              </Suspense>
                           } />
                           <Route path='/two-factor-auth' element={isAuthenticated ? <Navigate to='/' /> : <TwoFactorAuth />} />
                           <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                           <Route path='/terms-of-use' element={<TermsOfUse />} />
                           <Route path='/guidelines' element={<Guidelines />} />
                           <Route path='/about-me' element={<AboutMe />} />
                           <Route path='/landing-page' element={<LandingPage />} />
                           <Route path='/account-recovery' element={<AccountDeletion />} />
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
                     </div>
                  </div>
               </div>
            </Suspense>
         </ErrorBoundary>
      </Router>
   );
}

function AuthenticatedLayout() {
   return (
      <HelmetProvider>
         <header className={styles.header}>
            <Suspense fallback={<LoadingSpinner />}>
               <Header />
            </Suspense>
         </header>
         <main className={styles.content}>
            <Suspense fallback={<LoadingSpinner />}>
               <Outlet />
            </Suspense>
            <Analytics />
            <SpeedInsights />
         </main>
      </HelmetProvider>
   );
}

const App = withMobileRestriction(AppDesktop);
export default App;
