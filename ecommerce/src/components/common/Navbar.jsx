/**
 * Navbar.jsx — Global Navigation Component
 *
 * RESPONSIBILITY:
 *  Renders the top navigation bar and mobile sidebar.
 *  Handles: logo, nav links, search input, cart badge, account link.
 *
 * PROPS:
 *  - search     {string}   Current search query (controlled from App)
 *  - setSearch  {function} Updates the search state in App
 *  - cart       {array}    Cart items array (used to show item count)
 *
 * FEATURES:
 *  - Fixed top navbar for desktop
 *  - Hamburger menu + slide-in sidebar for mobile
 *  - Closes sidebar when clicking outside (useRef + useEffect)
 *  - Real-time cart item count badge
 */

import { useEffect, useRef, useState } from 'react';
import { BsCartCheckFill } from 'react-icons/bs';
import { IoCloseSharp, IoLogoReact, IoCart } from 'react-icons/io5';
import { MdMenu, MdOutlineAccountCircle, MdOutlineSearch } from 'react-icons/md';
import { FaHome } from 'react-icons/fa';
import { IoIosInformationCircleOutline, IoMdLogIn } from 'react-icons/io';
import { BiSolidPhoneCall } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './Navbar.module.css';

export default function Navbar({ search, setSearch, cart }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // useRef gives us a direct reference to the sidebar DOM element
  // so we can check if a click happened inside or outside it
  const sidebarRef = useRef();

  // ─── Close sidebar when user clicks outside it ──────────────────
  useEffect(() => {
    function handleClickOutside(event) {
      // If the sidebar exists AND the click was NOT inside it → close
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    }

    // Attach event listener when component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup: remove listener when component unmounts
    // This prevents memory leaks
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // Empty array = run once on mount only

  return (
    <div>
      {/* ── Desktop Navigation Bar ─────────────────────────────── */}
      <nav className={styles.reactContainer}>

        {/* Brand logo + name */}
        <Link to={ROUTES.HOME}>
          <span className={styles.react}>
            <IoLogoReact style={{ fontSize: '30px', width: '50px', fontWeight: 'bold' }} />
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

          {/* Search bar — controlled input synced to App state */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              value={search}
              placeholder="Search for products"
              onChange={(e) => setSearch(e.target.value)}
              className={styles.inputBox}
            />
            <span style={{ position: 'absolute', right: '15px', padding: '5px', fontSize: '1.2em' }}>
              <MdOutlineSearch />
            </span>
          </div>

          {/* Cart icon with item count badge */}
          <Link to={ROUTES.CART}>
            <span style={{ color: '#ffff', fontSize: '18px', marginLeft: '10px', position: 'relative', padding: '10px', borderRadius: '2px' }}>
              <BsCartCheckFill />
              {/* Badge: shows number of items in cart */}
              <span style={{ position: 'absolute', top: '0', right: '0' }}>
                {cart?.length || 0}
              </span>
            </span>
          </Link>

          {/* Account / Login icon */}
          <Link to={ROUTES.LOGIN}>
            <span className={styles.navs}>
              <MdOutlineAccountCircle style={{ fontSize: '20px' }} />
            </span>
          </Link>
        </div>

        {/* Hamburger menu icon — visible only on mobile */}
        <div className={styles.menuIcon} onClick={() => setIsSidebarOpen(true)}>
          <MdMenu size={24} />
        </div>
      </nav>

      {/* ── Mobile Sidebar ─────────────────────────────────────── */}
      {/* Conditionally applies the "open" class to slide it in */}
      <div
        className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}
        ref={sidebarRef}
      >
        {/* Close button */}
        <div className={styles.closeIcon} onClick={() => setIsSidebarOpen(false)}>
          <IoCloseSharp size={24} />
        </div>

        {/* Search input inside sidebar */}
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

        {/* Sidebar nav links — each closes the sidebar on click */}
        <Link to={ROUTES.HOME} onClick={() => setIsSidebarOpen(false)}>
          <FaHome /> Home
        </Link>
        <Link to={ROUTES.ABOUT} onClick={() => setIsSidebarOpen(false)}>
          <IoIosInformationCircleOutline /> About
        </Link>
        <Link to={ROUTES.CONTACT} onClick={() => setIsSidebarOpen(false)}>
          <BiSolidPhoneCall /> Contact
        </Link>
        <Link to={ROUTES.CART} onClick={() => setIsSidebarOpen(false)}>
          <IoCart /> Cart ({cart?.length || 0})
        </Link>
        <Link to={ROUTES.LOGIN} onClick={() => setIsSidebarOpen(false)}>
          <IoMdLogIn /> Login
        </Link>
      </div>
    </div>
  );
}
