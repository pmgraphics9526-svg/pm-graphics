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

const LESSON_MODULE="TYPOGRAPHY - TOPIC 01";
const LESSON_TITLE="What is Typography";
const LESSON_SUBTITLE="Johannes Gutenberg 1450 - Robert Bringhurst 1992";

const STORY_PARA_1="Around 1450, in Mainz, Germany, a goldsmith named Johannes Gutenberg was trying to solve a problem that had nothing to do with art. Copying a single Bible by hand took a scribe more than a year. He wanted a way to reproduce pages of text quickly, accurately, and many times over.";
const STORY_PARA_2="His answer was movable type - individual metal letters, cast in advance, that could be arranged into words, inked, pressed onto paper, then taken apart and rearranged for the next page. For the first time, letters were treated as reusable units, not one-off strokes of a pen. Every decision about their shape, spacing, and rhythm only had to be made once, then it repeated thousands of times.";
const STORY_PARA_3="That shift in thinking - treating text as something designed and arranged, not just written - is what later became known as typography. Centuries afterward, the typographer Robert Bringhurst put it plainly in The Elements of Typographic Style: typography is the visual arrangement of language, and its job is to serve the reader, not the writer.";
const STORY_PROBLEM="You have opened a page - a document, a website, a menu - and felt tired reading it, even though every word made perfect sense. Nothing was misspelled. Nothing was wrong. But something about how the text sat on the page made it work harder than it needed to. That gap between correct words and comfortable reading is exactly what typography closes.";
const STORY_5Q=[
  {q:"What is it?",a:"Typography is the craft of arranging text on a page or screen - choosing typefaces and controlling size, spacing, and structure so language is easy to read."},
  {q:"Why does it exist?",a:"Because text with no design decisions behind it is technically readable but tiring. Typography removes the friction between a reader and a message."},
  {q:"How does it work?",a:"Through a stack of small decisions - typeface, size, spacing, alignment, hierarchy - each one minor alone, but compounding across a whole page."},
  {q:"How will you use it?",a:"Every time you set a heading, format a caption, or lay out a paragraph, you are practising typography, whether you notice it or not."},
  {q:"What if you skip it?",a:"Hierarchy disappears, scanning becomes hard work, and the reader has to fight the page to find what actually matters."},
];

const CONCEPT_SECTIONS=[
  {tag:"NOT THE SAME AS WRITING",content:"Writing is choosing the words. Typography is deciding how those words look and sit once they exist. A brilliant sentence set in the wrong size, in a cramped line, with no breathing room, still fails the reader - the words did their job, the typography did not.",rule:"Typography starts exactly where writing ends."},
  {tag:"THREE LAYERS OF EVERY DECISION",content:"Every piece of set text carries three layers of decisions stacked on top of each other: which typeface is used, how that typeface is set (size, spacing, alignment), and how pieces of text relate to each other in importance (hierarchy). Later topics in this module go deep on each layer - this topic is about seeing that the layers exist.",rule:"Typeface. Setting. Hierarchy. Every page is built from these three."},
  {tag:"IT CARRIES TONE, NOT JUST TEXT",content:"The same sentence set in two different ways can feel formal or casual, cheap or expensive, urgent or calm - before the reader has even finished reading it. Typography communicates alongside the words, not just underneath them.",rule:"Readers feel typography before they consciously notice it."},
];

