window.loadData = async function() {
  try {
    console.log('🔄 Caricando...');
    const res = await fetch('https://script.google.com/macros/s/AKfycbzFG1tF3gnuZYL7Ta0em7Qu4KSS4ISB1B8m9i_YRRACfo9wSfN1oFuFzmWdZ5TGThY5/exec');
    const response = await res.json();
    console.log('📊 API:', response.tutteAzioni?.length || 0);
    
    const azioni = response.tutteAzioni || [];
    const mappate = azioni.map(row => ({
      nome: row.nome || '',
      desc: row.desc || '',
      tag: row.tag || 'altro',
      danno: row.danno || '',
      note: row.note || ''
    })).filter(a => a.nome);
    
    console.log('✅ Mappate:', mappate);
    
    // 🎯 MAPPING INTELLIGENTE: "azione" → "1azione"
    const tagMapping = {
      'azione': '1azione',
      'azione bonus': '1azionbonus',
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
  console.log('🚀 PRONTO!');
  setTimeout(window.loadData, 1500);
});
