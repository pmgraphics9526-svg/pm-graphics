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

const LESSON_MODULE="COLOUR THEORY - TOPIC 03";
const LESSON_TITLE="Tint, Tone and Shade";
const LESSON_SUBTITLE="Johannes Itten 1961 - Bauhaus Colour Education";

const STORY_PARA_1="Renaissance painters faced a problem no single pot of pigment could solve: how do you paint light falling across a red robe, or shadow pooling in its folds, without breaking the illusion that it is still the same red robe? The pigment straight from the source gives one intensity. A folded, lit, shadowed world needs dozens.";
const STORY_PARA_2="The solution came from centuries of studio practice, not theory. Mix white into the pigment and it lifts into light. Mix black in and it sinks into shadow. Mix grey in and it mutes into the middle distance. The hue never changes identity - only its lightness and intensity move.";
const STORY_PARA_3="At the Bauhaus, Johannes Itten took this old studio habit and turned it into a teachable system for design students: three operations, three names - tint, tone, shade - that any designer could apply to any hue on purpose, instead of by accident.";
const STORY_PROBLEM="You picked a brand colour, then needed a lighter version for a hover state or a darker one for a heading - and just guessed, dragging a colour picker blindly until something looked okay. Tint, Tone and Shade replace that guess with a rule.";
const STORY_5Q=[
  {q:"What is it?",a:"Three ways to modify one pure hue: add white for a tint, add grey for a tone, add black for a shade."},
  {q:"Why does it exist?",a:"A pure hue is too intense to use everywhere. Tint, tone and shade let one hue stretch across an entire design without losing its identity."},
  {q:"How does it work?",a:"White lightens (tint). Grey mutes (tone). Black darkens (shade). The hue underneath stays the same the whole time."},
  {q:"How will you use it?",a:"Build an entire palette - backgrounds, hover states, text, borders - from one brand hue instead of picking random extra colours."},
  {q:"What if you skip it?",a:"Your extra colours will not feel related to your brand hue. The palette reads as disconnected, not designed."},
];

const CONCEPT_SECTIONS=[
  {tag:"TINT",formula:"Hue + White",tagColor:T.brand,desc:"Adding white lightens a hue and lowers its intensity. Tints feel soft, approachable, airy. They are the natural choice for backgrounds, hover states and large calm surfaces.",rule:"Stop before 90% white - past that point the hue disappears and you are left with plain white."},
  {tag:"TONE",formula:"Hue + Grey",tagColor:"#B0B0B0",desc:"Adding grey mutes a hue without changing how light or dark it is. Tones feel sophisticated, quiet, grown-up. Most premium brands live here far more than in their pure hue.",rule:"Tone is the version of a colour you can stare at for hours without it feeling loud."},
  {tag:"SHADE",formula:"Hue + Black",tagColor:"#3A2410",desc:"Adding black darkens a hue and deepens it. Shades feel serious, rich, weighty. Good for body text, dark-mode surfaces and creating depth against lighter tints.",rule:"Too much black and the hue turns muddy - you lose the colour before you gain the darkness."},
  {tag:"THE LADDER",formula:"One Hue -> Full Palette",tagColor:T.green,desc:"A single brand hue, run through a ladder of tints, tones and shades, produces every background, surface, hover and text colour a project needs - all visibly related to each other.",rule:"If two colours in your design do not sit on the same ladder, ask why they exist at all."},
];

function mix(hex,target,amt){
  const h=hex.replace("#","");const r1=parseInt(h.substring(0,2),16),g1=parseInt(h.substring(2,4),16),b1=parseInt(h.substring(4,6),16);
  const t=target.replace("#","");const r2=parseInt(t.substring(0,2),16),g2=parseInt(t.substring(2,4),16),b2=parseInt(t.substring(4,6),16);
  const r=Math.round(r1+(r2-r1)*amt),g=Math.round(g1+(g2-g1)*amt),b=Math.round(b1+(b2-b1)*amt);
  const toHex=function(n){return n.toString(16).padStart(2,"0");};
  return "#"+toHex(r)+toHex(g)+toHex(b);
}

