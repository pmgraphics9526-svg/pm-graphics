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

const LESSON_MODULE="COLOUR THEORY - TOPIC 09";
const LESSON_TITLE="Temperature and Contrast";
const LESSON_SUBTITLE="Johannes Itten 1961 - The Seven Contrasts of Colour";

const STORY_PARA_1="Johannes Itten did not stop at warm and cool. Teaching at the Bauhaus, he catalogued every way one colour could stand apart from another - not just by temperature, but by how light or dark it was, how pure or muted, and how those differences could be stacked together on purpose.";
const STORY_PARA_2="He called these the contrasts of colour. Three of the most useful for a working designer are value contrast - light against dark, saturation contrast - vivid against muted, and temperature contrast - warm against cool. Each one, alone, can guide an eye through a composition.";
const STORY_PARA_3="Combined, they become something stronger: a way to guarantee a viewer sees the right thing first, in the right order, without a single word of instruction.";
const STORY_PROBLEM="You built a composition where every element technically had good colour, and the eye still did not know where to look first. Contrast - not colour alone - is usually the missing ingredient that tells the eye where to land.";
const STORY_5Q=[
  {q:"What is it?",a:"Three tools for creating visual hierarchy through difference: value contrast (light-dark), saturation contrast (vivid-muted) and temperature contrast (warm-cool)."},
  {q:"Why does it exist?",a:"Colour alone does not guarantee focus - contrast between elements is what actually directs the eye to what matters most first."},
  {q:"How does it work?",a:"Each contrast type creates separation on a different axis. Stacking more than one type on the same focal point makes it nearly impossible to miss."},
  {q:"How will you use it?",a:"Give your focal point the highest value contrast, the most saturation, and the warmest temperature relative to everything around it."},
  {q:"What if you skip it?",a:"Every element sits at a similar visual weight, and the eye has no clear starting point in the composition."},
];

const CONCEPT_SECTIONS=[
  {tag:"VALUE CONTRAST",tagColor:"#B0B0B0",formula:"Light against dark",desc:"The difference in lightness between two colours. This is the single strongest contrast type - it works even if a design is converted to greyscale, since it does not depend on hue at all.",rule:"If your focal point fails in greyscale, value contrast is missing - fix that before touching anything else."},
  {tag:"SATURATION CONTRAST",tagColor:T.brand,formula:"Vivid against muted",desc:"The difference in intensity between two colours. A single vivid, saturated element surrounded by muted, desaturated colours pulls focus immediately, regardless of hue or lightness.",rule:"One saturated element in a muted field reads as important - several saturated elements together cancel each other out."},
  {tag:"TEMPERATURE CONTRAST",tagColor:"#3EC6E0",formula:"Warm against cool",desc:"The difference between advancing warm hues and receding cool hues. Placed together, they create the illusion of depth and naturally separate foreground from background.",rule:"A warm focal point against a cool field reads as closer and more important - even without any difference in size."},
  {tag:"STACKING CONTRASTS",tagColor:T.green,formula:"Combine for certainty",desc:"A focal point that is simultaneously lighter or darker, more saturated, and warmer than everything around it is almost impossible for the eye to miss.",rule:"You rarely need all three at maximum - even two working together is usually enough to guarantee focus."},
];

function mixToGrey(hex){
  const h=hex.replace("#","");
  const r=parseInt(h.substring(0,2),16),g=parseInt(h.substring(2,4),16),b=parseInt(h.substring(4,6),16);
  const grey=Math.round(0.299*r+0.587*g+0.114*b);
  return "rgb("+grey+","+grey+","+grey+")";
}

