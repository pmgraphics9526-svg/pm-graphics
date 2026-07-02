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

const LESSON_MODULE="TYPOGRAPHY - TOPIC 04";
const LESSON_TITLE="Type Scale and Hierarchy";
const LESSON_SUBTITLE="Pierre Simon Fournier 1737 - Robert Bringhurst 1992";

const STORY_PARA_1="Before 1737, if you asked two different French type foundries for 'Pica' size type, you might get two different physical sizes back. Type sizes had names, not measurements - Pica, Long Primer, Brevier, Bourgeois - and every foundry cast them slightly differently. There was no shared scale, only local habit.";
const STORY_PARA_2="The type founder Pierre Simon Fournier changed that in 1737. He introduced a point system - a precise, mathematical scale for measuring type size - so that a given size meant the exact same physical measurement no matter who cast it. For the first time, type size became a system you could plan with, not a guess based on which foundry you bought from.";
const STORY_PARA_3="That same instinct - a small, deliberate set of sizes, chosen in advance and reused consistently - is exactly what modern typographic hierarchy is built on. Robert Bringhurst later framed it plainly: a good page does not use random sizes wherever something feels 'important'. It uses a limited scale of sizes, applied consistently, so a reader can tell what matters within a second of looking, without reading a single word.";
const STORY_PROBLEM="You have opened a document where the heading, a sub-point, and the body text were all nearly the same size, and you had to actually read sentences just to figure out what was the title and what was a detail. Nothing was wrong grammatically - but your eyes had no scale to rely on, so they had to work far harder than they should have.";
const STORY_5Q=[
  {q:"What is it?",a:"Type scale is a small, deliberately chosen set of sizes (not random ones) used consistently across a page. Hierarchy is the order those size differences create - what a reader notices first, second, and last."},
  {q:"Why does it exist?",a:"Because without a planned scale, sizes end up arbitrary, and readers lose the instant visual cues that tell them what matters most on a page."},
  {q:"How does it work?",a:"A small number of fixed sizes - for a heading, a subheading, body text, and captions - are picked once, then applied consistently everywhere those roles repeat."},
  {q:"How will you use it?",a:"Whenever you set a heading and body text together, you are choosing (deliberately or by accident) a scale that creates or destroys hierarchy."},
  {q:"What if you skip it?",a:"Every piece of text competes for attention equally, forcing the reader to read everything just to figure out what is actually most important."},
];

const CONCEPT_SECTIONS=[
  {tag:"SCALE = A SMALL SET OF SIZES, CHOSEN ON PURPOSE",content:"A type scale is not 'pick whatever size looks fine right now'. It is a small, fixed list of sizes - for example, a size for headings, one for subheadings, one for body text, one for captions - decided in advance and reused every time that role appears.",rule:"Four or five deliberate sizes, reused consistently, beat forty random ones."},
  {tag:"HIERARCHY = WHAT SIZE TELLS THE READER FIRST",content:"Readers scan before they read. Larger text is instinctively read as more important and is noticed first; smaller text is read as secondary and is checked later, if needed at all. Consistent size relationships let a reader understand a page's structure before reading a single word.",rule:"The eye finds the largest thing first - so give your most important message the size that matches its importance."},
  {tag:"STEPS, NOT RANDOM JUMPS",content:"Well-built scales usually move between sizes in a consistent, repeatable way - each step growing or shrinking by roughly the same relationship - rather than jumping unpredictably (say, 14px straight to 41px with nothing between). This is why a good scale feels calm and logical rather than chaotic.",rule:"Consistent steps make a hierarchy feel intentional, not accidental."},
];

