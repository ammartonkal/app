/* ═══════════════════════════════════════════
   قاعدة بيانات الأطعمة — تحدي الكيتو مع د. عمار
   المصدر: USDA + جداول كتاب التغذية الكيتونية د. عمار تنكل
   آخر تحديث: 2026-05-20
   ═══════════════════════════════════════════
   هيكل كل صنف:
   id, name, name_en, cat
   cal, fat, sat_fat, protein, carb, fiber, net_carb
   sodium, potassium
   keto_class:    1=كيتوني مسموح / 2=غير كيتوني مسموح / 3=غير كيتوني لا ينصح به
   health_class:  "أ"=صحي مسموح / "ب"=مسموح / "ج"=غير صحي
   phases_allowed: المراحل المتاحة [0,1,2,3,4,5,6,7] — 0=تمهيدية
   phase_notes:   ملاحظات خاصة ببعض المراحل {} اختياري
   rec:           "أ"=يوصي به د.عمار / "ب"=مسموح عند غياب أ / "ج"=لا يوصي به
   qty_moderate:  الكمية المعتدلة (غرام/يوم)
   qty_max:       أقصى كمية (غرام/يوم)
   daily_freq:    التكرار اليومي
   weekly_freq:   التكرار الأسبوعي
   doc_rec:       توصية نصية
   img_url:       رابط الصورة
═══════════════════════════════════════════ */

