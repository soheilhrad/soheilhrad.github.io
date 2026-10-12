/* "Type a feeling": type a word in English, Spanish or Persian and hear a short phrase built
   from the cues that music-emotion research links to that feeling.
   Interface text lives in _data/i18n.yml (feeling:) and reaches this file through the JSON in
   _includes/type-a-feeling.html; only the numbers that build the sound and the offline word
   list are here. Nothing is loaded from another site. Unknown words go to the Worker only
   when the visitor asks for them.
   Same word + same feeling always gives the same phrase. */
(function(){
'use strict';
const DATA = JSON.parse(document.getElementById('taf-data').textContent);
const CLASSIFY_ENDPOINT = DATA.endpoint || '';
const SCALES = {
  major:[0,2,4,5,7,9,11], minor:[0,2,3,5,7,8,10], dorian:[0,2,3,5,7,9,10],
  lydian:[0,2,4,6,7,9,11], phrygian:[0,1,3,5,7,8,10], locrian:[0,1,3,5,6,8,10],
  pentaMaj:[0,2,4,7,9],
  /* Persian dastgāh scales, in semitones above the tonic. A step of 1.5 is the half-flat step (koron):
     a quarter tone below the major second, between two piano keys. Web Audio plays it exactly. */
  shur:[0,1.5,3,5,7,8,10], homayun:[0,1.5,4,5,7,8,10]
};

/* One row per feeling: how it is heard (cue text) and how it is built (numbers). */
const EMO = {
  joy:{
    scale:'major',root:57,bpm:132,wave:'triangle',bright:6500,gain:.22,legato:.5,attack:.008,decay:.06,sustain:.5,release:.12,
    rhythm:[.5,.5,.5,.5,1,.5,.5],contour:'up',range:[0,10],startDeg:0,ending:'tonic',vel:[.7,1],rest:.05},
  sadness:{
    free:true,scale:'minor',root:50,bpm:54,wave:'sine',bright:1500,gain:.26,legato:.95,attack:.06,decay:.3,sustain:.6,release:.5,
    rhythm:[1,1,2,1,1,2],contour:'down',range:[-4,7],startDeg:6,ending:'tonic',vel:[.6,.85],rest:0},
  calm:{
    scale:'pentaMaj',root:55,bpm:48,wave:'sine',bright:1300,gain:.2,legato:1,attack:.4,decay:.6,sustain:.7,release:1.2,
    rhythm:[2,2,3],contour:'rock',range:[-2,5],startDeg:1,ending:'tonic',vel:[.5,.7],rest:0,echo:.3,drone:true,target:5},
  fear:{
    scale:'locrian',root:48,bpm:100,wave:'sawtooth',bright:1800,q:3,gain:.14,legato:.7,attack:.03,decay:.1,sustain:.6,release:.2,
    rhythm:[.5,.25,.75,.5,1,.25,.25],contour:'wander',range:[-3,6],startDeg:0,ending:'semitone',vel:[.3,1],crescendo:true,
    rest:.12,cluster:6,clusterProb:.35,vib:{rate:6.5,cents:30}},
  anger:{
    scale:'phrygian',root:45,bpm:152,wave:'sawtooth',bright:3800,gain:.17,legato:.45,attack:.004,decay:.05,sustain:.7,release:.06,
    rhythm:[.5,.5,.25,.25,.5,.5],contour:'repeat',range:[-2,4],startDeg:0,ending:'none',vel:[.8,1],rest:.04,
    cluster:1,clusterProb:.4,target:4.5},
  tenderness:{
    scale:'pentaMaj',root:60,bpm:66,wave:'sine',bright:2000,gain:.22,legato:.95,attack:.08,decay:.3,sustain:.7,release:.6,
    rhythm:[1,.5,.5,1,1,1],contour:'rock',range:[-1,6],startDeg:2,ending:'tonic',vel:[.5,.8],rest:0,echo:.2},
  longing:{
    free:true,scale:'dorian',root:52,bpm:60,wave:'triangle',bright:2300,gain:.24,legato:.95,attack:.05,decay:.25,sustain:.65,release:.6,
    rhythm:[1,1,.5,.5,2,1],contour:'arch',range:[-2,7],startDeg:0,ending:'dominant',vel:[.5,.9],rest:0,
    vib:{rate:5,cents:14},echo:.22},
  wonder:{
    scale:'lydian',root:62,bpm:76,wave:'sine',bright:6000,gain:.2,legato:.8,attack:.02,decay:.3,sustain:.5,release:.8,
    rhythm:[.5,.5,1,.5,.5,1.5],contour:'leap',range:[0,12],startDeg:0,ending:'high',vel:[.45,.9],rest:0,echo:.42},
  hope:{
    scale:'major',root:55,bpm:84,wave:'triangle',bright:4200,gain:.22,legato:.85,attack:.03,decay:.2,sustain:.6,release:.5,
    rhythm:[1,.5,.5,1,1,.5,.5,2],contour:'up',range:[0,10],startDeg:0,ending:'high',vel:[.5,.9],rest:0,echo:.15},
  /* Five more, after the Geneva Emotional Music Scale (nostalgia, power, tension, transcendence) and
     Hevner's adjective clusters (playful). Same method: the cue numbers are our reading of the
     published findings on mode, tempo, register, loudness and articulation. */
  nostalgia:{
    free:true,scale:'major',root:53,bpm:62,wave:'triangle',bright:2600,gain:.23,legato:.95,attack:.05,decay:.25,sustain:.65,release:.6,
    rhythm:[1,1,.5,.5,1,2],contour:'arch',range:[-2,7],startDeg:2,ending:'tonic',vel:[.5,.85],rest:0,
    vib:{rate:5,cents:10},echo:.3},
  power:{
    scale:'major',root:48,bpm:112,wave:'sawtooth',bright:3200,gain:.16,legato:.6,attack:.01,decay:.08,sustain:.7,release:.15,
    rhythm:[1,.5,.5,1,1,.5,.5,1],contour:'up',range:[0,9],startDeg:0,ending:'dominant',vel:[.8,1],rest:.03},
  tension:{
    scale:'minor',root:50,bpm:120,wave:'sawtooth',bright:2600,q:2,gain:.13,legato:.5,attack:.01,decay:.08,sustain:.6,release:.12,
    rhythm:[.25,.25,.5,.25,.25,.75,.25],contour:'wander',range:[-2,6],startDeg:0,ending:'none',vel:[.4,1],crescendo:true,
    rest:.08,cluster:4,clusterProb:.2,vib:{rate:7,cents:18}},
  transcendence:{
    free:true,scale:'pentaMaj',root:57,bpm:44,wave:'sine',bright:3500,gain:.2,legato:1,attack:.5,decay:.6,sustain:.75,release:1.6,
    rhythm:[3,3,4],contour:'up',range:[0,12],startDeg:0,ending:'high',vel:[.4,.7],rest:0,echo:.55,drone:true,target:7},
  playfulness:{
    scale:'major',root:64,bpm:140,wave:'triangle',bright:7000,gain:.2,legato:.3,attack:.004,decay:.05,sustain:.3,release:.08,
    rhythm:[.5,.25,.25,.5,.5,.25,.25,.5],contour:'wander',range:[0,9],startDeg:2,ending:'tonic',vel:[.55,.95],rest:.08},
  /* Two more, from a listening study of Persian classical music. Its mixed pieces sounded happy and
     sad at once, so 'bittersweet' turns the third from one colour to the other (another take reverses
     the order, and with it where the phrase lands). Its sad pieces were unmeasured and swelling, and
     the sadder a piece sounded the more it moved listeners, so 'moved' is slow, free and swelling. */
  bittersweet:{
    free:true,scale:'major',scale2:'minor',root:53,bpm:80,wave:'triangle',bright:2800,gain:.23,legato:.95,attack:.05,decay:.25,sustain:.65,release:.6,
    rhythm:[.5,.5,1,.5,.5,1,2],contour:'arch',range:[-2,7],startDeg:2,ending:'tonic',vel:[.35,.95],rest:0,
    vib:{rate:5,cents:10},echo:.25},
  moved:{
    free:true,scale:'minor',root:52,bpm:58,wave:'triangle',bright:2400,gain:.23,legato:1,attack:.12,decay:.4,sustain:.7,release:.9,
    rhythm:[1,1,2,1.5,.5,2],contour:'arch',range:[-2,8],startDeg:2,ending:'high',vel:[.3,1],rest:0,
    vib:{rate:5,cents:12},echo:.35}
};

/* Typing the name of a Persian classical mode plays its scale. These are scales, not feelings:
   no spot on the map, always free rhythm over a drone. */
const MODES = {
  shur:{scale:'shur',root:50,bpm:60,wave:'triangle',bright:2300,gain:.24,legato:1,attack:.03,decay:.4,sustain:.55,release:.8,
    rhythm:[1,1,.5,.5,2,1],contour:'arch',range:[-2,7],startDeg:0,ending:'tonic',vel:[.3,1],rest:0,free:true,echo:.25,vib:{rate:5,cents:10}},
  homayun:{scale:'homayun',root:50,bpm:56,wave:'triangle',bright:2300,gain:.24,legato:1,attack:.03,decay:.4,sustain:.55,release:.8,
    rhythm:[1,1,.5,.5,2,1],contour:'arch',range:[-2,7],startDeg:0,ending:'tonic',vel:[.3,1],rest:0,free:true,echo:.25,vib:{rate:5,cents:10}},
  mahur:{scale:'major',root:48,bpm:64,wave:'triangle',bright:2600,gain:.24,legato:1,attack:.03,decay:.4,sustain:.55,release:.8,
    rhythm:[1,1,.5,.5,2,1],contour:'arch',range:[-2,7],startDeg:0,ending:'tonic',vel:[.3,1],rest:0,free:true,echo:.25,vib:{rate:5,cents:10}}
};
const MODE_VOICE = {shur:'plucked', homayun:'breath', mahur:'plucked'};

/* Where each feeling sits on the map: valence (dark to bright, left to right) and arousal (calm to
   intense, bottom to top), after Russell's circumplex. Touching anywhere on the map plays music
   for that point: tempo, mode, register and brightness follow the position, so there are as many
   tracks as there are places to touch. */
const POS = {
  anger:{v:-.85,a:.88}, tension:{v:-.35,a:.85}, fear:{v:-.62,a:.45}, sadness:{v:-.78,a:-.55}, longing:{v:-.5,a:-.2},
  nostalgia:{v:0,a:-.45}, calm:{v:.3,a:-.88}, tenderness:{v:.62,a:-.5}, transcendence:{v:.5,a:-.12}, hope:{v:.15,a:.1},
  wonder:{v:.15,a:.6}, power:{v:.55,a:.92}, joy:{v:.88,a:.55}, playfulness:{v:.72,a:.28},
  bittersweet:{v:-.22,a:-.32}, moved:{v:-.18,a:.3}
};
const DARK_TO_BRIGHT = ['locrian','phrygian','minor','dorian','major','lydian'];
function nearest(v,a){
  let best = 'calm', bd = 9;
  for(const k in POS){ const d = (POS[k].v-v)**2 + (POS[k].a-a)**2; if(d<bd){ bd = d; best = k; } }
  return best;
}
/* The feeling nearest the touch supplies the character (timbre, rhythm, contour); the distance
   from it bends tempo, register, brightness, attack and mode. At a feeling's own spot the result
   is that feeling exactly. */
/* The Western or Persian scales, chosen under "How it's made". The Persian side swaps in dastgāh
   scales where the study's pieces point to one (Homayun for sad, Shur for longing, nostalgia and
   being moved, Mahur-to-Shur for bittersweet), drops the chords for a drone, and gives the
   lead a plucked, bowed or breathy voice. The others keep their Western scale. */
let lens = 'w';
const PERS = {
  sadness:{scale:'homayun',bright:2200}, longing:{scale:'shur'}, nostalgia:{scale:'shur'}, moved:{scale:'shur'},
  bittersweet:{scale:'major',scale2:'shur'}
};
const PVOICE = {sadness:'breath', longing:'strings', nostalgia:'plucked', moved:'strings', bittersweet:'plucked',
                joy:'plucked', playfulness:'plucked', hope:'plucked', shur:'plucked', homayun:'breath', mahur:'plucked'};
/* In the study, listeners almost never felt these (anger, fear and anxiety barely registered). */
const RARE = new Set(['fear','anger','tension']);
const baseEmo = key => lens==='p' ? Object.assign({},EMO[key],PERS[key]||{},{persian:true}) : EMO[key];

function synth(v,a,key){
  const base = baseEmo(key), dv = v-POS[key].v, da = a-POS[key].a, e = Object.assign({},base);
  e.bpm = Math.max(40,Math.min(168,Math.round(base.bpm*Math.pow(2,da*.7))));
  e.root = base.root + Math.round(dv*3 + da*2);
  e.bright = Math.max(900,Math.round(base.bright*(1+da*.45+dv*.3)));
  e.attack = Math.max(.004,base.attack*(1-da*.6));
  if(Math.abs(dv)>.22 && !base.scale2){
    const i = base.scale==='pentaMaj' ? 4 : DARK_TO_BRIGHT.indexOf(base.scale);
    if(i>=0) e.scale = DARK_TO_BRIGHT[Math.max(0,Math.min(5,i+Math.round(dv*2)))];
  }
  return e;
}

/* Two more voices for the melody besides the one each feeling brings ('auto'). */
const TIMBRE = {
  keys:{kind:'fm',attack:.004,decay:.5,sustain:.25,release:.6,legato:.9,vib:null,detune:0,pure:true,gainMul:1.3,brightMin:2600},
  strings:{wave:'sawtooth',detune:9,attack:.09,decay:.3,sustain:.75,release:.7,legato:1,vib:{rate:5.5,cents:10},pure:true,gainMul:.6,brightMin:1400,brightMax:2600},
  /* A plucked string (setar, tar, santur): a bright strike that dies away, higher partials first. */
  plucked:{kind:'pluck',attack:.004,decay:.1,sustain:.5,release:.2,legato:1,vib:null,detune:0,pure:true,gainMul:1.1,brightMin:2400,brightMax:5200},
  /* A breathy reed (ney): a pure tone with a little band of breath noise and a late vibrato. */
  breath:{kind:'breath',attack:.09,decay:.2,sustain:.9,release:.35,legato:1,vib:{rate:5.2,cents:16},detune:0,pure:true,gainMul:1,brightMin:2600,brightMax:4600}
};
function leadVoice(e,timbre,key){
  const pick = timbre==='auto' && e.persian ? (MODE_VOICE[key] || PVOICE[key]) : timbre;
  const tb = TIMBRE[pick]; if(!tb) return e;
  const o = Object.assign({},e,tb);
  o.gain = e.gain*tb.gainMul;
  o.bright = Math.min(tb.brightMax||1e9, Math.max(tb.brightMin, e.bright));
  return o;
}

/* Chords under the melody: scale-degree roots, stacked in thirds. Modal choices follow the cues
   above: a plain I-V-vi-IV for joy, a falling minor line for sadness, a dissonant flat-II for fear. */
const PROG = {
  joy:[0,4,5,3], sadness:[0,5,2,6], calm:[0,3,1,0], fear:[0,1,0,4], anger:[0,1,0,6],
  tenderness:[0,2,3,0], longing:[0,3,6,0], wonder:[0,1,0,4], hope:[0,3,4,0],
  nostalgia:[0,5,3,0], power:[0,3,4,0], tension:[0,1,0,5], transcendence:[0,1,3,0], playfulness:[0,4,0,4],
  bittersweet:[0,3,2,0], moved:[0,5,3,0]
};

/* Words the page knows without asking anyone. Accents and Persian variants are normalised below. */
const WORDS = {
  joy:{en:['joy','happy','happiness','glad','delight','cheerful','excited','elated','bliss','fun','joyful','thrilled','overjoyed','euphoric'],
       es:['alegría','feliz','felicidad','contento','contenta','gozo','dicha','entusiasmo','alegre','eufórico','eufórica'],
       fa:['شادی','خوشحال','خوشحالی','شاد','ذوق','سرور','خوشی','لذت','سرخوش','هیجان‌زده','شادمان']},
  sadness:{en:['sad','sadness','sorrow','grief','melancholy','blue','mourning','lonely','loneliness','heartbreak','down','heartbroken','depressed','gloomy','hurt','disappointed','unhappy'],
       es:['triste','tristeza','pena','dolor','luto','melancolía','soledad','duelo','deprimido','deprimida','desanimado','desanimada','decepcionado','decepcionada','abatido'],
       fa:['غم','غمگین','اندوه','غصه','ناراحت','تنهایی','سوگ','ماتم','افسرده','دلشکسته','دل‌گرفته','ناامید']},
  calm:{en:['calm','peace','peaceful','serene','serenity','relaxed','still','quiet','tranquil','rest','content','chill','safe','grounded','at ease','relief'],
       es:['calma','paz','tranquilo','tranquilidad','serenidad','sosiego','quietud','descanso','relajado','relajada','sereno','serena','a gusto','alivio'],
       fa:['آرامش','آرام','صلح','سکوت','آسودگی','آسوده','سکون','راحت','آسوده‌خاطر','آسایش']},
  fear:{en:['fear','afraid','scared','anxious','anxiety','dread','worry','panic','nervous','terror','unease','frightened','terrified','uneasy','insecure'],
       es:['miedo','temor','ansiedad','pánico','nervios','angustia','inquietud','asustado','asustada','inseguro','insegura','preocupado','preocupada'],
       fa:['ترس','هراس','اضطراب','نگرانی','وحشت','دلهره','نگران','ترسیده','دلشوره','مضطرب']},
  anger:{en:['anger','angry','rage','fury','mad','annoyed','irritated','frustration','frustrated','outrage','furious','resentful','bitter','irritable','resentment'],
       es:['ira','rabia','enfado','enojo','furia','frustración','indignación','furioso','furiosa','harto','harta','rencor','enfadado','enfadada'],
       fa:['خشم','عصبانی','عصبانیت','غضب','کلافه','عصبی','کینه','خشمگین']},
  tenderness:{en:['tender','tenderness','love','affection','warmth','care','gentle','kindness','compassion','fondness','loving','grateful','gratitude','cozy','caring','adore'],
       es:['ternura','amor','cariño','calidez','dulzura','compasión','afecto','agradecido','agradecida','gratitud','cariñoso','cariñosa'],
       fa:['مهربانی','عشق','محبت','مهر','لطف','دلسوزی','عاطفه','قدردانی','سپاسگزاری','دوست‌داشتن']},
  longing:{en:['longing','homesick','homesickness','yearning','missing','miss','wistful','saudade','pining','yearn','missing home','miss home'],
       es:['añoranza','morriña','anhelo','extrañar','echar de menos','echo de menos','te extraño'],
       fa:['دلتنگی','دلتنگ','حسرت','غربت','اشتیاق','دلتنگم','هوای خانه']},
  wonder:{en:['wonder','awe','amazement','curiosity','marvel','astonished','surprise','inspired','fascination','awestruck','amazed','dreamy','mesmerized','mesmerised'],
       es:['asombro','maravilla','admiración','curiosidad','sorpresa','fascinación','asombrado','asombrada','maravillado','maravillada','fascinado','fascinada'],
       fa:['شگفتی','حیرت','تعجب','کنجکاوی','شگفت‌زده','مبهوت','حیرت‌زده','شگفت']},
  hope:{en:['hope','hopeful','optimism','optimistic','faith','determined','looking forward','motivated','eager'],
       es:['esperanza','optimismo','fe','esperanzado','ilusión','ilusionado','ilusionada','motivado','motivada'],
       fa:['امید','امیدواری','امیدوار','خوش‌بینی','انگیزه','امیدوارم','چشم‌انتظار']},
  nostalgia:{en:['nostalgia','nostalgic','sentimental','reminiscing','memories','remembering','throwback'],
       es:['nostalgia','nostálgico','nostálgica','recuerdos','recordar','sentimental'],
       fa:['نوستالژی','نوستالژیک','خاطره','خاطرات','یادش بخیر']},
  power:{en:['proud','pride','powerful','power','strong','strength','confident','confidence','triumphant','triumph','empowered','fierce','heroic','victorious','unstoppable','courage','brave','bold'],
       es:['orgulloso','orgullosa','orgullo','poderoso','poderosa','fuerte','fuerza','confianza','triunfo','triunfante','valiente','valentía','audaz'],
       fa:['افتخار','قدرت','قدرتمند','قوی','توانمند','پیروزی','پیروز','شجاع','شجاعت','سربلند']},
  tension:{en:['tense','tension','stress','stressed','restless','agitated','edgy','jittery','on edge','overwhelmed','pressure','uptight','wired','frantic','suspense'],
       es:['tenso','tensa','tensión','estrés','estresado','estresada','inquieto','inquieta','agitado','agitada','presión','agobiado','agobiada','suspense'],
       fa:['تنش','استرس','بی‌قرار','بی‌قراری','آشفته','پریشان','فشار']},
  transcendence:{en:['transcendence','transcendent','spiritual','sacred','reverence','devotion','ecstasy','ecstatic','euphoria','uplifted','elevated','worship','divine','prayer','holy'],
       es:['trascendencia','espiritual','sagrado','reverencia','devoción','éxtasis','extasiado','elevado','divino','plenitud','oración'],
       fa:['تعالی','معنوی','مقدس','قدسی','عرفان','عارفانه','وجد','نیایش','دعا','الهی','روحانی']},
  playfulness:{en:['playful','playfulness','silly','funny','amused','amusement','humor','humour','mischievous','cheeky','giggly','giddy','goofy','teasing','lighthearted'],
       es:['juguetón','juguetona','travieso','traviesa','gracioso','divertido','divertida','diversión','risa','bromista','pícaro'],
       fa:['شوخ','شوخی','بازیگوش','شیطنت','شیطون','خنده','بامزه']},
  bittersweet:{en:['bittersweet','happy and sad','sad and happy','mixed feelings','mixed emotions','ambivalent','torn','smiling through tears','half happy half sad'],
       es:['agridulce','sentimientos encontrados','emociones encontradas','ambivalente','dividido','dividida','alegre y triste','triste y alegre'],
       fa:['تلخ و شیرین','شیرین و تلخ','احساسات متناقض','حس متناقض','دوگانه','دودل','هم شاد هم غمگین']},
  moved:{en:['moved','touched','emotional','tearful','teary','choked up','stirred','heartfelt'],
       es:['conmovido','conmovida','emocionado','emocionada','emotivo','emotiva','tocado','tocada','con lágrimas'],
       fa:['متاثر','متأثر','تحت تاثیر','تحت‌تاثیر','منقلب','دگرگون','دلم لرزید','اشک در چشم','اشکم درآمد']}
};
/* The names of Persian classical modes, in Latin and Persian letters. */
const MODEWORDS = {
  shur:['shur','shour','shoor','شور'], homayun:['homayun','homayoun','homayon','همایون'], mahur:['mahur','mahoor','mahour','ماهور']
};

function norm(s){
  return String(s).trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[\u200c\u200d]/g,'')
    .replace(/\u064a/g,'\u06cc').replace(/\u0643/g,'\u06a9')
    .replace(/[\u064b-\u065f\u0670]/g,'')
    .replace(/[^\p{L}\p{N}\s]/gu,'')
    .replace(/\s+/g,' ');
}

const LEX = new Map();
for(const [emo,langs] of Object.entries(WORDS))
  for(const [lang,list] of Object.entries(langs))
    for(const w of list){ const k = norm(w); if(!LEX.has(k)) LEX.set(k,{emo,lang}); }
for(const [m,list] of Object.entries(MODEWORDS)) for(const w of list){ const k = norm(w); if(!LEX.has(k)) LEX.set(k,{emo:m,lang:'en',mode:true}); }

function detectLang(raw){
  if(/[\u0600-\u06FF]/.test(raw)) return 'fa';
  if(/[ñáéíóúü¿¡]/i.test(raw)) return 'es';
  return 'en';
}

/* Words that make a feeling stronger or softer. They move it on the map: stronger goes further from
   the centre (very calm is calmer, very angry is angrier), softer comes closer to it. */
const MODS = {
  up:{en:['very','really','so','extremely','deeply','super','incredibly','totally','too','truly'],
      es:['muy','mucho','muchisimo','tan','super','profundamente','demasiado','realmente'],
      fa:['خیلی','بسیار','شدیدا','واقعا','عمیقا','کلی','حسابی']},
  down:{en:['little','bit','slightly','somewhat','kinda','mildly','faintly'],
      es:['poco','algo','ligeramente','levemente'],
      fa:['کمی','یکم','کم','اندکی','نسبتا']}
};
/* "not happy", "no estoy triste", "نمی‌ترسم": the feeling's opposite side of the map. */
const NEG = new Set(['not','no','never','isnt','dont','arent','cant','without','nunca','sin','ni','نه','نیستم','نیست','نمی','بدون','هرگز'].map(w=>norm(w)));
const MOD = new Map();
for(const [dir,langs] of Object.entries(MODS)) for(const list of Object.values(langs)) for(const w of list) MOD.set(norm(w), dir==='up' ? 1 : -1);

/* Reads a phrase: which feelings it names (one, or two for a blend), and how strongly.
   Same text always gives the same reading, so a shared link plays the same piece. */
function lookup(text){
  const n = norm(text);
  if(!n) return null;
  const toks = n.split(' '), found = [];
  let intensity = 0, neg = 0, negated = false;
  const whole = LEX.get(n);
  if(whole) found.push(whole);
  else for(let i=0;i<toks.length;i++){
    let hit = null, used = 1;
    for(const len of [3,2,1]){ const k = toks.slice(i,i+len).join(' '); if(LEX.has(k)){ hit = LEX.get(k); used = len; break; } }
    if(hit){ if(!found.some(f=>f.emo===hit.emo)){ if(neg>0 && !found.length) negated = true; found.push(hit); } i += used-1; neg = 0; continue; }
    if(NEG.has(toks[i])) neg = 2;
    else if(MOD.has(toks[i])) intensity = MOD.get(toks[i]);
    else if(neg>0) neg--;
  }
  if(!found.length) return intensity ? {emo:null,intensity} : null;
  const raw = detectLang(text);
  if(found[0].mode) return {emo:found[0].emo, mode:true, lang: raw==='fa' ? 'fa' : PAGE_LANG};
  return place({emo:found[0].emo, lang: raw==='fa' ? 'fa' : (raw==='es' ? 'es' : found[0].lang)}, found[1] && found[1].emo, intensity, negated && found.length===1);
}

/* Turns a reading into a point on the map. A single plain feeling keeps its own spot (no pos). */
function place(hit,second,intensity,negated){
  if(!second && !intensity && !negated) return hit;
  let p = second ? {v:(POS[hit.emo].v+POS[second].v)/2, a:(POS[hit.emo].a+POS[second].a)/2} : {v:POS[hit.emo].v, a:POS[hit.emo].a};
  if(negated) p = {v:-.75*p.v, a:-.4*p.a};   // the other side of the map, and flatter
  if(intensity){ const k = intensity>0 ? 1.3 : .6; p = {v:p.v*k, a:p.a*k}; }
  p = {v:Math.max(-.95,Math.min(.95,p.v)), a:Math.max(-.95,Math.min(.95,p.a))};
  // A blend takes the character of whatever feeling lies between the two; a stronger or softer
  // feeling keeps its own character and only moves.
  return Object.assign(hit,{pos:p, keep:!second && !negated, second, intensity, negated});
}

function fnv(str){ let h=2166136261>>>0; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619)>>>0; } return h>>>0; }
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

