const API_URL = 'https://script.google.com/macros/s/AKfycbw_e4TzWKRl-q5lCV60uudyc1bUolXo5Fu5OpINK3SIF44ebfbBHAMDyyWrc5qyqCEh2g/exec';

let pgData = {};

async function loadData() {
  try {
    console.log('Caricamento dati...');
    const res = await fetch(API_URL);
    const {tutteAzioni} = await res.json();
    console.log('Dati ricevuti:', tutteAzioni);
    
    pgData = {
      '1 azione': [], '1 azione bonus': [], 'reazione': [],
      'rituale': [], 'altro': []
    };
    
    tutteAzioni.forEach(azione => {
      if (azione.nome && azione.tag) {
        if (pgData[azione.tag]) pgData[azione.tag].push(azione);
        else pgData['altro'].push(azione);
      }
    });
    
    console.log('pgData categorizzata:', pgData);
    populateActions();
  } catch(e) { 
    console.error('Errore API:', e);
    alert('Errore caricamento: ' + e.message); 
  }
}

function populateActions() {
  const tipi = ['1 azione','1 azione bonus','reazione','rituale','altro'];
  
  tipi.forEach(tipo => {
    const cleanId = tipo.replace(/ /g, '');
    const ul = document.getElementById(cleanId);
    
    // VERIFICA che l'elemento esista
    if (!ul) {
      console.error('UL mancante:', cleanId);
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

// ✅ ASPETTA DOM PRIMA DI ESEGUIRE
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM caricato');
  
  // Carica nomePG salvato
  const nomePG = document.getElementById('nomePG');
  if (nomePG) {
    nomePG.value = localStorage.getItem('nomePG') || '';
    nomePG.addEventListener('input', e => 
      localStorage.setItem('nomePG', e.target.value)
    );
  }
  
  // Auto-load dopo 500ms (tempo per render HTML)
  setTimeout(loadData, 500);
});