const FOODS = [

  /* ══════════════════════════════════════
     الفئة: دهون أساسية
  ══════════════════════════════════════ */

  {
    id: 1,
    name: "زيت زيتون بكر ممتاز", name_en: "Extra Virgin Olive Oil", cat: "دهون",
    cal: 884, fat: 100, sat_fat: 14, protein: 0, carb: 0, fiber: 0, net_carb: 0,
    sodium: 2, potassium: 1,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 45, qty_max: 75, daily_freq: 3, weekly_freq: 7,
    doc_rec: "الدهن الأساسي في كيتو د. عمار — استخدمه بارداً أو على حرارة منخفضة",
    img_url: ""
  },
  {
    id: 2,
    name: "زيت أفوكادو", name_en: "Avocado Oil", cat: "دهون",
    cal: 884, fat: 100, sat_fat: 12, protein: 0, carb: 0, fiber: 0, net_carb: 0,
    sodium: 0, potassium: 0,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 45, qty_max: 75, daily_freq: 3, weekly_freq: 7,
    doc_rec: "ممتاز للطهي على حرارة عالية — نقطة دخان مرتفعة",
    img_url: ""
  },
  {
    id: 3,
    name: "سمن حيواني بلدي", name_en: "Ghee (Clarified Butter)", cat: "دهون",
    cal: 900, fat: 100, sat_fat: 62, protein: 0, carb: 0, fiber: 0, net_carb: 0,
    sodium: 0, potassium: 5,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 30, qty_max: 45, daily_freq: 2, weekly_freq: 7,
    doc_rec: "من أفضل الدهون المشبعة الطبيعية — يضيف نكهة ويرفع النسبة الكيتونية",
    img_url: ""
  },
  {
    id: 4,
    name: "زبدة حيوانية غير مملحة", name_en: "Unsalted Butter", cat: "دهون",
    cal: 717, fat: 81, sat_fat: 51, protein: 0.9, carb: 0.1, fiber: 0, net_carb: 0.1,
    sodium: 11, potassium: 24,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 30, qty_max: 45, daily_freq: 2, weekly_freq: 7,
    doc_rec: "أساس فطور الكيتو — مثالي مع البيض والقهوة الكيتونية",
    img_url: ""
  },
  {
    id: 5,
    name: "زبدة حيوانية مملحة", name_en: "Salted Butter", cat: "دهون",
    cal: 717, fat: 81, sat_fat: 51, protein: 0.9, carb: 0.1, fiber: 0, net_carb: 0.1,
    sodium: 576, potassium: 24,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "ب", qty_moderate: 30, qty_max: 45, daily_freq: 2, weekly_freq: 7,
    doc_rec: "مقبول — راقب إجمالي الصوديوم اليومي",
    img_url: ""
  },
  {
    id: 6,
    name: "زيت جوز الهند البكر", name_en: "Virgin Coconut Oil", cat: "دهون",
    cal: 892, fat: 100, sat_fat: 87, protein: 0, carb: 0, fiber: 0, net_carb: 0,
    sodium: 0, potassium: 0,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 30, qty_max: 45, daily_freq: 2, weekly_freq: 7,
    doc_rec: "غني بالـ MCT الطبيعي — يرفع الكيتونات بشكل معتدل",
    img_url: ""
  },
  {
    id: 7,
    name: "زيت MCT", name_en: "MCT Oil (C8/C10)", cat: "دهون",
    cal: 870, fat: 100, sat_fat: 100, protein: 0, carb: 0, fiber: 0, net_carb: 0,
    sodium: 0, potassium: 0,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 30, qty_max: 45, daily_freq: 2, weekly_freq: 7,
    doc_rec: "ابدأ بنصف ملعقة صغيرة وزد تدريجياً — C8 الأفضل لرفع الكيتونات",
    img_url: ""
  },
  {
    id: 8,
    name: "شحوم حيوانية", name_en: "Animal Fat / Lard", cat: "دهون",
    cal: 900, fat: 100, sat_fat: 39, protein: 0, carb: 0, fiber: 0, net_carb: 0,
    sodium: 0, potassium: 0,
    keto_class: 1, health_class: "أ",
    phases_allowed: [1,2,4,5,6,7],
    rec: "ب", qty_moderate: 30, qty_max: 45, daily_freq: 2, weekly_freq: 3,
    doc_rec: "مناسب للطهي — تأكد من مصدره الطبيعي بدون إضافات",
    img_url: ""
  },
  {
    id: 9,
    name: "زيت السمسم", name_en: "Sesame Oil", cat: "دهون",
    cal: 884, fat: 100, sat_fat: 14, protein: 0, carb: 0, fiber: 0, net_carb: 0,
    sodium: 0, potassium: 0,
    keto_class: 1, health_class: "ب",
    phases_allowed: [1,2,4,5,6,7],
    rec: "ب", qty_moderate: 15, qty_max: 30, daily_freq: 1, weekly_freq: 3,
    doc_rec: "للنكهة فقط — كميات صغيرة",
    img_url: ""
  },

  /* ══════════════════════════════════════
     الفئة: بروتين ودهون متكاملة
  ══════════════════════════════════════ */

  {
    id: 10,
    name: "بيض كامل", name_en: "Whole Egg", cat: "بروتين",
    cal: 143, fat: 9.5, sat_fat: 3.1, protein: 13, carb: 0.7, fiber: 0, net_carb: 0.7,
    sodium: 142, potassium: 138,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 150, qty_max: 250, daily_freq: 2, weekly_freq: 7,
    doc_rec: "أفضل مصدر بروتين كيتوني — كامل المغذيات وأساس كل وجبة فطور",
    img_url: ""
  },
  {
    id: 11,
    name: "دجاج بأنواعه (مع أو بدون جلد)", name_en: "Chicken (all cuts)", cat: "بروتين",
    cal: 215, fat: 13, sat_fat: 3.5, protein: 25, carb: 0, fiber: 0, net_carb: 0,
    sodium: 75, potassium: 220,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 150, qty_max: 300, daily_freq: 1, weekly_freq: 3,
    doc_rec: "مع الجلد أفضل كيتونياً — يرفع نسبة الدهون",
    img_url: ""
  },
  {
    id: 12,
    name: "دجاج مشوي (صدر بدون جلد)", name_en: "Grilled Chicken Breast", cat: "بروتين",
    cal: 165, fat: 3.6, sat_fat: 1.0, protein: 31, carb: 0, fiber: 0, net_carb: 0,
    sodium: 74, potassium: 256,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 150, qty_max: 300, daily_freq: 1, weekly_freq: 3,
    doc_rec: "يحتاج إضافة دهون لرفع النسبة الكيتونية — أضف زيت زيتون أو زبدة",
    img_url: ""
  },
  {
    id: 13,
    name: "لحم بقر عالي الدهن", name_en: "Fatty Beef", cat: "بروتين",
    cal: 294, fat: 24, sat_fat: 10, protein: 18, carb: 0, fiber: 0, net_carb: 0,
    sodium: 72, potassium: 280,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 150, qty_max: 300, daily_freq: 1, weekly_freq: 2,
    doc_rec: "نسبة دهون ممتازة — الخيار الأفضل في اللحوم الحمراء للكيتو",
    img_url: ""
  },
  {
    id: 14,
    name: "لحم بقر مفروم (80/20)", name_en: "Ground Beef 80/20", cat: "بروتين",
    cal: 254, fat: 20, sat_fat: 7.7, protein: 17, carb: 0, fiber: 0, net_carb: 0,
    sodium: 75, potassium: 270,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 150, qty_max: 300, daily_freq: 1, weekly_freq: 2,
    doc_rec: "نسبة الدهون مثالية — أساس كثير من الوصفات الكيتونية",
    img_url: ""
  },
  {
    id: 15,
    name: "لحم بقر معتدل الدهن", name_en: "Lean Beef", cat: "بروتين",
    cal: 217, fat: 14, sat_fat: 5.5, protein: 22, carb: 0, fiber: 0, net_carb: 0,
    sodium: 65, potassium: 300,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 150, qty_max: 300, daily_freq: 1, weekly_freq: 2,
    doc_rec: "مقبول — أضف دهوناً للطهي لتحسين النسبة الكيتونية",
    img_url: ""
  },
  {
    id: 16,
    name: "لحم خروف", name_en: "Lamb", cat: "بروتين",
    cal: 282, fat: 22, sat_fat: 9.4, protein: 19, carb: 0, fiber: 0, net_carb: 0,
    sodium: 72, potassium: 310,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 150, qty_max: 300, daily_freq: 1, weekly_freq: 2,
    doc_rec: "دهون طبيعية عالية — خيار ممتاز في المطبخ السعودي",
    img_url: ""
  },
  {
    id: 17,
    name: "سمك سلمون", name_en: "Salmon", cat: "بروتين",
    cal: 208, fat: 13, sat_fat: 2.5, protein: 20, carb: 0, fiber: 0, net_carb: 0,
    sodium: 59, potassium: 363,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 150, qty_max: 300, daily_freq: 1, weekly_freq: 5,
    doc_rec: "غني بالأوميغا 3 — أفضل سمك للكيتو، يُوصى بـ 5 مرات/أسبوع",
    img_url: ""
  },
  {
    id: 18,
    name: "ساردين معلب", name_en: "Canned Sardines", cat: "بروتين",
    cal: 208, fat: 11, sat_fat: 1.5, protein: 25, carb: 0, fiber: 0, net_carb: 0,
    sodium: 397, potassium: 397,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 150, qty_max: 300, daily_freq: 1, weekly_freq: 5,
    doc_rec: "بديل اقتصادي للسلمون — غني بالأوميغا 3 والكالسيوم",
    img_url: ""
  },
  {
    id: 19,
    name: "تونة بالماء", name_en: "Canned Tuna in Water", cat: "بروتين",
    cal: 109, fat: 2.5, sat_fat: 0.6, protein: 20, carb: 0, fiber: 0, net_carb: 0,
    sodium: 330, potassium: 207,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 150, qty_max: 300, daily_freq: 1, weekly_freq: 5,
    doc_rec: "أضف زيت زيتون أو مايونيز لرفع الدهون",
    img_url: ""
  },
  {
    id: 20,
    name: "أسماك أخرى", name_en: "Other Fish", cat: "بروتين",
    cal: 150, fat: 6, sat_fat: 1.2, protein: 22, carb: 0, fiber: 0, net_carb: 0,
    sodium: 60, potassium: 300,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 150, qty_max: 300, daily_freq: 1, weekly_freq: 3,
    doc_rec: "أي سمك طازج — اختر الدهني منه (هامور، باسا، قبّاط)",
    img_url: ""
  },
  {
    id: 21,
    name: "جمبري وأسماك قشرية", name_en: "Shrimp & Shellfish", cat: "بروتين",
    cal: 99, fat: 1.7, sat_fat: 0.3, protein: 20, carb: 0, fiber: 0, net_carb: 0,
    sodium: 111, potassium: 259,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 150, qty_max: 300, daily_freq: 1, weekly_freq: 3,
    doc_rec: "اطبخه بالزبدة أو زيت الزيتون لرفع النسبة الكيتونية",
    img_url: ""
  },
  {
    id: 22,
    name: "كبد حيواني", name_en: "Organ Meats (Liver)", cat: "بروتين",
    cal: 165, fat: 4.4, sat_fat: 1.4, protein: 26, carb: 3.9, fiber: 0, net_carb: 3.9,
    sodium: 75, potassium: 380,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 100, qty_max: 150, daily_freq: 1, weekly_freq: 2,
    doc_rec: "كنز غذائي — فيتامين A وB12 وحديد وكولاجين. مرتين أسبوعياً كافيتان",
    img_url: ""
  },
  {
    id: 23,
    name: "سجق بدون حشو", name_en: "Sausage (pure meat)", cat: "بروتين",
    cal: 346, fat: 30, sat_fat: 11, protein: 18, carb: 1.1, fiber: 0, net_carb: 1.1,
    sodium: 869, potassium: 290,
    keto_class: 1, health_class: "ب",
    phases_allowed: [1,2,4,5,6,7],
    rec: "ب", qty_moderate: 80, qty_max: 150, daily_freq: 1, weekly_freq: 3,
    doc_rec: "اقرأ المكونات — تجنب ما يحتوي على نشا أو دقيق",
    img_url: ""
  },
  {
    id: 24,
    name: "لحم مقدد (بيكون)", name_en: "Bacon", cat: "بروتين",
    cal: 541, fat: 45, sat_fat: 15, protein: 33, carb: 0.6, fiber: 0, net_carb: 0.6,
    sodium: 1717, potassium: 565,
    keto_class: 1, health_class: "ب",
    phases_allowed: [1,2,4,5,6,7],
    rec: "ب", qty_moderate: 50, qty_max: 100, daily_freq: 1, weekly_freq: 3,
    doc_rec: "صوديوم عالٍ — راقب إجمالي اليوم، واختر النوع بدون نترات",
    img_url: ""
  },
  {
    id: 25,
    name: "طحينة خام", name_en: "Raw Tahini", cat: "بروتين",
    cal: 595, fat: 53, sat_fat: 7.4, protein: 17, carb: 21, fiber: 9.3, net_carb: 11.7,
    sodium: 115, potassium: 414,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 15, qty_max: 30, daily_freq: 1, weekly_freq: 7,
    doc_rec: "الطحينة الخام (المرّة) — غنية بالكالسيوم والمغنيسيوم",
    img_url: ""
  },
  {
    id: 26,
    name: "كاكاو خام", name_en: "Raw Cacao Powder", cat: "بروتين",
    cal: 228, fat: 13, sat_fat: 7.9, protein: 20, carb: 54, fiber: 37, net_carb: 17,
    sodium: 21, potassium: 1524,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 10, qty_max: 30, daily_freq: 1, weekly_freq: 7,
    doc_rec: "للتحلية الكيتونية — غني بالمغنيسيوم. استخدمه مع محلي بديل",
    img_url: ""
  },

  /* ══════════════════════════════════════
     الفئة: ألبان وأجبان وقشطة
  ══════════════════════════════════════ */

  {
    id: 27,
    name: "جبنة حلومي", name_en: "Halloumi Cheese", cat: "ألبان",
    cal: 321, fat: 25, sat_fat: 16, protein: 22, carb: 1.5, fiber: 0, net_carb: 1.5,
    sodium: 756, potassium: 40,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 50, qty_max: 150, daily_freq: 2, weekly_freq: 7,
    doc_rec: "يمكن شويه — يذوب بصعوبة ويحافظ على شكله في الطهي",
    img_url: ""
  },
  {
    id: 28,
    name: "جبنة ماعز", name_en: "Goat Cheese", cat: "ألبان",
    cal: 364, fat: 30, sat_fat: 21, protein: 22, carb: 0.1, fiber: 0, net_carb: 0.1,
    sodium: 368, potassium: 26,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 50, qty_max: 150, daily_freq: 2, weekly_freq: 7,
    doc_rec: "أسهل هضماً من جبن البقر — تحمل اللاكتوز أفضل",
    img_url: ""
  },
  {
    id: 29,
    name: "جبنة شيدر طبيعية", name_en: "Natural Cheddar Cheese", cat: "ألبان",
    cal: 403, fat: 33, sat_fat: 21, protein: 25, carb: 1.3, fiber: 0, net_carb: 1.3,
    sodium: 621, potassium: 98,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 50, qty_max: 150, daily_freq: 1, weekly_freq: 5,
    doc_rec: "اختر الشيدر الطبيعي المعتّق — تجنب شيدر المعالج",
    img_url: ""
  },
  {
    id: 30,
    name: "جبنة فيتا", name_en: "Feta Cheese", cat: "ألبان",
    cal: 264, fat: 21, sat_fat: 15, protein: 14, carb: 4.1, fiber: 0, net_carb: 4.1,
    sodium: 1116, potassium: 62,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 50, qty_max: 150, daily_freq: 1, weekly_freq: 5,
    doc_rec: "ممتازة في السلطات — صوديوم عالٍ، راقب الكمية",
    img_url: ""
  },
  {
    id: 31,
    name: "جبنة بارميزان", name_en: "Parmesan Cheese", cat: "ألبان",
    cal: 431, fat: 29, sat_fat: 18, protein: 38, carb: 3.2, fiber: 0, net_carb: 3.2,
    sodium: 1529, potassium: 92,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 30, qty_max: 100, daily_freq: 1, weekly_freq: 4,
    doc_rec: "للرش فوق الأطباق — بروتين عالٍ وكارب منخفض",
    img_url: ""
  },
  {
    id: 32,
    name: "جبنة موزاريلا", name_en: "Mozzarella Cheese", cat: "ألبان",
    cal: 300, fat: 22, sat_fat: 14, protein: 22, carb: 2.2, fiber: 0, net_carb: 2.2,
    sodium: 627, potassium: 76,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 50, qty_max: 150, daily_freq: 1, weekly_freq: 3,
    doc_rec: "للبيتزا الكيتونية وأطباق الفرن",
    img_url: ""
  },
  {
    id: 33,
    name: "جبنة جودا / إيدام / سويسري", name_en: "Gouda / Edam / Swiss", cat: "ألبان",
    cal: 356, fat: 27, sat_fat: 18, protein: 25, carb: 2.2, fiber: 0, net_carb: 2.2,
    sodium: 819, potassium: 121,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 30, qty_max: 100, daily_freq: 1, weekly_freq: 3,
    doc_rec: "تنويع جيد في أجبان الكيتو",
    img_url: ""
  },
  {
    id: 34,
    name: "جبنة زرقاء", name_en: "Blue Cheese", cat: "ألبان",
    cal: 353, fat: 29, sat_fat: 19, protein: 21, carb: 2.3, fiber: 0, net_carb: 2.3,
    sodium: 1395, potassium: 256,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 50, qty_max: 150, daily_freq: 2, weekly_freq: 7,
    doc_rec: "غنية بالبروبيوتيك — تعزز صحة الأمعاء",
    img_url: ""
  },
  {
    id: 35,
    name: "جبنة كريمية", name_en: "Cream Cheese", cat: "ألبان",
    cal: 342, fat: 34, sat_fat: 21, protein: 6.0, carb: 4.1, fiber: 0, net_carb: 4.1,
    sodium: 321, potassium: 138,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 30, qty_max: 100, daily_freq: 1, weekly_freq: 3,
    doc_rec: "لصوصات الكريمة والحلويات الكيتونية",
    img_url: ""
  },
  {
    id: 36,
    name: "لبنة فاخرة / عادية", name_en: "Labneh", cat: "ألبان",
    cal: 170, fat: 10, sat_fat: 7, protein: 17, carb: 5, fiber: 0, net_carb: 5,
    sodium: 390, potassium: 190,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 30, qty_max: 100, daily_freq: 1, weekly_freq: 2,
    doc_rec: "بروبيوتيك طبيعي — مناسب مع زيت الزيتون والزعتر",
    img_url: ""
  },
  {
    id: 37,
    name: "قشطة طازجة", name_en: "Fresh Cream (Qishta)", cat: "ألبان",
    cal: 250, fat: 24, sat_fat: 15, protein: 3, carb: 7, fiber: 0, net_carb: 7,
    sodium: 40, potassium: 100,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 30, qty_max: 100, daily_freq: 1, weekly_freq: 2,
    doc_rec: "للإفطار أو التحلية — راقب الكمية بسبب الكارب",
    img_url: ""
  },
  {
    id: 38,
    name: "كريمة طبخ / خفق", name_en: "Heavy Whipping Cream", cat: "ألبان",
    cal: 340, fat: 36, sat_fat: 23, protein: 2.0, carb: 2.7, fiber: 0, net_carb: 2.7,
    sodium: 38, potassium: 75,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 50, qty_max: 100, daily_freq: 1, weekly_freq: 5,
    doc_rec: "لصوصات الكريمة والقهوة الكيتونية — نسبة دهون ممتازة",
    img_url: ""
  },
  {
    id: 39,
    name: "قشطة حامضة", name_en: "Sour Cream", cat: "ألبان",
    cal: 193, fat: 19, sat_fat: 12, protein: 2.4, carb: 4.6, fiber: 0, net_carb: 4.6,
    sodium: 53, potassium: 138,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 30, qty_max: 100, daily_freq: 1, weekly_freq: 2,
    doc_rec: "كغراس أو مع اللحم — بروبيوتيك طبيعي",
    img_url: ""
  },
  {
    id: 40,
    name: "حليب البقر / اللبن السائل", name_en: "Cow's Milk", cat: "ألبان",
    cal: 61, fat: 3.3, sat_fat: 1.9, protein: 3.2, carb: 4.8, fiber: 0, net_carb: 4.8,
    sodium: 44, potassium: 150,
    keto_class: 1, health_class: "أ",
    phases_allowed: [3,4,5,6,7],
    phase_notes: { 3: "كميات قليلة جداً فقط", 4: "50مل كحد أقصى مع القهوة" },
    rec: "ب", qty_moderate: 50, qty_max: 200, daily_freq: 1, weekly_freq: 2,
    doc_rec: "يحتوي لاكتوز — كميات صغيرة جداً في المراحل المتأخرة",
    img_url: ""
  },
  {
    id: 41,
    name: "زبادي يوناني بدون نكهة", name_en: "Plain Greek Yogurt", cat: "ألبان",
    cal: 97, fat: 5, sat_fat: 3.3, protein: 9, carb: 3.6, fiber: 0, net_carb: 3.6,
    sodium: 36, potassium: 141,
    keto_class: 1, health_class: "أ",
    phases_allowed: [3,4,5,6,7],
    rec: "ب", qty_moderate: 50, qty_max: 150, daily_freq: 1, weekly_freq: 2,
    doc_rec: "للمراحل المتأخرة — بروبيوتيك ممتاز وبروتين جيد",
    img_url: ""
  },
  {
    id: 42,
    name: "حليب اللوز بدون سكر", name_en: "Unsweetened Almond Milk", cat: "ألبان",
    cal: 15, fat: 1.2, sat_fat: 0.1, protein: 0.5, carb: 0.6, fiber: 0.3, net_carb: 0.3,
    sodium: 65, potassium: 60,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 150, qty_max: 300, daily_freq: 1, weekly_freq: 7,
    doc_rec: "بديل ممتاز للحليب — كارب منخفض جداً",
    img_url: ""
  },
  {
    id: 43,
    name: "حليب جوز الهند بدون سكر", name_en: "Unsweetened Coconut Milk", cat: "ألبان",
    cal: 230, fat: 24, sat_fat: 21, protein: 2.3, carb: 3.4, fiber: 0, net_carb: 3.4,
    sodium: 15, potassium: 263,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 150, qty_max: 300, daily_freq: 1, weekly_freq: 5,
    doc_rec: "يرفع الكيتونات بشكل ممتاز — للقهوة والكاري الكيتوني",
    img_url: ""
  },

  /* ══════════════════════════════════════
     الفئة: مكسرات
  ══════════════════════════════════════ */

  {
    id: 44,
    name: "بيكان (جوز الأمريكي)", name_en: "Pecans", cat: "مكسرات",
    cal: 691, fat: 72, sat_fat: 6.2, protein: 9.2, carb: 14, fiber: 9.6, net_carb: 4.4,
    sodium: 0, potassium: 410,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 20, qty_max: 40, daily_freq: 2, weekly_freq: 7,
    doc_rec: "أفضل مكسرات للكيتو — أعلى نسبة دهون وأقل كارب",
    img_url: ""
  },
  {
    id: 45,
    name: "مكاديميا", name_en: "Macadamia Nuts", cat: "مكسرات",
    cal: 718, fat: 76, sat_fat: 12, protein: 7.9, carb: 13, fiber: 8.6, net_carb: 4.4,
    sodium: 5, potassium: 368,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 15, qty_max: 30, daily_freq: 1, weekly_freq: 7,
    doc_rec: "مع البيكان الأفضل كيتونياً — نسبة دهون/كارب مثالية",
    img_url: ""
  },
  {
    id: 46,
    name: "لوز", name_en: "Almonds", cat: "مكسرات",
    cal: 579, fat: 50, sat_fat: 3.8, protein: 21, carb: 22, fiber: 12, net_carb: 10,
    sodium: 1, potassium: 733,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 30, qty_max: 60, daily_freq: 2, weekly_freq: 7,
    doc_rec: "غني بالمغنيسيوم — مفيد لتشنجات الكيتو الأولى",
    img_url: ""
  },
  {
    id: 47,
    name: "جوز عادي (عين الجمل)", name_en: "Walnuts", cat: "مكسرات",
    cal: 654, fat: 65, sat_fat: 6.1, protein: 15, carb: 14, fiber: 6.7, net_carb: 7.3,
    sodium: 2, potassium: 441,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 20, qty_max: 40, daily_freq: 2, weekly_freq: 7,
    doc_rec: "غني بالأوميغا 3 النباتي — مضاد التهاب ممتاز",
    img_url: ""
  },
  {
    id: 48,
    name: "جوز برازيلي", name_en: "Brazil Nuts", cat: "مكسرات",
    cal: 659, fat: 67, sat_fat: 15, protein: 14, carb: 12, fiber: 7.5, net_carb: 4.5,
    sodium: 3, potassium: 597,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 10, qty_max: 20, daily_freq: 2, weekly_freq: 7,
    doc_rec: "حبة أو حبتان يومياً تكفيان للسيلينيوم اليومي",
    img_url: ""
  },
  {
    id: 49,
    name: "فول سوداني", name_en: "Peanuts", cat: "مكسرات",
    cal: 567, fat: 49, sat_fat: 6.8, protein: 26, carb: 16, fiber: 8.5, net_carb: 7.5,
    sodium: 18, potassium: 705,
    keto_class: 1, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "ب", qty_moderate: 20, qty_max: 40, daily_freq: 2, weekly_freq: 4,
    doc_rec: "بقوليات تقنياً — مقبول في المراحل المتأخرة بكميات معتدلة",
    img_url: ""
  },
  {
    id: 50,
    name: "بندق", name_en: "Hazelnuts", cat: "مكسرات",
    cal: 628, fat: 61, sat_fat: 4.5, protein: 15, carb: 17, fiber: 9.7, net_carb: 7.3,
    sodium: 0, potassium: 680,
    keto_class: 1, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "ب", qty_moderate: 15, qty_max: 30, daily_freq: 1, weekly_freq: 4,
    doc_rec: "مقبول — أعلى كارباً من البيكان والمكاديميا",
    img_url: ""
  },
  {
    id: 51,
    name: "صنوبر", name_en: "Pine Nuts", cat: "مكسرات",
    cal: 673, fat: 68, sat_fat: 4.9, protein: 14, carb: 13, fiber: 3.7, net_carb: 9.3,
    sodium: 2, potassium: 597,
    keto_class: 1, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "ب", qty_moderate: 10, qty_max: 20, daily_freq: 1, weekly_freq: 4,
    doc_rec: "للسلطات والأطباق — مكلف نسبياً",
    img_url: ""
  },
  {
    id: 52,
    name: "فستق", name_en: "Pistachios", cat: "مكسرات",
    cal: 562, fat: 45, sat_fat: 5.6, protein: 20, carb: 28, fiber: 10, net_carb: 18,
    sodium: 1, potassium: 1025,
    keto_class: 1, health_class: "أ",
    phases_allowed: [4,5,6,7],
    rec: "ب", qty_moderate: 10, qty_max: 20, daily_freq: 1, weekly_freq: 4,
    doc_rec: "كارب مرتفع نسبياً — للمراحل المتأخرة فقط بكميات صغيرة",
    img_url: ""
  },
  {
    id: 53,
    name: "كاجو", name_en: "Cashews", cat: "مكسرات",
    cal: 553, fat: 44, sat_fat: 7.8, protein: 18, carb: 30, fiber: 3.3, net_carb: 26.7,
    sodium: 12, potassium: 660,
    keto_class: 2, health_class: "ب",
    phases_allowed: [6,7],
    rec: "ج", qty_moderate: 15, qty_max: 30, daily_freq: 2, weekly_freq: 3,
    doc_rec: "كارب عالٍ جداً — تجنبه في المراحل الأولى، محدود جداً في المتأخرة",
    img_url: ""
  },
  {
    id: 54,
    name: "مكسرات مشكلة", name_en: "Mixed Nuts", cat: "مكسرات",
    cal: 607, fat: 54, sat_fat: 7.2, protein: 16, carb: 21, fiber: 7.4, net_carb: 13.6,
    sodium: 5, potassium: 600,
    keto_class: 1, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "ب", qty_moderate: 20, qty_max: 40, daily_freq: 2, weekly_freq: 7,
    doc_rec: "راقب المكونات — تأكد أنها بدون كاجو أو فستق بكمية عالية",
    img_url: ""
  },

  /* ══════════════════════════════════════
     الفئة: بذور
  ══════════════════════════════════════ */

  {
    id: 55,
    name: "بذور الشيا", name_en: "Chia Seeds", cat: "بذور",
    cal: 486, fat: 31, sat_fat: 3.3, protein: 17, carb: 42, fiber: 34, net_carb: 8,
    sodium: 16, potassium: 407,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 15, qty_max: 30, daily_freq: 2, weekly_freq: 7,
    doc_rec: "غنية بالأوميغا 3 والألياف — تمتص الماء وتزيد الشبع",
    img_url: ""
  },
  {
    id: 56,
    name: "بذور الكتان", name_en: "Flaxseeds", cat: "بذور",
    cal: 534, fat: 42, sat_fat: 3.7, protein: 18, carb: 29, fiber: 27, net_carb: 2,
    sodium: 30, potassium: 813,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 15, qty_max: 30, daily_freq: 2, weekly_freq: 7,
    doc_rec: "اطحنها قبل الأكل لتحسين الامتصاص — أوميغا 3 وألياف ممتازة",
    img_url: ""
  },
  {
    id: 57,
    name: "بذور السمسم", name_en: "Sesame Seeds", cat: "بذور",
    cal: 573, fat: 50, sat_fat: 7, protein: 18, carb: 23, fiber: 11, net_carb: 12,
    sodium: 11, potassium: 468,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 15, qty_max: 30, daily_freq: 2, weekly_freq: 7,
    doc_rec: "غنية بالكالسيوم — مثالية على السلطات والأطباق",
    img_url: ""
  },
  {
    id: 58,
    name: "بذور دوار الشمس", name_en: "Sunflower Seeds", cat: "بذور",
    cal: 584, fat: 51, sat_fat: 5.4, protein: 21, carb: 20, fiber: 8.6, net_carb: 11.4,
    sodium: 9, potassium: 645,
    keto_class: 1, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "أ", qty_moderate: 20, qty_max: 40, daily_freq: 2, weekly_freq: 5,
    doc_rec: "غنية بفيتامين E — وجبة خفيفة جيدة",
    img_url: ""
  },
  {
    id: 59,
    name: "بذور اليقطين", name_en: "Pumpkin Seeds", cat: "بذور",
    cal: 559, fat: 49, sat_fat: 8.7, protein: 30, carb: 10.7, fiber: 6, net_carb: 4.7,
    sodium: 7, potassium: 919,
    keto_class: 1, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "أ", qty_moderate: 20, qty_max: 40, daily_freq: 2, weekly_freq: 5,
    doc_rec: "أعلى بروتيناً بين البذور — غنية بالزنك والمغنيسيوم",
    img_url: ""
  },
  {
    id: 60,
    name: "جوز الهند المجفف", name_en: "Desiccated Coconut (unsweetened)", cat: "بذور",
    cal: 660, fat: 65, sat_fat: 58, protein: 6.9, carb: 23, fiber: 15, net_carb: 8,
    sodium: 37, potassium: 543,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 15, qty_max: 30, daily_freq: 2, weekly_freq: 7,
    doc_rec: "بدون سكر مضاف — للتحلية الكيتونية والوصفات",
    img_url: ""
  },

  /* ══════════════════════════════════════
     الفئة: خضار
  ══════════════════════════════════════ */

  {
    id: 61,
    name: "أفوكادو", name_en: "Avocado", cat: "خضار",
    cal: 160, fat: 15, sat_fat: 2.1, protein: 2.0, carb: 8.5, fiber: 6.7, net_carb: 1.8,
    sodium: 7, potassium: 485,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 150, qty_max: 300, daily_freq: 2, weekly_freq: 7,
    doc_rec: "سوبرفود الكيتو — دهون صحية وبوتاسيوم ومغنيسيوم",
    img_url: ""
  },
  {
    id: 62,
    name: "جرجير", name_en: "Arugula (Rocket)", cat: "خضار",
    cal: 25, fat: 0.7, sat_fat: 0.1, protein: 2.6, carb: 3.7, fiber: 1.6, net_carb: 2.1,
    sodium: 27, potassium: 369,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 60, qty_max: 100, daily_freq: 3, weekly_freq: 7,
    doc_rec: "خضار ورقية رائعة — مضاد أكسدة قوي",
    img_url: ""
  },
  {
    id: 63,
    name: "خس (بأنواعه)", name_en: "Lettuce", cat: "خضار",
    cal: 17, fat: 0.3, sat_fat: 0.0, protein: 1.2, carb: 3.3, fiber: 2.1, net_carb: 1.2,
    sodium: 8, potassium: 247,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 100, qty_max: 200, daily_freq: 3, weekly_freq: 7,
    doc_rec: "أساس السلطات — كارب شبه معدوم",
    img_url: ""
  },
  {
    id: 64,
    name: "سبانخ طازجة", name_en: "Fresh Spinach", cat: "خضار",
    cal: 23, fat: 0.4, sat_fat: 0.1, protein: 2.9, carb: 3.6, fiber: 2.2, net_carb: 1.4,
    sodium: 79, potassium: 558,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 50, qty_max: 100, daily_freq: 1, weekly_freq: 2,
    doc_rec: "غنية بالحديد والبوتاسيوم والمغنيسيوم",
    img_url: ""
  },
  {
    id: 65,
    name: "ملفوف (كرنب)", name_en: "Cabbage", cat: "خضار",
    cal: 25, fat: 0.1, sat_fat: 0.0, protein: 1.3, carb: 5.8, fiber: 2.5, net_carb: 3.3,
    sodium: 18, potassium: 170,
    keto_class: 2, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "ب", qty_moderate: 90, qty_max: 180, daily_freq: 2, weekly_freq: 5,
    doc_rec: "منخفض الكارب — جيد مطبوخاً أو للتخليل",
    img_url: ""
  },
  {
    id: 66,
    name: "كرفس", name_en: "Celery", cat: "خضار",
    cal: 16, fat: 0.2, sat_fat: 0.0, protein: 0.7, carb: 3.0, fiber: 1.6, net_carb: 1.4,
    sodium: 80, potassium: 260,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 120, qty_max: 200, daily_freq: 2, weekly_freq: 7,
    doc_rec: "وجبة خفيفة مثالية مع الجبنة الكريمية أو الطحينة",
    img_url: ""
  },
  {
    id: 67,
    name: "هليون (أسباراجس)", name_en: "Asparagus", cat: "خضار",
    cal: 20, fat: 0.1, sat_fat: 0.0, protein: 2.2, carb: 3.9, fiber: 2.1, net_carb: 1.8,
    sodium: 2, potassium: 202,
    keto_class: 2, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "أ", qty_moderate: 135, qty_max: 200, daily_freq: 1, weekly_freq: 7,
    doc_rec: "مدر للبول — يساعد في التخلص من السوائل المتراكمة",
    img_url: ""
  },
  {
    id: 68,
    name: "فطر (مشروم)", name_en: "Mushrooms", cat: "خضار",
    cal: 22, fat: 0.3, sat_fat: 0.0, protein: 3.1, carb: 3.3, fiber: 1.0, net_carb: 2.3,
    sodium: 5, potassium: 318,
    keto_class: 2, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "أ", qty_moderate: 70, qty_max: 200, daily_freq: 1, weekly_freq: 3,
    doc_rec: "مصدر ممتاز لفيتامين D — اطبخه بالزبدة لرفع الدهون",
    img_url: ""
  },
  {
    id: 69,
    name: "بروكلي", name_en: "Broccoli", cat: "خضار",
    cal: 34, fat: 0.4, sat_fat: 0.1, protein: 2.8, carb: 7.0, fiber: 2.6, net_carb: 4.4,
    sodium: 33, potassium: 316,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 90, qty_max: 180, daily_freq: 2, weekly_freq: 7,
    doc_rec: "مضاد للسرطان وداعم المناعة — يمكن أكله نيئاً أو مطبوخاً",
    img_url: ""
  },
  {
    id: 70,
    name: "قرنبيط (زهرة)", name_en: "Cauliflower", cat: "خضار",
    cal: 25, fat: 0.3, sat_fat: 0.1, protein: 2.0, carb: 5.0, fiber: 2.0, net_carb: 3.0,
    sodium: 30, potassium: 303,
    keto_class: 2, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "أ", qty_moderate: 100, qty_max: 200, daily_freq: 1, weekly_freq: 5,
    doc_rec: "بديل الرز والمعكرونة في الكيتو — متعدد الاستخدامات",
    img_url: ""
  },
  {
    id: 71,
    name: "فلفل رومي أخضر", name_en: "Green Bell Pepper", cat: "خضار",
    cal: 20, fat: 0.2, sat_fat: 0.0, protein: 0.9, carb: 4.6, fiber: 1.7, net_carb: 2.9,
    sodium: 3, potassium: 175,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 150, qty_max: 300, daily_freq: 1, weekly_freq: 7,
    doc_rec: "أقل كارباً من الأحمر والأصفر — للسلطات والطهي",
    img_url: ""
  },
  {
    id: 72,
    name: "فلفل رومي أحمر / أصفر", name_en: "Red/Yellow Bell Pepper", cat: "خضار",
    cal: 31, fat: 0.3, sat_fat: 0.0, protein: 1.0, carb: 6.0, fiber: 2.1, net_carb: 3.9,
    sodium: 4, potassium: 211,
    keto_class: 2, health_class: "أ",
    phases_allowed: [3,4,5,6,7],
    rec: "ب", qty_moderate: 75, qty_max: 150, daily_freq: 1, weekly_freq: 3,
    doc_rec: "فيتامين C عالٍ — كارب أعلى من الأخضر، للمراحل المتأخرة",
    img_url: ""
  },
  {
    id: 73,
    name: "كوسا (كوسة)", name_en: "Zucchini", cat: "خضار",
    cal: 17, fat: 0.3, sat_fat: 0.1, protein: 1.2, carb: 3.1, fiber: 1.0, net_carb: 2.1,
    sodium: 8, potassium: 261,
    keto_class: 2, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "أ", qty_moderate: 120, qty_max: 250, daily_freq: 1, weekly_freq: 3,
    doc_rec: "مثالية للـ Zoodles بديل المعكرونة — قليلة الكارب",
    img_url: ""
  },
  {
    id: 74,
    name: "خيار", name_en: "Cucumber", cat: "خضار",
    cal: 16, fat: 0.1, sat_fat: 0.0, protein: 0.7, carb: 3.6, fiber: 0.5, net_carb: 3.1,
    sodium: 2, potassium: 147,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 100, qty_max: 200, daily_freq: 3, weekly_freq: 7,
    doc_rec: "للسلطات والوجبات الخفيفة — ترطيب ممتاز",
    img_url: ""
  },
  {
    id: 75,
    name: "طماطم", name_en: "Tomatoes", cat: "خضار",
    cal: 18, fat: 0.2, sat_fat: 0.0, protein: 0.9, carb: 3.9, fiber: 1.2, net_carb: 2.7,
    sodium: 5, potassium: 237,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 100, qty_max: 200, daily_freq: 1, weekly_freq: 7,
    doc_rec: "مصدر اللايكوبين — غنية بالبوتاسيوم",
    img_url: ""
  },
  {
    id: 76,
    name: "باذنجان", name_en: "Eggplant / Aubergine", cat: "خضار",
    cal: 25, fat: 0.2, sat_fat: 0.0, protein: 1.0, carb: 5.9, fiber: 3.0, net_carb: 2.9,
    sodium: 2, potassium: 229,
    keto_class: 2, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "أ", qty_moderate: 80, qty_max: 200, daily_freq: 1, weekly_freq: 5,
    doc_rec: "مثالي للمطبخ العربي — يمتص الدهون ويصبح ممتازاً مع زيت الزيتون",
    img_url: ""
  },
  {
    id: 77,
    name: "ليمون", name_en: "Lemon", cat: "خضار",
    cal: 29, fat: 0.3, sat_fat: 0.0, protein: 1.1, carb: 9.3, fiber: 2.8, net_carb: 6.5,
    sodium: 2, potassium: 138,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 60, qty_max: 300, daily_freq: 3, weekly_freq: 7,
    doc_rec: "عصير الليمون يحسن امتصاص الحديد ويضيف نكهة بدون كارب مرتفع",
    img_url: ""
  },
  {
    id: 78,
    name: "بصل أخضر", name_en: "Green Onion / Scallion", cat: "خضار",
    cal: 32, fat: 0.2, sat_fat: 0.0, protein: 1.8, carb: 7.3, fiber: 2.6, net_carb: 4.7,
    sodium: 16, potassium: 276,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 50, qty_max: 100, daily_freq: 3, weekly_freq: 7,
    doc_rec: "للتزيين والنكهة — كميات صغيرة جداً",
    img_url: ""
  },
  {
    id: 79,
    name: "ثوم", name_en: "Garlic", cat: "خضار",
    cal: 149, fat: 0.5, sat_fat: 0.1, protein: 6.4, carb: 33, fiber: 2.1, net_carb: 30.9,
    sodium: 17, potassium: 401,
    keto_class: 3, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 10, qty_max: 15, daily_freq: 1, weekly_freq: 7,
    doc_rec: "الكميات المستخدمة للطهي صغيرة — التأثير على الكارب ضئيل",
    img_url: ""
  },
  {
    id: 80,
    name: "بصل أحمر / أصفر", name_en: "Onion (red/yellow)", cat: "خضار",
    cal: 40, fat: 0.1, sat_fat: 0.0, protein: 1.1, carb: 9.3, fiber: 1.7, net_carb: 7.6,
    sodium: 4, potassium: 146,
    keto_class: 3, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "ب", qty_moderate: 50, qty_max: 150, daily_freq: 2, weekly_freq: 5,
    doc_rec: "كارب مرتفع نسبياً — استخدم كميات صغيرة للنكهة",
    img_url: ""
  },
  {
    id: 81,
    name: "أوراق ملوخية", name_en: "Molokhia Leaves", cat: "خضار",
    cal: 43, fat: 0.7, sat_fat: 0.1, protein: 4.8, carb: 7.6, fiber: 1.0, net_carb: 6.6,
    sodium: 87, potassium: 303,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 30, qty_max: 90, daily_freq: 1, weekly_freq: 2,
    doc_rec: "غنية بالحديد والكالسيوم — منتشرة في المطبخ العربي",
    img_url: ""
  },
  {
    id: 82,
    name: "فاصوليا خضراء (لوبيا)", name_en: "Green Beans", cat: "خضار",
    cal: 31, fat: 0.2, sat_fat: 0.0, protein: 1.8, carb: 7.1, fiber: 3.4, net_carb: 3.7,
    sodium: 6, potassium: 211,
    keto_class: 2, health_class: "أ",
    phases_allowed: [4,5,6,7],
    rec: "أ", qty_moderate: 100, qty_max: 300, daily_freq: 1, weekly_freq: 2,
    doc_rec: "مقبولة في المراحل المتأخرة — ألياف جيدة",
    img_url: ""
  },

  /* ══════════════════════════════════════
     الفئة: فواكه
  ══════════════════════════════════════ */

  {
    id: 83,
    name: "فراولة", name_en: "Strawberries", cat: "فواكه",
    cal: 32, fat: 0.3, sat_fat: 0.0, protein: 0.7, carb: 7.7, fiber: 2.0, net_carb: 5.7,
    sodium: 1, potassium: 153,
    keto_class: 2, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "أ", qty_moderate: 50, qty_max: 150, daily_freq: 1, weekly_freq: 7,
    doc_rec: "أقل كارباً من معظم الفواكه — مضاد أكسدة ممتاز",
    img_url: ""
  },
  {
    id: 84,
    name: "توت أزرق", name_en: "Blueberries", cat: "فواكه",
    cal: 57, fat: 0.3, sat_fat: 0.0, protein: 0.7, carb: 14, fiber: 2.4, net_carb: 11.6,
    sodium: 1, potassium: 77,
    keto_class: 2, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "أ", qty_moderate: 20, qty_max: 40, daily_freq: 1, weekly_freq: 7,
    doc_rec: "كارب معتدل — كميات صغيرة جداً، مضاد أكسدة استثنائي",
    img_url: ""
  },
  {
    id: 85,
    name: "توت أسود / أحمر", name_en: "Blackberries / Raspberries", cat: "فواكه",
    cal: 43, fat: 0.5, sat_fat: 0.0, protein: 1.4, carb: 10, fiber: 5.3, net_carb: 4.7,
    sodium: 1, potassium: 162,
    keto_class: 2, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "أ", qty_moderate: 50, qty_max: 100, daily_freq: 1, weekly_freq: 7,
    doc_rec: "ألياف عالية وكارب صافٍ منخفض — من أفضل فواكه الكيتو",
    img_url: ""
  },
  {
    id: 86,
    name: "جوافة", name_en: "Guava", cat: "فواكه",
    cal: 68, fat: 1.0, sat_fat: 0.3, protein: 2.6, carb: 14, fiber: 5.4, net_carb: 8.6,
    sodium: 2, potassium: 417,
    keto_class: 2, health_class: "أ",
    phases_allowed: [3,4,5,6,7],
    rec: "أ", qty_moderate: 50, qty_max: 100, daily_freq: 1, weekly_freq: 3,
    doc_rec: "غنية بفيتامين C — مقبولة في المراحل المتأخرة",
    img_url: ""
  },
  {
    id: 87,
    name: "تفاح بأنواعه", name_en: "Apple", cat: "فواكه",
    cal: 52, fat: 0.2, sat_fat: 0.0, protein: 0.3, carb: 14, fiber: 2.4, net_carb: 11.6,
    sodium: 1, potassium: 107,
    keto_class: 3, health_class: "أ",
    phases_allowed: [6,7],
    rec: "ب", qty_moderate: 50, qty_max: 100, daily_freq: 1, weekly_freq: 1,
    doc_rec: "كارب مرتفع — للمرحلة السادسة والسابعة فقط وبكميات صغيرة جداً",
    img_url: ""
  },
  {
    id: 88,
    name: "موز", name_en: "Banana", cat: "فواكه",
    cal: 89, fat: 0.3, sat_fat: 0.1, protein: 1.1, carb: 23, fiber: 2.6, net_carb: 20.4,
    sodium: 1, potassium: 358,
    keto_class: 3, health_class: "أ",
    phases_allowed: [6,7],
    rec: "ج", qty_moderate: 30, qty_max: 50, daily_freq: 1, weekly_freq: 1,
    doc_rec: "سكر عالٍ جداً — تجنبه في جميع المراحل إلا كميات ضئيلة في 6 و7",
    img_url: ""
  },
  {
    id: 89,
    name: "مانجو", name_en: "Mango", cat: "فواكه",
    cal: 60, fat: 0.4, sat_fat: 0.1, protein: 0.8, carb: 15, fiber: 1.6, net_carb: 13.4,
    sodium: 1, potassium: 168,
    keto_class: 3, health_class: "أ",
    phases_allowed: [6,7],
    rec: "ج", qty_moderate: 20, qty_max: 40, daily_freq: 1, weekly_freq: 1,
    doc_rec: "كارب مرتفع جداً — تجنبه في المراحل الأولى بالكامل",
    img_url: ""
  },
  {
    id: 90,
    name: "تمر", name_en: "Dates", cat: "فواكه",
    cal: 277, fat: 0.2, sat_fat: 0.0, protein: 1.8, carb: 75, fiber: 6.7, net_carb: 68.3,
    sodium: 1, potassium: 696,
    keto_class: 3, health_class: "أ",
    phases_allowed: [4,5,6,7],
    phase_notes: { 4: "حبة واحدة بعد الرياضة فقط", 6: "1-2 تمرة بشكل محدود" },
    rec: "ب", qty_moderate: 10, qty_max: 30, daily_freq: 1, weekly_freq: 3,
    doc_rec: "كارب مرتفع جداً — مسموح بشكل محدود جداً في المراحل المتأخرة",
    img_url: ""
  },

  /* ══════════════════════════════════════
     الفئة: مشروبات وسوائل
  ══════════════════════════════════════ */

  {
    id: 91,
    name: "قهوة سادة", name_en: "Black Coffee", cat: "مشروبات",
    cal: 2, fat: 0, sat_fat: 0, protein: 0.3, carb: 0, fiber: 0, net_carb: 0,
    sodium: 5, potassium: 116,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 250, qty_max: 500, daily_freq: 1, weekly_freq: 7,
    doc_rec: "تعزز الكيتونات وتكبح الشهية — لا تتجاوز 2-3 أكواب يومياً",
    img_url: ""
  },
  {
    id: 92,
    name: "شاي أخضر / أسود سادة", name_en: "Plain Tea", cat: "مشروبات",
    cal: 1, fat: 0, sat_fat: 0, protein: 0, carb: 0.2, fiber: 0, net_carb: 0.2,
    sodium: 3, potassium: 37,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 250, qty_max: 500, daily_freq: 1, weekly_freq: 7,
    doc_rec: "مضاد أكسدة ممتاز — بدون سكر",
    img_url: ""
  },
  {
    id: 93,
    name: "مرق العظام", name_en: "Bone Broth", cat: "مشروبات",
    cal: 40, fat: 1.0, sat_fat: 0.4, protein: 6, carb: 1, fiber: 0, net_carb: 1,
    sodium: 500, potassium: 150,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 500, qty_max: 1000, daily_freq: 2, weekly_freq: 7,
    doc_rec: "مصدر الكولاجين والصوديوم والبوتاسيوم — ضروري في الأسبوع الأول",
    img_url: ""
  },

  /* ══════════════════════════════════════
     الفئة: محليات بديلة
  ══════════════════════════════════════ */

  {
    id: 94,
    name: "ستيفيا بيضاء (بودرة)", name_en: "White Stevia Powder", cat: "محليات",
    cal: 0, fat: 0, sat_fat: 0, protein: 0, carb: 0.1, fiber: 0, net_carb: 0,
    sodium: 0, potassium: 0,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 0.1, qty_max: 0.3, daily_freq: 1, weekly_freq: 7,
    doc_rec: "الأفضل والأكثر أماناً — صفر تأثير على الأنسولين",
    img_url: ""
  },
  {
    id: 95,
    name: "مونك فروت (فاكهة الراهب)", name_en: "Monk Fruit Sweetener", cat: "محليات",
    cal: 0, fat: 0, sat_fat: 0, protein: 0, carb: 0.1, fiber: 0, net_carb: 0,
    sodium: 0, potassium: 0,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 0.1, qty_max: 0.2, daily_freq: 1, weekly_freq: 7,
    doc_rec: "صفر كالوري وصفر تأثير على السكر — مع ستيفيا الأفضل",
    img_url: ""
  },
  {
    id: 96,
    name: "إيريثريتول", name_en: "Erythritol", cat: "محليات",
    cal: 20, fat: 0, sat_fat: 0, protein: 0, carb: 5, fiber: 0, net_carb: 0,
    sodium: 0, potassium: 0,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 10, qty_max: 30, daily_freq: 1, weekly_freq: 7,
    doc_rec: "لا يُحسب ضمن الكارب الصافي — ممتاز للحلويات الكيتونية",
    img_url: ""
  },
  {
    id: 97,
    name: "إيللوز (Allulose)", name_en: "Allulose", cat: "محليات",
    cal: 20, fat: 0, sat_fat: 0, protein: 0, carb: 5, fiber: 0, net_carb: 0,
    sodium: 0, potassium: 0,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 5, qty_max: 15, daily_freq: 1, weekly_freq: 7,
    doc_rec: "لا يرفع السكر أو الأنسولين — ممتاز للكاراميل والمخبوزات",
    img_url: ""
  },
  {
    id: 98,
    name: "زيليتول", name_en: "Xylitol", cat: "محليات",
    cal: 240, fat: 0, sat_fat: 0, protein: 0, carb: 60, fiber: 0, net_carb: 40,
    sodium: 0, potassium: 0,
    keto_class: 2, health_class: "أ",
    phases_allowed: [3,4,5,6,7],
    rec: "ب", qty_moderate: 5, qty_max: 20, daily_freq: 1, weekly_freq: 3,
    doc_rec: "تأثير جزئي على الأنسولين — مقبول بكميات معتدلة، يضر الكلاب",
    img_url: ""
  },
  {
    id: 99,
    name: "مالتيتول", name_en: "Maltitol", cat: "محليات",
    cal: 210, fat: 0, sat_fat: 0, protein: 0, carb: 75, fiber: 0, net_carb: 50,
    sodium: 0, potassium: 0,
    keto_class: 3, health_class: "ج",
    phases_allowed: [6,7],
    rec: "ج", qty_moderate: 5, qty_max: 10, daily_freq: 1, weekly_freq: 1,
    doc_rec: "تجنبه — يرفع السكر والأنسولين بشكل ملحوظ رغم تسميته 'محلي بديل'",
    img_url: ""
  },

  /* ══════════════════════════════════════
     الفئة: بهارات وتوابل
  ══════════════════════════════════════ */

  {
    id: 100,
    name: "ملح هيمالايا وردي", name_en: "Himalayan Pink Salt", cat: "توابل",
    cal: 0, fat: 0, sat_fat: 0, protein: 0, carb: 0, fiber: 0, net_carb: 0,
    sodium: 2000, potassium: 0,
    keto_class: 2, health_class: "ب",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 5, qty_max: 15, daily_freq: 3, weekly_freq: 7,
    doc_rec: "أهم توابل الكيتو في الأسابيع الأولى — يعوض الصوديوم المفقود",
    img_url: ""
  },
  {
    id: 101,
    name: "كركم", name_en: "Turmeric", cat: "توابل",
    cal: 354, fat: 9.9, sat_fat: 3.1, protein: 7.8, carb: 65, fiber: 21, net_carb: 44,
    sodium: 38, potassium: 2525,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 5, qty_max: 15, daily_freq: 3, weekly_freq: 7,
    doc_rec: "مضاد التهاب قوي — الكميات المستخدمة للطهي صغيرة جداً",
    img_url: ""
  },
  {
    id: 102,
    name: "قرفة", name_en: "Cinnamon", cat: "توابل",
    cal: 247, fat: 1.2, sat_fat: 0.3, protein: 4.0, carb: 81, fiber: 53, net_carb: 28,
    sodium: 10, potassium: 431,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 1, qty_max: 5, daily_freq: 3, weekly_freq: 7,
    doc_rec: "تحسن حساسية الأنسولين — للقهوة والحلويات الكيتونية",
    img_url: ""
  },
  {
    id: 103,
    name: "خل التفاح", name_en: "Apple Cider Vinegar", cat: "توابل",
    cal: 21, fat: 0, sat_fat: 0, protein: 0, carb: 0.9, fiber: 0, net_carb: 0.9,
    sodium: 5, potassium: 73,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 5, qty_max: 10, daily_freq: 2, weekly_freq: 7,
    doc_rec: "يحسن حساسية الأنسولين وهضم الدهون — 5مل مع الماء قبل الوجبة",
    img_url: ""
  },

  /* ══════════════════════════════════════
     الفئة: بدائل الدقيق والطبخ
  ══════════════════════════════════════ */

  {
    id: 104,
    name: "دقيق اللوز", name_en: "Almond Flour", cat: "بدائل",
    cal: 579, fat: 50, sat_fat: 3.8, protein: 21, carb: 22, fiber: 12, net_carb: 10,
    sodium: 1, potassium: 733,
    keto_class: 1, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "أ", qty_moderate: 30, qty_max: 100, daily_freq: 3, weekly_freq: 7,
    doc_rec: "أفضل بديل للدقيق — للمخبوزات الكيتونية والبانيه",
    img_url: ""
  },
  {
    id: 105,
    name: "دقيق جوز الهند", name_en: "Coconut Flour", cat: "بدائل",
    cal: 400, fat: 14, sat_fat: 12, protein: 18, carb: 58, fiber: 39, net_carb: 19,
    sodium: 63, potassium: 1413,
    keto_class: 2, health_class: "أ",
    phases_allowed: [4,5,6,7],
    rec: "أ", qty_moderate: 15, qty_max: 50, daily_freq: 1, weekly_freq: 5,
    doc_rec: "يمتص الماء أكثر من دقيق اللوز — استخدم كمية أقل",
    img_url: ""
  },
  {
    id: 106,
    name: "قشور السيليوم / إسبغول", name_en: "Psyllium Husk", cat: "بدائل",
    cal: 200, fat: 1, sat_fat: 0, protein: 2, carb: 85, fiber: 80, net_carb: 5,
    sodium: 10, potassium: 0,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 15, qty_max: 30, daily_freq: 3, weekly_freq: 7,
    doc_rec: "يحسن قوام المخبوزات الكيتونية — ألياف قابلة للذوبان",
    img_url: ""
  },
  {
    id: 107,
    name: "مصل بروتين معزول (Whey Isolate)", name_en: "Whey Protein Isolate", cat: "بدائل",
    cal: 370, fat: 1, sat_fat: 0, protein: 90, carb: 3, fiber: 0, net_carb: 3,
    sodium: 40, potassium: 160,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 25, qty_max: 50, daily_freq: 1, weekly_freq: 7,
    doc_rec: "للرياضيين — للمساعدة في الوصول لهدف البروتين",
    img_url: ""
  },
  {
    id: 108,
    name: "زبدة لوز بدون سكر", name_en: "Almond Butter (no sugar)", cat: "بدائل",
    cal: 614, fat: 56, sat_fat: 4.2, protein: 21, carb: 19, fiber: 10, net_carb: 9,
    sodium: 7, potassium: 732,
    keto_class: 1, health_class: "أ",
    phases_allowed: [4,5,6,7],
    rec: "أ", qty_moderate: 15, qty_max: 30, daily_freq: 1, weekly_freq: 5,
    doc_rec: "قرأ المكونات — بدون سكر أو زيوت نباتية مهدرجة",
    img_url: ""
  },

  /* ══════════════════════════════════════
     الفئة: أصناف يُتجنب بشكل عام
  ══════════════════════════════════════ */

  {
    id: 109,
    name: "رز أبيض / أسمر", name_en: "White / Brown Rice", cat: "حبوب",
    cal: 130, fat: 0.3, sat_fat: 0.1, protein: 2.7, carb: 28, fiber: 0.4, net_carb: 27.6,
    sodium: 1, potassium: 35,
    keto_class: 3, health_class: "ب",
    phases_allowed: [6,7],
    phase_notes: { 6: "15-45غ فقط مع وجبة رئيسية" },
    rec: "ج", qty_moderate: 15, qty_max: 45, daily_freq: 1, weekly_freq: 1,
    doc_rec: "ممنوع في المراحل الأولى — محدود جداً في مرحلة التثبيت",
    img_url: ""
  },
  {
    id: 110,
    name: "خبز ومعجنات", name_en: "Bread & Pastries", cat: "حبوب",
    cal: 265, fat: 3.2, sat_fat: 0.7, protein: 9, carb: 49, fiber: 2.7, net_carb: 46.3,
    sodium: 491, potassium: 107,
    keto_class: 3, health_class: "ج",
    phases_allowed: [6,7],
    rec: "ج", qty_moderate: 5, qty_max: 10, daily_freq: 1, weekly_freq: 1,
    doc_rec: "ممنوع في جميع مراحل البروتوكول — مصدر التهاب رئيسي",
    img_url: ""
  },
  {
    id: 111,
    name: "سكر أبيض / بني", name_en: "White / Brown Sugar", cat: "سكريات",
    cal: 387, fat: 0, sat_fat: 0, protein: 0, carb: 100, fiber: 0, net_carb: 100,
    sodium: 1, potassium: 2,
    keto_class: 3, health_class: "ج",
    phases_allowed: [6,7],
    rec: "ج", qty_moderate: 1, qty_max: 5, daily_freq: 1, weekly_freq: 1,
    doc_rec: "ممنوع تماماً في البروتوكول — العدو الأول للكيتوزيس",
    img_url: ""
  },
  {
    id: 112,
    name: "عصير فاكهة (مصنّع)", name_en: "Packaged Fruit Juice", cat: "مشروبات",
    cal: 45, fat: 0.1, sat_fat: 0, protein: 0.2, carb: 11, fiber: 0, net_carb: 11,
    sodium: 5, potassium: 100,
    keto_class: 3, health_class: "ج",
    phases_allowed: [6,7],
    rec: "ج", qty_moderate: 50, qty_max: 100, daily_freq: 1, weekly_freq: 1,
    doc_rec: "ممنوع — سكر مرتفع بدون ألياف. حتى الطبيعي 100% يُتجنب",
    img_url: ""
  },

  /* ══════════════════════════════════════
     الفئة: أصناف إضافية من جداول الكتاب
  ══════════════════════════════════════ */

  {
    id: 113,
    name: "زيتون بأنواعه", name_en: "Olives (all types)", cat: "خضار",
    cal: 145, fat: 15, sat_fat: 2.0, protein: 1.0, carb: 3.8, fiber: 3.3, net_carb: 0.5,
    sodium: 735, potassium: 8,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 40, qty_max: 80, daily_freq: 2, weekly_freq: 7,
    doc_rec: "وجبة خفيفة مثالية — دهون أحادية ممتازة وكارب صافٍ شبه معدوم",
    img_url: ""
  },
  {
    id: 114,
    name: "جواكامولي (أفوكادو مهروس)", name_en: "Guacamole", cat: "خضار",
    cal: 150, fat: 13, sat_fat: 2.0, protein: 2.0, carb: 8.6, fiber: 6.7, net_carb: 1.9,
    sodium: 220, potassium: 450,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 30, qty_max: 60, daily_freq: 2, weekly_freq: 7,
    doc_rec: "غراس مثالي للكيتو — أضف ليمون وملح وثوم",
    img_url: ""
  },
  {
    id: 115,
    name: "حمص بالطحينة وزيت الزيتون", name_en: "Hummus with Tahini & Olive Oil", cat: "بقوليات",
    cal: 166, fat: 9.6, sat_fat: 1.4, protein: 7.9, carb: 14, fiber: 6.0, net_carb: 8.0,
    sodium: 298, potassium: 228,
    keto_class: 2, health_class: "أ",
    phases_allowed: [2,3,4,5,6,7],
    rec: "أ", qty_moderate: 30, qty_max: 45, daily_freq: 1, weekly_freq: 2,
    doc_rec: "الحمص المعلب بالطحينة وزيت الزيتون — كميات صغيرة كغراس",
    img_url: ""
  },
  {
    id: 116,
    name: "مايونيز (بدون سكر)", name_en: "Mayonnaise (no sugar)", cat: "توابل",
    cal: 680, fat: 75, sat_fat: 11, protein: 1.0, carb: 0.6, fiber: 0, net_carb: 0.6,
    sodium: 635, potassium: 20,
    keto_class: 1, health_class: "ب",
    phases_allowed: [2,3,4,5,6,7],
    rec: "ب", qty_moderate: 15, qty_max: 30, daily_freq: 1, weekly_freq: 3,
    doc_rec: "اقرأ المكونات — اختر المصنوع بزيت أفوكادو أو زيت الزيتون",
    img_url: ""
  },
  {
    id: 117,
    name: "خردل بدون سكر", name_en: "Mustard (no sugar)", cat: "توابل",
    cal: 60, fat: 3.7, sat_fat: 0.2, protein: 3.7, carb: 5.8, fiber: 3.2, net_carb: 2.6,
    sodium: 1104, potassium: 152,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 5, qty_max: 10, daily_freq: 1, weekly_freq: 1,
    doc_rec: "مضاف ممتاز للسلطات والمايونيز — تجنب أنواع العسل",
    img_url: ""
  },
  {
    id: 118,
    name: "صلصة حامضة (Sour Cream Sauce)", name_en: "Sour Cream Sauce", cat: "توابل",
    cal: 193, fat: 19, sat_fat: 12, protein: 2.4, carb: 4.6, fiber: 0, net_carb: 4.6,
    sodium: 53, potassium: 138,
    keto_class: 1, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 30, qty_max: 60, daily_freq: 2, weekly_freq: 7,
    doc_rec: "دهون ممتازة — مع الخضار أو اللحوم",
    img_url: ""
  },
  {
    id: 119,
    name: "ماء جوز الهند الصافي", name_en: "Coconut Water (pure)", cat: "مشروبات",
    cal: 19, fat: 0.2, sat_fat: 0.1, protein: 0.7, carb: 3.7, fiber: 1.1, net_carb: 2.6,
    sodium: 105, potassium: 250,
    keto_class: 2, health_class: "أ",
    phases_allowed: [0,1,2,3,4,5,6,7],
    rec: "أ", qty_moderate: 100, qty_max: 200, daily_freq: 3, weekly_freq: 7,
    doc_rec: "إلكتروليتات طبيعية — للترطيب في الكيتو الأولى",
    img_url: ""
  },
  {
    id: 120,
    name: "كاتشب (بدون سكر مضاف)", name_en: "Sugar-Free Ketchup", cat: "توابل",
    cal: 60, fat: 0, sat_fat: 0, protein: 1.5, carb: 15, fiber: 0.5, net_carb: 14.5,
    sodium: 940, potassium: 281,
    keto_class: 3, health_class: "ج",
    phases_allowed: [6,7],
    rec: "ج", qty_moderate: 5, qty_max: 10, daily_freq: 1, weekly_freq: 1,
    doc_rec: "حتى بدون سكر — كارب مرتفع. تجنبه في المراحل الأولى",
    img_url: ""
  },
];

