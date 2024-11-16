import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faBell,
   faUser,
   faSearch,
   faEnvelope,
   faCog,
   faSignOutAlt,
   faGraduationCap,
   faBook,
   faComment,
   faTrophy,
   faCheck,
   faTimes,
   faTrash,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../../redux/user/userHandle";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CONFIG } from "../../config";
import logoImage from "../../assets/images/logo.png";
import PropTypes from "prop-types";

const MessageNotification = ({ notification, onClick, isBeingRead, isRead }) => {
   return (
      <div className={`${styles.messagePreview} ${isRead ? styles.read : ""}`} onClick={onClick}>
         <div className={styles.messageUserInfo}>
            {notification.relatedUser?.profilePicture ? (
               <img
                  src={notification.relatedUser.profilePicture}
                  alt={notification.relatedUser.username}
                  className={styles.userThumbnail}
               />
            ) : (
               <div className={styles.userInitial}>{notification.relatedUser?.username?.[0]?.toUpperCase()}</div>
            )}
            <div className={styles.messageDetails}>
               <span className={styles.username}>{notification.relatedUser?.username}</span>
               <span className={styles.messageText}>{notification.message}</span>
               <span className={styles.messageTime}>{formatNotificationTime(notification.createdAt)}</span>
            </div>
         </div>
         {!isRead && <div className={styles.unreadDot} />}
         {isBeingRead && (
            <div className={styles.loadingIndicator}>
               <div className={styles.dot}></div>
            </div>
         )}
      </div>
   );
};

const EmptyNotificationState = ({ type = "notifications" }) => {
   return (
      <div className={styles.emptyNotificationState}>
         <div className={styles.emptyStateIcon}>
            {type === "messages" ? <FontAwesomeIcon icon={faEnvelope} /> : <FontAwesomeIcon icon={faBell} />}
         </div>
         <h4>No {type} yet</h4>
         <p>
            {type === "messages" ? "When you receive messages, they'll show up here" : "When you get notifications, they'll show up here"}
         </p>
      </div>
   );
};

