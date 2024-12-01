import {
   faArrowRight,
   faBook,
   faBriefcase,
   faCheckCircle,
   faCode,
   faExclamationCircle,
   faExclamationTriangle,
   faGlobe,
   faLightbulb,
   faRefresh,
   faRocket,
   faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { geminiService } from "../../services/geminiService";
import styles from "./LearningStrategy.module.css";
import PropTypes from "prop-types";

const ErrorFallback = ({ error, resetError }) => (
   <div className={styles.errorState}>
      <div className={styles.iconWrapper}>
         <FontAwesomeIcon icon={faExclamationTriangle} />
      </div>
      <h3>Oops! Something went wrong</h3>
      <p>{error?.message || "Failed to load learning strategy"}</p>
      <button onClick={resetError} className={styles.retryButton}>
         <FontAwesomeIcon icon={faRefresh} /> Try Again
      </button>
   </div>
);

ErrorFallback.propTypes = {
   error: PropTypes.object.isRequired,
   resetError: PropTypes.func.isRequired,
};

const CACHE_KEY = "learning_strategy_cache";
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const LearningStrategy = () => {
   const [strategy, setStrategy] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const user = useSelector((state) => state.user.user);
   const [lastFetchedGoal, setLastFetchedGoal] = useState(null);

   console.log(user);

   const getCachedStrategy = () => {
      try {
         const cached = localStorage.getItem(CACHE_KEY);
         if (!cached) return null;

         const { data, timestamp, userId, goal } = JSON.parse(cached);

         // Check if cache is expired or belongs to different user/goal
         const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
         const isValidUser = userId === user?.id;
         const isSameGoal = goal === user?.learningGoals?.[0];

         if (isExpired || !isValidUser || !isSameGoal) {
            localStorage.removeItem(CACHE_KEY);
            return null;
         }

         return data;
      } catch (error) {
         console.error("Cache retrieval error:", error);
         return null;
      }
   };

   const setCachedStrategy = (data) => {
      try {
         const cacheData = {
            data,
            timestamp: Date.now(),
            userId: user?.id,
            goal: user?.learningGoals?.[0],
         };
         localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      } catch (error) {
         console.error("Cache storage error:", error);
      }
   };

   const resetError = () => {
      setError(null);
      fetchStrategy();
   };

   const fetchStrategy = async () => {
      if (!user?.learningGoals?.length) return;

      // Check if we have valid cached data
      const cachedStrategy = getCachedStrategy();
      if (cachedStrategy) {
         setStrategy(cachedStrategy);
         setLastFetchedGoal(user.learningGoals[0]);
         return;
      }

      setLoading(true);
      setError(null);

      try {
         const prompt = `
            Create a learning strategy for ${user.learningGoals[0]} with the following:
            1. Core concepts and fundamentals to master (list of 5-7 items)
            2. Advanced topics to explore (list of 4-6 items)
            3. Career paths and opportunities (2-3 roles with descriptions)
            4. Recommended books (2-3 books with author and level)
            5. Practical project ideas (2-3 projects with skills required)
            Consider the user's current skills: ${user.skills?.join(", ") || "beginner"}
         `;

         const result = await geminiService.getRecommendation(prompt);
         const parsedStrategy = JSON.parse(result);

         if (!validateStrategy(parsedStrategy)) {
            throw new Error("Invalid strategy data received");
         }

         // Cache the valid strategy
         setCachedStrategy(parsedStrategy);

         setStrategy(parsedStrategy);
         setLastFetchedGoal(user.learningGoals[0]);
      } catch (err) {
         console.error("Failed to fetch strategy:", err);
         setError(err);
         // Set fallback strategy
         const fallbackStrategy = {
            coreConcepts: ["Basic Concepts"],
            advancedTopics: ["Advanced Learning"],
            careerPaths: [{ role: "Entry Level", description: "Start your journey" }],
            books: [{ title: "Getting Started", author: "Tech Expert", level: "Beginner" }],
            projects: [{ title: "Basic Project", description: "Learn fundamentals", skills: ["Core Skills"] }],
         };
         setStrategy(fallbackStrategy);
         setCachedStrategy(fallbackStrategy);
      } finally {
         setLoading(false);
      }
   };

   const validateStrategy = (data) => {
      const requiredFields = ["coreConcepts", "advancedTopics", "careerPaths", "books", "projects"];
      return requiredFields.every((field) => Array.isArray(data[field]) && data[field].length > 0);
   };

   // Only fetch when component mounts or user profile is updated
   useEffect(() => {
      const shouldFetch = user?.learningGoals?.[0] && (!lastFetchedGoal || lastFetchedGoal !== user.learningGoals[0]);

      if (shouldFetch) {
         fetchStrategy();
      }
   }, [user?.id, user?.learningGoals?.[0], user?.skills]);

   // Handle missing user data
   if (!user) {
      return (
         <div className={styles.errorState}>
            <div className={styles.iconWrapper}>
               <FontAwesomeIcon icon={faExclamationCircle} />
            </div>
            <h3>User Not Found</h3>
            <p>Please try logging in again</p>
            <Link to='/login' className={styles.actionButton}>
               Go to Login
            </Link>
         </div>
      );
   }

   // Handle incomplete profile
   if (!user?.learningGoals?.length || !user?.skills?.length || !user?.education?.degree) {
      return (
         <div className={styles.incompleteProfile}>
            <div className={styles.iconWrapper}>
               <FontAwesomeIcon icon={faExclamationCircle} />
            </div>
            <h3>Complete Your Profile</h3>
            <p>Add your learning goals, skills, and education to get personalized recommendations</p>
            <Link to='/user-profile' className={styles.actionButton}>
               Update Profile
               <FontAwesomeIcon icon={faArrowRight} />
            </Link>
         </div>
      );
   }

   // Handle error state
   if (error) {
      return <ErrorFallback error={error} resetError={resetError} />;
   }

   return (
      <div className={styles.strategyContainer}>
         <div className={styles.strategyHeader}>
            <div className={styles.headerContent}>
               <h2>
                  <FontAwesomeIcon icon={faRocket} />
                  Learning Strategy
               </h2>
               <div className={styles.currentGoal}>
                  <FontAwesomeIcon icon={faLightbulb} />
                  <span>{user.learningGoals[0]}</span>
               </div>
            </div>
         </div>

         {/* Add Skills Section */}
         <div className={styles.skillsSection}>
            <h3>
               <FontAwesomeIcon icon={faCode} />
               Skills
            </h3>
            <div className={styles.tagContainer}>
               {user.skills.map((skill, index) => (
                  <span key={index} className={styles.tag}>
                     {skill}
                  </span>
               ))}
            </div>
         </div>

         {/* Add Learning Goals Section */}
         <div className={styles.learningGoalsSection}>
            <h3>
               <FontAwesomeIcon icon={faLightbulb} />
               Learning Goals
            </h3>
            <div className={styles.tagContainer}>
               {user.learningGoals.map((goal, index) => (
                  <span key={index} className={styles.tag}>
                     {goal}
                  </span>
               ))}
            </div>
         </div>

         {loading ? (
            <div className={styles.loading}>
               <FontAwesomeIcon icon={faSpinner} spin />
               <span>Creating your personalized learning strategy...</span>
            </div>
         ) : strategy ? (
            <div className={styles.strategyGrid}>
               {/* Core Concepts */}
               <div className={styles.strategyCard}>
                  <div className={styles.cardHeader}>
                     <FontAwesomeIcon icon={faBook} />
                     <h3>Core Concepts to Master</h3>
                  </div>
                  <div className={styles.conceptsList}>
                     {(strategy.coreConcepts || []).map((concept, index) => (
                        <div key={index} className={styles.conceptItem}>
                           <FontAwesomeIcon icon={faCheckCircle} />
                           <span>{concept}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Advanced Topics */}
               <div className={styles.strategyCard}>
                  <div className={styles.cardHeader}>
                     <FontAwesomeIcon icon={faRocket} />
                     <h3>Advanced Topics</h3>
                  </div>
                  <div className={styles.topicsList}>
                     {(strategy.advancedTopics || []).map((topic, index) => (
                        <div key={index} className={styles.topicItem}>
                           <FontAwesomeIcon icon={faArrowRight} />
                           <span>{topic}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Career Paths */}
               <div className={styles.strategyCard}>
                  <div className={styles.cardHeader}>
                     <FontAwesomeIcon icon={faBriefcase} />
                     <h3>Career Opportunities</h3>
                  </div>
                  <div className={styles.careersList}>
                     {(strategy.careerPaths || []).map((path, index) => (
                        <div key={index} className={styles.careerItem}>
                           <div className={styles.careerInfo}>
                              <h4>
                                 <FontAwesomeIcon icon={faGlobe} className={styles.careerIcon}/>
                                 {path.role}
                              </h4>
                              <p>{path.description}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Recommended Books */}
               <div className={styles.strategyCard}>
                  <div className={styles.cardHeader}>
                     <FontAwesomeIcon icon={faBook} />
                     <h3>Recommended Books</h3>
                  </div>
                  <div className={styles.booksList}>
                     {(strategy.books || []).map((book, index) => (
                        <div key={index} className={styles.bookItem}>
                           <h4>{book.title}</h4>
                           <p>{book.author}</p>
                           <span className={styles.bookLevel}>{book.level}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Project Ideas */}
               <div className={styles.strategyCard}>
                  <div className={styles.cardHeader}>
                     <FontAwesomeIcon icon={faCode} />
                     <h3>Project Ideas</h3>
                  </div>
                  <div className={styles.projectsGrid}>
                     {(strategy.projects || []).map((project, index) => (
                        <div key={index} className={styles.projectCard}>
                           <h4>{project.title}</h4>
                           <p>{project.description}</p>
                           <div className={styles.projectSkills}>
                              {(project.skills || []).map((skill, i) => (
                                 <span key={i} className={styles.skillTag}>
                                    {skill}
                                 </span>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         ) : null}
      </div>
   );
};

export default LearningStrategy;