function degToMidi(deg,e){
  const sc = SCALES[e.scale], len = sc.length;
  const oct = Math.floor(deg/len), idx = ((deg%len)+len)%len;
  return e.root + 12*oct + sc[idx];
}
function pickStep(contour,progress,r){
  switch(contour){
    case 'up':     return r<.55?1 : r<.8?2 : r<.92?-1 : 0;
    case 'down':   return r<.55?-1 : r<.8?-2 : r<.92?1 : 0;
    case 'arch':   return progress<.5 ? (r<.65?1 : r<.85?2 : -1) : (r<.65?-1 : r<.85?-2 : 1);
    case 'rock':   return r<.35?1 : r<.7?-1 : r<.85?2 : -2;
    case 'wander': return r<.25?1 : r<.5?-1 : r<.65?2 : r<.8?-2 : r<.9?3 : -3;
    case 'repeat': return r<.6?0 : r<.8?1 : -1;
    case 'leap':   return r<.4?2 : r<.65?3 : r<.85?1 : -1;
    default: return 0;
  }
}

/* Same word + same feeling always gives the same phrase. A 'free' feeling has unmeasured timing
   (some notes held, some run on) and a swell in loudness, like the free-rhythm pieces of the
   study; the others keep a steady beat and a narrow range of loudness, like its reng pieces.
   A feeling with two scales ('bittersweet') changes scale half-way; an odd take reverses them. */
