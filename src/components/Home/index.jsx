import CreatePost from "./CreatePost";

import Profile from "./Profile";
import PopularTags from "./PopularTags";
import styles from "./Home.module.css";
import PostList from "./PostList";
import "../../styles/Home.css";
import Progress from "./Progress";
import CourseRecommendations from "./CourseRecommendations";
// import LearningGoals from "./LearningGoals";
import { SEO } from "../common/SEO";
import { useSelector, useDispatch } from 'react-redux';
import { getUserSettings } from '../../redux/user/userHandle';
import { useState, useEffect } from 'react';

function Home() {
   const userSettings = useSelector((state) => state.user.user?.settings);
   const dispatch = useDispatch();
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      if (!isMounted && !userSettings) {
         const fetchSettings = async () => {
            try {
               await dispatch(getUserSettings());
               setIsMounted(true);
            } catch (error) {
               console.error("Failed to load settings:", error);
            }
         };
         fetchSettings();
      }
   }, [dispatch, isMounted, userSettings]);

   const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "LearnHUB - Personal Learning Journey Platform",
      "description": "Transform your learning experience with LearnHUB's comprehensive learning management platform.",
      "url": "https://www.trackmyskills.tech",
      "mainEntity": {
         "@type": "EducationalOrganization",
         "name": "LearnHUB",
         "description": "Personal learning journey and skill tracking platform"
      }
   };

   return (
      <>
         <SEO
            title='LearnHUB - Your Personal Learning Journey Platform'
            description='Track your learning progress, join challenges, and achieve your educational goals with LearnHUB'
            image='https://www.trackmyskills.tech/#/favicon.png'
            keywords='learning platform, online education, skill tracking, learning management'
            canonicalUrl='/'
            schema={schema}
         />
         <div className={styles.container}>
            <div className={styles.mainContent}>
               <CreatePost />
               <PostList />
               <Progress />
               {userSettings?.enableCourseRecommendations && <CourseRecommendations />}
            </div>
            <aside className={styles.sidebar}>
               <Profile />
               <PopularTags />
            </aside>
         </div>
      </>
   );
}

export default Home;