function Header() {
   const [showUserMenu, setShowUserMenu] = useState(false);
   const [showNotifications, setShowNotifications] = useState(false);
   const [notifications, setNotifications] = useState([]);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const user = useSelector((state) => state.user.user);
   const notificationRef = useRef(null);
   const [deletingNotifications, setDeletingNotifications] = useState({});
   const [successMessage, setSuccessMessage] = useState({
      message: null,
      error: false,
   });
   const userMenuRef = useRef(null);
   const [showMessageNotifications, setShowMessageNotifications] = useState(false);
   const [messageNotificationsBeingRead, setMessageNotificationsBeingRead] = useState({});
   const messageNotificationsRef = useRef(null);

   useEffect(() => {
      fetchNotifications();
   }, []);

   useEffect(() => {
      function handleClickOutside(event) {
         if (notificationRef.current && !notificationRef.current.contains(event.target)) {
            setShowNotifications(false);
         }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   useEffect(() => {
      function handleClickOutside(event) {
         if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
            setShowUserMenu(false);
         }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   useEffect(() => {
      function handleClickOutside(event) {
         if (messageNotificationsRef.current && !messageNotificationsRef.current.contains(event.target)) {
            setShowMessageNotifications(false);
         }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   const fetchNotifications = async () => {
      try {
         const response = await axios.get(`${CONFIG.API_URL}/notifications`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
         });
         if (response?.status === 200) {
            setNotifications(response?.data?.notifications);
         } else {
            setNotifications([]);
         }
      } catch (error) {
         console.error("Failed to fetch notifications:", error);
         setNotifications([]);
      }
   };

   const handleShareResponse = async (journeyId, status) => {
      try {
         await axios.put(
            `${CONFIG.API_URL}/learning-journeys/shared/${journeyId}/respond`,
            { response: status },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
         );
         toast.success(`Journey ${status === "accept" ? "accepted" : "rejected"} successfully`);
         fetchNotifications(); // Refresh notifications
      } catch (error) {
         toast.error(`Failed to ${status} journey`);
         console.error("Failed to respond to shared journey:", error);
      }
   };

   const handleLogout = () => {
      dispatch(deleteUser());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
   };

   const handleDeleteNotification = async (notificationId) => {
      setDeletingNotifications((prev) => ({ ...prev, [notificationId]: true }));

      try {
         const response = await axios.delete(`${CONFIG.API_URL}/notifications/${notificationId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
         });

         if (response?.status === 200) {
            // Wait for the swipe animation to complete
            setTimeout(() => {
               setNotifications((prevNotifications) => prevNotifications.filter((n) => n._id !== notificationId));
               setDeletingNotifications((prev) => {
                  const newState = { ...prev };
                  delete newState[notificationId];
                  return newState;
               });

               // Show success message
               setSuccessMessage({
                  message: "Notification deleted",
                  error: false,
               });

               // Hide success message after 3 seconds
               setTimeout(() => {
                  setSuccessMessage({
                     message: null,
                     error: false,
                  });
               }, 3000);
            }, 300);
         } else {
            setSuccessMessage({
               message: "Failed to delete notification",
               error: true,
            });
         }
      } catch (error) {
         console.error("Failed to delete notification:", error);
         setDeletingNotifications((prev) => {
            const newState = { ...prev };
            delete newState[notificationId];
            return newState;
         });
      }
   };

   const handleMarkAllAsRead = async () => {
      try {
         const response = await axios.put(
            `${CONFIG.API_URL}/notifications/mark-all-read`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
         );

         if (response?.status === 200) {
            setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
            toast.success("All notifications marked as read");
         }
      } catch (error) {
         console.error("Failed to mark all notifications as read:", error);
         toast.error("Failed to mark notifications as read");
      }
   };

   const handleMarkAsRead = async (notificationId) => {
      try {
         const response = await axios.put(
            `${CONFIG.API_URL}/notifications/${notificationId}/read`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
         );

         if (response?.status === 200) {
            setNotifications((prev) => prev.map((notif) => (notif._id === notificationId ? { ...notif, read: true } : notif)));
         }
      } catch (error) {
         console.error("Failed to mark notification as read:", error);
      }
   };

   const handleMarkAllMessagesAsRead = async () => {
      try {
         const response = await axios.put(
            `${CONFIG.API_URL}/notifications/mark-messages-read`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
         );

         if (response?.status === 200) {
            setNotifications((prev) => prev.map((notif) => (notif.type === "new_message" ? { ...notif, read: true } : notif)));
         }
      } catch (error) {
         console.error("Failed to mark message notifications as read:", error);
      }
   };

   const handleMessageNotificationClick = async (notification) => {
      // Set loading state for this notification
      setMessageNotificationsBeingRead((prev) => ({ ...prev, [notification._id]: true }));

      try {
         // Mark the notification as read
         await axios.put(
            `${CONFIG.API_URL}/notifications/${notification._id}/read`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
         );

         // Update local state
         setNotifications((prev) => prev.map((notif) => (notif._id === notification._id ? { ...notif, read: true } : notif)));

         // Navigate to message
         navigate(`/message?userId=${notification.relatedUser?._id}`);

         // Close message notifications overlay
         setShowMessageNotifications(false);
      } catch (error) {
         console.error("Failed to mark message as read:", error);
      } finally {
         // Clear loading state
         setMessageNotificationsBeingRead((prev) => {
            const newState = { ...prev };
            delete newState[notification._id];
            return newState;
         });
      }
   };

   // In the Header component, update the notifications display logic

   // First, let's separate message notifications
   const messageNotifications = notifications.filter((n) => n.type === "new_message");
   const otherNotifications = notifications.filter((n) => n.type !== "new_message");

   return (
      <header className={styles.header}>
         <div className={styles.leftSection}>
            <div className={styles.logoContainer}>
               <img src={logoImage} alt='LearnHub' className={styles.logo} />
            </div>
            <h2 className={styles.greeting}>Welcome, {user.username ? user.username : "Guest"} 👋 </h2>
         </div>
         <div className={styles.rightSection}>
            <div className={styles.searchBar}>
               <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
               <input type='text' placeholder='Search courses, books, videos...' className={styles.searchInput} />
            </div>
            <div ref={messageNotificationsRef}>
               <Link
                  className={styles.iconButton}
                  to='#'
                  onClick={(e) => {
                     e.preventDefault();
                     setShowMessageNotifications(!showMessageNotifications);
                  }}>
                  <FontAwesomeIcon icon={faEnvelope} />
                  {messageNotifications.filter((n) => !n.read).length > 0 && (
                     <span className={styles.badge}>{messageNotifications.filter((n) => !n.read).length}</span>
                  )}
                  {showMessageNotifications && messageNotifications.length > 0 && (
                     <div className={styles.messageNotificationsOverlay}>
                        <div className={styles.messageHeader}>
                           <h3 className={styles.messageHeaderTitle}>Messages</h3>
                           {messageNotifications.some((n) => !n.read) && (
                              <button
                                 className={styles.messageMarkAllBtn}
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAllMessagesAsRead();
                                 }}>
                                 Mark all read
                              </button>
                           )}
                        </div>
                        <div className={styles.messagesList}>
                           {messageNotifications.length > 0 ? (
                              messageNotifications.map((notification) => (
                                 <MessageNotification
                                    key={notification._id}
                                    notification={notification}
                                    onClick={() => handleMessageNotificationClick(notification)}
                                    isBeingRead={messageNotificationsBeingRead[notification._id]}
                                    isRead={notification.read}
                                 />
                              ))
                           ) : (
                              <EmptyNotificationState type='messages' />
                           )}
                        </div>
                     </div>
                  )}
               </Link>
            </div>
            <div className={styles.notificationContainer} ref={notificationRef}>
               <button className={styles.iconButton} onClick={() => setShowNotifications(!showNotifications)}>
                  <FontAwesomeIcon icon={faBell} />
                  {otherNotifications.filter((n) => !n.read).length > 0 && (
                     <span className={styles.badge}>{otherNotifications.filter((n) => !n.read).length}</span>
                  )}
               </button>
               {showNotifications && (
                  <div className={styles.notificationsOverlay}>
                     <div className={styles.notificationHeader}>
                        <h3>Notifications</h3>
                        {notifications?.length > 0 && (
                           <button className={styles.markAllReadBtn} onClick={handleMarkAllAsRead}>
                              Mark all as read
                           </button>
                        )}
                     </div>
                     {!Array.isArray(notifications) || notifications.length === 0 ? (
                        <p className={styles.noNotifications}>No new notifications</p>
                     ) : (
                        <ul className={styles.notificationsList}>
                           {otherNotifications.map((notification) => (
                              <li
                                 key={notification._id}
                                 className={`${styles.notificationItem} ${notification.read ? styles.read : ""}`}
                                 onClick={() => !notification.read && handleMarkAsRead(notification._id)}>
                                 <FontAwesomeIcon icon={getNotificationIcon(notification.type)} className={styles.notificationIcon} />
                                 <div className={styles.notificationContent}>
                                    {notification.type === "new_follower" && (
                                       <div className={styles.userNotification}>
                                          {notification.relatedUser?.profilePicture && (
                                             <img
                                                src={notification.relatedUser.profilePicture}
                                                alt={notification.relatedUser.username}
                                                className={styles.userThumbnail}
                                             />
                                          )}
                                          <p>{notification.message}</p>
                                       </div>
                                    )}
                                    {notification.type !== "new_follower" && <p>{notification.message}</p>}
                                    <span className={styles.notificationTime}>{formatNotificationTime(notification.createdAt)}</span>
                                 </div>
                                 <div className={styles.notificationActions}>
                                    {notification.type === "journey_shared" && (
                                       <>
                                          <button
                                             onClick={() => handleShareResponse(notification.sharedJourneyId, "accept")}
                                             className={styles.acceptButton}
                                             title='Accept'>
                                             <FontAwesomeIcon icon={faCheck} />
                                          </button>
                                          <button
                                             onClick={() => handleShareResponse(notification.sharedJourneyId, "reject")}
                                             className={styles.rejectButton}
                                             title='Reject'>
                                             <FontAwesomeIcon icon={faTimes} />
                                          </button>
                                       </>
                                    )}
                                    <button
                                       onClick={() => handleDeleteNotification(notification._id)}
                                       className={styles.deleteButton}
                                       title='Delete'>
                                       <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                 </div>
                              </li>
                           ))}
                        </ul>
                     )}
                     {successMessage.message && (
                        <div
                           className={`
                           ${styles.statusMessage} 
                           ${styles.statusMessageVisible} 
                           ${successMessage.error ? styles.errorMessage : styles.successMessage}
                         `}>
                           <FontAwesomeIcon icon={successMessage.error ? faTimes : faCheck} className={styles.icon} />
                           {successMessage.message}
                        </div>
                     )}
                  </div>
               )}
            </div>
            <div className={styles.userInfo} ref={userMenuRef} onClick={() => setShowUserMenu(!showUserMenu)}>
               <div className={styles.userAvatar}>
                  <img src={user.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`} alt={user.username} />
               </div>
               {showUserMenu && (
                  <div className={styles.userMenu}>
                     <Link to='/user-profile'>
                        <FontAwesomeIcon icon={faUser} /> Profile
                     </Link>
                     <Link to='/setting'>
                        <FontAwesomeIcon icon={faCog} /> Settings
                     </Link>
                     <Link to='/challenges'>
                        <FontAwesomeIcon icon={faTrophy} /> Challenges
                     </Link>
                     <Link onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                     </Link>
                  </div>
               )}
            </div>
         </div>
      </header>
   );
}

function getNotificationIcon(type) {
   switch (type) {
      case "journey_shared":
         return faBook;
      case "course":
         return faGraduationCap;
      case "achievement":
         return faTrophy;
      case "comment":
         return faComment;
      case "new_follower":
         return faUser;
      case "new_message":
         return faEnvelope;
      default:
         return faBell;
   }
}

function formatNotificationTime(createdAt) {
   const now = new Date();
   const notificationDate = new Date(createdAt);
   const diffTime = Math.abs(now - notificationDate);
   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

   if (diffDays < 1) {
      return "Today";
   } else if (diffDays === 1) {
      return "Yesterday";
   } else if (diffDays < 7) {
      return `${diffDays} days ago`;
   } else {
      return notificationDate.toLocaleDateString();
   }
}

MessageNotification.propTypes = {
   notification: PropTypes.object.isRequired,
   onClick: PropTypes.func.isRequired,
   isBeingRead: PropTypes.bool,
   isRead: PropTypes.bool,
};

EmptyNotificationState.propTypes = {
   type: PropTypes.string,
};

export default Header;
