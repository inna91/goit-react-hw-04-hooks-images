import axios from 'axios';

export default function FetchApi(query, page) {
  const picUrl = `https://pixabay.com/api/?key=18661870-79eb159249f519a0733d37bbc&image_type=photo&orientation=horizontal&per_page=12&q=${query}&page=${page}`;
  return axios.get(picUrl).then(response => response.data.hits);
}