/* ═══════════════════════════════════════════
   HELPER FUNCTIONS
═══════════════════════════════════════════ */

/* تصنيف النسبة الكيتونية للصنف */
const KETO_LABEL_CONFIG = {
  keto_class: {
    1: { label: "كيتوني مسموح", badge: "g" },
    2: { label: "مسموح",        badge: "y" },
    3: { label: "لا ينصح به",   badge: "r" }
  },
  health_class: {
    "أ": { label: "صحي أ", color: "var(--accent)" },
    "ب": { label: "مسموح ب", color: "var(--warning)" },
    "ج": { label: "غير صحي", color: "var(--danger)" }
  },
  rec: {
    "أ": { label: "يوصي به د. عمار", badge: "g" },
    "ب": { label: "مسموح",           badge: "y" },
    "ج": { label: "لا يوصي به",      badge: "r" }
  }
};

/* الحصول على أصناف مرحلة معينة */
function getFoodsByPhase(phase) {
  return FOODS.filter(f => f.phases_allowed && f.phases_allowed.includes(phase));
}

/* الحصول على أصناف كيتونية بامتياز لمرحلة معينة */
function getKetoFoodsForPhase(phase) {
  return FOODS.filter(f =>
    f.phases_allowed &&
    f.phases_allowed.includes(phase) &&
    f.keto_class === 1 &&
    f.rec === "أ"
  );
}

