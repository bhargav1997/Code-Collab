import { toast } from "react-toastify";
import moment from "moment";

export const checkUpcomingEvents = (events) => {
   if (!events || events.length === 0) return;

   const tomorrow = moment().add(1, "days").startOf("day");
   const dayAfterTomorrow = moment().add(2, "days").startOf("day");

   const upcomingEvents = events.filter((event) => {
      const eventStart = moment(event.start);
      return eventStart.isBetween(tomorrow, dayAfterTomorrow);
   });

   if (upcomingEvents.length > 0) {
      upcomingEvents.forEach((event) => {
         const startTime = moment(event.start).format("MMM DD, YYYY hh:mm A");
         const endTime = moment(event.end).format("hh:mm A");

         toast.info(`🗓️ Upcoming Task Tomorrow:\n${event.title}\n${startTime} - ${endTime}`, {
            position: "top-right",
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
         });
      });
   }
};
