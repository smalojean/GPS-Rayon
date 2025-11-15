// Normaliser l'adresse pour Montréal/Québec
function normalizeAddress(addr) {
    return addr
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // retire accents
        .replace(/\bE\b/g, "Est")
        .replace(/\bO\b/g, "Ouest")
        .replace(/\s+/g, " ")
        .trim();
}

// Vérification distance en voiture max 10 km
function checkDrivingDistance() {
    const baseRaw = document.getElementById("baseAddress").value;
    const testRaw = document.getElementById("testAddress").value;
    const result = document.getElementById("result");

    if (!baseRaw || !testRaw) {
        result.innerHTML = "<b style='color:red'>Veuillez entrer les deux adresses.</b>";
        return;
    }

    result.textContent = "Calcul en cours...";

    const base = normalizeAddress(baseRaw);
    const test = normalizeAddress(testRaw);

    const directionsService = new google.maps.DirectionsService();

    directionsService.route({
        origin: base,
        destination: test,
        travelMode: google.maps.TravelMode.DRIVING
    }, (res, status) => {
        if (status === "OK" && res.routes[0]) {
            const distMeters = res.routes[0].legs[0].distance.value;
            const distKm = distMeters / 1000;
            const maxKm = 10;
            const isIn = distKm <= maxKm;

            result.innerHTML = `
                Distance en voiture : <b>${distKm.toFixed(2)} km</b><br>
                Distance max autorisée : <b>${maxKm} km</b><br>
                Résultat : <b style="color:${isIn?'green':'red'}">
                ${isIn ? "Accessible en voiture" : "Trop loin"}
                </b>
            `;
        } else {
            result.innerHTML = `<b style="color:red">Adresse introuvable ou erreur : ${status}</b>`;
        }
    });
}

// Bouton
document.getElementById("checkBtn").addEventListener("click", checkDrivingDistance);
