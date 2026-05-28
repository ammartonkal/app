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
    const modQty = food.qty_moderate || 20;
    return [
      {
        key:'fruit_amount', label:'الكمية', type:'number',
        min:5, max:100, step:5, default:modQty, unit:'غ'
      }
    ];
  }
  if(unitType === '_veg_generic' || unitType === '_nuts_generic'){
    return [
      { key:'generic_qty', label:'الكمية', type:'number', min:5, max:200, step:5, default:80, unit:'غ' }
    ];
  }
  return null;
}

function _calcGramsGeneric(unitType, sel, food){
  if(unitType === '_fruit')    return sel.fruit_amount  || food.qty_moderate || 20;
  if(unitType === '_veg_generic')   return sel.generic_qty || 80;
  if(unitType === '_nuts_generic')  return sel.generic_qty || 30;
  return food.qty_moderate || 50;
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

    if(activeSteps){
      html += '<div style="padding:8px 12px;display:flex;flex-direction:column;gap:8px">';

      activeSteps.forEach(function(step){
        // تحقق show_if
        if(step.show_if){
          if(sel[step.show_if.key] !== step.show_if.val) return;
        }
        html += '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
          '<div style="font-size:11px;color:var(--text3);font-weight:600;min-width:55px;text-align:right">' + step.label + ':</div>';

        if(step.type === 'number'){
          const val = sel[step.key] !== undefined ? sel[step.key] : (step.default||1);
          const stepN = step.step || 1;
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
  const cur = parseFloat(item._sel[stepKey]) || 1;
  item._sel[stepKey] = Math.max(min, Math.min(max, Math.round((cur + delta) * 10) / 10));
  const isExt  = String(item.fid).startsWith('ext:');
  const numFid = isExt ? null : parseInt(item.fid);
  const uType  = isExt ? item.fid.replace('ext:','') : (typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(numFid) : null);
  if(uType && typeof calcGramsFromSel!=='undefined'){
    item.qty = calcGramsFromSel(uType, item._sel, numFid||item.fid) || item.qty;
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
  const step = item.qty >= 100 ? 10 : item.qty >= 20 ? 5 : 1;
  item.qty = Math.max(1, item.qty + dir * step);
  // حاول تحديث الـ _sel ليتوافق مع الكمية الجديدة
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
      const unitType = typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(numFid) : null;
      const defSel   = unitType ? _getDefaultSel(unitType, numFid) : {};
      const qty      = (unitType && typeof calcGramsFromSel!=='undefined')
        ? (calcGramsFromSel(unitType, defSel, numFid) || 100) : 100;
      calcItems.push({fid:numFid, qty:qty, _sel:defSel});
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
    sel.leaf_unit   = 'cup';
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
function _buildAutoMeal(){
  if(!_calcSelected.length){ alert('اختر مكوناً واحداً على الأقل'); return; }

  const mem    = MEMBERS.find(function(m){ return m.uid === (CU&&CU.id); });
  const prefs  = mem && typeof getMemPrefs!=='undefined' ? getMemPrefs(mem) : {};
  const phase  = mem ? (mem.phase||1) : 1;
  const favIds = (mem&&mem.favorites_foods) || [];
  const mealsN = prefs.meals_per_day || 3;

  // أهداف اليوم والمتبقي
  const targets  = mem && typeof getTargetForDate!=='undefined'
    ? getTargetForDate(mem) : {fat:130,protein:110,carb:25,cal:1800};
  const todayMls = mem && typeof getTodayMeals!=='undefined'
    ? getTodayMeals(mem.uid) : [];
  const rem = mem && typeof calcRemainingAfterMeals!=='undefined'
    ? calcRemainingAfterMeals(mem, todayMls)
    : {fat:targets.fat, protein:targets.protein, carb:targets.carb, cal:targets.cal};

  // حد الكارب للوجبة
  const carbMax = _calcCarbLimit === 999 ? Math.min(rem.carb||20, 20) : _calcCarbLimit;

  // نوع الوجبة الحالية
  const mealTypeInfo = mem && typeof getMealType!=='undefined' ? getMealType(mem) : null;
  const mealType     = mealTypeInfo ? mealTypeInfo.type : 'other';
  const shares       = MEAL_SHARE ? (MEAL_SHARE[mealsN]||[0.33,0.33,0.34]) : [0.33,0.33,0.34];
  const mealIdx      = {breakfast:0,lunch:1,dinner:2}[mealType]||0;
  const mealShare    = shares[mealIdx]||0.33;

  // أهداف هذه الوجبة = المتبقي × حصة الوجبة (لكن لا نتجاوز المتبقي)
  const mealTargets = {
    fat:     Math.round(Math.min(rem.fat     * mealShare, rem.fat)),
    protein: Math.round(Math.min(rem.protein * mealShare, rem.protein)),
    carb:    Math.min(carbMax, rem.carb||carbMax),
    cal:     Math.round(rem.cal * mealShare),
  };

  // sat_fat limit
  const dailySatLim = mem && typeof getSatFatDailyLimit!=='undefined'
    ? getSatFatDailyLimit(mem) : null;
  const mealSatLim  = dailySatLim ? dailySatLim * mealShare : null;

  // ── حاول استخدام قوالب الوجبات أولاً ──
  // الأصناف المختارة من المشترك
  const selFids = _calcSelected.filter(function(id){ return typeof id === 'number'; });

  let builtFromTemplate = false;

  // فطور + البيض مختار → BREAKFAST_EGG_TEMPLATES
  if(mealType === 'breakfast' && selFids.includes(10) &&
     typeof BREAKFAST_EGG_TEMPLATES !== 'undefined'){
    const eggCount = prefs.preferred_egg_count || 2;
    const eligible = BREAKFAST_EGG_TEMPLATES.filter(function(t){
      if(t.keto_ratio < 1.4) return false;
      if(t.phases.length>0 && !t.phases.includes(phase)) return false;
      if(mealSatLim && t.macros.sat_fat > mealSatLim*1.2) return false;
      // يجب أن يحتوي أصناف من المختارة
      return t.components.some(function(c){ return selFids.includes(c.fid); });
    });
    const tpl = eligible[0];
    if(tpl){
      const scaled = eggCount !== tpl.egg_count && typeof scaleEggRecipe!=='undefined'
        ? scaleEggRecipe(tpl, eggCount) : tpl;
      calcItems = scaled.components
        .filter(function(c){ return FOODS.find(function(f){ return f.id===c.fid; }); })
        .map(function(c){
          const uType = typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(c.fid) : null;
          const defSel = uType ? _buildSelForItem(uType, c.fid, c.qty) : {};
          return {fid:c.fid, qty:c.qty, _sel:defSel};
        });
      builtFromTemplate = true;
    }
  }

  // غداء → LUNCH_TEMPLATES
  if(!builtFromTemplate && mealType === 'lunch' &&
     typeof getBestLunchTemplate!=='undefined'){
    const tpl = getBestLunchTemplate(mealTargets, favIds.filter(function(id){
      return selFids.includes(id);
    }).concat(selFids), phase, mealSatLim, []);
    if(tpl){
      const scaled = typeof scaleMealToRemaining!=='undefined'
        ? scaleMealToRemaining(tpl, mealTargets) : tpl;
      calcItems = scaled.components
        .filter(function(c){ return FOODS.find(function(f){ return f.id===c.fid; }); })
        .map(function(c){
          const uType = typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(c.fid) : null;
          const defSel = uType ? _buildSelForItem(uType, c.fid, c.qty) : {};
          return {fid:c.fid, qty:c.qty, _sel:defSel};
        });
      builtFromTemplate = true;
    }
  }

  // عشاء → DINNER_TEMPLATES
  if(!builtFromTemplate && mealType === 'dinner' &&
     typeof getBestDinnerTemplate!=='undefined'){
    const tpl = getBestDinnerTemplate(mealTargets, favIds.filter(function(id){
      return selFids.includes(id);
    }).concat(selFids), phase, mealSatLim, []);
    if(tpl){
      const scaled = typeof scaleMealToRemaining!=='undefined'
        ? scaleMealToRemaining(tpl, mealTargets) : tpl;
      calcItems = scaled.components
        .filter(function(c){ return FOODS.find(function(f){ return f.id===c.fid; }); })
        .map(function(c){
          const uType = typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(c.fid) : null;
          const defSel = uType ? _buildSelForItem(uType, c.fid, c.qty) : {};
          return {fid:c.fid, qty:c.qty, _sel:defSel};
        });
      builtFromTemplate = true;
    }
  }

  // ── Fallback: بناء يدوي ذكي من الأصناف المختارة ──
  if(!builtFromTemplate){
    calcItems = [];
    const foods    = selFids.map(function(id){ return FOODS.find(function(f){ return f.id===id; }); }).filter(Boolean);
    const proteins = foods.filter(function(f){ return f.protein>10&&f.fat<40; });
    const fats_    = foods.filter(function(f){ return f.fat>20&&!proteins.find(function(p){ return p.id===f.id; }); });
    const vegs_    = foods.filter(function(f){ return f.net_carb<6&&!proteins.find(function(p){ return p.id===f.id; })&&!fats_.find(function(p){ return p.id===f.id; }); });
    const rest_    = foods.filter(function(f){
      return !proteins.find(function(p){ return p.id===f.id; })&&
             !fats_.find(function(p){ return p.id===f.id; })&&
             !vegs_.find(function(p){ return p.id===f.id; });
    });

    // بروتين
    proteins.forEach(function(f){
      const uType = typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(f.id) : null;
      const sel   = uType ? _getDefaultSel(uType, f.id) : {};
      if(uType==='egg'){ sel.egg_size='medium'; sel.egg_count=prefs.preferred_egg_count||2; }
      if(uType==='chicken'){ sel.chicken_cut='breast_no'; sel.chicken_count=1; sel.chicken_state='raw'; }
      const tProt = mealTargets.protein / Math.max(proteins.length,1);
      const qty   = (uType && typeof calcGramsFromSel!=='undefined')
        ? calcGramsFromSel(uType, sel, f.id)
        : Math.min(Math.max(Math.round(tProt/f.protein*100/5)*5, 50), 200);
      calcItems.push({fid:f.id, qty:Math.max(qty||50,10), _sel:sel});
    });

    // الدهن المتبقي بعد البروتين
    const protFat   = calcItems.reduce(function(s,i){ const f2=FOODS.find(function(x){ return x.id===i.fid; }); return s+(f2?f2.fat*i.qty/100:0); },0);
    const fatTarget = Math.max(mealTargets.fat - protFat, 5);

    // دهون
    fats_.forEach(function(f){
      const uType = typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(f.id) : null;
      const share = fatTarget / Math.max(fats_.length,1);
      const sel   = _buildFatSel(uType, f.id, share);
      const qty   = (uType && typeof calcGramsFromSel!=='undefined')
        ? (calcGramsFromSel(uType, sel, f.id)||15) : 14;
      calcItems.push({fid:f.id, qty:Math.max(qty,5), _sel:sel});
    });

    // خضار
    vegs_.forEach(function(f){
      const uType = typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(f.id) : null;
      const sel   = uType ? _getDefaultSel(uType, f.id) : {};
      const qty   = (uType && typeof calcGramsFromSel!=='undefined')
        ? (calcGramsFromSel(uType, sel, f.id)||80) : 80;
      calcItems.push({fid:f.id, qty:qty, _sel:sel});
    });

    // بقية
    rest_.forEach(function(f){
      const uType = typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(f.id) : null;
      const sel   = uType ? _getDefaultSel(uType, f.id) : {};
      const qty   = (uType && typeof calcGramsFromSel!=='undefined')
        ? (calcGramsFromSel(uType, sel, f.id)||30) : 30;
      calcItems.push({fid:f.id, qty:Math.max(qty,10), _sel:sel});
    });

    // الأصناف الخارجية (خبز، أرز)
    _calcSelected.filter(function(id){ return typeof id==='string'&&id.startsWith('ext:'); })
      .forEach(function(extId){
        const uType = extId.replace('ext:','');
        const sel   = _getDefaultSel(uType, null);
        calcItems.push({fid:extId, qty:50, _sel:sel});
      });

    // تحقق من الكارب
    const totalNc = calcItems.reduce(function(s,i){
      const f2=FOODS.find(function(x){ return x.id===i.fid; });
      return s+(f2?f2.net_carb*i.qty/100:0);
    },0);
    if(totalNc > carbMax && carbMax < 999){
      calcItems.forEach(function(item){
        const f2=FOODS.find(function(x){ return x.id===item.fid; });
        if(f2&&f2.net_carb>2){
          item.qty = Math.max(Math.round(item.qty*(carbMax/totalNc)/5)*5, 20);
        }
      });
    }
  }

  // تحقق من النسبة الكيتونية للمرحلة
  const ketoMin = _getPhaseKetoTarget(phase);
  _adjustForKetoRatio(ketoMin);

  _calcBuilt = true;
  _calcMode  = 'manual';
  rCalc();
}

/* ─── بناء _sel للدهون حسب النوع والهدف ─── */
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

/* ─── تعديل الوجبة لتحقيق النسبة الكيتونية ─── */
function _adjustForKetoRatio(targetRatio){
  if(!calcItems.length) return;

  // احسب النسبة الحالية
  function getTotals(){
    const t = {fat:0, prot:0, nc:0};
    calcItems.forEach(function(item){
      if(typeof item.fid !== 'number') return;
      const f = FOODS.find(function(x){ return x.id===item.fid; });
      if(!f) return;
      t.fat  += f.fat      * item.qty / 100;
      t.prot += f.protein  * item.qty / 100;
      t.nc   += f.net_carb * item.qty / 100;
    });
    return t;
  }

  let totals = getTotals();
  let denom  = totals.prot * 0.6 + totals.nc;
  let curRatio = denom > 0 ? totals.fat / denom : 0;
  if(curRatio >= targetRatio) return;

  // ── خطوة 1: قلّل مصادر الكارب العالية ──
  const highCarbItems = calcItems.filter(function(i){
    if(typeof i.fid !== 'number') return false;
    const f = FOODS.find(function(x){ return x.id===i.fid; });
    return f && f.net_carb > 5 && i.qty > 10;
  }).sort(function(a,b){
    const fa = FOODS.find(function(x){ return x.id===a.fid; });
    const fb = FOODS.find(function(x){ return x.id===b.fid; });
    return (fb.net_carb*b.qty) - (fa.net_carb*a.qty); // الأعلى كارب أولاً
  });

  for(let attempt = 0; attempt < 3 && curRatio < targetRatio; attempt++){
    highCarbItems.forEach(function(item){
      if(curRatio >= targetRatio) return;
      const f = FOODS.find(function(x){ return x.id===item.fid; });
      if(!f) return;
      const minQty = Math.max(f.qty_moderate ? f.qty_moderate * 0.25 : 10, 5);
      if(item.qty <= minQty) return;
      // قلّل بـ 25% في كل مرة
      item.qty = Math.max(Math.round(item.qty * 0.75 / 5) * 5, minQty);
      // حدّث _sel
      const uType = _calcGetUnitType(item.fid);
      if(uType && !uType.startsWith('_')) item._sel = _buildSelForItem(uType, item.fid, item.qty);
      else if(uType === '_fruit') item._sel = {fruit_amount: item.qty};
      totals = getTotals();
      denom  = totals.prot * 0.6 + totals.nc;
      curRatio = denom > 0 ? totals.fat / denom : 0;
    });
  }

  if(curRatio >= targetRatio) return;

  // ── خطوة 2: إذا لم يكفِ → زد الدهن ──
  const fatItem = calcItems.find(function(i){
    if(typeof i.fid !== 'number') return false;
    const f = FOODS.find(function(x){ return x.id===i.fid; });
    return f && f.fat > 30;
  });
  if(!fatItem) return;

  totals = getTotals();
  denom  = totals.prot * 0.6 + totals.nc;
  if(denom <= 0) return;
  const fatNeeded = Math.max(targetRatio * denom - totals.fat, 0);
  if(fatNeeded <= 0) return;

  const f2 = FOODS.find(function(x){ return x.id===fatItem.fid; });
  if(!f2 || !f2.fat) return;
  const addGrams = Math.round(fatNeeded / f2.fat * 100 / 5) * 5;
  fatItem.qty = Math.min(fatItem.qty + addGrams, 60); // سقف 60غ للدهون
  const uType2 = _calcGetUnitType(fatItem.fid);
  if(uType2 && !uType2.startsWith('_'))
    fatItem._sel = _buildSelForItem(uType2, fatItem.fid, fatItem.qty);
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
  const cur = parseFloat(item._sel[stepKey]) || 1;
  item._sel[stepKey] = Math.max(min, Math.min(max, Math.round((cur + delta) * 10) / 10));
  const isExt  = String(item.fid).startsWith('ext:');
  const numFid = isExt ? null : parseInt(item.fid);
  const uType  = isExt ? item.fid.replace('ext:','') : (typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(numFid) : null);
  if(uType && typeof calcGramsFromSel!=='undefined'){
    item.qty = calcGramsFromSel(uType, item._sel, numFid||item.fid) || item.qty;
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
  const step = item.qty >= 100 ? 10 : item.qty >= 20 ? 5 : 1;
  item.qty = Math.max(1, item.qty + dir * step);
  // حاول تحديث الـ _sel ليتوافق مع الكمية الجديدة
  rCalc();
}


/* ─── فتح wizard الوحدة ─── */

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
      const unitType = typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(numFid) : null;
      const defSel   = unitType ? _getDefaultSel(unitType, numFid) : {};
      const qty      = (unitType && typeof calcGramsFromSel!=='undefined')
        ? (calcGramsFromSel(unitType, defSel, numFid) || 100) : 100;
      calcItems.push({fid:numFid, qty:qty, _sel:defSel});
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
    sel.leaf_unit   = 'cup';
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
  const mem2 = MEMBERS.find(function(m){ return m.uid === (CU && CU.id); });
  const prefs2 = (mem2 && typeof getMemPrefs!=='undefined') ? getMemPrefs(mem2) : {};
  proteins.forEach(function(f){
    const unitType = typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(f.id) : null;
    // بناء defSel ذكي
    const defSel = unitType ? _getDefaultSel(unitType, f.id) : {};
    // البيض: استخدم التفضيلات (عدد البيضات المفضل)
    if(unitType === 'egg'){
      defSel.egg_size  = 'medium'; // 55غ
      defSel.egg_count = prefs2.preferred_egg_count || 2;
      defSel.egg_type  = 'regular';
    }
    // الدجاج: صدر متوسط افتراضي
    if(unitType === 'chicken'){
      defSel.chicken_cut   = 'breast_no';
      defSel.chicken_count = 1;
      defSel.chicken_state = 'raw';
    }
    const qty = (unitType && typeof calcGramsFromSel!=='undefined')
      ? calcGramsFromSel(unitType, defSel, f.id)
      : Math.min(Math.max(Math.round(((rem.protein||30)/Math.max(proteins.length,1))/f.protein*100/5)*5, 50), 200);
    calcItems.push({fid:f.id, qty:Math.max(qty||50, 10), _sel:defSel});
  });

  // احسب ما تبقى من دهن بعد البروتين
  const protFat = calcItems.reduce((s,i)=>{
    const f=FOODS.find(x=>x.id===i.fid); return s+(f?f.fat*i.qty/100:0);
  },0);
  const fatTarget = Math.max((rem.fat||40) - protFat, 10);

  // أضف الدهون — مع _sel ذكي
  fats.forEach(function(f){
    const unitType = typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(f.id) : null;
    const share    = fatTarget / Math.max(fats.length,1);
    let defSel = unitType ? _getDefaultSel(unitType, f.id) : {};

    let qty;
    if(unitType === 'oil'){
      // زيت → ملاعق كبيرة: كم ملعقة تحقق الهدف؟
      const tbspNeeded = Math.round(share / 12.4); // 14غ × 0.886 = 12.4غ دهن/ملعقة
      const tbspFinal  = Math.max(Math.min(tbspNeeded, 3), 1);
      defSel = {oil_unit:'tbsp', oil_amount:tbspFinal};
      qty = tbspFinal * 14;
    } else if(unitType === 'butter'){
      const tbspNeeded = Math.round(share / 11.3); // 14غ × 0.81 = 11.3غ دهن/ملعقة
      const tbspFinal  = Math.max(Math.min(tbspNeeded, 2), 1);
      defSel = {butter_unit:'tbsp', butter_amount:tbspFinal};
      qty = tbspFinal * 14;
    } else if(unitType === 'avocado'){
      // نصف أفوكادو متوسطة افتراضياً
      defSel = {avo_size:'medium', avo_portion:'half'};
      qty = typeof calcGramsFromSel!=='undefined' ? calcGramsFromSel(unitType, defSel, f.id) : 49;
    } else if(unitType === 'nuts'){
      defSel = {nut_unit:'handful', nut_amount:1};
      qty = 25;
    } else if(unitType === 'cheese'){
      defSel = {cheese_unit:'slice', cheese_amount:2};
      qty = 40;
    } else {
      // دهن غير معروف → حساب رقمي
      qty = f.fat>0 ? Math.round(Math.min(share/f.fat*100, f.fat>=80?35:60)/5)*5 : 15;
    }
    calcItems.push({fid:f.id, qty:Math.max(qty||10, 5), _sel:defSel});
  });

  // أضف الخضار — مع _sel ذكي
  vegs.forEach(function(f){
    const unitType = typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(f.id) : null;
    let defSel = {};
    let qty = 80;
    if(unitType === 'leafy_veg'){
      defSel = {leaf_unit:'cup', leaf_amount:1};
      qty = 60;
    } else if(unitType === 'whole_veg'){
      defSel = {veg_unit:'piece', veg_size:'medium', veg_amount:1};
      qty = typeof calcGramsFromSel!=='undefined' ? calcGramsFromSel(unitType, defSel, f.id) : 100;
    } else if(unitType === 'avocado'){
      defSel = {avo_size:'medium', avo_portion:'half'};
      qty = 49;
    }
    calcItems.push({fid:f.id, qty:qty, _sel:defSel});
  });

  // أضف البقية
  rest.forEach(function(f){
    const unitType = typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(f.id) : null;
    const defSel   = unitType ? _getDefaultSel(unitType, f.id) : {};
    const qty      = (unitType && typeof calcGramsFromSel!=='undefined')
      ? calcGramsFromSel(unitType, defSel, f.id) || 30 : 30;
    calcItems.push({fid:f.id, qty:qty, _sel:defSel});
  });

  // تحقق من حد الكارب وقلل الخضار إذا لزم
  const totalNc = calcItems.reduce((s,i)=>{const f=FOODS.find(x=>x.id===i.fid);return s+(f?f.net_carb*i.qty/100:0);},0);
  if(totalNc > carbMax && carbMax !== 999){
    calcItems.forEach(item=>{
      const f=FOODS.find(x=>x.id===item.fid);
      if(f&&f.net_carb>2) item.qty = Math.max(Math.round(item.qty*(carbMax/totalNc)/5)*5,20);
    });
  }

  // أعد حساب qty من _sel لكل صنف — لضمان التطابق
  calcItems.forEach(function(item){
    const isExt   = typeof item.fid === 'string' && item.fid.startsWith('ext:');
    const numFid  = isExt ? null : parseInt(item.fid);
    const unitType= isExt ? item.fid.replace('ext:','')
      : (typeof getUnitTypeForFid!=='undefined' ? getUnitTypeForFid(numFid) : null);
    if(unitType && item._sel && typeof calcGramsFromSel!=='undefined'){
      const recalc = calcGramsFromSel(unitType, item._sel, numFid||item.fid);
      if(recalc && recalc > 0) item.qty = recalc;
    }
  });

  _calcBuilt = true;
  _calcMode  = 'manual';
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

