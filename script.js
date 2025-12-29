window.loadData = async function() {
  try {
    console.log('🔄 Caricando...');
    const res = await fetch('https://script.google.com/macros/s/AKfycbzFG1tF3gnuZYL7Ta0em7Qu4KSS4ISB1B8m9i_YRRACfo9wSfN1oFuFzmWdZ5TGThY5/exec');
    const response = await res.json();
    const azioni = response.tutteAzioni || [];
    const mappate = azioni.map(row => ({
      nome: row.nome || '',
      desc: row.desc || '',
      tag: row.tag || 'altro',
      danno: row.danno || '',
      note: row.note || ''
    })).filter(a => a.nome);
    
    console.log('✅ Mappate:', mappate.map(a => `${a.nome}(${a.tag})`));
    
    window.showTab('actions');
    
    // 🔧 MAPPING UNIVERSALE
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
        console.log(`📋 ${tagSheet} → UL ${ulId}: ${filtered.length}`);
        ul.innerHTML = filtered.length ? 
          filtered.map(a => `<li><strong>${a.nome}</strong>: ${a.desc}${a.danno ? ` (<span class="danno">${a.danno}</span>)` : ''}</li>`).join('') :
          '<li>Nessuna</li>';
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
