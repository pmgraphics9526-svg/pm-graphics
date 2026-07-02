import{useState,useRef,useMemo}from"react";

const T={bg:"#FDF8F0",panel:"#FFFFFF",panel2:"#FFFFFF",border:"#E8DFCF",text:"#3A342A",muted:"#6B6258",dim:"#A79C8C",brand:"#FF7A00",white:"#1A1512",green:"#1E9E5A",red:"#D2334F"};

function Card({children,style={}}){
  return <div style={{background:T.panel2,border:"1px solid "+T.border,borderRadius:16,padding:22,boxShadow:"0 1px 2px rgba(20,15,5,.04)",...style}}>{children}</div>;
}
function Tag({children,color}){
  return <span style={{fontSize:11,letterSpacing:3,color:color||T.brand,fontWeight:700}}>{children}</span>;
}
function Nav({onBack,onNext,nextLabel,nextDisabled}){
  return(
    <div style={{display:"flex",gap:10,marginTop:28}}>
      {onBack&&<button onClick={onBack} style={{flex:1,padding:14,background:"transparent",border:"1px solid "+T.border,borderRadius:12,color:T.muted,cursor:"pointer",fontSize:14}}>Back</button>}
      <button onClick={nextDisabled?undefined:onNext} style={{flex:2,padding:14,background:nextDisabled?T.panel2:T.brand,border:"1px solid "+(nextDisabled?T.border:T.brand),borderRadius:12,color:nextDisabled?T.dim:"#FFFFFF",fontWeight:700,fontSize:14,cursor:nextDisabled?"default":"pointer"}}>{nextLabel||"Continue"}</button>
    </div>
  );
}
const STEPS=[{n:1,label:"Story"},{n:2,label:"Concept"},{n:3,label:"Play"},{n:4,label:"Challenge"},{n:5,label:"Takeaway"}];
function StepBar({step,setStep}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:32,overflowX:"auto",paddingBottom:4}}>
      {STEPS.map(function(s,i){
        return(
          <div key={s.n} style={{display:"flex",alignItems:"center",flexShrink:0}}>
            <button onClick={function(){if(s.n<=step)setStep(s.n);}} style={{display:"flex",alignItems:"center",gap:5,background:step===s.n?"rgba(255,122,0,.10)":"transparent",border:"none",borderRadius:20,padding:"5px 7px",cursor:s.n<=step?"pointer":"default"}}>
              <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:step===s.n?T.brand:step>s.n?"rgba(255,122,0,.18)":T.panel,border:"1px solid "+(step===s.n?T.brand:T.border),fontSize:9,fontWeight:700,color:step===s.n?"#FFFFFF":step>s.n?T.brand:T.dim,flexShrink:0}}>{step>s.n?"\u2713":s.n}</div>
              <span style={{fontSize:10,color:step===s.n?T.brand:step>s.n?T.muted:T.dim,whiteSpace:"nowrap"}}>{s.label}</span>
            </button>
            {i<STEPS.length-1&&<div style={{width:10,height:1,background:step>s.n?T.brand:T.border,flexShrink:0}}/>}
          </div>
        );
      })}
    </div>
  );
}

const LESSON_MODULE="TYPOGRAPHY - TOPIC 02";
const LESSON_TITLE="Typeface vs Font";
const LESSON_SUBTITLE="Letterpress Tradition - Ellen Lupton 2004";

const STORY_PARA_1="Before computers, a printer did not own a typeface. A printer owned drawers of metal. Each drawer held one weight, one size, one style of a design - say, Caslon, 10 point, roman - cast in lead. That single drawer, that one specific cast set, was called a font. The word comes from the French fondre, to cast.";
const STORY_PARA_2="If the printer wanted Caslon at 12 point, or Caslon in italic, or Caslon bold, that was a different font entirely - a separate purchase, a separate drawer, cast separately. But all of those fonts belonged to the same typeface: Caslon. The typeface was the design idea. The font was one physical, specific manifestation of it, sized and weighted for one particular job.";
const STORY_PARA_3="Digital type collapsed the physical difference - one file can now scale to any size instantly - which is exactly why the two words blurred together in everyday speech. Ellen Lupton, in Thinking with Type (2004), kept the historical distinction alive for designers: a typeface is the design, a font is the specific delivery mechanism - the file - that lets you use it.";
const STORY_PROBLEM="You have opened a font menu and seen a family with ten different file names - Helvetica-Regular, Helvetica-Bold, Helvetica-Light, Helvetica-Italic - and wondered whether that is ten fonts or one. It is one typeface, sitting inside several separate font files, and knowing the difference matters the moment you have to license, install, or hand off files correctly.";
const STORY_5Q=[
  {q:"What is it?",a:"A typeface is a design - the shared visual identity across a whole letterform system. A font is one specific, usable file or physical set that delivers one weight and style of that design."},
  {q:"Why does it exist?",a:"The distinction exists because a single design (typeface) can be produced in many separate weights, styles, and formats (fonts) - each needing to be made, licensed, or installed individually."},
  {q:"How does it work?",a:"A type designer creates one typeface. That typeface is then produced as multiple fonts - Regular, Bold, Italic, and so on - each a distinct file or physical set."},
  {q:"How will you use it?",a:"When you install, license, or hand off type to a developer or printer, you are dealing with fonts (specific files) even while talking about a typeface (the overall design)."},
  {q:"What if you skip it?",a:"You may license or install the wrong file, miscommunicate with developers and printers, or misunderstand what a type license actually covers."},
];

const CONCEPT_SECTIONS=[
  {tag:"TYPEFACE = THE DESIGN",content:"A typeface is the overall visual system - the shared proportions, stroke shapes, and personality that make Helvetica look like Helvetica whether it is light, bold, or italic. It is the idea, not a specific file.",rule:"One typeface can look calm or bold, but it is still recognisably the same design underneath."},
  {tag:"FONT = ONE SPECIFIC DELIVERY OF THAT DESIGN",content:"Historically, a font was one physical cast set - one weight, one size, one style. Today, a font is usually one digital file - for example Helvetica-Bold.otf - that lets you actually use one specific version of a typeface.",rule:"A typeface can have dozens of fonts. A font belongs to exactly one typeface."},
  {tag:"WHY DESIGNERS STILL KEEP THEM SEPARATE",content:"Type licenses are usually sold per font file or per family of fonts, not as a vague idea. Saying 'I need the Bold font' versus 'I need the typeface' communicates two very different, precise requests to a developer, printer, or type foundry.",rule:"Precise language here avoids licensing mistakes and file-handoff errors."},
];

