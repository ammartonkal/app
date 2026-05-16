/* ═══════════════════════════════════════════
   قاعدة بيانات الأجهزة والمعدات الموصى بها
   تحدي الكيتو مع د. عمار
   آخر تحديث: 2026-05-16
   المحتوى: أجهزة قياس، معدات مطبخ، أدوات متابعة
═══════════════════════════════════════════ */

const RECOMMENDED_DEVICES = [

  /* ── أجهزة قياس الكيتون ── */
  {
    id: 1,
    name: "Keto-Mojo GK+",
    name_ar: "جهاز قياس الكيتون والسكر كيتو-موجو",
    category: "قياس الكيتون",
    subcategory: "قياس دم",
    priority: 1,
    price_range: "400-600 ريال",
    keto_relevance: 5,
    doc_note: "الأدق والأوثق علمياً — يقيس الكيتون (BHB) والجلوكوز من الدم. الأفضل لمتابعة الكيتوزيس بدقة",
    pros: ["دقة عالية جداً", "يقيس الكيتون والسكر معاً", "تطبيق مرتبط بالجوال"],
    cons: ["شرائح قياس مكلفة", "يحتاج وخز الإصبع"],
    buy_link: "",
    approved: true,
    usage_tip: "القياس المثالي: صباحاً قبل الأكل — الكيتوزيس الخفيف 0.5-1.5 mmol/L، المثالي 1.5-3.0"
  },
  {
    id: 2,
    name: "Ketoscan Mini",
    name_ar: "جهاز قياس الكيتون بالتنفس كيتوسكان",
    category: "قياس الكيتون",
    subcategory: "قياس تنفس",
    priority: 2,
    price_range: "600-900 ريال",
    keto_relevance: 4,
    doc_note: "خيار مريح — لا يحتاج وخز. يقيس الأسيتون في الزفير ويقدّر مستوى الكيتون. أقل دقة من الدم",
    pros: ["لا وخز", "سهل الاستخدام يومياً", "لا شرائح استهلاكية"],
    cons: ["أقل دقة من قياس الدم", "سعر مرتفع نسبياً"],
    buy_link: "",
    approved: true,
    usage_tip: "مناسب للمتابعة اليومية — استخدم قياس الدم للتأكيد الدقيق"
  },
  {
    id: 3,
    name: "Urine Ketone Strips",
    name_ar: "شرائح الكيتون في البول",
    category: "قياس الكيتون",
    subcategory: "قياس بول",
    priority: 3,
    price_range: "30-80 ريال",
    keto_relevance: 3,
    doc_note: "للمبتدئين فقط في الأسابيع الأولى — بعد التكيف تتوقف الكليتى عن إفراز الكيتون في البول فتصبح غير دقيقة",
    pros: ["رخيصة جداً", "سهلة الاستخدام", "مناسبة للبداية"],
    cons: ["غير دقيقة بعد التكيف", "لا تعكس الكيتوزيس الحقيقي بعد أسابيع"],
    buy_link: "",
    approved: true,
    usage_tip: "استخدمها فقط في الأسابيع الأولى للتأكد من الدخول في الكيتو"
  },

  /* ── أجهزة قياس صحية ── */
  {
    id: 4,
    name: "Withings Body+",
    name_ar: "ميزان ذكي ويذينغز بلس",
    category: "قياس الجسم",
    subcategory: "ميزان ذكي",
    priority: 1,
    price_range: "500-800 ريال",
    keto_relevance: 5,
    doc_note: "يقيس الوزن ونسبة الدهون والعضل والماء — ضروري لتتبع التحول الجسدي لا الوزن فقط. متزامن مع التطبيق",
    pros: ["يقيس تكوين الجسم كاملاً", "تطبيق ممتاز", "سهل الاستخدام"],
    cons: ["سعر مرتفع", "دقة نسبة الدهون نسبية"],
    buy_link: "",
    approved: true,
    usage_tip: "القياس صباحاً بعد الحمام وقبل الأكل — لنفس الظروف في كل قياس"
  },
  {
    id: 5,
    name: "Xiaomi Mi Scale 2",
    name_ar: "ميزان ذكي شاومي",
    category: "قياس الجسم",
    subcategory: "ميزان ذكي",
    priority: 2,
    price_range: "100-180 ريال",
    keto_relevance: 4,
    doc_note: "خيار اقتصادي ممتاز — يقيس الوزن ونسبة الدهون ومؤشر BMI بسعر منافس جداً",
    pros: ["سعر ممتاز", "تطبيق Mi Fit جيد", "دقة معقولة"],
    cons: ["يحتاج Bluetooth"],
    buy_link: "",
    approved: true,
    usage_tip: "مناسب جداً للمتابعة اليومية — لا تركز على الوزن فقط بل على التوجه العام"
  },
  {
    id: 6,
    name: "Omron Blood Pressure Monitor",
    name_ar: "جهاز قياس ضغط الدم أومرون",
    category: "قياس صحي",
    subcategory: "ضغط الدم",
    priority: 1,
    price_range: "200-400 ريال",
    keto_relevance: 4,
    doc_note: "مهم لمتابعة ضغط الدم في الكيتو — خاصة للمشتركين الذين يأخذون دواء ضغط. الكيتو يخفض الضغط",
    pros: ["دقة طبية", "سهل الاستخدام", "يحفظ القراءات"],
    cons: [],
    buy_link: "",
    approved: true,
    usage_tip: "قس الضغط مرتين أسبوعياً على الأقل — إذا انخفض راجع طبيبك لتعديل الدواء"
  },
  {
    id: 7,
    name: "Glucometer (Blood Sugar)",
    name_ar: "جهاز قياس السكر في الدم",
    category: "قياس صحي",
    subcategory: "سكر الدم",
    priority: 1,
    price_range: "80-200 ريال",
    keto_relevance: 5,
    doc_note: "ضروري لمرضى السكري ومقاومة الإنسولين — الكيتو يخفض السكر بشكل ملحوظ ويحتاج متابعة دقيقة",
    pros: ["متابعة دقيقة للسكر", "مهم جداً للمرضى", "سعر معقول"],
    cons: ["شرائح مكلفة"],
    buy_link: "",
    approved: true,
    usage_tip: "قس قبل الوجبة وبعدها بساعتين — الهدف: ارتفاع أقل من 30 نقطة بعد الأكل"
  },

  /* ── معدات المطبخ ── */
  {
    id: 8,
    name: "Air Fryer",
    name_ar: "قلاية هوائية",
    category: "معدات مطبخ",
    subcategory: "طهي",
    priority: 1,
    price_range: "200-600 ريال",
    keto_relevance: 5,
    doc_note: "من أهم أدوات مطبخ الكيتو — تطبخ الدجاج والسمك والخضار بسرعة وبالحجم الصح بدون زيت زائد",
    pros: ["سريعة", "صحية", "متعددة الاستخدامات", "سهلة التنظيف"],
    cons: ["تأخذ مكاناً في المطبخ"],
    buy_link: "",
    approved: true,
    usage_tip: "190 درجة لـ 15-20 دقيقة لصدر الدجاج — أضف توابل قبل الطهي مباشرة"
  },
  {
    id: 9,
    name: "Food Scale (Digital)",
    name_ar: "ميزان طعام رقمي",
    category: "معدات مطبخ",
    subcategory: "قياس",
    priority: 1,
    price_range: "30-100 ريال",
    keto_relevance: 5,
    doc_note: "ضروري في البداية لمعرفة الكميات بدقة — بعد التكيف تصبح التقديرات طبيعية",
    pros: ["دقة عالية", "رخيص", "صغير الحجم"],
    cons: [],
    buy_link: "",
    approved: true,
    usage_tip: "زن كل شيء في الأسابيع الأولى — ستتعلم تقدير الكميات تلقائياً بعد شهر"
  },
  {
    id: 10,
    name: "Instant Pot / Pressure Cooker",
    name_ar: "قدر الضغط الكهربائي",
    category: "معدات مطبخ",
    subcategory: "طهي",
    priority: 2,
    price_range: "300-700 ريال",
    keto_relevance: 4,
    doc_note: "ممتاز لطهي اللحوم ومرق العظام — مرق العظام من أفضل مصادر الكولاجين والمعادن في الكيتو",
    pros: ["سريع للحوم", "ممتاز لمرق العظام", "متعدد الاستخدامات"],
    cons: ["حجم كبير", "سعر متوسط"],
    buy_link: "",
    approved: true,
    usage_tip: "مرق العظام: 2-3 ساعات ضغط عالٍ — أضف خل التفاح لاستخراج المعادن من العظام"
  },

  /* ── تطبيقات وأدوات رقمية ── */
  {
    id: 11,
    name: "Cronometer App",
    name_ar: "تطبيق كرونوميتر",
    category: "تطبيقات",
    subcategory: "تتبع التغذية",
    priority: 1,
    price_range: "مجاني (نسخة مدفوعة متاحة)",
    keto_relevance: 5,
    doc_note: "الأفضل لتتبع المغذيات الدقيقة (Micronutrients) — ضروري لمعرفة نقص الفيتامينات والمعادن في الكيتو",
    pros: ["قاعدة بيانات ضخمة", "يتبع المغذيات الدقيقة", "مجاني بشكل أساسي"],
    cons: ["واجهة معقدة قليلاً"],
    buy_link: "",
    approved: true,
    usage_tip: "سجّل كل شيء لأول 30 يوم — ستكتشف أنماط وتحدد نقص المغذيات"
  },
  {
    id: 12,
    name: "Zero Fasting App",
    name_ar: "تطبيق زيرو للصيام المتقطع",
    category: "تطبيقات",
    subcategory: "صيام متقطع",
    priority: 2,
    price_range: "مجاني",
    keto_relevance: 4,
    doc_note: "الكيتو والصيام المتقطع تكامل ممتاز — هذا التطبيق يتابع نوافذ الصيام ويحفزك",
    pros: ["سهل الاستخدام", "مجاني", "محتوى تعليمي"],
    cons: ["النسخة المتقدمة مدفوعة"],
    buy_link: "",
    approved: true,
    usage_tip: "ابدأ بـ 16:8 (16 ساعة صيام، 8 أكل) — الكيتو يجعل الصيام أسهل بكثير"
  },
];

/* ═══ DEVICE HELPERS ═══ */
function getDeviceById(id){ return RECOMMENDED_DEVICES.find(d => d.id === id); }
function getDevicesByCategory(cat){ return RECOMMENDED_DEVICES.filter(d => d.category === cat); }
function getTopDevices(n=5){ return [...RECOMMENDED_DEVICES].sort((a,b) => b.keto_relevance - a.keto_relevance || a.priority - b.priority).slice(0,n); }
function getEssentialDevices(){ return RECOMMENDED_DEVICES.filter(d => d.priority === 1); }
function getDeviceCategories(){ return [...new Set(RECOMMENDED_DEVICES.map(d => d.category))]; }
