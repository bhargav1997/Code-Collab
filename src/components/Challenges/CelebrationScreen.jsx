import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faAward, faMedal, faRocket, faCalendarCheck, faFire } from "@fortawesome/free-solid-svg-icons";
import Confetti from "react-confetti";
import styles from "./CelebrationScreen.module.css";
import PropTypes from "prop-types";

const CelebrationScreen = ({ challenge, onClose }) => {
   return (
      <motion.div className={styles.celebrationOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
         <Confetti numberOfPieces={200} recycle={false} colors={["#7c4dff", "#6366f1", "#fbbf24", "#34d399"]} />

         <motion.div
            className={styles.celebrationContent}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}>
            <motion.div
               className={styles.trophyContainer}
               animate={{
                  rotate: [0, -10, 10, -10, 0],
                  y: [0, -10, 0],
               }}
               transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
               }}>
               <FontAwesomeIcon icon={faTrophy} className={styles.trophyIcon} />
            </motion.div>

            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
               Congratulations! 🎉
            </motion.h1>

            <motion.p
               className={styles.subtitle}
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.5 }}>
               You&apos;ve completed the {challenge.name} challenge!
            </motion.p>

            <motion.div
               className={styles.statsGrid}
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.7 }}>
               <div className={styles.statCard}>
                  <FontAwesomeIcon icon={faCalendarCheck} />
                  <h3>{challenge.duration}</h3>
                  <p>Days Completed</p>
               </div>

               <div className={styles.statCard}>
                  <FontAwesomeIcon icon={faAward} />
                  <h3>{challenge.tasks.length * challenge.duration}</h3>
                  <p>Tasks Completed</p>
               </div>

               <div className={styles.statCard}>
                  <FontAwesomeIcon icon={faFire} />
                  <h3>100%</h3>
                  <p>Completion Rate</p>
               </div>
            </motion.div>

            <motion.div
               className={styles.achievementBadge}
               initial={{ scale: 0 }}
               animate={{ scale: 1, rotate: 360 }}
               transition={{ delay: 1, type: "spring" }}>
               <FontAwesomeIcon icon={faMedal} />
               <span>Challenge Master</span>
            </motion.div>

            <motion.div
               className={styles.actionButtons}
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 1.2 }}>
               <motion.button className={styles.primaryButton} onClick={onClose} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <FontAwesomeIcon icon={faRocket} />
                  Start New Challenge
               </motion.button>
            </motion.div>
         </motion.div>
      </motion.div>
   );
};

CelebrationScreen.propTypes = {
   challenge: PropTypes.object.isRequired,
   onClose: PropTypes.func.isRequired,
};

export default CelebrationScreen;
