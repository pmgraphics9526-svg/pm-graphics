import{useState,useRef,useMemo}from"react";

const T={bg:"#FFFCF9",panel:"#FFFFFF",panel2:"#FFFFFF",border:"#FFE6D4",text:"#1B1410",muted:"#5B4E46",dim:"#5B4E46",brand:"#FF7A00",white:"#1B1410",green:"#2DC653",red:"#B7360E"};

function Card({children,style={}}){
  return <div style={{background:T.panel2,borderTop:"1px solid "+T.border,borderRight:"1px solid "+T.border,borderBottom:"1px solid "+T.border,borderLeft:"1px solid "+T.border,borderRadius:16,padding:22,...style}}>{children}</div>;
}
function Tag({children,color}){
  return <span style={{fontSize:11,letterSpacing:3,color:color||T.brand,fontWeight:700}}>{children}</span>;
}
function Nav({onBack,onNext,nextLabel,nextDisabled}){
  return(
    <div style={{display:"flex",gap:10,marginTop:28}}>
      {onBack&&<button onClick={onBack} style={{flex:1,padding:14,background:"transparent",border:"1px solid "+T.border,borderRadius:12,color:T.muted,cursor:"pointer",fontSize:14}}>Back</button>}
      <button onClick={nextDisabled?undefined:onNext} style={{flex:2,padding:14,background:nextDisabled?T.panel2:T.brand,border:"1px solid "+(nextDisabled?T.border:T.brand),borderRadius:12,color:nextDisabled?T.dim:"#0A0A0A",fontWeight:700,fontSize:14,cursor:nextDisabled?"default":"pointer"}}>{nextLabel||"Continue"}</button>
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
            <button onClick={function(){if(s.n<=step)setStep(s.n);}} style={{display:"flex",alignItems:"center",gap:5,background:step===s.n?"rgba(255,122,0,.12)":"transparent",border:"none",borderRadius:20,padding:"5px 7px",cursor:s.n<=step?"pointer":"default"}}>
              <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:step===s.n?T.brand:step>s.n?"rgba(255,122,0,.25)":T.panel2,border:"1px solid "+(step===s.n?T.brand:T.border),fontSize:9,fontWeight:700,color:step===s.n?"#0A0A0A":step>s.n?T.brand:T.dim,flexShrink:0}}>{step>s.n?"\u2713":s.n}</div>
              <span style={{fontSize:10,color:step===s.n?T.brand:step>s.n?T.muted:T.dim,whiteSpace:"nowrap"}}>{s.label}</span>
            </button>
            {i<STEPS.length-1&&<div style={{width:10,height:1,background:step>s.n?T.brand:T.border,flexShrink:0}}/>}
          </div>
        );
      })}
    </div>
  );
}

function shuffleOpts(arr){
  return arr.map(function(q){
    return Object.assign({},q,{opts:[...q.opts].sort(function(){return Math.random()-0.5;})});
  });
}

const LESSON_MODULE="COLOUR THEORY - TOPIC 07";
const LESSON_TITLE="The 60-30-10 Rule";
const LESSON_SUBTITLE="Interior Design Practice - Adopted Into Graphic Design Education";

const STORY_PARA_1="Interior designers found it first, through trial and error across thousands of rooms: a space feels balanced when one colour dominates the walls and floor, a second colour supports it in furniture and textiles, and a third colour appears only in small, deliberate touches - a cushion, a vase, a single accent wall.";
const STORY_PARA_2="Fashion stylists formalised the same instinct into an outfit rule, and graphic designers eventually borrowed it wholesale: 60 percent dominant, 30 percent secondary, 10 percent accent. Not which colours - how much of each.";
const STORY_PARA_3="The insight underneath the ratio is simple: the human eye is drawn to whatever is rarest in a composition. Make your most important colour the smallest, most careful 10 percent, and it will always get noticed - no matter how loud or quiet the colour itself actually is.";
const STORY_PROBLEM="You picked great colours, but your design still felt unbalanced - either everything screamed for attention at once, or nothing stood out at all. The 60-30-10 rule is not about which colours to pick. It is about how much of each one to use.";
const STORY_5Q=[
  {q:"What is it?",a:"A ratio for distributing colour across a design: 60 percent dominant, 30 percent secondary, 10 percent accent."},
  {q:"Why does it exist?",a:"Because even great colours feel unbalanced without a clear proportion - too much of everything competes, too little of anything disappears."},
  {q:"How does it work?",a:"The dominant colour sets the background and tone. The secondary colour builds structure. The accent colour, used sparingly, draws the eye because it is rare."},
  {q:"How will you use it?",a:"Pick your dominant first, your secondary second, and reserve your boldest colour for the smallest, most deliberate 10 percent."},
  {q:"What if you skip it?",a:"Every colour competes for attention at once, or your most important colour gets lost in too much company."},
];

const CONCEPT_SECTIONS=[
  {tag:"60% DOMINANT",tagColor:T.dim,formula:"Background, canvas, foundation",desc:"The colour that sets the overall tone of the design - background, large canvas areas. Usually neutral or near-neutral: black, white, grey, navy.",rule:"If your 60% is uncomfortable to look at, no accent colour will save the design."},
  {tag:"30% SECONDARY",tagColor:"#3EC6E0",formula:"Cards, panels, sections",desc:"The colour that creates structure and depth within the dominant field - cards, panels, secondary sections. Usually a shade or tone related to the dominant.",rule:"The 30% is what creates depth. Without it, a design feels flat."},
  {tag:"10% ACCENT",tagColor:T.brand,formula:"CTA, brand colour, highlights",desc:"The colour that carries your brand identity or call to action. Because it appears rarely, it commands attention out of proportion to its size.",rule:"If you want more emphasis on the accent, add more dominant space around it - never add more accent."},
  {tag:"WHY THE RATIO WORKS",tagColor:T.green,formula:"Rarity earns attention",desc:"The human eye is naturally drawn to whatever colour appears least often in a composition. The 60-30-10 ratio deliberately manufactures that rarity for your most important colour.",rule:"60-30-10 is a proportion, not a rule about which specific hues to choose - harmony schemes decide the hues, this decides how much of each."},
];

