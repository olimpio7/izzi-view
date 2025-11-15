import { getDetails, IMAGE_BASE_URL } from './api.js';
import { formatYear, safeText, handleApiError } from './utils.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');
const type = params.get('type') || 'movie';

const loading = document.getElementById('loading');
const details = document.getElementById('details');
const poster = document.getElementById('poster');
const titleEl = document.getElementById('title');
const metaEl = document.getElementById('meta');
const overviewEl = document.getElementById('overview');
const castGrid = document.getElementById('cast-grid');
const castError = document.getElementById('cast-error');
const errorMessage = document.getElementById('error-message');
const ratingEl = document.getElementById('rating');
const seasonsSection = document.getElementById('seasons-section');
const seasonsGrid = document.getElementById('seasons-grid');

document.getElementById('back-btn').addEventListener('click', () => {
  history.back();
});

async function init() {
  if (!id) { 
    handleApiError({ status: 404 }, errorMessage); 
    loading.classList.add('hidden'); 
    return; 
  }
  
  try {
    const data = await getDetails(id, type);
    
    poster.src = data.poster_path ? IMAGE_BASE_URL + data.poster_path : 'img/no-image.png';
    poster.alt = data.title || data.name || 'Poster';
    poster.onerror = () => { 
      poster.onerror = null; 
      poster.src = 'img/no-image.png'; 
    };
    
    titleEl.textContent = data.title || data.name || 'Sem título';
    ratingEl.textContent = data.vote_average ? `⭐ ${data.vote_average.toFixed(1)}/10` : '—';
    metaEl.textContent = `${type.toUpperCase()} • ${formatYear(data.release_date || data.first_air_date)}`;
    overviewEl.textContent = safeText(data.overview);

    // Temporadas (apenas para séries)
    if (type === 'tv' && data.seasons && data.seasons.length) {
      seasonsSection.classList.remove('hidden');
      seasonsGrid.innerHTML = '';
      
      data.seasons.forEach(s => {
        const card = document.createElement('div');
        card.className = 'season-card';
        card.innerHTML = `
          <div class="font-medium">${s.name}</div>
          <div class="text-sm text-gray-600 mt-1">Episódios: ${s.episode_count || '—'}</div>
          <div class="text-xs text-gray-500 mt-2">Lançamento: ${formatYear(s.air_date || s.first_air_date || s.release_date)}</div>
        `;
        seasonsGrid.appendChild(card);
      });
    } else {
      seasonsSection.classList.add('hidden');
    }

    // Elenco
    try {
      castGrid.innerHTML = '';
      
      if (data.credits && data.credits.cast && data.credits.cast.length) {
        data.credits.cast.slice(0, 24).forEach(p => {
          const card = document.createElement('div');
          card.className = 'bg-white rounded-lg p-2 text-center';
          card.innerHTML = `
            <img src="${p.profile_path ? IMAGE_BASE_URL + p.profile_path : 'img/person-placeholder.png'}" 
                 alt="${p.name || 'Ator'}" 
                 class="w-full h-36 object-cover rounded">
            <div class="mt-2 text-sm font-medium">${p.name || 'Nome não informado'}</div>
            <div class="text-xs text-gray-500">${p.character || 'Personagem não informado'}</div>
          `;
          
          const img = card.querySelector('img');
          img.onerror = () => { 
            img.onerror = null; 
            img.src = 'img/person-placeholder.png'; 
          };
          
          castGrid.appendChild(card);
        });
      } else {
        castError.textContent = 'Nenhuma informação de elenco disponível.';
        castError.classList.remove('hidden');
      }
    } catch (cerr) {
      console.error('Erro renderizar elenco', cerr);
      castError.textContent = 'Não foi possível carregar o elenco.';
      castError.classList.remove('hidden');
    }

    loading.classList.add('hidden');
    details.classList.remove('hidden');
    details.classList.add('flex', 'flex-col', 'lg:flex-row');
    
  } catch (err) {
    console.error(err);
    handleApiError(err, errorMessage);
    loading.classList.add('hidden');
  }
}

init();