const QUESTION_BANK=[
  {id:"t1",q:"What does a tint add to a pure hue?",opts:["White","Black","Grey","Nothing"],ans:"White",exp:"A tint is hue plus white. It lightens and softens the colour."},
  {id:"t2",q:"What does a shade add to a pure hue?",opts:["White","Black","Grey","Another hue"],ans:"Black",exp:"A shade is hue plus black. It darkens and deepens the colour."},
  {id:"t3",q:"What does a tone add to a pure hue?",opts:["White","Black","Grey","Water"],ans:"Grey",exp:"A tone is hue plus grey. It mutes the colour without much lightness change."},
  {id:"t4",q:"Which of the three feels the most sophisticated and muted?",opts:["Tint","Shade","Tone","Pure hue"],ans:"Tone",exp:"Tones read as quiet and grown-up because grey suppresses intensity without pushing to an extreme."},
  {id:"t5",q:"Which of the three feels the most airy and approachable?",opts:["Tint","Shade","Tone","Pure hue"],ans:"Tint",exp:"Tints are light and soft, ideal for backgrounds and calm large surfaces."},
  {id:"t6",q:"Which of the three feels the most serious and rich?",opts:["Tint","Shade","Tone","Pure hue"],ans:"Shade",exp:"Shades are darker and weightier, good for text and depth."},
  {id:"t7",q:"You mix a hue with 95% white. What is the risk?",opts:["The hue becomes unreadable and looks like plain white","Nothing, more white is always better","It becomes a shade","It becomes fully saturated"],ans:"The hue becomes unreadable and looks like plain white",exp:"Past roughly 90% white the original hue is lost entirely."},
  {id:"t8",q:"A brand colour used for hover-state backgrounds is usually a:",opts:["Shade","Tint","Complementary hue","Pure hue at full saturation"],ans:"Tint",exp:"Light, soft tints are the standard choice for subtle interactive backgrounds."},
  {id:"t9",q:"A brand colour used for body text on a light background is usually a:",opts:["Tint","Shade","Pure hue","Tone at 50 percent"],ans:"Shade",exp:"Darker shades give the contrast and weight text needs to stay readable."},
  {id:"t10",q:"Which operation changes a hue least in lightness but most in intensity?",opts:["Tone","Tint","Shade","Hue shift"],ans:"Tone",exp:"Grey desaturates without pushing strongly toward light or dark."},
  {id:"t11",q:"Johannes Itten taught tint, tone and shade as part of which movement?",opts:["Bauhaus","Impressionism","Art Deco","Cubism"],ans:"Bauhaus",exp:"Itten formalised these operations into a teachable system at the Bauhaus."},
  {id:"t12",q:"Renaissance painters used tint and shade mainly to paint:",opts:["Light and shadow on the same object","Different objects in different colours","Flat single-tone backgrounds","Black and white sketches"],ans:"Light and shadow on the same object",exp:"They needed one hue to read as both lit and shadowed without losing its identity."},
  {id:"t13",q:"What stays constant across a tint, tone and shade of the same hue?",opts:["The underlying hue identity","The saturation","The lightness","The exact hex code"],ans:"The underlying hue identity",exp:"Tint, tone and shade all keep the same base hue - only lightness or intensity move."},
  {id:"t14",q:"A full palette built from tint, tone and shade of one hue is called:",opts:["A ladder","A wheel","A triad","A split complement"],ans:"A ladder",exp:"Running one hue through white, grey and black mixes builds a usable ladder of related colours."},
  {id:"t15",q:"Which mix would you use for a dark-mode card surface built from a blue brand colour?",opts:["Blue shade","Blue tint","Pure blue","Blue tone at 10 percent grey"],ans:"Blue shade",exp:"Dark surfaces need darkened, shaded versions of the hue to sit against a black background."},
  {id:"t16",q:"Too much black mixed into a hue causes it to look:",opts:["Muddy and unreadable","Brighter","More saturated","Warmer"],ans:"Muddy and unreadable",exp:"Excess black overwhelms the hue and the colour loses definition."},
  {id:"t17",q:"Which is NOT one of the three operations in this lesson?",opts:["Rotate","Tint","Tone","Shade"],ans:"Rotate",exp:"Rotating around the colour wheel changes the hue itself - that is a different operation, not covered here."},
  {id:"t18",q:"A pastel colour palette is built mostly from:",opts:["Tints","Shades","Tones","Complements"],ans:"Tints",exp:"Pastels are hues lightened heavily with white - classic tints."},
  {id:"t19",q:"A moody, muted editorial colour palette is built mostly from:",opts:["Tones","Tints","Pure hues","Neon shades"],ans:"Tones",exp:"Muted, greyed-down colours are tones - common in premium and editorial design."},
  {id:"t20",q:"A luxury, dramatic colour palette is built mostly from:",opts:["Shades","Tints","Tones","Pure primary hues"],ans:"Shades",exp:"Deep, darkened hues read as rich and luxurious."},
  {id:"t21",q:"If you keep adding both white and black to a hue equally, what happens?",opts:["It moves toward a mid grey with faint hue left","It becomes a tint","It becomes a shade","It stays fully saturated"],ans:"It moves toward a mid grey with faint hue left",exp:"Equal white and black is close to a grey tone mix - it neutralises the hue toward grey."},
  {id:"t22",q:"Why is a tone often preferred over a pure hue in professional interfaces?",opts:["It is easier on the eye across large areas","It costs less to print","It has no hue at all","It is always the brand's exact hex"],ans:"It is easier on the eye across large areas",exp:"Muted tones are comfortable to look at for long periods, unlike loud pure hues."},
  {id:"t23",q:"What is the main visual difference between a tone and a shade of the same hue?",opts:["Tone is muted, shade is darkened","Tone is darker, shade is lighter","They are identical","Tone changes the hue, shade does not"],ans:"Tone is muted, shade is darkened",exp:"Tone mixes in grey (desaturates); shade mixes in black (darkens)."},
  {id:"t24",q:"A designer wants five background variants from one brand hue for a card system. This is best solved with:",opts:["A tint and tone ladder","A completely new hue for each card","Random colour picker guesses","One flat colour repeated everywhere"],ans:"A tint and tone ladder",exp:"A ladder of related tints and tones gives visual variety while staying on-brand."},
  {id:"t25",q:"Which of these is closest to a true tone (not tint or shade)?",opts:["Dusty rose from red","Baby pink from red","Maroon from red","Bright red at full saturation"],ans:"Dusty rose from red",exp:"Dusty, muted colours like dusty rose are greyed-down tones of a hue."},
  {id:"t26",q:"Which of these is closest to a true shade (not tint or tone)?",opts:["Maroon from red","Baby pink from red","Dusty rose from red","Coral from red"],ans:"Maroon from red",exp:"Maroon is red darkened with black - a shade."},
  {id:"t27",q:"Which of these is closest to a true tint (not tone or shade)?",opts:["Baby pink from red","Maroon from red","Dusty rose from red","Brick red"],ans:"Baby pink from red",exp:"Baby pink is red lightened with white - a tint."},
  {id:"t28",q:"In UI design, disabled button states are commonly shown using:",opts:["A muted tone or light tint of the brand hue","The brightest possible shade","A completely unrelated hue","Pure black only"],ans:"A muted tone or light tint of the brand hue",exp:"Disabled states use a softened version of the brand colour to signal inactivity while staying on-brand."},
  {id:"t29",q:"What happens to saturation as you move from pure hue to tint?",opts:["Saturation decreases as white increases","Saturation increases","Saturation stays exactly the same","Hue changes completely"],ans:"Saturation decreases as white increases",exp:"Adding white dilutes the pure hue, lowering its saturation as it lightens."},
  {id:"t30",q:"What happens to lightness as you move from pure hue to shade?",opts:["Lightness decreases as black increases","Lightness increases","Lightness stays exactly the same","Hue changes completely"],ans:"Lightness decreases as black increases",exp:"Adding black darkens the colour, lowering lightness."},
  {id:"t31",q:"Why do most brand style guides show a strip of five to nine swatches per colour?",opts:["That strip is usually a tint/tone/shade ladder for that hue","It is required by law","It has nothing to do with tint tone or shade","Every swatch is a totally different hue"],ans:"That strip is usually a tint/tone/shade ladder for that hue",exp:"Style guide colour ramps are almost always tint-to-shade ladders of one base hue."},
  {id:"t32",q:"Which mix would create a soft, calm background for a wellness app using a green brand hue?",opts:["Green tint","Green shade","Pure saturated green","Green complement"],ans:"Green tint",exp:"Light tints create the soft, calm feeling wellness apps aim for."},
  {id:"t33",q:"Which mix would create a premium, muted look for a fashion brand using a burgundy hue?",opts:["Burgundy tone","Burgundy tint","Pure burgundy","Burgundy shade only"],ans:"Burgundy tone",exp:"A muted tone reads as refined and premium rather than loud."},
  {id:"t34",q:"If a designer says a colour looks washed out and pale, they most likely mean it is a:",opts:["Heavy tint","Heavy shade","Heavy tone","Pure hue"],ans:"Heavy tint",exp:"Washed out and pale describe a hue with a large amount of white mixed in."},
  {id:"t35",q:"If a designer says a colour looks dirty or flat, they most likely mean it is a:",opts:["Tone with too much grey","A pure hue","A light tint","A vivid shade"],ans:"Tone with too much grey",exp:"Overly greyed tones can start reading as dirty or lifeless rather than sophisticated."},
  {id:"t36",q:"Which single change turns a shade back toward the pure hue?",opts:["Removing black from the mix","Adding more black","Adding grey","Adding white past 50 percent"],ans:"Removing black from the mix",exp:"Reducing the amount of black mixed in moves the colour back toward its pure hue."},
  {id:"t37",q:"A tint, tone and shade of the same hue placed side by side will:",opts:["Look clearly related as a family","Look like unrelated colours","Always clash badly","Look identical"],ans:"Look clearly related as a family",exp:"Because they share the same hue base, they read as a coordinated family even at different lightness and intensity."},
  {id:"t38",q:"Which is the correct order from lightest to darkest for the same hue, typically?",opts:["Tint, tone, shade","Shade, tone, tint","Tone, tint, shade","They are always equal in lightness"],ans:"Tint, tone, shade",exp:"Tint (white added) is lightest, shade (black added) is darkest, tone sits closer to the middle depending on the grey mix."},
  {id:"t39",q:"Why might a designer avoid using a pure, fully saturated hue for a whole app background?",opts:["It is visually tiring over large areas and long use","Pure hues cannot be printed","Pure hues have no name","It is technically impossible in CSS"],ans:"It is visually tiring over large areas and long use",exp:"High-intensity pure hues are fine as accents but fatiguing as large background fields."},
  {id:"t40",q:"A single brand hue plus its tint and shade gives a designer at minimum:",opts:["Three usable, related colours instead of one","Only one usable colour","A completely new hue","Nothing extra"],ans:"Three usable, related colours instead of one",exp:"Tint, tone and shade multiply the usefulness of one hue into a small connected palette."},
  {id:"t41",q:"What best describes the relationship between a hue and its tint?",opts:["Same hue, lighter and less saturated","Different hue entirely","Same hue, darker","Same hue, more saturated"],ans:"Same hue, lighter and less saturated",exp:"A tint keeps the hue but lightens and softens it with white."},
  {id:"t42",q:"What best describes the relationship between a hue and its shade?",opts:["Same hue, darker and richer","Different hue entirely","Same hue, lighter","Same hue, greyer only"],ans:"Same hue, darker and richer",exp:"A shade keeps the hue but darkens and deepens it with black."},
  {id:"t43",q:"What best describes the relationship between a hue and its tone?",opts:["Same hue, muted with grey","Different hue entirely","Same hue, lighter only","Same hue, darker only"],ans:"Same hue, muted with grey",exp:"A tone keeps the hue but desaturates it with grey, without a strong shift in lightness."},
  {id:"t44",q:"A designer building a five-shade button state system (default, hover, active, disabled, focus) from one brand hue is applying:",opts:["The tint/tone/shade ladder","A completely new colour scheme per state","Random colours per state","A single flat colour with no variation"],ans:"The tint/tone/shade ladder",exp:"Button states are a textbook case for deriving related colours from one hue via tint, tone and shade."},
  {id:"t45",q:"Which best explains why tone is often called the most versatile of the three?",opts:["It works in large areas without shouting, while still keeping colour identity","It is the darkest possible version","It is the lightest possible version","It removes the hue entirely"],ans:"It works in large areas without shouting, while still keeping colour identity",exp:"Tones balance keeping colour identity with being calm enough for extended use."},
  {id:"t46",q:"If a brand colour is already fairly dark, adding more black to shade it further risks:",opts:["Losing the hue into near-black","Making it too light","Turning it into a tint","Nothing, dark colours cannot be over-shaded"],ans:"Losing the hue into near-black",exp:"Dark hues have less room before black overwhelms them completely."},
  {id:"t47",q:"If a brand colour is already fairly light, adding more white to tint it further risks:",opts:["Losing the hue into near-white","Making it too dark","Turning it into a shade","Nothing, light colours cannot be over-tinted"],ans:"Losing the hue into near-white",exp:"Light hues have less room before white overwhelms them completely."},
  {id:"t48",q:"A common mistake beginners make with tint/tone/shade is:",opts:["Mixing so much white or black that the hue is unrecognisable","Using too many hues at once","Never using white or black at all","Using only pure hues"],ans:"Mixing so much white or black that the hue is unrecognisable",exp:"Overdoing the mix erases the very hue identity tint/tone/shade is meant to preserve."},
  {id:"t49",q:"Why does Itten's system matter for a modern app or website, not just painting?",opts:["Digital interfaces need the same range of light-to-dark, on-brand colours that painters needed for light and shadow","It only applies to physical paint","Digital colour has no lightness concept","It is purely historical with no practical use today"],ans:"Digital interfaces need the same range of light-to-dark, on-brand colours that painters needed for light and shadow",exp:"UI needs backgrounds, text, hover and dark-mode variants - the same lightness range problem painters solved centuries earlier."},
  {id:"t50",q:"The core idea of this entire lesson in one sentence is:",opts:["One hue, mixed with white, grey or black, can supply an entire on-brand colour range","Every project needs as many different hues as possible","White, grey and black are colours you should avoid","Tint, tone and shade all look the same"],ans:"One hue, mixed with white, grey or black, can supply an entire on-brand colour range",exp:"That is the entire practical value of tint, tone and shade for a designer."},
];

