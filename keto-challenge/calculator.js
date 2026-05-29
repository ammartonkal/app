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

  const mem    = MEMBERS.find(function(m){ return m.uid===(CU&&CU.id); });
  const prefs  = mem && typeof getMemPrefs!=='undefined' ? getMemPrefs(mem) : {};
  const phase  = mem ? (mem.phase||1) : 1;
  const mealsN = prefs.meals_per_day || 3;
  const hasSnack = prefs.has_snack || false;

  // أهداف اليوم
  const dayTargets = mem && typeof getTargetForDate!=='undefined'
    ? getTargetForDate(mem) : {fat:130,protein:110,carb:25,cal:1800};

  // المتبقي (إذا وجبة ثانية أو ثالثة)
  const todayMls = mem && typeof getTodayMeals!=='undefined' ? getTodayMeals(mem.uid) : [];
  const remaining = mem && typeof calcRemainingAfterMeals!=='undefined'
    ? calcRemainingAfterMeals(mem, todayMls)
    : {fat:dayTargets.fat, protein:dayTargets.protein, carb:dayTargets.carb||25, cal:dayTargets.cal};

  // نوع الوجبة وحصتها
  const mealTypeInfo = mem && typeof getMealType!=='undefined' ? getMealType(mem) : null;
  const mealType = mealTypeInfo ? mealTypeInfo.type : 'other';
  const mealIdx  = {breakfast:0,lunch:1,dinner:2}[mealType]||0;
  const SHARES   = {
    3: [0.30, 0.35, 0.35],
    2: [0.45, 0.55],
  };
  const shares = SHARES[mealsN] || [0.33,0.33,0.34];
  const share  = shares[mealIdx] || 0.33;

  // أهداف هذه الوجبة من المتبقي
  const mealTargets = {
    fat:     Math.round(Math.min(remaining.fat     * share / (1 - shares.slice(0,mealIdx).reduce(function(s,x){return s+x;},0)||1), remaining.fat)),
    protein: Math.round(Math.min(remaining.protein * share / (1 - shares.slice(0,mealIdx).reduce(function(s,x){return s+x;},0)||1), remaining.protein)),
    carb:    Math.min(remaining.carb||25, _calcCarbLimit===999 ? Math.round((dayTargets.carb||25)*share) : _calcCarbLimit),
    cal:     Math.round(remaining.cal * share / (1 - shares.slice(0,mealIdx).reduce(function(s,x){return s+x;},0)||1)),
  };

  // النسبة الكيتونية المستهدفة حسب المرحلة
  const KETO_BY_PHASE = {0:1.2, 1:1.6, 2:1.8, 3:2.0, 4:2.0, 5:1.8, 6:1.6, 7:1.6};
  const ketoTarget = KETO_BY_PHASE[phase] || 1.6;

  // حد sat_fat
  const dailySatLim = mem && typeof getSatFatDailyLimit!=='undefined' ? getSatFatDailyLimit(mem) : null;
  const mealSatLim  = dailySatLim ? Math.round(dailySatLim * share) : null;

  // ── تصنيف الأصناف المختارة ──
  const selFids  = _calcSelected.filter(function(id){ return typeof id==='number'; });
  const selFoods = selFids.map(function(id){ return FOODS.find(function(f){ return f.id===id; }); }).filter(Boolean);

  // مصادر الكارب: خضار + فواكه + مكسرات + ألبان (net_carb > 0.5)
  const carbSrcs  = selFoods.filter(function(f){ return f.net_carb>0.5 && f.protein<15 && f.fat<25; });
  // مصادر البروتين: protein > 8 أو بيض
  const protSrcs  = selFoods.filter(function(f){ return f.protein>8 || f.id===10; });
  // مصادر الدهون: fat > 25 وليست بروتين عالٍ
  const fatSrcs   = selFoods.filter(function(f){
    return f.fat>25 && f.protein<10 &&
           !carbSrcs.find(function(c){ return c.id===f.id; }) &&
           !protSrcs.find(function(p){ return p.id===f.id; });
  });

  calcItems = [];

  // ════ الخطوة 1: مصادر الكارب — 60% من حد الكارب ════
  const carbBudget60 = mealTargets.carb * 0.60;
  const perCarbSrc   = carbBudget60 / Math.max(carbSrcs.length, 1);

  const carbContrib = {fat:0, prot:0, nc:0, cal:0};
  carbSrcs.forEach(function(f){
    if(f.net_carb <= 0) return;
    const rawG = perCarbSrc / f.net_carb * 100;
    const qty  = _snapToFriendlyCarb(rawG, f);
    const q    = qty/100;
    carbContrib.fat  += f.fat      *q;
    carbContrib.prot += f.protein  *q;
    carbContrib.nc   += f.net_carb *q;
    carbContrib.cal  += f.cal      *q;
    const uType  = _calcGetUnitType(f.id);
    const defSel = _buildSelForQty(uType, f.id, qty, f);
    calcItems.push({fid:f.id, qty:qty, _sel:defSel});
  });

  // ════ الخطوة 2: البروتين — 80% من متبقي البروتين ════
  const protAfterCarb  = Math.max(mealTargets.protein - carbContrib.prot, 0);
  const protBudget80   = protAfterCarb * 0.80;
  const perProtSrc     = protBudget80 / Math.max(protSrcs.length, 1);

  const protContrib = {fat:0, prot:0, nc:0, cal:0};
  protSrcs.forEach(function(f){
    if(f.protein <= 0) return;
    const rawG = perProtSrc / f.protein * 100;
    const qty  = _snapToFriendlyProt(rawG, f);
    const q    = qty/100;
    protContrib.fat  += f.fat      *q;
    protContrib.prot += f.protein  *q;
    protContrib.nc   += f.net_carb *q;
    protContrib.cal  += f.cal      *q;
    const uType  = _calcGetUnitType(f.id);
    const defSel = _buildSelForQty(uType, f.id, qty, f);
    calcItems.push({fid:f.id, qty:qty, _sel:defSel});
  });

  // ════ الخطوة 3: الدهون المضافة ════
  const fatUsed     = carbContrib.fat + protContrib.fat;
  const ncUsed      = carbContrib.nc  + protContrib.nc;
  const protUsed    = carbContrib.prot + protContrib.prot;
  const calUsed     = carbContrib.cal + protContrib.cal;

  // الدهن المطلوب لتحقيق النسبة الكيتونية
  const denom       = protUsed*0.6 + ncUsed;
  const fatForKeto  = denom>0 ? Math.max(ketoTarget*denom - fatUsed, 0) : 0;
  // الدهن لإكمال هدف الوجبة
  const fatForGoal  = Math.max(mealTargets.fat - fatUsed, 0);
  // الدهن المطلوب = الأكبر من الاثنين، مع مراعاة حد السعرات
  const calRemain   = Math.max(mealTargets.cal * 1.20 - calUsed, 0);
  const fatFromCal  = calRemain / 9;
  const fatToAdd    = Math.min(Math.max(fatForKeto, fatForGoal), fatFromCal);

  const perFatSrc   = fatSrcs.length>0 ? fatToAdd / fatSrcs.length : 0;

  fatSrcs.forEach(function(f){
    if(f.fat<=0) return;
    let rawG = perFatSrc / f.fat * 100;
    // sat_fat check
    if(mealSatLim){
      const estSat = (f.sat_fat||0)*rawG/100;
      if(estSat > mealSatLim*0.5) rawG = mealSatLim*0.5/((f.sat_fat||1)/100);
    }
    const qty    = _snapToFriendlyFat(rawG, f);
    const uType  = _calcGetUnitType(f.id);
    const defSel = _buildSelForQty(uType, f.id, qty, f);
    calcItems.push({fid:f.id, qty:qty, _sel:defSel});
  });

  // الأصناف الخارجية (خبز، أرز)
  _calcSelected.filter(function(id){ return typeof id==='string'&&id.startsWith('ext:'); })
    .forEach(function(extId){
      const uType = extId.replace('ext:','');
      const sel   = _getDefaultSel(uType, null);
      calcItems.push({fid:extId, qty:50, _sel:sel});
    });

  // ════ تحقق نهائي + تقرير ════
  const finalTot = _calcTotalsAll();
  console.log('[Calc] نتيجة البناء:', finalTot);

  _calcBuilt = true;
  _calcMode  = 'manual';
  rCalc();
}

