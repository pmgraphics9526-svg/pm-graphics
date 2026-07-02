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

const LESSON_MODULE="COLOUR THEORY - TOPIC 06";
const LESSON_TITLE="Colour Harmony";
const LESSON_SUBTITLE="Johannes Itten 1961 - Formalised Wheel-Based Harmony Rules";

const STORY_PARA_1="Long before anyone mapped colours onto a wheel, dyers, weavers and painters combined colours by trial and error, keeping the pairings that felt right and discarding the ones that clashed. Nobody could say exactly why some combinations worked - they just did.";
const STORY_PARA_2="Once the colour wheel existed, theorists noticed something remarkable: the combinations people had been reaching for by instinct all sat at consistent, repeatable angles on the wheel. Opposite hues. Neighbouring hues. Hues spaced evenly apart. The instinct had a geometry behind it the whole time.";
const STORY_PARA_3="That geometry became colour harmony - a set of fixed angle-based recipes on the wheel that reliably produce combinations which feel balanced, rather than combinations picked at random and hoping they work.";
const STORY_PROBLEM="You picked two or three colours that each looked fine on their own, put them together, and the whole thing felt off - fighting, clashing, or just flat and boring. Colour harmony replaces that guesswork with a small set of proven wheel-based recipes.";
const STORY_5Q=[
  {q:"What is it?",a:"A small set of fixed angle-based recipes on the colour wheel - complementary, analogous, triadic, split-complementary, monochromatic - that reliably produce balanced colour combinations."},
  {q:"Why does it exist?",a:"Because picking colours at random is unreliable. Harmony schemes give a repeatable starting point that is proven to work before any personal taste is added."},
  {q:"How does it work?",a:"Each scheme is defined by the angle between hues on the wheel - opposite, adjacent, evenly spaced, or variations of one hue."},
  {q:"How will you use it?",a:"Pick a scheme based on how much contrast and energy the project needs, then choose one dominant hue and let the rest support it."},
  {q:"What if you skip it?",a:"You are gambling on instinct alone every time you pick a palette - sometimes it works, often it does not, and there is no repeatable process behind it."},
];

const CONCEPT_SECTIONS=[
  {tag:"COMPLEMENTARY",tagColor:T.brand,formula:"2 hues, 180 degrees apart",desc:"Two hues sitting directly opposite each other on the wheel. This pairing creates the highest possible contrast between two hues.",rule:"Use one hue as the dominant colour and the other only as a small accent - equal amounts of both at full strength will vibrate and clash."},
  {tag:"ANALOGOUS",tagColor:"#3EC6E0",formula:"3 hues, about 30 degrees apart",desc:"Hues sitting next to each other on the wheel. Because they share a common neighbour hue, they blend naturally with low contrast and high cohesion.",rule:"Choose one hue to dominate, one to support, and one for a small accent - do not use all three in equal amounts."},
  {tag:"TRIADIC",tagColor:"#B08CFF",formula:"3 hues, 120 degrees apart",desc:"Three hues evenly spaced around the wheel. This gives vibrant contrast while staying more balanced than a pure complementary pair.",rule:"Let one hue lead the composition and use the other two sparingly, or the palette will feel busy and unfocused."},
  {tag:"SPLIT-COMPLEMENTARY",tagColor:T.green,formula:"1 base hue + 2 neighbours of its complement",desc:"A base hue paired with the two hues sitting beside its direct complement, rather than the complement itself. It keeps strong contrast but with less visual tension.",rule:"A safer, easier-to-balance alternative to a pure complementary pair - similar punch, fewer clashes."},
  {tag:"MONOCHROMATIC",tagColor:"#E0C93E",formula:"1 hue, varied lightness and saturation",desc:"A palette built entirely from one hue, using lighter, darker and more muted versions of it rather than introducing any second hue.",rule:"The safest, most cohesive scheme - but needs enough range in lightness or it will feel flat and monotonous."},
];

function hueToRgb(h){
  const hh=((h%360)+360)%360;
  const c=1,x=1-Math.abs(((hh/60)%2)-1);
  let r=0,g=0,b=0;
  if(hh<60){r=c;g=x;b=0;} else if(hh<120){r=x;g=c;b=0;} else if(hh<180){r=0;g=c;b=x;} else if(hh<240){r=0;g=x;b=c;} else if(hh<300){r=x;g=0;b=c;} else {r=c;g=0;b=x;}
  return "rgb("+Math.round(r*255)+","+Math.round(g*255)+","+Math.round(b*255)+")";
}

