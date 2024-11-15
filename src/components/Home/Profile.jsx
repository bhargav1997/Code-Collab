import { useSelector } from "react-redux";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

function Profile() {
   const { user } = useSelector((state) => state.user);
   const navigate = useNavigate();

   const getUserBio = (user) => {
      let userbio = user.bio;
      if (userbio.length > 100) {
         userbio = userbio.substring(0, 100) + "...";
      }
      return userbio || "No bio yet";
   };

   return (
      <div className={styles.userProfile}>
         <h2 className={styles.title}>Your Profile</h2>
         <div className={styles.profileInfo} onClick={() => navigate("/user-profile")}>
            <img
               src={user.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
               alt={user.username}
               className={styles.avatar}
            />
            <h3 className={styles.name}>{user.username}</h3>
            <p className={styles.bio}>{getUserBio(user)}</p>
         </div>
         <div className={styles.hoursSpent}>
            <h4>30 Hours Spent</h4>
            <select className={styles.timeSelect}>
               <option>Last Week</option>
               <option>Last Month</option>
               <option>Last Year</option>
            </select>
         </div>
         <div className={styles.weeklyChart}>
            {/* You can add a chart component here */}
            <div className={styles.barChart}>
               <div className={styles.bar} style={{ height: "50%" }}></div>
               <div className={styles.bar} style={{ height: "80%" }}></div>
               <div className={styles.bar} style={{ height: "30%" }}></div>
               <div className={styles.bar} style={{ height: "60%" }}></div>
               <div className={styles.bar} style={{ height: "40%" }}></div>
               <div className={styles.bar} style={{ height: "70%" }}></div>
               <div className={styles.bar} style={{ height: "55%" }}></div>
            </div>
         </div>
      </div>
   );
}

export default Profile;
