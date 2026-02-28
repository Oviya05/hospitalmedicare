import { useContext } from "react";
import convertTime from "../../utils/convertTime";
import { BASE_URL } from "../../config";
import { AuthContext } from "../../context/AuthContext";

const SidePanel = ({ doctorId, ticketPrice, timeSlots }) => {
  const { token } = useContext(AuthContext); // ✅ Correct source of token

  const bookingHandler = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/bookings/checkout-session/${doctorId}`, // ✅ FIXED URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Correct token
          },
          body: JSON.stringify({
            timeSlot: timeSlots[0],
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
         throw new Error(data.message + 'please try again');
      }

      // Redirect user to Stripe checkout
      if (data.session?.url) {
         window.location.href = data.session.url;
      }
    } catch (err) {
   
    toast.error(err.message);
    }
  };

  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
      <div className="flex items-center justify-between">
        <p className="text_para mt-0 font-semibold">Ticket Price</p>
        <span className="text-[16px] leading-7 lg:text-[22px] font-bold text-headingColor">
          {ticketPrice} USD
        </span>
      </div>

      <div className="mt-[30px]">
        <p className="text_para mt-0 font-semibold text-headingColor">
          Available Time Slots:
        </p>

        <ul className="mt-3">
          {timeSlots && timeSlots.length > 0 ? (
            timeSlots.map((slot, index) => (
              <li
                key={index}
                className="flex items-center justify-between mb-2"
              >
                <p className="text-[15px] leading-6 text-textColor font-semibold">
                  {slot.day
                    ? slot.day.charAt(0).toUpperCase() + slot.day.slice(1)
                    : "Day N/A"}
                </p>
                <p className="text-[15px] leading-6 text-textColor font-semibold">
                  {convertTime(slot.startingTime)} - {convertTime(slot.endingTime)}
                </p>
              </li>
            ))
          ) : (
            <li className="text-textColor font-semibold">
              No time slots available
            </li>
          )}
        </ul>
      </div>

      <button
        onClick={bookingHandler}
        className="btn px-2 w-full rounded-md mt-4"
      >
        Book Appointment
      </button>
    </div>
  );
};

export default SidePanel;
