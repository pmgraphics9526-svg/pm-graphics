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

const LESSON_MODULE="COLOUR THEORY - TOPIC 05";
const LESSON_TITLE="Warm vs Cool";
const LESSON_SUBTITLE="Johannes Itten 1961 - Bauhaus Colour Education";

const STORY_PARA_1="Painters noticed it long before anyone had a word for it: reds, oranges and yellows on a canvas seemed to jump forward and press toward the viewer, like standing near a fire. Blues, greens and violets seemed to sink backward and settle away, like looking into deep water or open sky.";
const STORY_PARA_2="It was not a trick of the paint - it was a trick of association. The eye and brain read red, orange and yellow as heat, energy, closeness. It reads blue, green and violet as coolness, calm, distance. That association is strong enough to change how a flat, two-dimensional canvas feels in space.";
const STORY_PARA_3="Johannes Itten formalised this at the Bauhaus into a simple, teachable split: every hue on the wheel belongs to a warm half or a cool half, and knowing which half you are using changes how close, how urgent, and how calm your design feels.";
const STORY_PROBLEM="You built a layout, every colour felt technically fine, and it still felt flat - nothing pulled forward, nothing pushed back, the whole thing sat on one plane. Warm and cool is often the missing ingredient that gives a flat design a sense of depth and priority.";
const STORY_5Q=[
  {q:"What is it?",a:"Every hue on the wheel splits into two families: warm (reds, oranges, yellows) and cool (blues, greens, violets)."},
  {q:"Why does it exist?",a:"Warm and cool hues behave differently in a composition - warm feels close and active, cool feels distant and calm - and a designer needs to control that on purpose."},
  {q:"How does it work?",a:"Warm hues visually advance toward the viewer. Cool hues visually recede into the background. The split runs roughly through the middle of the wheel."},
  {q:"How will you use it?",a:"Push a call-to-action or focal element forward using a warm colour against a cool or neutral background that recedes."},
  {q:"What if you skip it?",a:"Every element sits on the same flat plane - nothing reads as closer, more urgent, or more important than anything else."},
];

const CONCEPT_SECTIONS=[
  {tag:"WARM HUES",tagColor:"#FF7A00",formula:"Red, Orange, Yellow",desc:"Hues associated with fire, sun and heat. They visually advance toward the viewer and read as energetic, urgent, active.",rule:"Use warm hues for anything that should feel close, exciting or demand immediate attention - buttons, alerts, calls to action."},
  {tag:"COOL HUES",tagColor:"#3EC6E0",formula:"Blue, Green, Violet",desc:"Hues associated with water, sky and shade. They visually recede away from the viewer and read as calm, distant, settled.",rule:"Use cool hues for anything that should feel spacious, calm or step back and let other elements lead - backgrounds, large surfaces."},
  {tag:"THE AMBIGUOUS EDGE",tagColor:"#B08CFF",formula:"Red-Violet & Yellow-Green",desc:"A few hues sit right on the border between the two families. Red-violet can lean warm or cool depending on how much red or blue dominates it; yellow-green can lean warm or cool the same way.",rule:"When a hue sits on the edge, judge it by which primary is stronger in the mix, not by its name alone."},
  {tag:"ADVANCE AND RECEDE",tagColor:T.green,formula:"Warm = Forward, Cool = Backward",desc:"Because warm hues advance and cool hues recede, pairing them in one composition creates the illusion of depth on a flat, two-dimensional surface - even with no shadows or perspective at all.",rule:"A warm focal point on a cool background reads as closer and more important without any extra size or contrast needed."},
];

function hueToRgb(h){
  const c=1,x=1-Math.abs(((h/60)%2)-1),m=0;
  let r=0,g=0,b=0;
  if(h<60){r=c;g=x;b=0;} else if(h<120){r=x;g=c;b=0;} else if(h<180){r=0;g=c;b=x;} else if(h<240){r=0;g=x;b=c;} else if(h<300){r=x;g=0;b=c;} else {r=c;g=0;b=x;}
  return {r:Math.round((r+m)*255),g:Math.round((g+m)*255),b:Math.round((b+m)*255)};
}
function isWarm(h){
  return (h>=345||h<=90);
}