const QUESTION_BANK=[
  {id:"v1",q:"What is value contrast?",opts:["The difference in lightness between two colours","The difference in hue between two colours","The difference in temperature between two colours","The distance between two hues on the wheel"],ans:"The difference in lightness between two colours",exp:"Value contrast is purely about light versus dark, independent of hue."},
  {id:"v2",q:"What is saturation contrast?",opts:["The difference in intensity between a vivid and a muted colour","The difference between warm and cool hues","The difference in lightness between two colours","The angle between two hues on the wheel"],ans:"The difference in intensity between a vivid and a muted colour",exp:"Saturation contrast compares how vivid or muted colours are, not their lightness or hue."},
  {id:"v3",q:"What is temperature contrast?",opts:["The difference between warm and cool hues placed together","The difference in lightness between two colours","The difference in saturation between two colours","The number of hues used in a palette"],ans:"The difference between warm and cool hues placed together",exp:"Temperature contrast uses the warm-advance, cool-recede relationship to create depth and focus."},
  {id:"v4",q:"Which contrast type still works even if a design is converted to greyscale?",opts:["Value contrast","Saturation contrast","Temperature contrast","None of them work in greyscale"],ans:"Value contrast",exp:"Value contrast depends only on lightness, which survives even in greyscale."},
  {id:"v5",q:"A single vivid red button on an otherwise muted grey interface uses which contrast?",opts:["Saturation contrast","Value contrast only","Temperature contrast only","No contrast at all"],ans:"Saturation contrast",exp:"The vivid element against a muted field is a textbook saturation contrast."},
  {id:"v6",q:"A warm orange subject on a cool blue background uses which contrast?",opts:["Temperature contrast","Value contrast only","Saturation contrast only","No contrast at all"],ans:"Temperature contrast",exp:"Warm against cool is the definition of temperature contrast."},
  {id:"v7",q:"Why is value contrast often considered the strongest of the three?",opts:["It works regardless of hue, even in greyscale","It is the only contrast type that exists","It always uses the most colours","It requires no design skill"],ans:"It works regardless of hue, even in greyscale",exp:"Value contrast's independence from hue makes it reliable in almost any situation."},
  {id:"v8",q:"What happens if several elements in a composition are all equally saturated?",opts:["They compete for attention instead of one standing out","They automatically create a clear focal point","They become invisible","They turn into value contrast instead"],ans:"They compete for attention instead of one standing out",exp:"Saturation contrast only works when one element is notably different from its surroundings."},
  {id:"v9",q:"A poster with a light subject on a dark background is using:",opts:["Value contrast","Saturation contrast only","Temperature contrast only","Harmony, not contrast"],ans:"Value contrast",exp:"Light against dark is the definition of value contrast."},
  {id:"v10",q:"What is the benefit of stacking more than one contrast type on the same focal point?",opts:["It makes the focal point nearly impossible for the eye to miss","It always makes a design look busier","It cancels out all contrast entirely","It has no additional benefit"],ans:"It makes the focal point nearly impossible for the eye to miss",exp:"Combining contrast types multiplies the visual pull toward the focal point."},
  {id:"v11",q:"A UI button that is both lighter, more saturated and warmer than its surroundings is using:",opts:["Stacked contrast across all three types","Only value contrast","Only temperature contrast","No contrast at all"],ans:"Stacked contrast across all three types",exp:"This button combines value, saturation and temperature contrast for maximum focus."},
  {id:"v12",q:"How many of Itten's core colour contrasts does this lesson focus on?",opts:["Three - value, saturation and temperature","Seven - all of Itten's contrasts","One - only temperature","Two - only value and hue"],ans:"Three - value, saturation and temperature",exp:"This lesson covers value, saturation and temperature contrast specifically."},
  {id:"v13",q:"Why might a designer desaturate a background before adding a saturated focal element?",opts:["To increase the saturation contrast so the focal element stands out more","To make the background invisible","To remove all contrast from the design","To make the design print incorrectly"],ans:"To increase the saturation contrast so the focal element stands out more",exp:"A muted background maximises the contrast against a saturated focal point."},
  {id:"v14",q:"If your focal point fails to stand out when a design is converted to greyscale, what is missing?",opts:["Value contrast","Saturation contrast only","Temperature contrast only","Nothing, greyscale is irrelevant"],ans:"Value contrast",exp:"A lack of lightness difference means the focal point relies only on hue, which disappears in greyscale."},
  {id:"v15",q:"A landscape uses a warm, saturated flower in the foreground against a cool, muted, dark forest background. How many contrast types are being used?",opts:["Three - value, saturation and temperature","One - only temperature","Zero, this is harmony not contrast","Two, but they cancel out"],ans:"Three - value, saturation and temperature",exp:"The flower is likely lighter, more saturated and warmer than the forest - all three contrasts at once."},
  {id:"v16",q:"Why is it often unnecessary to max out all three contrast types at once?",opts:["Even two working together is usually enough to guarantee focus","Only one contrast type actually exists","Maxing out contrast is illegal in design","It always looks worse with more than one"],ans:"Even two working together is usually enough to guarantee focus",exp:"Two strong contrasts are often sufficient without needing every type at maximum."},
  {id:"v17",q:"A muted, low-saturation grey palette with one bright saturated accent relies primarily on:",opts:["Saturation contrast","Value contrast only","Temperature contrast only","No contrast, this is a harmony scheme"],ans:"Saturation contrast",exp:"The vivid accent against the muted field is a saturation contrast at work."},
  {id:"v18",q:"A black-and-white photograph relies entirely on which contrast type to create depth and focus?",opts:["Value contrast","Saturation contrast","Temperature contrast","None, black and white has no contrast"],ans:"Value contrast",exp:"With no hue information at all, only lightness differences remain to create visual structure."},
  {id:"v19",q:"Why does a warm subject against a cool background feel closer to the viewer?",opts:["Warm hues visually advance while cool hues visually recede","Warm hues are always physically larger","Cool hues are always brighter","There is no such effect"],ans:"Warm hues visually advance while cool hues visually recede",exp:"This is the advance-recede mechanism behind temperature contrast."},
  {id:"v20",q:"A designer wants a heading to stand out from body text using only lightness, with no colour change at all. This relies on:",opts:["Value contrast","Saturation contrast","Temperature contrast","Harmony, not contrast"],ans:"Value contrast",exp:"Pure lightness difference, with no hue or saturation change, is value contrast."},
  {id:"v21",q:"Which contrast type is independent of both hue and saturation?",opts:["Value contrast","Saturation contrast","Temperature contrast","None are independent of hue"],ans:"Value contrast",exp:"Value contrast is defined purely by lightness, regardless of what hue or saturation is involved."},
  {id:"v22",q:"A chart uses one bright red data point among many pale grey ones to highlight an anomaly. This uses:",opts:["Saturation contrast","Value contrast only","Temperature contrast only","No contrast, this is random"],ans:"Saturation contrast",exp:"The single saturated point against the muted field creates a clear saturation contrast."},
  {id:"v23",q:"Why would a designer avoid making every element in a composition equally warm and equally saturated?",opts:["Without contrast, nothing stands out as more important than anything else","It is technically impossible to do","It automatically creates the strongest possible focal point","There is no downside to this approach"],ans:"Without contrast, nothing stands out as more important than anything else",exp:"Uniform warmth and saturation removes the very differences that create hierarchy."},
  {id:"v24",q:"A movie poster places a brightly lit, warm-toned hero against a dark, cool, blurred background. Which contrasts are at play?",opts:["Value, saturation and temperature contrast together","Only value contrast","Only saturation contrast","No contrast, this is a harmony scheme"],ans:"Value, saturation and temperature contrast together",exp:"Lit versus dark, saturated hero versus muted background, and warm versus cool all combine here."},
  {id:"v25",q:"What is the risk of using temperature contrast without any value or saturation contrast at all?",opts:["The effect may be weaker and less immediately obvious than a stacked approach","It becomes stronger than any other contrast type automatically","It is impossible to achieve","It always fails completely"],ans:"The effect may be weaker and less immediately obvious than a stacked approach",exp:"A single contrast type still works, but stacking multiple types creates a stronger, more certain effect."},
  {id:"v26",q:"A dashboard highlights its most important metric using a larger, darker, more saturated number than the rest. This primarily demonstrates:",opts:["Stacked value and saturation contrast","Temperature contrast only","Harmony, not contrast","No meaningful design principle"],ans:"Stacked value and saturation contrast",exp:"Darker plus more saturated together stack two contrast types on the same focal element."},
  {id:"v27",q:"Which best explains why a designer might check a design in greyscale during review?",opts:["To verify the value contrast is strong enough to work without relying on hue alone","To check the exact hex codes used","To verify the CMYK conversion is correct","To check accessibility compliance only"],ans:"To verify the value contrast is strong enough to work without relying on hue alone",exp:"A greyscale check isolates value contrast from hue and saturation."},
  {id:"v28",q:"A single muted, cool-toned object placed among many warm, saturated objects would still stand out because of:",opts:["Contrast still works in reverse - being the odd one out creates focus, regardless of direction","Nothing, only warm and saturated elements can stand out","This situation is impossible to design","Contrast only works with warm and saturated elements"],ans:"Contrast still works in reverse - being the odd one out creates focus, regardless of direction",exp:"Contrast is about difference from the surroundings, not about always being the warmest or brightest."},
  {id:"v29",q:"The core practical value of understanding value, saturation and temperature contrast is:",opts:["Reliable tools for building visual hierarchy so the eye knows where to look first","A replacement for choosing a colour harmony scheme","A way to avoid using more than one colour","A rule specific to print design only"],ans:"Reliable tools for building visual hierarchy so the eye knows where to look first",exp:"That is the entire practical value of this lesson's three contrast types."},
  {id:"v30",q:"In one sentence, temperature and contrast in design is about:",opts:["Using differences in lightness, intensity and warmth to guide the eye to what matters most","Using only warm colours in every design","Avoiding contrast entirely for a calmer look","Choosing which specific hues to pair together"],ans:"Using differences in lightness, intensity and warmth to guide the eye to what matters most",exp:"That is the complete summary of this lesson's core idea."},
  {id:"v31",q:"A designer increases the lightness gap between a heading and its background. This directly increases:",opts:["Value contrast","Saturation contrast","Temperature contrast","Harmony strength"],ans:"Value contrast",exp:"A larger lightness gap is, by definition, greater value contrast."},
  {id:"v32",q:"A designer desaturates every element except a single call-to-action button. This directly increases:",opts:["Saturation contrast","Value contrast only","Temperature contrast only","Nothing changes"],ans:"Saturation contrast",exp:"Removing saturation from everything else increases the contrast against the one saturated button."},
  {id:"v33",q:"A designer changes a background from blue to orange while keeping a warm subject unchanged. This reduces:",opts:["Temperature contrast","Value contrast only","Saturation contrast only","Nothing is affected"],ans:"Temperature contrast",exp:"Making the background warm as well removes the warm-cool difference that created the original contrast."},
  {id:"v34",q:"Which of these best distinguishes value contrast from saturation contrast?",opts:["Value is about lightness, saturation is about intensity","They are identical concepts","Value is about hue, saturation is about lightness","Saturation always overrides value"],ans:"Value is about lightness, saturation is about intensity",exp:"The two measure entirely different properties of a colour."},
  {id:"v35",q:"Which of these best distinguishes saturation contrast from temperature contrast?",opts:["Saturation is about vividness, temperature is about warm versus cool","They are identical concepts","Saturation is about hue family, temperature is about lightness","Temperature always overrides saturation"],ans:"Saturation is about vividness, temperature is about warm versus cool",exp:"The two measure entirely different properties of a colour."},
  {id:"v36",q:"A brand wants its logo to stand out clearly on any background, light or dark, coloured or neutral. Which contrast type gives the most reliable guarantee?",opts:["Value contrast, since it works regardless of hue","Saturation contrast, since it only works on muted backgrounds","Temperature contrast, since it only works with warm backgrounds","None of these can guarantee visibility"],ans:"Value contrast, since it works regardless of hue",exp:"Value contrast's independence from hue makes it the most universally reliable option."},
  {id:"v37",q:"A designer wants to draw attention to a warning icon on a busy, colourful dashboard. The most reliable combination is:",opts:["High value contrast plus high saturation contrast against the surrounding elements","Making the icon the exact same colour as the background","Removing all colour from the icon","Making the icon the same size as everything else"],ans:"High value contrast plus high saturation contrast against the surrounding elements",exp:"Stacking two strong contrast types creates a very reliable focal point on a busy screen."},
  {id:"v38",q:"Why might two elements with high temperature contrast still fail to create a clear focal point?",opts:["If their value and saturation are nearly identical, the temperature difference alone may not be enough","Temperature contrast is always the strongest contrast type with no exceptions","This situation is impossible","Temperature contrast cannot exist without saturation contrast"],ans:"If their value and saturation are nearly identical, the temperature difference alone may not be enough",exp:"A single contrast type can sometimes be too subtle without additional reinforcement."},
  {id:"v39",q:"A minimalist black-on-white text layout relies almost entirely on:",opts:["Value contrast","Saturation contrast","Temperature contrast","No contrast at all"],ans:"Value contrast",exp:"Black and white have no hue or saturation - only their lightness difference creates the contrast."},
  {id:"v40",q:"The safest first contrast to check in any composition, before adjusting hue or saturation, is usually:",opts:["Value contrast","Saturation contrast","Temperature contrast","None, contrast order does not matter"],ans:"Value contrast",exp:"Because value contrast is the most universally reliable, it is a strong first check."},
  {id:"v41",q:"A single warm, saturated, light element placed in a field of cool, muted, dark elements demonstrates:",opts:["All three contrast types stacked together","Only harmony, not contrast","Only temperature contrast","No meaningful contrast"],ans:"All three contrast types stacked together",exp:"Light versus dark, saturated versus muted, and warm versus cool are all present at once here."},
  {id:"v42",q:"Why is stacking contrast types considered more reliable than relying on just one?",opts:["If one contrast type is weak or subtle, the others still reinforce the focal point","It always doubles the file size","It removes the need for any layout decisions","It only works for print, not screens"],ans:"If one contrast type is weak or subtle, the others still reinforce the focal point",exp:"Multiple contrast types provide redundancy, so the focal point still reads clearly even if one type is subtle."},
  {id:"v43",q:"A designer wants a chart's most important bar to be unmistakable among ten similar bars. Best approach:",opts:["Make it noticeably darker or lighter and more saturated than the rest","Make it the exact same colour as the others","Make it smaller than the rest","Remove colour from every bar"],ans:"Make it noticeably darker or lighter and more saturated than the rest",exp:"Stacking value and saturation contrast on the one bar makes it stand out clearly."},
  {id:"v44",q:"Which statement best summarises the relationship between contrast and hierarchy?",opts:["Contrast is the mechanism that creates visual hierarchy - what stands out reads as more important","Contrast and hierarchy are unrelated concepts","Hierarchy only comes from font size, never colour","Contrast always removes hierarchy"],ans:"Contrast is the mechanism that creates visual hierarchy - what stands out reads as more important",exp:"Contrast is precisely how a design tells the eye what matters most."},
  {id:"v45",q:"A designer notices a focal point disappears when a colourblind user views the design. What contrast type should be checked first?",opts:["Value contrast, since it does not depend on distinguishing hues","Temperature contrast, since colourblindness does not affect warmth perception","Saturation contrast only, since hue is irrelevant to saturation","This cannot be fixed with contrast"],ans:"Value contrast, since it does not depend on distinguishing hues",exp:"Value contrast survives even when hue distinctions are hard to perceive, making it the most robust fallback."},
  {id:"v46",q:"Which of these pairs demonstrates the strongest possible triple-stacked contrast?",opts:["A light, saturated, warm orange dot on a dark, muted, cool blue background","A medium grey dot on a medium grey background","Two identical warm orange dots side by side","A light warm dot on a light warm background"],ans:"A light, saturated, warm orange dot on a dark, muted, cool blue background",exp:"This pairing maximises value, saturation and temperature contrast all at once."},
  {id:"v47",q:"A poster fails to draw the eye to its headline despite using a bold, warm colour. What is most likely missing?",opts:["Sufficient value or saturation contrast against the surrounding elements","The headline needs to be a cooler colour instead","The headline needs to be smaller","Nothing, warm colour alone always guarantees focus"],ans:"Sufficient value or saturation contrast against the surrounding elements",exp:"Temperature contrast alone may not be enough without reinforcing value or saturation differences."},
  {id:"v48",q:"Why does Itten's broader contrast framework matter beyond just warm and cool?",opts:["It gives designers multiple independent tools - not just temperature - for creating visual hierarchy","Warm and cool are the only contrasts that actually work","Value and saturation contrast were disproven over time","It only applies to fine art, not design"],ans:"It gives designers multiple independent tools - not just temperature - for creating visual hierarchy",exp:"Having several contrast types available gives a designer more ways to guarantee focus."},
  {id:"v49",q:"The most practical takeaway from this lesson for daily design work is:",opts:["Check value, saturation and temperature contrast on your focal point before publishing any design","Only ever use one colour in every project","Contrast is only relevant for print design","Ignore lightness and only think about hue"],ans:"Check value, saturation and temperature contrast on your focal point before publishing any design",exp:"That is the practical habit this lesson is meant to build."},
  {id:"v50",q:"In one sentence, contrast in design exists to:",opts:["Create the visual difference that tells the eye what to look at first","Make every element in a design look identical","Remove all hierarchy from a composition","Replace the need for a colour wheel"],ans:"Create the visual difference that tells the eye what to look at first",exp:"That is the complete summary of why contrast matters in design."},
];

