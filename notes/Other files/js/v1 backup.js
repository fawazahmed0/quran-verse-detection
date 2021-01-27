// Re read the comments and remove unwanted and implement the ideas

// Use conventions for variable names and function names, search google

// Add more translations to make sure not to miss any verse, (very important, try adding all english translations to avoid missing any verse)

// This will contain visible parsed html text, we will do it page wise to make it easier to count relevance,remove multiple whitespaces/tabs etc from text to make things easier, code is there in qacode.txt
var str;

// start unit testing

// Have to use multiple english translations to get all the results
// Refer https://en.wikipedia.org/wiki/Biblical_canon  to add more names
// https://en.wikipedia.org/wiki/New_Testament
var ignoreBiblePattern = [
  /genesis/gi,
  /exodus/gi,
  /leviticus/gi,
  /number/gi,
  /deuteronomy/gi,
  /joshua/gi,
  /judges/gi,
  /ruth/gi,
  /samuel/gi,
  /kings/gi,
  /chronicl/gi,
  /ezra/gi,
  /nehemiah/gi,
  /esther/gi,
  /job/gi,
  /psalm/gi,
  /proverb/gi,
  /Ecclesiastes/gi,
  /song/gi,
  /Canticles/gi,
  /Isaiah/gi,
  /Jeremiah/gi,
  /Lamentations/gi,
  /Ezekiel/gi,
  /Daniel/gi,
  /Hosea/gi,
  /Joel/gi,
  /Amos/gi,
  /Obadiah/gi,
  /Micah/gi,
  /Nahum/gi,
  /Habakkuk/gi,
  /Zephaniah/gi,
  /Haggai/gi,
  /Zechariah/gi,
  /Malachi/gi,
  /Matthew/gi,
  /Mark/gi,
  /Luke/gi,
  /John/gi,
  /Apostles/gi,
  /Romans/gi,
  /Corinthians/gi,
  /Epistle/gi,
  /Paul/gi,
  /Galatians/gi,
  /Ephesians/gi,
  /Philippians/gi,
  /Colossians/gi,
  /Thessalonians/gi,
  /Thessalonians/gi,
  /Timothy/gi,
  /Titus/gi,
  /Philemon/gi,
  /Hebrews/gi,
  /James/gi,
  /Peter/gi,
  /Jude/gi,
  /Revelation/gi
]

var ignoreQuranPattern = [/course/gi, /recit/gi, /listen/gi, /hear/gi, /read/gi, /learn/gi, /study/gi, /understand/gi]