const QUESTION_BANK=[
  {id:"w1",q:"Which three hues make up the warm family?",opts:["Red, orange, yellow","Blue, green, violet","Red, blue, yellow","Green, orange, violet"],ans:"Red, orange, yellow",exp:"Warm hues cluster around red, orange and yellow - associated with fire and sun."},
  {id:"w2",q:"Which three hues make up the cool family?",opts:["Blue, green, violet","Red, orange, yellow","Yellow, red, green","Violet, orange, red"],ans:"Blue, green, violet",exp:"Cool hues cluster around blue, green and violet - associated with water and sky."},
  {id:"w3",q:"Warm hues visually:",opts:["Advance toward the viewer","Recede from the viewer","Have no spatial effect","Always look darker"],ans:"Advance toward the viewer",exp:"Warm hues create the illusion of moving closer to the eye."},
  {id:"w4",q:"Cool hues visually:",opts:["Recede from the viewer","Advance toward the viewer","Always look brighter","Have no spatial effect"],ans:"Recede from the viewer",exp:"Cool hues create the illusion of settling further away from the eye."},
  {id:"w5",q:"Which feeling is most associated with warm hues?",opts:["Energy and urgency","Calm and distance","Sadness","Silence"],ans:"Energy and urgency",exp:"Warm hues read as active and energetic, tied to heat and fire."},
  {id:"w6",q:"Which feeling is most associated with cool hues?",opts:["Calm and distance","Energy and urgency","Aggression","Excitement"],ans:"Calm and distance",exp:"Cool hues read as settled and calm, tied to water and sky."},
  {id:"w7",q:"A call-to-action button is usually given a hue from which family, to grab attention?",opts:["Warm","Cool","Neither, colour has no effect","Always grey"],ans:"Warm",exp:"Warm hues advance and demand attention, ideal for buttons and alerts."},
  {id:"w8",q:"A calm, spacious app background is usually given a hue from which family?",opts:["Cool","Warm","Only black or white","Random"],ans:"Cool",exp:"Cool hues recede and feel spacious, well suited to large calm backgrounds."},
  {id:"w9",q:"Which hues sit on the ambiguous edge between warm and cool?",opts:["Red-violet and yellow-green","Pure red and pure blue","Orange and green only","Black and white"],ans:"Red-violet and yellow-green",exp:"These border hues can lean warm or cool depending on which primary dominates."},
  {id:"w10",q:"A red-violet with more blue in the mix leans:",opts:["Cool","Warm","Neutral only","It cannot lean either way"],ans:"Cool",exp:"The stronger primary in a border hue determines which side it leans toward."},
  {id:"w11",q:"A yellow-green with more yellow in the mix leans:",opts:["Warm","Cool","Neutral only","It has no lean"],ans:"Warm",exp:"More yellow pulls the border hue toward the warm family."},
  {id:"w12",q:"Placing a warm object on a cool background creates the illusion of:",opts:["Depth - the object appears closer","Flatness - everything looks the same","The object disappearing","No visible effect"],ans:"Depth - the object appears closer",exp:"The advancing warm hue against the receding cool hue creates spatial depth."},
  {id:"w13",q:"Which teacher formalised warm versus cool into a teachable Bauhaus system?",opts:["Johannes Itten","Pablo Picasso","Leonardo da Vinci","Andy Warhol"],ans:"Johannes Itten",exp:"Itten taught warm and cool as a foundational colour principle at the Bauhaus."},
  {id:"w14",q:"Warm and cool hues create spatial depth on a flat surface without needing:",opts:["Shadows or perspective lines","Any colour at all","A colour wheel","Software"],ans:"Shadows or perspective lines",exp:"The warm-advance, cool-recede effect alone can suggest depth, even with no other depth cues."},
  {id:"w15",q:"A designer wants a headline to feel urgent and immediate. Which hue family fits best?",opts:["Warm","Cool","Grayscale only","Either, it makes no difference"],ans:"Warm",exp:"Warm hues naturally read as urgent and active."},
  {id:"w16",q:"A designer wants a meditation app background to feel settled and peaceful. Which hue family fits best?",opts:["Cool","Warm","Bright neon only","Either, it makes no difference"],ans:"Cool",exp:"Cool hues naturally read as calm and settled."},
  {id:"w17",q:"Is pure yellow generally classified as warm or cool?",opts:["Warm","Cool","Neither","Always ambiguous"],ans:"Warm",exp:"Yellow sits firmly in the warm family, alongside red and orange."},
  {id:"w18",q:"Is pure blue generally classified as warm or cool?",opts:["Cool","Warm","Neither","Always ambiguous"],ans:"Cool",exp:"Blue sits firmly in the cool family, alongside green and violet."},
  {id:"w19",q:"Is pure green generally classified as warm or cool?",opts:["Cool","Warm","Neither","Always ambiguous"],ans:"Cool",exp:"Green sits in the cool family, associated with foliage and calm."},
  {id:"w20",q:"Is pure orange generally classified as warm or cool?",opts:["Warm","Cool","Neither","Always ambiguous"],ans:"Warm",exp:"Orange sits firmly in the warm family, alongside red and yellow."},
  {id:"w21",q:"What roughly determines the boundary between the warm and cool halves of the wheel?",opts:["The line running through the red-violet and yellow-green region","Lightness of the colour","Saturation of the colour","The colour's name length"],ans:"The line running through the red-violet and yellow-green region",exp:"The warm-cool split runs approximately through these two border zones on the wheel."},
  {id:"w22",q:"A poster with a warm foreground subject and a cool background will most likely read as:",opts:["The subject standing out and appearing closer","The subject disappearing into the background","Completely flat with no depth","Impossible to see"],ans:"The subject standing out and appearing closer",exp:"Warm advances, cool recedes - together they separate foreground from background."},
  {id:"w23",q:"Why might a landscape painter use cool tones for distant mountains and warm tones for the foreground?",opts:["To reinforce the illusion of distance using warm-advance, cool-recede","Because cool paint is cheaper","Because warm paint dries faster","It has no real effect on depth"],ans:"To reinforce the illusion of distance using warm-advance, cool-recede",exp:"This is a classic technique for suggesting depth using colour temperature alone."},
  {id:"w24",q:"A UI designer notices a warm accent colour on a cool grey interface always draws the eye first. Why?",opts:["Warm hues naturally advance and grab attention against a receding cool base","Warm colours are always brighter in value","Cool colours cannot be seen clearly","There is no real reason, it is coincidence"],ans:"Warm hues naturally advance and grab attention against a receding cool base",exp:"This is warm-cool contrast doing exactly what it is meant to do - directing focus."},
  {id:"w25",q:"Which of these best describes a neutral, low-saturation grey?",opts:["It has little to no warm or cool character until tinted","Always strongly warm","Always strongly cool","Neutrals do not exist"],ans:"It has little to no warm or cool character until tinted",exp:"True neutrals sit near the center of the wheel with minimal hue - warm/cool only shows once a hue is mixed in."},
  {id:"w26",q:"A grey can be pushed toward a warm or cool character by:",opts:["Mixing in a small amount of a warm or cool hue","Only by making it darker","Only by making it lighter","It cannot be changed"],ans:"Mixing in a small amount of a warm or cool hue",exp:"Even a slight tint of red or blue can shift a neutral grey toward warm or cool."},
  {id:"w27",q:"Which pairing is most likely to feel energetic and forward-pushing in a poster?",opts:["Warm subject on cool background","Cool subject on cool background","Grey subject on grey background","Cool subject on warm background subdued"],ans:"Warm subject on cool background",exp:"This pairing maximises the advance-recede contrast for maximum energy and depth."},
  {id:"w28",q:"Which pairing is most likely to feel calm and unified in a poster?",opts:["Cool subject on cool background","Warm subject on cool background","Bright warm on bright warm with high contrast","There is no calm pairing possible"],ans:"Cool subject on cool background",exp:"Staying within the cool family keeps the composition calm and cohesive."},
  {id:"w29",q:"A brand wants its logo to feel approachable, active and youthful. Which family of hues is a natural starting point?",opts:["Warm","Cool","Grayscale","Black only"],ans:"Warm",exp:"Warm hues naturally carry energetic, active associations that suit an active brand tone."},
  {id:"w30",q:"A brand wants its logo to feel trustworthy, professional and steady. Which family of hues is a natural starting point?",opts:["Cool","Warm","Bright neon","Black only"],ans:"Cool",exp:"Cool hues naturally carry calm, steady associations that suit a professional brand tone."},
  {id:"w31",q:"Which of these is an example of a warm colour palette?",opts:["Red, orange and gold","Blue, teal and navy","Green, mint and forest","Violet, lavender and indigo"],ans:"Red, orange and gold",exp:"All three sit in the warm half of the wheel."},
  {id:"w32",q:"Which of these is an example of a cool colour palette?",opts:["Blue, teal and navy","Red, orange and gold","Yellow, amber and rust","Coral, salmon and peach"],ans:"Blue, teal and navy",exp:"All three sit in the cool half of the wheel."},
  {id:"w33",q:"What visual role does a warm accent play on an otherwise cool interface?",opts:["It becomes the natural focal point","It disappears entirely","It makes the whole interface feel colder","It has no role"],ans:"It becomes the natural focal point",exp:"A warm accent naturally advances and stands out against a cool base."},
  {id:"w34",q:"Why is warm versus cool considered a spatial tool, not just a mood tool?",opts:["Because it changes how close or far elements appear to the eye, not just how they feel","Because it only affects text size","Because it changes the actual physical distance of the screen","Because it has no relation to space at all"],ans:"Because it changes how close or far elements appear to the eye, not just how they feel",exp:"Warm/cool affects perceived depth on a flat surface, which is a spatial effect, alongside its emotional one."},
  {id:"w35",q:"A poster designer wants the background to disappear and the subject to pop. Best approach:",opts:["Cool, receding background with a warm, advancing subject","Warm background with a warm subject","Cool background with a cool subject","Any colour combination works equally well"],ans:"Cool, receding background with a warm, advancing subject",exp:"This maximises the contrast that makes a subject visually separate from its background."},
  {id:"w36",q:"Which best explains why fire and sun are used to describe warm hues?",opts:["Fire and sun are visually associated with red, orange and yellow, giving the family its name and feel","Fire and sun are actually blue","It is a random naming convention with no link to real associations","Warm hues were named after paint brands"],ans:"Fire and sun are visually associated with red, orange and yellow, giving the family its name and feel",exp:"The warm/cool naming comes directly from real-world associations with heat and cold."},
  {id:"w37",q:"Which best explains why water and sky are used to describe cool hues?",opts:["Water and sky are visually associated with blue and green, giving the family its name and feel","Water and sky are actually orange","It is unrelated to any real association","Cool hues were named after a season"],ans:"Water and sky are visually associated with blue and green, giving the family its name and feel",exp:"The cool naming comes directly from real-world associations with water and sky."},
  {id:"w38",q:"If a designer wants a single hero image to feel like it is jumping off the page, they would most likely make the hero:",opts:["Warm against a cool or neutral surrounding","Cool against a warm surrounding","The same hue as the background","Grayscale only"],ans:"Warm against a cool or neutral surrounding",exp:"Warm-on-cool maximises the perceived forward-pop of the hero element."},
  {id:"w39",q:"A cool colour palette used across an entire interface, with no warm accents at all, risks feeling:",opts:["Flat with nothing to draw the eye anywhere","Too energetic and chaotic","Impossible to read","Always more expensive to produce"],ans:"Flat with nothing to draw the eye anywhere",exp:"Without any warm contrast, there is nothing to advance and create a focal point."},
  {id:"w40",q:"A warm colour palette used across an entire interface, with no cool relief at all, risks feeling:",opts:["Overwhelming and fatiguing","Too calm and boring","Impossible to read","Always cheaper to produce"],ans:"Overwhelming and fatiguing",exp:"Constant warm energy with no cool balance can feel exhausting over time."},
  {id:"w41",q:"Which statement is most accurate about warm and cool hues?",opts:["Every hue on the wheel belongs to one family or sits on the ambiguous border between them","Only red and blue have a temperature, other hues do not","Warm and cool only apply to paint, not screens","Warm and cool have no relationship to the colour wheel"],ans:"Every hue on the wheel belongs to one family or sits on the ambiguous border between them",exp:"The entire wheel is split into warm and cool halves, with a few border hues in between."},
  {id:"w42",q:"A single flat-colour icon needs to feel urgent, like a warning. The best hue choice is:",opts:["A warm hue like red or orange","A cool hue like blue or green","Pure white","Pure black"],ans:"A warm hue like red or orange",exp:"Warm hues are strongly tied to urgency and alert in visual communication."},
  {id:"w43",q:"A single flat-colour icon needs to feel safe and informative, like a confirmation. The best hue choice is:",opts:["A cool hue like blue or green","A warm hue like red or orange","Pure black","Bright magenta"],ans:"A cool hue like blue or green",exp:"Cool hues, especially green and blue, are commonly tied to safety and confirmation."},
  {id:"w44",q:"Warm versus cool classification is based primarily on:",opts:["Which hue family a colour belongs to on the wheel","How light or dark the colour is","How saturated the colour is","The exact hex code used"],ans:"Which hue family a colour belongs to on the wheel",exp:"Temperature is a property of hue, not of lightness or saturation."},
  {id:"w45",q:"Can a dark shade of a warm hue still be classified as warm?",opts:["Yes, temperature is about hue family, not lightness","No, dark colours are always cool","No, shades are never classified as warm or cool","Only if it is a tint, not a shade"],ans:"Yes, temperature is about hue family, not lightness",exp:"A dark red is still warm - darkening a hue with black does not change its temperature family."},
  {id:"w46",q:"Can a light tint of a cool hue still be classified as cool?",opts:["Yes, temperature is about hue family, not lightness","No, light colours are always warm","No, tints are never classified as warm or cool","Only if it is a shade, not a tint"],ans:"Yes, temperature is about hue family, not lightness",exp:"A pale blue is still cool - lightening a hue with white does not change its temperature family."},
  {id:"w47",q:"A restaurant brand wants to feel appetising and inviting. Warm hues are often chosen because:",opts:["They are associated with energy and can stimulate appetite","They make food photography impossible","They always look unappetising","They have no association with food at all"],ans:"They are associated with energy and can stimulate appetite",exp:"Warm hues carry strong appetite and energy associations, commonly used in food branding."},
  {id:"w48",q:"A spa or wellness brand wants to feel relaxing and clean. Cool hues are often chosen because:",opts:["They are associated with calm and cleanliness","They always look sterile and unwelcoming","They make the brand feel more expensive automatically","They have no relaxing association at all"],ans:"They are associated with calm and cleanliness",exp:"Cool hues carry strong calm, clean and settled associations, common in wellness branding."},
  {id:"w49",q:"The core practical use of warm versus cool for a designer is:",opts:["Controlling depth, focus and mood using hue temperature alone","Deciding which font to use","Deciding image resolution","Deciding file format"],ans:"Controlling depth, focus and mood using hue temperature alone",exp:"That is the entire practical value of the warm/cool split for design decisions."},
  {id:"w50",q:"In one sentence, warm and cool hues:",opts:["Split every hue into two families that advance or recede and feel active or calm","Are two names for the same thing","Only exist in painting, not digital design","Have no effect on how a design feels"],ans:"Split every hue into two families that advance or recede and feel active or calm",exp:"That is the complete summary of this lesson's core idea."},
];