const CB_TYPE="topic";
const CB_QUESTIONS=[
  {q:"Value contrast is the difference in:",opts:["Lightness between two colours","Hue between two colours","Warmth between two colours","Nothing measurable"],ans:"Lightness between two colours",exp:"Value contrast is purely about light versus dark."},
  {q:"Saturation contrast is the difference in:",opts:["Intensity between a vivid and a muted colour","Lightness between two colours","Warmth between two colours","Hue angle on the wheel"],ans:"Intensity between a vivid and a muted colour",exp:"Saturation contrast compares vividness, not lightness or hue."},
  {q:"Temperature contrast is the difference between:",opts:["Warm and cool hues placed together","Light and dark values","Vivid and muted intensities","Complementary hue pairs only"],ans:"Warm and cool hues placed together",exp:"Temperature contrast relies on the warm-cool relationship."},
  {q:"Which contrast still works in greyscale?",opts:["Value contrast","Saturation contrast","Temperature contrast","None of them"],ans:"Value contrast",exp:"Value contrast depends only on lightness, which survives in greyscale."},
  {q:"A single vivid element in a muted field uses which contrast?",opts:["Saturation contrast","Value contrast only","Temperature contrast only","No contrast"],ans:"Saturation contrast",exp:"This is a classic saturation contrast setup."},
  {q:"A warm subject on a cool background uses which contrast?",opts:["Temperature contrast","Value contrast only","Saturation contrast only","No contrast"],ans:"Temperature contrast",exp:"Warm against cool is the definition of temperature contrast."},
  {q:"Why is value contrast considered the strongest of the three?",opts:["It works regardless of hue, even in greyscale","It always uses the most colours","It is the only real contrast type","It requires the least design skill"],ans:"It works regardless of hue, even in greyscale",exp:"Value contrast's independence from hue makes it very reliable."},
  {q:"Several equally saturated elements in one composition will:",opts:["Compete for attention instead of one standing out","Automatically create a clear focal point","Become invisible","Turn into value contrast"],ans:"Compete for attention instead of one standing out",exp:"Saturation contrast needs one element to be clearly different from the rest."},
  {q:"Stacking more than one contrast type on a focal point:",opts:["Makes it nearly impossible to miss","Cancels out all contrast","Always looks worse","Has no real effect"],ans:"Makes it nearly impossible to miss",exp:"Combined contrast types reinforce each other for a stronger effect."},
  {q:"A black-and-white photo relies entirely on which contrast for depth?",opts:["Value contrast","Saturation contrast","Temperature contrast","None"],ans:"Value contrast",exp:"With no hue at all, only lightness differences remain."},
  {q:"A warm subject feels closer to the viewer mainly because:",opts:["Warm hues visually advance while cool hues recede","Warm hues are always bigger","Cool hues are invisible","There is no real effect"],ans:"Warm hues visually advance while cool hues recede",exp:"This is the mechanism behind temperature contrast."},
  {q:"Desaturating a background before adding a saturated focal point:",opts:["Increases the saturation contrast so the focal point stands out more","Removes all contrast","Makes the background invisible","Has no effect on contrast"],ans:"Increases the saturation contrast so the focal point stands out more",exp:"A muted background maximises contrast against the saturated element."},
  {q:"If a focal point fails in greyscale, what is missing?",opts:["Value contrast","Saturation contrast only","Temperature contrast only","Nothing important"],ans:"Value contrast",exp:"A lack of lightness difference means it relies only on hue, which disappears in greyscale."},
  {q:"Which pairing demonstrates all three contrast types at once?",opts:["A light, saturated, warm element on a dark, muted, cool background","Two identical elements side by side","A grey dot on a grey background","A light warm dot on a light warm background"],ans:"A light, saturated, warm element on a dark, muted, cool background",exp:"This combination maximises value, saturation and temperature contrast together."},
  {q:"Why check a design in greyscale during review?",opts:["To verify value contrast works without relying on hue alone","To check exact hex codes","To verify CMYK conversion","To check file size"],ans:"To verify value contrast works without relying on hue alone",exp:"Greyscale isolates value contrast from hue and saturation."},
  {q:"A brand wants its logo visible on any background. Most reliable contrast type:",opts:["Value contrast","Saturation contrast only","Temperature contrast only","None can guarantee this"],ans:"Value contrast",exp:"Value contrast's hue-independence makes it the most universally reliable choice."},
  {q:"Increasing the lightness gap between a heading and background increases:",opts:["Value contrast","Saturation contrast","Temperature contrast","Harmony"],ans:"Value contrast",exp:"A bigger lightness gap is, by definition, more value contrast."},
  {q:"Desaturating everything except one button increases:",opts:["Saturation contrast","Value contrast only","Temperature contrast only","Nothing"],ans:"Saturation contrast",exp:"The remaining saturated button now stands out more against the muted rest."},
  {q:"Changing a background from blue to orange while a subject stays warm:",opts:["Reduces temperature contrast","Reduces value contrast only","Increases saturation contrast only","Has no effect"],ans:"Reduces temperature contrast",exp:"Making both warm removes the warm-cool difference that created the contrast."},
  {q:"A minimalist black-on-white layout relies almost entirely on:",opts:["Value contrast","Saturation contrast","Temperature contrast","No contrast at all"],ans:"Value contrast",exp:"Black and white have no hue, so only lightness creates the contrast."},
  {q:"The safest first contrast check in any composition is usually:",opts:["Value contrast","Saturation contrast","Temperature contrast","None, order never matters"],ans:"Value contrast",exp:"Its universal reliability makes it a strong starting checkpoint."},
  {q:"Why is stacking contrast types more reliable than using just one?",opts:["If one type is weak, the others still reinforce the focal point","It doubles file size for no reason","It removes all layout decisions","It only works in print"],ans:"If one type is weak, the others still reinforce the focal point",exp:"Multiple contrast types provide backup so the focal point still reads clearly."},
  {q:"A focal point disappears for a colourblind viewer. What should be checked first?",opts:["Value contrast, since it does not depend on distinguishing hues","Temperature contrast only","Saturation contrast only","This cannot be addressed with contrast"],ans:"Value contrast, since it does not depend on distinguishing hues",exp:"Value contrast remains reliable even when hue distinctions are hard to perceive."},
  {q:"A headline in bold warm colour still fails to draw the eye. What is likely missing?",opts:["Sufficient value or saturation contrast against its surroundings","A cooler colour instead","A smaller size","Nothing, warm colour always guarantees focus"],ans:"Sufficient value or saturation contrast against its surroundings",exp:"Temperature contrast alone may not be enough without reinforcing value or saturation."},
  {q:"The core practical value of value, saturation and temperature contrast is:",opts:["Reliable tools for building visual hierarchy","A replacement for a harmony scheme","A rule only for print design","A way to avoid using colour"],ans:"Reliable tools for building visual hierarchy",exp:"That is the entire practical value of this lesson's contrast types."},
];

