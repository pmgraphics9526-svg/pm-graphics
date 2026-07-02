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

const LESSON_MODULE="COLOUR THEORY - TOPIC 11";
const LESSON_TITLE="Colour Accessibility";
const LESSON_SUBTITLE="W3C Web Content Accessibility Guidelines 2.1";

const STORY_PARA_1="As the web grew, it became clear a huge share of users could not perceive colour the way most designers assumed - some due to colour blindness, affecting roughly 1 in 12 men and 1 in 200 women, others due to low vision, ageing eyes, or simply a phone screen in bright sunlight.";
const STORY_PARA_2="The World Wide Web Consortium responded by publishing the Web Content Accessibility Guidelines - not opinions about good colour, but measurable numbers. A contrast ratio a designer could actually calculate and pass or fail, before a single user ever complained.";
const STORY_PARA_3="What began as a compliance requirement turned out to be good design practice for everyone. High-contrast, colour-independent design is easier to read for every user, not only those with a vision difference.";
const STORY_PROBLEM="You built a beautiful design, and someone could not read the text on it, or a colourblind user could not tell your red error state from your green success state. Accessibility turns good intentions into a number you can actually check.";
const STORY_5Q=[
  {q:"What is it?",a:"A set of measurable standards for making colour and contrast choices legible and usable for people with low vision, colour blindness, or difficult viewing conditions."},
  {q:"Why does it exist?",a:"A meaningful share of users cannot perceive colour or contrast the way most designers assume, and readability should not depend on having perfect vision."},
  {q:"How does it work?",a:"Contrast between text and background is measured as a numeric ratio, with minimum thresholds to pass. Colour is never used as the only signal for meaning."},
  {q:"How will you use it?",a:"Check text and background contrast ratios before shipping, and always pair colour with a second signal - an icon, a label, a pattern."},
  {q:"What if you skip it?",a:"Text becomes unreadable for a large share of users, and colour-coded information like red versus green states becomes meaningless for colourblind users."},
];

const CONCEPT_SECTIONS=[
  {tag:"CONTRAST RATIO",tagColor:T.brand,formula:"1:1 to 21:1",desc:"The numeric measurement WCAG uses to compare text and background lightness. A ratio of 1:1 means identical colours; 21:1 means pure black on pure white, the maximum possible.",rule:"Never judge legibility by eye alone - calculate the actual ratio, since perception can be misleading."},
  {tag:"WCAG AA vs AAA",tagColor:"#3EC6E0",formula:"AA: 4.5:1 normal / 3:1 large. AAA: 7:1 normal / 4.5:1 large",desc:"AA is the standard baseline most products target. AAA is a stricter, optional standard for content that especially needs to be readable, like critical instructions.",rule:"Treat AA as the minimum floor for any shipped product, not an aspirational target."},
  {tag:"COLOUR BLINDNESS",tagColor:"#B08CFF",formula:"Red-green most common, blue-yellow rare",desc:"Protanopia and deuteranopia (red-green colour blindness) are the most common forms. Tritanopia (blue-yellow) and total colour blindness are far rarer, but all make certain colour pairs indistinguishable.",rule:"Never rely on red versus green alone to signal meaning - a large share of users physically cannot tell them apart."},
  {tag:"NEVER COLOUR ALONE",tagColor:T.green,formula:"Colour + icon/label/pattern",desc:"Any information communicated through colour - error states, chart categories, links - should also be communicated through a second signal, like an icon, text label or pattern.",rule:"If removing all colour from your design makes information disappear, colour was doing too much work alone."},
];

function hexToLum(hex){
  const h=hex.replace("#","");
  const r=parseInt(h.substring(0,2),16)/255,g=parseInt(h.substring(2,4),16)/255,b=parseInt(h.substring(4,6),16)/255;
  const f=function(c){return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);};
  return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b);
}
function contrastRatio(hex1,hex2){
  const l1=hexToLum(hex1),l2=hexToLum(hex2);
  const lighter=Math.max(l1,l2),darker=Math.min(l1,l2);
  return (lighter+0.05)/(darker+0.05);
}

