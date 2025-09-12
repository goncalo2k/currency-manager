import appleLogo from '../../assets/appstore.svg';
import logo from '../../assets/logo.svg';
import googleLogo from '../../assets/playstore.svg';

import Divider from '../divider/divider';
import './footer.css';

function Footer() {
  return (
    <>
      <Divider />
      <div className="footer">
        <div className="column logo-container">
          <div className="logo-box">
            <img src={logo} alt="Uphold Logo" className="logo-img" />
          </div>
        </div>

        <div className="column">
          <div className="section-header">
            <span className="heading">Products</span>
          </div>
          <ul className="list-container">
            <li>
              <button className="link">Consumers</button>
            </li>
            <li>
              <button className="link">Business</button>
            </li>
            <li>
              <button className="link">Partners</button>
            </li>
          </ul>
        </div>

        <div className="column">
          <div className="section-header">
            <span className="heading">Company</span>
          </div>
          <ul className="list-container">
            <li>
              <button className="link">About</button>
            </li>
            <li>
              <button className="link">Careers</button>
            </li>
            <li>
              <button className="link">Press</button>
            </li>
            <li>
              <button className="link">Blog</button>
            </li>
          </ul>
        </div>

        <div className="column">
          <div className="section-header">
            <span className="heading">Help</span>
          </div>
          <ul className="list-container">
            <li>
              <button className="link">FAQ &amp; Support</button>
            </li>
            <li>
              <button className="link">Platform Status</button>
            </li>
            <li>
              <button className="link">Criptionary</button>
            </li>
            <li>
              <button className="link">Pricing</button>
            </li>
            <li>
              <button className="link">Legal</button>
            </li>
          </ul>
        </div>

        <div className="column">
          <div className="section-header">
            <span className="heading">Social</span>
          </div>
          <ul className="list-container">
            <li>
              <button className="link">Facebook</button>
            </li>
            <li>
              <button className="link">Twitter</button>
            </li>
            <li>
              <button className="link">Instagram</button>
            </li>
            <li>
              <button className="link">LinkedIn</button>
            </li>
          </ul>
        </div>

        <div className="column">
          <div className="store-row">
            <img src={appleLogo} alt="Apple Logo" className="image" />
            <img src={googleLogo} alt="Google Play Logo" className="image" />
          </div>
          <select className="language-selector-container">
            <option>English</option>
            <option>Portuguese</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default Footer;
