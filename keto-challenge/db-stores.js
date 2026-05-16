/* ═══════════════════════════════════════════
   قاعدة بيانات المتاجر والسوبرماركت
   تحدي الكيتو مع د. عمار
   آخر تحديث: 2026-05-16
   ملاحظة: متاجر السوق السعودي مع أفضل أماكن الشراء
═══════════════════════════════════════════ */

const STORES = [
  {
    id: 1,
    name: "بندة",
    name_en: "Panda",
    category: "سوبرماركت",
    available_regions: ["السعودية"],
    keto_score: 4,
    website: "panda.com.sa",
    app_available: true,
    delivery: true,
    doc_note: "من أفضل الخيارات — قسم المنتجات العضوية متوسع وأسعار معقولة",
    approved: true,
    best_sections: [
      "قسم اللحوم الطازجة — تشكيلة واسعة",
      "قسم الألبان — جبن متنوع وكريمة",
      "قسم الخضار العضوية",
      "ممر المكسرات والبذور",
    ],
    keto_tips: "ابحث عن تخفيضات اللحوم في آخر النهار — غالباً خصم 30-50%"
  },
  {
    id: 2,
    name: "أسواق العثيم",
    name_en: "Othaim Markets",
    category: "سوبرماركت",
    available_regions: ["السعودية"],
    keto_score: 4,
    website: "othaim.com.sa",
    app_available: true,
    delivery: true,
    doc_note: "أسعار تنافسية جداً — اللحوم والدواجن من أفضل الخيارات",
    approved: true,
    best_sections: [
      "قسم اللحوم — أسعار ممتازة",
      "قسم البيض البلدي",
      "قسم الأسماك والمأكولات البحرية",
      "الجبن والألبان",
    ],
    keto_tips: "تطبيقهم يحتوي على عروض أسبوعية — تابعها للحصول على اللحوم بسعر أقل"
  },
  {
    id: 3,
    name: "كارفور",
    name_en: "Carrefour",
    category: "هايبرماركت",
    available_regions: ["السعودية"],
    keto_score: 5,
    website: "carrefourksa.com",
    app_available: true,
    delivery: true,
    doc_note: "الأفضل للمنتجات المستوردة والمتخصصة — زيت MCT وجبن متنوع ومنتجات كيتو مستوردة",
    approved: true,
    best_sections: [
      "قسم المنتجات العضوية والصحية",
      "ممر الأطعمة المستوردة — زيت MCT وبادم باتر",
      "قسم اللحوم الممتازة",
      "قسم التوابل والزيوت المتخصصة",
    ],
    keto_tips: "ابحث في قسم Bio/Organic عن منتجات كيتو مستوردة — غالباً ما تجد زيت جوز الهند ومنتجات لوز"
  },
  {
    id: 4,
    name: "لولو هايبرماركت",
    name_en: "LuLu Hypermarket",
    category: "هايبرماركت",
    available_regions: ["السعودية"],
    keto_score: 4,
    website: "luluhypermarket.com",
    app_available: true,
    delivery: true,
    doc_note: "ممتاز للمأكولات البحرية والمنتجات الآسيوية — خيار جيد للسلمون وأسماك الكيتو",
    approved: true,
    best_sections: [
      "قسم المأكولات البحرية — أسعار ممتازة",
      "قسم اللحوم الهندية والباكستانية",
      "قسم الخضار الطازجة",
      "المنتجات الآسيوية — زيت جوز الهند",
    ],
    keto_tips: "السلمون المجمد خيار اقتصادي ممتاز — نفس القيمة الغذائية بسعر أقل"
  },
  {
    id: 5,
    name: "مانع للتمور والغذاء",
    name_en: "Mana'a",
    category: "متجر متخصص",
    available_regions: ["السعودية"],
    keto_score: 3,
    website: "",
    app_available: false,
    delivery: false,
    doc_note: "للمنتجات الطبيعية والعضوية المحلية — مكسرات وبذور بجودة عالية",
    approved: true,
    best_sections: [
      "المكسرات الطازجة والبذور",
      "الزيوت الطبيعية",
      "منتجات النخيل الطبيعية",
    ],
    keto_tips: "اشترِ المكسرات بكميات كبيرة — أرخص وأطزج"
  },
  {
    id: 6,
    name: "أمازون السعودية",
    name_en: "Amazon.sa",
    category: "تسوق إلكتروني",
    available_regions: ["السعودية"],
    keto_score: 5,
    website: "amazon.sa",
    app_available: true,
    delivery: true,
    doc_note: "الأفضل للمنتجات المتخصصة — زيت MCT، مكملات، أجهزة قياس الكيتون",
    approved: true,
    best_sections: [
      "مكملات الكيتو — ماغنيسيوم، أوميغا 3",
      "زيت MCT C8",
      "أجهزة قياس الكيتون في الدم",
      "أدوات المطبخ الكيتو",
    ],
    keto_tips: "فعّل Prime للشحن المجاني — يستحق لكثرة الطلبات"
  },
];

/* ═══ STORE HELPERS ═══ */
function getStoreById(id){ return STORES.find(s => s.id === id); }
function getStoresByCategory(cat){ return STORES.filter(s => s.category === cat); }
function getDeliveryStores(){ return STORES.filter(s => s.delivery); }
function getTopStores(n=3){ return [...STORES].sort((a,b) => b.keto_score - a.keto_score).slice(0,n); }
