import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./EmptyState.module.css";

const EmptyState = ({ icon, title, description, actionLabel, onAction }) => {
   return (
      <motion.div 
         className={styles.emptyState}
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
      >
         <motion.div 
            className={styles.iconWrapper}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
         >
            <FontAwesomeIcon icon={icon} />
         </motion.div>
         <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
         >
            {title}
         </motion.h2>
         <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
         >
            {description}
         </motion.p>
         {actionLabel && (
            <motion.button
               className={styles.actionButton}
               onClick={onAction}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
            >
               {actionLabel}
            </motion.button>
         )}
      </motion.div>
   );
};

export default EmptyState;