const CB_TYPE="topic";
const CB_QUESTIONS=[
  {q:"A hue mixed with white to look pale and soft is a:",opts:["Tint","Tone","Shade","Complement"],ans:"Tint",exp:"White added to a hue produces a tint."},
  {q:"A hue mixed with black to look deep and rich is a:",opts:["Shade","Tint","Tone","Hue shift"],ans:"Shade",exp:"Black added to a hue produces a shade."},
  {q:"A hue mixed with grey to look muted is a:",opts:["Tone","Tint","Shade","Pure hue"],ans:"Tone",exp:"Grey added to a hue produces a tone."},
  {q:"Which is best for a soft app background: tint or shade of the brand hue?",opts:["Tint","Shade","Neither works","Pure hue"],ans:"Tint",exp:"Light tints keep backgrounds calm and readable."},
  {q:"Which is best for readable body text on a light background: tint or shade?",opts:["Shade","Tint","Neither works","Pure hue"],ans:"Shade",exp:"Darker shades provide the contrast text needs."},
  {q:"A dusty, greyed-down version of a brand blue is best called a:",opts:["Tone","Tint","Shade","Hue"],ans:"Tone",exp:"Muted, greyed colours are tones."},
  {q:"Baby blue, made from pure blue, is an example of a:",opts:["Tint","Shade","Tone","Complement"],ans:"Tint",exp:"Pale, light colours are tints - hue plus white."},
  {q:"Navy, made from pure blue, is an example of a:",opts:["Shade","Tint","Tone","Split complement"],ans:"Shade",exp:"Dark, deep colours are shades - hue plus black."},
  {q:"Slate blue, made from pure blue, is an example of a:",opts:["Tone","Tint","Shade","Analogous hue"],ans:"Tone",exp:"Muted, subdued colours are tones - hue plus grey."},
  {q:"For a dark-mode card surface, you would reach for a hue's:",opts:["Shade","Tint","Nothing, use pure hue","Complement"],ans:"Shade",exp:"Darkened shades sit naturally against black dark-mode backgrounds."},
  {q:"For a light-mode hover background, you would reach for a hue's:",opts:["Tint","Shade","Complement","Pure hue at full strength"],ans:"Tint",exp:"Light tints give a subtle hover feel without overpowering the interface."},
  {q:"Which operation keeps lightness closest to the original hue while reducing intensity?",opts:["Tone","Tint","Shade","None of these"],ans:"Tone",exp:"Adding grey mutes intensity with the least dramatic lightness shift."},
  {q:"You need six shades of blue for a data chart, all clearly blue. What do you build?",opts:["A tint-to-shade ladder of one blue hue","Six completely unrelated hues","One flat blue repeated six times","A random colour picker selection"],ans:"A tint-to-shade ladder of one blue hue",exp:"A ladder keeps every chart colour visibly part of the same blue family."},
  {q:"A colour described as pastel is almost always a:",opts:["Tint","Shade","Tone","Complement"],ans:"Tint",exp:"Pastels are hues heavily lightened with white."},
  {q:"A colour described as jewel-toned or rich is almost always a:",opts:["Shade","Tint","Tone","Split complement"],ans:"Shade",exp:"Jewel tones are deep, darkened versions of a hue."},
  {q:"A colour described as muted or dusty is almost always a:",opts:["Tone","Tint","Shade","Triad"],ans:"Tone",exp:"Muted and dusty describe grey mixed into a hue."},
  {q:"What is the risk of mixing 95% black into a brand hue for a button?",opts:["The button loses its brand colour identity and looks black","The button becomes too bright","The button becomes a tint","No risk at all"],ans:"The button loses its brand colour identity and looks black",exp:"Too much black erases the hue - the button stops reading as on-brand."},
  {q:"What is the risk of mixing 95% white into a brand hue for a card background?",opts:["The card loses its brand colour identity and looks white","The card becomes too dark","The card becomes a shade","No risk at all"],ans:"The card loses its brand colour identity and looks white",exp:"Too much white erases the hue - the card stops reading as on-brand."},
  {q:"A style guide colour ramp with 9 steps from light to dark of one hue is an example of:",opts:["A tint/tone/shade ladder","Nine unrelated colours","A complementary pair","A single flat tone"],ans:"A tint/tone/shade ladder",exp:"Ramps like this are built by mixing one hue with varying amounts of white and black."},
  {q:"Which change moves a colour from tone toward shade?",opts:["Reducing grey, adding black","Adding white","Adding more grey only","Rotating the hue"],ans:"Reducing grey, adding black",exp:"Swapping grey for black shifts a muted tone into a darkened shade."},
  {q:"Which change moves a colour from tone toward tint?",opts:["Reducing grey, adding white","Adding black","Adding more grey only","Rotating the hue"],ans:"Reducing grey, adding white",exp:"Swapping grey for white shifts a muted tone into a lightened tint."},
  {q:"A disabled UI button typically uses:",opts:["A light tint or muted tone of the brand hue","The darkest possible shade","A totally different hue","Pure black only"],ans:"A light tint or muted tone of the brand hue",exp:"Disabled states use a softened, low-emphasis version of the brand colour."},
  {q:"Which best supports the claim tint, tone and shade come from a single hue?",opts:["They all share the same underlying hue, only lightness or saturation differs","They are all different hues by definition","Only tint shares the hue, the others do not","None of them relate to hue at all"],ans:"They all share the same underlying hue, only lightness or saturation differs",exp:"The defining feature of tint, tone and shade is that the base hue stays constant."},
  {q:"A logo needs a slightly darker version for print on a light background. You create a:",opts:["Shade of the logo hue","Tint of the logo hue","A different hue entirely","Grey version with no hue"],ans:"Shade of the logo hue",exp:"A shade darkens the hue while keeping it recognisably the same brand colour."},
  {q:"A wellness brand wants its primary green to feel calming across a full app. The best approach is:",opts:["A tint and tone ladder from that one green","Introducing five unrelated calming hues","Using only the pure saturated green everywhere","Switching to grayscale entirely"],ans:"A tint and tone ladder from that one green",exp:"Building light tints and muted tones from the single green keeps the calm feeling consistent and on-brand."},
];

