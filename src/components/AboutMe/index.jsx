import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
   faArrowLeft,
   faRocket,
   faCode,
   faLightbulb,
   faUsers,
   faGraduationCap,
   faStar,
   faHeart,
   faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

import styles from "./AboutMe.module.css";
import { useNavigate } from "react-router-dom";

function AboutMe() {
   const navigate = useNavigate();

   return (
      <div className={styles.aboutWrapper}>
         <button onClick={() => navigate("/")} className={styles.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Home
         </button>

         <motion.div className={styles.heroSection} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.heroContent}>
               <div className={styles.profileImage}>
                  <img src='https://avatars.githubusercontent.com/u/27812306?v=4' alt='Bhargav Suthar' />
               </div>
               <div className={styles.profileInfo}>
                  <h1>Bhargav Suthar</h1>
                  <div className={styles.founderTitle}>
                     <span className={styles.founderBadge}>
                        <FontAwesomeIcon icon={faRocket} /> Founder & Lead Developer
                     </span>
                     <span className={styles.founderBadge}>
                        <FontAwesomeIcon icon={faCode} /> Full Stack Engineer
                     </span>
                  </div>
                  <p className={styles.heroDescription}>
                     {
                        "I'm the founder and lead developer of LearnHUB, a revolutionary learning platform that transforms how people connect and learn together. With over 4 years of experience in full-stack development, I'm passionate about creating technology that makes education more accessible and engaging."
                     }
                  </p>
                  <div className={styles.socialLinks}>
                     <a href='https://linkedin.com/in/bhargav-suthar'>
                        <FontAwesomeIcon icon={faLinkedin} />
                     </a>
                     <a href='https://github.com/bhargav1997'>
                        <FontAwesomeIcon icon={faGithub} />
                     </a>
                     <a href='https://twitter.com/bsuthar_712'>
                        <FontAwesomeIcon icon={faTwitter} />
                     </a>
                  </div>
               </div>
            </div>
         </motion.div>

         <motion.section
            className={styles.visionSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <div className={styles.visionGrid}>
               <motion.div className={styles.visionCard} whileHover={{ scale: 1.02 }}>
                  <div className={styles.cardIcon}>
                     <FontAwesomeIcon icon={faLightbulb} />
                  </div>
                  <h3>The Vision</h3>
                  <p>
                     Creating a revolutionary learning platform that breaks down traditional barriers in education. We envision a world
                     where quality education is accessible to everyone, powered by community-driven knowledge sharing.
                  </p>
                  <div className={styles.cardStats}>
                     <div className={styles.statItem}>
                        <FontAwesomeIcon icon={faUsers} className={styles.statIcon} />
                        Global Community
                     </div>
                     <div className={styles.statItem}>
                        <FontAwesomeIcon icon={faGraduationCap} className={styles.statIcon} />
                        Lifelong Learning
                     </div>
                  </div>
               </motion.div>

               <motion.div className={styles.visionCard} whileHover={{ scale: 1.02 }}>
                  <div className={styles.cardIcon}>
                     <FontAwesomeIcon icon={faRocket} />
                  </div>
                  <h3>The Mission</h3>
                  <p>
                     To revolutionize online education by combining cutting-edge technology with the power of peer learning. We&apos;re
                     building tools that make learning more engaging, interactive, and tailored to individual needs.
                  </p>
                  <div className={styles.cardStats}>
                     <div className={styles.statItem}>
                        <FontAwesomeIcon icon={faCode} className={styles.statIcon} />
                        Modern Tech
                     </div>
                     <div className={styles.statItem}>
                        <FontAwesomeIcon icon={faStar} className={styles.statIcon} />
                        Excellence
                     </div>
                  </div>
               </motion.div>

               <motion.div className={styles.visionCard} whileHover={{ scale: 1.02 }}>
                  <div className={styles.cardIcon}>
                     <FontAwesomeIcon icon={faHeart} />
                  </div>
                  <h3>The Impact</h3>
                  <p>
                     {
                        "Building a thriving ecosystem where learners become leaders. Through collaborative features and innovative learning tools, we're creating opportunities for growth, mentorship, and professional development."
                     }
                  </p>
                  <div className={styles.cardStats}>
                     <div className={styles.statItem}>
                        <FontAwesomeIcon icon={faBriefcase} className={styles.statIcon} />
                        Career Growth
                     </div>
                     <div className={styles.statItem}>
                        <FontAwesomeIcon icon={faLightbulb} className={styles.statIcon} />
                        Innovation
                     </div>
                  </div>
               </motion.div>
            </div>
         </motion.section>

         <motion.section className={styles.philosophySection}>
            <div className={styles.philosophyWrapper}>
               <div className={styles.philosophyContent}>
                  <h2>Leadership Philosophy</h2>
                  <div className={styles.philosophyGrid}>
                     <div className={styles.philosophyItem}>
                        <div className={styles.philosophyIcon}>
                           <FontAwesomeIcon icon={faLightbulb} />
                        </div>
                        <h3>Innovation First</h3>
                        <p>Building technology that adapts to how people naturally learn and collaborate</p>
                     </div>
                     <div className={styles.philosophyItem}>
                        <div className={styles.philosophyIcon}>
                           <FontAwesomeIcon icon={faUsers} />
                        </div>
                        <h3>Community Driven</h3>
                        <p>Creating an environment where every learner&apos;s voice shapes our platform</p>
                     </div>
                     <div className={styles.philosophyItem}>
                        <div className={styles.philosophyIcon}>
                           <FontAwesomeIcon icon={faHeart} />
                        </div>
                        <h3>User Focused</h3>
                        <p>Every feature is designed with our learners&apos; success in mind</p>
                     </div>
                  </div>
               </div>
            </div>
         </motion.section>

         <motion.section className={styles.innovationSection}>
            <div className={styles.innovationWrapper}>
               <div className={styles.innovationContent}>
                  <span className={styles.sectionTag}>Our Innovation</span>
                  <h2>Transforming Learning Through Technology</h2>
                  <div className={styles.innovationHighlights}>
                     <div className={styles.highlight}>
                        <h3>AI-Powered Learning Paths</h3>
                        <p>Personalized learning experiences that adapt to each student&apos;s pace and style</p>
                     </div>
                     <div className={styles.highlight}>
                        <h3>Real-time Collaboration</h3>
                        <p>Advanced tools that make remote learning feel like in-person interaction</p>
                     </div>
                     <div className={styles.highlight}>
                        <h3>Smart Progress Tracking</h3>
                        <p>Data-driven insights that help learners stay motivated and on track</p>
                     </div>
                  </div>
               </div>
            </div>
         </motion.section>
      </div>
   );
}

export default AboutMe;