// Matches quran, surah, ayah, names of surah etc
var confirmPattern = [
  /\s(q(u|o)r.{1,4}n|k(o|u)r.{1,4}n)/gi,
  /\ss(ū|u|o){1,2}ra/gi,
  /\s(a|ā)y(a|ā)/gi,
  /\sverse/gi,
  /\schapter/gi,
  /\s[0-9]{1,3}\s{0,5}:\s{0,5}[0-9]{1,3}\s{0,5}(-|to|and)\s{0,5}[0-9]{1,3}/gi,
  /\s[0-9]{1,3}\s{0,5}:\s{0,5}[0-9]{1,3}/gi
]
// Pattern for names of surah and their chapter numbers
// keep tigher pattern up, test it using https://en.wikipedia.org/wiki/List_of_chapters_in_the_Quran
// might have to keep arabic names in other var
// check there shouldn't be mistakes in surah number
/*
Alphabets with Diacritic
(a|ā)
(d|Ḏ)
(h|ḥ)
(ī|i|e)
(ū|u|o)
(s|Š)
(t|Ṭ)
(q|q̈)

*/
var arabicQuranName = [
  [/f(a|ā){1,2}(t|Ṭ)i(h|ḥ)(a|ā)/gi, 1],
  [/b(a|ā){1,2}(q|q̈)(a|ā){1,2}r(a|ā)/gi, 2],
  [/(ī|i|e)mr(a|ā){1,2}n/gi, 3],
  [/n(ī|i|e)s(a|ā)/gi, 4],
  [/m(a|ā){1,2}.?(ī|i|e)(d|Ḏ)(a|ā)/gi, 5],
  [/(a|ā)n.?(a|ā){1,2}m/gi, 6],
  [/(a|ā){1,2}.?r(a|ā){1,2}f/gi, 7],
  [/(a|ā)nf(a|ā){1,2}l/gi, 8],
  [/(t|Ṭ)(a|ā){1,2}wb(a|ā){1,2}/gi, 9],
  [/b(a|ā)r(a|ā){1,2}.?(a|ā){0,2}/gi, 9],
  [/y(ū|u|o){1,2}n(ū|u|o){1,2}s/gi, 10],
  [/h(ū|u|o){1,2}(d|Ḏ)/gi, 11],
  [/y(ū|u|o){1,2}(s|Š)(ū|u|o){1,2}f/gi, 12],
  [/r(a|ā){1,2}(d|Ḏ)/gi, 13],
  [/(i|e|a|ī|ā){1,2}br(a|ā){1,2}(h|ḥ)(a|i|ī|e){1,2}m/gi, 14],
  [/(Ḥ|h)(ī|i|e)jr/gi, 15],
  [/n(a|ā){1,2}(Ḥ|h)l/gi, 16],
  [/(ī|i|e)sr(a|ā)/gi, 17],
  [/k(a|ā){1,2}(h|ḥ)f/gi, 18],
  [/m(a|ā){1,2}ry/gi, 19],
  [/(t|Ṭ)(a|ā){1,2}.{0,3}(h|ḥ)(a|ā){1,2}/gi, 20],
  [/(a|ā)nb(ī|i|e)y/gi, 21],
  [/(h|Ḥ)(a|ā){1,2}j/gi, 22],
  [/m(ū|u|o){1,2}.?m(ī|i|e){1,2}n(ū|u|o){1,2}n/gi, 23],
  [/n(u{1}|o{2})r/gi, 24],
  [/f(ū|u|o){1,2}r(q|q̈)(a|ā){1,2}n/gi, 25],
  [/(s|Š)h?(ū|u|o){1,2}.?(a|ā){1,2}r(a|ā){1,2}/gi, 26],
  [/n(a|ā){1,2}ml/gi, 27],
  [/(q|Q̈)(a|ā){1,2}(s|ṣ)(a|ā){1,2}(s|ṣ)/gi, 28],
  [/(a|ā)nk(a|ā)b.{1,3}t/gi, 29],
  [/ru{1}m/gi, 30],
  [/l(ū|u|o)(q|q̈)m(a|ā){1,3}n/gi, 31],
  [/(s|Š)(a|ā)j(d|Ḏ)(a|ā)/gi, 32],
  [/(a|ā)(ḥ|h)z(a|ā){1,2}b/gi, 33],
  [/(s|Š)(a|ā){1,2}b(a|ā)/gi, 34],
  [/f(a|ā){1,2}(t|ṭ)(ī|i|e){1,2}r/gi, 35],
  [/m(a|ā)l(a|ā){1,2}.?(ī|i|e){1,2}k(a|ā)/gi, 35],
  [/y(a|ā){1,2}.?(s|Š)(ī|i|e){1,2}n/gi, 36],
  [/(s|Ṣ)(a|ā){1,3}f{1,2}(a|ā){1,3}t/gi, 37],
  [/(s|Ṣ)(a|ā){1,2}(d|Ḏ)/gi, 38],
  [/z(ū|u|o)m(a|ā){1,3}r/gi, 39],
  [/g(h|ḥ)?(ā|a){1,2}f(ī|i|e){1,2}r/gi, 40],
  [/f(ū|u|o){1,2}(s|ṣ){1,2}(ī|i|e){1,2}l(a|ā){1,2}(t|Ṭ)/gi, 41],
  [/(Ḥ|h)(ā|a).{1,3}.?m(ī|i|e){1,2}m (s|Š)(a|ā)j(d|Ḏ)(a|ā)/gi, 41],
  [/(s|Š)(h|ḥ)(ū|u|o){1,3}r(a|ā){1,3}/gi, 42],
  [/z(ū|u|o)k(h|ḥ)?r(ū|u|o){1,3}f/gi, 43],
  [/(d|Ḏ)(ū|u|o){1,2}k(h|ḥ)?(a|ā){1,2}n/gi, 44],
  [/j(a|ā){1,2}(t|Ṭ)(h|ḥ)?(ī|i|e)y(a|ā)h/gi, 45],
  [/j(a|ā){1,2}(s|Š)(ī|i|e)y(a|ā)h/gi, 45],
  [/(a|ā)(ḥ|h)(q̈|q)(a|ā){1,2}f/gi, 46],
  [/m(ū|u|o){1,2}(ḥ|h)(a|ā)mm(a|ā)(d|Ḏ)/gi, 47],
  [/f(a|ā)(t|Ṭ)(h|ḥ)/gi, 48],
  [/(h|ḥ)(u|o)j(u|o)r(a|ā){1,2}t/gi, 49],
  [/(Q̈|q)(a|ā){1,2}f/gi, 50],
  [/(d|Ḏ)h?(a|ā){1,2}r(ī|i|e)y(a|ā){1,2}t/gi, 51],
  [/(Ṭ|t)(o|ū|u){1,2}r/gi, 52],
  [/n(a|ā)jm/gi, 53],
  [/(q|Q̈)(a|ā)m(a|ā)r/gi, 54],
  [/ra(ḥ|h)m(a|ā){1,2}n/gi, 55],
  [/w(a|ā){1,2}(q|q̈)(ī|i|e).?(a|ā)/gi, 56],
  [/(h|Ḥ)(a|ā)(d|Ḏ)(ī|i|e){1,2}(d|Ḏ)/gi, 57],
  [/m(ū|u|o){1,2}j(ā|a){1,2}(d|Ḏ)(ī|i|e){1,2}l(ā|a)/gi, 58],
  [/(h|Ḥ)(ā|a){1,2}(š|s)h?r/gi, 59],
  [/m(ū|u|o)m(t|Ṭ)(ā|a){1,2}(h|Ḥ)(i|a|e){1,2}n(ā|a)/gi, 60],
  [/(ī|i|e)m(t|Ṭ)(ī|i|e)(h|ḥ)(a|ā){1,2}n/gi, 60],
  [/m(a|ā)w(a|ā)(d|Ḏ){1,2}(a|ā)/gi, 60],
  [/Ṣ(ā|a){1,2}f/gi, 61],
  [/j(ū|u|o)m(ū|u|o)?.?(a|ā){1,2}/gi, 62],
  [/m(ū|u|o){1,2}n(ā|a){1,2}f(ī|i|e){1,2}(q̈|q)(o|ū|u){1,2}n/gi, 63],
  [/(t|Ṭ)(ā|a)g(h|ḥ)?(ā|a){1,2}b(o|ū|u)n/gi, 64],
  [/(t|Ṭ)al(ā|a){1,2}(q|q̈)/gi, 65],
  [/(t|Ṭ)(a|ā)(h|ḥ)r(e|ī|i){1,2}m/gi, 66],
  [/(Q̈|q)(a|ā)l(a|ā){1,2}m/gi, 68],
  [/(Ḥ|h)(ā|a){1,2}(Q̈|q){1,2}(ā|a)/gi, 69],
  [/m(ā|a){1,2}.(ā|a){1,2}r(ī|i|e)j/gi, 70],
  [/n(o|ū|u){1,2}(a|ā)?(ḥ|h)/gi, 71],
  [/j(ī|i|e)n/gi, 72],
  [/m(ū|u|o)zz?(a|ā)mm?(ī|i|e)l/gi, 73],
  [/m(ū|u|o)(d|Ḏ){1,2}(a|ā)(t|Ṭ)?(h|ḥ)?(t|Ṭ)?(h|ḥ)?(ī|i|e)r/gi, 74],
  [/(q|Q̈)(ī|i|e)y(a|ā)m(a|ā)/gi, 75],
  [/(ī|i|e)n(s|Š)(a|ā){1,2}n/gi, 76],
  [/m(o|ū|u){1,2}r(s|Š)(ā|a){1,2}l(ā|a){1,2}(t|Ṭ)/gi, 77],
  [/n(a|ā)b(a|ā){1,2}/gi, 78],
  [/n(a|ā){1,2}z(ī|i|e).?(a|ā){1,2}(t|Ṭ)/gi, 79],
  [/(a|ā)b(a|ā){1,2}(s|Š)(a|ā){1,2}/gi, 80],
  [/(t|Ṭ)(a|ā)kw(i|e|ī){1,2}r/gi, 81],
  [/(i|e|ī)nf(i|e|ī)(ṭ|t)(a|ā){1,2}r/gi, 82],
  [/m(o|ū|u){1,2}(ṭ|t)(a|ā){1,2}ff?(ī|i|e){1,2}ff?(ī|i|e){1,2}n/gi, 83],
  [/(i|e|ī)n(š|s)h?(i|e|ī)(q̈|q)(a|ā){1,2}(q̈|q)/gi, 84],
  [/b(ū|o|u).?r(ū|o|u){1,2}j/gi, 85],
  [/(Ṭ|t)(a|ā){1,2}r(ī|i|e){1,2}(q̈|q)/gi, 86],
  [/(a|ā){1,2}l(a|ā){1,2}/gi, 87],
  [/g(h|ḥ)?(a|ā){1,2}(s|š){1,2}(h|ḥ)?(i|e|ī)y(a|ā)/gi, 88],
  [/f(a|ā){1,2}j(a|ā)?r/gi, 89],
  [/b(a|ā){1,2}l(a|ā){1,2}(d|Ḏ)/gi, 90],
  [/(s|š)(h|ḥ)?(a|ā)m(s|š)/gi, 91],
  [/l(a|ā)yl/gi, 92],
  [/(Ḍ|d)(h|ḥ)?(ū|u|o)(ḥ|h)(a|ā)/gi, 93],
  [/(s|š)h?(a|ā)r(ḥ|h)/gi, 94],
  [/(ī|i|e)n(s|š)h?(ī|i|e)r(a|ā){1,2}/gi, 94],
  [/(t|Ṭ)(ī|i|e){1,2}n/gi, 95],
  [/(a|ā){1,2}l(a|ā){1,2}(q|q̈)/gi, 96],
  [/(Q̈|q)(a|ā){1,2}(d|Ḏ)(a|ā){0,2}r/gi, 97],
  [/b(a|ā)yy?(ī|i|e)n(a|ā){1,2}/gi, 98],
  [/z(a|ā){1,2}lz(a|ā){1,2}l(a|ā){1,2}/gi, 99],
  [/(a|ā){1,2}(d|Ḏ)(ī|i|e)y(a|ā){1,2}/gi, 100],
  [/(Q̈|q)(a|ā){1,2}r(ī|i|e){1,2}.?(a|ā)/gi, 101],
  [/(t|Ṭ)(a|ā)k(a|ā){1,2}(t|Ṭ)(h|ḥ)?(ū|u|o)r/gi, 102],
  [/(t|Ṭ)(a|ā)k(a|ā){1,2}(s|Š)(ū|u|o){1,2}r/gi, 102],
  [/(a|ā){1,2}(s|š)r/gi, 103],
  [/(Ḥ|h)(ū|u|o){1,2}m(a|ā){1,2}z(a|ā){1,2}/gi, 104],
  [/f(i|e{2})l/gi, 105],
  [/(q|q̈)(ū|u|o){1,2}r(a|ā){1,2}(i|y)(s|š)(h|ḥ)?/gi, 106],
  [/m(a|ā){1,2}.?(ū|o|u){1,2}n/gi, 107],
  [/k(a|ā){1,2}(u|w)(Ṭh|tḥ|Ṭḥ|th|s|Š)(a|ā){1,2}r/gi, 108],
  [/k(a|ā){1,2}f(ī|i|e){1,2}r(ū|o|u){1,2}n/gi, 109],
  [/n(a|ā){1,2}(s|š)r/gi, 110],
  [/m(a|ā){1,2}(s|š)(a|ā){1,2}(d|Ḏ)/gi, 111],
  [/(ī|i|e)k(h|ḥ)l(a|ā){1,2}(s|š)/gi, 112],
  [/(t|Ṭ)(a|ā)w(ḥ|h)(ī|i|e){1,2}(d|Ḏ)/gi, 112],
  [/f(a|ā){1,2}l(a|ā){1,2}q̈/gi, 113],
  [/n(a|ā){1,2}(s|š)/gi, 114]

]