const QUESTION_BANK=[
  {id:"q1",q:"What does typography most precisely mean?",opts:["Choosing pretty fonts","The visual arrangement of language on a page or screen","Handwriting practice","Printing technology in general"],ans:"The visual arrangement of language on a page or screen",exp:"Typography is about arrangement - decisions about how text looks and sits, not just which font is picked."},
  {id:"q2",q:"Who is credited with inventing movable type in Europe around 1450?",opts:["Robert Bringhurst","Johannes Gutenberg","Josef Albers","Paul Rand"],ans:"Johannes Gutenberg",exp:"Gutenberg's movable type let individual letters be arranged, printed, and reused, starting the shift toward typography as a discipline."},
  {id:"q3",q:"Before movable type, how were books mainly reproduced?",opts:["Hand-copied by scribes","Digital printing","Photocopying","Typewriters"],ans:"Hand-copied by scribes",exp:"A single hand-copied Bible could take a scribe over a year, which is the exact problem movable type solved."},
  {id:"q4",q:"What was new about Gutenberg's approach to letters?",opts:["He designed only decorative letters","He treated letters as reusable, rearrangeable units","He removed spacing between words","He wrote faster than scribes"],ans:"He treated letters as reusable, rearrangeable units",exp:"Cast metal letters could be arranged, inked, printed, then taken apart and reused for the next page."},
  {id:"q5",q:"Who wrote The Elements of Typographic Style (1992)?",opts:["Robert Bringhurst","Johannes Gutenberg","Ellen Lupton","Jan Tschichold"],ans:"Robert Bringhurst",exp:"Bringhurst's book formalised typography as a discipline serving the reader, not just the writer."},
  {id:"q6",q:"According to Bringhurst, whose interest should typography ultimately serve?",opts:["The writer's","The reader's","The printer's","The designer's ego"],ans:"The reader's",exp:"Bringhurst framed typography's purpose as serving the reader - making reading effortless, not showing off design."},
  {id:"q7",q:"Which of these is a typography decision?",opts:["Choosing which word to write next","Deciding the line spacing of a paragraph","Fact-checking a sentence","Picking a topic to write about"],ans:"Deciding the line spacing of a paragraph",exp:"Line spacing is a visual/structural decision about how text is set - that is typography, not writing."},
  {id:"q8",q:"Writing and typography differ because:",opts:["They are the same skill","Writing chooses words, typography arranges how those words appear","Typography only applies to print","Writing only applies to books"],ans:"Writing chooses words, typography arranges how those words appear",exp:"Writing ends once the words exist. Typography begins with how those words are visually presented."},
  {id:"q9",q:"A perfectly written sentence set in a cramped, tiny, crowded layout will:",opts:["Always read comfortably regardless of layout","Still be hard to read despite correct words","Automatically improve because content is strong","Not be affected by spacing at all"],ans:"Still be hard to read despite correct words",exp:"Good writing cannot overcome bad typography - the reader still struggles even if every word is right."},
  {id:"q10",q:"What are the three layers of typographic decisions introduced in this topic?",opts:["Colour, shape, texture","Typeface, setting, hierarchy","Grammar, spelling, punctuation","Print, digital, signage"],ans:"Typeface, setting, hierarchy",exp:"Every piece of set text stacks these three layers - which face is used, how it is set, and how parts relate in importance."},
  {id:"q11",q:"\"Setting\" in typography refers to:",opts:["Choosing a typeface family","Size, spacing, and alignment of type","The topic of the text","The country the designer lives in"],ans:"Size, spacing, and alignment of type",exp:"Setting is how a chosen typeface is actually applied on the page - its size, spacing, and alignment."},
  {id:"q12",q:"\"Hierarchy\" in typography refers to:",opts:["Company management structure","How pieces of text relate in importance to each other","Alphabetical ordering of letters","The oldest typeface used"],ans:"How pieces of text relate in importance to each other",exp:"Hierarchy tells a reader what to look at first, second, and last - headings versus body text, for example."},
  {id:"q13",q:"Can the same sentence feel formal in one typographic treatment and casual in another?",opts:["No, tone depends only on word choice","Yes, typography itself carries tone","Only in advertising, never elsewhere","Only if the words are also changed"],ans:"Yes, typography itself carries tone",exp:"Identical words set differently can feel expensive, cheap, urgent, or calm - typography communicates alongside the text."},
  {id:"q14",q:"When does a reader typically notice typography's emotional effect?",opts:["Only after deliberately analysing the page","Often before consciously noticing it at all","Never, it has no emotional effect","Only in logos, never in body text"],ans:"Often before consciously noticing it at all",exp:"Readers feel typographic tone almost instantly, often before they register why a page feels a certain way."},
  {id:"q15",q:"Typography exists mainly to:",opts:["Decorate a page","Remove friction between a reader and a message","Replace the need for good writing","Make text harder to copy"],ans:"Remove friction between a reader and a message",exp:"Its core purpose is easing the path from words on a page to understanding in a reader's mind."},
  {id:"q16",q:"A page with no typographic decisions made at all would be:",opts:["Impossible - every page has some","Automatically the most readable option","Always more professional-looking","Only a problem in print, not on screens"],ans:"Impossible - every page has some",exp:"Even a default, unstyled page reflects decisions (even if by default settings) - typography is unavoidable, only its quality varies."},
  {id:"q17",q:"Which of the following is NOT one of the three layers covered in this topic?",opts:["Typeface","Setting","Hierarchy","Colour theory"],ans:"Colour theory",exp:"Colour theory is a separate module in this platform - this topic's three layers are typeface, setting, and hierarchy."},
  {id:"q18",q:"Why does this topic avoid deep detail on serif versus sans-serif differences?",opts:["That distinction does not exist","It belongs to a later, dedicated topic in this module","Serif and sans-serif are identical","Typography does not include typefaces"],ans:"It belongs to a later, dedicated topic in this module",exp:"This topic covers what typography broadly is; specific typeface distinctions are covered in their own topic later."},
  {id:"q19",q:"A menu that is technically spelled correctly but exhausting to scan for prices is an example of:",opts:["Good typography, bad writing","Poor typography despite correct writing","A writing failure only","An unrelated design issue"],ans:"Poor typography despite correct writing",exp:"This is the exact gap typography closes - correct words, but the arrangement makes reading harder than necessary."},
  {id:"q20",q:"Typography's scope includes:",opts:["Only printed books","Only websites","Any medium where text appears - print, screens, signage, packaging","Only handwritten text"],ans:"Any medium where text appears - print, screens, signage, packaging",exp:"Typography applies wherever language is visually arranged for a reader, not just one medium."},
  {id:"q21",q:"What problem was Gutenberg specifically trying to solve?",opts:["How to write faster by hand","How to reproduce pages of text quickly and repeatably","How to invent new letterforms","How to translate the Bible"],ans:"How to reproduce pages of text quickly and repeatably",exp:"His goal was speed and repeatability in reproducing text, which movable type achieved."},
  {id:"q22",q:"Once Gutenberg's metal letters were used for one page, what happened to them?",opts:["They were destroyed","They could be rearranged and reused for the next page","They were kept permanently fixed in place","They were melted immediately"],ans:"They could be rearranged and reused for the next page",exp:"Reusability was the core innovation - the same physical letters served page after page."},
  {id:"q23",q:"The shift Gutenberg triggered was mainly a shift in:",opts:["How letters were thought about - as designed, reusable units","The alphabet itself","The languages people spoke","The materials paper was made from"],ans:"How letters were thought about - as designed, reusable units",exp:"It was a conceptual shift: letters became something designed and arranged deliberately, not only handwritten."},
  {id:"q24",q:"Typography being 'invisible when done well' means:",opts:["It should be impossible to see the text","Good typography lets readers focus on the message, not the design","Typography should always use white text","It refers only to blank pages"],ans:"Good typography lets readers focus on the message, not the design",exp:"When typography works, readers absorb the message without consciously noticing the design decisions enabling it."},
  {id:"q25",q:"Which best separates a writer's job from a typographer's job?",opts:["A writer decides content, a typographer decides visual arrangement","They are the exact same job","A typographer only works in print","A writer only works with typefaces"],ans:"A writer decides content, a typographer decides visual arrangement",exp:"Writing supplies the words; typography decides how those words are presented to a reader."},
  {id:"q26",q:"If two brands use identical wording but different typography, readers may:",opts:["Perceive them identically regardless","Perceive different tones or quality levels","Always prefer the one with more text","Ignore typography entirely"],ans:"Perceive different tones or quality levels",exp:"Typography shapes perception - identical words can feel premium or cheap depending on how they are set."},
  {id:"q27",q:"A scribe copying a Bible by hand for over a year illustrates:",opts:["The speed of pre-print reproduction","The slowness typography's ancestor technology solved","An unrelated historical fact","A myth with no basis"],ans:"The slowness typography's ancestor technology solved",exp:"This slowness is exactly the problem movable type - and later, typographic thinking - was built to solve."},
  {id:"q28",q:"Typography as 'a discipline' (per Bringhurst) implies it involves:",opts:["Random, accidental choices","Deliberate, considered decisions with a purpose","Only decorative flourishes","No real skill"],ans:"Deliberate, considered decisions with a purpose",exp:"Bringhurst treated typography as a serious craft with principles, not a set of arbitrary style choices."},
  {id:"q29",q:"Which statement is most accurate about typography and legibility?",opts:["They are unrelated concepts","Typography decisions directly affect how easily text can be read","Legibility only concerns handwriting","Typography reduces legibility by design"],ans:"Typography decisions directly affect how easily text can be read",exp:"Choices in typeface, setting and hierarchy directly determine how easily a reader can process text."},
  {id:"q30",q:"Why is typography described as something that 'compounds' across a page?",opts:["Because one small decision applies once and never repeats","Because small decisions repeat across every line and paragraph, adding up","Because it only affects the title","Because it has no cumulative effect"],ans:"Because small decisions repeat across every line and paragraph, adding up",exp:"A spacing or size decision isn't made once - it repeats across the whole page, so its effect compounds."},
  {id:"q31",q:"A well-typeset page and a poorly-typeset page with identical text will differ in:",opts:["Meaning of the words","Reading comfort and speed","Grammar","Nothing at all"],ans:"Reading comfort and speed",exp:"Same words, different typography - what changes is how comfortably and quickly a reader can process it."},
  {id:"q32",q:"Typography is best described as invisible support for the reader when it:",opts:["Draws attention to itself constantly","Lets the message come through without friction","Uses the most decorative typeface available","Ignores hierarchy completely"],ans:"Lets the message come through without friction",exp:"The best typography rarely gets noticed - it just makes reading feel effortless."},
  {id:"q33",q:"Which is an example of typography failing, even with correct spelling?",opts:["A recipe card where ingredients and steps are impossible to tell apart","A misspelled ingredient name","A recipe written in a foreign language","A recipe with no photos"],ans:"A recipe card where ingredients and steps are impossible to tell apart",exp:"This is a hierarchy failure - the words may be correct, but the visual structure fails the reader."},
  {id:"q34",q:"Typography applies to digital interfaces such as apps because:",opts:["Apps never contain text","Any place text appears for a reader involves typographic decisions","Only print counts as typography","Apps use a special non-typographic rule"],ans:"Any place text appears for a reader involves typographic decisions",exp:"Typography's scope is universal to wherever text is read - screens included."},
  {id:"q35",q:"The three-layer model (typeface, setting, hierarchy) exists mainly to help you:",opts:["Memorise font names","See that 'typography' is made of separable, learnable decisions","Avoid learning about typefaces","Skip the setting stage entirely"],ans:"See that 'typography' is made of separable, learnable decisions",exp:"Breaking typography into layers makes it a learnable skill, not one vague, overwhelming idea."},
  {id:"q36",q:"Which is closest to Bringhurst's definition of typography?",opts:["The chemistry of ink","The visual arrangement of language","The invention of new alphabets","The history of paper manufacturing"],ans:"The visual arrangement of language",exp:"This phrase - the visual arrangement of language - is Bringhurst's core framing of what typography is."},
  {id:"q37",q:"A reader feeling 'tired' from a page, despite understanding every word, points to a failure in:",opts:["Vocabulary","Typography","Grammar","Subject matter"],ans:"Typography",exp:"This is the exact symptom of poor typography - correct content, but uncomfortable visual delivery."},
  {id:"q38",q:"Why does this topic distinguish typography from writing early on?",opts:["To confuse beginners","So learners don't mistake picking words for the typographic craft","Because writing does not matter","Because typography replaces writing"],ans:"So learners don't mistake picking words for the typographic craft",exp:"The distinction sets a clear boundary: content is writing's job, visual arrangement is typography's job."},
  {id:"q39",q:"If a designer changes only the line spacing of a paragraph, they are practising:",opts:["Writing","Typography","Editing","Translation"],ans:"Typography",exp:"Line spacing is part of the 'setting' layer - a pure typographic decision, no words are changed."},
  {id:"q40",q:"Movable type's key advantage over hand-copying was:",opts:["Letters could be reused instead of rewritten each time","It made books more colourful","It eliminated the need for paper","It required more scribes"],ans:"Letters could be reused instead of rewritten each time",exp:"Reusable letters meant pages could be produced far faster than a scribe rewriting every letter by hand."},
  {id:"q41",q:"What does it mean that typography 'serves the reader, not the writer'?",opts:["Writers' preferences are irrelevant to typography's purpose","Its decisions should prioritise the reading experience over the writer's ego","Readers should never see the text","Writers should format their own work only"],ans:"Its decisions should prioritise the reading experience over the writer's ego",exp:"Bringhurst's framing puts the reader's comfort and clarity at the centre of typographic decisions."},
  {id:"q42",q:"Which best explains why typography is called a 'craft'?",opts:["It requires no skill or practice","It involves deliberate, practised decisions refined over time","It is purely random","It only concerns machines, not people"],ans:"It involves deliberate, practised decisions refined over time",exp:"Like other crafts, typography involves skill, principles, and practice - not guesswork."},
  {id:"q43",q:"A sign in a train station that is hard to read from a distance shows a failure in which typographic layer?",opts:["Setting (size/spacing)","Writing (word choice)","Grammar","Colour theory"],ans:"Setting (size/spacing)",exp:"Distance legibility is largely a setting issue - size and spacing decisions, not word choice."},
  {id:"q44",q:"Typography's effect on tone means it can make identical text feel:",opts:["Exactly the same in every context","Formal, casual, cheap, or premium depending on treatment","Only ever neutral","Impossible to perceive differently"],ans:"Formal, casual, cheap, or premium depending on treatment",exp:"The same words, typeset differently, can shift how premium, casual, or serious they feel to a reader."},
  {id:"q45",q:"This topic is scoped narrowly to avoid overlapping with later topics on:",opts:["Serif vs sans-serif, type scale, spacing specifics, font pairing","History of paper","Colour psychology","Logo design only"],ans:"Serif vs sans-serif, type scale, spacing specifics, font pairing",exp:"Those specifics are each their own topic later in this module - this one stays at the 'what is typography' level."},
  {id:"q46",q:"Why is 'typography is invisible when done well' considered a compliment, not a criticism?",opts:["Because invisible design means no effort was made","Because it means the reader experienced the message without friction","Because it means the text disappeared","Because readers prefer blank pages"],ans:"Because it means the reader experienced the message without friction",exp:"When readers don't notice the typography, it usually means the typography did its job perfectly."},
  {id:"q47",q:"Which scenario best demonstrates typography's scope beyond print?",opts:["A hand-copied medieval manuscript only","A mobile app's text labels and buttons","A typewriter with no design choices","An audio recording"],ans:"A mobile app's text labels and buttons",exp:"Typography applies anywhere text is visually presented for reading, including digital interfaces."},
  {id:"q48",q:"What single idea should you take from this topic above all else?",opts:["Fonts and typography are the exact same thing","Typography is arrangement of text that serves the reader, and it is made of learnable decisions","Typography is unimportant compared to writing","Typography only matters in books"],ans:"Typography is arrangement of text that serves the reader, and it is made of learnable decisions",exp:"This is the core takeaway framing the rest of the module: typography is a learnable, reader-focused craft."},
  {id:"q49",q:"A well-organised recipe card, where ingredients and steps are instantly distinguishable, demonstrates strong:",opts:["Hierarchy","Grammar","Word count","Ink quality"],ans:"Hierarchy",exp:"Instantly telling parts apart by importance and role is exactly what good hierarchy achieves."},
  {id:"q50",q:"Typography began shifting from purely handwritten text toward a designed discipline mainly because of:",opts:["The invention of movable type","The invention of the pencil","Modern web browsers","Social media"],ans:"The invention of movable type",exp:"Movable type is the historical starting point that turned letters into reusable, designed units - the root of typography as a discipline."},
];