function buildPhrase(word,key,v,e,salt){
  const rnd = mulberry32(fnv(norm(word)+'|'+key+(v ? '|'+v : '')+(salt ? '|L'+salt : '')));
  const flip = (((v||0)+(salt||0)) % 2) === 1;
  const eA = e.scale2 ? Object.assign({},e,{scale: flip ? e.scale2 : e.scale}) : e;
  const eB = e.scale2 ? Object.assign({},e,{scale: flip ? e.scale : e.scale2}) : e;
  const free = !!e.free, beat = 60/e.bpm, target = e.target || (free ? 9 : 6.5), len = SCALES[e.scale].length;
  const notes = []; let t = 0, deg = e.startDeg, i = 0, switched = false;
  while(t < target - beat){
    let dur = e.rhythm[i % e.rhythm.length]*beat; i++;
    if(free){ const r = rnd(); dur *= r < .18 ? 2.2 : .6 + r*1.1; }
    if(rnd() < e.rest){ t += dur; continue; }
    const progress = Math.min(1,t/target);
    deg += pickStep(e.contour,progress,rnd());
    deg = Math.max(e.range[0],Math.min(e.range[1],deg));
    // At the turn the line returns to the third, so the change of colour is heard at once.
    if(e.scale2 && !switched && progress >= .5){ switched = true; deg = 2; }
    const vel = free ? .2 + .8*(.85*Math.sin(Math.PI*progress) + .15*rnd())
                     : e.vel[0] + (e.vel[1]-e.vel[0])*(e.crescendo ? progress : rnd());
    const n = {t,dur,midi:degToMidi(deg, progress < .5 ? eA : eB),vel};
    if(e.cluster && rnd() < e.clusterProb) n.extra = n.midi + e.cluster;
    notes.push(n); t += dur;
  }
  let fin = null;
  if(e.ending==='tonic'){
    const td = Math.round(deg/len)*len;
    fin = degToMidi(td,eB);
    // On a Shur or Homayun scale the line comes home by way of the quarter-flat second, as a cadence does.
    if(e.persian && SCALES[eB.scale][1]===1.5){ notes.push({t,dur:beat*1.5,midi:degToMidi(td+1,eB),vel:e.vel[1]*.8}); t += beat*1.5; }
  }
  else if(e.ending==='dominant'){
    let d = deg;
    for(let k=0;k<len;k++){
      if((((deg+k)%len)+len)%len===4){ d=deg+k; break; }
      if((((deg-k)%len)+len)%len===4){ d=deg-k; break; }
    }
    fin = degToMidi(d,eB);
  }
  else if(e.ending==='semitone') fin = e.root + 12*Math.round(deg/len) + 1;
  else if(e.ending==='high') fin = degToMidi(deg>=len ? len*2 : len,eB);
  if(fin!==null){ const d = beat*2; notes.push({t,dur:d,midi:fin,vel:e.vel[1],final:true}); t += d; }
  // The chords take no random numbers, so they never change the melody; the last one is home.
  // On the Persian side there are no chords: a drone takes their place (see play).
  const prog = (e.persian || !PROG[key]) ? null : PROG[key], seg = prog ? t/prog.length : 0;
  const chords = prog ? prog.map((d,k)=>{
    const r = (k===prog.length-1) ? 0 : d, ee = (k/prog.length < .5) ? eA : eB;
    return {t:k*seg, dur:seg, bass:degToMidi(r,ee)-24, tones:[0,2,4].map(s=>degToMidi(r+s,ee)-12)};
  }) : [];
  return {notes,chords,total:t};
}

