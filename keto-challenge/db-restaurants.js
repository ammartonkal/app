/* ═══════════════════════════════════════════
   قاعدة بيانات المطاعم الكيتو-فريندلي
   تحدي الكيتو مع د. عمار
   آخر تحديث: 2026-05-16
   ملاحظة: أضف مطاعم السوق السعودي هنا
═══════════════════════════════════════════ */

const RESTAURANTS = [
  {
    id: 1,
    name: "ماكدونالدز",
    name_en: "McDonald's",
    category: "وجبات سريعة",
    logo: "",
    available_regions: ["السعودية"],
    keto_score: 3,
    doc_note: "اطلب البرجر بدون خبز — احذر الصوصات العالية بالسكر",
    approved: true,
    keto_options: [
      { name: "برجر لحم بدون خبز", carb: 2, fat: 18, protein: 20, notes: "احذف الكاتشب" },
      { name: "سلطة الدجاج المشوي", carb: 5, fat: 8, protein: 25, notes: "بدون كروتون، الدريسنج على الجانب" },
      { name: "بيض مقلي", carb: 1, fat: 9, protein: 6, notes: "خيار فطور جيد" },
    ]
  },
  {
    id: 2,
    name: "الباييك",
    name_en: "Al Baik",
    category: "وجبات سريعة",
    logo: "",
    available_regions: ["السعودية"],
    keto_score: 2,
    doc_note: "صعب في الكيتو — الدجاج مقلي ومغطى بالطحين. الخيار الوحيد: اطلب الدجاج واترك الكرسب",
    approved: true,
    keto_options: [
      { name: "دجاج مشوي (إذا متوفر)", carb: 0, fat: 10, protein: 28, notes: "نادر — تحقق من الفروع" },
      { name: "سلطة خضراء", carb: 4, fat: 2, protein: 2, notes: "بدون كروتون" },
    ]
  },
  {
    id: 3,
    name: "هرفي",
    name_en: "Herfy",
    category: "وجبات سريعة",
    logo: "",
    available_regions: ["السعودية"],
    keto_score: 3,
    doc_note: "البرجر بدون خبز خيار معقول — اطلب صراحة وتأكد من التنفيذ",
    approved: true,
    keto_options: [
      { name: "برجر بدون خبز", carb: 3, fat: 20, protein: 22, notes: "أضف جبن، احذف الصوص الحلو" },
      { name: "شيش طاووق مشوي", carb: 2, fat: 8, protein: 26, notes: "الخيار الأفضل" },
    ]
  },
  {
    id: 4,
    name: "كنتاكي",
    name_en: "KFC",
    category: "وجبات سريعة",
    logo: "",
    available_regions: ["السعودية"],
    keto_score: 2,
    doc_note: "الدجاج المقلي يحتوي على طحين — الأفضل اختيار الشواء إذا متوفر",
    approved: true,
    keto_options: [
      { name: "دجاج مشوي (Grilled)", carb: 0, fat: 12, protein: 30, notes: "ليس في كل الفروع" },
      { name: "سلطة كوب", carb: 6, fat: 4, protein: 3, notes: "بدون كروتون" },
    ]
  },
  {
    id: 5,
    name: "ستاربكس",
    name_en: "Starbucks",
    category: "مقاهي",
    logo: "",
    available_regions: ["السعودية"],
    keto_score: 3,
    doc_note: "اطلب أي قهوة بدون سكر وبحليب لوز أو كريمة ثقيلة بدلاً من الحليب العادي",
    approved: true,
    keto_options: [
      { name: "أمريكانو بدون سكر", carb: 0, fat: 0, protein: 0, notes: "الخيار الأفضل" },
      { name: "لاتيه بكريمة ثقيلة بدون سكر", carb: 2, fat: 12, protein: 2, notes: "اطلب Heavy Cream" },
      { name: "Cold Brew بدون سكر", carb: 0, fat: 0, protein: 0, notes: "ممتاز" },
    ]
  },
  {
    id: 6,
    name: "سب واي",
    name_en: "Subway",
    category: "وجبات سريعة",
    logo: "",
    available_regions: ["السعودية"],
    keto_score: 4,
    doc_note: "اطلب السلطة بدلاً من الساندويش — كل المكونات متاحة بدون خبز",
    approved: true,
    keto_options: [
      { name: "سلطة الدجاج المشوي", carb: 5, fat: 10, protein: 28, notes: "أضف أفوكادو وزيت زيتون" },
      { name: "سلطة التونة", carb: 4, fat: 18, protein: 22, notes: "الأفضل في القائمة للكيتو" },
      { name: "سلطة اللحم", carb: 4, fat: 15, protein: 25, notes: "بدون صوص حلو" },
    ]
  },
];

/* ═══ RESTAURANT HELPERS ═══ */
function getRestaurantById(id){ return RESTAURANTS.find(r => r.id === id); }
function getApprovedRestaurants(){ return RESTAURANTS.filter(r => r.approved); }
function getRestaurantsByCategory(cat){ return RESTAURANTS.filter(r => r.category === cat); }
function getRestaurantsByScore(minScore){ return RESTAURANTS.filter(r => r.keto_score >= minScore); }
