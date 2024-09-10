import React, { useEffect, useState,useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeContext } from './context';
import { useSelector, useDispatch } from 'react-redux'
import Post from './post/frame';
import SuggestUser from './UserList/suggestedUserList'
import CSSLoader from "../functions/CSSLoader";
import axios from '../utils/axiosConfig';

function Home() {
  const { isDarkMode } = useContext(ThemeContext);
 
  const [posts, setPosts] = useState([]); // State to store posts
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  CSSLoader('assets/css/body.css');

   // Function to fetch posts from API
   const fetchPosts = async () => {
    try {
      const response = await axios.get('/posts'); // API call to fetch posts
      setPosts(response.data.data); // Assuming 'posts' is the key in response data
      console.log(posts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <div className=" main_body">
        <div class=" text-center">
          <div class="row">
            <div class="col posts_section  col-8">
              {posts.map((post)=>(
                <Post id={post.id} username={post.username} imgUrl = {post.post} post_description={post.post_description} like_count={post.likes_count}/>
              ))}
            </div>
            <div class="col user_Suggestion_list col-4">
              <SuggestUser/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
