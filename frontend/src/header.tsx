import React from 'react';
import './header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            <h1>Apex Tracks</h1>
            <nav>
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Drivers</a></li>
                    <li><a href="#">Tracks</a></li>
                    <li><a href="#">Shop</a></li>
                    <li><a href="#">Admin</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;