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

//paginação
function buildPagination(container, current, total) {
  container.innerHTML = '';
  if (total <= 1) return;
  
  const prev = document.createElement('button'); 
  prev.textContent = 'Anterior'; 
  prev.className = 'pagination-btn'; 
  prev.disabled = current === 1; 
  prev.addEventListener('click', () => goToPage(current - 1)); 
  container.appendChild(prev);
  
  const maxButtons = 7; 
  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, current - half); 
  let end = Math.min(total, start + maxButtons - 1);
  
  if (end - start < maxButtons - 1) {
    start = Math.max(1, end - maxButtons + 1);
  }
  
  if (start > 1) { 
    const first = document.createElement('button'); 
    first.className = 'pagination-btn'; 
    first.textContent = '1'; 
    first.addEventListener('click', () => goToPage(1)); 
    container.appendChild(first); 
    
    if (start > 2) { 
      const dots = document.createElement('span'); 
      dots.textContent = '...'; 
      dots.className = 'px-2'; 
      container.appendChild(dots); 
    } 
  }
  
  for (let i = start; i <= end; i++) { 
    const btn = document.createElement('button'); 
    btn.className = 'pagination-btn' + (i === current ? ' active' : ''); 
    btn.textContent = String(i); 
    btn.addEventListener('click', () => goToPage(i)); 
    container.appendChild(btn); 
  }
  
  if (end < total) { 
    if (end < total - 1) { 
      const dots = document.createElement('span'); 
      dots.textContent = '...'; 
      dots.className = 'px-2'; 
      container.appendChild(dots); 
    } 
    
    const last = document.createElement('button'); 
    last.className = 'pagination-btn'; 
    last.textContent = String(total); 
    last.addEventListener('click', () => goToPage(total)); 
    container.appendChild(last); 
  }
  
  const next = document.createElement('button'); 
  next.textContent = 'Próxima'; 
  next.className = 'pagination-btn'; 
  next.disabled = current === total; 
  next.addEventListener('click', () => goToPage(current + 1)); 
  container.appendChild(next);
}

function goToPage(n) { 
  if (n < 1) n = 1; 
  if (n > state.totalPages) n = state.totalPages; 
  state.page = n; 
  window.scrollTo({ top: 0, behavior: 'smooth' }); 
  load(); 
}

//filtros e carregamento
document.getElementById('content-type').addEventListener('change', (e) => { 
  state.content = e.target.value; 
  state.page = 1; 
  load(); 
});

document.getElementById('genre').addEventListener('change', (e) => { 
  state.genre = e.target.value; 
  state.page = 1; 
  load(); 
});

document.getElementById('sort').addEventListener('change', (e) => { 
  state.sortBy = e.target.value; 
  state.page = 1; 
  load(); 
});

async function load() {
  showLoading(); 
  hideError();
  
  try {
    let combined = [];
    state.totalPages = 1;
    
    const types = state.content === 'all' ? ['movie', 'tv'] : [state.content];
    
    for (const t of types) {
      const res = await discover(t, { 
        page: state.page, 
        genre: state.genre, 
        sortBy: state.sortBy 
      });
      
      if (res && res.results) {
        combined = combined.concat(res.results.map(r => ({ ...r, media_type: t })));
      }
      
      if (res && res.total_pages) {
        state.totalPages = Math.max(state.totalPages, res.total_pages);
      }
    }
    
    if (state.sortBy === 'vote_average.desc') {
      combined = combined.filter(x => (x.vote_count || 0) >= 50);
      combined.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else {
      combined.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
    
    render(combined);
    saveState(state);
    
    state.totalPages = Math.min(state.totalPages || 1, 500);
    buildPagination(paginationBottom, state.page, Math.min(state.totalPages, 500));
    
  } catch (err) {
    console.error(err);
    handleApiError(err, errorMessage);
  } finally {
    hideLoading();
  }
}

async function init() {
  try {
    const g = await getGenres();
    const opts = ['<option value="">Todos</option>'];
    (g.genres || []).forEach(gg => {
      opts.push(`<option value="${gg.id}">${gg.name}</option>`);
    });
    document.getElementById('genre').innerHTML = opts.join('');
    
    const restore = window.__CINE_RESTORE;
    if (restore) {
      if (restore.genre) state.genre = restore.genre;
      if (restore.content) state.content = restore.content;
      if (restore.sortBy) state.sortBy = restore.sortBy;
      if (restore.page) state.page = restore.page;
      
      document.getElementById('genre').value = state.genre || '';
      document.getElementById('content-type').value = state.content || 'all';
      document.getElementById('sort').value = state.sortBy || 'popularity.desc';
    }
  } catch (err) {
    console.error('Erro carregar gêneros', err);
  }
  
  await load();
}

init();