const QUESTION_BANK=[
  {id:"h1",q:"A complementary scheme pairs hues that are how far apart on the wheel?",opts:["180 degrees","30 degrees","90 degrees","360 degrees"],ans:"180 degrees",exp:"Complementary hues sit directly opposite one another on the wheel."},
  {id:"h2",q:"An analogous scheme uses hues that are:",opts:["Next to each other on the wheel","Directly opposite on the wheel","Evenly spaced 120 degrees apart","All the same hue"],ans:"Next to each other on the wheel",exp:"Analogous hues are neighbours on the wheel, sharing a common base."},
  {id:"h3",q:"A triadic scheme uses how many hues?",opts:["Three","Two","Four","One"],ans:"Three",exp:"Triadic schemes use exactly three hues evenly spaced around the wheel."},
  {id:"h4",q:"How far apart are the three hues in a triadic scheme?",opts:["120 degrees","180 degrees","30 degrees","90 degrees"],ans:"120 degrees",exp:"Triadic hues split the wheel into three equal parts, 120 degrees apart."},
  {id:"h5",q:"A monochromatic scheme uses how many base hues?",opts:["One","Two","Three","Four"],ans:"One",exp:"Monochromatic schemes stay within a single hue, varied in lightness and saturation."},
  {id:"h6",q:"Which scheme creates the highest contrast between exactly two hues?",opts:["Complementary","Analogous","Monochromatic","Split-complementary"],ans:"Complementary",exp:"Opposite hues on the wheel create the maximum possible contrast between two colours."},
  {id:"h7",q:"Which scheme is generally the safest and most cohesive, but risks feeling flat?",opts:["Monochromatic","Triadic","Complementary","Split-complementary"],ans:"Monochromatic",exp:"Staying within one hue guarantees cohesion but needs enough lightness range to avoid flatness."},
  {id:"h8",q:"A split-complementary scheme is built from:",opts:["A base hue plus the two neighbours of its direct complement","Three hues evenly spaced apart","Two hues directly opposite each other","One hue only"],ans:"A base hue plus the two neighbours of its direct complement",exp:"It avoids the exact complement itself, using the hues beside it instead."},
  {id:"h9",q:"Why might a designer choose split-complementary over a straight complementary pair?",opts:["It offers similar contrast with less visual tension and is easier to balance","It uses fewer colours","It is identical to analogous","It removes all contrast entirely"],ans:"It offers similar contrast with less visual tension and is easier to balance",exp:"Split-complementary softens the tension of a direct complementary pairing."},
  {id:"h10",q:"In a complementary scheme, what happens if both hues are used in equal amounts at full saturation?",opts:["They can visually vibrate and clash","They automatically become analogous","They cancel out into grey on screen","Nothing changes at all"],ans:"They can visually vibrate and clash",exp:"Equal, high-saturation complementary pairs can create an uncomfortable visual buzz."},
  {id:"h11",q:"In an analogous scheme, which hue should typically be used the most?",opts:["One chosen dominant hue, with the others as support and accent","All three in exactly equal amounts","Only the middle hue, ignoring the outer two","None, they cancel each other out"],ans:"One chosen dominant hue, with the others as support and accent",exp:"A dominant-support-accent split keeps an analogous palette from feeling muddled."},
  {id:"h12",q:"In a triadic scheme, the recommended usage pattern is:",opts:["One dominant hue, two used sparingly as accents","All three hues in exactly equal thirds","Only one of the three hues, ignoring the rest","Alternating all three every other element"],ans:"One dominant hue, two used sparingly as accents",exp:"Equal thirds tend to feel busy - one lead hue keeps a triadic palette focused."},
  {id:"h13",q:"Which scheme is built using tints, tones and shades of a single hue?",opts:["Monochromatic","Triadic","Complementary","Split-complementary"],ans:"Monochromatic",exp:"Monochromatic relies entirely on lightness and saturation variation of one hue."},
  {id:"h14",q:"Which of these is an example of a complementary pair?",opts:["Blue and orange","Blue and teal","Red and pink","Yellow and lime"],ans:"Blue and orange",exp:"Blue and orange sit roughly opposite each other on the standard colour wheel."},
  {id:"h15",q:"Which of these is an example of an analogous group?",opts:["Yellow, yellow-green and green","Red and green","Blue, yellow and red","Purple and yellow"],ans:"Yellow, yellow-green and green",exp:"These three hues sit next to each other on the wheel."},
  {id:"h16",q:"Which of these is an example of a triadic group?",opts:["Red, yellow and blue","Red and green only","Blue and blue-green","One shade of purple"],ans:"Red, yellow and blue",exp:"These three primaries are evenly spaced 120 degrees apart on the wheel."},
  {id:"h17",q:"Colour harmony schemes are defined primarily by:",opts:["The angle between hues on the colour wheel","The brightness of the hues","The cost of the ink or pigment","The country the design is used in"],ans:"The angle between hues on the colour wheel",exp:"Every harmony scheme is a fixed geometric relationship on the wheel."},
  {id:"h18",q:"Why do designers use fixed harmony schemes instead of picking colours at random?",opts:["Because random picking is unreliable, while wheel-based schemes reliably produce balance","Because random picking is illegal","Because software cannot generate random colours","Because harmony schemes always use fewer colours"],ans:"Because random picking is unreliable, while wheel-based schemes reliably produce balance",exp:"Harmony schemes give a proven, repeatable starting point instead of guesswork."},
  {id:"h19",q:"A logo needs maximum visual punch from just two colours. Which scheme fits best?",opts:["Complementary","Monochromatic","Analogous","None of these produce punch"],ans:"Complementary",exp:"Complementary pairs deliver the strongest two-colour contrast available."},
  {id:"h20",q:"A calm editorial palette needs to feel cohesive with a gentle range of colour. Which scheme fits best?",opts:["Analogous","Complementary","Triadic","Split-complementary"],ans:"Analogous",exp:"Analogous hues naturally blend, ideal for a gentle, cohesive feel."},
  {id:"h21",q:"A playful, energetic brand wants vibrant colour without feeling chaotic. Which scheme fits best?",opts:["Triadic with one dominant hue","Monochromatic only","Complementary at equal strength","No harmony scheme is suitable"],ans:"Triadic with one dominant hue",exp:"Triadic offers vibrant variety while a single dominant hue keeps it from feeling chaotic."},
  {id:"h22",q:"A minimalist brand wants one hue used consistently everywhere, from light to dark. Which scheme fits best?",opts:["Monochromatic","Triadic","Complementary","Split-complementary"],ans:"Monochromatic",exp:"Monochromatic is built entirely around variations of a single hue."},
  {id:"h23",q:"A designer wants complementary-level contrast but an easier, less clashing palette to balance. Which scheme fits best?",opts:["Split-complementary","Monochromatic","Analogous","Triadic at equal thirds"],ans:"Split-complementary",exp:"Split-complementary keeps strong contrast while reducing the visual tension of a direct complementary pair."},
  {id:"h24",q:"Which harmony scheme has the fewest total hues involved?",opts:["Monochromatic (technically one hue) or complementary (two hues)","Triadic","Split-complementary","Analogous always uses the most"],ans:"Monochromatic (technically one hue) or complementary (two hues)",exp:"Monochromatic uses one hue's variations; complementary uses exactly two distinct hues."},
  {id:"h25",q:"A poster needs the most dramatic possible contrast between a foreground subject and its background hue. Best scheme:",opts:["Complementary","Monochromatic","Analogous","Split-complementary is always weaker"],ans:"Complementary",exp:"Complementary pairs give the strongest possible two-hue contrast for separation."},
  {id:"h26",q:"Why is monochromatic considered the safest scheme for beginners?",opts:["There is no risk of clashing hues since only one hue is used","It always looks the most exciting","It requires the most colour theory knowledge","It cannot be used in branding"],ans:"There is no risk of clashing hues since only one hue is used",exp:"With only one hue, there is no possibility of a mismatched hue pairing."},
  {id:"h27",q:"What is the main risk of an analogous palette used without enough contrast in value?",opts:["It can feel low-energy and blend together without visual hierarchy","It becomes too loud and clashing","It automatically becomes complementary","It cannot be reproduced digitally"],ans:"It can feel low-energy and blend together without visual hierarchy",exp:"Because analogous hues are so close together, enough lightness variation is needed to keep hierarchy clear."},
  {id:"h28",q:"What is the main risk of a triadic palette used with all three hues at full, equal strength?",opts:["It can feel busy and unfocused, competing for attention","It becomes monochromatic","It becomes impossible to see","It automatically resolves into two colours"],ans:"It can feel busy and unfocused, competing for attention",exp:"Equal-strength triadic hues fight for attention instead of supporting one dominant hue."},
  {id:"h29",q:"A split-complementary scheme differs from a straight complementary scheme because it:",opts:["Uses the two hues beside the complement instead of the complement itself","Uses three primaries evenly spaced","Uses only one hue","Doubles the number of hues used"],ans:"Uses the two hues beside the complement instead of the complement itself",exp:"This substitution is exactly what defines split-complementary."},
  {id:"h30",q:"Which scheme would most likely be chosen for a full data visualisation with many distinct categories to tell apart?",opts:["Triadic, or an expanded set of evenly spaced hues","Monochromatic only","Complementary with just two hues","None, harmony does not apply to charts"],ans:"Triadic, or an expanded set of evenly spaced hues",exp:"Evenly spaced hues are naturally easier to visually distinguish from each other in a chart."},
  {id:"h31",q:"A brand refresh wants to keep the existing hue but modernise it using lighter and darker versions only. This is:",opts:["A monochromatic approach","A triadic approach","A complementary approach","An analogous approach"],ans:"A monochromatic approach",exp:"Staying within one hue while varying lightness is the definition of monochromatic."},
  {id:"h32",q:"Which of these pairs is NOT an example of complementary hues?",opts:["Red and orange","Red and green","Blue and orange","Yellow and purple"],ans:"Red and orange",exp:"Red and orange sit next to each other on the wheel - that is analogous, not complementary."},
  {id:"h33",q:"Analogous schemes typically span roughly how much of the wheel?",opts:["About 60 to 90 degrees across three neighbouring hues","The full 360 degrees","Exactly 180 degrees","A single fixed point"],ans:"About 60 to 90 degrees across three neighbouring hues",exp:"Analogous hues sit close together, spanning a relatively narrow slice of the wheel."},
  {id:"h34",q:"Which statement about harmony schemes is most accurate?",opts:["They are starting recipes based on wheel geometry, not rigid unbreakable laws","They must be followed exactly with no designer judgement at all","They only apply to print design","They guarantee a good design regardless of anything else"],ans:"They are starting recipes based on wheel geometry, not rigid unbreakable laws",exp:"Harmony schemes are a reliable starting point, refined further by the designer's judgement."},
  {id:"h35",q:"A skincare brand wants to feel calm, trustworthy and cohesive using shades of one green. This calls for:",opts:["Monochromatic","Triadic","Complementary","Split-complementary"],ans:"Monochromatic",exp:"A single hue varied in lightness matches the calm, cohesive brief."},
  {id:"h36",q:"A sports brand wants maximum energy and contrast between exactly two colours. This calls for:",opts:["Complementary","Monochromatic","Analogous","None of these give contrast"],ans:"Complementary",exp:"Complementary offers the strongest possible contrast between two hues."},
  {id:"h37",q:"Which scheme is built from exactly two hues that sit opposite each other?",opts:["Complementary","Triadic","Analogous","Monochromatic"],ans:"Complementary",exp:"By definition, complementary always involves exactly two opposite hues."},
  {id:"h38",q:"Which scheme involves the most total hues among the five covered in this lesson?",opts:["Triadic and split-complementary both use three hues","Monochromatic uses the most","Complementary uses the most","Analogous always uses more than triadic"],ans:"Triadic and split-complementary both use three hues",exp:"Both schemes involve three hues, tied for the most among the five covered here."},
  {id:"h39",q:"Why might a designer avoid a pure complementary scheme for a long-form reading interface?",opts:["High contrast opposite hues can feel fatiguing over long, sustained use","Complementary schemes cannot be built at all","It is technically impossible in CSS","It always uses too few colours to be legible"],ans:"High contrast opposite hues can feel fatiguing over long, sustained use",exp:"Sustained high-contrast pairing can be visually tiring for reading-heavy interfaces."},
  {id:"h40",q:"A brand wants variety without picking colours that could clash. The safest structured choice is:",opts:["Choosing a recognised harmony scheme rather than picking hues at random","Picking any colours that individually look nice","Avoiding colour theory entirely","Using only black and white forever"],ans:"Choosing a recognised harmony scheme rather than picking hues at random",exp:"Harmony schemes exist specifically to remove the guesswork from combining multiple hues."},
  {id:"h41",q:"What best distinguishes analogous from triadic?",opts:["Analogous hues are neighbours, triadic hues are evenly spaced apart","Analogous always uses more hues than triadic","Triadic hues must be complementary pairs","There is no real difference between them"],ans:"Analogous hues are neighbours, triadic hues are evenly spaced apart",exp:"The key difference is proximity - close together for analogous, evenly spread for triadic."},
  {id:"h42",q:"What best distinguishes complementary from split-complementary?",opts:["Complementary uses the exact opposite hue, split-complementary uses the two hues beside it","Complementary always uses three hues","Split-complementary uses only one hue","They are identical schemes with different names"],ans:"Complementary uses the exact opposite hue, split-complementary uses the two hues beside it",exp:"That substitution is the entire distinction between the two schemes."},
  {id:"h43",q:"A designer building a chart legend with five distinct categories would most likely draw inspiration from:",opts:["An expanded, evenly spaced set of hues similar to a triadic approach","A strict two-hue complementary pair","A single monochromatic hue only","No harmony principle applies to charts"],ans:"An expanded, evenly spaced set of hues similar to a triadic approach",exp:"Evenly distributing hues around the wheel keeps multiple categories visually distinct."},
  {id:"h44",q:"Which harmony scheme relies the most on lightness and saturation variation rather than hue variation?",opts:["Monochromatic","Triadic","Complementary","Split-complementary"],ans:"Monochromatic",exp:"Since only one hue is used, all the variety must come from lightness and saturation."},
  {id:"h45",q:"Which scheme is most likely to be described as having strong contrast but easier balance than a straight complementary pair?",opts:["Split-complementary","Monochromatic","Analogous","None fit this description"],ans:"Split-complementary",exp:"That is precisely how split-complementary is typically described relative to complementary."},
  {id:"h46",q:"A restaurant brand wants an appetising, energetic feel using red, yellow and a touch of blue evenly spaced. This is:",opts:["A triadic scheme","A monochromatic scheme","A pure complementary scheme","An analogous scheme"],ans:"A triadic scheme",exp:"Three evenly spaced hues describes a triadic relationship."},
  {id:"h47",q:"Which of the five schemes covered in this lesson uses the narrowest slice of the wheel?",opts:["Analogous","Triadic","Complementary","Split-complementary"],ans:"Analogous",exp:"Analogous hues sit tightly together, covering the smallest angular range of the five."},
  {id:"h48",q:"Which of the five schemes covered in this lesson uses the widest spread across the wheel?",opts:["Triadic and split-complementary both spread widely","Monochromatic spreads the widest","Analogous spreads the widest","Complementary always spreads the widest of all"],ans:"Triadic and split-complementary both spread widely",exp:"Both schemes distribute their hues across a broad portion of the wheel."},
  {id:"h49",q:"The core practical value of colour harmony for a designer is:",opts:["A repeatable, wheel-based starting point for combinations that are proven to feel balanced","A way to avoid using more than one colour ever","A rule that only applies to fine art","A way to guarantee a client will approve the design"],ans:"A repeatable, wheel-based starting point for combinations that are proven to feel balanced",exp:"That is the entire practical value of harmony schemes."},
  {id:"h50",q:"In one sentence, colour harmony is:",opts:["A set of fixed angle-based recipes on the wheel that reliably produce balanced colour combinations","A single correct colour for every project","A rule that says never use more than one colour","A random colour generator"],ans:"A set of fixed angle-based recipes on the wheel that reliably produce balanced colour combinations",exp:"That is the complete summary of this lesson's core idea."},
];