const QUESTION_BANK=[
  {id:"q1",q:"What is a type scale?",opts:["A small, deliberately chosen set of sizes used consistently","Any random collection of font sizes used at will","A single font file","A measurement of line spacing"],ans:"A small, deliberately chosen set of sizes used consistently",exp:"A type scale is a fixed, limited set of sizes decided in advance and reused for consistent roles like headings and body text."},
  {id:"q2",q:"What does hierarchy refer to in typography?",opts:["The order in which a reader notices and processes different pieces of text","The alphabetical order of headings","A company's internal management structure","The printing press used"],ans:"The order in which a reader notices and processes different pieces of text",exp:"Hierarchy is about visual order - what a reader sees and understands as most to least important."},
  {id:"q3",q:"Before 1737, what problem existed with named type sizes like Pica or Brevier?",opts:["Different foundries cast them at different actual physical sizes","They were illegal to use together","They only existed in one language","They were always identical everywhere"],ans:"Different foundries cast them at different actual physical sizes",exp:"Named sizes had no shared standard - the same name could mean different physical measurements at different foundries."},
  {id:"q4",q:"Who introduced a mathematical point system for type size in 1737?",opts:["Pierre Simon Fournier","Robert Bringhurst","Johannes Gutenberg","Paul Renner"],ans:"Pierre Simon Fournier",exp:"Fournier's 1737 point system gave type sizes a precise, shared mathematical measurement for the first time."},
  {id:"q5",q:"What did Fournier's point system solve?",opts:["Inconsistent, foundry-dependent type sizing","The invention of the printing press","The difference between serif and sans-serif","Line spacing standards"],ans:"Inconsistent, foundry-dependent type sizing",exp:"It replaced vague named sizes with a shared, precise measurement system anyone could rely on."},
  {id:"q6",q:"According to Bringhurst, how should sizes be chosen for a well-built page?",opts:["As a limited, consistent scale, not randomly wherever something feels important","Randomly, based on mood","Always identical for every piece of text","Based only on the printer's default settings"],ans:"As a limited, consistent scale, not randomly wherever something feels important",exp:"Bringhurst frames deliberate, limited, consistently-applied scale as the foundation of good hierarchy."},
  {id:"q7",q:"What happens when a heading, subheading, and body text are all nearly the same size?",opts:["Readers must read content just to figure out what matters most","Readers instantly understand the hierarchy","The page automatically becomes more legible","Nothing changes for the reader at all"],ans:"Readers must read content just to figure out what matters most",exp:"Without a size difference, the visual shortcut to importance disappears, forcing readers to work harder."},
  {id:"q8",q:"What is the main purpose of using a small, fixed number of sizes rather than many random ones?",opts:["Consistency, so readers can rely on size to judge importance across the whole page","To save printing costs","To make text harder to read on purpose","To reduce the number of words needed"],ans:"Consistency, so readers can rely on size to judge importance across the whole page",exp:"A limited, repeated scale means readers can trust that a given size always signals the same level of importance."},
  {id:"q9",q:"Which best reflects how readers typically process a page before reading any words?",opts:["They scan for size differences to judge what matters first","They read every word in strict top-to-bottom order regardless of size","They ignore size completely","They only notice colour, never size"],ans:"They scan for size differences to judge what matters first",exp:"Readers scan visually before reading - size is one of the fastest cues for judging importance."},
  {id:"q10",q:"A page using forty different, unrelated font sizes with no pattern would most likely feel:",opts:["Chaotic and hard to scan","Extremely clear and organised","Identical to a well-scaled page","Impossible to physically print"],ans:"Chaotic and hard to scan",exp:"Without a consistent, limited scale, the eye has no reliable pattern to use for finding what's important."},
  {id:"q11",q:"What is typically included in a basic type scale for a document or webpage?",opts:["Sizes for headings, subheadings, body text, and captions","Only one universal size for everything","Only colours, no sizes","A list of unrelated font families"],ans:"Sizes for headings, subheadings, body text, and captions",exp:"A basic scale usually assigns distinct, consistent sizes to each recurring role on a page."},
  {id:"q12",q:"Why does this topic describe scale steps as ideally 'consistent' rather than random jumps?",opts:["Consistent steps feel intentional and logical, not chaotic","Consistent steps are required by law","Random jumps always look better","There is no difference between the two approaches"],ans:"Consistent steps feel intentional and logical, not chaotic",exp:"A logical progression between sizes reinforces a sense of deliberate design, rather than accidental sizing."},
  {id:"q13",q:"If the largest text on a page is a minor footnote and the smallest text is the main headline, what would likely happen?",opts:["Readers would misjudge what is actually most important","Readers would automatically understand it correctly regardless","Nothing would change about how it reads","The page would be considered perfectly hierarchical"],ans:"Readers would misjudge what is actually most important",exp:"Size signals importance - reversing that relationship confuses readers about what truly matters."},
  {id:"q14",q:"What historical problem is directly comparable to inconsistent type sizes on a modern page with no scale?",opts:["Pre-1737 type sizes varying unpredictably between foundries","The invention of sans-serif type","The debate between print and digital typography","The invention of movable type itself"],ans:"Pre-1737 type sizes varying unpredictably between foundries",exp:"Both situations share the same core problem: no shared, reliable system for size, causing confusion."},
  {id:"q15",q:"Which best defines 'hierarchy' as used in this topic?",opts:["The visual order of importance created through size relationships","A ranking of typefaces by popularity","The order fonts were invented in history","A grading system for paper quality"],ans:"The visual order of importance created through size relationships",exp:"This topic's hierarchy refers specifically to size-driven visual importance, not any other kind of ranking."},
  {id:"q16",q:"Fournier's point system is significant to this topic because it demonstrates:",opts:["An early example of imposing deliberate, consistent structure on type sizing","The invention of the first typeface ever","The origin of serif letterforms","A method for choosing type colour"],ans:"An early example of imposing deliberate, consistent structure on type sizing",exp:"It's a direct historical precedent for the core idea of this topic - deliberate, consistent, shared sizing systems."},
  {id:"q17",q:"A well-scaled page lets a reader identify the main heading:",opts:["Within a second, without reading any words","Only after reading the entire page","Never, regardless of design","Only if colour is also used"],ans:"Within a second, without reading any words",exp:"That near-instant recognition through size alone is the practical goal of a well-built hierarchy."},
  {id:"q18",q:"Why does this topic avoid detailed discussion of letter spacing or line spacing?",opts:["Those are covered in a separate, dedicated topic later in this module","Spacing has no relationship to typography at all","This topic already covers spacing in full detail","Spacing only matters in print, not on screens"],ans:"Those are covered in a separate, dedicated topic later in this module",exp:"This topic stays scoped to size-based scale and hierarchy; spacing specifics belong to their own topic."},
  {id:"q19",q:"Which is the best one-line description of a type scale?",opts:["A small, deliberately chosen, consistently reused set of sizes","Any single font size used everywhere","A method for pairing two typefaces","A tool for choosing colour combinations"],ans:"A small, deliberately chosen, consistently reused set of sizes",exp:"This captures the core definition established across the topic's story and concept sections."},
  {id:"q20",q:"If a designer assigns the exact same size to a page's title and its footnotes, what is the likely result?",opts:["A confused or flattened hierarchy, since size no longer signals importance","A perfectly clear hierarchy every time","No effect on the reader's experience","An automatically improved reading experience"],ans:"A confused or flattened hierarchy, since size no longer signals importance",exp:"Equal sizes remove the size-based cue readers rely on to judge relative importance."},
  {id:"q21",q:"What was type sizing based on before Fournier's point system existed?",opts:["Named sizes that varied by foundry, with no shared standard","A single universal digital standard","Colour-coded systems","Modern pixel measurements"],ans:"Named sizes that varied by foundry, with no shared standard",exp:"Names like Pica or Brevier existed, but without a shared numeric standard behind them."},
  {id:"q22",q:"Which best explains why a limited scale (say, 4-5 sizes) is usually preferred over dozens of unique sizes?",opts:["It keeps size meaningful and readable as a consistent signal of importance","It makes a page print faster","It is required by international law","It has no real benefit over unlimited sizes"],ans:"It keeps size meaningful and readable as a consistent signal of importance",exp:"When too many sizes exist, size stops reliably signalling importance, weakening hierarchy overall."},
  {id:"q23",q:"A recipe card where the dish title, ingredient list, and instructions are all the same size demonstrates:",opts:["A missing or weak hierarchy","A textbook example of good hierarchy","An intentional design choice with no downsides","Something unrelated to type scale"],ans:"A missing or weak hierarchy",exp:"Without size differences marking role importance, the reader has no visual shortcut for navigating the card."},
  {id:"q24",q:"Robert Bringhurst's contribution to this topic was mainly to:",opts:["Frame deliberate, consistent scale as the foundation of readable hierarchy","Invent the first type scale in history","Design the first sans-serif typeface","Create the modern point measurement system"],ans:"Frame deliberate, consistent scale as the foundation of readable hierarchy",exp:"Bringhurst articulated why a limited, consistent scale matters for building clear, readable hierarchy."},
  {id:"q25",q:"Which of these is an example of applying scale consistently?",opts:["Using the same size for every H2 subheading throughout a document","Using a different random size for each subheading","Using the largest available size for every word","Avoiding headings altogether"],ans:"Using the same size for every H2 subheading throughout a document",exp:"Consistency - reusing the same size for the same role every time - is exactly what makes a scale functional."},
  {id:"q26",q:"Why might mixing many unrelated sizes on one page undermine trust in the design?",opts:["It signals no clear plan, making the hierarchy feel accidental rather than intentional","Unrelated sizes always look more premium","Readers cannot see more than two sizes at once physically","It has no effect on how professional a page appears"],ans:"It signals no clear plan, making the hierarchy feel accidental rather than intentional",exp:"Unplanned size variation reads as chaotic, undermining the sense of deliberate, trustworthy design."},
  {id:"q27",q:"What does 'scanning' mean in the context of how readers process a page?",opts:["Quickly looking over a page's visual structure before reading in detail","Photocopying a page","Reading every single word slowly from top to bottom","Ignoring the page entirely"],ans:"Quickly looking over a page's visual structure before reading in detail",exp:"Scanning is the fast, size-driven first pass readers make before committing to detailed reading."},
  {id:"q28",q:"A magazine headline set noticeably larger than its byline and body text demonstrates:",opts:["A deliberate size-based hierarchy guiding the reader's attention","A printing mistake","An accidental oversight with no purpose","A violation of typographic principles"],ans:"A deliberate size-based hierarchy guiding the reader's attention",exp:"This is a textbook, intentional use of scale to establish what the reader should notice first."},
  {id:"q29",q:"Which statement best reflects the relationship between Fournier's point system and modern type scale?",opts:["Both represent imposing a deliberate, consistent structure on type sizing decisions","They are unrelated historical accidents","Fournier's system replaced the need for scale entirely","Modern type scale predates Fournier's system"],ans:"Both represent imposing a deliberate, consistent structure on type sizing decisions",exp:"The throughline from Fournier to modern scale is the same instinct: replace arbitrary sizing with a deliberate system."},
  {id:"q30",q:"Why is 'hierarchy' considered a reader-facing concept rather than just a designer's technical detail?",opts:["It directly shapes what a reader notices, trusts, and understands as important","It only matters to printers, never to readers","Readers never notice size differences","Hierarchy has no effect on comprehension"],ans:"It directly shapes what a reader notices, trusts, and understands as important",exp:"Hierarchy exists specifically to guide the reader's attention and understanding, making it inherently reader-facing."},
  {id:"q31",q:"A well-designed type scale for a website commonly includes distinct sizes for:",opts:["H1, H2, body text, and captions at minimum","Every individual word on the page uniquely","Only images, never text","A single size shared by all elements"],ans:"H1, H2, body text, and captions at minimum",exp:"A functional scale typically covers the core recurring text roles found across a typical page."},
  {id:"q32",q:"If two documents use the exact same scale consistently, what should a reader experience moving between them?",opts:["A similar, learnable sense of what each size level means","Total confusion regardless of consistency","No noticeable pattern at all","An identical document with no differences"],ans:"A similar, learnable sense of what each size level means",exp:"Consistent scale use builds a reliable pattern readers can learn and apply across similar documents."},
  {id:"q33",q:"Which best explains why named sizes like 'Pica' failed to create true consistency before 1737?",opts:["They had no shared numeric standard behind the name across foundries","They were too large to be useful","They only existed for headlines","They were digital-only measurements"],ans:"They had no shared numeric standard behind the name across foundries",exp:"A name alone (without a shared measurement standard) could not guarantee consistent physical size."},
  {id:"q34",q:"A poorly built hierarchy where every heading level looks nearly identical in size would most likely cause:",opts:["Readers struggling to tell major and minor sections apart","Perfectly clear navigation for readers","Faster reading speed overall","No noticeable effect on comprehension"],ans:"Readers struggling to tell major and minor sections apart",exp:"Without meaningful size differences between heading levels, structural navigation becomes difficult."},
  {id:"q35",q:"The core idea linking Fournier's 1737 point system to this entire topic is:",opts:["Replacing inconsistent, arbitrary sizing with a deliberate, reliable system","Inventing the first typeface","Creating the first printing press","Designing the first sans-serif letterform"],ans:"Replacing inconsistent, arbitrary sizing with a deliberate, reliable system",exp:"This shared instinct - deliberate structure over guesswork - is the thread connecting history to modern scale practice."},
  {id:"q36",q:"Which best completes: 'Size tells a reader ___ before they read a single word.'",opts:["What is likely most important","What language the text is in","Who wrote the text","How old the document is"],ans:"What is likely most important",exp:"Size is one of the fastest, most immediate visual cues for signalling importance to a reader."},
  {id:"q37",q:"A style guide that lists exact sizes for 'Heading 1', 'Heading 2', and 'Body' is defining:",opts:["A type scale","A colour palette","A typeface license","A printing schedule"],ans:"A type scale",exp:"This is exactly what a type scale is - a defined, reusable set of sizes tied to specific roles."},
  {id:"q38",q:"Why is a 'limited' scale (few sizes) generally more effective than an 'unlimited' one (many random sizes)?",opts:["Limited options keep each size meaningful as a distinct signal of importance","Limited options are always cheaper to print","Unlimited options are illegal in most countries","There is no real difference in effectiveness"],ans:"Limited options keep each size meaningful as a distinct signal of importance",exp:"Too many sizes dilute the signal - a limited set keeps each size distinctly recognisable and meaningful."},
  {id:"q39",q:"Which of these best represents 'hierarchy failure' due to scale?",opts:["A form where required fields and optional notes appear in identical sizes","A poster with a giant headline and small footer text","A book with larger chapter titles than body text","A website with a clearly larger logo than body copy"],ans:"A form where required fields and optional notes appear in identical sizes",exp:"Equal sizing between meaningfully different content types is a classic hierarchy failure."},
  {id:"q40",q:"What is the relationship between scale and hierarchy, as taught in this topic?",opts:["Scale is the tool (the sizes); hierarchy is the outcome (the order of importance it creates)","They are identical, interchangeable terms with no distinction","Hierarchy causes scale to exist, not the other way around","Neither concept is related to typography"],ans:"Scale is the tool (the sizes); hierarchy is the outcome (the order of importance it creates)",exp:"This is the precise relationship established throughout the topic - scale is the mechanism, hierarchy is the result."},
  {id:"q41",q:"A designer picks sizes for headings and body text completely at random for each new page. What is the likely long-term problem?",opts:["Inconsistent hierarchy across pages, confusing repeat readers","Perfectly consistent hierarchy across all pages","No effect, since readers never notice pattern changes","Faster production with better results"],ans:"Inconsistent hierarchy across pages, confusing repeat readers",exp:"Without a reused, defined scale, hierarchy becomes unreliable from page to page."},
  {id:"q42",q:"Why does this topic use the Fournier point-system story instead of a purely modern web design example?",opts:["It shows the core idea - deliberate, shared, consistent scale - existed long before digital design","Digital design examples do not exist","Print history is unrelated to modern typography","Fournier invented modern web design"],ans:"It shows the core idea - deliberate, shared, consistent scale - existed long before digital design",exp:"The historical example demonstrates that this is a foundational typographic principle, not just a modern trend."},
  {id:"q43",q:"Which best reflects a 'reader-first' justification for using scale and hierarchy?",opts:["It reduces the mental effort a reader needs to find what matters","It makes documents look more expensive to print","It increases the total word count of a document","It has no connection to how readers actually experience a page"],ans:"It reduces the mental effort a reader needs to find what matters",exp:"The entire purpose of scale-driven hierarchy is to reduce a reader's effort in finding what's important."},
  {id:"q44",q:"If every size on a page differs only slightly and randomly from the next, hierarchy will likely feel:",opts:["Weak or unclear, since no size clearly stands out as more important","Extremely strong and clear","Identical to a well-planned scale","Impossible to perceive at all"],ans:"Weak or unclear, since no size clearly stands out as more important",exp:"Subtle, inconsistent variation fails to create the clear size contrast hierarchy depends on."},
  {id:"q45",q:"The single biggest idea to take from this topic is:",opts:["A small, deliberate, consistently applied scale of sizes is what creates clear reader hierarchy","Bigger text is always better regardless of context","Type scale was invented in the digital era","Hierarchy has nothing to do with size"],ans:"A small, deliberate, consistently applied scale of sizes is what creates clear reader hierarchy",exp:"This is the core thread connecting the historical story to the practical concept of the topic."},
  {id:"q46",q:"Which best distinguishes 'scale' from simply 'using different sizes'?",opts:["Scale is planned and consistently reused; random sizing is not","They are exactly the same thing","Scale means using only one size ever","Random sizing always creates better hierarchy"],ans:"Scale is planned and consistently reused; random sizing is not",exp:"The deliberate, repeated nature of scale is what separates it from unplanned, inconsistent sizing."},
  {id:"q47",q:"A reader glancing at a webpage for two seconds should be able to identify:",opts:["Roughly what the page considers most important, through size alone","The entire content of the page in full detail","The exact font file used","The printing press used to produce it"],ans:"Roughly what the page considers most important, through size alone",exp:"This fast, size-driven judgment is the practical test of whether a hierarchy is working."},
  {id:"q48",q:"Why does consistent scale application matter across an entire document, not just one page?",opts:["Readers build an expectation of what each size means, which breaks if it's inconsistent","Consistency only matters for the first page","Later pages do not need any hierarchy at all","Scale naturally resets on every new page automatically"],ans:"Readers build an expectation of what each size means, which breaks if it's inconsistent",exp:"Once a reader learns your scale's pattern, breaking it undermines the trust and clarity it built."},
  {id:"q49",q:"A design system documenting 'H1: 32px, H2: 24px, Body: 16px, Caption: 12px' is an example of:",opts:["A defined type scale","A colour system","A licensing agreement","A typeface pairing guide"],ans:"A defined type scale",exp:"This is a textbook example of a documented, deliberate type scale with clear, consistent roles."},
  {id:"q50",q:"What ties Fournier's 1737 point system directly to Bringhurst's later writing on scale?",opts:["Both argue for deliberate, consistent structure over arbitrary sizing decisions","Both invented the same typeface","Both focused only on serif letterforms","Neither has any connection to type sizing"],ans:"Both argue for deliberate, consistent structure over arbitrary sizing decisions",exp:"Centuries apart, both reflect the same underlying principle central to this topic: structure over guesswork."},
];