/* الحصول على أصناف حسب الفئة */
function getFoodsByCategory(cat) {
  return FOODS.filter(f => f.cat === cat);
}

/* فحص إذا الصنف متاح في مرحلة معينة */
function isFoodAllowedInPhase(foodId, phase) {
  const food = FOODS.find(f => f.id === foodId);
  if (!food) return false;
  return food.phases_allowed && food.phases_allowed.includes(phase);
}

/* حساب مغذيات صنف بكمية معينة (كل القيم لكل 100غ) */
function calcFoodNutrients(foodId, qty_g) {
  const food = FOODS.find(f => f.id === foodId);
  if (!food) return null;
  const ratio = qty_g / 100;
  return {
    fid: food.id,
    name: food.name,
    qty_g,
    cal:      Math.round(food.cal      * ratio * 10) / 10,
    fat:      Math.round(food.fat      * ratio * 10) / 10,
    sat_fat:  Math.round((food.sat_fat || 0) * ratio * 10) / 10,
    protein:  Math.round(food.protein  * ratio * 10) / 10,
    carb:     Math.round(food.carb     * ratio * 10) / 10,
    fiber:    Math.round(food.fiber    * ratio * 10) / 10,
    net_carb: Math.round(food.net_carb * ratio * 10) / 10,
    sodium:   Math.round((food.sodium  || 0) * ratio),
    potassium:Math.round((food.potassium||0) * ratio),
    keto_class:    food.keto_class,
    health_class:  food.health_class,
    phases_allowed:food.phases_allowed,
    rec:           food.rec
  };
}

