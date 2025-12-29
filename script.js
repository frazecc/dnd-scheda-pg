// 🔧 FUNZIONI GLOBALI per onclick
window.loadData = async function() {
  try {
    console.log('🔄 Aggiornamento Sheet...');
    const res = await fetch('https://script.google.com/macros/s/AKfycbw_e4TzWKRl-q5lCV60uudyc1bUolXo5Fu5OpINK3SIF44ebfbBHAMDyyWrc5qyqCEh2g/exec');
    const data = await res.json();
    console.log('📊 Dati:', data);
    
    // Popola UL esistenti
    const uls = {
      '1azione': '1 azione',
      '1azionbonus': '1 azione bonus',
      'reazione': 'reazione',
      'rituale': 'rituale',
      'altro': 'altro'
    };
    
    Object.entries(uls).forEach(([id, tag]) => {
      const ul = document.getElementById(id);
      if (ul) {
        // Cerca azioni con questo tag nei dati
        const azioni = [];
        if (data.tutteAzioni) {
          data.tutteAzioni.forEach(row => {
            if (row.tag === tag) azioni.push(row);
          });
        }
        ul.innerHTML = azioni.length ? 
          azioni.map(a => `<li><strong>${a.nome}</strong>: ${a.desc}${a.danno ? ` (${a.danno})` : ''}</li>`).join('') :
          '<li>Nessuna</li>';
      }
    });
    console.log('✅ Popolato!');
  } catch(e) {
    console.error('❌', e);
    alert('Errore: ' + e.message);
  }
};

window.showTab = function(tab) {
  console.log('👆 Tab:', tab);
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tabs button').forEach(el => el.classList.remove('active'));
  const targetTab = document.getElementById(tab);
  if (targetTab) targetTab.classList.add('active');
  const targetBtn = document.getElementById(tab + '-tab');
  if (targetBtn) targetBtn.classList.add('active');
};

// 🚀 AUTO-START
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Scheda attiva!');
  // Testa subito
  setTimeout(window.loadData, 1500);
});