const CB_TYPE="topic";
const CB_QUESTIONS=[
  {q:"A form has 'Full Name' and a small disclaimer note in the exact same size. What hierarchy problem does this show?",opts:["No size-based distinction between a required field and a minor note","A perfectly clear hierarchy","An intentional design strength","An issue unrelated to type scale"],ans:"No size-based distinction between a required field and a minor note",exp:"Equal sizing removes the visual cue that would normally separate primary content from secondary notes."},
  {q:"Before 1737, ordering 'Pica' type from two different foundries could result in:",opts:["Two physically different sizes, due to no shared standard","Identical sizes always, since names were standardised","An illegal transaction","No type being produced at all"],ans:"Two physically different sizes, due to no shared standard",exp:"Named sizes varied by foundry until Fournier's point system created a shared numeric standard."},
  {q:"A website uses one consistent size for every H2 across all its pages. This demonstrates:",opts:["Consistent application of a type scale","A missing type scale","An accidental design flaw","A colour system, not a type scale"],ans:"Consistent application of a type scale",exp:"Reusing the same size for the same role across pages is exactly how a functional scale should work."},
  {q:"Why does a limited set of sizes (rather than dozens) usually create clearer hierarchy?",opts:["Each size stays a meaningful, recognisable signal of importance","More sizes always create clearer hierarchy","Limited sizes are required by design software","There is no actual difference"],ans:"Each size stays a meaningful, recognisable signal of importance",exp:"Too many sizes dilute the signal; a limited, consistent set keeps each size distinctly meaningful."},
  {q:"Fournier's point system is best described as:",opts:["A precise, shared measurement standard for type size","The invention of the first typeface","A method for pairing typefaces together","A tool for choosing type colour"],ans:"A precise, shared measurement standard for type size",exp:"It replaced inconsistent, foundry-specific naming with a mathematical, shareable sizing standard."},
  {q:"A magazine article where the headline, subheading, and byline are all clearly different, deliberate sizes shows:",opts:["A working type scale creating clear hierarchy","A hierarchy failure","An accidental size mismatch","An unrelated design choice"],ans:"A working type scale creating clear hierarchy",exp:"Distinct, deliberate size differences for each role is exactly what a functioning scale looks like in practice."},
  {q:"Which best explains why readers 'scan' a page before reading it in detail?",opts:["They use visual cues like size to judge what to focus on first","They always read every word from the very first pass","Scanning has no relationship to typography","Readers ignore all visual structure entirely"],ans:"They use visual cues like size to judge what to focus on first",exp:"Scanning relies heavily on size and structure to quickly triage what deserves closer reading."},
  {q:"A style guide listing exact pixel sizes for H1 through Body text is documenting:",opts:["A type scale","A licensing agreement","A colour palette","A font pairing strategy"],ans:"A type scale",exp:"This is a direct, practical example of a defined, reusable type scale."},
  {q:"If a heading is smaller than the body text surrounding it, what is the likely reader confusion?",opts:["The reader may not recognise it as a heading at all","The reader will always understand it perfectly regardless","No confusion is possible in this scenario","Hierarchy is unaffected by this reversal"],ans:"The reader may not recognise it as a heading at all",exp:"Reversing expected size relationships breaks the visual cue readers rely on to identify headings."},
  {q:"Which best reflects the throughline from Fournier (1737) to modern type scale practice?",opts:["Deliberate, consistent structure replacing arbitrary, inconsistent sizing","Print type is completely unrelated to modern screens","Fournier's ideas were abandoned entirely by modern designers","Modern scale predates Fournier's system"],ans:"Deliberate, consistent structure replacing arbitrary, inconsistent sizing",exp:"Both reflect the same underlying principle central to this topic across centuries."},
  {q:"A recipe card with identical font sizes for the dish title and the ingredient list demonstrates:",opts:["Weak hierarchy due to lack of size differentiation","Strong, clear hierarchy","An intentional, effective design choice","No relevance to type scale at all"],ans:"Weak hierarchy due to lack of size differentiation",exp:"Without size contrast, the reader has no quick visual way to separate the title from the ingredient details."},
  {q:"Why might a reader trust a document that uses scale consistently across multiple pages?",opts:["They learn what each size level means and can rely on that pattern","Consistency has no effect on reader trust","Readers never notice repeated patterns","Trust depends only on the words used, never on size"],ans:"They learn what each size level means and can rely on that pattern",exp:"Predictable, consistent scale use builds a learnable pattern that readers come to trust and rely on."},
  {q:"A poster with a massive headline and tiny, barely visible event details is an example of:",opts:["Hierarchy prioritising the headline over the details, for better or worse","Perfectly balanced hierarchy with no issues","A scale with no defined roles at all","An approach unrelated to type scale"],ans:"Hierarchy prioritising the headline over the details, for better or worse",exp:"This shows scale actively shaping what a viewer notices first - even if the balance itself may be worth reconsidering."},
  {q:"Which best explains why Bringhurst is referenced in this topic rather than only Fournier?",opts:["Bringhurst articulates the modern design principle building on that same historical instinct","Bringhurst invented the point system himself","Fournier and Bringhurst worked in the same century","Bringhurst rejected the idea of type scale entirely"],ans:"Bringhurst articulates the modern design principle building on that same historical instinct",exp:"Bringhurst connects the old historical precedent to a clear, modern framing of scale-driven hierarchy."},
  {q:"A design system defining only two sizes, 'Heading' and 'Body', for an entire complex website would likely:",opts:["Struggle to represent finer levels of hierarchy, like subheadings","Always be sufficient for any complexity of content","Automatically create perfect hierarchy regardless of content","Have no relationship to hierarchy at all"],ans:"Struggle to represent finer levels of hierarchy, like subheadings",exp:"Very limited scales can undershoot what's needed once content complexity requires more distinct levels of importance."},
];

