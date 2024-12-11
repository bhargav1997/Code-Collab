import { memo, useState } from "react";
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
   faLightbulb,
   faUserGroup,
   faPuzzlePiece,
   faChartSimple,
   faBug,
   faClockRotateLeft,
   faShieldHeart,
   faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faTwitter, faGithub, faFacebook } from "@fortawesome/free-brands-svg-icons";
import styles from "./LandingPage.module.css";
import HomeImage from "../../assets/images/Home.png";
import LearningJourneyImage from "../../assets/images/learning-journey.png";

import LeaderBoardImage from "../../assets/demo/Leaderboard.png";
import JourneyMapImage from "../../assets/demo/JourneyMap.png";
import RegisterImage from "../../assets/demo/Register.png";
import CalendarSessionImage from "../../assets/demo/CalendarSession.png";
import CreateLearningImage from "../../assets/demo/CreateLearning.png";
import PrivacyImage from "../../assets/demo/Privacy.png";
import FriendsImage from "../../assets/demo/Friends.png";
import CalendarImage from "../../assets/demo/Calendar.png";
import ProfileImage from "../../assets/demo/Profile.png";
import ChallengeImage from "../../assets/demo/Challenge.png";
import CreateChallengeImage from "../../assets/demo/CreateChallenge.png";
import MessageImage from "../../assets/demo/Message.png";
import ReportImage from "../../assets/demo/Report.png";
import SettingImage from "../../assets/demo/Setting.png";
import { Helmet } from "react-helmet";

const LandingPageHeaders = () => {
   return (
      <Helmet>
         <title>LearnHUB - Your Gateway to Professional Growth</title>
         <meta
            name='description'
            content='Join LearnHUB, the ultimate platform for professional growth. Connect, learn, and achieve your career goals with personalized learning paths and skill tracking.'
         />
         <meta
            name='keywords'
            content='LearnHUB, professional growth, skill development, personalized learning, online education, track skills, learning community'
         />
         <meta name='robots' content='index, follow' />

         {/* Open Graph Meta Tags */}
         <meta property='og:title' content='LearnHUB - Your Gateway to Professional Growth' />
         <meta
            property='og:description'
            content='Discover LearnHUB, the all-in-one platform for skill development and career growth. Start your learning journey today!'
         />
         <meta property='og:image' content={HomeImage} />
         <meta property='og:url' content='https://www.trackmyskills.tech/' />
         <meta property='og:type' content='website' />

         {/* Twitter Meta Tags */}
         <meta name='twitter:card' content='summary_large_image' />
         <meta name='twitter:title' content='LearnHUB - Your Gateway to Professional Growth' />
         <meta
            name='twitter:description'
            content='Join the LearnHUB community to grow professionally and develop essential skills. Your success starts here!'
         />
         <meta name='twitter:image' content={HomeImage} />
      </Helmet>
   );
};