const QUESTION_BANK=[
  {id:"r1",q:"What does the 60% represent in the rule?",opts:["The dominant colour","The accent colour","The secondary colour","An unused colour"],ans:"The dominant colour",exp:"60% is the dominant colour - usually the background or overall canvas."},
  {id:"r2",q:"What does the 30% represent?",opts:["The secondary colour","The dominant colour","The accent colour","A random colour"],ans:"The secondary colour",exp:"30% is the secondary colour - it builds structure, like cards and panels."},
  {id:"r3",q:"What does the 10% represent?",opts:["The accent colour","The dominant colour","The secondary colour","The background"],ans:"The accent colour",exp:"10% is the accent colour - used for CTAs, highlights and brand colour."},
  {id:"r4",q:"Why should the 60% dominant colour usually be neutral or muted?",opts:["A loud dominant colour overwhelms the design and leaves no room for a clear accent","Neutral colours are cheaper to print","It is required by law","Dominant colours must always be black"],ans:"A loud dominant colour overwhelms the design and leaves no room for a clear accent",exp:"A quiet dominant creates the space needed for the accent to stand out."},
  {id:"r5",q:"Why does the 10% accent draw the eye even though it covers the least area?",opts:["The eye is naturally drawn to whatever colour is rarest in a composition","It is always the darkest colour","It is always the lightest colour","Accent colours are always bigger elements"],ans:"The eye is naturally drawn to whatever colour is rarest in a composition",exp:"Rarity, not size, is what earns visual attention here."},
  {id:"r6",q:"If a designer wants the accent colour to feel even more powerful, what should they actually increase?",opts:["The amount of dominant space around it","The amount of accent colour used","The saturation of the secondary colour","Nothing, power cannot be increased"],ans:"The amount of dominant space around it",exp:"More quiet dominant space makes the small accent feel even rarer and stronger."},
  {id:"r7",q:"The 60-30-10 rule originally came from which field before graphic design adopted it?",opts:["Interior design and fashion styling","Software engineering","Architecture blueprints only","Automotive design"],ans:"Interior design and fashion styling",exp:"Interior designers and stylists developed this ratio long before digital design borrowed it."},
  {id:"r8",q:"In a typical webpage layout, what usually plays the 60% dominant role?",opts:["The page background","The call-to-action button","A small icon","A single line of text"],ans:"The page background",exp:"The background canvas is the most common home for the dominant 60%."},
  {id:"r9",q:"In a typical webpage layout, what usually plays the 30% secondary role?",opts:["Cards and panels","The favicon","The page background","A single pixel border"],ans:"Cards and panels",exp:"Cards, panels and sections typically carry the secondary colour."},
  {id:"r10",q:"In a typical webpage layout, what usually plays the 10% accent role?",opts:["The call-to-action button","The page background","Every panel on the page","The entire navigation bar"],ans:"The call-to-action button",exp:"CTAs are a classic home for the accent colour, since they need to stand out."},
  {id:"r11",q:"What happens if the accent colour is used across 40% of a design instead of 10%?",opts:["It stops feeling rare and loses its power to stand out","It becomes twice as noticeable","Nothing changes at all","It automatically becomes the dominant colour"],ans:"It stops feeling rare and loses its power to stand out",exp:"Overusing the accent removes the rarity that made it effective in the first place."},
  {id:"r12",q:"What happens if the 60% dominant colour is too loud and saturated?",opts:["No accent colour will stand out against it, no matter how vibrant","The accent becomes even more powerful","The design automatically balances itself","Nothing, dominant colour has no effect on accent"],ans:"No accent colour will stand out against it, no matter how vibrant",exp:"A loud dominant leaves no visual quiet for the accent to contrast against."},
  {id:"r13",q:"Why is 60-30-10 described as a ratio rather than a rule about hue choice?",opts:["It controls proportion of colour used, not which specific hues to pick","It only works with exactly three named colours forever","It replaces the need for a colour wheel entirely","It only applies to black and white designs"],ans:"It controls proportion of colour used, not which specific hues to pick",exp:"60-30-10 is about how much of each colour appears, separate from which hues you chose."},
  {id:"r14",q:"A design uses four colours at roughly 25% each. Why does this violate 60-30-10?",opts:["There is no clear dominant, secondary or accent hierarchy","Four colours is always too many for any design","25% is a forbidden number","It uses too few colours"],ans:"There is no clear dominant, secondary or accent hierarchy",exp:"Without a clear proportion hierarchy, nothing reads as more or less important."},
  {id:"r15",q:"What is the core purpose of the 60-30-10 rule for a designer?",opts:["Controlling how much visual weight each colour gets","Deciding exactly which three hues must be used","Replacing the need for any colour theory","Setting font sizes across a layout"],ans:"Controlling how much visual weight each colour gets",exp:"That is the entire practical function of the ratio."},
  {id:"r16",q:"Does 60-30-10 tell you exactly which hues to pick?",opts:["No, it tells you how much of each role to use, not which specific hues","Yes, it fixes the hues permanently","Yes, but only for print design","No, it has nothing to do with colour at all"],ans:"No, it tells you how much of each role to use, not which specific hues",exp:"Hue selection comes from harmony schemes; 60-30-10 governs proportion instead."},
  {id:"r17",q:"Which design element commonly uses the 10% accent role in mobile app design?",opts:["A floating action button","The entire screen background","Every list item equally","The status bar only"],ans:"A floating action button",exp:"Prominent action buttons are a classic home for the accent colour."},
  {id:"r18",q:"Why do many premium brands rarely show their boldest brand colour across large areas?",opts:["Reserving it as the small accent keeps it powerful and rare","Large areas of colour are always more expensive to print","Bold colours cannot be reproduced digitally","There is no real reason, it is arbitrary"],ans:"Reserving it as the small accent keeps it powerful and rare",exp:"Keeping the bold colour scarce protects its ability to stand out."},
  {id:"r19",q:"What creates a sense of depth within the 60% dominant background?",opts:["The 30% secondary colour layered as panels or cards","Adding more accent colour everywhere","Removing all colour entirely","Increasing the dominant colour's saturation"],ans:"The 30% secondary colour layered as panels or cards",exp:"The secondary layer is what gives the flat dominant background structure."},
  {id:"r20",q:"A dashboard uses white as dominant, light grey as secondary and orange as accent. Which element should most likely be orange?",opts:["The primary action button","The page background","Every card border","The footer text"],ans:"The primary action button",exp:"The accent colour belongs on the single most important interactive element."},
  {id:"r21",q:"If the secondary colour is removed entirely, leaving only dominant and accent, the design risks feeling:",opts:["Flat, with no structure between background and highlight","Overly complex","Impossible to read","Automatically more balanced"],ans:"Flat, with no structure between background and highlight",exp:"The secondary layer is what gives the composition depth and hierarchy."},
  {id:"r22",q:"Amazon's interface is famously described using 60-30-10 because it is mostly:",opts:["White and grey, with a small amount of orange for actions","Entirely orange with white text","Equal thirds of red, white and blue","Entirely black with no accent at all"],ans:"White and grey, with a small amount of orange for actions",exp:"Amazon's white-grey dominant/secondary and small orange accent is a textbook example of this ratio."},
  {id:"r23",q:"Why might a designer choose the dominant colour first, before anything else?",opts:["Because it sets the overall tone that the secondary and accent must work within","Because it is the cheapest colour to produce","Because it must always be picked last","There is no reason to pick it first"],ans:"Because it sets the overall tone that the secondary and accent must work within",exp:"The dominant establishes the foundation everything else has to sit on top of."},
  {id:"r24",q:"A poster uses 10% of its area for a bright accent colour placed at the exact centre. What effect does this most likely have?",opts:["It becomes the natural focal point of the composition","It disappears into the background","It automatically becomes the dominant colour","It has no visual effect at all"],ans:"It becomes the natural focal point of the composition",exp:"A small, rare, well-placed accent naturally draws the eye first."},
  {id:"r25",q:"Which best explains why 60-30-10 is considered flexible rather than a rigid pixel-perfect law?",opts:["The exact percentages can shift slightly as long as the hierarchy of dominant, secondary and accent stays clear","It must be measured to the exact pixel every time","It only works if the numbers are exact","It applies only to physical rooms, never to screens"],ans:"The exact percentages can shift slightly as long as the hierarchy of dominant, secondary and accent stays clear",exp:"The ratio is a guideline for hierarchy, not an exact measurement requirement."},
  {id:"r26",q:"A brand wants a bold red used as its accent colour. What is the risk of also using red as the dominant background?",opts:["The accent loses its rarity and stops standing out","Nothing, using red twice always works","The design becomes automatically more balanced","Red cannot be used as an accent at all"],ans:"The accent loses its rarity and stops standing out",exp:"If the accent hue is everywhere, it is no longer rare enough to draw attention."},
  {id:"r27",q:"Which of these best fits the 30% secondary role in a mobile app?",opts:["Card backgrounds behind content","The single primary action button","The entire screen background","A single 2-pixel border"],ans:"Card backgrounds behind content",exp:"Cards are a very common home for the secondary layer."},
  {id:"r28",q:"A designer increases the accent colour from 10% to 20% because they think it needs more emphasis. What is the likely result?",opts:["The accent starts competing with the dominant instead of standing out against it","The accent automatically becomes twice as noticeable with no downside","Nothing changes at all","The dominant colour disappears"],ans:"The accent starts competing with the dominant instead of standing out against it",exp:"Doubling the accent's share erodes the very rarity that made it effective."},
  {id:"r29",q:"What is the relationship between 60-30-10 and a chosen colour harmony scheme like complementary or analogous?",opts:["Harmony decides which hues to use, 60-30-10 decides how much of each","They are the exact same concept with different names","60-30-10 replaces the need for a harmony scheme","Harmony schemes are only used for print, 60-30-10 only for screens"],ans:"Harmony decides which hues to use, 60-30-10 decides how much of each",exp:"The two work together - one picks the hues, the other decides their proportion."},
  {id:"r30",q:"Why is a 90/10 split of dominant plus secondary versus accent often the practical outcome of 60-30-10?",opts:["Because dominant and secondary together already total 90 percent, leaving 10 for the accent","Because accent colours are always exactly 90 percent","Because 90/10 is an unrelated separate rule","There is no such relationship"],ans:"Because dominant and secondary together already total 90 percent, leaving 10 for the accent",exp:"60 plus 30 equals 90 - the accent is what remains, deliberately kept small."},
  {id:"r31",q:"A minimalist brand wants an almost entirely white interface with a single orange button. This is closest to:",opts:["An intensified version of 60-30-10 with a very high dominant share","A violation of every colour rule","A pure monochromatic scheme with no accent","Impossible to describe using this rule"],ans:"An intensified version of 60-30-10 with a very high dominant share",exp:"A heavily dominant-weighted layout with a small sharp accent still follows the same underlying logic."},
  {id:"r32",q:"What is the main risk of skipping 60-30-10 entirely and picking colour amounts at random?",opts:["No clear visual hierarchy, so nothing reads as more important than anything else","The design becomes automatically more creative","Random distribution always looks more balanced","There is no risk at all"],ans:"No clear visual hierarchy, so nothing reads as more important than anything else",exp:"Without a proportion plan, every colour competes equally, and nothing leads."},
  {id:"r33",q:"Why does a designer typically pick the accent colour to match the brand's primary identity colour?",opts:["Because the accent role is the one most likely to be noticed, making it valuable brand real estate","Because the accent has no visual impact so it does not matter","Because the dominant colour is always the brand colour instead","There is no reason to align them"],ans:"Because the accent role is the one most likely to be noticed, making it valuable brand real estate",exp:"Since the accent draws the eye, it is the ideal home for a brand's key colour."},
  {id:"r34",q:"A print magazine spread uses roughly 60% white space, 30% body text grey, and 10% a bold pull-quote colour. This layout is:",opts:["An application of the 60-30-10 principle to print","Impossible in print media","A violation of typography rules","Unrelated to colour theory entirely"],ans:"An application of the 60-30-10 principle to print",exp:"60-30-10 applies across mediums, including print layouts."},
  {id:"r35",q:"Which best describes the 60% dominant colour's job in a composition?",opts:["To set a calm, quiet foundation the rest of the design can sit on","To be the loudest, most attention-grabbing element","To always be the exact brand colour","To be invisible and irrelevant to the design"],ans:"To set a calm, quiet foundation the rest of the design can sit on",exp:"The dominant's job is to be a stable, quiet base, not to compete for attention."},
  {id:"r36",q:"A designer builds a five-card dashboard where each card uses a different bold colour equally. What principle does this most likely break?",opts:["60-30-10, since there is no dominant or clear hierarchy","Warm versus cool, since all cards must be warm","Monochromatic harmony, since more than one hue is used","Tint and shade, since no white or black was mixed in"],ans:"60-30-10, since there is no dominant or clear hierarchy",exp:"Equal bold colours across every card leaves no dominant foundation or clear accent."},
  {id:"r37",q:"What is the simplest way to check if a design follows 60-30-10 reasonably well?",opts:["Squint at it and see if one colour clearly leads, one clearly supports, and one clearly highlights","Count the exact number of pixels of each colour","Check if exactly three hex codes are used","There is no way to check this visually"],ans:"Squint at it and see if one colour clearly leads, one clearly supports, and one clearly highlights",exp:"The ratio is really about a visible hierarchy, which a quick visual check can reveal."},
  {id:"r38",q:"Why might a designer deliberately break 60-30-10 for a bold, experimental art piece?",opts:["Because the rule is a guideline for typical, functional design - not an absolute law for every context","Because 60-30-10 is illegal to break","Because it only exists for print design","Because breaking it always improves any design automatically"],ans:"Because the rule is a guideline for typical, functional design - not an absolute law for every context",exp:"Like most design principles, it is a strong default, not an unbreakable rule for every situation."},
  {id:"r39",q:"A designer wants a button to feel like the single most important interactive element on a busy screen. The safest approach is:",opts:["Make it the 10% accent colour against a quiet dominant and secondary base","Make it the same colour as the dominant background","Use ten different bold colours across the screen","Remove all other colour from the screen entirely"],ans:"Make it the 10% accent colour against a quiet dominant and secondary base",exp:"This is the exact mechanism 60-30-10 relies on to create a clear focal point."},
  {id:"r40",q:"What is the relationship between the 60% and 30% colours in most well-executed designs?",opts:["They are often related tones or shades of a similar base, keeping the foundation cohesive","They are always completely unrelated random hues","They must always be the exact same hex code","There is no relationship expected between them"],ans:"They are often related tones or shades of a similar base, keeping the foundation cohesive",exp:"A related dominant and secondary keep the foundation feeling unified rather than disjointed."},
  {id:"r41",q:"In one sentence, the 60-30-10 rule is about:",opts:["How much of each colour to use, not which colours to pick","Which exact three hues every design must use","Font pairing across a layout","Image compression ratios"],ans:"How much of each colour to use, not which colours to pick",exp:"That is the complete summary of the rule's purpose."},
  {id:"r42",q:"A landing page uses a soft cream dominant, a warm beige secondary and a small burnt-orange accent for the signup button. This is:",opts:["A correct application of 60-30-10","A violation, since accent colours cannot be orange","A violation, since dominant colours must be pure white","Unrelated to the 60-30-10 principle"],ans:"A correct application of 60-30-10",exp:"This layout follows the ratio correctly - quiet dominant, related secondary, small standout accent."},
  {id:"r43",q:"Why is it risky to make the accent colour too close in value to the dominant colour?",opts:["The accent will not stand out enough to be noticed against the background","The accent will automatically become too loud","It will violate colour harmony rules","It has no effect on visibility at all"],ans:"The accent will not stand out enough to be noticed against the background",exp:"Enough contrast between accent and dominant is needed for the accent to actually be seen."},
  {id:"r44",q:"A designer wants to redesign a cluttered five-colour homepage using 60-30-10. What is the first practical step?",opts:["Decide which single colour will be the dominant background before anything else","Pick the accent colour first and build everything else around it","Remove all colour and use grayscale only","Add a sixth colour to balance things out"],ans:"Decide which single colour will be the dominant background before anything else",exp:"Establishing the dominant foundation first gives the secondary and accent something to build on."},
  {id:"r45",q:"Which of these best matches the 10% accent role: a hero image, a body paragraph, or a signup button?",opts:["A signup button","A body paragraph","A hero image","None of these can be an accent"],ans:"A signup button",exp:"A small, high-priority interactive element like a signup button is a natural accent role."},
  {id:"r46",q:"A mostly black-and-white photography portfolio site uses a single red link colour throughout. This is an example of:",opts:["A 60-30-10 style structure with black/white as dominant and secondary, red as accent","A violation, since black and white are not colours","A triadic harmony scheme","A warm versus cool composition only"],ans:"A 60-30-10 style structure with black/white as dominant and secondary, red as accent",exp:"Even a near-monochrome site can follow the same dominant/secondary/accent logic."},
  {id:"r47",q:"Why does the 60-30-10 ratio typically avoid an even three-way split like 33/33/33?",opts:["An even split removes the hierarchy that makes one colour clearly dominant and one clearly rare","33/33/33 is mathematically impossible to design with","Even splits are only used in architecture","There is no meaningful difference between the two approaches"],ans:"An even split removes the hierarchy that makes one colour clearly dominant and one clearly rare",exp:"The uneven ratio is exactly what creates a clear leader, supporter and highlight."},
  {id:"r48",q:"What is the most common mistake beginners make when first applying 60-30-10?",opts:["Using too much of the accent colour because they like it the most","Using too little of the dominant colour","Skipping the secondary colour on purpose","Using only one colour for the whole design"],ans:"Using too much of the accent colour because they like it the most",exp:"It is tempting to overuse a favourite colour, but that removes its rarity and impact."},
  {id:"r49",q:"The core practical value of 60-30-10 for a designer is:",opts:["A reliable proportion guideline that creates clear visual hierarchy with any set of colours","A fixed list of three colours every project must use","A rule that only applies to logos","A replacement for choosing a colour harmony scheme"],ans:"A reliable proportion guideline that creates clear visual hierarchy with any set of colours",exp:"That is the entire practical value of this lesson's principle."},
  {id:"r50",q:"In one sentence, the 60-30-10 rule works because:",opts:["Rarity earns attention - the smallest, most careful colour share gets noticed first","Bright colours always win regardless of amount used","More colour always means more visual interest","Every colour deserves equal screen space"],ans:"Rarity earns attention - the smallest, most careful colour share gets noticed first",exp:"That is the underlying psychological mechanism the entire ratio is built on."},
];

