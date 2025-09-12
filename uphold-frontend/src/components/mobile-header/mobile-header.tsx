import React, { useEffect, useRef, useState } from 'react';
import upholdLogo from '../../assets/small-logo.svg';
import './mobile-header.css';

const MobileHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="mobile-header">
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="logo-container-mobile">
        <a href="https://uphold.com" target="_blank">
          <img src={upholdLogo} className="logo-uphold" alt="Uphold logo" />
        </a>
      </div>
      {menuOpen && (
        <div className="mobile-modal-backdrop" onClick={() => setMenuOpen(false)}>
          <div className="mobile-modal" ref={navRef} onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              &times;
            </button>
            <ul>
              <li>
                <a>Personal</a>
              </li>
              <li>
                <a>Business</a>
              </li>
              <li>
                <a>Partners</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
