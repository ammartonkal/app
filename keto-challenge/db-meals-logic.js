/* ═══════════════════════════════════════════════════════════════
   db-meals-logic.js — منطق بناء الوجبات الكيتونية
   تحدي الكيتو مع د. عمار تنكل
   آخر تحديث: 2026-05-25
   ───────────────────────────────────────────────────────────────
   النظام مبني على مبدأ جدول البدائل الغذائية (Exchange System):
   كل مجموعة لها حصة معيارية (std_serving) وكل أصنافها
   تعطي ماكرو متقاربة ضمن نفس الحصة.

   هيكل كل صنف في المجموعة:
   {
     fid      : رقم الصنف في FOODS (db-foods.js)
     name     : اسم العرض
     qty      : الكمية الافتراضية بالغرام (حصة معيارية)
     weight   : أولوية الاختيار 1-5 (5 = الأعلى أولوية)
     phases   : المراحل المسموحة — [] = كل المراحل
     note     : ملاحظة للمشترك (اختياري)
   }
════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════
   مجموعات البدائل (Exchange Groups)
═══════════════════════════════════════════ */
const EXCHANGE_GROUPS = {

  /* ────────────────────────────────────────
     1. بروتين الفطور
     الحصة المعيارية ≈ 14غ بروتين · 8غ دهن · 1غ كارب · ~135 سعرة
  ──────────────────────────────────────── */
  protein_breakfast: {
    name:    'بروتين الفطور',
    icon:    '🥚',
    std_serving: { protein: 14, fat: 8, carb: 1, cal: 135 },
    items: [
      { fid:10, name:'بيض كامل',              qty:120, weight:5, phases:[], note:'2 بيضتان كبيرتان — الأساس' },
      { fid:27, name:'جبن حلومي',             qty: 60, weight:5, phases:[], note:'مثالي للشوي' },
      { fid:29, name:'جبن شيدر',              qty: 45, weight:4, phases:[], note:'مع البيض أو وحده' },
      { fid:28, name:'جبن ماعز',              qty: 50, weight:4, phases:[], note:'نكهة مميزة' },
      { fid:33, name:'جبن جودا / سويسري',    qty: 45, weight:4, phases:[], note:'غني بالدهون' },
      { fid:41, name:'زبادي يوناني',          qty:150, weight:3, phases:[0,2,3,4,5,6,7], note:'مع بذور أو مكسرات' },
      { fid:36, name:'لبنة فاخرة',            qty: 80, weight:3, phases:[], note:'مع زيت زيتون' },
      { fid:31, name:'جبن بارميزان مبشور',   qty: 40, weight:3, phases:[], note:'إضافة للبيض' },
    ]
  },

  /* ────────────────────────────────────────
     2. بروتين الغداء
     الحصة المعيارية ≈ 25غ بروتين · 10غ دهن · 0غ كارب · ~190 سعرة
  ──────────────────────────────────────── */
  protein_lunch: {
    name:    'بروتين الغداء',
    icon:    '🍗',
    std_serving: { protein: 25, fat: 10, carb: 0, cal: 190 },
    items: [
      { fid:12, name:'صدر دجاج مشوي',         qty:130, weight:5, phases:[], note:'بدون جلد — بروتين نظيف' },
      { fid:11, name:'دجاج بالجلد (فخذ/جناح)', qty:130, weight:5, phases:[], note:'أكثر دهناً — ممتاز' },
      { fid:15, name:'لحم بقر معتدل الدهن',   qty:120, weight:5, phases:[], note:'شرائح أو مشوي' },
      { fid:14, name:'لحم بقر مفروم 80/20',   qty:120, weight:5, phases:[], note:'همبرغر أو مطبوخ' },
      { fid:13, name:'لحم بقر عالي الدهن',    qty:100, weight:4, phases:[], note:'قطعة دهنية — ريش/ضلوع' },
      { fid:16, name:'لحم خروف',              qty:120, weight:4, phases:[], note:'كستلتة أو مشوي' },
      { fid:17, name:'سلمون طازج',             qty:130, weight:5, phases:[], note:'أوميغا 3 عالية' },
      { fid:20, name:'سمك أبيض (هامور/نجيل)', qty:150, weight:4, phases:[], note:'خفيف الدهن — أضف زيت' },
      { fid:18, name:'سردين معلب',             qty:100, weight:3, phases:[], note:'كامل مع العظم' },
      { fid:21, name:'جمبري مشوي',             qty:150, weight:3, phases:[], note:'منخفض الدهن — أضف زبدة' },
    ]
  },

  /* ────────────────────────────────────────
     3. بروتين العشاء
     الحصة المعيارية ≈ 20غ بروتين · 12غ دهن · 1.5غ كارب · ~190 سعرة
     — أخف من الغداء ومناسب للمساء
  ──────────────────────────────────────── */
  protein_dinner: {
    name:    'بروتين العشاء',
    icon:    '🫙',
    std_serving: { protein: 20, fat: 12, carb: 1.5, cal: 190 },
    items: [
      { fid:19, name:'تونة بالماء',             qty:140, weight:5, phases:[], note:'علبة + زيت زيتون' },
      { fid:10, name:'بيض كامل',               qty:120, weight:5, phases:[], note:'2 بيضتان — مقلي أو مسلوق' },
      { fid:27, name:'جبن حلومي مشوي',         qty: 80, weight:4, phases:[], note:'مع سلطة' },
      { fid:30, name:'جبن فيتا',               qty: 80, weight:4, phases:[], note:'على السلطة أو وحده' },
      { fid:35, name:'جبنة كريمية',            qty: 80, weight:3, phases:[], note:'مع خضار أو كرفس' },
      { fid:32, name:'جبن موزاريلا',           qty: 70, weight:4, phases:[], note:'مع طماطم وزيت' },
      { fid:17, name:'سلمون دافئ',             qty:100, weight:4, phases:[], note:'من وجبة الغداء أو طازج' },
      { fid:36, name:'لبنة مع زيت زيتون',     qty:100, weight:3, phases:[], note:'خفيفة وسهلة' },
    ]
  },

  /* ────────────────────────────────────────
     4. الدهون الصلبة (للطهي والإضافة)
     الحصة المعيارية ≈ 14غ دهن · 0غ كارب · ~120 سعرة
  ──────────────────────────────────────── */
  fat_solid: {
    name:    'دهون صلبة',
    icon:    '🧈',
    std_serving: { fat: 14, carb: 0, cal: 120 },
    items: [
      { fid: 4, name:'زبدة حيوانية غير مملحة', qty:14, weight:5, phases:[], note:'للقلي والإضافة — أساسية' },
      { fid: 5, name:'زبدة حيوانية مملحة',     qty:14, weight:5, phases:[], note:'للطعم المميز' },
      { fid: 3, name:'سمن حيواني بلدي',        qty:14, weight:5, phases:[], note:'نقطة دخان عالية — للقلي' },
      { fid: 8, name:'شحوم حيوانية',           qty:14, weight:3, phases:[], note:'للشوي والطهي' },
    ]
  },

  /* ────────────────────────────────────────
     5. الدهون السائلة (للتتبيل والسلطة)
     الحصة المعيارية ≈ 14غ دهن · 0غ كارب · ~124 سعرة
  ──────────────────────────────────────── */
  fat_liquid: {
    name:    'دهون سائلة',
    icon:    '🫒',
    std_serving: { fat: 14, carb: 0, cal: 124 },
    items: [
      { fid: 1, name:'زيت زيتون بكر ممتاز',   qty:14, weight:5, phases:[], note:'للسلطة والتتبيل — لا يُسخَّن كثيراً' },
      { fid: 6, name:'زيت جوز الهند البكر',   qty:14, weight:4, phases:[], note:'للقلي وإضافة للمشروبات' },
      { fid: 7, name:'زيت MCT',               qty:14, weight:4, phases:[], note:'لرفع الكيتونات — أضفه للقهوة' },
      { fid: 2, name:'زيت أفوكادو',           qty:14, weight:4, phases:[], note:'نقطة دخان عالية جداً' },
      { fid: 9, name:'زيت السمسم',            qty:10, weight:2, phases:[], note:'للنكهة — كمية قليلة' },
    ]
  },

  /* ────────────────────────────────────────
     6. الدهون الطبيعية (كاملة مع ألياف)
     الحصة المعيارية ≈ 15غ دهن · 2غ كارب · ~155 سعرة
  ──────────────────────────────────────── */
  fat_natural: {
    name:    'دهون طبيعية',
    icon:    '🥑',
    std_serving: { fat: 15, carb: 2, cal: 155 },
    items: [
      { fid:61, name:'أفوكادو',              qty:100, weight:5, phases:[], note:'نصف حبة — غني بالبوتاسيوم' },
      { fid:113,name:'زيتون بأنواعه',        qty: 50, weight:5, phases:[], note:'10-12 حبة — وجبة خفيفة أو إضافة' },
      { fid:44, name:'بيكان',               qty: 30, weight:4, phases:[], note:'أقل كارب في المكسرات' },
      { fid:45, name:'مكاديميا',            qty: 28, weight:4, phases:[], note:'الأعلى دهناً والأقل كارباً' },
      { fid:48, name:'جوز برازيلي',         qty: 28, weight:4, phases:[], note:'غني بالسيلينيوم' },
      { fid:47, name:'جوز عادي (عين الجمل)',qty: 28, weight:4, phases:[], note:'أوميغا 3 عالية' },
      { fid:50, name:'بندق',               qty: 28, weight:3, phases:[], note:'مع الشوكولاتة الداكنة' },
      { fid:46, name:'لوز',                qty: 28, weight:3, phases:[], note:'ألياف عالية نسبياً' },
    ]
  },

  /* ────────────────────────────────────────
     7. الكريمة والألبان الدهنية (إضافة للوجبة)
     الحصة المعيارية ≈ 18غ دهن · 1.5غ كارب · ~170 سعرة
  ──────────────────────────────────────── */
  fat_dairy: {
    name:    'كريمة وألبان دهنية',
    icon:    '🥛',
    std_serving: { fat: 18, carb: 1.5, cal: 170 },
    items: [
      { fid:38, name:'كريمة خفق / طبخ',   qty: 50, weight:5, phases:[], note:'للصوص والطهي' },
      { fid:37, name:'قشطة طازجة',        qty: 50, weight:4, phases:[], note:'مع القهوة أو كصوص' },
      { fid:39, name:'قشطة حامضة',        qty: 50, weight:3, phases:[], note:'مع اللحم أو الدجاج' },
    ]
  },

  /* ────────────────────────────────────────
     8. خضار الفطور (طازجة وخفيفة)
     الحصة المعيارية ≈ 1غ بروتين · 2غ كارب · ~20 سعرة
  ──────────────────────────────────────── */
  veg_breakfast: {
    name:    'خضار الفطور',
    icon:    '🥬',
    std_serving: { protein: 1, carb: 2, cal: 20 },
    items: [
      { fid:64, name:'سبانخ طازجة',       qty:80, weight:5, phases:[], note:'مع البيض — مثالية' },
      { fid:62, name:'جرجير',             qty:50, weight:5, phases:[], note:'سلطة جانبية سريعة' },
      { fid:75, name:'طماطم',             qty:80, weight:4, phases:[], note:'شرائح مع البيض' },
      { fid:68, name:'فطر (مشروم)',       qty:80, weight:4, phases:[], note:'مع الزبدة — رائع' },
      { fid:63, name:'خس',               qty:60, weight:3, phases:[], note:'ورق طازج' },
      { fid:67, name:'هليون',            qty:80, weight:3, phases:[], note:'مشوي بالزبدة' },
      { fid:78, name:'بصل أخضر',         qty:20, weight:3, phases:[], note:'للنكهة' },
    ]
  },

  /* ────────────────────────────────────────
     9. خضار الغداء (مطبوخة ومتنوعة)
     الحصة المعيارية ≈ 2غ بروتين · 3.5غ كارب · ~30 سعرة
  ──────────────────────────────────────── */
  veg_lunch: {
    name:    'خضار الغداء',
    icon:    '🥦',
    std_serving: { protein: 2, carb: 3.5, cal: 30 },
    items: [
      { fid:69, name:'بروكلي',            qty:100, weight:5, phases:[], note:'مطبوخ بالبخار أو مشوي' },
      { fid:70, name:'قرنبيط (زهرة)',    qty:100, weight:5, phases:[], note:'بديل الأرز والبطاطس' },
      { fid:73, name:'كوسا',             qty:100, weight:5, phases:[], note:'مع الثوم والزيت' },
      { fid:71, name:'فلفل أخضر',        qty: 80, weight:4, phases:[], note:'مشوي أو طازج' },
      { fid:72, name:'فلفل أحمر/أصفر',  qty: 60, weight:3, phases:[], note:'كارب أعلى — كمية أقل' },
      { fid:68, name:'فطر مشوي',         qty:100, weight:4, phases:[], note:'ممتاز مع اللحم' },
      { fid:76, name:'باذنجان',          qty:100, weight:3, phases:[], note:'مشوي أو مقلي' },
      { fid:64, name:'سبانخ مطبوخة',    qty:100, weight:4, phases:[], note:'تفقد حجمها كثيراً' },
      { fid:65, name:'ملفوف (كرنب)',    qty:100, weight:4, phases:[], note:'مقلي بالزبدة' },
      { fid:82, name:'فاصوليا خضراء',   qty:100, weight:3, phases:[], note:'مسلوقة أو مشوية' },
      { fid:67, name:'هليون',           qty:100, weight:4, phases:[], note:'مشوي بالزيت والملح' },
    ]
  },

  /* ────────────────────────────────────────
     10. خضار العشاء (طازجة للسلطة)
     الحصة المعيارية ≈ 1غ بروتين · 2.5غ كارب · ~20 سعرة
  ──────────────────────────────────────── */
  veg_dinner: {
    name:    'خضار العشاء (سلطة)',
    icon:    '🥗',
    std_serving: { protein: 1, carb: 2.5, cal: 20 },
    items: [
      { fid:63, name:'خس مشكل',          qty:80, weight:5, phases:[], note:'أساس السلطة' },
      { fid:62, name:'جرجير',            qty:50, weight:5, phases:[], note:'نكهة حارة لطيفة' },
      { fid:74, name:'خيار',             qty:80, weight:5, phases:[], note:'منعش ومنخفض الكارب' },
      { fid:75, name:'طماطم شيري',       qty:60, weight:4, phases:[], note:'حلو وملون' },
      { fid:64, name:'سبانخ طازجة',      qty:60, weight:4, phases:[], note:'مع الليمون والزيت' },
      { fid:113,name:'زيتون',            qty:30, weight:5, phases:[], note:'دهن + نكهة' },
      { fid:71, name:'فلفل أخضر',        qty:40, weight:3, phases:[], note:'قطع صغيرة' },
      { fid:78, name:'بصل أخضر مفروم',  qty:15, weight:3, phases:[], note:'للنكهة' },
    ]
  },

  /* ────────────────────────────────────────
     11. مكسرات وبذور (إضافة لأي وجبة)
     الحصة المعيارية ≈ 5غ بروتين · 14غ دهن · 4غ كارب · ~165 سعرة
  ──────────────────────────────────────── */
  nuts_addon: {
    name:    'مكسرات وبذور (إضافة)',
    icon:    '🌰',
    std_serving: { protein: 5, fat: 14, carb: 4, cal: 165 },
    items: [
      { fid:44, name:'بيكان',             qty:25, weight:5, phases:[], note:'أقل كارب — الأفضل' },
      { fid:45, name:'مكاديميا',         qty:25, weight:5, phases:[], note:'أعلى دهناً — ممتازة' },
      { fid:48, name:'جوز برازيلي',      qty:25, weight:4, phases:[], note:'2-3 حبات فقط' },
      { fid:47, name:'جوز عادي',         qty:25, weight:4, phases:[], note:'أوميغا 3' },
      { fid:55, name:'بذور شيا',         qty:15, weight:4, phases:[], note:'على الزبادي أو السلطة' },
      { fid:56, name:'بذور الكتان',      qty:15, weight:4, phases:[], note:'مطحونة تُمتص أفضل' },
      { fid:59, name:'بذور اليقطين',    qty:20, weight:4, phases:[], note:'غنية بالزنك' },
      { fid:50, name:'بندق',            qty:25, weight:3, phases:[], note:'مع الجبن أو وحده' },
    ]
  },


  /* ────────────────────────────────────────
     12. مخبوزات كيتونية (بدائل الخبز)
     الحصة المعيارية ≈ 1 شريحة/قطعة · 2-4غ كارب صافٍ
  ──────────────────────────────────────── */
  flour_substitute: {
    name:    'مخبوزات كيتونية',
    icon:    '🍞',
    std_serving: { fat: 9, protein: 5, carb: 2.5, cal: 110 },
    items: [
      { fid:121, name:'خبز دقيق اللوز (شريحة)',    qty:30, weight:5, phases:[],            note:'أقل كارب — الأفضل' },
      { fid:123, name:'تورتيلا كيتو (دقيق لوز)',   qty:28, weight:5, phases:[],            note:'1غ كارب فقط' },
      { fid:122, name:'خبز دقيق جوز الهند (شريحة)',qty:25, weight:4, phases:[0,2,3,4,5,6,7], note:'كارب أعلى — من المرحلة 2' },
      { fid:124, name:'باون كيتوني (دقيق لوز)',    qty:50, weight:4, phases:[0,2,3,4,5,6,7], note:'للبرغر الكيتوني' },
    ]
  },

  /* ────────────────────────────────────────
     13. حلا كيتونية
     الحصة المعيارية ≈ حصة واحدة · 3غ كارب صافٍ · 150 سعرة
  ──────────────────────────────────────── */
  keto_sweets: {
    name:    'حلا كيتونية',
    icon:    '🍫',
    std_serving: { fat: 14, protein: 4, carb: 3, cal: 155 },
    items: [
      { fid:125, name:'شوكولاتة داكنة 85%+',       qty:20, weight:5, phases:[0,2,3,4,5,6,7], note:'2-3 مربعات فقط' },
      { fid:127, name:'بسكويت كيتو (دقيق لوز)',    qty:30, weight:4, phases:[0,2,3,4,5,6,7], note:'قطعة أو اثنتان' },
      { fid:128, name:'براني كيتو (كاكاو+لوز)',    qty:40, weight:4, phases:[0,3,4,5,6,7],    note:'من المرحلة 3' },
      { fid:126, name:'آيس كريم كيتو',             qty:80, weight:3, phases:[0,3,4,5,6,7],    note:'صنع منزلي من الكريمة' },
      { fid:129, name:'مافن كيتو',                 qty:60, weight:3, phases:[0,3,4,5,6,7],    note:'فطور أو سناك' },
    ]
  },

  /* ────────────────────────────────────────
     14. وصفات جاهزة كيتو
     الحصة المعيارية = وجبة كاملة أو وجبة جانبية
  ──────────────────────────────────────── */
  ready_recipes: {
    name:    'وصفات جاهزة',
    icon:    '🥗',
    std_serving: { fat: 20, protein: 15, carb: 3, cal: 250 },
    items: [
      { fid:132, name:'صحن تونة كيتو',            qty:180, weight:5, phases:[],            note:'علبة تونة + مايونيز + خيار' },
      { fid:131, name:'بيض مسلوق مع أفوكادو وزيتون', qty:200, weight:5, phases:[],         note:'وجبة كاملة 5 دقائق' },
      { fid:133, name:'لفة دجاج كيتو (تورتيلا)',  qty:200, weight:4, phases:[],            note:'غداء متكامل' },
      { fid:130, name:'سلطة كيتو كلاسيك',         qty:150, weight:4, phases:[],            note:'جانبية لأي وجبة' },
      { fid:114, name:'جواكامولي طازج',            qty: 80, weight:4, phases:[],            note:'دهن+ألياف+نكهة' },
      { fid:115, name:'حمص كيتو بالطحينة',        qty: 60, weight:3, phases:[0,2,3,4,5,6,7], note:'بروتين+دهن — كارب معتدل' },
    ]
  },

  /* ────────────────────────────────────────
     15. منتجات المتاجر الجاهزة
     تُفلتَر حسب المتاجر المختارة في التفضيلات
  ──────────────────────────────────────── */
  store_products: {
    name:    'منتجات متاجر',
    icon:    '🛒',
    std_serving: { fat: 10, protein: 8, carb: 4, cal: 140 },
    items: [
      { fid:134, name:'زبادي يوناني كامل الدسم',  qty:150, weight:5, phases:[0,2,3,4,5,6,7],
        stores:['panda','carrefour','othaim'], note:'5% دهن فأكثر — بدون نكهات' },
      { fid:135, name:'جبنة كريمية (Philadelphia)', qty:40,  weight:5, phases:[],
        stores:['panda','carrefour','othaim','lulu'], note:'40غ = ملعقتان كبيرتان' },
      { fid: 35, name:'جبنة كريمية عامة',          qty:40,  weight:4, phases:[],
        stores:[], note:'أي ماركة بدون نشا' },
    ]
  },

};