const QUESTION_BANK=[
  {id:"a1",q:"What organisation publishes the Web Content Accessibility Guidelines?",opts:["W3C","Pantone","Adobe","ISO"],ans:"W3C",exp:"The World Wide Web Consortium (W3C) publishes and maintains WCAG."},
  {id:"a2",q:"What is a contrast ratio in WCAG terms?",opts:["A numeric measurement comparing the lightness of text and background","The angle between two hues on the wheel","The percentage of accent colour used in a layout","The saturation difference between two colours"],ans:"A numeric measurement comparing the lightness of text and background",exp:"Contrast ratio numerically compares how light or dark two colours are relative to each other."},
  {id:"a3",q:"What is the minimum WCAG AA contrast ratio for normal-sized text?",opts:["4.5:1","3:1","7:1","1:1"],ans:"4.5:1",exp:"WCAG AA requires at least 4.5:1 for normal text."},
  {id:"a4",q:"What is the minimum WCAG AA contrast ratio for large text?",opts:["3:1","4.5:1","7:1","1:1"],ans:"3:1",exp:"Large text has a lower minimum requirement of 3:1 under AA."},
  {id:"a5",q:"What is the minimum WCAG AAA contrast ratio for normal-sized text?",opts:["7:1","4.5:1","3:1","1:1"],ans:"7:1",exp:"AAA is stricter, requiring at least 7:1 for normal text."},
  {id:"a6",q:"What contrast ratio represents the maximum possible contrast, pure black on pure white?",opts:["21:1","4.5:1","7:1","10:1"],ans:"21:1",exp:"21:1 is the theoretical maximum contrast ratio between pure black and pure white."},
  {id:"a7",q:"Roughly how many men are affected by colour blindness?",opts:["About 1 in 12","About 1 in 2","About 1 in 1000","Almost none"],ans:"About 1 in 12",exp:"Colour blindness affects roughly 1 in 12 men, a significant share of any audience."},
  {id:"a8",q:"Roughly how many women are affected by colour blindness?",opts:["About 1 in 200","About 1 in 12","About 1 in 2","Almost half"],ans:"About 1 in 200",exp:"Colour blindness is far less common in women, at roughly 1 in 200."},
  {id:"a9",q:"Which type of colour blindness is most common?",opts:["Red-green (protanopia and deuteranopia)","Blue-yellow (tritanopia)","Total colour blindness (achromatopsia)","There is no common type"],ans:"Red-green (protanopia and deuteranopia)",exp:"Red-green colour blindness is by far the most common form."},
  {id:"a10",q:"Which type of colour blindness is rare, affecting blue-yellow perception?",opts:["Tritanopia","Protanopia","Deuteranopia","Achromatopsia is the common blue-yellow type"],ans:"Tritanopia",exp:"Tritanopia affects blue-yellow perception and is much rarer than red-green forms."},
  {id:"a11",q:"Why should a designer never rely on red versus green alone to signal meaning?",opts:["A large share of users with red-green colour blindness physically cannot tell them apart","Red and green are always identical to everyone","This combination is banned by law","There is no real reason to avoid it"],ans:"A large share of users with red-green colour blindness physically cannot tell them apart",exp:"Red-green colour blindness makes this specific pairing indistinguishable for many users."},
  {id:"a12",q:"What should always accompany colour when communicating important information?",opts:["A second signal like an icon, label or pattern","Nothing, colour alone is always sufficient","A louder, more saturated version of the same colour","A completely different unrelated colour"],ans:"A second signal like an icon, label or pattern",exp:"Pairing colour with a second signal ensures meaning survives even if colour cannot be distinguished."},
  {id:"a13",q:"An error state that is only shown as red text, with no icon or label, fails accessibility because:",opts:["A colourblind user may not be able to distinguish it from a normal or success state","Red is technically not a valid CSS colour","Error states cannot legally use colour","There is no real problem with this approach"],ans:"A colourblind user may not be able to distinguish it from a normal or success state",exp:"Without a second signal, the meaning is lost for users who cannot distinguish the colour."},
  {id:"a14",q:"A chart uses only colour to distinguish ten different data categories. What accessibility risk does this create?",opts:["Colourblind users may not be able to tell several categories apart","The chart will fail to render entirely","This is always fine with no risk","Charts are exempt from accessibility guidelines"],ans:"Colourblind users may not be able to tell several categories apart",exp:"Relying purely on colour for many categories is a common accessibility failure in data visualisation."},
  {id:"a15",q:"What is the practical fix for a chart that relies only on colour to distinguish categories?",opts:["Add patterns, labels or icons in addition to colour for each category","Remove the chart entirely","Use only two categories maximum","Make every category the exact same colour"],ans:"Add patterns, labels or icons in addition to colour for each category",exp:"A second visual signal per category solves the accessibility problem while keeping the chart useful."},
  {id:"a16",q:"Why is checking contrast ratio numerically more reliable than judging by eye?",opts:["Human perception can be misleading, especially under different lighting or screen conditions","Numbers are always more important than design","Eyes cannot perceive colour at all","There is no real difference between the two methods"],ans:"Human perception can be misleading, especially under different lighting or screen conditions",exp:"A calculated ratio removes the guesswork and variability of purely visual judgement."},
  {id:"a17",q:"A designer uses light grey text on a white background. This design choice risks:",opts:["Failing WCAG contrast ratio requirements, making text hard to read","Being too accessible for most users","Automatically passing every accessibility check","Having no effect on readability at all"],ans:"Failing WCAG contrast ratio requirements, making text hard to read",exp:"Low-contrast pairings like light grey on white commonly fail WCAG minimums."},
  {id:"a18",q:"Which is generally treated as the minimum floor for a shipped product's contrast?",opts:["WCAG AA","WCAG AAA only","No standard is required","WCAG AAA is always optional and unnecessary to consider"],ans:"WCAG AA",exp:"AA is the widely accepted baseline standard most products are expected to meet."},
  {id:"a19",q:"Why might a design team target WCAG AAA specifically for critical safety instructions?",opts:["AAA's stricter contrast requirement ensures maximum legibility for especially important content","AAA is always legally required for every project","AAA makes designs load faster","AAA has nothing to do with legibility"],ans:"AAA's stricter contrast requirement ensures maximum legibility for especially important content",exp:"The higher AAA bar is often reserved for content where legibility failure has serious consequences."},
  {id:"a20",q:"What happens to perceived contrast in bright outdoor sunlight on a phone screen?",opts:["Low-contrast text and elements can become very difficult or impossible to read","Contrast always improves in sunlight","Screens automatically compensate perfectly for any lighting","There is no effect from ambient lighting"],ans:"Low-contrast text and elements can become very difficult or impossible to read",exp:"Harsh ambient light is one of many real-world conditions that make strong contrast essential."},
  {id:"a21",q:"A link styled only in a slightly different colour from body text, with no underline, risks:",opts:["Being invisible or hard to identify as a link for some users","Being too obvious as a link","Automatically passing accessibility checks","Having no accessibility implications at all"],ans:"Being invisible or hard to identify as a link for some users",exp:"Colour alone is not always sufficient to signal that text is interactive."},
  {id:"a22",q:"What is the safest way to make a link clearly identifiable beyond colour?",opts:["Add an underline or other non-colour visual signal","Make the link the exact same colour as body text","Remove all styling from links entirely","Increase only the font size"],ans:"Add an underline or other non-colour visual signal",exp:"A non-colour cue like an underline ensures the link is identifiable regardless of colour perception."},
  {id:"a23",q:"Achromatopsia refers to:",opts:["Total colour blindness, seeing only in shades of grey","Red-green colour blindness only","Blue-yellow colour blindness only","Perfect colour vision"],ans:"Total colour blindness, seeing only in shades of grey",exp:"Achromatopsia is the rare condition of seeing no colour at all, only greyscale."},
  {id:"a24",q:"Why is achromatopsia considered rare compared to red-green colour blindness?",opts:["It affects a much smaller share of the population than red-green forms","It is actually the most common type","It only affects women","There is no real difference in rarity"],ans:"It affects a much smaller share of the population than red-green forms",exp:"Total colour blindness is significantly less common than red-green colour blindness."},
  {id:"a25",q:"A designer builds a dashboard where 'good' is green text and 'bad' is red text, with no other distinction. What is the risk?",opts:["A colourblind user may not be able to tell good from bad at all","This is always fully accessible with no issues","Dashboards are exempt from accessibility standards","There is no real risk in this approach"],ans:"A colourblind user may not be able to tell good from bad at all",exp:"Without a second signal, this common red/green pairing fails for many colourblind users."},
  {id:"a26",q:"What additional signal could fix a red/green good-bad dashboard for accessibility?",opts:["Icons such as a checkmark and an X, alongside the colour","Making both colours slightly darker","Removing the colours entirely with nothing to replace them","Using only text with no visual signal at all"],ans:"Icons such as a checkmark and an X, alongside the colour","exp":"Icons provide a shape-based signal that survives even if the colour distinction is lost."},
  {id:"a27",q:"Which of these color pairs is most likely to be confused by someone with red-green colour blindness?",opts:["Red and green","Blue and yellow","Black and white","Orange and purple"],ans:"Red and green",exp:"Red-green confusion is the defining feature of the most common colour blindness types."},
  {id:"a28",q:"Why does high-contrast, colour-independent design benefit users beyond those with a diagnosed vision condition?",opts:["It also helps ageing eyes, low-light or bright-light viewing, and general readability for everyone","It only ever helps colourblind users specifically","It has no benefit beyond one narrow group","It makes designs load faster"],ans:"It also helps ageing eyes, low-light or bright-light viewing, and general readability for everyone",exp:"Accessible contrast choices tend to improve legibility broadly, not just for one specific group."},
  {id:"a29",q:"A form shows a red border around an invalid field with no text explanation. What accessibility problem does this create?",opts:["Colourblind users may not notice the red border signal at all","This is always sufficient with no problems","Forms are exempt from accessibility requirements","Red borders always pass accessibility automatically"],ans:"Colourblind users may not notice the red border signal at all",exp:"Colour-only error indication risks being missed entirely by users who cannot perceive the colour difference."},
  {id:"a30",q:"What is the accessible fix for a colour-only invalid form field?",opts:["Add an error icon and a written error message alongside the coloured border","Make the border colour brighter red only","Remove the border and add nothing else","Only fix this for mobile, not desktop"],ans:"Add an error icon and a written error message alongside the coloured border",exp:"Icon plus text ensures the error is communicated regardless of colour perception."},
  {id:"a31",q:"Contrast ratio calculations are based primarily on:",opts:["The relative lightness (luminance) of the two colours being compared","The hue angle between the two colours","The saturation of the two colours only","The exact hex codes without any calculation"],ans:"The relative lightness (luminance) of the two colours being compared",exp:"WCAG contrast ratio is a luminance-based calculation, not a hue or saturation measurement."},
  {id:"a32",q:"A designer picks two colours with very similar lightness but very different hues. Contrast ratio will likely be:",opts:["Low, since luminance rather than hue drives the ratio","Automatically high, since the hues are different","Exactly 21:1 regardless of lightness","Impossible to calculate"],ans:"Low, since luminance rather than hue drives the ratio","exp":"Similar lightness values produce a low ratio, even if the hues themselves look very different."},
  {id:"a33",q:"What is the benefit of using an automated contrast checker tool during design?",opts:["It gives an exact, objective ratio instead of relying on visual guesswork","It automatically fixes every accessibility issue with no designer input","It replaces the need for any colour theory knowledge","It only works for print design"],ans:"It gives an exact, objective ratio instead of relying on visual guesswork",exp:"Automated tools remove subjectivity from the contrast-checking process."},
  {id:"a34",q:"Why might a beautifully designed dark-mode interface still fail accessibility checks?",opts:["Text and background colours may not have sufficient contrast ratio, regardless of visual appeal","Dark mode always automatically passes every accessibility check","Accessibility does not apply to dark-mode interfaces","Dark mode is banned under WCAG"],ans:"Text and background colours may not have sufficient contrast ratio, regardless of visual appeal",exp:"Visual appeal and measurable contrast ratio are not the same thing - both need checking."},
  {id:"a35",q:"A brand's signature colour combination happens to fail WCAG AA contrast for body text. What is the recommended approach?",opts:["Adjust the lightness of one colour while keeping the brand hue recognisable, or reserve the combination for large text/graphics only","Ignore accessibility guidelines entirely to preserve the exact brand colours","Remove the brand colours from digital use permanently","There is no way to address this conflict"],ans:"Adjust the lightness of one colour while keeping the brand hue recognisable, or reserve the combination for large text/graphics only",exp:"Small lightness adjustments or limiting use to large text/graphics are common practical solutions."},
  {id:"a36",q:"Which of these text situations requires the lowest WCAG AA contrast ratio?",opts:["Large, bold headline text","Small body paragraph text","Fine print in a footer","Both large and small text require identical ratios"],ans:"Large, bold headline text",exp:"Large text has a lower minimum requirement (3:1) since size itself aids legibility."},
  {id:"a37",q:"Which of these text situations requires the highest WCAG AA contrast ratio?",opts:["Small body paragraph text","Large, bold headline text","A large decorative logo","Text at any size requires the same ratio"],ans:"Small body paragraph text",exp:"Small text needs the higher 4.5:1 minimum since smaller size makes low contrast harder to read."},
  {id:"a38",q:"What is the core principle behind 'never rely on colour alone'?",opts:["Any meaning conveyed through colour should also be conveyed through a second, non-colour signal","Colour should never be used in any design at all","Only colourblind users should be considered in design","Accessibility only applies to text, never to colour"],ans:"Any meaning conveyed through colour should also be conveyed through a second, non-colour signal",exp:"That is the practical rule behind this accessibility principle."},
  {id:"a39",q:"A designer tests their interface by converting it to greyscale as a quick accessibility check. What is this testing?",opts:["Whether information still makes sense without relying on hue distinctions","Whether the design meets Pantone matching standards","Whether the file size is small enough","Whether the design uses the 60-30-10 rule correctly"],ans:"Whether information still makes sense without relying on hue distinctions",exp:"A greyscale check reveals whether meaning depends too heavily on colour alone."},
  {id:"a40",q:"The core practical value of colour accessibility knowledge for a designer is:",opts:["Ensuring colour and contrast choices remain usable for the widest possible range of users","Making every design use exactly the same two colours","Avoiding colour entirely in professional work","Guaranteeing legal compliance with no other benefit"],ans:"Ensuring colour and contrast choices remain usable for the widest possible range of users",exp:"That is the entire practical value of this lesson's principles."},
  {id:"a41",q:"In one sentence, colour accessibility is about:",opts:["Making colour and contrast choices legible and meaningful for the widest possible range of users","Using only black and white in every design","Following a rule that only affects government websites","Avoiding all bright colours"],ans:"Making colour and contrast choices legible and meaningful for the widest possible range of users",exp:"That is the complete summary of this lesson's core idea."},
  {id:"a42",q:"Which of these best demonstrates a colour-independent way to show a required form field?",opts:["An asterisk symbol next to the label, in addition to any colour styling","A red label with no other indicator","A slightly different shade of the same colour","No indicator of any kind"],ans:"An asterisk symbol next to the label, in addition to any colour styling",exp:"A symbol-based signal works regardless of whether the colour distinction is perceptible."},
  {id:"a43",q:"A designer wants to verify their brand's primary button meets accessibility standards. What should they check?",opts:["The contrast ratio between the button's text and its background colour","Only whether the button colour matches the brand guide exactly","Only whether the button is a warm or cool hue","Only whether the button uses a Pantone colour"],ans:"The contrast ratio between the button's text and its background colour",exp:"Contrast ratio between text and background is the relevant accessibility measurement here."},
  {id:"a44",q:"Which situation is LEAST likely to cause an accessibility problem?",opts:["Black text on a white background with an icon-labelled error state","Red text as the only signal for an error, with no icon or label","Light grey text on a white background","Colour as the only way to distinguish ten chart categories"],ans:"Black text on a white background with an icon-labelled error state",exp:"High contrast plus a non-colour signal is the accessible approach among these options."},
  {id:"a45",q:"Why do accessibility guidelines benefit business outcomes, not just compliance?",opts:["More users can actually use the product successfully, which supports usability and reach","Accessibility guidelines have no measurable business benefit","Accessible products are always more expensive to build","Accessibility only matters for government contracts"],ans:"More users can actually use the product successfully, which supports usability and reach",exp:"Accessible design expands who can successfully use a product, which is a real usability benefit."},
  {id:"a46",q:"What does WCAG stand for?",opts:["Web Content Accessibility Guidelines","World Colour Accessibility Group","Web Colour and Graphics","World Content Accessibility Guild"],ans:"Web Content Accessibility Guidelines",exp:"WCAG is the acronym for the Web Content Accessibility Guidelines published by the W3C."},
  {id:"a47",q:"A designer relies solely on a subtle background colour shift to indicate a selected tab, with no other change. This risks:",opts:["Being missed entirely by users with low contrast sensitivity or colour blindness","Being too obvious to all users","Automatically passing accessibility checks","Having no real accessibility concern"],ans:"Being missed entirely by users with low contrast sensitivity or colour blindness",exp:"A subtle colour-only change is a common accessibility failure for state indicators like selected tabs."},
  {id:"a48",q:"What additional signal could fix a colour-only selected tab indicator?",opts:["A bold underline, background shape change, or bold text weight alongside the colour","Making the colour shift even more subtle","Removing the indicator entirely","Only fixing this issue on desktop, not mobile"],ans:"A bold underline, background shape change, or bold text weight alongside the colour",exp:"A structural or weight-based change provides a non-colour signal that survives regardless of colour perception."},
  {id:"a49",q:"The most practical daily habit this lesson encourages is:",opts:["Checking contrast ratios and pairing colour with a second signal before shipping any design","Avoiding colour entirely in every project","Only designing for users with perfect vision","Ignoring accessibility until a complaint is received"],ans:"Checking contrast ratios and pairing colour with a second signal before shipping any design",exp:"That is the practical habit this lesson is meant to build."},
  {id:"a50",q:"In one sentence, WCAG contrast standards exist because:",opts:["Readability should not depend on having perfect vision or ideal viewing conditions","Every designer must use the exact same two colours","Colour theory is otherwise unnecessary","Accessibility only matters for a small handful of users"],ans:"Readability should not depend on having perfect vision or ideal viewing conditions",exp:"That is the complete summary of why these measurable standards exist."},
];