const CB_TYPE="topic";
const CB_QUESTIONS=[
  {q:"Red, orange and yellow belong to which family?",opts:["Warm","Cool","Neutral","Ambiguous"],ans:"Warm",exp:"These three hues make up the warm family."},
  {q:"Blue, green and violet belong to which family?",opts:["Cool","Warm","Neutral","Ambiguous"],ans:"Cool",exp:"These three hues make up the cool family."},
  {q:"Warm hues visually do what in a composition?",opts:["Advance","Recede","Disappear","Nothing"],ans:"Advance",exp:"Warm hues create the illusion of moving toward the viewer."},
  {q:"Cool hues visually do what in a composition?",opts:["Recede","Advance","Disappear","Nothing"],ans:"Recede",exp:"Cool hues create the illusion of settling away from the viewer."},
  {q:"Which family is best for a call-to-action button that must grab attention?",opts:["Warm","Cool","Grayscale","Either, no difference"],ans:"Warm",exp:"Warm hues naturally advance and draw the eye."},
  {q:"Which family is best for a calm, spacious background?",opts:["Cool","Warm","Bright neon","Either, no difference"],ans:"Cool",exp:"Cool hues naturally recede and stay out of the way."},
  {q:"Red-violet and yellow-green are examples of:",opts:["Ambiguous border hues between warm and cool","Pure warm hues only","Pure cool hues only","Neutral greys"],ans:"Ambiguous border hues between warm and cool",exp:"These hues can lean warm or cool depending on which primary dominates."},
  {q:"A warm subject on a cool background creates the illusion of:",opts:["Depth and separation","Total flatness","Colour blindness","No visible change"],ans:"Depth and separation",exp:"This pairing maximises the advancing/receding contrast."},
  {q:"Who formalised warm versus cool as a Bauhaus teaching principle?",opts:["Johannes Itten","Pablo Picasso","Andy Warhol","Coco Chanel"],ans:"Johannes Itten",exp:"Itten taught warm and cool as a foundational Bauhaus colour principle."},
  {q:"Is pure yellow warm or cool?",opts:["Warm","Cool","Neutral","Ambiguous"],ans:"Warm",exp:"Yellow sits in the warm family."},
  {q:"Is pure blue warm or cool?",opts:["Cool","Warm","Neutral","Ambiguous"],ans:"Cool",exp:"Blue sits in the cool family."},
  {q:"Does temperature depend on hue, lightness, or saturation?",opts:["Hue","Lightness","Saturation","None of these"],ans:"Hue",exp:"Warm and cool classification is a property of hue, not lightness or saturation."},
  {q:"A dark shade of red is still classified as:",opts:["Warm","Cool","Neutral","It loses its temperature"],ans:"Warm",exp:"Darkening a warm hue with black does not change its temperature family."},
  {q:"A light tint of blue is still classified as:",opts:["Cool","Warm","Neutral","It loses its temperature"],ans:"Cool",exp:"Lightening a cool hue with white does not change its temperature family."},
  {q:"A restaurant brand chooses warm hues most often because they are associated with:",opts:["Energy and appetite","Calm and cleanliness","Silence","Nothing food-related"],ans:"Energy and appetite",exp:"Warm hues are strongly tied to energy and appetite stimulation."},
  {q:"A wellness brand chooses cool hues most often because they are associated with:",opts:["Calm and cleanliness","Energy and urgency","Aggression","Nothing relaxing"],ans:"Calm and cleanliness",exp:"Cool hues are strongly tied to calm and clean associations."},
  {q:"A landscape painter uses cool tones for distant mountains mainly to:",opts:["Reinforce the illusion of distance","Save on paint cost","Make the mountains disappear entirely","Match the sky exactly"],ans:"Reinforce the illusion of distance",exp:"Cool-recede is a classic technique for suggesting spatial distance."},
  {q:"An interface using only cool hues everywhere, with no warm accent, risks feeling:",opts:["Flat, with nothing to draw the eye","Too chaotic and busy","Impossible to read","Overly warm"],ans:"Flat, with nothing to draw the eye",exp:"Without warm contrast there is no advancing element to create focus."},
  {q:"An interface using only warm hues everywhere, with no cool relief, risks feeling:",opts:["Overwhelming and fatiguing","Too calm and boring","Impossible to read","Too cold"],ans:"Overwhelming and fatiguing",exp:"Constant warm intensity with no cool balance can tire the eye over time."},
  {q:"Which pairing feels most calm and unified?",opts:["Cool subject on cool background","Warm subject on cool background","Warm subject on warm high-contrast background","There is no calm pairing"],ans:"Cool subject on cool background",exp:"Staying within one temperature family keeps the composition cohesive and calm."},
  {q:"Which pairing feels most energetic and separated?",opts:["Warm subject on cool background","Cool subject on cool background","Grey subject on grey background","Warm subject on warm background low-contrast"],ans:"Warm subject on cool background",exp:"This maximises the advance/recede effect for energy and clear separation."},
  {q:"A grey can be pushed toward warm or cool by:",opts:["Mixing in a small amount of a warm or cool hue","Making it lighter only","Making it darker only","It is impossible to change"],ans:"Mixing in a small amount of a warm or cool hue",exp:"A slight tint shifts a neutral grey toward one temperature family."},
  {q:"A brand wanting to feel trustworthy and steady is more likely to start with:",opts:["Cool hues","Warm hues","Bright neon only","No colour at all"],ans:"Cool hues",exp:"Cool hues carry calm, steady, trustworthy associations."},
  {q:"A brand wanting to feel youthful and active is more likely to start with:",opts:["Warm hues","Cool hues","Grayscale only","No colour at all"],ans:"Warm hues",exp:"Warm hues carry energetic, active, youthful associations."},
  {q:"The core practical use of warm versus cool for a designer is:",opts:["Controlling depth, focus and mood using hue temperature","Choosing the correct font pairing","Setting the correct image resolution","Naming files consistently"],ans:"Controlling depth, focus and mood using hue temperature",exp:"That is the entire practical value of this lesson."},
];

