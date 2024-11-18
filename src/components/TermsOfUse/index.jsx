import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faGavel,
   faUserCheck,
   faShieldAlt,
   faFileContract,
   faHandshake,
   faBan,
   faExclamationTriangle,
   faUserLock,
   faCopyright,
   faGlobe,
   faArrowLeft,
   faArrowUp,
   faHome,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./TermsOfUse.module.css";

function TermsOfUse() {
   const navigate = useNavigate();
   const [activeSection, setActiveSection] = useState("acceptance");

   const navigationItems = [
      {
         id: "acceptance",
         title: "Terms Acceptance",
         icon: faUserCheck,
         content: [
            "By accessing or using LearnHUB, you agree to be bound by these Terms of Use",
            "If you disagree with any part of the terms, you do not have permission to access the platform",
            "We reserve the right to update these terms at any time",
            "Users will be notified of significant changes via email",
            "Continued use after changes constitutes acceptance of new terms",
         ],
      },
      {
         id: "account",
         title: "Account Responsibilities",
         icon: faUserLock,
         content: [
            "Users must be at least 13 years old to create an account",
            "You are responsible for maintaining the security of your account",
            "Account sharing or transfer is not permitted",
            "Accurate and updated information must be provided",
            "You must notify us of any unauthorized account access",
            "We reserve the right to terminate accounts that violate our terms",
         ],
      },
      {
         id: "platform-use",
         title: "Platform Usage",
         icon: faHandshake,
         content: [
            "The platform is for educational and learning purposes only",
            "Users must respect intellectual property rights",
            "Sharing of learning journeys must comply with our guidelines",
            "Challenge solutions must be your original work",
            "Collaborative features must be used responsibly",
            "Commercial use of platform content is prohibited without permission",
         ],
      },
      {
         id: "content",
         title: "User Content",
         icon: faFileContract,
         content: [
            "You retain rights to content you create and share",
            "By posting, you grant LearnHUB license to use your content",
            "Content must not violate any laws or rights",
            "We may remove content that violates our policies",
            "Back up your content as we are not responsible for data loss",
            "Respect others' intellectual property rights",
         ],
      },
      {
         id: "prohibited",
         title: "Prohibited Activities",
         icon: faBan,
         content: [
            "No spamming or automated platform access",
            "No harassment or discriminatory behavior",
            "No distribution of malware or harmful content",
            "No impersonation of others or misrepresentation",
            "No interference with platform security",
            "No unauthorized data collection or scraping",
         ],
      },
      {
         id: "intellectual",
         title: "Intellectual Property",
         icon: faCopyright,
         content: [
            "All platform content is protected by copyright",
            "LearnHUB trademarks may not be used without permission",
            "Respect third-party intellectual property rights",
            "Report copyright violations through proper channels",
            "Fair use of content for learning purposes is permitted",
            "Attribution required for shared content",
         ],
      },
      {
         id: "liability",
         title: "Limitation of Liability",
         icon: faShieldAlt,
         content: [
            'Platform provided "as is" without warranties',
            "Not responsible for user-generated content",
            "No liability for service interruptions",
            "No guarantee of learning outcomes",
            "Users assume risks of platform use",
            "Limitation of damages to fees paid",
         ],
      },
      {
         id: "termination",
         title: "Account Termination",
         icon: faExclamationTriangle,
         content: [
            "We may terminate accounts for terms violations",
            "Users may delete their account at any time",
            "Some obligations survive account termination",
            "Content removal upon termination not guaranteed",
            "Appeal process available for terminated accounts",
            "Refund policy applies as per terms",
         ],
      },
      {
         id: "jurisdiction",
         title: "Governing Law",
         icon: faGlobe,
         content: [
            "Terms governed by applicable local laws",
            "Disputes resolved in jurisdiction of our choice",
            "Users agree to personal jurisdiction",
            "Class action waiver where permitted",
            "International users must comply with local laws",
            "Export control laws apply",
         ],
      },
   ];

   // Scroll handling logic
   useEffect(() => {
      const handleScroll = () => {
         const scrollPosition = window.scrollY;

         const sections = navigationItems.map((item) => ({
            id: item.id,
            offset: document.getElementById(item.id)?.offsetTop || 0,
         }));

         const currentSection = sections.reduce((acc, section) => {
            if (scrollPosition >= section.offset - 100) {
               return section.id;
            }
            return acc;
         }, sections[0].id);

         setActiveSection(currentSection);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   const scrollToSection = (elementId) => {
      const element = document.getElementById(elementId);
      if (element) {
         const headerOffset = 90;
         const elementPosition = element.getBoundingClientRect().top;
         const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

         window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
         });
      }
   };

   return (
      <div className={styles.termsWrapper}>
         <button onClick={() => navigate("/")} className={styles.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Home
         </button>

         <motion.div className={styles.heroSection} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.heroContent}>
               <FontAwesomeIcon icon={faGavel} className={styles.headerIcon} />
               <h1>Terms of Use</h1>
               <p>Please read these terms carefully before using LearnHUB</p>
            </div>
         </motion.div>

         <div className={styles.termsContainer}>
            <div className={styles.sideNav}>
               <div className={styles.tocContent}>
                  <h3>Quick Navigation</h3>
                  <ul>
                     {navigationItems.map(({ id, title, icon }) => (
                        <li key={id}>
                           <button
                              onClick={() => scrollToSection(id)}
                              className={`${styles.navLink} ${activeSection === id ? styles.active : ""}`}>
                              <FontAwesomeIcon icon={icon} className={styles.navIcon} />
                              {title}
                           </button>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            <div className={styles.termsContent}>
               {navigationItems.map(({ id, title, icon, content }) => (
                  <motion.section
                     key={id}
                     id={id}
                     className={styles.termsSection}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}>
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
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={styles.actionButton}>
               <FontAwesomeIcon icon={faArrowUp} />
               Back to Top
            </button>
            <button onClick={() => navigate("/")} className={styles.actionButton}>
               <FontAwesomeIcon icon={faHome} />
               Return Home
            </button>
         </div>
      </div>
   );
}

export default TermsOfUse;
