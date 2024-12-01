import { memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faHome,
   faTachometerAlt,
   faTrophy,
   faEnvelope,
   faCalendar,
   faCog,
   faShieldAlt,
   faChartBar,
   faSignOutAlt,
   faMap,
   faRocket,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Sidebar.module.css";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../redux/user/userHandle";

function Sidebar() {
   const location = useLocation();
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const handleLogout = () => {
      dispatch(deleteUser());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
   };

   const navItems = [
      { path: "/", icon: faHome, label: "Home" },
      { path: "/dashboard", icon: faTachometerAlt, label: "Dashboard" },
      { path: "/learning-journey", icon: faMap, label: "Learning Journey" },
      { path: "/learning-strategy", icon: faRocket, label: "Learning Strategy" },
      { path: "/leaderboard", icon: faTrophy, label: "Leaderboard" },
      { path: "/message", icon: faEnvelope, label: "Message" },
      { path: "/calendar", icon: faCalendar, label: "Calendar" },
      { path: "/setting", icon: faCog, label: "Setting" },
      { path: "/privacy", icon: faShieldAlt, label: "Privacy" },
      { path: "/report", icon: faChartBar, label: "Report" },
   ];

   return (
      <div className={styles.sidebar}>
         <nav className={styles.nav}>
            <ul>
               {navItems.map((item) => (
                  <li key={item.path}>
                     <Link
                        to={item.path}
                        className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ""}`}
                        title={item.label}>
                        <FontAwesomeIcon icon={item.icon} />
                        <span>{item.label}</span>
                     </Link>
                  </li>
               ))}
            </ul>
         </nav>
         <button className={styles.logoutBtn} onClick={handleLogout} title='Logout'>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
         </button>
      </div>
   );
}

export default memo(Sidebar);
