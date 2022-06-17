import { PrismicRichText } from '@prismicio/react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic, { predicate } from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';
import Head from 'next/head';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR/index.js';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';
import CardPublication from '../../components/CardPublication';
import { useEffect } from 'react';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <h1> Carregando... </h1>;
  }

  const formatedDate = () => {
    return format(new Date(post.first_publication_date), 'dd MMM yyyy', {
      locale: ptBR,
    });
  };

  const readTime = (): number => {
    const wordsPerMinute = 200;
    let wordsCount = 0;

    post.data.content.forEach(postContent => {
      wordsCount += postContent.heading.split(' ').length;
      wordsCount += RichText.asText(postContent.body).split(' ').length;
    });

    return Math.ceil(wordsCount / wordsPerMinute);
  };

  return (
    <>
      <Head>
        <title> {post.data.title} | spacetraveling </title>
      </Head>
      <img src={post.data.banner.url} className={styles.banner} />

      <main className={commonStyles.container}>
        <div className={styles.post}>
          <CardPublication
            title={post.data.title}
            readTime={readTime()}
            author={post.data.author}
            formattedDate={formatedDate()}
          />

          {post.data.content.map(content => {
            return (
              <article key={content.heading}>
                <h2> {content.heading} </h2>
                <div
                  className={styles.postContainer}
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body),
                  }}
                />
              </article>
            );
          })}
        </div>
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient({});

  const posts = await prismic.getByType('publications');

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const { slug } = params;

  const response = await prismic.getByUID('publications', String(slug));

  return {
    props: {
      post: response,
    },
  };
};
