import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket, faPlus, faTrophy, faFire } from "@fortawesome/free-solid-svg-icons";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styles from "./Challenges.module.css";
import ChallengeCard from "./ChallengeCard";
import CreateChallengeModal from "./CreateChallengeModal";
import AchievementBadge from "../Achievements/AchievementBadge";
import { markAchievementSeen } from "../../redux/slices/achievementsSlice";
import PropTypes from "prop-types";
import { deleteChallenge, fetchChallenges } from "../../redux/challenges/challengesSlice";
import { fetchAchievements } from "../../redux/achievements/achievementsSlice";

const Challenges = () => {
   const [showCreateModal, setShowCreateModal] = useState(false);
   const { challenges = [], status } = useSelector((state) => state.challenges || {});
   const { achievements = [] } = useSelector((state) => state.achievements || {});
   const stats = useSelector((state) => state.stats || {});
   const dispatch = useDispatch();
   const completionRate = stats?.completionRate || 0;
   const currentStreak = stats?.currentStreak || 0;
   // Fetch data when component mounts
   useEffect(() => {
      dispatch(fetchChallenges());
      dispatch(fetchAchievements());
   }, [dispatch]);

   // Mark achievements as seen when displayed
   useEffect(() => {
      achievements.forEach((achievement) => {
         if (achievement.isNew) {
            dispatch(markAchievementSeen(achievement.id));
         }
      });
   }, [achievements, dispatch]);

   const handleDelete = (challengeId) => {
      if (window.confirm("Are you sure you want to delete this challenge?")) {
         dispatch(deleteChallenge(challengeId));
      }
   };

   // Show loading state while fetching data
   if (status === "loading") {
      return (
         <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}>
               <FontAwesomeIcon icon={faRocket} spin />
            </div>
            <p>Loading your challenges...</p>
         </div>
      );
   }

   return (
      <div className={styles.pageContainer}>
         {/* Progress Overview Section */}
         <motion.div className={styles.progressSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className={styles.progressCards}>
               <div className={styles.progressCard}>
                  <div className={styles.progressCircle}>
                     <CircularProgressbar
                        value={completionRate}
                        text={`${completionRate}%`}
                        styles={buildStyles({
                           pathColor: `rgba(124, 77, 255, ${completionRate / 100})`,
                           textColor: "#2c3e50",
                           trailColor: "#e2e8f0",
                        })}
                     />
                  </div>
                  <h3>Completion Rate</h3>
               </div>

               <div className={styles.progressCard}>
                  <div className={styles.streakIcon}>
                     <FontAwesomeIcon icon={faFire} />
                     <span>{currentStreak}</span>
                  </div>
                  <h3>Day Streak</h3>
               </div>

               <div className={styles.progressCard}>
                  <div className={styles.totalChallenges}>
                     <FontAwesomeIcon icon={faRocket} />
                     <span>{challenges.length}</span>
                  </div>
                  <h3>Active Challenges</h3>
               </div>
            </div>
         </motion.div>

         {/* Challenges Section */}
         <div className={styles.mainContent}>
            <div className={styles.sectionHeader}>
               <h2>
                  <FontAwesomeIcon icon={faRocket} />
                  Your Challenges
               </h2>
               <motion.button
                  className={styles.createButton}
                  onClick={() => setShowCreateModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  <FontAwesomeIcon icon={faPlus} />
                  Create Challenge
               </motion.button>
            </div>

            <motion.div className={styles.challengesGrid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
               {challenges.length === 0 ? (
                  <div className={styles.emptyState}>
                     <FontAwesomeIcon icon={faRocket} />
                     <h3>No Challenges Yet</h3>
                     <p>Create your first challenge to start your learning journey!</p>
                  </div>
               ) : (
                  <AnimatePresence>
                     {challenges.map((challenge, index) => (
                        <motion.div
                           key={challenge._id}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           transition={{ delay: index * 0.1 }}>
                           <ChallengeCard challenge={challenge} onDelete={handleDelete} />
                        </motion.div>
                     ))}
                  </AnimatePresence>
               )}
            </motion.div>

            {/* Recent Achievements Section */}
            <div className={styles.sectionHeader}>
               <h2>
                  <FontAwesomeIcon icon={faTrophy} />
                  Recent Achievements
               </h2>
            </div>

            <motion.div className={styles.achievementsGrid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
               {achievements.length > 0 ? (
                  achievements.slice(0, 3).map((achievement, index) => (
                     <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}>
                        <AchievementBadge {...achievement} />
                     </motion.div>
                  ))
               ) : (
                  <div className={styles.emptyAchievements}>
                     <FontAwesomeIcon icon={faTrophy} />
                     <h3>No Achievements Yet</h3>
                     <p>Complete challenges to earn achievements!</p>
                  </div>
               )}
            </motion.div>
         </div>

         {/* Create Challenge Modal */}
         <AnimatePresence>{showCreateModal && <CreateChallengeModal onClose={() => setShowCreateModal(false)} />}</AnimatePresence>
      </div>
   );
};

Challenges.propTypes = {
   challenges: PropTypes.array.isRequired,
};

export default Challenges;
