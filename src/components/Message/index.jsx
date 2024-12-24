import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faSearch,
   faPaperPlane,
   faPaperclip,
   faSmile,
   faUserFriends,
   faTrash,
   faComment,
   faCog,
   faTimes,
   faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";
import axios from "axios";
import styles from "./Message.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { CONFIG } from "../../config";
import { useSelector } from "react-redux";
import { fetchUserConnections } from "../../api/userApi";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { SEO } from "../common/SEO";
import DefaultAvatar from "../../assets/images/default-profile.jpeg";

const EmptyConversation = ({ selectedUser, onSuggestionClick }) => {
   return (
      <div className={styles.emptyConversation}>
         <div className={styles.emptyStateContent}>
            <div className={styles.emptyStateIcon}>
               <FontAwesomeIcon icon={faComment} />
            </div>
            <h3>Start a Conversation with {selectedUser?.username}</h3>
            <p>Say hello and start connecting! 👋</p>
            <div className={styles.suggestionBubbles}>
               <button className={styles.suggestionButton} onClick={() => onSuggestionClick("👋 Hey there!")}>
                  👋 Hey there!
               </button>
               <button className={styles.suggestionButton} onClick={() => onSuggestionClick("Would love to connect!")}>
                  Would love to connect!
               </button>
               <button className={styles.suggestionButton} onClick={() => onSuggestionClick("Hi, how are you?")}>
                  Hi, how are you?
               </button>
            </div>
         </div>
      </div>
   );
};

