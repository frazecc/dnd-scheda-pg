const API_URL = 'https://script.google.com/macros/s/AKfycbw_e4TzWKRl-q5lCV60uudyc1bUolXo5Fu5OpINK3SIF44ebfbBHAMDyyWrc5qyqCEh2g/exec';

let pgData = {};

// 🔄 AGGIORNA DATI (chiamato dal bottone)
async function loadData() {
  try {
    console.log('🔄 Caricando...');
    const res = await fetch(API_URL);
    const data = await res.json();
    console.log('📊 Dati:', data.tutteAzioni?.length || data.categorie?.length);
    
    // Compatibile con vecchio e nuovo formato
    if (data.tutteAzioni) {
      pgData = categorizeOld(data.tutteAzioni);
    } else if (data.categorie) {
      pgData = data.categorie.reduce((acc, cat) => {
        acc[cat.nome] = cat.azioni;
        return acc;
      }, {});
    }
    
    populateActions();
  } catch(e) {
    console.error('❌ Errore:', e);
    alert('Errore: ' + e.message);
  }
}

// 🗂️ CATEGORIZZA VECCHIO FORMATO
function categorizeOld(tutteAzioni) {
  const pgData = {'azione':[], 'azione bonus':[], 'reazione':[], 'rituale':[], 'altro':[]};
  tutteAzioni.forEach(azione => {
    if (azione.nome && azione.tag) {
      const tag = pgData[azione.tag] ? azione.tag : 'altro';
      pgData[tag].push(azione);
    }
  });
  return pgData;
}

// 🎨 POPOLA AZIONI
function populateActions() {
  const actionsDiv = document.getElementById('actions');
  if (!actionsDiv) return;
  
  actionsDiv.innerHTML = '';
  
  Object.entries(pgData).forEach(([tag, azioni]) => {
    const sezione = document.createElement('div');
    sezione.innerHTML = `
      <h2>${getEmoji(tag)} ${tag.toUpperCase()}</h2>
      <ul id="${tag.replace(/ /g,'')}">
        ${azioni.length ? azioni.map(a => 
          `<li><strong>${a.nome}</strong>: ${a.desc || ''} 
            ${a.danno ? `<span class="danno">(${a.danno})</span>` : ''} 
            ${a.note ? `<br><small>${a.note}</small>` : ''}
          </li>`
        ).join('') : '<li>Nessuna azione</li>'}
      </ul>
    `;
    actionsDiv.appendChild(sezione);
  });
}

function getEmoji(tag) {
  const emojis = {
    'azione': '⚔️', 'azione bonus': '⚡', 'reazione': '🛡️', 
    'rituale': '📜', 'altro': '❓'
  };
  return emojis[tag] || '📋';
}

// 👆 CAMBIA TAB
function showTab(tab) {
  console.log('Tab:', tab);
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tabs button').forEach(el => el.classList.remove('active'));
  document.getElementById(tab)?.classList.add('active');
  document.getElementById(tab + '-tab')?.classList.add('active');
}

// 🚀 INIZIO
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 JS CARICATO!');
  setTimeout(loadData, 1000);
});
