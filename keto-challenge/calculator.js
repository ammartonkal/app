/* ════════════════════════════════════════════════════════════════
   calculator.js — حاسبة الوصفة الذكية v2
   تحدي الكيتو مع د. عمار تنكل
════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════
   CALCULATOR v2 — حاسبة الوصفة الذكية
═══════════════════════════════════════════ */

/* حالة الحاسبة */
let _calcMode      = 'auto';      // 'auto' | 'manual'
let _calcSelected  = [];          // [{fid}] — المكونات المختارة
let _calcCarbLimit = 10;          // غ كارب المطلوب للوجبة
let _calcUnit      = 'gram';      // 'gram'|'tbsp'|'cup'|'hand'|'natural'
let _calcBuilt     = false;       // هل بُنيت الوجبة؟

/* وحدات القياس لكل صنف */
const UNIT_DEFS = {
  gram:    { label:'غرام',          suffix:'غ',       toGram: g=>g,                fromGram: g=>g },
  tbsp:    { label:'ملعقة كبيرة',   suffix:'م.ك',     toGram: g=>g*14,             fromGram: g=>g/14 },
  tsp:     { label:'ملعقة صغيرة',   suffix:'م.ص',     toGram: g=>g*5,              fromGram: g=>g/5 },
  cup:     { label:'كوب (240مل)',    suffix:'كوب',     toGram: g=>g*240,            fromGram: g=>g/240 },
  hand:    { label:'راحة اليد',     suffix:'راحة',    toGram: g=>g*85,             fromGram: g=>g/85 },
  natural: { label:'حصة طبيعية',    suffix:'حصة',     toGram: g=>g,                fromGram: g=>g },
};

/* تحويل الكمية حسب الوحدة والصنف */
function _unitQty(food, grams, unit){
  if(unit === 'gram')    return { display: Math.round(grams), suffix: 'غ' };
  if(unit === 'tbsp'){
    if(food.fat > 60) return { display: +(grams/14).toFixed(1), suffix: 'م.ك' };
    if(food.fat > 20) return { display: +(grams/14).toFixed(1), suffix: 'م.ك' };
    return { display: Math.round(grams), suffix: 'غ' };
  }
  if(unit === 'cup'){
    if(food.cat === 'خضار' || food.cat === 'فواكه')
      return { display: +(grams/80).toFixed(1), suffix: 'كوب' };
    return { display: Math.round(grams), suffix: 'غ' };
  }
  if(unit === 'hand'){
    // راحة اليد ≈ 85غ بروتين | كف اليد ≈ 30غ دهن صلب | حفنة ≈ 30غ مكسرات
    if(['بروتين','دواجن','لحوم','أسماك'].includes(food.cat))
      return { display: +(grams/85).toFixed(1), suffix: 'راحة' };
    if(food.fat > 60)
      return { display: +(grams/14).toFixed(1), suffix: 'م.ك' };
    return { display: +(grams/30).toFixed(1), suffix: 'كف' };
  }
  if(unit === 'natural') return { display: '', suffix: humanQty ? humanQty(food, grams) : grams+'غ' };
  return { display: Math.round(grams), suffix: 'غ' };
}

function _unitToGram(food, displayVal, unit){
  if(unit === 'gram')    return displayVal;
  if(unit === 'tbsp')    return displayVal * 14;
  if(unit === 'cup')     return displayVal * (food.cat === 'خضار' ? 80 : 240);
  if(unit === 'hand'){
    if(['بروتين','دواجن','لحوم','أسماك'].includes(food.cat)) return displayVal * 85;
    if(food.fat > 60) return displayVal * 14;
    return displayVal * 30;
  }
  return displayVal;
}

/* ─── الدالة الرئيسية ─── */

/* ─── البذور والمكسرات الأعلى ألياف — للاقتراح التلقائي ─── */
const FIBER_BOOSTERS = [
  // fid, name, fiber/100g, fat/100g, prot/100g, nc/100g, cal/100g, serving_g
  {fid:55, name:'بذور الكتان',    fiber:27.3, fat:42.2, prot:18.3, nc:1.9,  cal:534, serving:15},
  {fid:56, name:'بذور الشيا',     fiber:34.4, fat:30.7, prot:16.5, nc:1.7,  cal:486, serving:15},
  {fid:59, name:'بذور دوار الشمس',fiber:8.6,  fat:51.5, prot:20.8, nc:3.2,  cal:584, serving:20},
  {fid:46, name:'لوز',            fiber:12.5, fat:49.9, prot:21.2, nc:3.5,  cal:579, serving:25},
  {fid:47, name:'جوز',            fiber:6.7,  fat:65.2, prot:15.2, nc:2.6,  cal:654, serving:20},
  {fid:50, name:'بندق',           fiber:9.7,  fat:60.8, prot:15.0, nc:4.3,  cal:628, serving:20},
  {fid:45, name:'مكاديميا',       fiber:8.6,  fat:75.8, prot:7.9,  nc:4.6,  cal:718, serving:20},
];

/* ─── اقتراح بذور/مكسرات لرفع الألياف ─── */
function _calcFiberBooster(currentFiberG, mealCalBudget, mealFatBudget, favIds){
  const fiberGoal = 3.5; // هدف الألياف للوجبة الواحدة
  const fiberGap  = Math.max(fiberGoal - currentFiberG, 0);
  if(fiberGap < 0.5) return null; // ألياف كافية

  // ابحث في المفضلة أولاً، ثم الأعلى ألياف
  const sorted = FIBER_BOOSTERS.slice().sort(function(a,b){
    const aFav = favIds&&favIds.includes(a.fid) ? -10 : 0;
    const bFav = favIds&&favIds.includes(b.fid) ? -10 : 0;
    return (aFav - bFav) || (b.fiber - a.fiber); // الأعلى ألياف أولاً
  });

  for(var i=0; i<sorted.length; i++){
    const booster = sorted[i];
    // الكمية المطلوبة لسد الفجوة (لكن بحد أقصى = serving الطبيعي)
    const qtyForFiber = Math.round(fiberGap / booster.fiber * 100 / 5) * 5;
    const qty = Math.min(Math.max(qtyForFiber, 10), booster.serving);
    const q   = qty/100;

    // تحقق أن السعرات والدهن لا تتجاوز الميزانية
    const addedCal = booster.cal * q;
    const addedFat = booster.fat * q;
    if(addedCal > mealCalBudget * 0.25) continue; // لا تأخذ أكثر من 25% من الميزانية
    if(addedFat > mealFatBudget * 0.30) continue;

    return {
      fid:     booster.fid,
      name:    booster.name,
      qty:     qty,
      fiber:   Math.round(booster.fiber*q*10)/10,
      fat:     Math.round(booster.fat*q*10)/10,
      prot:    Math.round(booster.prot*q*10)/10,
      nc:      Math.round(booster.nc*q*10)/10,
      cal:     Math.round(booster.cal*q),
      sat:     0,
      gap:     Math.round(fiberGap*10)/10,
      fav:     favIds&&favIds.includes(booster.fid),
    };
  }
  return null;
}


/* ══════════════════════════════════════════════════════════════
   دوال أساسية مطلوبة من _buildAutoMeal وبطاقة المغذيات
══════════════════════════════════════════════════════════════ */

/* ─── إجمالي ماكرو كل المكونات (داخلية + خارجية) ─── */
function _calcTotalsAll(){
  const ZERO_SW = [108,109,110,111,112];
  const t = {fat:0,prot:0,nc:0,cal:0,fiber:0,sat:0};
  calcItems.forEach(function(item){
    if(typeof item.fid === 'number'){
      const f = FOODS.find(function(x){ return x.id===item.fid; });
      if(!f) return;
      const q = item.qty/100;
      t.fat   += f.fat*q;
      t.prot  += f.protein*q;
      t.fiber += (f.fiber||0)*q;
      t.sat   += (f.sat_fat||0)*q;
      if(!ZERO_SW.includes(f.id)){
        t.nc  += f.net_carb*q;
        t.cal += f.cal*q;
      }
    } else if(typeof item.fid === 'string'){
      const uType = item.fid.replace('ext:','');
      const em = typeof getExternalMacros!=='undefined'
        ? getExternalMacros(uType, item._sel||{}, item.qty) : null;
      if(em){
        t.fat  += em.fat||0;  t.prot += em.prot||0;
        t.nc   += em.nc||0;   t.cal  += em.cal||0;
      }
    }
  });
  return {
    fat:   Math.round(t.fat  *10)/10,
    prot:  Math.round(t.prot *10)/10,
    nc:    Math.round(t.nc   *10)/10,
    cal:   Math.round(t.cal),
    fiber: Math.round(t.fiber*10)/10,
    sat:   Math.round(t.sat  *10)/10,
  };
}

/* ─── ماكرو لقائمة صنف/كمية ─── */
function _calcMealRatio(items){
  const ZERO_SW = [108,109,110,111,112];
  let fat=0,prot=0,nc=0,cal=0,fiber=0;
  (items||[]).forEach(function(i){
    const f = FOODS.find(function(x){ return x.id===i.fid; });
    if(!f) return;
    const q = i.qty/100;
    fat   += f.fat*q;
    prot  += f.protein*q;
    fiber += (f.fiber||0)*q;
    if(!ZERO_SW.includes(f.id)){ nc+=f.net_carb*q; cal+=f.cal*q; }
  });
  const d = nc + prot*0.6;
  return {
    fat:   Math.round(fat  *10)/10,
    prot:  Math.round(prot *10)/10,
    nc:    Math.round(nc   *10)/10,
    cal:   Math.round(cal),
    fiber: Math.round(fiber*10)/10,
    ratio: d>0 ? Math.round(fat/d*100)/100 : 0,
  };
}

/* ─── sat_fat الكلي ─── */
function _calcSatFatTotal(){
  return Math.round(calcItems.reduce(function(s,i){
    if(typeof i.fid!=='number') return s;
    const f=FOODS.find(function(x){ return x.id===i.fid; });
    return s+(f?(f.sat_fat||0)*i.qty/100:0);
  },0)*10)/10;
}

/* ─── ألياف الكلي ─── */
function _calcFiberTotal(){
  return Math.round(calcItems.reduce(function(s,i){
    if(typeof i.fid!=='number') return s;
    const f=FOODS.find(function(x){ return x.id===i.fid; });
    return s+(f?(f.fiber||0)*i.qty/100:0);
  },0)*10)/10;
}

/* ─── صوديوم الكلي ─── */
function _calcSodiumTotal(){
  return Math.round(calcItems.reduce(function(s,i){
    if(typeof i.fid!=='number') return s;
    const f=FOODS.find(function(x){ return x.id===i.fid; });
    return s+(f?(f.sodium||0)*i.qty/100:0);
  },0));
}

/* ─── تسجيل الوجبة فقط ─── */
async function _calcRegisterOnly(){
  if(!calcItems.length){ alert('لا توجد مكونات'); return; }
  await _doRegisterMeal(false);
}

/* ─── تسجيل + حفظ الوصفة ─── */
async function _calcRegisterAndSave(){
  if(!calcItems.length){ alert('لا توجد مكونات'); return; }
  await _doRegisterMeal(true);
}

/* ─── تنفيذ التسجيل ─── */
async function _doRegisterMeal(save){
  const m    = _calcTotalsAll();
  const date = new Date().toISOString().split('T')[0];
  const mem  = MEMBERS.find(function(x){ return x.uid===(CU&&CU.id); });
  const mti  = mem && typeof getMealType!=='undefined' ? getMealType(mem) : null;
  const meal = {
    uid:  CU.id, date, ts: Date.now(),
    type: mti ? mti.type : 'other',
    name: save ? (prompt('اسم الوجبة:', 'وجبتي الكيتونية')||'وجبتي') : 'وجبة من الحاسبة',
    items: calcItems.map(function(i){
      const f=FOODS.find(function(x){ return x.id===i.fid; });
      return {fid:i.fid, name:f?f.name:'', qty:i.qty};
    }),
    totals: { cal:m.cal, fat:m.fat, protein:m.prot,
              net_carb:m.nc, fiber:m.fiber, sodium:_calcSodiumTotal() }
  };
  MEALS.push(meal);
  if(window.DB && window.DB.saveMeal) await window.DB.saveMeal(meal);
  if(typeof onMealRegistered!=='undefined') onMealRegistered(meal.type);
  if(save){
    const share = document.getElementById('calc-share-check');
    const recipe = {
      id: RECIPES.length+1, name: meal.name,
      desc:'وصفة من حاسبة الوصفة الذكية', servings:1,
      category:'وصفاتي', tags:['شخصية'],
      ingredients: calcItems.map(function(i){ return {fid:i.fid, qty:i.qty}; }),
      steps:['تحضير المكونات وطهيها'],
      favorites:[CU.id],
      _savedBy:CU.id,
      _shareRequest: share ? share.checked : false,
    };
    RECIPES.push(recipe);
  }
  // مسح وانتقال للوحة التحكم
  calcItems = []; _calcSelected = []; _calcBuilt = false;
  window._calcFiberSuggestion = null;
  if(typeof gp!=='undefined') gp('dashboard');
}

/* ─── إضافة مقترح الألياف للوجبة ─── */
function _addFiberBooster(fid, qty){
  const existing = calcItems.find(function(i){ return i.fid===fid; });
  if(existing){
    existing.qty = Math.min(existing.qty + qty, qty*2);
  } else {
    const uType = _calcGetUnitType(fid);
    const sel   = uType ? _getDefaultSel(uType, fid) : {};
    calcItems.push({fid:fid, qty:qty, _sel:sel});
    if(!_calcSelected.includes(fid)) _calcSelected.push(fid);
  }
  window._calcFiberSuggestion = null;
  rCalc();
}


