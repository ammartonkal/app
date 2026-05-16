/* ═══════════════════════════════════════════
   قاعدة بيانات الأطعمة — تحدي الكيتو مع د. عمار
   المصدر: USDA + إضافات يدوية
   آخر تحديث: 2026-05-16
═══════════════════════════════════════════ */

const FOODS=[
  {id:1,name:"دجاج مشوي (صدر)",name_en:"Grilled Chicken Breast",cat:"بروتين",cal:165,fat:3.6,sat_fat:1.0,protein:31,carb:0,fiber:0,net_carb:0,sodium:74,potassium:256},
  {id:2,name:"لحم بقر مفروم (80/20)",name_en:"Ground Beef 80/20",cat:"بروتين",cal:254,fat:20,sat_fat:7.7,protein:17,carb:0,fiber:0,net_carb:0,sodium:75,potassium:270},
  {id:3,name:"سمك سلمون",name_en:"Salmon",cat:"بروتين",cal:208,fat:13,sat_fat:2.5,protein:20,carb:0,fiber:0,net_carb:0,sodium:59,potassium:363},
  {id:4,name:"بيض كامل",name_en:"Whole Egg",cat:"بروتين",cal:143,fat:9.5,sat_fat:3.1,protein:13,carb:0.7,fiber:0,net_carb:0.7,sodium:142,potassium:138},
  {id:5,name:"لحم خروف",name_en:"Lamb",cat:"بروتين",cal:282,fat:22,sat_fat:9.4,protein:19,carb:0,fiber:0,net_carb:0,sodium:72,potassium:310},
  {id:6,name:"جبن شيدر",name_en:"Cheddar Cheese",cat:"ألبان",cal:403,fat:33,sat_fat:21,protein:25,carb:1.3,fiber:0,net_carb:1.3,sodium:621,potassium:98},
  {id:7,name:"جبن موزاريلا",name_en:"Mozzarella",cat:"ألبان",cal:300,fat:22,sat_fat:14,protein:22,carb:2.2,fiber:0,net_carb:2.2,sodium:627,potassium:76},
  {id:8,name:"كريمة طازجة",name_en:"Heavy Cream",cat:"ألبان",cal:340,fat:36,sat_fat:23,protein:2.0,carb:2.7,fiber:0,net_carb:2.7,sodium:38,potassium:75},
  {id:9,name:"زبدة",name_en:"Butter",cat:"دهون",cal:717,fat:81,sat_fat:51,protein:0.9,carb:0.1,fiber:0,net_carb:0.1,sodium:11,potassium:24},
  {id:10,name:"زيت زيتون",name_en:"Olive Oil",cat:"دهون",cal:884,fat:100,sat_fat:14,protein:0,carb:0,fiber:0,net_carb:0,sodium:2,potassium:1},
  {id:11,name:"زيت جوز الهند",name_en:"Coconut Oil",cat:"دهون",cal:892,fat:100,sat_fat:87,protein:0,carb:0,fiber:0,net_carb:0,sodium:0,potassium:0},
  {id:12,name:"أفوكادو",name_en:"Avocado",cat:"خضار",cal:160,fat:15,sat_fat:2.1,protein:2.0,carb:8.5,fiber:6.7,net_carb:1.8,sodium:7,potassium:485},
  {id:13,name:"سبانخ طازجة",name_en:"Spinach",cat:"خضار",cal:23,fat:0.4,sat_fat:0.1,protein:2.9,carb:3.6,fiber:2.2,net_carb:1.4,sodium:79,potassium:558},
  {id:14,name:"بروكلي",name_en:"Broccoli",cat:"خضار",cal:34,fat:0.4,sat_fat:0.1,protein:2.8,carb:7.0,fiber:2.6,net_carb:4.4,sodium:33,potassium:316},
  {id:15,name:"كوسا",name_en:"Zucchini",cat:"خضار",cal:17,fat:0.3,sat_fat:0.1,protein:1.2,carb:3.1,fiber:1.0,net_carb:2.1,sodium:8,potassium:261},
  {id:16,name:"قرنبيط",name_en:"Cauliflower",cat:"خضار",cal:25,fat:0.3,sat_fat:0.1,protein:2.0,carb:5.0,fiber:2.0,net_carb:3.0,sodium:30,potassium:303},
  {id:17,name:"خيار",name_en:"Cucumber",cat:"خضار",cal:16,fat:0.1,sat_fat:0.0,protein:0.7,carb:3.6,fiber:0.5,net_carb:3.1,sodium:2,potassium:147},
  {id:18,name:"ليتوس روماني",name_en:"Romaine Lettuce",cat:"خضار",cal:17,fat:0.3,sat_fat:0.0,protein:1.2,carb:3.3,fiber:2.1,net_carb:1.2,sodium:8,potassium:247},
  {id:19,name:"مكسرات مشكلة",name_en:"Mixed Nuts",cat:"مكسرات",cal:607,fat:54,sat_fat:7.2,protein:16,carb:21,fiber:7.4,net_carb:13.6,sodium:5,potassium:600},
  {id:20,name:"لوز",name_en:"Almonds",cat:"مكسرات",cal:579,fat:50,sat_fat:3.8,protein:21,carb:22,fiber:12,net_carb:10,sodium:1,potassium:733},
  {id:21,name:"جوز برازيلي",name_en:"Brazil Nuts",cat:"مكسرات",cal:659,fat:67,sat_fat:15,protein:14,carb:12,fiber:7.5,net_carb:4.5,sodium:3,potassium:597},
  {id:22,name:"بذور الشيا",name_en:"Chia Seeds",cat:"بذور",cal:486,fat:31,sat_fat:3.3,protein:17,carb:42,fiber:34,net_carb:8,sodium:16,potassium:407},
  {id:23,name:"بذور كتان",name_en:"Flaxseeds",cat:"بذور",cal:534,fat:42,sat_fat:3.7,protein:18,carb:29,fiber:27,net_carb:2,sodium:30,potassium:813},
  {id:24,name:"تونة بالماء",name_en:"Canned Tuna",cat:"بروتين",cal:109,fat:2.5,sat_fat:0.6,protein:20,carb:0,fiber:0,net_carb:0,sodium:330,potassium:207},
  {id:25,name:"سجق (بدون حشو)",name_en:"Sausage",cat:"بروتين",cal:346,fat:30,sat_fat:11,protein:18,carb:1.1,fiber:0,net_carb:1.1,sodium:869,potassium:290},
  {id:26,name:"لحم مقدد",name_en:"Bacon",cat:"بروتين",cal:541,fat:45,sat_fat:15,protein:33,carb:0.6,fiber:0,net_carb:0.6,sodium:1717,potassium:565},
  {id:27,name:"جبن كريمي",name_en:"Cream Cheese",cat:"ألبان",cal:342,fat:34,sat_fat:21,protein:6.0,carb:4.1,fiber:0,net_carb:4.1,sodium:321,potassium:138},
  {id:28,name:"قشطة حامضة",name_en:"Sour Cream",cat:"ألبان",cal:193,fat:19,sat_fat:12,protein:2.4,carb:4.6,fiber:0,net_carb:4.6,sodium:53,potassium:138},
  {id:29,name:"جوز الهند المجفف",name_en:"Desiccated Coconut",cat:"بذور",cal:660,fat:65,sat_fat:58,protein:6.9,carb:23,fiber:15,net_carb:8,sodium:37,potassium:543},
  {id:30,name:"جوز عادي",name_en:"Walnuts",cat:"مكسرات",cal:654,fat:65,sat_fat:6.1,protein:15,carb:14,fiber:6.7,net_carb:7.3,sodium:2,potassium:441},
];