const BRAND_BANK=[
  {name:"Spotify",c1:"#191414",c2:"#1DB954",hint:"A near-black interface with a bright saturated green used for play buttons and highlights",ans:"saturation",exp:"The vivid green against a nearly desaturated black interface is a clear saturation contrast."},
  {name:"Netflix",c1:"#000000",c2:"#E50914",hint:"A near-black interface with a bright red used sparingly for the logo and key buttons",ans:"value",exp:"The bright red against pure black relies heavily on the lightness gap, a strong value contrast."},
  {name:"Duolingo",c1:"#FFFFFF",c2:"#58CC02",hint:"A mostly white interface with a saturated green mascot and buttons that pop against the pale background",ans:"saturation",exp:"The saturated green against a mostly white, low-saturation interface creates a clear saturation contrast."},
  {name:"Airbnb",c1:"#484848",c2:"#FF5A5F",hint:"A warm coral CTA button placed against cooler grey text and neutral backgrounds throughout the app",ans:"temperature",exp:"The warm coral against cooler neutral greys leans on temperature contrast to draw focus."},
  {name:"Notion",c1:"#FFFFFF",c2:"#000000",hint:"Near-black text on a near-white page, with almost no colour used for hierarchy at all",ans:"value",exp:"Notion relies almost entirely on the lightness gap between black text and white background."},
  {name:"Headspace",c1:"#F4E7D9",c2:"#FF8C42",hint:"A warm orange illustration element placed against a cooler-leaning cream background",ans:"temperature",exp:"The warm orange against the cooler cream base leans on temperature contrast for its friendly pop."},
  {name:"Robinhood",c1:"#F7F7F7",c2:"#00C805",hint:"A mostly white and light-grey app with a single saturated green used for gains and key actions",ans:"saturation",exp:"The saturated green against a muted grey-white interface is a clear saturation contrast."},
  {name:"A print magazine pull-quote",c1:"#E8E8E8",c2:"#111111",hint:"A near-black bold pull-quote placed against a light grey page background to demand attention",ans:"value",exp:"The strong lightness gap between near-black text and a pale page is a classic value contrast."},
  {name:"Coca-Cola vending machine design",c1:"#0B3D91",c2:"#F40009",hint:"A warm, saturated red logo placed against cooler blue signage in some international vending displays",ans:"temperature",exp:"The warm red against the cooler blue background relies on temperature contrast for visibility."},
  {name:"A dark-mode code editor",c1:"#1E1E1E",c2:"#FFD700",hint:"A near-black background with a single bright saturated yellow used to highlight a syntax error",ans:"saturation",exp:"The vivid yellow highlight against a desaturated dark background is a clear saturation contrast."},
  {name:"Nike sale banner",c1:"#111111",c2:"#FFFFFF",hint:"Bold white sale text placed directly against a solid black banner background for maximum legibility",ans:"value",exp:"Pure white against pure black is one of the strongest possible value contrasts available."},
  {name:"A wellness app onboarding screen",c1:"#DCEFE3",c2:"#FF8C42",hint:"A warm orange icon placed against a cooler pale mint-green onboarding background",ans:"temperature",exp:"The warm orange icon against the cooler mint background leans on temperature contrast to stand out."},
  {name:"Slack notification badge",c1:"#4A154B",c2:"#E01E5A",hint:"A saturated pink-red notification dot placed against the muted aubergine sidebar background",ans:"saturation",exp:"The saturated notification badge against the more muted sidebar colour is a saturation contrast."},
  {name:"A minimalist portfolio site",c1:"#FAFAFA",c2:"#0A0A0A",hint:"Near-black headings on an almost pure white background, with no other colour used for hierarchy",ans:"value",exp:"This relies entirely on the strong lightness gap between near-black and near-white."},
  {name:"A travel app destination card",c1:"#2C3E66",c2:"#FF6B35",hint:"A warm orange call-to-action placed against a cooler navy-blue destination photo overlay",ans:"temperature",exp:"The warm orange button against the cooler navy overlay leans on temperature contrast for visibility."},
];