/* ════════════════════════════════════════════════════════════════
   ثوابت منطق الوجبة الكيتونية المتكاملة
════════════════════════════════════════════════════════════════ */

/* تصنيف الدهون حسب النوع */
const FAT_MONO_FIDS = [1, 2, 6, 61, 46, 50, 113];   // زيت زيتون، أفوكادو، لوز، بندق، زيتون
const FAT_SAT_FIDS  = [3, 4, 5, 7, 8, 9];            // سمن، زبدة، زيت نارجيل، MCT
const FAT_PUFA_FIDS = [47, 55, 56, 59, 17, 18];      // جوز، كتان، شيا، سمسم، سلمون، ساردين

/* المحليات صفرية الكارب */
const ZERO_SWEETENER_FIDS = [108, 109, 110, 111, 112]; // ستيفيا، مونك فروت، إريثريتول، يلولوز...
/* المالتيتول السائل يُحسب بالكامل */
const MALTITOL_FIDS = [];  // يُضاف fid إذا أُضيف للقاعدة

/* الخضار الورقية */
const LEAFY_VEG_FIDS = [62, 63, 64, 65, 66];          // جرجير، خس، سبانخ، بقدونس، ريحان

/* حدود الوجبة */
const MEAL_LIMITS = {
  protein_min_g:   30,    // حد أدنى البروتين للوجبة الرئيسية
  carb_min_g:       5,    // حد أدنى الكارب الصافٍ
  carb_max_g:      10,    // حد أقصى الكارب الصافٍ
  fiber_min_g:      5,    // حد أدنى الألياف
  fiber_max_g:     10,    // حد أقصى الألياف
  sat_fat_max_g:   14,    // ≤ ملعقة كبيرة دهون مشبعة
  mono_fat_min_g:  15,    // ≥ 15غ دهون أحادية
  pufa_fat_max_g:  28,    // ≤ ملعقتين دهون متعددة
  veg_leafy_max_g: 20,    // ≤ 20غ خضار ورقية/نوع
  veg_whole_max_g: 30,    // ≤ 30غ خضار حبات/نوع (ربع متوسطة)
  fruit_nc_max_g:   3,    // ≤ 3غ كارب صافٍ/نوع فاكهة
  nuts_max_g:      30,    // ≤ 30غ مكسرات/وجبة
  seeds_max_g:     15,    // ≤ 15غ بذور/وجبة
  keto_bullet_cal: 150,   // قهوة كيتونية ≈ 150 سعرة
};

/* سقف السعرات حسب خطة الوجبات */
function getMealCalLimit(mealsN, hasSnack, isSnack){
  if(isSnack) return 200;
  if(mealsN===2 && !hasSnack) return 700;
  if(mealsN===3 && !hasSnack) return 600;
  if(mealsN===2 &&  hasSnack) return 600;
  if(mealsN===3 &&  hasSnack) return 500;
  return 600; // افتراضي
}

/* نوع الدهن لصنف معين */
function getFatType(fid){
  if(FAT_MONO_FIDS.includes(fid)) return 'mono';
  if(FAT_SAT_FIDS.includes(fid))  return 'sat';
  if(FAT_PUFA_FIDS.includes(fid)) return 'pufa';
  // تحقق من fat profile في FOODS
  const f = FOODS.find(function(x){ return x.id===fid; });
  if(!f || !f.fat) return 'unknown';
  // تقدير من نسبة sat_fat
  const satRatio = (f.sat_fat||0)/f.fat;
  if(satRatio > 0.50) return 'sat';
  if(satRatio < 0.20) return 'mono';
  return 'mixed';
}

/* الكارب الصافٍ الذكي لصنف واحد */
function smartNetCarb(fid, qty){
  if(ZERO_SWEETENER_FIDS.includes(fid)) return 0;
  const f = FOODS.find(function(x){ return x.id===fid; });
  if(!f) return 0;
  return Math.round((f.net_carb||0)*qty/100*10)/10;
}

function rCalc(){
  const mem     = MEMBERS.find(m=>m.uid===CU?.id);
  const el      = document.getElementById('calc-content');
  if(!el) return;

  // ─── شريط المتبقي ───
  const rem     = (mem && typeof getDayRemaining!=='undefined') ? getDayRemaining(mem) : null;
  const remHTML = rem
    ? '<div class="calc-remaining-bar" style="margin-bottom:16px">' +
      '<div class="calc-rem-item"><div class="calc-rem-val" style="color:var(--accent)">' + Math.round(rem.fat) + 'غ</div><div class="calc-rem-lbl">دهون متبقية</div></div>' +
      '<div class="calc-rem-item"><div class="calc-rem-val" style="color:var(--info)">' + Math.round(rem.protein) + 'غ</div><div class="calc-rem-lbl">بروتين متبقٍ</div></div>' +
      '<div class="calc-rem-item"><div class="calc-rem-val" style="color:var(--danger)">' + Math.round(rem.carb) + 'غ</div><div class="calc-rem-lbl">كارب متبقٍ</div></div>' +
      '<div class="calc-rem-item"><div class="calc-rem-val">' + (rem.consumed?.cal||0) + '</div><div class="calc-rem-lbl">سعرة مستهلكة</div></div>' +
      '</div>'
    : '';

  // ─── اختيار الوضع ───
  const modeHTML =
    '<div class="calc-mode-btns">' +
    '<div class="calc-mode-btn' + (_calcMode==='auto'?' active':'') + '" onclick="_setCalcMode(\'auto\')">' +
      '<div class="icon">🤖</div>' +
      '<div class="title">وجبة تلقائية</div>' +
      '<div class="sub">اختر المكونات — التطبيق يبني الكميات</div>' +
    '</div>' +
    '<div class="calc-mode-btn' + (_calcMode==='manual'?' active':'') + '" onclick="_setCalcMode(\'manual\')">' +
      '<div class="icon">🧑‍🍳</div>' +
      '<div class="title">بناء بنفسي</div>' +
      '<div class="sub">أختار الكميات بنفسي</div>' +
    '</div>' +
    '</div>';

  // ─── اختيار المكونات ───
  const favIds  = mem?.favorites_foods || [];
  const phase   = mem?.phase || 1;
  const cats = [
    { label:'🥩 بروتين',       cats:['بروتين','دواجن','لحوم','أسماك','بيض'] },
    { label:'🧈 دهون',         cats:['دهون','ألبان'] },
    { label:'🥦 خضار',         cats:['خضار'], exclude:['فواكه'] },
    { label:'🍓 فواكه',        cats:['فواكه','فاكهة'] },
    { label:'🌰 مكسرات وبذور', cats:['مكسرات وبذور','مكسرات','بذور'] },
    { label:'🛒 إضافات',       cats:['محليات','بدائل','توابل','مشروبات','مخبوزات كيتو','حلا كيتو','وصفات جاهزة'] },
    { label:'⚠️ خارج الكيتو', cats:['خارج_كيتو'], external:true },
  ];

  let ingredientsHTML = '<div style="margin-bottom:14px">';
  ingredientsHTML +=
    '<div style="position:relative;margin-bottom:10px">' +
    '<input type="text" id="calc-search" placeholder="🔍 ابحث عن أي مكوّن..."' +
    ' oninput="_calcSearchFood(this.value)"' +
    ' style="width:100%;padding:9px 12px;font-size:13px;border:1px solid var(--border);border-radius:var(--radius-sm)">' +
    '<div id="calc-search-results" style="display:none;position:absolute;top:100%;right:0;left:0;z-index:50;' +
    'background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);' +
    'box-shadow:var(--shadow);max-height:200px;overflow-y:auto"></div>' +
    '</div>';

  cats.forEach(function(cat) {
    if(cat.external){
      ingredientsHTML += '<div class="calc-cat-header">' + cat.label + '</div><div style="margin-bottom:4px">';
      ['bread','rice'].forEach(function(type) {
        const def = typeof UNIT_INTELLIGENCE !== 'undefined' ? UNIT_INTELLIGENCE[type] : null;
        if(!def) return;
        const isSel = _calcSelected.includes('ext:'+type);
        ingredientsHTML += '<span class="calc-food-chip' + (isSel?' selected':'') + '" style="border-color:rgba(239,83,80,.3);color:var(--danger)"' +
          ' onclick="_calcExtClick(this)" data-type="' + type + '">' + def.label + ' ⚠️</span>';
      });
      ingredientsHTML += '</div>';
      return;
    }
    const foods = FOODS.filter(function(f) {
      if(!cat.cats.some(function(c){ return f.cat && f.cat.includes(c); })) return false;
      if(cat.exclude && cat.exclude.some(function(e){ return f.cat && f.cat.includes(e); })) return false;
      return f.keto_class <= 3;
    });
    if(!foods.length) return;
    ingredientsHTML += '<div class="calc-cat-header">' + cat.label + '</div><div style="margin-bottom:4px">';
    foods.forEach(function(f) {
      const isSel = _calcSelected.includes(f.id);
      const isFav = favIds.includes(f.id);
      ingredientsHTML += '<span class="calc-food-chip' + (isSel?' selected':'') + (isFav?' fav':'') + '"' +
        ' onclick="_toggleCalcFood(' + f.id + ')">' +
        (isFav ? '⭐ ' : '') + f.name +
        (f.keto_class===3 ? ' ⚠️' : '') +
        '</span>';
    });
    ingredientsHTML += '</div>';
  });
  ingredientsHTML += '</div>';

  // ─── إعدادات الكارب ───
  const _carbBtns = [5,10,15,20].map(function(v){
    return '<div class="calc-carb-btn' + (_calcCarbLimit===v?' active':'') + '" onclick="_setCalcCarb(' + v + ')">' + v + 'غ</div>';
  }).join('') +
  '<div class="calc-carb-btn' + (_calcCarbLimit===999?' active':'') + '" onclick="_setCalcCarb(999)">حر 🔓</div>';
  const carbHTML = _calcMode === 'auto'
    ? '<div class="card" style="margin-bottom:14px">' +
      '<div style="font-size:12px;font-weight:600;color:var(--text2);margin-bottom:8px">🎯 حد الكارب في هذه الوجبة</div>' +
      '<div class="calc-carb-opts">' + _carbBtns + '</div>' +
      '<div style="font-size:11px;color:var(--text3)">سيستخدمه التطبيق لضبط الكميات وتحقيق النسبة الكيتونية</div>' +
      '</div>'
    : '';

  // ─── زر البناء / وحدات القياس ───
  const _unitTabsHTML = [
    {key:'gram',label:'غرام'},{key:'tbsp',label:'ملعقة'},
    {key:'cup',label:'كوب'},{key:'hand',label:'حجم يد'},{key:'natural',label:'حصة طبيعية'}
  ].map(function(u){
    return '<div class="calc-unit-tab' + (_calcUnit===u.key?' active':'') + '" onclick="_setCalcUnit(\'' + u.key + '\')">' + u.label + '</div>';
  }).join('');
  const actionHTML = _calcMode === 'auto'
    ? '<button class="btn primary" style="width:100%;justify-content:center;padding:14px;font-size:14px" onclick="_buildAutoMeal()">🚀 ابنِ لي وجبة متوازنة من هذه المكونات</button>'
    : '<div style="margin-bottom:12px">' +
      '<div style="font-size:12px;font-weight:600;color:var(--text2);margin-bottom:7px">⚖️ وحدة القياس</div>' +
      '<div class="calc-unit-tabs">' + _unitTabsHTML + '</div>' +
      '</div>';

  // ─── قائمة المكونات المبنية ───
  const builtHTML = calcItems.length ? _renderCalcItems() : '';

  // ─── بطاقة المغذيات ───
  const nutritionHTML = calcItems.length ? _renderCalcNutrition() : '';

  // ─── أزرار الحفظ ───
  const saveHTML = calcItems.length
    ? '<div class="card" style="margin-top:14px">' +
      '<div style="margin-bottom:12px">' +
        '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px">' +
          '<input type="checkbox" id="calc-share-check" style="width:16px;height:16px">' +
          '<div>' +
            '<div style="font-weight:500">📤 أرسل وصفتي للجميع</div>' +
            '<div style="font-size:11px;color:var(--text3);margin-top:1px">ساهم في إضافة وصفتك لقاعدة البيانات</div>' +
          '</div>' +
        '</label>' +
      '</div>' +
      '<div style="display:flex;gap:8px">' +
        '<button class="btn" style="flex:1;justify-content:center" onclick="_calcRegisterOnly()">✅ تسجيل الوجبة فقط</button>' +
        '<button class="btn primary" style="flex:1;justify-content:center" onclick="_calcRegisterAndSave()">💾 تسجيل + حفظ الوصفة</button>' +
      '</div>' +
      '</div>'
    : '';
  const _ingLabel = _calcMode==='auto' ? '🔍 اختر المكونات التي تريدها' : '🔍 اختر المكونات ثم حدد الكميات';
  const _ingCard  = '<div class="card" style="margin-bottom:14px">' +
    '<div style="font-size:13px;font-weight:600;margin-bottom:12px">' + _ingLabel + '</div>' +
    ingredientsHTML + carbHTML + actionHTML + '</div>';
  const _builtCard = builtHTML
    ? '<div class="card" style="margin-bottom:14px">' +
      guidanceMsg +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
        '<div style="font-size:13px;font-weight:600">📋 مكونات الوجبة</div>' +
        '<button class="btn sm dng" onclick="_calcClearAll()">مسح الكل</button>' +
      '</div>' + builtHTML + '</div>'
    : '';
  el.innerHTML = remHTML + modeHTML + _ingCard + _builtCard + nutritionHTML + saveHTML;

  // تهيئة الـ select القديم للتوافق
  if(typeof _populateCsel === 'function') _populateCsel();
}