/* حساب النسبة الكيتونية المبسطة */
function calcSimpleKetoRatio(fat_g, protein_g, net_carb_g) {
  const denom = protein_g + net_carb_g;
  if (denom === 0) return 99;
  return Math.round((fat_g / denom) * 100) / 100;
}

/* حساب النسبة الكيتونية المتقدمة حسب مستوى النشاط */
const PROTEIN_FACTOR = {
  sedentary: 0.6,   // خامل
  light:     0.5,   // نشاط خفيف
  endurance: 0.4,   // رياضة تحمل
  strength:  0.3    // رياضة مقاومة
};

function calcAdvancedKetoRatio(fat_g, protein_g, net_carb_g, activity = "sedentary") {
  const factor = PROTEIN_FACTOR[activity] || 0.6;
  const denom = net_carb_g + (protein_g * factor);
  if (denom === 0) return 99;
  return Math.round((fat_g / denom) * 100) / 100;
}

/* أهداف النسبة الكيتونية لكل مرحلة */
const PHASE_KETO_TARGETS = {
  0: { simple: null,  advanced: null,  label: "تمهيدية — هدف سلوكي", info_only: true },
  1: { simple: 1.5,   advanced: 2.0,   label: "دخول الكيتوز" },
  2: { simple: 1.0,   advanced: 1.5,   label: "Keto Adaptation" },
  3: { simple: null,  advanced: null,  label: "خروج مؤقت", info_only: true },
  4: { simple: 0.8,   advanced: 1.2,   label: "Fat Adaptation" },
  5: { simple: 0.8,   advanced: 1.2,   label: "الاستمرارية" },
  6: { simple: 0.6,   advanced: 1.0,   label: "تثبيت النتائج" },
  7: { simple: 0.8,   advanced: 1.2,   label: "نمط حياة" }
};