/* "Keep listening": five phrases in a row, the first the same as the short one. */
function makePhrase(c){
  if(!c.long) return buildPhrase(c.text,c.key,c.v,c.e);
  const notes = [], chords = []; let off = 0;
  for(let s=0;s<5;s++){
    const ph = buildPhrase(c.text,c.key,c.v,c.e,s);
    ph.notes.forEach(n=>notes.push(Object.assign({},n,{t:n.t+off})));
    ph.chords.forEach(ch=>chords.push(Object.assign({},ch,{t:ch.t+off})));
    off += ph.total;
  }
  return {notes,chords,total:off};
}

/* ---------- audio ---------- */
const $ = id => document.getElementById('taf-' + id);
let AC=null, master=null, bus=null, playId=0, current=null, timbre='auto', lastArgs=null, pendingLong=false;
const midiHz = m => 440*Math.pow(2,(m-69)/12);

function ensureAudio(){
  if(!AC){
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if(!Ctx) return null;
    AC = new Ctx();
    master = AC.createGain(); master.gain.value = .9;
    const comp = AC.createDynamicsCompressor();
    master.connect(comp); comp.connect(AC.destination);
  }
  if(AC.state==='suspended') AC.resume();
  return AC;
}

/* A small hall made of decaying noise, so no sound file has to be downloaded. */
let IR=null;
function impulse(){
  if(IR) return IR;
  const len = Math.floor(AC.sampleRate*2.2), buf = AC.createBuffer(2,len,AC.sampleRate), rnd = mulberry32(7);
  for(let c=0;c<2;c++){ const d = buf.getChannelData(c); for(let i=0;i<len;i++) d[i] = (rnd()*2-1)*Math.pow(1-i/len,2.6); }
  return IR = buf;
}

