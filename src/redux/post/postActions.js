import axios from "axios";
import { CONFIG } from "../../config";

// Action Types
export const VOTE_POST_REQUEST = "VOTE_POST_REQUEST";
export const VOTE_POST_SUCCESS = "VOTE_POST_SUCCESS";
export const VOTE_POST_FAILURE = "VOTE_POST_FAILURE";
export const GET_POST_VOTES_SUCCESS = "GET_POST_VOTES_SUCCESS";

// API calls with auth headers
const api = axios.create({
   baseURL: CONFIG.API_URL,
   headers: {
      "Content-Type": "application/json",
   },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
   const token = localStorage.getItem("token");
   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
});

// Action Creators
export const votePost = (postId, voteType) => async (dispatch) => {
   try {
      dispatch({ type: VOTE_POST_REQUEST });

      const response = await api.post(`/posts/${postId}/vote`, {
         voteType,
      });

      dispatch({
         type: VOTE_POST_SUCCESS,
         payload: {
            postId,
            votes: {
               upvotes: response.data.votes.upvotes,
               downvotes: response.data.votes.downvotes,
               score: response.data.votes.score
            },
            userVote: response.data.userVote,
         },
      });

      return response.data;
   } catch (error) {
      dispatch({
         type: VOTE_POST_FAILURE,
         payload: error.response?.data?.message || "Failed to vote",
      });
      throw error;
   }
};

export const getPostVotes = (postId) => async (dispatch) => {
   try {
      const response = await api.get(`/posts/${postId}/votes`);

      dispatch({
         type: GET_POST_VOTES_SUCCESS,
         payload: {
            postId,
            votes: {
               upvotes: response.data.votes.upvotes,
               downvotes: response.data.votes.downvotes,
               score: response.data.votes.score
            },
            userVote: response.data.userVote,
         },
      });

      return response.data;
   } catch (error) {
      console.error("Failed to get post votes:", error);
      throw error;
   }
};