/* ─── fallback: استخدم cat من FOODS للأصناف بدون unitType ─── */
function _calcGetUnitType(fid){
  if(typeof getUnitTypeForFid !== 'undefined'){
    const t = getUnitTypeForFid(fid);
    if(t) return t;
  }
  // fallback من الـ category
  const food = FOODS.find(function(f){ return f.id === fid; });
  if(!food) return null;
  if(food.cat === 'فواكه' || food.cat === 'فاكهة') return '_fruit';
  if(food.cat && food.cat.includes('خضار'))  return '_veg_generic';
  if(food.cat && food.cat.includes('مكسرات')) return '_nuts_generic';
  return null;
}

/* ─── بناء خيارات الوحدة للأصناف generic ─── */
function _getGenericSteps(unitType, food){
  if(unitType === '_fruit'){
    // الفاكهة: بالحبات إذا كانت qty_moderate صغيرة (توت)، وإلا بالغرام
    const modQty = food.qty_moderate || 20;
    if(modQty <= 30){
      // توت وما شابهه → بالحبة
      const gramsPerPiece = food.id===84?0.8:food.id===86?1.2:food.id===85?1.5:1; // توت أزرق≈0.8غ/حبة
      return [
        { key:'fruit_pieces', label:'العدد (حبة)', type:'number', min:1, max:100, step:1, default:Math.round(modQty/gramsPerPiece), unit:'حبة' },
        { key:'_fruit_gpp',   label:'', type:'hidden', default:gramsPerPiece }
      ];
    }
    // فاكهة كبيرة → بالغرام خطوة 5
    return [
      { key:'fruit_amount', label:'الكمية', type:'number', min:5, max:200, step:5, default:modQty, unit:'غ' }
    ];
  }
  if(unitType === '_veg_generic'){
    return [
      { key:'generic_qty', label:'الكمية (غ)', type:'number', min:10, max:300, step:10, default:80, unit:'غ' }
    ];
  }
  if(unitType === '_nuts_generic'){
    return [
      { key:'generic_qty', label:'الكمية (غ)', type:'number', min:5, max:100, step:5, default:25, unit:'غ' }
    ];
  }
  return null;
}

/* ─── الغرام من خطوات generic ─── */
function _calcGramsGeneric(unitType, sel, food){
  if(unitType === '_fruit'){
    if(sel.fruit_pieces !== undefined){
      const gpp = sel._fruit_gpp || (food.qty_moderate<=30 ? 0.8 : 1);
      return Math.round(sel.fruit_pieces * gpp);
    }
    return sel.fruit_amount || food.qty_moderate || 20;
  }
  if(unitType === '_veg_generic')  return sel.generic_qty || 80;
  if(unitType === '_nuts_generic') return sel.generic_qty || 25;
  return food.qty_moderate || 50;
}

function _calcGramsGeneric(unitType, sel, food){
  if(unitType === '_fruit')    return sel.fruit_amount  || food.qty_moderate || 20;
  if(unitType === '_veg_generic')   return sel.generic_qty || 80;
  if(unitType === '_nuts_generic')  return sel.generic_qty || 30;
  return food.qty_moderate || 50;
}


/* ─── كارب صافٍ ذكي = كارب - ألياف - محليات صفرية السعرات ─── */
const ZERO_CAL_SWEETENERS = [108, 109, 110, 111]; // ستيفيا، إريثريتول، مونك فروت وما شابه
function calcSmartNetCarb(items){
  // items = [{fid, qty}]
  return Math.round(items.reduce(function(total, item){
    if(typeof item.fid !== 'number') return total;
    const f = FOODS.find(function(x){ return x.id===item.fid; });
    if(!f) return total;
    const q = item.qty/100;
    let nc = f.net_carb * q;
    // المحليات الخالية من السعرات: كارب صافٍ = 0
    if(ZERO_CAL_SWEETENERS.includes(f.id)) nc = 0;
    return total + nc;
  }, 0) * 10) / 10;
}

function calcTotalFiber(items){
  return Math.round(items.filter(function(i){ return typeof i.fid==='number'; })
    .reduce(function(s,i){
      const f=FOODS.find(function(x){ return x.id===i.fid; });
      return s+(f?(f.fiber||0)*i.qty/100:0);
    },0)*10)/10;
}

function _renderCalcItems(){
  if(!calcItems.length) return '';
  // أولاً: أعد حساب qty من _sel لكل صنف لضمان التزامن
  calcItems.forEach(function(item){
    const isExt2   = typeof item.fid==='string' && item.fid.startsWith('ext:');
    const numFid2  = isExt2 ? null : parseInt(item.fid);
    const uType2   = isExt2 ? item.fid.replace('ext:','')
      : (typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(numFid2) : null);
    if(uType2 && item._sel){
      let recalc = 0;
      if(uType2.startsWith('_')){
        // generic type
        const food2 = FOODS.find(function(x){ return x.id === numFid2; });
        recalc = _calcGramsGeneric(uType2, item._sel, food2||{qty_moderate:50});
      } else if(typeof calcGramsFromSel!=='undefined'){
        recalc = calcGramsFromSel(uType2, item._sel, numFid2||item.fid);
      }
      if(recalc && recalc > 0) item.qty = recalc;
    }
  });
  return calcItems.map(function(item){
    const isExt    = typeof item.fid === 'string' && item.fid.startsWith('ext:');
    const numFid   = isExt ? null : parseInt(item.fid);
    const f        = isExt ? null : FOODS.find(function(x){ return x.id === numFid; });
    const unitType = (isExt ? item.fid.replace('ext:','') : _calcGetUnitType(numFid));
    const def      = unitType ? UNIT_INTELLIGENCE[unitType] : null;
    const sel      = item._sel || {};

    // ماكرو
    let m;
    if(isExt && unitType && typeof getExternalMacros!=='undefined'){
      m = getExternalMacros(unitType, sel, item.qty) || {fat:0,prot:0,nc:0,cal:0};
    } else if(f){
      m = _calcMealRatio([{fid:numFid, qty:item.qty}]);
    } else { m = {fat:0,prot:0,nc:0,cal:0}; }

    const name = isExt ? (def&&def.label||item.fid) : (f&&f.name||'—');
    const fidKey = String(item.fid).replace(':','_');

    // ── بناء الصف ──
    let html = '<div class="calc-item-block" id="calc-row-' + fidKey + '" style="' +
      'background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);' +
      'margin-bottom:8px;overflow:hidden">';

    // شريط العنوان
    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 12px;border-bottom:1px solid var(--border)">' +
      '<div style="font-size:13px;font-weight:600">' + name + '</div>' +
      '<div style="display:flex;align-items:center;gap:6px">' +
        '<span class="calc-macro-pill fat">' + m.fat + 'غ د</span>' +
        '<span class="calc-macro-pill prot">' + m.prot + 'غ ب</span>' +
        '<span class="calc-macro-pill carb">' + m.nc + 'غ ك</span>' +
        '<button class="btn sm dng" onclick="_calcRemItem(\'' + fidKey + '\')">✕</button>' +
      '</div>' +
    '</div>';

    // ── خيارات الوحدة inline ──
    // steps: من UNIT_INTELLIGENCE أو من generic
    const genericSteps = (!def || !def.steps) ? _getGenericSteps(unitType, f||{qty_moderate:50}) : null;
    const activeSteps  = (def && def.steps) ? def.steps : genericSteps;

    if(activeSteps && activeSteps.length){
      html += '<div style="padding:8px 12px;display:flex;flex-direction:column;gap:8px">';

      activeSteps.filter(function(step){ return step.type !== 'hidden'; }).forEach(function(step){
        // تحقق show_if
        if(step.show_if){
          if(sel[step.show_if.key] !== step.show_if.val) return;
        }
        html += '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
          '<div style="font-size:11px;color:var(--text3);font-weight:600;min-width:55px;text-align:right">' + step.label + ':</div>';

        if(step.type === 'number'){
          const val = sel[step.key] !== undefined ? sel[step.key] : (step.default||1);
          // خطوة ذكية حسب unitType والـ step.key
          let stepN = step.step || 1;
          if(unitType==='nuts' && step.key==='nut_amount')      stepN = 1;
          if(unitType==='whole_veg' && step.key==='veg_amount') stepN = 0.25;
          if(unitType==='leafy_veg' && step.key==='leaf_amount')stepN = 0.5;
          if(unitType==='_fruit' && step.key==='fruit_pieces')  stepN = 1;
          if(unitType==='_fruit' && step.key==='fruit_amount')  stepN = 5;
          if((unitType==='chicken'||unitType==='beef') && step.key.includes('count')) stepN = 1;
          if(unitType==='fish' && step.key==='fish_amount')     stepN = 0.5;
          html += '<div style="display:flex;align-items:center;gap:5px">' +
            '<button class="btn sm" onclick="_inlineStep(\'' + fidKey + '\',\'' + step.key + '\',' + (-stepN) + ',' + (step.min||0) + ',' + (step.max||99) + ',' + stepN + ')"  >−</button>' +
            '<input type="number" value="' + val + '" min="' + (step.min||0) + '" max="' + (step.max||99) + '" step="' + stepN + '"' +
            ' style="width:60px;text-align:center;font-family:var(--mono);padding:4px 6px;font-size:13px"' +
            ' onchange="_inlineSet(\'' + fidKey + '\',\'' + step.key + '\',parseFloat(this.value))">' +
            '<button class="btn sm" onclick="_inlineStep(\'' + fidKey + '\',\'' + step.key + '\',' + stepN + ',' + (step.min||0) + ',' + (step.max||99) + ',' + stepN + ')">+</button>' +
            (step.unit ? '<span style="font-size:11px;color:var(--text3)">' + step.unit + '</span>' : '') +
          '</div>';
        } else {
          step.options.forEach(function(opt){
            const isSel = (sel[step.key] === opt.val) ||
              (!sel[step.key] && opt === step.options[0]);
            const bg  = isSel ? 'var(--accent-light)' : 'var(--surface)';
            const bc  = isSel ? 'var(--accent)' : 'var(--border)';
            const fc  = isSel ? 'var(--accent)' : 'var(--text2)';
            const fw  = isSel ? '600' : '400';
            html += '<div onclick="_inlineOpt(\'' + fidKey + '\',\'' + step.key + '\',\'' + opt.val + '\')"' +
              ' style="padding:5px 10px;border-radius:100px;font-size:11px;cursor:pointer;' +
              'border:1px solid ' + bc + ';background:' + bg + ';color:' + fc + ';font-weight:' + fw + ';transition:all .15s">' +
              opt.label +
              (opt.note ? '<br><span style="font-size:10px;opacity:.6">' + opt.note + '</span>' : '') +
            '</div>';
          });
        }
        html += '</div>'; // end step row
      });

      // ملخص الغرام
      // item.qty محدَّث بالفعل من forEach أعلاه
      const grams = item.qty;
      let displayTxt;
      if(def && typeof getDisplayText!=='undefined'){
        displayTxt = getDisplayText(unitType, sel, grams, numFid||item.fid);
      } else if(unitType && unitType.startsWith('_')){
        // generic: عرض بسيط
        displayTxt = grams + 'غ';
      } else {
        displayTxt = grams + 'غ';
      }
      html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-top:1px solid var(--border);margin-top:4px">' +
        '<span style="font-size:11px;color:var(--text3)">' + displayTxt + '</span>' +
        '<div style="display:flex;gap:5px">' +
          '<button class="btn sm" onclick="_inlineQuickStep(\'' + fidKey + '\',-1)">−</button>' +
          '<span style="font-family:var(--mono);font-size:12px;font-weight:600;padding:4px 8px;background:var(--surface);border-radius:var(--radius-sm)">' + grams + 'غ</span>' +
          '<button class="btn sm" onclick="_inlineQuickStep(\'' + fidKey + '\',1)">+</button>' +
        '</div>' +
      '</div>';

      html += '</div>'; // end steps container
    } else {
      // صنف بدون wizard — عرض بسيط
      html += '<div style="padding:8px 12px;display:flex;align-items:center;justify-content:space-between">' +
        '<span style="font-size:11px;color:var(--text3)">' + item.qty + 'غ</span>' +
        '<div style="display:flex;gap:5px">' +
          '<button class="btn sm" onclick="_inlineQuickStep(\'' + fidKey + '\',-1)">−</button>' +
          '<button class="btn sm" onclick="_inlineQuickStep(\'' + fidKey + '\',1)">+</button>' +
        '</div>' +
      '</div>';
    }

    html += '</div>'; // end block
    return html;
  }).join('');
}

/* ─── دوال التعديل الـ inline ─── */
function _inlineOpt(fidKey, stepKey, val){
  const item = calcItems.find(function(i){ return String(i.fid).replace(':','_') === fidKey; });
  if(!item) return;
  if(!item._sel) item._sel = {};
  item._sel[stepKey] = val;
  // أعد حساب qty من الـ wizard
  const isExt   = String(item.fid).startsWith('ext:');
  const numFid  = isExt ? null : parseInt(item.fid);
  const unitType= isExt ? item.fid.replace('ext:','') : (typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(numFid) : null);
  if(unitType && typeof calcGramsFromSel!=='undefined'){
    item.qty = calcGramsFromSel(unitType, item._sel, numFid||item.fid) || item.qty;
  }
  // تحديث الـ fid إذا تغيّر (مثل الدجاج — صدر/فخذ)
  if(unitType && typeof getFidFromSel!=='undefined' && !isExt){
    const newFid = getFidFromSel(unitType, item._sel, numFid);
    if(newFid && newFid !== numFid) item.fid = newFid;
  }
  rCalc();
}