/* ─── تقريب الكميات ─── */
function _snapToFriendlyCarb(rawG, food){
  const type = _calcGetUnitType(food.id);
  if(type === '_fruit' || food.cat === 'فواكه'){
    const snaps = [5,10,15,20,25,30,40,50];
    return Math.max(5, _nearestInList(rawG, snaps));
  }
  if(type === 'leafy_veg' || type === '_veg_generic'){
    const snaps = [30,60,80,100,120,150];
    return _nearestInList(rawG, snaps);
  }
  if(type === 'whole_veg'){
    const base  = (UNIT_INTELLIGENCE&&UNIT_INTELLIGENCE.whole_veg&&UNIT_INTELLIGENCE.whole_veg.BASE_GRAMS)
      ? (UNIT_INTELLIGENCE.whole_veg.BASE_GRAMS[food.id]||100) : 100;
    const fracs = [0.25,0.33,0.5,0.67,0.75,1,1.25,1.5,2];
    const best  = fracs.reduce(function(p,f){ return Math.abs(f*base-rawG)<Math.abs(p*base-rawG)?f:p; },1);
    return Math.round(best*base/5)*5;
  }
  if(type === 'nuts'){
    const snaps = [10,15,20,25,30,40];
    return _nearestInList(rawG, snaps);
  }
  if(type === 'cheese'){
    const snaps = [15,20,30,40,50,60];
    return _nearestInList(rawG, snaps);
  }
  return Math.max(5, Math.round(rawG/5)*5);
}

