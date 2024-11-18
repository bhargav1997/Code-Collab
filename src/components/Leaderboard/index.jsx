import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faTrophy,
   faClock,
   faBook,
   faFire,
   faMedal,
   faSpinner,
   faExclamationCircle,
   faUsers,
   faChartLine,
   faBolt,
   faChevronLeft,
   faChevronRight,
   faQuestionCircle,
   faTimes,
   faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { CONFIG } from "../../config";
import styles from "./Leaderboard.module.css";
import DefaultProfilePicture from "../../assets/images/default-profile.jpeg";

function Leaderboard() {
   const [leaderboardData, setLeaderboardData] = useState([]);
   const [category, setCategory] = useState("global"); // global, streak, weekly
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [currentPage, setCurrentPage] = useState(1);
   const [pagination, setPagination] = useState(null);
   const [userRank, setUserRank] = useState(null);
   const [nearbyUsers, setNearbyUsers] = useState([]);
   const [showPointsInfo, setShowPointsInfo] = useState(false);

   const fetchLeaderboardData = async () => {
      setLoading(true);
      setError(null);
      try {
         const token = localStorage.getItem("token");
         let endpoint = `${CONFIG.API_URL}/leaderboard`;

         switch (category) {
            case "streak":
               endpoint = `${CONFIG.API_URL}/leaderboard/category/streak`;
               break;
            case "weekly":
               endpoint = `${CONFIG.API_URL}/leaderboard/weekly`;
               break;
            default:
               endpoint = `${CONFIG.API_URL}/leaderboard?limit=10&page=${currentPage}`;
         }

         const response = await axios.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
         });

         if (response.data.success) {
            setLeaderboardData(response.data.leaderboard);
            if (response.data.pagination) {
               setPagination(response.data.pagination);
            }
         }

         // Fetch user's rank and nearby users
         const rankResponse = await axios.get(`${CONFIG.API_URL}/leaderboard/user-rank`, {
            headers: { Authorization: `Bearer ${token}` },
         });

         if (rankResponse.data.success) {
            setUserRank(rankResponse.data.currentUser);
            setNearbyUsers(rankResponse.data.nearbyUsers);
         }
      } catch (err) {
         setError(err.response?.data?.message || "Failed to fetch leaderboard data");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchLeaderboardData();
   }, [category, currentPage]);

   // const formatTime = (hours) => {
   //    return `${hours}h`;
   // };

   if (loading) {
      return (
         <div className={styles.loadingState}>
            <FontAwesomeIcon icon={faSpinner} spin className={styles.loadingIcon} />
            <p>Loading leaderboard...</p>
         </div>
      );
   }

   if (error) {
      return (
         <div className={styles.errorState}>
            <FontAwesomeIcon icon={faExclamationCircle} className={styles.errorIcon} />
            <p>{error}</p>
            <button onClick={fetchLeaderboardData} className={styles.retryButton}>
               Retry
            </button>
         </div>
      );
   }

   return (
      <div className={styles.leaderboardContainer}>
         <h1 className={styles.leaderboardTitle}>
            <FontAwesomeIcon icon={faTrophy} className={styles.titleIcon} />
            Leaderboard
            <button className={styles.helpButton} onClick={() => setShowPointsInfo(true)} title='Learn about points system'>
               <FontAwesomeIcon icon={faQuestionCircle} />
            </button>
         </h1>

         {showPointsInfo && (
            <div className={styles.popupOverlay}>
               <div className={styles.pointsInfoPopup}>
                  <div className={styles.popupHeader}>
                     <h2>Learning Platform Points System</h2>
                     <button className={styles.closeButton} onClick={() => setShowPointsInfo(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                     </button>
                  </div>

                  <div className={styles.popupContent}>
                     <h3>Point Breakdown</h3>
                     <div className={styles.pointsList}>
                        <div className={styles.pointItem}>
                           <FontAwesomeIcon icon={faBolt} />
                           <div>
                              <h4>Challenges</h4>
                              <p>50 points per completed challenge</p>
                           </div>
                        </div>
                        <div className={styles.pointItem}>
                           <FontAwesomeIcon icon={faGraduationCap} />
                           <div>
                              <h4>Courses</h4>
                              <p>30 points per completed course</p>
                           </div>
                        </div>
                        <div className={styles.pointItem}>
                           <FontAwesomeIcon icon={faMedal} />
                           <div>
                              <h4>Achievements</h4>
                              <p>20 points per achievement earned</p>
                           </div>
                        </div>
                        <div className={styles.pointItem}>
                           <FontAwesomeIcon icon={faClock} />
                           <div>
                              <h4>Learning Time</h4>
                              <p>15 points per hour spent learning</p>
                           </div>
                        </div>
                        <div className={styles.pointItem}>
                           <FontAwesomeIcon icon={faBook} />
                           <div>
                              <h4>Tasks</h4>
                              <p>10 points per completed task</p>
                           </div>
                        </div>

                        <div className={styles.pointItem}>
                           <FontAwesomeIcon icon={faFire} />
                           <div>
                              <h4>Learning Streak</h4>
                              <p>5 points per day of continuous activity</p>
                           </div>
                        </div>
                        <div className={styles.pointItem}>
                           <FontAwesomeIcon icon={faUsers} />
                           <div>
                              <h4>Social Engagement</h4>
                              <p>2 points per follower</p>
                           </div>
                        </div>
                     </div>

                     <div className={styles.exampleCalculation}>
                        <h3>Example Calculation</h3>
                        <div className={styles.calculationList}>
                           <div className={styles.calculationItem}>
                              <span>5 tasks completed</span>
                              <span>50 points</span>
                           </div>
                           <div className={styles.calculationItem}>
                              <span>2 challenges completed</span>
                              <span>100 points</span>
                           </div>
                           <div className={styles.calculationItem}>
                              <span>7-day streak</span>
                              <span>35 points</span>
                           </div>
                           <div className={styles.calculationItem}>
                              <span>3 achievements earned</span>
                              <span>60 points</span>
                           </div>
                           <div className={styles.calculationItem}>
                              <span>4 hours learning</span>
                              <span>60 points</span>
                           </div>
                           <div className={styles.calculationItem}>
                              <span>10 followers</span>
                              <span>20 points</span>
                           </div>
                           <div className={styles.calculationItem}>
                              <span>1 course completed</span>
                              <span>30 points</span>
                           </div>
                           <div className={styles.calculationTotal}>
                              <span>Total Score</span>
                              <span>355 points</span>
                           </div>
                        </div>
                     </div>

                     <div className={styles.additionalInfo}>
                        <h3>Additional Information</h3>
                        <ul>
                           <li>Points are automatically calculated and updated after each activity</li>
                           <li>Streaks require daily activity to maintain</li>
                           <li>The leaderboard is updated in real-time</li>
                           <li>Weekly leaderboards reset every Monday at midnight</li>
                           <li>Your highest achieved streak is permanently recorded</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         )}

         <div className={styles.categorySelector}>
            <button
               className={`${styles.categoryButton} ${category === "global" ? styles.active : ""}`}
               onClick={() => setCategory("global")}>
               <FontAwesomeIcon icon={faUsers} />
               Global
            </button>
            <button
               className={`${styles.categoryButton} ${category === "streak" ? styles.active : ""}`}
               onClick={() => setCategory("streak")}>
               <FontAwesomeIcon icon={faFire} />
               Streak
            </button>
            <button
               className={`${styles.categoryButton} ${category === "weekly" ? styles.active : ""}`}
               onClick={() => setCategory("weekly")}>
               <FontAwesomeIcon icon={faChartLine} />
               Weekly
            </button>
         </div>

         {userRank && (
            <div className={styles.userRankCard}>
               <div className={styles.userRankInfo}>
                  <span className={styles.userRankLabel}>Your Position</span>
                  <span className={styles.userRankNumber}>#{userRank.rank}</span>
               </div>
               <div className={styles.userRankStats}>
                  <div className={styles.rankStat}>
                     <FontAwesomeIcon icon={faTrophy} />
                     <span>{userRank.score} points</span>
                  </div>
                  <div className={styles.rankStat}>
                     <FontAwesomeIcon icon={faFire} />
                     <span>{userRank.stats.currentStreak} day streak</span>
                  </div>
                  <div className={styles.rankStat}>
                     <FontAwesomeIcon icon={faBolt} />
                     <span>{userRank.stats.challengesCompleted} challenges</span>
                  </div>
               </div>
            </div>
         )}

         {/* Nearby Users Section */}
         {nearbyUsers.length > 0 && (
            <div className={styles.nearbyUsersSection}>
               <h3>Nearby Rankings</h3>
               <div className={styles.nearbyUsersList}>
                  {nearbyUsers.map((user) => (
                     <div key={user.userId} className={styles.nearbyUserCard}>
                        <img src={user.profilePicture || DefaultProfilePicture} alt={user.username} className={styles.nearbyUserAvatar} />
                        <div className={styles.nearbyUserInfo}>
                           <span className={styles.nearbyUserName}>{user.username}</span>
                           <span className={styles.nearbyUserRank}>#{user.rank}</span>
                        </div>
                        <span className={styles.nearbyUserScore}>{user.score} pts</span>
                     </div>
                  ))}
               </div>
            </div>
         )}

         <div className={styles.leaderboardList}>
            {leaderboardData.map((user, index) => (
               <div key={user.userId} className={styles.leaderboardItem}>
                  <div className={styles.rankAndUserInfo}>
                     <div className={styles.rank}>
                        {index < 3 ? <FontAwesomeIcon icon={faTrophy} className={styles[`trophy${index + 1}`]} /> : `#${index + 1}`}
                     </div>
                     <div className={styles.userProfile}>
                        <img src={user.profilePicture || DefaultProfilePicture} alt={user.username} className={styles.userAvatar} />
                        <div className={styles.userInfo}>
                           <span className={styles.userName}>{user.username}</span>
                           <span className={styles.userTitle}>{user.title}</span>
                           <span className={styles.points}>{user.score} points</span>
                        </div>
                     </div>
                  </div>

                  <div className={styles.statsContainer}>
                     <div className={styles.statItem}>
                        <FontAwesomeIcon icon={faBook} className={styles.statIcon} />
                        <span className={styles.statValue}>{user.stats.tasksCompleted} tasks</span>
                     </div>
                     <div className={styles.statItem}>
                        <FontAwesomeIcon icon={faClock} className={styles.statIcon} />
                        <span className={styles.statValue}>{user.stats.learningHours}h</span>
                     </div>
                     <div className={styles.statItem}>
                        <FontAwesomeIcon icon={faBolt} className={styles.statIcon} />
                        <span className={styles.statValue}>{user.stats.challengesCompleted} challenges</span>
                     </div>
                     <div className={styles.statItem}>
                        <FontAwesomeIcon icon={faMedal} className={styles.statIcon} />
                        <span className={styles.statValue}>{user.stats.totalAchievements} achievements</span>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {pagination && category === "global" && (
            <div className={styles.paginationContainer}>
               <button className={styles.paginationButton} disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                  Previous
               </button>

               <div className={styles.paginationInfo}>
                  Page {currentPage} of {pagination.totalPages}
               </div>

               <button
                  className={styles.paginationButton}
                  disabled={!pagination.hasMore}
                  onClick={() => setCurrentPage((prev) => prev + 1)}>
                  Next
                  <FontAwesomeIcon icon={faChevronRight} />
               </button>
            </div>
         )}
      </div>
   );
}

export default Leaderboard;
