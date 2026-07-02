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

const LESSON_MODULE="TYPOGRAPHY - TOPIC 03";
const LESSON_TITLE="Serif vs Sans-Serif";
const LESSON_SUBTITLE="Trajan's Column c.113 - Paul Renner 1927";

const STORY_PARA_1="In Rome, around 113 AD, stonemasons carved letters into the base of Trajan's Column. Before cutting stone, letters were first painted on with a flat brush - and a flat brush, pulled to a stop, naturally leaves a small flare at the end of a stroke. When the chisel followed the brush marks, those flares became small carved feet at the ends of the letters. Those feet are what we now call serifs.";
const STORY_PARA_2="For over a thousand years afterward, nearly every Western typeface carried that same inheritance - a serif at the terminal of almost every stroke - because early type designers were consciously imitating Roman inscriptional letters. Serif type became the default face of formal, printed, trusted text: books, newspapers, legal documents.";
const STORY_PARA_3="Sans-serif letters - literally 'without serif' - existed for centuries in casual, unrefined lettering, but were not taken seriously as a typeface family until the 1800s, when British foundries began cutting bold, geometric letterforms stripped of any serif for posters and advertising. It took the Bauhaus and modernists like Paul Renner, who released Futura in 1927, to argue that sans-serif was not a shortcut - it was a deliberate, rational alternative built for a modern, industrial century.";
const STORY_PROBLEM="You have looked at two versions of the same word - one with small feet at the ends of the letters, one without - and sensed they felt different before you could explain why. One might feel older, more formal, more 'printed'. The other might feel cleaner, newer, more 'digital'. That instinct is not random - it traces directly back to two different histories.";
const STORY_5Q=[
  {q:"What is it?",a:"Serif typefaces have small strokes (serifs) at the ends of letters. Sans-serif typefaces do not - their strokes end plainly, with no added foot or flourish."},
  {q:"Why does it exist?",a:"Serifs originated from Roman stone-carving traditions; sans-serif emerged much later as a deliberate, stripped-down alternative built for posters, industry, and modernism."},
  {q:"How does it work?",a:"The presence or absence of a small terminal stroke is the single defining structural difference between the two families - everything else is a tendency, not a rule."},
  {q:"How will you use it?",a:"Recognising serif versus sans-serif lets you correctly identify, describe, and choose between the two largest families of Western typefaces."},
  {q:"What if you skip it?",a:"You risk confusing typeface personality with typeface family, or missing that a design choice as simple as 'has a serif or not' carries a long, specific history."},
];

const CONCEPT_SECTIONS=[
  {tag:"THE ONLY REQUIRED DIFFERENCE",content:"A serif is a small stroke or 'foot' attached to the end of a larger stroke in a letter. A serif typeface has them consistently across its letters. A sans-serif typeface does not - 'sans' is French for 'without'. That single structural feature is the entire defining line between the two families.",rule:"Everything else - mood, weight, era - is a tendency of each family, not part of the definition itself."},
  {tag:"TWO SEPARATE ORIGIN STORIES",content:"Serif letterforms descend from Roman stone inscriptions, carved following brush-painted guides that naturally flared at stroke ends. Sans-serif letterforms were cut centuries later, first for bold 19th-century advertising, then deliberately embraced by modernist designers seeking a rational, ornament-free letterform for an industrial age.",rule:"One family is roughly two thousand years old. The other is roughly two hundred."},
  {tag:"A STRUCTURAL LABEL, NOT A PERSONALITY VERDICT",content:"Calling a typeface serif or sans-serif describes its structure, not automatically its mood. A serif face can be sharp and modern; a sans-serif face can feel warm and traditional. This topic stays at the structural level - how each family typically reads and feels is covered later, in its own topic.",rule:"Structure first. Personality is a separate, deeper conversation."},
];

