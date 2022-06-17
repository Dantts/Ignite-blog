import Link from 'next/link';
import React from 'react';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import styles from './styles.module.scss';

interface CardPublicationProps {
  uid?: string;
  title: string;
  subtitle?: string;
  author: string;
  formattedDate: string;
  readTime?: number;
}

const CardPublication = ({
  uid,
  title,
  subtitle,
  author,
  formattedDate,
  readTime,
}: CardPublicationProps) => {
  return (
    <>
      {uid ? (
        <Link href={`/post/${uid}`}>
          <a className={`${styles.postContainerWithLink}`}>
            <CardPublicationContent
              title={title}
              subtitle={subtitle}
              author={author}
              formattedDate={formattedDate}
            />
          </a>
        </Link>
      ) : (
        <header className={`${styles.postContainerWithoutLink}`}>
          <CardPublicationContent
            title={title}
            author={author}
            formattedDate={formattedDate}
            readTime={readTime}
          />
        </header>
      )}
    </>
  );
};

const CardPublicationContent = ({
  uid,
  title,
  subtitle,
  author,
  formattedDate,
  readTime,
}: CardPublicationProps) => (
  <div className={`${styles.postContent}`}>
    <h1>{title}</h1>
    {subtitle && <h2>{subtitle}</h2>}
    <div>
      <time>
        <FiCalendar /> {formattedDate}
      </time>
      <span>
        <FiUser /> {author}
      </span>
      {readTime && (
        <span>
          <FiClock /> {`${readTime} min`}
        </span>
      )}
    </div>
  </div>
);

export default CardPublication;
