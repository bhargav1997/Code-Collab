import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import AchievementBadge from "./AchievementBadge";
import styles from "./AchievementsList.module.css";
import PropTypes from "prop-types";

const AchievementsList = ({ achievements }) => {
   return (
      <div className={styles.achievementsContainer}>
         <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1>
               <FontAwesomeIcon icon={faTrophy} />
               Your Achievements
            </h1>
            <p>Track your learning journey milestones</p>
         </motion.div>

         <motion.div className={styles.grid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {achievements.map((achievement, index) => (
               <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}>
                  <AchievementBadge {...achievement} />
               </motion.div>
            ))}
         </motion.div>

         {achievements.length === 0 && (
            <motion.div
               className={styles.emptyState}
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.2 }}>
               <FontAwesomeIcon icon={faTrophy} />
               <h2>No Achievements Yet</h2>
               <p>Complete challenges to earn achievements!</p>
            </motion.div>
         )}
      </div>
   );
};

AchievementsList.propTypes = {
   achievements: PropTypes.array.isRequired,
};

export default AchievementsList;
