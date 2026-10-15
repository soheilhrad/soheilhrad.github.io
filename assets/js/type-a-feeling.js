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
  pentaMaj:[0,2,4,7,9]
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

/* Where each feeling sits on the map: valence (dark to bright, left to right) and arousal (calm to
   intense, bottom to top), on Russell's circumplex (1980). The positions are not set by hand: they
   are where people rated the word for the feeling in the norms of Warriner, Kuperman & Brysbaert
   (2013), as (rating - 5) / 4. They come from _data/feelings.yml, made by tools/make_feelings.py,
   which also says how the few feelings without a rating of their own were placed (ESTIMATED).
   Touching anywhere on the map plays music for that point: tempo, mode, register and brightness
   follow the position, so there are as many tracks as there are places to touch. */
const POS = {}, ESTIMATED = new Set();
DATA.feelings.forEach(f=>{ POS[f.id] = {v:f.v, a:f.a}; if(f.status==='estimated') ESTIMATED.add(f.id); });
const DARK_TO_BRIGHT = ['locrian','phrygian','minor','dorian','major','lydian'];
function nearest(v,a){
  let best = 'calm', bd = 9;
  for(const k in POS){ const d = (POS[k].v-v)**2 + (POS[k].a-a)**2; if(d<bd){ bd = d; best = k; } }
  return best;
}
/* How far each musical cue moves when the point moves on the map. The direction and the relative
   weight of valence against arousal come from Eerola, Friberg & Bresin (2013, Frontiers in
   Psychology 4:487, Table 1): listeners rated 200 pieces, built by varying six cues, as happy,
   sad, peaceful or scary, and the cues acted almost linearly and independently of each other.
   Read as the four corners of the map (happy: bright and intense, peaceful: bright and calm,
   scary: dark and intense, sad: dark and calm), the effect of valence on a cue is
   (happy + peaceful - sad - scary) / 4 and the effect of arousal is
   (happy + scary - sad - peaceful) / 4. Only these directions and ratios are published;
   how many semitones, BPM or dB a step is worth (the numbers in synth) is our choice.
   Articulation: a positive beta means more detached notes; timbre: brighter. */
const EEROLA = {
  mode:{happy:1.77,peaceful:.43,scary:-.74,sad:-1.60},          // + is major
  tempo:{happy:.25,peaceful:-.27,scary:.07,sad:-.32},
  register:{happy:.18,peaceful:.15,scary:-.23,sad:-.05},
  dynamics:{happy:-.01,peaceful:-.28,scary:.20,sad:-.05},
  articulation:{happy:.14,peaceful:-.10,scary:-.03,sad:-.18},
  timbre:{happy:.01,peaceful:-.45,scary:.15,sad:-.14}
};
const EFFECT = {};
for(const c in EEROLA){
  const b = EEROLA[c];
  EFFECT[c] = {v:(b.happy+b.peaceful-b.sad-b.scary)/4, a:(b.happy+b.scary-b.sad-b.peaceful)/4};
}
/* A step on the map (dv across, da up) as a share of the cue's range: 1 would be a full step along
   the cue's dominant axis. */
const shift = (cue,dv,da) => (EFFECT[cue].v*dv + EFFECT[cue].a*da) / (Math.abs(EFFECT[cue].v)+Math.abs(EFFECT[cue].a));

/* The feeling nearest the touch supplies the character (rhythm, contour, echo, voice); the distance
   from it moves the six cues above. At a feeling's own spot nothing moves, so the result is that
   feeling exactly. */