function _inlineStep(fidKey, stepKey, delta, min, max, stepSize){
  const item = calcItems.find(function(i){ return String(i.fid).replace(':','_') === fidKey; });
  if(!item) return;
  if(!item._sel) item._sel = {};
  const cur = parseFloat(item._sel[stepKey]);
  const curVal = isNaN(cur) ? (stepKey==='veg_amount'?1:stepKey==='egg_count'?2:1) : cur;
  const rawNew = curVal + delta;
  // تقريب لأقرب مضاعف للخطوة
  const snapped = Math.round(rawNew / (stepSize||1)) * (stepSize||1);
  item._sel[stepKey] = Math.max(min!==undefined?min:0.25, Math.min(max!==undefined?max:999, snapped));

  const isExt  = String(item.fid).startsWith('ext:');
  const numFid = isExt ? null : parseInt(item.fid);
  const uType  = isExt ? item.fid.replace('ext:','') : _calcGetUnitType(numFid);

  if(uType && uType.startsWith('_')){
    const food = numFid ? FOODS.find(function(f){ return f.id===numFid; }) : {};
    item.qty = _calcGramsGeneric(uType, item._sel, food||{}) || item.qty;
  } else if(uType && typeof calcGramsFromSel!=='undefined'){
    const newQty = calcGramsFromSel(uType, item._sel, numFid||item.fid);
    if(newQty>0) item.qty = newQty;
  }
  rCalc();
}

function _inlineSet(fidKey, stepKey, val){
  _inlineStep(fidKey, stepKey, 0, -Infinity, Infinity, 1);
  const item = calcItems.find(function(i){ return String(i.fid).replace(':','_') === fidKey; });
  if(item){ item._sel[stepKey] = val; _inlineOpt(fidKey, stepKey, val); }
}

function _inlineQuickStep(fidKey, dir){
  const item = calcItems.find(function(i){ return String(i.fid).replace(':','_') === fidKey; });
  if(!item) return;
  const isExt  = String(item.fid).startsWith('ext:');
  const numFid = isExt ? null : parseInt(item.fid);
  const food   = numFid ? FOODS.find(function(f){ return f.id===numFid; }) : null;
  const uType  = isExt ? item.fid.replace('ext:','') : _calcGetUnitType(numFid);

  // خطوة حسب النوع
  let step = 5;
  if(uType === 'egg')         step = 55;   // بيضة واحدة
  if(uType === 'oil')         step = 14;   // ملعقة كبيرة
  if(uType === 'butter')      step = 14;
  if(uType === 'avocado')     step = Math.round(150*0.65*0.25); // ربع حبة ≈24غ
  if(uType === 'nuts')        step = 2;    // 2 حبة تقريباً ≈5غ
  if(uType === 'leafy_veg')   step = 30;  // حفنة
  if(uType === 'whole_veg')   step = item.qty>=100 ? 25 : 10;
  if(uType === 'fish')        step = 50;
  if(uType === 'chicken' || uType === 'beef') step = 50;
  if(uType === 'cheese')      step = 20;
  if(uType === '_fruit')      step = food && food.qty_moderate<=30 ? 5 : 10;
  if(uType === '_veg_generic')step = 10;
  if(uType === '_nuts_generic')step = 5;
  if(!uType && food) step = item.qty>=100?10:5;

  const newQty = Math.max(step, Math.round((item.qty + dir*step)/step)*step);
  item.qty = newQty;

  // حدّث _sel ليعكس الكمية الجديدة
  if(uType && !uType.startsWith('_') && typeof _buildSelForQty!=='undefined'){
    item._sel = _buildSelForQty(uType, numFid, newQty, food||{});
  } else if(uType === '_fruit'){
    const gpp = (item._sel&&item._sel._fruit_gpp) || 0.8;
    item._sel = {fruit_pieces: Math.round(newQty/gpp), _fruit_gpp: gpp};
  } else if(uType){
    item._sel = {generic_qty: newQty};
  }
  rCalc();
}


/* ─── فتح wizard الوحدة ─── */
let _activeWizardFid = null;
let _wizardSel = {};

function _openUnitWizard(fid){
  const item = calcItems.find(i=>String(i.fid)===String(fid));
  if(!item) return;
  _activeWizardFid = fid;
  _wizardSel = {...(item._sel||{})};

  const isExt = String(fid).startsWith('ext:');
  const unitType = isExt ? fid.replace('ext:','') : getUnitTypeForFid(parseInt(fid)||fid);
  if(!unitType) return;
  const def = UNIT_INTELLIGENCE[unitType];
  if(!def) return;

  // أغلق أي wizard مفتوح
  document.querySelectorAll('.inline-wizard').forEach(function(el){ el.remove(); });

  // اعثر على صف الصنف وأضف الـ wizard تحته مباشرة
  const rowId = 'calc-row-' + String(fid).replace(':','_');
  const row   = document.getElementById(rowId);
  if(!row) { rCalc(); return; } // fallback

  const wiz = document.createElement('div');
  wiz.className = 'inline-wizard';
  wiz.style.cssText = 'background:var(--surface2);border:1px solid var(--accent);border-radius:0 0 var(--radius-sm) var(--radius-sm);padding:12px 14px;margin-top:-1px;margin-bottom:7px';
  // بناء المحتوى بدون innerHTML لتجنب quotes issues
  const wizHeader = document.createElement('div');
  wizHeader.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px';
  wizHeader.innerHTML = '<div style="font-size:12px;font-weight:600;color:var(--accent)">⚖️ تعديل الكمية — ' + def.label + '</div>';
  const closeBtn1 = document.createElement('button');
  closeBtn1.className = 'btn sm'; closeBtn1.textContent = '✕';
  closeBtn1.onclick = function(){ wiz.remove(); };
  wizHeader.appendChild(closeBtn1);
  wiz.appendChild(wizHeader);

  if(def.warning){
    const wb = document.createElement('div');
    wb.className = 'unit-warning-badge'; wb.textContent = def.warning;
    wiz.appendChild(wb);
  }

  const stepsDiv = document.createElement('div');
  stepsDiv.innerHTML = _buildWizardHTML(def, unitType, parseInt(fid)||fid);
  wiz.appendChild(stepsDiv);

  const actionDiv = document.createElement('div');
  actionDiv.style.cssText = 'display:flex;gap:8px;margin-top:10px';
  const applyBtn = document.createElement('button');
  applyBtn.className = 'btn primary sm'; applyBtn.style.cssText = 'flex:1;justify-content:center';
  applyBtn.textContent = '✓ تطبيق'; applyBtn.onclick = function(){ _applyWizard(); };
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn sm'; cancelBtn.textContent = 'إلغاء';
  cancelBtn.onclick = function(){ wiz.remove(); };
  actionDiv.appendChild(applyBtn); actionDiv.appendChild(cancelBtn);
  wiz.appendChild(actionDiv);

  row.insertAdjacentElement('afterend', wiz);
}

function _buildWizardHTML(def, unitType, fid){
  let html = '';
  def.steps.forEach(function(step){
    // تحقق show_if
    if(step.show_if){
      if(_wizardSel[step.show_if.key] !== step.show_if.val) return;
    }
    html += '<div class="unit-step">' +
      '<div class="unit-step-label">' + step.label + '</div>';

    if(step.type === 'number'){
      const val = _wizardSel[step.key] || step.default || 1;
      html += '<div style="display:flex;align-items:center;gap:8px">' +
        '<button class="btn sm" onclick="_wizardStep(\'' + step.key + '\',' + (-(step.step||1)) + ',' + (step.min||0) + ',' + (step.max||99) + ')">−</button>' +
        '<input type="number" id="wz-' + step.key + '" value="' + val + '" min="' + (step.min||0) + '" max="' + (step.max||99) + '" step="' + (step.step||1) + '"' +
        ' style="width:80px;text-align:center;font-family:var(--mono)"' +
        ' onchange="_wizardSel[\'' + step.key + '\']=parseFloat(this.value);_refreshWizardSummary(\''+unitType+'\','+fid+')">' +
        '<button class="btn sm" onclick="_wizardStep(\'' + step.key + '\',' + (step.step||1) + ',' + (step.min||0) + ',' + (step.max||99) + ')">+</button>' +
        (step.unit ? '<span style="font-size:12px;color:var(--text3)">' + step.unit + '</span>' : '') +
      '</div>';
    } else {
      html += '<div class="unit-options">';
      step.options.forEach(function(opt){
        const isSel = (_wizardSel[step.key] || step.options[0]?.val) === opt.val;
        html += '<div class="unit-opt' + (isSel?' selected':'') + (opt.keto?' keto':'') + (opt.warning?' warning':'') + '"' +
          ' onclick="_wizardSelect(\'' + step.key + '\',\'' + opt.val + '\',\'' + unitType + '\',' + fid + ')">' +
          opt.label +
          (opt.note ? '<br><span style="font-size:10px;opacity:.7">' + opt.note + '</span>' : '') +
        '</div>';
      });
      html += '</div>';
    }
    html += '</div>';
  });

  // ملخص الغرام
  const grams = calcGramsFromSel(unitType, _wizardSel, fid);
  html += '<div class="unit-summary" id="wz-summary">' +
    '<span class="unit-summary-text">' + getDisplayText(unitType, _wizardSel, grams, fid) + '</span>' +
    '<span class="unit-summary-grams">' + grams + 'غ</span>' +
  '</div>';

  return html;
}

function _wizardSelect(key, val, unitType, fid){
  _wizardSel[key] = val;
  // أعد بناء الـ wizard
  const overlay = document.getElementById('unit-wizard-overlay');
  if(!overlay) return;
  const def = UNIT_INTELLIGENCE[unitType];
  if(!def) return;
  const inner = overlay.querySelector('[style*="background:var(--surface)"]');
  if(!inner) return;
  // أعد رسم الخطوات فقط
  const stepsEl = inner.querySelector('.wz-steps-wrap');
  if(stepsEl) stepsEl.innerHTML = _buildWizardHTML(def, unitType, fid);
  else _openUnitWizard(String(fid)); // fallback
}

function _wizardStep(key, delta, min, max){
  const cur = parseFloat(_wizardSel[key]) || 1;
  const el  = document.getElementById('wz-' + key);
  _wizardSel[key] = Math.max(min, Math.min(max, parseFloat((cur+delta).toFixed(2))));
  if(el) el.value = _wizardSel[key];
  _refreshWizardSummary();
}

function _refreshWizardSummary(unitType, fid){
  const sum = document.getElementById('wz-summary');
  if(!sum || !unitType) return;
  const grams = calcGramsFromSel(unitType, _wizardSel, fid);
  sum.innerHTML = '<span class="unit-summary-text">' + getDisplayText(unitType, _wizardSel, grams, fid) + '</span>' +
    '<span class="unit-summary-grams">' + grams + 'غ</span>';
}

function _applyWizard(){
  const fid  = _activeWizardFid;
  const isExt = String(fid).startsWith('ext:');
  const unitType = isExt ? String(fid).replace('ext:','') : getUnitTypeForFid(parseInt(fid)||fid);
  const newFid  = unitType ? getFidFromSel(unitType, _wizardSel, parseInt(fid)||fid) : parseInt(fid);
  const grams   = unitType ? calcGramsFromSel(unitType, _wizardSel, newFid) : 100;

  const item = calcItems.find(i=>String(i.fid)===String(fid));
  if(item){
    item.fid  = isExt ? fid : newFid;
    item.qty  = grams;
    item._sel = {..._wizardSel};
  }
  _closeWizard();
  rCalc();
}

function _closeWizard(){
  const el = document.getElementById('unit-wizard-overlay');
  if(el) el.remove();
}

/* ─── تعديل السهم +/- في قائمة المكونات ─── */
function _calcStepItem(fidStr, dir){
  const item = calcItems.find(i=>String(i.fid)===String(fidStr));
  if(!item) return;
  const step = item.qty >= 100 ? 10 : item.qty >= 20 ? 5 : 1;
  item.qty = Math.max(1, item.qty + dir * step);
  rCalc();
}

/* ─── بحث المكونات ─── */
function _calcSearchFood(query){
  const res = document.getElementById('calc-search-results');
  if(!res) return;
  if(!query || query.length < 2){ res.style.display='none'; return; }
  const q = query.toLowerCase();
  const mem2 = MEMBERS.find(m=>m.uid===CU?.id);
  const favIds2 = mem2?.favorites_foods || [];
  const matches = FOODS.filter(f =>
    f.name.includes(query) || (f.name_en||'').toLowerCase().includes(q)
  ).slice(0,8);
  if(!matches.length){ res.style.display='none'; return; }
  res.style.display='block';
  res.innerHTML = matches.map(function(f){
    const isFav = favIds2.includes(f.id);
    const div = document.createElement('div');
    div.style.cssText = 'padding:9px 12px;cursor:pointer;border-bottom:1px solid var(--border);font-size:13px;display:flex;justify-content:space-between;align-items:center';
    div.innerHTML = '<span>' + f.name + (isFav?' ⭐':'') + '</span><span style="font-size:11px;color:var(--text3)">' + f.cat + '</span>';
    div.onclick = function(){
      _toggleCalcFood(f.id);
      document.getElementById('calc-search').value = '';
      document.getElementById('calc-search-results').style.display = 'none';
    };
    div.onmouseover = function(){ this.style.background = 'var(--surface2)'; };
    div.onmouseout  = function(){ this.style.background = ''; };
    return div.outerHTML;
  }).join('');
}

