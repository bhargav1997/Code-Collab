import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faChartLine,
   faFire,
   faCalendarCheck,
   faTrophy,
   faCheckCircle,
   faRocket,
   faChartBar
} from "@fortawesome/free-solid-svg-icons";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styles from "./ProgressDashboard.module.css";

const ProgressDashboard = ({ stats, activeChallenges, achievements }) => {
   const currentStreak = stats?.currentStreak || 0;
   const completionRate = stats?.completionRate || 0;
   const totalChallenges = stats?.totalChallenges || 0;

   return (
      <div className={styles.dashboardContainer}>
         <motion.div 
            className={styles.header}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
         >
            <h1>
               <FontAwesomeIcon icon={faChartLine} />
               Learning Progress
            </h1>
            <p>Track your learning journey and achievements</p>
         </motion.div>

         <div className={styles.statsGrid}>
            {/* Main Stats Cards */}
            <motion.div 
               className={`${styles.statCard} ${styles.streakCard}`}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.1 }}
            >
               <div className={styles.statIcon}>
                  <FontAwesomeIcon icon={faFire} />
               </div>
               <div className={styles.statInfo}>
                  <h3>Current Streak</h3>
                  <div className={styles.statValue}>
                     {currentStreak} days
                     {currentStreak > 7 && (
                        <motion.span 
                           className={styles.streakBadge}
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           transition={{ type: "spring" }}
                        >
                           🔥 On Fire!
                        </motion.span>
                     )}
                  </div>
               </div>
            </motion.div>

            <motion.div 
               className={styles.statCard}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.2 }}
            >
               <div className={styles.circularProgress}>
                  <CircularProgressbar
                     value={completionRate}
                     text={`${completionRate}%`}
                     styles={buildStyles({
                        pathColor: `rgba(124, 77, 255, ${completionRate / 100})`,
                        textColor: '#2c3e50',
                        trailColor: '#e2e8f0',
                     })}
                  />
               </div>
               <div className={styles.statInfo}>
                  <h3>Completion Rate</h3>
                  <p>Keep up the good work!</p>
               </div>
            </motion.div>

            {/* Active Challenges Section */}
            <motion.div 
               className={`${styles.statCard} ${styles.challengesCard}`}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.3 }}
            >
               <h3>
                  <FontAwesomeIcon icon={faRocket} />
                  Active Challenges
               </h3>
               <div className={styles.challengesList}>
                  <AnimatePresence>
                     {activeChallenges.map((challenge, index) => (
                        <motion.div
                           key={challenge.id}
                           className={styles.challengeItem}
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: 20 }}
                           transition={{ delay: index * 0.1 }}
                        >
                           <div className={styles.challengeInfo}>
                              <h4>{challenge.name}</h4>
                              <div className={styles.progressBar}>
                                 <motion.div 
                                    className={styles.progressFill}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${challenge.progress}%` }}
                                    transition={{ duration: 1 }}
                                 />
                              </div>
                           </div>
                           <span className={styles.progressText}>
                              {challenge.progress}%
                           </span>
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </div>
            </motion.div>

            {/* Recent Achievements */}
            <motion.div 
               className={`${styles.statCard} ${styles.achievementsCard}`}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.4 }}
            >
               <h3>
                  <FontAwesomeIcon icon={faTrophy} />
                  Recent Achievements
               </h3>
               <div className={styles.achievementsList}>
                  {achievements.slice(0, 3).map((achievement, index) => (
                     <motion.div
                        key={achievement.id}
                        className={styles.achievementItem}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                     >
                        <FontAwesomeIcon 
                           icon={faCheckCircle} 
                           className={styles.checkIcon}
                        />
                        <span>{achievement.title}</span>
                        <span className={styles.achievementDate}>
                           {new Date(achievement.date).toLocaleDateString()}
                        </span>
                     </motion.div>
                  ))}
               </div>
            </motion.div>

            {/* Monthly Progress Chart */}
            <motion.div 
               className={`${styles.statCard} ${styles.chartCard}`}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.5 }}
            >
               <h3>
                  <FontAwesomeIcon icon={faChartBar} />
                  Monthly Progress
               </h3>
               <div className={styles.monthlyStats}>
                  {/* Add your chart component here */}
                  <div className={styles.monthlyStatsGrid}>
                     <div className={styles.monthlyStat}>
                        <span>Challenges Completed</span>
                        <strong>{totalChallenges}</strong>
                     </div>
                     <div className={styles.monthlyStat}>
                        <span>Active Days</span>
                        <strong>{stats?.activeDays || 0}</strong>
                     </div>
                     <div className={styles.monthlyStat}>
                        <span>Total Hours</span>
                        <strong>{stats?.totalHours || 0}</strong>
                     </div>
                  </div>
               </div>
            </motion.div>
         </div>
      </div>
   );
};

export default ProgressDashboard;