/* ═══════════════════════════════════════════
   قوالب الوجبات (Meal Templates)
   كل وجبة = مجموعات من EXCHANGE_GROUPS + عدد الحصص
═══════════════════════════════════════════ */
const MEAL_TEMPLATES = {

  breakfast: {
    name:   'الفطور',
    icon:   '🌅',
    share:  { 2: 0.45, 3: 0.30 }, // نسبة من الأهداف اليومية
    groups: [
      { group:'protein_breakfast', servings:1,   required:true  },
      { group:'fat_solid',         servings:0.75, required:true  }, // ملعقة كبيرة تقريباً
      { group:'fat_liquid',        servings:0.5,  required:false }, // إضافة
      { group:'veg_breakfast',     servings:1,    required:true  },
      { group:'nuts_addon',        servings:0.5,  required:false }, // اختياري
    ],
    // توجيه: يُفضل نوعان من الدهون (صلب + سائل)
    fat_variety: ['fat_solid', 'fat_liquid'],
    // خضار: 1-2 أصناف
    veg_count: { min:1, max:2 },
  },

  lunch: {
    name:   'الغداء',
    icon:   '☀️',
    share:  { 2: null, 3: 0.35 }, // null = لا غداء في وجبتين
    groups: [
      { group:'protein_lunch',     servings:1,    required:true  },
      { group:'fat_solid',         servings:0.5,  required:false }, // للطهي
      { group:'fat_liquid',        servings:0.75, required:true  }, // للتتبيل
      { group:'fat_natural',       servings:0.5,  required:false }, // مكسرات أو أفوكادو
      { group:'veg_lunch',         servings:1.5,  required:true  },
      { group:'fat_dairy',         servings:0.5,  required:false }, // صوص كريمة
    ],
    fat_variety: ['fat_solid', 'fat_liquid', 'fat_natural'],
    veg_count: { min:2, max:3 },
  },

  dinner: {
    name:   'العشاء',
    icon:   '🌙',
    share:  { 2: 0.55, 3: 0.35 }, // أو يُبنى على المتبقي الفعلي
    groups: [
      { group:'protein_dinner',    servings:1,    required:true  },
      { group:'fat_liquid',        servings:1,    required:true  }, // زيت على السلطة
      { group:'fat_natural',       servings:0.75, required:false }, // زيتون أو أفوكادو
      { group:'veg_dinner',        servings:1.5,  required:true  },
      { group:'nuts_addon',        servings:0.5,  required:false }, // اختياري
    ],
    fat_variety: ['fat_liquid', 'fat_natural'],
    veg_count: { min:2, max:3 },
    // العشاء يُبنى على المتبقي الفعلي إذا كانت آخر وجبة
    use_remaining: true,
  },

};

