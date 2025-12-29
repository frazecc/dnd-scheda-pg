const API_URL = 'https://script.google.com/macros/s/AKfycbyFHJV0XRslgNnBtwbclGZtqS_e5HRvPnVovhSmegectgnMIFrM48N5mzqKGltM0KkViA/exec';

window.loadData = async function() {
  try {
    console.log('🔄 Caricando "all per sito"...');
    const res = await fetch(API_URL);
    const response = await res.json();
    const mappate = response.tutteAzioni || [];
    
    console.log('✅ Mappate:', mappate.map(a => `${a.nome}(${a.tag})`));
    window.showTab('actions');
    
    // 🔧 PULISCI TUTTI UL PRIMA
    ['1azione','1azionbonus','reazione','rituale','altro'].forEach(id => {
      const ul = document.getElementById(id);
      if (ul) ul.innerHTML = '';
    });
    
    // 🔧 AGGREGA per UL (NON sovrascrive)
    const ulContent = {
      '1azione': [],
      '1azionbonus': [],
      'reazione': [],
      'rituale': [],
      'altro': []
    };
    
    mappate.forEach(a => {
      let ulId = 'altro';
      if (a.tag === 'azione' || a.tag === '1 azione') ulId = '1azione';
      else if (a.tag === 'azione bonus' || a.tag === '1 azione bonus') ulId = '1azionbonus';
      else if (a.tag === 'reazione') ulId = 'reazione';
      else if (a.tag === 'rituale') ulId = 'rituale';
      
      ulContent[ulId].push(a);
    });
    
    // 🔧 POPOLA TUTTI INSIEME
    Object.entries(ulContent).forEach(([ulId, azioni]) => {
      const ul = document.getElementById(ulId);
      if (ul) {
        ul.innerHTML = azioni.length ? 
          azioni.map(a => 
            `<li><strong>${a.nome}</strong> 
              ${a.livello ? `<small>L${a.livello}</small>` : ''}
              <br>${a.desc}
              ${a.danno ? `<span class="danno">(${a.danno} ${a.tipoDanno||''})</span>` : ''}
              ${a.rituale ? '<span class="rituale">📜 RITUALE</span>' : ''}
              ${a.note ? `<br><small>${a.note}</small>` : ''}
            </li>`
          ).join('') : '<li>Nessuna</li>';
        console.log(`📋 ${ulId}: ${azioni.length}`);
      }
    });
    
  } catch(e) {
    console.error('❌', e);
  }
};

window.showTab = function(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tabs button').forEach(el => el.classList.remove('active'));
  document.getElementById(tab)?.classList.add('active');
  document.getElementById(tab + '-tab')?.classList.add('active');
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 "all per sito" PRONTO!');
  setTimeout(window.loadData, 1500);
});