const CB_TYPE="topic";
const CB_QUESTIONS=[
  {q:"A poster has correct spelling but readers struggle to tell the headline from the details. What is failing?",opts:["Hierarchy","Grammar","Colour theory","Paper quality"],ans:"Hierarchy",exp:"Nothing is misspelled - the problem is that importance isn't visually communicated."},
  {q:"Which decision belongs to 'setting' rather than 'typeface choice'?",opts:["Line spacing of a paragraph","Which font family is used","The words chosen","The topic of the page"],ans:"Line spacing of a paragraph",exp:"Setting covers size, spacing, and alignment - how a chosen typeface is applied."},
  {q:"A brand changes only how its slogan is typeset, keeping the same words. Readers now feel it's more premium. What changed?",opts:["The typography","The meaning of the words","The language used","Nothing changed"],ans:"The typography",exp:"Same words, different arrangement - the shift in feeling comes from typography, not content."},
  {q:"You are asked to fix the typography of a document with no spelling errors. What might you look at?",opts:["Spacing, size, and hierarchy of the text","Rewriting the sentences","Changing the language","Deleting content"],ans:"Spacing, size, and hierarchy of the text",exp:"Typography fixes concern visual arrangement, not the words themselves."},
  {q:"Gutenberg's movable type mattered because it let letters be:",opts:["Reused and rearranged instead of rewritten by hand","Permanently fixed in one arrangement forever","Destroyed after single use","Only used for illustrations"],ans:"Reused and rearranged instead of rewritten by hand",exp:"Reusability and rearrangement is the core innovation that started typography as a discipline."},
  {q:"A website has beautiful writing but readers bounce quickly, saying it 'felt exhausting'. What is the likely cause?",opts:["Poor typographic setting (spacing, size, hierarchy)","The topic being uninteresting","Too few images","The website's domain name"],ans:"Poor typographic setting (spacing, size, hierarchy)",exp:"This matches the exact symptom from the topic - correct words, tiring delivery caused by typography."},
  {q:"Which best fits 'typeface' as one of the three layers?",opts:["The specific type design being used, e.g. a particular font family","How large the text is set","How paragraphs relate to each other","The colour of the ink"],ans:"The specific type design being used, e.g. a particular font family",exp:"Typeface is the design of the letterforms themselves - one of the three core layers."},
  {q:"Robert Bringhurst's core argument was that typography should:",opts:["Serve the reader","Serve the writer's personal taste only","Never be studied formally","Avoid any hierarchy"],ans:"Serve the reader",exp:"His central framing places the reader's experience at the centre of typographic decisions."},
  {q:"A sign is technically correct but unreadable from a distance. This points to a failure in:",opts:["Setting (size)","Word choice","Grammar","Typeface personality"],ans:"Setting (size)",exp:"Distance legibility is primarily a size/setting decision, not a wording issue."},
  {q:"Which is the best one-line description of typography from this topic?",opts:["The visual arrangement of language to serve the reader","The invention of new alphabets","A synonym for handwriting","A subcategory of grammar"],ans:"The visual arrangement of language to serve the reader",exp:"This captures both Bringhurst's definition and its reader-first purpose."},
  {q:"Two identical paragraphs are set with different spacing - one feels calm, one feels cramped and urgent. This shows:",opts:["Typography can carry emotional tone","Spacing has no effect on feeling","Only colour affects tone","Typography cannot change perception"],ans:"Typography can carry emotional tone",exp:"Purely typographic choices, with no word changes, can shift how a reader feels about the same content."},
  {q:"Before movable type, reproducing a book required:",opts:["A scribe copying it by hand, often over a year","A printing press identical to modern ones","Digital scanning","Nothing, books didn't exist"],ans:"A scribe copying it by hand, often over a year",exp:"This slow, manual process is exactly what Gutenberg's invention was built to solve."},
  {q:"'Typography is invisible when done well' means the reader:",opts:["Focuses on the message without noticing the design effort","Cannot see the text at all","Skips reading entirely","Notices only the typeface name"],ans:"Focuses on the message without noticing the design effort",exp:"Good typography fades into the background, letting the message come through cleanly."},
  {q:"A menu is spelled correctly, but customers struggle to find prices quickly. The core issue is:",opts:["Weak hierarchy/visual organisation","Wrong currency symbol","Poor food descriptions","Bad paper stock"],ans:"Weak hierarchy/visual organisation",exp:"This is a hierarchy failure - prices should be visually easy to locate, regardless of spelling accuracy."},
  {q:"Which is an example of a pure typography decision (no words changed)?",opts:["Increasing the line spacing of a paragraph","Rewriting a headline","Translating a sentence","Changing a fact in the text"],ans:"Increasing the line spacing of a paragraph",exp:"This changes only visual setting, not content - a clean typography-only example."},
  {q:"Typography's scope, per this topic, includes:",opts:["Print, screens, signage, and packaging","Only books published before 1950","Only advertising","Only handwriting"],ans:"Print, screens, signage, and packaging",exp:"Typography applies wherever text is visually arranged for a reader, across any medium."},
  {q:"A writer finishes a great article, but its paragraph spacing and headings are inconsistent. Whose job is it to fix that?",opts:["A typographer's / the person handling layout","The writer must rewrite the article","No one, it doesn't matter","A translator's"],ans:"A typographer's / the person handling layout",exp:"Fixing spacing and heading structure is a typographic task, separate from the writing itself."},
  {q:"Which statement best distinguishes writing from typography?",opts:["Writing decides content, typography decides visual arrangement","They are identical skills","Typography always happens before writing","Writing only happens in books"],ans:"Writing decides content, typography decides visual arrangement",exp:"This is the clean separation the topic establishes between the two crafts."},
  {q:"A page using no deliberate typographic decisions at all is:",opts:["Impossible - defaults still count as decisions","The most readable option by default","Only a print problem","Automatically well-hierarchised"],ans:"Impossible - defaults still count as decisions",exp:"Even unstyled, default text reflects some typographic outcome - typography can't be fully avoided."},
  {q:"Bringhurst published The Elements of Typographic Style in:",opts:["1992","1450","1928","2010"],ans:"1992",exp:"This is the specific publication year credited to Bringhurst's foundational typography text."},
  {q:"A cramped, tiny-text warning label that's hard to read demonstrates poor:",opts:["Setting (size and spacing)","Vocabulary","Colour choice","Grammar"],ans:"Setting (size and spacing)",exp:"Legibility problems from cramped, tiny text are a setting failure, not a content one."},
  {q:"If a brand's slogan is reset in a different typeface and readers now perceive it as 'cheaper', this shows typography affects:",opts:["Perceived quality/tone","The literal meaning of the words","Nothing measurable","Only print costs"],ans:"Perceived quality/tone",exp:"Typography shapes how content feels and is perceived, separate from its literal meaning."},
  {q:"Why does this topic separate typeface, setting, and hierarchy into three layers?",opts:["To make typography learnable as distinct, practisable decisions","To make typography seem more complicated than it is","Because they are unrelated to each other","Because only one of the three matters"],ans:"To make typography learnable as distinct, practisable decisions",exp:"Breaking a broad concept into layers makes each one something you can study and apply separately."},
  {q:"A digital app's button labels being inconsistent in size across screens is a typography issue because:",opts:["Typography includes any text displayed for a reader, including UI text","Apps are outside typography's scope","Only print counts as typography","Buttons don't contain text"],ans:"Typography includes any text displayed for a reader, including UI text",exp:"Typography's scope covers any medium where text is visually presented, including app interfaces."},
  {q:"The single biggest idea to take from Topic 01 is that typography is:",opts:["A learnable, reader-first craft of arranging text","Just a synonym for 'choosing fonts'","Unimportant next to good writing","Only relevant to professional designers"],ans:"A learnable, reader-first craft of arranging text",exp:"This is the core framing for the rest of the Typography module - everything else builds on it."},
];