/* ═══════════════════════════════════════════
   منطق بناء الوجبة الواحدة
   buildSingleMeal(template, targets, favIds, phase, seed)
   targets = { fat, protein, carb, cal } — الهدف لهذه الوجبة
   seed    = رقم للتنويع بين الأيام (اليوم من السنة مثلاً)
═══════════════════════════════════════════ */
function buildSingleMeal(templateKey, targets, favIds, phase, skipFids, seed, mem){
  seed = seed || 0;
  skipFids = skipFids || [];
  favIds   = favIds   || [];

  const template = MEAL_TEMPLATES[templateKey];
  if(!template) return null;

  const mealItems = [];
  let   usedFids  = new Set(skipFids);

  // حساب عدد مجموعات الدهن في هذا القالب لتوزيع الـ fat_budget عليها
  const fatGroupCount = template.groups.filter(g =>
    g.group.startsWith('fat') || g.group === 'nuts_addon'
  ).length || 1;
  let fatGroupIdx = 0; // عداد مجموعات الدهن التي مررنا عليها

  /* لكل مجموعة في القالب: اختر صنفاً ← */
  for(const groupRef of template.groups){
    const group = EXCHANGE_GROUPS[groupRef.group];
    if(!group) continue;

    // فلتر: المرحلة + لم يُستخدم + الخيارات المتقدمة
    const advPrefs    = mem?.adv_prefs || {};
    const userStores  = advPrefs.available_stores || [];

    // استثناء المجموعات حسب الخيارات المتقدمة
    const groupKey = groupRef.group;
    if(groupKey === 'flour_substitute' && !advPrefs.use_flour_sub)    continue;
    if(groupKey === 'keto_sweets'      && !advPrefs.use_keto_sweets)  continue;
    if(groupKey === 'ready_recipes'    && !advPrefs.use_ready_recipes) continue;

    // حد الدهون المشبعة اليومي
    const dailySatLimit = typeof getSatFatDailyLimit !== 'undefined'
      ? getSatFatDailyLimit(mem) : null;
    const mealShareVal  = (MEAL_SHARE?.[getMemPrefs(mem).meals_per_day] || [0.33,0.33,0.34])[
      {breakfast:0,lunch:1,dinner:2}[templateKey] || 0
    ];
    const mealSatLimit  = dailySatLimit ? dailySatLimit * mealShareVal : null;

    let pool = group.items.filter(item => {
      if(usedFids.has(item.fid)) return false;
      const food = typeof FOODS !== 'undefined' ? FOODS.find(f=>f.id===item.fid) : null;
      if(!food) return false;
      if(item.phases.length > 0 && !item.phases.includes(phase)) return false;
      if(item.stores && item.stores.length > 0 && userStores.length > 0 &&
         !item.stores.some(s => userStores.includes(s))) return false;
      // إذا عند المشترك مفضلات في هذه الفئة → اقبل فقط ما في المفضلة
      // هذا يضمن أن أي صنف شطبه المشترك من المفضلة لا يظهر في الاقتراح
      if(favIds.length > 0){
        const groupHasFav = group.items.some(gi => favIds.includes(gi.fid));
        if(groupHasFav && !favIds.includes(item.fid)) return false;
      }

      // فلتر sat_fat: إذا كان هذا الصنف دهناً محدود المشبع
      if(mealSatLimit && (groupKey.startsWith('fat') || groupKey === 'nuts_addon')){
        const satPer100 = food.sat_fat || 0;
        // sat_fat المتوقعة من هذا الصنف بالكمية الافتراضية
        const estSat = satPer100 * item.qty / 100;
        // sat_fat المستهلكة من مكونات الوجبة حتى الآن
        const usedSat = mealItems.reduce((s,i)=>{
          const f2=typeof FOODS!=='undefined'?FOODS.find(x=>x.id===i.fid):null;
          return s + (f2?(f2.sat_fat||0)*i.qty/100:0);
        },0);
        // إذا كان الصنف سيتجاوز الحد مع الكمية الافتراضية → استبعده
        if(usedSat + estSat > mealSatLimit * 1.2) return false; // 20% تسامح
      }
      return true;
    });
    if(!pool.length) continue;

    // أولوية المفضلة
    const fromFav = pool.filter(item => favIds.includes(item.fid));
    if(fromFav.length) pool = fromFav;

    // اختيار بالوزن مع تنويع بالـ seed
    const pick = _weightedPick(pool, seed + mealItems.length, groupKey);
    if(!pick) continue;

    // ── حساب الكمية عكسياً من الهدف ──
    const food = typeof FOODS !== 'undefined' ? FOODS.find(f=>f.id===pick.fid) : null;
    let qty = pick.qty; // الافتراضي

    if(food){
      const servings = groupRef.servings;
      const grp = groupRef.group;

      if(grp.startsWith('protein')){
        // كمية البروتين مبنية على هدف البروتين للوجبة
        const protPer100 = food.protein || 0;
        if(protPer100 > 5){
          const targetProt = (targets.protein || 20) * servings;
          qty = Math.round(targetProt / protPer100 * 100 / 5) * 5;
          qty = Math.min(qty, pick.qty * 1.5); // لا يتجاوز 150% من الافتراضي
        } else {
          qty = Math.round(pick.qty * servings / 5) * 5;
        }
      } else if(grp.startsWith('fat') || grp === 'nuts_addon'){
        // توزيع fat_budget على عدد مجموعات الدهن في الوجبة
        const protFatContrib = mealItems.reduce((s,i)=>{
          const f2 = typeof FOODS!=='undefined'?FOODS.find(x=>x.id===i.fid):null;
          return s + (f2?f2.fat*(i.qty/100):0);
        }, 0);
        const totalFatTarget = (targets.fat||35);
        const totalFatRemain = Math.max(totalFatTarget - protFatContrib, 5);
        // حصة هذه المجموعة من إجمالي الدهن المتبقي
        const remainingFatGroups = fatGroupCount - fatGroupIdx;
        const fatShare = totalFatRemain / Math.max(remainingFatGroups, 1);
        fatGroupIdx++;

        const fatPer100 = food.fat || 1;
        qty = Math.round(fatShare / fatPer100 * 100 / 5) * 5;
        const fatCap = (food.fat >= 80) ? pick.qty * 2.5
                     : (food.fat >= 40) ? pick.qty * 1.8
                     :                    pick.qty * 1.5;
        qty = Math.min(qty, fatCap);
        qty = Math.max(qty, 5);

        // تحقق من النسبة الكيتونية بعد إضافة الدهن
        // إذا كانت النسبة دون الهدف نزيد الكمية قليلاً
        if(fatGroupIdx === fatGroupCount){
          const testItems = [...mealItems, {fid:food.id, qty}];
          const testMacros = testItems.reduce((m,i)=>{
            const f2=typeof FOODS!=='undefined'?FOODS.find(x=>x.id===i.fid):null;
            if(!f2) return m;
            const q=i.qty/100;
            return {fat:m.fat+f2.fat*q, prot:m.prot+f2.protein*q, nc:m.nc+f2.net_carb*q};
          },{fat:0,prot:0,nc:0});
          const testRatio = (testMacros.prot*0.6+testMacros.nc) > 0
            ? testMacros.fat/(testMacros.prot*0.6+testMacros.nc) : 0;
          const ketoTarget = 1.5; // أدنى هدف مقبول
          if(testRatio < ketoTarget && food.fat > 0){
            // زد الكمية بما يكفي للوصول للنسبة المستهدفة
            const neededFat = ketoTarget*(testMacros.prot*0.6+testMacros.nc) - (testMacros.fat - food.fat*(qty/100));
            const adjustedQty = Math.round(neededFat/food.fat*100/5)*5;
            qty = Math.max(qty, Math.min(adjustedQty, fatCap));
          }
        }
      } else if(grp.startsWith('veg')){
        // الخضار بكمية ثابتة معقولة
        qty = Math.round(pick.qty * groupRef.servings / 5) * 5;
      } else {
        qty = Math.round(pick.qty * groupRef.servings / 5) * 5;
      }
    }

    usedFids.add(pick.fid);
    mealItems.push({
      fid:        pick.fid,
      qty:        Math.max(Math.min(qty, 400), 5), // 5-400غ
      name:       pick.name,
      group:      groupRef.group,
      groupName:  group.name,
      note:       pick.note || '',
      source:     favIds.includes(pick.fid) ? 'fav' : 'std',
    });
  }

  return mealItems;
}

