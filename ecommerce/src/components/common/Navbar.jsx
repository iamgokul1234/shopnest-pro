import { useEffect, useRef, useState } from "react";
import { BsCartCheckFill } from "react-icons/bs";
import { IoCloseSharp, IoLogoReact, IoCart } from "react-icons/io5";
import {
  MdMenu,
  MdOutlineAccountCircle,
  MdOutlineSearch,
} from "react-icons/md";
import { FaHome, FaHeart, FaShoppingBag } from "react-icons/fa";
import {
  IoIosInformationCircleOutline,
  IoMdLogIn,
  IoMdLogOut,
} from "react-icons/io";
import { BiSolidPhoneCall } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ROUTES } from "../../constants/routes";
import styles from "./Navbar.module.css";

export default function Navbar({
  search,
  setSearch,
  cart,
  wishlist,
  isLoggedIn,
  currentUser,
  onLogout,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef();
  const navigate = useNavigate();

  // ─── Close sidebar when clicking outside ──────────────────────
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── Logout Handler ────────────────────────────────────────────
  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#333",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        onLogout();
        setIsSidebarOpen(false);

        Swal.fire({
          icon: "success",
          title: "Logged out",
          timer: 1000,
          showConfirmButton: false,
        }).then(() => {
          navigate(ROUTES.LOGIN);
        });
      }
    });
  };

  return (
    <div>
      {/* ── Desktop Navigation Bar ──────────────────────────── */}
      <nav className={styles.reactContainer}>
        {/* Brand logo + name */}
        <Link to={ROUTES.HOME}>
          <span className={styles.react}>
            <IoLogoReact
              style={{ fontSize: "30px", width: "50px", fontWeight: "bold" }}
            />
            <span>ShopNest Pro</span>
          </span>
        </Link>

        {/* Desktop nav links + search + icons */}
        <div className={styles.navContainer}>
          <Link to={ROUTES.HOME}>
            <span className={styles.navs}>Home</span>
          </Link>

          <Link to={ROUTES.ABOUT}>
            <span className={styles.navs}>About</span>
          </Link>

          <Link to={ROUTES.CONTACT}>
            <span className={styles.navs}>Contact</span>
          </Link>

          {/* Search bar */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              value={search}
              placeholder="Search for products"
              onChange={(e) => setSearch(e.target.value)}
              className={styles.inputBox}
            />
            <span
              style={{
                position: "absolute",
                right: "15px",
                padding: "5px",
                fontSize: "1.2em",
              }}
            >
              <MdOutlineSearch />
            </span>
          </div>

          {/* Wishlist icon — only shown when logged in */}
          {isLoggedIn && (
            <Link to={ROUTES.WISHLIST}>
              <span
                style={{
                  color: "#ffff",
                  fontSize: "18px",
                  marginLeft: "10px",
                  position: "relative",
                  padding: "10px",
                  borderRadius: "2px",
                }}
              >
                <FaHeart />
                <span style={{ position: "absolute", top: "0", right: "0" }}>
                  {wishlist?.length || 0}
                </span>
              </span>
            </Link>
          )}

          {/* Cart icon with item count badge */}
          <Link to={ROUTES.CART}>
            <span
              style={{
                color: "#ffff",
                fontSize: "18px",
                marginLeft: "10px",
                position: "relative",
                padding: "10px",
                borderRadius: "2px",
              }}
            >
              <BsCartCheckFill />
              <span style={{ position: "absolute", top: "0", right: "0" }}>
                {cart?.length || 0}
              </span>
            </span>
          </Link>

          {/* Auth section — shows based on isLoggedIn prop */}
          {isLoggedIn ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Show Admin link only for admin users */}
              {currentUser?.role === "admin" && (
                <Link to={ROUTES.ADMIN}>
                  <span className={styles.navs}>Admin</span>
                </Link>
              )}

              {/* Orders link */}
              <Link to={ROUTES.ORDERS}>
                <span className={styles.navs}>Orders</span>
              </Link>

              <span className={styles.navs} style={{ cursor: "default" }}>
                <MdOutlineAccountCircle style={{ fontSize: "20px" }} />{" "}
                {currentUser?.name}
              </span>

              <span
                className={styles.navs}
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
              >
                <IoMdLogOut style={{ fontSize: "20px" }} /> Logout
              </span>
            </div>
          ) : (
            <Link to={ROUTES.LOGIN}>
              <span className={styles.navs}>
                <MdOutlineAccountCircle style={{ fontSize: "20px" }} /> Login
              </span>
            </Link>
          )}
        </div>

        {/* Hamburger menu icon */}
        <div className={styles.menuIcon} onClick={() => setIsSidebarOpen(true)}>
          <MdMenu size={24} />
        </div>
      </nav>

      {/* ── Mobile Sidebar ──────────────────────────────────── */}
      <div
        className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}
        ref={sidebarRef}
      >
        <div
          className={styles.closeIcon}
          onClick={() => setIsSidebarOpen(false)}
        >
          <IoCloseSharp size={24} />
        </div>

        <div className={styles.sidebarSearchContainer}>
          <input
            type="text"
            value={search}
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            className={styles.sidebarInput}
          />
          <span className={styles.sidebarSearchIcon}>
            <MdOutlineSearch />
          </span>
        </div>

        <Link to={ROUTES.HOME} onClick={() => setIsSidebarOpen(false)}>
          <FaHome /> Home
        </Link>
        <Link to={ROUTES.ABOUT} onClick={() => setIsSidebarOpen(false)}>
          <IoIosInformationCircleOutline /> About
        </Link>
        <Link to={ROUTES.CONTACT} onClick={() => setIsSidebarOpen(false)}>
          <BiSolidPhoneCall /> Contact
        </Link>

        {/* Wishlist link — only shown when logged in */}
        {isLoggedIn && (
          <Link to={ROUTES.WISHLIST} onClick={() => setIsSidebarOpen(false)}>
            <FaHeart /> Wishlist ({wishlist?.length || 0})
          </Link>
        )}

        {isLoggedIn && (
          <Link to={ROUTES.ORDERS} onClick={() => setIsSidebarOpen(false)}>
            <FaShoppingBag /> Orders
          </Link>
        )}

        <Link to={ROUTES.CART} onClick={() => setIsSidebarOpen(false)}>
          <IoCart /> Cart ({cart?.length || 0})
        </Link>

        {/* Auth section in sidebar */}
        {isLoggedIn ? (
          <span onClick={handleLogout} style={{ cursor: "pointer" }}>
            <IoMdLogOut /> Logout ({currentUser?.name})
          </span>
        ) : (
          <Link to={ROUTES.LOGIN} onClick={() => setIsSidebarOpen(false)}>
            <IoMdLogIn /> Login
          </Link>
        )}
      </div>
    </div>
  );
}