var englishQuranName = [
  [/open/gi, 1],
  [/key/gi, 1],
  [/Seven Oft/gi, 1],
  [/calf/gi, 2],
  [/heifer/gi, 2],
  [/cow/gi, 2],
  [/women/gi, 4],
  [/food/gi, 5],
  [/table/gi, 5],
  [/feast/gi, 5],
  [/cattle/gi, 6],
  [/livestock/gi, 6],
  [/height/gi, 7],
  [/elevation/gi, 7],
  [/purgatory/gi, 7],
  [/discernment/gi, 7],
  [/spoil.{1,7}war/gi, 8],
  [/repent/gi, 9],
  [/repudiation/gi, 9],
  [/jona.{0,2}h/gi, 10],
  [/josep/gi, 12],
  [/josef/gi, 12],
  [/thunder/gi, 13],
  [/tract/gi, 15],
  [/stone/gi, 15],
  [/rock/gi, 15],
  [/bee/gi, 16],
  [/journey/gi, 17],
  [/cave/gi, 18],
  [/prophet/gi, 21],
  [/pilgrimage/gi, 22],
  [/believer/gi, 23],
  [/light/gi, 24],
  [/criteri/gi, 25],
  [/standard/gi, 25],
  [/poet/gi, 26],
  [/ant/gi, 27],
  [/narration/gi, 28],
  [/stor(ies|y)/gi, 28],
  [/spider/gi, 29],
  [/roman/gi, 30],
  [/byzanti/gi, 30],
  [/prostration/gi, 32],
  [/adoration/gi, 32],
  [/worship/gi, 32],
  [/clan/gi, 33],
  [/confederat/gi, 33],
  [/force/gi, 33],
  [/Coal(a|i)tion/gi, 33],
  [/sheba/gi, 34],
  [/originat/gi, 35],
  [/initiator/gi, 35],
  [/creator/gi, 35],
  [/angel/gi, 35],
  [/crowd/gi, 39],
  [/troop/gi, 39],
  [/throng/gi, 39],
  [/forgiv/gi, 40],
  [/detail/gi, 41],
  [/distinguish/gi, 41],
  [/spell/gi, 41],
  [/consult/gi, 42],
  [/council/gi, 42],
  [/counsel/gi, 42],
  [/gold/gi, 43],
  [/luxury/gi, 43],
  [/smoke/gi, 44],
  [/kneel/gi, 45],
  [/crouching/gi, 45],
  [/Hobbling/gi, 45],
  [/sand/gi, 46],
  [/dunes/gi, 46],
  [/victory/gi, 48],
  [/conquest/gi, 48],
  [/triumph/gi, 48],
  [/apartment/gi, 49],
  [/chambers/gi, 49],
  [/room/gi, 49],
  [/wind/gi, 51],
  [/Scatter/gi, 51],
  [/mount/gi, 52],
  [/the star/gi, 53],
  [/the unfold/gi, 53],
  [/moon/gi, 54],
  [/merciful/gi, 55],
  [/gracious/gi, 55],
  [/inevitable/gi, 56],
  [/event/gi, 56],
  [/iron/gi, 57],
  [/plead/gi, 58],
  [/Dialogue/gi, 58],
  [/disput/gi, 58],
  [/muster/gi, 59],
  [/exile/gi, 59],
  [/banish/gi, 59],
  [/gather/gi, 59],
  [/examin/gi, 60],
  [/affection/gi, 60],
  [/rank/gi, 61],
  [/column/gi, 61],
  [/battle array/gi, 61],
  [/friday/gi, 62],
  [/congrega/gi, 62],
  [/hypocri/gi, 63],
  [/loss/gi, 64],
  [/cheat/gi, 64],
  [/depriv/gi, 64],
  [/illusion/gi, 64],
  [/divorce/gi, 65],
  [/prohibition/gi, 66],
  [/banning/gi, 66],
  [/forbid/gi, 66],
  [/mulk/gi, 67],
  [/dominion/gi, 67],
  [/sovereignty/gi, 67],
  [/kingship/gi, 67],
  [/kingdom/gi, 67],
  [/control/gi, 67],
  [/pen/gi, 68],
  [/reality/gi, 69],
  [/truth/gi, 69],
  [/Incontestable/gi, 69],
  [/Indubitable/gi, 69],
  [/ascen(t|d)/gi, 70],
  [/stairway/gi, 70],
  [/ladder/gi, 70],
  [/spirit/gi, 72],
  [/unseen being/gi, 72],
  [/enwrap/gi, 73],
  [/enshroud/gi, 73],
  [/bundle/gi, 73],
  [/wrap/gi, 74],
  [/cloak/gi, 74],
  [/shroud/gi, 74],
  [/resurrect/gi, 75],
  [/ris.{1,14}dead/gi, 75],
  [/man/gi, 76],
  [/emissar/gi, 77],
  [/winds? sent forth/gi, 77],
  [/dispached/gi, 77],
  [/tiding/gi, 78],
  [/announcement/gi, 78],
  [/great news/gi, 78],
  [/pull out/gi, 79],
  [/drag forth/gi, 79],
  [/Snatcher/gi, 79],
  [/Forceful Charger/gi, 79],
  [/frown/gi, 80],
  [/overthrow/gi, 81],
  [/Cessation/gi, 81],
  [/Darkening/gi, 81],
  [/Rolling/gi, 81],
  [/turning.{1,12}sphere/gi, 81],
  [/cleaving( asunder)?/gi, 82],
  [/burst(ing)? apart/gi, 82],
  [/shattering/gi, 82],
  [/splitting/gi, 82],
  [/Cataclysm/gi, 82],
  [/fraud/gi, 83],
  [/cheat/gi, 83],
  [/Stinter/gi, 83],
  [/Sundering/gi, 84],
  [/Splitting (Open|asunder)/gi, 84],
  [/constellation/gi, 85],
  [/mansion.{1,12}star/gi, 85],
  [/great star/gi, 85],
  [/galax(ies|y)/gi, 85],
  [/nightcomer/gi, 86],
  [/knocker/gi, 86],
  [/pounder/gi, 86],
  [/(bright|night|piercing|morning) star/gi, 86],
  [/high/gi, 87],
  [/overwhelming/gi, 88],
  [/pall/gi, 88],
  [/Overshadowing/gi, 88],
  [/Enveloper/gi, 88],
  [/dawn/gi, 89],
  [/break of day/gi, 89],
  [/city/gi, 90],
  [/land/gi, 90],
  [/sun/gi, 91],
  [/night/gi, 92],
  [/morning (light|hours|bright)/gi, 93],
  [/bright morning/gi, 93],
  [/early hours/gi, 93],
  [/forenoon/gi, 93],
  [/solace/gi, 94],
  [/comfort/gi, 94],
  [/heart/gi, 94],
  [/opening(-| )up/gi, 94],
  [/Consolation/gi, 94],
  [/relief/gi, 94],
  [/fig/gi, 95],
  [/clot/gi, 96],
  [/germ.?cell/gi, 96],
  [/embryo/gi, 96],
  [/cling/gi, 96],
  [/destiny/gi, 97],
  [/fate/gi, 97],
  [/power/gi, 97],
  [/decree/gi, 97],
  [/night.{1,10}(honor|majesty)/gi, 97],
  [/evidence/gi, 98],
  [/proof/gi, 98],
  [/sign/gi, 98],
  [/quake/gi, 99],
  [/charger/gi, 100],
  [/courser/gi, 100],
  [/Assaulter/gi, 100],
  [/calamity/gi, 101],
  [/shocker/gi, 101],
  [/rivalry/gi, 102],
  [/competition/gi, 102],
  [/hoard/gi, 102],
  [/worldly gain/gi, 102],
  [/time/gi, 103],
  [/declining day/gi, 103],
  [/epoch/gi, 103],
  [/eventide/gi, 103],
  [/gossip/gi, 104],
  [/slanderer/gi, 104],
  [/traducer/gi, 104],
  [/scandalmonger/gi, 104],
  [/Backbite/gi, 104],
  [/scorn/gi, 104],
  [/elephant/gi, 105],
  [/kindness/gi, 107],
  [/almsgiving/gi, 107],
  [/charity/gi, 107],
  [/Assistance/gi, 107],
  [/Necessaries/gi, 107],
  [/abundance/gi, 108],
  [/plenty/gi, 108],
  [/bounty/gi, 108],
  [/disbeliever/gi, 109],
  [/deny.{1,10}truth/gi, 109],
  [/kuff?aa?r/gi, 109],
  [/Atheist/gi, 109],
  [/help/gi, 110],
  [/support/gi, 110],
  [/palm fibre/gi, 111],
  [/rope/gi, 111],
  [/strand/gi, 111],
  [/Sincer/gi, 112],
  [/monotheism/gi, 112],
  [/absolute/gi, 112],
  [/unity/gi, 112],
  [/oneness/gi, 112],
  [/Fidelity/gi, 112],
  [/daybreak/gi, 113],
  [/rising dawn/gi, 113],
  [/men/gi, 114],
  [/people/gi, 114],
  [/mankind/gi, 114]

]

