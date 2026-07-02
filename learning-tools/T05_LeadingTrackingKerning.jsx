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

const LESSON_MODULE="TYPOGRAPHY - TOPIC 05";
const LESSON_TITLE="Leading, Tracking, and Kerning";
const LESSON_SUBTITLE="Letterpress Tradition - Matthew Butterick 2010";

const STORY_PARA_1="In a letterpress shop, every line of metal type sat tightly against the next unless a compositor did something about it. To add vertical breathing room, they inserted thin strips of lead metal between the rows of set type. Those strips were literally called leads - and the vertical space they created is still called leading today, long after the actual lead disappeared from the process.";
const STORY_PARA_2="A separate, more specific problem showed up sideways, not vertically. Most metal letters stood squarely inside their own individual block, with no overlap allowed - but certain pairs, like an italic f next to an i, looked awkwardly distant unless part of one letter was allowed to overhang into its neighbour's space. Type founders custom-filed that small overhanging edge for specific problem pairs. That filed overhang was called a kern, and adjusting it - pair by pair - became known as kerning.";
const STORY_PARA_3="Tracking is the newest of the three. It has no metal-strip or filed-overhang origin story - it emerged later, with phototypesetting and then digital type, to describe something neither leading nor kerning could do: adjusting the spacing evenly across a whole word, line, or block of text at once, rather than one line or one letter pair at a time.";
const STORY_PROBLEM="You have looked at a paragraph that felt cramped and airless even though every word was spelled correctly, or noticed two letters in a headline sitting so close they nearly touched while the rest had visible gaps. Nothing was wrong with the words - the spacing around them was doing the damage.";
const STORY_5Q=[
  {q:"What is it?",a:"Three separate spacing controls: leading (vertical space between lines), tracking (uniform space across a range of letters), and kerning (space between one specific pair of letters)."},
  {q:"Why does it exist?",a:"Because text needs breathing room at three different scales - between lines, across a whole word or block, and between individual troublesome letter pairs - and each needed its own tool."},
  {q:"How does it work?",a:"Leading adjusts vertical line spacing. Tracking adjusts spacing evenly across many letters at once. Kerning adjusts the space between just two specific letters that sit awkwardly by default."},
  {q:"How will you use it?",a:"Loosen leading for dense body paragraphs, tighten tracking for large confident headlines, and fix kerning for specific letter pairs that visibly clash in a logo or headline."},
  {q:"What if you skip it?",a:"Paragraphs feel cramped or too loose, headlines feel awkward at large sizes, and specific letter pairs create visible, distracting gaps or collisions."},
];

const CONCEPT_SECTIONS=[
  {tag:"LEADING - SPACE BETWEEN LINES",content:"Leading is the vertical space between one line's baseline and the next. Its name comes directly from the literal strips of lead once inserted between rows of metal type. Too little leading crowds lines together; too much leading makes a paragraph feel disconnected and hard to follow line to line.",rule:"Leading controls how a paragraph breathes from line to line, top to bottom."},
  {tag:"TRACKING - UNIFORM SPACE ACROSS MANY LETTERS",content:"Tracking adjusts the spacing evenly across a whole word, line, or block of text at once - every letter gap shifts by roughly the same amount together. It is commonly tightened for large, bold headlines, or loosened slightly for small all-caps text to keep it readable.",rule:"Tracking moves every letter gap in a stretch of text together, as one uniform adjustment."},
  {tag:"KERNING - SPACE BETWEEN ONE SPECIFIC PAIR",content:"Kerning adjusts the space between just two particular letters that sit awkwardly next to each other by default - like a capital A next to a capital V, or a T next to an o. It is a pair-by-pair fix, not a blanket adjustment across a whole line.",rule:"Kerning is surgical - it fixes one troublesome pair at a time, not everything at once."},
];

