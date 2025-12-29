const API_URL = 'https://script.google.com/macros/s/AKfycbw_e4TzWKRl-q5lCV60uudyc1bUolXo5Fu5OpINK3SIF44ebfbBHAMDyyWrc5qyqCEh2g/exec';

async function loadData() {
  try {
    console.log('🔄 Caricando categorie dinamiche...');
    const res = await fetch(API_URL);
    const data = await res.json();
    
    // 🎨 RICREA SEZIONI dinamicamente
    const actionsDiv = document.getElementById('actions');
    actionsDiv.innerHTML = ''; // Pulisci
    
    data.categorie.forEach(cat => {
      const sezione = document.createElement('div');
      sezione.className = 'sezione-azioni';
      sezione.innerHTML = `
        <h2>${cat.emoji} ${cat.nome.toUpperCase()}</h2>
        <ul id="${cat.nome.replace(/ /g,'')}">${cat.azioni.length ? 
          cat.azioni.map(a => 
            `<li><strong>${a.nome}</strong>: ${a.desc} 
              ${a.danno ? `<span class="danno">(${a.danno})</span>` : ''} 
              ${a.note ? `<br><small>${a.note}</small>` : ''}
            </li>`
          ).join('') : '<li>Nessuna azione</li>'
        }</ul>
      `;
      actionsDiv.appendChild(sezione);
    });
    
  } catch(e) {
    console.error('❌ Errore:', e);
  }
}
