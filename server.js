const evetBtn = document.getElementById('evet-btn');
const hayirBtn = document.getElementById('hayir-btn');
const butonlarDiv = document.getElementById('butonlar');
const sevgiMesaji = document.getElementById('sevgi-mesaji');
const istekMesaji = document.getElementById('istek-mesaji');

let evetFontSize = 16;
let hayirClickCount = 0;
let finalMessageShown = false;
const hayirMesajlari = [
    "Emin misin?",
    "Bak son kez söylüyorum",
    "Emin misin?",
    "Küserim",
    "Bir daha basarsan sıçarım azına",
    "Tamam Terk Ediyorum SENİ"
];

// Evet butonunun konumunu almak için fonksiyon
function getRandomPositionAroundEvet() {
    const evetRect = evetBtn.getBoundingClientRect();
    const hayirWidth = hayirBtn.offsetWidth;
    const hayirHeight = hayirBtn.offsetHeight;
    
    // Evet butonunun merkez noktası
    const evetCenterX = evetRect.left + evetRect.width / 2;
    const evetCenterY = evetRect.top + evetRect.height / 2;
    
    // Rastgele açı (0-360 derece)
    const angle = Math.random() * Math.PI * 2;
    
    // Evet butonundan rastgele uzaklık (50-150 piksel)
    const distance = 50 + Math.random() * 100;
    
    // Yeni konumu hesapla
    let randomX = evetCenterX + Math.cos(angle) * distance - hayirWidth / 2;
    let randomY = evetCenterY + Math.sin(angle) * distance - hayirHeight / 2;
    
    // Ekran sınırlarını kontrol et
    randomX = Math.max(10, Math.min(window.innerWidth - hayirWidth - 10, randomX));
    randomY = Math.max(10, Math.min(window.innerHeight - hayirHeight - 10, randomY));
    
    return { x: randomX, y: randomY };
}

// Hayır butonunu ışınlama fonksiyonu
function teleportButtonAroundEvet() {
    let teleportCount = 3;
    
    function teleport() {
        if (teleportCount > 0) {
            const pos = getRandomPositionAroundEvet();
            hayirBtn.style.position = 'fixed';
            hayirBtn.style.left = `${pos.x}px`;
            hayirBtn.style.top = `${pos.y}px`;
            
            // Çakışma kontrolü
            checkOverlapAndFix();
            
            teleportCount--;
            
            if (teleportCount > 0) {
                setTimeout(teleport, 150);
            }
        }
    }
    
    teleport();
}

// Çakışma kontrolü ve düzeltme
function checkOverlapAndFix() {
    const evetRect = evetBtn.getBoundingClientRect();
    const hayirRect = hayirBtn.getBoundingClientRect();
    
    // İki butonun çakışıp çakışmadığını kontrol et
    if (!(hayirRect.right < evetRect.left || 
          hayirRect.left > evetRect.right || 
          hayirRect.bottom < evetRect.top || 
          hayirRect.top > evetRect.bottom)) {
        
        // Çakışma varsa, Evet butonunu üste al
        evetBtn.style.zIndex = '4';
        hayirBtn.style.zIndex = '2';
        
        // Evet butonunu büyüt
        evetFontSize += 3;
        evetBtn.style.fontSize = `${evetFontSize}px`;
        evetBtn.style.animation = 'pulse 0.3s ease';
        
        setTimeout(() => {
            evetBtn.style.animation = '';
        }, 300);
        
        // Hayır butonunu tekrar ışınla
        setTimeout(() => {
            const newPos = getRandomPositionAroundEvet();
            hayirBtn.style.left = `${newPos.x}px`;
            hayirBtn.style.top = `${newPos.y}px`;
        }, 100);
    } else {
        // Çakışma yoksa z-index'leri normale döndür
        evetBtn.style.zIndex = '3';
        hayirBtn.style.zIndex = '2';
    }
}

hayirBtn.addEventListener('click', () => {
    if (finalMessageShown) {
        hayirBtn.textContent = "Hayır";
        teleportButtonAroundEvet();
        return;
    }
    
    // Evet butonunu DAİMA büyüt (sonsuza kadar)
    evetFontSize += 15;
    evetBtn.style.fontSize = `${evetFontSize}px`;
    evetBtn.style.animation = 'pulse 0.5s ease';
    
    setTimeout(() => {
        evetBtn.style.animation = '';
    }, 500);
    
    if (hayirClickCount < hayirMesajlari.length) {
        hayirBtn.textContent = hayirMesajlari[hayirClickCount];
        
        if (hayirClickCount === hayirMesajlari.length - 1) {
            finalMessageShown = true;
        }
    } else {
        hayirBtn.textContent = "Hayır";
        finalMessageShown = true;
    }
    
    teleportButtonAroundEvet();
    hayirClickCount++;
});

// Hayır butonuna fareyle gelindiğinde
hayirBtn.addEventListener('mouseenter', () => {
    if (hayirClickCount > 0) {
        const pos = getRandomPositionAroundEvet();
        hayirBtn.style.left = `${pos.x}px`;
        hayirBtn.style.top = `${pos.y}px`;
        checkOverlapAndFix();
    }
});

// Fare hareketini takip et
document.addEventListener('mousemove', (e) => {
    const hayirRect = hayirBtn.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Fare Hayır butonunun yakınındaysa
    if (Math.abs(mouseX - (hayirRect.left + hayirRect.width/2)) < 50 &&
        Math.abs(mouseY - (hayirRect.top + hayirRect.height/2)) < 50) {
        
        const pos = getRandomPositionAroundEvet();
        hayirBtn.style.left = `${pos.x}px`;
        hayirBtn.style.top = `${pos.y}px`;
        checkOverlapAndFix();
    }
});

evetBtn.addEventListener('click', () => {
    butonlarDiv.style.display = 'none';
    istekMesaji.style.display = 'none';
    sevgiMesaji.style.display = 'block';
    sevgiMesaji.style.animation = 'heartBeat 1s infinite';
    
    setTimeout(() => {
        butonlarDiv.style.display = 'flex';
        istekMesaji.style.display = 'block';
        sevgiMesaji.style.display = 'none';
        sevgiMesaji.style.animation = '';
        
        // Evet butonunu sıfırla
        evetFontSize = 16;
        evetBtn.style.fontSize = `${evetFontSize}px`;
        evetBtn.style.zIndex = '3';
        
        // Hayır butonunu sıfırla
        hayirBtn.textContent = "Hayır";
        hayirBtn.style.position = 'relative';
        hayirBtn.style.left = 'auto';
        hayirBtn.style.top = 'auto';
        hayirBtn.style.zIndex = '2';
        hayirClickCount = 0;
        finalMessageShown = false;
        
    }, 10000);
});

// Sayfa yüklendiğinde Hayır butonunu başlangıç pozisyonuna getir
window.addEventListener('load', () => {
    hayirBtn.style.position = 'relative';
    hayirBtn.style.left = 'auto';
    hayirBtn.style.top = 'auto';
});
