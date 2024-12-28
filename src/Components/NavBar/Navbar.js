import styles from './NavBar.module.css'

export default function NavBar() {
    const handleLogoClick = () => {
        window.location.href = '/';
    }

    return (
        <div className={styles.navBar}>
            <div className={styles.navBarLogo} onClick={handleLogoClick}>
                <img
                    src="https://mellow-seahorse-fc9268.netlify.app/assets/logo.png"
                    alt="logo"
                />
                <span>PhotoFolio</span>
            </div>
        </div>
    );
}