function LandingPage() {
   const [touchedFields, setTouchedFields] = useState({});

   const handleBlur = (fieldName) => {
      setTouchedFields((prev) => ({
         ...prev,
         [fieldName]: true,
      }));
   };

   const features = [
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
   ];
   const howItWorksSteps = [
      {
         number: "01",
         icon: faRocket,
         title: "Create Your Profile",
         description: "Set up your personalized learning space and define your goals. Choose your interests and preferred learning style.",
         color: "#7c4dff",
      },
      {
         number: "02",
         icon: faUsers,
         title: "Join Learning Circles",
         description: "Connect with like-minded learners in your field. Share resources and learn from each other's experiences.",
         color: "#6366f1",
      },
      {
         number: "03",
         icon: faTrophy,
         title: "Practice & Compete",
         description: "Take on coding challenges, participate in hackathons, and climb the leaderboard rankings.",
         color: "#7c4dff",
      },
      {
         number: "04",
         icon: faChartLine,
         title: "Track Your Growth",
         description: "Monitor your progress with detailed analytics. Celebrate milestones and unlock achievements.",
         color: "#6366f1",
      },
   ];

   return (
      <div className={styles.landingWrapper}>
         <LandingPageHeaders />
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
                  <svg viewBox='0 0 24 24' fill='#7c4dff'>
                     <path d='M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z' />
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
               <img src={HomeImage} alt='LearnHUB Platform' />
            </motion.div>
         </section>

         {/* Features Section */}
         <section className={styles.featuresSection}>
            <div className={styles.sectionHeader}>
               <span className={styles.sectionTag}>Why Choose LearnHUB</span>
               <h2>Features that Set Us Apart</h2>
            </div>

            <div className={styles.featuresRow}>
               {features.map((feature, index) => (
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
                  {howItWorksSteps.map((step, index) => (
                     <motion.div
                        key={index}
                        className={styles.timelineStep}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}>
                        <div className={styles.stepCard}>
                           <div className={styles.stepNumber}>{step.number}</div>
                           <div className={styles.stepIcon}>
                              <FontAwesomeIcon icon={step.icon} />
                           </div>
                           <div className={styles.stepContent}>
                              <h3>{step.title}</h3>
                              <p>{step.description}</p>
                              <a href='#' className={styles.learnMore}>
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

         {/* Why LearnHUB Section */}
         <section className={styles.whySection}>
            <div className={styles.whyWrapper}>
               <motion.div
                  className={styles.whyContent}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}>
                  <span className={styles.missionTag}>
                     <FontAwesomeIcon icon={faLightbulb} /> Why We Built This
                  </span>
                  <h2 className={styles.whyTitle}>Reimagining Learning for Today&apos;s Digital Age</h2>

                  <div className={styles.problemPoints}>
                     <motion.div
                        className={styles.problemPoint}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}>
                        <div className={styles.pointIcon}>
                           <FontAwesomeIcon icon={faUserGroup} />
                        </div>
                        <div className={styles.pointContent}>
                           <h3>Isolation in Online Learning</h3>
                           <p>
                              Many students feel disconnected and alone in their learning journey, missing the collaborative spirit of
                              traditional classrooms.
                           </p>
                        </div>
                     </motion.div>

                     <motion.div
                        className={styles.problemPoint}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}>
                        <div className={styles.pointIcon}>
                           <FontAwesomeIcon icon={faPuzzlePiece} />
                        </div>
                        <div className={styles.pointContent}>
                           <h3>Fragmented Resources</h3>
                           <p>
                              Learning resources are scattered across platforms, making it difficult to maintain a structured and effective
                              learning path.
                           </p>
                        </div>
                     </motion.div>

                     <motion.div
                        className={styles.problemPoint}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}>
                        <div className={styles.pointIcon}>
                           <FontAwesomeIcon icon={faChartSimple} />
                        </div>
                        <div className={styles.pointContent}>
                           <h3>Lack of Progress Tracking</h3>
                           <p>
                              Students struggle to measure their progress and stay motivated without clear milestones and achievement
                              markers.
                           </p>
                        </div>
                     </motion.div>
                  </div>
               </motion.div>

               {/* <motion.div
                  className={styles.solutionVisual}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}>
                  <img src={LearningJourneyImage} alt='LearnHUB Community Learning' className={styles.visualImage} />
                  <div className={styles.gradientOverlay}></div>
               </motion.div> */}
            </div>
         </section>

         {/* App Showcase Section */}
         <section className={styles.appShowcase}>
            <div className={styles.showcaseBackground}>
               <div className={styles.bgGlow1}></div>
               <div className={styles.bgGlow2}></div>
               <div className={styles.floatingShape1}></div>
               <div className={styles.floatingShape2}></div>
               <div className={styles.floatingShape3}></div>
            </div>

            <div className={styles.showcaseHeader}>
               <h2>Explore Our Platform</h2>
               <p>Take a tour through LearnHub's powerful features</p>
            </div>

            <div className={styles.showcaseContainer}>
               <div className={styles.showcaseCarousel}>
                  <div className={styles.showcaseItem}>
                     <img src={HomeImage} alt='Explore Home Page Features | LearnHub' className={styles.showcaseImage} />
                     <div className={styles.showcaseContent}>
                        <h3>Explore Trending Topics</h3>
                        <p>Discover popular posts, trending tags, and stay updated on the latest topics.</p>
                     </div>
                  </div>

                  <div className={styles.showcaseItem}>
                     <img
                        src={LearningJourneyImage}
                        alt='Learning Journey Customization | TrackMySkills'
                        className={styles.showcaseImage}
                     />
                     <div className={styles.showcaseContent}>
                        <h3>Personalized Learning Journey</h3>
                        <p>Create a customized learning path and monitor your skill development progress.</p>
                     </div>
                  </div>

                  <div className={styles.showcaseItem}>
                     <img src={CalendarImage} alt='Schedule Learning Activities | LearnHub Calendar' className={styles.showcaseImage} />
                     <div className={styles.showcaseContent}>
                        <h3>Interactive Calendar</h3>
                        <p>Plan and manage your learning schedule effortlessly with email reminders.</p>
                     </div>
                  </div>

                  <div className={styles.showcaseItem}>
                     <img src={CalendarSessionImage} alt='Coding Challenges | Improve Skills' className={styles.showcaseImage} />
                     <div className={styles.showcaseContent}>
                        <h3>Coding Challenges</h3>
                        <p>Participate in engaging challenges to sharpen your coding abilities and track improvements.</p>
                     </div>
                  </div>

                  <div className={styles.showcaseItem}>
                     <img src={ChallengeImage} alt='Challenges Dashboard Overview | TrackMySkills' className={styles.showcaseImage} />
                     <div className={styles.showcaseContent}>
                        <h3>Challenges Dashboard</h3>
                        <p>Review your progress, achievements, and badges on a comprehensive dashboard.</p>
                     </div>
                  </div>

                  <div className={styles.showcaseItem}>
                     <img src={CreateChallengeImage} alt='Create a Coding Challenge | Track Progress' className={styles.showcaseImage} />
                     <div className={styles.showcaseContent}>
                        <h3>Create Challenges</h3>
                        <p>Design custom challenges and track detailed insights into your performance.</p>
                     </div>
                  </div>

                  <div className={styles.showcaseItem}>
                     <img src={FriendsImage} alt='Manage Connections | LearnHub' className={styles.showcaseImage} />
                     <div className={styles.showcaseContent}>
                        <h3>Connect with Friends</h3>
                        <p>Build meaningful connections and collaborate with like-minded learners.</p>
                     </div>
                  </div>

                  <div className={styles.showcaseItem}>
                     <img src={JourneyMapImage} alt='Visualize Your Journey Map | TrackMySkills' className={styles.showcaseImage} />
                     <div className={styles.showcaseContent}>
                        <h3>Journey Mapping</h3>
                        <p>Create a visual roadmap of your learning journey and share resources with peers.</p>
                     </div>
                  </div>

                  <div className={styles.showcaseItem}>
                     <img src={ProfileImage} alt='Update Profile and Preferences | LearnHub' className={styles.showcaseImage} />
                     <div className={styles.showcaseContent}>
                        <h3>Profile Management</h3>
                        <p>Update your personal information and preferences with ease.</p>
                     </div>
                  </div>

                  <div className={styles.showcaseItem}>
                     <img
                        src={LeaderBoardImage}
                        alt='Track Your Rank on the Leaderboard | TrackMySkills'
                        className={styles.showcaseImage}
                     />
                     <div className={styles.showcaseContent}>
                        <h3>Leaderboard Insights</h3>
                        <p>Compete with peers and monitor your progress through leaderboard rankings.</p>
                     </div>
                  </div>

                  <div className={styles.showcaseItem}>
                     <img src={RegisterImage} alt='Create an Account | Join LearnHub' className={styles.showcaseImage} />
                     <div className={styles.showcaseContent}>
                        <h3>Easy Registration</h3>
                        <p>Sign up to start your personalized learning experience with us.</p>
                     </div>
                  </div>

                  <div className={styles.showcaseItem}>
                     <img src={PrivacyImage} alt='Privacy Settings and Data Control | TrackMySkills' className={styles.showcaseImage} />
                     <div className={styles.showcaseContent}>
                        <h3>Privacy Control</h3>
                        <p>Manage your data-sharing preferences and maintain full control of your account.</p>
                     </div>
                  </div>

                  <div className={styles.showcaseItem}>
                     <img src={CreateLearningImage} alt='Design Learning Resources | LearnHub' className={styles.showcaseImage} />
                     <div className={styles.showcaseContent}>
                        <h3>Create Learning Resources</h3>
                        <p>Organize and share your learning resources with others in the community.</p>
                     </div>
                  </div>

                  <div className={styles.showcaseItem}>
                     <img src={MessageImage} alt='Send Real-Time Messages | Connect on LearnHub' className={styles.showcaseImage} />
                     <div className={styles.showcaseContent}>
                        <h3>Real-Time Messaging</h3>
                        <p>Communicate with friends and mentors using our seamless messaging feature.</p>
                     </div>
                  </div>

                  <div className={styles.showcaseItem}>
                     <img src={ReportImage} alt='Progress Reports | Analyze Your Learning' className={styles.showcaseImage} />
                     <div className={styles.showcaseContent}>
                        <h3>Learning Reports</h3>
                        <p>Analyze your overall progress and achievements through detailed reports.</p>
                     </div>
                  </div>

                  <div className={styles.showcaseItem}>
                     <img src={SettingImage} alt='Update Account Settings | TrackMySkills' className={styles.showcaseImage} />
                     <div className={styles.showcaseContent}>
                        <h3>Account Settings</h3>
                        <p>Configure your account settings to match your learning goals and preferences.</p>
                     </div>
                  </div>
               </div>
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

         {/* FAQ Section */}
         <section className={styles.faqSection}>
            <div className={styles.faqWrapper}>
               <motion.div
                  className={styles.faqHeader}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}>
                  <h2>Frequently Asked Questions</h2>
                  <p>Everything you need to know about LearnHUB</p>
               </motion.div>

               <div className={styles.faqGrid}>
                  <motion.div
                     className={styles.faqCategory}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}>
                     <h3>Getting Started</h3>
                     <div className={styles.faqList}>
                        <details className={styles.faqItem}>
                           <summary>What is LearnHUB?</summary>
                           <p>
                              LearnHUB is a collaborative learning platform designed for students to connect, share knowledge, and grow
                              together. It combines real-time communication, resource sharing, and interactive learning tools to create an
                              engaging educational experience.
                           </p>
                        </details>

                        <details className={styles.faqItem}>
                           <summary>How do I get started?</summary>
                           <p>
                              Simply sign up for a free account, complete your profile, and start exploring! You can join study groups,
                              participate in discussions, or create your own learning content.
                           </p>
                        </details>

                        <details className={styles.faqItem}>
                           <summary>Is LearnHUB free to use?</summary>
                           <p>
                              Yes, LearnHUB&apos;s core features are completely free for students. We believe in making quality education
                              accessible to everyone.
                           </p>
                        </details>
                     </div>
                  </motion.div>

                  <motion.div
                     className={styles.faqCategory}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}>
                     <h3>Features & Usage</h3>
                     <div className={styles.faqList}>
                        <details className={styles.faqItem}>
                           <summary>What features does LearnHUB offer?</summary>
                           <p>
                              LearnHUB includes real-time chat, video calls, document sharing, collaborative whiteboards, study group
                              formation, progress tracking, and personalized learning paths.
                           </p>
                        </details>

                        <details className={styles.faqItem}>
                           <summary>Can I create my own study group?</summary>
                           <p>
                              Yes! You can create custom study groups, invite peers, share resources, and collaborate in real-time. Groups
                              can be public or private based on your preferences.
                           </p>
                        </details>

                        <details className={styles.faqItem}>
                           <summary>How does the messaging system work?</summary>
                           <p>
                              Our real-time messaging system allows you to communicate with peers instantly. You can share text, files, code
                              snippets, and even conduct video calls within the platform.
                           </p>
                        </details>
                     </div>
                  </motion.div>

                  <motion.div
                     className={styles.faqCategory}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}>
                     <h3>Privacy & Security</h3>
                     <div className={styles.faqList}>
                        <details className={styles.faqItem}>
                           <summary>Is my data secure on LearnHUB?</summary>
                           <p>
                              Yes, we take security seriously. All data is encrypted, and we follow industry-standard security practices to
                              protect your information.
                           </p>
                        </details>

                        <details className={styles.faqItem}>
                           <summary>Who can see my profile?</summary>
                           <p>
                              You have full control over your privacy settings. You can choose what information is visible to others and
                              manage who can contact you.
                           </p>
                        </details>
                     </div>
                  </motion.div>

                  <motion.div
                     className={styles.faqCategory}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}>
                     <h3>Support & Community</h3>
                     <div className={styles.faqList}>
                        <details className={styles.faqItem}>
                           <summary>How can I get help if I need it?</summary>
                           <p>You can reach our support team at hello.learnhub@gmail.com. We typically respond within 24-48 hours.</p>
                        </details>

                        <details className={styles.faqItem}>
                           <summary>Can I contribute to LearnHUB?</summary>
                           <p>
                              Yes! We welcome feedback and suggestions. You can report bugs, suggest features, or even contribute to our
                              open-source components.
                           </p>
                        </details>
                     </div>
                  </motion.div>
               </div>
            </div>
         </section>

         {/* Bug Report Section */}
         <section className={styles.bugReportSection}>
            <div className={styles.bugReportWrapper}>
               <motion.div
                  className={styles.bugReportGrid}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}>
                  <div className={styles.reportInfo}>
                     <div className={styles.reportHeader}>
                        <span className={styles.bugReportIcon}>
                           <FontAwesomeIcon icon={faBug} />
                        </span>
                        <h2>Help Us Improve LearnHUB</h2>
                     </div>
                     <p>Found a bug? Have a suggestion? We&apos;re here to listen and make LearnHUB better for everyone.</p>

                     <div className={styles.reportFeatures}>
                        <div className={styles.featureItem}>
                           <FontAwesomeIcon icon={faClockRotateLeft} />
                           <span>24-48 hour response time</span>
                        </div>
                        <div className={styles.featureItem}>
                           <FontAwesomeIcon icon={faShieldHeart} />
                           <span>Private and secure</span>
                        </div>
                        <div className={styles.featureItem}>
                           <FontAwesomeIcon icon={faMessage} />
                           <span>Direct communication</span>
                        </div>
                     </div>
                  </div>

                  <div className={styles.reportFormContainer}>
                     <form
                        className={styles.reportForm}
                        onSubmit={(e) => {
                           e.preventDefault();
                           // Mark all fields as touched on submit attempt
                           const formElements = e.target.elements;
                           const newTouchedFields = {};
                           for (let element of formElements) {
                              if (element.name) {
                                 newTouchedFields[element.name] = true;
                              }
                           }
                           setTouchedFields(newTouchedFields);

                           // Continue with form submission if valid
                           if (e.target.checkValidity()) {
                              const formData = new FormData(e.target);
                              const subject = `${formData.get("type")}: ${formData.get("subject")}`;
                              const body = `Type: ${formData.get("type")}%0D%0A
                                           Description: ${formData.get("description")}%0D%0A
                                           File Sharing Link: ${formData.get("attachmentLink") || "N/A"}`;

                              window.location.href = `mailto:hello.learnhub@gmail.com?subject=${subject}&body=${body}`;
                           }
                        }}>
                        <div className={styles.formGrid}>
                           <div className={styles.formGroup + " " + styles.fullWidth}>
                              <label>
                                 Report Type
                                 <span className={styles.required}>*</span>
                              </label>
                              <select
                                 name='type'
                                 required
                                 className={`${styles.requiredField} ${touchedFields.type && styles.touched}`}
                                 onBlur={() => handleBlur("type")}>
                                 <option value=''>Select type</option>
                                 <option value='Bug Report'>Bug Report</option>
                                 <option value='Feature Request'>Feature Request</option>
                                 <option value='Improvement'>Improvement</option>
                              </select>
                           </div>

                           <div className={styles.formGroup + " " + styles.fullWidth}>
                              <label>
                                 Subject
                                 <span className={styles.required}>*</span>
                              </label>
                              <input
                                 type='text'
                                 name='subject'
                                 placeholder='Brief description of the issue'
                                 required
                                 className={`${styles.requiredField} ${touchedFields.subject ? styles.touched : ""}`}
                                 minLength='10'
                                 onBlur={() => handleBlur("subject")}
                              />
                           </div>

                           <div className={styles.formGroup + " " + styles.fullWidth}>
                              <label>
                                 Description
                                 <span className={styles.required}>*</span>
                              </label>
                              <textarea
                                 name='description'
                                 placeholder='Please describe what happened or what you would like to see'
                                 rows='3'
                                 required
                                 className={styles.requiredField}
                                 minLength='30'
                              />
                           </div>

                           <div className={styles.formGroup + " " + styles.fullWidth}>
                              <label>
                                 Screenshots/Files <span className={styles.optional}>(Optional)</span>
                              </label>
                              <input
                                 type='text'
                                 name='attachmentLink'
                                 placeholder='Paste your file sharing link here (Google Drive, Dropbox, etc.)'
                              />
                           </div>
                        </div>

                        <button type='submit' className={styles.submitButton}>
                           <FontAwesomeIcon icon={faPaperPlane} />
                           Submit Report
                        </button>
                     </form>
                  </div>
               </motion.div>
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

         {/* Footer */}
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
                     <a href='https://github.com/bhargav1997' target='_blank' rel='noopener noreferrer' title='View on GitHub | Owner Of LearnHub'>
                        <FontAwesomeIcon icon={faGithub} />
                     </a>
                     <a href='https://www.facebook.com/people/LearnHub-Track-My-Skills/61570034825290/' target='_blank' rel='noopener noreferrer' title='View on Facebook | LearnHub'>
                        <FontAwesomeIcon icon={faFacebook} />
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

export default memo(LandingPage);