const BRAND_BANK=[
  {name:"McDonald's",c1:"#DA291C",c2:"#FFC72C",hint:"Red and yellow used to feel energetic, fast and appetite-stimulating at every restaurant",ans:"warm",exp:"McDonald's red and yellow are both warm hues, chosen to feel energetic and appetising."},
  {name:"Coca-Cola",c1:"#F40009",c2:"#FFFFFF",hint:"A bold red used globally to feel exciting, energetic and immediately recognisable",ans:"warm",exp:"Coca-Cola's red is a warm hue, central to its energetic, exciting brand feel."},
  {name:"Facebook",c1:"#1877F2",c2:"#FFFFFF",hint:"A calm blue used across the platform to feel trustworthy, safe and steady",ans:"cool",exp:"Facebook's blue is a cool hue, chosen to feel trustworthy and calm."},
  {name:"Headspace",c1:"#FF8C42",c2:"#F4E7D9",hint:"A warm orange used for illustrations meant to feel friendly and inviting, though the overall app leans calmer with soft neutrals",ans:"warm",exp:"Headspace's core illustration colour is a warm orange, chosen to feel friendly rather than clinical."},
  {name:"Slack",c1:"#4A154B",c2:"#FFFFFF",hint:"A deep aubergine leaning toward the cool-violet side of the wheel, used for a calm, professional workspace feel",ans:"cool",exp:"Slack's aubergine leans cool-violet, supporting a calm, professional tone."},
  {name:"Spotify",c1:"#1DB954",c2:"#191414",hint:"A vivid green used across the app to feel fresh, alive and energetic against a near-black background",ans:"cool",exp:"Spotify's green sits in the cool family, though used with high energy through contrast and saturation."},
  {name:"Starbucks",c1:"#00704A",c2:"#FFFFFF",hint:"A deep green used globally to feel calm, natural and premium at every store",ans:"cool",exp:"Starbucks green is a cool hue, supporting the brand's calm, natural positioning."},
  {name:"Duolingo",c1:"#58CC02",c2:"#FFFFFF",hint:"A bright green mascot and interface colour used to feel playful and energetic for daily learning",ans:"cool",exp:"Duolingo's green is technically cool by hue family, used with high saturation for an energetic feel."},
  {name:"Netflix",c1:"#E50914",c2:"#000000",hint:"A striking red used against black to feel dramatic, urgent and attention-grabbing",ans:"warm",exp:"Netflix red is a warm hue, chosen for maximum urgency and visual pop against dark backgrounds."},
  {name:"Home Depot",c1:"#F96302",c2:"#FFFFFF",hint:"A bold orange used across every store to feel energetic, hands-on and approachable",ans:"warm",exp:"Home Depot's orange is a warm hue, supporting an active, hands-on brand feel."},
  {name:"IKEA",c1:"#0058A3",c2:"#FFDA1A",hint:"A strong blue paired with yellow, the blue chosen to feel dependable and calm across every global store",ans:"cool",exp:"IKEA's primary blue is a cool hue, grounding the brand in a dependable, calm feel."},
  {name:"Zomato",c1:"#E23744",c2:"#FFFFFF",hint:"A bold red used across the app to feel energetic and appetite-driven for food discovery",ans:"warm",exp:"Zomato's red is a warm hue, chosen to stimulate appetite and urgency for food ordering."},
  {name:"Dropbox",c1:"#0061FF",c2:"#FFFFFF",hint:"A bright blue used throughout the product to feel reliable, safe and professional for file storage",ans:"cool",exp:"Dropbox blue is a cool hue, supporting trust and reliability for a storage product."},
  {name:"Airbnb",c1:"#FF5A5F",c2:"#FFFFFF",hint:"A warm coral-red used across the platform to feel welcoming, friendly and energetic for travel",ans:"warm",exp:"Airbnb's coral is a warm hue, chosen to feel inviting and energetic for travel and hospitality."},
  {name:"Trello",c1:"#0079BF",c2:"#FFFFFF",hint:"A calm blue used for boards and headers to feel organised, clear and steady for project work",ans:"cool",exp:"Trello's blue is a cool hue, supporting an organised, calm working environment."},
];