const BRAND_BANK=[
  {name:"Coca-Cola",hint:"Its logotype is not a typed font at all",ans:"custom script",exp:"Coca-Cola's logo is a custom flowing script, hand-drawn rather than set in an existing typeface - a typographic identity built entirely around one arrangement of letters.",opts:["A common system font","A custom hand-drawn script logotype","No typography, only imagery","Randomly generated lettering"]},
  {name:"IBM",hint:"Designed under Paul Rand's identity system",ans:"structured, consistent typesetting",exp:"IBM's identity under Paul Rand relied on rigorous, consistent typographic structure across every application - proof that typography carries corporate tone, not just decoration.",opts:["No consistent typographic rules","Structured, consistent typesetting across all materials","A different font for every country","Hand-lettering for all documents"]},
  {name:"The New York Times",hint:"Its masthead has stayed visually distinct for over a century",ans:"a highly legible, distinctive headline typeface",exp:"The Times relies on a highly legible, distinctive typeface for headlines that must work at both large masthead size and small print - a typography decision balancing identity with readability.",opts:["A highly legible, distinctive headline typeface","Random typeface changes every issue","No headlines, only body text","Hand-written headlines"]},
  {name:"Apple",hint:"Product pages rely heavily on large, clean type with generous space",ans:"lots of white space and large, minimal type",exp:"Apple's typographic approach favours large, clean type with generous surrounding space, letting text feel premium and uncluttered rather than dense.",opts:["Lots of white space and large, minimal type","Dense, small text to fit more content","Multiple decorative typefaces per page","No typographic hierarchy at all"]},
  {name:"A local newspaper vs. a luxury magazine",hint:"Same medium (print), very different typographic feel",ans:"typesetting choices shift the perceived tone",exp:"Both are printed text, yet one feels urgent and utilitarian while the other feels slow and premium - purely from typesetting choices, not the words themselves.",opts:["Typesetting choices shift the perceived tone","Paper type is the only difference","They always use identical typography","Typography has no role in either"]},
];

