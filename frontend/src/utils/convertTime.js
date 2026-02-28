// frontend/src/utils/convertTime.js
const convertTime = (time) => {
  if (!time) return "";
  const [hoursStr, minutesStr] = time.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  const meridiem = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 -> 12
  return `${hours}:${minutes.toString().padStart(2, "0")} ${meridiem}`;
};

export default convertTime;
