import React from "react";
import Logo from "../../assets/images/darkLogo.png";
import style from "./Footer.module.css";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <section className={style.footer}>
      <div className={style.internalWrapper}>
        <div className={style.logoSection}>
          {/* Logo */}
          <img src={Logo} alt="Logo" className={style.logo} />
          {/* Social links */}
          <div className={style.socialLinks}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook size={30} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={30} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube size={30} />
            </a>
          </div>
        </div>

        <div className={style.linksSection}>
          {/* Useful links */}
          {/* <ul className={style.linksList}>
            <h3>Useful Links</h3>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/how-it-works">How It Works</a>
            </li>
            <li>
              <a href="/contact">Contact Us</a>
            </li>
          </ul> */}

          {/* Contact Info */}
          <div className={style.contactInfo}>
            <h3>Contact Info</h3>
            <ul className={style.contactList}>
              <li>Evangadi Networks </li>
              <li> support@evangadi.com </li>
              <li> +1-202-386-2702 </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;