const BRAND_BANK=[
  {name:"Medium (the publishing platform)",hint:"Article pages use a clear, limited set of sizes for title, subtitle, and body text",ans:"a consistent, limited type scale applied across every article",exp:"Medium applies the same defined scale - title, subtitle, body - consistently across every article, so readers instantly recognise structure regardless of topic.",opts:["A consistent, limited type scale applied across every article","A different random size on every single article","No type scale at all, only images","Identical size for every element on the page"]},
  {name:"Apple's product pages",hint:"Large, bold headlines drop sharply in size to smaller supporting copy",ans:"a strong size contrast to create clear, confident hierarchy",exp:"Apple uses a deliberately strong jump between headline and supporting text sizes, making the hierarchy of what to look at first extremely clear.",opts:["A strong size contrast to create clear, confident hierarchy","Identical sizes for headlines and supporting text","A random, inconsistent scale from page to page","No headlines used anywhere on the site"]},
  {name:"A government tax form with dense, uniformly-sized text",hint:"Required fields and optional notes are printed at nearly the same size",ans:"a weak or missing hierarchy, making the form hard to navigate",exp:"Without meaningful size differences, users struggle to tell required fields apart from optional guidance - a common real-world hierarchy failure.",opts:["A weak or missing hierarchy, making the form hard to navigate","A perfectly clear, well-scaled hierarchy","An intentional accessibility feature","A form with no text at all"]},
  {name:"A classic printed novel's chapter openings",hint:"Chapter numbers and titles are set noticeably larger than the body text that follows",ans:"a simple, effective scale marking the start of a new section",exp:"The size jump between a chapter heading and body text is a centuries-old, reliable use of scale to mark structural transitions for readers.",opts:["A simple, effective scale marking the start of a new section","No relationship between chapter titles and body text sizing","An accidental typesetting error","Identical sizing throughout the whole book"]},
  {name:"A cluttered flyer with ten different unrelated font sizes",hint:"Every line of text appears to use a different, seemingly random size",ans:"a broken scale, making it hard to tell what is actually most important",exp:"With no consistent, limited scale, the flyer's size choices stop communicating importance clearly, leaving the reader unsure what to look at first.",opts:["A broken scale, making it hard to tell what is actually most important","A textbook example of ideal type scale","A deliberate, well-planned hierarchy","An approach unrelated to typographic scale"]},
];

