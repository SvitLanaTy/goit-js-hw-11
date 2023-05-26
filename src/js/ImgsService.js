import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '36500573-d5b69d6f0658019d33df3edb2';

export default class ImgsService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.per_page = 40;
  }

  async getImages() {
    const { data } = await axios.get(
      `${URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true
&per_page=${this.per_page}&page=${this.page}`
    );
    const hits = data.hits;
    const totalHits = data.totalHits;
    this.incrementPage();
    return { hits, totalHits };
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}
