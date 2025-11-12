export function initRestoreState(){
  const key = 'cine_state_v4';
  const saved = localStorage.getItem(key);
  
  if (!saved) return;
  
  try {
    const s = JSON.parse(saved);
    
    if (s.genre) document.getElementById('genre').value = s.genre;
    if (s.content) document.getElementById('content-type').value = s.content;
    if (s.sortBy) document.getElementById('sort').value = s.sortBy;
    
    window.__CINE_RESTORE = s;
    
  } catch(e){ 
    console.warn('restore failed', e); 
  }
}

export function saveState(state){
  const key = 'cine_state_v4';
  
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch(e){ 
    console.warn('save failed', e); 
  }
}
