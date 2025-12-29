// 👇 SOSTITUISCI CON LA TUA NUOVA URL APPS SCRIPT
const API_URL = 'INCOLLA QUI LA NUOVA URL DOPO REDEPLOY';

window.loadData = async function() {
  try {
    console.log('🔄 Caricando "all per sito"...');
    const res = await fetch(API_URL);
    const response = await res.json();
    const mappate = response.tutteAzioni || [];
    
    console.log('✅ Mappate:', mappate.map(a => `${a.nome}(${a.tag})`));
    window.showTab('actions');
    
    // MAPPING: casting time → UL
    const tagMapping = {
      'azione': '1azione', '1 azione': '1azione',
      'azione bonus': '1azionbonus', '1 azione bonus': '1azionbonus',
      'reazione': 'reazione',
      'rituale': 'rituale',
      'altro': 'altro'
    };
    
    Object.entries(tagMapping).forEach(([tagSheet, ulId]) => {
      const ul = document.getElementById(ulId);
      if (ul) {
        const filtered = mappate.filter(a => a.tag === tagSheet);
        ul.innerHTML = filtered.length ? 
          filtered.map(a => 
            `<li><strong>${a.nome}</strong> 
              ${a.livello ? `<small>L${a.livello}</small>` : ''}
              <br>${a.desc}
              ${a.danno ? `<span class="danno">(${a.danno} ${a.tipoDanno})</span>` : ''}
              ${a.rituale ? '<span class="rituale">📜 RITUALE</span>' : ''}
              ${a.note ? `<br><small>${a.note}</small>` : ''}
            </li>`
          ).join('') : '<li>Nessuna</li>';
        console.log(`📋 ${tagSheet} → ${ulId}: ${filtered.length}`);
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
  console.log('🚀 PRONTO!');
  setTimeout(window.loadData, 1500);
});
