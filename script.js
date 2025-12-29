// 🔧 NUOVA URL APPS SCRIPT
window.loadData = async function() {
  try {
    console.log('🔄 Caricando nuova API...');
    const res = await fetch('https://script.google.com/macros/s/AKfycbzFG1tF3gnuZYL7Ta0em7Qu4KSS4ISB1B8m9i_YRRACfo9wSfN1oFuFzmWdZ5TGThY5/exec');
    const response = await res.json();
    console.log('📊 API NUOVA:', response.tutteAzioni?.length || 0);
    
    const azioni = response.tutteAzioni || [];
    console.log('🔍 Prima azione:', azioni[0]);
    
    // MAPPATURA ESATTA oggetti Apps Script
    const mappate = azioni.map(row => ({
      nome: row.nome || '',
      desc: row.desc || '',
      tag: row.tag || 'altro',
      danno: row.danno || ''
    })).filter(a => a.nome);
    
    console.log('✅ Mappate:', mappate);
    
    // POPOLA UL del tuo HTML
    const ulMapping = {
      '1azione': '1 azione',
      '1azionbonus': '1 azione bonus',
      'reazione': 'reazione', 
      'rituale': 'rituale',
      'altro': 'altro'
    };
    
    Object.entries(ulMapping).forEach(([ulId, tagName]) => {
      const ul = document.getElementById(ulId);
      if (ul) {
        const filtered = mappate.filter(a => a.tag === tagName || a.tag.includes(tagName));
        console.log(`UL ${ulId} (${tagName}): ${filtered.length}`);
        
        ul.innerHTML = filtered.length ? 
          filtered.map(a => 
            `<li><strong>${a.nome}</strong>: ${a.desc}
              ${a.danno ? `<span class="danno">(${a.danno})</span>` : ''}
              ${a.note ? `<br><small>${a.note}</small>` : ''}</li>`
          ).join('') : '<li>Nessuna azione</li>';
      }
    });
    
  } catch(e) {
    console.error('❌', e);
    alert('Errore: ' + e.message);
  }
};

window.showTab = function(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tabs button').forEach(el => el.classList.remove('active'));
  document.getElementById(tab)?.classList.add('active');
  document.getElementById(tab + '-tab')?.classList.add('active');
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 SCHEDA PRONTA!');
  setTimeout(window.loadData, 1500);
});