function _renderCalcNutrition(){
  // ── سياق الوجبة ──
  const _rnMem      = MEMBERS.find(function(mb){ return mb.uid===(CU&&CU.id); });
  const _rnMti      = _rnMem && typeof getMealType!=='undefined' ? getMealType(_rnMem) : null;
  const mealType    = _rnMti ? _rnMti.type : 'other';
  const dayTargets  = _rnMem && typeof getTargetForDate!=='undefined'
    ? getTargetForDate(_rnMem) : {fat:130,protein:90,carb:20,cal:1800};

  // ── ماكرو كامل ──
  const regularItems = calcItems.filter(function(i){ return typeof i.fid==='number'; });
  const m0 = _calcMealRatio(regularItems);
  let extFat=0,extProt=0,extNc=0,extCal=0;
  calcItems.filter(function(i){ return typeof i.fid==='string'; }).forEach(function(item){
    const uType = item.fid.replace('ext:','');
    const extM = typeof getExternalMacros!=='undefined' ? getExternalMacros(uType,item._sel||{},item.qty) : null;
    if(extM){ extFat+=extM.fat||0; extProt+=extM.prot||0; extNc+=extM.nc||0; extCal+=extM.cal||0; }
  });
  const m = {
    fat:   Math.round((m0.fat  +extFat)*10)/10,
    prot:  Math.round((m0.prot +extProt)*10)/10,
    nc:    Math.round((m0.nc   +extNc)*10)/10,
    cal:   Math.round(m0.cal   +extCal),
    fiber: Math.round((m0.fiber||0)*10)/10,
  };
  // كارب صافٍ ذكي (يُحذف كارب المحليات الصفرية)
  const smartNc = typeof calcSmartNetCarb!=='undefined'
    ? calcSmartNetCarb(calcItems.filter(function(i){ return typeof i.fid==='number'; }))
    : m.nc;
  m.nc = smartNc; // استخدم الكارب الذكي
  const _d = m.prot*0.6+m.nc;
  m.ratio = _d>0 ? Math.round(m.fat/_d*100)/100 : 0;

  // ── سياق: أهداف الوجبة ──
  const mem       = MEMBERS.find(function(mb){ return mb.uid===(CU&&CU.id); });
  const prefs     = mem && typeof getMemPrefs!=='undefined' ? getMemPrefs(mem) : {};
  const phase     = mem ? (mem.phase||1) : 1;
  const mealsN    = prefs.meals_per_day||3;
  const KETO_BY_PHASE = {0:1.2,1:1.6,2:1.8,3:2.0,4:2.0,5:1.8,6:1.6,7:1.6};
  const ketoMin   = KETO_BY_PHASE[phase]||1.6;
  const dayTgt    = mem && typeof getTargetForDate!=='undefined' ? getTargetForDate(mem) : {fat:130,protein:110,carb:25,cal:1800};
  const SHARES    = {3:[0.30,0.35,0.35],2:[0.45,0.55]};
  const shares    = SHARES[mealsN]||[0.33,0.33,0.34];
  const mti       = mem && typeof getMealType!=='undefined' ? getMealType(mem) : null;
  const mIdx      = {breakfast:0,lunch:1,dinner:2}[(mti&&mti.type)||'']||0;
  const share     = shares[mIdx]||0.33;
  const carbLim   = _calcCarbLimit===999 ? Math.round((dayTgt.carb||25)*share) : _calcCarbLimit;
  const calTarget = Math.round((dayTgt.cal||1800)*share);
  const calMax    = Math.round(calTarget*1.20);

  // ── ألوان وتصنيفات ──
  const ratioOk   = m.ratio >= ketoMin;
  const ratioColor= m.ratio>=2.0?'var(--accent)':m.ratio>=ketoMin?'#f59e0b':'var(--danger)';
  const ratioLabel= m.ratio>=2.0?'ممتاز 🔥':m.ratio>=ketoMin?'محفز ✓':'يحتاج تحسين';
  const ketoP     = Math.min(Math.round(m.ratio/3*100),100);

  // ── بناء توصيات متكاملة ──
  const tips = [];
  const mon  = typeof getFatType!=='undefined';

  // ── حساب توزيع الدهون ──
  let monoG=0, satG=0, pufaG=0;
  calcItems.forEach(function(i){
    if(typeof i.fid!=='number') return;
    const f2=FOODS.find(function(x){ return x.id===i.fid; });
    if(!f2||!f2.fat) return;
    const q=i.qty/100; const ft=getFatType(i.fid);
    if(ft==='mono') monoG+=f2.fat*q;
    else if(ft==='sat') satG+=(f2.sat_fat||0)*q;
    else if(ft==='pufa') pufaG+=f2.fat*q;
    else monoG+=f2.fat*q*0.5; // mixed → نصفها mono تقديراً
  });
  monoG=Math.round(monoG*10)/10; satG=Math.round(satG*10)/10; pufaG=Math.round(pufaG*10)/10;

  // 0. الألياف — توصية ذكية مع اقتراح محدد
  const mealFiber = m.fiber || 0;
  const fiberSugg = window._calcFiberSuggestion || null;
  if(mealFiber < 3 && calcItems.length > 0){
    let fiberDetail;
    if(fiberSugg){
      fiberDetail =
        'الوجبة تحتوي <strong>' + mealFiber + 'غ</strong> ألياف — يُفضل ≥3غ/وجبة.<br>' +
        '<strong>اقتراح:</strong> أضف <strong>' + fiberSugg.name + ' ' + fiberSugg.qty + 'غ</strong>' +
        ' ← ستُضيف ' + fiberSugg.fiber + 'غ ألياف' +
        ' + ' + fiberSugg.fat + 'غ دهون' +
        ' + ' + fiberSugg.cal + ' سعرة' +
        (fiberSugg.fav ? ' ⭐ من مفضلتك' : '');
    } else {
      fiberDetail =
        'الوجبة تحتوي <strong>' + mealFiber + 'غ</strong> ألياف — أضف أفوكادو أو بروكلي أو سبانخ';
    }
    tips.push({
      type:'info',
      icon:'🌿',
      text:'ألياف منخفضة',
      detail:fiberDetail,
      action: fiberSugg ? {
        label:'➕ أضف ' + fiberSugg.name,
        onclick:'_addFiberBooster(' + fiberSugg.fid + ',' + fiberSugg.qty + ')',
      } : null
    });
  } else if(mealFiber >= 3){
    // ألياف كافية — امسح الاقتراح
    window._calcFiberSuggestion = null;
  }

  // 0.5 توزيع الدهون
  // الدهون المشبعة — رسالة استشارية لا قيد صارم
  if(satG > MEAL_LIMITS.sat_fat_max_g * 1.1){
    tips.push({type:'info',icon:'🧈',text:'ملاحظة: دهون مشبعة مرتفعة',
      detail:'الدهون المشبعة <strong>'+satG+'غ</strong> — يُنصح بالتأكد من مناسبتها لحالتك الصحية. ' +
             'أصحاب الصحة الجيدة يتحملونها عادةً ضمن الكيتو، لكن المصابين بأمراض قلبية يُفضّل استشارة طبيبهم'
    });
  }
  if(monoG < MEAL_LIMITS.mono_fat_min_g && (m.fat||0)>5){
    tips.push({type:'info',icon:'🫒',text:'الدهون الأحادية منخفضة',
      detail:'الدهون الأحادية <strong>'+monoG+'غ</strong> — يُفضل ≥'+MEAL_LIMITS.mono_fat_min_g+'غ/وجبة. أضف زيت زيتون أو أفوكادو'
    });
  }
  if(pufaG > MEAL_LIMITS.pufa_fat_max_g){
    tips.push({type:'warning',icon:'🐟',text:'دهون متعددة كثيرة',
      detail:'الدهون المتعددة <strong>'+pufaG+'غ</strong> — الحد ≤'+MEAL_LIMITS.pufa_fat_max_g+'غ/وجبة'
    });
  }

  // 0.6 البروتين
  const totalProt = m.prot||0;
  const isMainMeal = mealType!=='snack';
  // البروتين — الحد الأدنى من dayProtG
  const dayProtG2   = (dayTargets&&dayTargets.protein)||90;
  const dynProtMin2 = dayProtG2<70?20:dayProtG2<90?25:30;
  if(isMainMeal && totalProt < dynProtMin2){
    tips.push({type:'warning',icon:'💪',text:'بروتين دون الهدف',
      detail:'البروتين <strong>'+totalProt+'غ</strong> — الحد الأدنى لهذه الوجبة '+dynProtMin2+'غ (حسب هدفك اليومي '+dayProtG2+'غ)'
    });
  }

  // 0.7 الكارب: تحقق من المسموحات
  const STARCHY_VEG = [90,91,92,93,94,95]; // fids خضار نشوية مثل البطاطس
  const hasStarchy = calcItems.some(function(i){ return STARCHY_VEG.includes(i.fid); });
  if(hasStarchy){
    tips.push({type:'warning',icon:'🌽',text:'خضار نشوية',
      detail:'الخضار النشوية ترفع الكارب — الحد منها للحفاظ على الحالة الكيتونية'
    });
  }
  if(m.nc < MEAL_LIMITS.carb_min_g && isMainMeal){
    tips.push({type:'info',icon:'🥦',text:'الكارب منخفض جداً',
      detail:'الكارب الصافٍ <strong>'+m.nc+'غ</strong> — يُفضل ≥'+MEAL_LIMITS.carb_min_g+'غ/وجبة من الخضار والألياف'
    });
  }

  // 0.8 المكسرات والبذور
  const hasNuts  = calcItems.some(function(i){
    const f2=FOODS.find(function(x){return x.id===i.fid;});
    return f2&&f2.cat&&f2.cat.includes('مكسرات');
  });
  const hasSeeds = calcItems.some(function(i){
    const f2=FOODS.find(function(x){return x.id===i.fid;});
    return f2&&f2.cat&&f2.cat.includes('بذور');
  });
  if(!hasNuts){
    tips.push({type:'info',icon:'🌰',text:'أضف مكسرات',
      detail:'المكسرات مصدر ممتاز للدهون الصحية والألياف — أضفها للوجبة أو كسناك بين الوجبات'
    });
  }
  if(!hasSeeds){
    tips.push({type:'info',icon:'🌱',text:'أضف بذوراً',
      detail:'بذور الشيا أو الكتان أو دوار الشمس تُضاف للسلطة أو السناك لرفع الألياف وأوميغا-3'
    });
  }

  // 0.9 الفاكهة
  const hasHighCarbFruit = calcItems.some(function(i){
    const f2=FOODS.find(function(x){return x.id===i.fid;});
    return f2&&f2.cat&&f2.cat.includes('فواكه')&&(f2.net_carb||0)>8;
  });
  if(hasHighCarbFruit){
    tips.push({type:'warning',icon:'🍓',text:'فاكهة عالية الكارب',
      detail:'فضّل التوت أو الفراولة — أقل كارباً وأعلى ألياف'
    });
  }

  // 1. نسبة كيتونية
  if(!ratioOk){
    // ما هو المصدر الرئيسي للمشكلة؟
    const highCarbItems = calcItems.filter(function(i){
      if(typeof i.fid!=='number') return false;
      const f=FOODS.find(function(x){ return x.id===i.fid; });
      return f && f.net_carb>3 && f.net_carb*i.qty/100 > 2;
    }).sort(function(a,b){
      const fa=FOODS.find(function(x){ return x.id===a.fid; });
      const fb=FOODS.find(function(x){ return x.id===b.fid; });
      return (fb.net_carb*b.qty)-(fa.net_carb*a.qty);
    });
    const lowFatItems = calcItems.filter(function(i){
      if(typeof i.fid!=='number') return false;
      const f=FOODS.find(function(x){ return x.id===i.fid; });
      return f && f.fat>30;
    });

    const fatNeeded = Math.max(ketoMin*_d - m.fat, 0).toFixed(1);
    if(highCarbItems.length>0){
      const topCarb = FOODS.find(function(x){ return x.id===highCarbItems[0].fid; });
      tips.push({
        type:'warning',
        icon:'🥗',
        text:'قلّل الكارب',
        detail:'تقليل كمية <strong>' + (topCarb&&topCarb.name||'') + '</strong> بمقدار النصف سيرفع النسبة الكيتونية'
      });
    }
    if(lowFatItems.length>0){
      tips.push({
        type:'warning',
        icon:'🧈',
        text:'أضف دهناً',
        detail:'إضافة <strong>' + fatNeeded + 'غ</strong> دهن إضافي (≈ملعقة زيت زيتون) ترفع النسبة فوق ' + ketoMin
      });
    } else {
      tips.push({
        type:'warning',
        icon:'🧈',
        text:'أضف مصدر دهن',
        detail:'لا يوجد دهن كافٍ — أضف زيت زيتون أو زبدة أو أفوكادو للوجبة'
      });
    }
  }

  // 2. السعرات
  if(m.cal > calMax){
    const excess = m.cal - calTarget;
    tips.push({
      type:'info',
      icon:'📊',
      text:'سعرات أعلى من المقترح',
      detail:'هذه الوجبة تحتوي <strong>' + m.cal + '</strong> سعرة (المقترح ' + calTarget + '). انتبه لوجباتك التالية لتبقى ضمن ' + (dayTgt.cal||1800) + ' سعرة يومياً'
    });
  }

  // 3. الكارب
  if(m.nc > carbLim){
    tips.push({
      type:'warning',
      icon:'🌾',
      text:'الكارب فوق الهدف',
      detail:'الكارب الحالي <strong>' + m.nc + 'غ</strong> — الهدف المختار ' + carbLim + 'غ. قلّل كميات الخضار أو الفاكهة'
    });
  }

  // 4. إيجابية — نسبة ممتازة
  // قهوة كيتونية
  const hasBullet = calcItems.some(function(i){
    return [3,4,5,7,8,9].includes(i.fid);
  });
  if(!hasBullet && mealType==='breakfast'){
    tips.push({type:'info',icon:'☕',text:'قهوة كيتونية اختيارية',
      detail:'يمكن إضافة قهوة بزبدة أو زيت جوز هند أو MCT oil لرفع الدهن والطاقة. يمكن إضافة كولاجين'
    });
  }

  // نجاح
  const allOk2 = ratioOk && m.cal<=calMax && m.nc<=carbLim;
  if(allOk2){
    tips.push({type:'success',icon:'✅',
      text:'وجبة متوازنة ✓',
      detail:'النسبة الكيتونية والكارب والسعرات ضمن الهدف — أحسنت!'
    });
  }

  // ── بناء HTML التوصيات ──
  const tipsHTML = tips.length ? tips.map(function(tip){
    const bg  = tip.type==='success'?'rgba(58,140,63,.08)':tip.type==='warning'?'rgba(239,83,80,.08)':'rgba(41,182,246,.08)';
    const bc  = tip.type==='success'?'rgba(58,140,63,.3)':tip.type==='warning'?'rgba(239,83,80,.3)':'rgba(41,182,246,.3)';
    const btnHTML = tip.action
      ? '<button class="btn sm" style="margin-top:6px;font-size:11px" onclick="'+tip.action.onclick+'">'+tip.action.label+'</button>'
      : '';
    return '<div style="padding:9px 11px;background:'+bg+';border:1px solid '+bc+';border-radius:var(--radius-sm);margin-bottom:6px">' +
      '<div style="display:flex;gap:8px">' +
        '<span style="font-size:16px;flex-shrink:0">'+tip.icon+'</span>' +
        '<div style="flex:1">' +
          '<div style="font-size:12px;font-weight:600;margin-bottom:2px">'+tip.text+'</div>' +
          '<div style="font-size:11px;color:var(--text2);line-height:1.6">'+tip.detail+'</div>' +
          btnHTML +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('') : '';

  return '<div class="calc-nutrition-card">' +
    // النسبة الكيتونية
    '<div style="text-align:center;margin-bottom:12px">' +
      '<div style="font-size:11px;color:var(--text3);margin-bottom:4px">النسبة الكيتونية للوجبة (الهدف ≥'+ketoMin+')</div>' +
      '<div class="calc-keto-ratio" style="color:'+ratioColor+'">'+m.ratio+'</div>' +
      '<div style="font-size:12px;color:'+ratioColor+';font-weight:600">'+ratioLabel+'</div>' +
      '<div style="height:6px;background:var(--surface2);border-radius:6px;margin:8px 0;overflow:hidden">' +
        '<div style="height:100%;width:'+ketoP+'%;background:'+ratioColor+';border-radius:6px;transition:width .6s"></div>' +
      '</div>' +
    '</div>' +
    // الماكرو
    '<div class="calc-macro-grid">' +
      '<div class="calc-macro-box"><div class="calc-macro-box-val" style="color:var(--accent)">'+m.fat+'غ</div><div class="calc-macro-box-lbl">دهون</div></div>' +
      '<div class="calc-macro-box"><div class="calc-macro-box-val" style="color:var(--info)">'+m.prot+'غ</div><div class="calc-macro-box-lbl">بروتين</div></div>' +
      '<div class="calc-macro-box"><div class="calc-macro-box-val" style="color:'+(m.nc>carbLim?'var(--danger)':'var(--text)')+'">'+m.nc+'غ</div><div class="calc-macro-box-lbl">كارب</div></div>' +
      '<div class="calc-macro-box"><div class="calc-macro-box-val" style="color:'+(m.cal>calMax?'var(--danger)':'var(--text)')+'">'+m.cal+'</div><div class="calc-macro-box-lbl">سعرة</div></div>' +
    '</div>' +
    // تفاصيل إضافية
    '<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);padding:8px 0;border-top:1px solid var(--border);margin:8px 0">' +
      '<span>مشبعة: <strong>'+_calcSatFatTotal()+'غ</strong></span>' +
      '<span>ألياف: <strong>'+_calcFiberTotal()+'غ</strong></span>' +
      '<span>صوديوم: <strong>'+_calcSodiumTotal()+'ملغ</strong></span>' +
    '</div>' +
    // التوصيات
    (tipsHTML ? '<div style="margin-top:4px">'+tipsHTML+'</div>' : '') +
  '</div>';
}


function _calcSatFatTotal(){
  return Math.round(calcItems.reduce(function(s,i){
    if(typeof i.fid==='string') return s; // external — no sat_fat data
    const f=FOODS.find(x=>x.id===i.fid); return s+(f?(f.sat_fat||0)*i.qty/100:0);
  },0)*10)/10;
}
function _calcFiberTotal(){
  return Math.round(calcItems.reduce(function(s,i){
    if(typeof i.fid==='string'){ const em=getExternalMacros&&getExternalMacros(i.fid.replace('ext:',''),i._sel||{},i.qty); return s+(em?em.fiber||0:0); }
    const f=FOODS.find(x=>x.id===i.fid); return s+(f?(f.fiber||0)*i.qty/100:0);
  },0)*10)/10;
}
function _calcSodiumTotal(){
  return Math.round(calcItems.reduce(function(s,i){
    if(typeof i.fid==='string') return s;
    const f=FOODS.find(x=>x.id===i.fid); return s+(f?(f.sodium||0)*i.qty/100:0);
  },0));
}

/* ─── أحداث الحاسبة ─── */
function _setCalcMode(mode){ _calcMode = mode; _calcBuilt = false; rCalc(); }
function _setCalcCarb(v){ _calcCarbLimit = v; rCalc(); }
function _setCalcUnit(u){ _calcUnit = u; rCalc(); }

function _toggleCalcFood(fid){
  // fid رقمي دائماً هنا
  const numFid = parseInt(fid);
  const idx = _calcSelected.indexOf(numFid);
  if(idx > -1) _calcSelected.splice(idx,1);
  else         _calcSelected.push(numFid);
  // في الوضع اليدوي بعد البناء فقط: تعديل calcItems مباشرة
  if(_calcMode === 'manual' && _calcBuilt){
    const ex = calcItems.find(function(i){ return i.fid===numFid; });
    if(ex){
      calcItems = calcItems.filter(function(i){ return i.fid!==numFid; });
    } else {
      const unitType = _calcGetUnitType(numFid);
      const defSel   = unitType ? _getDefaultSel(unitType, numFid) : {};
      let qty = 100;
      if(unitType && !unitType.startsWith('_') && typeof calcGramsFromSel!=='undefined'){
        qty = calcGramsFromSel(unitType, defSel, numFid) || 100;
      } else if(unitType && unitType.startsWith('_')){
        const food2 = FOODS.find(function(f){ return f.id===numFid; });
        qty = _calcGramsGeneric(unitType, defSel, food2||{}) || 50;
      }
      calcItems.push({fid:numFid, qty:Math.max(qty,5), _sel:defSel});
    }
  }
  rCalc();
}

function _calcExtClick(el){ _toggleCalcExtFood(el.getAttribute('data-type')); }
function _toggleCalcExtFood(type){
  const extId = 'ext:' + type;
  const idx = _calcSelected.indexOf(extId);
  if(idx > -1) _calcSelected.splice(idx,1);
  else         _calcSelected.push(extId);
  if(_calcMode === 'manual'){
    const ex = calcItems.find(i=>i.fid===extId);
    if(ex) calcItems = calcItems.filter(i=>i.fid!==extId);
    else   calcItems.push({fid:extId, qty:50, _sel:{}});
  }
  rCalc();
}

function _getDefaultSel(unitType, fid){
  const def = typeof UNIT_INTELLIGENCE!=='undefined' ? UNIT_INTELLIGENCE[unitType] : null;
  if(!def) return {};
  const sel = {};
  def.steps.forEach(function(step){
    if(step.options && step.options.length){
      // اختر خيار بـ default:true إن وجد، وإلا الأول
      const defOpt = step.options.find(function(o){ return o.default; });
      sel[step.key] = defOpt ? defOpt.val : step.options[0].val;
    } else if(step.type==='number'){
      sel[step.key] = step.default || 1;
    }
  });
  // قيم افتراضية ذكية حسب النوع
  if(unitType === 'egg'){
    sel.egg_size  = sel.egg_size  || 'medium';
    sel.egg_count = sel.egg_count || 2;
    sel.egg_type  = sel.egg_type  || 'regular';
  }
  if(unitType === 'oil'){
    sel.oil_unit   = 'tbsp';
    sel.oil_amount = 1;
  }
  if(unitType === 'butter'){
    sel.butter_unit   = 'tbsp';
    sel.butter_amount = 1;
  }
  if(unitType === 'leafy_veg'){
    sel.leaf_unit   = 'handful';  // حفنة = 30غ
    sel.leaf_amount = 1;
  }
  if(unitType === 'whole_veg'){
    sel.veg_unit   = 'piece';
    sel.veg_size   = 'medium';
    sel.veg_amount = 1;
  }
  if(unitType === 'avocado'){
    sel.avo_size    = 'medium';
    sel.avo_portion = 'half';
  }
  if(unitType === 'nuts'){
    sel.nut_unit   = 'handful';
    sel.nut_amount = 1;
  }
  if(unitType === 'cheese'){
    sel.cheese_unit   = 'slice';
    sel.cheese_amount = 2;
  }
  return sel;
}

function _calcStepQty(fid, delta){
  const item = calcItems.find(i=>i.fid===fid);
  if(!item) return;
  const food = FOODS.find(f=>f.id===fid);
  const step = (_calcUnit==='gram') ? 5 : 0.5;
  const displayNow = _unitQty(food, item.qty, _calcUnit).display || item.qty/14;
  const newDisplay = Math.max(step, (parseFloat(displayNow)||0) + delta*step);
  item.qty = Math.round(_unitToGram(food, newDisplay, _calcUnit));
  rCalc();
}

function _calcSetQty(fid, val){
  const item = calcItems.find(i=>i.fid===fid);
  if(!item) return;
  const food = FOODS.find(f=>f.id===fid);
  item.qty = Math.max(5, Math.round(_unitToGram(food, parseFloat(val)||1, _calcUnit)));
  rCalc();
}

function _calcRemItem(fidKey){
  // fidKey = String(item.fid).replace(':','_')
  calcItems = calcItems.filter(function(i){
    return String(i.fid).replace(':','_') !== fidKey;
  });
  _calcSelected = _calcSelected.filter(function(id){
    return String(id).replace(':','_') !== fidKey;
  });
  rCalc();
}

function _calcClearAll(){
  calcItems = []; _calcSelected = []; _calcBuilt = false;
  rCalc();
}

/* ─── بناء الوجبة التلقائي ─── */
/* ─── دوال التقريب ─── */
function _snapToFriendlyProt(rawG, food){
  const uType = _calcGetUnitType(food.id);
  if(uType === 'egg'){
    return Math.max(1, Math.round(rawG/55)) * 55;
  }
  if(uType === 'chicken' || uType === 'beef'){
    const lower = Math.max(50, Math.floor(rawG/50)*50);
    const upper = lower + 50;
    // اختر الأقرب للهدف مع تفضيل الأعلى إذا قريب
    return Math.min((upper-rawG) < (rawG-lower)*0.8 ? upper : lower, 300);
  }
  if(uType === 'fish'){
    const lower = Math.max(50, Math.floor(rawG/50)*50);
    const upper = lower + 50;
    return Math.min((upper-rawG)<30 ? upper : lower, 300);
  }
  if(uType === 'cheese'){
    return Math.min(Math.max(30, Math.round(rawG/30)*30), 150);
  }
  return Math.max(30, Math.round(rawG/10)*10);
}

function _snapToFriendlyCarb(rawG, food){
  const uType = _calcGetUnitType(food.id);
  if(uType === '_fruit' || (food.cat && food.cat.includes('فواكه'))){
    const snaps = (food.qty_moderate||50)<=30
      ? [5,10,15,20]               // توت: أقصى 20غ ≈ 25 حبة
      : [20,30,40,50,60];          // فاكهة: أقصى 60غ
    return Math.max(5, snaps.reduce(function(p,c){ return Math.abs(c-rawG)<Math.abs(p-rawG)?c:p; }));
  }
  if(uType === 'leafy_veg') return [40,60,80,100,120].reduce(function(p,c){ return Math.abs(c-rawG)<Math.abs(p-rawG)?c:p; });
  if(uType === 'whole_veg'){
    const base=(typeof UNIT_INTELLIGENCE!=='undefined'&&UNIT_INTELLIGENCE.whole_veg&&UNIT_INTELLIGENCE.whole_veg.BASE_GRAMS)
      ?(UNIT_INTELLIGENCE.whole_veg.BASE_GRAMS[food.id]||100):100;
    const fracs=[0.25,0.5,0.75,1.0];
    const best=fracs.reduce(function(p,f){ return Math.abs(f*base-rawG)<Math.abs(p*base-rawG)?f:p; },0.5);
    return Math.max(Math.round(base*0.25), Math.round(best*base/5)*5);
  }
  if(uType === 'nuts') return [10,15,20,25,30,40].reduce(function(p,c){ return Math.abs(c-rawG)<Math.abs(p-rawG)?c:p; });
  return Math.max(5, Math.round(rawG/5)*5);
}

function _snapToFriendlyFat(rawG, food){
  const uType = _calcGetUnitType(food.id);
  if(uType === 'oil' || uType === 'butter'){
    return [5,7,10,14,21,28].reduce(function(p,c){ return Math.abs(c-rawG)<Math.abs(p-rawG)?c:p; });
  }
  if(uType === 'avocado'){
    const base=97.5;
    const fracs=[0.25,0.5,0.75,1.0];
    const best=fracs.reduce(function(p,f){ return Math.abs(f*base-rawG)<Math.abs(p*base-rawG)?f:p; },0.5);
    return Math.round(best*base/5)*5;
  }
  if(uType === 'nuts') return [15,20,25,30,40].reduce(function(p,c){ return Math.abs(c-rawG)<Math.abs(p-rawG)?c:p; });
  return Math.max(5, Math.round(rawG/5)*5);
}

function _nearestInList(val, list){
  return list.reduce(function(p,c){ return Math.abs(c-val)<Math.abs(p-val)?c:p; });
}


function _buildAutoMeal(){
  if(!_calcSelected.length){ alert('اختر مكوناً واحداً على الأقل'); return; }

  /* ── قراءة كل البيانات ── */
  const mem      = MEMBERS.find(function(m){ return m.uid===(CU&&CU.id); });
  const prefs    = mem && typeof getMemPrefs!=='undefined' ? getMemPrefs(mem) : {};
  const phase    = mem ? (mem.phase||1) : 1;
  const mealsN   = prefs.meals_per_day || 3;
  const hasSnack = prefs.has_snack || false;
  const eggPref  = prefs.preferred_egg_count || 2;

  const dayTargets = mem && typeof getTargetForDate!=='undefined'
    ? getTargetForDate(mem)
    : {fat:130, protein:110, carb:20, cal:1800};

  const todayMls = mem && typeof getTodayMeals!=='undefined'
    ? getTodayMeals(mem.uid) : [];
  const remaining = mem && typeof calcRemainingAfterMeals!=='undefined'
    ? calcRemainingAfterMeals(mem, todayMls)
    : {fat:dayTargets.fat, protein:dayTargets.protein, carb:dayTargets.carb||20, cal:dayTargets.cal};

  const mealTypeInfo = mem && typeof getMealType!=='undefined' ? getMealType(mem) : null;
  const mealType = mealTypeInfo ? mealTypeInfo.type : 'other';
  const isSnack  = mealType === 'snack';

  /* ── حد السعرات ── */
  const calLimit = getMealCalLimit(mealsN, hasSnack, isSnack);

  /* ── حصة هذه الوجبة ── */
  const snackSh = hasSnack ? 0.09 : 0;
  const mainSh  = 1 - snackSh;
  const SHARES  = {
    3: [+(mainSh*0.29).toFixed(3), +(mainSh*0.36).toFixed(3), +(mainSh*0.35).toFixed(3)],
    2: [+(mainSh*0.44).toFixed(3), +(mainSh*0.56).toFixed(3)],
  };
  const shares = SHARES[mealsN] || [0.33,0.33,0.34];
  const mealIdx = {breakfast:0,lunch:1,dinner:2,snack:3}[mealType]||0;
  const share   = isSnack ? snackSh : (shares[mealIdx]||0.33);

  /* ── أهداف الوجبة ── */
  const mealFatTarget  = Math.round(dayTargets.fat    * share);
  const mealProtTarget = Math.round(dayTargets.protein* share);
  const mealCal        = Math.min(calLimit, Math.round(dayTargets.cal * share));

  /* ── نسبة كيتو ── */
  const KETO_BY_PHASE = {0:1.2,1:1.6,2:1.8,3:2.0,4:2.0,5:1.8,6:1.6,7:1.6};
  const ketoTarget = KETO_BY_PHASE[phase] || 1.6;

  /* ── الكارب الصافٍ الذكي لكل الأصناف ── */
  const CARB_PCT = {0:0.07,1:0.05,2:0.05,3:0.05,4:0.05,5:0.07,6:0.10,7:0.10};
  const dayCarbTarget = dayTargets.carb || Math.round(dayTargets.cal*CARB_PCT[phase]/4);
  const carbAutoMeal  = Math.round(dayCarbTarget * share);
  const carbFloor     = isSnack ? 0  : MEAL_LIMITS.carb_min_g;
  const carbCeiling   = isSnack ? 3  : MEAL_LIMITS.carb_max_g;
  const mealCarb      = _calcCarbLimit===999
    ? Math.min(carbCeiling, carbAutoMeal)
    : Math.min(_calcCarbLimit, carbCeiling);

  /* ── تصنيف الأصناف ── */
  const FAT_ALWAYS = [61, 113];
  const selFids    = _calcSelected.filter(function(id){ return typeof id==='number'; });
  const selFoods   = selFids.map(function(id){
    return FOODS.find(function(f){ return f.id===id; });
  }).filter(Boolean);

  // بروتين: protein>8 أو cat بروتين/دواجن/لحوم/أسماك/ألبان
  const PROT_CATS = ['بروتين','دواجن','لحوم','أسماك','بيض'];
  const protSrcs = selFoods.filter(function(f){
    return f.protein>8 || f.id===10 ||
      PROT_CATS.some(function(c){ return f.cat&&f.cat.includes(c); });
  });

  // دهون: حسب النوع
  const fatSrcs = selFoods.filter(function(f){
    return !protSrcs.find(function(p){ return p.id===f.id; }) &&
      (f.fat>30 || FAT_ALWAYS.includes(f.id));
  });
  const monoFats = fatSrcs.filter(function(f){ return getFatType(f.id)==='mono' || FAT_ALWAYS.includes(f.id); });
  const satFats  = fatSrcs.filter(function(f){ return getFatType(f.id)==='sat'; });
  const pufaFats = fatSrcs.filter(function(f){ return getFatType(f.id)==='pufa'; });

  // خضار ورقية
  const leafyVegs = selFoods.filter(function(f){
    return !protSrcs.find(function(p){ return p.id===f.id; }) &&
      !fatSrcs.find(function(ft){ return ft.id===f.id; }) &&
      (LEAFY_VEG_FIDS.includes(f.id) || (f.cat&&f.cat.includes('خضار')&&f.net_carb<3&&f.fiber>1));
  });

  // خضار حبات
  const wholeVegs = selFoods.filter(function(f){
    return !protSrcs.find(function(p){ return p.id===f.id; }) &&
      !fatSrcs.find(function(ft){ return ft.id===f.id; }) &&
      !leafyVegs.find(function(v){ return v.id===f.id; }) &&
      f.cat&&f.cat.includes('خضار') && f.net_carb<=8;
  });

  // فاكهة
  const fruits = selFoods.filter(function(f){
    return !protSrcs.find(function(p){ return p.id===f.id; }) &&
      !fatSrcs.find(function(ft){ return ft.id===f.id; }) &&
      !leafyVegs.find(function(v){ return v.id===f.id; }) &&
      !wholeVegs.find(function(v){ return v.id===f.id; }) &&
      (f.cat&&(f.cat.includes('فواكه')||f.cat.includes('فاكهة')));
  });

  // مكسرات وبذور (كمصدر ألياف + دهون)
  const nutsSeeds = selFoods.filter(function(f){
    return !protSrcs.find(function(p){ return p.id===f.id; }) &&
      !fatSrcs.find(function(ft){ return ft.id===f.id; }) &&
      !leafyVegs.find(function(v){ return v.id===f.id; }) &&
      !wholeVegs.find(function(v){ return v.id===f.id; }) &&
      !fruits.find(function(fr){ return fr.id===f.id; }) &&
      (f.cat&&(f.cat.includes('مكسرات')||f.cat.includes('بذور')));
  });

  calcItems = [];
  let ncUsed=0, fiberUsed=0, fatUsed=0, protUsed=0, calUsed=0, satUsed=0, monoUsed=0, pufa_used=0;

  /* ════ A. فاكهة: ≤3غ كارب صافٍ/نوع ════ */
  fruits.forEach(function(f){
    if(f.net_carb<=0) return;
    const maxG = MEAL_LIMITS.fruit_nc_max_g / f.net_carb * 100;
    const qty  = Math.max(5, Math.min(20, Math.round(maxG/5)*5));
    const q=qty/100;
    ncUsed+=f.net_carb*q; fiberUsed+=(f.fiber||0)*q; calUsed+=f.cal*q; fatUsed+=f.fat*q;
    const uType=_calcGetUnitType(f.id);
    calcItems.push({fid:f.id, qty:qty, _sel:_buildSelForItem(uType,f.id,qty)});
  });

  /* ════ B. خضار ورقية: ≤20غ/نوع ════ */
  leafyVegs.forEach(function(f){
    const qty = MEAL_LIMITS.veg_leafy_max_g; // 20غ ثابت
    const q=qty/100;
    ncUsed+=f.net_carb*q; fiberUsed+=(f.fiber||0)*q; calUsed+=f.cal*q; fatUsed+=f.fat*q;
    const uType=_calcGetUnitType(f.id);
    calcItems.push({fid:f.id, qty:qty, _sel:_buildSelForItem(uType,f.id,qty)});
  });

  /* ════ C. خضار حبات: ≤30غ/نوع ════ */
  wholeVegs.forEach(function(f){
    const qty = MEAL_LIMITS.veg_whole_max_g; // 30غ ثابت
    const q=qty/100;
    ncUsed+=f.net_carb*q; fiberUsed+=(f.fiber||0)*q; calUsed+=f.cal*q; fatUsed+=f.fat*q;
    const uType=_calcGetUnitType(f.id);
    calcItems.push({fid:f.id, qty:qty, _sel:_buildSelForItem(uType,f.id,qty)});
  });

  /* ════ D. بروتين: ≥30غ مجموع ════ */
  // حد أدنى البروتين متحرك حسب الهدف اليومي
  const dayProtG = dayTargets.protein || 90;
  const dynProtMin = dayProtG < 70  ? 20   // بروتين منخفض جداً
                   : dayProtG < 90  ? 25   // متوسط
                   :                  30;  // طبيعي
  const protNeeded = Math.max(dynProtMin, mealProtTarget * 0.80);
  const hasEgg     = protSrcs.find(function(f){ return f.id===10; });
  const eggQtyRaw  = hasEgg ? eggPref * 55 : 0;

  // قيد سعرات البيض: لا أكثر من 65% من سقف السعرات
  let eggQty = eggQtyRaw;
  if(hasEgg && eggQtyRaw>0){
    const eggCal = FOODS.find(function(x){ return x.id===10; }).cal * eggQtyRaw/100;
    if(eggCal > mealCal * 0.65) eggQty = Math.max(55, eggQtyRaw-55);
  }
  const eggProtVal  = eggQty/100*13;
  const eggCoversAll= eggProtVal >= protNeeded * 0.85;
  const otherProt   = protSrcs.filter(function(f){ return f.id!==10; });
  const protForOther= Math.max(protNeeded - eggProtVal, 0);
  const perOtherProt= (otherProt.length&&!eggCoversAll) ? protForOther/otherProt.length : 0;

  protSrcs.forEach(function(f){
    if(f.protein<=0) return;
    let qty;
    if(f.id===10){
      qty = eggQty;
    } else {
      if(eggCoversAll||perOtherProt<=0) return;
      const rawG = perOtherProt/f.protein*100;
      const lower = Math.max(50,Math.floor(rawG/50)*50);
      const upper = lower+50;
      qty = Math.min((upper-rawG)<(rawG-lower)*0.8?upper:lower, 250);
      if(f.protein*qty/100>perOtherProt*1.20&&qty>50) qty-=50;
    }
    if(!qty||qty<=0) return;
    const q=qty/100; const food=FOODS.find(function(x){ return x.id===f.id; });
    if(!food) return;
    ncUsed   += food.net_carb*q; fiberUsed += (food.fiber||0)*q;
    calUsed  += food.cal*q;      fatUsed   += food.fat*q;
    protUsed += food.protein*q;  satUsed   += (food.sat_fat||0)*q;
    const uType=_calcGetUnitType(f.id);
    calcItems.push({fid:f.id, qty:qty, _sel:_buildSelForItem(uType,f.id,qty)});
  });

  /* ════ E. مكسرات وبذور: للألياف ════ */
  let nutsTotal=0;
  nutsSeeds.forEach(function(f){
    const isSeed = f.cat&&f.cat.includes('بذور');
    const maxQ   = isSeed ? MEAL_LIMITS.seeds_max_g : MEAL_LIMITS.nuts_max_g;
    const qty    = Math.min(maxQ, isSeed?15:20);
    nutsTotal   += qty;
    const q=qty/100;
    ncUsed+=f.net_carb*q; fiberUsed+=(f.fiber||0)*q; calUsed+=f.cal*q;
    fatUsed+=f.fat*q; satUsed+=(f.sat_fat||0)*q;
    const uType=_calcGetUnitType(f.id);
    calcItems.push({fid:f.id, qty:qty, _sel:_buildSelForItem(uType,f.id,qty)});
  });

  /* ════ F. الدهون: بناءً على المعادلة الكيتونية + أنواع الدهون ════ */
  const denom      = protUsed*0.6 + ncUsed;
  const fatForKeto = denom>0 ? Math.max(ketoTarget*denom - fatUsed, 0) : 10;
  const fatForGoal = Math.max(mealFatTarget - fatUsed, 0);
  let fatToAdd     = Math.max(fatForKeto, fatForGoal*0.80);

  // قيد السعرات
  const calBudget  = mealCal - calUsed;
  fatToAdd = Math.min(fatToAdd, Math.max(calBudget*0.85/9, 5));

  // توزيع حسب النوع: mono أولاً، ثم sat، ثم pufa
  const fatByType = [
    {srcs: monoFats, limit: null,                  type:'mono'},
    {srcs: satFats,  limit: MEAL_LIMITS.sat_fat_max_g, type:'sat'},
    {srcs: pufaFats, limit: MEAL_LIMITS.pufa_fat_max_g,type:'pufa'},
  ];

  let fatAdded = 0;
  fatByType.forEach(function(grp){
    if(!grp.srcs.length || fatAdded>=fatToAdd*0.95) return;
    const remaining2 = fatToAdd - fatAdded;
    const perSrc     = remaining2 / grp.srcs.length;

    grp.srcs.forEach(function(f){
      if(fatAdded>=fatToAdd*0.95) return;
      let rawG = perSrc/f.fat*100;

      // قيد sat_fat
      if(grp.type==='sat'){
        const satLeft = MEAL_LIMITS.sat_fat_max_g - satUsed;
        if(satLeft<=0) return;
        rawG = Math.min(rawG, satLeft/(f.sat_fat/100));
      }
      // قيد pufa
      if(grp.type==='pufa'){
        const pufaLeft = MEAL_LIMITS.pufa_fat_max_g - pufa_used;
        rawG = Math.min(rawG, pufaLeft/f.fat*100);
      }

      rawG = Math.max(rawG, 5);
      const qty = _snapToFriendlyFat(rawG, f);
      if(qty<=0) return;
      const q=qty/100;
      fatAdded += f.fat*q; satUsed  += (f.sat_fat||0)*q;
      if(grp.type==='pufa') pufa_used += f.fat*q;
      calUsed  += f.cal*q;
      const uType=_calcGetUnitType(f.id); const sel=_buildSelForItem(uType,f.id,qty);
      calcItems.push({fid:f.id, qty:qty, _sel:sel});
    });
  });

  // إذا لا مصادر دهن مختارة → أضف زيت زيتون افتراضياً
  if(!fatSrcs.length && fatToAdd>5){
    const oilQty = _snapToFriendlyFat(fatToAdd, {fat:100, id:1}||{});
    calcItems.push({fid:1, qty:oilQty, _sel:{oil_unit:'tbsp', oil_amount:Math.round(oilQty/14)}});
  }

  /* ════ الأصناف الخارجية ════ */
  _calcSelected.filter(function(id){
    return typeof id==='string'&&id.startsWith('ext:');
  }).forEach(function(extId){
    const uType=extId.replace('ext:','');
    calcItems.push({fid:extId, qty:50, _sel:_getDefaultSel(uType,null)});
  });

  /* ════ اقتراح الألياف ════ */
  const finalT   = _calcTotalsAll();
  const fiberNow = finalT.fiber || 0;
  if(fiberNow < MEAL_LIMITS.fiber_min_g && typeof _calcFiberBooster!=='undefined'){
    const calLeft2  = mealCal * 0.20;
    const fatLeft2  = mealFatTarget * 0.20;
    window._calcFiberSuggestion = _calcFiberBooster(fiberNow, calLeft2, fatLeft2,
      mem?(mem.favorites_foods||[]):[]);
  } else {
    window._calcFiberSuggestion = null;
  }

  const denom2 = finalT.prot*0.6+finalT.nc;
  const ratio2 = denom2>0?Math.round(finalT.fat/denom2*100)/100:0;
  console.log('[Calc v3]', {
    fat:finalT.fat, prot:finalT.prot, nc:finalT.nc,
    cal:finalT.cal, fiber:finalT.fiber, ratio:ratio2,
    monoOk: monoUsed>=MEAL_LIMITS.mono_fat_min_g,
    protOk: protUsed>=MEAL_LIMITS.protein_min_g,
  });

  _calcBuilt=true; _calcMode='manual';
  rCalc();
}

function _buildFatSel(uType, fid, shareGrams){
  if(uType === 'oil'){
    const tbsp = Math.max(Math.min(Math.round(shareGrams/12.4), 3), 1);
    return {oil_unit:'tbsp', oil_amount:tbsp};
  }
  if(uType === 'butter'){
    const tbsp = Math.max(Math.min(Math.round(shareGrams/11.3), 2), 1);
    return {butter_unit:'tbsp', butter_amount:tbsp};
  }
  if(uType === 'avocado')  return {avo_size:'medium', avo_portion:'half'};
  if(uType === 'nuts')     return {nut_unit:'handful', nut_amount:1};
  if(uType === 'cheese')   return {cheese_unit:'slice', cheese_amount:2};
  return uType ? _getDefaultSel(uType, fid) : {};
}

/* ─── بناء _sel لصنف بكمية محددة ─── */

/* alias للتوافق */
function _buildSelForQty(uType, fid, qty, food){ return _buildSelForItem(uType, fid, qty); }
function _buildSelForItem(uType, fid, targetGrams){
  if(!uType) return {};
  const base = _getDefaultSel(uType, fid);
  if(uType === 'egg'){
    // احسب عدد البيضات من الغرام
    const eggGrams = {small:45, medium:55, large:65, xlarge:75};
    const sizeGrams = eggGrams[base.egg_size||'medium'] || 55;
    base.egg_count = Math.max(1, Math.round(targetGrams / sizeGrams));
    return base;
  }
  if(uType === 'oil'){
    const tbsp = Math.max(1, Math.round(targetGrams/14));
    return {oil_unit:'tbsp', oil_amount:Math.min(tbsp, 4)};
  }
  if(uType === 'butter'){
    const tbsp = Math.max(1, Math.round(targetGrams/14));
    return {butter_unit:'tbsp', butter_amount:Math.min(tbsp, 3)};
  }
  if(uType === 'chicken'){
    const gramsEach = {breast_no:120, breast_sk:130, thigh_no:100, thigh_sk:120, wing:60, drumstick:80};
    const cut = base.chicken_cut || 'breast_no';
    const count = Math.max(1, Math.round(targetGrams / (gramsEach[cut]||120)));
    return {chicken_cut:cut, chicken_count:Math.min(count, 4), chicken_state:'raw'};
  }
  if(uType === 'fish'){
    const serving = {salmon:130, tuna:85, sardine:100, white:150, shrimp:150};
    const type = base.fish_type || 'salmon';
    const amount = Math.max(0.5, Math.round(targetGrams / (serving[type]||130) * 2) / 2);
    return {fish_type:type, fish_amount:Math.min(amount, 3)};
  }
  if(uType === 'leafy_veg'){
    const cups = Math.max(0.5, Math.round(targetGrams/60 * 2)/2);
    return {leaf_unit:'cup', leaf_amount:cups};
  }
  if(uType === 'whole_veg'){
    return {veg_unit:'piece', veg_size:'medium', veg_amount:1};
  }
  if(uType === 'avocado'){
    if(targetGrams < 35)       return {avo_size:'small',  avo_portion:'quarter'};
    if(targetGrams < 60)       return {avo_size:'medium', avo_portion:'half'};
    if(targetGrams < 100)      return {avo_size:'large',  avo_portion:'half'};
    return {avo_size:'large', avo_portion:'whole'};
  }
  return base;
}

/* ─── الحد الأدنى للنسبة الكيتونية حسب المرحلة ─── */
function _getPhaseKetoTarget(phase){
  const targets = {0:1.2, 1:1.5, 2:1.8, 3:2.0, 4:2.0, 5:1.8, 6:1.5, 7:1.5};
  return targets[phase] || 1.5;
}

/* ─── موازنة الوجبة: كارب + سعرات + نسبة كيتونية ─── */
function _adjustForKetoRatio(targetRatio){
  if(!calcItems.length) return;

  const mem      = MEMBERS.find(function(m){ return m.uid===(CU&&CU.id); });
  const prefs    = mem && typeof getMemPrefs!=='undefined' ? getMemPrefs(mem) : {};
  const mealsN   = prefs.meals_per_day || 3;
  const targets  = mem && typeof getTargetForDate!=='undefined'
    ? getTargetForDate(mem) : {fat:130,protein:110,carb:25,cal:1800};
  const shares   = (typeof MEAL_SHARE!=='undefined' && MEAL_SHARE)
    ? (MEAL_SHARE[mealsN]||[0.33,0.33,0.34]) : [0.33,0.33,0.34];
  const mealTypeInfo = mem && typeof getMealType!=='undefined' ? getMealType(mem) : null;
  const mealIdx  = {breakfast:0,lunch:1,dinner:2}[(mealTypeInfo&&mealTypeInfo.type)||''] || 0;
  const share    = shares[mealIdx] || 0.33;

  // حدود الوجبة
  const calMax  = Math.round(targets.cal * share * 1.15);  // +15% تسامح
  const carbMax = _calcCarbLimit === 999 ? Math.round(targets.carb * share) : _calcCarbLimit;
  const fatMax  = Math.round(targets.fat * share * 1.2);

  // ── دالة لحساب المجاميع الحالية ──
  function getTotals(){
    const t = {fat:0,prot:0,nc:0,cal:0};
    calcItems.forEach(function(item){
      if(typeof item.fid !== 'number') return;
      const f = FOODS.find(function(x){ return x.id===item.fid; });
      if(!f) return;
      const q = item.qty/100;
      t.fat += f.fat*q; t.prot += f.protein*q;
      t.nc  += f.net_carb*q; t.cal += f.cal*q;
    });
    return {
      fat:Math.round(t.fat*10)/10, prot:Math.round(t.prot*10)/10,
      nc:Math.round(t.nc*10)/10,  cal:Math.round(t.cal)
    };
  }
  function getKetoRatio(t){ const d=t.prot*0.6+t.nc; return d>0?Math.round(t.fat/d*100)/100:0; }

  // ── المرحلة 1: أنفّذ حد الكارب أولاً ──
  let tot = getTotals();
  if(tot.nc > carbMax){
    // قلّل مصادر الكارب تناسبياً
    const scaleFactor = carbMax / tot.nc;
    calcItems.forEach(function(item){
      if(typeof item.fid !== 'number') return;
      const f = FOODS.find(function(x){ return x.id===item.fid; });
      if(!f || f.net_carb < 1) return;
      const minQty = Math.max(Math.round((f.qty_moderate||10)*0.25/5)*5, 5);
      const newQty = Math.max(Math.round(item.qty*scaleFactor/5)*5, minQty);
      item.qty = newQty;
      // حدّث _sel
      const uType = _calcGetUnitType(item.fid);
      if(uType && uType.startsWith('_')){
        if(uType==='_fruit') item._sel = {fruit_amount:item.qty};
        else item._sel = {generic_qty:item.qty};
      } else if(uType && typeof _buildSelForItem!=='undefined'){
        item._sel = _buildSelForItem(uType, item.fid, item.qty);
      }
    });
    tot = getTotals();
  }

  // ── المرحلة 2: حد السعرات ──
  if(tot.cal > calMax){
    const calScale = calMax / tot.cal;
    calcItems.forEach(function(item){
      if(typeof item.fid !== 'number') return;
      const f = FOODS.find(function(x){ return x.id===item.fid; });
      if(!f) return;
      // لا نقلل البروتين كثيراً — فقط الدهون والكارب
      if(f.protein > 15 && f.fat < 20) return; // بروتين نظيف — لا تلمس
      const minQty = 5;
      item.qty = Math.max(Math.round(item.qty*calScale/5)*5, minQty);
      const uType = _calcGetUnitType(item.fid);
      if(uType && uType.startsWith('_')){
        if(uType==='_fruit') item._sel = {fruit_amount:item.qty};
        else item._sel = {generic_qty:item.qty};
      } else if(uType && typeof _buildSelForItem!=='undefined'){
        item._sel = _buildSelForItem(uType, item.fid, item.qty);
      }
    });
    tot = getTotals();
  }

  // ── المرحلة 3: حقق النسبة الكيتونية ──
  let ratio = getKetoRatio(tot);
  if(ratio >= targetRatio) return; // ✓ لا حاجة لتعديل

  // الدهن المطلوب لتحقيق النسبة
  const denom     = tot.prot*0.6 + tot.nc;
  const fatNeeded = Math.max(targetRatio*denom - tot.fat, 0);
  if(fatNeeded <= 0) return;

  // ابحث عن مصدر دهن موجود في القائمة
  const fatItem = calcItems.find(function(i){
    if(typeof i.fid!=='number') return false;
    const f=FOODS.find(function(x){ return x.id===i.fid; });
    return f && f.fat > 30;
  });

  if(fatItem){
    const f2 = FOODS.find(function(x){ return x.id===fatItem.fid; });
    if(!f2||!f2.fat) return;
    const addG = Math.round(fatNeeded/f2.fat*100/5)*5;
    // لا تتجاوز حد الدهن اليومي للوجبة
    const maxAdd = Math.max(fatMax - tot.fat, 0);
    fatItem.qty += Math.min(addG, Math.round(maxAdd/f2.fat*100));
    const uType3 = _calcGetUnitType(fatItem.fid);
    if(uType3 && !uType3.startsWith('_'))
      fatItem._sel = _buildSelForItem(uType3, fatItem.fid, fatItem.qty);
  } else {
    // لا يوجد دهن → أضف ملعقة زيت زيتون (fid=1)
    const oilFid = 1;
    const addGrams = Math.min(Math.round(fatNeeded/0.886/5)*5, 28); // max 2 ملعقة
    const existOil = calcItems.find(function(i){ return i.fid===oilFid; });
    if(existOil){
      existOil.qty += addGrams;
      existOil._sel = {oil_unit:'tbsp', oil_amount:Math.round(existOil.qty/14)};
    } else {
      calcItems.push({fid:oilFid, qty:addGrams, _sel:{oil_unit:'tbsp', oil_amount:Math.round(addGrams/14)}});
    }
  }
}



function _populateCsel(){
  const sel = document.getElementById('csel');
  if(!sel || !FOODS || sel.options.length > 1) return;
  sel.innerHTML = '<option value="">اختر...</option>';
  const cats = [...new Set(FOODS.map(function(f){ return f.cat; }))];
  cats.forEach(function(cat){
    const og = document.createElement('optgroup');
    og.label = cat;
    FOODS.filter(function(f){ return f.cat===cat; }).forEach(function(f){
      const o = document.createElement('option');
      o.value = f.id; o.textContent = f.name;
      og.appendChild(o);
    });
    sel.appendChild(og);
  });
}
