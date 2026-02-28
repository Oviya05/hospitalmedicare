import { useContext } from 'react'
import { BiMenu } from "react-icons/bi";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Tabs = ({ tab, setTab }) => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <div>
      {/* Mobile menu icon */}
      <span className='lg:hidden'>
        <BiMenu className='w-6 h-6 cursor-pointer' />
      </span>

      {/* Desktop Sidebar */}
      <div className='hidden lg:flex flex-col p-[30px] bg-white shadow-panelShadow items-center h-max rounded-md'>

        <button
          onClick={() => setTab("overview")}
          className={`w-full btn mt-0 rounded-md ${
            tab === "overview"
              ? "bg-indigo-100 text-primaryColor"
              : "bg-transparent text-headingColor"
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setTab("appointments")}
          className={`w-full btn mt-4 rounded-md ${
            tab === "appointments"
              ? "bg-indigo-100 text-primaryColor"
              : "bg-transparent text-headingColor"
          }`}
        >
          Appointments
        </button>

        <button
          onClick={() => setTab("settings")}
          className={`w-full btn mt-4 rounded-md ${
            tab === "settings"
              ? "bg-indigo-100 text-primaryColor"
              : "bg-transparent text-headingColor"
          }`}
        >
          Profile
        </button>

        {/* Logout + Delete */}
        <div className="mt-[50px] w-full">
          <button
            onClick={handleLogout}
            className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white"
          >
            Logout
          </button>

          <button className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white">
            Delete account
          </button>
        </div>

      </div>
    </div>
  );
};

export default Tabs;