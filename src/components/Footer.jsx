import React from 'react';

function Footer() {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Cruise Reservation System. All rights reserved.</p>
    </footer>
  );
}

export default Footer;