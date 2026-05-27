/* ════════════════════════════════════════════════════════════════
   db-meal-templates.js — وصفات فطور البيض المحسوبة
   تحدي الكيتو مع د. عمار تنكل
   81 وصفة — بيضة وسط 55غ — النسبة الكيتونية ≥ 1.5
   ─────────────────────────────────────────────────────────────
   هيكل كل وصفة:
   id          : معرف فريد (BF01...)
   id_s        : معرف نصي مختصر
   name_ar     : الاسم العربي
   name_en     : الاسم الإنجليزي
   method      : طريقة التحضير
   egg_count   : عدد البيضات الافتراضي
   egg_weight  : وزن البيضة الواحدة (غ) — 55غ للوسط
   components  : {fid, name, qty} — المكونات الأساسية
   veg         : {fid, name, qty} — الخضار المضافة
   macros_per_egg : ماكرو بيضة واحدة — للتحجيم التلقائي
   macros      : الماكرو الإجمالي للوصفة الافتراضية
   keto_ratio  : النسبة الكيتونية
   phases      : [] = كل المراحل
   cooking_tip : نصيحة التحضير
════════════════════════════════════════════════════════════════ */

/* ─── بيانات البيضة الواحدة (55غ) للتحجيم ─── */
const EGG_UNIT_WEIGHT = 55; // بيضة وسط بعد السلق/الطهي
const EGG_MACROS_PER_UNIT = {
  fat: 5.23, protein: 7.15, nc: 0.39, cal: 78.7
};

/* ─── تحجيم الوصفة حسب عدد البيضات المطلوب ─── */
function scaleEggRecipe(template, newEggCount){
  const ratio = newEggCount / template.egg_count;
  const scaled = {
    ...template,
    egg_count: newEggCount,
    components: template.components.map(c => ({
      ...c,
      // البيض يُحجَّم خطياً — الدهون تُحجَّم بالمعادلة الكيتونية
      qty: c.fid === 10
        ? Math.round(newEggCount * EGG_UNIT_WEIGHT / 5) * 5
        : Math.round(c.qty * ratio / 5) * 5
    })),
    veg: template.veg.map(v => ({...v, qty: Math.round(v.qty * ratio / 5)*5})),
  };
  // أعد حساب الماكرو بعد التحجيم
  scaled.macros = calcTemplateMacros(scaled);
  scaled.keto_ratio = calcKetoRatio(scaled.macros);
  return scaled;
}

function calcTemplateMacros(t){
  let m = {fat:0,protein:0,net_carb:0,cal:0};
  [...(t.components||[]), ...(t.veg||[])].forEach(c=>{
    const f = FOODS.find(x=>x.id===c.fid);
    if(!f) return;
    const q = c.qty/100;
    m.fat+=f.fat*q; m.protein+=f.protein*q;
    m.net_carb+=f.net_carb*q; m.cal+=f.cal*q;
  });
  return {fat:Math.round(m.fat*10)/10, protein:Math.round(m.protein*10)/10,
          net_carb:Math.round(m.net_carb*10)/10, cal:Math.round(m.cal)};
}

function calcKetoRatio(m){
  const d=(m.protein||m.prot||0)*0.6+(m.net_carb||m.nc||0);
  return d>0 ? Math.round(m.fat/d*100)/100 : 0;
}