/* اختيار عشوائي موزون بالـ weight */
function _weightedPick(pool, seed){
  if(!pool.length) return null;
  // مجموع الأوزان
  const total = pool.reduce((s, item) => s + (item.weight || 1), 0);
  // seed يحدد نقطة البداية بدل Math.random() للتكرار المتحكم
  let pick = ((seed * 2654435761) >>> 0) % total;
  for(const item of pool){
    pick -= (item.weight || 1);
    if(pick <= 0) return item;
  }
  return pool[pool.length - 1];
}

/* ═══════════════════════════════════════════
   بناء خطة اليوم الكاملة (3 وجبات)
   buildDayPlan(mem, date)
   يعيد: { breakfast, lunch, dinner }
   كل وجبة = [{fid, qty, name, ...}]
═══════════════════════════════════════════ */
function buildDayPlan(mem, date){
  if(typeof getMemPrefs === 'undefined') return null;

  const prefs    = getMemPrefs(mem);
  const phase    = mem?.phase || 1;
  const favIds   = mem?.favorites_foods || [];
  const mealsN   = prefs.meals_per_day || 3;
  const targets  = typeof getTargetForDate !== 'undefined'
                 ? getTargetForDate(mem, date)
                 : { fat:130, protein:110, carb:25, cal:1800 };

  // seed مبني على التاريخ للتنويع اليومي
  const dateStr  = date || new Date().toISOString().split('T')[0];
  const seed     = dateStr.replace(/-/g,'').split('').reduce((s,c)=>s+c.charCodeAt(0),0);

  const shares   = MEAL_SHARE?.[mealsN] || [0.30, 0.35, 0.35];
  const skipAll  = []; // لتجنب تكرار نفس الصنف عبر الوجبات

  // ── الفطور ──
  const bfTargets = _scaleTargets(targets, shares[0]);
  const breakfast  = buildSingleMeal('breakfast', bfTargets, favIds, phase, skipAll, seed, mem);
  breakfast?.forEach(i => skipAll.push(i.fid));

  // ── الغداء (فقط إذا 3 وجبات) ──
  let lunch = null;
  if(mealsN === 3){
    const lnTargets = _scaleTargets(targets, shares[1]);
    lunch = buildSingleMeal('lunch', lnTargets, favIds, phase, skipAll, seed + 100, mem);
    lunch?.forEach(i => skipAll.push(i.fid));
  }

  // ── العشاء ──
  const dinShare  = mealsN === 2 ? shares[1] : shares[2];
  const dnTargets = _scaleTargets(targets, dinShare);
  const dinner    = buildSingleMeal('dinner', dnTargets, favIds, phase, skipAll, seed + 200, mem);

  return { breakfast, lunch, dinner, date:dateStr, mealsN };
}