function Message() {
   const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "LearnHUB - Your Personal Learning Journey Platform",
      description: "Private messaging platform for LearnHUB users",
   };
   const API_URL = CONFIG.API_URL;
   const { user } = useSelector((state) => state.user);
   const [selectedChat, setSelectedChat] = useState(null);
   const [messageInput, setMessageInput] = useState("");
   const [socket, setSocket] = useState(null);
   const [messages, setMessages] = useState([]);
   const [connections, setConnections] = useState([]);
   const [isTyping, setIsTyping] = useState(false);
   const navigate = useNavigate();
   const messagesEndRef = useRef(null);
   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
   const [showDropdown, setShowDropdown] = useState(false);
   const dropdownRef = useRef(null);
   const [searchTerm, setSearchTerm] = useState("");
   const [searchResults, setSearchResults] = useState([]);
   const searchTimeoutRef = useRef(null);
   const location = useLocation();
   const queryParams = new URLSearchParams(location.search);
   const urlUserId = queryParams.get("userId");
   const [initialLoadDone, setInitialLoadDone] = useState(false);
   const searchInputRef = useRef(null);
   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
   const [selectedUser, setSelectedUser] = useState(null);
   const [isUserOnline, setIsUserOnline] = useState(false);
   const [lastMessages, setLastMessages] = useState({});

   const initializeSocket = useCallback(() => {
      const token = localStorage.getItem("token");
      if (!token) {
         navigate("/login");
         return null;
      }

      const newSocket = io(CONFIG.SOCKET_URL, {
         auth: { token },
         transports: ["websocket"],
      });

      newSocket.on("connect", () => {
         console.log("Connected to server");
         newSocket.emit("user_online");
      });

      newSocket.on("connect_error", (err) => {
         console.error("Connection error:", err.message);
         if (err.message === "Authentication error") {
            // localStorage.removeItem("token");
            // navigate("/login");
         }
      });

      return newSocket;
   }, [API_URL, navigate]);

   const fetchChatHistory = useCallback(async (chatId) => {
      try {
         const response = await axios.get(`${CONFIG.API_URL}/chat/history/${chatId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
         });
         setMessages(response.data);

         // Store the last message for this chat
         if (response.data.length > 0) {
            setLastMessages((prev) => ({
               ...prev,
               [chatId]: response.data[response.data.length - 1],
            }));
         }
      } catch (error) {
         console.error("Error fetching chat history:", error);
      }
   }, []);

   const handleSearch = useCallback(
      async (term) => {
         setSearchTerm(term);
         if (term.trim() === "") {
            setSearchResults([]);
            return;
         }

         try {
            const response = await axios.get(`${API_URL}/users/search-connections?term=${term}`, {
               headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setSearchResults(response.data);
         } catch (error) {
            console.error("Error searching connections:", error);
         }
      },
      [API_URL],
   );

   const handleSearchInputChange = (e) => {
      const term = e.target.value;
      setSearchTerm(term);

      // Clear any existing timeout
      if (searchTimeoutRef.current) {
         clearTimeout(searchTimeoutRef.current);
      }

      // Set a new timeout
      searchTimeoutRef.current = setTimeout(() => {
         handleSearch(term);
      }, 500); // 500ms delay
   };

   useEffect(() => {
      fetchUserConnections()
         .then((data) => setConnections(data))
         .catch((error) => console.error("Error fetching user connections:", error));

      const newSocket = initializeSocket();
      if (newSocket) {
         setSocket(newSocket);

         newSocket.on("private_message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
         });

         newSocket.on("user_status", ({ userId, status }) => {
            if (selectedChat === userId) {
               setIsUserOnline(status === "online");
            }
            setConnections((prevConnections) => prevConnections.map((conn) => (conn._id === userId ? { ...conn, status } : conn)));
         });

         newSocket.on("typing_status", ({ userId, status }) => {
            if (selectedChat === userId) {
               setIsTyping(status === "typing");
            }
         });

         return () => {
            newSocket.emit("user_offline");
            newSocket.off("private_message");
            newSocket.disconnect();
         };
      }
   }, [initializeSocket, selectedChat]);

   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   useEffect(() => {
      const initializeChat = async () => {
         if (!urlUserId || initialLoadDone) return;

         // Clear URL parameter without page reload
         window.history.replaceState({}, "", window.location.pathname);

         // Check if this user is in connections
         const userExists = connections.some((conn) => conn._id === urlUserId);

         if (userExists) {
            handleChatSelect(urlUserId);
         } else {
            try {
               const response = await axios.get(`${API_URL}/users/${urlUserId}`, {
                  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
               });

               if (response.data && response.data.user) {
                  const userData = {
                     _id: response.data.user._id,
                     username: response.data.user.username,
                     profilePicture: response.data.user.profilePicture,
                     email: response.data.user.email,
                     isFollower: response.data.user.isFollower,
                     isFollowing: response.data.user.isFollowing,
                  };

                  setConnections((prev) => {
                     if (!prev.some((conn) => conn._id === userData._id)) {
                        return [...prev, userData];
                     }
                     return prev;
                  });

                  handleChatSelect(urlUserId);
               }
            } catch (error) {
               console.error("Error fetching user details:", error);
               const errorMessage = error.response?.data?.message || "Could not find the specified user";
               toast.error(errorMessage);
            }
         }
         setInitialLoadDone(true);
      };

      if (connections.length > 0) {
         initializeChat();
      }
   }, [urlUserId, connections, initialLoadDone]);

   const handleChatSelect = useCallback(
      async (chatId) => {
         if (!chatId) return;

         try {
            // Find the selected connection
            const selectedConnection = connections.find((conn) => conn._id === chatId);

            if (selectedConnection) {
               setSelectedChat(chatId);
               setSelectedUser(selectedConnection); // Set the selected user data
            }

            // Socket handling
            if (socket) {
               if (selectedChat) {
                  socket.emit("leave_room", selectedChat);
               }
               socket.emit("join_room", chatId);
            }

            await fetchChatHistory(chatId);
         } catch (error) {
            console.error("Error in chat selection:", error);
            toast.error("Failed to load chat history");
         }
      },
      [socket, selectedChat, connections, fetchChatHistory],
   );

   useEffect(() => {
      if (urlUserId && connections.length > 0 && !selectedChat) {
         handleChatSelect(urlUserId);
      }
   }, [urlUserId, connections, handleChatSelect]);

   const sendPrivateMessage = useCallback(
      async (recipientId, message) => {
         if (message.trim() && socket && recipientId) {
            try {
               const response = await axios.post(
                  `${API_URL}/chat/private`,
                  {
                     recipientId,
                     message,
                  },
                  {
                     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                  },
               );

               // Add the sent message to the state
               // setMessages((prevMessages) => [...prevMessages, response.data]);

               socket.emit("private_message", response.data);

               setMessageInput("");
               socket.emit("typing_end", recipientId);
            } catch (error) {
               console.error("Error sending private message:", error);
            }
         }
      },
      [socket, API_URL],
   );

   const handleInputChange = useCallback(
      (e) => {
         setMessageInput(e.target.value);
         if (socket && selectedChat) {
            socket.emit("typing_start", selectedChat);
            setTimeout(() => {
               socket.emit("typing_end", selectedChat);
            }, 2000);
         }
      },
      [socket, selectedChat],
   );

   const onEmojiClick = (emojiObject) => {
      setMessageInput((prevInput) => prevInput + emojiObject.emoji);
      setShowEmojiPicker(false);
   };

   const clearPrivateChat = useCallback(
      async (recipientId) => {
         try {
            const response = await fetch(`${API_URL}/chat/clear-private-chat/${recipientId}`, {
               method: "DELETE",
               headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
               },
            });

            const data = await response.json();

            if (response.ok) {
               if (!data.error) {
                  setMessages([]); // Clear messages in the UI
                  setShowDropdown(false); // Close the dropdown
                  toast.success("Chat history cleared");
               } else {
                  console.error(data.message);
                  toast.error(data.message);
               }
            } else {
               console.error(data.message);
               toast.error("Something went wrong, please try again.");
            }
         } catch (error) {
            console.error("Error clearing private chat:", error);
            toast.error("Something went wrong, please try again.");
         }
      },
      [API_URL],
   );

   const clearChat = useCallback(() => {
      if (selectedChat) {
         clearPrivateChat(selectedChat);
      }
   }, [selectedChat, clearPrivateChat]);

   useEffect(() => {
      function handleClickOutside(event) {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
         }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   const handleSuggestionClick = (message) => {
      if (selectedChat) {
         setMessageInput(message); // Set the message in the input first
         sendPrivateMessage(selectedChat, message);
      }
   };

   const handleSearchClick = () => {
      if (searchInputRef.current) {
         searchInputRef.current.focus();
      }
   };

   // Use useMemo to prevent unnecessary re-sorting
   const sortedConnections = useMemo(() => {
      return [...connections].sort((a, b) => {
         const lastMessageA = lastMessages[a._id];
         const lastMessageB = lastMessages[b._id];

         const timeA = lastMessageA ? new Date(lastMessageA.timestamp).getTime() : 0;
         const timeB = lastMessageB ? new Date(lastMessageB.timestamp).getTime() : 0;

         return timeB - timeA;
      });
   }, [connections, lastMessages]);

   useEffect(() => {
      if (socket) {
         socket.on("receive_message", (data) => {
            if (selectedChat === data.senderId || selectedChat === data.receiverId) {
               setMessages((prevMessages) => [...prevMessages, data]);
            }

            // Update last message for this chat
            const chatId = data.senderId === user._id ? data.receiverId : data.senderId;
            setLastMessages((prev) => ({
               ...prev,
               [chatId]: data,
            }));
         });

         return () => socket.off("receive_message");
      }
   }, [socket, selectedChat, user._id]);

   const displayedConnections = useMemo(() => {
      if (searchTerm.trim() === "") {
         return sortedConnections; // Show normal sorted list when no search
      }
      return searchResults; // Show search results when searching
   }, [searchTerm, searchResults, sortedConnections]);

   return (
      <>
         <SEO
            title='LearnHUB - Private Messaging Platform'
            description='Private messaging platform for LearnHUB users'
            image='https://www.trackmyskills.tech/#/favicon.png'
            keywords='private messaging, online messaging, social networking'
            canonicalUrl='/'
            schema={schema}
         />
         <div className={styles.messageContainer}>
            <div className={styles.sidebar}>
               <div className={styles.searchBarWrapper}>
                  <div className={styles.searchBar}>
                     <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                     <input
                        type='text'
                        placeholder='Search conversations...'
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                        ref={searchInputRef}
                     />
                  </div>
               </div>
               <div className={styles.chatList}>
                  {displayedConnections.map((connection) => (
                     <div
                        key={connection._id}
                        className={`${styles.chatItem} ${selectedChat === connection._id ? styles.active : ""}`}
                        onClick={() => handleChatSelect(connection._id)}>
                        <div className={styles.avatar}>
                           {connection.profilePicture ? (
                              <img
                                 src={connection.profilePicture || DefaultAvatar}
                                 alt={connection.username}
                                 className={styles.avatarImage}
                              />
                           ) : (
                              connection.username[0].toUpperCase()
                           )}
                        </div>
                        <div className={styles.chatInfo}>
                           <h4>{connection.username}</h4>
                           {lastMessages[connection._id] && <p className={styles.lastMessage}>{lastMessages[connection._id].message}</p>}
                        </div>
                        <div className={styles.chatMeta}>
                           <div className={styles.connectionStatus}>
                              {connection.isFollower && connection.isFollowing ? (
                                 <FontAwesomeIcon icon={faUserFriends} className={styles.mutualIcon} title='Mutual Connection' />
                              ) : connection.isFollower ? (
                                 <span className={styles.followerBadge} title='Follower'>
                                    F
                                 </span>
                              ) : connection.isFollowing ? (
                                 <span className={styles.followingBadge} title='Following'>
                                    F
                                 </span>
                              ) : null}
                           </div>
                        </div>
                     </div>
                  ))}
                  {searchTerm && displayedConnections.length === 0 && (
                     <div className={styles.noResults}>
                        <p>No results found</p>
                     </div>
                  )}
               </div>
            </div>
            <div className={styles.chatArea}>
               {selectedChat ? (
                  <>
                     <div className={styles.chatHeader}>
                        <div className={styles.chatHeaderLeft}>
                           <div className={styles.avatar}>
                              {selectedUser ? (
                                 selectedUser.profilePicture ? (
                                    <img
                                       src={selectedUser.profilePicture || DefaultAvatar}
                                       alt={selectedUser.username}
                                       className={styles.avatarImage}
                                    />
                                 ) : (
                                    <span className={styles.avatarInitial}>{selectedUser.username?.[0]?.toUpperCase()}</span>
                                 )
                              ) : null}
                           </div>
                           <div className={styles.headerInfo}>
                              <h3>{selectedUser?.username || ""}</h3>
                              {isTyping ? (
                                 <span className={styles.onlineStatus}>typing...</span>
                              ) : (
                                 isUserOnline && (
                                    <span className={styles.onlineStatus}>
                                       <span className={styles.onlineIndicator}></span>
                                       active now
                                    </span>
                                 )
                              )}
                           </div>
                        </div>
                        <div className={styles.chatHeaderRight}>
                           <div className={styles.dropdownWrapper}>
                              <button className={styles.settingsButton} onClick={() => setShowDropdown(!showDropdown)}>
                                 <FontAwesomeIcon icon={faCog} />
                              </button>
                              {showDropdown && (
                                 <div className={styles.dropdownOverlay}>
                                    <div className={styles.modernDropdown}>
                                       <div className={styles.dropdownHeader}>
                                          <h4>Chat Settings</h4>
                                          <button className={styles.closeButton} onClick={() => setShowDropdown(false)}>
                                             <FontAwesomeIcon icon={faTimes} />
                                          </button>
                                       </div>
                                       <button
                                          className={styles.clearChatOption}
                                          onClick={() => {
                                             setShowConfirmDialog(true);
                                             setShowDropdown(false);
                                          }}>
                                          <div className={styles.optionIcon}>
                                             <FontAwesomeIcon icon={faTrash} />
                                          </div>
                                          <div className={styles.optionInfo}>
                                             <span>Clear Chat</span>
                                             <small>Delete all messages in this conversation</small>
                                          </div>
                                       </button>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                     <div className={styles.messageList}>
                        {messages.length > 0 ? (
                           messages.map((message, index) => (
                              <div
                                 key={index}
                                 className={`${styles.message} ${
                                    message?.sender?._id === user._id || message?.senderId === user._id ? styles.sent : styles.received
                                 }`}>
                                 <p>{message.message}</p>
                                 <span className={styles.messageTime}>
                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                 </span>
                              </div>
                           ))
                        ) : (
                           <EmptyConversation
                              selectedUser={connections.find((c) => c._id === selectedChat)}
                              onSuggestionClick={handleSuggestionClick}
                           />
                        )}
                        {isTyping && <div className={styles.typingIndicator}>Typing...</div>}
                        <div ref={messagesEndRef} />
                     </div>
                     <div className={styles.messageInputWrapper}>
                        <button className={styles.attachButton}>
                           <FontAwesomeIcon icon={faPaperclip} />
                        </button>
                        <form
                           className={styles.messageInput}
                           onSubmit={(e) => {
                              e.preventDefault();
                              sendPrivateMessage(selectedChat, messageInput);
                           }}>
                           <input type='text' placeholder='Type a message...' value={messageInput} onChange={handleInputChange} />
                           <div className={styles.emojiPickerContainer}>
                              <button type='button' className={styles.emojiButton} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                 <FontAwesomeIcon icon={faSmile} />
                              </button>
                              {showEmojiPicker && (
                                 <div className={styles.emojiPickerWrapper}>
                                    <EmojiPicker
                                       onEmojiClick={onEmojiClick}
                                       searchPlaceholder='Search emojis...'
                                       width={340}
                                       height={400}
                                    />
                                 </div>
                              )}
                           </div>
                           <button type='submit' className={styles.sendButton}>
                              <FontAwesomeIcon icon={faPaperPlane} />
                           </button>
                        </form>
                     </div>
                  </>
               ) : (
                  <div className={styles.noChatSelected}>
                     <FontAwesomeIcon icon={faComment} className={styles.noChatIcon} />

                     <h2>Start a Conversation</h2>
                     <p>Select a connection to begin messaging</p>
                     <div className={styles.chatSuggestions}>
                        <button className={styles.suggestionBubble} onClick={() => navigate("/user-profile")}>
                           <FontAwesomeIcon icon={faUserFriends} /> Find Connections
                        </button>
                        <button className={styles.suggestionBubble} onClick={handleSearchClick}>
                           <FontAwesomeIcon icon={faSearch} /> Search Messages
                        </button>
                        {/* <button className={styles.suggestionBubble}>
                           <FontAwesomeIcon icon={faStar} /> Starred Messages
                        </button> */}
                     </div>
                  </div>
               )}
            </div>
         </div>
         {showConfirmDialog && (
            <div className={styles.modalOverlay}>
               <div className={styles.confirmDialog}>
                  <div className={styles.confirmHeader}>
                     <FontAwesomeIcon icon={faTrashAlt} className={styles.warningIcon} />
                     <h3>Clear Chat History</h3>
                  </div>
                  <p>Are you sure you want to clear all messages? This action cannot be undone.</p>
                  <div className={styles.confirmActions}>
                     <button className={styles.cancelButton} onClick={() => setShowConfirmDialog(false)}>
                        Cancel
                     </button>
                     <button
                        className={styles.clearButton}
                        onClick={() => {
                           clearChat();
                           setShowConfirmDialog(false);
                        }}>
                        Clear Chat
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}

EmptyConversation.propTypes = {
   selectedUser: PropTypes.object,
   onSuggestionClick: PropTypes.func,
};

export default Message;
