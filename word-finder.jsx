// Word Finder Fun — reward game after a perfect session
// Variable letter count by difficulty, length-based scoring,
// weekly words give a bonus, click or type, untimed, gentle shake,
// reveal unfound at end.

const { useState: useWFState, useEffect: useWFEffect, useMemo: useWFMemo, useRef: useWFRef, useCallback: useWFCallback } = React;

// Curated kid-friendly word list (3-7 letters).
// Keep reasonably short; game filters by puzzle letters anyway.
const KID_DICTIONARY = [
  // 3
  "act","add","age","ago","aim","air","ant","any","arm","art","ask","ate","bad","bag","bat","bed","bee","big","bit","box","boy","bug","bun","bus","but","buy","cab","can","cap","car","cat","cow","cry","cub","cup","cut","dad","day","den","did","dig","dim","dog","dot","dry","ear","eat","egg","elf","end","eye","fan","far","fat","few","fig","fin","fit","fix","fly","fog","for","fox","fry","fun","fur","gap","gas","gem","get","got","gum","gun","had","ham","hat","hay","hen","her","hid","him","hip","his","hit","hop","hot","hub","hug","hum","hut","ice","ill","ink","inn","its","jam","jar","jaw","jet","job","jog","joy","key","kid","kit","lab","lap","law","lay","led","leg","let","lid","lie","lip","lit","log","lot","low","mad","man","map","mat","men","met","mix","mob","mom","mop","mud","mug","nap","net","new","nod","not","now","nut","oak","odd","off","oil","old","one","our","out","owl","own","pad","pan","pat","paw","pay","pea","pen","pet","pig","pin","pit","pop","pot","pro","pub","pup","put","ram","ran","rat","raw","red","rib","rid","rig","rim","rip","rob","rod","row","rub","rug","run","sad","sat","saw","say","sea","see","set","she","shy","sin","sip","sir","sit","six","sky","sly","sob","son","sow","spy","sum","sun","tab","tag","tan","tap","tar","tax","tea","ten","the","thy","tie","tin","tip","toe","ton","too","top","toy","try","tub","tug","two","use","van","vet","vow","wag","war","was","wax","way","web","wed","wee","wet","who","why","wig","win","wit","won","yak","yap","yes","yet","you","zip","zoo",
  // 4
  "able","acid","aged","also","area","arms","army","aunt","back","bake","ball","band","bank","barn","base","bath","beam","bean","bear","beat","beef","been","bell","belt","bend","best","bike","bill","bind","bird","bite","blow","blue","boat","body","bold","bolt","bone","book","boot","born","boss","both","bowl","bran","bred","brow","buck","bulk","bull","burn","bush","busy","cage","cake","calf","call","calm","came","camp","cane","card","care","carp","cars","cart","case","cash","cast","cats","cave","cell","chat","chef","chew","chin","chip","city","clam","clap","claw","clay","clip","club","coal","coat","code","coin","cold","come","cone","cook","cool","cope","copy","cord","core","cork","corn","cost","cozy","crab","craw","crop","crew","crib","crop","crow","cube","curl","cute","damp","dare","dark","dart","dash","date","dawn","days","dead","deal","dear","deed","deep","deer","desk","dial","dice","dies","diet","dine","dirt","disc","dish","dive","does","dome","done","dons","door","dose","down","drag","draw","drew","drip","drop","drug","drum","duck","duct","dude","dues","duet","duke","dull","dump","dune","dung","dusk","dust","duty","each","earn","ears","ease","east","easy","eats","edge","eggs","eight","else","emit","empty","envy","epic","even","ever","evil","exit","eyes","face","fact","fade","fail","fair","fake","fall","fame","fang","fans","fare","farm","fast","fate","fear","feat","feed","feel","feet","fell","felt","fern","ferry","figs","file","fill","film","find","fine","fins","fire","firm","fish","fist","five","flag","flap","flat","flaw","flea","fled","flew","flex","flip","flop","flow","flue","flux","foam","foes","fold","folk","fond","font","food","fool","foot","fork","form","fort","foul","four","fowl","fray","free","from","fuel","full","fund","funk","fury","fuse","gain","game","gang","gash","gate","gave","gaze","gear","germ","gets","gift","gill","girl","give","glad","glee","glen","glob","glue","glum","gnat","goal","goat","gods","gold","gone","good","goof","gosh","grab","gray","grew","grid","grim","grin","grip","grit","grub","gulf","gull","gulp","gush","gust","guts","hail","hair","half","hall","halt","hand","hang","hard","hare","hark","harm","harp","hash","hate","haul","have","hawk","hays","haze","hazy","head","heal","heap","hear","heat","heel","held","hell","help","hemp","hens","herb","herd","here","hero","hers","hide","high","hike","hill","hilt","hint","hips","hire","hiss","hits","hive","hoax","hobo","hold","hole","holy","home","hone","hood","hoof","hook","hoop","hope","horn","hose","host","hour","huge","hula","hull","hump","hung","hunk","hunt","hurl","hurt","hush","husk","hymn","idea","idle","idol","inch","inks","into","iris","iron","isle","itch","item","jabs","jade","jail","jams","jars","java","jaws","jazz","jean","jeep","jeer","jell","jerk","jest","jets","jibe","jigs","jive","jobs","join","joke","jolt","joys","jugs","juke","jump","junk","jury","just","kale","keen","keep","kegs","kelp","kept","keys","kick","kids","kill","kiln","kilo","kilt","kind","king","kiss","kite","kits","knee","knew","knit","knob","knot","know","lace","lack","lads","lady","laid","lain","lake","lamb","lame","lamp","land","lane","lank","laps","lard","lark","lash","last","late","laud","lawn","laws","lays","lazy","lead","leaf","leak","lean","leap","ledge","left","legs","lend","lens","less","lest","lets","liar","lice","lick","lids","lied","lies","life","lift","like","limb","lime","limp","line","link","lint","lion","lips","lisp","list","live","load","loaf","loan","lobe","lock","loft","logs","lone","long","look","loom","loop","loot","lord","lore","lose","loss","lost","loud","love","luck","lull","lump","lung","lure","lush","lute","lynx","mace","made","maid","mail","main","make","male","mall","malt","mama","mane","many","maps","mare","mark","mart","mash","mask","mass","mast","mate","math","maul","maze","mead","meal","mean","meat","meek","meet","meld","melt","memo","mend","menu","mere","mesh","mess","mice","midi","mike","mild","mile","milk","mill","mime","mind","mine","mini","mink","mint","mire","miss","mist","mite","mitt","moan","moat","mock","mode","mold","mole","molt","monk","mono","mood","moon","moor","moos","mope","more","morn","moss","most","moth","much","muck","muff","mugs","mull","muse","mush","muss","must","mute","myth","nail","name","naps","navy","near","neat","neck","need","nerd","nest","nets","news","next","nibs","nice","nick","nigh","nine","nips","node","nook","noon","nope","nor","nori","norm","nose","note","noun","nova","nudge","nuke","null","numb","nuns","nuts","oaks","oars","oath","oboe","obey","odds","odes","oily","okay","omit","once","ones","only","onto","oops","oozy","open","opal","oral","orb","orbs","ores","ours","oust","outs","oval","oven","over","owed","owes","owls","owns","pace","pack","pact","page","paid","pail","pain","pair","pale","palm","pane","pang","pans","papa","park","part","pass","past","path","paws","pays","peak","pear","peas","peat","peck","peek","peel","peep","peer","pegs","pelt","pens","perk","pest","pets","pews","pick","pier","pies","pigs","pike","pile","pill","pimp","pine","ping","pink","pins","pint","pipe","pits","pity","plan","play","plea","plod","plot","plow","ploy","plug","plum","plus","pods","poem","poet","pogo","poke","pole","poll","pomp","pond","pony","pool","poor","pope","pops","pore","pork","port","pose","posh","post","pots","pour","pout","pram","pray","prey","prim","prod","prom","prop","pros","prow","puck","puff","pull","pulp","pump","punk","puns","punt","pups","pure","purr","push","puss","puts","putt","quad","quay","quip","quit","quiz","race","rack","racy","raft","rage","raid","rail","rain","rake","ramp","rams","rang","rank","rant","raps","rare","rash","rasp","rate","rats","rave","raze","razor","read","real","reap","rear","redo","reds","reed","reef","reek","reel","refs","rely","rent","rest","rhea","ribs","rice","rich","rick","ride","rids","riff","rift","rigs","rile","rims","ring","rink","rinse","riot","ripe","rise","risk","rite","road","roam","roar","robe","rock","rode","rods","roll","romp","roof","rook","room","root","rope","rose","rosy","rots","rove","rows","rub","rubs","rude","rugs","ruin","rule","runs","rung","runt","ruse","rush","rust","ruts","sack","safe","sage","said","sail","sake","sale","salt","same","sand","sane","sang","sank","saps","sash","sass","save","saws","says","scab","scan","scar","scat","scum","seal","seam","sear","seas","seat","seed","seek","seem","seen","seep","seer","sees","self","sell","send","sent","sets","sewn","sews","shed","shim","shin","ship","shoe","shop","shot","show","shun","shut","sick","side","sift","sigh","sign","silk","sill","silo","silt","sing","sink","sins","sips","sirs","site","sits","size","skid","skim","skin","skip","skis","skit","slab","slag","slam","slap","slat","slay","sled","slew","slid","slim","slip","slit","slob","slop","slot","slow","slug","slum","slur","smog","smug","snag","snap","snip","snit","snob","snow","snub","snug","soak","soap","soar","sobs","sock","soda","sofa","soft","soil","sold","sole","some","song","soon","soot","sore","sort","soul","soup","sour","sown","spam","span","spar","spas","spat","spec","sped","spew","spin","spit","spot","spry","spud","spun","spur","stab","stag","star","stay","stem","step","stew","stir","stop","stub","stud","stun","subs","such","suck","suds","sues","sugar","suit","sulk","sums","sung","sunk","suns","sure","surf","swam","swan","swap","swat","sway","swig","swim","tabs","tack","tact","tads","tags","tail","take","tale","talk","tall","tame","tang","tank","taps","tare","tarp","tars","task","tats","taut","taxi","teak","teal","team","tear","teas","teem","tell","temp","tend","tens","tent","term","test","text","than","that","thaw","them","then","they","thin","this","thou","thud","thug","thus","tick","tide","tidy","tied","tier","ties","tile","till","tilt","time","tins","tint","tiny","tips","tire","toad","toast","toed","toes","toga","togs","toil","told","toll","tomb","tone","tong","tons","took","tool","toot","tops","tore","torn","toss","tots","tour","tout","town","tows","toys","trace","track","tract","trade","trail","train","tram","trap","tray","tree","trek","trip","trod","trot","troy","true","tsar","tubs","tuck","tuft","tugs","tuna","tune","turf","turn","tusk","tutu","twig","twin","twit","tyke","tyre","ugly","ulna","unit","unto","upon","urge","used","uses","utes","vain","vale","vamp","vane","vans","vary","vase","vast","vats","veal","veer","veil","vein","vend","vent","verb","very","vest","veto","vets","vial","vibe","vice","vied","view","vile","vine","vise","void","volt","vote","vows","wade","wads","waft","wage","wags","waif","wail","wait","wake","wale","walk","wall","wand","wane","want","ward","ware","warm","warn","warp","wars","wart","wary","wash","wasp","watt","wave","wavy","waxy","ways","weak","wean","wear","webs","weds","week","weep","well","went","wept","were","west","what","when","whim","whip","whir","whiz","who","whoa","whom","wick","wide","wife","wigs","wild","will","wilt","wily","wimp","wind","wine","wing","wink","wins","wipe","wire","wiry","wise","wish","wisp","with","woes","woke","wolf","womb","wonk","wont","wood","woof","wool","woos","word","wore","work","worm","worn","wove","wrap","wren","writ","yaks","yank","yard","yarn","yawn","yaws","year","yell","yelp","yogi","yoke","yolk","your","yowl","yule","zany","zaps","zeal","zebra","zero","zest","zinc","zing","zips","zone","zoom","zoos",
  // 5+
  "about","above","adore","adult","after","again","agent","agree","ahead","alarm","alive","allow","alone","along","alter","among","anger","angry","apart","apple","april","apron","arena","argue","arise","arose","array","arrow","aside","asset","avoid","awake","award","aware","awful","awoke","baker","banjo","basic","basil","baste","beach","beads","beard","beast","began","begin","begun","being","below","bench","bento","berry","bible","birth","black","blade","blame","blank","blast","bleak","bleat","bleed","bless","blest","blind","blink","bloat","block","bloke","blond","blood","bloom","blown","bluer","blues","bluff","blunt","board","boast","bogus","boils","bones","bonus","booth","booze","boxer","brace","brag","brain","brake","brand","brave","bread","break","breed","briar","bribe","brick","bride","brief","bring","brink","briny","brisk","broad","broil","broke","brood","brook","broom","broth","brown","brush","burly","bushy","butte","buyer","cabin","cable","cacao","cache","cadet","cafes","caked","cakes","camel","cameo","camps","candy","canon","caped","caper","capes","carat","cards","cargo","carol","carry","carve","caste","catch","cater","cause","cease","chalk","champ","chant","chaos","chard","charm","chart","chase","cheap","cheat","check","cheek","cheer","chef","chefs","chest","chews","chewy","chick","chide","chief","child","chile","chili","chill","chime","china","chips","chirp","chomp","chops","chord","chore","chose","chunk","churn","chute","cider","cigar","cinch","circle","civic","civil","clack","claim","clamp","clans","clash","clasp","class","clean","clear","cleat","cleft","clerk","click","cliff","climb","cling","clink","cloak","clock","clomp","clone","close","cloth","cloud","clove","clown","cluck","clued","clues","clump","clung","coach","coast","cobra","cocoa","codes","comet","comfy","comic","conch","condo","cones","cooks","corns","corps","couch","cough","could","count","court","cover","covet","crabs","crack","craft","cramp","crane","crank","crash","crass","crate","crave","crawl","craze","crazy","cream","creed","creek","creep","crept","cress","crest","crib","cried","cries","crimp","crisp","croak","crock","crone","crony","crook","croon","crops","cross","crowd","crown","crude","cruel","crumb","crump","crush","crust","crypt","cubed","cubes","cubit","curls","curly","curry","curse","curvy","cycle","daily","dairy","daisy","dance","dared","dashy","dated","dates","datum","dazes","dazzle","death","debit","debts","debut","decal","decay","decoy","decry","deeds","deeps","defer","deign","deity","delay","delta","delve","demos","denim","dense","depot","depth","derby","desks","deter","detox","diary","dices","diced","diets","digit","dikes","diner","dines","dingo","dings","dingy","dinks","dirty","disco","disks","ditch","dives","dizzy","docks","dodge","dodos","doers","doest","doeth","dogma","doily","doing","dolly","domes","donor","doors","doted","dotes","doubt","dough","dowel","downy","doyen","dozed","dozen","dozes","draft","drain","drake","drama","drank","drape","drawl","drawn","draws","dread","dream","dress","dried","drier","dries","drift","drill","drink","drips","drive","droll","drone","drool","droop","drops","dross","drove","drown","drugs","drums","drunk","dryer","dryly","ducal","ducat","ducks","duels","duets","dukes","dulls","dully","dummy","dumps","dumpy","dunce","dunes","dungs","duper","duped","dusky","dusts","dusty","dwarf","dwell","dwelt","dyers","dying","eager","eagle","early","earns","earth","easel","eases","eaten","eater","ebony","edged","edges","eerie","eggnog","egret","eight","eject","elbow","elder","elect","elegy","elfin","elide","elite","elope","elude","elves","email","ember","emery","emoji","empty","enact","ended","endow","enema","enemy","enjoy","ennui","ensue","enter","entry","envoy","epics","epoch","epoxy","equal","equip","erase","erect","error","erupt","essay","ester","ethic","evade","event","every","evict","evils","exact","exalt","excel","exert","exile","exist","extol","extra","exult","fable","faced","faces","facts","fades","fails","faint","fairs","fairy","faith","faked","fakes","fallen","false","famed","fancy","fangs","fanny","farms","fasts","fates","fatty","fault","fauna","favor","feast","fecal","feeds","feels","feign","feint","fells","felon","femur","fence","fends","ferry","fetal","fetch","feted","fetid","fever","fewer","fiber","fickle","fiddle","field","fiend","fiery","fifty","fight","filch","filed","files","filet","fills","filly","films","filth","final","finch","finds","fined","finer","fines","fired","fires","firms","first","fishy","fists","fixed","fixes","fjord","flack","flags","flair","flake","flaky","flame","flank","flaps","flare","flash","flask","flats","fleas","flecks","fleet","flesh","flick","flier","flies","fling","flint","flips","flirt","flits","float","flock","flogs","flood","floor","flops","floss","flour","flout","flown","flows","fluff","fluid","fluke","flume","flung","flunk","flush","flute","foamy","focal","focus","foggy","foils","folds","folic","folio","folks","folly","fonts","foods","fools","foots","force","fords","fores","forge","forgo","forks","forms","forte","forth","forts","forty","forum","found","fount","fours","fowls","foxes","foyer","frail","frame","franc","frank","fraud","frays","freed","freer","frees","fresh","fried","frier","fries","frill","frisk","fritz","frock","frog","froze","fruit","fudge","fuels","fumed","fumes","funds","fungi","funky","funny","furls","fussy","fuzzy","gable","gaily","gains","gaits","galas","gales","galls","gamed","games","gamma","gangs","gaped","gapes","gappy","garbs","gases","gasps","gassy","gates","gaudy","gauge","gaunt","gauze","gawks","gawky","gazed","gazes","gears","geeks","geeky","gemmy","genes","genie","genre","gents","germs","ghost","ghoul","giant","gifts","gilds","girls","girth","given","gives","glade","glads","glare","glass","glaze","gleam","glean","glide","glint","gloat","globe","globs","gloom","glory","gloss","glove","glows","glued","glues","gluey","glut","gnash","gnaws","goads","goals","goats","godly","goers","going","golds","golfs","goner","goofs","goofy","goose","gored","gores","gory","gourd","gout","grabs","grace","grade","graft","grail","grain","grams","grand","grant","grape","graph","grasp","grass","grate","grave","gravy","graze","great","greed","greek","green","greet","grew","grid","grief","grill","grim","grime","grimy","grin","grind","grins","gripe","grips","gripy","grist","grits","groan","groin","groom","grope","gross","group","grout","grove","growl","grown","grows","grubs","gruel","gruff","grunt","guard","guava","guess","guest","guide","guild","guile","guilt","gulch","gulfs","gulls","gulps","gumbo","gummy","gunks","gunky","guppy","gurus","gushy","gusty","gutsy","gypsy","habit","hacks","hailed","hails","hairs","hairy","halls","halos","halts","halve","hands","handy","hangs","happy","hardy","hares","harks","harms","harps","harsh","harts","haste","hasty","hatch","hated","hater","hates","hath","hauls","haunt","haute","haven","haver","havoc","hawks","hazed","hazel","hazes","heads","heady","heals","heaps","heard","hears","heart","heath","heats","heaved","heaven","heaves","heavy","heck","hedge","heeds","heels","hefts","hefty","heirs","heist","helix","hello","hells","helms","helps","hence","herbs","herds","heroes","heros","hertz","hewed","hewer","hexed","hexes","hider","hides","highs","hijack","hiked","hiker","hikes","hills","hilly","hinge","hints","hippo","hippy","hired","hires","hitch","hives","hoard","hoary","hobby","hoe","hoed","hoes","hoist","holds","holes","holey","hollow","holly","homer","homes","homey","honed","honey","honks","honor","hoods","hoofs","hooks","hoops","hoots","hoped","hopes","horde","horns","horny","horse","hosed","hoses","hosts","hotel","hotly","hound","hours","house","hover","howdy","howls","hubby","huffs","huffy","huge","hulks","hulky","hulls","human","humid","humps","humus","hunch","hunks","hunts","hurls","hurry","hurts","husks","husky","hussy","hutch","hydra","hymn","hymns","hyper","icily","icing","ideal","ideas","idiom","idiot","idled","idler","idles","idols","igloo","iliac","ilium","image","imbue","impel","imply","inane","inapt","inbox","incur","index","indie","inept","inert","infer","ingot","inked","inner","input","inset","intro","invoke","ionic","irate","irons","irony","island","islet","issue","itchy","items","ivied","ivies","ivory","jabbed","jades","jails","jambs","japes","jaunt","jawed","jazzy","jeans","jeeps","jeers","jelly","jerks","jerky","jests","jetty","jewel","jiffy","jihad","jilts","jimmy","jingle","jinks","jinni","jinxed","jives","jobs","jocks","jogger","joins","joint","joist","jokes","jolly","jolts","jolty","jowls","joyed","joys","judge","juice","juicy","julep","jumbo","jumpy","junks","junky","junta","juror","kabob","kayak","keels","keens","keeps","kelps","kempt","kenn","keyed","khaki","kicks","kills","kilns","kilts","kinds","kings","kinky","kiosk","kites","kitty","kiwis","knack","knave","knead","kneed","kneel","knees","knelt","knife","knits","knob","knobs","knock","knots","known","knows","labor","laced","laces","lacks","laden","ladle","lager","lairs","lakes","lambs","lamed","lamer","lames","lamps","lance","lands","lanes","lanky","lapel","lapse","large","larva","laser","lasso","lasts","latch","later","lathe","laths","latte","laugh","learn","lease","leash","least","leave","leech","leeds","leeks","leers","leery","lefts","legal","lemma","lemon","lemur","lends","lense","leper","level","lever","liars","libel","licit","licks","liege","liens","lifer","lifts","light","liked","liken","likes","lilac","limbo","limbs","limes","limit","limps","lined","linen","liner","lines","links","lions","lipid","lisps","lists","lithe","liter","lives","livid","llama","loads","loafs","loams","loamy","loans","loath","lobby","lobed","lobes","local","locks","locus","lodge","lofts","lofty","logic","logos","loins","loiter","lolls","loner","longs","looks","looms","loons","loony","loops","loopy","loose","loots","lords","loser","loses","louse","lousy","lover","loves","lower","loyal","lumps","lumpy","lunar","lunch","lunge","lungs","lurch","lured","lures","lurid","lurks","lusts","lusty","lying","mace","macho","madam","madly","magic","magma","maids","mails","maims","mains","maize","major","maker","makes","males","malls","malts","malty","mamas","mamba","mambo","mamma","manes","mange","mango","mangy","mania","manic","manly","manna","manor","manse","maple","march","mares","marks","marry","marsh","mart","mascot","mashed","mashes","masks","mason","masse","masts","matador","match","mated","mates","maths","matte","maul","mauls","mauve","maxim","mayor","mazes","meads","meals","means","meant","meany","meats","meaty","mecca","media","medic","meets","melds","melee","melon","melts","mends","meow","meows","merge","merit","merry","meshy","messy","metal","meted","meter","metro","mezzo","micro","midst","might","miked","mikes","miles","milky","mills","mimed","mimes","mimic","minds","mined","miner","mines","mini","minis","mink","minks","minor","mints","minty","minus","mired","mires","mirth","misdo","miser","misty","mitts","mixed","mixer","mixes","moats","mocha","mocks","modal","model","modem","modes","moist","molar","molds","moldy","moles","molls","molts","money","monks","mono","month","moods","moody","mooed","moons","moors","moose","moots","moped","mopes","moral","moray","morel","moron","moros","morph","morse","mossy","motel","moths","mothy","motif","motor","motto","mound","mount","mourn","mouse","mousy","mouth","moved","mover","moves","movie","mower","mowed","mown","much","mucky","mucus","muddy","muffs","mugger","muggy","mulch","mules","mulls","mummy","mumps","munch","mural","murky","muses","mushy","music","musky","musty","mutts","muzzy","myths","nadir","naive","naked","named","names","nanny","napes","nappy","narcs","nasal","nasty","natal","naval","navel","needs","needy","neigh","nerd","nerdy","nerve","nervy","nests","never","newer","newly","newts","nexus","nicer","niche","nicks","niece","nifty","night","nines","ninth","nippy","nixed","nixes","nobly","nodes","noise","noisy","nomad","nones","nooks","noons","noose","norms","north","nosed","noses","nosey","notch","noted","notes","nouns","novel","nudge","nudes","nukes","nulls","numb","nurse","nutty","nylon","nymph","oaken","oasis","oaths","oboes","obese","obeys","ocean","octal","octet","odder","oddly","odors","offal","offer","often","ogled","ogles","ogres","oiled","oiler","oilers","okays","older","olden","olive","omega","omens","onion","onset","oozed","oozes","oozy","opals","opens","opera","opted","optic","orals","orate","orbit","orbs","orchid","order","organ","oscar","osmic","other","otter","ought","ounce","outdo","outed","outer","ovals","ovary","ovate","ovens","overs","overt","owing","owls","owned","owner","oxide","ozone","paced","paces","packs","pacts","paddy","pagan","paged","pager","pages","pails","pains","paint","pairs","paled","paler","palls","palms","palsy","panda","paned","panel","pangs","panic","pansy","pants","panty","paper","parch","pared","parer","pares","parka","parks","parry","parse","parts","party","passes","paste","pasts","patch","pated","paths","patio","pause","paved","paves","pawed","pawns","payee","payer","peace","peach","peaks","peaky","peals","pearl","pears","pecan","pecks","pedal","peeks","peels","peeps","peers","pelts","penal","pence","penny","peons","peony","peppy","perch","peril","perks","perky","perms","pesky","pests","petal","peter","petty","phase","phony","piano","picks","picky","piece","piers","pig","piggy","piked","piker","pikes","piled","piles","pills","pilot","pimps","pinch","pined","pines","pings","pinks","pinky","pints","pious","piped","piper","pipes","pique","pitas","pithy","pitied","pitas","pivot","pixel","pizza","place","plaid","plain","plait","plane","plank","plans","plant","plate","plats","plays","plaza","plead","pleat","plied","plies","plink","plod","plods","plops","plots","plows","ploys","pluck","plugs","plumb","plume","plump","plums","plunk","plush","poach","pocks","podgy","poems","poets","point","poise","poked","poker","pokes","pokey","polar","poled","poles","polio","polka","polls","polyp","ponds","pooch","poohs","pools","pooped","poops","poor","poppy","porch","pored","pores","porks","porky","ports","posed","poser","poses","posey","posit","posse","posts","potty","pouch","poufs","pound","pours","pouts","power","prams","prays","preen","prefs","press","price","prick","pride","pried","prier","pries","prigs","prima","prime","primp","prims","prink","print","prior","prism","prissy","probe","prods","prof","profs","prom","proms","prone","prong","proof","props","prose","proud","prove","prowl","prows","proxy","prude","pruned","prunes","psalm","pubic","puces","pucks","puffy","pulls","pulps","pulpy","pulse","pumas","pumps","punch","punks","punky","punts","pupal","pupas","pupil","puppy","puree","purer","purge","purls","purrs","purse","pushy","putts","putty","pygmy","quack","quads","quail","quake","qualm","quark","quart","quash","quasi","quays","queen","queer","quell","query","quest","queue","quick","quids","quiet","quill","quilt","quips","quire","quirk","quirt","quite","quits","quiver","quota","quote","quoth","rabbi","rabid","raced","racer","races","racks","radar","radii","radio","radon","rafts","raged","rages","raids","rails","rainy","raise","rajah","raked","rakes","rallied","rally","ramen","ramp","ramps","ranch","rands","randy","range","rangy","ranks","rants","raped","rapes","rapid","rare","rasps","rated","rater","rates","ratio","ratty","raved","ravel","raven","raver","raves","rayon","razed","razes","razor","reach","react","reads","ready","realm","reams","reaps","rears","rebus","rebut","recap","recur","redid","redo","redox","reeds","reedy","reefs","reeks","reeky","reels","refit","refit","regal","rehab","reign","reins","relax","relay","relic","remit","renal","rends","rents","repay","repel","reply","retch","retry","reuse","revel","rheas","rhino","rhyme","ribby","rices","ricks","rider","rides","ridge","rifle","rifts","right","rigid","riled","riles","rims","rinds","rings","rinks","rinse","riots","riped","ripen","riper","ripes","risen","riser","rises","risks","risky","rites","rival","river","rivet","roach","roads","roams","roars","roast","robbed","robed","robes","robin","robot","rocks","rocky","rodeo","rodes","rogue","roles","rolls","roman","romps","rondo","roofs","rooks","rooms","roomy","roost","roots","roped","ropes","roses","rouge","rough","round","route","routs","roved","rover","roves","rowdy","royal","rubs","rubbed","ruddy","ruder","ruffs","rugby","ruled","ruler","rules","rumba","rummy","rumor","rumps","runes","rungs","runny","runts","rupee","rural","ruses","rusts","rusty","sabers","sable","sack","sacks","sadly","safer","safes","saga","sages","sagely","sails","saint","salad","salsa","salts","salty","salve","salvo","samba","sands","sandy","saner","sangs","sappy","saran","sashes","sassy","satin","satyr","sauce","saucy","sauna","saute","saved","saver","saves","savor","sawed","sawer","saxes","sayer","says","scabs","scads","scald","scale","scalp","scaly","scamp","scams","scans","scant","scape","scarf","scary","scats","scene","scent","schmo","scion","scoff","scold","scone","scoop","scoot","scope","score","scorn","scour","scout","scowl","scrap","scree","screw","scrub","scrum","scuba","scuds","scuff","scull","scums","scurf","seals","seams","seamy","sears","seats","sects","sedan","seeds","seedy","seeks","seems","seeps","seers","segue","seize","sells","semis","sends","sense","sepia","septa","serge","serif","serve","sets","setup","seven","sever","sewed","sewer","shack","shade","shady","shaft","shags","shake","shaky","shale","shall","shame","shams","shank","shape","shard","share","shark","sharp","shave","shawl","sheaf","shear","sheds","sheen","sheep","sheer","sheet","sheik","shelf","shell","sherd","shied","shier","shies","shift","shill","shine","shins","shiny","ships","shirk","shirt","shoed","shoes","shone","shook","shoon","shoos","shoot","shops","shore","shorn","short","shots","shout","shove","shown","shows","shrug","shuns","shush","shuts","shyer","shyly","sided","sides","sidle","siege","sieve","sifts","sighs","sight","sigma","signs","silks","silky","sills","silly","silos","silts","silty","since","sinew","singe","sings","sinks","sinus","siren","sirs","sissy","sites","sixes","sixth","sixty","sized","sizes","skate","skeet","skein","skews","skids","skied","skier","skies","skill","skimp","skims","skins","skips","skirt","skits","skulk","skull","skunk","skyed","slabs","slack","slain","slake","slams","slang","slant","slaps","slash","slate","slats","slave","slays","sleds","sleek","sleep","sleet","slept","slews","slice","slick","slide","slily","slime","slims","slimy","sling","slink","slips","slits","slobs","sloop","slope","slops","slosh","sloth","slots","slows","slugs","slump","slums","slung","slunk","slurp","slurs","slush","sluts","slyly","small","smart","smash","smear","smell","smelt","smile","smirk","smite","smith","smock","smog","smogs","smoke","smoky","smote","smug","smurf","snack","snag","snags","snail","snake","snaky","snaps","snare","snarl","sneak","sneer","snide","sniff","snipe","snips","snits","snobs","snoop","snoot","snore","snort","snots","snout","snows","snowy","snubs","snuck","snuff","snug","snugs","soaks","soaps","soapy","soars","sober","socks","sodas","sofas","softy","soggy","soils","solar","solds","soled","soles","solid","solos","solve","sonar","songs","sonic","sonny","soots","sooty","sophs","soppy","sores","sorry","sorts","sough","souls","sound","soupy","sours","south","sowed","spade","spake","spam","spans","spare","spark","spars","spasm","spats","spawn","spays","speak","spear","speck","specs","speed","spell","spelt","spend","spent","sperm","spews","spice","spicy","spied","spiel","spies","spiff","spike","spiky","spill","spilt","spine","spins","spiny","spire","spirit","spite","splat","split","spoil","spoke","spoof","spook","spool","spoon","spore","sport","spots","spout","sprat","spray","spree","sprig","spud","spuds","spume","spumy","spun","spunk","spurn","spurs","spurt","squab","squad","squat","squaw","squib","stabs","stack","staff","stage","stags","stagy","staid","stain","stair","stake","stale","stalk","stall","stamp","stand","stank","stare","stars","start","stash","state","stats","stave","stays","stead","steak","steal","steam","steed","steel","steep","steer","stems","steps","stern","stews","stick","sties","stiff","still","stilt","sting","stink","stint","stirs","stock","stoic","stoke","stole","stomp","stone","stony","stood","stool","stoop","stops","store","stork","storm","story","stout","stove","stows","strap","straw","stray","strip","strut","stubs","stuck","studs","study","stuff","stumps","stumpy","stuns","stunt","style","styli","suave","sucks","sudsy","suede","sued","sues","sugar","suits","sulks","sulky","sully","sumac","sums","sunny","super","surer","surfs","surge","surly","sushi","swabs","swain","swami","swamp","swans","swaps","sward","swarm","swash","swath","swats","sways","swear","sweat","sweep","sweet","swell","swept","swerve","swift","swigs","swill","swims","swine","swing","swipe","swirl","swish","swiss","swoon","swoop","swops","sword","swore","sworn","swum","swung","sylph","synod","syrup","table","taboo","tacit","tacks","tacky","tacos","taffy","tails","taint","taken","taker","takes","tales","talks","tally","talon","tamed","tamer","tames","tango","tangy","tanks","tansy","tapas","taped","tapes","tapir","tardy","tared","tares","targe","tarns","taros","tarot","tarps","tarry","tarts","tasks","taste","tasty","tater","tats","tatty","taunt","tauts","tawny","taxed","taxer","taxes","taxis","teach","teaks","teams","tears","teary","tease","teats","teddy","teems","teens","teeny","teeth","telly","tempo","temps","tempt","tench","tends","tenet","tenon","tenor","tense","tenth","tents","tepee","tepid","terms","terns","terry","terse","tests","testy","texts","thank","thaws","theft","their","theme","there","therm","these","theta","thick","thief","thigh","thine","thing","think","thins","third","thong","thorn","those","three","threw","throb","throw","thrum","thuds","thugs","thumb","thump","thyme","tiara","tibia","ticks","tidal","tides","tidied","tidies","tiers","tight","tigress","tikes","tilde","tiled","tiles","tills","tilts","timed","timer","times","timid","tines","tinge","tinny","tints","tiny","tipsy","tired","tires","titan","titer","tithe","title","toads","toady","toast","today","toddy","toffy","togas","toils","token","tolls","tombs","tomes","tommy","tonal","toned","toner","tones","tonga","tonic","tools","tooth","toots","topaz","topic","torah","torch","tores","torsi","torso","torts","total","toted","totem","totes","touch","tough","tours","touts","towed","towel","tower","towns","toxic","toxin","toyed","trace","track","tract","trade","trail","train","trait","tramp","trans","traps","trash","trawl","trays","tread","treat","treed","trees","treks","trend","trial","tribe","trice","trick","tried","trier","tries","trike","trill","trims","trios","tripe","trips","trite","troll","tromp","troop","trope","trots","troth","trout","trove","trows","truce","truck","trudge","true","trued","truer","trues","truly","trump","trunk","truss","trust","truth","tryst","tubas","tubby","tubed","tubes","tucks","tufts","tufty","tulip","tulle","tumid","tummy","tumor","tunas","tuned","tuner","tunes","turbo","turfs","turfy","turns","tusks","tutor","tutti","tutus","tweak","tweed","tween","tweet","twerp","twice","twigs","twins","twiny","twirl","twist","twits","tying","typed","types","typos","tyres","udder","ulcer","ultra","umber","umbra","unapt","uncle","uncut","under","undid","undo","undoes","undue","unfed","unfit","unify","union","unite","units","unity","unjam","unlit","unmet","unpin","unset","untie","until","unzip","upend","upon","upped","upper","upset","urban","urged","urges","urine","usage","used","user","users","uses","usher","using","usual","usurp","usury","uteri","utile","utter","vacua","vague","vales","valet","valid","value","valve","vamps","vanes","vapid","vapor","vases","vault","vaunt","veers","vegan","veils","veins","velar","veldt","velum","venal","vends","venom","vents","venue","verbs","verge","verse","verso","verve","vests","vetch","vetoed","vetoes","vials","vibes","vicar","video","vies","views","vigil","vigor","viler","villa","vined","vines","vinyl","viola","viper","viral","virus","visas","vised","vises","vista","vital","vivid","vixen","vocal","vodka","vogue","voice","voids","voila","voles","volts","voted","voter","votes","vouch","vowed","vowel","vrooms","vying","wacky","waded","wader","wades","wafer","wafts","waged","wages","wagon","waifs","wails","waist","waits","waive","waked","waken","wakes","waled","wales","walks","walls","waltz","waned","wanes","wanly","wants","wards","wares","warms","warns","warps","warts","warty","washy","wasps","waspy","waste","watch","water","watts","waved","waver","waves","waxed","waxen","waxer","waxes","weans","wears","weary","weave","webby","wedge","weeds","weedy","weeks","weeny","weeps","weepy","weigh","weird","weirs","welch","welds","wells","welsh","welts","wench","wends","whack","whale","whams","wharf","wheat","wheel","whelk","whelm","whelp","whens","where","whets","which","whiff","whigs","while","whims","whine","whiny","whips","whirl","whirr","whirs","whisk","white","whiz","whoa","whole","whomp","whoop","whops","whose","whys","wicks","widen","wider","widow","width","wield","wight","willed","wills","willy","wilts","wimps","wimpy","wince","winch","winds","windy","wined","wines","wings","winks","winos","wiped","wiper","wipes","wired","wires","wised","wiser","wises","wisps","wispy","witch","withy","witty","wived","wives","woken","wolfs","womanly","wombs","women","woods","woody","woofs","wools","wooly","words","wordy","works","world","worms","wormy","worn","worry","worse","worst","worth","would","wound","woven","wowed","wracks","wrack","wraps","wraps","wrath","wreak","wreck","wrens","wrest","wring","wrist","write","writs","wrong","wrote","wrung","wryer","wryly","yacht","yanks","yards","yarns","yawns","yawny","years","yearn","yeast","yells","yelps","yeti","yield","yodel","yogas","yogis","yoked","yokel","yokes","yolks","young","yours","youth","yucca","yucks","yucky","yules","zeals","zebra","zeros","zests","zesty","zippy","zonal","zoned","zones","zooms"
];