const BRAND_BANK=[
  {name:"Airbnb",c1:"#FF5A5F",c2:"#FFE3E4",hint:"Primary coral used full-strength for the logo mark, and lightened heavily for soft section backgrounds",ans:"tint",exp:"Airbnb lightens its coral hue into a pale tint for backgrounds so large surfaces stay calm while the pure hue is reserved for accents."},
  {name:"Pinterest",c1:"#E60023",c2:"#AD081B",hint:"Bright red for the logo, a deeper red used on pressed or hover button states",ans:"shade",exp:"Pinterest darkens its red into a shade for interactive states, giving depth without introducing a new hue."},
  {name:"Slack",c1:"#4A154B",c2:"#611F69",hint:"Deep aubergine purple used across headers and sidebars, in slightly varying depths",ans:"shade",exp:"Slack's dark purple surfaces are shades of the same base hue, keeping the brand consistent across dark UI panels."},
  {name:"Duolingo",c1:"#58CC02",c2:"#3A9E00",hint:"Bright green button face, with a deeper green visible as a 3D pressed edge beneath it",ans:"shade",exp:"The darker green beneath Duolingo's buttons is a shade of the same green, creating a tactile pressed-button illusion."},
  {name:"Trello",c1:"#0079BF",c2:"#E4F0F6",hint:"Strong blue for the header bar, a very pale blue used for board backgrounds",ans:"tint",exp:"Trello's board background is a light tint of its blue, keeping the workspace calm while cards stay in focus."},
  {name:"Starbucks",c1:"#00704A",c2:"#D4E9E2",hint:"Deep green for the logo and primary surfaces, a soft pale green used in app backgrounds",ans:"tint",exp:"The pale green is a tint of Starbucks' core green, used to keep large app surfaces gentle rather than saturated."},
  {name:"Headspace",c1:"#FF8C42",c2:"#FFE8D6",hint:"Warm orange for illustrations and accents, a very light peachy background behind content",ans:"tint",exp:"Headspace tints its orange heavily for backgrounds so the calming brand hue never overwhelms the screen."},
  {name:"Spotify",c1:"#1DB954",c2:"#1A2E1E",hint:"Bright green for the logo and play buttons, a near-black green-tinted surface used in some dark panels",ans:"shade",exp:"Spotify occasionally uses a heavily shaded, near-black version of its green for subtle depth in dark surfaces."},
  {name:"Mailchimp",c1:"#FFE01B",c2:"#FFF6BF",hint:"Bold yellow for the logo, a very pale yellow used behind onboarding sections",ans:"tint",exp:"Mailchimp lightens its signature yellow into a tint for large friendly backgrounds without it feeling harsh."},
  {name:"Notion",c1:"#000000",c2:"#F7F6F3",hint:"Near-black text throughout, paired with an off-white page background rather than pure white",ans:"tint",exp:"Notion's warm off-white background is a very light tint, softer than pure white while keeping the page airy."},
  {name:"Coca-Cola",c1:"#F40009",c2:"#7A0004",hint:"Signature bright red on the can, a deep maroon-red seen in some packaging shadow details",ans:"shade",exp:"The deeper red used in shading and depth details is a shade of the same signature red."},
  {name:"Behance",c1:"#1769FF",c2:"#0A3499",hint:"Bright blue for the logo, a darker navy-blue seen in footer and header panels",ans:"shade",exp:"Behance darkens its core blue into a shade for large panel areas, adding depth while staying on-brand."},
  {name:"Figma",c1:"#0ACF83",c2:"#D3F4E4",hint:"Vivid green used in the logo mark, a very pale green used for a subtle panel background",ans:"tint",exp:"Figma's pale green panels are light tints of the logo green, keeping the UI airy and calm."},
  {name:"Dropbox",c1:"#0061FF",c2:"#003399",hint:"Bright blue for the primary logo, a deeper blue seen in some pressed button and footer states",ans:"shade",exp:"Dropbox's darker blue in pressed states is a shade of its primary blue, adding depth without a new hue."},
  {name:"Zomato",c1:"#E23744",c2:"#FCE8EA",hint:"Bold red for the logo and CTAs, a very pale pink-red used behind promotional banners",ans:"tint",exp:"Zomato lightens its red into a soft tint for banner backgrounds so the strong CTA red still stands out."},
];

