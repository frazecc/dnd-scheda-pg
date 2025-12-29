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
    
    // 🔧 FORZA VISIBILITÀ TAB AZIONI
    window.showTab('actions');
    
    // MAPPING: "azione" → UL "1azione"
    const tagMapping = {
      'azione': '1azione',
      'azione bonus': '1azionbonus',
      'reazione': 'reazione',
      'rituale': 'rituale',
      'altro': 'altro'
    };
    
    Object.entries(tagMapping).forEach(([tagSheet, ulId]) => {
      const ul = document.getElementById(ulId);
      console.log(`🔍 Cerco UL #${ulId}:`, ul ? '✅ TROVATO' : '❌ MANCANTE');
      
      if (ul) {
        const filtered = mappate.filter(a => a.tag === tagSheet);
        console.log(`📋 ${tagSheet} → ${filtered.length} azioni:`, filtered[0]?.nome);
        
        ul.innerHTML = filtered.length ? 
          filtered.map(a => 
            `<li><strong>${a.nome}</strong>: ${a.desc}
              ${a.danno ? `<span class="danno">(${a.danno})</span>` : ''}
              ${a.note ? `<br><small>${a.note}</small>` : ''}</li>`
          ).join('') : '<li>Nessuna azione</li>';
        
        console.log(`✅ ${ulId} popolato con ${filtered.length}`);
      }
    });
    
  } catch(e) {
    console.error('❌', e);
  }
};

window.showTab = function(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tabs button').forEach(el => el.classList.remove('active'));
  const targetTab = document.getElementById(tab);
  if (targetTab) targetTab.classList.add('active');
  const targetBtn = document.getElementById(tab + '-tab');
  if (targetBtn) targetBtn.classList.add('active');
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 PRONTO!');
  setTimeout(window.loadData, 1500);
});
