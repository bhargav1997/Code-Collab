import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faRocket,
   faUsers,
   faGraduationCap,
   faArrowRight,
   faTrophy,
   faChartLine,
   faHeart,
   faMessage,
   faCalendarCheck,
   faShareNodes,
   faCode,
   faCog,
   faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "./LandingPage.module.css";

function LandingPage() {
   return (
      <div className={styles.landingWrapper}>
         {/* Hero Section */}
         <section className={styles.heroSection}>
            <div className={styles.floating3DElements}>
               {/* Floating Books */}
               {/* <div className={`${styles.floatingBook} ${styles.book1}`}>
                  <div className={styles.bookContent}>
                     <div className={styles.bookTitle}></div>
                     <div className={styles.bookLines}></div>
                  </div>
               </div>
               <div className={`${styles.floatingBook} ${styles.book2}`}>
                  <div className={styles.bookContent}>
                     <div className={styles.bookTitle}></div>
                     <div className={styles.bookLines}></div>
                  </div>
               </div> */}

               {/* Graduation Cap */}
               <div className={styles.graduationCap}>
                  <svg viewBox="0 0 24 24" fill="#7c4dff">
                     <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
                  </svg>
               </div>

               {/* Coding Element */}
               {/* <div className={styles.codingElement}>
                  <div className={styles.codeLine} style={{width: '80%'}}></div>
                  <div className={styles.codeLine} style={{width: '60%'}}></div>
                  <div className={styles.codeLine} style={{width: '70%'}}></div>
               </div> */}

               {/* Certificate */}
               {/* <div className={styles.certificate}></div> */}
            </div>

            <div className={styles.heroContent}>
               <motion.span className={styles.badge} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  🚀 Welcome to the Future of Learning
               </motion.span>
               <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={styles.mainTitle}>
                  Learn, Connect, and Grow with <span className={styles.highlight}>LearnHUB</span>
               </motion.h1>
               <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={styles.subTitle}>
                  Your all-in-one platform for professional growth and skill development. Join our community of learners and achieve your
                  goals.
               </motion.p>
               <motion.div
                  className={styles.ctaButtons}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}>
                  <Link to='/register' className={styles.primaryButton}>
                     Get Started
                     <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                  <Link to='/about' className={styles.secondaryButton}>
                     Learn More
                  </Link>
               </motion.div>
            </div>
            <motion.div
               className={styles.heroImage}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.2 }}>
               <img src='/modern-dashboard.png' alt='LearnHUB Platform' />
            </motion.div>
         </section>

         {/* Features Section */}
         <section className={styles.featuresSection}>
            <div className={styles.sectionHeader}>
               <span className={styles.sectionTag}>Why Choose LearnHUB</span>
               <h2>Features that Set Us Apart</h2>
            </div>

            <div className={styles.featuresRow}>
               {[
                  {
                     icon: faMessage,
                     title: "Real-time Chat",
                     description: "Connect instantly with fellow learners through our messaging system",
                     color: "#7c4dff",
                     gradient: "linear-gradient(135deg, #7c4dff20 0%, #7c4dff10 100%)",
                  },
                  {
                     icon: faChartLine,
                     title: "Learning Journey",
                     description: "Create custom learning paths and track your educational goals",
                     color: "#00bfa5",
                     gradient: "linear-gradient(135deg, #00bfa520 0%, #00bfa510 100%)",
                  },
                  {
                     icon: faTrophy,
                     title: "Leaderboard",
                     description: "Compete with others and track your position as you progress",
                     color: "#ff5252",
                     gradient: "linear-gradient(135deg, #ff525220 0%, #ff525210 100%)",
                  },
                  {
                     icon: faCalendarCheck,
                     title: "Calendar & Reminders",
                     description: "Schedule study sessions and never miss important deadlines",
                     color: "#ffd740",
                     gradient: "linear-gradient(135deg, #ffd74020 0%, #ffd74010 100%)",
                  },
                  {
                     icon: faShareNodes,
                     title: "Share Journey",
                     description: "Share your learning journey and inspire others in the community",
                     color: "#2196f3",
                     gradient: "linear-gradient(135deg, #2196f320 0%, #2196f310 100%)",
                  },
                  {
                     icon: faCode,
                     title: "Coding Challenges",
                     description: "Practice and improve your coding skills with regular challenges",
                     color: "#9c27b0",
                     gradient: "linear-gradient(135deg, #9c27b020 0%, #9c27b010 100%)",
                  },
                  {
                     icon: faRocket,
                     title: "Create Journey",
                     description: "Design and customize your own learning path from scratch",
                     color: "#4caf50",
                     gradient: "linear-gradient(135deg, #4caf5020 0%, #4caf5010 100%)",
                  },
                  {
                     icon: faCog,
                     title: "Customization",
                     description: "Personalize your learning environment to suit your needs",
                     color: "#ff9800",
                     gradient: "linear-gradient(135deg, #ff980020 0%, #ff980010 100%)",
                  },
               ].map((feature, index) => (
                  <motion.div
                     key={index}
                     className={styles.featureCard}
                     style={{
                        background: feature.gradient,
                        borderTop: `3px solid ${feature.color}`,
                     }}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: index * 0.1 }}
                     whileHover={{
                        y: -5,
                        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                     }}>
                     <div className={styles.featureIcon} style={{ color: feature.color }}>
                        <FontAwesomeIcon icon={feature.icon} />
                     </div>
                     <h3>{feature.title}</h3>
                     <p>{feature.description}</p>
                  </motion.div>
               ))}
            </div>
         </section>

         {/* How It Works Section */}
         <section className={styles.howItWorksSection}>
            {/* Decorative dots */}
            <div className={`${styles.bgDots} ${styles.bgDots1}`}></div>
            <div className={`${styles.bgDots} ${styles.bgDots2}`}></div>

            <div className={styles.sectionHeader}>
               <span className={styles.sectionTag}>Getting Started</span>
               <h2>How LearnHUB Works</h2>
               <p>Your journey to effective learning in four simple steps</p>
            </div>

            <div className={styles.timelineWrapper}>
               <div className={styles.timeline}>
                  {[
                     {
                        number: "01",
                        icon: faRocket,
                        title: "Create Your Profile",
                        description: "Set up your personalized learning space and define your goals. Choose your interests and preferred learning style.",
                        color: "#7c4dff"
                     },
                     {
                        number: "02",
                        icon: faUsers,
                        title: "Join Learning Circles",
                        description: "Connect with like-minded learners in your field. Share resources and learn from each other's experiences.",
                        color: "#6366f1"
                     },
                     {
                        number: "03",
                        icon: faTrophy,
                        title: "Practice & Compete",
                        description: "Take on coding challenges, participate in hackathons, and climb the leaderboard rankings.",
                        color: "#7c4dff"
                     },
                     {
                        number: "04",
                        icon: faChartLine,
                        title: "Track Your Growth",
                        description: "Monitor your progress with detailed analytics. Celebrate milestones and unlock achievements.",
                        color: "#6366f1"
                     }
                  ].map((step, index) => (
                     <motion.div
                        key={index}
                        className={styles.timelineStep}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                     >
                        <div className={styles.stepCard}>
                           <div className={styles.stepNumber}>{step.number}</div>
                           <div className={styles.stepIcon}>
                              <FontAwesomeIcon icon={step.icon} />
                           </div>
                           <div className={styles.stepContent}>
                              <h3>{step.title}</h3>
                              <p>{step.description}</p>
                              <a href="#" className={styles.learnMore}>
                                 Learn more 
                                 <FontAwesomeIcon icon={faArrowRight} />
                              </a>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </div>
         </section>

         {/* CTA Section */}
         <section className={styles.ctaSection}>
            <div className={styles.ctaContent}>
               <h2>Ready to Start Your Journey?</h2>
               <p>Join thousands of learners already on LearnHUB</p>
               <Link to='/register' className={styles.primaryButton}>
                  Get Started Free
                  <FontAwesomeIcon icon={faArrowRight} />
               </Link>
            </div>
         </section>

         {/* Contact Section */}
         <section className={styles.contactSection}>
            <div className={styles.contactWrapper}>
               <div className={styles.contactContent}>
                  <motion.div
                     className={styles.contactText}
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}>
                     <span className={styles.sectionTag}>Get in Touch</span>
                     <h2>Have Questions? Let&apos;s Connect!</h2>
                     <p>We&apos;re here to help you on your learning journey</p>
                  </motion.div>

                  <motion.div
                     className={styles.contactCards}
                     initial={{ opacity: 0, x: 20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}>
                     <a href='mailto:hello.learnhub@gmail.com' className={styles.contactCard}>
                        <div className={styles.contactIcon}>
                           <FontAwesomeIcon icon={faEnvelope} />
                        </div>
                        <div className={styles.contactInfo}>
                           <h3>Email Us</h3>
                           <p>hello.learnhub@gmail.com</p>
                        </div>
                        <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
                     </a>

                     <a
                        href='https://linkedin.com/in/bhargav-suthar'
                        target='_blank'
                        rel='noopener noreferrer'
                        className={styles.contactCard}>
                        <div className={styles.contactIcon}>
                           <FontAwesomeIcon icon={faLinkedin} />
                        </div>
                        <div className={styles.contactInfo}>
                           <h3>Connect on LinkedIn</h3>
                           <p>Bhargav Suthar</p>
                        </div>
                        <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
                     </a>

                     <a href='https://twitter.com/bsuthar_712' target='_blank' rel='noopener noreferrer' className={styles.contactCard}>
                        <div className={styles.contactIcon}>
                           <FontAwesomeIcon icon={faTwitter} />
                        </div>
                        <div className={styles.contactInfo}>
                           <h3>Follow on Twitter</h3>
                           <p>@bsuthar_712</p>
                        </div>
                        <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
                     </a>
                  </motion.div>
               </div>
            </div>
         </section>

         {/* Modern Footer */}
         <footer className={styles.footer}>
            <div className={styles.footerContent}>
               <div className={styles.footerBrand}>
                  <h3>LearnHUB</h3>
                  <p>
                     Empowering students through peer-to-peer learning, skill development, and collaborative education. Join our community
                     of learners today.
                  </p>
                  <div className={styles.socialLinks}>
                     <a href='https://linkedin.com/in/bhargav-suthar' target='_blank' rel='noopener noreferrer' title='Connect on LinkedIn'>
                        <FontAwesomeIcon icon={faLinkedin} />
                     </a>
                     <a href='https://twitter.com/bsuthar_712' target='_blank' rel='noopener noreferrer' title='Follow on Twitter'>
                        <FontAwesomeIcon icon={faTwitter} />
                     </a>
                     <a href='https://github.com/bhargav1997' target='_blank' rel='noopener noreferrer' title='View on GitHub'>
                        <FontAwesomeIcon icon={faGithub} />
                     </a>
                  </div>
               </div>

               <div className={styles.footerSections}>
                  <div className={styles.footerSection}>
                     <h4>Platform</h4>
                     <Link to='/about-me'>About Me</Link>
                     <Link to='/contact'>Contact Us</Link>
                     <Link to='/careers'>Careers</Link>
                  </div>

                  <div className={styles.footerSection}>
                     <h4>Features</h4>
                     <Link to='/messages'>Real-time Chat</Link>
                     <Link to='/learning-journey'>Learning Journey</Link>
                     <Link to='/challenges'>Challenges</Link>
                     <Link to='/leaderboard'>Leaderboard</Link>
                  </div>

                  <div className={styles.footerSection}>
                     <h4>Legal</h4>
                     <Link to='/privacy-policy'>Privacy Policy</Link>
                     <Link to='/terms-of-use'>Terms of Use</Link>
                     <Link to='/guidelines'>Guidelines</Link>
                  </div>
               </div>
            </div>

            <div className={styles.footerBottom}>
               <div className={styles.footerInfo}>
                  <p className={styles.footerTagline}>
                     <FontAwesomeIcon icon={faGraduationCap} className={styles.footerIcon} />
                     Made with <FontAwesomeIcon icon={faHeart} className={styles.heartIcon} /> for Learners by
                     <span className={styles.highlight}> LearnHUB</span>
                  </p>
                  <p>&copy; {new Date().getFullYear()} LearnHUB. All rights reserved.</p>
               </div>
               <div className={styles.footerBadges}>
                  <span className={styles.badge}>
                     <FontAwesomeIcon icon={faUsers} /> Growing Community
                  </span>
                  <span className={styles.badge}>
                     <FontAwesomeIcon icon={faGraduationCap} /> Active Study Groups
                  </span>
               </div>
            </div>
         </footer>
      </div>
   );
}

export default LandingPage;