function makeFx(e,dest){
  const input = AC.createGain();
  const lp = AC.createBiquadFilter();
  lp.type='lowpass'; lp.frequency.value=e.bright; lp.Q.value=e.q||.7;
  input.connect(lp); lp.connect(dest);
  const rv = AC.createConvolver(); rv.buffer = impulse();
  const rw = AC.createGain(); rw.gain.value = e.reverb==null ? .2 : e.reverb;
  lp.connect(rv); rv.connect(rw); rw.connect(dest);
  if(e.echo){
    const d = AC.createDelay(1); d.delayTime.value = .32;
    const fb = AC.createGain(); fb.gain.value = .38;
    const wet = AC.createGain(); wet.gain.value = e.echo;
    lp.connect(d); d.connect(fb); fb.connect(d); d.connect(wet); wet.connect(dest);
  }
  return input;
}

function fmVoice(e,fx,t0,midi,dur,vel,gainScale){
  const f = midiHz(midi), hold = Math.max(dur*e.legato,.2), peak = e.gain*vel*(gainScale||1), end = t0+hold+e.release+.05;
  const g = AC.createGain();
  g.gain.setValueAtTime(.0001,t0);
  g.gain.exponentialRampToValueAtTime(peak,t0+e.attack);
  g.gain.exponentialRampToValueAtTime(peak*e.sustain,t0+e.attack+e.decay);
  g.gain.setValueAtTime(peak*e.sustain,t0+hold);
  g.gain.exponentialRampToValueAtTime(.0001,t0+hold+e.release);
  g.connect(fx);
  const car = AC.createOscillator(), mod = AC.createOscillator(), mg = AC.createGain();
  car.type = 'sine'; mod.type = 'sine'; car.frequency.value = f; mod.frequency.value = f;
  mg.gain.setValueAtTime(f*1.6*vel,t0); mg.gain.exponentialRampToValueAtTime(f*.08,t0+.5);
  mod.connect(mg); mg.connect(car.frequency); car.connect(g);
  car.start(t0); mod.start(t0); car.stop(end); mod.stop(end);
}

