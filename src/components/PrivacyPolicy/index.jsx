import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
   faShieldAlt, 
   faUserLock,
   faDatabase,
   faShareAlt,
   faChartLine,
   faEnvelope,
   faCookie,
   faCalendar,
   faUserShield,
   faGlobe,
   faUserCog,
   faRefresh,
   faArrowLeft,
   faHome,
   faArrowUp
} from "@fortawesome/free-solid-svg-icons";
import styles from "./PrivacyPolicy.module.css";
import { useNavigate } from 'react-router-dom';

function PrivacyPolicy() {
   const navigate = useNavigate();

   const navigationItems = [
      { 
         id: 'information', 
         title: 'Information We Collect',
         icon: faUserLock,
         content: [
            'Account information (name, email, profile data)',
            'Learning progress and journey tracking',
            'Challenge participation and results',
            'Communication data from chat features',
            'Calendar and scheduling information',
            'Profile customization preferences',
            'Learning goals and objectives'
         ]
      },
      { 
         id: 'data-usage', 
         title: 'How We Use Your Data',
         icon: faDatabase,
         content: [
            'Personalizing your learning experience',
            'Providing leaderboard functionality',
            'Generating task recommendations',
            'Enabling mentor analytics sharing (when enabled)',
            'Processing and displaying learning achievements',
            'Improving platform features and user experience',
            'Creating personalized study recommendations'
         ]
      },
      { 
         id: 'learning-journey', 
         title: 'Learning Journey Data',
         icon: faShareAlt,
         content: [
            'Progress tracking is visible only to you by default',
            'You can choose to share your journey with specific users or mentors',
            'Achievement badges and certifications can be made public or private',
            'Learning analytics are used to improve your experience',
            'Custom learning paths are stored securely',
            'Progress metrics and achievement tracking',
            'Skill development and mastery tracking'
         ]
      },
      { 
         id: 'leaderboard', 
         title: 'Leaderboard & Challenges',
         icon: faChartLine,
         content: [
            'Your position on leaderboards can be anonymous if preferred',
            'Challenge participation records are stored for progress tracking',
            'Performance metrics are used for personalized recommendations',
            'Challenge solutions are private by default',
            'You can choose to share your solutions with the community',
            'Achievement badges and rewards tracking',
            'Competitive learning metrics and statistics'
         ]
      },
      { 
         id: 'communication', 
         title: 'Communication & Messages',
         icon: faEnvelope,
         content: [
            'Chat messages are encrypted end-to-end',
            'Messages are stored for 90 days for service improvement',
            'You can delete your message history at any time',
            'System notifications can be customized in settings',
            'Email communications are limited to essential updates',
            'Group chat and collaboration data',
            'Mentor-student communication records'
         ]
      },
      { 
         id: 'cookies', 
         title: 'Cookies & Storage',
         icon: faCookie,
         content: [
            'Essential cookies for platform functionality',
            'Analytics cookies to improve user experience',
            'Preference cookies to remember your settings',
            'Session cookies for secure authentication',
            'Third-party cookies are limited and controlled',
            'Local storage for offline functionality',
            'Cache management for better performance'
         ]
      },
      { 
         id: 'calendar', 
         title: 'Calendar & Scheduling',
         icon: faCalendar,
         content: [
            'Calendar data is stored securely on our servers',
            'Event reminders are processed locally when possible',
            'Shared calendar events require explicit permission',
            'You can export your calendar data at any time',
            'Calendar sync settings can be managed in preferences',
            'Study session scheduling and tracking',
            'Group event coordination data'
         ]
      },
      { 
         id: 'protection', 
         title: 'Data Protection',
         icon: faUserShield,
         content: [
            'All data is encrypted at rest and in transit',
            'Regular security audits are performed',
            'You can request a copy of your data at any time',
            'Data deletion requests are processed within 30 days',
            'Third-party access is strictly limited and controlled',
            'Regular backup and recovery procedures',
            'Security incident response protocols'
         ]
      },
      { 
         id: 'international', 
         title: 'International Transfer',
         icon: faGlobe,
         content: [
            'Data may be processed in different geographical locations',
            'We comply with international data protection laws',
            'Data transfers follow standard contractual clauses',
            'You can choose your preferred data region where available',
            'International transfers are protected by appropriate safeguards',
            'GDPR and CCPA compliance measures',
            'Cross-border data protection standards'
         ]
      },
      { 
         id: 'rights', 
         title: 'Your Rights',
         icon: faUserCog,
         content: [
            'Right to access your personal data',
            'Right to correct inaccurate data',
            'Right to delete your account and data',
            'Right to restrict processing',
            'Right to data portability',
            'Right to withdraw consent',
            'Right to lodge a complaint with authorities'
         ]
      },
      {
         id: 'updates',
         title: 'Policy Updates',
         icon: faRefresh,
         content: [
            'We regularly review and update our privacy policy',
            'Users will be notified of significant changes',
            'Previous versions are available upon request',
            'Changes take effect 30 days after notification',
            'You can opt-out of certain changes',
            'Annual privacy policy reviews',
            'Compliance updates and modifications'
         ]
      }
   ];

   const [activeSection, setActiveSection] = useState(navigationItems[0].id);

   useEffect(() => {
      const handleScroll = () => {
         const scrollPosition = window.scrollY;
         
         // Get all sections
         const sections = navigationItems.map(item => ({
            id: item.id,
            offset: document.getElementById(item.id)?.offsetTop || 0
         }));

         // Find the current section
         const currentSection = sections.reduce((acc, section) => {
            if (scrollPosition >= section.offset - 100) { // Adjust offset as needed
               return section.id;
            }
            return acc;
         }, sections[0].id);

         setActiveSection(currentSection);
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Call once on mount

      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   const scrollToSection = (elementId) => {
      const element = document.getElementById(elementId);
      if (element) {
         const headerOffset = 90; // Adjust based on your header height
         const elementPosition = element.getBoundingClientRect().top;
         const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

         window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
         });
      }
   };

   return (
      <div className={styles.privacyWrapper}>
         <button 
            onClick={() => navigate('/')} 
            className={styles.backButton}
         >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Home
         </button>

         <motion.div 
            className={styles.heroSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
         >
            <div className={styles.heroContent}>
               <FontAwesomeIcon icon={faShieldAlt} className={styles.headerIcon} />
               <h1>Privacy Policy</h1>
               <p>Your privacy is our top priority. Learn how we protect and manage your data.</p>
            </div>
         </motion.div>

         <div className={styles.policyContainer}>
            <aside className={styles.sideNav}>
               <div className={styles.tocContent}>
                  <h3>Quick Navigation</h3>
                  <ul>
                     {navigationItems.map(({ id, title, icon }) => (
                        <li key={id}>
                           <button 
                              onClick={() => scrollToSection(id)}
                              className={`${styles.navLink} ${activeSection === id ? styles.active : ''}`}
                           >
                              <FontAwesomeIcon icon={icon} className={styles.navIcon} />
                              {title}
                           </button>
                        </li>
                     ))}
                  </ul>
               </div>
            </aside>

            <div className={styles.policyContent}>
               {navigationItems.map(({ id, title, icon, content }) => (
                  <motion.section 
                     key={id}
                     id={id} 
                     className={styles.policySection}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                  >
                     <div className={styles.sectionHeader}>
                        <FontAwesomeIcon icon={icon} className={styles.sectionIcon} />
                        <h2>{title}</h2>
                     </div>
                     <ul className={styles.contentList}>
                        {content.map((item, index) => (
                           <li key={index}>{item}</li>
                        ))}
                     </ul>
                  </motion.section>
               ))}
            </div>
         </div>

         <div className={styles.bottomActions}>
            <button 
               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
               className={styles.actionButton}
            >
               <FontAwesomeIcon icon={faArrowUp} />
               Back to Top
            </button>
            <button 
               onClick={() => navigate('/')} 
               className={styles.actionButton}
            >
               <FontAwesomeIcon icon={faHome} />
               Return Home
            </button>
         </div>
      </div>
   );
}

export default PrivacyPolicy;