// Build set once
const WORD_SET = new Set(KID_DICTIONARY.map(w => w.toLowerCase()));

function canFormWord(word, letters) {
  const pool = letters.slice();
  for (const ch of word.toLowerCase()) {
    const idx = pool.indexOf(ch);
    if (idx === -1) return false;
    pool.splice(idx, 1);
  }
  return true;
}

function wordPoints(word) {
  const n = word.length;
  if (n <= 2) return 0;
  if (n === 3) return 1;
  if (n === 4) return 2;
  if (n === 5) return 4;
  if (n === 6) return 6;
  return 6 + (n - 6) * 3; // 7=9, 8=12, etc
}

// Difficulty ladder — grows after each game played this session
function difficultyFor(level) {
  const tiers = [
    { letters: 5, minWord: 3 },
    { letters: 6, minWord: 3 },
    { letters: 7, minWord: 3 },
    { letters: 7, minWord: 4 },
  ];
  return tiers[Math.min(level, tiers.length - 1)];
}

// Pick letters: seed from a weekly word when possible, pad with consonant-heavy mix
// Weighted to guarantee consonants — too many vowels = no words form.
const VOWEL_POOL = "aeiou";
const CONSONANT_POOL = "rrssttllnnddccmmpphhbbffggkwy";
function buildPuzzle(weeklyWords, letterCount) {
  const candidates = shuffleLocal(weeklyWords.filter(w => w.length >= 3 && w.length <= letterCount + 2));
  let seed = [];
  for (const c of candidates) {
    const unique = Array.from(new Set(c.toLowerCase().replace(/[^a-z]/g, "").split("")));
    if (unique.length <= letterCount && unique.length >= 3) {
      seed = unique.slice(0, letterCount);
      break;
    }
  }
  const letters = seed.slice();
  // Ensure at least 2 vowels, rest consonants
  const vowelCount = letters.filter(l => VOWEL_POOL.includes(l)).length;
  const targetVowels = Math.max(2, Math.min(3, Math.floor(letterCount / 2.5)));
  let neededVowels = Math.max(0, targetVowels - vowelCount);
  while (letters.length < letterCount) {
    let ch;
    if (neededVowels > 0) {
      ch = VOWEL_POOL[Math.floor(Math.random() * VOWEL_POOL.length)];
      neededVowels--;
    } else {
      ch = CONSONANT_POOL[Math.floor(Math.random() * CONSONANT_POOL.length)];
    }
    if (!letters.includes(ch)) letters.push(ch);
  }
  return shuffleLocal(letters.slice(0, letterCount));
}

