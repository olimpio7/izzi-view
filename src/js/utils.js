export function formatYear(dateString){
  if (!dateString) return '—';
  return dateString.split('-')[0];
}

export function safeText(text){
  return text ? text : 'Sem informação disponível.';
}

export function handleApiError(err, container){
  if (!container) return;
  if (err.isNetwork) container.innerHTML = '<div class="error-card">Não foi possível se conectar ao servidor. Verifique sua conexão.</div>';
  else if (err.status === 404) container.innerHTML = '<div class="error-card">O conteúdo solicitado não foi encontrado.</div>';
  else if (err.status >= 500) container.innerHTML = '<div class="error-card">Erro interno do servidor. Tente novamente mais tarde.</div>';
  else container.innerHTML = '<div class="error-card">Ocorreu um erro ao processar sua solicitação.</div>';
  container.classList.remove('hidden');
}