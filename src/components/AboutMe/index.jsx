import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
   faEnvelope,
   faPhone,
   faMapMarkerAlt,
   faArrowLeft,
   faLightbulb,
   faRocket,
   faHeart,
   faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import styles from "./AboutMe.module.css";
import { useNavigate } from "react-router-dom";

function AboutMe() {
   const navigate = useNavigate();

   const skills = {
      web: ["HTML5", "CSS", "JavaScript", "React", "Redux", "Next.js", "SASS", "TypeScript", "Bootstrap", "GraphQL", "React Native", "SEO"],
      server: [
         "Node.js",
         "Firebase",
         "Java",
         "C#",
         "Express.js",
         "Elasticsearch",
         "Python",
         "Docker",
         "AWS Lambda",
         "MongoDB",
         "SQL",
         "MySQL",
      ],
      tools: ["Asana", "Jira", "Trello", "Postman", "Git", "GitHub", "Azure", "Shopify", "Canva", "Figma"],
      testing: ["Selenium", "Cypress", "Jest", "Jasmine", "JUnit"],
      methodologies: ["Agile", "SDLC", "Scrum", "Waterfall"],
   };

   return (
      <div className={styles.aboutWrapper}>
         <button onClick={() => navigate("/")} className={styles.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Home
         </button>

         <motion.div className={styles.heroSection} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.heroContent}>
               <div className={styles.profileImage}>
                  {/* Add your profile image here */}
                  <img src='https://avatars.githubusercontent.com/u/27812306?v=4' alt='Bhargav Suthar' />
               </div>
               <div className={styles.profileInfo}>
                  <h1>Bhargav Suthar</h1>
                  <h2>Full Stack Developer</h2>
                  <div className={styles.contactInfo}>
                     <a href='mailto:sutharbhargav1997@gmail.com'>
                        <FontAwesomeIcon icon={faEnvelope} /> sutharbhargav1997@gmail.com
                     </a>
                     <a href='tel:+16472610782'>
                        <FontAwesomeIcon icon={faPhone} /> +1 647-261-0782
                     </a>
                     <span>
                        <FontAwesomeIcon icon={faMapMarkerAlt} /> Moose Jaw, SK
                     </span>
                  </div>
                  <div className={styles.socialLinks}>
                     <a href='https://www.linkedin.com/in/bhargav-suthar/' target='_blank' rel='noopener noreferrer'>
                        <FontAwesomeIcon icon={faLinkedin} />
                     </a>
                     <a href='https://github.com/bhargav1997' target='_blank' rel='noopener noreferrer'>
                        <FontAwesomeIcon icon={faGithub} />
                     </a>
                     <a href='https://twitter.com/bsuthar_712' target='_blank' rel='noopener noreferrer'>
                        <FontAwesomeIcon icon={faTwitter} />
                     </a>
                  </div>
                  {/* <button className={styles.resumeButton}>
                     <FontAwesomeIcon icon={faDownload} /> Download Resume
                  </button> */}
               </div>
            </div>
         </motion.div>

         <motion.section
            className={styles.motivationSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <div className={styles.motivationContent}>
               <h2>
                  <FontAwesomeIcon icon={faLightbulb} className={styles.motivationIcon} />
                  Project Motivation
               </h2>
               <div className={styles.motivationGrid}>
                  <div className={styles.motivationCard}>
                     <FontAwesomeIcon icon={faRocket} className={styles.cardIcon} />
                     <h3>Vision</h3>
                     <p>
                        To create an innovative learning platform that breaks down barriers in education and makes quality learning
                        accessible to everyone. LearnHUB aims to revolutionize how people acquire and share knowledge in the digital age.
                     </p>
                  </div>
                  <div className={styles.motivationCard}>
                     <FontAwesomeIcon icon={faHeart} className={styles.cardIcon} />
                     <h3>Purpose</h3>
                     <p>
                        Driven by the passion to build a community where learners can grow together, share experiences, and support each
                        other. Our goal is to make learning engaging, interactive, and tailored to individual needs.
                     </p>
                  </div>
                  <div className={styles.motivationCard}>
                     <FontAwesomeIcon icon={faUsers} className={styles.cardIcon} />
                     <h3>Impact</h3>
                     <p>
                        We believe in the power of collaborative learning and aim to create a platform that not only provides educational
                        content but also fosters meaningful connections and professional growth opportunities.
                     </p>
                  </div>
               </div>
            </div>
         </motion.section>

         <div className={styles.contentSection}>
            <motion.section
               className={styles.summary}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}>
               <h2>Professional Summary</h2>
               <p>
                  Accomplished Full Stack Developer with over 4+ years of experience in MERN stack development, delivering high-quality,
                  scalable web solutions using technologies like React, Node.js, and MongoDB. Proven leader and problem-solver, recognized
                  for exceptional critical thinking skills and a track record of driving project success with agile methodologies and SEO
                  techniques.
               </p>
            </motion.section>

            <motion.section
               className={styles.skills}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}>
               <h2>Technical Skills</h2>
               <div className={styles.skillsGrid}>
                  {Object.entries(skills).map(([category, skillList]) => (
                     <div key={category} className={styles.skillCategory}>
                        <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                        <div className={styles.skillTags}>
                           {skillList.map((skill) => (
                              <span key={skill} className={styles.skillTag}>
                                 {skill}
                              </span>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            </motion.section>

            <motion.section
               className={styles.experience}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}>
               <h2>Work Experience</h2>
               <div className={styles.timeline}>
                  {/* DentaVIBE Experience */}
                  <div className={styles.timelineItem}>
                     <div className={styles.timelineContent}>
                        <h3>Web Architect</h3>
                        <h4>DentaVIBE, Toronto, Canada</h4>
                        <span className={styles.date}>Aug 2024 - Nov 2024</span>
                        <ul>
                           <li>Architected responsive web interfaces with React and Tailwind</li>
                           <li>Optimized data handling with efficient database structures</li>
                           <li>Integrated third-party APIs securely</li>
                        </ul>
                     </div>
                  </div>

                  {/* Software Developer Experience */}
                  <div className={styles.timelineItem}>
                     <div className={styles.timelineContent}>
                        <h3>Software Developer</h3>
                        <h4>Surekha Technologies, Ahmedabad, India</h4>
                        <span className={styles.date}>Jan 2019 - Aug 2022</span>
                        <ul>
                           <li>Boosted client satisfaction through effective leadership, earning Employee of the Year award</li>
                           <li>Elevated team performance by 20% in project delivery speed and reduced bug reports by 25%</li>
                           <li>Optimised application performance, reducing page load times by 30%</li>
                           <li>Enhanced user experience by integrating new features and functionalities</li>
                           <li>Advanced back-end development using Node.js, Java, Firebase, and Docker</li>
                        </ul>
                     </div>
                  </div>

                  {/* React Developer Experience */}
                  <div className={styles.timelineItem}>
                     <div className={styles.timelineContent}>
                        <h3>React Developer</h3>
                        <h4>Wembley Technosoft, Ahmedabad, India (Remote)</h4>
                        <span className={styles.date}>Aug 2021 - Apr 2022</span>
                        <ul>
                           <li>Developed front-end using HTML5, CSS3, Bootstrap, Tailwind, React, JavaScript, and TypeScript</li>
                           <li>Conducted thorough API testing using Insomnia</li>
                           <li>Improved application stability, reducing downtime by 15%</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </motion.section>

            <motion.section
               className={styles.projects}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}>
               <h2>Featured Projects</h2>
               <div className={styles.projectGrid}>
                  <div className={styles.projectCard}>
                     <h3>Paths - Social Media Application</h3>
                     <p className={styles.duration}>3+ Years</p>
                     <div className={styles.techStack}>
                        <span>Node.js</span>
                        <span>Firebase</span>
                        <span>React</span>
                        <span>React Native</span>
                        <span>Docker</span>
                     </div>
                     <ul>
                        <li>Led a team of 5 individuals for project management</li>
                        <li>Increased user engagement by 40% through social login implementation</li>
                        <li>Strengthened application security by 50%</li>
                     </ul>
                  </div>

                  {/* JERA Power Plant project */}
                  <div className={styles.projectCard}>
                     <h3>JERA Power Plant APP (LOT/MOT)</h3>
                     <p className={styles.duration}>9 Months</p>
                     <div className={styles.techStack}>
                        <span>React.js</span>
                        <span>UI Kit</span>
                        <span>Microsoft Authentication</span>
                        <span>Jera Design UI</span>
                        <span>TypeScript</span>
                        <span>SCSS</span>
                     </div>
                     <ul>
                        <li>Accelerated project completion by converting HTML to React and implementing Redux</li>
                        <li>Implemented robust authentication using Microsoft Authentication</li>
                        <li>Managed internationalization using i18next</li>
                        <li>Managed power plant data using Local Storage and Context API</li>
                        <li>Implemented navigation using react-Navi library</li>
                        <li>Collaborated with Jera Design UI for React</li>
                     </ul>
                  </div>
               </div>
            </motion.section>

            <motion.section
               className={styles.education}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}>
               <h2>Education</h2>
               <div className={styles.educationGrid}>
                  <div className={styles.educationCard}>
                     <h3>Postgraduate Diploma in Web Development</h3>
                     <h4>Humber College, Etobicoke, ON</h4>
                     <span>Jan 2024 - Present</span>
                  </div>
                  <div className={styles.educationCard}>
                     <h3>Bachelor&apos;s Degree in Computer Engineering</h3>
                     <h4>GTU Modasa, Gujarat India</h4>
                     <span>May 2015 - May 2019</span>
                  </div>
               </div>
            </motion.section>

            {/* Professional Development section */}
            <motion.section
               className={styles.development}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}>
               <h2>Professional Development</h2>
               <div className={styles.certifications}>
                  <div className={styles.certCard}>
                     <span>Accessibility for Web Design</span>
                  </div>
                  <div className={styles.certCard}>
                     <span>Managing and Leading Developers</span>
                  </div>
                  <div className={styles.certCard}>
                     <span>Agile Software Development</span>
                  </div>
                  <div className={styles.certCard}>
                     <span>Node.js API with Clean architecture</span>
                  </div>
               </div>
            </motion.section>

            {/* Extracurricular Activities section */}
            <motion.section
               className={styles.activities}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}>
               <h2>Extracurricular Activities</h2>
               <ul className={styles.activityList}>
                  <li>Participated in the Global Game Jam 2024 at Humber College</li>
                  <li>Volunteered at Humber College for tech support and event management</li>
               </ul>
            </motion.section>
         </div>
      </div>
   );
}

export default AboutMe;
