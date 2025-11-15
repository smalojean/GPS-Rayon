// Géocodeur Google Maps côté client
function geocode(address) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === "OK" && results[0]) {
                const loc = results[0].geometry.location;
                resolve({ lat: loc.lat(), lon: loc.lng() });
            } else {
                reject(new Error("Adresse introuvable : " + address + " (status: " + status + ")"));
            }
        });
    });
}

// Calcul distance Haversine
function distanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2-lat1)*Math.PI/180;
    const dLon = (lon2-lon1)*Math.PI/180;
    const a = Math.sin(dLat/2)**2 +
              Math.cos(lat1*Math.PI/180) *
              Math.cos(lat2*Math.PI/180) *
              Math.sin(dLon/2)**2;
    return 2*R*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Normaliser l'adresse pour Montréal/Québec
function normalizeAddress(addr) {
    return addr
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // retire accents
        .replace(/\bE\b/g, "Est")
        .replace(/\bO\b/g, "Ouest")
        .replace(/\s+/g, " ")
        .trim();
}

// Vérification du rayon
document.getElementById("checkBtn").addEventListener("click", async () => {
    const baseRaw = document.getElementById("baseAddress").value;
    const testRaw = document.getElementById("testAddress").value;
    const result = document.getElementById("result");

    result.textContent = "Calcul en cours...";

    try {
        const basePos = await geocode(normalizeAddress(baseRaw));
        const testPos = await geocode(normalizeAddress(testRaw));

        const dist = distanceKm(basePos.lat, basePos.lon, testPos.lat, testPos.lon);
        const isIn = dist <= 25;

        result.innerHTML = `
            Distance : <b>${dist.toFixed(2)} km</b><br>
            Rayon autorisé : <b>25 km</b><br>
            Résultat : <b style="color:${isIn ? 'green' : 'red'}">
            ${isIn ? "DANS le rayon" : "HORS du rayon"}
            </b>
        `;
    } catch (e) {
        result.innerHTML = `<b style="color:red">${e.message}</b>`;
    }
});
