import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => (
  <div>
    <div className='bg_header_image'>
    </div>
    {/* <nav style={{ padding: '1rem', background: '#eee' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/chat">Chat</Link>
    </nav> */}
  </div>
);

export default Header;