// chronological Order, chapter No pattern
var chronologicalOrder = [
[1,96],
[2,68],
[3,73],
[4,74],
[5,1],
[6,111],
[7,81],
[8,87],
[9,92],
[10,89],
[11,93],
[12,94],
[13,103],
[14,100],
[15,108],
[16,102],
[17,107],
[18,109],
[19,105],
[20,113],
[21,114],
[22,112],
[23,53],
[24,80],
[25,97],
[26,91],
[27,85],
[28,95],
[29,106],
[30,101],
[31,75],
[32,104],
[33,77],
[34,50],
[35,90],
[36,86],
[37,54],
[38,38],
[39,7],
[40,72],
[41,36],
[42,25],
[43,35],
[44,19],
[45,20],
[46,56],
[47,26],
[48,27],
[49,28],
[50,17],
[51,10],
[52,11],
[53,12],
[54,15],
[55,6],
[56,37],
[57,31],
[58,34],
[59,39],
[60,40],
[61,41],
[62,42],
[63,43],
[64,44],
[65,45],
[66,46],
[67,51],
[68,88],
[69,18],
[70,16],
[71,71],
[72,14],
[73,21],
[74,23],
[75,32],
[76,52],
[77,67],
[78,69],
[79,70],
[80,78],
[81,79],
[82,82],
[83,84],
[84,30],
[85,29],
[86,83],
[87,2],
[88,8],
[89,3],
[90,33],
[91,60],
[92,4],
[93,99],
[94,57],
[95,47],
[96,13],
[97,55],
[98,76],
[99,65],
[100,98],
[101,59],
[102,24],
[103,22],
[104,63],
[105,58],
[106,49],
[107,66],
[108,64],
[109,61],
[110,62],
[111,48],
[112,5],
[113,9],
[114,110]
]


