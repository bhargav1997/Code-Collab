import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios"; // Make sure to install axios
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faTimes,
   faCalendarPlus,
   faChevronLeft,
   faChevronRight,
   faLink,
   faBook,
   faVideo,
   faNewspaper,
   faEdit,
   faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./Calendar.module.css";
import { addEvent, setEvents, updateEvent, deleteEvent } from "../../redux/calendar/calendarSlice";
import CustomEvent from "./CustomEvent";
import EventTooltip from "./EventTooltip";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);
import { CONFIG } from "../../config";

const API_URL = CONFIG.API_URL;

import { checkUpcomingEvents } from "../../redux/calendar/calendarHandler";
import { setNotificationsShown } from "../../redux/calendar/calendarSlice";

const validateEvent = (event) => {
   const errors = [];
   const now = new Date();
   // Set time to start of current day for date comparison
   now.setHours(0, 0, 0, 0);

   // Required fields validation
   if (!event.title?.trim()) errors.push("Title is required");
   if (!event.start) errors.push("Start time is required");
   if (!event.end) errors.push("End time is required");
   if (!event.resourceType) errors.push("Resource type is required");
   if (!event.resourceLink?.trim()) errors.push("Resource link is required");

   // Validate dates
   const startDate = new Date(event.start);
   startDate.setHours(0, 0, 0, 0);

   if (startDate < now) {
      errors.push("Start date cannot be in the past");
   }

   if (event.start && event.end && new Date(event.start) >= new Date(event.end)) {
      errors.push("End time must be after start time");
   }

   // Update these resource types to match your backend enum
   const validResourceTypes = ["LINK", "VIDEO", "BOOK", "ARTICLE"];
   if (!validResourceTypes.includes(event.resourceType.toUpperCase())) {
      errors.push("Invalid resource type");
   }

   // Validate resource link
   if (event.resourceLink && event.resourceType === "LINK") {
      try {
         new URL(event.resourceLink);
      } catch {
         errors.push("Please enter a valid URL for the resource link");
      }
   }

   return errors;
};

