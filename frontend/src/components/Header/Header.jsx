import { useState, useRef, useContext, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/images/logo.png";
import { BiMenu } from "react-icons/bi";

const navLinks = [
  { path: "/home", display: "Home" },
  { path: "/doctors", display: "Find a Doctor" },
  { path: "/services", display: "Services" },
  { path: "/contact", display: "Contact" },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);

  const { user, token, role } = useContext(AuthContext);

  const dashboardPath =
    role === "doctor"
      ? "/doctors/me"
      : role === "patient"
      ? "/users/me"
      : "/login";

  const defaultUserImg =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // Sticky header
  const handleStickyHeader = () => {
    if (
      document.body.scrollTop > 80 ||
      document.documentElement.scrollTop > 80
    ) {
      headerRef.current.classList.add("sticky__header");
    } else {
      headerRef.current.classList.remove("sticky__header");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyHeader);
    return () => window.removeEventListener("scroll", handleStickyHeader);
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  return (
    <header className="header flex items-center" ref={headerRef}>
    <div className="container max-w-[1400px] mx-auto">
   <div className="flex items-center justify-center w-full">

      {/* LOGO */}
      <Link to="/" className="flex-shrink-0">
        <img src={logo} alt="Logo" className="w-[130px] h-auto" />
      </Link>

      {/* CENTER MENU */}
      <div className="flex justify-center flex-1">
        <ul className="menu flex items-center gap-[2.7rem]">
          {navLinks.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                className={(navClass) =>
                  navClass.isActive
                    ? "text-primaryColor text-[16px] font-[600]"
                    : "text-textColor text-[16px] font-[500] hover:text-primaryColor"
                }
              >
                {link.display}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {token ? (
          <Link to={dashboardPath}>
            <img
              src={user?.photo || defaultUserImg}
              className="w-[40px] h-[40px] rounded-full border cursor-pointer"
              alt="profile"
            />
          </Link>
        ) : (
          <Link to="/login">
            <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] rounded-[50px]">
              Login
            </button>
          </Link>
        )}

        <span className="lg:hidden" onClick={toggleMenu}>
          <BiMenu className="w-6 h-6 cursor-pointer" />
        </span>
      </div>

    </div>
  </div>
</header>
  );
};

export default Header;
