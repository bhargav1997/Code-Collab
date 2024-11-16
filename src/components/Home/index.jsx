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

function Home() {
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
               <CourseRecommendations />
            </div>
            <aside className={styles.sidebar}>
               <Profile />
               {/* <LearningGoals /> */}
               <PopularTags />
            </aside>
         </div>
      </>
   );
}

export default Home;
