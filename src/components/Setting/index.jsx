import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faGlobe, faChartBar, faCog, faExclamationTriangle, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "./Setting.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getUserSettings, updateSettings, deleteAccount } from "../../redux/user/userHandle";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DeleteAccountModal from "./DeleteAccountModal";
import { CONFIG } from "../../config";
import { setUser } from "../../redux/user/userSlice";

function Setting() {
   const dispatch = useDispatch();
   const userSettings = useSelector((state) => state.user.user?.settings);
   const isLoading = useSelector((state) => state.user.isLoading);
   const navigate = useNavigate();
   const [isMounted, setIsMounted] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);

   const [settings, setSettings] = useState({
      emailNotifications: true,
      pushNotifications: false,
      inactivityReminders: true,
      deadlineReminders: true,
      language: "en",
      timezone: "UTC",
      enableDarkMode: false,
      trackLearningTime: true,
      generateWeeklyReports: false,
      shareAnalyticsWithMentors: false,
      enableOfflineMode: false,
      useAIRecommendations: true,
      enableCourseRecommendations: true,
   });

   useEffect(() => {
      if (!isMounted && !userSettings) {
         const fetchSettings = async () => {
            try {
               await dispatch(getUserSettings());
               setIsMounted(true);
            } catch (error) {
               console.error("Failed to load settings:", error);
               toast.error("Failed to load settings");
            }
         };
         fetchSettings();
      }
   }, [dispatch, isMounted, userSettings]);

   useEffect(() => {
      if (userSettings) {
         setSettings((prevSettings) => ({
            ...prevSettings,
            ...userSettings,
         }));
      }
   }, [userSettings]);

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setSettings((prevSettings) => ({
         ...prevSettings,
         [name]: type === "checkbox" ? checked : value,
      }));
   };

   const handleLogoutAndRedirect = () => {
      // Clear all auth-related data
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");

      // Clear Redux state
      dispatch(setUser(null));

      // Show success message
      toast.success("Account deletion process started. You will be logged out.");

      // Redirect to login page after a short delay
      setTimeout(() => {
         navigate("/login");
      }, 1500);
   };

   const handleDeleteAccount = async (reason) => {
      try {
         const result = await dispatch(deleteAccount({ reason })).unwrap();
         if (result) {
            setShowDeleteModal(false);
            handleLogoutAndRedirect();
         }
      } catch (error) {
         console.error("Delete account error:", error);
         toast.error(error || "Failed to initiate account deletion");
      }
   };

   const handleFeatureRequest = async (request) => {
      try {
         await fetch(`${CONFIG.API_URL}/feature-request`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ request }),
         });
         toast.success("Feature request sent successfully");
      } catch (error) {
         toast.error("Failed to send feature request");
      }
   };

   const handleSave = async (e) => {
      e.preventDefault();
      try {
         const result = await dispatch(updateSettings(settings)).unwrap();
         if (result.success) {
            toast.success("Settings updated successfully");
         }
      } catch (error) {
         toast.error("Failed to update settings");
         console.error("Error saving settings:", error);
      }
   };

   if (isLoading) {
      return <LoadingSpinner />;
   }

   return (
      <div className={styles.settingsContainer}>
         <h1 className={styles.settingsTitle}>Settings</h1>

         <form onSubmit={handleSave}>
            <div className={styles.settingsGrid}>
               {/* Notification Settings */}
               <div className={styles.settingSection}>
                  <div className={styles.settingHeader}>
                     <div className={styles.settingIcon}>
                        <FontAwesomeIcon icon={faBell} />
                     </div>
                     <h2>Notification Settings</h2>
                  </div>
                  <p>Control your notification preferences.</p>
                  <div className={styles.settingControl}>
                     <label>
                        <input type='checkbox' name='emailNotifications' checked={settings.emailNotifications} onChange={handleChange} />
                        Email notifications
                     </label>
                  </div>

                  <div className={styles.settingControl}>
                     <label>
                        <input type='checkbox' name='inactivityReminders' checked={settings.inactivityReminders} onChange={handleChange} />
                        Inactivity reminders
                     </label>
                  </div>
                  <div className={styles.settingControl}>
                     <label>
                        <input type='checkbox' name='deadlineReminders' checked={settings.deadlineReminders} onChange={handleChange} />
                        Deadline reminders
                     </label>
                  </div>
               </div>

               {/* Preference Settings */}
               <div className={styles.settingSection}>
                  <div className={styles.settingHeader}>
                     <div className={styles.settingIcon}>
                        <FontAwesomeIcon icon={faGlobe} />
                     </div>
                     <h2>Preference Settings</h2>
                  </div>
                  <p>Customize your learning experience.</p>
                  <div className={styles.formGroup}>
                     <label htmlFor='language'>Language</label>
                     <select id='language' name='language' value={settings.language} onChange={handleChange} className={styles.selectInput}>
                        <option value='en'>English</option>
                        <option value='fr'>French</option>
                     </select>
                  </div>
                  <div className={styles.formGroup}>
                     <label htmlFor='timezone'>Timezone</label>
                     <select id='timezone' name='timezone' value={settings.timezone} onChange={handleChange} className={styles.selectInput}>
                        <option value='UTC'>UTC</option>
                        <option value='EST'>EST</option>
                        <option value='PST'>PST</option>
                     </select>
                  </div>
               </div>

               {/* Analytics Settings */}
               <div className={styles.settingSection}>
                  <div className={styles.settingHeader}>
                     <div className={styles.settingIcon}>
                        <FontAwesomeIcon icon={faChartBar} />
                     </div>
                     <h2>Analytics Settings</h2>
                  </div>
                  <p>Manage your learning analytics preferences.</p>
                  <div className={styles.settingControl}>
                     <label>
                        <input type='checkbox' name='trackLearningTime' checked={settings.trackLearningTime} onChange={handleChange} />
                        Track learning time
                     </label>
                  </div>
                  <div className={styles.settingControl}>
                     <label>
                        <input
                           type='checkbox'
                           name='generateWeeklyReports'
                           checked={settings.generateWeeklyReports}
                           onChange={handleChange}
                        />
                        Generate weekly reports
                     </label>
                  </div>
                  <div className={styles.settingControl}>
                     <label>
                        <input
                           type='checkbox'
                           name='enableCourseRecommendations'
                           checked={settings.enableCourseRecommendations}
                           onChange={handleChange}
                        />
                        Enable course recommendations
                     </label>
                  </div>
               </div>

               {/* Advanced Settings */}
               <div className={styles.settingSection}>
                  <div className={styles.settingHeader}>
                     <div className={styles.settingIcon}>
                        <FontAwesomeIcon icon={faCog} />
                     </div>
                     <h2>Advanced Settings</h2>
                  </div>
                  <p>Configure advanced features.</p>
                  <div className={styles.settingControl}>
                     <label>
                        <input
                           type='checkbox'
                           name='useAIRecommendations'
                           checked={settings.useAIRecommendations}
                           onChange={handleChange}
                        />
                        Use AI-powered recommendations
                     </label>
                  </div>
               </div>
            </div>

            <div className={styles.saveButtonContainer}>
               <button type='submit' className={styles.saveButton} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save All Settings"}
               </button>
            </div>
         </form>

         <div className={styles.infoContainer}>
            <div className={styles.privacyInfo}>
               <h2>
                  <FontAwesomeIcon icon={faShieldAlt} /> Your Settings are Secure
               </h2>
               <p>
                  Your settings are securely stored and can be updated at any time. For more information about how we handle your data,
                  please read our <a href='/privacy-policy'>Privacy Policy</a>.
               </p>
            </div>

            <div className={styles.dangerZone}>
               <h2>
                  <FontAwesomeIcon icon={faExclamationTriangle} /> Danger Zone
               </h2>
               <p>Deleting your account is permanent and cannot be undone.</p>
               <button className={styles.dangerButton} onClick={() => setShowDeleteModal(true)}>
                  Delete Account
               </button>
            </div>
         </div>

         <DeleteAccountModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onDelete={handleDeleteAccount}
            onFeatureRequest={handleFeatureRequest}
         />
      </div>
   );
}

export default Setting;
