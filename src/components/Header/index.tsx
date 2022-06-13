import Link from 'next/Link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <h1>
        <Link href="/">
          <img src="/images/Logo.svg" alt="Logo" />
        </Link>
      </h1>
    </header>
  );
}
