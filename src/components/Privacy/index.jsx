import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUserFriends, faChartLine, faBullhorn, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "./Privacy.module.css";

function Privacy() {
   const [settings, setSettings] = useState({
      profileVisibility: "public",
      showProgressOnLeaderboards: true,
      allowTaskRecommendations: true,
      shareAnalyticsWithMentors: false,
      allowSocialSharing: true,
   });

   const handleToggle = (setting) => {
      setSettings((prevSettings) => ({
         ...prevSettings,
         [setting]: !prevSettings[setting],
      }));
   };

   const handleProfileVisibilityChange = (e) => {
      setSettings((prevSettings) => ({
         ...prevSettings,
         profileVisibility: e.target.value,
      }));
   };

   return (
      <div className={styles.privacyContainer}>
         <h1 className={styles.privacyTitle}>Privacy Settings</h1>

         <div className={styles.settingsGrid}>
            <div className={styles.settingSection}>
               <div className={styles.settingHeader}>
                  <div className={styles.settingIcon}>
                     <FontAwesomeIcon icon={faEye} />
                  </div>
                  <h2>Profile Visibility</h2>
               </div>
               <p>Control who can see your profile and learning progress.</p>
               <div className={styles.settingControl}>
                  <select value={settings.profileVisibility} onChange={handleProfileVisibilityChange} className={styles.selectInput}>
                     <option value='public'>Public</option>
                     <option value='friends'>Friends Only</option>
                     <option value='private'>Private</option>
                  </select>
               </div>
            </div>

            <div className={styles.settingSection}>
               <div className={styles.settingHeader}>
                  <div className={styles.settingIcon}>
                     <FontAwesomeIcon icon={faUserFriends} />
                  </div>
                  <h2>Leaderboards</h2>
               </div>
               <p>Choose whether to show your progress on public leaderboards.</p>
               <div className={styles.settingControl}>
                  <label htmlFor='leaderboardsToggle' className={styles.toggleSwitch}>
                     <input
                        id='leaderboardsToggle'
                        type='checkbox'
                        checked={settings.showProgressOnLeaderboards}
                        onChange={() => handleToggle("showProgressOnLeaderboards")}
                     />
                     <span className={styles.slider}></span>
                  </label>
                  <span className={styles.toggleLabel}>{settings.showProgressOnLeaderboards ? "Visible" : "Hidden"}</span>
               </div>
            </div>

            <div className={styles.settingSection}>
               <div className={styles.settingHeader}>
                  <div className={styles.settingIcon}>
                     <FontAwesomeIcon icon={faChartLine} />
                  </div>
                  <h2>Task Recommendations</h2>
               </div>
               <p>Allow Learn Hub to suggest personalized learning tasks.</p>
               <div className={styles.settingControl}>
                  <label htmlFor='taskRecommendationsToggle' className={styles.toggleSwitch}>
                     <input
                        type='checkbox'
                        id='taskRecommendationsToggle'
                        checked={settings.allowTaskRecommendations}
                        onChange={() => handleToggle("allowTaskRecommendations")}
                     />
                     <span className={styles.slider}></span>
                  </label>
                  <span className={styles.toggleLabel}>{settings.allowTaskRecommendations ? "Enabled" : "Disabled"}</span>
               </div>
            </div>

            <div className={styles.settingSection}>
               <div className={styles.settingHeader}>
                  <div className={styles.settingIcon}>
                     <FontAwesomeIcon icon={faEyeSlash} />
                  </div>
                  <h2>Mentor Analytics Sharing</h2>
               </div>
               <p>Share your learning analytics with assigned mentors for better guidance.</p>
               <div className={styles.settingControl}>
                  <label htmlFor='mentorAnalyticsToggle' className={styles.toggleSwitch}>
                     <input
                        type='checkbox'
                        id='mentorAnalyticsToggle'
                        checked={settings.shareAnalyticsWithMentors}
                        onChange={() => handleToggle("shareAnalyticsWithMentors")}
                     />
                     <span className={styles.slider}></span>
                  </label>
                  <span className={styles.toggleLabel}>{settings.shareAnalyticsWithMentors ? "Sharing" : "Not Sharing"}</span>
               </div>
            </div>

            <div className={styles.settingSection}>
               <div className={styles.settingHeader}>
                  <div className={styles.settingIcon}>
                     <FontAwesomeIcon icon={faBullhorn} />
                  </div>
                  <h2>Social Sharing</h2>
               </div>
               <p>Allow automatic sharing of your achievements on connected social platforms.</p>
               <div className={styles.settingControl}>
                  <label htmlFor='socialSharingToggle' className={styles.toggleSwitch}>
                     <input
                        type='checkbox'
                        id='socialSharingToggle'
                        checked={settings.allowSocialSharing}
                        onChange={() => handleToggle("allowSocialSharing")}
                     />
                     <span className={styles.slider}></span>
                  </label>
                  <span className={styles.toggleLabel}>{settings.allowSocialSharing ? "Enabled" : "Disabled"}</span>
               </div>
            </div>
         </div>

         <div className={styles.privacyInfo}>
            <h2>
               <FontAwesomeIcon icon={faShieldAlt} /> Your Privacy is Important
            </h2>
            <p>
               Learn Hub is committed to protecting your personal information. We never sell your data to third parties and only use it to
               improve your learning experience. For more information, please read our <a href='/privacy-policy'>Privacy Policy</a>.
            </p>
         </div>
      </div>
   );
}

export default Privacy;
