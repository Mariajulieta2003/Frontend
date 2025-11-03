import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__content">
                <div>
                    <h4>Que cada minuto cuente.</h4>
                    <p>Zana te sana.</p>
                </div>
                <div>
                    <h4>Descargá la app</h4>
                    <p>Disponible en App Store y Google Play.</p>
                </div>
                <div>
                    <h4>Comunicate</h4>
                    <p>
                        Av. San Juan 123, CABA
                        <br /> (011) 1234 5678
                        <br /> hola@sitioincreible.com.ar
                    </p>
                </div>
            </div>
            <p className="footer__copyright">© {new Date().getFullYear()} Zana. Todos los derechos reservados.</p>
        </footer>
    );
};
export default Footer;