const CB_TYPE="topic";
const CB_QUESTIONS=[
  {q:"What organisation publishes WCAG?",opts:["W3C","Pantone","Adobe","ISO"],ans:"W3C",exp:"The World Wide Web Consortium publishes and maintains WCAG."},
  {q:"What is a contrast ratio?",opts:["A numeric comparison of text and background lightness","The angle between two hues","The percentage of accent colour used","A saturation measurement only"],ans:"A numeric comparison of text and background lightness",exp:"It is a luminance-based numeric comparison between two colours."},
  {q:"Minimum WCAG AA ratio for normal text?",opts:["4.5:1","3:1","7:1","1:1"],ans:"4.5:1",exp:"AA requires at least 4.5:1 for normal-sized text."},
  {q:"Minimum WCAG AA ratio for large text?",opts:["3:1","4.5:1","7:1","1:1"],ans:"3:1",exp:"Large text has a lower minimum of 3:1 under AA."},
  {q:"Minimum WCAG AAA ratio for normal text?",opts:["7:1","4.5:1","3:1","1:1"],ans:"7:1",exp:"AAA is the stricter standard, requiring at least 7:1 for normal text."},
  {q:"Roughly how many men have colour blindness?",opts:["About 1 in 12","About 1 in 2","About 1 in 1000","Almost none"],ans:"About 1 in 12",exp:"Colour blindness affects a significant share of men, roughly 1 in 12."},
  {q:"Which colour blindness type is most common?",opts:["Red-green","Blue-yellow","Total colour blindness","None are common"],ans:"Red-green",exp:"Red-green colour blindness is by far the most prevalent type."},
  {q:"Why avoid red versus green as the only signal?",opts:["Many users with red-green colour blindness cannot distinguish them","Red and green are always identical to everyone","It is legally banned","There is no reason to avoid it"],ans:"Many users with red-green colour blindness cannot distinguish them",exp:"This is the most common colour blindness confusion pair."},
  {q:"What should accompany colour when signalling meaning?",opts:["A second signal like an icon or label","Nothing else is needed","A brighter version of the same colour","An unrelated colour"],ans:"A second signal like an icon or label",exp:"A non-colour signal ensures meaning survives regardless of colour perception."},
  {q:"A chart using only colour for ten categories risks:",opts:["Colourblind users not distinguishing several categories","Failing to render at all","No risk whatsoever","Being exempt from accessibility rules"],ans:"Colourblind users not distinguishing several categories",exp:"Relying purely on colour for many categories is a common accessibility failure."},
  {q:"Why check contrast numerically instead of by eye?",opts:["Perception can be misleading under different lighting or screens","Numbers matter more than design always","Eyes cannot see colour","There is no difference between the methods"],ans:"Perception can be misleading under different lighting or screens",exp:"A calculated ratio removes guesswork from the process."},
  {q:"Light grey text on white background risks:",opts:["Failing WCAG contrast requirements","Being too accessible","Automatically passing every check","No effect on readability"],ans:"Failing WCAG contrast requirements",exp:"Low-contrast pairings commonly fail WCAG minimums."},
  {q:"Which is treated as the minimum floor for shipped products?",opts:["WCAG AA","WCAG AAA only","No standard required","AAA is always unnecessary"],ans:"WCAG AA",exp:"AA is the widely accepted baseline for most products."},
  {q:"A link styled only by a slight colour change risks:",opts:["Being hard to identify as a link for some users","Being too obvious","Automatically passing accessibility","No accessibility implications"],ans:"Being hard to identify as a link for some users",exp:"Colour alone often is not enough to signal interactivity."},
  {q:"Best fix for a colour-only link indicator?",opts:["Add an underline or other non-colour signal","Match it exactly to body text","Remove all link styling","Increase font size only"],ans:"Add an underline or other non-colour signal",exp:"A non-colour cue keeps the link identifiable regardless of colour perception."},
  {q:"Achromatopsia is:",opts:["Total colour blindness, seeing only grey","Red-green colour blindness only","Blue-yellow colour blindness only","Perfect colour vision"],ans:"Total colour blindness, seeing only grey",exp:"Achromatopsia is the rare condition of seeing no colour at all."},
  {q:"A red-text-only error state risks:",opts:["Being missed by colourblind users entirely","Always being noticed by everyone","Passing accessibility automatically","Having no real issue"],ans:"Being missed by colourblind users entirely",exp:"Without a second signal, meaning is lost for users who cannot perceive the colour."},
  {q:"Best fix for a colour-only error state?",opts:["Add an icon and written message alongside the colour","Make the red brighter only","Remove the indicator entirely","Fix only on mobile"],ans:"Add an icon and written message alongside the colour",exp:"Icon plus text ensures the error is understood regardless of colour perception."},
  {q:"Contrast ratio calculations are based on:",opts:["Relative lightness (luminance) of the two colours","The hue angle between them","Saturation only","Hex codes with no calculation"],ans:"Relative lightness (luminance) of the two colours","exp":"WCAG contrast is a luminance-based, not hue-based, calculation."},
  {q:"Two colours with similar lightness but different hues will likely have:",opts:["A low contrast ratio","Automatically high contrast","Exactly 21:1","An uncalculable ratio"],ans:"A low contrast ratio",exp:"Since luminance drives the ratio, similar lightness produces low contrast regardless of hue."},
  {q:"Why might a dark-mode interface still fail accessibility checks?",opts:["Text and background may lack sufficient contrast ratio despite looking appealing","Dark mode always passes automatically","Accessibility does not apply to dark mode","Dark mode is banned under WCAG"],ans:"Text and background may lack sufficient contrast ratio despite looking appealing",exp:"Visual appeal and measurable contrast are not the same thing."},
  {q:"Which text situation needs the lowest WCAG AA ratio?",opts:["Large, bold headline text","Small body text","Fine print","All text needs the same ratio"],ans:"Large, bold headline text",exp:"Large text has a lower minimum since size aids legibility."},
  {q:"The core principle 'never rely on colour alone' means:",opts:["Meaning conveyed by colour should also have a non-colour signal","Never use colour in any design","Only consider colourblind users","Accessibility only applies to text"],ans:"Meaning conveyed by colour should also have a non-colour signal",exp:"That is the practical rule behind this principle."},
  {q:"A quick greyscale test of a design checks:",opts:["Whether information still makes sense without relying on hue","Pantone matching accuracy","File size","60-30-10 ratio compliance"],ans:"Whether information still makes sense without relying on hue",exp:"A greyscale check reveals over-reliance on colour alone."},
  {q:"The core practical value of colour accessibility is:",opts:["Keeping colour and contrast choices usable for the widest range of users","Using only two colours in every project","Avoiding colour entirely","Legal compliance with no other benefit"],ans:"Keeping colour and contrast choices usable for the widest range of users",exp:"That is the entire practical value of this lesson's principles."},
];