// Array of Json to store translations
var translations = []

var arabicEnglishQuranName = arabicQuranName.concat(englishQuranName)

$(document).ready(function() {
    // more translations to not miss any verse, we depend on count to clean wrong match
  // Sahih Translation
  fetch(`https://api.alquran.cloud/v1/quran/en.sahih`).then(response => response.json())
    .then(data => {
      translations.push(data)
    })

  fetch(`https://api.alquran.cloud/v1/quran/en.pickthall`).then(response => response.json())
    .then(data => {
      translations.push(data)
    })

    fetch(`https://api.alquran.cloud/v1/quran/en.yusufali`).then(response => response.json())
      .then(data => {
        translations.push(data)
      })


});



var confirmatory = []
// Have to empty it before retrieving new results
var confirmedVerses = []

// Fetch positions of all 1-3 digit numbers under 300 as max verse is 286
// Example 45:33, you will get 45, but 33 won't be match, but we got the position and that's important
var numberPattern = new RegExp('[0-9]+', 'gi')
// var numberPattern = new RegExp('[[^0-9][0-2]?[0-9]{1,2}]', 'gi')
//  var numberPattern = new  RegExp('\D[0-2]?\d{1,2}\D','gi')

var patternList = []


// If verse already in verified, no need to verify again
// we will check page wise, get pages using jquery, using string will break things up