const CB_TYPE="topic";
const CB_QUESTIONS=[
  {q:"What does the 60% represent?",opts:["The dominant colour","The accent colour","The secondary colour","Nothing specific"],ans:"The dominant colour",exp:"60% is the dominant background/foundation colour."},
  {q:"What does the 30% represent?",opts:["The secondary colour","The dominant colour","The accent colour","A random colour"],ans:"The secondary colour",exp:"30% builds structure - cards, panels, sections."},
  {q:"What does the 10% represent?",opts:["The accent colour","The dominant colour","The secondary colour","The background"],ans:"The accent colour",exp:"10% is the rare, attention-grabbing accent, like a CTA."},
  {q:"Why should the dominant colour usually stay neutral or quiet?",opts:["A loud dominant leaves no room for the accent to stand out","Neutral colours are legally required","It must always be black","There is no reason"],ans:"A loud dominant leaves no room for the accent to stand out",exp:"A quiet foundation is what lets the small accent actually pop."},
  {q:"Why does the small accent colour draw the eye first?",opts:["Because it is the rarest colour in the composition","Because it is always the biggest element","Because it is always the darkest colour","There is no reason, it is random"],ans:"Because it is the rarest colour in the composition",exp:"Rarity, not size, is what earns visual attention here."},
  {q:"To make an accent feel more powerful, a designer should increase:",opts:["The dominant space around it","The amount of accent colour used","The secondary colour's saturation","Nothing can increase its power"],ans:"The dominant space around it",exp:"More quiet space around the accent makes it feel rarer and stronger."},
  {q:"60-30-10 originally came from which field?",opts:["Interior design and fashion styling","Software development","Automotive engineering","Music production"],ans:"Interior design and fashion styling",exp:"The ratio was developed in physical spaces and outfits before graphic design borrowed it."},
  {q:"In a typical webpage, the 60% dominant role usually belongs to:",opts:["The page background","The CTA button","A single icon","The favicon"],ans:"The page background",exp:"Background canvas is the most common home for the dominant share."},
  {q:"In a typical webpage, the 30% secondary role usually belongs to:",opts:["Cards and panels","The page background","A single button","The page title only"],ans:"Cards and panels",exp:"Cards and panels are the classic home for the secondary colour."},
  {q:"In a typical webpage, the 10% accent role usually belongs to:",opts:["The call-to-action button","The entire background","Every card equally","The footer"],ans:"The call-to-action button",exp:"CTAs need to stand out, making them a natural home for the accent."},
  {q:"Using the accent colour across 40% of a design instead of 10% risks:",opts:["It stops feeling rare and loses its impact","It becomes twice as effective","Nothing changes","It becomes the new dominant automatically with no downside"],ans:"It stops feeling rare and loses its impact",exp:"Overuse removes the very scarcity that made the accent effective."},
  {q:"A design with four colours at roughly 25 percent each breaks 60-30-10 because:",opts:["There is no clear hierarchy of dominant, secondary and accent","Four colours is always illegal in design","25 percent is a forbidden number","It uses too few colours overall"],ans:"There is no clear hierarchy of dominant, secondary and accent",exp:"An even split removes the clear leader-supporter-highlight structure the ratio relies on."},
  {q:"Does 60-30-10 dictate which specific hues to use?",opts:["No, it dictates proportion, not hue choice","Yes, it fixes three specific hues forever","Yes, but only for logos","No, it has nothing to do with colour"],ans:"No, it dictates proportion, not hue choice",exp:"Hue choice comes from a harmony scheme; 60-30-10 governs how much of each is used."},
  {q:"Amazon's interface is a well-known example of 60-30-10 because it is mostly:",opts:["White and grey, with a small amount of orange for action","Fully orange with white accents","Equal thirds of three bold colours","Entirely black and white with no accent"],ans:"White and grey, with a small amount of orange for action",exp:"Amazon's dominant white/grey plus small orange accent is a textbook example."},
  {q:"What creates depth inside the dominant background layer?",opts:["The 30% secondary colour, layered as panels","Adding more accent colour everywhere","Removing colour entirely","Increasing the dominant's saturation"],ans:"The 30% secondary colour, layered as panels",exp:"The secondary layer adds the structure that keeps a flat dominant field from feeling empty."},
  {q:"Which best fits the 30% secondary role in a mobile app?",opts:["Card backgrounds behind content","The single primary action button","The entire screen background","A one-pixel border only"],ans:"Card backgrounds behind content",exp:"Cards are a very common home for the secondary layer."},
  {q:"Why do premium brands often reserve their boldest colour for the small accent role?",opts:["Keeping it rare protects its power to stand out","Bold colours are more expensive to print at scale","Bold colours cannot legally be used as dominant","There is no reason for this pattern"],ans:"Keeping it rare protects its power to stand out",exp:"Scarcity is exactly what preserves an accent colour's visual power."},
  {q:"What is the relationship between a chosen harmony scheme and 60-30-10?",opts:["Harmony picks the hues, 60-30-10 decides how much of each to use","They are identical concepts","60-30-10 replaces harmony schemes entirely","Harmony only applies to print, 60-30-10 only to screens"],ans:"Harmony picks the hues, 60-30-10 decides how much of each to use",exp:"The two principles work together, covering different decisions."},
  {q:"A designer increases an accent from 10% to 20% for more emphasis. Likely result:",opts:["It starts competing with the dominant instead of standing out","It becomes automatically twice as effective with no downside","The dominant colour disappears entirely","Nothing changes at all"],ans:"It starts competing with the dominant instead of standing out",exp:"Doubling the accent's share erodes the scarcity that made it effective."},
  {q:"Why is a 90/10 split (dominant plus secondary versus accent) often the practical outcome?",opts:["60 plus 30 already totals 90, leaving 10 for the accent","90/10 is an unrelated separate rule","Accent colours are always exactly 90 percent","There is no such relationship"],ans:"60 plus 30 already totals 90, leaving 10 for the accent",exp:"The math of the ratio naturally leaves a small remainder for the accent."},
  {q:"The safest first step when redesigning a cluttered multi-colour page with 60-30-10 is to:",opts:["Decide the single dominant background colour first","Pick the accent colour first, then work backward","Remove all colour from the page","Add another colour to balance things"],ans:"Decide the single dominant background colour first",exp:"The dominant sets the foundation that everything else builds from."},
  {q:"Why is it risky to make the accent too close in value to the dominant?",opts:["It will not stand out enough to be noticed","It will automatically become too loud","It breaks harmony rules regardless of value","It has no effect on visibility"],ans:"It will not stand out enough to be noticed",exp:"Sufficient contrast is needed for the accent to actually register as different."},
  {q:"Why does 60-30-10 typically avoid an even 33/33/33 split?",opts:["An even split removes the hierarchy that makes one colour clearly rare and important","33/33/33 is mathematically invalid","Even splits are only used in architecture","There is no real difference"],ans:"An even split removes the hierarchy that makes one colour clearly rare and important",exp:"The uneven ratio is exactly what creates a clear leader and a clear highlight."},
  {q:"What is the most common beginner mistake with 60-30-10?",opts:["Overusing the accent colour because they like it the most","Underusing the dominant colour slightly","Skipping the secondary colour entirely on purpose","Using only one colour throughout"],ans:"Overusing the accent colour because they like it the most",exp:"It is tempting to lean on a favourite colour, but that removes its rarity and power."},
  {q:"The core practical value of 60-30-10 is:",opts:["A reliable proportion guideline that creates clear hierarchy with any colour set","A fixed list of exactly three colours for every project","A rule that only applies to logo design","A replacement for choosing hues at all"],ans:"A reliable proportion guideline that creates clear hierarchy with any colour set",exp:"That is the entire practical value of this lesson's ratio."},
];

