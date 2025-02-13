// إعداد الخريطة مع موقع افتراضي
let map = L.map('map').setView([0, 0], 2); // إحداثيات البداية (خط العرض، خط الطول)

// إضافة طبقة الخريطة من OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// متغير لتحديث الموقع
let currentMarker = null;

// دالة لبدء تتبع الموقع
function startTracking() {
    console.log("بدأ التتبع...");
    
    // جلب الموقع من الخادم كل 5 ثوانٍ
    setInterval(() => {
        fetch('/locations') // طلب جلب بيانات المواقع
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const latestLocation = data[0]; // الحصول على أحدث موقع
                    const latitude = latestLocation.latitude;
                    const longitude = latestLocation.longitude;

                    // إذا كان هناك موقع محدث، نحدث الخريطة
                    if (currentMarker) {
                        map.removeLayer(currentMarker); // إزالة العلامة القديمة
                    }

                    // إضافة العلامة الجديدة
                    currentMarker = L.marker([latitude, longitude]).addTo(map)
                        .bindPopup(`جهاز: ${latestLocation.device_id}<br>وقت: ${latestLocation.timestamp}`)
                        .openPopup();

                    // تكبير الخريطة إلى الموقع الجديد
                    map.setView([latitude, longitude], 15);
                }
            })
            .catch(error => console.error('خطأ في جلب البيانات:', error));
    }, 5000); // تكرار الطلب كل 5 ثوانٍ
}

// ربط الزر بدالة بدء التتبع
document.getElementById('start-tracking').addEventListener('click', startTracking);
