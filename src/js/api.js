export const API_KEY = 'e7524b376bd8a49424af25b4230f87b2';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const txt = await res.text().catch(() => res.statusText);
      const err = new Error(`API error: ${res.status} ${txt}`);
      err.status = res.status;
      throw err;
    }
    return await res.json();
  } catch (err) {
    if (err.name === 'TypeError') {
      const e = new Error('NETWORK');
      e.isNetwork = true;
      throw e;
    }
    throw err;
  }
}

export async function getGenres() {
  const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`;
  return await safeFetch(url);
}

export async function discover(
  type = 'movie',
  { page = 1, genre = '', sortBy = 'popularity.desc' } = {}
) {
  const today = new Date().toISOString().split("T")[0];

  // ordenação
  let sortField = sortBy;
  if (sortBy === 'release_date.asc') {
    sortField = type === 'movie'
      ? 'primary_release_date.asc'
      : 'first_air_date.asc';
  }
  else if (sortBy === 'release_date.desc') {
    sortField = type === 'movie'
      ? 'primary_release_date.desc'
      : 'first_air_date.desc';
  }
  const genreFilter = genre ? `&with_genres=${genre}` : '';

  // filtro 2025
  const dateFilter =
    type === 'movie'
      ? `&primary_release_date.gte=2025-01-01&primary_release_date.lte=${today}`
      : `&first_air_date.gte=2025-01-01&first_air_date.lte=${today}`;

  // remoção de conteúdo de países indesejados,limitando apenas a essas 3 linguagens
  const languageFilter = `&with_original_language=en|pt|es`;

  const url =
    `${BASE_URL}/discover/${type}` +
    `?api_key=${API_KEY}` +
    `&language=pt-BR` +
    `&sort_by=${sortField}` +
    `&page=${page}` +
    genreFilter +
    dateFilter +
    languageFilter;

  console.log("URL discover ->", url);

  return await safeFetch(url);
}

export async function getDetails(id, type = 'movie') {
  const url = `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=pt-BR&append_to_response=credits`;
  return await safeFetch(url);
}
