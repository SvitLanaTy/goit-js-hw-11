import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import refs from './js/refs.js';
import ImgsService from './js/ImgsService.js';
import createMarkup from './js/createMarkup.js';

const imgsService = new ImgsService();

refs.loadMoreBtn.classList.add('is-hidden');
refs.form.addEventListener('submit', onSearchSubmit);
refs.loadMoreBtn.addEventListener('click', fetchImgs);

function onSearchSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const querySearch = form.elements.searchQuery.value.trim();

  if (querySearch !== '') {
    imgsService.searchQuery = querySearch;
    imgsService.resetPage();
    clearImgsList();
    fetchImgs().finally(() => form.reset());
  }
}

async function fetchImgs() {
  refs.loadMoreBtn.classList.add('is-hidden');

  try {
    const markup = await getImagesMarkup();
    if (!markup) throw new Error('No data markup');
    updateImgsList(markup);
    lightbox.refresh();
  } catch (err) {
    onError(err);
  }
}

async function getImagesMarkup() {
  try {
    const { hits, totalHits } = await imgsService.getImages();
    const perPage = imgsService.per_page;

    if (!hits) {
      return '';
    }

    if (hits.length === 0)
      throw Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

    if (totalHits && imgsService.page === 2)
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);

    if (hits.length < perPage && totalHits >= perPage) {
      refs.loadMoreBtn.classList.add('is-hidden');
      throw Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      if (hits.length === perPage && totalHits > perPage)
        refs.loadMoreBtn.classList.remove('is-hidden');
    }

    return hits.reduce((markup, hit) => markup + createMarkup(hit), '');
  } catch (err) {
    onError(err);
  }
}

function updateImgsList(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
function clearImgsList() {
  refs.gallery.innerHTML = '';
}
function onError(err) {
  console.error(err);
}

refs.gallery.addEventListener('click', e => {
  e.preventDefault();
  const { target } = e;
  if (target.nodeName !== 'IMG') {
    return;
  }
});

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
