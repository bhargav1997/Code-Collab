import { Link } from "react-router-dom";
import { SEO } from "../common/SEO";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCode, faUsers, faTrophy, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./LandingPage.module.css";

function LandingPage() {
   return (
      <div className={`${styles.landingWrapper} landing-page`}>
         <SEO
            title='LearnHUB - Transform Your Learning Journey'
            description='Track progress, join challenges, connect with mentors. Start your personalized learning journey today!'
            image='/images/landing-banner.jpg'
            keywords='learning platform, skill tracking, online education'
            path='/'
         />

         {/* Hero Section */}
         <section className={styles.heroSection}>
            <div className={styles.heroOverlay}></div>
            <div className={styles.heroContent}>
               <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={styles.mainTitle}>
                  Master New Skills with <span className={styles.highlight}>LearnHUB</span>
               </motion.h1>
               <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={styles.subTitle}>
                  Your personalized learning journey starts here. Track progress, join challenges, and connect with a community of learners
                  worldwide.
               </motion.p>
               <motion.div
                  className={styles.ctaButtons}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}>
                  <Link to='/register' className={styles.primaryButton}>
                     Get Started Free <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
                  </Link>
                  <Link to='/login' className={styles.secondaryButton}>
                     Sign In
                  </Link>
               </motion.div>
            </div>
            <div className={styles.heroImage}>
               <img src='/dashboard-preview.png' alt='LearnHUB Dashboard' />
            </div>
         </section>

         {/* Features Section */}
         <section className={styles.featuresSection}>
            <div className={styles.sectionHeader}>
               <span className={styles.sectionTag}>Features</span>
               <h2>Everything you need to succeed</h2>
               <p>Comprehensive tools and features to support your learning journey</p>
            </div>
            <div className={styles.featureGrid}>
               {[
                  {
                     icon: faChartLine,
                     title: "Progress Tracking",
                     description: "Visual analytics to monitor your learning journey",
                     color: "#7c4dff",
                  },
                  {
                     icon: faCode,
                     title: "Coding Challenges",
                     description: "Interactive challenges to test your skills",
                     color: "#ff4d8c",
                  },
                  {
                     icon: faUsers,
                     title: "Community",
                     description: "Connect with fellow learners worldwide",
                     color: "#4dcfff",
                  },
                  {
                     icon: faTrophy,
                     title: "Achievements",
                     description: "Earn badges and track your milestones",
                     color: "#ffb74d",
                  },
               ].map((feature, index) => (
                  <motion.div
                     key={index}
                     className={styles.featureCard}
                     whileHover={{ y: -5, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                     style={{ "--accent-color": feature.color }}>
                     <div className={styles.featureIcon}>
                        <FontAwesomeIcon icon={feature.icon} />
                     </div>
                     <h3>{feature.title}</h3>
                     <p>{feature.description}</p>
                  </motion.div>
               ))}
            </div>
         </section>

         {/* Stats Section */}
         <section className={styles.statsSection}>
            <div className={styles.statsGrid}>
               {[
                  { number: "10K+", label: "Active Learners" },
                  { number: "500+", label: "Learning Paths" },
                  { number: "1M+", label: "Completed Tasks" },
                  { number: "95%", label: "Success Rate" },
               ].map((stat, index) => (
                  <motion.div
                     key={index}
                     className={styles.statCard}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: index * 0.1 }}>
                     <h3>{stat.number}</h3>
                     <p>{stat.label}</p>
                  </motion.div>
               ))}
            </div>
         </section>

         {/* CTA Section */}
         <section className={styles.ctaSection}>
            <div className={styles.ctaContent}>
               <h2>Ready to Start Your Learning Journey?</h2>
               <p>Join thousands of learners who are achieving their goals with LearnHUB</p>
               <Link to='/register' className={styles.primaryButton}>
                  Get Started Now <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
               </Link>
            </div>
         </section>
      </div>
   );
}

export default LandingPage;