const TAKEAWAY_QUOTE="Typography is not decoration on top of words - it is the arrangement that decides whether those words are ever comfortably read at all.";
const TAKEAWAY_POINTS=[
  {t:"Separate writing from typesetting",b:"When something 'feels hard to read', check the arrangement (size, spacing, hierarchy) before assuming the writing is at fault."},
  {t:"Look for the three layers everywhere",b:"Menus, signs, apps, packaging - practise spotting typeface, setting, and hierarchy decisions in everyday text around you."},
  {t:"Remember who typography serves",b:"Every typographic decision should be judged by one question: does this make reading easier for the person on the other end?"},
];

const SOURCES=[
  "Robert Bringhurst - The Elements of Typographic Style (1992). Core definition and reader-first framing.",
  "Historical account of Johannes Gutenberg's movable type, Mainz, c. 1450.",
];

export default function T01WhatIsTypographyLesson(){
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
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 0"}}>Typography is not one idea - it is three layers of decisions, stacked on top of each other.</p>
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
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.6,margin:"0 0 12px"}}>What typographic decision defines this brand?</p>
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
              <div style={{fontWeight:700,color:T.white,fontSize:15,marginBottom:6}}>Topic 01 Complete.</div>
              <div style={{fontSize:13.5,color:T.muted,lineHeight:1.6}}>Topic 02 - Typeface vs Font: the difference between a design and a file, and why the distinction matters.</div>
            </div>
            <Nav onBack={function(){go(4);}} onNext={function(){go(1);}} nextLabel="Restart Lesson"/>
          </div>
        )}

      </div>
    </div>
  );
}
