const API_URL = 'https://script.google.com/macros/s/AKfycbyFHJV0XRslgNnBtwbclGZtqS_e5HRvPnVovhSmegectgnMIFrM48N5mzqKGltM0KkViA/exec';

window.loadData = async function() {
  try {
    const res = await fetch(API_URL);
    const response = await res.json();
    const mappate = response.tutteAzioni || [];
    
    console.log('ALL DATA:', mappate);
    
    // RIEMPI INPUT HEADER DALL'ULTIMA RIGA
    if (mappate.length > 0) {
      const ultimaRiga = mappate[mappate.length - 1];
      ['razza','nomePG','classe','livello','giocatore','background','allineamento'].forEach(id => {
        if (ultimaRiga[id]) document.getElementById(id).value = ultimaRiga[id];
      });
    }
    
    window.showTab('actions');
    
    // PULISCI TUTTI
    ['1azione','1azionbonus','reazione','rituale','altro'].forEach(id => {
      const ul = document.getElementById(id);
      if (ul) ul.innerHTML = '';
    });
    
    // AGGREGA AZIONI E SPELL CON DETTAGLI COMPLETI
    mappate.forEach(a => {
      let ulId = 'altro';
      if (a.tag && a.tag.includes('azione') && !a.tag.includes('bonus')) ulId = '1azione';
      else if (a.tag && a.tag.includes('bonus')) ulId = '1azionbonus';
      else if (a.tag && a.tag.includes('reazione')) ulId = 'reazione';
      else if (a.tag && a.tag.includes('rituale')) ulId = 'rituale';
      
      const ul = document.getElementById(ulId);
      if (ul) {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${a.Oggetto || a.Nome || a.nome}</strong> 
          ${a.livello ? `L${a.livello}` : ''}
          ${a.scuola ? `<small>(${a.scuola})</small>` : ''}
          <br><small>${a['Descrizione dell\'azione'] || a['effetto sintetico'] || a.desc || ''}</small>
          ${a['Casting time'] || a['casting time'] ? `<br>⏱️ ${a['Casting time'] || a['casting time']}` : ''}
          ${a.range ? `<br>📏 ${a.range}` : ''}
          ${a.durata ? `<br>⏳ ${a.durata}` : ''}
          ${a['tcp o ts'] || a.tpc ? `<br>🎯 ${a['tcp o ts'] || a.tpc}` : ''}
          ${a.componenti ? `<br>✨ ${a.componenti}` : ''}
          ${a.concentrazione ? `<br>🧠 Concentrazione` : ''}
          ${a.rituale ? `<br>📜 Rituale` : ''}
          ${a.danno ? `<br>⚔️ ${a.danno} (${a['tipo di danno'] || ''})` : ''}
          ${a['a lv più alti'] || a['effetto esteso'] ? `<br>📈 ${a['a lv più alti'] || a['effetto esteso']}` : ''}
          ${a.note ? `<br>📝 ${a.note}` : ''}
        `;
        ul.appendChild(li);
      }
    });
    
  } catch(e) {
    console.error(e);
  }
};

window.showTab = function(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tabs button').forEach(el => el.classList.remove('active'));
  document.getElementById(tab)?.classList.add('active');
  document.getElementById(tab + '-tab')?.classList.add('active');
};

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(window.loadData, 1000);
});