/* ════════════════════════════════════════════════════════════════
   وصفات فطور البيض — BREAKFAST_EGG_TEMPLATES
════════════════════════════════════════════════════════════════ */
const BREAKFAST_EGG_TEMPLATES = [

  /* ──────────────────────────────────────────────────────────── */
  /* BF01 | بيض مسلوق (1) + زيت زيتون */
  /* نسبة: 2.19 | مسلوق | 1 بيضة */
  {
    id:         'BF01',
    id_s:       'boiled_olive_1',
    name_ar:    'بيض مسلوق (1) + زيت زيتون',
    name_en:    'Boiled Eggs Olive Oil',
    method:     'مسلوق',
    egg_count:  1,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.19,
    macros: { fat:10.23, protein:7.15, net_carb:0.39, cal:122.85 },
    macros_per_egg: { fat:10.23, protein:7.15, net_carb:0.39, cal:122.85 },
    components: [
      { fid:10   , name:'بيض كامل', qty:55 },
      { fid:1    , name:'زيت زيتون بكر', qty:5 },
    ],
    veg: [],
    notes:       'يُرش الزيت بعد التقشير مباشرة',
    cooking_tip: 'سلق 10 دقائق للصلب',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF02 | بيض مسلوق (1) + زبدة */
  /* نسبة: 1.97 | مسلوق | 1 بيضة */
  {
    id:         'BF02',
    id_s:       'boiled_butter_1',
    name_ar:    'بيض مسلوق (1) + زبدة',
    name_en:    'Boiled Eggs Butter',
    method:     'مسلوق',
    egg_count:  1,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.97,
    macros: { fat:9.28, protein:7.2, net_carb:0.4, cal:114.5 },
    macros_per_egg: { fat:9.28, protein:7.2, net_carb:0.4, cal:114.5 },
    components: [
      { fid:10   , name:'بيض كامل', qty:55 },
      { fid:4    , name:'زبدة حيوانية', qty:5 },
    ],
    veg: [],
    cooking_tip: 'سلق 10 دقائق',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF03 | بيض مسلوق (1) + أفوكادو */
  /* نسبة: 2.43 | مسلوق | 1 بيضة */
  {
    id:         'BF03',
    id_s:       'boiled_avocado_1',
    name_ar:    'بيض مسلوق (1) + أفوكادو',
    name_en:    'Boiled Eggs Avocado',
    method:     'مسلوق',
    egg_count:  1,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.43,
    macros: { fat:12.48, protein:7.45, net_carb:0.66, cal:146.85 },
    macros_per_egg: { fat:12.48, protein:7.45, net_carb:0.66, cal:146.85 },
    components: [
      { fid:10   , name:'بيض كامل', qty:55 },
      { fid:61   , name:'أفوكادو', qty:15 },
      { fid:1    , name:'زيت زيتون بكر', qty:5 },
    ],
    veg: [],
    notes:       'أفوكادو مهروس أو شرائح جانبية',
    cooking_tip: 'سلق 10 دقائق',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF04 | بيض مسلوق (1) + مايونيز كيتو */
  /* نسبة: 1.89 | مسلوق | 1 بيضة */
  {
    id:         'BF04',
    id_s:       'boiled_mayo_1',
    name_ar:    'بيض مسلوق (1) + مايونيز كيتو',
    name_en:    'Boiled Eggs Mayo',
    method:     'مسلوق',
    egg_count:  1,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.89,
    macros: { fat:8.98, protein:7.21, net_carb:0.42, cal:112.65 },
    macros_per_egg: { fat:8.98, protein:7.21, net_carb:0.42, cal:112.65 },
    components: [
      { fid:10   , name:'بيض كامل', qty:55 },
      { fid:null /* أضف fid عند إضافة المايونيز للـ DB */, name:'مايونيز كيتو', qty:5 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF05 | بيض مسلوق (1) + أفوكادو + زيت زيتون */
  /* نسبة: 3.68 | مسلوق | 1 بيضة */
  {
    id:         'BF05',
    id_s:       'boiled_avo_olive_1',
    name_ar:    'بيض مسلوق (1) + أفوكادو + زيت زيتون',
    name_en:    'Boiled Eggs Avo+Oil',
    method:     'مسلوق',
    egg_count:  1,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 3.68,
    macros: { fat:22.73, protein:8.15, net_carb:1.29, cal:247.05 },
    macros_per_egg: { fat:22.73, protein:8.15, net_carb:1.29, cal:247.05 },
    components: [
      { fid:10   , name:'بيض كامل', qty:55 },
      { fid:61   , name:'أفوكادو', qty:50 },
      { fid:1    , name:'زيت زيتون بكر', qty:10 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF06 | بيض مسلوق (2) + زيت زيتون */
  /* نسبة: 1.65 | مسلوق | 2 بيضة */
  {
    id:         'BF06',
    id_s:       'boiled_olive_2',
    name_ar:    'بيض مسلوق (2) + زيت زيتون',
    name_en:    'Boiled Eggs Olive Oil',
    method:     'مسلوق',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.65,
    macros: { fat:15.45, protein:14.3, net_carb:0.77, cal:201.5 },
    macros_per_egg: { fat:7.72, protein:7.15, net_carb:0.39, cal:100.75 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:1    , name:'زيت زيتون بكر', qty:5 },
    ],
    veg: [],
    notes:       'يُرش الزيت بعد التقشير مباشرة',
    cooking_tip: 'سلق 10 دقائق للصلب',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF07 | بيض مسلوق (2) + زبدة */
  /* نسبة: 1.54 | مسلوق | 2 بيضة */
  {
    id:         'BF07',
    id_s:       'boiled_butter_2',
    name_ar:    'بيض مسلوق (2) + زبدة',
    name_en:    'Boiled Eggs Butter',
    method:     'مسلوق',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.54,
    macros: { fat:14.5, protein:14.35, net_carb:0.78, cal:193.15 },
    macros_per_egg: { fat:7.25, protein:7.17, net_carb:0.39, cal:96.58 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:4    , name:'زبدة حيوانية', qty:5 },
    ],
    veg: [],
    cooking_tip: 'سلق 10 دقائق',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF08 | بيض مسلوق (2) + أفوكادو */
  /* نسبة: 1.51 | مسلوق | 2 بيضة */
  {
    id:         'BF08',
    id_s:       'boiled_avocado_2',
    name_ar:    'بيض مسلوق (2) + أفوكادو',
    name_en:    'Boiled Eggs Avocado',
    method:     'مسلوق',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.51,
    macros: { fat:15.7, protein:15.0, net_carb:1.4, cal:213.3 },
    macros_per_egg: { fat:7.85, protein:7.5, net_carb:0.7, cal:106.65 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:61   , name:'أفوكادو', qty:35 },
    ],
    veg: [],
    notes:       'أفوكادو مهروس أو شرائح جانبية',
    cooking_tip: 'سلق 10 دقائق',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF09 | بيض مسلوق (2) + مايونيز كيتو */
  /* نسبة: 1.51 | مسلوق | 2 بيضة */
  {
    id:         'BF09',
    id_s:       'boiled_mayo_2',
    name_ar:    'بيض مسلوق (2) + مايونيز كيتو',
    name_en:    'Boiled Eggs Mayo',
    method:     'مسلوق',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.51,
    macros: { fat:14.2, protein:14.36, net_carb:0.8, cal:191.3 },
    macros_per_egg: { fat:7.1, protein:7.18, net_carb:0.4, cal:95.65 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:null /* أضف fid عند إضافة المايونيز للـ DB */, name:'مايونيز كيتو', qty:5 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF10 | بيض مسلوق (2) + أفوكادو + زيت زيتون */
  /* نسبة: 2.58 | مسلوق | 2 بيضة */
  {
    id:         'BF10',
    id_s:       'boiled_avo_olive_2',
    name_ar:    'بيض مسلوق (2) + أفوكادو + زيت زيتون',
    name_en:    'Boiled Eggs Avo+Oil',
    method:     'مسلوق',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.58,
    macros: { fat:27.95, protein:15.3, net_carb:1.67, cal:325.7 },
    macros_per_egg: { fat:13.97, protein:7.65, net_carb:0.83, cal:162.85 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:61   , name:'أفوكادو', qty:50 },
      { fid:1    , name:'زيت زيتون بكر', qty:10 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF11 | بيض مسلوق (3) + زيت زيتون */
  /* نسبة: 1.47 | مسلوق | 3 بيضة */
  {
    id:         'BF11',
    id_s:       'boiled_olive_3',
    name_ar:    'بيض مسلوق (3) + زيت زيتون',
    name_en:    'Boiled Eggs Olive Oil',
    method:     'مسلوق',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.47,
    macros: { fat:20.67, protein:21.45, net_carb:1.15, cal:280.15 },
    macros_per_egg: { fat:6.89, protein:7.15, net_carb:0.38, cal:93.38 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:1    , name:'زيت زيتون بكر', qty:5 },
    ],
    veg: [],
    notes:       'يُرش الزيت بعد التقشير مباشرة',
    cooking_tip: 'سلق 10 دقائق للصلب',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF12 | بيض مسلوق (3) + زبدة */
  /* نسبة: 1.76 | مسلوق | 3 بيضة */
  {
    id:         'BF12',
    id_s:       'boiled_butter_3',
    name_ar:    'بيض مسلوق (3) + زبدة',
    name_en:    'Boiled Eggs Butter',
    method:     'مسلوق',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.76,
    macros: { fat:24.72, protein:21.5, net_carb:1.16, cal:316.0 },
    macros_per_egg: { fat:8.24, protein:7.17, net_carb:0.39, cal:105.33 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:4    , name:'زبدة حيوانية', qty:5 },
      { fid:1    , name:'زيت زيتون بكر', qty:5 },
    ],
    veg: [],
    cooking_tip: 'سلق 10 دقائق',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF13 | بيض مسلوق (3) + أفوكادو */
  /* نسبة: 1.82 | مسلوق | 3 بيضة */
  {
    id:         'BF13',
    id_s:       'boiled_avocado_3',
    name_ar:    'بيض مسلوق (3) + أفوكادو',
    name_en:    'Boiled Eggs Avocado',
    method:     'مسلوق',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.82,
    macros: { fat:28.17, protein:22.45, net_carb:2.05, cal:360.15 },
    macros_per_egg: { fat:9.39, protein:7.48, net_carb:0.68, cal:120.05 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:61   , name:'أفوكادو', qty:50 },
      { fid:1    , name:'زيت زيتون بكر', qty:5 },
    ],
    veg: [],
    notes:       'أفوكادو مهروس أو شرائح جانبية',
    cooking_tip: 'سلق 10 دقائق',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF14 | بيض مسلوق (3) + مايونيز كيتو */
  /* نسبة: 1.73 | مسلوق | 3 بيضة */
  {
    id:         'BF14',
    id_s:       'boiled_mayo_3',
    name_ar:    'بيض مسلوق (3) + مايونيز كيتو',
    name_en:    'Boiled Eggs Mayo',
    method:     'مسلوق',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.73,
    macros: { fat:24.42, protein:21.51, net_carb:1.18, cal:314.15 },
    macros_per_egg: { fat:8.14, protein:7.17, net_carb:0.39, cal:104.72 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:null /* أضف fid عند إضافة المايونيز للـ DB */, name:'مايونيز كيتو', qty:5 },
      { fid:1    , name:'زيت زيتون بكر', qty:5 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF15 | بيض مسلوق (3) + أفوكادو + زيت زيتون */
  /* نسبة: 2.14 | مسلوق | 3 بيضة */
  {
    id:         'BF15',
    id_s:       'boiled_avo_olive_3',
    name_ar:    'بيض مسلوق (3) + أفوكادو + زيت زيتون',
    name_en:    'Boiled Eggs Avo+Oil',
    method:     'مسلوق',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.14,
    macros: { fat:33.17, protein:22.45, net_carb:2.05, cal:404.35 },
    macros_per_egg: { fat:11.06, protein:7.48, net_carb:0.68, cal:134.78 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:61   , name:'أفوكادو', qty:50 },
      { fid:1    , name:'زيت زيتون بكر', qty:10 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF16 | بيض مقلي بـزيت الزيتون (2) */
  /* نسبة: 2.19 | مقلي-عيون | 2 بيضة */
  {
    id:         'BF16',
    id_s:       'fried_olive_2',
    name_ar:    'بيض مقلي بـزيت الزيتون (2)',
    name_en:    'Fried Eggs',
    method:     'مقلي-عيون',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.19,
    macros: { fat:20.45, protein:14.3, net_carb:0.77, cal:245.7 },
    macros_per_egg: { fat:10.22, protein:7.15, net_carb:0.39, cal:122.85 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:1    , name:'زيت زيتون بكر', qty:10 },
    ],
    veg: [],
    cooking_tip: 'حرارة متوسطة — 3 دقائق',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF17 | بيض Sunny Side Up بـزيت الزيتون (2) */
  /* نسبة: 2.19 | sunny-side-up | 2 بيضة */
  {
    id:         'BF17',
    id_s:       'sunny_olive_2',
    name_ar:    'بيض Sunny Side Up بـزيت الزيتون (2)',
    name_en:    'Sunny Side Up',
    method:     'sunny-side-up',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.19,
    macros: { fat:20.45, protein:14.3, net_carb:0.77, cal:245.7 },
    macros_per_egg: { fat:10.22, protein:7.15, net_carb:0.39, cal:122.85 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:1    , name:'زيت زيتون بكر', qty:10 },
    ],
    veg: [],
    notes:       'جانب واحد — صفار سائل',
    cooking_tip: 'غطِّ المقلاة 2 دقيقة على حرارة منخفضة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF18 | أومليت كريمي بـزيت الزيتون (2) */
  /* نسبة: 2.97 | أومليت | 2 بيضة */
  {
    id:         'BF18',
    id_s:       'omelette_cream_olive_2',
    name_ar:    'أومليت كريمي بـزيت الزيتون (2)',
    name_en:    'Creamy Omelette',
    method:     'أومليت',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.97,
    macros: { fat:31.25, protein:14.93, net_carb:1.58, cal:347.7 },
    macros_per_egg: { fat:15.62, protein:7.46, net_carb:0.79, cal:173.85 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:1    , name:'زيت زيتون بكر', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:30 },
    ],
    veg: [],
    cooking_tip: 'أضف الكريمة قبل الطي',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF19 | أومليت موزاريلا بـزيت الزيتون (2) */
  /* نسبة: 1.94 | أومليت | 2 بيضة */
  {
    id:         'BF19',
    id_s:       'omelette_mozz_olive_2',
    name_ar:    'أومليت موزاريلا بـزيت الزيتون (2)',
    name_en:    'Mozz Omelette',
    method:     'أومليت',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.94,
    macros: { fat:27.05, protein:20.9, net_carb:1.43, cal:329.7 },
    macros_per_egg: { fat:13.53, protein:10.45, net_carb:0.71, cal:164.85 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:1    , name:'زيت زيتون بكر', qty:10 },
      { fid:32   , name:'جبن موزاريلا', qty:30 },
    ],
    veg: [],
    cooking_tip: 'أضف الجبن قبل الطي بدقيقة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF20 | أومليت شيدر بـزيت الزيتون (2) */
  /* نسبة: 2.14 | أومليت | 2 بيضة */
  {
    id:         'BF20',
    id_s:       'omelette_cheddar_olive_2',
    name_ar:    'أومليت شيدر بـزيت الزيتون (2)',
    name_en:    'Cheddar Omelette',
    method:     'أومليت',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.14,
    macros: { fat:28.7, protein:20.55, net_carb:1.1, cal:346.2 },
    macros_per_egg: { fat:14.35, protein:10.28, net_carb:0.55, cal:173.1 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:1    , name:'زيت زيتون بكر', qty:10 },
      { fid:29   , name:'جبن شيدر', qty:25 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF21 | أومليت جبنة كريمية بـزيت الزيتون (2) */
  /* نسبة: 2.63 | أومليت | 2 بيضة */
  {
    id:         'BF21',
    id_s:       'omelette_cc_olive_2',
    name_ar:    'أومليت جبنة كريمية بـزيت الزيتون (2)',
    name_en:    'Cream Cheese Omelette',
    method:     'أومليت',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.63,
    macros: { fat:30.65, protein:16.1, net_carb:2.0, cal:348.3 },
    macros_per_egg: { fat:15.32, protein:8.05, net_carb:1.0, cal:174.15 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:1    , name:'زيت زيتون بكر', qty:10 },
      { fid:35   , name:'جبنة كريمية', qty:30 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF22 | بيض مقلي بـالزبدة (2) */
  /* نسبة: 1.97 | مقلي-عيون | 2 بيضة */
  {
    id:         'BF22',
    id_s:       'fried_butter_2',
    name_ar:    'بيض مقلي بـالزبدة (2)',
    name_en:    'Fried Eggs',
    method:     'مقلي-عيون',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.97,
    macros: { fat:18.55, protein:14.39, net_carb:0.78, cal:229.0 },
    macros_per_egg: { fat:9.28, protein:7.2, net_carb:0.39, cal:114.5 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
    ],
    veg: [],
    cooking_tip: 'حرارة متوسطة — 3 دقائق',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF23 | بيض Sunny Side Up بـالزبدة (2) */
  /* نسبة: 1.97 | sunny-side-up | 2 بيضة */
  {
    id:         'BF23',
    id_s:       'sunny_butter_2',
    name_ar:    'بيض Sunny Side Up بـالزبدة (2)',
    name_en:    'Sunny Side Up',
    method:     'sunny-side-up',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.97,
    macros: { fat:18.55, protein:14.39, net_carb:0.78, cal:229.0 },
    macros_per_egg: { fat:9.28, protein:7.2, net_carb:0.39, cal:114.5 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
    ],
    veg: [],
    notes:       'جانب واحد — صفار سائل',
    cooking_tip: 'غطِّ المقلاة 2 دقيقة على حرارة منخفضة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF24 | أومليت كريمي بـالزبدة (2) */
  /* نسبة: 2.77 | أومليت | 2 بيضة */
  {
    id:         'BF24',
    id_s:       'omelette_cream_butter_2',
    name_ar:    'أومليت كريمي بـالزبدة (2)',
    name_en:    'Creamy Omelette',
    method:     'أومليت',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.77,
    macros: { fat:29.35, protein:15.02, net_carb:1.59, cal:331.0 },
    macros_per_egg: { fat:14.68, protein:7.51, net_carb:0.8, cal:165.5 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:30 },
    ],
    veg: [],
    cooking_tip: 'أضف الكريمة قبل الطي',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF25 | أومليت موزاريلا بـالزبدة (2) */
  /* نسبة: 1.79 | أومليت | 2 بيضة */
  {
    id:         'BF25',
    id_s:       'omelette_mozz_butter_2',
    name_ar:    'أومليت موزاريلا بـالزبدة (2)',
    name_en:    'Mozz Omelette',
    method:     'أومليت',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.79,
    macros: { fat:25.15, protein:20.99, net_carb:1.44, cal:313.0 },
    macros_per_egg: { fat:12.57, protein:10.49, net_carb:0.72, cal:156.5 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:32   , name:'جبن موزاريلا', qty:30 },
    ],
    veg: [],
    cooking_tip: 'أضف الجبن قبل الطي بدقيقة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF26 | أومليت شيدر بـالزبدة (2) */
  /* نسبة: 1.99 | أومليت | 2 بيضة */
  {
    id:         'BF26',
    id_s:       'omelette_cheddar_butter_2',
    name_ar:    'أومليت شيدر بـالزبدة (2)',
    name_en:    'Cheddar Omelette',
    method:     'أومليت',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.99,
    macros: { fat:26.8, protein:20.64, net_carb:1.11, cal:329.5 },
    macros_per_egg: { fat:13.4, protein:10.32, net_carb:0.56, cal:164.75 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:29   , name:'جبن شيدر', qty:25 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF27 | أومليت جبنة كريمية بـالزبدة (2) */
  /* نسبة: 2.45 | أومليت | 2 بيضة */
  {
    id:         'BF27',
    id_s:       'omelette_cc_butter_2',
    name_ar:    'أومليت جبنة كريمية بـالزبدة (2)',
    name_en:    'Cream Cheese Omelette',
    method:     'أومليت',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.45,
    macros: { fat:28.75, protein:16.19, net_carb:2.01, cal:331.6 },
    macros_per_egg: { fat:14.38, protein:8.1, net_carb:1.0, cal:165.8 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:35   , name:'جبنة كريمية', qty:30 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF28 | بيض مقلي بـالسمن (2) */
  /* نسبة: 2.18 | مقلي-عيون | 2 بيضة */
  {
    id:         'BF28',
    id_s:       'fried_ghee_2',
    name_ar:    'بيض مقلي بـالسمن (2)',
    name_en:    'Fried Eggs',
    method:     'مقلي-عيون',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.18,
    macros: { fat:20.4, protein:14.33, net_carb:0.77, cal:247.0 },
    macros_per_egg: { fat:10.2, protein:7.17, net_carb:0.39, cal:123.5 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:3    , name:'سمن حيواني', qty:10 },
    ],
    veg: [],
    cooking_tip: 'حرارة متوسطة — 3 دقائق',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF29 | بيض Sunny Side Up بـالسمن (2) */
  /* نسبة: 2.18 | sunny-side-up | 2 بيضة */
  {
    id:         'BF29',
    id_s:       'sunny_ghee_2',
    name_ar:    'بيض Sunny Side Up بـالسمن (2)',
    name_en:    'Sunny Side Up',
    method:     'sunny-side-up',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.18,
    macros: { fat:20.4, protein:14.33, net_carb:0.77, cal:247.0 },
    macros_per_egg: { fat:10.2, protein:7.17, net_carb:0.39, cal:123.5 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:3    , name:'سمن حيواني', qty:10 },
    ],
    veg: [],
    notes:       'جانب واحد — صفار سائل',
    cooking_tip: 'غطِّ المقلاة 2 دقيقة على حرارة منخفضة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF30 | أومليت كريمي بـالسمن (2) */
  /* نسبة: 2.96 | أومليت | 2 بيضة */
  {
    id:         'BF30',
    id_s:       'omelette_cream_ghee_2',
    name_ar:    'أومليت كريمي بـالسمن (2)',
    name_en:    'Creamy Omelette',
    method:     'أومليت',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.96,
    macros: { fat:31.2, protein:14.96, net_carb:1.58, cal:349.0 },
    macros_per_egg: { fat:15.6, protein:7.48, net_carb:0.79, cal:174.5 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:30 },
    ],
    veg: [],
    cooking_tip: 'أضف الكريمة قبل الطي',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF31 | أومليت موزاريلا بـالسمن (2) */
  /* نسبة: 1.93 | أومليت | 2 بيضة */
  {
    id:         'BF31',
    id_s:       'omelette_mozz_ghee_2',
    name_ar:    'أومليت موزاريلا بـالسمن (2)',
    name_en:    'Mozz Omelette',
    method:     'أومليت',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.93,
    macros: { fat:27.0, protein:20.93, net_carb:1.43, cal:331.0 },
    macros_per_egg: { fat:13.5, protein:10.46, net_carb:0.71, cal:165.5 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:32   , name:'جبن موزاريلا', qty:30 },
    ],
    veg: [],
    cooking_tip: 'أضف الجبن قبل الطي بدقيقة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF32 | أومليت شيدر بـالسمن (2) */
  /* نسبة: 2.13 | أومليت | 2 بيضة */
  {
    id:         'BF32',
    id_s:       'omelette_cheddar_ghee_2',
    name_ar:    'أومليت شيدر بـالسمن (2)',
    name_en:    'Cheddar Omelette',
    method:     'أومليت',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.13,
    macros: { fat:28.65, protein:20.58, net_carb:1.1, cal:347.5 },
    macros_per_egg: { fat:14.32, protein:10.29, net_carb:0.55, cal:173.75 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:29   , name:'جبن شيدر', qty:25 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF33 | أومليت جبنة كريمية بـالسمن (2) */
  /* نسبة: 2.62 | أومليت | 2 بيضة */
  {
    id:         'BF33',
    id_s:       'omelette_cc_ghee_2',
    name_ar:    'أومليت جبنة كريمية بـالسمن (2)',
    name_en:    'Cream Cheese Omelette',
    method:     'أومليت',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.62,
    macros: { fat:30.6, protein:16.13, net_carb:2.0, cal:349.6 },
    macros_per_egg: { fat:15.3, protein:8.06, net_carb:1.0, cal:174.8 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:35   , name:'جبنة كريمية', qty:30 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF34 | بيض مقلي بـزيت الزيتون (3) */
  /* نسبة: 1.83 | مقلي-عيون | 3 بيضة */
  {
    id:         'BF34',
    id_s:       'fried_olive_3',
    name_ar:    'بيض مقلي بـزيت الزيتون (3)',
    name_en:    'Fried Eggs',
    method:     'مقلي-عيون',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.83,
    macros: { fat:25.67, protein:21.45, net_carb:1.15, cal:324.35 },
    macros_per_egg: { fat:8.56, protein:7.15, net_carb:0.38, cal:108.12 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:1    , name:'زيت زيتون بكر', qty:10 },
    ],
    veg: [],
    cooking_tip: 'حرارة متوسطة — 3 دقائق',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF35 | بيض Sunny Side Up بـزيت الزيتون (3) */
  /* نسبة: 1.83 | sunny-side-up | 3 بيضة */
  {
    id:         'BF35',
    id_s:       'sunny_olive_3',
    name_ar:    'بيض Sunny Side Up بـزيت الزيتون (3)',
    name_en:    'Sunny Side Up',
    method:     'sunny-side-up',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.83,
    macros: { fat:25.67, protein:21.45, net_carb:1.15, cal:324.35 },
    macros_per_egg: { fat:8.56, protein:7.15, net_carb:0.38, cal:108.12 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:1    , name:'زيت زيتون بكر', qty:10 },
    ],
    veg: [],
    notes:       'جانب واحد — صفار سائل',
    cooking_tip: 'غطِّ المقلاة 2 دقيقة على حرارة منخفضة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF36 | أومليت كريمي بـزيت الزيتون (3) */
  /* نسبة: 2.4 | أومليت | 3 بيضة */
  {
    id:         'BF36',
    id_s:       'omelette_cream_olive_3',
    name_ar:    'أومليت كريمي بـزيت الزيتون (3)',
    name_en:    'Creamy Omelette',
    method:     'أومليت',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.4,
    macros: { fat:36.47, protein:22.08, net_carb:1.96, cal:426.35 },
    macros_per_egg: { fat:12.16, protein:7.36, net_carb:0.65, cal:142.12 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:1    , name:'زيت زيتون بكر', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:30 },
    ],
    veg: [],
    cooking_tip: 'أضف الكريمة قبل الطي',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF37 | أومليت موزاريلا بـزيت الزيتون (3) */
  /* نسبة: 1.73 | أومليت | 3 بيضة */
  {
    id:         'BF37',
    id_s:       'omelette_mozz_olive_3',
    name_ar:    'أومليت موزاريلا بـزيت الزيتون (3)',
    name_en:    'Mozz Omelette',
    method:     'أومليت',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.73,
    macros: { fat:32.27, protein:28.05, net_carb:1.81, cal:408.35 },
    macros_per_egg: { fat:10.76, protein:9.35, net_carb:0.6, cal:136.12 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:1    , name:'زيت زيتون بكر', qty:10 },
      { fid:32   , name:'جبن موزاريلا', qty:30 },
    ],
    veg: [],
    cooking_tip: 'أضف الجبن قبل الطي بدقيقة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF38 | أومليت شيدر بـزيت الزيتون (3) */
  /* نسبة: 1.87 | أومليت | 3 بيضة */
  {
    id:         'BF38',
    id_s:       'omelette_cheddar_olive_3',
    name_ar:    'أومليت شيدر بـزيت الزيتون (3)',
    name_en:    'Cheddar Omelette',
    method:     'أومليت',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.87,
    macros: { fat:33.92, protein:27.7, net_carb:1.48, cal:424.85 },
    macros_per_egg: { fat:11.31, protein:9.23, net_carb:0.49, cal:141.62 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:1    , name:'زيت زيتون بكر', qty:10 },
      { fid:29   , name:'جبن شيدر', qty:25 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF39 | أومليت جبنة كريمية بـزيت الزيتون (3) */
  /* نسبة: 2.2 | أومليت | 3 بيضة */
  {
    id:         'BF39',
    id_s:       'omelette_cc_olive_3',
    name_ar:    'أومليت جبنة كريمية بـزيت الزيتون (3)',
    name_en:    'Cream Cheese Omelette',
    method:     'أومليت',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.2,
    macros: { fat:35.87, protein:23.25, net_carb:2.38, cal:426.95 },
    macros_per_egg: { fat:11.96, protein:7.75, net_carb:0.79, cal:142.32 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:1    , name:'زيت زيتون بكر', qty:10 },
      { fid:35   , name:'جبنة كريمية', qty:30 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF40 | بيض مقلي بـالزبدة (3) */
  /* نسبة: 1.69 | مقلي-عيون | 3 بيضة */
  {
    id:         'BF40',
    id_s:       'fried_butter_3',
    name_ar:    'بيض مقلي بـالزبدة (3)',
    name_en:    'Fried Eggs',
    method:     'مقلي-عيون',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.69,
    macros: { fat:23.77, protein:21.54, net_carb:1.16, cal:307.65 },
    macros_per_egg: { fat:7.92, protein:7.18, net_carb:0.39, cal:102.55 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
    ],
    veg: [],
    cooking_tip: 'حرارة متوسطة — 3 دقائق',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF41 | بيض Sunny Side Up بـالزبدة (3) */
  /* نسبة: 1.69 | sunny-side-up | 3 بيضة */
  {
    id:         'BF41',
    id_s:       'sunny_butter_3',
    name_ar:    'بيض Sunny Side Up بـالزبدة (3)',
    name_en:    'Sunny Side Up',
    method:     'sunny-side-up',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.69,
    macros: { fat:23.77, protein:21.54, net_carb:1.16, cal:307.65 },
    macros_per_egg: { fat:7.92, protein:7.18, net_carb:0.39, cal:102.55 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
    ],
    veg: [],
    notes:       'جانب واحد — صفار سائل',
    cooking_tip: 'غطِّ المقلاة 2 دقيقة على حرارة منخفضة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF42 | أومليت كريمي بـالزبدة (3) */
  /* نسبة: 2.26 | أومليت | 3 بيضة */
  {
    id:         'BF42',
    id_s:       'omelette_cream_butter_3',
    name_ar:    'أومليت كريمي بـالزبدة (3)',
    name_en:    'Creamy Omelette',
    method:     'أومليت',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.26,
    macros: { fat:34.57, protein:22.17, net_carb:1.97, cal:409.65 },
    macros_per_egg: { fat:11.52, protein:7.39, net_carb:0.66, cal:136.55 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:30 },
    ],
    veg: [],
    cooking_tip: 'أضف الكريمة قبل الطي',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF43 | أومليت موزاريلا بـالزبدة (3) */
  /* نسبة: 1.62 | أومليت | 3 بيضة */
  {
    id:         'BF43',
    id_s:       'omelette_mozz_butter_3',
    name_ar:    'أومليت موزاريلا بـالزبدة (3)',
    name_en:    'Mozz Omelette',
    method:     'أومليت',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.62,
    macros: { fat:30.37, protein:28.14, net_carb:1.82, cal:391.65 },
    macros_per_egg: { fat:10.12, protein:9.38, net_carb:0.61, cal:130.55 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:32   , name:'جبن موزاريلا', qty:30 },
    ],
    veg: [],
    cooking_tip: 'أضف الجبن قبل الطي بدقيقة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF44 | أومليت شيدر بـالزبدة (3) */
  /* نسبة: 1.76 | أومليت | 3 بيضة */
  {
    id:         'BF44',
    id_s:       'omelette_cheddar_butter_3',
    name_ar:    'أومليت شيدر بـالزبدة (3)',
    name_en:    'Cheddar Omelette',
    method:     'أومليت',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.76,
    macros: { fat:32.02, protein:27.79, net_carb:1.49, cal:408.15 },
    macros_per_egg: { fat:10.67, protein:9.26, net_carb:0.5, cal:136.05 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:29   , name:'جبن شيدر', qty:25 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF45 | أومليت جبنة كريمية بـالزبدة (3) */
  /* نسبة: 2.07 | أومليت | 3 بيضة */
  {
    id:         'BF45',
    id_s:       'omelette_cc_butter_3',
    name_ar:    'أومليت جبنة كريمية بـالزبدة (3)',
    name_en:    'Cream Cheese Omelette',
    method:     'أومليت',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.07,
    macros: { fat:33.97, protein:23.34, net_carb:2.39, cal:410.25 },
    macros_per_egg: { fat:11.32, protein:7.78, net_carb:0.8, cal:136.75 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:35   , name:'جبنة كريمية', qty:30 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF46 | بيض مقلي بـالسمن (3) */
  /* نسبة: 1.83 | مقلي-عيون | 3 بيضة */
  {
    id:         'BF46',
    id_s:       'fried_ghee_3',
    name_ar:    'بيض مقلي بـالسمن (3)',
    name_en:    'Fried Eggs',
    method:     'مقلي-عيون',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.83,
    macros: { fat:25.62, protein:21.48, net_carb:1.15, cal:325.65 },
    macros_per_egg: { fat:8.54, protein:7.16, net_carb:0.38, cal:108.55 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:3    , name:'سمن حيواني', qty:10 },
    ],
    veg: [],
    cooking_tip: 'حرارة متوسطة — 3 دقائق',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF47 | بيض Sunny Side Up بـالسمن (3) */
  /* نسبة: 1.83 | sunny-side-up | 3 بيضة */
  {
    id:         'BF47',
    id_s:       'sunny_ghee_3',
    name_ar:    'بيض Sunny Side Up بـالسمن (3)',
    name_en:    'Sunny Side Up',
    method:     'sunny-side-up',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.83,
    macros: { fat:25.62, protein:21.48, net_carb:1.15, cal:325.65 },
    macros_per_egg: { fat:8.54, protein:7.16, net_carb:0.38, cal:108.55 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:3    , name:'سمن حيواني', qty:10 },
    ],
    veg: [],
    notes:       'جانب واحد — صفار سائل',
    cooking_tip: 'غطِّ المقلاة 2 دقيقة على حرارة منخفضة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF48 | أومليت كريمي بـالسمن (3) */
  /* نسبة: 2.39 | أومليت | 3 بيضة */
  {
    id:         'BF48',
    id_s:       'omelette_cream_ghee_3',
    name_ar:    'أومليت كريمي بـالسمن (3)',
    name_en:    'Creamy Omelette',
    method:     'أومليت',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.39,
    macros: { fat:36.42, protein:22.11, net_carb:1.96, cal:427.65 },
    macros_per_egg: { fat:12.14, protein:7.37, net_carb:0.65, cal:142.55 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:30 },
    ],
    veg: [],
    cooking_tip: 'أضف الكريمة قبل الطي',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF49 | أومليت موزاريلا بـالسمن (3) */
  /* نسبة: 1.73 | أومليت | 3 بيضة */
  {
    id:         'BF49',
    id_s:       'omelette_mozz_ghee_3',
    name_ar:    'أومليت موزاريلا بـالسمن (3)',
    name_en:    'Mozz Omelette',
    method:     'أومليت',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.73,
    macros: { fat:32.22, protein:28.08, net_carb:1.81, cal:409.65 },
    macros_per_egg: { fat:10.74, protein:9.36, net_carb:0.6, cal:136.55 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:32   , name:'جبن موزاريلا', qty:30 },
    ],
    veg: [],
    cooking_tip: 'أضف الجبن قبل الطي بدقيقة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF50 | أومليت شيدر بـالسمن (3) */
  /* نسبة: 1.87 | أومليت | 3 بيضة */
  {
    id:         'BF50',
    id_s:       'omelette_cheddar_ghee_3',
    name_ar:    'أومليت شيدر بـالسمن (3)',
    name_en:    'Cheddar Omelette',
    method:     'أومليت',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.87,
    macros: { fat:33.87, protein:27.73, net_carb:1.48, cal:426.15 },
    macros_per_egg: { fat:11.29, protein:9.24, net_carb:0.49, cal:142.05 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:29   , name:'جبن شيدر', qty:25 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF51 | أومليت جبنة كريمية بـالسمن (3) */
  /* نسبة: 2.19 | أومليت | 3 بيضة */
  {
    id:         'BF51',
    id_s:       'omelette_cc_ghee_3',
    name_ar:    'أومليت جبنة كريمية بـالسمن (3)',
    name_en:    'Cream Cheese Omelette',
    method:     'أومليت',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.19,
    macros: { fat:35.82, protein:23.28, net_carb:2.38, cal:428.25 },
    macros_per_egg: { fat:11.94, protein:7.76, net_carb:0.79, cal:142.75 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:35   , name:'جبنة كريمية', qty:30 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF52 | بيض بوشد (2) + زيت زيتون */
  /* نسبة: 2.72 | بوشد | 2 بيضة */
  {
    id:         'BF52',
    id_s:       'poached_olive_2',
    name_ar:    'بيض بوشد (2) + زيت زيتون',
    name_en:    'Poached Eggs Olive',
    method:     'بوشد',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.72,
    macros: { fat:25.45, protein:14.3, net_carb:0.77, cal:289.9 },
    macros_per_egg: { fat:12.72, protein:7.15, net_carb:0.39, cal:144.95 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:1    , name:'زيت زيتون بكر', qty:15 },
    ],
    veg: [],
    notes:       'الزيت يُضاف بعد التقديم',
    cooking_tip: '3-4 دقائق في ماء مغلي مع خل',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF53 | بيض بوشد (2) + أفوكادو */
  /* نسبة: 1.87 | بوشد | 2 بيضة */
  {
    id:         'BF53',
    id_s:       'poached_avocado_2',
    name_ar:    'بيض بوشد (2) + أفوكادو',
    name_en:    'Poached Eggs Avocado',
    method:     'بوشد',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.87,
    macros: { fat:21.7, protein:15.8, net_carb:2.12, cal:277.3 },
    macros_per_egg: { fat:10.85, protein:7.9, net_carb:1.06, cal:138.65 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:61   , name:'أفوكادو', qty:75 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF54 | بيض بوشد (3) + زيت زيتون */
  /* نسبة: 2.19 | بوشد | 3 بيضة */
  {
    id:         'BF54',
    id_s:       'poached_olive_3',
    name_ar:    'بيض بوشد (3) + زيت زيتون',
    name_en:    'Poached Eggs Olive',
    method:     'بوشد',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.19,
    macros: { fat:30.67, protein:21.45, net_carb:1.15, cal:368.55 },
    macros_per_egg: { fat:10.22, protein:7.15, net_carb:0.38, cal:122.85 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:1    , name:'زيت زيتون بكر', qty:15 },
    ],
    veg: [],
    notes:       'الزيت يُضاف بعد التقديم',
    cooking_tip: '3-4 دقائق في ماء مغلي مع خل',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF55 | بيض بوشد (3) + أفوكادو */
  /* نسبة: 1.65 | بوشد | 3 بيضة */
  {
    id:         'BF55',
    id_s:       'poached_avocado_3',
    name_ar:    'بيض بوشد (3) + أفوكادو',
    name_en:    'Poached Eggs Avocado',
    method:     'بوشد',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.65,
    macros: { fat:26.92, protein:22.95, net_carb:2.5, cal:355.95 },
    macros_per_egg: { fat:8.97, protein:7.65, net_carb:0.83, cal:118.65 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:61   , name:'أفوكادو', qty:75 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF56 | عجة بالفرن بـالزبدة (3 بيضات) */
  /* نسبة: 2.44 | فرن | 3 بيضة */
  {
    id:         'BF56',
    id_s:       'baked_butter_3',
    name_ar:    'عجة بالفرن بـالزبدة (3 بيضات)',
    name_en:    'Baked Frittata',
    method:     'فرن',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.44,
    macros: { fat:38.17, protein:22.38, net_carb:2.24, cal:443.65 },
    macros_per_egg: { fat:12.72, protein:7.46, net_carb:0.75, cal:147.88 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:40 },
    ],
    veg: [],
    cooking_tip: '180 درجة — 15-20 دقيقة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF57 | فريتاتا سبانخ بـالزبدة (3 بيضات) */
  /* نسبة: 2.19 | فرن | 3 بيضة */
  {
    id:         'BF57',
    id_s:       'baked_spinach_butter_3',
    name_ar:    'فريتاتا سبانخ بـالزبدة (3 بيضات)',
    name_en:    'Spinach Frittata',
    method:     'فرن',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.19,
    macros: { fat:38.41, protein:24.12, net_carb:3.08, cal:457.45 },
    macros_per_egg: { fat:12.8, protein:8.04, net_carb:1.03, cal:152.48 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:40 },
    ],
    veg: [
      { fid:64   , name:'سبانخ طازجة', qty:60 },
    ],
    cooking_tip: 'حمّر السبانخ قبل إضافة البيض',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF58 | فريتاتا مشروم وشيدر (3 بيضات) */
  /* نسبة: 1.58 | فرن | 3 بيضة */
  {
    id:         'BF58',
    id_s:       'baked_mush_ched_butter_3',
    name_ar:    'فريتاتا مشروم وشيدر (3 بيضات)',
    name_en:    'Mushroom Cheddar Frittata',
    method:     'فرن',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.58,
    macros: { fat:33.85, protein:30.9, net_carb:2.93, cal:441.45 },
    macros_per_egg: { fat:11.28, protein:10.3, net_carb:0.98, cal:147.15 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:29   , name:'جبن شيدر', qty:30 },
    ],
    veg: [
      { fid:68   , name:'مشروم', qty:60 },
    ],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF59 | عجة بالفرن بـالسمن (3 بيضات) */
  /* نسبة: 2.56 | فرن | 3 بيضة */
  {
    id:         'BF59',
    id_s:       'baked_ghee_3',
    name_ar:    'عجة بالفرن بـالسمن (3 بيضات)',
    name_en:    'Baked Frittata',
    method:     'فرن',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.56,
    macros: { fat:40.02, protein:22.32, net_carb:2.23, cal:461.65 },
    macros_per_egg: { fat:13.34, protein:7.44, net_carb:0.74, cal:153.88 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:40 },
    ],
    veg: [],
    cooking_tip: '180 درجة — 15-20 دقيقة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF60 | فريتاتا سبانخ بـالسمن (3 بيضات) */
  /* نسبة: 2.3 | فرن | 3 بيضة */
  {
    id:         'BF60',
    id_s:       'baked_spinach_ghee_3',
    name_ar:    'فريتاتا سبانخ بـالسمن (3 بيضات)',
    name_en:    'Spinach Frittata',
    method:     'فرن',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.3,
    macros: { fat:40.26, protein:24.06, net_carb:3.07, cal:475.45 },
    macros_per_egg: { fat:13.42, protein:8.02, net_carb:1.02, cal:158.48 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:40 },
    ],
    veg: [
      { fid:64   , name:'سبانخ طازجة', qty:60 },
    ],
    cooking_tip: 'حمّر السبانخ قبل إضافة البيض',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF61 | فريتاتا مشروم وشيدر (3 بيضات) */
  /* نسبة: 1.67 | فرن | 3 بيضة */
  {
    id:         'BF61',
    id_s:       'baked_mush_ched_ghee_3',
    name_ar:    'فريتاتا مشروم وشيدر (3 بيضات)',
    name_en:    'Mushroom Cheddar Frittata',
    method:     'فرن',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.67,
    macros: { fat:35.7, protein:30.84, net_carb:2.92, cal:459.45 },
    macros_per_egg: { fat:11.9, protein:10.28, net_carb:0.97, cal:153.15 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:29   , name:'جبن شيدر', qty:30 },
    ],
    veg: [
      { fid:68   , name:'مشروم', qty:60 },
    ],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF62 | عجة بالفرن بـالزبدة (4 بيضات) */
  /* نسبة: 2.13 | فرن | 4 بيضة */
  {
    id:         'BF62',
    id_s:       'baked_butter_4',
    name_ar:    'عجة بالفرن بـالزبدة (4 بيضات)',
    name_en:    'Baked Frittata',
    method:     'فرن',
    egg_count:  4,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.13,
    macros: { fat:43.4, protein:29.53, net_carb:2.63, cal:522.3 },
    macros_per_egg: { fat:10.85, protein:7.38, net_carb:0.66, cal:130.57 },
    components: [
      { fid:10   , name:'بيض كامل', qty:220 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:40 },
    ],
    veg: [],
    cooking_tip: '180 درجة — 15-20 دقيقة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF63 | فريتاتا سبانخ بـالزبدة (4 بيضات) */
  /* نسبة: 1.96 | فرن | 4 بيضة */
  {
    id:         'BF63',
    id_s:       'baked_spinach_butter_4',
    name_ar:    'فريتاتا سبانخ بـالزبدة (4 بيضات)',
    name_en:    'Spinach Frittata',
    method:     'فرن',
    egg_count:  4,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.96,
    macros: { fat:43.64, protein:31.27, net_carb:3.47, cal:536.1 },
    macros_per_egg: { fat:10.91, protein:7.82, net_carb:0.87, cal:134.03 },
    components: [
      { fid:10   , name:'بيض كامل', qty:220 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:40 },
    ],
    veg: [
      { fid:64   , name:'سبانخ طازجة', qty:60 },
    ],
    cooking_tip: 'حمّر السبانخ قبل إضافة البيض',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF64 | فريتاتا مشروم وشيدر (4 بيضات) */
  /* نسبة: 1.69 | فرن | 4 بيضة */
  {
    id:         'BF64',
    id_s:       'baked_mush_ched_butter_4',
    name_ar:    'فريتاتا مشروم وشيدر (4 بيضات)',
    name_en:    'Mushroom Cheddar Frittata',
    method:     'فرن',
    egg_count:  4,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.69,
    macros: { fat:44.08, protein:38.05, net_carb:3.32, cal:564.3 },
    macros_per_egg: { fat:11.02, protein:9.51, net_carb:0.83, cal:141.07 },
    components: [
      { fid:10   , name:'بيض كامل', qty:220 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:29   , name:'جبن شيدر', qty:30 },
      { fid:1    , name:'زيت زيتون بكر', qty:5 },
    ],
    veg: [
      { fid:68   , name:'مشروم', qty:60 },
    ],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF65 | عجة بالفرن بـالسمن (4 بيضات) */
  /* نسبة: 2.23 | فرن | 4 بيضة */
  {
    id:         'BF65',
    id_s:       'baked_ghee_4',
    name_ar:    'عجة بالفرن بـالسمن (4 بيضات)',
    name_en:    'Baked Frittata',
    method:     'فرن',
    egg_count:  4,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.23,
    macros: { fat:45.25, protein:29.47, net_carb:2.62, cal:540.3 },
    macros_per_egg: { fat:11.31, protein:7.37, net_carb:0.66, cal:135.07 },
    components: [
      { fid:10   , name:'بيض كامل', qty:220 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:40 },
    ],
    veg: [],
    cooking_tip: '180 درجة — 15-20 دقيقة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF66 | فريتاتا سبانخ بـالسمن (4 بيضات) */
  /* نسبة: 2.05 | فرن | 4 بيضة */
  {
    id:         'BF66',
    id_s:       'baked_spinach_ghee_4',
    name_ar:    'فريتاتا سبانخ بـالسمن (4 بيضات)',
    name_en:    'Spinach Frittata',
    method:     'فرن',
    egg_count:  4,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.05,
    macros: { fat:45.49, protein:31.21, net_carb:3.46, cal:554.1 },
    macros_per_egg: { fat:11.37, protein:7.8, net_carb:0.86, cal:138.53 },
    components: [
      { fid:10   , name:'بيض كامل', qty:220 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:40 },
    ],
    veg: [
      { fid:64   , name:'سبانخ طازجة', qty:60 },
    ],
    cooking_tip: 'حمّر السبانخ قبل إضافة البيض',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF67 | فريتاتا مشروم وشيدر (4 بيضات) */
  /* نسبة: 1.57 | فرن | 4 بيضة */
  {
    id:         'BF67',
    id_s:       'baked_mush_ched_ghee_4',
    name_ar:    'فريتاتا مشروم وشيدر (4 بيضات)',
    name_en:    'Mushroom Cheddar Frittata',
    method:     'فرن',
    egg_count:  4,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.57,
    macros: { fat:40.93, protein:37.99, net_carb:3.31, cal:538.1 },
    macros_per_egg: { fat:10.23, protein:9.5, net_carb:0.83, cal:134.53 },
    components: [
      { fid:10   , name:'بيض كامل', qty:220 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:29   , name:'جبن شيدر', qty:30 },
    ],
    veg: [
      { fid:68   , name:'مشروم', qty:60 },
    ],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF68 | عجة المايكرويف (1) — مج كيتو */
  /* نسبة: 3.2 | مايكرويف | 1 بيضة */
  {
    id:         'BF68',
    id_s:       'micro_1',
    name_ar:    'عجة المايكرويف (1) — مج كيتو',
    name_en:    'Microwave Mug Omelette',
    method:     'مايكرويف',
    egg_count:  1,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 3.2,
    macros: { fat:20.13, protein:8.44, net_carb:1.22, cal:218.75 },
    macros_per_egg: { fat:20.13, protein:8.44, net_carb:1.22, cal:218.75 },
    components: [
      { fid:10   , name:'بيض كامل', qty:55 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:35   , name:'جبنة كريمية', qty:20 },
    ],
    veg: [],
    notes:       '90 ثانية — مثالي للإفطار السريع',
    cooking_tip: 'مج كبير — حرك بعد 45 ثانية',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF69 | عجة المايكرويف (2) — مج كيتو */
  /* نسبة: 2.31 | مايكرويف | 2 بيضة */
  {
    id:         'BF69',
    id_s:       'micro_2',
    name_ar:    'عجة المايكرويف (2) — مج كيتو',
    name_en:    'Microwave Mug Omelette',
    method:     'مايكرويف',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.31,
    macros: { fat:25.35, protein:15.59, net_carb:1.6, cal:297.4 },
    macros_per_egg: { fat:12.68, protein:7.79, net_carb:0.8, cal:148.7 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:35   , name:'جبنة كريمية', qty:20 },
    ],
    veg: [],
    notes:       '90 ثانية — مثالي للإفطار السريع',
    cooking_tip: 'مج كبير — حرك بعد 45 ثانية',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF70 | بيض مخفوق بـالزبدة (2) */
  /* نسبة: 1.97 | مخفوق | 2 بيضة */
  {
    id:         'BF70',
    id_s:       'scrambled_butter_2',
    name_ar:    'بيض مخفوق بـالزبدة (2)',
    name_en:    'Scrambled Eggs',
    method:     'مخفوق',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.97,
    macros: { fat:18.55, protein:14.39, net_carb:0.78, cal:229.0 },
    macros_per_egg: { fat:9.28, protein:7.2, net_carb:0.39, cal:114.5 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
    ],
    veg: [],
    notes:       'Low & Slow — حرارة منخفضة جداً',
    cooking_tip: '5-7 دقائق حرارة منخفضة — حرك باستمرار',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF71 | بيض مخفوق كريمي بـالزبدة (2) */
  /* نسبة: 2.77 | مخفوق | 2 بيضة */
  {
    id:         'BF71',
    id_s:       'scrambled_cream_butter_2',
    name_ar:    'بيض مخفوق كريمي بـالزبدة (2)',
    name_en:    'Creamy Scrambled',
    method:     'مخفوق',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.77,
    macros: { fat:29.35, protein:15.02, net_carb:1.59, cal:331.0 },
    macros_per_egg: { fat:14.68, protein:7.51, net_carb:0.8, cal:165.5 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:30 },
    ],
    veg: [],
    cooking_tip: 'أضف الكريمة في آخر دقيقة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF72 | بيض مخفوق بالشيدر والـالزبدة (2) */
  /* نسبة: 1.98 | مخفوق | 2 بيضة */
  {
    id:         'BF72',
    id_s:       'scrambled_cheddar_butter_2',
    name_ar:    'بيض مخفوق بالشيدر والـالزبدة (2)',
    name_en:    'Cheddar Scrambled',
    method:     'مخفوق',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.98,
    macros: { fat:25.15, protein:19.39, net_carb:1.04, cal:309.4 },
    macros_per_egg: { fat:12.57, protein:9.7, net_carb:0.52, cal:154.7 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:29   , name:'جبن شيدر', qty:20 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF73 | بيض مخفوق بـالسمن (2) */
  /* نسبة: 2.18 | مخفوق | 2 بيضة */
  {
    id:         'BF73',
    id_s:       'scrambled_ghee_2',
    name_ar:    'بيض مخفوق بـالسمن (2)',
    name_en:    'Scrambled Eggs',
    method:     'مخفوق',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.18,
    macros: { fat:20.4, protein:14.33, net_carb:0.77, cal:247.0 },
    macros_per_egg: { fat:10.2, protein:7.17, net_carb:0.39, cal:123.5 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:3    , name:'سمن حيواني', qty:10 },
    ],
    veg: [],
    notes:       'Low & Slow — حرارة منخفضة جداً',
    cooking_tip: '5-7 دقائق حرارة منخفضة — حرك باستمرار',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF74 | بيض مخفوق كريمي بـالسمن (2) */
  /* نسبة: 2.96 | مخفوق | 2 بيضة */
  {
    id:         'BF74',
    id_s:       'scrambled_cream_ghee_2',
    name_ar:    'بيض مخفوق كريمي بـالسمن (2)',
    name_en:    'Creamy Scrambled',
    method:     'مخفوق',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.96,
    macros: { fat:31.2, protein:14.96, net_carb:1.58, cal:349.0 },
    macros_per_egg: { fat:15.6, protein:7.48, net_carb:0.79, cal:174.5 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:30 },
    ],
    veg: [],
    cooking_tip: 'أضف الكريمة في آخر دقيقة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF75 | بيض مخفوق بالشيدر والـالسمن (2) */
  /* نسبة: 2.14 | مخفوق | 2 بيضة */
  {
    id:         'BF75',
    id_s:       'scrambled_cheddar_ghee_2',
    name_ar:    'بيض مخفوق بالشيدر والـالسمن (2)',
    name_en:    'Cheddar Scrambled',
    method:     'مخفوق',
    egg_count:  2,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.14,
    macros: { fat:27.0, protein:19.33, net_carb:1.03, cal:327.4 },
    macros_per_egg: { fat:13.5, protein:9.66, net_carb:0.52, cal:163.7 },
    components: [
      { fid:10   , name:'بيض كامل', qty:110 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:29   , name:'جبن شيدر', qty:20 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF76 | بيض مخفوق بـالزبدة (3) */
  /* نسبة: 1.69 | مخفوق | 3 بيضة */
  {
    id:         'BF76',
    id_s:       'scrambled_butter_3',
    name_ar:    'بيض مخفوق بـالزبدة (3)',
    name_en:    'Scrambled Eggs',
    method:     'مخفوق',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.69,
    macros: { fat:23.77, protein:21.54, net_carb:1.16, cal:307.65 },
    macros_per_egg: { fat:7.92, protein:7.18, net_carb:0.39, cal:102.55 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
    ],
    veg: [],
    notes:       'Low & Slow — حرارة منخفضة جداً',
    cooking_tip: '5-7 دقائق حرارة منخفضة — حرك باستمرار',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF77 | بيض مخفوق كريمي بـالزبدة (3) */
  /* نسبة: 2.26 | مخفوق | 3 بيضة */
  {
    id:         'BF77',
    id_s:       'scrambled_cream_butter_3',
    name_ar:    'بيض مخفوق كريمي بـالزبدة (3)',
    name_en:    'Creamy Scrambled',
    method:     'مخفوق',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.26,
    macros: { fat:34.57, protein:22.17, net_carb:1.97, cal:409.65 },
    macros_per_egg: { fat:11.52, protein:7.39, net_carb:0.66, cal:136.55 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:30 },
    ],
    veg: [],
    cooking_tip: 'أضف الكريمة في آخر دقيقة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF78 | بيض مخفوق بالشيدر والـالزبدة (3) */
  /* نسبة: 1.75 | مخفوق | 3 بيضة */
  {
    id:         'BF78',
    id_s:       'scrambled_cheddar_butter_3',
    name_ar:    'بيض مخفوق بالشيدر والـالزبدة (3)',
    name_en:    'Cheddar Scrambled',
    method:     'مخفوق',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.75,
    macros: { fat:30.37, protein:26.54, net_carb:1.42, cal:388.05 },
    macros_per_egg: { fat:10.12, protein:8.85, net_carb:0.47, cal:129.35 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:4    , name:'زبدة حيوانية', qty:10 },
      { fid:29   , name:'جبن شيدر', qty:20 },
    ],
    veg: [],
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF79 | بيض مخفوق بـالسمن (3) */
  /* نسبة: 1.83 | مخفوق | 3 بيضة */
  {
    id:         'BF79',
    id_s:       'scrambled_ghee_3',
    name_ar:    'بيض مخفوق بـالسمن (3)',
    name_en:    'Scrambled Eggs',
    method:     'مخفوق',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.83,
    macros: { fat:25.62, protein:21.48, net_carb:1.15, cal:325.65 },
    macros_per_egg: { fat:8.54, protein:7.16, net_carb:0.38, cal:108.55 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:3    , name:'سمن حيواني', qty:10 },
    ],
    veg: [],
    notes:       'Low & Slow — حرارة منخفضة جداً',
    cooking_tip: '5-7 دقائق حرارة منخفضة — حرك باستمرار',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF80 | بيض مخفوق كريمي بـالسمن (3) */
  /* نسبة: 2.39 | مخفوق | 3 بيضة */
  {
    id:         'BF80',
    id_s:       'scrambled_cream_ghee_3',
    name_ar:    'بيض مخفوق كريمي بـالسمن (3)',
    name_en:    'Creamy Scrambled',
    method:     'مخفوق',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 2.39,
    macros: { fat:36.42, protein:22.11, net_carb:1.96, cal:427.65 },
    macros_per_egg: { fat:12.14, protein:7.37, net_carb:0.65, cal:142.55 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:38   , name:'كريمة طبخ', qty:30 },
    ],
    veg: [],
    cooking_tip: 'أضف الكريمة في آخر دقيقة',
  },

  /* ──────────────────────────────────────────────────────────── */
  /* BF81 | بيض مخفوق بالشيدر والـالسمن (3) */
  /* نسبة: 1.86 | مخفوق | 3 بيضة */
  {
    id:         'BF81',
    id_s:       'scrambled_cheddar_ghee_3',
    name_ar:    'بيض مخفوق بالشيدر والـالسمن (3)',
    name_en:    'Cheddar Scrambled',
    method:     'مخفوق',
    egg_count:  3,
    egg_weight: 55,
    phases:     [],
    keto_ratio: 1.86,
    macros: { fat:32.22, protein:26.48, net_carb:1.41, cal:406.05 },
    macros_per_egg: { fat:10.74, protein:8.83, net_carb:0.47, cal:135.35 },
    components: [
      { fid:10   , name:'بيض كامل', qty:165 },
      { fid:3    , name:'سمن حيواني', qty:10 },
      { fid:29   , name:'جبن شيدر', qty:20 },
    ],
    veg: [],
  },

];

/* ─── فلترة الوصفات ─── */
function getEggTemplatesByMethod(method){
  return BREAKFAST_EGG_TEMPLATES.filter(t => t.method === method);
}
function getEggTemplatesByEggCount(n){
  return BREAKFAST_EGG_TEMPLATES.filter(t => t.egg_count === n);
}
function getBestEggTemplate(mem, phase){
  const favIds = mem?.favorites_foods || [];
  const all = BREAKFAST_EGG_TEMPLATES.filter(t =>
    (t.phases.length===0 || t.phases.includes(phase)) && t.keto_ratio >= 1.5
  );
  // أولوية: مفضلات المشترك
  const fromFav = all.filter(t => t.components.some(c => favIds.includes(c.fid)));
  return (fromFav.length ? fromFav : all)[0] || null;
}