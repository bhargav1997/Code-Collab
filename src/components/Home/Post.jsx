import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faEdit,
   faTrash,
   faTag,
   faClock,
   faSave,
   faTimes,
   faCode,
   faGraduationCap,
   faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { updatePost, deletePost } from "../../redux/posts/postsSlice";
import styles from "./Post.module.css";

function Post({ post }) {
   const dispatch = useDispatch();
   const [isEditing, setIsEditing] = useState(false);
   const [editedTitle, setEditedTitle] = useState(post.title);
   const [editedContent, setEditedContent] = useState(post.content);
   const [editedTags, setEditedTags] = useState(post.tags);
   const [editedCategory, setEditedCategory] = useState(post.category);
   const [editedImage, setEditedImage] = useState(post.image);
   const [currentTag, setCurrentTag] = useState("");
   const { user } = useSelector((state) => state.user);

   const handleEdit = () => {
      setIsEditing(true);
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

   const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
   };

   return (
      <>
         <div className={styles.postCard}>
            <div className={styles.authorInfo}>
               <img src={post.author.profilePicture} alt={post.author.username} className={styles.authorAvatar} />
               <span className={styles.authorName}>{post.author.username}</span>
            </div>
            <div className={styles.postHeader}>
               {post.image && <img src={post.image} alt={post.title} className={styles.postImage} />}
               <div className={styles.postTitle}>
                  <h3>{post.title}</h3>
               </div>
            </div>
            <div className={styles.postBody}>
               <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.content }} />
               <div className={styles.postMeta}>
                  <div className={styles.postTags}>
                     <FontAwesomeIcon icon={faTag} className={styles.icon} />
                     {post.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                           {tag}
                        </span>
                     ))}
                  </div>
                  <div className={styles.postDate}>
                     <FontAwesomeIcon icon={faClock} className={styles.icon} />
                     <span>{formatDate(post.createdAt)}</span>
                  </div>
               </div>
            </div>
            <div className={styles.postFooter}>
               <div className={styles.postCategory}>{post.category}</div>
               <div className={styles.postActions}>
                  {user && user._id === post.author._id && (
                     <>
                        <button onClick={handleEdit} className={styles.editBtn}>
                           <FontAwesomeIcon icon={faEdit} /> Edit
                        </button>
                        <button onClick={handleDelete} className={styles.deleteBtn}>
                           <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                     </>
                  )}
               </div>
            </div>
         </div>

         {isEditing && (
            <div className={styles.modalOverlay}>
               <div className={styles.modalContent}>
                  <div className={styles.modalHeader}>
                     <h2>Edit Post</h2>
                     <button className={styles.closeBtn} onClick={handleCancel}>
                        <FontAwesomeIcon icon={faTimes} />
                     </button>
                  </div>
                  <div className={styles.modalBody}>
                     <div className={styles.categorySelector}>
                        <button
                           className={`${styles.categoryBtn} ${editedCategory === "tech" ? styles.active : ""}`}
                           onClick={() => setEditedCategory("tech")}>
                           <FontAwesomeIcon icon={faCode} /> Tech
                        </button>
                        <button
                           className={`${styles.categoryBtn} ${editedCategory === "education" ? styles.active : ""}`}
                           onClick={() => setEditedCategory("education")}>
                           <FontAwesomeIcon icon={faGraduationCap} /> Education
                        </button>
                        <button
                           className={`${styles.categoryBtn} ${editedCategory === "innovation" ? styles.active : ""}`}
                           onClick={() => setEditedCategory("innovation")}>
                           <FontAwesomeIcon icon={faLightbulb} /> Innovation
                        </button>
                     </div>
                     <input
                        type='text'
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className={styles.editTitleInput}
                        placeholder='Enter post title'
                     />
                     <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className={styles.editContentInput}
                        placeholder='Share your knowledge, insights, or questions...'
                     />
                     <div className={styles.postTags}>
                        <FontAwesomeIcon icon={faTag} className={styles.icon} />
                        <input
                           type='text'
                           placeholder='Add tags'
                           value={currentTag}
                           onChange={(e) => setCurrentTag(e.target.value)}
                           onKeyPress={(e) => e.key === "Enter" && handleAddTag(e)}
                        />
                        <button onClick={handleAddTag}>Add</button>
                     </div>
                     <div className={styles.tagsContainer}>
                        {editedTags.map((tag) => (
                           <span key={tag} className={styles.tag}>
                              {tag}
                              <button onClick={() => handleRemoveTag(tag)}>×</button>
                           </span>
                        ))}
                     </div>
                     <div className={styles.imageUpload}>
                        <input
                           type='text'
                           placeholder='Enter image URL'
                           value={editedImage || ''}
                           onChange={handleImageUpload}
                           className={styles.imageUrlInput}
                        />
                     </div>
                     {editedImage && (
                        <div className={styles.imagePreview}>
                           <img src={editedImage} alt='Post preview' />
                           <button 
                              onClick={() => setEditedImage(null)}
                              className={styles.removeImageBtn}
                           >
                              <FontAwesomeIcon icon={faTimes} /> Remove Image
                           </button>
                        </div>
                     )}
                  </div>
                  <div className={styles.modalFooter}>
                     <button onClick={handleCancel} className={styles.cancelBtn}>
                        Cancel
                     </button>
                     <button onClick={handleSave} className={styles.saveBtn}>
                        <FontAwesomeIcon icon={faSave} /> Save Changes
                     </button>
                  </div>
               </div>
            </div>
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
   }).isRequired,
};

export default Post;
