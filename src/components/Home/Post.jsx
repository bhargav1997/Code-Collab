import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faEdit,
   faTrash,
   faTag,
   faCode,
   faGraduationCap,
   faLightbulb,
   faExpand,
   faCompress,
   faChevronUp,
   faChevronDown,
   faBolt,
   faFire,
   faIcicles,
   faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { updatePost, deletePost } from "../../redux/posts/postsSlice";
import styles from "./Post.module.css";
import UpdatePostModal from "./UpdatePostModal";
import { votePost, getPostVotes } from "../../redux/post/postActions";
import { toast } from "react-toastify";

function Post({ post, isFullView = false }) {
   const dispatch = useDispatch();
   const [isEditing, setIsEditing] = useState(false);
   const [isExpanded, setIsExpanded] = useState(false);
   const [editedTitle, setEditedTitle] = useState(post.title);
   const [editedContent, setEditedContent] = useState(post.content);
   const [editedTags, setEditedTags] = useState(post.tags);
   const [editedCategory, setEditedCategory] = useState(post.category);
   const [editedImage, setEditedImage] = useState(post.image);
   const [currentTag, setCurrentTag] = useState("");
   const { user } = useSelector((state) => state.user);
   const [voteStatus, setVoteStatus] = useState(0);
   const [voteCount, setVoteCount] = useState(post.votes || 0);
   const [isVoting, setIsVoting] = useState(false);
   const [userVote, setUserVote] = useState(null);
   const [voteError, setVoteError] = useState("");
   const [showSettings, setShowSettings] = useState(false);
   const settingsRef = useRef(null);
   const buttonRef = useRef(null);
   const [editContent, setEditContent] = useState(post.content);
   const [voteData, setVoteData] = useState({
      upvotes: post.votes?.upvotes || 0,
      downvotes: post.votes?.downvotes || 0,
      score: post.votes?.score || 0,
      userVote: post.userVote || null,
   });

   const truncateContent = (content, wordLimit = 80) => {
      const words = content.split(" ");
      if (words.length > wordLimit) {
         return words.slice(0, wordLimit).join(" ") + "...";
      }
      return content;
   };

   const displayContent = isFullView || isExpanded ? post.content : truncateContent(post.content);

   const toggleExpand = () => {
      setIsExpanded(!isExpanded);
   };

   const handleEdit = () => {
      setEditContent(post.content);
      setIsEditing(true);
      setShowSettings(false);
   };

   const handleSave = () => {
      dispatch(
         updatePost({
            postId: post._id,
            postData: {
               ...post,
               title: editedTitle,
               content: editedContent,
               tags: editedTags,
               category: editedCategory,
               image: editedImage,
            },
         }),
      );
      setIsEditing(false);
   };

   const handleCancel = () => {
      setEditedTitle(post.title);
      setEditedContent(post.content);
      setEditedTags(post.tags);
      setEditedCategory(post.category);
      setEditedImage(post.image);
      setIsEditing(false);
   };

   const handleDelete = () => {
      if (window.confirm("Are you sure you want to delete this post?")) {
         dispatch(deletePost(post._id));
      }
   };

   const handleAddTag = (e) => {
      e.preventDefault();
      if (currentTag && !editedTags.includes(currentTag)) {
         setEditedTags([...editedTags, currentTag]);
         setCurrentTag("");
      }
   };

   const handleRemoveTag = (tagToRemove) => {
      setEditedTags(editedTags.filter((tag) => tag !== tagToRemove));
   };

   const handleImageUpload = (e) => {
      const imageUrl = e.target.value;
      setEditedImage(imageUrl);
   };

   const handleVote = async (voteType) => {
      if (!user) {
         toast.error("Please login to vote");
         return;
      }

      try {
         setIsVoting(true);
         const response = await dispatch(votePost(post._id, voteType));

         if (response.success) {
            setVoteData({
               upvotes: response.votes.upvotes,
               downvotes: response.votes.downvotes,
               score: response.votes.score,
               userVote: response.userVote,
            });
         }
      } catch (error) {
         toast.error(error.response?.data?.message || "Failed to vote. Please try again.");
      } finally {
         setIsVoting(false);
      }
   };

   const getVoteIcon = () => {
      if (voteCount > 50) return faFire;
      if (voteCount < -50) return faIcicles;
      return faBolt;
   };

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (settingsRef.current && !settingsRef.current.contains(event.target)) {
            setShowSettings(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   // Get initial votes when component mounts
   useEffect(() => {
      const fetchVotes = async () => {
         try {
            const response = await dispatch(getPostVotes(post._id));
            if (response.success) {
               setVoteData({
                  upvotes: response.votes.upvotes,
                  downvotes: response.votes.downvotes,
                  score: response.votes.score,
                  userVote: response.userVote,
               });
            }
         } catch (error) {
            console.error("Failed to fetch votes:", error);
         }
      };
      fetchVotes();
   }, [dispatch, post._id]);

   return (
      <>
         <div className={`${styles.postCard} ${isFullView ? styles.fullView : ""}`}>
            <div className={styles.postHeader}>
               {post.image && (
                  <div className={styles.imageContainer}>
                     <img src={post.image} alt={post.title} className={styles.postImage} loading='lazy' />
                     <div className={styles.imageOverlay}></div>
                  </div>
               )}
               <div className={`${styles.postMeta} ${post.image ? styles.overlayMeta : ""}`}>
                  <div className={styles.authorInfo}>
                     <img src={post.author.profilePicture} alt={post.author.username} className={styles.authorAvatar} />
                     <span className={styles.authorName}>{post.author.username}</span>
                  </div>
                  {user && user._id === post.author._id && (
                     <div className={styles.settingsContainer} ref={settingsRef}>
                        <button className={styles.settingsButton} onClick={() => setShowSettings(!showSettings)} aria-label='Post settings'>
                           <FontAwesomeIcon icon={faEllipsisVertical} />
                        </button>
                        {showSettings && (
                           <div className={styles.settingsMenu}>
                              <button className={styles.settingsOption} onClick={handleEdit}>
                                 <FontAwesomeIcon icon={faEdit} />
                                 <span>Edit Post</span>
                              </button>
                              <button className={styles.settingsOption} onClick={handleDelete}>
                                 <FontAwesomeIcon icon={faTrash} />
                                 <span>Delete Post</span>
                              </button>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </div>

            <div className={styles.postBody}>
               <h3 className={styles.postTitle}>{post.title}</h3>

               <div className={styles.categoryBadge}>
                  <FontAwesomeIcon
                     icon={post.category === "tech" ? faCode : post.category === "education" ? faGraduationCap : faLightbulb}
                  />
                  <span>{post.category}</span>
               </div>

               <p className={styles.postContent}>{displayContent}</p>

               {!isFullView && post.content.split(" ").length > 80 && (
                  <button className={styles.expandButton} onClick={toggleExpand}>
                     <FontAwesomeIcon icon={isExpanded ? faCompress : faExpand} />
                     {isExpanded ? "Show less" : "Read more"}
                  </button>
               )}

               <div className={styles.tagList}>
                  {post.tags.map((tag, index) => (
                     <span key={index} className={styles.tag}>
                        <FontAwesomeIcon icon={faTag} />
                        {tag}
                     </span>
                  ))}
               </div>
            </div>

            <div className={styles.postFooter}>
               <div className={styles.voteSection}>
                  <button
                     className={`${styles.voteButton} ${voteData.userVote === "upvote" ? styles.active : ""}`}
                     onClick={() => handleVote("upvote")}
                     disabled={isVoting}
                     aria-label='Upvote'>
                     <FontAwesomeIcon icon={faChevronUp} className={styles.voteIcon} />
                     <span className={styles.votePulse}>{voteData.upvotes}</span>
                  </button>

                  <div className={`${styles.voteScore} ${voteCount > 0 ? styles.positive : voteCount < 0 ? styles.negative : ""}`}>
                     <FontAwesomeIcon icon={getVoteIcon()} className={styles.voteIcon} />
                     <span>{Math.abs(voteData.score)}</span>
                  </div>

                  <button
                     className={`${styles.voteButton} ${voteData.userVote === "downvote" ? styles.active : ""}`}
                     onClick={() => handleVote("downvote")}
                     disabled={isVoting}
                     aria-label='Downvote'>
                     <FontAwesomeIcon icon={faChevronDown} className={styles.voteIcon} />

                     <span className={styles.votePulse}>{voteData.downvotes}</span>
                  </button>
               </div>

               {voteError && <div className={styles.voteError}>{voteError}</div>}
            </div>
         </div>

         {isEditing && (
            <UpdatePostModal
               handleCancel={handleCancel}
               handleSave={handleSave}
               editedCategory={editedCategory}
               setEditedCategory={setEditedCategory}
               setEditedContent={setEditedContent}
               setCurrentTag={setCurrentTag}
               handleAddTag={handleAddTag}
               editedTags={editedTags}
               handleRemoveTag={handleRemoveTag}
               editedTitle={editedTitle}
               setEditedTitle={setEditedTitle}
               editedImage={editedImage}
               setEditedImage={setEditedImage}
               handleImageUpload={handleImageUpload}
               currentTag={currentTag}
               editedContent={editedContent}
            />
         )}
      </>
   );
}

Post.propTypes = {
   post: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
      image: PropTypes.string,
      category: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
      author: PropTypes.shape({
         profilePicture: PropTypes.string.isRequired,
         username: PropTypes.string.isRequired,
         _id: PropTypes.string.isRequired,
      }).isRequired,
      votes: PropTypes.object,
   }).isRequired,
   isFullView: PropTypes.bool,
};

export default Post;
