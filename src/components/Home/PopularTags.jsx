import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import axios from "axios";
import { CONFIG } from "../../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../LoadingSpinner";

const API_URL = CONFIG.API_URL;

function PopularTags() {
   const [popularTags, setPopularTags] = useState([]);
   const [tagsTimeframe, setTagsTimeframe] = useState("30d");
   const [isLoadingTags, setIsLoadingTags] = useState(false);

   useEffect(() => {
      const fetchPopularTags = async () => {
         try {
            setIsLoadingTags(true);
            const token = localStorage.getItem("token");

            const response = await axios.get(`${API_URL}/posts/tags/popular?limit=5&timeframe=${tagsTimeframe}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });

            console.log("response.data", response);

            if (response.data.success) {
               setPopularTags(response.data.data.tags);
            }
         } catch (error) {
            console.error("Error fetching popular tags:", error);
            toast.error("Failed to fetch popular tags");
         } finally {
            setIsLoadingTags(false);
         }
      };

      fetchPopularTags();
   }, [API_URL, tagsTimeframe]);

   console.log("popularTags", popularTags);
   return (
      <>
         <ToastContainer />
         <div className={styles.popularTags}>
            <div className={styles.tagHeader}>
               <h2 className={styles.title}>Popular Tags</h2>
               <select value={tagsTimeframe} onChange={(e) => setTagsTimeframe(e.target.value)} className={styles.timeSelect}>
                  <option value='7d'>Last 7 days</option>
                  <option value='30d'>Last 30 days</option>
                  <option value='all'>All time</option>
               </select>
            </div>

            {isLoadingTags ? (
               <LoadingSpinner />
            ) : (
               <ul className={styles.tagList}>
                  {popularTags.map((tag) => (
                     <li key={tag.name} className={styles.tagItem}>
                        <span className={styles.tagName}>#{tag.name}</span>
                        <span className={styles.tagPosts}>{tag.postCount.toLocaleString()} Posts</span>
                        {tag.isTrending && <span className={styles.trending}>Trending</span>}
                     </li>
                  ))}
               </ul>
            )}
         </div>
      </>
   );
}

export default PopularTags;
