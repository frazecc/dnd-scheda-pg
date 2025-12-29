const API_URL = 'https://script.google.com/macros/s/AKfycbw_e4TzWKRl-q5lCV60uudyc1bUolXo5Fu5OpINK3SIF44ebfbBHAMDyyWrc5qyqCEh2g/exec';

let pgData = {};

async function loadData() {
  try {
    const res = await fetch(API_URL);
    const {tutteAzioni} = await res.json();
    
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
    populateActions();
  } catch(e) { 
    alert('Errore API: ' + e); 
    console.error(e);
  }
}

function populateActions() {
  ['1 azione','1 azione bonus','reazione','rituale','altro'].forEach(tipo => {
    const cleanId = tipo.replace(/ /g, '');
    const ul = document.getElementById(cleanId);
    const azioni = pgData[tipo] || [];
    ul.innerHTML = azioni.length ? 
      azioni.map(a => 
        `<li><strong>${a.nome}</strong>: ${a.desc} 
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

// Auto-load all'avvio
loadData();

document.getElementById('nomePG').addEventListener('input', e => 
  localStorage.setItem('nomePG', e.target.value)
);
