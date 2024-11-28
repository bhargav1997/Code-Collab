import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faUserPlus,
   faUserMinus,
   faSearch,
   faCode,
   faGraduationCap,
   faBriefcase,
   faMapMarkerAlt,
   faPen,
   faTimes,
   faLightbulb,
   faSpinner,
   faCheckCircle,
   faTrophy,
   faMedal,
   faStar,
   faComment,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./UserProfile.module.css";
// import { setUser, fetchConnections } from "../../redux/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/user/userSlice";
import { CONFIG } from "../../config";
import CoverPhotoImage from "../../assets/images/coverPhoto.png";
// import { updateUserAchievements } from '../../redux/user/userSlice';

function UserProfile() {
   const API_URL = CONFIG.API_URL;
   const [isEditing, setIsEditing] = useState(false);
   const [editedUser, setEditedUser] = useState(null);
   const [searchTerm, setSearchTerm] = useState("");
   const [showConnectionsModal, setShowConnectionsModal] = useState(false);
   const [activeTab, setActiveTab] = useState("followers");
   const [suggestedConnections, setSuggestedConnections] = useState([]);
   const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
   const [suggestionsError, setSuggestionsError] = useState(null);
   const [followSuccess, setFollowSuccess] = useState(null);

   const dispatch = useDispatch();
   const { user } = useSelector((state) => state.user);
   const navigate = useNavigate();

   useEffect(() => {
      if (user) {
         setEditedUser(user);
      }
   }, [user]);

   useEffect(() => {
      fetchSuggestedConnections();
   }, []);

   const fetchSuggestedConnections = async () => {
      setIsLoadingSuggestions(true);
      setSuggestionsError(null);
      try {
         const token = localStorage.getItem("token");
         if (!token) {
            throw new Error("No authentication token found");
         }

         const response = await axios.post(
            `${API_URL}/users/suggest-connections`,
            {
               user: { ...user },
               limit: 10,
               considerSkills: true,
               considerLearningGoals: false,
            },
            {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
            },
         );

         setSuggestedConnections(response.data);
      } catch (error) {
         console.error("Error fetching suggested connections:", error);
         setSuggestionsError("Failed to load suggested connections. Please try again later.");
      } finally {
         setIsLoadingSuggestions(false);
      }
   };

   const filteredConnections = suggestedConnections.filter(
      (connection) =>
         connection.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
         connection.title.toLowerCase().includes(searchTerm.toLowerCase()),
   );

   // useEffect(() => {
   //    dispatch(fetchConnections()).catch((error) => {
   //       console.error("Error fetching connections:", error);
   //    });
   // }, [dispatch]);

   // const fetchSuggestedFriends = async () => {
   //    // Implement fetching suggested friends
   //    // For now, we'll use mock data
   //    const mockFriends = [
   //       { id: 1, name: "John Doe", interests: ["JavaScript", "React"], mutualFriends: 5, isFollowing: false },
   //       { id: 2, name: "Jane Smith", interests: ["Python", "Machine Learning"], mutualFriends: 3, isFollowing: true },
   //       // Add more mock friends as needed
   //    ];
   //    setSuggestedFriends(mockFriends);
   // };

   const handleEditClick = () => {
      setIsEditing(true);
   };

   const handleSaveClick = async () => {
      try {
         const token = localStorage.getItem("token");
         if (!token) {
            throw new Error("No authentication token found");
         }

         const updatedUserData = {
            username: editedUser.username,
            email: editedUser.email,
            profilePicture: editedUser.profilePicture,
            title: editedUser.title,
            location: editedUser.location,
            bio: editedUser.bio,
            learningGoals: editedUser.learningGoals,
            skills: editedUser.skills,
            work: editedUser.work,
            education: editedUser.education,
            website: editedUser.website,
         };

         const response = await axios.put(`${API_URL}/users/profile`, updatedUserData, {
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
         });

         if (response.status === 200) {
            dispatch(setUser(response.data));
            setIsEditing(false);
         } else {
            throw new Error("Failed to update profile");
         }
      } catch (error) {
         console.error("Error updating profile:", error);
      }
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedUser((prevUser) => ({
         ...prevUser,
         [name]: value,
      }));
   };

   const handleNestedInputChange = (e, nestedField) => {
      const { name, value } = e.target;
      setEditedUser((prevUser) => ({
         ...prevUser,
         [nestedField]: {
            ...prevUser[nestedField],
            [name]: value,
         },
      }));
   };

   const handleArrayInputChange = (e, field) => {
      const { value } = e.target;
      setEditedUser((prevUser) => ({
         ...prevUser,
         [field]: value,
      }));
   };

   const handleArrayInputBlur = (e, field) => {
      const { value } = e.target;
      setEditedUser((prevUser) => ({
         ...prevUser,
         [field]: value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
      }));
   };

   const handleFollow = async (connection) => {
      const friendId = connection._id ? connection._id : connection.id;

      try {
         const token = localStorage.getItem("token");
         // Optimistically update UI
         setSuggestedConnections((prevConnections) =>
            prevConnections.map((connection) =>
               connection._id === friendId ? { ...connection, isFollowing: true, isProcessing: true } : connection,
            ),
         );

         const response = await fetch(`${API_URL}/users/follow/${friendId}`, {
            method: "POST",
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (response.ok) {
            const updatedUser = await response.json();

            if (updatedUser && updatedUser.user) {
               dispatch(setUser(updatedUser.user));
            }
            // Remove the followed user from suggested connections
            setSuggestedConnections((prevConnections) => prevConnections.filter((connection) => connection._id !== friendId));
            setFollowSuccess(`You are now following ${connection.username}!`);
            setTimeout(() => setFollowSuccess(null), 3000); // Clear the message after 3 seconds
         } else {
            // Revert the optimistic update if the request fails
            setSuggestedConnections((prevConnections) =>
               prevConnections.map((connection) =>
                  connection._id === friendId ? { ...connection, isFollowing: false, isProcessing: false } : connection,
               ),
            );
            console.error("Failed to follow user");
         }
      } catch (error) {
         console.error("Error following user:", error);
         // Revert the optimistic update if there's an error
         setSuggestedConnections((prevConnections) =>
            prevConnections.map((connection) =>
               connection._id === friendId ? { ...connection, isFollowing: false, isProcessing: false } : connection,
            ),
         );
      }
   };

   const handleUnfollow = async (friendId) => {
      try {
         const token = localStorage.getItem("token");
         const response = await fetch(`${API_URL}/users/unfollow/${friendId}`, {
            method: "POST",
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (response.ok) {
            const updatedUser = await response.json();

            if (updatedUser && updatedUser.user) {
               dispatch(setUser(updatedUser.user));
            }

            // Update local state
            // Update local state
            setSuggestedConnections((prevConnections) =>
               prevConnections.map((connection) => (connection._id === friendId ? { ...connection, isFollowing: false } : connection)),
            );
         } else {
            console.error("Failed to unfollow user");
         }
      } catch (error) {
         console.error("Error unfollowing user:", error);
      }
   };
   const handleConnectionsClick = (tab) => {
      setActiveTab(tab);
      setShowConnectionsModal(true);
   };

   const handleMessageClick = (userId) => {
      navigate(`/message?userId=${userId}`);
      setShowConnectionsModal(false);
   };

   const ConnectionsModal = () => {
      const connections = activeTab === "followers" ? user?.followers : user?.following;
      const [filteredConnections, setFilteredConnections] = useState(connections);
      const [localActiveTab, setLocalActiveTab] = useState(activeTab);

      const handleTabChange = (tab) => {
         setLocalActiveTab(tab);
         setActiveTab(tab);
         setSearchTerm("");
      };

      const isFollowingUser = (connectionId) => {
         return user?.following?.some((following) => following._id === connectionId);
      };

      useEffect(() => {
         const currentConnections = localActiveTab === "followers" ? user?.followers : user?.following;
         const filtered = currentConnections?.filter(
            (connection) =>
               connection.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (connection.title && connection.title.toLowerCase().includes(searchTerm.toLowerCase())),
         );
         setFilteredConnections(filtered);
      }, [searchTerm, localActiveTab, user?.followers, user?.following]);

      return (
         <div className={styles.connectionsModal}>
            <div className={styles.connectionsContent}>
               <div className={styles.connectionsHeader}>
                  <h2>Your Network</h2>
                  <button className={styles.closeModalBtn} onClick={() => setShowConnectionsModal(false)}>
                     <FontAwesomeIcon icon={faTimes} />
                  </button>
               </div>

               <div className={styles.tabsContainer}>
                  <button
                     className={`${styles.tabButton} ${localActiveTab === "followers" ? styles.activeTab : ""}`}
                     onClick={() => handleTabChange("followers")}>
                     <span className={styles.tabCount}>{user?.followers?.length || 0}</span>
                     Followers
                  </button>
                  <button
                     className={`${styles.tabButton} ${localActiveTab === "following" ? styles.activeTab : ""}`}
                     onClick={() => handleTabChange("following")}>
                     <span className={styles.tabCount}>{user?.following?.length || 0}</span>
                     Following
                  </button>
               </div>

               <div className={styles.searchContainer}>
                  <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                  <input
                     type='text'
                     placeholder='Search connections...'
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className={styles.searchInput}
                  />
               </div>

               <div className={styles.connectionsList}>
                  {filteredConnections?.length > 0 ? (
                     filteredConnections.map((connection) => (
                        <div key={connection._id} className={styles.connectionCard}>
                           <div className={styles.connectionInfo}>
                              <div className={styles.avatarContainer}>
                                 <img
                                    src={
                                       connection.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${connection.username}`
                                    }
                                    alt={connection.username}
                                    className={styles.connectionAvatar}
                                 />
                                 {connection.isOnline && <div className={styles.onlineStatus}></div>}
                              </div>
                              <div className={styles.userDetails}>
                                 <h3>{connection.username}</h3>
                                 <p>{connection.title || "No title yet"}</p>
                                 <div className={styles.mutualConnections}>
                                    <FontAwesomeIcon icon={faUserPlus} className={styles.mutualIcon} />
                                    <span>12 mutual connections</span>
                                 </div>
                              </div>
                           </div>

                           <div className={styles.connectionActions}>
                              {activeTab === "followers" ? (
                                 isFollowingUser(connection._id) ? (
                                    <button className={styles.unfollowButton} onClick={() => handleUnfollow(connection._id)}>
                                       <FontAwesomeIcon icon={faUserMinus} />
                                       Unfollow
                                    </button>
                                 ) : (
                                    <button className={styles.followButton} onClick={() => handleFollow(connection)}>
                                       <FontAwesomeIcon icon={faUserPlus} />
                                       Follow Back
                                    </button>
                                 )
                              ) : (
                                 <button className={styles.unfollowButton} onClick={() => handleUnfollow(connection._id)}>
                                    <FontAwesomeIcon icon={faUserMinus} />
                                    Unfollow
                                 </button>
                              )}
                              <button
                                 className={styles.messageButton}
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    handleMessageClick(connection._id);
                                 }}>
                                 <FontAwesomeIcon icon={faComment} />
                                 Message
                              </button>
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className={styles.emptyState}>
                        <FontAwesomeIcon icon={faUserPlus} className={styles.emptyIcon} />
                        <h3>No {activeTab} found</h3>
                        <p>No results match your search criteria.</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      );
   };

   const MAX_BIO_LENGTH = 500; // Define maximum characters allowed

   // Add this function to handle bio input with limit
   const handleBioChange = (e) => {
      const text = e.target.value;
      if (text.length <= MAX_BIO_LENGTH) {
         handleInputChange({
            target: {
               name: 'bio',
               value: text
            }
         });
      }
   };

   return (
      <div className={styles.userProfile}>
         <div className={styles.profileSection}>
            <div className={styles.coverPhoto}>
               <img src={user.coverPhoto || CoverPhotoImage} alt='Cover' />
            </div>

            <div className={styles.profileHeader}>
               <div className={styles.avatarContainer}>
                  <img
                     src={user.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
                     alt={user.username}
                     className={styles.avatar}
                  />
               </div>
               <div className={styles.profileInfo}>
                  <div className={styles.nameSection}>
                     <h2 className={styles.name}>{user.username}</h2>
                     <button className={styles.editButton} onClick={handleEditClick}>
                        <FontAwesomeIcon icon={faPen} /> Edit Profile
                     </button>
                  </div>
                  <p className={styles.title}>{user.title ? user.title : user.role}</p>
                  <p className={styles.location}>
                     <FontAwesomeIcon icon={faMapMarkerAlt} /> {user.location}
                  </p>
               </div>
            </div>

            <div className={styles.bio}>
               <p>{user.bio}</p>
            </div>
            <div className={styles.stats}>
               <div className={styles.stat} onClick={() => handleConnectionsClick("followers")}>
                  <span className={styles.statNumber}>{user?.followers?.length || 0}</span>
                  <span className={styles.statLabel}>Followers</span>
               </div>
               <div className={styles.stat} onClick={() => handleConnectionsClick("following")}>
                  <span className={styles.statNumber}>{user?.following?.length || 0}</span>
                  <span className={styles.statLabel}>Following</span>
               </div>
            </div>
            <div className={styles.details}>
               <div className={styles.detailItem}>
                  <div className={styles.sectionHeader}>
                     <FontAwesomeIcon icon={faBriefcase} className={styles.detailIcon} />
                     <h4 className={styles.sectionTitle}>Work</h4>
                  </div>
                  <div className={styles.mainContent}>
                     <div className={styles.position}>Software Engineer</div>
                     <div className={styles.company}>Surekha Tech</div>
                     <div className={styles.timeline}>2015 - 2019</div>
                  </div>
               </div>

               <div className={styles.detailItem}>
                  <div className={styles.sectionHeader}>
                     <FontAwesomeIcon icon={faGraduationCap} className={styles.detailIcon} />
                     <h4 className={styles.sectionTitle}>Education</h4>
                  </div>
                  <div className={styles.mainContent}>
                     <div className={styles.position}>Bachelors degree</div>
                     <div className={styles.company}>GTU</div>
                     <div className={styles.timeline}>2019</div>
                  </div>
               </div>

               <div className={styles.detailItem}>
                  <div className={styles.sectionHeader}>
                     <FontAwesomeIcon icon={faCode} className={styles.detailIcon} />
                     <h4 className={styles.sectionTitle}>Skills</h4>
                  </div>
                  <div className={styles.skillsContainer}>
                     {user.skills?.map((skill, index) => (
                        <span key={index} className={styles.skillTag}>
                           {skill}
                        </span>
                     ))}
                  </div>
               </div>
            </div>
            <div className={styles.badgesSection}>
               <h3>Achievements</h3>
               {user.achievements && user.achievements.length > 0 ? (
                  <div className={styles.badgeGrid}>
                     {user.achievements.map((achievement, index) => (
                        <div key={index} className={styles.badge}>
                           <FontAwesomeIcon
                              icon={achievement.type === "challenge" ? faTrophy : achievement.type === "streak" ? faMedal : faStar}
                              className={styles.badgeIcon}
                           />
                           <span className={styles.badgeTitle}>{achievement.title}</span>
                           <span className={styles.badgeDate}>{new Date(achievement.date).toLocaleDateString()}</span>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className={styles.emptyAchievements}>
                     <FontAwesomeIcon icon={faTrophy} className={styles.emptyIcon} />
                     <h4>No Achievements Yet</h4>
                     <p>Start your learning journey to earn achievements!</p>
                  </div>
               )}
            </div>
         </div>

         <div className={styles.suggestedFriendsSection}>
            <h3>Suggested Connections</h3>
            <div className={styles.searchBar}>
               <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
               <input type='text' placeholder='Search connections...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {isLoadingSuggestions ? (
               <p className={styles.loadingText}>Loading suggested connections...</p>
            ) : suggestionsError ? (
               <p className={styles.errorMessage}>{suggestionsError}</p>
            ) : filteredConnections.length === 0 ? (
               <p className={styles.noResults}>No connections found.</p>
            ) : (
               <>
                  {followSuccess && (
                     <div className={styles.successMessage}>
                        <FontAwesomeIcon icon={faCheckCircle} /> {followSuccess}
                     </div>
                  )}
                  <ul className={styles.friendList}>
                     {filteredConnections.map((connection) => (
                        <li key={connection._id} className={`${styles.friendItem} ${connection.isProcessing ? styles.removing : ""}`}>
                           <img
                              src={connection.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${connection.username}`}
                              alt={connection.username}
                              className={styles.friendAvatar}
                           />
                           <div className={styles.friendInfo}>
                              <h4>{connection.username}</h4>
                              <p className={styles.title}>{connection.title}</p>
                              <p className={styles.commonInterests}>
                                 <FontAwesomeIcon icon={faLightbulb} className={styles.interestIcon} />
                                 {connection.commonInterests} common interests
                              </p>
                              <ul className={styles.reasons}>
                                 {connection.reasons.map((reason, index) => (
                                    <li key={index}>
                                       <FontAwesomeIcon icon={faCode} className={styles.reasonIcon} />
                                       {reason}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                           <button
                              className={`${styles.followBtn} ${connection.isProcessing ? styles.processing : ""}`}
                              onClick={() => handleFollow(connection)}
                              disabled={connection.isProcessing}>
                              {connection.isProcessing ? (
                                 <FontAwesomeIcon icon={faSpinner} spin />
                              ) : (
                                 <>
                                    <FontAwesomeIcon icon={faUserPlus} />
                                    Follow
                                 </>
                              )}
                           </button>
                        </li>
                     ))}
                  </ul>
               </>
            )}
         </div>

         {isEditing && editedUser && (
            <div className={styles.editModal}>
               <div className={styles.editModalContent}>
                  <div className={styles.editModalHeader}>
                     <h2>Edit Profile</h2>
                     <button className={styles.closeButton} onClick={() => setIsEditing(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                     </button>
                  </div>

                  <form className={styles.editForm}>
                     <div className={styles.formSection}>
                        <h4>Personal Information</h4>
                        <div className={styles.formGrid}>
                           <div className={styles.inputGroup}>
                              <label>Username</label>
                              <input
                                 type='text'
                                 name='username'
                                 value={editedUser.username}
                                 onChange={handleInputChange}
                                 placeholder='Enter username'
                              />
                           </div>
                           <div className={styles.inputGroup}>
                              <label>Email</label>
                              <input
                                 type='email'
                                 name='email'
                                 value={editedUser.email}
                                 onChange={handleInputChange}
                                 placeholder='Enter email'
                                 disabled
                              />
                           </div>
                           <div className={styles.inputGroup}>
                              <label>Profile Picture URL</label>
                              <input
                                 type='text'
                                 name='profilePicture'
                                 value={editedUser.profilePicture}
                                 onChange={handleInputChange}
                                 placeholder='Enter profile picture URL'
                              />
                           </div>
                           <div className={styles.inputGroup}>
                              <label>Title/Role</label>
                              <input
                                 type='text'
                                 name='title'
                                 value={editedUser.title || ""}
                                 onChange={handleInputChange}
                                 placeholder='e.g. Senior React Developer'
                              />
                           </div>
                        </div>

                        <div className={styles.inputGroup}>
                           <label>Bio</label>
                           <div className={styles.textareaWrapper}>
                              <textarea 
                                 name='bio' 
                                 value={editedUser.bio} 
                                 onChange={handleBioChange}
                                 placeholder='Tell us about yourself (max 500 characters)'
                                 maxLength={MAX_BIO_LENGTH}
                              />
                              <div className={styles.characterCount} style={{ 
                                 color: editedUser.bio?.length >= MAX_BIO_LENGTH * 0.9 ? '#ff5252' : '#64748b' 
                              }}>
                                 {editedUser.bio?.length || 0}/{MAX_BIO_LENGTH}
                              </div>
                           </div>
                        </div>

                        <div className={styles.inputGroup}>
                           <label>Location</label>
                           <input
                              type='text'
                              name='location'
                              value={editedUser.location}
                              onChange={handleInputChange}
                              placeholder='Enter your location'
                           />
                        </div>
                     </div>

                     <div className={styles.formSection}>
                        <h4>Skills & Goals</h4>
                        <div className={styles.inputGroup}>
                           <label>Skills</label>
                           <input
                              type='text'
                              name='skills'
                              value={Array.isArray(editedUser.skills) ? editedUser.skills.join(", ") : editedUser.skills || ""}
                              onChange={(e) => handleArrayInputChange(e, "skills")}
                              onBlur={(e) => handleArrayInputBlur(e, "skills")}
                              placeholder='Enter skills (comma-separated)'
                           />
                        </div>
                        <div className={styles.inputGroup}>
                           <label>Learning Goals</label>
                           <input
                              type='text'
                              name='learningGoals'
                              value={
                                 Array.isArray(editedUser.learningGoals)
                                    ? editedUser.learningGoals.join(", ")
                                    : editedUser.learningGoals || ""
                              }
                              onChange={(e) => handleArrayInputChange(e, "learningGoals")}
                              onBlur={(e) => handleArrayInputBlur(e, "learningGoals")}
                              placeholder='Enter learning goals (comma-separated)'
                           />
                        </div>
                     </div>

                     <div className={styles.formSection}>
                        <h4>Work Experience</h4>
                        <div className={styles.formGrid}>
                           <div className={styles.inputGroup}>
                              <label>Title</label>
                              <input
                                 type='text'
                                 name='title'
                                 value={editedUser.work?.title || ""}
                                 onChange={(e) => handleNestedInputChange(e, "work")}
                                 placeholder='Job title'
                              />
                           </div>
                           <div className={styles.inputGroup}>
                              <label>Company</label>
                              <input
                                 type='text'
                                 name='company'
                                 value={editedUser.work?.company || ""}
                                 onChange={(e) => handleNestedInputChange(e, "work")}
                                 placeholder='Company name'
                              />
                           </div>
                           <div className={styles.inputGroup}>
                              <label>Start Date</label>
                              <input
                                 type='date'
                                 name='startDate'
                                 value={editedUser.work?.startDate || ""}
                                 onChange={(e) => handleNestedInputChange(e, "work")}
                              />
                           </div>
                           <div className={styles.inputGroup}>
                              <label>End Date</label>
                              <input
                                 type='date'
                                 name='endDate'
                                 value={editedUser.work?.endDate || ""}
                                 onChange={(e) => handleNestedInputChange(e, "work")}
                              />
                           </div>
                        </div>
                        <div className={styles.inputGroup}>
                           <label>Description</label>
                           <textarea
                              name='description'
                              value={editedUser.work?.description || ""}
                              onChange={(e) => handleNestedInputChange(e, "work")}
                              placeholder='Describe your role and responsibilities'
                           />
                        </div>
                     </div>

                     <div className={styles.formSection}>
                        <h4>Education</h4>
                        <div className={styles.formGrid}>
                           <div className={styles.inputGroup}>
                              <label>Degree</label>
                              <input
                                 type='text'
                                 name='degree'
                                 value={editedUser.education?.degree || ""}
                                 onChange={(e) => handleNestedInputChange(e, "education")}
                                 placeholder='Your degree'
                              />
                           </div>
                           <div className={styles.inputGroup}>
                              <label>School</label>
                              <input
                                 type='text'
                                 name='school'
                                 value={editedUser.education?.school || ""}
                                 onChange={(e) => handleNestedInputChange(e, "education")}
                                 placeholder='School name'
                              />
                           </div>
                           <div className={styles.inputGroup}>
                              <label>Graduation Year</label>
                              <input
                                 type='number'
                                 name='graduationYear'
                                 value={editedUser.education?.graduationYear || ""}
                                 onChange={(e) => handleNestedInputChange(e, "education")}
                                 placeholder='YYYY'
                              />
                           </div>
                        </div>
                     </div>

                     <div className={styles.formSection}>
                        <h4>Social</h4>
                        <div className={styles.inputGroup}>
                           <label>Website</label>
                           <input
                              type='url'
                              name='website'
                              value={editedUser.website || ""}
                              onChange={handleInputChange}
                              placeholder='Your website URL'
                           />
                        </div>
                     </div>
                  </form>

                  <div className={styles.editModalButtons}>
                     <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>
                        Cancel
                     </button>
                     <button className={styles.saveButton} onClick={handleSaveClick}>
                        Save Changes
                     </button>
                  </div>
               </div>
            </div>
         )}

         {showConnectionsModal && <ConnectionsModal />}
      </div>
   );
}

export default UserProfile;