const QUESTION_BANK=[
  {id:"q1",q:"What does the word 'font' historically come from?",opts:["The French word fondre, to cast","The Latin word for letter","A brand name","An abbreviation of 'foundation'"],ans:"The French word fondre, to cast",exp:"Font comes from fondre (to cast), referencing metal type being cast for a specific size and style."},
  {id:"q2",q:"In letterpress printing, what did one 'font' physically consist of?",opts:["A complete set of metal type in one size, weight, and style","Every size and weight of a typeface combined","A drawing of the alphabet","A printing press itself"],ans:"A complete set of metal type in one size, weight, and style",exp:"A font was a specific cast set - one size, one weight, one style - not the whole design range."},
  {id:"q3",q:"What is a typeface?",opts:["A single physical cast of metal letters","The overall design shared across all its weights and styles","A printing press part","A font file format like .otf"],ans:"The overall design shared across all its weights and styles",exp:"Typeface refers to the design idea itself, independent of any one specific size or weight."},
  {id:"q4",q:"If Caslon Bold and Caslon Italic are two different fonts, what do they share?",opts:["Nothing at all","The same underlying typeface, Caslon","The same file format only","The same printer"],ans:"The same underlying typeface, Caslon",exp:"Different fonts (weights/styles) can belong to the same typeface - they share its core design identity."},
  {id:"q5",q:"Why did a printer historically need to buy a separate font for each size of a typeface?",opts:["Each size and weight was a separately cast, physical set of metal type","Printers were required to by law","Typefaces changed shape at every size","Fonts were sold in random bundles"],ans:"Each size and weight was a separately cast, physical set of metal type",exp:"Physical casting meant every size/weight combination needed its own separately produced set - a separate font."},
  {id:"q6",q:"What changed with digital type that blurred the typeface/font distinction in everyday speech?",opts:["One digital file can scale to any size instantly","Digital fonts stopped having weights","Typefaces disappeared entirely","Printing presses became typefaces"],ans:"One digital file can scale to any size instantly",exp:"Because scaling no longer requires separate physical casts, the historical size-based meaning of 'font' faded from common use."},
  {id:"q7",q:"Who formalised the typeface/font distinction for modern designers in Thinking with Type (2004)?",opts:["Ellen Lupton","Johannes Gutenberg","Paul Rand","Josef Albers"],ans:"Ellen Lupton",exp:"Lupton's Thinking with Type explicitly clarifies this terminology for contemporary design practice."},
  {id:"q8",q:"A file named Helvetica-Bold.otf is best described as:",opts:["A typeface","A font","A typeface family with no fonts","A printing press setting"],ans:"A font",exp:"This is one specific file delivering one weight/style of the Helvetica typeface - that is a font."},
  {id:"q9",q:"Helvetica itself, as an overall design concept, is best described as:",opts:["A font","A typeface","A file format","A licensing agreement"],ans:"A typeface",exp:"Helvetica the design concept - spanning all its weights and styles - is the typeface."},
  {id:"q10",q:"How many fonts can one typeface have?",opts:["Exactly one, always","Potentially many - one per weight, style, or size","Zero, typefaces have no fonts","Only two, regular and bold"],ans:"Potentially many - one per weight, style, or size",exp:"A single typeface can be produced as many separate fonts across its weights and styles."},
  {id:"q11",q:"Can a single font belong to more than one typeface at once?",opts:["Yes, fonts are shared freely between typefaces","No, each font belongs to exactly one typeface","Only in digital formats","Only in historical letterpress"],ans:"No, each font belongs to exactly one typeface",exp:"A font is one specific delivery of one specific typeface - it doesn't belong to multiple designs simultaneously."},
  {id:"q12",q:"Type licenses are typically sold based on:",opts:["Specific font files or families, not a vague idea of a typeface","Random assignment by the type foundry","The buyer's personal preference only","Nothing - all type is free to use"],ans:"Specific font files or families, not a vague idea of a typeface",exp:"Licensing is precise and file-based, which is exactly why knowing the difference between typeface and font matters practically."},
  {id:"q13",q:"Why might telling a developer 'I need the typeface' instead of 'I need the Bold font file' cause confusion?",opts:["It is too vague about which specific file is required","Developers do not understand the word typeface","Typefaces cannot be used by developers","There is no difference, so it does not matter"],ans:"It is too vague about which specific file is required",exp:"Developers need the exact font file; saying only 'typeface' leaves out which weight/style is actually needed."},
  {id:"q14",q:"A type foundry produces a new design with 8 weights (Thin through Black). How many typefaces is this?",opts:["8 typefaces","1 typeface, with 8 fonts","0 typefaces, only fonts exist","8 typefaces and 8 fonts, unrelated"],ans:"1 typeface, with 8 fonts",exp:"All 8 weights share one underlying design - one typeface, delivered as 8 separate fonts."},
  {id:"q15",q:"What was 'cast' in traditional letterpress font production?",opts:["Metal type, into a specific size and style","Paper, into sheets","Ink, into bottles","Wood, into furniture"],ans:"Metal type, into a specific size and style",exp:"Font production involved casting metal letterforms for one specific size/weight/style combination."},
  {id:"q16",q:"In casual, everyday conversation, people often use 'font' to mean:",opts:["Only the physical printing press","What designers would more precisely call a typeface","A type of paper","A software company"],ans:"What designers would more precisely call a typeface",exp:"Common usage often blends the two terms, saying 'font' when referring to the overall design (typeface)."},
  {id:"q17",q:"Why is precise typeface/font language still useful today, despite common blending of the terms?",opts:["It avoids licensing mistakes and file-handoff errors","It has no practical use anymore","It only matters in printing museums","It replaces the need for design skill"],ans:"It avoids licensing mistakes and file-handoff errors",exp:"Clear terminology prevents costly mistakes when licensing, installing, or delivering the correct files."},
  {id:"q18",q:"Which of these is NOT a font, but rather a typeface?",opts:["Garamond-Italic.ttf","Georgia (as an overall design)","Arial-Bold.otf","Helvetica-Light.otf"],ans:"Georgia (as an overall design)",exp:"Georgia as a general design concept is the typeface; the others are specific font files."},
  {id:"q19",q:"A single physical drawer of 10pt Bodoni Roman metal type historically represented:",opts:["The entire Bodoni typeface","One specific font","A random assortment of unrelated letters","A printing press"],ans:"One specific font",exp:"That drawer held one size, one weight, one style - the classic definition of a font in letterpress terms."},
  {id:"q20",q:"Digital font files commonly use which extensions?",opts:[".otf and .ttf",".jpg and .png",".mp3 and .wav",".doc and .pdf"],ans:".otf and .ttf",exp:"OpenType (.otf) and TrueType (.ttf) are common digital font file formats delivering a specific typeface style."},
  {id:"q21",q:"If a designer says 'this typeface has a humanist feel', they are describing:",opts:["One specific font file's technical format","The overall design character shared across the whole typeface","A licensing detail","A printing press mechanism"],ans:"The overall design character shared across the whole typeface",exp:"Describing a 'feel' or personality refers to the typeface as a whole design, not one isolated file."},
  {id:"q22",q:"Why couldn't a letterpress printer simply 'scale up' a font to a larger size the way digital type does today?",opts:["Each size required a separately cast, physical set of type","Scaling was illegal in print shops","Metal type could stretch freely","Printers were forbidden from using large type"],ans:"Each size required a separately cast, physical set of type",exp:"Physical metal type could not be resized on demand - a new font had to be cast for each size."},
  {id:"q23",q:"A 'type family' most closely relates to which term?",opts:["A collection of related fonts under one typeface","A single font file only","A printing press brand","A paper manufacturer"],ans:"A collection of related fonts under one typeface",exp:"A type family groups all the fonts (weights/styles) that belong to one typeface."},
  {id:"q24",q:"Which best completes: 'A typeface is a design; a font is ___.'",opts:["A specific, usable delivery of that design","An unrelated design concept","A type of paper texture","A printing company"],ans:"A specific, usable delivery of that design",exp:"This is the core relationship established in this topic - typeface is the idea, font is its specific, usable form."},
  {id:"q25",q:"When you 'install a font' on your computer, what are you technically installing?",opts:["One specific file delivering one style/weight of a typeface","An entire typeface with infinite unnamed styles","A printing press driver","A random assortment of letters"],ans:"One specific file delivering one style/weight of a typeface",exp:"Font installation is file-specific - each installed file is one font, even if several fonts share a typeface."},
  {id:"q26",q:"Historically, why might a small print shop own fewer fonts of a popular typeface than a large one?",opts:["Each font (size/weight) had to be separately purchased and cast","Popular typefaces were banned for small shops","Small shops used no metal type at all","Fonts were free for large shops only"],ans:"Each font (size/weight) had to be separately purchased and cast",exp:"Cost and physical storage meant smaller shops often owned fewer separately-cast fonts of any given typeface."},
  {id:"q27",q:"Which statement is most accurate?",opts:["Typeface and font have always meant exactly the same thing","Typeface is the design; font is the specific file or cast delivering it","Font is the design; typeface is the specific file","Neither term has a defined meaning"],ans:"Typeface is the design; font is the specific file or cast delivering it",exp:"This is the precise, historically-grounded distinction this topic establishes."},
  {id:"q28",q:"A type foundry licensing agreement that lists 'Helvetica Now Bold' as a separate line item from 'Helvetica Now Regular' is treating each as:",opts:["The same font","Separate fonts within one typeface family","Unrelated typefaces","Illegal duplicates"],ans:"Separate fonts within one typeface family",exp:"Licenses commonly itemise individual fonts (weights/styles) even though they belong to one typeface family."},
  {id:"q29",q:"What practical mistake can happen if you confuse 'typeface' and 'font' when briefing a developer?",opts:["They may install or reference the wrong specific weight or file","Nothing, the words are always interchangeable in code","The website will fail to load entirely","Browsers will reject all text"],ans:"They may install or reference the wrong specific weight or file",exp:"Developers need the precise font file; vague typeface-only language risks the wrong weight/style being used."},
  {id:"q30",q:"Which of these pairs correctly matches 'typeface' to 'font'?",opts:["Garamond -> Garamond-Bold.otf","Garamond-Bold.otf -> Garamond","Bold -> Regular","Regular -> Italic"],ans:"Garamond -> Garamond-Bold.otf",exp:"Garamond is the typeface (design); Garamond-Bold.otf is one specific font file delivering it."},
  {id:"q31",q:"The physical drawers of metal type in old print shops were organised primarily by:",opts:["Size, weight, and style - i.e. by font","Random order","Colour of the ink used","Alphabetical order of the printer's name"],ans:"Size, weight, and style - i.e. by font",exp:"Each drawer represented one specific font - a distinct size/weight/style combination."},
  {id:"q32",q:"Which best explains why 'font' narrowed in meaning historically, before broadening again in casual use today?",opts:["It once meant one specific cast size/weight; digital tools made that precision less visible day-to-day","It always meant the same broad thing throughout history","It originally meant paper type only","It was invented recently with no older meaning"],ans:"It once meant one specific cast size/weight; digital tools made that precision less visible day-to-day",exp:"The old precise meaning (one cast set) faded from everyday awareness once digital scaling removed the physical constraint."},
  {id:"q33",q:"A type designer spends a year designing letterforms, weights, and styles for a new release. What have they primarily created?",opts:["A typeface","Only a single font","A printing press","A paper stock"],ans:"A typeface",exp:"Designing the overall letterform system across weights is creating a typeface, which is then released as multiple fonts."},
  {id:"q34",q:"If someone says 'send me the font', in a professional type-handoff context, what should you send?",opts:["The specific font file(s) needed, not a vague description of the typeface","A screenshot of the typeface name","A verbal description only","Nothing, as the term is meaningless"],ans:"The specific font file(s) needed, not a vague description of the typeface",exp:"Professional handoffs require the actual specific file - the font - not just the typeface name."},
  {id:"q35",q:"Which word describes the overall design identity, independent of size or weight?",opts:["Typeface","Font","Kerning","Baseline"],ans:"Typeface",exp:"Typeface refers to the design identity itself, not any one specific weight or size."},
  {id:"q36",q:"Which word refers to one specific usable file or cast?",opts:["Font","Typeface","Family","Foundry"],ans:"Font",exp:"Font is the specific, usable delivery mechanism - historically a cast, now typically a digital file."},
  {id:"q37",q:"Why does this topic avoid discussing serif versus sans-serif differences in depth?",opts:["That belongs to a separate, dedicated topic later in this module","Serif and sans-serif do not exist","This topic already covers everything about type styles","Typefaces cannot be serif or sans-serif"],ans:"That belongs to a separate, dedicated topic later in this module",exp:"This topic stays scoped to the typeface/font distinction; serif vs sans-serif is covered in its own topic."},
  {id:"q38",q:"A 'font file' in modern design software most closely corresponds historically to:",opts:["A single cast set of metal type","An entire type foundry","A printing press","A paper company"],ans:"A single cast set of metal type",exp:"Both represent one specific, usable delivery of a typeface - just in physical versus digital form."},
  {id:"q39",q:"Which best illustrates 'one typeface, many fonts' in a modern digital context?",opts:["A single .otf file with no other variants","A type family folder containing Regular.otf, Bold.otf, Italic.otf, all sharing one design","Two unrelated typefaces installed on one computer","A printing press with no digital files"],ans:"A type family folder containing Regular.otf, Bold.otf, Italic.otf, all sharing one design",exp:"This is exactly the modern equivalent of one typeface delivered as several distinct fonts."},
  {id:"q40",q:"Historically, why was 'font' tied so closely to a single size?",opts:["Because metal type had to be physically cast separately for each size","Because designers preferred smaller words","Because computers required it","Because paper size determined it"],ans:"Because metal type had to be physically cast separately for each size",exp:"The physical casting process is the direct historical root of font meaning one specific size/weight/style."},
  {id:"q41",q:"A type license priced 'per font' rather than 'per typeface' means you likely pay:",opts:["Separately for each weight/style file you use","One flat fee no matter how many weights you use","Nothing, since typefaces are always free","Based on the number of employees at your company only"],ans:"Separately for each weight/style file you use",exp:"Per-font licensing charges for each specific file/weight, reflecting the historical font-as-specific-object idea."},
  {id:"q42",q:"Which statement about digital type is accurate?",opts:["One digital font file can typically be scaled to any size without needing a new file","Every size still requires a completely separate digital file today","Digital fonts cannot have multiple weights","Digital type removed the concept of a typeface entirely"],ans:"One digital font file can typically be scaled to any size without needing a new file",exp:"Unlike letterpress, one digital font file scales freely across sizes - this is what blurred the old strict meaning of 'font'."},
  {id:"q43",q:"Why is 'Thinking with Type' by Ellen Lupton a relevant reference for this topic?",opts:["It explicitly clarifies the modern typeface/font distinction for designers","It is unrelated to typography terminology","It only covers colour theory","It was written before typefaces existed"],ans:"It explicitly clarifies the modern typeface/font distinction for designers",exp:"Lupton's book is a standard reference precisely because it restates and clarifies this terminology for contemporary practice."},
  {id:"q44",q:"A typeface can be described using words like 'geometric' or 'humanist'. A font is better described using words like:",opts:["Regular, Bold, Italic - specific style/weight labels","Geometric or humanist only","Serif or sans-serif exclusively","None, fonts cannot be described"],ans:"Regular, Bold, Italic - specific style/weight labels",exp:"Fonts are labelled by their specific weight/style, while typefaces are described by overall design character."},
  {id:"q45",q:"If two different font files (e.g. Regular and Bold) are both part of the same typeface, what do they share?",opts:["Core design DNA - proportions, stroke logic, overall personality","Nothing, they are unrelated designs","Only their file size","Only their file format"],ans:"Core design DNA - proportions, stroke logic, overall personality",exp:"Despite being separate files, fonts from the same typeface share the same underlying design principles."},
  {id:"q46",q:"What is the clearest sign that the words 'typeface' and 'font' are being used precisely rather than loosely?",opts:["The speaker distinguishes design identity from specific delivered file","The speaker never uses either word","The speaker uses them interchangeably at all times","The speaker only discusses paper"],ans:"The speaker distinguishes design identity from specific delivered file",exp:"Precise use keeps 'typeface' for the design and 'font' for the specific weight/style/file delivering it."},
  {id:"q47",q:"Which of these would a type foundry most likely list as a separate purchasable item?",opts:["Individual fonts (e.g. Bold, Italic) within a typeface family","Only the abstract idea of the typeface, with no files","A blank sheet of paper","A printing press"],ans:"Individual fonts (e.g. Bold, Italic) within a typeface family",exp:"Foundries typically sell specific fonts (files/weights), which is why understanding the distinction matters for buyers."},
  {id:"q48",q:"The single biggest idea to take from this topic is:",opts:["Typeface is the design; font is the specific, usable delivery of that design","Typeface and font are always identical in meaning","Fonts are more important than typefaces","Typefaces only exist in print, fonts only exist digitally"],ans:"Typeface is the design; font is the specific, usable delivery of that design",exp:"This is the core distinction the whole topic is built around."},
  {id:"q49",q:"Why does knowing this distinction help when troubleshooting a website's missing bold text?",opts:["You can check whether the specific Bold font file was actually loaded, not just the typeface name","It has no practical troubleshooting use","Bold text never depends on font files","Typefaces automatically include every weight with no separate files"],ans:"You can check whether the specific Bold font file was actually loaded, not just the typeface name",exp:"Missing bold text is often a missing specific font file issue, which this distinction helps you diagnose precisely."},
  {id:"q50",q:"In one sentence, a typeface relates to its fonts the way a recipe relates to:",opts:["Each specific dish actually cooked from it","An unrelated recipe","A restaurant's name","A grocery store"],ans:"Each specific dish actually cooked from it",exp:"The recipe (typeface) is the idea; each dish actually cooked (font) is one specific, usable realisation of it."},
];

