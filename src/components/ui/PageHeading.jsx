import { useEffect } from 'react';

export default function PageHeading({ title }) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | BookStore`;
    return () => { document.title = prevTitle; };
  }, [title]);

  return <h1 className="mb-4">{title}</h1>;
}