const BRAND_BANK=[
  {name:"GOV.UK",c1:"#0B0C0C",c2:"#FFFFFF",hint:"Near-black text on a pure white background, deliberately built to meet strict WCAG AAA-level contrast for a mass public audience",ans:"pass",exp:"GOV.UK's near-black on white is designed to comfortably exceed WCAG AA requirements for a broad, mixed-ability audience."},
  {name:"A pale grey text example",c1:"#CCCCCC",c2:"#FFFFFF",hint:"Light grey text on a white background, a combination commonly flagged by contrast checkers as failing WCAG AA",ans:"fail",exp:"Light grey on white typically falls well below the 4.5:1 minimum required for normal text."},
  {name:"Google Material Design",c1:"#202124",c2:"#FFFFFF",hint:"Dark grey-black text on white, a combination Google's own accessibility guidelines recommend as meeting WCAG AA comfortably",ans:"pass",exp:"Material Design's recommended body text colour is chosen specifically to clear WCAG AA contrast requirements."},
  {name:"A pastel-on-pastel button example",c1:"#FFDAB9",c2:"#FFF5E6",hint:"A pale peach button label on a near-identical pale cream background, a combination that typically fails contrast checks",ans:"fail",exp:"Two very similar light colours produce a low contrast ratio, commonly failing WCAG AA."},
  {name:"Apple Human Interface Guidelines",c1:"#000000",c2:"#FFFFFF",hint:"Apple's own guidelines recommend high-contrast black text on white or white text on black for primary content",ans:"pass",exp:"Apple's recommended high-contrast text pairing is designed to comfortably meet accessibility standards."},
  {name:"A low-contrast dark mode example",c1:"#3A3A3A",c2:"#1A1A1A",hint:"Dark grey text on a slightly darker background, a combination commonly flagged as failing WCAG AA in dark mode interfaces",ans:"fail",exp:"Two similarly dark tones produce insufficient contrast, a very common dark-mode accessibility mistake."},
  {name:"IBM Carbon Design System",c1:"#161616",c2:"#F4F4F4",hint:"Near-black text on a light grey background, a pairing IBM's own design system documents as passing WCAG AA",ans:"pass",exp:"IBM Carbon's documented text and background pairing is built specifically to meet WCAG AA contrast standards."},
  {name:"A yellow-on-white warning label",c1:"#FFEB3B",c2:"#FFFFFF",hint:"Bright yellow text on a white background, a combination that almost always fails WCAG AA due to how light both colours are",ans:"fail",exp:"Yellow and white are both very light, producing a low contrast ratio that typically fails accessibility checks."},
  {name:"A high-contrast accessibility toggle mode",c1:"#FFFF00",c2:"#000000",hint:"An optional high-contrast mode offered by some apps, using bright yellow text on a pure black background",ans:"pass",exp:"Yellow on black is an extremely high-contrast combination, often used specifically for accessibility modes."},
  {name:"A red-on-green error example",c1:"#E94560",c2:"#2DC653",hint:"Red error text placed directly on a solid green background, a combination that is difficult for red-green colourblind users to read even where contrast is technically adequate",ans:"fail",exp:"Even with reasonable lightness contrast, red-on-green is a hue pairing that many colourblind users struggle to distinguish."},
  {name:"A muted blue-on-white body text example",c1:"#4A4A4A",c2:"#FFFFFF",hint:"Dark grey body text on white, a very common combination used across many production websites that comfortably passes WCAG AA",ans:"pass",exp:"Dark grey on white is a widely used, comfortably passing combination for body text across the web."},
  {name:"A light blue link on white",c1:"#ADD8E6",c2:"#FFFFFF",hint:"A pale light-blue link colour on a white background, a combination commonly flagged as failing WCAG AA for text",ans:"fail",exp:"Light blue on white typically produces too low a contrast ratio to meet WCAG AA for text."},
  {name:"A dark navy on white finance app",c1:"#0A1F44",c2:"#FFFFFF",hint:"Deep navy text on a white background, a combination many finance apps use because it comfortably passes WCAG AA",ans:"pass",exp:"Deep navy on white produces a high contrast ratio that comfortably clears WCAG AA."},
  {name:"An orange-on-white CTA example",c1:"#FFA500",c2:"#FFFFFF",hint:"Standard orange text directly on white, a combination that frequently fails WCAG AA for normal-sized text",ans:"fail",exp:"Orange on white often falls short of the 4.5:1 minimum required for normal text."},
  {name:"A black-on-yellow safety sign standard",c1:"#000000",c2:"#FFD700",hint:"Black text on a golden-yellow background, a combination used in real-world safety signage specifically because it is extremely high contrast",ans:"pass",exp:"Black on golden-yellow is one of the highest-contrast combinations available, widely used in safety contexts."},
];

