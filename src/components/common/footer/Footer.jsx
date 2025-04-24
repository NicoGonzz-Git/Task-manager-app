import React from 'react';

const Footer = () => {

    const currentYear = new Date().getFullYear();
    
    return(
        <footer>
            {currentYear} TaskManager All rights reserved.
        </footer>
    )
}

export default Footer