const CB_TYPE="topic";
const CB_QUESTIONS=[
  {q:"A file named Georgia-Bold.ttf is best classified as:",opts:["A font","A typeface","A printing press","A paper type"],ans:"A font",exp:"This is one specific file delivering one weight of the Georgia typeface - a font."},
  {q:"Georgia, as an overall design concept spanning all its weights, is best classified as:",opts:["A typeface","A font","A license","A file format"],ans:"A typeface",exp:"The overall design identity, independent of any one weight, is the typeface."},
  {q:"A printer in 1850 owned three drawers: 10pt Roman, 12pt Roman, and 10pt Bold, all of the same design. How many fonts is this?",opts:["Three fonts, one typeface","One font, three typefaces","Three unrelated typefaces","One font and one typeface only"],ans:"Three fonts, one typeface",exp:"Each drawer is a separately cast font; all three share the same underlying typeface design."},
  {q:"A designer says 'I love this typeface's personality'. What are they most likely describing?",opts:["The overall design character shared across the whole family","One specific bold file only","A licensing fee","A paper texture"],ans:"The overall design character shared across the whole family",exp:"Personality/character talk usually refers to the typeface as a whole, not one isolated font file."},
  {q:"Which historically required a completely separate casting process: a new size of the same design, or scaling an existing digital file today?",opts:["A new size in letterpress required separate casting; digital scaling does not","Both required identical processes","Neither required any extra work","Digital scaling required more casting than letterpress"],ans:"A new size in letterpress required separate casting; digital scaling does not",exp:"This physical constraint is the historical root of why 'font' once meant one specific size/weight."},
  {q:"A type license that charges separately for Regular, Bold, and Italic is treating each as:",opts:["Separate fonts within one typeface","One single font","Unrelated typefaces","Free public assets"],ans:"Separate fonts within one typeface",exp:"Licenses commonly itemise by font (specific weight/style), even when all belong to one typeface family."},
  {q:"You ask a printer for 'the typeface' with no further detail. What is the most likely problem?",opts:["They won't know which specific weight, size, or file you need","There is no possible problem","Printers do not use typefaces","This request is always sufficiently precise"],ans:"They won't know which specific weight, size, or file you need",exp:"Typeface alone is too broad - a specific font (file/weight) is what's actually needed for production."},
  {q:"The word 'font' originates from a French word meaning:",opts:["To cast","To write","To print","To design"],ans:"To cast",exp:"Font comes from fondre (to cast), tied directly to the metal casting process in letterpress."},
  {q:"A single .otf file typically delivers:",opts:["One specific weight/style of a typeface","An entire typeface with infinite unnamed styles","A printing press configuration","A paper stock specification"],ans:"One specific weight/style of a typeface",exp:"Digital font files are still typically scoped to one specific weight/style, following the historical font concept."},
  {q:"Which best distinguishes 'installing a font' from 'designing a typeface'?",opts:["Installing uses an existing specific file; designing creates the whole design system","They are identical actions","Designing only happens digitally","Installing only happens in print shops"],ans:"Installing uses an existing specific file; designing creates the whole design system",exp:"Designing a typeface is creating the whole visual system; installing a font is using one specific delivered file."},
  {q:"Two font files, Arial-Regular.ttf and Arial-Bold.ttf, most likely share:",opts:["The same underlying typeface design","Nothing in common","The same file size only","The same license price always"],ans:"The same underlying typeface design",exp:"Both are fonts belonging to the same typeface (Arial), sharing its core design identity."},
  {q:"Why might a small 19th-century print shop have owned fewer type options than a large one?",opts:["Each font (size/weight) had to be separately purchased and physically cast","Small shops were banned from certain typefaces","Fonts were free but limited by law","Large shops used no metal type"],ans:"Each font (size/weight) had to be separately purchased and physically cast",exp:"Cost and storage space for separately-cast fonts limited how many a smaller shop could practically own."},
  {q:"A brief that says 'use the Bold font of our brand typeface' is:",opts:["Precise - it specifies both the design and the specific weight needed","Vague and unusable","Referring to two unrelated things","Only meaningful in print, not digital"],ans:"Precise - it specifies both the design and the specific weight needed",exp:"This correctly uses typeface for the design and font for the specific weight file required."},
  {q:"Which of these is closest to a modern 'type family'?",opts:["A folder of related font files sharing one typeface design","A single unrelated file","A printing press brand","A paper supplier"],ans:"A folder of related font files sharing one typeface design",exp:"A type family groups all the fonts (weights/styles) belonging to one typeface."},
  {q:"What historically limited a printer to using only certain sizes of a typeface?",opts:["Only owning the specific cast fonts they had purchased","Typefaces could only exist at one size ever","Government size restrictions","Ink colour limitations"],ans:"Only owning the specific cast fonts they had purchased",exp:"A printer could only use sizes/weights for which they owned a physically cast font."},
  {q:"Digital type blurred the classic typeface/font distinction mainly because:",opts:["One file could scale freely, removing the old per-size casting requirement","Typefaces stopped being designed","Fonts became physical objects again","Printing presses were banned"],ans:"One file could scale freely, removing the old per-size casting requirement",exp:"Free scaling removed the practical, physical reason 'font' once meant one fixed size."},
  {q:"A foundry releases 'Inter', with Thin through Black weights. What is 'Inter' itself?",opts:["A typeface","A single font","A paper type","A printing press"],ans:"A typeface",exp:"Inter, as the whole design spanning all weights, is the typeface; each weight file is a separate font."},
  {q:"Which is more precise for a licensing conversation: 'we need the typeface' or 'we need Inter-Bold.otf'?",opts:["'We need Inter-Bold.otf' - it specifies the exact font","'We need the typeface' - it's always more precise","They are equally precise","Neither is precise enough ever"],ans:"'We need Inter-Bold.otf' - it specifies the exact font",exp:"Naming the exact font file removes any ambiguity about which weight/style is required."},
  {id:"cb19",q:"A vintage print shop's font drawers were organised primarily to separate:",opts:["Different sizes, weights, and styles from each other","Different colours of ink","Different paper stocks","Different customer orders"],ans:"Different sizes, weights, and styles from each other",exp:"Each drawer held one specific font - distinguished by size, weight, and style."},
  {q:"If a typeface has never been produced as a bold weight, can a 'Bold font' of it exist?",opts:["No - a font can't exist without being produced from the typeface","Yes, fonts exist independently of typefaces","Yes, but only in print, never digitally","This situation is impossible to imagine"],ans:"No - a font can't exist without being produced from the typeface",exp:"A font is always a specific delivery of an existing typeface design - it can't exist without the typeface behind it."},
  {q:"A designer hands a developer a folder with 6 files: 3 weights x regular/italic. How many typefaces are involved?",opts:["One typeface, six fonts","Six typefaces, one font","Six typefaces, six fonts","Zero typefaces, six unrelated files"],ans:"One typeface, six fonts",exp:"All six files share one underlying design - one typeface, delivered as six separate fonts."},
  {q:"Which best reflects professional practice today regarding this terminology?",opts:["Designers still distinguish typeface (design) from font (specific file) for precision","No professional distinguishes the terms anymore","The terms have swapped meanings entirely","Only print designers use either term"],ans:"Designers still distinguish typeface (design) from font (specific file) for precision",exp:"Despite casual blending in everyday speech, professional design and licensing contexts still keep the distinction precise."},
  {q:"What is the main risk of using 'typeface' and 'font' interchangeably in a technical handoff?",opts:["Ambiguity about which specific weight/style file is actually required","No risk at all, ever","Typefaces become fonts permanently","The website will always crash"],ans:"Ambiguity about which specific weight/style file is actually required",exp:"Loose language can leave the exact required file unclear, risking wrong installs or licensing gaps."},
  {q:"A type specimen sheet showing every weight of one design side by side is showcasing:",opts:["One typeface across multiple fonts","Multiple unrelated typefaces","A single font only","A paper company's catalogue"],ans:"One typeface across multiple fonts",exp:"Specimen sheets typically display a typeface's full range, meaning multiple fonts (weights/styles) of one design."},
  {q:"Which best summarises this whole topic in one line?",opts:["Typeface is the design; font is a specific, usable delivery of it","They are two words for the exact same physical object","Font is older than typeface as a design idea","Typefaces cannot have more than one font"],ans:"Typeface is the design; font is a specific, usable delivery of it",exp:"This is the central, precise relationship the topic is built around."},
];