const QUESTION_BANK=[
  {id:"q1",q:"What is a serif?",opts:["A small stroke or foot at the end of a larger letter stroke","A type of paper used in printing","A font file format","A measurement of letter spacing"],ans:"A small stroke or foot at the end of a larger letter stroke",exp:"A serif is the small terminal stroke attached to the end of a letter's main strokes."},
  {id:"q2",q:"What does 'sans' mean in 'sans-serif'?",opts:["Without","With","Bold","Rounded"],ans:"Without",exp:"Sans is French for 'without' - sans-serif literally means 'without serifs'."},
  {id:"q3",q:"Where did serif letterforms most directly originate from?",opts:["Roman stone inscriptions, following brush-painted guides","Medieval handwriting only","20th-century advertising","Digital font design software"],ans:"Roman stone inscriptions, following brush-painted guides",exp:"Serifs trace to Roman inscriptional carving, where a chisel followed flared brush-painted letter guides."},
  {id:"q4",q:"Approximately how old is the serif tradition, tracing back to Trajan's Column?",opts:["Around two thousand years","Around two hundred years","Around fifty years","Around five hundred years"],ans:"Around two thousand years",exp:"Trajan's Column dates to roughly 113 AD, making the serif tradition roughly two millennia old."},
  {id:"q5",q:"When did sans-serif letterforms first begin appearing as serious typefaces?",opts:["The 1800s, for posters and advertising","The 1400s, alongside movable type","Ancient Rome, alongside serif letters","The 1990s, with digital fonts"],ans:"The 1800s, for posters and advertising",exp:"Sans-serif typefaces emerged in 19th-century Britain, initially for bold display and advertising use."},
  {id:"q6",q:"Who released the influential sans-serif typeface Futura in 1927?",opts:["Paul Renner","Robert Bringhurst","Johannes Gutenberg","Ellen Lupton"],ans:"Paul Renner",exp:"Paul Renner designed Futura, a landmark geometric sans-serif released in 1927 tied to modernist ideals."},
  {id:"q7",q:"What movement helped legitimise sans-serif type as a deliberate, rational design choice?",opts:["The Bauhaus and modernism","The Renaissance","Ancient Roman engineering","Medieval calligraphy"],ans:"The Bauhaus and modernism",exp:"Bauhaus-aligned modernists argued sans-serif was a rational letterform suited to an industrial, modern age."},
  {id:"q8",q:"What is the single defining structural difference between serif and sans-serif typefaces?",opts:["Presence or absence of small strokes at the ends of letters","Whether the typeface is bold or light","Whether the typeface is used in print or digital","The number of letters in the alphabet used"],ans:"Presence or absence of small strokes at the ends of letters",exp:"This one structural feature - serifs present or absent - is the entire defining line between the two families."},
  {id:"q9",q:"Is a typeface's mood (formal, modern, playful) automatically decided by whether it is serif or sans-serif?",opts:["No, it is a tendency, not an automatic rule","Yes, every serif is formal and every sans-serif is modern","Yes, but only in digital typefaces","No, mood is unrelated to typeface structure at all"],ans:"No, it is a tendency, not an automatic rule",exp:"Serif or sans-serif describes structure; mood is a tendency associated with each family, not a strict rule."},
  {id:"q10",q:"Before being taken seriously as typefaces, where did sans-serif letterforms mostly appear?",opts:["Casual, unrefined lettering for centuries","Roman government documents","Medieval religious manuscripts","Ancient Egyptian hieroglyphics"],ans:"Casual, unrefined lettering for centuries",exp:"Sans-serif forms existed informally for a long time before being cut as deliberate, serious typefaces."},
  {id:"q11",q:"How did stonemasons at Trajan's Column likely arrive at the serif shape?",opts:["Following brush-painted letter guides that flared at stroke ends","Copying letterforms from wooden printing blocks","Random accidental chisel slips","Imitating sans-serif Roman posters"],ans:"Following brush-painted letter guides that flared at stroke ends",exp:"Letters were painted with a flat brush before carving; the brush's natural flare at stroke ends became the carved serif."},
  {id:"q12",q:"Which best describes why serif type became the 'default' face of formal printed text for centuries?",opts:["Early type designers deliberately imitated Roman inscriptional letters","Sans-serif type had not been invented yet at all","Serif type was mandated by law","Sans-serif was too expensive to print"],ans:"Early type designers deliberately imitated Roman inscriptional letters",exp:"Early typefaces consciously followed the Roman inscriptional tradition, carrying serifs into printed books and documents."},
  {id:"q13",q:"What made Futura (1927) significant in sans-serif history?",opts:["It argued sans-serif was a deliberate, rational choice, not a shortcut","It was the very first sans-serif ever created","It reintroduced serifs to modern type","It was designed for ancient Roman inscriptions"],ans:"It argued sans-serif was a deliberate, rational choice, not a shortcut",exp:"Futura, tied to modernist ideals, positioned sans-serif as an intentional design philosophy for an industrial era."},
  {id:"q14",q:"A typeface with small feet at the ends of its vertical strokes is:",opts:["A serif typeface","A sans-serif typeface","Neither, it is undefined","Both simultaneously"],ans:"A serif typeface",exp:"The presence of those small terminal strokes (feet) is exactly what defines a serif typeface."},
  {id:"q15",q:"A typeface with clean strokes and no terminal flourishes is:",opts:["A sans-serif typeface","A serif typeface","An undefined typeface","A calligraphic typeface only"],ans:"A sans-serif typeface",exp:"The absence of serifs at stroke ends is exactly what defines a sans-serif typeface."},
  {id:"q16",q:"Roughly how much older is the serif tradition compared to sans-serif as a serious typeface family?",opts:["About ten times older","About the same age","Sans-serif is actually older","Impossible to estimate at all"],ans:"About ten times older",exp:"Serif traces back roughly two thousand years; sans-serif as a serious typeface family is roughly two hundred years old - about a tenfold difference."},
  {id:"q17",q:"Why does this topic avoid deep discussion of typeface 'personality' (formal vs playful, etc.)?",opts:["That is covered in a separate, dedicated topic later in this module","Typefaces have no personality at all","Serif and sans-serif have identical personalities always","Personality only applies to logos, not typefaces"],ans:"That is covered in a separate, dedicated topic later in this module",exp:"This topic stays scoped to the structural definition; typeface personality is explored in its own later topic."},
  {id:"q18",q:"Which best completes: 'Serif or sans-serif describes ___, not automatically the typeface's mood.'",opts:["Structure","Price","File format","Country of origin"],ans:"Structure",exp:"Serif/sans-serif is a structural classification; mood is a separate, related but distinct tendency."},
  {id:"q19",q:"What is the literal French translation of 'sans' in typography terms?",opts:["Without","Above","Bold","Small"],ans:"Without",exp:"Sans is French for 'without', directly describing the absence of serifs."},
  {id:"q20",q:"Which century saw sans-serif typefaces first cut for serious commercial use, primarily in advertising?",opts:["The 19th century","The 1st century","The 15th century","The 21st century"],ans:"The 19th century",exp:"British foundries began cutting bold sans-serif letterforms for posters and advertising in the 1800s."},
  {id:"q21",q:"A typeface used for a formal legal document is more traditionally likely to be:",opts:["Serif, following centuries of printed-document convention","Sans-serif, following advertising convention","Neither typeface family is ever used for documents","Both are banned from legal documents"],ans:"Serif, following centuries of printed-document convention",exp:"Serif's long association with formal printed text (books, documents) makes it a traditional default for such contexts - though this is convention, not a hard rule."},
  {id:"q22",q:"The Bauhaus movement's interest in sans-serif type was tied to:",opts:["A rational, ornament-free aesthetic suited to an industrial age","A rejection of all typography entirely","Recreating Roman stone inscriptions exactly","Avoiding all use of straight lines"],ans:"A rational, ornament-free aesthetic suited to an industrial age",exp:"Bauhaus modernists valued stripped-down, rational design - sans-serif fit that philosophy directly."},
  {id:"q23",q:"If a typeface has serifs on some letters but not others inconsistently, what does that suggest?",opts:["It is likely not a deliberately designed serif or sans-serif system","It is automatically a superior typeface","It must be a digital-only typeface","It has no defining characteristics at all"],ans:"It is likely not a deliberately designed serif or sans-serif system",exp:"A properly designed typeface applies its serif or sans-serif structure consistently across its letterforms."},
  {id:"q24",q:"Which of these is closest to a modernist argument in favour of sans-serif?",opts:["It represented a rational, deliberate break from ornamental tradition","It was the only typeface style available at the time","It was invented purely by accident","It was required by printing press manufacturers"],ans:"It represented a rational, deliberate break from ornamental tradition",exp:"Modernists framed sans-serif as an intentional design philosophy, not just an absence of decoration."},
  {id:"q25",q:"The flared shape of a serif is believed to trace back to which tool or technique?",opts:["A flat brush used to paint letter guides before carving","A digital vector tool","A typewriter key strike","A printing press roller"],ans:"A flat brush used to paint letter guides before carving",exp:"The brush's natural flare when it stopped moving is the likely physical origin of the carved serif shape."},
  {id:"q26",q:"Is it accurate to say 'all sans-serif typefaces are modern and all serif typefaces are old-fashioned'?",opts:["No, that oversimplifies a tendency into an absolute rule","Yes, this is always true without exception","Yes, but only for digital typefaces","No, the statement should be reversed exactly"],ans:"No, that oversimplifies a tendency into an absolute rule",exp:"Structure (serif/sans-serif) does not automatically dictate mood - many exceptions exist in both directions."},
  {id:"q27",q:"Which best describes the historical gap between the two family origins?",opts:["Serif is ancient (Roman); sans-serif is comparatively recent (19th-20th century)","Both emerged in exactly the same century","Sans-serif is ancient; serif is recent","Neither has any historical origin at all"],ans:"Serif is ancient (Roman); sans-serif is comparatively recent (19th-20th century)",exp:"This is the core historical contrast established by the topic's story."},
  {id:"q28",q:"A typeface entirely lacking terminal strokes at the ends of its letters is structurally classified as:",opts:["Sans-serif","Serif","Undefined","Script only"],ans:"Sans-serif",exp:"The absence of terminal strokes (serifs) is the structural definition of sans-serif."},
  {id:"q29",q:"Trajan's Column is significant to this topic because it:",opts:["Contains one of the most referenced early examples of serif letterforms","Was the first sans-serif inscription ever made","Has nothing to do with typography history","Was carved using a digital font"],ans:"Contains one of the most referenced early examples of serif letterforms",exp:"Its inscriptions are a frequently cited historical reference point for the origin of serif letterforms."},
  {id:"q30",q:"Why is it inaccurate to call sans-serif 'the newer, better typeface family' outright?",opts:["Better is subjective and depends on context, not just family age","Sans-serif is actually much older than serif","Serif typefaces no longer exist","There is no such thing as a sans-serif typeface"],ans:"Better is subjective and depends on context, not just family age",exp:"Neither family is inherently 'better' - each suits different contexts, and quality depends on execution, not just family."},
  {id:"q31",q:"Which of the following is a correct, structural (not personality-based) definition check?",opts:["Does the letter have a small stroke at the end of its main strokes?","Does the typeface look expensive?","Is the typeface used on a website?","Is the typeface bold or light?"],ans:"Does the letter have a small stroke at the end of its main strokes?",exp:"This is the precise structural test for serif versus sans-serif - the presence or absence of terminal strokes."},
  {id:"q32",q:"Sans-serif type initially struggled to be accepted for what kind of use?",opts:["Long-form body text, such as books","Bold poster headlines","Advertising signage","Short display text"],ans:"Long-form body text, such as books",exp:"Sans-serif was initially seen as suited to bold display use, and took longer to be accepted for long-form reading text."},
  {id:"q33",q:"What is the relationship between 'serif' as a noun and 'serif typeface' as a term?",opts:["A serif typeface consistently applies the serif stroke feature across its letters","They are entirely unrelated concepts","A serif typeface has no serifs at all","Serif only refers to a font file, not a design feature"],ans:"A serif typeface consistently applies the serif stroke feature across its letters",exp:"A serif typeface is defined by consistently including the serif stroke feature throughout its letterforms."},
  {id:"q34",q:"Which best reflects this topic's caution about labelling typefaces by mood?",opts:["Structure (serif/sans-serif) and mood are related tendencies, not the same thing","Mood and structure are always identical","Only sans-serif typefaces have any mood","Structure has no bearing on mood whatsoever"],ans:"Structure (serif/sans-serif) and mood are related tendencies, not the same thing",exp:"The topic is careful to separate the structural classification from mood, which is a related but distinct, deeper topic."},
  {id:"q35",q:"Approximately what year is associated with Trajan's Column's serif inscriptions?",opts:["113 AD","1927 AD","1450 AD","1800 AD"],ans:"113 AD",exp:"Trajan's Column dates to roughly 113 AD, a key historical reference for serif origins."},
  {id:"q36",q:"Approximately what year is associated with Paul Renner's Futura?",opts:["1927","113 AD","1450","1800"],ans:"1927",exp:"Futura was released in 1927, a landmark moment for sans-serif's modernist legitimacy."},
  {id:"q37",q:"A typeface used heavily in early 19th-century advertising posters was most likely:",opts:["An early sans-serif, chosen for bold visual impact","A serif typeface exclusively","Impossible to typeset at that time","A digital variable font"],ans:"An early sans-serif, chosen for bold visual impact",exp:"Early sans-serif typefaces were prized for their bold, attention-grabbing quality in advertising contexts."},
  {id:"q38",q:"Which statement best summarises this entire topic?",opts:["Serif has small terminal strokes and ancient roots; sans-serif lacks them and has more recent, deliberate roots","Serif and sans-serif are the exact same letterform style","Only sans-serif typefaces are used today","Serifs were invented after sans-serif letterforms"],ans:"Serif has small terminal strokes and ancient roots; sans-serif lacks them and has more recent, deliberate roots",exp:"This captures both the structural definition and the historical origin story central to the topic."},
  {id:"q39",q:"Why does the topic describe sans-serif's 19th-century rise as being for 'bold display' use first?",opts:["Its clean, heavy shapes worked well for attention-grabbing posters before being accepted for body text","It was banned from all other uses","It could only be printed in very large sizes physically","It replaced serif type completely and immediately"],ans:"Its clean, heavy shapes worked well for attention-grabbing posters before being accepted for body text",exp:"Sans-serif's visual boldness suited advertising first; acceptance for smaller, long-form text came later."},
  {id:"q40",q:"Which pairing correctly matches origin to family?",opts:["Roman stone carving -> Serif; 19th-20th century industry/modernism -> Sans-serif","Roman stone carving -> Sans-serif; 19th-20th century -> Serif","Both emerged from the exact same source","Neither has a known historical origin"],ans:"Roman stone carving -> Serif; 19th-20th century industry/modernism -> Sans-serif",exp:"This is the correct historical pairing established throughout the topic's story and concept sections."},
  {id:"q41",q:"A student says 'sans-serif typefaces are always more modern-looking than serif ones'. What is the best response?",opts:["That is a common tendency, but not an absolute structural rule","That statement is entirely correct with no exceptions","Sans-serif typefaces do not exist","Serif typefaces were invented after sans-serif"],ans:"That is a common tendency, but not an absolute structural rule",exp:"Tendencies exist, but structure alone doesn't guarantee mood - many exceptions exist in real typefaces."},
  {id:"q42",q:"What tool is believed to have influenced the shape of early Roman serifs before chiseling began?",opts:["A flat brush","A metal stylus only","A typewriter","A digital tablet"],ans:"A flat brush",exp:"Letters were painted with a flat brush before carving, and the brush's natural flare likely shaped the serif."},
  {id:"q43",q:"Which era is most associated with sans-serif gaining serious design legitimacy, beyond just advertising?",opts:["Early 20th-century modernism (Bauhaus era)","Ancient Rome","The medieval period","The Renaissance"],ans:"Early 20th-century modernism (Bauhaus era)",exp:"Modernist designers of the early 20th century argued for sans-serif as a deliberate, rational design choice."},
  {id:"q44",q:"A typeface historian points to Trajan's Column as evidence for:",opts:["Some of the earliest well-documented serif letterforms","The invention of sans-serif type","The invention of the printing press","Modern digital type design"],ans:"Some of the earliest well-documented serif letterforms",exp:"Trajan's Column is a frequently referenced historical marker for serif letterform origins."},
  {id:"q45",q:"Which is the most accurate structural test to classify an unfamiliar typeface?",opts:["Check whether its letters have small terminal strokes at stroke ends","Check whether it is used on a website or in print","Check whether it looks expensive","Check what year the document was written"],ans:"Check whether its letters have small terminal strokes at stroke ends",exp:"This structural check is the precise, correct way to classify a typeface as serif or sans-serif."},
  {id:"q46",q:"Why might it be misleading to assume a serif typeface is always 'old' or 'outdated'?",opts:["New serif typefaces are still designed today, using the same structural feature with contemporary style","Serif typefaces stopped being designed after Rome fell","All serif typefaces are exactly the same design","Serif typefaces are illegal in modern design"],ans:"New serif typefaces are still designed today, using the same structural feature with contemporary style",exp:"The serif structural feature is timeless and still actively used in newly designed, contemporary typefaces."},
  {id:"q47",q:"What best explains the roughly 1800-year gap between serif's origin and sans-serif's serious emergence?",opts:["Serif traces to ancient Rome; sans-serif wasn't taken seriously as a typeface family until the 1800s","There is no such historical gap","Sans-serif is actually the older family","Both emerged at the same historical moment"],ans:"Serif traces to ancient Rome; sans-serif wasn't taken seriously as a typeface family until the 1800s",exp:"This large historical gap is central to understanding why the two families carry such different associations."},
  {id:"q48",q:"The single biggest idea to take from this topic is:",opts:["Serif has small terminal strokes and ancient roots; sans-serif lacks them and has industrial-modernist roots","There is no real difference between the two families","Sans-serif always outperforms serif in every context","Serifs were a 20th-century invention"],ans:"Serif has small terminal strokes and ancient roots; sans-serif lacks them and has industrial-modernist roots",exp:"This is the structural and historical core the whole topic is built around."},
  {id:"q49",q:"If asked to classify a typeface quickly, what is the fastest reliable check?",opts:["Look for small strokes at the ends of the letters' main strokes","Ask when the typeface file was created","Check if it is used in a logo","Check the typeface's price"],ans:"Look for small strokes at the ends of the letters' main strokes",exp:"This is the direct, structural visual check for serif versus sans-serif classification."},
  {id:"q50",q:"Why does this topic separate 'structure' from 'personality' so explicitly?",opts:["So learners don't wrongly assume a typeface's family alone determines its mood","Because personality does not exist in typography","Because structure is unimportant compared to personality","Because sans-serif has no structure at all"],ans:"So learners don't wrongly assume a typeface's family alone determines its mood",exp:"This separation prevents the common mistake of treating a structural classification as a guaranteed mood indicator."},
];

