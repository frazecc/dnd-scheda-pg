const API_URL = 'https://script.google.com/macros/s/AKfycbyFHJV0XRslgNnBtwbclGZtqS_e5HRvPnVovhSmegectgnMIFrM48N5mzqKGltM0KkViA/exec';

window.loadData = async function() {
  try {
    const res = await fetch(API_URL);
    const response = await res.json();
    const mappate = response.tutteAzioni || [];
    
    console.log('ALL DATA completa:', mappate);
    
    // RIEMPI TUTTI GLI INPUT DA OGNI RIGA
    mappate.forEach(row => {
      Object.keys(row).forEach(key => {
        const el = document.getElementById(key);
        if (el && row[key]) {
          el.value = row[key];
          console.log(`Riempito ${key}: ${row[key]}`);
        }
      });
    });
    
    // PULISCI LISTE
    ['1azione','1azionbonus','reazione','rituale','altro'].forEach(id => {
      const ul = document.getElementById(id);
      if (ul) ul.innerHTML = '';
    });
    
    // CLASSIFICA E MOSTRA AZIONI
    mappate.forEach(a => {
      let ulId = 'altro';
      if (a.tag?.includes('azione') && !a.tag.includes('bonus')) ulId = '1azione';
      else if (a.tag?.includes('bonus')) ulId = '1azionbonus';
      else if (a.tag?.includes('reazione')) ulId = 'reazione';
      else if (a.tag?.includes('rituale')) ulId = 'rituale';
      
      const ul = document.getElementById(ulId);
      if (ul) {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${a.nome || a.Oggetto || a.Nome}</strong> 
          ${a.livello ? `L${a.livello}` : ''}
          <br><small>${a.desc || a['Descrizione dell\'azione'] || a['effetto sintetico']}</small>
          ${a['Casting time'] || a['casting time'] ? `<br>⏱️ ${a['Casting time'] || a['casting time']}` : ''}
          ${a.range ? `<br>📏 ${a.range}` : ''}
          ${a.durata ? `<br>⏳ ${a.durata}` : ''}
          ${a.tpc || a['tcp o ts'] ? `<br>🎯 ${a.tpc || a['tcp o ts']}` : ''}
          ${a.danno ? `<br>⚔️ ${a.danno} (${a['tipo di danno'] || ''})` : ''}
          ${a.note ? `<br>📝 ${a.note}` : ''}
        `;
        ul.appendChild(li);
      }
    });
    
    window.showTab('actions');
    
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