const QUESTION_BANK=[
  {id:"q1",q:"What is leading?",opts:["The vertical space between one line of text and the next","The space between two specific letters","A uniform spacing adjustment across many letters","A typeface's overall design"],ans:"The vertical space between one line of text and the next",exp:"Leading refers specifically to the vertical gap between lines, historically created with literal strips of lead."},
  {id:"q2",q:"Where does the term 'leading' come from?",opts:["Strips of lead metal inserted between lines of type in letterpress printing","The lead singer of a band","A brand name for a typesetting machine","The word 'lead' meaning to guide a reader"],ans:"Strips of lead metal inserted between lines of type in letterpress printing",exp:"Compositors literally inserted thin lead strips between rows of metal type to add vertical spacing."},
  {id:"q3",q:"What is kerning?",opts:["Adjusting the space between one specific pair of letters","Adjusting vertical space between lines","Adjusting spacing evenly across a whole paragraph","Choosing a typeface's weight"],ans:"Adjusting the space between one specific pair of letters",exp:"Kerning is a pair-specific fix - adjusting the space between two particular letters that sit awkwardly by default."},
  {id:"q4",q:"Where does the term 'kerning' come from?",opts:["A filed overhang on metal type letters, called a kern, used for specific problem letter pairs","A Scottish word for empty space","A digital font format","A printing press brand name"],ans:"A filed overhang on metal type letters, called a kern, used for specific problem letter pairs",exp:"Type founders custom-filed a small overhanging edge, called a kern, to fix specific awkward letter pairs."},
  {id:"q5",q:"What is tracking?",opts:["A uniform spacing adjustment applied evenly across a range of text","A single letter pair adjustment","Vertical space between lines","A method for pairing two typefaces"],ans:"A uniform spacing adjustment applied evenly across a range of text",exp:"Tracking shifts the spacing of many letters together, uniformly, rather than one pair or one line at a time."},
  {id:"q6",q:"Which of the three - leading, tracking, kerning - emerged most recently, without a letterpress metal origin story?",opts:["Tracking","Leading","Kerning","All three emerged at the same time"],ans:"Tracking",exp:"Tracking arrived later, with phototypesetting and digital type, unlike leading and kerning's direct letterpress origins."},
  {id:"q7",q:"Why did letterpress compositors historically insert thin lead strips between lines of type?",opts:["To add vertical spacing between the lines","To make the type heavier for printing","To fix specific letter pairs","To change the typeface being used"],ans:"To add vertical spacing between the lines",exp:"This is the direct physical origin of leading - literal lead strips creating vertical breathing room."},
  {id:"q8",q:"Which pair of letters is a classic example of needing kerning adjustment?",opts:["A capital A next to a capital V","Two identical lowercase letters in a row","Any two vowels","Numbers next to each other"],ans:"A capital A next to a capital V",exp:"Diagonal-heavy pairs like AV commonly default to awkward spacing and are a textbook kerning fix example."},
  {id:"q9",q:"If a paragraph's lines feel cramped and hard to follow, which control is most directly responsible?",opts:["Leading","Kerning","Tracking of a single word","Typeface family choice alone"],ans:"Leading",exp:"Cramped, hard-to-follow lines point to insufficient leading - the vertical space between lines."},
  {id:"q10",q:"If a large headline's overall letters feel too tightly or loosely spaced as a whole, which control addresses that?",opts:["Tracking","Leading","Kerning of one pair only","Type scale"],ans:"Tracking",exp:"Tracking adjusts spacing evenly across the whole headline, which is exactly the described problem."},
  {id:"q11",q:"If two specific letters in a logo appear to almost touch while the rest of the word looks fine, what is the likely fix?",opts:["Kerning that specific pair","Adjusting leading for the whole paragraph","Adjusting tracking for the entire logo","Changing the typeface entirely"],ans:"Kerning that specific pair",exp:"A localised spacing problem between two letters is precisely what kerning is designed to fix."},
  {id:"q12",q:"Which of the three spacing controls works line-by-line (vertically)?",opts:["Leading","Tracking","Kerning","None of them work vertically"],ans:"Leading",exp:"Leading is specifically the vertical spacing control, unlike tracking and kerning which affect horizontal letter spacing."},
  {id:"q13",q:"Which of the three spacing controls works across many letters at once (uniformly)?",opts:["Tracking","Leading","Kerning","Type scale"],ans:"Tracking",exp:"Tracking is defined by adjusting spacing evenly across a whole stretch of text, not one pair or one vertical gap."},
  {id:"q14",q:"Which of the three spacing controls works on just one specific letter pair?",opts:["Kerning","Leading","Tracking","Type scale"],ans:"Kerning",exp:"Kerning is the pair-specific, surgical adjustment among the three spacing controls."},
  {id:"q15",q:"A designer tightens the tracking on a large, bold headline. What are they doing?",opts:["Reducing the space evenly across all the headline's letters","Reducing space between just two letters","Reducing vertical space between lines","Changing the headline's typeface"],ans:"Reducing the space evenly across all the headline's letters",exp:"Tightening tracking reduces spacing uniformly across the whole stretch of text, a common headline technique."},
  {id:"q16",q:"Why might small all-caps text benefit from slightly looser tracking?",opts:["Capital letters set close together in small sizes can become harder to read without extra room","Loosening tracking always makes text unreadable","All-caps text requires tighter tracking, never looser","Tracking has no effect on all-caps text"],ans:"Capital letters set close together in small sizes can become harder to read without extra room",exp:"Small, tightly-packed capitals can blur together; slightly looser tracking helps maintain legibility."},
  {id:"q17",q:"What does a 'kern' refer to, in its original letterpress sense?",opts:["A filed, overhanging part of a metal letter allowing it to sit closer to its neighbour","A strip of lead between lines","A whole typeface family","A digital font file extension"],ans:"A filed, overhanging part of a metal letter allowing it to sit closer to its neighbour",exp:"This is the literal, historical object the term kerning is named after."},
  {id:"q18",q:"Why does this topic keep leading, tracking, and kerning as three distinct concepts rather than one general 'spacing' idea?",opts:["Each works at a different scale - vertical lines, whole ranges of text, or one specific pair - and needs to be understood separately","They are identical concepts with different names","Only one of them is a real typographic concept","Spacing has no meaningful subdivisions in typography"],ans:"Each works at a different scale - vertical lines, whole ranges of text, or one specific pair - and needs to be understood separately",exp:"Distinguishing the three prevents confusing a line-spacing problem with a letter-pair problem, for example."},
  {id:"q19",q:"A paragraph with too much leading tends to feel:",opts:["Disconnected, making it harder to follow from one line to the next","Cramped and difficult to read","Identical to a paragraph with no leading adjustment","Automatically more legible in every case"],ans:"Disconnected, making it harder to follow from one line to the next",exp:"Excessive leading can make lines feel like separate, disconnected fragments rather than a flowing paragraph."},
  {id:"q20",q:"Matthew Butterick's Practical Typography (2010) is a relevant source for this topic because it:",opts:["Explains leading, tracking, and kerning in practical, applied terms","Invented the printing press","Focuses only on serif versus sans-serif","Has no connection to typographic spacing"],ans:"Explains leading, tracking, and kerning in practical, applied terms",exp:"Butterick's book is a well-known practical reference specifically addressing these spacing controls."},
  {id:"q21",q:"Which best distinguishes tracking from kerning?",opts:["Tracking is uniform across many letters; kerning targets one specific pair","They are the exact same adjustment with different names","Kerning applies to whole paragraphs; tracking applies to single letters","Tracking only works vertically, kerning only horizontally"],ans:"Tracking is uniform across many letters; kerning targets one specific pair",exp:"This scale difference - broad and uniform versus narrow and specific - is the core distinction between the two."},
  {id:"q22",q:"Which best distinguishes leading from tracking?",opts:["Leading is vertical (between lines); tracking is horizontal (across letters)","They are identical, just different names for the same thing","Leading only applies to headlines; tracking only applies to body text","Tracking is vertical; leading is horizontal"],ans:"Leading is vertical (between lines); tracking is horizontal (across letters)",exp:"Leading governs the vertical dimension between lines, while tracking governs horizontal spacing across letters."},
  {id:"q23",q:"A logo designer notices the letters 'T' and 'o' in a wordmark sit with an oddly large gap between them compared to other letters. What is the most precise fix?",opts:["Kerning that specific To pair","Adjusting the leading for the whole logo","Adjusting tracking for the entire wordmark","Changing the entire typeface"],ans:"Kerning that specific To pair",exp:"A gap problem isolated to one specific pair calls for a targeted kerning fix, not a blanket adjustment."},
  {id:"q24",q:"Why couldn't letterpress compositors simply 'kern' every letter pair perfectly by default?",opts:["Each kern required custom filing for that specific problem pair, which was labour-intensive","Kerning did not exist at all in letterpress","All letter pairs were automatically perfect by default","Kerning was banned by printing guilds"],ans:"Each kern required custom filing for that specific problem pair, which was labour-intensive",exp:"Kerning was a manual, pair-specific fix - not something applied broadly or automatically across every letter combination."},
  {id:"q25",q:"Which of these three concepts is most associated with the phrase 'letters breathing room, line to line'?",opts:["Leading","Tracking","Kerning","Typeface pairing"],ans:"Leading",exp:"Leading is specifically about the vertical breathing room between lines of text."},
  {id:"q26",q:"Which of these three concepts is most associated with 'shifting every letter gap together, uniformly'?",opts:["Tracking","Leading","Kerning","Type scale"],ans:"Tracking",exp:"Tracking's defining feature is applying a uniform shift across a whole stretch of letters at once."},
  {id:"q27",q:"Which of these three concepts is most associated with 'fixing one awkward pair, surgically'?",opts:["Kerning","Leading","Tracking","Font pairing"],ans:"Kerning",exp:"Kerning's defining feature is its precise, pair-by-pair nature, unlike the broader adjustments of leading and tracking."},
  {id:"q28",q:"A large headline set in all capitals with letters visibly overlapping at certain points most likely needs:",opts:["Loosened tracking, and possibly kerning fixes for the worst pairs","Tighter leading only","A completely different topic's fix, unrelated to spacing","No adjustment, this is standard for headlines"],ans:"Loosened tracking, and possibly kerning fixes for the worst pairs",exp:"Overlapping letters across a stretch of text suggest tracking needs loosening, with kerning as a targeted follow-up for stubborn pairs."},
  {id:"q29",q:"Historically, was leading adjustment something every line of a page automatically had by default in letterpress?",opts:["No, extra leading required deliberately inserting lead strips","Yes, all lines automatically had identical, ideal leading","Leading did not exist as a concept before digital type","Leading only applied to headlines, never to body text"],ans:"No, extra leading required deliberately inserting lead strips",exp:"Adding leading was a deliberate physical action - it did not happen automatically without a compositor's intervention."},
  {id:"q30",q:"Which best reflects the practical difference in how designers apply tracking versus kerning today?",opts:["Tracking is often applied broadly to a text block; kerning is applied selectively to individual problem pairs","They are applied in exactly the same way with no difference","Kerning is applied to whole paragraphs; tracking is never used in modern design","Neither is used in digital typesetting today"],ans:"Tracking is often applied broadly to a text block; kerning is applied selectively to individual problem pairs",exp:"This reflects the core practical distinction: tracking is a blanket tool, kerning is a targeted one."},
  {id:"q31",q:"A paragraph where lines sit almost on top of each other, making text hard to separate visually, suggests:",opts:["Leading that is too tight","Tracking that is too loose","Kerning applied incorrectly to every letter","A typeface with no lowercase letters"],ans:"Leading that is too tight",exp:"Lines crowding together vertically is a classic symptom of insufficient leading."},
  {id:"q32",q:"Which best explains why kerning became necessary in the first place for certain letter pairs?",opts:["Some letter shapes, placed at default spacing, create visually awkward or uneven gaps next to specific neighbours","All letters are naturally spaced perfectly with no exceptions","Kerning is only a digital-era invention with no real visual justification","Every letter pair looks identical regardless of adjustment"],ans:"Some letter shapes, placed at default spacing, create visually awkward or uneven gaps next to specific neighbours",exp:"Certain shape combinations (like diagonal strokes in A and V) create uneven default spacing that kerning corrects."},
  {id:"q33",q:"A book's body text uses generous, comfortable leading throughout. What is this decision optimising for?",opts:["Easier line-to-line reading over long stretches of text","Maximum letters per line regardless of readability","Eliminating the need for kerning entirely","Making headlines feel bigger"],ans:"Easier line-to-line reading over long stretches of text",exp:"Comfortable leading is a common choice for long-form reading, making it easier to track from one line to the next."},
  {id:"q34",q:"Why is it inaccurate to call tracking and kerning 'the same thing with different names'?",opts:["They operate at different scales - tracking is uniform across many letters, kerning targets one pair","They are, in fact, identical in every way","Kerning never applies to more than one word","Tracking cannot be used on headlines"],ans:"They operate at different scales - tracking is uniform across many letters, kerning targets one pair",exp:"Despite both affecting horizontal spacing, their scope - broad versus pair-specific - makes them functionally distinct tools."},
  {id:"q35",q:"The single biggest idea to take from this topic is:",opts:["Leading, tracking, and kerning are three separate spacing tools working at three different scales","All spacing in typography is controlled by one single setting","Spacing has no real effect on how text is read","Kerning and leading are interchangeable terms"],ans:"Leading, tracking, and kerning are three separate spacing tools working at three different scales",exp:"This is the structural core the topic is built around - three distinct tools, three distinct scales."},
  {id:"q36",q:"If a heading looks fine overall but one specific letter pair (like 'We') has a distractingly large gap, the most precise tool is:",opts:["Kerning","Tracking applied to the whole heading","Leading","Changing the whole typeface"],ans:"Kerning",exp:"An isolated pair problem calls for the precise, pair-specific kerning fix rather than a broad adjustment."},
  {id:"q37",q:"If an entire paragraph of body text feels slightly too tight letter-to-letter throughout, which tool addresses that most directly?",opts:["Tracking","Kerning of a single pair","Leading","Changing only the heading size"],ans:"Tracking",exp:"A uniform, whole-paragraph spacing issue calls for tracking, since it adjusts spacing evenly across the whole stretch of text."},
  {id:"q38",q:"Why does this topic avoid discussing line length (how many characters fit per line)?",opts:["That belongs to a separate, dedicated topic later in this module","Line length has no relationship to typography at all","Leading, tracking, and kerning already fully cover line length","Line length was resolved by Fournier's point system"],ans:"That belongs to a separate, dedicated topic later in this module",exp:"This topic stays scoped to the three named spacing controls; line length is covered in its own later topic."},
  {id:"q39",q:"A compositor increasing leading between two lines of metal type historically had to:",opts:["Physically insert a thin lead strip between the rows","Simply type a command on a keyboard","File down individual letters","Change the typeface being used"],ans:"Physically insert a thin lead strip between the rows",exp:"This physical action is the direct historical root of what we now call adjusting leading."},
  {id:"q40",q:"Digital design tools today let designers adjust leading, tracking, and kerning through:",opts:["Software settings, without any physical materials involved","Only by literally inserting metal strips","Only through professional print shops","They cannot be adjusted digitally at all"],ans:"Software settings, without any physical materials involved",exp:"Modern software replicates these same three concepts digitally, without any of the original physical materials."},
  {id:"q41",q:"Which best reflects why leading kept its name even after literal lead disappeared from typesetting?",opts:["The term stuck as a convention, even though the physical material behind it no longer exists","Digital type still uses actual lead metal today","The word was recently invented and has no historical root","Leading and lead are unrelated words that happen to look similar"],ans:"The term stuck as a convention, even though the physical material behind it no longer exists",exp:"Typographic terminology often outlives its literal physical origin - leading is a clear example."},
  {id:"q42",q:"A headline set with very tight tracking at a large size is a common technique to:",opts:["Create a bold, confident, cohesive block of large text","Automatically fix all kerning issues","Increase the vertical space between lines","Change the typeface's personality entirely"],ans:"Create a bold, confident, cohesive block of large text",exp:"Tight tracking at large sizes is a common technique for making headline text feel unified and impactful."},
  {id:"q43",q:"Which of the three concepts most directly affects how 'tall' or 'short' a paragraph appears on a page?",opts:["Leading","Tracking","Kerning","Typeface pairing"],ans:"Leading",exp:"Since leading controls vertical spacing between lines, it directly affects a paragraph's overall vertical height."},
  {id:"q44",q:"Which of the three concepts would a type foundry historically have needed to custom-file for specific problem letter combinations?",opts:["Kerning","Leading","Tracking","None of them required custom filing"],ans:"Kerning",exp:"Kerning specifically required custom-filed overhangs on metal type for individual problem pairs."},
  {id:"q45",q:"A designer applies the same spacing increase across every letter in a company's wordmark logo. This is best described as:",opts:["Tracking adjustment","Kerning adjustment","Leading adjustment","A typeface change"],ans:"Tracking adjustment",exp:"A uniform spacing change across all the letters in the wordmark is a textbook tracking adjustment."},
  {id:"q46",q:"Which best completes: 'Leading is about ___; tracking is about ___; kerning is about ___.'",opts:["Lines; many letters at once; one specific pair","Colour; typeface; paper","Files; folders; printers","Headlines only; body text only; captions only"],ans:"Lines; many letters at once; one specific pair",exp:"This captures the precise scale distinction between the three spacing controls covered in this topic."},
  {id:"q47",q:"A paragraph that feels 'just right' - not cramped, not disconnected - likely reflects:",opts:["Leading that was deliberately tuned for that specific text size and context","Leading that was left entirely untouched by default","The complete absence of any spacing decisions","A typeface with no lowercase letters"],ans:"Leading that was deliberately tuned for that specific text size and context",exp:"Comfortable-feeling leading is rarely accidental - it usually reflects a deliberate adjustment for the specific context."},
  {id:"q48",q:"Why might a designer kern a logo's letters even after applying tracking to the whole wordmark?",opts:["Tracking's uniform adjustment can still leave specific pairs looking awkward, needing a targeted kerning fix","Kerning and tracking always produce identical results","Once tracking is applied, kerning becomes impossible","Logos never need any spacing adjustments"],ans:"Tracking's uniform adjustment can still leave specific pairs looking awkward, needing a targeted kerning fix",exp:"Because tracking is uniform, it doesn't account for individual awkward pairs - kerning is often still needed on top of it."},
  {id:"q49",q:"Which best reflects the value of understanding all three terms separately rather than lumping them as 'spacing'?",opts:["You can accurately diagnose whether a problem is vertical, broad-horizontal, or pair-specific, and fix it precisely","There is no practical value, the terms are interchangeable","Only professional printers ever need to know the difference","Digital tools eliminate any need to understand these terms"],ans:"You can accurately diagnose whether a problem is vertical, broad-horizontal, or pair-specific, and fix it precisely",exp:"Precise diagnosis - and therefore precise, efficient fixing - is the practical payoff of understanding all three distinctly."},
  {id:"q50",q:"In one sentence, this topic's three concepts can be summarised as:",opts:["Three different scales of spacing control - line, range, and pair - each solving a distinct visual problem","One single spacing setting with three different names","A historical curiosity with no modern relevance","A single concept only relevant to metal type printing"],ans:"Three different scales of spacing control - line, range, and pair - each solving a distinct visual problem",exp:"This is the core structural takeaway tying leading, tracking, and kerning together as related but distinct tools."},
];