const CB_TYPE="topic";
const CB_QUESTIONS=[
  {q:"A letter has a small flared stroke at the bottom of its vertical stem. This typeface is:",opts:["Serif","Sans-serif","Undefined","Script only"],ans:"Serif",exp:"That small flared stroke at the stem's end is exactly what defines a serif letterform."},
  {q:"A letter has a perfectly flat, clean stroke end with no added flourish. This typeface is:",opts:["Sans-serif","Serif","Undefined","Impossible to classify"],ans:"Sans-serif",exp:"A clean stroke end with nothing added is exactly the sans-serif structural definition."},
  {q:"Which historical structure directly inspired the shape of early serifs?",opts:["A flat brush's natural flare when painting letter guides before carving","A typewriter key","A digital vector curve tool","A printing press roller pattern"],ans:"A flat brush's natural flare when painting letter guides before carving",exp:"The brush-then-chisel process is the widely cited origin of the serif's flared foot shape."},
  {q:"Which century is most associated with sans-serif's emergence as a serious commercial typeface?",opts:["The 19th century","The 1st century","The 15th century","The 21st century"],ans:"The 19th century",exp:"British foundries began cutting bold sans-serif letterforms for advertising in the 1800s."},
  {q:"Futura (1927) is significant mainly because it:",opts:["Argued sans-serif was a deliberate, rational design choice for a modern age","Was the very first typeface ever designed","Reintroduced serifs into modern design","Was designed for ancient Roman monuments"],ans:"Argued sans-serif was a deliberate, rational design choice for a modern age",exp:"Futura, tied to modernist ideals, helped legitimise sans-serif as an intentional aesthetic, not a shortcut."},
  {q:"Is 'all serif typefaces are formal' an accurate, absolute rule?",opts:["No - it is a common tendency, but not an absolute rule","Yes, always true without exception","No, the opposite is always true","Formality does not apply to typefaces"],ans:"No - it is a common tendency, but not an absolute rule",exp:"Structure (serif/sans-serif) doesn't automatically fix mood - tendencies exist, but exceptions are common."},
  {q:"Trajan's Column, from around 113 AD, is most relevant to this topic as:",opts:["An early, widely referenced example of serif letterforms","The first known sans-serif typeface","Unrelated to typography entirely","A 20th-century modernist design"],ans:"An early, widely referenced example of serif letterforms",exp:"Its carved inscriptions are a classic historical reference point for the origin of serifs."},
  {q:"Sans-serif type was initially seen as most suited to:",opts:["Bold display and advertising use","Long-form novel body text","Legal documents exclusively","Ancient inscriptions"],ans:"Bold display and advertising use",exp:"Its bold, clean shapes made an early impact in advertising before being accepted for long-form reading."},
  {q:"Which best defines a serif structurally?",opts:["A small stroke attached to the end of a larger letter stroke","Any typeface used in books","Any bold typeface","A typeface with rounded corners"],ans:"A small stroke attached to the end of a larger letter stroke",exp:"This is the precise structural definition of a serif, independent of mood or use case."},
  {q:"Which best defines sans-serif structurally?",opts:["A typeface lacking small terminal strokes at the ends of letters","A typeface used only in advertising","A typeface with no lowercase letters","A typeface invented in ancient Rome"],ans:"A typeface lacking small terminal strokes at the ends of letters",exp:"This is the precise structural definition - the absence of the serif feature."},
  {q:"Why is 'sans-serif equals modern, serif equals old' considered an oversimplification?",opts:["Both families are still actively designed and used today in varied contexts","Sans-serif is actually the older family","Serif typefaces stopped being made after 1900","There is no such tendency at all"],ans:"Both families are still actively designed and used today in varied contexts",exp:"Both structural families continue to be designed and applied across contemporary and traditional contexts alike."},
  {q:"The Bauhaus's interest in sans-serif connects most closely to which idea?",opts:["Rational, ornament-free design suited to an industrial age","Recreating exact Roman inscriptional letterforms","Rejecting all typography as a discipline","Avoiding printed text altogether"],ans:"Rational, ornament-free design suited to an industrial age",exp:"Bauhaus modernists valued stripped-down rationality, which sans-serif embodied structurally."},
  {q:"A typeface historian describes a design as having 'flared terminal strokes with variable thickness'. This is most likely describing:",opts:["A serif typeface","A sans-serif typeface","Neither, this describes typesetting spacing","A digital-only typeface format"],ans:"A serif typeface",exp:"Flared terminal strokes are a hallmark structural feature of serif letterforms."},
  {q:"Which statement correctly separates structure from mood?",opts:["Serif/sans-serif is a structural fact; formal/casual is a related but separate tendency","Structure and mood are the exact same thing","Mood determines structure, not the other way around","Neither concept applies to real typefaces"],ans:"Serif/sans-serif is a structural fact; formal/casual is a related but separate tendency",exp:"This topic deliberately separates the objective structural classification from the more subjective mood discussion."},
  {q:"Roughly how many centuries passed between the Roman serif tradition and sans-serif's serious 19th-century emergence?",opts:["Around eighteen centuries","Around two centuries","Around one century","No time passed, they emerged together"],ans:"Around eighteen centuries",exp:"From roughly 113 AD to the 1800s is about eighteen centuries - a vast historical gap between the two origins."},
];