/* ── تعديل العشاء حسب المتبقي الفعلي ── */
function buildDinnerFromRemaining(mem, consumed, skipFids){
  skipFids = skipFids || [];
  const phase   = mem?.phase || 1;
  const favIds  = mem?.favorites_foods || [];
  const targets = typeof getTargetForDate !== 'undefined'
                ? getTargetForDate(mem)
                : { fat:130, protein:110, carb:25, cal:1800 };

  // المتبقي الفعلي = الهدف - المستهلك حتى الآن
  const remaining = {
    fat:     Math.max(targets.fat     - (consumed?.fat     || 0), 10),
    protein: Math.max(targets.protein - (consumed?.protein || 0), 10),
    carb:    Math.max(targets.carb    - (consumed?.net_carb|| 0),  3),
    cal:     Math.max((targets.cal||1800) - (consumed?.cal || 0), 100),
  };

  const seed = Date.now() % 1000;
  return buildSingleMeal('dinner', remaining, favIds, phase, [], seed);
}

/* مقياس الأهداف حسب النسبة */
function _scaleTargets(targets, share){
  return {
    fat:     Math.round(targets.fat     * share),
    protein: Math.round(targets.protein * share),
    carb:    Math.round((targets.carb||25)    * share),
    cal:     Math.round((targets.cal||1800)   * share),
  };
}