let NOISE=null;
function noiseBuf(){
  if(NOISE) return NOISE;
  const len = AC.sampleRate, buf = AC.createBuffer(1,len,AC.sampleRate), rnd = mulberry32(11), d = buf.getChannelData(0);
  for(let i=0;i<len;i++) d[i] = rnd()*2-1;
  return NOISE = buf;
}
/* Plucked: a strike that dies away, the higher partials first. Exact pitch, so quarter tones are true. */
function pluckVoice(e,fx,t0,midi,dur,vel,gainScale){
  const f = midiHz(midi), peak = e.gain*vel*(gainScale||1)*.45;
  const ring = Math.max(.9,Math.min(2.6,dur*1.6)), H = Math.max(1,Math.min(8,Math.floor(7000/f)));
  for(let k=1;k<=H;k++){
    const o = AC.createOscillator(), g = AC.createGain();
    const a = peak/Math.pow(k,1.15), tau = ring/(1+.55*(k-1));
    o.type = 'sine'; o.frequency.value = f*k;
    g.gain.setValueAtTime(.0001,t0);
    g.gain.exponentialRampToValueAtTime(a,t0+.004);
    g.gain.exponentialRampToValueAtTime(.0001,t0+.004+tau);
    o.connect(g); g.connect(fx); o.start(t0); o.stop(t0+.004+tau+.05);
  }
}
/* Breath: a near-pure tone with a thin band of air noise and a vibrato that arrives late. */
function breathVoice(e,fx,t0,midi,dur,vel,gainScale){
  const f = midiHz(midi), a = e.attack, hold = Math.max(dur*e.legato,a+.15), peak = e.gain*vel*(gainScale||1);
  const end = t0+hold+e.release+.05, g = AC.createGain();
  g.gain.setValueAtTime(.0001,t0);
  g.gain.exponentialRampToValueAtTime(peak,t0+a);
  g.gain.setValueAtTime(peak,t0+hold);
  g.gain.exponentialRampToValueAtTime(.0001,t0+hold+e.release);
  g.connect(fx);
  [1,2,3].forEach((k,i)=>{
    const o = AC.createOscillator(), og = AC.createGain();
    o.type = 'sine'; o.frequency.value = f*k; og.gain.value = [1,.2,.07][i];
    if(e.vib){
      const lfo = AC.createOscillator(), lg = AC.createGain();
      lfo.frequency.value = e.vib.rate;
      lg.gain.setValueAtTime(0,t0); lg.gain.linearRampToValueAtTime(e.vib.cents,t0+Math.min(.5,hold));
      lfo.connect(lg); lg.connect(o.detune); lfo.start(t0); lfo.stop(end);
    }
    o.connect(og); og.connect(g); o.start(t0); o.stop(end);
  });
  const nb = AC.createBufferSource(), bp = AC.createBiquadFilter(), ng = AC.createGain();
  nb.buffer = noiseBuf(); nb.loop = true;
  bp.type = 'bandpass'; bp.frequency.value = Math.min(f*3,6000); bp.Q.value = .9;
  ng.gain.value = .3;
  nb.connect(bp); bp.connect(ng); ng.connect(g); nb.start(t0); nb.stop(end);
}

function voice(e,fx,base,midi,dur,vel,gainScale){
  if(e.kind==='fm') return fmVoice(e,fx,base,midi,dur,vel,gainScale);
  if(e.kind==='pluck') return pluckVoice(e,fx,base,midi,dur,vel,gainScale);
  if(e.kind==='breath') return breathVoice(e,fx,base,midi,dur,vel,gainScale);
  const t0 = base, a = e.attack, hold = Math.max(dur*e.legato, a+e.decay+.02);
  const peak = e.gain*vel*(gainScale||1);
  const g = AC.createGain();
  g.gain.setValueAtTime(.0001,t0);
  g.gain.exponentialRampToValueAtTime(peak,t0+a);
  g.gain.exponentialRampToValueAtTime(peak*e.sustain,t0+a+e.decay);
  g.gain.setValueAtTime(peak*e.sustain,t0+hold);
  g.gain.exponentialRampToValueAtTime(.0001,t0+hold+e.release);
  g.connect(fx);
  const end = t0+hold+e.release+.05;
  const oscs = e.detune ? [-e.detune,e.detune] : [0];
  oscs.forEach(cents=>{
    const o = AC.createOscillator();
    o.type = e.wave; o.frequency.value = midiHz(midi); o.detune.value = cents;
    if(e.vib){
      const lfo = AC.createOscillator(), lg = AC.createGain();
      lfo.frequency.value = e.vib.rate; lg.gain.value = e.vib.cents;
      lfo.connect(lg); lg.connect(o.detune); lfo.start(t0); lfo.stop(end);
    }
    o.connect(g); o.start(t0); o.stop(end);
  });
  // A quiet octave above makes a sine or triangle sound less like a test tone.
  if(!e.pure && e.wave!=='sawtooth'){
    const o2 = AC.createOscillator(), g2 = AC.createGain();
    o2.type='sine'; o2.frequency.value = midiHz(midi)*2; g2.gain.value = .14;
    o2.connect(g2); g2.connect(g); o2.start(t0); o2.stop(end);
  }
}

/* The card's one main button shows what pressing it will do: Play when silent, Stop while sounding. */
function setPlaying(on){
  const b = $('play'), lang = current ? current.lang : PAGE_LANG;
  b.dataset.playing = String(on);
  $('playLabel').textContent = T[lang][on ? 'stop' : 'play'];
}
function fadeOut(){
  if(!bus || !AC) return;
  const old = bus, now = AC.currentTime;
  old.gain.cancelScheduledValues(now); old.gain.setTargetAtTime(0,now,.03);
  setTimeout(()=>old.disconnect(),400);
  bus = null;
}
function stop(){
  playId++; fadeOut(); setPlaying(false);
  document.querySelectorAll('#taf-roll rect').forEach(r=>r.style.opacity=.55);
}

function play(){
  if(!current || !ensureAudio()) return;
  const {phrase,key,e} = current, lead = leadVoice(e,timbre,key), now = AC.currentTime;
  fadeOut();
  bus = AC.createGain(); bus.connect(master);
  setPlaying(true);
  const fx = makeFx(lead,bus), base = now + .1, id = ++playId;
  phrase.notes.forEach(n=>{
    voice(lead,fx,base+n.t,n.midi,n.dur,n.vel,1);
    if(n.extra) voice(lead,fx,base+n.t,n.extra,n.dur,n.vel,.6);
  });
  const padE = Object.assign({},e,{wave:'triangle',attack:.3,decay:.5,sustain:.8,release:.7,legato:1,vib:null,detune:7,
                                   gain:e.gain*.42,pure:true,bright:Math.min(e.bright,1800)});
  const bassE = Object.assign({},e,{wave:'sine',attack:.05,decay:.3,sustain:.8,release:.5,legato:.95,vib:null,detune:0,gain:e.gain*1.1,pure:true});
  phrase.chords.forEach(c=>{
    c.tones.forEach(m=>voice(padE,fx,base+c.t,m,c.dur,.7,1));
    voice(bassE,fx,base+c.t,c.bass,c.dur,.8,1);
  });
  if(e.drone || e.persian){
    // A steady note under the melody; on the Persian side a fifth is added, as the strings hold it.
    const drone = (midi,peak)=>{
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = 'sine'; o.frequency.value = midiHz(midi);
      g.gain.setValueAtTime(.0001,base);
      g.gain.exponentialRampToValueAtTime(peak,base+1.5);
      g.gain.setValueAtTime(peak,base+phrase.total-1);
      g.gain.exponentialRampToValueAtTime(.0001,base+phrase.total+1.5);
      o.connect(g); g.connect(fx); o.start(base); o.stop(base+phrase.total+1.6);
    };
    drone(e.root-12, e.persian ? .07 : .06);
    if(e.persian) drone(e.root-5, .035);
  }
  const rects = [...document.querySelectorAll('#taf-roll rect')];
  (function frame(){
    if(id!==playId) return;
    const t = AC.currentTime - base;
    rects.forEach((r,i)=>{ const n = phrase.notes[i]; r.style.opacity = (t>=n.t && t<n.t+n.dur*.98) ? 1 : .45; });
    if(t < phrase.total+1.5) requestAnimationFrame(frame);
    else { rects.forEach(r=>r.style.opacity=.55); setPlaying(false); }
  })();
}