// Have to make sure we don't verify for same verse again
// Get 40 before and after of match
var charsBackFront = 40
var maxChapter = 114
var maxVerse = 286
// removing multiple spaces from str
str = str.replace(/\s\s+/g, " ")

// Contains pattern, chapterNo, fromVerse, toVerse
var confirmedChPattern = []

var numbers = str.matchAll(numberPattern);

// printing confirmedpatters
for (quranname of arabicQuranName){
  if(quranname[1]!=47)
     {
      // we will skip chapter 47, muhammad, as it can generate many false positive
       patternList.push(quranname[0].toString().replace('/','/\\s'))
     }
}
patternList = confirmPattern.concat(patternList)





outerLoop:
for (let number of numbers) {
if (number[0]<=maxVerse){

  var frontstr = str.substring(number.index, number.index + charsBackFront)
  var totalstr = str.substring(number.index - charsBackFront, number.index + charsBackFront)


  // Removing diacritical marks, Getting only alphanumeric chars, removing all punctuations , double whitespaces etc
  // Regex chapter pattern search will be done on cleantotalstr
  // Ref: https://thread.engineering/2018-08-29-searching-and-sorting-text-with-diacritical-marks-in-javascript/
  // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
  var cleantotalstr = totalstr.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  cleantotalstr = cleantotalstr.replace(/(\[|\(|,|\-)/g, " ").replace(/[^\w\s]|_/g, "").replace(/\s\s+/g, " ")
  //      totalstr =  str.substring(number.index-charsBackFront, number.index+charsBackFront)
  // Get all the numbers from string in an array
  var numsinstr = frontstr.match(/[0-9]+/g) || []
  var chapterArray = []




  if (numsinstr.length > 1) {
  //  console.log("inside numsinstr.length > 1")
    // chapter Number, verse pattern
    if(checkAddAyah(number, numsinstr[0], numsinstr[1]) )
    {    //    continue outerLoop

      confirmMessage(numsinstr[0], numsinstr[1], numsinstr[1],number[0], cleantotalstr)
   }
  }

  if(numsinstr.length > 2){
// console.log("inside numsinstr.length > 2")
    // chapter Number, verse1 to verse2 pattern
    if(checkAddAyah(number, numsinstr[0], numsinstr[1], numsinstr[2]) ){
        //    continue outerLoop
        confirmMessage(numsinstr[0], numsinstr[1], numsinstr[2],number[0], cleantotalstr)

}

  }





//rare cases

// Getting possible chapternames in totalstr
  for (chapterno of arabicEnglishQuranName){
  if( new RegExp(chapterno[0]).test(cleantotalstr) ){
  //  console.log("This passes regex "+chapterno[0]+" : "+chapterno[1])
         chapterArray.push(chapterno)
       }
  }


for (chapter of chapterArray){
 // console.log("inside chapter search numsinstr is "+numsinstr[0] + " : "+ chapter[0]+ " : "+ chapter[1]+" : "+cleantotalstr)
// Chapter Name, verse pattern
if(checkAddAyah(number, chapter[1], numsinstr[0]) ){
          // Remembering pattern used to get the chapter, to remove false postive, matched from verse containing the pattern
         confirmedChPattern.push([chapter[0], chapter[1],numsinstr[0], numsinstr[0] ])
    //    continue outerLoop
      confirmMessage(chapter[1], numsinstr[0], numsinstr[0], number[0], cleantotalstr)
      }
// Chapter Name, verse1 to verse2 pattern
if( numsinstr.length > 1 && checkAddAyah(number, chapter[1], numsinstr[0], numsinstr[1]) ){
    // Remembering pattern used to get the chapter, to remove false postive, matched from verse containing the pattern
     confirmedChPattern.push([chapter[0], chapter[1],numsinstr[0], numsinstr[1] ])
    //    continue outerLoop
    confirmMessage(chapter[1], numsinstr[0], numsinstr[1], number[0], cleantotalstr)
}
}

if (numsinstr.length > 1) {

  // Verse No, Chapter Number pattern
if(checkAddAyah(number, numsinstr[1], numsinstr[0]) )
    {  //   continue outerLoop
      confirmMessage(numsinstr[1], numsinstr[0], numsinstr[0], number[0], cleantotalstr)
    }
}


if(numsinstr.length > 2){

  // verse1 to verse2, Chapter Number pattern
  if(checkAddAyah(number, numsinstr[2], numsinstr[0],numsinstr[1] ) )
            {    //  continue outerLoop
                confirmMessage(numsinstr[2], numsinstr[0], numsinstr[1], number[0], cleantotalstr)
            }

}




// Checking for full chapter number with no ayah pattern
// Chapter Number pattern (with no ayah, i.e full chapter) Eg: Chapter 110
chaplength = getChapterLength(translations[0],numsinstr[0])
verselength = getVerses(translations[0],numsinstr[0],1,chaplength).length
if(numsinstr[0]<=maxChapter && chaplength != 0 && verselength < 1500 )
checkAddAyah(number, numsinstr[0], 1, chaplength)


  // if contains confirmPattern or confirmQuranName, then quran verse

  // if search verify returns true, add verse

  //else if contains ignorePattern and verse not contains ignorePattern skip;
}

}

/*
// if verse chaptername pattern match and above 5 and below 5 verses contain that pattern then remove this verse, as there is chance of false positive

// confirmedChPattern Contains pattern, chapterNo, fromVerse, toVerse

// Removing false postive matches due to chaptername containing in verse, we are not considering here multiple verses
// This code seems to slow down whole chrome, not sure what's wrong in that, I think I will have to depend on counts to detect false positives
confirmLoop:
for (confirmedPattern of confirmedChPattern){
  let pattern = confirmedPattern[0]
  let chapter = confirmedPattern[1]
  let fromVerse = confirmedPattern[2]
//  let toVerse = confirmedPattern[3]

for(translation of translations){
       let limit = 3
      let index =   confirmedVerses.findIndex((element) => element[0] == chapter && element[1] == fromVerse )

   for(i=index-limit;i<=2*limit;i++){

      if(index != -1 && confirmedVerses[i] !== undefined && i!=index){

        try{
        versevalue = getVerses(translation, confirmedVerses[i][0], confirmedVerses[i][1] )
      }catch(error){
        console.error(error)
        verseval = ""
      }
        versevalue = versevalue.substring(0,charsBackFront)+" "+versevalue.substring(versevalue.length-charsBackFront)
        if (new RegExp(pattern).test(versevalue)){
              confirmedVerses.splice(index, 1)
               continue confirmLoop
            }
      }


   }

}




}

*/




// verify this code
function checkAddAyah(number, chapter, fromVerse, toVerse) {

  let multiVerses = true
  if (toVerse === undefined) {
    toVerse = fromVerse
    multiVerses = false
  }



  if (checkVerse(translations[0], chapter, toVerse) && !checkIncludes(chapter, fromVerse, toVerse) && fromVerse<=toVerse) {
  //  console.log("checking for "+chapter+":"+fromVerse+"-"+toVerse)
      // str is global string which contains the html page text
  var frontstr = str.substring(number.index, number.index + charsBackFront)
//  var totalstr = str.substring(number.index - charsBackFront, number.index + charsBackFront)
  //      totalstr =  str.substring(number.index-charsBackFront, number.index+charsBackFront)
  // Get all the numbers from string in an array
  var numsinstr = frontstr.match(/[0-9]+/g) || []





  for (translation of translations) {





      let verses = getVerses(translation, chapter, fromVerse, toVerse)
      let verseWordLength = verses.trim().split(/\s+/).length;
      // Getting front and back text before and after pattern, we don't want arabic or other language text, only english text
      let lengthMultiple = 4
      let textback = str.substring(number.index - (lengthMultiple * verses.length), number.index)
      textback = textback.replace(/[^\w\s]|_/g, "").replace(/\s\s+/g, " ")
      textback = textback.substring(textback.length - charsBackFront - verses.length)

      let textfront = str.substring(number.index, number.index + (lengthMultiple * verses.length))
      textfront = textfront.replace(/[^\w\s]|_/g, "").replace(/\s\s+/g, " ")
      textfront = textfront.substring(0, charsBackFront + verses.length)

      // confirming using search engine
      if (searchCheck(textback, verses) || searchCheck(textfront, verses)) {


        addInArray(chapter, fromVerse, toVerse)

        return true
      }

      // We will perform all verses together check with the content first, if it fails then (code is written above for this)
      // we will perform verse by verse check on big content only if content length(total ayah length) is less that some number(maybe 100-200 words, the less the better), so that it doen't return false positive
      // And if it matches a patter like 5 to 6, 5 and 6, 5-6
      // we do this to get quoted partial verse, so whichever verse passes gets into confirmedVerses


      if (multiVerses) {



        let multiVersePattern = /[0-9]\s{0,20}-\s{0,20}[0-9]|[0-9].{1,20}(to|and).{1,20}[0-9]/gi

        var numsinfrontstr = frontstr.matchAll(/[0-9]+/g)
        var numsIndexArray = []
        for (nums of numsinfrontstr) {
          if (nums[0] == fromVerse || nums[0] == toVerse)
            numsIndexArray.push(nums.index)
        }


        if (new RegExp(multiVersePattern).test(frontstr.substring(numsIndexArray[0], numsIndexArray[1] + 1)) && verseWordLength < 150) {
          let test = false
          for (i = fromVerse; i <= toVerse; i++) {

            if (searchCheck(textback, getVerses(translation, chapter, i)) || searchCheck(textfront, getVerses(translation, chapter, i))) {

              addInArray(chapter, i)
              test = true
            }

          }
          if (test)
            return true

        }



      }else{
             // Matching for partial single verses
             // We will match 10 words content with 5 words verse
           let tempverse = verses
           let partialtextback = textback.trim().split(/\s+/).slice(-10).join(' ')
           let partialtextfront = textfront.trim().split(/\s+/).slice(0,10).join(' ')
           // No of first words in verse to use during search
           let SearchSliceNo = 6
          // No of words to remove from verse at each iteration
           let verseSliceNo = 3

          while(tempverse.length>0){

            // confirming using search engine, only using first 5 words of verse to search
            if (searchCheck(partialtextback, tempverse.trim().split(/\s+/).slice(0,SearchSliceNo).join(' ')) || searchCheck(partialtextfront, tempverse.trim().split(/\s+/).slice(0,SearchSliceNo).join(' '))) {

              //  console.log("partialcheck pass:"+chapter+":"+fromVerse+"-"+toVerse)
              addInArray(chapter, fromVerse, toVerse)

              return true
            }
             // Removing first word from tempverse
           tempverse = tempverse.trim().split(/\s+/).slice(3).join(' ')

          }

      }

    }



  }

  return false

}



// Function to check if chapter and verse is already inside confirmedVerses or not
function checkIncludes(chapter, fromVerse, toVerse) {
  if (toVerse === undefined)
    toVerse = fromVerse



  for (i = fromVerse; i <= toVerse; i++) {
    if (!confirmedVerses.some((element) => element[0]  == chapter && element[1]  == i))
      return false
  }
  return true

}

// Make function to verify numbers are quran quoted

// Make function to verify using search

// Make a function a extract the verses from text, have to also take care of 6:5-10

// Adds chapter and verse inside confirmedVerses Array
function addInArray(chapter, fromVerse, toVerse) {
  if (toVerse === undefined)
    toVerse = fromVerse


  for (i = fromVerse; i <= toVerse; i++) {
    confirmedVerses.push([parseInt(chapter), parseInt(i)])
  }

}


function getVerses(translation, chapter, fromVerse, toVerse) {

  if (toVerse === undefined)
    toVerse = fromVerse


  var totaltext = ""


  try {

    for (i = fromVerse; i <= toVerse; i++)
      totaltext = totaltext + translation.data.surahs[chapter - 1].ayahs[i - 1].text +" "


  } catch (error) {
    return ""
  }

  return totaltext

}

function checkVerse(translation, chapter, verse) {

  try {
    // If this throws error, it means the ayah does not exist
    var temp = translation.data.surahs[chapter - 1].ayahs[verse - 1].text
    return true
  } catch (error) {
    return false

  }

}

function getChapterLength(translation, chapter){
try{
return translation.data.surahs[chapter - 1].ayahs.length
}catch(error){
  return 0
}

}
// Have to test this later again
// Using lunr.js ,as it's better in document search
function searchCheck(content, query) {
  // Getting only alphanumeric chars, removing all punctuations , double whitespaces etc
  content = content.replace(/[^\w\s]|_/g, "").replace(/\s\s+/g, " ");
  query = query.replace(/[^\w\s]|_/g, "").replace(/\s\s+/g, " ");
  // count no of words in query
  // Ref: https://stackoverflow.com/questions/18679576/counting-words-in-string
  var queryLength = query.trim().split(/\s+/).length;
  var contentLength = content.trim().split(/\s+/).length;
  var scoreThreshold;

  // If contentLength is huge compared to queryLength, there is high chance of returning false postive, so we will just return as false
  // This will happen only in case of muti ayah checks,where singleAyah is checked with large content
  if (contentLength / queryLength > 10)
    return false

  if (queryLength > 300) {
    // Seeing the coorelation pattern below, I got to this scoreThreshold
    // This was checked by manually performing queries and noting the score
    scoreThreshold = 1.15 / 250 * queryLength;
  } else if (queryLength > 250) {
    scoreThreshold = 1.6;
  } else if (queryLength > 200) {
    scoreThreshold = 1.5;
  } else if (queryLength > 150) {
    scoreThreshold = 1.3;
  } else if (queryLength > 100) {
    scoreThreshold = 1.1;
  } else if (queryLength > 70) {
    scoreThreshold = 1;
  } else if (queryLength > 40) {
    scoreThreshold = 0.95;
  } else if (queryLength > 35) {
    scoreThreshold = 0.9;
  } else if (queryLength > 25) {
    scoreThreshold = 0.69;
  } else if (queryLength > 12) {
    scoreThreshold = 0.49;
  } else if (queryLength > 4) {
    scoreThreshold = 0.35;
  } else {
    scoreThreshold = 0.25;
  }


  var idx = lunr(function() {
        this.field('body')

    this.add({
      "body": content,
      "id": "1"
    })
  })
  try {

  //  console.log("content " + content)
  //  console.log("query " + query)

//    console.log("Inside searchCheck ", idx.search(query))

    // If this throws error, it means query has no match
    if (idx.search(query)[0].score > scoreThreshold) {
      return true
    }
    return false
  } catch (error) {
    return false
  }


}

// Takes an array of numbers or strings and returns a 2 dimentional array
// Copied from stackoverflow, as I cannot really think of a way to get permuatations
// Have to make sure, this code works as expected
// Ref: https://stackoverflow.com/questions/9960908/permutations-in-javascript/20871714#20871714
// Currently not using this function
function permute(permutation) {
  var length = permutation.length,
    result = [permutation.slice()],
    c = new Array(length).fill(0),
    i = 1,
    k, p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      result.push(permutation.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
}


// chrono, chap
// confirmed working fine
function chronologicalSort(a,b){
  // Can also fetch this from json (json generated by me)


  // Ref: https://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value
  // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
  // Getting chronological order of each chapter

 // There is chance of this throwing error, if confirmedVerses contains a chapter which is not a chapter i.e above 114 or below 1

try{

chronoA = chronologicalOrder.find(element => element[1] == a[0])[0]
chronoB= chronologicalOrder.find(element => element[1] == b[0])[0]
}catch(error){
  console.error(error)
  return 0
}
 // Same chapter,then sort by verses
  if (chronoA == chronoB) {

   if(a[1] == b[1])
   return 0;

  return (a[1] < b[1]) ? -1 : 1;


      }
      else {
          return (chronoA  < chronoB) ? -1 : 1;
      }




}

function confirmMessage(chapter, fromVerse, toVerse, numberUsed, totstr){

  for (list of patternList){
    if(new RegExp(list).test(cleantotalstr))
       {
         console.log("Confirmed Pattern: "+list+" chapter:"+chapter+",verse:"+fromVerse+"-"+toVerse+" NumberUsed:"+numberUsed+" cleantotalstr:"+totstr)
       }
  }

}

function uniqueChronologicalSort(){
uniquearr = []
for (confirmverse of confirmedVerses){
  if(!uniquearr.some((element) => element[0]  == confirmverse[0] && element[1]  == confirmverse[1]))
    uniquearr.push([confirmverse[0],confirmverse[1]])
}
confirmedVerses = uniquearr
confirmedVerses.sort(chronologicalSort)
}


uniqueChronologicalSort()

//sorting array by chronology

//Printing the verses:
for (confirm of confirmedVerses){
console.log(confirm[0]+":"+confirm[1]+" "+ getVerses(translations[0],confirm[0],confirm[1]))
}

var chaplength = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6]

var mappings = []
function lineToVerseMap(){


for(i=1;i<=114;i++)
{

for(j=1;j<=chaplength[i-1];j++){
  mappings.push([i,j])
}

}

}