const CB_TYPE="topic";
const CB_QUESTIONS=[
  {q:"A paragraph's lines are crowding together, making it hard to read line to line. What needs adjusting?",opts:["Leading","Kerning","Tracking of a single word","Typeface family"],ans:"Leading",exp:"Crowded lines point directly to insufficient leading - the vertical space between lines."},
  {q:"A large headline's letters, as a whole, feel too spread out and disconnected from each other. What needs adjusting?",opts:["Tracking","Leading","Kerning of one letter pair only","Type scale"],ans:"Tracking",exp:"A whole-headline spacing problem, affecting all the letters uniformly, is a tracking issue."},
  {q:"Two letters in a wordmark visually collide while the rest of the word looks evenly spaced. What needs adjusting?",opts:["Kerning of that specific pair","Leading for the whole wordmark","Tracking for the whole wordmark","The typeface's weight"],ans:"Kerning of that specific pair",exp:"An isolated collision between two letters calls for a targeted, pair-specific kerning fix."},
  {q:"Where does the term 'leading' historically come from?",opts:["Strips of lead metal inserted between lines of type","A digital software feature with no historical root","The word 'lead' meaning to guide someone","A brand of printing press"],ans:"Strips of lead metal inserted between lines of type",exp:"This is the direct, literal, historical origin of the term leading in letterpress printing."},
  {q:"Where does the term 'kerning' historically come from?",opts:["A filed overhanging edge on metal type, called a kern, for problem letter pairs","A strip of lead between lines","A digital font file format","An abbreviation of 'keyboard-run'"],ans:"A filed overhanging edge on metal type, called a kern, for problem letter pairs",exp:"Kerning is named after the physical, filed overhang used to fix specific awkward letter pairs in letterpress."},
  {q:"Which of the three spacing controls emerged most recently, without a metal-type origin story?",opts:["Tracking","Leading","Kerning","All three are equally old"],ans:"Tracking",exp:"Tracking arrived with phototypesetting and digital type, later than leading and kerning's letterpress origins."},
  {q:"A designer tightens the tracking on a large bold headline. What effect are they going for?",opts:["A cohesive, confident, tightly-unified block of large text","More vertical space between lines","A fix for one specific letter pair","A completely different typeface"],ans:"A cohesive, confident, tightly-unified block of large text",exp:"Tight tracking on large headlines is a common technique for a bold, unified visual impact."},
  {q:"Small all-caps text is often given slightly looser tracking to:",opts:["Keep it legible, since tightly-packed capitals can blur together","Make it deliberately harder to read","Save vertical space on the page","Fix a specific letter pair problem"],ans:"Keep it legible, since tightly-packed capitals can blur together",exp:"Extra room between capitals at small sizes helps prevent letters from visually merging together."},
  {q:"Which control is 'surgical', fixing just one pair rather than a whole range of text?",opts:["Kerning","Tracking","Leading","Type scale"],ans:"Kerning",exp:"Kerning's defining trait is its precision - adjusting exactly one pair, not a broader range."},
  {q:"Which control is 'uniform', shifting many letters together at once?",opts:["Tracking","Kerning","Leading","Font pairing"],ans:"Tracking",exp:"Tracking's defining trait is applying the same spacing shift across a whole stretch of text at once."},
  {q:"Which control is specifically vertical, not horizontal?",opts:["Leading","Tracking","Kerning","None of the three"],ans:"Leading",exp:"Leading is the only one of the three that governs vertical spacing (between lines), not horizontal letter spacing."},
  {q:"A book's body text has generous, comfortable leading. What is this optimising for?",opts:["Easier reading across long stretches of text","Maximum text density on the page","Eliminating the need for tracking","Making headlines look larger"],ans:"Easier reading across long stretches of text",exp:"Comfortable leading is a common choice specifically to ease long-form reading, line to line."},
  {q:"Historically, why couldn't every letter pair simply be kerned perfectly by default in letterpress?",opts:["Each kern required labour-intensive custom filing for that specific pair","Kerning did not exist as a concept at the time","All pairs were naturally perfect without adjustment","Kerning was reserved only for lowercase letters"],ans:"Each kern required labour-intensive custom filing for that specific pair",exp:"Kerning was a manual, pair-by-pair fix, not something applied automatically across every combination."},
  {q:"A paragraph feels disconnected, like each line stands alone rather than flowing together. What is the likely cause?",opts:["Leading that is too loose","Leading that is too tight","Tracking that is too tight","Kerning applied to every pair"],ans:"Leading that is too loose",exp:"Excess vertical space between lines can make a paragraph feel fragmented rather than cohesive."},
  {q:"Which best summarises the relationship between the three terms in one line?",opts:["Leading is vertical, tracking is uniform-horizontal, kerning is pair-specific-horizontal","All three terms mean exactly the same thing","Only kerning is a real typographic concept","Tracking and leading are the same, kerning is unrelated"],ans:"Leading is vertical, tracking is uniform-horizontal, kerning is pair-specific-horizontal",exp:"This is the precise, scoped relationship between the three concepts as taught in this topic."},
];

