const API_URL = 'https://script.google.com/macros/s/AKfycbyFHJV0XRslgNnBtwbclGZtqS_e5HRvPnVovhSmegectgnMIFrM48N5mzqKGltM0KkViA/exec';

window.loadData = async function() {
  try {
    const res = await fetch(API_URL);
    const response = await res.json();
    const mappate = response.tutteAzioni || [];
    
    console.log('ALL DATA:', mappate.map(a => ({nome: a.nome, tag: a.tag})));
    
    window.showTab('actions');
    
    // PULISCI TUTTI
    ['1azione','1azionbonus','reazione','rituale','altro'].forEach(id => {
      const ul = document.getElementById(id);
      if (ul) ul.innerHTML = '';
    });
    
    // AGGREGA TUTTE LE AZIONI
    mappate.forEach(a => {
      let ulId = 'altro';
      if (a.tag.includes('azione') && !a.tag.includes('bonus')) ulId = '1azione';
      else if (a.tag.includes('bonus')) ulId = '1azionbonus';
      else if (a.tag.includes('reazione')) ulId = 'reazione';
      else if (a.tag.includes('rituale')) ulId = 'rituale';
      
      const ul = document.getElementById(ulId);
      if (ul) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${a.nome}</strong> ${a.livello ? `L${a.livello}` : ''}<br>${a.desc} ${a.danno ? `(${a.danno})` : ''}`;
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