const CB_TYPE="topic";
const CB_QUESTIONS=[
  {q:"Complementary hues sit how far apart on the wheel?",opts:["180 degrees","30 degrees","120 degrees","60 degrees"],ans:"180 degrees",exp:"Complementary hues are directly opposite one another."},
  {q:"Analogous hues are best described as:",opts:["Neighbours on the wheel","Opposite each other","Evenly spread across the whole wheel","All identical"],ans:"Neighbours on the wheel",exp:"Analogous hues sit next to each other, sharing a common base."},
  {q:"A triadic scheme uses hues spaced how far apart?",opts:["120 degrees","180 degrees","30 degrees","360 degrees"],ans:"120 degrees",exp:"Triadic hues are evenly spaced into three equal thirds of the wheel."},
  {q:"How many hues make up a monochromatic scheme?",opts:["One","Two","Three","Four"],ans:"One",exp:"Monochromatic is built from a single hue's lightness and saturation range."},
  {q:"Split-complementary uses a base hue plus:",opts:["The two hues beside its complement","Its exact complement only","Two random unrelated hues","No second hue at all"],ans:"The two hues beside its complement",exp:"It substitutes the direct complement for its two neighbours."},
  {q:"Which scheme creates the strongest contrast with just two hues?",opts:["Complementary","Analogous","Monochromatic","Triadic"],ans:"Complementary",exp:"Opposite hues create the maximum contrast possible between two colours."},
  {q:"Which scheme is considered safest for beginners due to zero risk of hue clash?",opts:["Monochromatic","Triadic","Complementary","Split-complementary"],ans:"Monochromatic",exp:"Using only one hue removes any possibility of a mismatched hue pairing."},
  {q:"In a complementary scheme, using both hues equally at full strength risks:",opts:["Visual vibration and clashing","Automatic harmony with no risk","Turning both hues grey","Nothing at all"],ans:"Visual vibration and clashing",exp:"Equal, high-saturation opposite hues can create an uncomfortable visual buzz."},
  {q:"An analogous palette should typically use:",opts:["One dominant hue with the others as support","All three hues in exactly equal amounts","Only the outer two hues, ignoring the middle","No dominant hue at all"],ans:"One dominant hue with the others as support",exp:"A clear dominant hue keeps an analogous palette from feeling flat or muddled."},
  {q:"A triadic palette used with all three hues equally often risks feeling:",opts:["Busy and unfocused","Too calm and boring","Impossible to distinguish","Automatically monochromatic"],ans:"Busy and unfocused",exp:"Without one dominant hue, triadic palettes can compete for attention."},
  {q:"Blue and orange are an example of which relationship?",opts:["Complementary","Analogous","Monochromatic","Split-complementary only"],ans:"Complementary",exp:"Blue and orange sit roughly opposite each other on the wheel."},
  {q:"Yellow, yellow-green and green are an example of which relationship?",opts:["Analogous","Complementary","Triadic","Monochromatic"],ans:"Analogous",exp:"These three hues sit next to each other on the wheel."},
  {q:"Red, yellow and blue are an example of which relationship?",opts:["Triadic","Analogous","Complementary","Split-complementary"],ans:"Triadic",exp:"These three primaries are evenly spaced 120 degrees apart."},
  {q:"A calm editorial brand wants a gentle, cohesive palette. Best scheme:",opts:["Analogous","Complementary","Triadic at full strength","None of these apply"],ans:"Analogous",exp:"Analogous hues naturally blend for a soft, cohesive feel."},
  {q:"A sports brand wants maximum two-hue punch. Best scheme:",opts:["Complementary","Monochromatic","Analogous","Split-complementary is always weaker"],ans:"Complementary",exp:"Complementary gives the strongest possible two-hue contrast."},
  {q:"A minimalist brand wants one hue used consistently, light to dark. Best scheme:",opts:["Monochromatic","Triadic","Complementary","Analogous"],ans:"Monochromatic",exp:"Monochromatic is built entirely around one hue's range."},
  {q:"A designer wants complementary-level contrast with less visual tension. Best scheme:",opts:["Split-complementary","Monochromatic","Analogous","Triadic at equal thirds"],ans:"Split-complementary",exp:"Split-complementary softens the tension of a direct complementary pair while keeping strong contrast."},
  {q:"Why do harmony schemes exist instead of picking colours at random?",opts:["Random picking is unreliable, schemes give a proven starting point","Random picking is technically impossible","Schemes always use fewer colours","Schemes are required by law"],ans:"Random picking is unreliable, schemes give a proven starting point",exp:"Harmony schemes remove the guesswork of combining multiple hues."},
  {q:"Which scheme relies purely on lightness and saturation, not multiple hues?",opts:["Monochromatic","Triadic","Complementary","Split-complementary"],ans:"Monochromatic",exp:"With only one hue in play, all variation comes from lightness and saturation."},
  {q:"A data visualisation with five distinct categories would likely draw from which principle?",opts:["An expanded, evenly spaced set of hues like triadic","A strict complementary pair only","A single monochromatic hue","No harmony principle applies"],ans:"An expanded, evenly spaced set of hues like triadic",exp:"Evenly distributed hues stay visually distinct from each other across many categories."},
  {q:"What best distinguishes analogous from triadic?",opts:["Analogous hues are close neighbours, triadic hues are evenly spread","They are identical schemes","Analogous always uses more hues","Triadic must include a complementary pair"],ans:"Analogous hues are close neighbours, triadic hues are evenly spread",exp:"Proximity on the wheel is the key difference between the two."},
  {q:"Which of these is NOT one of the five schemes covered in this lesson?",opts:["Tetradic","Complementary","Analogous","Monochromatic"],ans:"Tetradic",exp:"This lesson covers complementary, analogous, triadic, split-complementary and monochromatic - not tetradic."},
  {q:"A skincare brand wants calm and cohesive using only shades of green. Best scheme:",opts:["Monochromatic","Triadic","Complementary","Split-complementary"],ans:"Monochromatic",exp:"One hue varied in lightness matches a calm, cohesive brief."},
  {q:"Harmony schemes are best understood as:",opts:["Reliable starting recipes, refined further by designer judgement","Rigid laws that can never be adjusted","Rules that only apply to fine art","Guarantees of client approval"],ans:"Reliable starting recipes, refined further by designer judgement",exp:"Schemes are a dependable starting point, not an unbreakable formula."},
  {q:"The core practical value of colour harmony is:",opts:["A repeatable, wheel-based way to combine hues that reliably feels balanced","Limiting every project to one colour only","A rule specific to painting alone","A way to avoid learning colour theory"],ans:"A repeatable, wheel-based way to combine hues that reliably feels balanced",exp:"That is the entire practical value of this lesson's schemes."},
];

