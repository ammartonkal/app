/* ════════════════════════════════════════════════════════════════
   db-unit-intelligence.js — نظام الوحدات الذكية
   تحدي الكيتو مع د. عمار تنكل
   ─────────────────────────────────────────────────────────────
   كل صنف له وحداته الطبيعية + خطوات اختيار تعليمية
   المستخدم يختار: النوع → الحجم → الكمية → يظهر تلقائياً بالغرام

   هيكل كل صنف:
   {
     type       : مفتاح النوع
     label      : اسم العرض
     fids       : الـ fids المرتبطة في FOODS
     warning    : تحذير (للأصناف خارج الكيتو)
     steps      : خطوات الاختيار
     toGram(sel): دالة تحويل الاختيار → غرام
     displayFn  : دالة عرض الملخص
   }
════════════════════════════════════════════════════════════════ */

const UNIT_INTELLIGENCE = {

  /* ── بيض ───────────────────────────────────────────── */
  egg: {
    label: 'بيض',
    fids: [10],
    steps: [
      {
        key: 'egg_type', label: 'نوع البيض',
        options: [
          { val:'baladi',   label:'بلدي / عضوي 🌿', note:'أغنى بالأوميغا 3 والفيتامينات' },
          { val:'regular',  label:'عادي (مزرعة)',   note:'الأكثر توفراً' },
        ]
      },
      {
        key: 'egg_size', label: 'الحجم',
        options: [
          { val:'small',   label:'صغير',      grams:45,  note:'≈45غ' },
          { val:'medium',  label:'متوسط',     grams:55,  note:'≈55غ — الأكثر شيوعاً' },
          { val:'large',   label:'كبير',      grams:65,  note:'≈65غ' },
          { val:'xlarge',  label:'كبير جداً', grams:75,  note:'≈75غ' },
        ]
      },
      {
        key: 'egg_count', label: 'العدد',
        type: 'number', min:1, max:10, step:1, default:2,
        unit: 'بيضة'
      }
    ],
    toGram(sel) {
      const size = this.steps[1].options.find(o=>o.val===sel.egg_size) || {grams:55};
      return (sel.egg_count||2) * size.grams;
    },
    display(sel, grams) {
      const size = this.steps[1].options.find(o=>o.val===sel.egg_size);
      const type = this.steps[0].options.find(o=>o.val===sel.egg_type);
      return `${sel.egg_count||2} بيضة ${size?.label||'متوسط'} ${type?.label||''} = ${grams}غ`;
    }
  },

  /* ── دجاج ───────────────────────────────────────────── */
  chicken: {
    label: 'دجاج',
    fids: [11, 12],
    steps: [
      {
        key: 'chicken_cut', label: 'القطعة',
        options: [
          { val:'breast_no', label:'صدر بدون جلد 🏆', fid:12, grams_each:120, note:'أعلى بروتين وأقل دهن' },
          { val:'breast_sk', label:'صدر بجلد',          fid:11, grams_each:130, note:'دهن أعلى قليلاً' },
          { val:'thigh_no',  label:'فخذ بدون جلد',     fid:12, grams_each:100, note:'أطرى من الصدر' },
          { val:'thigh_sk',  label:'فخذ بجلد',          fid:11, grams_each:120, note:'نكهة أغنى ودهن أعلى' },
          { val:'wing',      label:'جناح',              fid:11, grams_each:60,  note:'~60غ/جناح' },
          { val:'drumstick', label:'ساق (دجاجة كاملة)',fid:11, grams_each:80,  note:'~80غ/ساق' },
        ]
      },
      {
        key: 'chicken_count', label: 'العدد',
        type: 'number', min:1, max:10, step:1, default:1,
        unit: 'قطعة'
      },
      {
        key: 'chicken_state', label: 'الحالة عند القياس',
        options: [
          { val:'raw',     label:'نيء',   mult:1.00, note:'الوزن قبل الطهي' },
          { val:'cooked',  label:'مطبوخ', mult:0.75, note:'يفقد ~25% من وزنه بالطهي' },
          { val:'grilled', label:'مشوي',  mult:0.70, note:'يفقد ~30% من وزنه بالشوي' },
        ]
      }
    ],
    toGram(sel) {
      const cut   = this.steps[0].options.find(o=>o.val===sel.chicken_cut) || {grams_each:120};
      const state = this.steps[2].options.find(o=>o.val===sel.chicken_state) || {mult:1};
      return Math.round((sel.chicken_count||1) * cut.grams_each * state.mult);
    },
    getFid(sel) {
      const cut = this.steps[0].options.find(o=>o.val===sel.chicken_cut);
      return cut?.fid || 12;
    },
    display(sel, grams) {
      const cut   = this.steps[0].options.find(o=>o.val===sel.chicken_cut);
      const state = this.steps[2].options.find(o=>o.val===sel.chicken_state);
      return `${sel.chicken_count||1} ${cut?.label||'صدر'} دجاج ${state?.label||''} = ${grams}غ`;
    }
  },

  /* ── لحم بقر ─────────────────────────────────────── */
  beef: {
    label: 'لحم بقر',
    fids: [13, 14, 15],
    steps: [
      {
        key: 'beef_cut', label: 'النوع',
        options: [
          { val:'ground_f', label:'مفروم دهني 80/20',         fid:14, note:'للكباب والبرغر' },
          { val:'ground_l', label:'مفروم خفيف 90/10',        fid:15, note:'أقل دهناً' },
          { val:'steak_f',  label:'ستيك دهني (ضلع/ريش)',    fid:13, note:'Ribeye — أكثر طعماً' },
          { val:'steak_l',  label:'ستيك خفيف (فيليه/سيرلوين)',fid:15,note:'أقل دهناً' },
          { val:'lamb_rib', label:'ضلع خروف',                fid:16, note:'غني بالدهون الصحية' },
          { val:'lamb_leg', label:'كباب خروف',               fid:16, note:'مناسب للشوي' },
        ]
      },
      {
        key: 'beef_weight', label: 'الوزن',
        options: [
          { val:'50',    label:'50غ  (قطعة صغيرة)' },
          { val:'100',   label:'100غ (حصة متوسطة)' },
          { val:'150',   label:'150غ (ستيك صغير)' },
          { val:'200',   label:'200غ (ستيك متوسط)' },
          { val:'250',   label:'250غ (ستيك كبير)' },
          { val:'custom',label:'أدخل الوزن يدوياً...' },
        ]
      },
      {
        key: 'beef_custom', label: 'الوزن بالغرام',
        type: 'number', min:20, max:500, step:10, default:150,
        show_if: { key:'beef_weight', val:'custom' }
      }
    ],
    toGram(sel) {
      if(sel.beef_weight === 'custom') return sel.beef_custom || 150;
      return parseInt(sel.beef_weight) || 150;
    },
    getFid(sel) {
      const cut = this.steps[0].options.find(o=>o.val===sel.beef_cut);
      return cut?.fid || 14;
    },
    display(sel, grams) {
      const cut = this.steps[0].options.find(o=>o.val===sel.beef_cut);
      return `${cut?.label||'لحم'} = ${grams}غ`;
    }
  },

  /* ── سمك وبحريات ──────────────────────────────────── */
  fish: {
    label: 'سمك وبحريات',
    fids: [17, 18, 19, 20, 21],
    steps: [
      {
        key: 'fish_type', label: 'النوع',
        options: [
          { val:'salmon',  label:'سلمون طازج 🥇',   fid:17, grams_serving:130, unit:'فيليه',  note:'أعلى أوميغا 3' },
          { val:'sardine', label:'ساردين معلب',     fid:18, grams_serving:100, unit:'علبة',   note:'غني بالكالسيوم' },
          { val:'tuna',    label:'تونة بالماء',     fid:19, grams_serving:85,  unit:'علبة',   note:'بروتين عالٍ — دهن منخفض' },
          { val:'white',   label:'سمك أبيض (هامور/نجيل)',fid:20,grams_serving:150,unit:'فيليه',note:'خفيف ولذيذ' },
          { val:'shrimp',  label:'جمبري',           fid:21, grams_serving:150, unit:'حصة',   note:'أضف دهناً لرفع النسبة' },
        ]
      },
      {
        key: 'fish_amount', label: 'الكمية',
        type: 'number', min:0.5, max:5, step:0.5, default:1,
        unit_from: 'fish_type'  // يأخذ الوحدة من النوع المختار
      }
    ],
    toGram(sel) {
      const t = this.steps[0].options.find(o=>o.val===sel.fish_type) || {grams_serving:130};
      return Math.round((sel.fish_amount||1) * t.grams_serving);
    },
    getFid(sel) {
      const t = this.steps[0].options.find(o=>o.val===sel.fish_type);
      return t?.fid || 17;
    },
    display(sel, grams) {
      const t = this.steps[0].options.find(o=>o.val===sel.fish_type);
      return `${sel.fish_amount||1} ${t?.unit||'فيليه'} ${t?.label||'سمك'} = ${grams}غ`;
    }
  },

  /* ── زيوت ─────────────────────────────────────────── */
  oil: {
    label: 'زيوت',
    fids: [1, 2, 6, 7, 9],
    steps: [
      {
        key: 'oil_unit', label: 'الوحدة',
        options: [
          { val:'tsp',   label:'ملعقة صغيرة',    grams:5,  note:'≈5غ' },
          { val:'tbsp',  label:'ملعقة كبيرة 🥄', grams:14, note:'≈14غ — الأكثر استخداماً' },
          { val:'gram',  label:'بالغرام',          grams:1  },
        ]
      },
      {
        key: 'oil_amount', label: 'الكمية',
        type: 'number', min:0.5, max:20, step:0.5, default:1
      }
    ],
    toGram(sel) {
      const u = this.steps[0].options.find(o=>o.val===sel.oil_unit) || {grams:14};
      return Math.round((sel.oil_amount||1) * u.grams);
    },
    display(sel, grams) {
      const u = this.steps[0].options.find(o=>o.val===sel.oil_unit);
      return `${sel.oil_amount||1} ${u?.label||'ملعقة كبيرة'} = ${grams}غ`;
    }
  },

  /* ── زبدة وسمن ─────────────────────────────────────── */
  butter: {
    label: 'زبدة وسمن',
    fids: [3, 4, 5, 8],
    steps: [
      {
        key: 'butter_unit', label: 'الوحدة',
        options: [
          { val:'tsp',   label:'ملعقة صغيرة (5غ)',   grams:5  },
          { val:'tbsp',  label:'ملعقة كبيرة (14غ) 🥄',grams:14 },
          { val:'pat',   label:'قطعة صغيرة (7غ)',     grams:7,  note:'Pat of butter' },
          { val:'gram',  label:'بالغرام',              grams:1  },
        ]
      },
      {
        key: 'butter_amount', label: 'الكمية',
        type: 'number', min:0.5, max:10, step:0.5, default:1
      }
    ],
    toGram(sel) {
      const u = this.steps[0].options.find(o=>o.val===sel.butter_unit) || {grams:14};
      return Math.round((sel.butter_amount||1) * u.grams);
    },
    display(sel, grams) {
      const u = this.steps[0].options.find(o=>o.val===sel.butter_unit);
      return `${sel.butter_amount||1} ${u?.label||'ملعقة كبيرة'} = ${grams}غ`;
    }
  },

  /* ── أجبان ──────────────────────────────────────────── */
  cheese: {
    label: 'أجبان',
    fids: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    steps: [
      {
        key: 'cheese_unit', label: 'الوحدة',
        options: [
          { val:'slice',   label:'شريحة رفيعة (20غ)',           grams:20 },
          { val:'thick',   label:'شريحة سميكة (30غ)',           grams:30 },
          { val:'cube',    label:'مكعب 2سم (15غ)',               grams:15 },
          { val:'tbsp',    label:'ملعقة كبيرة — للجبن الطري',  grams:15, note:'جبنة كريمية، لبنة' },
          { val:'gram',    label:'بالغرام',                     grams:1  },
        ]
      },
      {
        key: 'cheese_amount', label: 'الكمية',
        type: 'number', min:0.5, max:20, step:0.5, default:2
      }
    ],
    toGram(sel) {
      const u = this.steps[0].options.find(o=>o.val===sel.cheese_unit) || {grams:20};
      return Math.round((sel.cheese_amount||2) * u.grams);
    },
    display(sel, grams) {
      const u = this.steps[0].options.find(o=>o.val===sel.cheese_unit);
      return `${sel.cheese_amount||2} ${u?.label||'شريحة'} = ${grams}غ`;
    }
  },

  /* ── خضار ورقية ─────────────────────────────────────── */
  leafy_veg: {
    label: 'خضار ورقية',
    fids: [62, 63, 64],
    steps: [
      {
        key: 'leaf_unit', label: 'الوحدة',
        options: [
          { val:'handful', label:'حفنة صغيرة (≈30غ)',           grams:30  },
          { val:'cup',     label:'كوب مضغوط (≈60غ)',            grams:60  },
          { val:'plate',   label:'طبق سلطة متوسط (≈100غ)',     grams:100 },
          { val:'gram',    label:'بالغرام',                     grams:1   },
        ]
      },
      {
        key: 'leaf_amount', label: 'الكمية',
        type: 'number', min:0.5, max:10, step:0.5, default:1
      }
    ],
    toGram(sel) {
      const u = this.steps[0].options.find(o=>o.val===sel.leaf_unit) || {grams:60};
      return Math.round((sel.leaf_amount||1) * u.grams);
    },
    display(sel, grams) {
      const u = this.steps[0].options.find(o=>o.val===sel.leaf_unit);
      return `${sel.leaf_amount||1} ${u?.label||'كوب'} = ${grams}غ`;
    }
  },

  /* ── خضار حبات ──────────────────────────────────────── */
  whole_veg: {
    label: 'خضار حبات',
    fids: [68, 69, 70, 71, 72, 73, 74, 75, 76, 78],
    BASE_GRAMS: { 68:80, 69:100, 70:100, 71:120, 72:120, 73:150, 74:120, 75:100, 76:200, 78:50 },
    steps: [
      {
        key: 'veg_unit', label: 'الوحدة',
        options: [
          { val:'piece', label:'حبة',             grams_mult:null },
          { val:'cup',   label:'كوب مقطع (80غ)', grams_mult:80   },
          { val:'gram',  label:'بالغرام',         grams_mult:1    },
        ]
      },
      {
        key: 'veg_size', label: 'الحجم (للحبة)',
        show_if: { key:'veg_unit', val:'piece' },
        options: [
          { val:'small',  label:'صغيرة',  mult:0.70 },
          { val:'medium', label:'متوسطة', mult:1.00 },
          { val:'large',  label:'كبيرة',  mult:1.40 },
        ]
      },
      {
        key: 'veg_amount', label: 'الكمية',
        type: 'number', min:0.5, max:10, step:0.5, default:1
      }
    ],
    toGram(sel, fid) {
      const base = this.BASE_GRAMS[fid] || 100;
      const unit = this.steps[0].options.find(o=>o.val===sel.veg_unit) || {grams_mult:null};
      const size = this.steps[1].options.find(o=>o.val===sel.veg_size) || {mult:1};
      const gramsPerUnit = unit.grams_mult !== null ? unit.grams_mult : base * size.mult;
      return Math.round((sel.veg_amount||1) * gramsPerUnit);
    },
    display(sel, grams) {
      const u = this.steps[0].options.find(o=>o.val===sel.veg_unit);
      const s = this.steps[1].options.find(o=>o.val===sel.veg_size);
      if(sel.veg_unit==='piece') return `${sel.veg_amount||1} حبة ${s?.label||'متوسطة'} = ${grams}غ`;
      return `${sel.veg_amount||1} ${u?.label||'حبة'} = ${grams}غ`;
    }
  },

  /* ── أفوكادو ─────────────────────────────────────────── */
  avocado: {
    label: 'أفوكادو',
    fids: [61],
    steps: [
      {
        key: 'avo_size', label: 'حجم الحبة',
        options: [
          { val:'small',   label:'صغيرة (120غ كاملة)',  grams_full:120 },
          { val:'medium',  label:'متوسطة (150غ كاملة)', grams_full:150 },
          { val:'large',   label:'كبيرة (200غ كاملة)',  grams_full:200 },
        ]
      },
      {
        key: 'avo_portion', label: 'الكمية',
        options: [
          { val:'quarter', label:'ربع حبة ¼',   frac:0.25 },
          { val:'half',    label:'نصف حبة ½ 🥑',frac:0.50 },
          { val:'whole',   label:'حبة كاملة',   frac:1.00 },
        ]
      }
    ],
    toGram(sel) {
      const size    = this.steps[0].options.find(o=>o.val===sel.avo_size)    || {grams_full:150};
      const portion = this.steps[1].options.find(o=>o.val===sel.avo_portion) || {frac:0.5};
      return Math.round(size.grams_full * portion.frac * 0.65); // 65% لب
    },
    display(sel, grams) {
      const s = this.steps[0].options.find(o=>o.val===sel.avo_size);
      const p = this.steps[1].options.find(o=>o.val===sel.avo_portion);
      return `${p?.label||'نصف'} أفوكادو ${s?.label||'متوسطة'} = ${grams}غ لب`;
    }
  },

  /* ── مكسرات وبذور ────────────────────────────────────── */
  nuts: {
    label: 'مكسرات وبذور',
    fids: [44, 45, 46, 47, 48, 50, 51, 55, 56, 59],
    GRAMS_PER_PIECE: { 44:2.5, 45:2.5, 46:1.2, 47:3.0, 48:4.0, 50:1.5, 51:1.8, 55:3, 56:3, 59:3 },
    steps: [
      {
        key: 'nut_unit', label: 'الوحدة',
        options: [
          { val:'piece',   label:'حبة',                    grams:null  },
          { val:'handful', label:'حفنة صغيرة (≈25غ)',     grams:25    },
          { val:'tbsp',    label:'ملعقة كبيرة (≈12غ)',    grams:12    },
          { val:'gram',    label:'بالغرام',                grams:1     },
        ]
      },
      {
        key: 'nut_amount', label: 'الكمية',
        type: 'number', min:1, max:50, step:1, default:10
      }
    ],
    toGram(sel, fid) {
      const u = this.steps[0].options.find(o=>o.val===sel.nut_unit);
      if(sel.nut_unit === 'piece'){
        const gpp = this.GRAMS_PER_PIECE[fid] || 2;
        return Math.round((sel.nut_amount||10) * gpp);
      }
      return Math.round((sel.nut_amount||1) * (u?.grams||25));
    },
    display(sel, grams, fid) {
      const u = this.steps[0].options.find(o=>o.val===sel.nut_unit);
      if(sel.nut_unit==='piece'){
        const gpp = this.GRAMS_PER_PIECE[fid] || 2;
        return `${sel.nut_amount||10} حبة (≈${gpp}غ/حبة) = ${grams}غ`;
      }
      return `${sel.nut_amount||1} ${u?.label||'حفنة'} = ${grams}غ`;
    }
  },

  /* ── خبز (خارج الكيتو) ──────────────────────────────── */
  bread: {
    label: 'خبز',
    fids: [],
    warning: '⚠️ خارج نظام الكيتو — يُستخدم للتوثيق في المراحل المرنة',
    warningClass: 'danger',
    BREAD_DATA: {
      white_toast:   { label:'توست أبيض',       cal:265, carb:49, fat:3,  prot:8,  nc:48  },
      brown_toast:   { label:'توست أسمر',       cal:247, carb:41, fat:3,  prot:9,  nc:40  },
      sourdough:     { label:'سوردو',           cal:268, carb:51, fat:1,  prot:9,  nc:50  },
      wrap:          { label:'تورتيلا / رابت',  cal:310, carb:53, fat:6,  prot:8,  nc:52  },
      samoli:        { label:'صامولي',          cal:270, carb:50, fat:3,  prot:9,  nc:49  },
      flatbread:     { label:'مفرود / رقاق',   cal:300, carb:56, fat:3,  prot:8,  nc:55  },
      keto_bread:    { label:'خبز كيتو (لوز)',  cal:110, carb:4,  fat:9,  prot:5,  nc:2,  keto:true },
    },
    steps: [
      {
        key: 'bread_type', label: 'نوع الخبز',
        options: [
          { val:'white_toast',label:'توست أبيض',         warning:true  },
          { val:'brown_toast',label:'توست أسمر',         warning:true  },
          { val:'sourdough',  label:'سوردو',             warning:true  },
          { val:'wrap',       label:'تورتيلا / رابت',   warning:true  },
          { val:'samoli',     label:'صامولي',            warning:true  },
          { val:'flatbread',  label:'مفرود / رقاق',     warning:true  },
          { val:'keto_bread', label:'خبز كيتو (دقيق لوز) ✓', keto:true },
        ]
      },
      {
        key: 'bread_unit', label: 'الحجم',
        options: [
          { val:'slice',  label:'شريحة توست (25غ)',   grams:25  },
          { val:'small',  label:'رغيف صغير (50غ)',    grams:50  },
          { val:'medium', label:'رغيف متوسط (80غ)',   grams:80  },
          { val:'large',  label:'رغيف كبير (120غ)',   grams:120 },
        ]
      },
      {
        key: 'bread_count', label: 'العدد',
        type: 'number', min:0.5, max:6, step:0.5, default:1
      }
    ],
    toGram(sel) {
      const u = this.steps[1].options.find(o=>o.val===sel.bread_unit) || {grams:25};
      return Math.round((sel.bread_count||1) * u.grams);
    },
    getMacros(sel, grams) {
      const data = this.BREAD_DATA[sel.bread_type] || this.BREAD_DATA.white_toast;
      const r = grams/100;
      return {
        fat:   Math.round(data.fat  *r*10)/10,
        prot:  Math.round(data.prot *r*10)/10,
        nc:    Math.round(data.nc   *r*10)/10,
        cal:   Math.round(data.cal  *r),
        sat:   Math.round(data.fat  *r*0.3*10)/10, // تقريبي
        fiber: Math.round((data.carb-data.nc)*r*10)/10,
      };
    },
    display(sel, grams) {
      const t = this.steps[0].options.find(o=>o.val===sel.bread_type);
      const u = this.steps[1].options.find(o=>o.val===sel.bread_unit);
      return `${sel.bread_count||1} ${u?.label||'شريحة'} ${t?.label||'خبز'} = ${grams}غ`;
    }
  },

  /* ── أرز (خارج الكيتو) ─────────────────────────────── */
  rice: {
    label: 'أرز',
    fids: [],
    warning: '⚠️ خارج نظام الكيتو — للتوثيق في المراحل المرنة',
    warningClass: 'danger',
    RICE_DATA: {
      white_cooked:  { label:'أبيض مطبوخ',  cal:130, carb:28, fat:0.3, prot:2.7, nc:27 },
      brown_cooked:  { label:'أسمر مطبوخ',  cal:112, carb:24, fat:0.9, prot:2.3, nc:23 },
      white_raw:     { label:'أبيض نيء',    cal:365, carb:80, fat:0.7, prot:7,   nc:79 },
      cauliflower:   { label:'أرز قرنبيط 🥦 (كيتو)', cal:25, carb:3, fat:0.3, prot:2, nc:1.5, keto:true },
    },
    steps: [
      {
        key: 'rice_type', label: 'النوع',
        options: [
          { val:'white_cooked', label:'أبيض مطبوخ',           warning:true  },
          { val:'brown_cooked', label:'أسمر مطبوخ',           warning:true  },
          { val:'white_raw',    label:'أبيض نيء',             warning:true  },
          { val:'cauliflower',  label:'أرز قرنبيط 🥦 (كيتو بديل) ✓', keto:true },
        ]
      },
      {
        key: 'rice_unit', label: 'الوحدة',
        options: [
          { val:'tbsp',  label:'ملعقة كبيرة مطبوخ (15غ)',  grams:15  },
          { val:'cup',   label:'كوب مطبوخ (180غ)',          grams:180 },
          { val:'gram',  label:'بالغرام',                   grams:1   },
        ]
      },
      {
        key: 'rice_amount', label: 'الكمية',
        type: 'number', min:0.5, max:10, step:0.5, default:1
      }
    ],
    toGram(sel) {
      const u = this.steps[1].options.find(o=>o.val===sel.rice_unit) || {grams:15};
      return Math.round((sel.rice_amount||1) * u.grams);
    },
    getMacros(sel, grams) {
      const data = this.RICE_DATA[sel.rice_type] || this.RICE_DATA.white_cooked;
      const r = grams/100;
      return {
        fat:  Math.round(data.fat *r*10)/10,
        prot: Math.round(data.prot*r*10)/10,
        nc:   Math.round(data.nc  *r*10)/10,
        cal:  Math.round(data.cal *r),
        sat:  0,
        fiber:Math.round((data.carb-data.nc)*r*10)/10,
      };
    },
    display(sel, grams) {
      const t = this.steps[0].options.find(o=>o.val===sel.rice_type);
      const u = this.steps[1].options.find(o=>o.val===sel.rice_unit);
      return `${sel.rice_amount||1} ${u?.label||'ملعقة'} ${t?.label||'أرز'} = ${grams}غ`;
    }
  },

};