/* ═══════════════════════════════════════════
   الواجهة: الوجبة المقترحة التالية
   getNextMealPlan(mem) — يعيد { meal, type, template }
═══════════════════════════════════════════ */
function getNextMealPlan(mem, skipFids){
  skipFids = skipFids || [];
  if(typeof getMealType === 'undefined') return null;

  const mealTypeInfo = getMealType(mem);
  if(!mealTypeInfo) return null; // اكتملت الوجبات

  const phase   = mem?.phase || 1;
  const favIds  = mem?.favorites_foods || [];
  const date    = new Date().toISOString().split('T')[0];

  // اقرأ الخطة المحفوظة إذا وُجدت
  const savedPlan = mem?.day_plans?.[date];
  let   meal      = null;

  if(savedPlan?.[mealTypeInfo.type]){
    meal = savedPlan[mealTypeInfo.type];
  } else {
    // ابنِ الوجبة من جدول البدائل
    if(mealTypeInfo.type === 'dinner' && mealTypeInfo.index === (getMemPrefs(mem).meals_per_day - 1)){
      // آخر وجبة → ابنِ من المتبقي الفعلي
      const consumed = typeof calcDayTotals !== 'undefined'
                     ? calcDayTotals(typeof getTodayMeals !== 'undefined' ? getTodayMeals(mem?.uid) : [])
                     : {};
      meal = buildDinnerFromRemaining(mem, consumed);
    } else {
      const targets = typeof getTargetForDate !== 'undefined'
                    ? getTargetForDate(mem, date)
                    : { fat:130, protein:110, carb:25, cal:1800 };
      const prefs   = getMemPrefs(mem);
      const shares  = MEAL_SHARE?.[prefs.meals_per_day] || [0.30, 0.35, 0.35];
      const share   = shares[mealTypeInfo.index] || 0.33;
      const mealTargets = _scaleTargets(targets, share);
      const seed    = date.replace(/-/g,'').split('').reduce((s,c)=>s+c.charCodeAt(0),0);
      meal = buildSingleMeal(mealTypeInfo.type, mealTargets, favIds, phase, skipFids, seed + mealTypeInfo.index * 100, mem);
    }
  }

  if(!meal || !meal.length) return null;

  return {
    meal,
    mealTypeInfo,
    template: MEAL_TEMPLATES[mealTypeInfo.type],
  };
}