const BRAND_BANK=[
  {name:"Helvetica (as used across countless global brands)",hint:"One design, dozens of weights licensed separately by different companies",ans:"one typeface delivered as many separately licensed fonts",exp:"Helvetica is a single typeface, but brands license and use specific individual fonts (weights like Bold, Light, Regular) from within that one family.",opts:["One typeface delivered as many separately licensed fonts","A single font used by only one company","A typeface with only one possible weight","A font with no associated typeface"]},
  {name:"The New York Times",hint:"Uses a distinct custom font for headlines, separate from its body text font",ans:"different fonts for different roles, within a coordinated typeface system",exp:"The Times uses specific, purpose-built fonts for headlines versus body copy - different fonts serving different jobs, chosen from typefaces designed to work together.",opts:["Different fonts for different roles, within a coordinated typeface system","The exact same single font for every use","No typefaces at all, only images","Random font selection with no system"]},
  {name:"Google (Product Sans / now largely Google Sans)",hint:"A custom typeface built specifically to be delivered as multiple weighted fonts across products",ans:"a custom typeface produced as a family of separate fonts",exp:"Google commissioned a custom typeface, then produced it as a full family of individual fonts (weights) for consistent use across their many products.",opts:["A custom typeface produced as a family of separate fonts","A single universal font with no typeface behind it","A typeface with exactly one font, used everywhere","A font unrelated to any typeface design"]},
  {name:"A historic print shop's type specimen catalogue",hint:"Advertised one design available in many separately-purchasable weights and sizes",ans:"one typeface, sold as many individually purchasable fonts",exp:"These catalogues showcased a typeface's full range, but each size/weight had to be purchased as its own individual font.",opts:["One typeface, sold as many individually purchasable fonts","A single font sold as many typefaces","Unlimited free fonts with one typeface","A typeface that could not be purchased at all"]},
  {name:"A modern variable font (e.g. a single file spanning Thin to Black)",hint:"One file, but capable of producing a full range of weights",ans:"a newer format where one font file can represent a whole typeface's weight range",exp:"Variable fonts are a modern exception - a single font file can now contain and produce an entire typeface's range of weights, blurring the old one-font-per-weight rule.",opts:["A newer format where one font file can represent a whole typeface's weight range","Proof that typefaces and fonts never existed as separate ideas","A format with no relation to typeface design","A print-only technology with no digital use"]},
];

