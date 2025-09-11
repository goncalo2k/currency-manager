import React from 'react';
import './header.css';
import upholdLogo from '../../assets/small-logo.svg';

interface HeaderProps {
  user: unknown;
  onSignIn: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignIn }) => {
  return (
    <div className="header">
      <div className="card link-list">
        <span>Personal</span>
        <span>Business</span>
        <span>Enterprise</span>
      </div>
      <div className="logo-container">
        <a href="https://uphold.com" target="_blank">
          <img src={upholdLogo} className="logo-uphold" alt="Uphold logo" />
        </a>
      </div>
      <div className="card">
        {!user ? <button onClick={onSignIn}>Log In</button> : <h1>Log Out</h1>}
      </div>
    </div>
  );
};

export default Header;