const BRAND_BANK=[
  {name:"Amazon",c1:"#FFFFFF",c2:"#FF9900",hint:"A mostly white and light-grey interface with a small amount of orange used only for buy buttons and key highlights",ans:"10",exp:"Amazon's orange sits at roughly the 10% accent role - white and grey dominate almost everything else."},
  {name:"Spotify",c1:"#191414",c2:"#1DB954",hint:"A mostly black interface with a smaller amount of vivid green used for play buttons and highlights",ans:"10",exp:"Spotify's green functions as the accent, appearing in a small, deliberate share of the interface."},
  {name:"Notion",c1:"#FFFFFF",c2:"#000000",hint:"An almost entirely white and near-black text interface with virtually no bright accent colour used at all",ans:"0",exp:"Notion intentionally minimises accent colour, relying almost entirely on the dominant and secondary neutrals."},
  {name:"Duolingo",c1:"#FFFFFF",c2:"#58CC02",hint:"A mostly white interface with green used more broadly across buttons, mascots and progress bars, not just a tiny highlight",ans:"30",exp:"Duolingo's green plays closer to a 30% secondary role - it appears more often than a typical 10% accent."},
  {name:"Slack",c1:"#FFFFFF",c2:"#4A154B",hint:"A mostly white and light-grey workspace with aubergine purple used broadly across the sidebar, not just a small highlight",ans:"30",exp:"Slack's aubergine plays a secondary structural role across large sidebar areas, more than a small accent."},
  {name:"Stripe",c1:"#FFFFFF",c2:"#635BFF",hint:"A mostly white and light-grey dashboard with purple used sparingly for primary buttons and key highlights",ans:"10",exp:"Stripe's purple sits close to the 10% accent role, reserved for the most important actions."},
  {name:"Netflix",c1:"#000000",c2:"#E50914",hint:"An almost entirely black interface with red used sparingly for the logo and a few key buttons",ans:"10",exp:"Netflix's red functions as a small, rare accent against an overwhelmingly black dominant field."},
  {name:"Airbnb",c1:"#FFFFFF",c2:"#FF5A5F",hint:"A mostly white interface with coral used moderately across buttons, icons and highlights throughout the app",ans:"30",exp:"Airbnb's coral appears more broadly than a tiny accent, functioning closer to a secondary structural colour."},
  {name:"Trello",c1:"#FFFFFF",c2:"#0079BF",hint:"A blue header bar and board background covering a large portion of the screen, with white cards layered on top",ans:"60",exp:"Trello's blue covers such a large share of the screen that it functions as the dominant colour, not an accent."},
  {name:"Dropbox",c1:"#FFFFFF",c2:"#0061FF",hint:"A mostly white interface with blue used sparingly for the primary action button and small highlights",ans:"10",exp:"Dropbox blue sits close to the 10% accent role, reserved for key actions."},
  {name:"Headspace",c1:"#F4E7D9",c2:"#FF8C42",hint:"A soft cream background covering most of the screen, with orange illustrations and accents appearing occasionally",ans:"60",exp:"Headspace's cream functions as the dominant background, covering the majority of the interface."},
  {name:"McDonald's app",c1:"#FFFFFF",c2:"#DA291C",hint:"A mostly white interface with red used broadly for headers, buttons and branding throughout, not just a single highlight",ans:"30",exp:"McDonald's red plays a secondary structural role across many elements, more than a small accent."},
  {name:"Linear",c1:"#000000",c2:"#5E6AD2",hint:"A near-black interface covering almost the entire screen, with a purple-blue used only for small highlights and links",ans:"60",exp:"Linear's near-black functions as the dominant colour, covering the vast majority of the interface."},
  {name:"Target",c1:"#FFFFFF",c2:"#CC0000",hint:"A mostly white app background with red used sparingly for the bullseye logo and select action buttons",ans:"10",exp:"Target's red is reserved as a small, deliberate accent against a mostly white dominant field."},
  {name:"Figma",c1:"#FFFFFF",c2:"#0ACF83",hint:"A mostly white and light-grey canvas with green appearing only in small toolbar highlights and icons",ans:"10",exp:"Figma's green functions as a small accent against a dominant white and grey canvas."},
];

