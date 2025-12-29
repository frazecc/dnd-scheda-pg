const API_URL = 'https://script.google.com/macros/s/AKfycbw_e4TzWKRl-q5lCV60uudyc1bUolXo5Fu5OpINK3SIF44ebfbBHAMDyyWrc5qyqCEh2g/exec';

let pgData = {};

async function loadData() {
  try {
    console.log('🔄 Caricamento...');
    const res = await fetch(API_URL);
    const data = await res.json();
    console.log('📊 Dati API:', data);
    
    pgData = {
      '1 azione': [], '1 azione bonus': [], 'reazione': [],
      'rituale': [], 'altro': []
    };
    
    // ✅ DEBUG: mostra tutti i dati grezzi
    data.tutteAzioni.forEach((row, i) => {
      console.log(`Riga ${i}:`, row);
      if (row.nome && row.tag) {
        if (pgData[row.tag]) pgData[row.tag].push(row);
        else pgData['altro'].push(row);
      }
    });
    
    console.log('✅ pgData:', pgData);
    populateActions();
  } catch(e) { 
    console.error('❌ Errore:', e);
    alert('Errore: ' + e.message); 
  }
}

function populateActions() {
  console.log('🎨 Popolo azioni...');
  
  // ✅ VERIFICA OGNI UL esiste
  const mapping = {
    '1azione': '1 azione',
    '1azionbonus': '1 azione bonus',
    'reazione': 'reazione',
    'rituale': 'rituale',
    'altro': 'altro'
  };
  
  Object.entries(mapping).forEach(([id, tipo]) => {
    const ul = document.getElementById(id);
    console.log(`UL ${id}:`, ul ? '✅ OK' : '❌ MANCANTE');
    
    if (!ul) {
      console.error(`❌ UL #${id} non trovato!`);
      return;
    }
    
    const azioni = pgData[tipo] || [];
    ul.innerHTML = azioni.length ? 
      azioni.map(a => 
        `<li><strong>${a.nome}</strong>: ${a.desc || ''} 
          ${a.danno ? `<span class="danno">(${a.danno})</span>` : ''} 
          ${a.note ? `<br><small>${a.note}</small>` : ''}
        </li>`
      ).join('') : '<li>Nessuna azione</li>';
  });
}

function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tabs button').forEach(el => el.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
  document.getElementById(tab + '-tab')?.classList.add('active');
}

// ✅ DOM COMPLETAMENTE CARICO
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOM pronto');
  
  const nomePG = document.getElementById('nomePG');
  if (nomePG) {
    nomePG.value = localStorage.getItem('nomePG') || '';
    nomePG.addEventListener('input', e => localStorage.setItem('nomePG', e.target.value));
  }
  
  // Carica dopo 1 secondo (tempo per tutto)
  setTimeout(() => {
    console.log('⏰ Auto-load...');
    loadData();
  }, 1000);
});
