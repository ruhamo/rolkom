document.addEventListener('DOMContentLoaded', function() {
    // Tab funkcionalnost
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Ukloni active klasu sa svih tabova
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Dodaj active klasu na odabrani tab
            btn.classList.add('active');
            document.getElementById(`${tabId}-kalkulator`).classList.add('active');
        });
    });
    
    // CIJENE PO M2 (podesite ove vrijednosti prema vašim stvarnim cijenama)
    const CIJENE = {
        roletne: {
            rucna: 120,        // KM po m2
            elektricna: 180,   // KM po m2
            smart: 220,        // KM po m2
            materijal: {
                aluminij: 30,  // dodatak po m2
                plastika: 0,
                kombinovana: 15
            },
            boja: {
                ral: 50        // fiksni dodatak
            }
        },
        komarnici: {
            harmo: 80,         // KM po m2
            fiksni: 100,       // KM po m2
            utapajuci: 150,    // KM po m2
            roletni: 200,      // KM po m2
            boja: {
                ral: 30       // fiksni dodatak
            },
            vrata: 100         // fiksni dodatak
        }
    };
    
    // Niz za čuvanje stavki ponude
    let ponudaStavke = [];
    
    // Funkcija za dodavanje stavke u ponudu
    function dodajStavkuUListu(stavka) {
        ponudaStavke.push(stavka);
        osvjeziListuStavki();
    }
    
    // Funkcija za brisanje stavke iz ponude
    function obrisiStavku(index) {
        ponudaStavke.splice(index, 1);
        osvjeziListuStavki();
    }
    
    // Funkcija za osvježavanje prikaza stavki
    function osvjeziListuStavki() {
        const ponudaItems = document.getElementById('ponuda-items');
        ponudaItems.innerHTML = '';
        
        if(ponudaStavke.length === 0) {
            ponudaItems.innerHTML = '<p>Trenutno nema stavki u ponudi.</p>';
            return;
        }
        
        ponudaStavke.forEach((stavka, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'ponuda-item';
            itemDiv.innerHTML = `
                <span>${stavka.naziv} (${stavka.dimenzije}) - ${stavka.cijena} KM</span>
                <button onclick="obrisiStavku(${index})">X</button>
            `;
            ponudaItems.appendChild(itemDiv);
        });
    }
    
    // Funkcija za štampu ponude
    function printPonudu() {
        if(ponudaStavke.length === 0) {
            alert('Nema stavki za štampu!');
            return;
        }

        // Kreiraj HTML za print
        let printHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>ROLKOM Ponuda</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #2c3e50; text-align: center; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background-color: #3498db; color: white; }
                    .total { font-weight: bold; font-size: 1.1em; text-align: right; margin-top: 20px; }
                    .ponuda-info { margin-bottom: 30px; }
                    .footer { margin-top: 50px; font-size: 0.9em; text-align: center; }
                    @page { size: A4; margin: 10mm; }
                </style>
            </head>
            <body>
                <div class="ponuda-header">
                    <h1>Ponuda ROLKOM</h1>
                    <div class="ponuda-info">
                        <p><strong>Datum:</strong> ${new Date().toLocaleDateString()}</p>
                        <p><strong>Adresa:</strong> Krndija bb, Tešanj 74260</p>
                        <p><strong>Kontakt:</strong> +387 61 988 699 | info@rolkom.ba</p>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>RB</th>
                            <th>Proizvod</th>
                            <th>Opis</th>
                            <th>Dimenzije</th>
                            <th>Cijena (KM)</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        let ukupno = 0;
        
        ponudaStavke.forEach((stavka, index) => {
            printHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${stavka.tip}</td>
                    <td>${stavka.naziv}<br>${stavka.detalji}</td>
                    <td>${stavka.dimenzije}</td>
                    <td>${stavka.cijena}</td>
                </tr>
            `;
            ukupno += parseFloat(stavka.cijena);
        });
        
        printHTML += `
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4" style="text-align: right;"><strong>Ukupno:</strong></td>
                            <td><strong>${ukupno.toFixed(2)} KM</strong></td>
                        </tr>
                    </tfoot>
                </table>
                <div class="footer">
                    <p>Hvala Vam što ste odabrali ROLKOM!</p>
                    <p>Ponuda vrijedi 30 dana od datuma izdavanja</p>
                </div>
            </body>
            </html>
        `;
        
        // Otvori novi prozor za print
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(printHTML);
        printWindow.document.close();
        
        // Čekaj da se sadržaj učita prije printa
        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.print();
                // Ne zatvaraj prozor automatski da korisnik vidi šta se štampa
            }, 200);
        };
    }
    
    // Funkcija za generisanje ponude
    function generisiPonudu() {
        if(ponudaStavke.length === 0) {
            alert('Nema stavki za generisanje ponude!');
            return;
        }
        
        const ponudaPreview = document.getElementById('ponuda-preview');
        let html = `
            <h4>Ponuda ROLKOM</h4>
            <p><strong>Datum:</strong> ${new Date().toLocaleDateString()}</p>
            <table>
                <thead>
                    <tr>
                        <th>RB</th>
                        <th>Proizvod</th>
                        <th>Opis</th>
                        <th>Dimenzije</th>
                        <th>Cijena (KM)</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        let ukupno = 0;
        
        ponudaStavke.forEach((stavka, index) => {
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${stavka.tip}</td>
                    <td>${stavka.naziv}<br>${stavka.detalji}</td>
                    <td>${stavka.dimenzije}</td>
                    <td>${stavka.cijena}</td>
                </tr>
            `;
            ukupno += parseFloat(stavka.cijena);
        });
        
        html += `
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" style="text-align: right;"><strong>Ukupno:</strong></td>
                        <td><strong>${ukupno.toFixed(2)} KM</strong></td>
                    </tr>
                </tfoot>
            </table>
            <div class="ponuda-napomena">
                <p><strong>Napomena:</strong> Ovo je preliminarna ponuda. Konačna cijena može varirati u zavisnosti od uslova montaže.</p>
            </div>
            <button onclick="printPonudu()" class="btn print-btn">Štampaj ponudu</button>
            <button onclick="snimiPonudu()" class="btn">Snimi ponudu</button>
        `;
        
        ponudaPreview.innerHTML = html;
        ponudaPreview.style.display = 'block';
    }
    
    // Funkcija za snimanje ponude kao PDF
    function snimiPonudu() {
        // Ovdje možete dodati logiku za generisanje PDF-a
        alert('Ponuda je spremljena!');
        // U stvarnoj implementaciji, ovdje biste koristili neku PDF biblioteku
    }
    
    // Kalkulator za roletne
    const roletneForm = document.getElementById('roletne-form');
    roletneForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Dohvati vrijednosti
        const vrsta = document.getElementById('roletna-vrsta').value;
        const materijal = document.getElementById('roletna-materijal').value;
        const sirina = parseFloat(document.getElementById('roletna-sirina').value) || 0;
        const visina = parseFloat(document.getElementById('roletna-visina').value) || 0;
        const boja = document.getElementById('roletna-boja').value;
        
        // Validacija
        if(!vrsta || !materijal || sirina <= 0 || visina <= 0) {
            alert('Molimo popunite sve potrebne podatke!');
            return;
        }
        
        // Izračun površine (u m2)
        const povrsina = (sirina * visina) / 10000;
        // Minimalna površina 1m2
        const efektivnaPovrsina = Math.max(povrsina, 1);
        
        // Osnovna cijena
        let cijena = efektivnaPovrsina * CIJENE.roletne[vrsta];
        
        // Dodatak za materijal
        cijena += efektivnaPovrsina * CIJENE.roletne.materijal[materijal];
        
        // Dodatak za boju
        if(boja === 'ral') {
            cijena += CIJENE.roletne.boja.ral;
        }
        
        // Prikaži rezultat
        const resultBox = document.getElementById('roletne-rezultat');
        resultBox.innerHTML = `
            <h4>Procijenjena cijena</h4>
            <p><strong>Vrsta:</strong> ${document.getElementById('roletna-vrsta').options[document.getElementById('roletna-vrsta').selectedIndex].text}</p>
            <p><strong>Materijal:</strong> ${document.getElementById('roletna-materijal').options[document.getElementById('roletna-materijal').selectedIndex].text}</p>
            <p><strong>Dimenzije:</strong> ${sirina}cm x ${visina}cm (${povrsina.toFixed(2)}m²)</p>
            <p><strong>Efektivna površina:</strong> ${efektivnaPovrsina.toFixed(2)}m²</p>
            <p><strong>Boja:</strong> ${document.getElementById('roletna-boja').options[document.getElementById('roletna-boja').selectedIndex].text}</p>
            <p><strong>Ukupno:</strong> <span style="color: #e74c3c; font-weight: bold;">${cijena.toFixed(2)} KM</span></p>
            ${povrsina < 1 ? '<p><small>Primjenjena minimalna cijena za 1m²</small></p>' : ''}
        `;
        resultBox.style.display = 'block';
        
        // Dodavanje u ponudu
        const stavka = {
            tip: 'Roletna',
            naziv: `${document.getElementById('roletna-vrsta').options[document.getElementById('roletna-vrsta').selectedIndex].text}`,
            dimenzije: `${sirina}cm x ${visina}cm`,
            detalji: `Materijal: ${document.getElementById('roletna-materijal').options[document.getElementById('roletna-materijal').selectedIndex].text}, Boja: ${document.getElementById('roletna-boja').options[document.getElementById('roletna-boja').selectedIndex].text}`,
            cijena: cijena.toFixed(2),
            povrsina: efektivnaPovrsina
        };
        
        dodajStavkuUListu(stavka);
    });
    
    // Kalkulator za komarnike
    const komarniciForm = document.getElementById('komarnici-form');
    komarniciForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Dohvati vrijednosti
        const vrsta = document.getElementById('komarnik-vrsta').value;
        const sirina = parseFloat(document.getElementById('komarnik-sirina').value) || 0;
        const visina = parseFloat(document.getElementById('komarnik-visina').value) || 0;
        const boja = document.getElementById('komarnik-boja').value;
        const zaVrata = document.getElementById('komarnik-vrata').checked;
        
        // Validacija
        if(!vrsta || sirina <= 0 || visina <= 0) {
            alert('Molimo popunite sve potrebne podatke!');
            return;
        }
        
        // Izračun površine (u m2)
        const povrsina = (sirina * visina) / 10000;
        // Minimalna površina 1m2
        const efektivnaPovrsina = Math.max(povrsina, 1);
        
        // Osnovna cijena
        let cijena = efektivnaPovrsina * CIJENE.komarnici[vrsta];
        
        // Dodatak za boju
        if(boja === 'ral') {
            cijena += CIJENE.komarnici.boja.ral;
        }
        
        // Dodatak za vrata
        if(zaVrata) {
            cijena += CIJENE.komarnici.vrata;
        }
        
        // Prikaži rezultat
        const resultBox = document.getElementById('komarnici-rezultat');
        resultBox.innerHTML = `
            <h4>Procijenjena cijena</h4>
            <p><strong>Vrsta:</strong> ${document.getElementById('komarnik-vrsta').options[document.getElementById('komarnik-vrsta').selectedIndex].text}</p>
            <p><strong>Dimenzije:</strong> ${sirina}cm x ${visina}cm (${povrsina.toFixed(2)}m²)</p>
            <p><strong>Efektivna površina:</strong> ${efektivnaPovrsina.toFixed(2)}m²</p>
            <p><strong>Boja:</strong> ${document.getElementById('komarnik-boja').options[document.getElementById('komarnik-boja').selectedIndex].text}</p>
            <p><strong>Za vrata:</strong> ${zaVrata ? 'Da' : 'Ne'}</p>
            <p><strong>Ukupno:</strong> <span style="color: #e74c3c; font-weight: bold;">${cijena.toFixed(2)} KM</span></p>
            ${povrsina < 1 ? '<p><small>Primjenjena minimalna cijena za 1m²</small></p>' : ''}
        `;
        resultBox.style.display = 'block';
        
        // Dodavanje u ponudu
        const stavka = {
            tip: 'Komarnik',
            naziv: `${document.getElementById('komarnik-vrsta').options[document.getElementById('komarnik-vrsta').selectedIndex].text}`,
            dimenzije: `${sirina}cm x ${visina}cm`,
            detalji: `Boja: ${document.getElementById('komarnik-boja').options[document.getElementById('komarnik-boja').selectedIndex].text}, Za vrata: ${zaVrata ? 'Da' : 'Ne'}`,
            cijena: cijena.toFixed(2),
            povrsina: efektivnaPovrsina
        };
        
        dodajStavkuUListu(stavka);
    });
    
    // Event listener za dugme generisanja ponude
    document.getElementById('generisi-ponudu').addEventListener('click', generisiPonudu);
    
    // Dodajemo globalne funkcije za pristup iz HTML-a
    window.obrisiStavku = obrisiStavku;
    window.printPonudu = printPonudu;
    window.snimiPonudu = snimiPonudu;
    
    // Inicijalizacija liste stavki
    osvjeziListuStavki();
});