const TAKEAWAY_QUOTE="Warm hues walk toward you. Cool hues step back. Use that to decide what your design says first.";
const TAKEAWAY_POINTS=[
  {t:"Warm for attention, cool for space",b:"Reach for warm hues on anything that must be noticed first - buttons, alerts, focal points. Reach for cool hues for anything that should stay calm and out of the way."},
  {t:"Pair them for instant depth",b:"A warm element on a cool background reads as closer and more important with zero extra size, shadow or contrast needed."},
  {t:"Temperature survives tint and shade",b:"Lightening or darkening a hue does not change its warm or cool family - a dark red is still warm, a pale blue is still cool."},
];

const SOURCES=[
  "Johannes Itten - The Art of Color (1961). Formalised warm and cool as a foundational Bauhaus colour principle.",
];

export default function CT05WarmVsCool(){
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
  const[hue,setHue]=useState(20);
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

  const rgb=hueToRgb(hue);
  const warm=isWarm(hue);

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
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 0"}}>Every hue leans one of two ways: toward fire, or toward water.</p>
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
              <Tag color={T.brand}>EXPLORE - WARM OR COOL</Tag>
              <p style={{fontSize:13,color:T.muted,lineHeight:1.6,margin:"10px 0 14px"}}>Drag around the wheel and watch the classification update live.</p>
              <input type="range" min="0" max="359" value={hue} onChange={function(e){setHue(Number(e.target.value));}} style={{width:"100%",marginBottom:14}}/>
              <div style={{height:70,borderRadius:12,background:"rgb("+rgb.r+","+rgb.g+","+rgb.b+")",border:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
                <span style={{fontSize:13,fontWeight:800,color:warm?"#3A2000":"#FFFFFF",background:"rgba(255,255,255,.25)",padding:"5px 14px",borderRadius:20}}>{warm?"WARM":"COOL"}</span>
              </div>
              <div style={{fontSize:12,color:T.dim,textAlign:"center"}}>Hue angle: {hue} degrees</div>
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
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.6,margin:"0 0 12px"}}>Is this brand's core colour warm or cool?</p>
                  <div style={{display:"flex",gap:10,marginBottom:8}}>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c1,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>CORE COLOUR</span></div>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c2,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid "+T.border}}><span style={{fontSize:10,color:"rgba(0,0,0,.4)"}}>SECOND COLOUR</span></div>
                  </div>
                  <p style={{fontSize:11,color:T.dim,margin:"0 0 12px"}}>Hint: {brand.hint}</p>
                  {!myRev&&(
                    <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
                      {["Warm","Cool"].map(function(opt){
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