const BRAND_BANK=[
  {name:"The New York Times masthead",hint:"Its nameplate uses ornate, traditional letterforms with visible small strokes at stroke ends",ans:"a serif typeface, signalling journalistic tradition and heritage",exp:"The Times masthead uses a serif design, leaning into a sense of tradition, authority, and print heritage befitting a long-established newspaper.",opts:["A serif typeface, signalling journalistic tradition and heritage","A sans-serif typeface, signalling modern minimalism","No typeface at all, only an image","A script typeface with no structure"]},
  {name:"Google's wordmark and product interfaces",hint:"Clean letterforms with no visible small strokes at stroke ends",ans:"a sans-serif typeface, signalling clean, modern simplicity",exp:"Google's branding relies on sans-serif letterforms, aligning with a clean, modern, digital-first identity across its products.",opts:["A sans-serif typeface, signalling clean, modern simplicity","A serif typeface, signalling old-world tradition","A typeface with no defined structure","An entirely image-based logo with no letterforms"]},
  {name:"Cartier and other heritage luxury jewellers",hint:"Wordmarks with delicate small strokes finishing each letter",ans:"a serif typeface, reinforcing heritage and craftsmanship",exp:"Many heritage luxury brands lean on serif letterforms, using the family's long historical association with tradition and craftsmanship.",opts:["A serif typeface, reinforcing heritage and craftsmanship","A sans-serif typeface, reinforcing pure minimalism","A typeface with no serifs or structure at all","A typeface invented specifically for this brand with no family"]},
  {name:"A 19th-century circus or 'WANTED' poster",hint:"Bold, heavy letters with no small terminal strokes, built to be seen from a distance",ans:"an early sans-serif or slab display typeface, built for bold visual impact",exp:"These posters relied on the bold, attention-grabbing sans-serif and slab styles that emerged in the 1800s specifically for advertising impact.",opts:["An early sans-serif or slab display typeface, built for bold visual impact","A delicate, traditional serif body-text typeface","A typeface with no historical basis","A digital-only modern typeface"]},
  {name:"A university's official seal and formal documents",hint:"Traditional letterforms with visible small strokes, echoing centuries of academic print",ans:"a serif typeface, echoing academic and institutional tradition",exp:"Formal academic institutions frequently use serif type for official documents, drawing on the family's long association with tradition and authority.",opts:["A serif typeface, echoing academic and institutional tradition","A sans-serif typeface, echoing startup culture","A typeface invented in the 21st century with no history","A purely decorative typeface with no letterform structure"]},
];