const BRAND_BANK=[
  {name:"Firefox",c1:"#FF9500",c2:"#0060DF",hint:"An orange fox mark set against a deep blue background, using two hues that sit roughly opposite on the wheel",ans:"complementary",exp:"Firefox pairs orange and blue - a near-complementary relationship for maximum brand contrast."},
  {name:"Instagram",c1:"#E1306C",c2:"#F77737",hint:"A gradient logo moving through pink, orange and yellow tones that all sit close together on the wheel",ans:"analogous",exp:"Instagram's gradient uses neighbouring hues on the wheel, blending smoothly into one another."},
  {name:"eBay",c1:"#E53238",c2:"#0064D2",hint:"A logo using red, blue, yellow and green together, evenly touching multiple points around the wheel",ans:"triadic",exp:"eBay's multicolour logo pulls from widely spread points on the wheel for a playful, energetic feel."},
  {name:"Slack",c1:"#4A154B",c2:"#36C5F0",hint:"A four-colour mark combining aubergine, blue, green and yellow-orange spread across the wheel",ans:"triadic",exp:"Slack's logo uses several evenly distributed hues rather than staying close together, similar to a triadic spread."},
  {name:"Spotify",c1:"#1DB954",c2:"#0D3320",hint:"A bright green mark used consistently in lighter and darker versions of the same hue across the whole app",ans:"monochromatic",exp:"Spotify builds most of its interface from variations of one green rather than introducing new hues."},
  {name:"Cadbury",c1:"#452169",c2:"#FFFFFF",hint:"A single deep purple used consistently, varied only in lightness across packaging and marketing",ans:"monochromatic",exp:"Cadbury's system relies on one core purple hue, varied in lightness rather than paired with other hues."},
  {name:"Fanta",c1:"#FF7900",c2:"#6DC067",hint:"An orange and green combination sitting fairly close together on the warm side of the wheel",ans:"analogous",exp:"Fanta's orange and lime green sit near each other on the wheel, giving a playful, cohesive warm-leaning pair."},
  {name:"MasterCard",c1:"#EB001B",c2:"#F79E1B",hint:"Two overlapping circles in red and orange-yellow, hues sitting close together on the wheel",ans:"analogous",exp:"MasterCard's red and orange-yellow circles sit near each other on the wheel, creating a warm, blended overlap."},
  {name:"Adobe",c1:"#FF0000",c2:"#4700EB",hint:"Individual app icons across the suite using red, blue, purple and pink evenly spread across the wheel",ans:"triadic",exp:"Adobe's app icon system spreads hues across the wheel rather than clustering them together."},
  {name:"Home Depot",c1:"#F96302",c2:"#FFFFFF",hint:"A single orange used consistently, varied only in lightness across signage and packaging",ans:"monochromatic",exp:"Home Depot relies on one core orange hue varied in lightness rather than introducing a second hue."},
  {name:"Windows",c1:"#00A4EF",c2:"#F25022",hint:"A four-colour tile logo combining blue, red, green and yellow spread across the wheel",ans:"triadic",exp:"The Windows logo spreads several hues evenly around the wheel rather than staying close together."},
  {name:"Sunset-themed brand palette",c1:"#FF7A00",c2:"#E94560",hint:"An orange and pink-red combination sitting close together on the warm side of the wheel, commonly used for warm sunset branding",ans:"analogous",exp:"Orange and pink-red sit near each other on the wheel, producing a natural, blended warm palette."},
  {name:"IKEA",c1:"#0058A3",c2:"#FFDA1A",hint:"Blue and yellow used together, sitting roughly opposite each other on the wheel for strong contrast",ans:"complementary",exp:"IKEA's blue and yellow sit close to an opposite relationship on the wheel, giving strong, memorable contrast."},
  {name:"Chase Bank",c1:"#117ACA",c2:"#005A9C",hint:"A single blue used consistently, varied only in lightness across the brand's materials",ans:"monochromatic",exp:"Chase relies on one core blue hue varied in lightness rather than pairing it with a second hue."},
  {name:"Ferrari",c1:"#DC0000",c2:"#FFF200",hint:"Red and yellow used together, hues sitting close together on the warm side of the wheel",ans:"analogous",exp:"Ferrari's red and yellow sit near each other on the wheel, forming a cohesive warm pairing."},
];