const TAKEAWAY_QUOTE="Readability is not a nice-to-have. It is the difference between a design that works and one that only works for some people.";
const TAKEAWAY_POINTS=[
  {t:"Check the ratio, do not guess",b:"Contrast that looks fine to you may fail WCAG AA in reality. Use an actual contrast checker before shipping, every time."},
  {t:"Colour is never the only signal",b:"Anything colour communicates - errors, categories, links - needs a second, non-colour signal so meaning survives for every user."},
  {t:"AA is the floor, not the ceiling",b:"Treat WCAG AA as the minimum bar for any shipped product. Reach for AAA on especially critical content."},
];

const SOURCES=[
  "W3C - Web Content Accessibility Guidelines (WCAG) 2.1. Defines measurable contrast ratio standards for digital accessibility.",
];

export default function CT11ColourAccessibility(){
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
  const[textColor,setTextColor]=useState("#FFFFFF");
  const[bgColor,setBgColor]=useState("#FF7A00");
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

  const ratio=contrastRatio(textColor,bgColor);
  const passAA=ratio>=4.5,passAALarge=ratio>=3,passAAA=ratio>=7;

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
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 0"}}>Numbers, not opinions. Colour, never alone.</p>
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
              <Tag color={T.brand}>EXPLORE - CONTRAST CHECKER</Tag>
              <p style={{fontSize:13,color:T.muted,lineHeight:1.6,margin:"10px 0 14px"}}>Pick a text and background colour and see the real WCAG ratio live.</p>
              <div style={{display:"flex",gap:10,marginBottom:14}}>
                <label style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
                  <span style={{fontSize:11,color:T.muted}}>Text colour</span>
                  <input type="color" value={textColor} onChange={function(e){setTextColor(e.target.value);}} style={{width:"100%",height:40,border:"none",background:"none",cursor:"pointer",borderRadius:8}}/>
                </label>
                <label style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
                  <span style={{fontSize:11,color:T.muted}}>Background colour</span>
                  <input type="color" value={bgColor} onChange={function(e){setBgColor(e.target.value);}} style={{width:"100%",height:40,border:"none",background:"none",cursor:"pointer",borderRadius:8}}/>
                </label>
              </div>
              <div style={{background:bgColor,borderRadius:12,padding:20,marginBottom:14,textAlign:"center"}}>
                <span style={{color:textColor,fontSize:18,fontWeight:700}}>Sample Text</span>
              </div>
              <div style={{fontSize:26,fontWeight:800,color:T.brand,fontFamily:"Georgia,serif",textAlign:"center",marginBottom:10}}>{ratio.toFixed(2)}:1</div>
              <div style={{display:"flex",gap:8}}>
                <div style={{flex:1,padding:"8px",borderRadius:8,textAlign:"center",background:passAA?"rgba(45,198,83,.12)":"rgba(233,69,96,.12)",color:passAA?T.green:T.red,fontSize:11.5,fontWeight:700}}>{passAA?"AA Pass":"AA Fail"}</div>
                <div style={{flex:1,padding:"8px",borderRadius:8,textAlign:"center",background:passAALarge?"rgba(45,198,83,.12)":"rgba(233,69,96,.12)",color:passAALarge?T.green:T.red,fontSize:11.5,fontWeight:700}}>{passAALarge?"AA Large Pass":"AA Large Fail"}</div>
                <div style={{flex:1,padding:"8px",borderRadius:8,textAlign:"center",background:passAAA?"rgba(45,198,83,.12)":"rgba(233,69,96,.12)",color:passAAA?T.green:T.red,fontSize:11.5,fontWeight:700}}>{passAAA?"AAA Pass":"AAA Fail"}</div>
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
              <p style={{fontSize:16,color:T.white,lineHeight:1.65,margin:"10px 0 4px"}}>5 practice + 5 real-case challenges. Complete each to unlock the next. First answer is final.</p>
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
                    <Tag color={myDone?(isCorrect?T.green:T.red):T.brand}>{"C"+(qi+1)+" of 5 - Real Case"}</Tag>
                    {myDone&&<span style={{fontSize:12,color:isCorrect?T.green:T.red,fontWeight:700}}>{isCorrect?"+5 pts":"0 pts"}</span>}
                  </div>
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.6,margin:"0 0 12px"}}>Does this text and background combination pass WCAG AA?</p>
                  <div style={{borderRadius:10,background:brand.c2,padding:20,marginBottom:12,textAlign:"center"}}>
                    <span style={{color:brand.c1,fontSize:16,fontWeight:700}}>Sample Text</span>
                  </div>
                  <p style={{fontSize:11,color:T.dim,margin:"0 0 12px"}}>{brand.name}: {brand.hint}</p>
                  {!myRev&&(
                    <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
                      {["Pass","Fail"].map(function(opt){
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
                      <div style={{fontWeight:700,color:T.white,marginBottom:4}}>{brand.name}</div>
                      <div style={{fontSize:13,color:T.muted,lineHeight:1.65,marginBottom:10}}>{brand.exp}</div>
                      {!myDone&&<button onClick={function(){const n=Object.assign({},ccAnswered);n[qi]=true;setCcAnswered(n);setCcIdx(qi+1);if(qi===4)setCcDone(true);}} style={{padding:"8px 18px",background:T.green,border:"none",borderRadius:8,color:"#0A0A0A",fontWeight:700,fontSize:13,cursor:"pointer"}}>Next</button>}
                    </div>
                  )}
                </Card>
              );
            })}

            {!cbDone&&(
              <div style={{textAlign:"center",padding:20,color:T.dim,fontSize:13}}>Complete all 5 practice challenges to unlock Real Case challenges</div>
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