/* ---------- classification for words the page does not know ---------- */
/* The Worker (worker/worker.js) accepts {text} and returns {emotion, lang}. Its address is
   `classify_endpoint` in _config.yml; empty means unknown words are simply not understood. */
async function remoteClassify(text){
  if(!CLASSIFY_ENDPOINT) return null;
  const ctl = new AbortController(), timer = setTimeout(()=>ctl.abort(), 10000);
  try{
    const r = await fetch(CLASSIFY_ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},
      body:JSON.stringify({text}),signal:ctl.signal});
    return r.ok ? await r.json() : null;
  }catch(err){ return null; }
  finally{ clearTimeout(timer); }
}

/* ---------- interface ---------- */
const T = DATA.strings;
const PAGE_LANG = T[document.documentElement.lang] ? document.documentElement.lang : 'en';
lens = PAGE_LANG==='fa' ? 'p' : 'w';   // a link or the buttons can change it
const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const localDigits = (s,lang) => lang==='fa' ? String(s).replace(/\d/g,d=>FA_DIGITS[d]) : String(s);

function drawRoll(phrase){
  const svg = $('roll'); svg.textContent = '';
  const midis = phrase.notes.map(n=>n.midi), lo = Math.min(...midis), hi = Math.max(...midis), span = Math.max(1,hi-lo);
  phrase.notes.forEach(n=>{
    const r = document.createElementNS('http://www.w3.org/2000/svg','rect');
    const x = n.t/phrase.total*300, w = Math.max(phrase.notes.length>40 ? 2.5 : 4,n.dur*.9/phrase.total*300);
    const y = 64 - (n.midi-lo)/span*54;
    r.setAttribute('x',x.toFixed(1)); r.setAttribute('y',y.toFixed(1));
    r.setAttribute('width',w.toFixed(1)); r.setAttribute('height','6'); r.setAttribute('rx','3');
    svg.appendChild(r);
  });
}

/* ---------- the map ---------- */
const PAD = $('pad'), MARK = $('mark');
function moveMarker(p){
  MARK.style.insetInlineStart = 'auto'; MARK.style.right = 'auto';
  MARK.style.left = ((p.v+1)/2*100)+'%'; MARK.style.top = ((1-p.a)/2*100)+'%'; MARK.hidden = false;
}
function syncLens(){
  document.querySelectorAll('#taf-lens button').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.l===lens)));
  PAD.classList.toggle('lens-p', lens==='p');
}
Object.keys(POS).forEach(k=>{
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'taf-dot'; b.dataset.k = k; if(RARE.has(k)) b.dataset.rare = '';
  b.style.left = ((POS[k].v+1)/2*100)+'%'; b.style.top = ((1-POS[k].a)/2*100)+'%';
  const name = T[PAGE_LANG].emotions[k].name;
  b.innerHTML = '<span class="taf-dot-name"></span>'; b.firstChild.textContent = name;
  b.setAttribute('aria-label',name);
  b.addEventListener('click',ev=>{ ev.stopPropagation(); $('feeling').value = ''; ensureAudio(); showResult(k,{emo:k,lang:PAGE_LANG},true,0); });
  PAD.appendChild(b);
});
function padPoint(x,y){
  const r = PAD.getBoundingClientRect();
  return {v:Math.max(-1,Math.min(1,(x-r.left)/r.width*2-1)), a:Math.max(-1,Math.min(1,1-(y-r.top)/r.height*2))};
}
function playPoint(p){
  p = {v:Math.round(p.v*100)/100, a:Math.round(p.a*100)/100};
  $('feeling').value = ''; ensureAudio();
  showResult('p:'+Math.round(p.v*20)+','+Math.round(p.a*20),{emo:nearest(p.v,p.a),lang:PAGE_LANG},true,0,p);
}
PAD.addEventListener('click',ev=>playPoint(padPoint(ev.clientX,ev.clientY)));
// Arrow keys move the point in steps, Enter or Space plays it.
let kp = {v:0,a:0};
PAD.addEventListener('keydown',ev=>{
  if(ev.target!==PAD) return;
  const s = .15, m = {ArrowLeft:[-s,0],ArrowRight:[s,0],ArrowUp:[0,s],ArrowDown:[0,-s]}[ev.key];
  if(m){ ev.preventDefault(); kp = {v:Math.max(-1,Math.min(1,kp.v+m[0])),a:Math.max(-1,Math.min(1,kp.a+m[1]))}; moveMarker(kp); }
  else if(ev.key==='Enter' || ev.key===' '){ ev.preventDefault(); playPoint(kp); }
});

function updateMeta(){
  const c = current, lang = c.lang, e = c.e;
  const sc = e.scale2 ? ((c.v%2) ? [e.scale2,e.scale] : [e.scale,e.scale2]) : [e.scale];
  $('meta').textContent = sc.map(x=>T[lang].modes[x]).join(' ' + T[lang].then + ' ') + ' · '
    + (e.free ? T[lang].free_rhythm : localDigits(e.bpm,lang) + ' bpm');
}

/* "Heard or felt?": the two questions of the listening study, 1 to 5, answered on this page only. */
const RATE = {heard:0, felt:0};
function rateNote(){
  const lang = current ? current.lang : PAGE_LANG;
  $('rateNote').textContent = (RATE.heard && RATE.felt)
    ? T[lang][RATE.felt < RATE.heard ? 'rate_less' : RATE.felt > RATE.heard ? 'rate_more' : 'rate_same'] : '';
}
document.querySelectorAll('.feeling-scale').forEach(box=>{
  for(let n=1;n<=5;n++){
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role','radio'); b.setAttribute('aria-checked','false'); b.dataset.n = n; b.textContent = n;
    b.addEventListener('click',()=>{
      RATE[box.dataset.q] = n;
      box.querySelectorAll('button').forEach(x=>x.setAttribute('aria-checked', String(+x.dataset.n===n)));
      rateNote();
    });
    box.appendChild(b);
  }
});

