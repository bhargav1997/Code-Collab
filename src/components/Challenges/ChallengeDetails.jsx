import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faArrowLeft,
   faCheck,
   faRocket,
   faTrophy,
   faFireAlt,
   faExclamationTriangle,
   faClock,
   faCalendarAlt,
   faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import Confetti from "react-confetti";
import styles from "./ChallengeDetails.module.css";
import { updateChallenge } from "../../redux/challenges/challengesSlice";
import { updateUserAchievements } from "../../redux/user/userSlice";
import PropTypes from "prop-types";

const ChallengeDetails = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const challenge = useSelector((state) => state.challenges.challenges.find((c) => c._id === id));

   const [taskStatus, setTaskStatus] = useState([]);
   const [currentDay, setCurrentDay] = useState(1);
   const [isDayComplete, setIsDayComplete] = useState(false);
   const [showCelebration, setShowCelebration] = useState(false);
   const [isChallengeDone, setIsChallengeDone] = useState(false);
   const [updateError, setUpdateError] = useState(null);

   useEffect(() => {
      if (challenge) {
         setTaskStatus(new Array(challenge.tasks.length).fill(false));

         const isFullyCompleted = challenge.currentDay > challenge.duration;

         const today = new Date();
         today.setHours(0, 0, 0, 0);

         let lastCompletedDate = null;
         if (challenge.lastCompletedAt) {
            lastCompletedDate = new Date(challenge.lastCompletedAt);
            lastCompletedDate.setHours(0, 0, 0, 0);
         }

         const isCompletedToday = lastCompletedDate && lastCompletedDate.getTime() === today.getTime();

         setCurrentDay(challenge.currentDay);
         setIsDayComplete(isCompletedToday);
         setIsChallengeDone(isFullyCompleted);
         setShowCelebration(isFullyCompleted);
      }
   }, [challenge]);

   const handleTaskCheck = (index) => {
      const newTaskStatus = [...taskStatus];
      newTaskStatus[index] = !newTaskStatus[index];
      setTaskStatus(newTaskStatus);
   };

   const allTasksCompleted = taskStatus.every((status) => status);

   const handleCompleteDay = async () => {
      if (!allTasksCompleted) return;

      const newCurrentDay = currentDay + 1;
      const now = new Date().toISOString();

      const updatedChallenge = {
         _id: challenge._id,
         currentDay: newCurrentDay,
         lastCompletedDay: currentDay,
         lastCompletedAt: now,
      };

      try {
         const resultAction = await dispatch(updateChallenge(updatedChallenge));

         if (updateChallenge.fulfilled.match(resultAction)) {
            if (newCurrentDay > challenge.duration) {
               setIsChallengeDone(true);
               setShowCelebration(true);
               dispatch(
                  updateUserAchievements({
                     type: "challenge",
                     title: `Completed ${challenge.name}`,
                     date: now,
                  }),
               );
            }
            setCurrentDay(newCurrentDay);
            setIsDayComplete(true);
            setTaskStatus(new Array(challenge.tasks.length).fill(false));
            setUpdateError(null);
         } else {
            setUpdateError("Failed to update challenge progress");
         }
      } catch (err) {
         console.error("Error updating challenge:", err);
         setUpdateError("An unexpected error occurred");
      }
   };

   if (!challenge) {
      return (
         <div className={styles.challengeDetails}>
            <button className={styles.backButton} onClick={() => navigate("/challenges")}>
               <FontAwesomeIcon icon={faArrowLeft} /> Back to Challenges
            </button>
            <div className={styles.challengeCard}>
               <h2>Challenge not found</h2>
               <p>{"The challenge you're looking for doesn't exist or has been deleted."}</p>
            </div>
         </div>
      );
   }

   const renderTaskList = () => (
      <motion.div
         className={styles.tasksContainer}
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.2 }}>
         <h3 className={styles.taskListTitle}>
            <FontAwesomeIcon icon={faRocket} />
            Today&apos;s Learning Tasks
         </h3>
         <div className={styles.taskList}>
            {challenge.tasks.map((task, index) => (
               <motion.div
                  key={index}
                  className={styles.taskItem}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}>
                  <label className={styles.taskLabel}>
                     <input
                        type='checkbox'
                        checked={taskStatus[index] || false}
                        onChange={() => handleTaskCheck(index)}
                        className={styles.taskCheckbox}
                     />
                     <span className={styles.checkmark}>
                        <FontAwesomeIcon icon={faCheck} />
                     </span>
                     <span className={styles.taskText}>{task}</span>
                  </label>
               </motion.div>
            ))}
         </div>
         <motion.button
            onClick={handleCompleteDay}
            className={`${styles.completeButton} ${!allTasksCompleted ? styles.disabled : ""}`}
            disabled={!allTasksCompleted}
            whileHover={allTasksCompleted ? { scale: 1.02 } : {}}
            whileTap={allTasksCompleted ? { scale: 0.98 } : {}}>
            <FontAwesomeIcon icon={faCheckCircle} />
            Complete Today&apos;s Learning
         </motion.button>
      </motion.div>
   );

   const renderCompletionMessage = () => (
      <motion.div
         className={styles.completionMessage}
         initial={{ opacity: 0, scale: 0.8 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ type: "spring", stiffness: 200 }}>
         <div className={styles.completionIcon}>
            <FontAwesomeIcon icon={faRocket} />
         </div>
         <h2>Great job! You&apos;ve completed today&apos;s learning.</h2>
         <p>Come back tomorrow to continue your journey.</p>
         <div className={styles.completionStats}>
            <div className={styles.statItem}>
               <FontAwesomeIcon icon={faClock} />
               <span>Next challenge available tomorrow</span>
            </div>
            <div className={styles.statItem}>
               <FontAwesomeIcon icon={faFireAlt} />
               <span>
                  Day {currentDay - 1} of {challenge.duration} completed!
               </span>
            </div>
         </div>
      </motion.div>
   );

   const renderCelebration = () => (
      <motion.div className={styles.celebrationMessage} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
         <div className={styles.trophyIcon}>
            <FontAwesomeIcon icon={faTrophy} />
         </div>
         <h2>Congratulations! Challenge Completed! 🎉</h2>
         <p>You&apos;ve successfully completed all {challenge.duration} days!</p>
         <div className={styles.achievementStats}>
            <div className={styles.achievementItem}>
               <FontAwesomeIcon icon={faCalendarAlt} />
               <span>{challenge.duration} Days Completed</span>
            </div>
            <div className={styles.achievementItem}>
               <FontAwesomeIcon icon={faCheckCircle} />
               <span>{challenge.tasks.length * challenge.duration} Tasks Accomplished</span>
            </div>
         </div>
         <motion.button
            className={styles.newChallengeButton}
            onClick={() => navigate("/challenges")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            <FontAwesomeIcon icon={faRocket} />
            Start a New Challenge
         </motion.button>
      </motion.div>
   );

   return (
      <div className={styles.challengeDetails}>
         {showCelebration && <Confetti />}
         <motion.button className={styles.backButton} onClick={() => navigate("/challenges")} whileHover={{ x: -5 }}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Challenges
         </motion.button>

         <motion.div className={styles.challengeCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className={styles.challengeHeader}>
               <h2>{challenge.name}</h2>
               <p className={styles.description}>{challenge.description}</p>
            </div>

            {!isChallengeDone && (
               <div className={styles.progressSection}>
                  <div className={styles.progressInfo}>
                     <span>Progress</span>
                     <span>{Math.round(((currentDay - 1) / challenge.duration) * 100)}%</span>
                  </div>
                  <div className={styles.progressBar}>
                     <motion.div
                        className={styles.progressFill}
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentDay - 1) / challenge.duration) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                     />
                  </div>
               </div>
            )}

            {isChallengeDone ? renderCelebration() : isDayComplete ? renderCompletionMessage() : renderTaskList()}
         </motion.div>

         {updateError && (
            <motion.div className={styles.errorMessage} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
               <FontAwesomeIcon icon={faExclamationTriangle} />
               {updateError}
            </motion.div>
         )}
      </div>
   );
};

ChallengeDetails.propTypes = {
   challenge: PropTypes.object.isRequired,
};

export default ChallengeDetails;