const TAKEAWAY_QUOTE="A serif is a small stroke with a two-thousand-year history. Its absence is a two-hundred-year-old idea. Neither is better - they are simply two different answers to the same question.";
const TAKEAWAY_POINTS=[
  {t:"Learn the one-second test",b:"Look at where a letter's strokes end - a small added foot means serif, a clean plain end means sans-serif. That is the whole structural check."},
  {t:"Separate structure from assumption",b:"Before assuming a typeface is 'formal' or 'modern' just from its family, remember: that is a tendency worth questioning, not a guaranteed rule."},
  {t:"Notice both families everywhere",b:"Newspapers, logos, signage, apps - once you know the test, you will start spotting serif and sans-serif choices everywhere, and asking why each was chosen."},
];

const SOURCES=[
  "Robert Bringhurst - The Elements of Typographic Style (1992). Historical and structural type classification.",
  "Jan Tschichold (1928). Early modernist writing on typeface form and function.",
];

export default function T03SerifVsSansSerifLesson(){
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
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 0"}}>One small stroke, present or absent, splits the entire history of Western type in two.</p>
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
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.6,margin:"0 0 12px"}}>What typeface family and signal does this example show?</p>
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
              <div style={{fontWeight:700,color:T.white,fontSize:15,marginBottom:6}}>Topic 03 Complete.</div>
              <div style={{fontSize:13.5,color:T.muted,lineHeight:1.6}}>Topic 04 - Type Scale and Hierarchy: how size creates order and tells a reader what to look at first.</div>
            </div>
            <Nav onBack={function(){go(4);}} onNext={function(){go(1);}} nextLabel="Restart Lesson"/>
          </div>
        )}

      </div>
    </div>
  );
}