function _snapToFriendlyProt(rawG, food){
  const type = _calcGetUnitType(food.id);
  if(type === 'egg'){
    const eggW = 55; // متوسط
    const count = Math.max(1, Math.round(rawG/eggW));
    return count * eggW;
  }
  if(type === 'chicken' || type === 'beef' || type === 'fish'){
    // مضاعفات 50
    const snap = Math.max(50, Math.round(rawG/50)*50);
    return Math.min(snap, 300);
  }
  if(type === 'cheese'){
    const snap = Math.max(30, Math.round(rawG/30)*30);
    return Math.min(snap, 150);
  }
  return Math.max(30, Math.round(rawG/10)*10);
}

function _snapToFriendlyFat(rawG, food){
  const type = _calcGetUnitType(food.id);
  if(type === 'oil' || type === 'butter'){
    // ملاعق: م.ص=5، نصف م.ك=7، م.ك=14، 1.5م.ك=21، 2م.ك=28
    const spoons = [5,7,10,14,21,28];
    return _nearestInList(rawG, spoons);
  }
  if(type === 'avocado'){
    // ربع، نصف، ثلاثة أرباع، كاملة
    const base = 150*0.65; // متوسطة لب
    const fracs = [0.25,0.5,0.75,1];
    const best  = fracs.reduce(function(p,f){ return Math.abs(f*base-rawG)<Math.abs(p*base-rawG)?f:p; },0.5);
    return Math.round(best*base/5)*5;
  }
  if(type === 'nuts'){
    const snaps = [15,20,25,30,40];
    return _nearestInList(rawG, snaps);
  }
  return Math.max(5, Math.round(rawG/5)*5);
}

function _nearestInList(val, list){
  return list.reduce(function(p,c){ return Math.abs(c-val)<Math.abs(p-val)?c:p; });
}