/* ════════════════════════════════════════════════════════════════
   دوال المساعدة
════════════════════════════════════════════════════════════════ */

/* تحديد نوع الوحدة لأي fid */
function getUnitTypeForFid(fid){
  for(const [type, def] of Object.entries(UNIT_INTELLIGENCE)){
    if(def.fids && def.fids.includes(fid)) return type;
  }
  return null;
}

/* حساب الغرام من الاختيار */
function calcGramsFromSel(unitType, sel, fid){
  const def = UNIT_INTELLIGENCE[unitType];
  if(!def) return 100;
  try {
    if(typeof def.toGram === 'function') return def.toGram(sel, fid);
    return 100;
  } catch(e){ return 100; }
}

/* نص العرض الملخّص */
function getDisplayText(unitType, sel, grams, fid){
  const def = UNIT_INTELLIGENCE[unitType];
  if(!def?.display) return grams + 'غ';
  try {
    return typeof def.display === 'function' ? def.display(sel, grams, fid) : grams + 'غ';
  } catch(e){ return grams + 'غ'; }
}

/* الحصول على fid من الاختيار (للأصناف متعددة الـ fid مثل الدجاج) */
function getFidFromSel(unitType, sel, defaultFid){
  const def = UNIT_INTELLIGENCE[unitType];
  if(def?.getFid) try { return def.getFid(sel); } catch(e){}
  return defaultFid;
}

/* حساب ماكرو للأصناف خارج FOODS (خبز، أرز) */
function getExternalMacros(unitType, sel, grams){
  const def = UNIT_INTELLIGENCE[unitType];
  if(def?.getMacros) try { return def.getMacros(sel, grams); } catch(e){}
  return null;
}