const BRAND_BANK=[
  {name:"A classic hardcover novel's body text",hint:"Generous space between each line makes long reading sessions comfortable",ans:"deliberately generous leading, tuned for long-form comfort",exp:"Novels commonly use generous, carefully tuned leading specifically because readers spend long, continuous stretches reading line after line.",opts:["Deliberately generous leading, tuned for long-form comfort","Extremely tight leading to save paper at any cost","No leading adjustment made at all, ever","Kerning applied to every single letter pair"]},
  {name:"A large fashion brand's wordmark logo (e.g. tightly-set capital letters)",hint:"The whole wordmark's letters sit closer together than default spacing would allow",ans:"tightened tracking across the whole wordmark, for a bold, unified feel",exp:"Many fashion wordmarks tighten tracking uniformly across every letter to create a bold, confident, cohesive brand mark.",opts:["Tightened tracking across the whole wordmark, for a bold, unified feel","Loosened leading applied vertically to a single line of text","Kerning applied only to the first and last letters","No spacing adjustment of any kind"]},
  {name:"A logo where the capital letters 'W' and 'A' sit unusually close together compared to other pairs",hint:"Only that one specific pair looks tightened, not the whole wordmark",ans:"a targeted kerning fix for that one WA pair",exp:"When only one specific pair looks adjusted while the rest of the word looks normal, that is a hallmark sign of a targeted kerning fix.",opts:["A targeted kerning fix for that one WA pair","Tracking applied evenly across the whole wordmark","Leading adjustment for the whole logo","A change of typeface for just those two letters"]},
  {name:"A small, all-caps navigation menu on a website",hint:"The capital letters have slightly more breathing room than a headline of the same letters would",ans:"loosened tracking, to keep small capital letters legible",exp:"Small all-caps text commonly receives slightly loosened tracking specifically to prevent tightly-packed capitals from blurring together.",opts:["Loosened tracking, to keep small capital letters legible","Tightened leading to save vertical space","Kerning applied to every character individually","No spacing decision was involved"]},
  {name:"A dense legal document with lines of text sitting almost on top of each other",hint:"Lines feel crowded and hard to separate visually while reading",ans:"leading that is too tight for comfortable reading",exp:"Crowded lines with little vertical breathing room are a classic symptom of leading set too tight for the reading context.",opts:["Leading that is too tight for comfortable reading","Tracking that is too loose across the page","Kerning applied incorrectly to every word","A typeface with no lowercase letters"]},
];

