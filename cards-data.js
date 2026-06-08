/* ══════════════════════════════════════════════════════════════════════
   落差扑克牌占卜 · 全牌库数据(54 张)
   含义 = 花色面(只与花色有关) × 数字面(只与点数有关)。
   所以只需维护 4 个花色 + 13 个点数,52 张自动组合;另加 2 张王。
   想精修某张牌,在 OVERRIDES 里按 key(如 'hearts_3')补字段即可。
   单卡页通过  单卡页模板.html?c=<key>  访问,key 形如 hearts_3 / spades_K / joker_red。
   ══════════════════════════════════════════════════════════════════════ */
(function(){
  // —— 四花色:花色面 ——
  var SUITS={
    hearts:{cn:'红桃',sym:'♥',cls:'r',accent:'#A3372B',latin:'Hearts',yy:'阳',group:'心之动',
      keys:'爱心、积极、勇敢',short:'心之所向',
      pos:'积极、善良、勇敢、爱心、生命力、向上进取,带着创造的驱动力。',
      neg:'也可代表缺乏积极、缺乏勇敢;或这份勇敢、热忱被他人利用。'},
    spades:{cn:'黑桃',sym:'♠',cls:'k',accent:'#2B2722',latin:'Spades',yy:'阴',group:'心之动',
      keys:'承载、沉淀、包容',short:'向内承载',
      pos:'承载、沉淀、厚重、基底、潜能、深入挖掘、包容。',
      neg:'破坏、抽离、消亡;也可指视野狭隘、自大傲慢,或反向的扩张打破。'},
    clubs:{cn:'梅花',sym:'♣',cls:'k',accent:'#5b5246',latin:'Clubs',yy:'阳',group:'客观存在',
      keys:'显化、成形、落地',short:'显化为实',
      pos:'已坍缩 / 显化,具象、实体、可见——有形的行动、思想、成果与产品。',
      neg:'固化、被有形所困;或缺乏建树、尚未结果。'},
    diamonds:{cn:'方块',sym:'♦',cls:'r',accent:'#A3372B',latin:'Diamonds',yy:'阴',group:'客观存在',
      keys:'潜在、可塑、未定',short:'未显的可能',
      pos:'未显化 / 潜在,概率场、无尽可能;规则、边界、形状,可塑性强。',
      neg:'未行动、未建树、未探索;或太固化、偏向太多。'}
  };

  // —— 十三层:数字面 ——
  var RANKS={
    'A':{cn:'A',latin:'Ace',label:'起始单点 · 1',group:'起始意识',
      pos:'起初意识、最起始、单点;阳 / 男。对应 K 的初始低百分比态。',
      neg:'孤立的起点,尚未展开;一味停在原点、不愿生长。'},
    '2':{cn:'二',latin:'Two',label:'互动 · 阴',group:'起始意识',
      pos:'互动;阴 / 女。对应 Q 的初始态。',
      neg:'只在来回试探、迟迟不肯落定;依附于互动而失却自身。'},
    '3':{cn:'三',latin:'Three',label:'人类基础',group:'人类层级',
      pos:'最基本的人类,开始复合叠加,呈现多种面相——人之为人的起点。',
      neg:'基础亦是未成熟:面相虽多却尚浅,容易被某一面相牵着走。'},
    '4':{cn:'四',latin:'Four',label:'经历思考',group:'人类层级',
      pos:'经历、思考、思想进化后的人类,各有不同经历与感受。',
      neg:'经历也会成为成见,被过往的感受困住、难以更新。'},
    '5':{cn:'五',latin:'Five',label:'佼佼者',group:'人类层级',
      pos:'三四号中的佼佼者,专业技能 / 特质突出。',
      neg:'突出之处也是偏科:长板之外多有盲点,易自恃其能。'},
    '6':{cn:'六',latin:'Six',label:'博学渊博',group:'人类层级',
      pos:'博学渊博、广识智慧,向万物学习,开始接纳并朝向超脱自我。',
      neg:'博而不专、广而易散;知道得越多,反而越难决断。'},
    '7':{cn:'七',latin:'Seven',label:'通达落差',group:'人类层级',
      pos:'通达世间万物、领悟"落差";十三层的中间牌,更进一步超脱自我。',
      neg:'看透亦能生倦怠与抽离;立于中间,易两端皆不沾。'},
    '8':{cn:'八',latin:'Eight',label:'变牌 · 规则',group:'人类层级',
      pos:'无人格 / 无定义 / 无态,理解并设计规则机制;变牌(癞子),可替代或演变成其他牌。',
      neg:'无定义亦是无根:可成任何牌,也意味着不是任何牌。'},
    '9':{cn:'九',latin:'Nine',label:'不可描述',group:'人类层级',
      pos:'不可直接描述,层面碾压、强度无上限;也可象征特定框架内最强的作品 / 产物。',
      neg:'强到不可描述,也难被理解与承接;锋芒过盛则孤。'},
    '10':{cn:'十',latin:'Ten',label:'圆满极致',group:'圆满',
      pos:'圆满 / 极致,非人类层级,理论上达不到;"圆满即不圆满"。',
      neg:'圆满即不圆满:抵达之时即是滑落之始,执于圆满反失圆满。'},
    'J':{cn:'J',latin:'Jack',label:'官位 · 意志',group:'权位',
      pos:'官位,自主意识的权利与意志,不分阴阳男女;可代表我们,或高于我们的命令式存在。',
      neg:'权利亦是束缚,意志可僭越;执令而行,易失其本心。'},
    'Q':{cn:'Q',latin:'Queen',label:'女王 · 阴极',group:'权位',
      pos:'女王,阴性面向的极致意志,2 号牌的极致。',
      neg:'极致的阴也会反噬:深沉转为操控,包容转为吞没。'},
    'K':{cn:'K',latin:'King',label:'国王 · 阳极',group:'权位',
      pos:'国王,阳性面向的极致意志,1 号牌的极致。',
      neg:'极致的阳也会反噬:进取转为专断,光热转为灼烧。'}
  };

  // —— 每个花色出现的精选组合(显示在单卡页底部)——
  function combo(a,b,name,text,tag){return {syms:[{sym:SUITS[a].sym,cls:SUITS[a].cls},{sym:SUITS[b].sym,cls:SUITS[b].cls}],name:name,text:text,tag:tag};}
  var C_HC=combo('hearts','clubs','红桃 + 梅花','积极行动、勇于创造,不断进取拓展;一种生机勃勃、无尽生发的状态,生命力充沛。','生发 · 创造');
  var C_HS=combo('hearts','spades','红桃 + 黑桃','偏向的极致:可正可负,甚至 360 度任意偏向,并可随意极化到不同程度。','极化 · 偏向');
  var C_SC=combo('spades','clubs','黑桃 + 梅花','摧毁性质的状态:汲取、抽离、分割、破坏;另一面则是极致的承载与包容、深度挖掘。','拆解 · 承载');
  var C_NODIA={warn:true,syms:[{sym:'♥',cls:'r'},{sym:'♠',cls:'k'},{sym:'♣',cls:'k'}],name:'缺方块(只有 ♥♠♣)',text:'整个世界乱套、无规则、卡死态——没有边界、大小、范围,所有东西混乱地堆叠卡在一起。',tag:'失界 · 卡死'};
  var SUIT_COMBOS={
    hearts:[C_HC,C_HS], spades:[C_SC,C_HS], clubs:[C_HC,C_SC], diamonds:[C_NODIA]
  };

  // —— 牌序(上一张 / 下一张 + 牌库遍历)——
  var SUIT_ORDER=['hearts','spades','diamonds','clubs'];
  var RANK_ORDER=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  var DECK=[];
  SUIT_ORDER.forEach(function(s){RANK_ORDER.forEach(function(r){DECK.push(s+'_'+r);});});
  DECK.push('joker_red','joker_black');

  // —— 两张王(特殊牌,不走花色×数字)——
  var JOKERS={
    joker_red:{key:'joker_red',name:'大王',sym:'★',cls:'r',accent:'#B8893A',suitCN:'大小王',latin:'Red Joker',
      kicker:'特殊牌 · 混沌与有序', tags:['混沌','有序','阴阳一体'],
      lede:'一张牌之外的牌。大小王不分阴阳、不入十三层——它既是创始的起点,又是圆融的归零,灵活多变。',
      suitSub:'混沌 · 创始的起点', suitPos:'混沌中的生机:万象未分、无限可能,一切由此开端。', suitNeg:'混沌也是失序:无章可循、无形可依,容易失控。',
      numSub:'有序 · 圆融的归零', numPos:'有序中的圆融:万象归一、首尾相衔,回到最初的整全。', numNeg:'有序也是僵化:过度的规整会扼住变化的生机。',
      synth:'<b>合成 ——</b> 初始阴阳一体,<span class="uline">既是起点,又是归零</span>。不分开看,灵活多变。',
      sup:{same:'是混沌,也是有序。', pos:'在某个语境里:大王是"打破一切重新开始"的那股原初之力。', neg:'换个语境:同一股力量也可能"失控成乱、无可收拾"。'},
      combos:[]},
    joker_black:{key:'joker_black',name:'小王',sym:'★',cls:'k',accent:'#2B2722',suitCN:'大小王',latin:'Black Joker',
      kicker:'特殊牌 · 混沌与有序', tags:['初始','一体','阴阳未分'],
      lede:'一张牌之外的牌。大小王不分阴阳、不入十三层——它既是创始的起点,又是圆融的归零,灵活多变。',
      suitSub:'初始 · 阴阳未分', suitPos:'未分之初:朴素未凿、潜藏一切,尚未落入任何定义。', suitNeg:'未分也是未立:迟迟不分化,便迟迟不能成形。',
      numSub:'一体 · 万象同源', numPos:'一体同源:看似相反的两端,本是同一个存在的两面。', numNeg:'一体也会混同:不辨彼此,则万事难以着手。',
      synth:'<b>合成 ——</b> 初始阴阳一体,<span class="uline">既是起点,又是归零</span>。不分开看,灵活多变。',
      sup:{same:'是初始,也是一体。', pos:'在某个语境里:小王是"返璞归真、回到原点"的那份澄明。', neg:'换个语境:同一份澄明也可能"含混未分、迟迟不立"。'},
      combos:[]}
  };

  

  // —— 逐牌专属文案:导语 / 合成 / 叠加态例子(花色面、数字面仍共享)——
  var OVERRIDES={
    // ════ 红桃 ♥ ════
    hearts_A:{lede:'一颗刚刚燃起的勇气与爱意——红桃的热度落在最起始的单点上,一切由这一念开端。',synth:'<b>合成 ——</b> 一念之间燃起的<span class="uline">勇气与善意的起点</span>。',sup:{pos:'在某个语境里:红桃A是“不计后果地迈出第一步”的那股冲劲。',neg:'换个语境:同一股冲劲也可能“莽撞起念、有头无尾”。'}},
    hearts_2:{lede:'把热忱投向另一个人——红桃的爱意落在“互动”这一层,在你来我往里确认彼此。',synth:'<b>合成 ——</b> 在关系里流动的<span class="uline">热忱与回应</span>。',sup:{pos:'在某个语境里:红桃二是“全心回应、双向奔赴”的温度。',neg:'换个语境:同一份温度也可能“过度黏附、患得患失”。'}},
    hearts_3:{lede:'一个充满爱心、积极勇敢的基础人类。花色给它心之所向,数字给它最基本的复合层级——多种面相,在此开始叠加显现。',synth:'<b>合成 ——</b> 一个充满爱心、<span class="uline">积极勇敢的基础人类</span>。',sup:{same:'是爱心、积极、勇敢。',pos:'在某个语境里:红桃三是“满怀热忱地全情投入”,照亮一群人。',neg:'换个语境:同一份热忱也可能“用力过猛、被人利用”,反被灼伤。'}},
    hearts_4:{lede:'一个被经历磨过的热心人——勇敢仍在,只是多了思量与分寸。',synth:'<b>合成 ——</b> 历过世事仍<span class="uline">不失热忱的人</span>。',sup:{pos:'在某个语境里:红桃四是“带着伤痕依然愿意付出”的成熟。',neg:'换个语境:同样的阅历也可能“心有顾忌、不再全情”。'}},
    hearts_5:{lede:'把勇敢与热忱练成专长的人——红桃里的高手,以感染力见长。',synth:'<b>合成 ——</b> 以热忱服众的<span class="uline">佼佼者</span>。',sup:{pos:'在某个语境里:红桃五是“一呼百应、点燃全场”的领袖力。',neg:'换个语境:同样的感染力也可能“煽动情绪、裹挟他人”。'}},
    hearts_6:{lede:'把爱心扩展到万物的人——红桃的热,开始朝向超越自我的广博。',synth:'<b>合成 ——</b> 以博爱朝向<span class="uline">超脱自我</span>。',sup:{pos:'在某个语境里:红桃六是“悲悯众生、有教无类”的胸怀。',neg:'换个语境:同样的胸怀也可能“泛爱无界、消耗自身”。'}},
    hearts_7:{lede:'看透了热与冷的人——红桃落在领悟“落差”的中间层,爱得通透。',synth:'<b>合成 ——</b> 通透之后<span class="uline">仍选择去爱</span>。',sup:{pos:'在某个语境里:红桃七是“明知会痛仍温柔以待”的清醒之爱。',neg:'换个语境:同样的清醒也可能“看得太透、热情冷却”。'}},
    hearts_8:{lede:'把热忱化作规则的人——红桃落在“变牌”层,能为情感设计机制,也能随境而变。',synth:'<b>合成 ——</b> 为情感<span class="uline">立规、亦能变形</span>。',sup:{pos:'在某个语境里:红桃八是“用制度把善意放大”的设计力。',neg:'换个语境:同样的设计也可能“以爱为名、操控人心”。'}},
    hearts_9:{lede:'强到难以名状的热——红桃的生命力推到无可描述,足以碾压一切冷漠。',synth:'<b>合成 ——</b> 无可描述的<span class="uline">炽烈生命力</span>。',sup:{pos:'在某个语境里:红桃九是“以一己之热融化整片寒冰”的力量。',neg:'换个语境:同样的炽烈也可能“灼伤靠近的人、无人能承接”。'}},
    hearts_10:{lede:'趋近圆满的爱——红桃落在非人类的极致层,“圆满即不圆满”。',synth:'<b>合成 ——</b> 趋于圆满、<span class="uline">亦在滑落边缘的爱</span>。',sup:{pos:'在某个语境里:红桃十是“近乎无私的大爱”的境地。',neg:'换个语境:同样的圆满也可能“高不可及、反失本真”。'}},
    hearts_J:{lede:'以热忱执掌意志的人——红桃落在“官位”层,用勇气与爱去行使权利。',synth:'<b>合成 ——</b> 以勇气<span class="uline">行使的意志</span>。',sup:{pos:'在某个语境里:红桃J是“为所爱挺身担责”的担当。',neg:'换个语境:同样的担当也可能“一意孤行、以爱压人”。'}},
    hearts_Q:{lede:'阴性热忱的极致——红桃的爱推到女王之位,深情而有威仪。',synth:'<b>合成 ——</b> 极致的<span class="uline">深情与守护</span>。',sup:{pos:'在某个语境里:红桃Q是“以柔情统御、护佑众人”的女王。',neg:'换个语境:同样的守护也可能“占有过深、以爱为牢”。'}},
    hearts_K:{lede:'阳性热忱的极致——红桃的勇推到国王之位,刚烈而炽热。',synth:'<b>合成 ——</b> 极致的<span class="uline">勇毅与号召</span>。',sup:{pos:'在某个语境里:红桃K是“以热血率众、开疆拓土”的王者。',neg:'换个语境:同样的热血也可能“专断灼人、刚极易折”。'}},

    // ════ 黑桃 ♠ ════
    spades_A:{lede:'一处刚被掘开的深井——黑桃的承载落在最起始的单点,潜能由此向下开启。',synth:'<b>合成 ——</b> 向下扎根的<span class="uline">第一铲</span>。',sup:{pos:'在某个语境里:黑桃A是“沉得住气、默默蓄力”的开端。',neg:'换个语境:同样的沉默也可能“困在原地、迟迟不发”。'}},
    spades_2:{lede:'在关系里默默托住对方的人——黑桃的承载落在“互动”层。',synth:'<b>合成 ——</b> 在关系里<span class="uline">默默托底</span>。',sup:{pos:'在某个语境里:黑桃二是“不声不响地接住你”的厚重。',neg:'换个语境:同样的承托也可能“压抑自我、独自硬扛”。'}},
    spades_3:{lede:'最朴素的承载者——黑桃落在人类基础层,以厚重见长。',synth:'<b>合成 ——</b> 朴素而<span class="uline">能扛事的人</span>。',sup:{pos:'在某个语境里:黑桃三是“踏实可靠、默默负重”的本分。',neg:'换个语境:同样的负重也可能“闷头硬扛、不懂转圜”。'}},
    spades_4:{lede:'被岁月沉淀过的人——黑桃落在经历层,城府与厚度俱增。',synth:'<b>合成 ——</b> 沉淀出<span class="uline">深度与城府</span>。',sup:{pos:'在某个语境里:黑桃四是“历经沉浮、稳如磐石”的老练。',neg:'换个语境:同样的老练也可能“心事深藏、难以亲近”。'}},
    spades_5:{lede:'把“深掘”练成专长的人——黑桃里的高手,以钻研见长。',synth:'<b>合成 ——</b> 深挖到底的<span class="uline">专才</span>。',sup:{pos:'在某个语境里:黑桃五是“钻进一处掘到见底”的专注。',neg:'换个语境:同样的专注也可能“钻牛角尖、不见全局”。'}},
    spades_6:{lede:'以包容承载万象的人——黑桃落在博学层,容得下越来越多。',synth:'<b>合成 ——</b> 以厚德<span class="uline">载物的人</span>。',sup:{pos:'在某个语境里:黑桃六是“海纳百川、来者不拒”的雅量。',neg:'换个语境:同样的雅量也可能“无所不纳、泥沙俱下”。'}},
    spades_7:{lede:'看透了沉浮的人——黑桃落在通达层,以静观见性。',synth:'<b>合成 ——</b> 静观沉浮、<span class="uline">了然于心</span>。',sup:{pos:'在某个语境里:黑桃七是“宠辱不惊、深藏若虚”的定力。',neg:'换个语境:同样的定力也可能“心如止水、抽离冷漠”。'}},
    spades_8:{lede:'为“承载”立法的人——黑桃落在变牌层,能设计底层规则,也能隐入无形。',synth:'<b>合成 ——</b> 立于底层<span class="uline">设计承载的规则</span>。',sup:{pos:'在某个语境里:黑桃八是“搭好地基让万物生长”的奠基者。',neg:'换个语境:同样的奠基也可能“暗设牢笼、以规束人”。'}},
    spades_9:{lede:'深不可测的承载——黑桃推到不可描述,厚重得无从丈量。',synth:'<b>合成 ——</b> 深不见底的<span class="uline">承载之力</span>。',sup:{pos:'在某个语境里:黑桃九是“独自扛起塌天之重”的脊梁。',neg:'换个语境:同样的承重也可能“沉默吞没一切、连自己一并埋葬”。'}},
    spades_10:{lede:'趋近圆满的沉淀——黑桃落在极致层,“圆满即不圆满”。',synth:'<b>合成 ——</b> 趋于圆满的<span class="uline">厚重与寂静</span>。',sup:{pos:'在某个语境里:黑桃十是“大地般无言承载万物”的境地。',neg:'换个语境:同样的厚重也可能“沉到极处、归于死寂”。'}},
    spades_J:{lede:'以沉稳执掌意志的人——黑桃落在官位层,以厚重行权。',synth:'<b>合成 ——</b> 以沉稳<span class="uline">执掌的意志</span>。',sup:{pos:'在某个语境里:黑桃J是“喜怒不形、稳坐中军”的掌控。',neg:'换个语境:同样的掌控也可能“城府深沉、暗中操弄”。'}},
    spades_Q:{lede:'阴性承载的极致——黑桃推到女王之位,深沉而有威。',synth:'<b>合成 ——</b> 极致的<span class="uline">深沉与包容</span>。',sup:{pos:'在某个语境里:黑桃Q是“以静制动、包容一切”的女王。',neg:'换个语境:同样的包容也可能“吞没他人、密不透风”。'}},
    spades_K:{lede:'阳性承载的极致——黑桃推到国王之位,镇压而厚重。',synth:'<b>合成 ——</b> 极致的<span class="uline">镇定与压制</span>。',sup:{pos:'在某个语境里:黑桃K是“泰山压顶、稳定大局”的王者。',neg:'换个语境:同样的压制也可能“以重压人、令万物窒息”。'}},

    // ════ 梅花 ♣ ════
    clubs_A:{lede:'第一件被造出来的实物——梅花的显化落在最起始的单点,从无到有。',synth:'<b>合成 ——</b> 从无到有的<span class="uline">第一件成品</span>。',sup:{pos:'在某个语境里:梅花A是“想到就做出来”的行动力。',neg:'换个语境:同样的行动也可能“草草成形、粗糙落地”。'}},
    clubs_2:{lede:'两件实物的配合——梅花的显化落在“互动”层,在协作中成形。',synth:'<b>合成 ——</b> 在协作中<span class="uline">拼合成形</span>。',sup:{pos:'在某个语境里:梅花二是“分工合作、各司其职”的默契。',neg:'换个语境:同样的配合也可能“各执一端、难以咬合”。'}},
    clubs_3:{lede:'最朴素的实干者——梅花落在人类基础层,以动手见长。',synth:'<b>合成 ——</b> 埋头实干的<span class="uline">手艺人</span>。',sup:{pos:'在某个语境里:梅花三是“少说多做、踏实出活”的实在。',neg:'换个语境:同样的实干也可能“只顾埋头、不抬头看路”。'}},
    clubs_4:{lede:'把经验沉成手艺的人——梅花落在经历层,产出愈发老到。',synth:'<b>合成 ——</b> 经验打磨出的<span class="uline">老练手艺</span>。',sup:{pos:'在某个语境里:梅花四是“熟能生巧、出手即成”的老到。',neg:'换个语境:同样的熟练也可能“墨守成规、难出新意”。'}},
    clubs_5:{lede:'把“产出”练成专长的人——梅花里的高手,以作品见长。',synth:'<b>合成 ——</b> 以作品立身的<span class="uline">能工</span>。',sup:{pos:'在某个语境里:梅花五是“出手即精品”的专业。',neg:'换个语境:同样的专业也可能“困于技法、为做而做”。'}},
    clubs_6:{lede:'通晓百工的人——梅花落在博学层,什么都能上手做成。',synth:'<b>合成 ——</b> 通晓百工的<span class="uline">多面手</span>。',sup:{pos:'在某个语境里:梅花六是“样样精通、信手拈来”的全才。',neg:'换个语境:同样的全能也可能“样样通、样样松”。'}},
    clubs_7:{lede:'看透了“成与不成”的人——梅花落在通达层,做与不做皆从容。',synth:'<b>合成 ——</b> 通达取舍、<span class="uline">收放自如</span>。',sup:{pos:'在某个语境里:梅花七是“该出手时出手、该收时收”的火候。',neg:'换个语境:同样的从容也可能“看淡成果、懒于动手”。'}},
    clubs_8:{lede:'为“产出”立规的人——梅花落在变牌层,能设计流程机制,也能改换形态。',synth:'<b>合成 ——</b> 设计<span class="uline">产出机制的人</span>。',sup:{pos:'在某个语境里:梅花八是“把作坊变成流水线”的系统力。',neg:'换个语境:同样的系统也可能“流程僵化、扼杀手感”。'}},
    clubs_9:{lede:'强到无可描述的造物——梅花推到不可描述,成果碾压同侪。',synth:'<b>合成 ——</b> 无可比拟的<span class="uline">巅峰之作</span>。',sup:{pos:'在某个语境里:梅花九是“一件作品定义一个时代”的造诣。',neg:'换个语境:同样的巅峰也可能“后无来者、难以为继”。'}},
    clubs_10:{lede:'趋近圆满的成品——梅花落在极致层,“圆满即不圆满”。',synth:'<b>合成 ——</b> 趋于圆满的<span class="uline">完成之物</span>。',sup:{pos:'在某个语境里:梅花十是“无可挑剔的成品”的境地。',neg:'换个语境:同样的完美也可能“已到尽头、再无余地”。'}},
    clubs_J:{lede:'以实务执掌意志的人——梅花落在官位层,凭成果行权。',synth:'<b>合成 ——</b> 以实绩<span class="uline">服人的意志</span>。',sup:{pos:'在某个语境里:梅花J是“用结果说话、令行禁止”的实干掌权。',neg:'换个语境:同样的结果导向也可能“只认产出、不顾人情”。'}},
    clubs_Q:{lede:'阴性显化的极致——梅花推到女王之位,精致而务实。',synth:'<b>合成 ——</b> 极致的<span class="uline">经营与成形</span>。',sup:{pos:'在某个语境里:梅花Q是“把一切打理得井井有条”的女王。',neg:'换个语境:同样的经营也可能“事必躬亲、困于琐细”。'}},
    clubs_K:{lede:'阳性显化的极致——梅花推到国王之位,以宏大造物立威。',synth:'<b>合成 ——</b> 极致的<span class="uline">建造与成就</span>。',sup:{pos:'在某个语境里:梅花K是“缔造基业、留下丰碑”的王者。',neg:'换个语境:同样的建造也可能“贪大求功、徒留空壳”。'}},

    // ════ 方块 ♦ ════
    diamonds_A:{lede:'一个刚刚铺开的概率场——方块的潜在落在最起始的单点,万象未定。',synth:'<b>合成 ——</b> 万象未定的<span class="uline">第一种可能</span>。',sup:{pos:'在某个语境里:方块A是“一切皆有可能”的开局。',neg:'换个语境:同样的开放也可能“迟迟不定、停在可能里”。'}},
    diamonds_2:{lede:'两种可能的权衡——方块的潜在落在“互动”层,在比较中显形。',synth:'<b>合成 ——</b> 在权衡中<span class="uline">铺展的可能</span>。',sup:{pos:'在某个语境里:方块二是“留好退路、两手准备”的周全。',neg:'换个语境:同样的周全也可能“举棋不定、两头落空”。'}},
    diamonds_3:{lede:'最朴素的谋划者——方块落在人类基础层,以盘算见长。',synth:'<b>合成 ——</b> 朴素的<span class="uline">谋划者</span>。',sup:{pos:'在某个语境里:方块三是“凡事先想好再动”的稳妥。',neg:'换个语境:同样的稳妥也可能“想得太多、迟迟不动”。'}},
    diamonds_4:{lede:'把经验化成预案的人——方块落在经历层,谋划愈发周密。',synth:'<b>合成 ——</b> 经验织成的<span class="uline">周密预案</span>。',sup:{pos:'在某个语境里:方块四是“未雨绸缪、算无遗策”的缜密。',neg:'换个语境:同样的缜密也可能“困于推演、迟疑难决”。'}},
    diamonds_5:{lede:'把“谋划”练成专长的人——方块里的高手,以策略见长。',synth:'<b>合成 ——</b> 运筹帷幄的<span class="uline">策士</span>。',sup:{pos:'在某个语境里:方块五是“一步十算、决胜千里”的智谋。',neg:'换个语境:同样的智谋也可能“机关算尽、反误其身”。'}},
    diamonds_6:{lede:'通晓众多规则的人——方块落在博学层,洞悉各种边界与可能。',synth:'<b>合成 ——</b> 洞悉规则的<span class="uline">通晓者</span>。',sup:{pos:'在某个语境里:方块六是“看清棋盘、规则在握”的清明。',neg:'换个语境:同样的清明也可能“困于规则、不敢越界”。'}},
    diamonds_7:{lede:'看透了“可能与边界”的人——方块落在通达层,游刃于规则之间。',synth:'<b>合成 ——</b> 游走规则、<span class="uline">通达边界</span>。',sup:{pos:'在某个语境里:方块七是“在规则缝隙中找到出路”的通透。',neg:'换个语境:同样的通透也可能“钻营空子、滑不留手”。'}},
    diamonds_8:{lede:'制定规则本身的人——方块落在变牌层,能改写边界,也能重设可能。',synth:'<b>合成 ——</b> 改写<span class="uline">规则与边界的人</span>。',sup:{pos:'在某个语境里:方块八是“重新划定游戏规则”的立法者。',neg:'换个语境:同样的立法也可能“朝令夕改、规则失信”。'}},
    diamonds_9:{lede:'大到无可描述的可能——方块推到不可描述,概率场广阔无边。',synth:'<b>合成 ——</b> 无可描述的<span class="uline">广阔可能</span>。',sup:{pos:'在某个语境里:方块九是“一念之间满盘皆变”的格局。',neg:'换个语境:同样的广阔也可能“无从落子、可能即虚空”。'}},
    diamonds_10:{lede:'趋近圆满的可能——方块落在极致层,“圆满即不圆满”。',synth:'<b>合成 ——</b> 趋于圆满的<span class="uline">完备可能</span>。',sup:{pos:'在某个语境里:方块十是“万事俱备、面面周全”的境地。',neg:'换个语境:同样的完备也可能“再无变数、可能即终结”。'}},
    diamonds_J:{lede:'以谋略执掌意志的人——方块落在官位层,凭规则与远见行权。',synth:'<b>合成 ——</b> 以谋略<span class="uline">运筹的意志</span>。',sup:{pos:'在某个语境里:方块J是“定章立制、远谋全局”的智性掌权。',neg:'换个语境:同样的谋略也可能“权术算计、人心成棋”。'}},
    diamonds_Q:{lede:'阴性潜在的极致——方块推到女王之位,深谋而有弹性。',synth:'<b>合成 ——</b> 极致的<span class="uline">深谋与弹性</span>。',sup:{pos:'在某个语境里:方块Q是“以柔克刚、应变无穷”的女王。',neg:'换个语境:同样的应变也可能“心机难测、立场游移”。'}},
    diamonds_K:{lede:'阳性潜在的极致——方块推到国王之位,以规则与远略立威。',synth:'<b>合成 ——</b> 极致的<span class="uline">立法与远略</span>。',sup:{pos:'在某个语境里:方块K是“立万世之法、谋长远之局”的王者。',neg:'换个语境:同样的立法也可能“困天下于一规、远谋成空”。'}}
  };

  // —— 组合 52 张普通牌 ——
  function compose(suit,rank){
    var s=SUITS[suit], r=RANKS[rank], key=suit+'_'+rank, o=OVERRIDES[key]||{};
    var name=s.cn+r.cn;
    var card={
      key:key, suit:suit, rank:rank, name:name, sym:s.sym, cls:s.cls, accent:s.accent, suitCN:s.cn,
      latin:r.latin+' of '+s.latin,
      kicker:'单卡 · No.'+padNo(suit,rank)+' / '+s.cn,
      tags:[s.yy, s.group, r.label],
      lede:o.lede || (name+'。花色是「'+s.cn+' · '+s.yy+' · '+s.group+'」,定其'+s.short+';数字是「'+r.label+'」,定其所在的层级。两者相乘,才是这张牌。'),
      suitSub:s.cn+' · '+s.yy+' · '+s.group,
      suitPos:s.pos, suitNeg:s.neg,
      numSub:(rank==='A'||rank==='J'||rank==='Q'||rank==='K'?rank:r.cn+' 号')+' · '+r.label,
      numPos:r.pos, numNeg:r.neg,
      synth:o.synth || ('<b>合成 ——</b> 当'+s.cn+'的'+s.short+',遇上「'+r.label+'」——<span class="uline">'+name+'</span> 由此显形。'),
      sup:{
        same:(o.sup&&o.sup.same) || ('是'+s.keys+'。'),
        pos:(o.sup&&o.sup.pos) || ('在某个语境里:'+name+'把这份「'+s.group+'」用在了对的地方,成其所长。'),
        neg:(o.sup&&o.sup.neg) || ('换个语境:同一份特质用过了头,长处也就成了短处。')
      },
      combos:SUIT_COMBOS[suit]
    };
    return card;
  }
  function padNo(suit,rank){
    var n=RANK_ORDER.indexOf(rank)+1; return (n<10?'0':'')+n;
  }

  function getCard(key){
    if(!key) key='hearts_3';
    if(JOKERS[key]){
      var j=JOKERS[key];
      return {key:j.key,suit:'joker',rank:'★',name:j.name,sym:j.sym,cls:j.cls,accent:j.accent,suitCN:j.suitCN,
        latin:j.latin,kicker:j.kicker,tags:j.tags,lede:j.lede,
        suitSub:j.suitSub,suitPos:j.suitPos,suitNeg:j.suitNeg,
        numSub:j.numSub,numPos:j.numPos,numNeg:j.numNeg,
        synth:j.synth,sup:j.sup,combos:j.combos,special:true};
    }
    var parts=key.split('_'), suit=parts[0], rank=parts[1];
    if(!SUITS[suit]||!RANKS[rank]) return compose('hearts','3');
    return compose(suit,rank);
  }

  // prev / next(按牌序循环)
  function neighbors(key){
    var i=DECK.indexOf(key); if(i<0) i=DECK.indexOf('hearts_3');
    var pv=DECK[(i-1+DECK.length)%DECK.length], nx=DECK[(i+1)%DECK.length];
    return {prev:label(pv), next:label(nx)};
  }
  function label(key){
    var c=getCard(key);
    return {key:key, name:c.name, rank:(c.special?'':c.rank), sym:c.sym, cls:c.cls};
  }

  window.LUOCHA={ getCard:getCard, neighbors:neighbors, DECK:DECK, SUITS:SUITS, RANKS:RANKS, RANK_ORDER:RANK_ORDER, SUIT_ORDER:SUIT_ORDER };
})();
