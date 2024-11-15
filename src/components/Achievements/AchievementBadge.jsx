import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faTrophy,
   faAward,
   faMedal,
   faStar,
   faGem,
   faCrown,
   faFire
} from "@fortawesome/free-solid-svg-icons";
import styles from "./AchievementBadge.module.css";

const BADGE_TYPES = {
   challenge: {
      icon: faTrophy,
      color: "purple"
   },
   streak: {
      icon: faFire,
      color: "orange"
   },
   milestone: {
      icon: faMedal,
      color: "blue"
   },
   special: {
      icon: faCrown,
      color: "gold"
   }
};

const AchievementBadge = ({ type, title, description, date, isNew = false }) => {
   const badgeInfo = BADGE_TYPES[type] || BADGE_TYPES.special;

   return (
      <motion.div
         className={`${styles.badge} ${styles[badgeInfo.color]}`}
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         whileHover={{ scale: 1.02 }}
         transition={{ duration: 0.3 }}
      >
         {isNew && (
            <motion.div 
               className={styles.newBadge}
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ delay: 0.3, type: "spring" }}
            >
               NEW!
            </motion.div>
         )}

         <div className={styles.badgeIcon}>
            <motion.div
               animate={{
                  rotate: isNew ? [0, -10, 10, -10, 0] : 0,
                  scale: isNew ? [1, 1.1, 1] : 1
               }}
               transition={{
                  duration: 0.5,
                  repeat: isNew ? 3 : 0,
                  repeatType: "reverse"
               }}
            >
               <FontAwesomeIcon icon={badgeInfo.icon} />
            </motion.div>
         </div>

         <div className={styles.badgeContent}>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className={styles.badgeFooter}>
               <span className={styles.date}>
                  {new Date(date).toLocaleDateString()}
               </span>
               <div className={styles.stars}>
                  {[...Array(3)].map((_, index) => (
                     <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                     >
                        <FontAwesomeIcon icon={faStar} />
                     </motion.div>
                  ))}
               </div>
            </div>
         </div>

         <motion.div 
            className={styles.shine}
            animate={{
               x: ["0%", "100%"],
               opacity: [0, 0.5, 0]
            }}
            transition={{
               duration: 1.5,
               repeat: Infinity,
               repeatDelay: 3
            }}
         />
      </motion.div>
   );
};

export default AchievementBadge;