const TAKEAWAY_QUOTE="A page does not need more sizes to feel organised. It needs fewer sizes, chosen on purpose, and used the same way every time.";
const TAKEAWAY_POINTS=[
  {t:"Pick your sizes before you start",b:"Decide your heading, subheading, body, and caption sizes in advance - then reuse them consistently, rather than picking a new size each time something feels important."},
  {t:"Test the two-second glance",b:"Look away, then glance back at your page for two seconds. If you can't tell what matters most, your scale isn't doing its job yet."},
  {t:"Keep the scale steps deliberate",b:"When moving from one size to the next, aim for a clear, consistent jump rather than a barely-noticeable or wildly random one."},
];

const SOURCES=[
  "Robert Bringhurst - The Elements of Typographic Style (1992). Scale and proportional hierarchy.",
  "Historical account of Pierre Simon Fournier's point system, 1737.",
];

export default function T04TypeScaleHierarchyLesson(){
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
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 0"}}>A handful of deliberate sizes, reused consistently, is what turns text into structure.</p>
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
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.6,margin:"0 0 12px"}}>What scale/hierarchy decision does this example show?</p>
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
              <div style={{fontWeight:700,color:T.white,fontSize:15,marginBottom:6}}>Topic 04 Complete.</div>
              <div style={{fontSize:13.5,color:T.muted,lineHeight:1.6}}>Topic 05 - Leading, Tracking, and Kerning: the spacing decisions that decide whether text breathes or suffocates.</div>
            </div>
            <Nav onBack={function(){go(4);}} onNext={function(){go(1);}} nextLabel="Restart Lesson"/>
          </div>
        )}

      </div>
    </div>
  );
}
