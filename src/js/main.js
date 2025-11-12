import { getGenres, discover, IMAGE_BASE_URL } from './api.js';
import { formatYear, handleApiError } from './utils.js';
import { saveState } from './state.js';

const moviesContainer = document.getElementById('movies-container');
const genreSelect = document.getElementById('genre');
const contentType = document.getElementById('content-type');
const sortSelect = document.getElementById('sort');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const paginationBottom = document.getElementById('pagination-bottom');

let state = { 
  page: 1, 
  totalPages: 1, 
  genre: '', 
  content: 'all', 
  sortBy: 'popularity.desc', 
  perPage: 20 
};

function showLoading() { 
  loading.classList.remove('hidden'); 
}

function hideLoading() { 
  loading.classList.add('hidden'); 
}

function hideError() { 
  errorMessage.classList.add('hidden'); 
  errorMessage.innerHTML = ''; 
}

function cardFrom(item, type) {
  const id = item.id;
  const title = item.title || item.name || 'Sem título';
  const date = item.release_date || item.first_air_date || '';
  const year = formatYear(date);
  const poster = item.poster_path ? (IMAGE_BASE_URL + item.poster_path) : 'img/no-image.png';
  
  const wrapper = document.createElement('article');
  wrapper.className = 'movie-card bg-white rounded-lg shadow hover:shadow-lg overflow-hidden cursor-pointer transition relative';
  wrapper.innerHTML = `
    <span class="type-badge">${type === 'movie' ? 'Filme' : 'Série'}</span>
    <div class="poster-wrapper">
      <img src="${poster}" alt="${title}" loading="lazy">
    </div>
    <div class="p-2">
      <h3 class="font-semibold text-sm truncate-2" title="${title}">${title}</h3>
      <p class="text-gray-500 text-xs">${year}</p>
    </div>
  `;
  
  wrapper.addEventListener('click', () => {
    saveState(state);
    window.location.href = `details.html?id=${id}&type=${type}`;
  });
  
  const img = wrapper.querySelector('img');
  img.onerror = () => { 
    img.onerror = null; 
    img.src = 'img/no-image.png'; 
  };
  
  return wrapper;
}

function render(list) {
  moviesContainer.innerHTML = '';
  if (!list || list.length === 0) {
    moviesContainer.innerHTML = '<p class="col-span-full text-center">Nenhum título encontrado.</p>';
    return;
  }
  list.forEach(item => {
    const type = item.media_type ? item.media_type : (item.title ? 'movie' : 'tv');
    moviesContainer.appendChild(cardFrom(item, type));
  });
}