const TAKEAWAY_QUOTE="A typeface is the idea. A font is the thing you actually use to put that idea on a page.";
const TAKEAWAY_POINTS=[
  {t:"Use the words on purpose",b:"Say 'typeface' when you mean the design, 'font' when you mean the specific file or weight - especially with developers, printers, and licenses."},
  {t:"Check your font files, not just the typeface name",b:"When something looks wrong (missing bold, wrong weight), check which specific font file is actually installed or loaded."},
  {t:"Read licenses by the font, not the typeface",b:"Most type licenses are scoped to specific fonts or families - know exactly which weights and styles you're actually covered to use."},
];

const SOURCES=[
  "Ellen Lupton - Thinking with Type (2004). Modern clarification of typeface vs font terminology.",
  "Robert Bringhurst - The Elements of Typographic Style (1992). Historical and structural type terminology.",
];

export default function T02TypefaceVsFontLesson(){
  const[step,setStep]=useState(1);
  const[answers,setAnswers]=useState({});
  const[revealed,setRevealed]=useState({});
  const[cbAnswers,setCbAnswers]=useState({});
  const[cbAnswered,setCbAnswered]=useState({});
  const[cbIdx,setCbIdx]=useState(0);
  const[cbDone,setCbDone]=useState(false);
  const[ccAnswers,setCcAnswers]=useState({});
  const[ccRevealed,setCcRevealed]=useState({});
  const[ccAnswered,setCcAnswered]=useState({});
  const[ccIdx,setCcIdx]=useState(0);
  const[ccDone,setCcDone]=useState(false);
  const top=useRef(null);
  function go(n){setStep(n);if(top.current)top.current.scrollIntoView({behavior:"smooth"});}

  const QS=useMemo(function(){
    return [...QUESTION_BANK].sort(function(){return Math.random()-0.5;}).slice(0,10);
  },[]);
  const CB_SET=useMemo(function(){
    return [...CB_QUESTIONS].sort(function(){return Math.random()-0.5;}).slice(0,5);
  },[]);
  const CC_SET=useMemo(function(){
    return [...BRAND_BANK].sort(function(){return Math.random()-0.5;}).slice(0,5);
  },[]);

  const playScore=QS.filter(function(q){return answers[q.id]===q.ans;}).length;
  const allRevealed=QS.every(function(q){return revealed[q.id];});
  const cbScore=CB_SET.filter(function(q,i){return cbAnswered[i]&&cbAnswers[i]===q.ans;}).length;
  const ccScore=CC_SET.filter(function(b,i){return ccAnswered[i]&&ccAnswers[i]===b.ans;}).length;
  const total=Math.round((playScore/QS.length)*50+cbScore*5+ccScore*5);
  const bothDone=cbDone&&ccDone;

  return(
    <div ref={top} style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"Inter,system-ui,sans-serif",padding:"32px 18px 60px"}}>
      <div style={{maxWidth:640,margin:"0 auto"}}>

        <div style={{marginBottom:24}}>
          <Tag>{LESSON_MODULE}</Tag>
          <h1 style={{fontSize:30,fontFamily:"Georgia,serif",margin:"10px 0 6px",lineHeight:1.1,color:T.white}}>{LESSON_TITLE}</h1>
          <p style={{fontSize:12.5,color:T.dim,margin:0}}>{LESSON_SUBTITLE}</p>
        </div>
        <StepBar step={step} setStep={go}/>

        {step===1&&(
          <div>
            <Card style={{marginBottom:18,borderLeft:"4px solid "+T.brand}}>
              <Tag>THE STORY</Tag>
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 14px"}}>{STORY_PARA_1}</p>
              <p style={{fontSize:15,color:T.muted,lineHeight:1.75,margin:"0 0 12px"}}>{STORY_PARA_2}</p>
              <p style={{fontSize:15,color:T.muted,lineHeight:1.75,margin:"0 0 12px"}}>{STORY_PARA_3}</p>
              <div style={{background:"rgba(210,51,79,.06)",border:"1px solid rgba(210,51,79,.2)",borderRadius:10,padding:14}}>
                <div style={{fontSize:12,color:T.red,fontWeight:700,marginBottom:6}}>You have seen this problem before</div>
                <div style={{fontSize:13.5,color:T.muted,lineHeight:1.7}}>{STORY_PROBLEM}</div>
              </div>
            </Card>
            <Card style={{marginBottom:14}}>
              <Tag color={T.green}>WHAT THIS MEANS FOR YOU</Tag>
              <p style={{fontSize:14,color:T.muted,lineHeight:1.7,margin:"10px 0 14px"}}>This is a thinking tool. It lives in your head. It works in every medium, every tool, every project.</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {STORY_5Q.map(function(item){
                  return(
                    <div key={item.q} style={{background:T.bg,borderRadius:10,padding:12,display:"flex",gap:12,alignItems:"flex-start",border:"1px solid "+T.border}}>
                      <div style={{fontSize:12,color:T.brand,fontWeight:700,flexShrink:0,minWidth:120}}>{item.q}</div>
                      <div style={{fontSize:13,color:T.muted,lineHeight:1.6}}>{item.a}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Nav onNext={function(){go(2);}} nextLabel="Learn the concept"/>
          </div>
        )}

        {step===2&&(
          <div>
            <Card style={{marginBottom:18,borderLeft:"4px solid "+T.brand}}>
              <Tag>THE CONCEPT</Tag>
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 0"}}>One design. Many specific deliveries of it. That is the whole distinction.</p>
            </Card>
            {CONCEPT_SECTIONS.map(function(sec){
              return(
                <Card key={sec.tag} style={{marginBottom:14}}>
                  <Tag>{sec.tag}</Tag>
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.7,margin:"10px 0 12px"}}>{sec.content}</p>
                  <div style={{fontSize:12.5,color:T.white,background:T.bg,border:"1px solid "+T.border,borderRadius:8,padding:"9px 12px",fontWeight:600}}>{sec.rule}</div>
                </Card>
              );
            })}
            <Nav onBack={function(){go(1);}} onNext={function(){go(3);}} nextLabel="Test yourself"/>
          </div>
        )}

        {step===3&&(
          <div>
            <Card style={{marginBottom:18,borderLeft:"4px solid "+T.brand}}>
              <Tag>PLAY - 10 QUESTIONS</Tag>
              <p style={{fontSize:16,color:T.white,lineHeight:1.65,margin:"10px 0 6px"}}>Answer all 10. Each correct = 5 points. Answer is locked on selection.</p>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10}}>
                <div style={{flex:1,height:6,background:T.bg,borderRadius:3,overflow:"hidden",border:"1px solid "+T.border}}>
                  <div style={{height:"100%",background:T.brand,borderRadius:3,width:(Object.keys(revealed).length/QS.length*100)+"%",transition:"width .3s"}}/>
                </div>
                <span style={{fontSize:12,color:T.brand,fontWeight:700,flexShrink:0}}>{Object.keys(revealed).length}/{QS.length}</span>
              </div>
            </Card>
            {QS.map(function(q,qi){
              const prevRevealed=qi===0?true:!!revealed[QS[qi-1].id];
              if(!prevRevealed)return null;
              const picked=answers[q.id];
              const isRev=!!revealed[q.id];
              const correct=picked===q.ans;
              return(
                <Card key={q.id} style={{marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <Tag color={isRev?(correct?T.green:T.red):T.brand}>{"Q"+(qi+1)+" of "+QS.length}</Tag>
                    {isRev&&<span style={{fontSize:13,color:correct?T.green:T.red,fontWeight:700}}>{correct?"+5 pts":"0 pts"}</span>}
                  </div>
                  <p style={{fontSize:14,color:T.white,lineHeight:1.65,margin:"0 0 12px",fontWeight:500}}>{q.q}</p>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {q.opts.map(function(opt){
                      const isPicked=picked===opt;
                      const isCorrectOpt=opt===q.ans;
                      let bg=T.bg,bc=T.border,fc=T.muted;
                      if(isRev){
                        if(isCorrectOpt){bg="rgba(30,158,90,.10)";bc=T.green;fc=T.green;}
                        else if(isPicked){bg="rgba(210,51,79,.10)";bc=T.red;fc=T.red;}
                      } else if(isPicked){bg="rgba(255,122,0,.12)";bc=T.brand;fc=T.brand;}
                      return(
                        <button key={opt}
                          onClick={function(){if(!isRev&&!picked){setAnswers(function(p){return Object.assign({},p,{[q.id]:opt});}); }}}
                          style={{padding:"11px 16px",background:bg,border:"1px solid "+bc,borderRadius:10,color:fc,cursor:(isRev||picked)?"default":"pointer",textAlign:"left",fontSize:13.5,lineHeight:1.5}}
                        >{opt}</button>
                      );
                    })}
                  </div>
                  {picked&&!isRev&&(
                    <button onClick={function(){setRevealed(function(p){return Object.assign({},p,{[q.id]:true});});}}
                      style={{width:"100%",padding:12,background:T.brand,border:"none",borderRadius:10,color:"#FFFFFF",fontWeight:700,cursor:"pointer",fontSize:14,marginTop:12}}>Reveal answer</button>
                  )}
                  {isRev&&(
                    <div style={{background:correct?"rgba(30,158,90,.06)":"rgba(210,51,79,.06)",border:"1px solid "+(correct?T.green:T.red),borderRadius:10,padding:14,marginTop:12}}>
                      <div style={{fontSize:13,color:T.muted,lineHeight:1.7}}>{q.exp}</div>
                    </div>
                  )}
                </Card>
              );
            })}
            {allRevealed&&(
              <Card style={{marginBottom:18,background:"rgba(255,122,0,.06)",borderLeft:"4px solid "+T.brand}}>
                <Tag>PLAY COMPLETE</Tag>
                <div style={{display:"flex",alignItems:"center",gap:16,margin:"12px 0"}}>
                  <div style={{fontSize:40,fontWeight:800,color:T.brand,fontFamily:"Georgia,serif",lineHeight:1}}>{playScore}<span style={{fontSize:20,color:T.muted}}>/{QS.length}</span></div>
                  <div>
                    <div style={{fontSize:14,color:T.white,fontWeight:700}}>{playScore>=8?"Excellent!":"Keep going - challenges ahead"}</div>
                    <div style={{fontSize:13,color:T.muted,marginTop:2}}>{playScore*5} / 50 points earned</div>
                  </div>
                </div>
              </Card>
            )}
            <Nav onBack={function(){go(2);}} onNext={function(){go(4);}} nextLabel={allRevealed?"Take the challenge":"Answer all 10 first"} nextDisabled={!allRevealed}/>
          </div>
        )}

        {step===4&&(
          <div>
            <Card style={{marginBottom:18,borderLeft:"4px solid "+T.brand}}>
              <Tag>CHALLENGE</Tag>
              <p style={{fontSize:16,color:T.white,lineHeight:1.65,margin:"10px 0 4px"}}>5 practice + 5 brand challenges. Complete each to unlock the next. First answer is final.</p>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10}}>
                <div style={{flex:1,height:5,background:T.bg,borderRadius:3,overflow:"hidden",border:"1px solid "+T.border}}>
                  <div style={{height:"100%",background:T.brand,borderRadius:3,width:((cbIdx+ccIdx)/10*100)+"%",transition:"width .3s"}}/>
                </div>
                <span style={{fontSize:11,color:T.brand,fontWeight:700,flexShrink:0}}>{cbIdx+ccIdx}/10</span>
              </div>
            </Card>

            {CB_SET.map(function(q,qi){
              const prevDone=qi===0?true:!!cbAnswered[qi-1];
              if(!prevDone)return null;
              const myAns=cbAnswers[qi];
              const myDone=!!cbAnswered[qi];
              const isCorrect=myAns===q.ans;
              return(
                <Card key={"cb"+qi} style={{marginBottom:14,opacity:myDone?0.7:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <Tag color={myDone?(isCorrect?T.green:T.red):T.brand}>{"B"+(qi+1)+" of 5"}</Tag>
                    {myDone&&<span style={{fontSize:12,color:isCorrect?T.green:T.red,fontWeight:700}}>{isCorrect?"+5 pts":"0 pts"}</span>}
                  </div>
                  <p style={{fontSize:14,color:T.white,lineHeight:1.6,margin:"0 0 12px",fontWeight:500}}>{q.q}</p>
                  <div style={{display:"flex",flexDirection:"column",gap:7}}>
                    {q.opts.map(function(opt){
                      const isPicked=myAns===opt;
                      const isCorrectOpt=opt===q.ans;
                      let bg=T.bg,bc=T.border,fc=T.muted;
                      if(myDone){
                        if(isCorrectOpt){bg="rgba(30,158,90,.10)";bc=T.green;fc=T.green;}
                        else if(isPicked){bg="rgba(210,51,79,.10)";bc=T.red;fc=T.red;}
                      } else if(isPicked){bg="rgba(255,122,0,.12)";bc=T.brand;fc=T.brand;}
                      return(
                        <button key={opt}
                          onClick={function(){
                            if(myDone||myAns!==undefined)return;
                            const na=Object.assign({},cbAnswers);na[qi]=opt;setCbAnswers(na);
                            const nd=Object.assign({},cbAnswered);nd[qi]=true;setCbAnswered(nd);
                            setCbIdx(qi+1);
                            if(qi===4)setCbDone(true);
                          }}
                          style={{padding:"10px 14px",background:bg,border:"1px solid "+bc,borderRadius:10,color:fc,cursor:(myDone||myAns!==undefined)?"default":"pointer",textAlign:"left",fontSize:13.5}}
                        >{opt}</button>
                      );
                    })}
                  </div>
                  {myDone&&(
                    <div style={{background:isCorrect?"rgba(30,158,90,.08)":"rgba(210,51,79,.08)",border:"1px solid "+(isCorrect?T.green:T.red),borderRadius:10,padding:12,marginTop:10}}>
                      <div style={{fontWeight:700,color:isCorrect?T.green:T.red,marginBottom:4}}>{isCorrect?"Correct! +5 pts":"Wrong - 0 pts. Answer: "+q.ans}</div>
                      <div style={{fontSize:13,color:T.muted,lineHeight:1.65}}>{q.exp}</div>
                    </div>
                  )}
                </Card>
              );
            })}

            {cbDone&&CC_SET.map(function(brand,qi){
              const prevDone=qi===0?true:!!ccAnswered[qi-1];
              if(!prevDone)return null;
              const myAns=ccAnswers[qi];
              const myRev=!!ccRevealed[qi];
              const myDone=!!ccAnswered[qi];
              const isCorrect=myAns===brand.ans;
              return(
                <Card key={"cc"+qi} style={{marginBottom:14,opacity:myDone?0.7:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <Tag color={myDone?(isCorrect?T.green:T.red):T.brand}>{"C"+(qi+1)+" of 5 - Real Brand"}</Tag>
                    {myDone&&<span style={{fontSize:12,color:isCorrect?T.green:T.red,fontWeight:700}}>{isCorrect?"+5 pts":"0 pts"}</span>}
                  </div>
                  <div style={{background:T.bg,border:"1px solid "+T.border,borderRadius:12,padding:16,marginBottom:12}}>
                    <div style={{fontWeight:700,color:T.white,fontSize:15,marginBottom:6}}>{brand.name}</div>
                    <div style={{fontSize:12.5,color:T.dim}}>Hint: {brand.hint}</div>
                  </div>
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.6,margin:"0 0 12px"}}>What typeface/font decision does this example show?</p>
                  {!myRev&&(
                    <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
                      {brand.opts.map(function(opt){
                        return(
                          <button key={opt}
                            onClick={function(){if(!myAns){const n=Object.assign({},ccAnswers);n[qi]=opt;setCcAnswers(n);}}}
                            style={{padding:"10px 14px",background:myAns===opt?"rgba(255,122,0,.12)":T.bg,border:"1px solid "+(myAns===opt?T.brand:T.border),borderRadius:10,color:myAns===opt?T.brand:T.muted,cursor:myAns?"default":"pointer",textAlign:"left",fontSize:13.5}}
                          >{opt}</button>
                        );
                      })}
                      {myAns&&<button onClick={function(){const n=Object.assign({},ccRevealed);n[qi]=true;setCcRevealed(n);}} style={{padding:11,background:T.brand,border:"none",borderRadius:10,color:"#FFFFFF",fontWeight:700,cursor:"pointer",fontSize:14,marginTop:4}}>Reveal answer</button>}
                    </div>
                  )}
                  {myRev&&(
                    <div style={{background:isCorrect?"rgba(30,158,90,.08)":"rgba(210,51,79,.08)",border:"1px solid "+(isCorrect?T.green:T.red),borderRadius:12,padding:14}}>
                      <div style={{fontWeight:700,color:isCorrect?T.green:T.red,marginBottom:6}}>{isCorrect?"Correct! +5 pts":"Wrong - 0 pts. Answer: "+brand.ans}</div>
                      <div style={{fontWeight:700,color:T.white,marginBottom:4}}>This is {brand.name}.</div>
                      <div style={{fontSize:13,color:T.muted,lineHeight:1.65,marginBottom:10}}>{brand.exp}</div>
                      {!myDone&&<button onClick={function(){const n=Object.assign({},ccAnswered);n[qi]=true;setCcAnswered(n);setCcIdx(qi+1);if(qi===4)setCcDone(true);}} style={{padding:"8px 18px",background:T.green,border:"none",borderRadius:8,color:"#FFFFFF",fontWeight:700,fontSize:13,cursor:"pointer"}}>Next</button>}
                    </div>
                  )}
                </Card>
              );
            })}

            {!cbDone&&(
              <div style={{textAlign:"center",padding:20,color:T.dim,fontSize:13}}>Complete all 5 practice challenges to unlock Brand challenges</div>
            )}
            <Nav onBack={function(){go(3);}} onNext={function(){go(5);}} nextLabel={bothDone?"See takeaway":"Complete all challenges"} nextDisabled={!bothDone}/>
          </div>
        )}

        {step===5&&(
          <div>
            <Card style={{marginBottom:16,background:"rgba(255,122,0,.06)",borderLeft:"4px solid "+T.brand}}>
              <Tag>KEY TAKEAWAY</Tag>
              <p style={{fontSize:21,color:T.white,fontFamily:"Georgia,serif",lineHeight:1.5,margin:"12px 0 0"}}>{TAKEAWAY_QUOTE}</p>
            </Card>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
              {TAKEAWAY_POINTS.map(function(item){
                return(
                  <Card key={item.t} style={{display:"flex",gap:14,alignItems:"flex-start",padding:16}}>
                    <div style={{width:32,height:32,borderRadius:8,background:"rgba(255,122,0,.14)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <div style={{width:12,height:12,borderRadius:"50%",background:T.brand}}/>
                    </div>
                    <div>
                      <div style={{fontWeight:700,color:T.white,fontSize:14,marginBottom:5}}>{item.t}</div>
                      <div style={{fontSize:13.5,color:T.muted,lineHeight:1.65}}>{item.b}</div>
                    </div>
                  </Card>
                );
              })}
            </div>
            <Card style={{marginBottom:20}}>
              <Tag color={T.dim}>SOURCES</Tag>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:10}}>
                {SOURCES.map(function(s,i){
                  return <div key={i} style={{fontSize:12.5,color:T.dim,lineHeight:1.6,paddingLeft:12,borderLeft:"2px solid "+T.border}}>{s}</div>;
                })}
              </div>
            </Card>
            <div style={{background:"rgba(255,122,0,.06)",border:"1px solid rgba(255,122,0,.2)",borderRadius:12,padding:16,marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:13,color:T.muted}}>Your score this lesson</div>
                <div style={{fontSize:28,fontWeight:800,color:T.brand,fontFamily:"Georgia,serif"}}>{total}<span style={{fontSize:16,color:T.muted}}>/100</span></div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,color:T.dim}}>Play: {playScore*5} pts</div>
                <div style={{fontSize:11,color:T.dim}}>Challenge B: {cbScore*5} pts</div>
                <div style={{fontSize:11,color:T.dim}}>Challenge C: {ccScore*5} pts</div>
              </div>
            </div>
            <div style={{background:"linear-gradient(135deg,rgba(255,122,0,.12),rgba(255,122,0,.03))",border:"1px solid rgba(255,122,0,.2)",borderRadius:16,padding:22,marginBottom:20}}>
              <div style={{fontWeight:700,color:T.white,fontSize:15,marginBottom:6}}>Topic 02 Complete.</div>
              <div style={{fontSize:13.5,color:T.muted,lineHeight:1.6}}>Topic 03 - Serif vs Sans-Serif: the two great families of letterforms, and what each communicates.</div>
            </div>
            <Nav onBack={function(){go(4);}} onNext={function(){go(1);}} nextLabel="Restart Lesson"/>
          </div>
        )}

      </div>
    </div>
  );
}