/* تحديد مسمى التحفيز الكيتوني */
function getKetoMotivationLabel(ratio, phase, mode = "advanced") {
  const target = PHASE_KETO_TARGETS[phase];
  if (!target) return { label: "—", color: "var(--text3)", type: "neutral" };
  if (target.info_only) return { label: "معلوماتية فقط", color: "var(--info)", type: "info" };
  const tgt = mode === "advanced" ? target.advanced : target.simple;
  if (ratio >= tgt + 0.3) return { label: "محفز للكيتون",   color: "var(--accent)",  type: "positive" };
  if (ratio >= tgt - 0.3) return { label: "غير محفز للكيتون", color: "var(--warning)", type: "neutral"  };
  if (ratio >= 0.5)       return { label: "مثبط للكيتون",  color: "var(--danger)",  type: "negative" };
  return                         { label: "مثبط للكيتون",  color: "var(--danger)",  type: "negative" };
}

/* فئات الأطعمة الموجودة */
function getFoodCategories() {
  return [...new Set(FOODS.map(f => f.cat))];
}

/* الحصول على اقتراحات لرفع النسبة الكيتونية */
function getSuggestionsToImproveRatio(currentFat, currentProtein, currentCarb, targetRatio, phase, activity = "sedentary") {
  const suggestions = [];
  const highFatFoods = FOODS.filter(f =>
    f.phases_allowed && f.phases_allowed.includes(phase) &&
    f.fat >= 50 && f.net_carb <= 5 && f.keto_class === 1 && f.rec === "أ"
  ).slice(0, 5);

  highFatFoods.forEach(food => {
    const addQty = 20; // 20 غرام إضافية
    const addNutr = calcFoodNutrients(food.id, addQty);
    const newRatio = calcAdvancedKetoRatio(
      currentFat + addNutr.fat,
      currentProtein + addNutr.protein,
      currentCarb + addNutr.net_carb,
      activity
    );
    const improvement = newRatio - calcAdvancedKetoRatio(currentFat, currentProtein, currentCarb, activity);
    if (improvement > 0) {
      suggestions.push({
        food,
        qty: addQty,
        nutrients: addNutr,
        newRatio,
        improvement: Math.round(improvement * 100) / 100
      });
    }
  });

  return suggestions.sort((a, b) => b.improvement - a.improvement).slice(0, 3);
}
