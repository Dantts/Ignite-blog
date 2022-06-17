import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Head from 'next/head';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Link from 'next/link';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR/index.js';
import CardPublication from '../components/CardPublication';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  useEffect(() => {
    setPosts(formatPosts(postsPagination.results));
  }, []);

  const formatPosts = (posts: Post[]) => {
    return posts.map(post => {
      return {
        ...post,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd MMM yyyy',
          {
            locale: ptBR,
          }
        ),
      };
    });
  };

  async function handleNextPage(): Promise<void> {
    fetch(nextPage)
      .then(response => response.json())
      .then((data: PostPagination) => {
        setPosts(formatPosts([...posts, ...data.results]));
        setNextPage(data.next_page);
      });
  }

  return (
    <>
      <Head>
        <title> Home | spacetraveling </title>
      </Head>

      <main className={commonStyles.container}>
        <article className={styles.posts}>
          {posts.map(post => (
            <CardPublication
              key={post.uid}
              uid={post.uid}
              title={post.data.title}
              subtitle={post.data.subtitle}
              author={post.data.author}
              formattedDate={post.first_publication_date}
            />
          ))}

          {nextPage && (
            <button type="button" onClick={handleNextPage}>
              Carregar mais posts
            </button>
          )}
        </article>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const post: PostPagination = (await prismic.getByType('publications', {
    pageSize: 1,
  })) as unknown as PostPagination;

  const postsPagination: PostPagination = {
    next_page: post.next_page,
    results: post.results,
  };

  return {
    props: {
      postsPagination,
    },
  };
};