/* ─── بناء _sel من qty المحسوبة ─── */
function _buildSelForQty(uType, fid, qty, food){
  if(!uType) return {};
  if(uType === '_fruit')     return {fruit_amount: qty};
  if(uType === '_veg_generic') return {generic_qty: qty};
  if(uType === 'egg'){
    const count = Math.max(1, Math.round(qty/55));
    return {egg_type:'regular', egg_size:'medium', egg_count:count};
  }
  if(uType === 'oil'){
    const tbsp = Math.max(0.5, Math.round(qty/14*2)/2);
    return {oil_unit: tbsp<1 ? 'tsp' : 'tbsp', oil_amount: tbsp<1 ? Math.round(qty/5) : tbsp};
  }
  if(uType === 'butter'){
    const tbsp = Math.max(0.5, Math.round(qty/14*2)/2);
    return {butter_unit: tbsp<1 ? 'tsp' : 'tbsp', butter_amount: tbsp<1 ? Math.round(qty/5) : tbsp};
  }
  if(uType === 'avocado'){
    const lbGrams = 97.5; // متوسطة لب
    const frac = qty/lbGrams;
    const portions = [{val:'quarter',f:0.25},{val:'half',f:0.5},{val:'whole',f:1}];
    const best = portions.reduce(function(p,c){ return Math.abs(c.f-frac)<Math.abs(p.f-frac)?c:p; });
    return {avo_size:'medium', avo_portion:best.val};
  }
  if(uType === 'leafy_veg'){
    const cups = Math.max(0.5, Math.round(qty/60*2)/2);
    return {leaf_unit:'cup', leaf_amount:cups};
  }
  if(uType === 'whole_veg'){
    const base = (UNIT_INTELLIGENCE&&UNIT_INTELLIGENCE.whole_veg&&UNIT_INTELLIGENCE.whole_veg.BASE_GRAMS)
      ? (UNIT_INTELLIGENCE.whole_veg.BASE_GRAMS[fid]||100) : 100;
    const frac = qty/base;
    const sz   = frac<0.85?'small':frac>1.25?'large':'medium';
    return {veg_unit:'piece', veg_size:sz, veg_amount:1};
  }
  if(uType === 'chicken'){
    const cuts = {breast_no:120,breast_sk:130,thigh_no:100,thigh_sk:120,wing:60,drumstick:80};
    const bestCut = Object.keys(cuts).reduce(function(p,c){ return Math.abs(cuts[c]-qty)<Math.abs(cuts[p]-qty)?c:p; },'breast_no');
    const count = Math.max(1,Math.round(qty/cuts[bestCut]));
    return {chicken_cut:bestCut, chicken_count:count, chicken_state:'raw'};
  }
  if(uType === 'fish'){
    const srvs = {salmon:130,tuna:85,sardine:100,white:150,shrimp:150};
    const bestType = Object.keys(srvs).reduce(function(p,c){
      if(!FOODS.find(function(f2){ return f2.id===fid&&c==='tuna'; })) return p;
      return Math.abs(srvs[c]-qty)<Math.abs(srvs[p]-qty)?c:p;
    },'white');
    return {fish_type:bestType, fish_amount:Math.max(0.5,Math.round(qty/srvs[bestType]*2)/2)};
  }
  if(uType === 'nuts'){
    const handful = Math.max(0.5, Math.round(qty/25*2)/2);
    return {nut_unit:'handful', nut_amount:handful};
  }
  if(uType === 'cheese'){
    const slices = Math.max(1, Math.round(qty/20));
    return {cheese_unit:'slice', cheese_amount:slices};
  }
  return _getDefaultSel(uType, fid);
}

/* ─── إجمالي كل المكونات (داخلية + خارجية) ─── */
function _calcTotalsAll(){
  const t = {fat:0,prot:0,nc:0,cal:0,sat:0};
  calcItems.forEach(function(item){
    if(typeof item.fid==='number'){
      const f=FOODS.find(function(x){ return x.id===item.fid; });
      if(!f) return;
      const q=item.qty/100;
      t.fat+=f.fat*q; t.prot+=f.protein*q;
      t.nc+=f.net_carb*q; t.cal+=f.cal*q; t.sat+=(f.sat_fat||0)*q;
    } else if(typeof item.fid==='string'){
      const uType=item.fid.replace('ext:','');
      const em=typeof getExternalMacros!=='undefined'?getExternalMacros(uType,item._sel||{},item.qty):null;
      if(em){ t.fat+=em.fat||0; t.prot+=em.prot||0; t.nc+=em.nc||0; t.cal+=em.cal||0; }
    }
  });
  return {
    fat:Math.round(t.fat*10)/10, prot:Math.round(t.prot*10)/10,
    nc:Math.round(t.nc*10)/10,   cal:Math.round(t.cal),
    sat:Math.round(t.sat*10)/10
  };
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


