// Crea tabella 100x10 automaticamente
document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('dnd-table');
    
    // Crea intestazioni (Colonna 1, Colonna 2, ... Colonna 10)
    const headerRow = table.insertRow();
    for(let i = 1; i <= 10; i++) {
        const th = document.createElement('th');
        th.textContent = `Col ${i}`;
        th.style.background = '#667eea';
        th.style.color = 'white';
        th.style.fontWeight = 'bold';
        headerRow.appendChild(th);
    }
    
    // Crea 100 RIGHE x 10 celle
    for(let row = 0; row < 100; row++) {
        const tr = table.insertRow();
        for(let col = 0; col < 10; col++) {
            const td = tr.insertCell();
            td.contentEditable = true;
            td.dataset.row = row;
            td.dataset.col = col;
            
            // Salva automaticamente ogni modifica
            td.addEventListener('input', function() {
                salvaDati();
            });
        }
    }
    
    // Carica dati salvati
    caricaDati();
});

// Il resto rimane uguale...
function salvaDati() {
    const table = document.getElementById('dnd-table');
    const dati = {};
    
    for(let r = 1; r < table.rows.length; r++) { // Salta header
        for(let c = 0; c < table.rows[r].cells.length; c++) {
            const cella = table.rows[r].cells[c];
            const chiave = `r${r-1}_c${c}`;
            dati[chiave] = cella.textContent || '';
        }
    }
    
    localStorage.setItem('dndTabella', JSON.stringify(dati));
}

function caricaDati() {
    const datiSalvati = localStorage.getItem('dndTabella');
    if(!datiSalvati) return;
    
    const dati = JSON.parse(datiSalvati);
    const table = document.getElementById('dnd-table');
    
    for(let r = 1; r < table.rows.length; r++) {
        for(let c = 0; c < table.rows[r].cells.length; c++) {
            const chiave = `r${r-1}_c${c}`;
            if(dati[chiave]) {
                table.rows[r].cells[c].textContent = dati[chiave];
            }
        }
    }
}

function esportaCSV() {
    let csv = '';
    const table = document.getElementById('dnd-table');
    
    for(let r = 0; r < table.rows.length; r++) {
        let riga = [];
        for(let c = 0; c < table.rows[r].cells.length; c++) {
            riga.push(`"${table.rows[r].cells[c].textContent || ''}"`);
        }
        csv += riga.join(';') + '\n';
    }
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scheda-pg-100x10.csv';
    a.click();
}
