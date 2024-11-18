import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faBook,
   faUsers,
   faComments,
   faAward,
   faHandshake,
   faShieldAlt,
   faExclamationTriangle,
   faHeart,
   faGraduationCap,
   faStar,
   faArrowLeft,
   faArrowUp,
   faHome,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Guidelines.module.css";

function Guidelines() {
   const navigate = useNavigate();
   const [activeSection, setActiveSection] = useState("community");

   const navigationItems = [
      {
         id: "community",
         title: "Community Standards",
         icon: faUsers,
         content: [
            "Treat all members with respect and kindness",
            "No discrimination or hate speech of any kind",
            "Maintain professional and constructive communication",
            "Respect diverse perspectives and experiences",
            "Help create an inclusive learning environment",
         ],
      },
      {
         id: "learning",
         title: "Learning Guidelines",
         icon: faGraduationCap,
         content: [
            "Set clear learning goals and track progress",
            "Participate actively in learning challenges",
            "Share knowledge and help fellow learners",
            "Submit original work and solutions",
            "Provide constructive feedback to peers",
         ],
      },
      {
         id: "communication",
         title: "Communication Rules",
         icon: faComments,
         content: [
            "Use clear and appropriate language",
            "Keep discussions focused on learning topics",
            "Avoid spamming or excessive messaging",
            "Report inappropriate communications",
            "Respect others' privacy and boundaries",
         ],
      },
      {
         id: "achievements",
         title: "Achievement System",
         icon: faAward,
         content: [
            "Complete challenges honestly and independently",
            "Celebrate others' achievements",
            "Report any suspicious activity",
            "Follow challenge submission guidelines",
            "Maintain academic integrity",
         ],
      },
      {
         id: "collaboration",
         title: "Collaboration Rules",
         icon: faHandshake,
         content: [
            "Contribute equally to group projects",
            "Respect team members' time and efforts",
            "Communicate clearly about availability",
            "Share resources appropriately",
            "Give credit where due",
         ],
      },
      {
         id: "safety",
         title: "Safety Guidelines",
         icon: faShieldAlt,
         content: [
            "Keep personal information private",
            "Use strong and unique passwords",
            "Report security concerns immediately",
            "Avoid sharing sensitive data",
            "Follow data protection guidelines",
         ],
      },
      {
         id: "reporting",
         title: "Reporting Issues",
         icon: faExclamationTriangle,
         content: [
            "Report violations promptly",
            "Provide specific details when reporting",
            "Use appropriate reporting channels",
            "Maintain confidentiality during investigations",
            "Follow up on reported issues",
         ],
      },
      {
         id: "mentorship",
         title: "Mentorship Guidelines",
         icon: faStar,
         content: [
            "Maintain professional mentor-mentee relationships",
            "Set clear expectations and boundaries",
            "Provide constructive and timely feedback",
            "Respect mentoring session schedules",
            "Focus on growth and development",
         ],
      },
      {
         id: "support",
         title: "Community Support",
         icon: faHeart,
         content: [
            "Help newcomers navigate the platform",
            "Share resources and best practices",
            "Participate in community events",
            "Provide encouragement and support",
            "Build positive relationships",
         ],
      },
   ];

   // Scroll handling
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
      <div className={styles.guidelinesWrapper}>
         <button onClick={() => navigate("/")} className={styles.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Home
         </button>

         <motion.div className={styles.heroSection} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.heroContent}>
               <FontAwesomeIcon icon={faBook} className={styles.headerIcon} />
               <h1>Platform Guidelines</h1>
               <p>Learn how to make the most of our learning community while maintaining a positive environment for everyone.</p>
            </div>
         </motion.div>

         <div className={styles.guidelinesContainer}>
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

            <div className={styles.guidelinesContent}>
               {navigationItems.map(({ id, title, icon, content }) => (
                  <motion.section
                     key={id}
                     id={id}
                     className={styles.guidelineSection}
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

export default Guidelines;