function showResult(text,hit,autoplay,v,pos){
  lastArgs = [text,hit,v,pos];
  const lang = hit.lang, mode = !!hit.mode, at = pos || hit.pos;
  const p = mode ? {v:0,a:0} : (at || POS[hit.emo]);
  const key = (mode || hit.keep) ? hit.emo : (at ? nearest(p.v,p.a) : hit.emo);
  const e = mode ? Object.assign({persian:true},MODES[key]) : synth(p.v,p.a,key);
  const names = T[lang].emotions;
  const label = hit.negated ? T[lang].not + ' ' + names[hit.emo].name : hit.second ? names[hit.emo].name + ' + ' + names[hit.second].name : names[key].name;
  const mod = !mode && !hit.second && hit.intensity ? T[lang][hit.intensity>0 ? 'intense' : 'gentle'] : '';
  const box = $('result');
  box.hidden = false; box.lang = lang; box.dir = lang==='fa' ? 'rtl' : 'ltr';
  current = {text,key,lang,v:v||0,pos:p,e,long:pendingLong};
  pendingLong = false;
  current.phrase = makePhrase(current);
  if(mode) MARK.hidden = true; else moveMarker(p);
  // The nearest feeling on the map is marked, so the map and the answer always agree.
  document.querySelectorAll('.taf-dot').forEach(d=>d.setAttribute('aria-current', String(!mode && d.dataset.k===key)));
  drawRoll(current.phrase);
  $('emo').textContent = label;
  if(mod){ const m = document.createElement('span'); m.className = 'feeling-emo-mod'; m.textContent = ' · ' + mod; $('emo').appendChild(m); }
  $('cue').textContent = names[key].cue;
  const rare = !mode && lens==='p' && RARE.has(key);
  $('rare').hidden = !rare; $('rare').textContent = rare ? T[lang].rare : '';
  updateMeta();
  if(!autoplay){ playId++; setPlaying(false); }
  $('share').textContent = T[lang].share;
  $('take').textContent = T[lang].take;
  $('long').textContent = T[lang][current.long ? 'shorter' : 'longer'];
  $('soundLabel').textContent = T[lang].sound;
  $('why').textContent = T[lang].why;
  ['auto','keys','strings','plucked','breath'].forEach(k=>{ $('t-'+k).textContent = T[lang]['timbre_'+k]; });
  document.querySelectorAll('#taf-timbres button').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.t===timbre)));
  $('scaleLabel').textContent = T[lang].scales;
  $('l-w').textContent = T[lang].scale_w; $('l-p').textContent = T[lang].scale_p;
  $('lensNote').textContent = T[lang].lens_note;
  syncLens();
  $('rate').hidden = mode;
  if(!mode){
    $('rateSum').textContent = T[lang].rate_sum; $('rateHelp').textContent = T[lang].rate_scale;
    $('qHeard').textContent = T[lang].rate_heard.replace('%s',names[key].name);
    $('qFelt').textContent = T[lang].rate_felt.replace('%s',names[key].name);
    $('rateLocal').textContent = T[lang].rate_local; $('rateNote').textContent = '';
    RATE.heard = RATE.felt = 0;
    document.querySelectorAll('.feeling-scale button').forEach(b=>{ b.setAttribute('aria-checked','false'); b.textContent = localDigits(b.dataset.n,lang); });
  }
  $('shareOut').textContent = '';
  $('status').textContent = '';
  if(autoplay) play();
  // On a small screen the card can start below the fold: bring it into view.
  const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  box.scrollIntoView({block:'nearest',behavior:calm?'auto':'smooth'});
}

async function handle(raw,autoplay=true,localOnly=false,v=0){
  const text = raw.trim().slice(0,40);
  if(!text) return;
  $('status').textContent = '';
  let hit = lookup(text), intensity = 0;
  if(hit && !hit.emo){ intensity = hit.intensity; hit = null; }  // "very …" with a word the page doesn't know
  if(!hit && localOnly){ $('status').textContent = ''; return; }
  if(!hit){
    $('status').textContent = '…';
    const ai = localOnly ? null : await remoteClassify(text);
    if(ai && ai.emotion && EMO[ai.emotion]){
      const l = ['en','es','fa'].includes(ai.lang) ? ai.lang : detectLang(text);
      hit = place({emo:ai.emotion,lang:l}, null, intensity);
    }
  }
  if(!hit){
    stop(); $('result').hidden = true;
    $('status').textContent = T[PAGE_LANG].unknown;
    return;
  }
  showResult(text,hit,autoplay,v);
}

$('form').addEventListener('submit',ev=>{ ev.preventDefault(); ensureAudio(); handle($('feeling').value); });
document.querySelectorAll('.taf-chip').forEach(c=>c.addEventListener('click',()=>{
  $('feeling').value = c.dataset.w; ensureAudio(); handle(c.dataset.w);
}));
$('play').addEventListener('click',()=>{
  if(!current) return;
  if($('play').dataset.playing==='true') stop();
  else { ensureAudio(); play(); }
});
$('take').addEventListener('click',()=>{
  if(!current) return;
  ensureAudio();
  current.v++; current.phrase = makePhrase(current);
  updateMeta(); drawRoll(current.phrase); play();
});
$('long').addEventListener('click',()=>{
  if(!current) return;
  ensureAudio();
  current.long = !current.long; current.phrase = makePhrase(current);
  $('long').textContent = T[current.lang][current.long ? 'shorter' : 'longer'];
  drawRoll(current.phrase); play();
});
document.querySelectorAll('#taf-lens button').forEach(b=>b.addEventListener('click',()=>{
  lens = b.dataset.l; syncLens();
  if(current && lastArgs){ pendingLong = current.long; ensureAudio(); showResult(lastArgs[0],lastArgs[1],true,lastArgs[2],lastArgs[3]); }
}));
document.querySelectorAll('#taf-timbres button').forEach(b=>b.addEventListener('click',()=>{
  timbre = b.dataset.t;
  document.querySelectorAll('#taf-timbres button').forEach(x=>x.setAttribute('aria-pressed', String(x===b)));
  if(current){ ensureAudio(); play(); }
}));
$('share').addEventListener('click',async()=>{
  if(!current) return;
  const url = location.href.split('#')[0] + '#' + (/^p:/.test(current.text) ? 'p=' + Math.round(current.pos.v*100) + ',' + Math.round(current.pos.a*100) : 'f=' + encodeURIComponent(current.text))
    + (current.v ? '&v='+current.v : '') + (timbre!=='auto' ? '&s='+timbre : '') + '&l=' + lens + (current.long ? '&g=1' : '');
  try{ await navigator.clipboard.writeText(url); $('shareOut').textContent = T[current.lang].copied; }
  catch(err){ $('shareOut').textContent = url; }
});

/* A shared link opens the result but waits for a tap before making sound. It only uses the
   words the page already knows: an unknown word would need the network, so it waits for the
   visitor to press the button. */
syncLens();
try{
  const h = location.hash, m = h.match(/f=([^&]+)/), mp = h.match(/p=(-?\d+),(-?\d+)/), hl = h.match(/[#&]l=(w|p)/);
  // A link without l= was made before the scales choice existed: it keeps the Western scales.
  if(m || mp){ lens = hl ? hl[1] : 'w'; pendingLong = /[#&]g=1/.test(h); syncLens(); }
  if(mp){
    const p = {v:Math.max(-1,Math.min(1,+mp[1]/100)), a:Math.max(-1,Math.min(1,+mp[2]/100))}, ms = h.match(/s=(keys|strings|plucked|breath)/);
    if(ms) timbre = ms[1];
    PAD.closest('details').open = true;
    showResult('p:'+Math.round(p.v*20)+','+Math.round(p.a*20),{emo:nearest(p.v,p.a),lang:PAGE_LANG},false,0,p);
  } else if(m){
    const w = decodeURIComponent(m[1]), mv = h.match(/v=(\d+)/), ms = h.match(/s=(keys|strings|plucked|breath)/);
    if(ms) timbre = ms[1];
    $('feeling').value = w; handle(w,false,true,mv ? Math.min(99,+mv[1]) : 0);
  }
}catch(err){}
})();
