/* ════════════════════════════════════════════════════════════════
   وصفات الغداء والعشاء والسناك — LUNCH / DINNER / SNACK TEMPLATES
   تحدي الكيتو مع د. عمار تنكل
   ─────────────────────────────────────────────────────────────
   المنطق: البروتين يُحدد الكمية ← الدهن يُحسب لتحقيق النسبة ← الخضار ثابتة
   الوجبة اللاحقة تُبنى على المتبقي من الأهداف اليومية
════════════════════════════════════════════════════════════════ */

/* ─── تصنيف البروتين حسب الأولوية ─── */
const LUNCH_PROTEIN_GROUPS = {
  chicken:    { label:'دجاج',    priority:1, fids:[11,12] },
  beef:       { label:'لحم بقر', priority:2, fids:[13,14,15] },
  lamb:       { label:'لحم خروف',priority:3, fids:[16] },
  seafood:    { label:'مأكولات بحرية', priority:4, fids:[17,20,21] },
};

const DINNER_PROTEIN_GROUPS = {
  tuna:       { label:'تونة',    priority:1, fids:[19] },
  cheese:     { label:'أجبان',   priority:2, fids:[27,29,30,32,35] },
  egg:        { label:'بيض',     priority:3, fids:[10] },
  chicken:    { label:'دجاج',    priority:4, fids:[12] },
};