const TAKEAWAY_QUOTE="Colour alone does not guarantee focus. Difference does - light against dark, vivid against muted, warm against cool.";
const TAKEAWAY_POINTS=[
  {t:"Check value contrast first",b:"It is the most reliable contrast type, since it works regardless of hue - even in greyscale. Start here before touching saturation or temperature."},
  {t:"One saturated element beats many",b:"A single vivid element in a muted field draws the eye. Several saturated elements together compete and cancel each other out."},
  {t:"Stack contrasts for certainty",b:"A focal point that is lighter, more saturated and warmer than everything around it is nearly impossible for the eye to miss."},
];

const SOURCES=[
  "Johannes Itten - The Art of Color (1961). Catalogued the core contrasts of colour, including value, saturation and temperature.",
];

export default function CT09TemperatureContrast(){
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
  const[dotColor,setDotColor]=useState("#FF7A00");
  const[bgColor,setBgColor]=useState("#1A3A5C");
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
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 0"}}>Three kinds of difference. One job: tell the eye where to look first.</p>
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
              <Tag color={T.brand}>EXPLORE - GREYSCALE CHECK</Tag>
              <p style={{fontSize:13,color:T.muted,lineHeight:1.6,margin:"10px 0 14px"}}>Pick a dot and background colour, then check if the value contrast survives in greyscale.</p>
              <div style={{display:"flex",gap:10,marginBottom:14}}>
                <label style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
                  <span style={{fontSize:11,color:T.muted}}>Dot colour</span>
                  <input type="color" value={dotColor} onChange={function(e){setDotColor(e.target.value);}} style={{width:"100%",height:40,border:"none",background:"none",cursor:"pointer",borderRadius:8}}/>
                </label>
                <label style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
                  <span style={{fontSize:11,color:T.muted}}>Background colour</span>
                  <input type="color" value={bgColor} onChange={function(e){setBgColor(e.target.value);}} style={{width:"100%",height:40,border:"none",background:"none",cursor:"pointer",borderRadius:8}}/>
                </label>
              </div>
              <div style={{display:"flex",gap:10}}>
                <div style={{flex:1,height:90,borderRadius:12,background:bgColor,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:dotColor}}/>
                </div>
                <div style={{flex:1,height:90,borderRadius:12,background:mixToGrey(bgColor),display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:mixToGrey(dotColor)}}/>
                </div>
              </div>
              <div style={{fontSize:11,color:T.dim,marginTop:10,textAlign:"center"}}>Left: full colour. Right: greyscale simulation - if the dot disappears here, value contrast is missing.</div>
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
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.6,margin:"0 0 12px"}}>Which contrast type does the second colour primarily rely on against the first?</p>
                  <div style={{display:"flex",gap:10,marginBottom:8}}>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c1,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid "+T.border}}><span style={{fontSize:10,color:"rgba(255,255,255,.5)"}}>COLOUR 1</span></div>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c2,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>COLOUR 2</span></div>
                  </div>
                  <p style={{fontSize:11,color:T.dim,margin:"0 0 12px"}}>Hint: {brand.hint}</p>
                  {!myRev&&(
                    <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
                      {["Value","Saturation","Temperature"].map(function(opt){
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
