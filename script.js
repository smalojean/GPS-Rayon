// Géocodage OpenStreetMap
async function geocode(address) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === "OK" && results[0]) {
                const loc = results[0].geometry.location;
                resolve({ lat: loc.lat(), lon: loc.lng() });
            } else {
                reject(new Error("Adresse introuvable : " + address));
            }
        });
    });
}

// Calcul distance selon Haversine
function distanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat/2)**2 +
        Math.cos(lat1*Math.PI/180) *
        Math.cos(lat2*Math.PI/180) *
        Math.sin(dLon/2)**2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Vérification
async function checkDistance() {
    const base = document.getElementById("baseAddress").value;
    const test = document.getElementById("testAddress").value;
    const resultBox = document.getElementById("result");

    resultBox.innerHTML = "Calcul en cours...";

    try {
        const basePos = await geocode(base);
        const testPos = await geocode(test);

        const dist = distanceKm(basePos.lat, basePos.lon, testPos.lat, testPos.lon);

        const isIn = dist <= 25;

        resultBox.innerHTML = `
            Distance : <b>${dist.toFixed(2)} km</b><br>
            Rayon autorisé : <b>25 km</b><br><br>
            Résultat : <b style="color:${isIn ? 'green' : 'red'}">
            ${isIn ? "L’adresse est DANS le rayon" : "L’adresse est HORS du rayon"}
            </b>
        `;
    } catch (err) {
        resultBox.innerHTML = "<b style='color:red'>" + err.message + "</b>";
    }
}

// Bouton
document.getElementById("checkBtn").addEventListener("click", checkDistance);