function Calendar() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const events = useSelector((state) => state.calendar.events);
   const [showModal, setShowModal] = useState(false);
   const [editingEvent, setEditingEvent] = useState(null);
   const [newEvent, setNewEvent] = useState({
      title: "",
      start: new Date(),
      end: new Date(),
      description: "",
      resourceType: "LINK",
      resourceLink: "",
   });
   const [tooltipEvent, setTooltipEvent] = useState(null);
   const [showConfirmModal, setShowConfirmModal] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const notificationsShown = useSelector((state) => state.calendar.notificationsShown);

   useEffect(() => {
      fetchEvents();
   }, []);

   useEffect(() => {
      // Check for upcoming events only if notifications haven't been shown
      if (events.length > 0 && !notificationsShown) {
         checkUpcomingEvents(events);
         dispatch(setNotificationsShown(true));
      }
   }, [events, notificationsShown]);

   const getAuthHeaders = () => {
      const token = localStorage.getItem("token");
      return {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      };
   };

   const handleUnauthorized = () => {
      localStorage.removeItem("token");
      toast.error("Your session has expired. Please log in again.");
      navigate("/login");
   };

   const fetchEvents = async () => {
      try {
         const response = await axios.get(`${API_URL}/events`, getAuthHeaders());
         dispatch(setEvents(response.data));
      } catch (error) {
         console.error("Error fetching events:", error);
         if (error.response && error.response.status === 401) {
            handleUnauthorized();
         } else {
            toast.error("Failed to fetch events. Please try again later.");
         }
      }
   };

   const handleSelectSlot = (slotInfo) => {
      setNewEvent({
         ...newEvent,
         start: slotInfo.start,
         end: slotInfo.end,
      });
      setEditingEvent(null);
      setShowModal(true);
   };

   const handleSelectEvent = (event) => {
      setEditingEvent(event);
      setNewEvent(event);
      setShowModal(true);
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewEvent({ ...newEvent, [name]: value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      // Validate the event
      const validationErrors = validateEvent(newEvent);
      if (validationErrors.length > 0) {
         validationErrors.forEach((error) => toast.error(error));
         return;
      }

      setIsSubmitting(true);

      // Prepare the event data
      const eventData = {
         title: newEvent.title.trim(),
         start: new Date(newEvent.start).toISOString(),
         end: new Date(newEvent.end).toISOString(),
         description: newEvent.description.trim(),
         resourceType: newEvent.resourceType,
         resourceLink: newEvent.resourceLink.trim(),
      };

      try {
         if (editingEvent) {
            const response = await axios.put(`${API_URL}/events/${editingEvent._id}`, eventData, getAuthHeaders());
            dispatch(updateEvent(response.data));
            toast.success("Event updated successfully!");
         } else {
            const response = await axios.post(`${API_URL}/events`, eventData, getAuthHeaders());
            dispatch(addEvent(response.data));
            toast.success("Event created successfully!");
         }

         setShowModal(false);
         resetForm();
         fetchEvents();
      } catch (error) {
         console.error("Error saving event:", error);
         if (error.response) {
            if (error.response.status === 401) {
               handleUnauthorized();
            } else if (error.response.status === 400) {
               toast.error(`Error: ${error.response.data.message || "Failed to save event"}`);
            } else {
               toast.error(`Error: "Failed to save event"`);
            }
         } else if (error.request) {
            toast.error("No response received from server. Please try again.");
         } else {
            toast.error("An unexpected error occurred. Please try again.");
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleDeleteClick = () => {
      setShowConfirmModal(true);
   };

   const handleConfirmDelete = async () => {
      setShowConfirmModal(false);
      if (editingEvent) {
         try {
            await axios.delete(`${API_URL}/events/${editingEvent._id}`, getAuthHeaders());
            dispatch(deleteEvent(editingEvent._id));
            setShowModal(false);
            resetForm();
            toast.success("Event deleted successfully!");
            fetchEvents();
         } catch (error) {
            console.error("Error deleting event:", error);
            if (error.response) {
               if (error.response.status === 401) {
                  handleUnauthorized();
               } else {
                  toast.error(`Error: ${error.response.data.message || "Failed to delete event"}`);
               }
            } else if (error.request) {
               toast.error("No response received from server. Please try again.");
            } else {
               toast.error("An unexpected error occurred. Please try again.");
            }
         }
      }
   };

   const handleCancelDelete = () => {
      setShowConfirmModal(false);
   };

   const resetForm = () => {
      setNewEvent({
         title: "",
         start: new Date(),
         end: new Date(),
         description: "",
         resourceType: "LINK",
         resourceLink: "",
      });
      setEditingEvent(null);
   };

   const CustomToolbar = (toolbar) => {
      const goToBack = () => {
         toolbar.date.setMonth(toolbar.date.getMonth() - 1);
         toolbar.onNavigate("prev");
      };

      const goToNext = () => {
         toolbar.date.setMonth(toolbar.date.getMonth() + 1);
         toolbar.onNavigate("next");
      };

      const goToCurrent = () => {
         const now = new Date();
         toolbar.date.setMonth(now.getMonth());
         toolbar.date.setYear(now.getFullYear());
         toolbar.onNavigate("current");
      };

      const label = () => {
         const date = moment(toolbar.date);
         return date.format("MMMM YYYY");
      };

      return (
         <div className={styles.customToolbar}>
            <button className={styles.toolbarButton} onClick={goToBack}>
               <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className={styles.toolbarCenter}>
               <button className={styles.toolbarButton} onClick={goToCurrent}>
                  Today
               </button>
               <span className={styles.toolbarLabel}>{`( ${label()} )`}</span>
            </div>
            <button className={styles.toolbarButton} onClick={goToNext}>
               <FontAwesomeIcon icon={faChevronRight} />
            </button>
         </div>
      );
   };

   return (
      <div className={styles.calendarContainer}>
         <ToastContainer position='top-right' autoClose={5000} hideProgressBar={false} />

         <div className={styles.calendarHeader}>
            <h2>Learning Schedule</h2>
            <button className={styles.addEventButton} onClick={() => setShowModal(true)}>
               <FontAwesomeIcon icon={faCalendarPlus} /> Add Learning Session
            </button>
         </div>
         <div className={styles.calendarContent}>
            <BigCalendar
               localizer={localizer}
               events={events}
               startAccessor='start'
               endAccessor='end'
               onSelectSlot={handleSelectSlot}
               onSelectEvent={handleSelectEvent}
               selectable
               className={styles.calendar}
               components={{
                  toolbar: CustomToolbar,
                  event: CustomEvent,
               }}
               onMouseEnter={(event) => setTooltipEvent(event)}
               onMouseLeave={() => setTooltipEvent(null)}
            />
            {tooltipEvent && <EventTooltip event={tooltipEvent} />}
         </div>
         {showModal && (
            <div className={styles.modalOverlay}>
               <div className={styles.modal}>
                  <button className={styles.closeButton} onClick={() => setShowModal(false)}>
                     <FontAwesomeIcon icon={faTimes} />
                  </button>
                  <h2>
                     <FontAwesomeIcon icon={editingEvent ? faEdit : faCalendarPlus} />{" "}
                     {editingEvent ? "Edit Learning Session" : "Schedule Learning Session"}
                  </h2>
                  <form onSubmit={handleSubmit}>
                     <div className={styles.formGroup}>
                        <label htmlFor='title'>Session Title *</label>
                        <input
                           type='text'
                           id='title'
                           name='title'
                           value={newEvent.title}
                           onChange={handleInputChange}
                           required
                           placeholder='Enter session title'
                           className={newEvent.title.trim() ? "" : styles.invalid}
                        />
                        {!newEvent.title.trim() && <span className={styles.errorText}>Title is required</span>}
                     </div>
                     <div className={styles.formGroup}>
                        <label htmlFor='description'>Session Description</label>
                        <textarea
                           id='description'
                           name='description'
                           value={newEvent.description}
                           onChange={handleInputChange}
                           placeholder='Enter session description'
                        />
                     </div>
                     <div className={styles.formGroup}>
                        <label htmlFor='resourceType'>Resource Type</label>
                        <select 
                           id='resourceType' 
                           name='resourceType' 
                           value={newEvent.resourceType} 
                           onChange={handleInputChange} 
                           required
                        >
                           <option value='LINK'>Link</option>
                           <option value='VIDEO'>Video</option>
                           <option value='BOOK'>Book</option>
                           <option value='ARTICLE'>Article</option>
                        </select>
                     </div>
                     <div className={styles.formGroup}>
                        <label htmlFor='resourceLink'>
                           {newEvent.resourceType === "LINK" && <FontAwesomeIcon icon={faLink} />}
                           {newEvent.resourceType === "VIDEO" && <FontAwesomeIcon icon={faVideo} />}
                           {newEvent.resourceType === "BOOK" && <FontAwesomeIcon icon={faBook} />}
                           {newEvent.resourceType === "ARTICLE" && <FontAwesomeIcon icon={faNewspaper} />}
                           {" Resource Link"}
                        </label>
                        <input
                           type='text'
                           id='resourceLink'
                           name='resourceLink'
                           value={newEvent.resourceLink}
                           onChange={handleInputChange}
                           required
                           placeholder={`Enter ${newEvent.resourceType} link or details`}
                        />
                     </div>
                     <div className={styles.formGroup}>
                        <label htmlFor='start'>Start Time</label>
                        <input
                           type='datetime-local'
                           id='start'
                           name='start'
                           value={moment(newEvent.start).format("YYYY-MM-DDTHH:mm")}
                           onChange={handleInputChange}
                           min={moment().format("YYYY-MM-DDTHH:mm")}
                           required
                        />
                     </div>
                     <div className={styles.formGroup}>
                        <label htmlFor='end'>End Time</label>
                        <input
                           type='datetime-local'
                           id='end'
                           name='end'
                           value={moment(newEvent.end).format("YYYY-MM-DDTHH:mm")}
                           onChange={handleInputChange}
                           min={moment(newEvent.start).format("YYYY-MM-DDTHH:mm")}
                           required
                        />
                     </div>
                     <div className={styles.formActions}>
                        <button type='submit' className={styles.submitButton} disabled={isSubmitting}>
                           {isSubmitting
                              ? editingEvent
                                 ? "Updating..."
                                 : "Creating..."
                              : editingEvent
                              ? "Update Session"
                              : "Schedule Session"}
                        </button>
                        {editingEvent && (
                           <button type='button' onClick={handleDeleteClick} className={styles.deleteButton}>
                              <FontAwesomeIcon icon={faTrash} /> Delete
                           </button>
                        )}
                        <button type='button' onClick={() => setShowModal(false)} className={styles.cancelButton}>
                           Cancel
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
         {showConfirmModal && (
            <div className={styles.modalOverlay}>
               <div className={styles.confirmModal}>
                  <h3>Confirm Deletion</h3>
                  <p>Are you sure you want to delete this event?</p>
                  <div className={styles.confirmModalActions}>
                     <button onClick={handleConfirmDelete} className={styles.deleteButton}>
                        <FontAwesomeIcon icon={faTrash} /> Yes, delete
                     </button>
                     <button onClick={handleCancelDelete} className={styles.cancelButton}>
                        Cancel
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

export default Calendar;