const TAKEAWAY_QUOTE="Sixty percent sets the mood. Thirty percent builds the structure. Ten percent earns the attention.";
const TAKEAWAY_POINTS=[
  {t:"Pick the dominant first, always",b:"Every other decision - secondary, accent - depends on the foundation the dominant colour sets. Choose it before anything else."},
  {t:"Protect your accent's rarity",b:"The accent works because it is scarce. The moment it starts appearing everywhere, it stops earning any special attention."},
  {t:"This ratio is proportion, not hue",b:"60-30-10 does not tell you which colours to pick - a harmony scheme does that. This tells you how much of each one to use."},
];

const SOURCES=[
  "Interior design and fashion styling practice, formalised into graphic design education as the 60-30-10 proportion rule.",
];

export default function CT07SixtyThirtyTen(){
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
  const[c60,setC60]=useState("#0A0A0A");
  const[c30,setC30]=useState("#1A1A1A");
  const[c10,setC10]=useState("#FF7A00");
  const top=useRef(null);
  function go(n){setStep(n);if(top.current)top.current.scrollIntoView({behavior:"smooth"});}

  const QS=useMemo(function(){
    return shuffleOpts([...QUESTION_BANK].sort(function(){return Math.random()-0.5;}).slice(0,10));
  },[]);
  const CB_SET=useMemo(function(){
    return shuffleOpts([...CB_QUESTIONS].sort(function(){return Math.random()-0.5;}).slice(0,5));
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
      <div style={{width:"100%",maxWidth:1200,boxSizing:"border-box",padding:"0 48px",margin:"0 auto"}}>

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
              <div style={{background:"#FFF0F2",border:"1px solid #FFE0E3",borderRadius:10,padding:14}}>
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
                    <div key={item.q} style={{background:T.panel,borderRadius:10,padding:12,display:"flex",gap:12,alignItems:"flex-start"}}>
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
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 0"}}>Three colours. Three roles. One ratio.</p>
            </Card>
            {CONCEPT_SECTIONS.map(function(s){
              return(
                <Card key={s.tag} style={{marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                    <Tag color={s.tagColor}>{s.tag}</Tag>
                    <span style={{fontSize:12,color:T.dim}}>{s.formula}</span>
                  </div>
                  <p style={{fontSize:13.5,color:T.muted,lineHeight:1.65,margin:"0 0 8px"}}>{s.desc}</p>
                  <div style={{fontSize:12.5,color:T.dim,background:T.panel,borderRadius:8,padding:"7px 10px"}}>{s.rule}</div>
                </Card>
              );
            })}
            <Card style={{marginBottom:14}}>
              <Tag color={T.brand}>EXPLORE - LIVE LAYOUT</Tag>
              <p style={{fontSize:13,color:T.muted,lineHeight:1.6,margin:"10px 0 14px"}}>Pick your three colours and see a layout following 60-30-10 exactly.</p>
              <div style={{display:"flex",gap:10,marginBottom:16}}>
                {[[c60,setC60,"60%","Dominant"],[c30,setC30,"30%","Secondary"],[c10,setC10,"10%","Accent"]].map(function(row){
                  const v=row[0],set=row[1],pct=row[2],lbl=row[3];
                  return(
                    <label key={pct} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                      <input type="color" value={v} onChange={function(e){set(e.target.value);}} style={{width:"100%",height:40,border:"none",background:"none",cursor:"pointer",borderRadius:8}}/>
                      <span style={{fontSize:11,fontWeight:700,color:T.brand}}>{pct}</span>
                      <span style={{fontSize:10,color:T.muted}}>{lbl}</span>
                    </label>
                  );
                })}
              </div>
              <div style={{background:c60,borderRadius:14,padding:16}}>
                <div style={{background:c30,borderRadius:10,padding:14,marginBottom:10}}>
                  <div style={{height:8,width:"55%",borderRadius:4,background:c10,marginBottom:8}}/>
                  <div style={{height:7,width:"80%",borderRadius:4,background:c60,opacity:.3}}/>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:3,background:c30,borderRadius:10,padding:10}}><div style={{height:7,width:"70%",borderRadius:4,background:c60,opacity:.3}}/></div>
                  <div style={{flex:2,background:c10,borderRadius:10,padding:10,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:10,fontWeight:700,color:c60,opacity:.7}}>CTA</span></div>
                </div>
              </div>
            </Card>
            <Nav onBack={function(){go(1);}} onNext={function(){go(3);}} nextLabel="Test yourself"/>
          </div>
        )}

        {step===3&&(
          <div>
            <Card style={{marginBottom:18,borderLeft:"4px solid "+T.brand}}>
              <Tag>PLAY - 10 QUESTIONS</Tag>
              <p style={{fontSize:16,color:T.white,lineHeight:1.65,margin:"10px 0 6px"}}>Answer all 10. Each correct = 5 points. Answer is locked on selection.</p>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10}}>
                <div style={{flex:1,height:6,background:T.panel,borderRadius:3,overflow:"hidden"}}>
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
                      let bg=T.panel2,bc=T.border,fc=T.muted;
                      if(isRev){
                        if(isCorrectOpt){bg="rgba(45,198,83,.12)";bc=T.green;fc=T.green;}
                        else if(isPicked){bg="rgba(233,69,96,.12)";bc=T.red;fc=T.red;}
                      } else if(isPicked){bg="rgba(255,122,0,.15)";bc=T.brand;fc=T.brand;}
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
                      style={{width:"100%",padding:12,background:T.brand,border:"none",borderRadius:10,color:"#0A0A0A",fontWeight:700,cursor:"pointer",fontSize:14,marginTop:12}}>Reveal answer</button>
                  )}
                  {isRev&&(
                    <div style={{background:correct?"rgba(45,198,83,.06)":"rgba(233,69,96,.06)",border:"1px solid "+(correct?T.green:T.red),borderRadius:10,padding:14,marginTop:12}}>
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
                <div style={{flex:1,height:5,background:T.panel,borderRadius:3,overflow:"hidden"}}>
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
                <Card key={"cb"+qi} style={{marginBottom:14,opacity:myDone?0.65:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <Tag color={myDone?(isCorrect?T.green:T.red):T.brand}>{"B"+(qi+1)+" of 5"}</Tag>
                    {myDone&&<span style={{fontSize:12,color:isCorrect?T.green:T.red,fontWeight:700}}>{isCorrect?"+5 pts":"0 pts"}</span>}
                  </div>
                  <p style={{fontSize:14,color:T.white,lineHeight:1.6,margin:"0 0 12px",fontWeight:500}}>{q.q}</p>
                  <div style={{display:"flex",flexDirection:"column",gap:7}}>
                    {q.opts.map(function(opt){
                      const isPicked=myAns===opt;
                      const isCorrectOpt=opt===q.ans;
                      let bg=T.panel,bc=T.border,fc=T.muted;
                      if(myDone){
                        if(isCorrectOpt){bg="rgba(45,198,83,.12)";bc=T.green;fc=T.green;}
                        else if(isPicked){bg="rgba(233,69,96,.12)";bc=T.red;fc=T.red;}
                      } else if(isPicked){bg="rgba(255,122,0,.15)";bc=T.brand;fc=T.brand;}
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
                    <div style={{background:isCorrect?"rgba(45,198,83,.08)":"rgba(233,69,96,.08)",border:"1px solid "+(isCorrect?T.green:T.red),borderRadius:10,padding:12,marginTop:10}}>
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
                <Card key={"cc"+qi} style={{marginBottom:14,opacity:myDone?0.65:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <Tag color={myDone?(isCorrect?T.green:T.red):T.brand}>{"C"+(qi+1)+" of 5 - Real Brand"}</Tag>
                    {myDone&&<span style={{fontSize:12,color:isCorrect?T.green:T.red,fontWeight:700}}>{isCorrect?"+5 pts":"0 pts"}</span>}
                  </div>
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.6,margin:"0 0 12px"}}>Roughly what role does the second colour play in this brand's interface?</p>
                  <div style={{display:"flex",gap:10,marginBottom:8}}>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c1,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid "+T.border}}><span style={{fontSize:10,color:"rgba(0,0,0,.4)"}}>COLOUR 1</span></div>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c2,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>COLOUR 2</span></div>
                  </div>
                  <p style={{fontSize:11,color:T.dim,margin:"0 0 12px"}}>Hint: {brand.hint}</p>
                  {!myRev&&(
                    <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
                      {["60","30","10","0"].map(function(opt){
                        return(
                          <button key={opt}
                            onClick={function(){if(!myAns){const n=Object.assign({},ccAnswers);n[qi]=opt;setCcAnswers(n);}}}
                            style={{padding:"10px 14px",background:myAns===opt?"rgba(255,122,0,.15)":T.panel,border:"1px solid "+(myAns===opt?T.brand:T.border),borderRadius:10,color:myAns===opt?T.brand:T.muted,cursor:myAns?"default":"pointer",textAlign:"left",fontSize:13.5}}
                          >{"Roughly "+opt+"% role"}</button>
                        );
                      })}
                      {myAns&&<button onClick={function(){const n=Object.assign({},ccRevealed);n[qi]=true;setCcRevealed(n);}} style={{padding:11,background:T.brand,border:"none",borderRadius:10,color:"#0A0A0A",fontWeight:700,cursor:"pointer",fontSize:14,marginTop:4}}>Reveal answer</button>}
                    </div>
                  )}
                  {myRev&&(
                    <div style={{background:isCorrect?"rgba(45,198,83,.08)":"rgba(233,69,96,.08)",border:"1px solid "+(isCorrect?T.green:T.red),borderRadius:12,padding:14}}>
                      <div style={{fontWeight:700,color:isCorrect?T.green:T.red,marginBottom:6}}>{isCorrect?"Correct! +5 pts":"Wrong - 0 pts. Answer: roughly "+brand.ans+"% role"}</div>
                      <div style={{fontWeight:700,color:T.white,marginBottom:4}}>This is {brand.name}.</div>
                      <div style={{fontSize:13,color:T.muted,lineHeight:1.65,marginBottom:10}}>{brand.exp}</div>
                      {!myDone&&<button onClick={function(){const n=Object.assign({},ccAnswered);n[qi]=true;setCcAnswered(n);setCcIdx(qi+1);if(qi===4)setCcDone(true);}} style={{padding:"8px 18px",background:T.green,border:"none",borderRadius:8,color:"#0A0A0A",fontWeight:700,fontSize:13,cursor:"pointer"}}>Next</button>}
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
                    <div style={{width:32,height:32,borderRadius:8,background:"rgba(255,122,0,.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
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
            <Nav onBack={function(){go(4);}} onNext={function(){go(1);}} nextLabel="Lesson Complete"/>
          </div>
        )}

      </div>
    </div>
  );
}