const TAKEAWAY_QUOTE="One hue, three operations, an entire palette - tint for light, tone for calm, shade for depth.";
const TAKEAWAY_POINTS=[
  {t:"Build ladders, not random extra colours",b:"Every time you need a lighter or darker version of your brand hue, mix it from the same hue - never introduce an unrelated colour."},
  {t:"Match the operation to the job",b:"Tint for soft backgrounds and hover states. Tone for calm, sophisticated large surfaces. Shade for text, depth and dark-mode panels."},
  {t:"Stop before you lose the hue",b:"There is a point past which white, grey or black overwhelms the hue entirely. Stay short of it - the identity of the colour is the whole point."},
];

const SOURCES=[
  "Johannes Itten - The Art of Color (1961). Formalised tint, tone and shade as a teachable Bauhaus system.",
  "Josef Albers - Interaction of Color (1963). Studies on how mixed colours behave relative to their pure hue.",
];

export default function CT03TintToneShade(){
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
  const[playHue,setPlayHue]=useState("#FF7A00");
  const[whiteAmt,setWhiteAmt]=useState(40);
  const[greyAmt,setGreyAmt]=useState(40);
  const[blackAmt,setBlackAmt]=useState(40);
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

  const tintSwatch=mix(playHue,"#FFFFFF",whiteAmt/100);
  const toneSwatch=mix(playHue,"#808080",greyAmt/100);
  const shadeSwatch=mix(playHue,"#000000",blackAmt/100);

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
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 0"}}>One hue. Three mixes. A whole palette.</p>
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
            <Nav onBack={function(){go(1);}} onNext={function(){go(3);}} nextLabel="Test yourself"/>
          </div>
        )}

        {step===3&&(
          <div>
            <Card style={{marginBottom:18,borderLeft:"4px solid "+T.brand}}>
              <Tag>PLAY</Tag>
              <p style={{fontSize:16,color:T.white,lineHeight:1.65,margin:"10px 0 0"}}>Pick a hue. Drag each slider. Watch tint, tone and shade update live.</p>
            </Card>
            <Card style={{marginBottom:16}}>
              <label style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
                <span style={{fontSize:12,color:T.muted}}>Base hue</span>
                <input type="color" value={playHue} onChange={function(e){setPlayHue(e.target.value);}} style={{width:"100%",height:44,border:"none",background:"none",cursor:"pointer",borderRadius:8}}/>
              </label>
              {[
                {label:"Tint - White amount",val:whiteAmt,set:setWhiteAmt,swatch:tintSwatch,mixColor:"White"},
                {label:"Tone - Grey amount",val:greyAmt,set:setGreyAmt,swatch:toneSwatch,mixColor:"Grey"},
                {label:"Shade - Black amount",val:blackAmt,set:setBlackAmt,swatch:shadeSwatch,mixColor:"Black"},
              ].map(function(row){
                return(
                  <div key={row.label} style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <span style={{fontSize:12.5,color:T.muted}}>{row.label}</span>
                      <span style={{fontSize:12.5,color:T.brand,fontWeight:700}}>{row.val}%</span>
                    </div>
                    <input type="range" min="0" max="95" value={row.val} onChange={function(e){row.set(Number(e.target.value));}} style={{width:"100%",marginBottom:10}}/>
                    <div style={{height:52,borderRadius:10,background:row.swatch,border:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:11,color:"rgba(255,255,255,.6)",background:"rgba(0,0,0,.35)",padding:"3px 8px",borderRadius:6}}>{row.swatch.toUpperCase()}</span>
                    </div>
                  </div>
                );
              })}
            </Card>
            <div style={{borderLeft:"3px solid "+T.brand,paddingLeft:16,margin:"0 0 20px",color:T.muted,fontSize:14,lineHeight:1.7}}>Notice all three swatches still look related to your base hue - that is the whole point of tint, tone and shade.</div>
            <Nav onBack={function(){go(2);}} onNext={function(){go(4);}} nextLabel="Take the challenge"/>
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
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.6,margin:"0 0 12px"}}>This brand pairs its core hue with a second colour. Is the second colour a tint, tone or shade of the first?</p>
                  <div style={{display:"flex",gap:10,marginBottom:8}}>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c1,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>CORE HUE</span></div>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c2,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid "+T.border}}><span style={{fontSize:10,color:"rgba(0,0,0,.4)"}}>SECOND COLOUR</span></div>
                  </div>
                  <p style={{fontSize:11,color:T.dim,margin:"0 0 12px"}}>Hint: {brand.hint}</p>
                  {!myRev&&(
                    <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
                      {["Tint","Tone","Shade"].map(function(opt){
                        return(
                          <button key={opt}
                            onClick={function(){if(!myAns){const n=Object.assign({},ccAnswers);n[qi]=opt.toLowerCase();setCcAnswers(n);}}}
                            style={{padding:"10px 14px",background:myAns===opt.toLowerCase()?"rgba(255,122,0,.15)":T.panel,border:"1px solid "+(myAns===opt.toLowerCase()?T.brand:T.border),borderRadius:10,color:myAns===opt.toLowerCase()?T.brand:T.muted,cursor:myAns?"default":"pointer",textAlign:"left",fontSize:13.5}}
                          >{opt}</button>
                        );
                      })}
                      {myAns&&<button onClick={function(){const n=Object.assign({},ccRevealed);n[qi]=true;setCcRevealed(n);}} style={{padding:11,background:T.brand,border:"none",borderRadius:10,color:"#0A0A0A",fontWeight:700,cursor:"pointer",fontSize:14,marginTop:4}}>Reveal answer</button>}
                    </div>
                  )}
                  {myRev&&(
                    <div style={{background:isCorrect?"rgba(45,198,83,.08)":"rgba(233,69,96,.08)",border:"1px solid "+(isCorrect?T.green:T.red),borderRadius:12,padding:14}}>
                      <div style={{fontWeight:700,color:isCorrect?T.green:T.red,marginBottom:6}}>{isCorrect?"Correct! +5 pts":"Wrong - 0 pts. Answer: "+brand.ans.charAt(0).toUpperCase()+brand.ans.slice(1)}</div>
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
