import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faCheckCircle, faFireAlt, faChevronRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "./ChallengeCard.module.css";
import PropTypes from "prop-types";

const ChallengeCard = ({ challenge, onDelete }) => {
   const progress = ((challenge.currentDay - 1) / challenge.duration) * 100;
   const isCompleted = challenge.currentDay > challenge.duration;

   return (
      <motion.div className={styles.cardWrapper} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
         <Link to={`/challenges/${challenge._id}`} className={styles.cardLink}>
            <div className={`${styles.card} ${isCompleted ? styles.completed : ""}`}>
               <div className={styles.cardHeader}>
                  <h2>{challenge.name}</h2>
                  {isCompleted && (
                     <motion.div
                        className={styles.completedBadge}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        Completed
                     </motion.div>
                  )}
               </div>

               <p className={styles.description}>{challenge.description}</p>

               <div className={styles.progressInfo}>
                  <div className={styles.daysInfo}>
                     <FontAwesomeIcon icon={faCalendarAlt} />
                     <span>
                        Day {challenge.currentDay - 1} of {challenge.duration}
                     </span>
                  </div>

                  <div className={styles.progressBarWrapper}>
                     <div className={styles.progressBar}>
                        <motion.div
                           className={styles.progressFill}
                           initial={{ width: 0 }}
                           animate={{ width: `${progress}%` }}
                           transition={{ duration: 1, ease: "easeOut" }}
                        />
                     </div>
                     <span className={styles.progressText}>{Math.round(progress)}% Complete</span>
                  </div>

                  {challenge.lastCompletedAt && (
                     <div className={styles.streakInfo}>
                        <FontAwesomeIcon icon={faFireAlt} />
                        <span>Last completed: {new Date(challenge.lastCompletedAt).toLocaleDateString()}</span>
                     </div>
                  )}
               </div>

               <div className={styles.cardFooter}>
                  <span className={styles.tasksCount}>{challenge.tasks.length} Tasks</span>
                  <FontAwesomeIcon icon={faChevronRight} className={styles.arrow} />
               </div>
            </div>
         </Link>

         {onDelete && (
            <motion.button
               className={styles.deleteButton}
               onClick={(e) => {
                  e.preventDefault();
                  onDelete(challenge._id);
               }}
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}>
               <FontAwesomeIcon icon={faTrash} />
            </motion.button>
         )}
      </motion.div>
   );
};

ChallengeCard.propTypes = {
   challenge: PropTypes.object.isRequired,
   onDelete: PropTypes.func,
};

export default ChallengeCard;