function synth(v,a,key){
  const base = EMO[key], dv = v-POS[key].v, da = a-POS[key].a, e = Object.assign({},base);
  const clamp = (x,lo,hi) => Math.max(lo,Math.min(hi,x));
  e.bpm = clamp(Math.round(base.bpm*Math.pow(2,.9*shift('tempo',dv,da))),40,168);
  e.root = base.root + Math.round(5*shift('register',dv,da));
  e.gain = base.gain*Math.pow(10,4*shift('dynamics',dv,da)/20);                   // about 4 dB per step
  e.bright = Math.max(900,Math.round(base.bright*Math.pow(2,1.2*shift('timbre',dv,da))));
  const art = shift('articulation',dv,da);
  e.legato = clamp(base.legato*(1-.3*art),.15,1);
  e.attack = Math.max(.004,base.attack*Math.pow(2,-1.2*art));
  const m = shift('mode',dv,da);
  if(Math.abs(m)>.2 && !base.scale2){
    const i = base.scale==='pentaMaj' ? 4 : DARK_TO_BRIGHT.indexOf(base.scale);
    if(i>=0) e.scale = DARK_TO_BRIGHT[clamp(i+Math.round(3*m),0,5)];
  }
  return e;
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
   A feeling with two scales ('bittersweet') changes scale half-way. */
function buildPhrase(word,key,e){
  const rnd = mulberry32(fnv(norm(word)+'|'+key));
  const eA = e;
  const eB = e.scale2 ? Object.assign({},e,{scale: e.scale2}) : e;
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
  const prog = !PROG[key] ? null : PROG[key], seg = prog ? t/prog.length : 0;
  const chords = prog ? prog.map((d,k)=>{
    const r = (k===prog.length-1) ? 0 : d, ee = (k/prog.length < .5) ? eA : eB;
    return {t:k*seg, dur:seg, bass:degToMidi(r,ee)-24, tones:[0,2,4].map(s=>degToMidi(r+s,ee)-12)};
  }) : [];
  return {notes,chords,total:t};
}

function makePhrase(c){ return buildPhrase(c.text,c.key,c.e); }

/* ---------- audio ---------- */
const $ = id => document.getElementById('taf-' + id);
let AC=null, master=null, bus=null, playId=0, current=null;
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

function voice(e,fx,base,midi,dur,vel,gainScale){
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

/* ---------- real instruments ---------- */
/* Each feeling is played by one recorded instrument, with strings under it and a double bass below.
   The recordings are single notes from VSCO 2 Community Edition (see tools/make_samples.py and
   _data/instruments.yml). An instrument's notes are fetched and decoded the first time it is needed,
   which is after the visitor has pressed play, never when the page loads. If they cannot be had, the
   oscillator voice above plays instead, so the page always makes sound. Which instrument suits which
   feeling is our choice, not a finding; the brightness filter (makeFx) is what carries the timbre cue. */
const LEAD = {
  joy:'piano', sadness:'violin', calm:'flute', fear:'contrabass', anger:'horn', tenderness:'harp', longing:'violin',
  wonder:'harp', hope:'piano', nostalgia:'piano', power:'trumpet', tension:'violin', transcendence:'flute',
  playfulness:'xylophone', bittersweet:'violin', moved:'violin'
};
const PAD_INST = 'violin', BASS_INST = 'contrabass';
const SAMPLE_GAIN = 2.5;           // the recordings are levelled quietly; this brings them up to the oscillators' level
const SAMPLES = new Map();         // instrument name -> promise of {kind, bufs:[{midi, buf}]}, or null
function loadInstrument(name){
  if(SAMPLES.has(name)) return SAMPLES.get(name);
  const spec = DATA.instruments && DATA.instruments[name];
  const p = !spec ? Promise.resolve(null) : Promise.all(spec.notes.map(async n=>{
    const r = await fetch(DATA.samples + name + '/' + n + '.mp3?v=' + DATA.samplesVersion);
    if(!r.ok) throw new Error(name + ' ' + n);
    return {midi:n, buf: await AC.decodeAudioData(await r.arrayBuffer())};
  })).then(bufs=>({kind:spec.kind, bufs}), ()=>{ SAMPLES.delete(name); return null; });   // try again next time
  SAMPLES.set(name,p);
  return p;
}
/* The nearest recorded note, shifted by a few semitones; a note outside the recorded range comes back
   in by octaves. A struck note (piano, harp) rings out; a bowed or blown one swells and is released. */
function sampleVoice(inst,e,fx,t0,midi,dur,vel,gainScale){
  const notes = inst.bufs, lo = notes[0].midi, hi = notes[notes.length-1].midi;
  while(midi < lo-3) midi += 12;
  while(midi > hi+3) midi -= 12;
  let best = notes[0];
  for(const n of notes) if(Math.abs(n.midi-midi) < Math.abs(best.midi-midi)) best = n;
  const rate = Math.pow(2,(midi-best.midi)/12), room = best.buf.duration/rate - .05;
  const struck = inst.kind==='struck';
  const a = struck ? .004 : Math.min(Math.max(e.attack,.03),.25);
  const rel = struck ? (e.legato < .6 ? .25 : .6) : Math.min(e.release,.8);
  const hold = Math.min(Math.max(dur*e.legato,.15), Math.max(.2,room-rel));
  const peak = e.gain*vel*(gainScale||1)*SAMPLE_GAIN;
  const g = AC.createGain();
  g.gain.setValueAtTime(.0001,t0);
  g.gain.exponentialRampToValueAtTime(peak,t0+a);
  g.gain.setValueAtTime(peak,t0+hold);
  g.gain.exponentialRampToValueAtTime(.0001,t0+hold+rel);
  const src = AC.createBufferSource();
  src.buffer = best.buf; src.playbackRate.value = rate;
  src.connect(g); g.connect(fx);
  src.start(t0); src.stop(t0+hold+rel+.05);
}
const note = (inst,e,fx,t0,midi,dur,vel,gainScale) =>
  inst ? sampleVoice(inst,e,fx,t0,midi,dur,vel,gainScale) : voice(e,fx,t0,midi,dur,vel,gainScale);

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

async function play(){
  if(!current || !ensureAudio()) return;
  const id = ++playId;
  fadeOut();
  setPlaying(true);                       // Stop shows at once, even while an instrument is still loading
  const {phrase,key,e} = current, names = [LEAD[key],PAD_INST,BASS_INST];
  if(names.some(n=>!SAMPLES.has(n))) $('status').textContent = '…';
  const [leadI,padI,bassI] = await Promise.all(names.map(loadInstrument));
  if(id!==playId) return;                 // stopped, or another feeling chosen, while it loaded
  $('status').textContent = '';
  bus = AC.createGain(); bus.connect(master);
  const fx = makeFx(e,bus), base = AC.currentTime + .1;
  phrase.notes.forEach(n=>{
    note(leadI,e,fx,base+n.t,n.midi,n.dur,n.vel,1);
    if(n.extra) note(leadI,e,fx,base+n.t,n.extra,n.dur,n.vel,.6);
  });
  const padE = Object.assign({},e,{wave:'triangle',attack:.3,decay:.5,sustain:.8,release:.7,legato:1,vib:null,detune:7,
                                   gain:e.gain*.42,pure:true,bright:Math.min(e.bright,1800)});
  const bassE = Object.assign({},e,{wave:'sine',attack:.05,decay:.3,sustain:.8,release:.5,legato:.95,vib:null,detune:0,gain:e.gain*1.1,pure:true});
  phrase.chords.forEach(c=>{
    c.tones.forEach(m=>note(padI,padE,fx,base+c.t,m,c.dur,.7,padI ? .4 : 1));
    note(bassI,bassE,fx,base+c.t,c.bass,c.dur,.8,bassI ? .7 : 1);
  });
  if(e.drone){
    // A steady note under the melody.
    const drone = (midi,peak)=>{
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = 'sine'; o.frequency.value = midiHz(midi);
      g.gain.setValueAtTime(.0001,base);
      g.gain.exponentialRampToValueAtTime(peak,base+1.5);
      g.gain.setValueAtTime(peak,base+phrase.total-1);
      g.gain.exponentialRampToValueAtTime(.0001,base+phrase.total+1.5);
      o.connect(g); g.connect(fx); o.start(base); o.stop(base+phrase.total+1.6);
    };
    drone(e.root-12, .06);
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
Object.keys(POS).forEach(k=>{
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'taf-dot'; b.dataset.k = k; if(ESTIMATED.has(k)) b.dataset.estimated = '';
  b.style.left = ((POS[k].v+1)/2*100)+'%'; b.style.top = ((1-POS[k].a)/2*100)+'%';
  const name = T[PAGE_LANG].emotions[k].name;
  b.innerHTML = '<span class="taf-dot-name"></span>'; b.firstChild.textContent = name;
  b.setAttribute('aria-label', ESTIMATED.has(k) ? name + ' (' + T[PAGE_LANG].estimated + ')' : name);
  b.addEventListener('click',ev=>{ ev.stopPropagation(); $('feeling').value = ''; ensureAudio(); showResult(k,{emo:k,lang:PAGE_LANG},true); });
  PAD.appendChild(b);
});
/* The names sit beside their points on whichever side is free of other names and points. Several
   feelings are rated almost alike, so their points nearly coincide: a name that finds no free side
   stays hidden and shows when its point is hovered, focused or playing. Needs the map to be open
   (a folded map has no size), so it runs again when the fold opens, the window changes or fonts load. */
function declutter(){
  const pr = PAD.getBoundingClientRect();
  if(!pr.width) return;
  const R = 7, dots = [...PAD.querySelectorAll('.taf-dot')];
  const pts = dots.map(d=>{ const r = d.getBoundingClientRect(), n = d.firstChild; return {d, x:r.left+r.width/2-pr.left, y:r.top+r.height/2-pr.top, w:n.offsetWidth, h:n.offsetHeight}; });
  const near = p => pts.filter(q=>q!==p && Math.hypot(q.x-p.x,q.y-p.y) < 90).length;
  const hit = (a,b) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
  const boxes = pts.map(p=>({l:p.x-R-1,r:p.x+R+1,t:p.y-R-1,b:p.y+R+1}));
  const taken = [];
  pts.map((p,i)=>({p,i})).sort((u,v)=>near(v.p)-near(u.p)).forEach(({p,i})=>{
    const cands = {
      r:{l:p.x+R+4, t:p.y-p.h/2},       l:{l:p.x-R-4-p.w, t:p.y-p.h/2},
      t:{l:p.x-p.w/2, t:p.y-R-3-p.h},   b:{l:p.x-p.w/2, t:p.y+R+3}
    };
    let side = 'x';
    for(const s of ['r','l','t','b']){
      const c = cands[s], box = {l:c.l-2, r:c.l+p.w+2, t:c.t-1, b:c.t+p.h+1};
      if(box.l < 0 || box.t < 0 || box.r > pr.width || box.b > pr.height) continue;
      if(taken.some(o=>hit(box,o)) || boxes.some((o,j)=>j!==i && hit(box,o))) continue;
      side = s; taken.push(box); break;
    }
    p.d.dataset.side = side;
  });
}
declutter();
PAD.closest('details').addEventListener('toggle',declutter);
window.addEventListener('resize',()=>requestAnimationFrame(declutter));
if(document.fonts && document.fonts.ready) document.fonts.ready.then(declutter);
function padPoint(x,y){
  const r = PAD.getBoundingClientRect();
  return {v:Math.max(-1,Math.min(1,(x-r.left)/r.width*2-1)), a:Math.max(-1,Math.min(1,1-(y-r.top)/r.height*2))};
}
function playPoint(p){
  p = {v:Math.round(p.v*100)/100, a:Math.round(p.a*100)/100};
  $('feeling').value = ''; ensureAudio();
  showResult('p:'+Math.round(p.v*20)+','+Math.round(p.a*20),{emo:nearest(p.v,p.a),lang:PAGE_LANG},true,p);
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
  const sc = e.scale2 ? [e.scale,e.scale2] : [e.scale];
  $('meta').textContent = sc.map(x=>T[lang].modes[x]).join(' ' + T[lang].then + ' ') + ' · '
    + (e.free ? T[lang].free_rhythm : localDigits(e.bpm,lang) + ' bpm');
}

function showResult(text,hit,autoplay,pos){
  const lang = hit.lang, at = pos || hit.pos;
  const p = at || POS[hit.emo];
  const key = hit.keep ? hit.emo : (at ? nearest(p.v,p.a) : hit.emo);
  const e = synth(p.v,p.a,key);
  const names = T[lang].emotions;
  const label = hit.negated ? T[lang].not + ' ' + names[hit.emo].name : hit.second ? names[hit.emo].name + ' + ' + names[hit.second].name : names[key].name;
  const mod = !hit.second && hit.intensity ? T[lang][hit.intensity>0 ? 'intense' : 'gentle'] : '';
  const box = $('result');
  box.hidden = false; box.lang = lang; box.dir = lang==='fa' ? 'rtl' : 'ltr';
  current = {text,key,lang,pos:p,e};
  current.phrase = makePhrase(current);
  moveMarker(p);
  // The nearest feeling on the map is marked, so the map and the answer always agree.
  document.querySelectorAll('.taf-dot').forEach(d=>d.setAttribute('aria-current', String(d.dataset.k===key)));
  drawRoll(current.phrase);
  $('emo').textContent = label;
  if(mod){ const m = document.createElement('span'); m.className = 'feeling-emo-mod'; m.textContent = ' · ' + mod; $('emo').appendChild(m); }
  $('cue').textContent = names[key].cue;
  updateMeta();
  if(!autoplay){ playId++; setPlaying(false); }
  $('share').textContent = T[lang].share;
  $('why').textContent = T[lang].why;
  $('shareOut').textContent = '';
  $('status').textContent = '';
  if(autoplay) play();
  // On a small screen the card can start below the fold: bring it into view.
  const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  box.scrollIntoView({block:'nearest',behavior:calm?'auto':'smooth'});
}

async function handle(raw,autoplay=true,localOnly=false){
  const text = raw.trim().slice(0,40);
  if(!text) return;
  $('status').textContent = '';
  let hit = lookup(text), intensity = 0;
  if(hit && !hit.emo){ intensity = hit.intensity; hit = null; }  // "very …" with a word the page doesn't know
  if(!hit && localOnly){ $('status').textContent = ''; return; }
  if(!hit){
    $('status').textContent = '…';
    const ai = await remoteClassify(text);
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
  showResult(text,hit,autoplay);
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
$('share').addEventListener('click',async()=>{
  if(!current) return;
  const url = location.href.split('#')[0] + '#' + (/^p:/.test(current.text) ? 'p=' + Math.round(current.pos.v*100) + ',' + Math.round(current.pos.a*100) : 'f=' + encodeURIComponent(current.text));
  try{ await navigator.clipboard.writeText(url); $('shareOut').textContent = T[current.lang].copied; }
  catch(err){ $('shareOut').textContent = url; }
});

/* A shared link opens the result but waits for a tap before making sound. It only uses the
   words the page already knows: an unknown word would need the network, so it waits for the
   visitor to press the button. Links made when there were more options (#...&v=, &s=, &l=, &g=)
   still open; the extra parts are ignored. */
try{
  const h = location.hash, m = h.match(/f=([^&]+)/), mp = h.match(/p=(-?\d+),(-?\d+)/);
  if(mp){
    const p = {v:Math.max(-1,Math.min(1,+mp[1]/100)), a:Math.max(-1,Math.min(1,+mp[2]/100))};
    PAD.closest('details').open = true;
    showResult('p:'+Math.round(p.v*20)+','+Math.round(p.a*20),{emo:nearest(p.v,p.a),lang:PAGE_LANG},false,p);
  } else if(m){
    const w = decodeURIComponent(m[1]);
    $('feeling').value = w; handle(w,false,true);
  }
}catch(err){}
})();
