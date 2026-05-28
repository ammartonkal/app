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
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
        '<div style="font-size:13px;font-weight:600">📋 مكونات الوجبة</div>' +
        '<button class="btn sm dng" onclick="_calcClearAll()">مسح الكل</button>' +
      '</div>' + builtHTML + '</div>'
    : '';
  el.innerHTML = remHTML + modeHTML + _ingCard + _builtCard + nutritionHTML + saveHTML;

  // تهيئة الـ select القديم للتوافق
  _populateCsel();
}

function _renderCalcItems(){
  if(!calcItems.length) return '';
  return calcItems.map(item => {
    const isExt = typeof item.fid === 'string' && item.fid.startsWith('ext:');
    const f = isExt ? null : FOODS.find(x=>x.id===item.fid);
    const unitType = typeof UNIT_INTELLIGENCE!=='undefined'
      ? (isExt ? item.fid.replace('ext:','') : getUnitTypeForFid(item.fid))
      : null;
    const sel = item._sel || {};
    const displayText = unitType && typeof getDisplayText!=='undefined'
      ? getDisplayText(unitType, sel, item.qty, item.fid)
      : item.qty + 'غ';

    // الماكرو
    let m;
    if(isExt && unitType && typeof getExternalMacros!=='undefined'){
      m = getExternalMacros(unitType, sel, item.qty) || {fat:0,prot:0,nc:0,cal:0};
    } else if(f) {
      m = _calcMealRatio([{fid:item.fid,qty:item.qty}]);
    } else {
      m = {fat:0,prot:0,nc:0,cal:0};
    }

    const name = isExt
      ? (UNIT_INTELLIGENCE[unitType]?.label || item.fid)
      : (f?.name || '—');

    // تحقق إذا عنده wizard
    const hasWizard = !!unitType;

    const rowId = 'calc-row-' + String(item.fid).replace(':','_');
    return '<div class="calc-item-row" id="' + rowId + '">' +
      '<div class="calc-item-name">' + name + '</div>' +
      '<div style="flex:1;text-align:center">' +
        '<div style="font-size:11px;color:var(--text3)">' + displayText + '</div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:4px">' +
        '<button class="btn sm" onclick="_calcStepItem(\'' + item.fid + '\',-1)">−</button>' +
        '<button class="btn sm" onclick="_calcStepItem(\'' + item.fid + '\',1)">+</button>' +
        (hasWizard ? '<button class="btn sm" style="font-size:10px" onclick="_openUnitWizard(\'' + item.fid + '\')" title="تعديل الوحدة">⚖️</button>' : '') +
      '</div>' +
      '<div class="calc-item-macros">' +
        '<span class="calc-macro-pill fat">' + m.fat + 'غ</span>' +
        '<span class="calc-macro-pill prot">' + m.prot + 'غ</span>' +
        '<span class="calc-macro-pill carb">' + m.nc + 'غ</span>' +
      '</div>' +
      '<button class="btn sm dng" onclick="_calcRemItem(\'' + item.fid + '\')">✕</button>' +
    '</div>';
  }).join('');
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
  wiz.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
      '<div style="font-size:12px;font-weight:600;color:var(--accent)">⚖️ تعديل الكمية — ' + def.label + '</div>' +
      '<button class="btn sm" onclick="this.closest('.inline-wizard').remove()">✕</button>' +
    '</div>' +
    (def.warning ? '<div class="unit-warning-badge">' + def.warning + '</div>' : '') +
    _buildWizardHTML(def, unitType, parseInt(fid)||fid) +
    '<div style="display:flex;gap:8px;margin-top:10px">' +
      '<button class="btn primary sm" style="flex:1;justify-content:center" onclick="_applyWizard()">✓ تطبيق</button>' +
      '<button class="btn sm" onclick="this.closest('.inline-wizard').remove()">إلغاء</button>' +
    '</div>';

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
  // احسب ماكرو كل المكونات (داخلية + خارجية)
  const regularItems = calcItems.filter(i=>typeof i.fid==='number');
  const m0 = _calcMealRatio(regularItems);
  // أضف ماكرو الأصناف الخارجية (خبز، أرز)
  let extFat=0,extProt=0,extNc=0,extCal=0;
  calcItems.filter(i=>typeof i.fid==='string').forEach(function(item){
    const uType = item.fid.replace('ext:','');
    const extM = (typeof getExternalMacros!=='undefined') ? getExternalMacros(uType, item._sel||{}, item.qty) : null;
    if(extM){ extFat+=extM.fat||0; extProt+=extM.prot||0; extNc+=extM.nc||0; extCal+=extM.cal||0; }
  });
  const m = {
    fat:  Math.round((m0.fat  + extFat)*10)/10,
    prot: Math.round((m0.prot + extProt)*10)/10,
    nc:   Math.round((m0.nc   + extNc)*10)/10,
    cal:  Math.round(m0.cal   + extCal),
    ratio: 0
  };
  const _d = m.prot*0.6 + m.nc;
  m.ratio = _d > 0 ? Math.round(m.fat/_d*100)/100 : 0;
  const ratioColor = m.ratio >= 2.0 ? 'var(--accent)' : m.ratio >= 1.5 ? '#f59e0b' : 'var(--danger)';
  const ratioLabel = m.ratio >= 2.0 ? 'ممتاز 🔥' : m.ratio >= 1.5 ? 'محفز ✓' : 'يحتاج تحسين';
  const ketoP = Math.min(Math.round(m.ratio / 3 * 100), 100);

  return '<div class="calc-nutrition-card">' +
    '<div style="text-align:center;margin-bottom:12px">' +
      '<div style="font-size:11px;color:var(--text3);margin-bottom:4px">النسبة الكيتونية للوجبة</div>' +
      '<div class="calc-keto-ratio" style="color:' + ratioColor + '">' + m.ratio + '</div>' +
      '<div style="font-size:12px;color:' + ratioColor + ';font-weight:600">' + ratioLabel + '</div>' +
      '<div style="height:6px;background:var(--surface2);border-radius:6px;margin:8px 0;overflow:hidden">' +
        '<div style="height:100%;width:' + ketoP + '%;background:' + ratioColor + ';border-radius:6px;transition:width .6s"></div>' +
      '</div>' +
    '</div>' +
    '<div class="calc-macro-grid">' +
      '<div class="calc-macro-box"><div class="calc-macro-box-val" style="color:var(--accent)">' + m.fat + 'غ</div><div class="calc-macro-box-lbl">دهون</div></div>' +
      '<div class="calc-macro-box"><div class="calc-macro-box-val" style="color:var(--info)">' + m.prot + 'غ</div><div class="calc-macro-box-lbl">بروتين</div></div>' +
      '<div class="calc-macro-box"><div class="calc-macro-box-val" style="color:var(--danger)">' + m.nc + 'غ</div><div class="calc-macro-box-lbl">كارب صافٍ</div></div>' +
      '<div class="calc-macro-box"><div class="calc-macro-box-val">' + m.cal + '</div><div class="calc-macro-box-lbl">سعرة</div></div>' +
    '</div>' +
    '<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);padding-top:8px;border-top:1px solid var(--border)">' +
      '<span>دهون مشبعة: <strong>' + _calcSatFatTotal() + 'غ</strong></span>' +
      '<span>ألياف: <strong>' + _calcFiberTotal() + 'غ</strong></span>' +
      '<span>صوديوم: <strong>' + _calcSodiumTotal() + 'ملغ</strong></span>' +
    '</div>' +
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
  if(_calcMode === 'manual'){
    const ex = calcItems.find(i=>i.fid===numFid);
    if(ex) calcItems = calcItems.filter(i=>i.fid!==numFid);
    else {
      // ابدأ بـ wizard إذا متاح
      const unitType = typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(numFid) : null;
      const defSel = unitType ? _getDefaultSel(unitType, numFid) : {};
      const qty = unitType ? (calcGramsFromSel(unitType, defSel, numFid)||100) : 100;
      calcItems.push({fid:numFid, qty, _sel:defSel});
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
    if(step.options && step.options.length) sel[step.key] = step.options[0].val;
    else if(step.type==='number') sel[step.key] = step.default || 1;
  });
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

function _calcRemItem(fid){
  calcItems = calcItems.filter(i=>i.fid!==fid);
  _calcSelected = _calcSelected.filter(id=>id!==fid);
  rCalc();
}

function _calcClearAll(){
  calcItems = []; _calcSelected = []; _calcBuilt = false;
  rCalc();
}

/* ─── بناء الوجبة التلقائي ─── */
function _buildAutoMeal(){
  if(!_calcSelected.length){ alert('اختر مكوناً واحداً على الأقل'); return; }
  const mem     = MEMBERS.find(m=>m.uid===CU?.id);
  const rem     = typeof getDayRemaining!=='undefined' ? getDayRemaining(mem) : {fat:50,protein:35,carb:_calcCarbLimit};
  const carbMax = _calcCarbLimit === 999 ? (rem.carb||20) : _calcCarbLimit;

  // صنّف المكونات المختارة
  const foods   = _calcSelected.map(fid=>FOODS.find(f=>f.id===fid)).filter(Boolean);
  const proteins= foods.filter(f=>f.protein>10&&f.fat<40);
  const fats    = foods.filter(f=>f.fat>20&&!proteins.find(p=>p.id===f.id));
  const vegs    = foods.filter(f=>f.net_carb<6&&!proteins.find(p=>p.id===f.id)&&!fats.find(p=>p.id===f.id));
  const rest    = foods.filter(f=>!proteins.find(p=>p.id===f.id)&&!fats.find(p=>p.id===f.id)&&!vegs.find(p=>p.id===f.id));

  calcItems = [];

  // أضف البروتين — من هدف البروتين المتبقي
  proteins.forEach(function(f){
    const unitType = typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(f.id) : null;
    const defSel   = unitType ? _getDefaultSel(unitType, f.id) : {};
    // إذا عنده wizard → استخدم كميته الطبيعية كنقطة بداية
    const naturalQty = (unitType && typeof calcGramsFromSel!=='undefined')
      ? calcGramsFromSel(unitType, defSel, f.id) : 0;
    // احسب الكمية من الهدف
    const targetProt = (rem.protein||30) / Math.max(proteins.length,1);
    const calcQty = f.protein>0 ? Math.round(targetProt/f.protein*100/5)*5 : 100;
    // اختر الأصغر بين الحاجة والكمية المعقولة
    const qty = naturalQty > 0
      ? Math.min(Math.max(calcQty, naturalQty), naturalQty * 3)
      : Math.max(Math.min(calcQty, 200), 50);
    calcItems.push({fid:f.id, qty:Math.round(qty/5)*5, _sel:defSel});
  });

  // احسب ما تبقى من دهن بعد البروتين
  const protFat = calcItems.reduce((s,i)=>{
    const f=FOODS.find(x=>x.id===i.fid); return s+(f?f.fat*i.qty/100:0);
  },0);
  const fatTarget = Math.max((rem.fat||40) - protFat, 10);

  // أضف الدهون
  fats.forEach(f=>{
    const share = fatTarget / Math.max(fats.length,1);
    const qty   = f.fat>0 ? Math.round(Math.min(share/f.fat*100, f.fat>=80?35:60)/5)*5 : 15;
    calcItems.push({fid:f.id, qty:Math.max(qty,5)});
  });

  // أضف الخضار
  vegs.forEach(f=>{ calcItems.push({fid:f.id, qty:80}); });

  // أضف البقية
  rest.forEach(f=>{ calcItems.push({fid:f.id, qty:30}); });

  // تحقق من حد الكارب وقلل الخضار إذا لزم
  const totalNc = calcItems.reduce((s,i)=>{const f=FOODS.find(x=>x.id===i.fid);return s+(f?f.net_carb*i.qty/100:0);},0);
  if(totalNc > carbMax && carbMax !== 999){
    calcItems.forEach(item=>{
      const f=FOODS.find(x=>x.id===item.fid);
      if(f&&f.net_carb>2) item.qty = Math.max(Math.round(item.qty*(carbMax/totalNc)/5)*5,20);
    });
  }

  _calcBuilt = true;
  _calcMode  = 'manual'; // بعد البناء انتقل لوضع التعديل
  rCalc();
}

/* ─── حفظ وتسجيل ─── */
async function _calcRegisterOnly(){
  if(!calcItems.length){ alert('لا توجد مكونات'); return; }
  await _doRegisterMeal(false);
}
async function _calcRegisterAndSave(){
  if(!calcItems.length){ alert('لا توجد مكونات'); return; }
  await _doRegisterMeal(true);
}

async function _doRegisterMeal(save){
  const m = _calcMealRatio(calcItems);
  const ts = Date.now();
  const date = new Date().toISOString().split('T')[0];
  const mealTypeNow = typeof getMealType!=='undefined' ? getMealType(MEMBERS.find(x=>x.uid===CU?.id)) : null;
  const meal = {
    uid:CU.id, date, ts,
    type: mealTypeNow?.type || 'other',
    name: save ? (prompt('اسم الوجبة:','وجبتي الكيتونية')||'وجبتي') : 'وجبة من الحاسبة',
    items: calcItems.map(i=>{ const f=FOODS.find(x=>x.id===i.fid); return{fid:i.fid,name:f?.name||'',qty:i.qty};}),
    totals:{ cal:m.cal, fat:m.fat, protein:m.prot, net_carb:m.nc,
             fiber:_calcFiberTotal(), sodium:_calcSodiumTotal() }
  };

  MEALS.push(meal);
  if(window.DB?.saveMeal) await window.DB.saveMeal(meal);
  onMealRegistered(meal.type);

  if(save){
    const share = document.getElementById('calc-share-check')?.checked || false;
    const recipe = {
      id:RECIPES.length+1, name:meal.name, name_en:'',
      desc:'وصفة من حاسبة الوصفة الذكية',
      servings:1, approved:!share,
      prep_time:10, cook_time:15, difficulty:'سهل',
      category:'وصفاتي', img_url:'', tags:['شخصية'],
      ingredients:calcItems.map(i=>({fid:i.fid,qty:i.qty})),
      steps:['تحضير المكونات وطهيها حسب الوصفة'],
      doc_note:'', ratings:{}, favorites:[CU.id],
      _savedBy:CU.id, _shareRequest:share
    };
    RECIPES.push(recipe);
    if(share) console.log('📤 وصفة مرسلة للمراجعة:', recipe);
  }

  // مسح الحاسبة والانتقال للوحة التحكم
  calcItems = []; _calcSelected = []; _calcBuilt = false;
  gp('dashboard');
}

function _populateCsel(){
  const sel = document.getElementById('csel');
  if(!sel || sel.options.length > 1) return;
  sel.innerHTML = '<option value="">اختر...</option>';
  const cats = [...new Set(FOODS.map(f=>f.cat))];
  cats.forEach(cat=>{
    const og=document.createElement('optgroup'); og.label=cat;
    FOODS.filter(f=>f.cat===cat).forEach(f=>{
      const o=document.createElement('option'); o.value=f.id; o.textContent=f.name; og.appendChild(o);
    });
    sel.appendChild(og);
  });
}

