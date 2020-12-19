import { useState, useEffect } from 'react';
import LoaderPage from './Components/Loader/Loader';
import Searchbar from './Components/Searchbar/Searchbar';
import { ToastContainer } from 'react-toastify';
import ImageGallery from './Components/ImageGallery/ImageGallery';
import FetchApi from './services/pictures-api';
import Button from './Components/Button/Button';
import Modal from './Components/Modal/Modal';
import s from './App.module.css';

export default function App() {
  const [pictures, setPictures] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');

  useEffect(() => {
    if (!query) {
      return;
    }
    const fetchPictures = () => {
      setIsLoading(true);
      FetchApi(page, query)
        .then(hits => {
          setPictures(prevPictures => [...prevPictures, ...hits]);
          scrollToNextPage();
        })
        .catch(error => setError(error))
        .finally(() => setIsLoading(false));
    };

    fetchPictures();
  }, [query, page]);

  // useEffect(() => {
  //   // if (!page) {
  //   //   scrollToNextPage();
  //   // }
  //   scrollToNextPage();
  // });

  const handleSearchBarSubmit = query => {
    setQuery(query);
    setPage(1);
    setPictures([]);
    setError(null);
    setIsLoading(true);
  };

  const loadMore = () => {
    setIsLoading(true);
    setPage(prevPage => prevPage + 1);
  };

  // const fetchPictures = () => {
  //   setIsLoading(true);
  //   FetchApi(page, searchQuery)
  //     .then(hits => {
  //       setPictures(prevPictures => [...prevPictures, ...hits]);
  //       setPage(prevPage => prevPage + 1);
  //     })
  //     .catch(error => setError(error))
  //     .finally(() => setIsLoading(false));
  // };

  const scrollToNextPage = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const onClickImage = largeImageURL => {
    setLargeImageURL(largeImageURL);
    toggleModal();
  };

  const shouldRenderButton = pictures.length > 0 && !error;
  const picIsNotFound = query && pictures.length === 0 && !error && !isLoading;

  return (
    <div className={s.App}>
      {error && <p className={s.error}>Something went wrong. Try again</p>}
      <Searchbar onSubmit={handleSearchBarSubmit} />

      {isLoading && <LoaderPage />}

      {showModal && (
        <Modal largeImageURL={largeImageURL} toggleModal={toggleModal} />
      )}

      {pictures.length > 0 && !error && (
        <ImageGallery pictures={pictures} onClickImage={onClickImage} />
      )}

      {shouldRenderButton && <Button onClick={loadMore} />}

      {picIsNotFound && (
        <p className={s.error}>Nothing were found. Enter another query</p>
      )}

      <ToastContainer autoClose={3000} />
    </div>
  );
}