/* ════════════════════════════════════════════════════════════════
   LUNCH_TEMPLATES — وصفات الغداء
   الحصة الافتراضية: 35% من الأهداف اليومية
   يُعدَّل حسب المتبقي بعد الفطور
════════════════════════════════════════════════════════════════ */
const LUNCH_TEMPLATES = [

  /* LN01 | دجاج (فخذ/جناح/مع جلد) + زيت زيتون + مشروم | نسبة:1.15 */
  {
    id: 'LN01', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.15, sat_pct: 22,
    macros: { fat:27.2, protein:35.6, net_carb:2.3, cal:389.9, sat_fat:6.0 },
    macros_per_100g_protein: { fat:13, protein:25, nc:0 },
    components: [
      { fid:11  , name:'دجاج (فخذ/جناح/مع جلد)', qty:130, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:10, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'شوي 7-8 دق كل جانب على حرارة عالية',
    phases: [],
  },

  /* LN02 | دجاج (فخذ/جناح/مع جلد) + زيت زيتون + بروكلي | نسبة:1.02 */
  {
    id: 'LN02', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.02, sat_pct: 22,
    macros: { fat:27.4, protein:35.9, net_carb:5.3, cal:408.7, sat_fat:6.0 },
    macros_per_100g_protein: { fat:13, protein:25, nc:0 },
    components: [
      { fid:11  , name:'دجاج (فخذ/جناح/مع جلد)', qty:130, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:10, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'شوي 7-8 دق كل جانب على حرارة عالية',
    phases: [],
  },

  /* LN03 | دجاج (فخذ/جناح/مع جلد) + زيت زيتون + قرنبيط | نسبة:1.12 */
  {
    id: 'LN03', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.12, sat_pct: 22,
    macros: { fat:27.3, protein:34.8, net_carb:3.5, cal:397.9, sat_fat:6.0 },
    macros_per_100g_protein: { fat:13, protein:25, nc:0 },
    components: [
      { fid:11  , name:'دجاج (فخذ/جناح/مع جلد)', qty:130, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:10, role:'fat' },
      { fid:70  , name:'قرنبيط', qty:120, role:'veg' },
    ],
    cooking_tip: 'شوي 7-8 دق كل جانب على حرارة عالية',
    phases: [],
  },

  /* LN04 | دجاج (فخذ/جناح/مع جلد) + زيت زيتون + سبانخ | نسبة:1.24 */
  {
    id: 'LN04', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.24, sat_pct: 22,
    macros: { fat:27.2, protein:34.8, net_carb:1.1, cal:386.3, sat_fat:6.0 },
    macros_per_100g_protein: { fat:13, protein:25, nc:0 },
    components: [
      { fid:11  , name:'دجاج (فخذ/جناح/مع جلد)', qty:130, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:10, role:'fat' },
      { fid:64  , name:'سبانخ', qty:80, role:'veg' },
    ],
    cooking_tip: 'شوي 7-8 دق كل جانب على حرارة عالية',
    phases: [],
  },

  /* LN05 | دجاج (فخذ/جناح/مع جلد) + سمن + مشروم | نسبة:1.15 */
  {
    id: 'LN05', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.15, sat_pct: 40,
    macros: { fat:27.2, protein:35.6, net_carb:2.3, cal:391.2, sat_fat:10.8 },
    macros_per_100g_protein: { fat:13, protein:25, nc:0 },
    components: [
      { fid:11  , name:'دجاج (فخذ/جناح/مع جلد)', qty:130, role:'protein' },
      { fid:3   , name:'سمن', qty:10, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'شوي 7-8 دق كل جانب على حرارة عالية',
    phases: [],
  },

  /* LN06 | دجاج (فخذ/جناح/مع جلد) + سمن + بروكلي | نسبة:1.02 */
  {
    id: 'LN06', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.02, sat_pct: 40,
    macros: { fat:27.3, protein:35.9, net_carb:5.3, cal:410.0, sat_fat:10.8 },
    macros_per_100g_protein: { fat:13, protein:25, nc:0 },
    components: [
      { fid:11  , name:'دجاج (فخذ/جناح/مع جلد)', qty:130, role:'protein' },
      { fid:3   , name:'سمن', qty:10, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'شوي 7-8 دق كل جانب على حرارة عالية',
    phases: [],
  },

  /* LN07 | دجاج (فخذ/جناح/مع جلد) + سمن + قرنبيط | نسبة:1.12 */
  {
    id: 'LN07', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.12, sat_pct: 40,
    macros: { fat:27.2, protein:34.8, net_carb:3.5, cal:399.2, sat_fat:10.8 },
    macros_per_100g_protein: { fat:13, protein:25, nc:0 },
    components: [
      { fid:11  , name:'دجاج (فخذ/جناح/مع جلد)', qty:130, role:'protein' },
      { fid:3   , name:'سمن', qty:10, role:'fat' },
      { fid:70  , name:'قرنبيط', qty:120, role:'veg' },
    ],
    cooking_tip: 'شوي 7-8 دق كل جانب على حرارة عالية',
    phases: [],
  },

  /* LN08 | دجاج (فخذ/جناح/مع جلد) + سمن + سبانخ | نسبة:1.23 */
  {
    id: 'LN08', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.23, sat_pct: 40,
    macros: { fat:27.2, protein:34.9, net_carb:1.1, cal:387.6, sat_fat:10.8 },
    macros_per_100g_protein: { fat:13, protein:25, nc:0 },
    components: [
      { fid:11  , name:'دجاج (فخذ/جناح/مع جلد)', qty:130, role:'protein' },
      { fid:3   , name:'سمن', qty:10, role:'fat' },
      { fid:64  , name:'سبانخ', qty:80, role:'veg' },
    ],
    cooking_tip: 'شوي 7-8 دق كل جانب على حرارة عالية',
    phases: [],
  },

  /* LN09 | دجاج (فخذ/جناح/مع جلد) + زبدة + مشروم | نسبة:1.24 */
  {
    id: 'LN09', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.24, sat_pct: 41,
    macros: { fat:29.4, protein:35.7, net_carb:2.3, cal:409.1, sat_fat:12.2 },
    macros_per_100g_protein: { fat:13, protein:25, nc:0 },
    components: [
      { fid:11  , name:'دجاج (فخذ/جناح/مع جلد)', qty:130, role:'protein' },
      { fid:4   , name:'زبدة', qty:15, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'شوي 7-8 دق كل جانب على حرارة عالية',
    phases: [],
  },

  /* LN10 | دجاج (فخذ/جناح/مع جلد) + زبدة + بروكلي | نسبة:1.1 */
  {
    id: 'LN10', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.1, sat_pct: 41,
    macros: { fat:29.5, protein:36.0, net_carb:5.3, cal:427.9, sat_fat:12.2 },
    macros_per_100g_protein: { fat:13, protein:25, nc:0 },
    components: [
      { fid:11  , name:'دجاج (فخذ/جناح/مع جلد)', qty:130, role:'protein' },
      { fid:4   , name:'زبدة', qty:15, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'شوي 7-8 دق كل جانب على حرارة عالية',
    phases: [],
  },

  /* LN11 | دجاج (فخذ/جناح/مع جلد) + زبدة + قرنبيط | نسبة:1.2 */
  {
    id: 'LN11', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.2, sat_pct: 41,
    macros: { fat:29.4, protein:34.9, net_carb:3.5, cal:417.1, sat_fat:12.2 },
    macros_per_100g_protein: { fat:13, protein:25, nc:0 },
    components: [
      { fid:11  , name:'دجاج (فخذ/جناح/مع جلد)', qty:130, role:'protein' },
      { fid:4   , name:'زبدة', qty:15, role:'fat' },
      { fid:70  , name:'قرنبيط', qty:120, role:'veg' },
    ],
    cooking_tip: 'شوي 7-8 دق كل جانب على حرارة عالية',
    phases: [],
  },

  /* LN12 | دجاج (فخذ/جناح/مع جلد) + زبدة + سبانخ | نسبة:1.33 */
  {
    id: 'LN12', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.33, sat_pct: 42,
    macros: { fat:29.4, protein:35.0, net_carb:1.1, cal:405.4, sat_fat:12.3 },
    macros_per_100g_protein: { fat:13, protein:25, nc:0 },
    components: [
      { fid:11  , name:'دجاج (فخذ/جناح/مع جلد)', qty:130, role:'protein' },
      { fid:4   , name:'زبدة', qty:15, role:'fat' },
      { fid:64  , name:'سبانخ', qty:80, role:'veg' },
    ],
    cooking_tip: 'شوي 7-8 دق كل جانب على حرارة عالية',
    phases: [],
  },

  /* LN13 | دجاج (فخذ/جناح/مع جلد) + كريمة + مشروم | نسبة:1.25 */
  {
    id: 'LN13', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.25, sat_pct: 44,
    macros: { fat:31.6, protein:36.4, net_carb:3.4, cal:437.5, sat_fat:13.8 },
    macros_per_100g_protein: { fat:13, protein:25, nc:0 },
    components: [
      { fid:11  , name:'دجاج (فخذ/جناح/مع جلد)', qty:130, role:'protein' },
      { fid:38  , name:'كريمة', qty:40, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'شوي 7-8 دق كل جانب على حرارة عالية',
    phases: [],
  },

  /* LN14 | دجاج (فخذ/جناح/مع جلد) + كريمة + بروكلي | نسبة:1.12 */
  {
    id: 'LN14', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.12, sat_pct: 43,
    macros: { fat:31.8, protein:36.7, net_carb:6.4, cal:456.3, sat_fat:13.8 },
    macros_per_100g_protein: { fat:13, protein:25, nc:0 },
    components: [
      { fid:11  , name:'دجاج (فخذ/جناح/مع جلد)', qty:130, role:'protein' },
      { fid:38  , name:'كريمة', qty:40, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'شوي 7-8 دق كل جانب على حرارة عالية',
    phases: [],
  },

  /* LN15 | دجاج (فخذ/جناح/مع جلد) + كريمة + قرنبيط | نسبة:1.22 */
  {
    id: 'LN15', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.22, sat_pct: 44,
    macros: { fat:31.7, protein:35.6, net_carb:4.6, cal:445.5, sat_fat:13.8 },
    macros_per_100g_protein: { fat:13, protein:25, nc:0 },
    components: [
      { fid:11  , name:'دجاج (فخذ/جناح/مع جلد)', qty:130, role:'protein' },
      { fid:38  , name:'كريمة', qty:40, role:'fat' },
      { fid:70  , name:'قرنبيط', qty:120, role:'veg' },
    ],
    cooking_tip: 'شوي 7-8 دق كل جانب على حرارة عالية',
    phases: [],
  },

  /* LN16 | دجاج (فخذ/جناح/مع جلد) + كريمة + سبانخ | نسبة:1.34 */
  {
    id: 'LN16', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.34, sat_pct: 44,
    macros: { fat:31.6, protein:35.6, net_carb:2.2, cal:433.9, sat_fat:13.8 },
    macros_per_100g_protein: { fat:13, protein:25, nc:0 },
    components: [
      { fid:11  , name:'دجاج (فخذ/جناح/مع جلد)', qty:130, role:'protein' },
      { fid:38  , name:'كريمة', qty:40, role:'fat' },
      { fid:64  , name:'سبانخ', qty:80, role:'veg' },
    ],
    cooking_tip: 'شوي 7-8 دق كل جانب على حرارة عالية',
    phases: [],
  },

  /* LN17 | صدر دجاج مشوي + زيت زيتون + مشروم | نسبة:1.31 */
  {
    id: 'LN17', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.31, sat_pct: 16,
    macros: { fat:34.6, protein:40.3, net_carb:2.3, cal:485.2, sat_fat:5.4 },
    macros_per_100g_protein: { fat:3.6, protein:31, nc:0 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:120, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:30, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'صدر دجاج 120غ — مشوي بالليمون والثوم',
    phases: [],
  },

  /* LN18 | صدر دجاج مشوي + زيت زيتون + بروكلي | نسبة:1.17 */
  {
    id: 'LN18', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.17, sat_pct: 16,
    macros: { fat:34.8, protein:40.6, net_carb:5.3, cal:504.0, sat_fat:5.4 },
    macros_per_100g_protein: { fat:3.6, protein:31, nc:0 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:120, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:30, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'صدر دجاج 120غ — مشوي بالليمون والثوم',
    phases: [],
  },

  /* LN19 | صدر دجاج مشوي + زيت زيتون + كوسا | نسبة:1.38 */
  {
    id: 'LN19', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.38, sat_pct: 16,
    macros: { fat:34.6, protein:38.4, net_carb:2.0, cal:480.2, sat_fat:5.4 },
    macros_per_100g_protein: { fat:3.6, protein:31, nc:0 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:120, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:30, role:'fat' },
      { fid:73  , name:'كوسا', qty:100, role:'veg' },
    ],
    cooking_tip: 'صدر دجاج 120غ — مشوي بالليمون والثوم',
    phases: [],
  },

  /* LN20 | صدر دجاج مشوي + زيت زيتون + فلفل رومي | نسبة:1.39 */
  {
    id: 'LN20', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.39, sat_pct: 16,
    macros: { fat:34.5, protein:37.9, net_carb:2.1, cal:479.2, sat_fat:5.4 },
    macros_per_100g_protein: { fat:3.6, protein:31, nc:0 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:120, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:30, role:'fat' },
      { fid:71  , name:'فلفل رومي', qty:80, role:'veg' },
    ],
    cooking_tip: 'صدر دجاج 120غ — مشوي بالليمون والثوم',
    phases: [],
  },

  /* LN21 | صدر دجاج مشوي + سمن + مشروم | نسبة:1.3 */
  {
    id: 'LN21', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.3, sat_pct: 57,
    macros: { fat:34.5, protein:40.4, net_carb:2.3, cal:489.1, sat_fat:19.8 },
    macros_per_100g_protein: { fat:3.6, protein:31, nc:0 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:120, role:'protein' },
      { fid:3   , name:'سمن', qty:30, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'صدر دجاج 120غ — مشوي بالليمون والثوم',
    phases: [],
  },

  /* LN22 | صدر دجاج مشوي + سمن + بروكلي | نسبة:1.17 */
  {
    id: 'LN22', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.17, sat_pct: 57,
    macros: { fat:34.6, protein:40.6, net_carb:5.3, cal:507.9, sat_fat:19.8 },
    macros_per_100g_protein: { fat:3.6, protein:31, nc:0 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:120, role:'protein' },
      { fid:3   , name:'سمن', qty:30, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'صدر دجاج 120غ — مشوي بالليمون والثوم',
    phases: [],
  },

  /* LN23 | صدر دجاج مشوي + سمن + كوسا | نسبة:1.37 */
  {
    id: 'LN23', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.37, sat_pct: 57,
    macros: { fat:34.5, protein:38.5, net_carb:2.0, cal:484.1, sat_fat:19.8 },
    macros_per_100g_protein: { fat:3.6, protein:31, nc:0 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:120, role:'protein' },
      { fid:3   , name:'سمن', qty:30, role:'fat' },
      { fid:73  , name:'كوسا', qty:100, role:'veg' },
    ],
    cooking_tip: 'صدر دجاج 120غ — مشوي بالليمون والثوم',
    phases: [],
  },

  /* LN24 | صدر دجاج مشوي + سمن + فلفل رومي | نسبة:1.38 */
  {
    id: 'LN24', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.38, sat_pct: 58,
    macros: { fat:34.3, protein:38.0, net_carb:2.1, cal:483.1, sat_fat:19.8 },
    macros_per_100g_protein: { fat:3.6, protein:31, nc:0 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:120, role:'protein' },
      { fid:3   , name:'سمن', qty:30, role:'fat' },
      { fid:71  , name:'فلفل رومي', qty:80, role:'veg' },
    ],
    cooking_tip: 'صدر دجاج 120غ — مشوي بالليمون والثوم',
    phases: [],
  },

  /* LN25 | صدر دجاج مشوي + زبدة + مشروم | نسبة:1.24 */
  {
    id: 'LN25', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.24, sat_pct: 58,
    macros: { fat:33.0, protein:40.6, net_carb:2.3, cal:470.9, sat_fat:19.0 },
    macros_per_100g_protein: { fat:3.6, protein:31, nc:0 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:120, role:'protein' },
      { fid:4   , name:'زبدة', qty:35, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'صدر دجاج 120غ — مشوي بالليمون والثوم',
    phases: [],
  },

  /* LN26 | صدر دجاج مشوي + زبدة + بروكلي | نسبة:1.11 */
  {
    id: 'LN26', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.11, sat_pct: 57,
    macros: { fat:33.1, protein:40.9, net_carb:5.3, cal:489.8, sat_fat:19.0 },
    macros_per_100g_protein: { fat:3.6, protein:31, nc:0 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:120, role:'protein' },
      { fid:4   , name:'زبدة', qty:35, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'صدر دجاج 120غ — مشوي بالليمون والثوم',
    phases: [],
  },

  /* LN27 | صدر دجاج مشوي + زبدة + كوسا | نسبة:1.31 */
  {
    id: 'LN27', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.31, sat_pct: 58,
    macros: { fat:33.0, protein:38.7, net_carb:2.0, cal:465.9, sat_fat:19.0 },
    macros_per_100g_protein: { fat:3.6, protein:31, nc:0 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:120, role:'protein' },
      { fid:4   , name:'زبدة', qty:35, role:'fat' },
      { fid:73  , name:'كوسا', qty:100, role:'veg' },
    ],
    cooking_tip: 'صدر دجاج 120غ — مشوي بالليمون والثوم',
    phases: [],
  },

  /* LN28 | صدر دجاج مشوي + زبدة + فلفل رومي | نسبة:1.31 */
  {
    id: 'LN28', protein_group: 'chicken', method: 'مشوي',
    keto_ratio: 1.31, sat_pct: 58,
    macros: { fat:32.8, protein:38.2, net_carb:2.1, cal:464.9, sat_fat:19.0 },
    macros_per_100g_protein: { fat:3.6, protein:31, nc:0 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:120, role:'protein' },
      { fid:4   , name:'زبدة', qty:35, role:'fat' },
      { fid:71  , name:'فلفل رومي', qty:80, role:'veg' },
    ],
    cooking_tip: 'صدر دجاج 120غ — مشوي بالليمون والثوم',
    phases: [],
  },

  /* LN29 | لحم بقر عالي الدهن + زيت زيتون + مشروم | نسبة:1.98 */
  {
    id: 'LN29', protein_group: 'beef', method: 'ستيك/شوي',
    keto_ratio: 1.98, sat_pct: 37,
    macros: { fat:31.7, protein:22.9, net_carb:2.3, cal:389.6, sat_fat:11.7 },
    macros_per_100g_protein: { fat:24, protein:18, nc:0 },
    components: [
      { fid:13  , name:'لحم بقر عالي الدهن', qty:110, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'مدة الشوي حسب الدرجة المطلوبة',
    phases: [],
  },

  /* LN30 | لحم بقر عالي الدهن + زيت زيتون + بروكلي | نسبة:1.66 */
  {
    id: 'LN30', protein_group: 'beef', method: 'ستيك/شوي',
    keto_ratio: 1.66, sat_pct: 37,
    macros: { fat:31.9, protein:23.2, net_carb:5.3, cal:408.4, sat_fat:11.7 },
    macros_per_100g_protein: { fat:24, protein:18, nc:0 },
    components: [
      { fid:13  , name:'لحم بقر عالي الدهن', qty:110, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'مدة الشوي حسب الدرجة المطلوبة',
    phases: [],
  },

  /* LN31 | لحم بقر عالي الدهن + زيت زيتون + سبانخ | نسبة:2.21 */
  {
    id: 'LN31', protein_group: 'beef', method: 'ستيك/شوي',
    keto_ratio: 2.21, sat_pct: 37,
    macros: { fat:31.7, protein:22.1, net_carb:1.1, cal:386.0, sat_fat:11.8 },
    macros_per_100g_protein: { fat:24, protein:18, nc:0 },
    components: [
      { fid:13  , name:'لحم بقر عالي الدهن', qty:110, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:64  , name:'سبانخ', qty:80, role:'veg' },
    ],
    cooking_tip: 'مدة الشوي حسب الدرجة المطلوبة',
    phases: [],
  },

  /* LN32 | لحم بقر عالي الدهن + سمن + مشروم | نسبة:1.98 */
  {
    id: 'LN32', protein_group: 'beef', method: 'ستيك/شوي',
    keto_ratio: 1.98, sat_pct: 44,
    macros: { fat:31.7, protein:22.9, net_carb:2.3, cal:390.3, sat_fat:14.1 },
    macros_per_100g_protein: { fat:24, protein:18, nc:0 },
    components: [
      { fid:13  , name:'لحم بقر عالي الدهن', qty:110, role:'protein' },
      { fid:3   , name:'سمن', qty:5, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'مدة الشوي حسب الدرجة المطلوبة',
    phases: [],
  },

  /* LN33 | لحم بقر عالي الدهن + سمن + بروكلي | نسبة:1.66 */
  {
    id: 'LN33', protein_group: 'beef', method: 'ستيك/شوي',
    keto_ratio: 1.66, sat_pct: 44,
    macros: { fat:31.9, protein:23.2, net_carb:5.3, cal:409.1, sat_fat:14.1 },
    macros_per_100g_protein: { fat:24, protein:18, nc:0 },
    components: [
      { fid:13  , name:'لحم بقر عالي الدهن', qty:110, role:'protein' },
      { fid:3   , name:'سمن', qty:5, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'مدة الشوي حسب الدرجة المطلوبة',
    phases: [],
  },

  /* LN34 | لحم بقر عالي الدهن + سمن + سبانخ | نسبة:2.21 */
  {
    id: 'LN34', protein_group: 'beef', method: 'ستيك/شوي',
    keto_ratio: 2.21, sat_pct: 45,
    macros: { fat:31.7, protein:22.1, net_carb:1.1, cal:386.7, sat_fat:14.2 },
    macros_per_100g_protein: { fat:24, protein:18, nc:0 },
    components: [
      { fid:13  , name:'لحم بقر عالي الدهن', qty:110, role:'protein' },
      { fid:3   , name:'سمن', qty:5, role:'fat' },
      { fid:64  , name:'سبانخ', qty:80, role:'veg' },
    ],
    cooking_tip: 'مدة الشوي حسب الدرجة المطلوبة',
    phases: [],
  },

  /* LN35 | لحم بقر عالي الدهن + زبدة + مشروم | نسبة:1.92 */
  {
    id: 'LN35', protein_group: 'beef', method: 'ستيك/شوي',
    keto_ratio: 1.92, sat_pct: 44,
    macros: { fat:30.8, protein:22.9, net_carb:2.3, cal:381.3, sat_fat:13.6 },
    macros_per_100g_protein: { fat:24, protein:18, nc:0 },
    components: [
      { fid:13  , name:'لحم بقر عالي الدهن', qty:110, role:'protein' },
      { fid:4   , name:'زبدة', qty:5, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'مدة الشوي حسب الدرجة المطلوبة',
    phases: [],
  },

  /* LN36 | لحم بقر عالي الدهن + زبدة + بروكلي | نسبة:1.61 */
  {
    id: 'LN36', protein_group: 'beef', method: 'ستيك/شوي',
    keto_ratio: 1.61, sat_pct: 44,
    macros: { fat:30.9, protein:23.2, net_carb:5.3, cal:400.1, sat_fat:13.6 },
    macros_per_100g_protein: { fat:24, protein:18, nc:0 },
    components: [
      { fid:13  , name:'لحم بقر عالي الدهن', qty:110, role:'protein' },
      { fid:4   , name:'زبدة', qty:5, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'مدة الشوي حسب الدرجة المطلوبة',
    phases: [],
  },

  /* LN37 | لحم بقر عالي الدهن + زبدة + سبانخ | نسبة:2.14 */
  {
    id: 'LN37', protein_group: 'beef', method: 'ستيك/شوي',
    keto_ratio: 2.14, sat_pct: 44,
    macros: { fat:30.8, protein:22.2, net_carb:1.1, cal:377.7, sat_fat:13.6 },
    macros_per_100g_protein: { fat:24, protein:18, nc:0 },
    components: [
      { fid:13  , name:'لحم بقر عالي الدهن', qty:110, role:'protein' },
      { fid:4   , name:'زبدة', qty:5, role:'fat' },
      { fid:64  , name:'سبانخ', qty:80, role:'veg' },
    ],
    cooking_tip: 'مدة الشوي حسب الدرجة المطلوبة',
    phases: [],
  },

  /* LN38 | لحم بقر مفروم 80/20 + زيت زيتون + مشروم | نسبة:1.79 */
  {
    id: 'LN38', protein_group: 'beef', method: 'مفروم/كباب',
    keto_ratio: 1.79, sat_pct: 34,
    macros: { fat:29.3, protein:23.5, net_carb:2.3, cal:371.0, sat_fat:9.9 },
    macros_per_100g_protein: { fat:20, protein:17, nc:0 },
    components: [
      { fid:14  , name:'لحم بقر مفروم 80/20', qty:120, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'كرات الكباب 3-4 دقائق كل جانب',
    phases: [],
  },

  /* LN39 | لحم بقر مفروم 80/20 + زيت زيتون + كوسا | نسبة:1.96 */
  {
    id: 'LN39', protein_group: 'beef', method: 'مفروم/كباب',
    keto_ratio: 1.96, sat_pct: 34,
    macros: { fat:29.3, protein:21.6, net_carb:2.0, cal:366.0, sat_fat:9.9 },
    macros_per_100g_protein: { fat:20, protein:17, nc:0 },
    components: [
      { fid:14  , name:'لحم بقر مفروم 80/20', qty:120, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:73  , name:'كوسا', qty:100, role:'veg' },
    ],
    cooking_tip: 'كرات الكباب 3-4 دقائق كل جانب',
    phases: [],
  },

  /* LN40 | لحم بقر مفروم 80/20 + زيت زيتون + قرنبيط | نسبة:1.72 */
  {
    id: 'LN40', protein_group: 'beef', method: 'مفروم/كباب',
    keto_ratio: 1.72, sat_pct: 34,
    macros: { fat:29.4, protein:22.7, net_carb:3.5, cal:379.0, sat_fat:9.9 },
    macros_per_100g_protein: { fat:20, protein:17, nc:0 },
    components: [
      { fid:14  , name:'لحم بقر مفروم 80/20', qty:120, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:70  , name:'قرنبيط', qty:120, role:'veg' },
    ],
    cooking_tip: 'كرات الكباب 3-4 دقائق كل جانب',
    phases: [],
  },

  /* LN41 | لحم بقر مفروم 80/20 + سمن + مشروم | نسبة:1.79 */
  {
    id: 'LN41', protein_group: 'beef', method: 'مفروم/كباب',
    keto_ratio: 1.79, sat_pct: 42,
    macros: { fat:29.3, protein:23.5, net_carb:2.3, cal:371.7, sat_fat:12.3 },
    macros_per_100g_protein: { fat:20, protein:17, nc:0 },
    components: [
      { fid:14  , name:'لحم بقر مفروم 80/20', qty:120, role:'protein' },
      { fid:3   , name:'سمن', qty:5, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'كرات الكباب 3-4 دقائق كل جانب',
    phases: [],
  },

  /* LN42 | لحم بقر مفروم 80/20 + سمن + كوسا | نسبة:1.96 */
  {
    id: 'LN42', protein_group: 'beef', method: 'مفروم/كباب',
    keto_ratio: 1.96, sat_pct: 42,
    macros: { fat:29.3, protein:21.6, net_carb:2.0, cal:366.7, sat_fat:12.3 },
    macros_per_100g_protein: { fat:20, protein:17, nc:0 },
    components: [
      { fid:14  , name:'لحم بقر مفروم 80/20', qty:120, role:'protein' },
      { fid:3   , name:'سمن', qty:5, role:'fat' },
      { fid:73  , name:'كوسا', qty:100, role:'veg' },
    ],
    cooking_tip: 'كرات الكباب 3-4 دقائق كل جانب',
    phases: [],
  },

  /* LN43 | لحم بقر مفروم 80/20 + سمن + قرنبيط | نسبة:1.71 */
  {
    id: 'LN43', protein_group: 'beef', method: 'مفروم/كباب',
    keto_ratio: 1.71, sat_pct: 42,
    macros: { fat:29.3, protein:22.7, net_carb:3.5, cal:379.7, sat_fat:12.3 },
    macros_per_100g_protein: { fat:20, protein:17, nc:0 },
    components: [
      { fid:14  , name:'لحم بقر مفروم 80/20', qty:120, role:'protein' },
      { fid:3   , name:'سمن', qty:5, role:'fat' },
      { fid:70  , name:'قرنبيط', qty:120, role:'veg' },
    ],
    cooking_tip: 'كرات الكباب 3-4 دقائق كل جانب',
    phases: [],
  },

  /* LN44 | لحم بقر مفروم 80/20 + زبدة + مشروم | نسبة:1.73 */
  {
    id: 'LN44', protein_group: 'beef', method: 'مفروم/كباب',
    keto_ratio: 1.73, sat_pct: 42,
    macros: { fat:28.4, protein:23.5, net_carb:2.3, cal:362.7, sat_fat:11.8 },
    macros_per_100g_protein: { fat:20, protein:17, nc:0 },
    components: [
      { fid:14  , name:'لحم بقر مفروم 80/20', qty:120, role:'protein' },
      { fid:4   , name:'زبدة', qty:5, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'كرات الكباب 3-4 دقائق كل جانب',
    phases: [],
  },

  /* LN45 | لحم بقر مفروم 80/20 + زبدة + كوسا | نسبة:1.9 */
  {
    id: 'LN45', protein_group: 'beef', method: 'مفروم/كباب',
    keto_ratio: 1.9, sat_pct: 42,
    macros: { fat:28.4, protein:21.6, net_carb:2.0, cal:357.7, sat_fat:11.8 },
    macros_per_100g_protein: { fat:20, protein:17, nc:0 },
    components: [
      { fid:14  , name:'لحم بقر مفروم 80/20', qty:120, role:'protein' },
      { fid:4   , name:'زبدة', qty:5, role:'fat' },
      { fid:73  , name:'كوسا', qty:100, role:'veg' },
    ],
    cooking_tip: 'كرات الكباب 3-4 دقائق كل جانب',
    phases: [],
  },

  /* LN46 | لحم بقر مفروم 80/20 + زبدة + قرنبيط | نسبة:1.66 */
  {
    id: 'LN46', protein_group: 'beef', method: 'مفروم/كباب',
    keto_ratio: 1.66, sat_pct: 42,
    macros: { fat:28.4, protein:22.7, net_carb:3.5, cal:370.7, sat_fat:11.8 },
    macros_per_100g_protein: { fat:20, protein:17, nc:0 },
    components: [
      { fid:14  , name:'لحم بقر مفروم 80/20', qty:120, role:'protein' },
      { fid:4   , name:'زبدة', qty:5, role:'fat' },
      { fid:70  , name:'قرنبيط', qty:120, role:'veg' },
    ],
    cooking_tip: 'كرات الكباب 3-4 دقائق كل جانب',
    phases: [],
  },

  /* LN47 | لحم بقر معتدل الدهن + زيت زيتون + مشروم | نسبة:1.1 */
  {
    id: 'LN47', protein_group: 'beef', method: 'ستيك',
    keto_ratio: 1.1, sat_pct: 33,
    macros: { fat:22.1, protein:29.5, net_carb:2.3, cal:326.6, sat_fat:7.3 },
    macros_per_100g_protein: { fat:14, protein:22, nc:0 },
    components: [
      { fid:15  , name:'لحم بقر معتدل الدهن', qty:120, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'Medium rare — 3 دقائق كل جانب',
    phases: [],
  },

  /* LN48 | لحم بقر معتدل الدهن + زيت زيتون + بروكلي | نسبة:0.96 */
  {
    id: 'LN48', protein_group: 'beef', method: 'ستيك',
    keto_ratio: 0.96, sat_pct: 33,
    macros: { fat:22.3, protein:29.8, net_carb:5.3, cal:345.4, sat_fat:7.3 },
    macros_per_100g_protein: { fat:14, protein:22, nc:0 },
    components: [
      { fid:15  , name:'لحم بقر معتدل الدهن', qty:120, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'Medium rare — 3 دقائق كل جانب',
    phases: [],
  },

  /* LN49 | لحم بقر معتدل الدهن + زبدة + مشروم | نسبة:1.26 */
  {
    id: 'LN49', protein_group: 'beef', method: 'ستيك',
    keto_ratio: 1.26, sat_pct: 46,
    macros: { fat:25.2, protein:29.6, net_carb:2.3, cal:354.1, sat_fat:11.7 },
    macros_per_100g_protein: { fat:14, protein:22, nc:0 },
    components: [
      { fid:15  , name:'لحم بقر معتدل الدهن', qty:120, role:'protein' },
      { fid:4   , name:'زبدة', qty:10, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'Medium rare — 3 دقائق كل جانب',
    phases: [],
  },

  /* LN50 | لحم بقر معتدل الدهن + زبدة + بروكلي | نسبة:1.1 */
  {
    id: 'LN50', protein_group: 'beef', method: 'ستيك',
    keto_ratio: 1.1, sat_pct: 46,
    macros: { fat:25.4, protein:29.8, net_carb:5.3, cal:372.9, sat_fat:11.7 },
    macros_per_100g_protein: { fat:14, protein:22, nc:0 },
    components: [
      { fid:15  , name:'لحم بقر معتدل الدهن', qty:120, role:'protein' },
      { fid:4   , name:'زبدة', qty:10, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'Medium rare — 3 دقائق كل جانب',
    phases: [],
  },

  /* LN51 | لحم خروف + زيت زيتون + مشروم | نسبة:1.77 */
  {
    id: 'LN51', protein_group: 'lamb', method: 'كباب/شوي',
    keto_ratio: 1.77, sat_pct: 37,
    macros: { fat:29.5, protein:24.0, net_carb:2.3, cal:376.4, sat_fat:11.0 },
    macros_per_100g_protein: { fat:22, protein:19, nc:0 },
    components: [
      { fid:16  , name:'لحم خروف', qty:110, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'شوي على فحم أو فريدم',
    phases: [],
  },

  /* LN52 | لحم خروف + زيت زيتون + بروكلي | نسبة:1.49 */
  {
    id: 'LN52', protein_group: 'lamb', method: 'كباب/شوي',
    keto_ratio: 1.49, sat_pct: 37,
    macros: { fat:29.7, protein:24.3, net_carb:5.3, cal:395.2, sat_fat:11.0 },
    macros_per_100g_protein: { fat:22, protein:19, nc:0 },
    components: [
      { fid:16  , name:'لحم خروف', qty:110, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'شوي على فحم أو فريدم',
    phases: [],
  },

  /* LN53 | لحم خروف + زيت زيتون + كوسا | نسبة:1.93 */
  {
    id: 'LN53', protein_group: 'lamb', method: 'كباب/شوي',
    keto_ratio: 1.93, sat_pct: 37,
    macros: { fat:29.5, protein:22.1, net_carb:2.0, cal:371.4, sat_fat:11.0 },
    macros_per_100g_protein: { fat:22, protein:19, nc:0 },
    components: [
      { fid:16  , name:'لحم خروف', qty:110, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:73  , name:'كوسا', qty:100, role:'veg' },
    ],
    cooking_tip: 'شوي على فحم أو فريدم',
    phases: [],
  },

  /* LN54 | لحم خروف + سمن + مشروم | نسبة:1.77 */
  {
    id: 'LN54', protein_group: 'lamb', method: 'كباب/شوي',
    keto_ratio: 1.77, sat_pct: 45,
    macros: { fat:29.5, protein:24.0, net_carb:2.3, cal:377.1, sat_fat:13.4 },
    macros_per_100g_protein: { fat:22, protein:19, nc:0 },
    components: [
      { fid:16  , name:'لحم خروف', qty:110, role:'protein' },
      { fid:3   , name:'سمن', qty:5, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'شوي على فحم أو فريدم',
    phases: [],
  },

  /* LN55 | لحم خروف + سمن + بروكلي | نسبة:1.49 */
  {
    id: 'LN55', protein_group: 'lamb', method: 'كباب/شوي',
    keto_ratio: 1.49, sat_pct: 45,
    macros: { fat:29.7, protein:24.3, net_carb:5.3, cal:395.9, sat_fat:13.4 },
    macros_per_100g_protein: { fat:22, protein:19, nc:0 },
    components: [
      { fid:16  , name:'لحم خروف', qty:110, role:'protein' },
      { fid:3   , name:'سمن', qty:5, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'شوي على فحم أو فريدم',
    phases: [],
  },

  /* LN56 | لحم خروف + سمن + كوسا | نسبة:1.93 */
  {
    id: 'LN56', protein_group: 'lamb', method: 'كباب/شوي',
    keto_ratio: 1.93, sat_pct: 45,
    macros: { fat:29.5, protein:22.1, net_carb:2.0, cal:372.1, sat_fat:13.4 },
    macros_per_100g_protein: { fat:22, protein:19, nc:0 },
    components: [
      { fid:16  , name:'لحم خروف', qty:110, role:'protein' },
      { fid:3   , name:'سمن', qty:5, role:'fat' },
      { fid:73  , name:'كوسا', qty:100, role:'veg' },
    ],
    cooking_tip: 'شوي على فحم أو فريدم',
    phases: [],
  },

  /* LN57 | سلمون + زيت زيتون + مشروم | نسبة:1.12 */
  {
    id: 'LN57', protein_group: 'seafood', method: 'مشوي/فرن',
    keto_ratio: 1.12, sat_pct: 18,
    macros: { fat:22.2, protein:29.1, net_carb:2.3, cal:336.6, sat_fat:4.0 },
    macros_per_100g_protein: { fat:13, protein:20, nc:0 },
    components: [
      { fid:17  , name:'سلمون', qty:130, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'فرن 180 درجة 15 دقيقة',
    phases: [],
  },

  /* LN58 | سلمون + زيت زيتون + بروكلي | نسبة:0.98 */
  {
    id: 'LN58', protein_group: 'seafood', method: 'مشوي/فرن',
    keto_ratio: 0.98, sat_pct: 18,
    macros: { fat:22.4, protein:29.4, net_carb:5.3, cal:355.4, sat_fat:4.0 },
    macros_per_100g_protein: { fat:13, protein:20, nc:0 },
    components: [
      { fid:17  , name:'سلمون', qty:130, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'فرن 180 درجة 15 دقيقة',
    phases: [],
  },

  /* LN59 | سلمون + زيت زيتون + كوسا | نسبة:1.21 */
  {
    id: 'LN59', protein_group: 'seafood', method: 'مشوي/فرن',
    keto_ratio: 1.21, sat_pct: 18,
    macros: { fat:22.2, protein:27.2, net_carb:2.0, cal:331.6, sat_fat:4.0 },
    macros_per_100g_protein: { fat:13, protein:20, nc:0 },
    components: [
      { fid:17  , name:'سلمون', qty:130, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:73  , name:'كوسا', qty:100, role:'veg' },
    ],
    cooking_tip: 'فرن 180 درجة 15 دقيقة',
    phases: [],
  },

  /* LN60 | سلمون + زيت زيتون + فلفل رومي | نسبة:1.22 */
  {
    id: 'LN60', protein_group: 'seafood', method: 'مشوي/فرن',
    keto_ratio: 1.22, sat_pct: 18,
    macros: { fat:22.1, protein:26.7, net_carb:2.1, cal:330.6, sat_fat:4.0 },
    macros_per_100g_protein: { fat:13, protein:20, nc:0 },
    components: [
      { fid:17  , name:'سلمون', qty:130, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:71  , name:'فلفل رومي', qty:80, role:'veg' },
    ],
    cooking_tip: 'فرن 180 درجة 15 دقيقة',
    phases: [],
  },

  /* LN61 | سلمون + زبدة + مشروم | نسبة:1.28 */
  {
    id: 'LN61', protein_group: 'seafood', method: 'مشوي/فرن',
    keto_ratio: 1.28, sat_pct: 33,
    macros: { fat:25.3, protein:29.2, net_carb:2.3, cal:364.1, sat_fat:8.4 },
    macros_per_100g_protein: { fat:13, protein:20, nc:0 },
    components: [
      { fid:17  , name:'سلمون', qty:130, role:'protein' },
      { fid:4   , name:'زبدة', qty:10, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'فرن 180 درجة 15 دقيقة',
    phases: [],
  },

  /* LN62 | سلمون + زبدة + بروكلي | نسبة:1.11 */
  {
    id: 'LN62', protein_group: 'seafood', method: 'مشوي/فرن',
    keto_ratio: 1.11, sat_pct: 33,
    macros: { fat:25.5, protein:29.4, net_carb:5.3, cal:382.9, sat_fat:8.4 },
    macros_per_100g_protein: { fat:13, protein:20, nc:0 },
    components: [
      { fid:17  , name:'سلمون', qty:130, role:'protein' },
      { fid:4   , name:'زبدة', qty:10, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'فرن 180 درجة 15 دقيقة',
    phases: [],
  },

  /* LN63 | سلمون + زبدة + كوسا | نسبة:1.38 */
  {
    id: 'LN63', protein_group: 'seafood', method: 'مشوي/فرن',
    keto_ratio: 1.38, sat_pct: 33,
    macros: { fat:25.3, protein:27.3, net_carb:2.0, cal:359.1, sat_fat:8.4 },
    macros_per_100g_protein: { fat:13, protein:20, nc:0 },
    components: [
      { fid:17  , name:'سلمون', qty:130, role:'protein' },
      { fid:4   , name:'زبدة', qty:10, role:'fat' },
      { fid:73  , name:'كوسا', qty:100, role:'veg' },
    ],
    cooking_tip: 'فرن 180 درجة 15 دقيقة',
    phases: [],
  },

  /* LN64 | سلمون + زبدة + فلفل رومي | نسبة:1.39 */
  {
    id: 'LN64', protein_group: 'seafood', method: 'مشوي/فرن',
    keto_ratio: 1.39, sat_pct: 33,
    macros: { fat:25.2, protein:26.8, net_carb:2.1, cal:358.1, sat_fat:8.4 },
    macros_per_100g_protein: { fat:13, protein:20, nc:0 },
    components: [
      { fid:17  , name:'سلمون', qty:130, role:'protein' },
      { fid:4   , name:'زبدة', qty:10, role:'fat' },
      { fid:71  , name:'فلفل رومي', qty:80, role:'veg' },
    ],
    cooking_tip: 'فرن 180 درجة 15 دقيقة',
    phases: [],
  },

  /* LN65 | سمك أبيض + زيت زيتون + مشروم | نسبة:1.22 */
  {
    id: 'LN65', protein_group: 'seafood', method: 'مشوي',
    keto_ratio: 1.22, sat_pct: 16,
    macros: { fat:29.3, protein:36.1, net_carb:2.3, cal:423.8, sat_fat:4.6 },
    macros_per_100g_protein: { fat:6, protein:22, nc:0 },
    components: [
      { fid:20  , name:'سمك أبيض', qty:150, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:20, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'مشوي مع ليمون وثوم وزيت زيتون',
    phases: [],
  },

  /* LN66 | سمك أبيض + زيت زيتون + بروكلي | نسبة:1.09 */
  {
    id: 'LN66', protein_group: 'seafood', method: 'مشوي',
    keto_ratio: 1.09, sat_pct: 16,
    macros: { fat:29.5, protein:36.4, net_carb:5.3, cal:442.6, sat_fat:4.6 },
    macros_per_100g_protein: { fat:6, protein:22, nc:0 },
    components: [
      { fid:20  , name:'سمك أبيض', qty:150, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:20, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'مشوي مع ليمون وثوم وزيت زيتون',
    phases: [],
  },

  /* LN67 | سمك أبيض + زيت زيتون + كوسا | نسبة:1.3 */
  {
    id: 'LN67', protein_group: 'seafood', method: 'مشوي',
    keto_ratio: 1.3, sat_pct: 16,
    macros: { fat:29.3, protein:34.2, net_carb:2.0, cal:418.8, sat_fat:4.6 },
    macros_per_100g_protein: { fat:6, protein:22, nc:0 },
    components: [
      { fid:20  , name:'سمك أبيض', qty:150, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:20, role:'fat' },
      { fid:73  , name:'كوسا', qty:100, role:'veg' },
    ],
    cooking_tip: 'مشوي مع ليمون وثوم وزيت زيتون',
    phases: [],
  },

  /* LN68 | سمك أبيض + زبدة + مشروم | نسبة:1.23 */
  {
    id: 'LN68', protein_group: 'seafood', method: 'مشوي',
    keto_ratio: 1.23, sat_pct: 49,
    macros: { fat:29.6, protein:36.3, net_carb:2.3, cal:426.2, sat_fat:14.6 },
    macros_per_100g_protein: { fat:6, protein:22, nc:0 },
    components: [
      { fid:20  , name:'سمك أبيض', qty:150, role:'protein' },
      { fid:4   , name:'زبدة', qty:25, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'مشوي مع ليمون وثوم وزيت زيتون',
    phases: [],
  },

  /* LN69 | سمك أبيض + زبدة + بروكلي | نسبة:1.09 */
  {
    id: 'LN69', protein_group: 'seafood', method: 'مشوي',
    keto_ratio: 1.09, sat_pct: 49,
    macros: { fat:29.7, protein:36.6, net_carb:5.3, cal:445.1, sat_fat:14.6 },
    macros_per_100g_protein: { fat:6, protein:22, nc:0 },
    components: [
      { fid:20  , name:'سمك أبيض', qty:150, role:'protein' },
      { fid:4   , name:'زبدة', qty:25, role:'fat' },
      { fid:69  , name:'بروكلي', qty:120, role:'veg' },
    ],
    cooking_tip: 'مشوي مع ليمون وثوم وزيت زيتون',
    phases: [],
  },

  /* LN70 | سمك أبيض + زبدة + كوسا | نسبة:1.31 */
  {
    id: 'LN70', protein_group: 'seafood', method: 'مشوي',
    keto_ratio: 1.31, sat_pct: 49,
    macros: { fat:29.6, protein:34.4, net_carb:2.0, cal:421.2, sat_fat:14.6 },
    macros_per_100g_protein: { fat:6, protein:22, nc:0 },
    components: [
      { fid:20  , name:'سمك أبيض', qty:150, role:'protein' },
      { fid:4   , name:'زبدة', qty:25, role:'fat' },
      { fid:73  , name:'كوسا', qty:100, role:'veg' },
    ],
    cooking_tip: 'مشوي مع ليمون وثوم وزيت زيتون',
    phases: [],
  },

  /* LN71 | جمبري + زيت زيتون + مشروم | نسبة:1.26 */
  {
    id: 'LN71', protein_group: 'seafood', method: 'مشوي/محمر',
    keto_ratio: 1.26, sat_pct: 14,
    macros: { fat:27.9, protein:33.1, net_carb:2.3, cal:391.5, sat_fat:4.0 },
    macros_per_100g_protein: { fat:1.7, protein:20, nc:0 },
    components: [
      { fid:21  , name:'جمبري', qty:150, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:25, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'محمر بالثوم والزبدة 3 دقائق',
    phases: [],
  },

  /* LN72 | جمبري + زيت زيتون + سبانخ | نسبة:1.36 */
  {
    id: 'LN72', protein_group: 'seafood', method: 'مشوي/محمر',
    keto_ratio: 1.36, sat_pct: 14,
    macros: { fat:27.9, protein:32.3, net_carb:1.1, cal:387.9, sat_fat:4.0 },
    macros_per_100g_protein: { fat:1.7, protein:20, nc:0 },
    components: [
      { fid:21  , name:'جمبري', qty:150, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:25, role:'fat' },
      { fid:64  , name:'سبانخ', qty:80, role:'veg' },
    ],
    cooking_tip: 'محمر بالثوم والزبدة 3 دقائق',
    phases: [],
  },

  /* LN73 | جمبري + زيت زيتون + كوسا | نسبة:1.35 */
  {
    id: 'LN73', protein_group: 'seafood', method: 'مشوي/محمر',
    keto_ratio: 1.35, sat_pct: 14,
    macros: { fat:27.9, protein:31.2, net_carb:2.0, cal:386.5, sat_fat:4.0 },
    macros_per_100g_protein: { fat:1.7, protein:20, nc:0 },
    components: [
      { fid:21  , name:'جمبري', qty:150, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:25, role:'fat' },
      { fid:73  , name:'كوسا', qty:100, role:'veg' },
    ],
    cooking_tip: 'محمر بالثوم والزبدة 3 دقائق',
    phases: [],
  },

  /* LN74 | جمبري + زبدة + مشروم | نسبة:1.22 */
  {
    id: 'LN74', protein_group: 'seafood', method: 'مشوي/محمر',
    keto_ratio: 1.22, sat_pct: 58,
    macros: { fat:27.2, protein:33.4, net_carb:2.3, cal:385.6, sat_fat:15.7 },
    macros_per_100g_protein: { fat:1.7, protein:20, nc:0 },
    components: [
      { fid:21  , name:'جمبري', qty:150, role:'protein' },
      { fid:4   , name:'زبدة', qty:30, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'محمر بالثوم والزبدة 3 دقائق',
    phases: [],
  },

  /* LN75 | جمبري + زبدة + سبانخ | نسبة:1.32 */
  {
    id: 'LN75', protein_group: 'seafood', method: 'مشوي/محمر',
    keto_ratio: 1.32, sat_pct: 58,
    macros: { fat:27.2, protein:32.6, net_carb:1.1, cal:382.0, sat_fat:15.8 },
    macros_per_100g_protein: { fat:1.7, protein:20, nc:0 },
    components: [
      { fid:21  , name:'جمبري', qty:150, role:'protein' },
      { fid:4   , name:'زبدة', qty:30, role:'fat' },
      { fid:64  , name:'سبانخ', qty:80, role:'veg' },
    ],
    cooking_tip: 'محمر بالثوم والزبدة 3 دقائق',
    phases: [],
  },

  /* LN76 | جمبري + زبدة + كوسا | نسبة:1.3 */
  {
    id: 'LN76', protein_group: 'seafood', method: 'مشوي/محمر',
    keto_ratio: 1.3, sat_pct: 58,
    macros: { fat:27.2, protein:31.5, net_carb:2.0, cal:380.6, sat_fat:15.7 },
    macros_per_100g_protein: { fat:1.7, protein:20, nc:0 },
    components: [
      { fid:21  , name:'جمبري', qty:150, role:'protein' },
      { fid:4   , name:'زبدة', qty:30, role:'fat' },
      { fid:73  , name:'كوسا', qty:100, role:'veg' },
    ],
    cooking_tip: 'محمر بالثوم والزبدة 3 دقائق',
    phases: [],
  },

  /* LN77 | جمبري + كريمة + مشروم | نسبة:0.72 */
  {
    id: 'LN77', protein_group: 'seafood', method: 'مشوي/محمر',
    keto_ratio: 0.72, sat_pct: 56,
    macros: { fat:17.2, protein:33.9, net_carb:3.4, cal:306.5, sat_fat:9.7 },
    macros_per_100g_protein: { fat:1.7, protein:20, nc:0 },
    components: [
      { fid:21  , name:'جمبري', qty:150, role:'protein' },
      { fid:38  , name:'كريمة', qty:40, role:'fat' },
      { fid:68  , name:'مشروم', qty:100, role:'veg' },
    ],
    cooking_tip: 'محمر بالثوم والزبدة 3 دقائق',
    phases: [],
  },

  /* LN78 | جمبري + كريمة + سبانخ | نسبة:0.78 */
  {
    id: 'LN78', protein_group: 'seafood', method: 'مشوي/محمر',
    keto_ratio: 0.78, sat_pct: 56,
    macros: { fat:17.3, protein:33.1, net_carb:2.2, cal:302.9, sat_fat:9.7 },
    macros_per_100g_protein: { fat:1.7, protein:20, nc:0 },
    components: [
      { fid:21  , name:'جمبري', qty:150, role:'protein' },
      { fid:38  , name:'كريمة', qty:40, role:'fat' },
      { fid:64  , name:'سبانخ', qty:80, role:'veg' },
    ],
    cooking_tip: 'محمر بالثوم والزبدة 3 دقائق',
    phases: [],
  },

  /* LN79 | جمبري + كريمة + كوسا | نسبة:0.77 */
  {
    id: 'LN79', protein_group: 'seafood', method: 'مشوي/محمر',
    keto_ratio: 0.77, sat_pct: 56,
    macros: { fat:17.2, protein:32.0, net_carb:3.1, cal:301.5, sat_fat:9.7 },
    macros_per_100g_protein: { fat:1.7, protein:20, nc:0 },
    components: [
      { fid:21  , name:'جمبري', qty:150, role:'protein' },
      { fid:38  , name:'كريمة', qty:40, role:'fat' },
      { fid:73  , name:'كوسا', qty:100, role:'veg' },
    ],
    cooking_tip: 'محمر بالثوم والزبدة 3 دقائق',
    phases: [],
  },

];

/* ════════════════════════════════════════════════════════════════
   DINNER_TEMPLATES — وصفات العشاء
   الأولوية: تونة ← أجبان ← بيض ← دجاج
   تُبنى على المتبقي الفعلي بعد الفطور والغداء
════════════════════════════════════════════════════════════════ */
const DINNER_TEMPLATES = [

  /* DN01 | تونة بالماء + زيت زيتون + جرجير | نسبة:1.28 */
  {
    id: 'DN01', protein_group: 'tuna', method: 'بارد/سلطة',
    keto_ratio: 1.28, sat_pct: 15,
    macros: { fat:23.9, protein:29.3, net_carb:1.1, cal:341.9, sat_fat:3.7 },
    components: [
      { fid:19  , name:'تونة بالماء', qty:140, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:20, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: 'علبة تونة صافية + دهن + خضار',
    phases: [],
  },

  /* DN02 | تونة بالماء + زيت زيتون + خيار | نسبة:1.27 */
  {
    id: 'DN02', protein_group: 'tuna', method: 'بارد/سلطة',
    keto_ratio: 1.27, sat_pct: 15,
    macros: { fat:23.6, protein:28.6, net_carb:1.4, cal:339.0, sat_fat:3.6 },
    components: [
      { fid:19  , name:'تونة بالماء', qty:140, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:20, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: 'علبة تونة صافية + دهن + خضار',
    phases: [],
  },

  /* DN03 | تونة بالماء + زيت زيتون + خس | نسبة:1.33 */
  {
    id: 'DN03', protein_group: 'tuna', method: 'بارد/سلطة',
    keto_ratio: 1.33, sat_pct: 15,
    macros: { fat:23.6, protein:28.8, net_carb:0.5, cal:337.2, sat_fat:3.6 },
    components: [
      { fid:19  , name:'تونة بالماء', qty:140, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:20, role:'fat' },
      { fid:63  , name:'خس', qty:60, role:'veg' },
    ],
    cooking_tip: 'علبة تونة صافية + دهن + خضار',
    phases: [],
  },

  /* DN04 | تونة بالماء + زيت زيتون + طماطم | نسبة:1.26 */
  {
    id: 'DN04', protein_group: 'tuna', method: 'بارد/سلطة',
    keto_ratio: 1.26, sat_pct: 15,
    macros: { fat:23.6, protein:28.5, net_carb:1.6, cal:340.2, sat_fat:3.6 },
    components: [
      { fid:19  , name:'تونة بالماء', qty:140, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:20, role:'fat' },
      { fid:75  , name:'طماطم', qty:60, role:'veg' },
    ],
    cooking_tip: 'علبة تونة صافية + دهن + خضار',
    phases: [],
  },

  /* DN05 | تونة بالماء + أفوكادو + جرجير | نسبة:0.53 */
  {
    id: 'DN05', protein_group: 'tuna', method: 'بارد/سلطة',
    keto_ratio: 0.53, sat_pct: 17,
    macros: { fat:10.6, protein:30.2, net_carb:1.9, cal:237.1, sat_fat:1.8 },
    components: [
      { fid:19  , name:'تونة بالماء', qty:140, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:45, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: 'علبة تونة صافية + دهن + خضار',
    phases: [],
  },

  /* DN06 | تونة بالماء + أفوكادو + خيار | نسبة:0.52 */
  {
    id: 'DN06', protein_group: 'tuna', method: 'بارد/سلطة',
    keto_ratio: 0.52, sat_pct: 17,
    macros: { fat:10.3, protein:29.5, net_carb:2.2, cal:234.2, sat_fat:1.8 },
    components: [
      { fid:19  , name:'تونة بالماء', qty:140, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:45, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: 'علبة تونة صافية + دهن + خضار',
    phases: [],
  },

  /* DN07 | تونة بالماء + أفوكادو + خس | نسبة:0.54 */
  {
    id: 'DN07', protein_group: 'tuna', method: 'بارد/سلطة',
    keto_ratio: 0.54, sat_pct: 17,
    macros: { fat:10.4, protein:29.7, net_carb:1.4, cal:232.4, sat_fat:1.8 },
    components: [
      { fid:19  , name:'تونة بالماء', qty:140, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:45, role:'fat' },
      { fid:63  , name:'خس', qty:60, role:'veg' },
    ],
    cooking_tip: 'علبة تونة صافية + دهن + خضار',
    phases: [],
  },

  /* DN08 | تونة بالماء + أفوكادو + طماطم | نسبة:0.52 */
  {
    id: 'DN08', protein_group: 'tuna', method: 'بارد/سلطة',
    keto_ratio: 0.52, sat_pct: 17,
    macros: { fat:10.4, protein:29.4, net_carb:2.4, cal:235.4, sat_fat:1.8 },
    components: [
      { fid:19  , name:'تونة بالماء', qty:140, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:45, role:'fat' },
      { fid:75  , name:'طماطم', qty:60, role:'veg' },
    ],
    cooking_tip: 'علبة تونة صافية + دهن + خضار',
    phases: [],
  },

  /* DN09 | تونة بالماء + زيتون + جرجير | نسبة:0.55 */
  {
    id: 'DN09', protein_group: 'tuna', method: 'بارد/سلطة',
    keto_ratio: 0.55, sat_pct: 17,
    macros: { fat:10.6, protein:29.8, net_carb:1.3, cal:230.3, sat_fat:1.8 },
    components: [
      { fid:19  , name:'تونة بالماء', qty:140, role:'protein' },
      { fid:113 , name:'زيتون', qty:45, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: 'علبة تونة صافية + دهن + خضار',
    phases: [],
  },

  /* DN10 | تونة بالماء + زيتون + خيار | نسبة:0.54 */
  {
    id: 'DN10', protein_group: 'tuna', method: 'بارد/سلطة',
    keto_ratio: 0.54, sat_pct: 17,
    macros: { fat:10.3, protein:29.1, net_carb:1.7, cal:227.4, sat_fat:1.7 },
    components: [
      { fid:19  , name:'تونة بالماء', qty:140, role:'protein' },
      { fid:113 , name:'زيتون', qty:45, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: 'علبة تونة صافية + دهن + خضار',
    phases: [],
  },

  /* DN11 | تونة بالماء + زيتون + خس | نسبة:0.57 */
  {
    id: 'DN11', protein_group: 'tuna', method: 'بارد/سلطة',
    keto_ratio: 0.57, sat_pct: 16,
    macros: { fat:10.4, protein:29.3, net_carb:0.8, cal:225.7, sat_fat:1.7 },
    components: [
      { fid:19  , name:'تونة بالماء', qty:140, role:'protein' },
      { fid:113 , name:'زيتون', qty:45, role:'fat' },
      { fid:63  , name:'خس', qty:60, role:'veg' },
    ],
    cooking_tip: 'علبة تونة صافية + دهن + خضار',
    phases: [],
  },

  /* DN12 | تونة بالماء + زيتون + طماطم | نسبة:0.54 */
  {
    id: 'DN12', protein_group: 'tuna', method: 'بارد/سلطة',
    keto_ratio: 0.54, sat_pct: 16,
    macros: { fat:10.4, protein:29.0, net_carb:1.8, cal:228.7, sat_fat:1.7 },
    components: [
      { fid:19  , name:'تونة بالماء', qty:140, role:'protein' },
      { fid:113 , name:'زيتون', qty:45, role:'fat' },
      { fid:75  , name:'طماطم', qty:60, role:'veg' },
    ],
    cooking_tip: 'علبة تونة صافية + دهن + خضار',
    phases: [],
  },

  /* DN13 | جبنة حلومي + زيت زيتون + جرجير | نسبة:1.88 */
  {
    id: 'DN13', protein_group: 'cheese', method: 'مشوي',
    keto_ratio: 1.88, sat_pct: 54,
    macros: { fat:25.4, protein:18.9, net_carb:2.2, cal:313.5, sat_fat:13.6 },
    components: [
      { fid:27  , name:'جبنة حلومي', qty:80, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: 'مشوي بالتفلون 2 دقيقة كل جانب',
    phases: [],
  },

  /* DN14 | جبنة حلومي + زيت زيتون + خيار | نسبة:1.86 */
  {
    id: 'DN14', protein_group: 'cheese', method: 'مشوي',
    keto_ratio: 1.86, sat_pct: 54,
    macros: { fat:25.1, protein:18.2, net_carb:2.6, cal:310.6, sat_fat:13.5 },
    components: [
      { fid:27  , name:'جبنة حلومي', qty:80, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: 'مشوي بالتفلون 2 دقيقة كل جانب',
    phases: [],
  },

  /* DN15 | جبنة حلومي + زيت زيتون + طماطم | نسبة:1.84 */
  {
    id: 'DN15', protein_group: 'cheese', method: 'مشوي',
    keto_ratio: 1.84, sat_pct: 54,
    macros: { fat:25.1, protein:18.1, net_carb:2.8, cal:311.8, sat_fat:13.5 },
    components: [
      { fid:27  , name:'جبنة حلومي', qty:80, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:75  , name:'طماطم', qty:60, role:'veg' },
    ],
    cooking_tip: 'مشوي بالتفلون 2 دقيقة كل جانب',
    phases: [],
  },

  /* DN16 | جبنة حلومي + أفوكادو + جرجير | نسبة:1.54 */
  {
    id: 'DN16', protein_group: 'cheese', method: 'مشوي',
    keto_ratio: 1.54, sat_pct: 62,
    macros: { fat:21.1, protein:19.0, net_carb:2.3, cal:277.3, sat_fat:13.0 },
    components: [
      { fid:27  , name:'جبنة حلومي', qty:80, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:5, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: 'مشوي بالتفلون 2 دقيقة كل جانب',
    phases: [],
  },

  /* DN17 | جبنة حلومي + أفوكادو + خيار | نسبة:1.52 */
  {
    id: 'DN17', protein_group: 'cheese', method: 'مشوي',
    keto_ratio: 1.52, sat_pct: 62,
    macros: { fat:20.8, protein:18.3, net_carb:2.7, cal:274.4, sat_fat:12.9 },
    components: [
      { fid:27  , name:'جبنة حلومي', qty:80, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:5, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: 'مشوي بالتفلون 2 دقيقة كل جانب',
    phases: [],
  },

  /* DN18 | جبنة حلومي + أفوكادو + طماطم | نسبة:1.51 */
  {
    id: 'DN18', protein_group: 'cheese', method: 'مشوي',
    keto_ratio: 1.51, sat_pct: 62,
    macros: { fat:20.9, protein:18.2, net_carb:2.9, cal:275.6, sat_fat:12.9 },
    components: [
      { fid:27  , name:'جبنة حلومي', qty:80, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:5, role:'fat' },
      { fid:75  , name:'طماطم', qty:60, role:'veg' },
    ],
    cooking_tip: 'مشوي بالتفلون 2 دقيقة كل جانب',
    phases: [],
  },

  /* DN19 | جبنة شيدر + زيت زيتون + جرجير | نسبة:2.22 */
  {
    id: 'DN19', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 2.22, sat_pct: 49,
    macros: { fat:18.6, protein:11.3, net_carb:1.6, cal:217.9, sat_fat:9.2 },
    components: [
      { fid:29  , name:'جبنة شيدر', qty:40, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: 'مع سلطة خضراء',
    phases: [],
  },

  /* DN20 | جبنة شيدر + زيت زيتون + خس | نسبة:2.41 */
  {
    id: 'DN20', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 2.41, sat_pct: 50,
    macros: { fat:18.3, protein:10.8, net_carb:1.1, cal:213.2, sat_fat:9.1 },
    components: [
      { fid:29  , name:'جبنة شيدر', qty:40, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:63  , name:'خس', qty:60, role:'veg' },
    ],
    cooking_tip: 'مع سلطة خضراء',
    phases: [],
  },

  /* DN21 | جبنة شيدر + زيت زيتون + خيار | نسبة:2.19 */
  {
    id: 'DN21', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 2.19, sat_pct: 50,
    macros: { fat:18.3, protein:10.6, net_carb:2.0, cal:215.0, sat_fat:9.1 },
    components: [
      { fid:29  , name:'جبنة شيدر', qty:40, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: 'مع سلطة خضراء',
    phases: [],
  },

  /* DN22 | جبنة شيدر + أفوكادو + جرجير | نسبة:1.67 */
  {
    id: 'DN22', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 1.67, sat_pct: 60,
    macros: { fat:14.3, protein:11.4, net_carb:1.7, cal:181.7, sat_fat:8.6 },
    components: [
      { fid:29  , name:'جبنة شيدر', qty:40, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:5, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: 'مع سلطة خضراء',
    phases: [],
  },

  /* DN23 | جبنة شيدر + أفوكادو + خس | نسبة:1.85 */
  {
    id: 'DN23', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 1.85, sat_pct: 60,
    macros: { fat:14.1, protein:10.9, net_carb:1.1, cal:177.0, sat_fat:8.5 },
    components: [
      { fid:29  , name:'جبنة شيدر', qty:40, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:5, role:'fat' },
      { fid:63  , name:'خس', qty:60, role:'veg' },
    ],
    cooking_tip: 'مع سلطة خضراء',
    phases: [],
  },

  /* DN24 | جبنة شيدر + أفوكادو + خيار | نسبة:1.64 */
  {
    id: 'DN24', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 1.64, sat_pct: 61,
    macros: { fat:14.0, protein:10.7, net_carb:2.1, cal:178.8, sat_fat:8.5 },
    components: [
      { fid:29  , name:'جبنة شيدر', qty:40, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:5, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: 'مع سلطة خضراء',
    phases: [],
  },

  /* DN25 | جبنة فيتا + زيت زيتون + جرجير | نسبة:1.93 */
  {
    id: 'DN25', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 1.93, sat_pct: 54,
    macros: { fat:18.0, protein:9.7, net_carb:3.5, cal:215.1, sat_fat:9.8 },
    components: [
      { fid:30  , name:'جبنة فيتا', qty:60, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: 'مع زيتون وزيت زيتون',
    phases: [],
  },

  /* DN26 | جبنة فيتا + زيت زيتون + خس | نسبة:2.08 */
  {
    id: 'DN26', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 2.08, sat_pct: 55,
    macros: { fat:17.7, protein:9.2, net_carb:3.0, cal:210.4, sat_fat:9.7 },
    components: [
      { fid:30  , name:'جبنة فيتا', qty:60, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:63  , name:'خس', qty:60, role:'veg' },
    ],
    cooking_tip: 'مع زيتون وزيت زيتون',
    phases: [],
  },

  /* DN27 | جبنة فيتا + زيت زيتون + خيار | نسبة:1.9 */
  {
    id: 'DN27', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 1.9, sat_pct: 55,
    macros: { fat:17.7, protein:9.0, net_carb:3.9, cal:212.2, sat_fat:9.7 },
    components: [
      { fid:30  , name:'جبنة فيتا', qty:60, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: 'مع زيتون وزيت زيتون',
    phases: [],
  },

  /* DN28 | جبنة فيتا + أفوكادو + جرجير | نسبة:1.45 */
  {
    id: 'DN28', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 1.45, sat_pct: 67,
    macros: { fat:13.7, protein:9.8, net_carb:3.6, cal:178.9, sat_fat:9.2 },
    components: [
      { fid:30  , name:'جبنة فيتا', qty:60, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:5, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: 'مع زيتون وزيت زيتون',
    phases: [],
  },

  /* DN29 | جبنة فيتا + أفوكادو + خس | نسبة:1.56 */
  {
    id: 'DN29', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 1.56, sat_pct: 67,
    macros: { fat:13.5, protein:9.3, net_carb:3.1, cal:174.2, sat_fat:9.1 },
    components: [
      { fid:30  , name:'جبنة فيتا', qty:60, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:5, role:'fat' },
      { fid:63  , name:'خس', qty:60, role:'veg' },
    ],
    cooking_tip: 'مع زيتون وزيت زيتون',
    phases: [],
  },

  /* DN30 | جبنة فيتا + أفوكادو + خيار | نسبة:1.42 */
  {
    id: 'DN30', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 1.42, sat_pct: 68,
    macros: { fat:13.4, protein:9.1, net_carb:4.0, cal:176.0, sat_fat:9.1 },
    components: [
      { fid:30  , name:'جبنة فيتا', qty:60, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:5, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: 'مع زيتون وزيت زيتون',
    phases: [],
  },

  /* DN31 | جبنة فيتا + زيتون + جرجير | نسبة:1.46 */
  {
    id: 'DN31', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 1.46, sat_pct: 67,
    macros: { fat:13.7, protein:9.8, net_carb:3.5, cal:178.2, sat_fat:9.2 },
    components: [
      { fid:30  , name:'جبنة فيتا', qty:60, role:'protein' },
      { fid:113 , name:'زيتون', qty:5, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: 'مع زيتون وزيت زيتون',
    phases: [],
  },

  /* DN32 | جبنة فيتا + زيتون + خس | نسبة:1.57 */
  {
    id: 'DN32', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 1.57, sat_pct: 67,
    macros: { fat:13.5, protein:9.3, net_carb:3.0, cal:173.5, sat_fat:9.1 },
    components: [
      { fid:30  , name:'جبنة فيتا', qty:60, role:'protein' },
      { fid:113 , name:'زيتون', qty:5, role:'fat' },
      { fid:63  , name:'خس', qty:60, role:'veg' },
    ],
    cooking_tip: 'مع زيتون وزيت زيتون',
    phases: [],
  },

  /* DN33 | جبنة فيتا + زيتون + خيار | نسبة:1.44 */
  {
    id: 'DN33', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 1.44, sat_pct: 68,
    macros: { fat:13.4, protein:9.0, net_carb:3.9, cal:175.2, sat_fat:9.1 },
    components: [
      { fid:30  , name:'جبنة فيتا', qty:60, role:'protein' },
      { fid:113 , name:'زيتون', qty:5, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: 'مع زيتون وزيت زيتون',
    phases: [],
  },

  /* DN34 | جبنة موزاريلا + زيت زيتون + جرجير | نسبة:1.65 */
  {
    id: 'DN34', protein_group: 'cheese', method: 'بارد/مشوي',
    keto_ratio: 1.65, sat_pct: 50,
    macros: { fat:20.8, protein:16.7, net_carb:2.6, cal:266.7, sat_fat:10.5 },
    components: [
      { fid:32  , name:'جبنة موزاريلا', qty:70, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: 'مع طماطم وزيت زيتون',
    phases: [],
  },

  /* DN35 | جبنة موزاريلا + زيت زيتون + طماطم | نسبة:1.61 */
  {
    id: 'DN35', protein_group: 'cheese', method: 'بارد/مشوي',
    keto_ratio: 1.61, sat_pct: 51,
    macros: { fat:20.5, protein:15.9, net_carb:3.2, cal:265.0, sat_fat:10.5 },
    components: [
      { fid:32  , name:'جبنة موزاريلا', qty:70, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:75  , name:'طماطم', qty:60, role:'veg' },
    ],
    cooking_tip: 'مع طماطم وزيت زيتون',
    phases: [],
  },

  /* DN36 | جبنة موزاريلا + زيت زيتون + خيار | نسبة:1.63 */
  {
    id: 'DN36', protein_group: 'cheese', method: 'بارد/مشوي',
    keto_ratio: 1.63, sat_pct: 51,
    macros: { fat:20.5, protein:16.0, net_carb:3.0, cal:263.8, sat_fat:10.5 },
    components: [
      { fid:32  , name:'جبنة موزاريلا', qty:70, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: 'مع طماطم وزيت زيتون',
    phases: [],
  },

  /* DN37 | جبنة موزاريلا + أفوكادو + جرجير | نسبة:1.29 */
  {
    id: 'DN37', protein_group: 'cheese', method: 'بارد/مشوي',
    keto_ratio: 1.29, sat_pct: 61,
    macros: { fat:16.5, protein:16.8, net_carb:2.7, cal:230.5, sat_fat:10.0 },
    components: [
      { fid:32  , name:'جبنة موزاريلا', qty:70, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:5, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: 'مع طماطم وزيت زيتون',
    phases: [],
  },

  /* DN38 | جبنة موزاريلا + أفوكادو + طماطم | نسبة:1.27 */
  {
    id: 'DN38', protein_group: 'cheese', method: 'بارد/مشوي',
    keto_ratio: 1.27, sat_pct: 61,
    macros: { fat:16.3, protein:16.0, net_carb:3.2, cal:228.8, sat_fat:9.9 },
    components: [
      { fid:32  , name:'جبنة موزاريلا', qty:70, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:5, role:'fat' },
      { fid:75  , name:'طماطم', qty:60, role:'veg' },
    ],
    cooking_tip: 'مع طماطم وزيت زيتون',
    phases: [],
  },

  /* DN39 | جبنة موزاريلا + أفوكادو + خيار | نسبة:1.27 */
  {
    id: 'DN39', protein_group: 'cheese', method: 'بارد/مشوي',
    keto_ratio: 1.27, sat_pct: 61,
    macros: { fat:16.2, protein:16.1, net_carb:3.1, cal:227.6, sat_fat:9.9 },
    components: [
      { fid:32  , name:'جبنة موزاريلا', qty:70, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:5, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: 'مع طماطم وزيت زيتون',
    phases: [],
  },

  /* DN40 | جبنة كريمية + زيت زيتون + خيار | نسبة:3.9 */
  {
    id: 'DN40', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 3.9, sat_pct: 51,
    macros: { fat:22.1, protein:3.6, net_carb:3.5, cal:224.8, sat_fat:11.2 },
    components: [
      { fid:35  , name:'جبنة كريمية', qty:50, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: 'مع خضار أو كرفس',
    phases: [],
  },

  /* DN41 | جبنة كريمية + زيت زيتون + جرجير | نسبة:3.94 */
  {
    id: 'DN41', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 3.94, sat_pct: 50,
    macros: { fat:22.4, protein:4.3, net_carb:3.1, cal:227.7, sat_fat:11.2 },
    components: [
      { fid:35  , name:'جبنة كريمية', qty:50, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: 'مع خضار أو كرفس',
    phases: [],
  },

  /* DN42 | جبنة كريمية + زيت زيتون + خس | نسبة:4.53 */
  {
    id: 'DN42', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 4.53, sat_pct: 51,
    macros: { fat:22.1, protein:3.8, net_carb:2.6, cal:223.0, sat_fat:11.2 },
    components: [
      { fid:35  , name:'جبنة كريمية', qty:50, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:63  , name:'خس', qty:60, role:'veg' },
    ],
    cooking_tip: 'مع خضار أو كرفس',
    phases: [],
  },

  /* DN43 | جبنة كريمية + أفوكادو + خيار | نسبة:3.06 */
  {
    id: 'DN43', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 3.06, sat_pct: 60,
    macros: { fat:17.8, protein:3.7, net_carb:3.6, cal:188.6, sat_fat:10.6 },
    components: [
      { fid:35  , name:'جبنة كريمية', qty:50, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:5, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: 'مع خضار أو كرفس',
    phases: [],
  },

  /* DN44 | جبنة كريمية + أفوكادو + جرجير | نسبة:3.1 */
  {
    id: 'DN44', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 3.1, sat_pct: 59,
    macros: { fat:18.1, protein:4.4, net_carb:3.2, cal:191.5, sat_fat:10.7 },
    components: [
      { fid:35  , name:'جبنة كريمية', qty:50, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:5, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: 'مع خضار أو كرفس',
    phases: [],
  },

  /* DN45 | جبنة كريمية + أفوكادو + خس | نسبة:3.55 */
  {
    id: 'DN45', protein_group: 'cheese', method: 'بارد',
    keto_ratio: 3.55, sat_pct: 59,
    macros: { fat:17.9, protein:3.9, net_carb:2.7, cal:186.8, sat_fat:10.6 },
    components: [
      { fid:35  , name:'جبنة كريمية', qty:50, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:5, role:'fat' },
      { fid:63  , name:'خس', qty:60, role:'veg' },
    ],
    cooking_tip: 'مع خضار أو كرفس',
    phases: [],
  },

  /* DN46 | بيض كامل + زيت زيتون + جرجير | نسبة:1.42 */
  {
    id: 'DN46', protein_group: 'egg', method: 'مسلوق/مقلي',
    keto_ratio: 1.42, sat_pct: 27,
    macros: { fat:15.8, protein:15.6, net_carb:1.8, cal:214.0, sat_fat:4.2 },
    components: [
      { fid:10  , name:'بيض كامل', qty:110, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: '2 بيضتان مع زيت أو أفوكادو',
    phases: [],
  },

  /* DN47 | بيض كامل + زيت زيتون + خيار | نسبة:1.39 */
  {
    id: 'DN47', protein_group: 'egg', method: 'مسلوق/مقلي',
    keto_ratio: 1.39, sat_pct: 26,
    macros: { fat:15.5, protein:14.9, net_carb:2.2, cal:211.1, sat_fat:4.1 },
    components: [
      { fid:10  , name:'بيض كامل', qty:110, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: '2 بيضتان مع زيت أو أفوكادو',
    phases: [],
  },

  /* DN48 | بيض كامل + زيت زيتون + طماطم | نسبة:1.38 */
  {
    id: 'DN48', protein_group: 'egg', method: 'مسلوق/مقلي',
    keto_ratio: 1.38, sat_pct: 26,
    macros: { fat:15.6, protein:14.8, net_carb:2.4, cal:212.3, sat_fat:4.1 },
    components: [
      { fid:10  , name:'بيض كامل', qty:110, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:5, role:'fat' },
      { fid:75  , name:'طماطم', qty:60, role:'veg' },
    ],
    cooking_tip: '2 بيضتان مع زيت أو أفوكادو',
    phases: [],
  },

  /* DN49 | بيض كامل + أفوكادو + جرجير | نسبة:1.31 */
  {
    id: 'DN49', protein_group: 'egg', method: 'مسلوق/مقلي',
    keto_ratio: 1.31, sat_pct: 26,
    macros: { fat:16.1, protein:16.3, net_carb:2.5, cal:225.8, sat_fat:4.2 },
    components: [
      { fid:10  , name:'بيض كامل', qty:110, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:35, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: '2 بيضتان مع زيت أو أفوكادو',
    phases: [],
  },

  /* DN50 | بيض كامل + أفوكادو + خيار | نسبة:1.3 */
  {
    id: 'DN50', protein_group: 'egg', method: 'مسلوق/مقلي',
    keto_ratio: 1.3, sat_pct: 26,
    macros: { fat:15.8, protein:15.6, net_carb:2.8, cal:222.9, sat_fat:4.1 },
    components: [
      { fid:10  , name:'بيض كامل', qty:110, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:35, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: '2 بيضتان مع زيت أو أفوكادو',
    phases: [],
  },

  /* DN51 | بيض كامل + أفوكادو + طماطم | نسبة:1.28 */
  {
    id: 'DN51', protein_group: 'egg', method: 'مسلوق/مقلي',
    keto_ratio: 1.28, sat_pct: 26,
    macros: { fat:15.8, protein:15.5, net_carb:3.0, cal:224.1, sat_fat:4.1 },
    components: [
      { fid:10  , name:'بيض كامل', qty:110, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:35, role:'fat' },
      { fid:75  , name:'طماطم', qty:60, role:'veg' },
    ],
    cooking_tip: '2 بيضتان مع زيت أو أفوكادو',
    phases: [],
  },

  /* DN52 | صدر دجاج مشوي + زيت زيتون + جرجير | نسبة:1.27 */
  {
    id: 'DN52', protein_group: 'chicken', method: 'متبقي/مشوي',
    keto_ratio: 1.27, sat_pct: 16,
    macros: { fat:23.6, protein:29.2, net_carb:1.1, cal:337.8, sat_fat:3.8 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:90, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:20, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: 'من وجبة الغداء أو طازج',
    phases: [],
  },

  /* DN53 | صدر دجاج مشوي + زيت زيتون + خيار | نسبة:1.26 */
  {
    id: 'DN53', protein_group: 'chicken', method: 'متبقي/مشوي',
    keto_ratio: 1.26, sat_pct: 16,
    macros: { fat:23.3, protein:28.5, net_carb:1.4, cal:334.9, sat_fat:3.7 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:90, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:20, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: 'من وجبة الغداء أو طازج',
    phases: [],
  },

  /* DN54 | صدر دجاج مشوي + زيت زيتون + خس | نسبة:1.32 */
  {
    id: 'DN54', protein_group: 'chicken', method: 'متبقي/مشوي',
    keto_ratio: 1.32, sat_pct: 16,
    macros: { fat:23.4, protein:28.7, net_carb:0.5, cal:333.1, sat_fat:3.7 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:90, role:'protein' },
      { fid:1   , name:'زيت زيتون', qty:20, role:'fat' },
      { fid:63  , name:'خس', qty:60, role:'veg' },
    ],
    cooking_tip: 'من وجبة الغداء أو طازج',
    phases: [],
  },

  /* DN55 | صدر دجاج مشوي + أفوكادو + جرجير | نسبة:0.52 */
  {
    id: 'DN55', protein_group: 'chicken', method: 'متبقي/مشوي',
    keto_ratio: 0.52, sat_pct: 18,
    macros: { fat:10.3, protein:30.1, net_carb:1.9, cal:233.0, sat_fat:1.9 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:90, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:45, role:'fat' },
      { fid:62  , name:'جرجير', qty:50, role:'veg' },
    ],
    cooking_tip: 'من وجبة الغداء أو طازج',
    phases: [],
  },

  /* DN56 | صدر دجاج مشوي + أفوكادو + خيار | نسبة:0.51 */
  {
    id: 'DN56', protein_group: 'chicken', method: 'متبقي/مشوي',
    keto_ratio: 0.51, sat_pct: 18,
    macros: { fat:10.1, protein:29.4, net_carb:2.2, cal:230.1, sat_fat:1.8 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:90, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:45, role:'fat' },
      { fid:74  , name:'خيار', qty:80, role:'veg' },
    ],
    cooking_tip: 'من وجبة الغداء أو طازج',
    phases: [],
  },

  /* DN57 | صدر دجاج مشوي + أفوكادو + خس | نسبة:0.53 */
  {
    id: 'DN57', protein_group: 'chicken', method: 'متبقي/مشوي',
    keto_ratio: 0.53, sat_pct: 18,
    macros: { fat:10.1, protein:29.6, net_carb:1.4, cal:228.3, sat_fat:1.8 },
    components: [
      { fid:12  , name:'صدر دجاج مشوي', qty:90, role:'protein' },
      { fid:61  , name:'أفوكادو', qty:45, role:'fat' },
      { fid:63  , name:'خس', qty:60, role:'veg' },
    ],
    cooking_tip: 'من وجبة الغداء أو طازج',
    phases: [],
  },

];

/* ════════════════════════════════════════════════════════════════
   منطق اختيار الوجبة حسب المتبقي الفعلي
════════════════════════════════════════════════════════════════ */

/* ─── اختر أفضل وصفة غداء حسب المتبقي والمفضلة ─── */
function getBestLunchTemplate(remaining, favIds, phase, satLimit, skipFids, seed){
  favIds   = favIds   || [];
  seed     = seed     || 0;

  var pool = LUNCH_TEMPLATES.filter(function(t){
    if(t.phases && t.phases.length > 0 && !t.phases.includes(phase)) return false;
    if(t.keto_ratio < 1.4) return false;
    if(satLimit && t.macros && t.macros.sat_fat > satLimit * 1.2) return false;
    return true;
  });

  // فلتر المفضلة: ابحث في كل components (ليس الأول فقط)
  if(favIds.length > 0){
    var favPool = pool.filter(function(t){
      return t.components && t.components.some(function(c){ return favIds.includes(c.fid); });
    });

    // عدّ أنواع البروتين المختلفة (أول component = البروتين)
    var favProtTypes = {};
    favPool.forEach(function(t){
      var pf = t.components && t.components[0] && t.components[0].fid;
      if(pf) favProtTypes[pf] = true;
    });

    // إذا أقل من 4 أنواع بروتين → أكمل من pool الكاملة
    if(Object.keys(favProtTypes).length < 4){
      var extraPool = pool.filter(function(t){
        var pf = t.components && t.components[0] && t.components[0].fid;
        return !favProtTypes[pf];
      });
      var shuffled = extraPool.slice().sort(function(){ return Math.random()-0.5; });
      pool = favPool.concat(shuffled.slice(0, Math.ceil(pool.length * 0.4)));
    } else {
      pool = favPool;
    }
  }

  if(!pool.length) pool = LUNCH_TEMPLATES.filter(function(t){ return t.keto_ratio >= 1.4; });

  // جمّع حسب fid البروتين الفعلي
  var groups = {};
  pool.forEach(function(t){
    var pf = String((t.components && t.components[0] && t.components[0].fid) || '0');
    if(!groups[pf]) groups[pf] = [];
    groups[pf].push(t);
  });
  var groupKeys = Object.keys(groups);

  // استبعد آخر 3 بروتينات مستخدمة (قائمة دوّارة)
  if(!window._recentProtFids) window._recentProtFids = [];
  var recent    = window._recentProtFids;
  var otherKeys = groupKeys.filter(function(k){ return recent.indexOf(k) === -1; });
  var pickFrom  = otherKeys.length > 0 ? otherKeys : groupKeys;

  // اختيار عشوائي من البروتينات غير المتكررة
  var randKey = pickFrom[Math.floor(Math.random() * pickFrom.length)];
  var chosen  = groups[randKey];
  var picked  = chosen[Math.floor(Math.random() * chosen.length)];

  // أضف للقائمة الدوّارة (max 3)
  if(randKey){
    recent.push(randKey);
    if(recent.length > 3) recent.shift();
    window._recentProtFids = recent;
  }
  if(picked && picked.components && picked.components[0])
    window._lastSuggProtFid = picked.components[0].fid;

  return picked || pool[0] || null;
}


/* ─── اختر أفضل وصفة عشاء حسب المتبقي الفعلي ─── */
function getBestDinnerTemplate(remaining, favIds, phase, satLimit, skipFids, seed){
  favIds = favIds || [];
  seed   = seed   || 0;

  var pool = DINNER_TEMPLATES.filter(function(t){
    if(t.phases && t.phases.length > 0 && !t.phases.includes(phase)) return false;
    if(satLimit && t.macros && t.macros.sat_fat > satLimit * 1.2) return false;
    return true;
  });

  if(favIds.length > 0){
    var favPool = pool.filter(function(t){
      return t.components && t.components.some(function(c){ return favIds.includes(c.fid); });
    });
    var favProtTypes2 = {};
    favPool.forEach(function(t){
      var pf = t.components && t.components[0] && t.components[0].fid;
      if(pf) favProtTypes2[pf] = true;
    });
    if(Object.keys(favProtTypes2).length < 4){
      var extraPool2 = pool.filter(function(t){
        var pf2 = t.components && t.components[0] && t.components[0].fid;
        return !favProtTypes2[pf2];
      });
      var shuffled2 = extraPool2.slice().sort(function(){ return Math.random()-0.5; });
      pool = favPool.concat(shuffled2.slice(0, Math.ceil(pool.length * 0.4)));
    } else {
      pool = favPool;
    }
  }

  if(!pool.length) pool = DINNER_TEMPLATES.filter(function(t){ return t.keto_ratio >= 1.4; });

  var groups = {};
  pool.forEach(function(t){
    var pf = String((t.components && t.components[0] && t.components[0].fid) || '0');
    if(!groups[pf]) groups[pf] = [];
    groups[pf].push(t);
  });
  var groupKeys = Object.keys(groups);
  if(!window._recentProtFids) window._recentProtFids = [];
  var recent2   = window._recentProtFids;
  var otherKeys = groupKeys.filter(function(k){ return recent2.indexOf(k) === -1; });
  var pickFrom  = otherKeys.length > 0 ? otherKeys : groupKeys;
  var randKey   = pickFrom[Math.floor(Math.random() * pickFrom.length)];
  var chosen    = groups[randKey];
  var picked    = chosen[Math.floor(Math.random() * chosen.length)];
  if(randKey){
    recent2.push(randKey);
    if(recent2.length > 3) recent2.shift();
    window._recentProtFids = recent2;
  }
  if(picked && picked.components && picked.components[0])
    window._lastSuggProtFid = picked.components[0].fid;
  return picked || pool[0] || null;
}


/* ─── تحجيم الوجبة حسب المتبقي ─── */
function scaleMealToRemaining(template, remaining){
  if(!template || !remaining) return template;
  const protComp = template.components.find(c=>c.role==='protein');
  const fatComp  = template.components.find(c=>c.role==='fat');
  const vegComp  = template.components.find(c=>c.role==='veg');
  if(!protComp || !fatComp) return template;

  const food_p = typeof FOODS!=='undefined' ? FOODS.find(f=>f.id===protComp.fid) : null;
  const food_f = typeof FOODS!=='undefined' ? FOODS.find(f=>f.id===fatComp.fid)  : null;
  if(!food_p || !food_f) return template;

  // كمية البروتين من المتبقي
  const targetProt = remaining.protein || protComp.qty * food_p.protein / 100;
  let newPQty = food_p.protein > 0
    ? Math.round(Math.min(targetProt / food_p.protein * 100, protComp.qty * 1.6) / 5) * 5
    : protComp.qty;
  newPQty = Math.max(newPQty, 50);

  // كمية الدهن من المتبقي بعد حساب البروتين
  const protFat   = food_p.fat * newPQty / 100;
  const fatTarget = Math.max((remaining.fat || 30) - protFat, 5);
  let newFQty = food_f.fat > 0
    ? Math.round(Math.min(fatTarget / food_f.fat * 100, fatComp.qty * 2.5) / 5) * 5
    : fatComp.qty;
  newFQty = Math.max(newFQty, 5);

  const scaledComponents = template.components.map(c => ({
    ...c,
    qty: c.role==='protein' ? newPQty
       : c.role==='fat'     ? newFQty
       : c.qty
  }));

  const allItems = scaledComponents.map(c=>({fid:c.fid,qty:c.qty}));
  const newMacros = typeof calcTemplateMacros!=='undefined'
    ? calcTemplateMacros({components:allItems,veg:[]})
    : template.macros;
  const newRatio = typeof calcKetoRatio!=='undefined'
    ? calcKetoRatio(newMacros) : template.keto_ratio;

  return { ...template, components: scaledComponents, macros: newMacros, keto_ratio: newRatio };
}

/* ════════════════════════════════════════════════════════════════
   منطق توقيت السناك واقتراحه
════════════════════════════════════════════════════════════════ */

/* ─── هل يحق للمشترك سناك الآن؟ ─── */
function shouldShowSnack(mem, todayMeals, prefs){
  if(!prefs.has_snack) return false;

  const mainMeals = (todayMeals||[]).filter(m =>
    !['snack'].includes(m.type) && (m.totals?.cal||0) >= 150
  );
  const snacksDone = (todayMeals||[]).filter(m => m.type === 'snack');

  // السناك بعد الوجبة الثانية على الأقل
  if(mainMeals.length < 2) return false;
  // لم يُسجَّل سناك بعد
  if(snacksDone.length > 0) return false;

  // التحقق من الوقت: هل وقت السناك المفضل قريب أو مرّ؟
  const snackTime = prefs.meal_times?.snack || '16:00';
  const [sh, sm]  = snackTime.split(':').map(Number);
  const now       = new Date();
  const nowMins   = now.getHours()*60 + now.getMinutes();
  const snackMins = sh*60 + sm;

  // اقترح السناك في نافذة ±90 دقيقة من وقته المفضل
  return Math.abs(nowMins - snackMins) <= 90;
}

/* ─── حساب المتبقي بعد تسجيل الوجبات ─── */
function calcRemainingAfterMeals(mem, todayMeals){
  const targets = typeof getTargetForDate!=='undefined'
    ? getTargetForDate(mem) : {fat:130,protein:110,carb:25,cal:1800};

  const consumed = (todayMeals||[]).reduce((t,m)=>{
    const tot = m.totals || {};
    return {
      fat:     t.fat     + (tot.fat||0),
      protein: t.protein + (tot.protein||0),
      carb:    t.carb    + (tot.net_carb||0),
      cal:     t.cal     + (tot.cal||0),
    };
  }, {fat:0,protein:0,carb:0,cal:0});

  return {
    fat:     Math.max(targets.fat     - consumed.fat,     0),
    protein: Math.max(targets.protein - consumed.protein, 0),
    carb:    Math.max((targets.carb||25) - consumed.carb, 0),
    cal:     Math.max((targets.cal||1800) - consumed.cal, 0),
  };
}