function shuffleLocal(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function findAllValidWords(letters, minLen) {
  const found = [];
  for (const w of KID_DICTIONARY) {
    if (w.length < minLen) continue;
    if (canFormWord(w, letters)) found.push(w);
  }
  return found;
}

function generatePuzzle(weeklyWords, level) {
  const { letters: letterCount, minWord } = difficultyFor(level);
  let best = null;
  for (let attempt = 0; attempt < 20; attempt++) {
    const letters = buildPuzzle(weeklyWords, letterCount);
    const valid = findAllValidWords(letters, minWord);
    if (valid.length >= 8) {
      return { letters, validWords: valid, minWord, level };
    }
    if (!best || valid.length > best.validWords.length) {
      best = { letters, validWords: valid, minWord, level };
    }
  }
  // Return best attempt (always has at least some consonants now)
  return best;
}

// ---- Component ----

const WordFinderFun = ({ weeklyWords, onExit, childName }) => {
  const [level, setLevel] = useWFState(0);
  const [puzzle, setPuzzle] = useWFState(() => generatePuzzle(weeklyWords, 0));
  const [typed, setTyped] = useWFState("");
  const [foundWords, setFoundWords] = useWFState([]); // {word, bonus, points}
  const [invalidFlash, setInvalidFlash] = useWFState(null); // {msg}
  const [finished, setFinished] = useWFState(false);
  const inputRef = useWFRef(null);

  const weeklySet = useWFMemo(
    () => new Set(weeklyWords.map(w => w.toLowerCase())),
    [weeklyWords]
  );

  useWFEffect(() => {
    const onKey = (e) => {
      if (finished) return;
      if (e.key === "Enter") { submit(); return; }
      if (e.key === "Backspace") { setTyped(t => t.slice(0, -1)); return; }
      if (e.key === "Escape") { setTyped(""); return; }
      if (/^[a-zA-Z]$/.test(e.key)) {
        setTyped(t => t + e.key.toLowerCase());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [typed, finished, puzzle]);

  function flashInvalid(msg) {
    setInvalidFlash({ msg });
    beep && beep("retry");
    setTimeout(() => setInvalidFlash(null), 600);
  }

  function submit() {
    const w = typed.trim().toLowerCase();
    if (!w) return;
    if (w.length < puzzle.minWord) {
      flashInvalid(`Too short — at least ${puzzle.minWord} letters.`);
      setTyped("");
      return;
    }
    if (!canFormWord(w, puzzle.letters)) {
      flashInvalid("Use only the letters in the ring.");
      setTyped("");
      return;
    }
    if (!WORD_SET.has(w)) {
      flashInvalid("Not a word I know.");
      setTyped("");
      return;
    }
    if (foundWords.some(f => f.word === w)) {
      flashInvalid("Already found!");
      setTyped("");
      return;
    }
    const base = wordPoints(w);
    const bonus = weeklySet.has(w) ? base : 0; // double for weekly words
    beep && beep("correct");
    setFoundWords(list => [{ word: w, points: base + bonus, bonus: bonus > 0 }, ...list]);
    setTyped("");
  }

  function tapLetter(ch) {
    setTyped(t => t + ch);
    inputRef.current?.focus();
  }

  function shuffleRing() {
    setPuzzle(p => ({ ...p, letters: shuffleLocal(p.letters) }));
  }

  function finish() {
    setFinished(true);
  }

  function nextLevel() {
    const newLevel = level + 1;
    setLevel(newLevel);
    setPuzzle(generatePuzzle(weeklyWords, newLevel));
    setTyped("");
    setFoundWords([]);
    setFinished(false);
  }

  const totalScore = foundWords.reduce((s, f) => s + f.points, 0);
  const possibleScore = puzzle.validWords.reduce((s, w) =>
    s + wordPoints(w) + (weeklySet.has(w) ? wordPoints(w) : 0), 0);
  const pctFound = Math.round((foundWords.length / Math.max(1, puzzle.validWords.length)) * 100);

  // Layout letters around a circle
  const ringSize = 320;
  const letterSize = 68;
  const radius = (ringSize - letterSize) / 2;

  return (
    <div style={{
      maxWidth: 1100, margin: "0 auto",
      padding: "40px 40px 60px",
      animation: "fadeIn 0.4s ease-out",
      position: "relative",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 20, marginBottom: 28, flexWrap: "wrap",
      }}>
        <div>
          <div style={{
            fontSize: 13, fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "0.16em", color: "var(--accent-ink)", marginBottom: 4,
          }}>Reward unlocked · Level {level + 1}</div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800, fontStyle: "italic",
            fontSize: "clamp(30px, 3.6vw, 46px)",
            margin: 0, letterSpacing: "-0.02em",
            lineHeight: 1.3,
            paddingBottom: "0.25em",
            whiteSpace: "nowrap",
            fontVariationSettings: "'opsz' 144",
          }}>
            Word Finder Fun
          </h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <ScoreChip label="Words" value={foundWords.length} color="var(--mint)" />
          <ScoreChip label="Points" value={totalScore} color="var(--butter)" big />
          <ChunkyButton variant="secondary" onClick={onExit}>Exit</ChunkyButton>
        </div>
      </div>

      {finished ? (
        <FinishedView
          foundWords={foundWords}
          validWords={puzzle.validWords}
          weeklySet={weeklySet}
          totalScore={totalScore}
          possibleScore={possibleScore}
          pctFound={pctFound}
          onReplay={() => { setPuzzle(generatePuzzle(weeklyWords, level)); setFoundWords([]); setFinished(false); }}
          onNextLevel={nextLevel}
          onExit={onExit}
        />
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(340px, 1fr) minmax(280px, 380px)",
          gap: 32,
          alignItems: "start",
        }}>
          {/* LEFT: ring + input */}
          <Card style={{ padding: 40 }}>
            {/* typed display */}
            <div style={{
              minHeight: 68,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 16,
              animation: invalidFlash ? "shake 0.4s ease-in-out" : "none",
            }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700, fontStyle: "italic",
                fontSize: 48,
                letterSpacing: "0.06em",
                color: invalidFlash ? "var(--coral)" : "var(--ink)",
                minWidth: 240, textAlign: "center",
                borderBottom: `3px dashed ${invalidFlash ? "var(--coral)" : "var(--line-strong)"}`,
                padding: "6px 20px 10px",
                transition: "color 0.2s, border-color 0.2s",
                textTransform: "lowercase",
                fontVariationSettings: "'opsz' 144",
              }}>
                {typed || <span style={{ color: "var(--ink-faint)", fontStyle: "normal", fontSize: 22, fontWeight: 500, letterSpacing: "0.02em" }}>type or tap…</span>}
              </div>
            </div>

            {/* feedback line */}
            <div style={{
              textAlign: "center", minHeight: 24, marginBottom: 18,
              fontSize: 15, fontWeight: 700,
              color: invalidFlash ? "var(--coral-ink)" : "var(--ink-faint)",
            }}>
              {invalidFlash?.msg || `Find words of ${puzzle.minWord}+ letters. Weekly words score double!`}
            </div>

            {/* Ring of letters */}
            <div style={{
              position: "relative",
              width: ringSize, height: ringSize,
              margin: "0 auto 28px",
            }}>
              {/* Decorative center dot */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 120, height: 120, borderRadius: "50%",
                background: "var(--accent-soft)",
                border: "2px dashed var(--accent)",
                display: "grid", placeItems: "center",
                color: "var(--accent-ink)",
                fontSize: 13, fontWeight: 800,
                textTransform: "uppercase", letterSpacing: "0.14em",
              }}>
                <div style={{ textAlign: "center", lineHeight: 1.4 }}>
                  {foundWords.length}<br/>
                  <span style={{ fontSize: 10 }}>of ~{puzzle.validWords.length}</span>
                </div>
              </div>

              {puzzle.letters.map((ch, i) => {
                const angle = (i / puzzle.letters.length) * 2 * Math.PI - Math.PI / 2;
                const x = ringSize / 2 + radius * Math.cos(angle) - letterSize / 2;
                const y = ringSize / 2 + radius * Math.sin(angle) - letterSize / 2;
                return (
                  <button
                    key={i}
                    onClick={() => tapLetter(ch)}
                    style={{
                      position: "absolute",
                      left: x, top: y,
                      width: letterSize, height: letterSize,
                      borderRadius: "50%",
                      background: "var(--bg-2)",
                      border: "2px solid var(--line-strong)",
                      color: "var(--ink)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 32,
                      textTransform: "uppercase",
                      cursor: "pointer",
                      boxShadow: "0 3px 0 var(--line-strong), var(--shadow-sm)",
                      transition: "transform 0.1s, background 0.15s",
                      animation: `pop 0.4s ease-out ${i * 0.05}s both`,
                      fontVariationSettings: "'opsz' 144",
                    }}
                    onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(3px) scale(0.95)"; e.currentTarget.style.boxShadow = "0 0 0 var(--line-strong), var(--shadow-sm)"; }}
                    onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 3px 0 var(--line-strong), var(--shadow-sm)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 3px 0 var(--line-strong), var(--shadow-sm)"; }}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <ChunkyButton onClick={submit} disabled={!typed}>Enter ↵</ChunkyButton>
              <ChunkyButton variant="secondary" onClick={() => setTyped(t => t.slice(0, -1))} disabled={!typed}>⌫ Delete</ChunkyButton>
              <ChunkyButton variant="secondary" onClick={() => setTyped("")} disabled={!typed}>Clear</ChunkyButton>
              <ChunkyButton variant="ghost" onClick={shuffleRing}>🔀 Shuffle</ChunkyButton>
            </div>

            <div style={{
              marginTop: 20, textAlign: "center",
              fontSize: 13, color: "var(--ink-faint)", fontFamily: "var(--font-mono)",
            }}>
              <Kbd>A–Z</Kbd> type · <Kbd>↵</Kbd> enter · <Kbd>⌫</Kbd> delete · <Kbd>esc</Kbd> clear
            </div>
          </Card>

          {/* RIGHT: found words + controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card style={{ padding: 28 }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
                marginBottom: 14,
              }}>
                <div style={{
                  fontSize: 13, fontWeight: 800, textTransform: "uppercase",
                  letterSpacing: "0.14em", color: "var(--ink-faint)",
                }}>Your words</div>
                <div style={{
                  fontSize: 12, fontWeight: 700, color: "var(--ink-faint)",
                }}>{foundWords.length} found</div>
              </div>

              {foundWords.length === 0 ? (
                <div style={{
                  padding: "24px 0", textAlign: "center",
                  color: "var(--ink-faint)", fontSize: 15,
                  fontStyle: "italic", fontFamily: "var(--font-display)",
                }}>
                  Your first word goes here ✨
                </div>
              ) : (
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: 6,
                  maxHeight: 280, overflowY: "auto", paddingRight: 4,
                }}>
                  {foundWords.map((f, i) => (
                    <div key={f.word} style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: f.bonus ? "var(--butter-soft)" : "var(--mint-soft)",
                      border: `1px solid ${f.bonus ? "var(--butter)" : "var(--mint)"}`,
                      color: f.bonus ? "var(--butter-ink)" : "var(--mint-ink)",
                      padding: "6px 10px", borderRadius: 10,
                      fontFamily: "var(--font-display)",
                      fontStyle: "italic", fontWeight: 600,
                      fontSize: 16,
                      animation: i === 0 ? "pop 0.4s ease-out" : "none",
                    }}>
                      {f.word}
                      <span style={{
                        fontFamily: "var(--font-ui)", fontStyle: "normal",
                        fontSize: 11, fontWeight: 800,
                        padding: "2px 6px", borderRadius: 999,
                        background: f.bonus ? "var(--butter)" : "var(--mint)",
                        color: f.bonus ? "var(--butter-ink)" : "var(--mint-ink)",
                      }}>
                        +{f.points}{f.bonus && "★"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card style={{ padding: 24 }}>
              <div style={{
                fontSize: 13, fontWeight: 800, textTransform: "uppercase",
                letterSpacing: "0.14em", color: "var(--ink-faint)", marginBottom: 10,
              }}>Progress</div>
              <div style={{
                height: 12, background: "var(--line)",
                borderRadius: 999, overflow: "hidden", marginBottom: 8,
                border: "1px solid var(--line-strong)",
              }}>
                <div style={{
                  height: "100%",
                  width: `${Math.min(100, pctFound)}%`,
                  background: "var(--accent)",
                  borderRadius: 999,
                  transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }} />
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-faint)" }}>
                {pctFound}% of possible words · keep going or finish whenever.
              </div>
              <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                <ChunkyButton variant="success" onClick={finish} disabled={foundWords.length === 0}>
                  I'm done!
                </ChunkyButton>
              </div>
            </Card>

            <div style={{
              padding: "14px 18px",
              borderRadius: 14,
              background: "var(--butter-soft)",
              border: "1px solid var(--butter)",
              fontSize: 13, color: "var(--butter-ink)",
              display: "flex", gap: 10, alignItems: "center",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "var(--butter)", color: "var(--butter-ink)",
                display: "grid", placeItems: "center", flexShrink: 0,
                fontSize: 14, fontWeight: 900,
              }}>★</div>
              <div>
                Spotting a <b>weekly spelling word</b> scores <b>double points</b>. Look for {childName}'s words!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ScoreChip = ({ label, value, color, big }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 10,
    padding: big ? "10px 18px" : "8px 14px",
    background: "var(--bg-2)",
    border: `2px solid ${color}`,
    borderRadius: 999,
    boxShadow: `0 3px 0 ${color}`,
  }}>
    <div style={{
      fontSize: 10, fontWeight: 800, textTransform: "uppercase",
      letterSpacing: "0.12em", color: "var(--ink-faint)",
    }}>{label}</div>
    <div style={{
      fontFamily: "var(--font-display)",
      fontSize: big ? 26 : 20, fontWeight: 800,
      color: "var(--ink)", lineHeight: 1,
      fontVariationSettings: "'opsz' 144",
    }}>{value}</div>
  </div>
);

const FinishedView = ({ foundWords, validWords, weeklySet, totalScore, possibleScore, pctFound, onReplay, onNextLevel, onExit }) => {
  const missed = validWords.filter(w => !foundWords.some(f => f.word === w));
  const rating = pctFound >= 60 ? "Superstar" : pctFound >= 30 ? "Great finder" : "Nice try";

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      <Card style={{ padding: 40, marginBottom: 20, textAlign: "center" }}>
        <Mascot state="cheering" size={140} accent="var(--accent)" />
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800, fontStyle: "italic",
          fontSize: "clamp(32px, 4vw, 48px)",
          margin: "20px 0 8px", letterSpacing: "-0.01em",
          fontVariationSettings: "'opsz' 144",
        }}>{rating}!</h2>
        <div style={{ color: "var(--ink-soft)", fontSize: 17, marginBottom: 24 }}>
          You found <b>{foundWords.length}</b> words for <b>{totalScore}</b> points.
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12, maxWidth: 640, margin: "0 auto 24px",
        }}>
          <StatBlock label="Score" value={totalScore} accent="var(--accent)" />
          <StatBlock label="Words found" value={`${foundWords.length}/${validWords.length}`} accent="var(--mint)" />
          <StatBlock label="Bonus hits" value={foundWords.filter(f => f.bonus).length} accent="var(--butter)" />
          <StatBlock label="Possible" value={possibleScore} accent="var(--ink-faint)" />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <ChunkyButton onClick={onNextLevel}>Level up →</ChunkyButton>
          <ChunkyButton variant="secondary" onClick={onReplay}>New letters</ChunkyButton>
          <ChunkyButton variant="ghost" onClick={onExit}>Back home</ChunkyButton>
        </div>
      </Card>

      {missed.length > 0 && (
        <Card style={{ padding: 28 }}>
          <div style={{
            fontSize: 13, fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "0.14em", color: "var(--ink-faint)", marginBottom: 14,
          }}>Words you didn't find ({missed.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {missed.slice(0, 80).map((w) => (
              <div key={w} style={{
                padding: "5px 10px", borderRadius: 8,
                background: "var(--bg)",
                border: "1px solid var(--line-strong)",
                fontFamily: "var(--font-display)",
                fontStyle: "italic", fontWeight: 500,
                fontSize: 15, color: "var(--ink-soft)",
              }}>
                {w}
                {weeklySet.has(w) && <span style={{
                  marginLeft: 6, fontSize: 10, fontFamily: "var(--font-ui)",
                  fontStyle: "normal", fontWeight: 800,
                  background: "var(--butter)", color: "var(--butter-ink)",
                  padding: "1px 5px", borderRadius: 4,
                }}>★</span>}
              </div>
            ))}
            {missed.length > 80 && (
              <div style={{ padding: "5px 10px", color: "var(--ink-faint)", fontSize: 14 }}>
                …and {missed.length - 80} more
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

const StatBlock = ({ label, value, accent }) => (
  <div style={{
    background: "var(--bg-2)",
    border: "1px solid var(--line)",
    borderRadius: 14,
    padding: "14px 16px",
    position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: accent }} />
    <div style={{
      fontSize: 11, fontWeight: 800, textTransform: "uppercase",
      letterSpacing: "0.12em", color: "var(--ink-faint)", marginBottom: 4,
    }}>{label}</div>
    <div style={{
      fontFamily: "var(--font-display)",
      fontSize: 28, fontWeight: 700, color: "var(--ink)",
      fontVariationSettings: "'opsz' 144",
    }}>{value}</div>
  </div>
);

Object.assign(window, { WordFinderFun });