const TAKEAWAY_QUOTE="Leading gives a paragraph room to breathe. Tracking gives a headline its posture. Kerning fixes the one pair everyone notices but no one can name.";
const TAKEAWAY_POINTS=[
  {t:"Diagnose before you adjust",b:"Ask which scale the problem is at - a whole paragraph (leading), a whole word or line (tracking), or one specific pair (kerning) - before reaching for a fix."},
  {t:"Tune leading for the reading context",b:"Long-form body text usually wants generous, comfortable leading; dense reference material may need it tighter to stay compact."},
  {t:"Check headlines and logos for kerning last",b:"After setting overall tracking, scan for any one pair that still looks awkward - that is exactly the job kerning was invented for."},
];

const SOURCES=[
  "Matthew Butterick - Practical Typography (2010). Applied guidance on leading, tracking, and kerning.",
  "Robert Bringhurst - The Elements of Typographic Style (1992). Historical and structural spacing terminology.",
];

export default function T05LeadingTrackingKerningLesson(){
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
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 0"}}>Three spacing tools. Three different scales - line, range, and pair.</p>
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
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.6,margin:"0 0 12px"}}>What spacing decision does this example show?</p>
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
              <div style={{fontWeight:700,color:T.white,fontSize:15,marginBottom:6}}>Topic 05 Complete.</div>
              <div style={{fontSize:13.5,color:T.muted,lineHeight:1.6}}>Topic 06 - Line Length and Readability: how wide a line of text should be before reading becomes hard work.</div>
            </div>
            <Nav onBack={function(){go(4);}} onNext={function(){go(1);}} nextLabel="Restart Lesson"/>
          </div>
        )}

      </div>
    </div>
  );
}