const TAKEAWAY_QUOTE="Every colour combination that feels right has a geometry behind it - the wheel just tells you where to look.";
const TAKEAWAY_POINTS=[
  {t:"Pick the scheme by the job, not by taste alone",b:"Need maximum punch from two colours - go complementary. Need calm cohesion - go analogous or monochromatic. Need energy with balance - go triadic or split-complementary."},
  {t:"Always let one hue lead",b:"Every scheme works best with one dominant hue and the rest playing a supporting role - equal-strength palettes tend to compete instead of cooperate."},
  {t:"Harmony is a starting point, not a cage",b:"These five schemes are proven recipes to begin from - refine further with your own judgement once the base relationship is solid."},
];

const SOURCES=[
  "Johannes Itten - The Art of Color (1961). Formalised wheel-based harmony relationships for design education.",
];

export default function CT06ColourHarmony(){
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
  const[baseHue,setBaseHue]=useState(24);
  const[scheme,setScheme]=useState("complementary");
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

  const schemeAngles={complementary:[0,180],analogous:[-30,0,30],triadic:[0,120,240],"split-complementary":[0,150,210],monochromatic:[0]};
  const angles=schemeAngles[scheme];

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
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 0"}}>Five fixed recipes. One wheel. Pick the angle that fits the job.</p>
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
              <Tag color={T.brand}>EXPLORE - PICK A SCHEME</Tag>
              <p style={{fontSize:13,color:T.muted,lineHeight:1.6,margin:"10px 0 14px"}}>Choose a base hue and a scheme, and see the resulting palette live.</p>
              <input type="range" min="0" max="359" value={baseHue} onChange={function(e){setBaseHue(Number(e.target.value));}} style={{width:"100%",marginBottom:14}}/>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
                {["complementary","analogous","triadic","split-complementary","monochromatic"].map(function(sc){
                  return(
                    <button key={sc} onClick={function(){setScheme(sc);}} style={{padding:"6px 12px",borderRadius:20,background:scheme===sc?"rgba(255,122,0,.15)":T.panel,border:"1px solid "+(scheme===sc?T.brand:T.border),color:scheme===sc?T.brand:T.muted,fontSize:11.5,cursor:"pointer",textTransform:"capitalize"}}>{sc}</button>
                  );
                })}
              </div>
              <div style={{display:"flex",gap:8}}>
                {angles.map(function(a,i){
                  return <div key={i} style={{flex:1,height:64,borderRadius:10,background:hueToRgb(baseHue+a),border:"1px solid "+T.border}}/>;
                })}
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
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.6,margin:"0 0 12px"}}>Which harmony relationship best describes this brand's colour pairing?</p>
                  <div style={{display:"flex",gap:10,marginBottom:8}}>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c1,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>COLOUR 1</span></div>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c2,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid "+T.border}}><span style={{fontSize:10,color:"rgba(0,0,0,.4)"}}>COLOUR 2</span></div>
                  </div>
                  <p style={{fontSize:11,color:T.dim,margin:"0 0 12px"}}>Hint: {brand.hint}</p>
                  {!myRev&&(
                    <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
                      {["Complementary","Analogous","Triadic","Monochromatic"].map(function(opt){
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
