let deliveries = [];
let totalFoodRevenue = 0;
let totalDeliveryRevenue = 0;

// Horloge numérique
function startClock() {
    setInterval(() => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('digitalClock').innerText = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

// Fonction pour ajouter une livraison
function addDelivery() {
    const clientName = document.getElementById('clientName').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const address = document.getElementById('address').value;
    const foodPrice = parseFloat(document.getElementById('price').value); // Montant de la nourriture
    const deliveryPrice = 1000; // Vous pouvez définir un montant fixe pour la livraison ou le rendre dynamique
    const deliveryDate = document.getElementById('deliveryDate').value;
    const foodPaymentMode = document.getElementById('foodPaymentMode').value;
    const deliveryPaymentMode = document.getElementById('deliveryPaymentMode').value;

    if (clientName && clientPhone && address && foodPrice && deliveryDate && foodPaymentMode && deliveryPaymentMode) {
        const delivery = {
            clientName,
            clientPhone,
            address,
            foodPrice,
            deliveryPrice,
            deliveryDate,
            foodPaymentMode: getPaymentModeLabel(foodPaymentMode),
            deliveryPaymentMode: getPaymentModeLabel(deliveryPaymentMode),
            status: 'En cours'
        };
        deliveries.push(delivery);
        totalFoodRevenue += foodPrice; // Mettez à jour le revenu de la nourriture
        totalDeliveryRevenue += deliveryPrice; // Mettez à jour le revenu de la livraison
        updateDeliveryTable();
        resetForm();
    } else {
        alert("Veuillez remplir tous les champs.");
    }
}

// Fonction pour obtenir l'étiquette du mode de paiement
function getPaymentModeLabel(mode) {
    switch (mode) {
        case 'cash': return 'Espèces';
        case 'OM ou Wave chez Izoua': return 'OM ou Wave chez Izoua';
        case 'mobile': return 'OM ou Wave chez moi';
        default: return '';
    }
}

// Fonction pour mettre à jour le tableau des livraisons
function updateDeliveryTable() {
    const tableBody = document.querySelector('#deliveryTable tbody');
    tableBody.innerHTML = '';

    deliveries.forEach((delivery, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${delivery.clientName}</td>
            <td>${delivery.clientPhone}</td>
            <td>${delivery.address}</td>
            <td>${delivery.foodPrice} FCFA</td>
            <td>${delivery.deliveryDate}</td>
            <td>${delivery.foodPaymentMode}</td>
            <td>${delivery.deliveryPaymentMode}</td>
            <td>${delivery.status}</td>
            <td>
                <button onclick="markAsDelivered(${index})">Livrée</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    calculateTotalRevenue();
}

// Fonction pour marquer une livraison comme livrée
function markAsDelivered(index) {
    deliveries[index].status = 'Livrée';
    updateDeliveryTable();
}

// Fonction pour calculer les revenus totaux
function calculateTotalRevenue() {
    const totalRevenue = totalFoodRevenue + totalDeliveryRevenue; // Revenu total
    document.getElementById('totalRevenue').innerText = `${totalRevenue} FCFA`;

    // Affichage des revenus séparés
    document.getElementById('foodRevenue').innerText = `${totalFoodRevenue} FCFA`;
    document.getElementById('deliveryRevenue').innerText = `${totalDeliveryRevenue} FCFA`;
}

// Fonction pour réinitialiser le formulaire
function resetForm() {
    document.getElementById('clientName').value = '';
    document.getElementById('clientPhone').value = '';
    document.getElementById('address').value = '';
    document.getElementById('price').value = '';
    document.getElementById('deliveryDate').value = '';
    document.getElementById('foodPaymentMode').value = 'cash';
    document.getElementById('deliveryPaymentMode').value = 'cash';
}

// Démarrer l'horloge
startClock();
// Fonction pour générer un rapport PDF
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Rapport de Livraisons", 20, 20);
    doc.setFontSize(12);
    
    // En-têtes du tableau
    const headers = ["Client", "Téléphone", "Adresse", "Montant Nourriture (FCFA)", "Date", "Mode paiement Nourriture", "Mode paiement Livraison", "Statut"];
    const data = deliveries.map(delivery => [
        delivery.clientName,
        delivery.clientPhone,
        delivery.address,
        delivery.foodPrice,
        delivery.deliveryDate,
        delivery.foodPaymentMode,
        delivery.deliveryPaymentMode,
        delivery.status
    ]);
    
    // Ajouter les en-têtes au PDF
    doc.autoTable({
        head: [headers],
        body: data,
        startY: 30,
        theme: 'grid',
    });
    
    // Générer le fichier PDF
    doc.save('rapport_livraisons.pdf');
}
// script.js

// Tarifs de livraison par quartier
const deliveryRates = {
    Zone1: 1000,
    Zone2: 1500,
    Zone3: 2000
};

// Totaux pour le rapport journalier
let foodTotal = 0;
let deliveryTotal = 0;

// Fonction pour mettre à jour le montant de la livraison
function updateDeliveryAmount() {
    const neighborhood = document.getElementById('neighborhood').value;
    const deliveryAmountDisplay = document.getElementById('deliveryAmount');
    
    // Vérifier si le quartier est sélectionné et récupérer le tarif
    if (neighborhood && deliveryRates[neighborhood] !== undefined) {
        deliveryAmountDisplay.textContent = `Montant de la livraison : ${deliveryRates[neighborhood]} FCFA`;
    } else {
        deliveryAmountDisplay.textContent = 'Montant de la livraison : 0 FCFA';
    }
}

// Fonction pour ajouter une livraison au tableau
function addDelivery() {
    const clientName = document.getElementById('clientName').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const address = document.getElementById('address').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const foodPrice = parseFloat(document.getElementById('foodPrice').value);
    const foodPaymentMethod = document.getElementById('foodPaymentMethod').value;
    const deliveryPaymentMethod = document.getElementById('deliveryPaymentMethod').value;

    // Vérification des champs
    if (clientName && clientPhone && address && neighborhood && !isNaN(foodPrice)) {
        const deliveryPrice = deliveryRates[neighborhood];
        
        // Ajout de la livraison au tableau
        const tableBody = document.querySelector('#deliveryTable tbody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${clientName}</td>
            <td>${clientPhone}</td>
            <td>${address}</td>
            <td>${neighborhood}</td>
            <td>${foodPrice} FCFA</td>
            <td>${foodPaymentMethod}</td>
            <td>${deliveryPrice} FCFA</td>
            <td>${deliveryPaymentMethod}</td>
        `;
        tableBody.appendChild(row);

        // Mise à jour des totaux pour le rapport journalier
        foodTotal += foodPrice;
        deliveryTotal += deliveryPrice;
        updateReportDisplay();

        // Réinitialiser le formulaire
        resetForm();
    } else {
        alert("Veuillez remplir tous les champs.");
    }
}

// Fonction pour mettre à jour l'affichage du rapport
function updateReportDisplay() {
    document.getElementById('foodTotal').textContent = `Total Nourriture : ${foodTotal} FCFA`;
    document.getElementById('deliveryTotal').textContent = `Total Livraison : ${deliveryTotal} FCFA`;
}

// Fonction pour générer le rapport journalier (simple affichage)
function generateDailyReport() {
    alert(`Rapport Journalier :\nTotal Nourriture : ${foodTotal} FCFA\nTotal Livraison : ${deliveryTotal} FCFA`);
}

// Fonction pour réinitialiser le formulaire
function resetForm() {
    document.getElementById('clientName').value = '';
    document.getElementById('clientPhone').value = '';
    document.getElementById('address').value = '';
    document.getElementById('neighborhood').value = '';
    document.getElementById('foodPrice').value = '';
    document.getElementById('foodPaymentMethod').value = 'cash';
    document.getElementById('deliveryPaymentMethod').value = 'cash';
    document.getElementById('deliveryAmount').textContent = 'Montant de la livraison : 0 FCFA';
}
function generateQrCode() {
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    qrCodeContainer.innerHTML = ""; // Réinitialiser l'affichage du QR code
    
    const foodTotal = document.getElementById('foodTotal').textContent;
    const deliveryTotal = document.getElementById('deliveryTotal').textContent;
    
    const dailyReport = `Bilan Journalier :\n${foodTotal}\n${deliveryTotal}`;
    
    new QRCode(qrCodeContainer, {
        text: dailyReport,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}
