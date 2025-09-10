import React from "react";
import './header.css';

interface HeaderProps {
  user: any;
  onSignIn: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onSignIn,
}) => {
  return (
    <div className="header">
      <div className="card">
        {!user ? (
          <button onClick={onSignIn}>Sign in with upholdService</button>
        ) : <h1>Hi!</h1>}
      </div>
    </div>
  );
};

export default Header;
