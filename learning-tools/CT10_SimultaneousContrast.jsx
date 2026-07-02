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

const LESSON_MODULE="COLOUR THEORY - TOPIC 10";
const LESSON_TITLE="Simultaneous Contrast";
const LESSON_SUBTITLE="Michel Eugene Chevreul 1839 - Josef Albers 1963";

const STORY_PARA_1="In the 1830s, chemist Michel Eugene Chevreul ran the dye works at a famous French tapestry manufacturer. Customers kept complaining that certain blacks looked faded or greenish - but every dye test came back perfect. The pigment was not the problem.";
const STORY_PARA_2="Chevreul eventually proved the dyes were never at fault. A colour thread woven next to a different colour appeared to shift, simply because of what sat beside it. He published his findings in 1839 as the Law of Simultaneous Contrast - colours are never seen in isolation, only in relation to their neighbours.";
const STORY_PARA_3="Over a century later, Josef Albers built an entire body of work proving the same illusion with paper squares: an identical grey looks lighter on black and darker on white, and can even take on a faint tint of a colour's opposite depending on what surrounds it - even though the grey itself never changes.";
const STORY_PROBLEM="You picked a colour from an isolated swatch, dropped it into your actual design, and it suddenly looked wrong - too warm, too dark, too dull. The swatch never lied technically. Its neighbours in your design changed how it looked.";
const STORY_5Q=[
  {q:"What is it?",a:"An optical illusion where a colour's appearance shifts depending on the colours placed around it, even though the colour itself never changes."},
  {q:"Why does it exist?",a:"The eye reads colour relationally, not in isolation - your perception of any colour is always influenced by its neighbours."},
  {q:"How does it work?",a:"A colour placed on a dark background looks lighter than the same colour on a light background; a grey next to a hue can pick up a faint tint of that hue's opposite."},
  {q:"How will you use it?",a:"Never trust an isolated colour swatch - always test a colour inside its real, final context before deciding it is right."},
  {q:"What if you skip it?",a:"A colour that looked perfect in isolation looks wrong the moment it is placed among your actual design's other colours."},
];

const CONCEPT_SECTIONS=[
  {tag:"THE ILLUSION",tagColor:T.brand,formula:"Same colour, different context",desc:"A single, unchanged colour appears different depending on what surrounds it. This is not a trick of memory - it happens in real time, in front of your eyes.",rule:"Colour is never perceived in isolation - it is always perceived relative to its neighbours."},
  {tag:"VALUE SHIFT",tagColor:"#B0B0B0",formula:"Same grey, black vs white background",desc:"An identical mid-grey square looks noticeably lighter when placed on a black background, and noticeably darker when placed on a white background.",rule:"Never judge how light or dark a colour is from a swatch alone - its background changes the perceived value."},
  {tag:"HUE SHIFT",tagColor:"#B08CFF",formula:"Same grey, coloured backgrounds",desc:"A neutral grey placed on a saturated background can appear to pick up a faint tint of that background's opposite hue - a grey on red can look slightly greenish, a grey on blue can look slightly orange.",rule:"The eye tries to push a neutral toward the complement of whatever surrounds it - expect this shift, do not fight it blindly."},
  {tag:"WHY IT MATTERS",tagColor:T.green,formula:"Context beats isolation",desc:"A colour picked from an isolated swatch or picker will almost always look different once placed inside a real design, because it now has real neighbours influencing it.",rule:"Always test a colour choice inside its actual final context - never trust how it looks alone on a white picker background."},
];

const QUESTION_BANK=[
  {id:"s1",q:"What is simultaneous contrast?",opts:["An illusion where a colour's appearance shifts depending on its surrounding colours","A rule for pairing complementary hues","A ratio for distributing colour across a layout","A method for converting RGB to CMYK"],ans:"An illusion where a colour's appearance shifts depending on its surrounding colours",exp:"Simultaneous contrast is a perceptual illusion, not a design choice or a conversion method."},
  {id:"s2",q:"Who first documented this effect in 1839 while running a dye works?",opts:["Michel Eugene Chevreul","Josef Albers","Johannes Itten","Isaac Newton"],ans:"Michel Eugene Chevreul",exp:"Chevreul published the Law of Simultaneous Contrast after investigating complaints about dyed threads."},
  {id:"s3",q:"Who later demonstrated the same illusion with paper squares in 1963?",opts:["Josef Albers","Michel Eugene Chevreul","Faber Birren","Eva Heller"],ans:"Josef Albers",exp:"Albers' Interaction of Color used paper square exercises to demonstrate the illusion clearly."},
  {id:"s4",q:"An identical grey square looks lighter when placed on which background?",opts:["A black background","A white background","A grey background","It looks the same on any background"],ans:"A black background",exp:"The same grey appears lighter against black and darker against white, purely due to contrast."},
  {id:"s5",q:"An identical grey square looks darker when placed on which background?",opts:["A white background","A black background","Any coloured background equally","It never looks darker"],ans:"A white background",exp:"Against a lighter background, the same grey reads as comparatively darker."},
  {id:"s6",q:"Does the grey square's actual colour value change between the two backgrounds?",opts:["No, only its perceived appearance changes","Yes, the pigment physically changes","Yes, but only in print, not on screen","No, but only because screens cannot render grey accurately"],ans:"No, only its perceived appearance changes",exp:"The grey itself is identical - only perception, driven by context, changes."},
  {id:"s7",q:"A neutral grey on a saturated red background can appear to take on a faint tint of:",opts:["Green, the complement of red","Red itself, becoming more red","Blue","No tint at all, greys are immune to this"],ans:"Green, the complement of red",exp:"The eye tends to push a neutral toward the complementary hue of its surroundings."},
  {id:"s8",q:"A neutral grey on a saturated blue background can appear to take on a faint tint of:",opts:["Orange, the complement of blue","Blue itself","Purple","No tint, this only happens with red"],ans:"Orange, the complement of blue",exp:"The eye pushes the neutral toward blue's complement, which is orange."},
  {id:"s9",q:"Why did Chevreul's dye customers complain about faded or greenish blacks that tested perfectly in isolation?",opts:["The threads were woven next to other colours that shifted their appearance","The dye was actually defective every time","The customers were mistaken about colour entirely","Black cannot be dyed accurately"],ans:"The threads were woven next to other colours that shifted their appearance",exp:"This was the discovery that led Chevreul to formalise simultaneous contrast."},
  {id:"s10",q:"What is the main practical lesson simultaneous contrast teaches designers?",opts:["Never trust an isolated colour swatch - always test colour in its real context","Always use grey as a neutral background","Never use complementary colours together","Colour choice does not matter once a design is finished"],ans:"Never trust an isolated colour swatch - always test colour in its real context",exp:"Context changes perception, so final judgement should happen in the real design, not a picker."},
  {id:"s11",q:"A colour picked from a colour picker on a white background may look different once placed:",opts:["Inside the actual design, next to its real neighbouring colours","In a different colour picker app","On a printed business card only","Nowhere, colour pickers are always accurate"],ans:"Inside the actual design, next to its real neighbouring colours",exp:"The real neighbours in a finished design change the colour's appearance from how it looked in isolation."},
  {id:"s12",q:"Which best describes the difference between simultaneous contrast and temperature contrast (from a previous lesson)?",opts:["Simultaneous contrast is an involuntary illusion in perception; temperature contrast is a deliberate design choice using warm and cool hues","They are identical concepts with different names","Temperature contrast is an illusion, simultaneous contrast is a deliberate choice","Neither has anything to do with perception"],ans:"Simultaneous contrast is an involuntary illusion in perception; temperature contrast is a deliberate design choice using warm and cool hues",exp:"One is something that happens to perception automatically; the other is a tool a designer applies on purpose."},
  {id:"s13",q:"Why is it risky to finalise a brand colour by looking only at a swatch on a plain white background?",opts:["The colour will look different once surrounded by the brand's actual other colours","White backgrounds always distort colour permanently","Swatches cannot display colour accurately at all","There is no risk, swatches are always final"],ans:"The colour will look different once surrounded by the brand's actual other colours",exp:"An isolated swatch does not reflect how the colour will actually be perceived in context."},
  {id:"s14",q:"A designer notices a background colour looks too light next to a dark sidebar, but fine on its own. This is an example of:",opts:["Simultaneous contrast affecting perceived value","A printing error","A monitor calibration issue only","An accessibility violation"],ans:"Simultaneous contrast affecting perceived value",exp:"The perceived lightness shift caused by a neighbouring colour is exactly this illusion at work."},
  {id:"s15",q:"Simultaneous contrast affects perception of which properties of a colour?",opts:["Both perceived lightness (value) and perceived hue","Only the exact hex code of the colour","Only file size of the image","Only how a colour prints, never how it displays on screen"],ans:"Both perceived lightness (value) and perceived hue",exp:"The illusion can shift how light/dark a colour looks and how much it seems tinted toward a complementary hue."},
  {id:"s16",q:"Two identical grey squares are placed on different colour backgrounds side by side. What will most viewers report?",opts:["The two greys look different from each other, even though they are identical","The two greys look exactly the same every time","One grey physically changes colour","Neither grey is visible at all"],ans:"The two greys look different from each other, even though they are identical",exp:"This is the exact demonstration Albers used to prove the illusion."},
  {id:"s17",q:"Why is simultaneous contrast considered an involuntary effect?",opts:["It happens automatically in perception, regardless of whether the viewer wants it to or believes in it","It only happens if the viewer is told about it in advance","It can be turned off by concentrating hard enough","It only affects people with colour vision deficiencies"],ans:"It happens automatically in perception, regardless of whether the viewer wants it to or believes in it",exp:"The illusion occurs automatically in the visual system, independent of conscious effort."},
  {id:"s18",q:"A designer wants to accurately judge a colour's true lightness. What should they avoid doing?",opts:["Judging it only against a single, arbitrary background colour","Testing it against several different realistic backgrounds","Comparing it to a known reference grey","Viewing it in proper lighting"],ans:"Judging it only against a single, arbitrary background colour",exp:"A single background can distort perceived lightness - multiple contexts give a more reliable read."},
  {id:"s19",q:"Which of these is the most reliable way to counter the effects of simultaneous contrast during design?",opts:["Test the colour directly inside the real design, next to its actual neighbours","Only ever look at colours on a pure white background","Avoid using more than one colour in any design","Ignore the effect entirely since it cannot be addressed"],ans:"Test the colour directly inside the real design, next to its actual neighbours",exp:"Testing in the real context is the most reliable way to judge true appearance."},
  {id:"s20",q:"A dark navy background makes a medium blue logo appear lighter than it does on a white background. This demonstrates:",opts:["Value-based simultaneous contrast","Hue-based simultaneous contrast only","A printing defect","An accessibility violation"],ans:"Value-based simultaneous contrast",exp:"The perceived lightness shift caused entirely by the background is the value form of this illusion."},
  {id:"s21",q:"Chevreul's original discovery came from investigating complaints in which industry?",opts:["Tapestry and dye manufacturing","Automobile paint","Digital screen manufacturing","Food packaging"],ans:"Tapestry and dye manufacturing",exp:"Chevreul directed the dye works at a French tapestry manufacturer when he made his discovery."},
  {id:"s22",q:"Albers' 1963 book demonstrating this effect was titled:",opts:["Interaction of Color","The Art of Color","Psychology of Color","Elements of Color"],ans:"Interaction of Color",exp:"Josef Albers published Interaction of Color in 1963, demonstrating simultaneous contrast through exercises."},
  {id:"s23",q:"A grey square appears to shift toward orange when placed on which background?",opts:["A saturated blue background","A saturated orange background","A white background","A black background only"],ans:"A saturated blue background",exp:"The eye pushes the neutral toward blue's complement, which is orange."},
  {id:"s24",q:"Why might two designers disagree about whether a colour 'looks right' when viewing it in different contexts?",opts:["Simultaneous contrast means the same colour can genuinely appear different depending on its surroundings","One designer has a broken monitor","Colour perception is entirely random with no cause","Only one of them is seeing the colour correctly"],ans:"Simultaneous contrast means the same colour can genuinely appear different depending on its surroundings",exp:"Different surrounding contexts can legitimately produce different perceived appearances of the same colour."},
  {id:"s25",q:"What happens if you place a swatch of pure grey on a bright yellow background?",opts:["The grey may appear to take on a faint purple tint, yellow's complement","The grey turns permanently yellow","Nothing perceptible happens at all","The grey becomes darker only, with no hue shift"],ans:"The grey may appear to take on a faint purple tint, yellow's complement",exp:"The eye tends to push a neutral toward the complementary hue of its surroundings."},
  {id:"s26",q:"Why is simultaneous contrast especially important to understand when working with brand colour consistency?",opts:["The same brand colour can look different across different backgrounds unless tested in context","Brand colours are immune to this effect","It only matters for print, never for digital brand assets","It has no relevance to brand consistency at all"],ans:"The same brand colour can look different across different backgrounds unless tested in context",exp:"A brand colour must be checked across its real contexts to ensure it reads consistently."},
  {id:"s27",q:"A UI element that looked perfectly matched to a mockup swatch looks slightly off once placed on the real interface. Most likely cause:",opts:["Simultaneous contrast from its actual surrounding colours","A corrupted file","An incorrect file format","The element was resized"],ans:"Simultaneous contrast from its actual surrounding colours",exp:"Real surrounding colours in the finished interface can shift the element's perceived appearance."},
  {id:"s28",q:"Which statement best distinguishes simultaneous contrast from colour harmony?",opts:["Simultaneous contrast is a perceptual illusion; colour harmony is a deliberate scheme for choosing hues that work together","They are identical, just different names for the same idea","Colour harmony is an illusion, simultaneous contrast is a scheme","Neither concept involves the colour wheel"],ans:"Simultaneous contrast is a perceptual illusion; colour harmony is a deliberate scheme for choosing hues that work together",exp:"One happens automatically to perception; the other is a set of deliberate hue-pairing choices."},
  {id:"s29",q:"The core practical takeaway from simultaneous contrast for a designer is:",opts:["Always evaluate a colour choice in its real final context, not in isolation","Never use grey in any design","Complementary colours should never be placed near each other","Colour perception cannot be trusted at all, ever"],ans:"Always evaluate a colour choice in its real final context, not in isolation",exp:"That is the entire practical lesson behind this illusion."},
  {id:"s30",q:"In one sentence, simultaneous contrast is:",opts:["An illusion where the same colour appears to change depending on the colours around it","A rule for building a colour palette from one hue","A ratio for distributing colour across a layout","A method for converting hex to RGB"],ans:"An illusion where the same colour appears to change depending on the colours around it",exp:"That is the complete summary of this lesson's core idea."},
  {id:"s31",q:"A light grey square looks almost white on a very dark background, but clearly grey on a light background. This shows:",opts:["Simultaneous contrast shifting perceived value","The square physically changing lightness","A screen calibration fault","No real effect, this is imagined"],ans:"Simultaneous contrast shifting perceived value",exp:"The perceived shift in lightness, without any actual change, is the illusion in action."},
  {id:"s32",q:"Why did Chevreul conclude the dye itself was not at fault?",opts:["Because isolated dye tests came back correct every time, meaning the surrounding threads were causing the perceived shift","Because customers were lying about the problem","Because the factory changed suppliers","Because dye cannot be tested for accuracy"],ans:"Because isolated dye tests came back correct every time, meaning the surrounding threads were causing the perceived shift",exp:"Consistent correct results in isolation pointed to context, not the dye, as the real cause."},
  {id:"s33",q:"A designer places a swatch on a neutral grey card to judge it fairly. Why might this still be insufficient for final approval?",opts:["The real design's actual neighbouring colours may differ significantly from a neutral grey card","Grey cards always distort colour permanently","There is no way to ever judge colour accurately","This method is always sufficient with no exceptions"],ans:"The real design's actual neighbouring colours may differ significantly from a neutral grey card",exp:"A neutral test card reduces distortion but still is not the same as the real final context."},
  {id:"s34",q:"Which of these best explains why the illusion is called 'simultaneous'?",opts:["Because the shift in appearance happens at the same time as viewing the colour, not afterward","Because it only works if two people view it at the same time","Because it takes several seconds to develop","Because it only happens simultaneously with an afterimage effect"],ans:"Because the shift in appearance happens at the same time as viewing the colour, not afterward",exp:"The perceptual shift occurs in real time, simultaneously with viewing, rather than as a delayed effect."},
  {id:"s35",q:"A packaging designer tests a product's accent colour only against a plain studio background, then finds it looks different on the actual busy shelf. This illustrates:",opts:["The importance of testing colour in its real, final context due to simultaneous contrast","A printing press calibration error","An accessibility failure","A completely unrelated colour theory concept"],ans:"The importance of testing colour in its real, final context due to simultaneous contrast",exp:"Real shelf context, full of other product colours, will shift perception compared to an isolated studio test."},
  {id:"s36",q:"Which of these scenarios best demonstrates hue-based simultaneous contrast?",opts:["A neutral grey looking faintly tinted with a complementary hue depending on its background","A grey square looking lighter on black and darker on white","A designer choosing a triadic colour scheme","A designer converting RGB values to CMYK for print"],ans:"A neutral grey looking faintly tinted with a complementary hue depending on its background",exp:"This is specifically the hue-shift version of the illusion, distinct from the value-shift version."},
  {id:"s37",q:"Which of these scenarios best demonstrates value-based simultaneous contrast?",opts:["A grey square looking lighter on black and darker on white","A grey square picking up a tint of a complementary hue","A designer building a monochromatic palette","A designer selecting a Pantone colour for print"],ans:"A grey square looking lighter on black and darker on white",exp:"This is specifically the value-shift version of the illusion, based purely on lightness perception."},
  {id:"s38",q:"Why should a designer be cautious about approving colours during a client call over video, on an uncontrolled screen?",opts:["Both the screen's calibration and the surrounding on-screen colours can shift how the colour is perceived","Video calls always show colour with perfect accuracy","This has nothing to do with simultaneous contrast","Colour approval should never happen over video regardless of the reason"],ans:"Both the screen's calibration and the surrounding on-screen colours can shift how the colour is perceived",exp:"Uncontrolled viewing contexts, including surrounding UI elements, can distort perceived colour."},
  {id:"s39",q:"What did Albers' paper square exercises prove that Chevreul's dye observations had already suggested a century earlier?",opts:["The same underlying illusion - that context changes colour perception - applies well beyond dyed fabric","That fabric and paper behave completely differently for colour perception","That the illusion only worked with dye, not with flat colour","That Chevreul's original findings were incorrect"],ans:"The same underlying illusion - that context changes colour perception - applies well beyond dyed fabric",exp:"Albers demonstrated the same principle in an entirely different medium, generalising the discovery."},
  {id:"s40",q:"A designer wants to prove to a client that a colour choice is correct despite looking 'off' on the client's monitor. The most useful response is:",opts:["Show the colour placed correctly within its full, real context rather than arguing about the isolated swatch","Insist the client's monitor is broken without checking","Change the colour immediately without investigation","Ignore the client's concern entirely"],ans:"Show the colour placed correctly within its full, real context rather than arguing about the isolated swatch",exp:"Demonstrating the colour in its real context is the most direct way to address a perception-based concern."},
  {id:"s41",q:"Which of these is NOT a factor that simultaneous contrast is about?",opts:["The angle between two hues on the colour wheel","The lightness of the surrounding background","The saturation of the surrounding background","The hue of the surrounding background"],ans:"The angle between two hues on the colour wheel",exp:"Wheel angle relates to harmony schemes, not to the simultaneous contrast illusion."},
  {id:"s42",q:"A brand's logo colour needs to remain recognisable across many different product backgrounds. Why is simultaneous contrast relevant here?",opts:["The logo colour may appear to shift depending on each product's background, even though the actual colour value stays fixed","The logo's actual pixel values will physically change on each product","This concept only applies to grey colours, not brand colours","There is no relevance to branding at all"],ans:"The logo colour may appear to shift depending on each product's background, even though the actual colour value stays fixed",exp:"Consistent brand recognition requires accounting for how different backgrounds shift perceived appearance."},
  {id:"s43",q:"Which best describes why isolated colour swatches can be misleading?",opts:["They remove the real surrounding context that will actually influence how the colour is perceived","They always use the wrong colour mode","They cannot be printed accurately","They are technically incapable of displaying true colour"],ans:"They remove the real surrounding context that will actually influence how the colour is perceived",exp:"Removing context is exactly what makes an isolated swatch an unreliable final judgement tool."},
  {id:"s44",q:"A student memorises hex codes for a palette but is confused when the same colours look different once assembled into a poster. This is best explained by:",opts:["Simultaneous contrast changing perceived appearance once colours are placed in context together","The hex codes being technically wrong","The poster printer making an error","There being no real explanation, it is imagined"],ans:"Simultaneous contrast changing perceived appearance once colours are placed in context together",exp:"Correct hex values can still look different once placed next to their real neighbours."},
  {id:"s45",q:"Why is this lesson's illusion considered separate from a deliberate design contrast strategy?",opts:["It happens automatically to perception regardless of designer intent, rather than being a choice a designer makes","It only happens when a designer decides to trigger it on purpose","It cannot occur unless a designer studies colour theory first","It is identical to choosing warm and cool hues on purpose"],ans:"It happens automatically to perception regardless of designer intent, rather than being a choice a designer makes",exp:"Simultaneous contrast is involuntary perception, distinct from deliberate contrast-based design decisions."},
  {id:"s46",q:"A designer compares a colour swatch against pure white, then again against the actual dark app background. Why might the two comparisons give different impressions?",opts:["Because simultaneous contrast makes the same colour appear differently depending on the background it sits against","Because the colour physically changes between the two tests","Because pure white always shows the most accurate colour","Because dark backgrounds cannot display colour correctly"],ans:"Because simultaneous contrast makes the same colour appear differently depending on the background it sits against","exp":"This is exactly why context-based testing matters more than an isolated white-background comparison."},
  {id:"s47",q:"The safest general practice to avoid being misled by simultaneous contrast is:",opts:["Always judge a colour's final appearance inside its actual, complete context","Only ever use black and white in any design","Avoid learning colour theory entirely","Trust the very first swatch you see and never re-check it"],ans:"Always judge a colour's final appearance inside its actual, complete context",exp:"That is the single most reliable defence against being misled by this illusion."},
  {id:"s48",q:"Which pair of historical figures is most associated with simultaneous contrast?",opts:["Michel Eugene Chevreul and Josef Albers","Isaac Newton and Johannes Itten","Eva Heller and Faber Birren","Robert Bringhurst and Ellen Lupton"],ans:"Michel Eugene Chevreul and Josef Albers",exp:"Chevreul first documented the effect, and Albers later demonstrated it extensively with paper studies."},
  {id:"s49",q:"The core practical value of understanding simultaneous contrast is:",opts:["Knowing that colour judgement must always happen in real context, not in isolation","Knowing exactly which hex code to use for every project","Being able to convert RGB to CMYK accurately","Being able to build a harmony scheme from one hue"],ans:"Knowing that colour judgement must always happen in real context, not in isolation",exp:"That is the entire practical value of this lesson's illusion."},
  {id:"s50",q:"In one sentence, simultaneous contrast proves that:",opts:["Colour is never seen in isolation - only in relation to what surrounds it","Every colour has one single true appearance regardless of context","Grey is the only colour affected by context","Colour perception is entirely unreliable and cannot be studied"],ans:"Colour is never seen in isolation - only in relation to what surrounds it",exp:"That is the complete summary of this lesson's core idea."},
];

const CB_TYPE="topic";
const CB_QUESTIONS=[
  {q:"Simultaneous contrast is:",opts:["An illusion where a colour's appearance shifts based on its surroundings","A rule for pairing complementary hues","A colour ratio for layouts","A conversion between RGB and CMYK"],ans:"An illusion where a colour's appearance shifts based on its surroundings",exp:"It is a perceptual illusion driven by context."},
  {q:"Who first documented this effect in 1839?",opts:["Michel Eugene Chevreul","Josef Albers","Johannes Itten","Isaac Newton"],ans:"Michel Eugene Chevreul",exp:"Chevreul discovered it while investigating dye complaints."},
  {q:"Who demonstrated it with paper squares in 1963?",opts:["Josef Albers","Chevreul","Faber Birren","Eva Heller"],ans:"Josef Albers",exp:"Albers' Interaction of Color used paper exercises to prove the effect."},
  {q:"An identical grey looks lighter on which background?",opts:["Black","White","Grey","Any background equally"],ans:"Black",exp:"The same grey appears lighter against a dark background."},
  {q:"An identical grey looks darker on which background?",opts:["White","Black","Any coloured background","It never looks darker"],ans:"White",exp:"Against a lighter background, the grey reads as comparatively darker."},
  {q:"Does the grey's actual value physically change between backgrounds?",opts:["No, only perception changes","Yes, it physically changes","Only on screens, not in print","Only in bright lighting"],ans:"No, only perception changes",exp:"The grey stays identical - only how it is perceived shifts."},
  {q:"A grey on a red background may appear to shift toward:",opts:["Green, red's complement","Red itself","Blue","No shift at all"],ans:"Green, red's complement",exp:"The eye pushes the neutral toward the complement of its surroundings."},
  {q:"A grey on a blue background may appear to shift toward:",opts:["Orange, blue's complement","Blue itself","Purple","No shift at all"],ans:"Orange, blue's complement",exp:"The eye pushes the neutral toward blue's complement, orange."},
  {q:"Chevreul discovered this effect while working in which industry?",opts:["Dye and tapestry manufacturing","Automobile paint","Digital displays","Food packaging"],ans:"Dye and tapestry manufacturing",exp:"He ran the dye works at a French tapestry manufacturer."},
  {q:"What is the main practical lesson for designers?",opts:["Never trust an isolated swatch, always test in real context","Always use grey backgrounds","Never use complementary hues together","Colour choice does not matter"],ans:"Never trust an isolated swatch, always test in real context",exp:"Real context is the only reliable way to judge final appearance."},
  {q:"Why can a colour picked from a plain white picker look wrong in the final design?",opts:["Its real neighbouring colours will shift its perceived appearance","White pickers are always technically broken","Colour pickers cannot display accurate colour","There is no real reason"],ans:"Its real neighbouring colours will shift its perceived appearance",exp:"The design's actual neighbours change perception compared to an isolated picker view."},
  {q:"How does simultaneous contrast differ from a deliberate contrast design choice?",opts:["It is an involuntary illusion, not a choice a designer makes on purpose","They are identical","Simultaneous contrast is always intentional","Deliberate contrast is always involuntary"],ans:"It is an involuntary illusion, not a choice a designer makes on purpose",exp:"One happens automatically to perception; the other is a deliberate design decision."},
  {q:"What did Chevreul conclude after isolated dye tests kept coming back correct?",opts:["The surrounding threads, not the dye, were causing the perceived shift","The dye was always faulty","Customers were imagining the problem","Testing dye in isolation is impossible"],ans:"The surrounding threads, not the dye, were causing the perceived shift",exp:"Consistent correct isolated results pointed to context as the real cause."},
  {q:"Which best distinguishes simultaneous contrast from colour harmony?",opts:["One is an involuntary illusion, the other is a deliberate hue-pairing scheme","They are identical concepts","Harmony is an illusion, contrast is a scheme","Neither relates to colour perception"],ans:"One is an involuntary illusion, the other is a deliberate hue-pairing scheme",exp:"They answer entirely different questions about colour."},
  {q:"A brand's logo colour looks different across various product backgrounds. Why?",opts:["Simultaneous contrast shifts its perceived appearance depending on each background","The logo's actual pixel values change each time","This has no explanation","Brand colours are immune to this effect"],ans:"Simultaneous contrast shifts its perceived appearance depending on each background",exp:"The same fixed colour value can look different depending on its real surroundings."},
  {q:"What is the safest way to judge a colour's true final appearance?",opts:["Test it directly inside its real, final context","Judge it only on a plain white background","Judge it only from memory","Avoid testing it at all"],ans:"Test it directly inside its real, final context",exp:"Real context gives the most reliable read on how a colour will actually be perceived."},
  {q:"A grey square on yellow may appear tinted toward:",opts:["Purple, yellow's complement","Yellow itself","Green","No tint at all"],ans:"Purple, yellow's complement",exp:"The eye pushes the grey toward yellow's complement, purple."},
  {q:"Which factor is NOT part of simultaneous contrast?",opts:["The angle between two hues on the wheel","The lightness of a surrounding background","The hue of a surrounding background","The saturation of a surrounding background"],ans:"The angle between two hues on the wheel",exp:"Wheel angle belongs to harmony schemes, not this illusion."},
  {q:"Why is testing a colour on a video call risky for final approval?",opts:["Screen calibration and surrounding on-screen colours can distort perceived colour","Video calls always show perfect colour","This has nothing to do with the topic","Colour approval is impossible in any format"],ans:"Screen calibration and surrounding on-screen colours can distort perceived colour",exp:"Uncontrolled viewing conditions add extra distortion on top of the illusion itself."},
  {q:"What did Albers' work prove that extended Chevreul's original finding?",opts:["The same context-based illusion applies well beyond dyed fabric","Fabric and paper behave completely differently","Chevreul's findings were wrong","The illusion only works with dye"],ans:"The same context-based illusion applies well beyond dyed fabric",exp:"Albers generalised the discovery to flat paper colour studies."},
  {q:"A packaging colour tested alone in a studio looks different on a busy retail shelf. This shows:",opts:["The need to test colour in its real final context","A printing press fault","An accessibility failure","An unrelated concept entirely"],ans:"The need to test colour in its real final context",exp:"The busy shelf context shifts perception compared to an isolated studio test."},
  {q:"Which best explains why the effect is called 'simultaneous'?",opts:["The perceptual shift happens at the same time as viewing, not afterward","It only occurs with two viewers present at once","It takes several minutes to develop","It only happens alongside an afterimage effect"],ans:"The perceptual shift happens at the same time as viewing, not afterward",exp:"The shift occurs in real time as the colour is viewed."},
  {q:"A designer disagrees with a client about whether a colour 'looks right'. The most useful response is:",opts:["Show the colour in its full real context rather than arguing about an isolated swatch","Insist the client's monitor is broken","Change the colour immediately with no explanation","Ignore the disagreement entirely"],ans:"Show the colour in its full real context rather than arguing about an isolated swatch",exp:"Demonstrating real context is the most direct way to resolve a perception-based disagreement."},
  {q:"The core practical value of this lesson is:",opts:["Colour judgement must always happen in real context, not isolation","Knowing exact hex codes for every project","Converting RGB to CMYK accurately","Building a harmony scheme from one hue"],ans:"Colour judgement must always happen in real context, not isolation",exp:"That is the entire practical value of understanding simultaneous contrast."},
  {q:"In one sentence, simultaneous contrast proves that:",opts:["Colour is never seen in isolation, only in relation to what surrounds it","Every colour has one fixed true appearance always","Only grey is affected by this illusion","Colour perception cannot be studied at all"],ans:"Colour is never seen in isolation, only in relation to what surrounds it",exp:"That is the complete summary of this lesson's core idea."},
];

const BRAND_BANK=[
  {name:"Notion",c1:"#FFFFFF",c2:"#EAEAEA",hint:"The same light-grey UI element looks noticeably darker when placed on Notion's pure white background than it would on a darker app background",ans:"true",exp:"This is a direct example of value-based simultaneous contrast affecting the same grey across different backgrounds."},
  {name:"Spotify",c1:"#191414",c2:"#1DB954",hint:"Spotify's green looks especially vivid against the near-black interface, appearing more saturated than the same green would look on a white background",ans:"true",exp:"The dark background intensifies the perceived vividness of the green, a simultaneous contrast effect."},
  {name:"Instagram",c1:"#FFFFFF",c2:"#8A3AB9",hint:"The exact same purple in Instagram's gradient logo can look slightly different in perceived warmth depending on which neighbouring gradient colour sits beside it",ans:"true",exp:"Neighbouring gradient hues shift the perceived warmth of the same purple at different points in the gradient."},
  {name:"Netflix",c1:"#000000",c2:"#E50914",hint:"The same red logo appears more intense on Netflix's black background than an identical red would appear on a white poster background",ans:"true",exp:"The dark surrounding field increases the perceived intensity of the same red value."},
  {name:"A greyscale print proof",c1:"#808080",c2:"#000000",hint:"A designer approves a mid-grey tone against a white proof sheet, then finds it looks noticeably lighter once printed on the final dark packaging",ans:"true",exp:"The same grey value looks different once its real background context changes from white proof to dark packaging."},
  {name:"A web dashboard card",c1:"#F5F5F5",c2:"#1A1A1A",hint:"An identical light card colour looks brighter and more prominent against a dark dashboard theme than the same card would look on a light theme",ans:"true",exp:"This demonstrates the same colour value appearing to shift in perceived lightness based on its surrounding theme."},
  {name:"A clothing brand's tag colour",c1:"#FFFFFF",c2:"#D4AF37",hint:"The exact same gold foil tag looks noticeably richer against black packaging than the identical gold looks against white packaging",ans:"true",exp:"The darker surrounding packaging intensifies the perceived richness of the identical gold colour."},
  {name:"A photography portfolio site",c1:"#0A0A0A",c2:"#F5F5F5",hint:"The same photo's shadow areas appear deeper and richer when displayed on a near-black portfolio background compared to a white background",ans:"true",exp:"The dark surrounding interface shifts the perceived depth of the same shadow tones in the photo."},
  {name:"A children's app icon",c1:"#FFEB3B",c2:"#FFFFFF",hint:"The exact same yellow icon looks slightly duller when surrounded by other bright, saturated icons on a busy home screen than it does alone in an app store listing",ans:"true",exp:"Surrounding saturated icons compete with the yellow, shifting its perceived vividness compared to isolation."},
  {name:"A minimalist skincare brand",c1:"#FFFFFF",c2:"#E8E4DC",hint:"The identical off-white packaging colour looks warmer when placed next to a warmer-toned product photo than it does next to a cooler-toned one",ans:"true",exp:"The neighbouring product photo's warmth shifts the perceived warmth of the identical packaging colour."},
  {name:"A dark-mode reading app",c1:"#121212",c2:"#E0E0E0",hint:"The exact same off-white body text looks brighter and higher-contrast against the app's near-black background than the identical text would look on a mid-grey background",ans:"true",exp:"The darker surrounding background increases the perceived brightness of the identical text colour."},
  {name:"A luxury car interior configurator",c1:"#8B0000",c2:"#1A1A1A",hint:"The same deep red leather swatch looks richer displayed against a black interior preview than the identical swatch looks against a light beige preview",ans:"true",exp:"The darker surrounding preview intensifies the perceived richness of the identical red leather colour."},
  {name:"A weather app's temperature icon",c1:"#3EC6E0",c2:"#003366",hint:"The same light blue icon appears to pop more against a deep navy night-mode background than the identical blue appears against a pale sky-blue day-mode background",ans:"true",exp:"The darker night-mode background increases the perceived contrast and vividness of the identical blue icon."},
  {name:"A bakery's packaging line",c1:"#FFF8E7",c2:"#6B4226",hint:"The exact same cream packaging colour looks warmer and richer next to a dark brown product photo than it does next to a plain white studio backdrop",ans:"true",exp:"The warmer, darker neighbouring photo shifts the perceived warmth of the identical cream packaging colour."},
  {name:"A fintech app balance display",c1:"#00C805",c2:"#0D0D0D",hint:"The exact same green balance number looks more vivid on the app's dark home screen than the identical green looks on a lighter settings page background",ans:"true",exp:"The darker home screen background intensifies the perceived vividness of the identical green text."},
];

const TAKEAWAY_QUOTE="No colour is ever seen alone. What surrounds it decides what you think you are looking at.";
const TAKEAWAY_POINTS=[
  {t:"Never trust an isolated swatch",b:"A colour picked in isolation, on a plain white picker, will almost always look different once placed inside its real design context."},
  {t:"Expect both value and hue shifts",b:"A colour can appear lighter or darker depending on its background's lightness, and can pick up a faint tint of its background's complement."},
  {t:"Always approve colour in real context",b:"The only reliable way to judge a colour's true final appearance is to see it exactly where it will actually live - not on a blank test card."},
];

const SOURCES=[
  "Michel Eugene Chevreul - The Law of Simultaneous Contrast of Colours (1839). First formal documentation of the illusion.",
  "Josef Albers - Interaction of Color (1963). Paper square studies demonstrating the effect for design education.",
];

export default function CT10SimultaneousContrast(){
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
  const[bgA,setBgA]=useState("#0A0A0A");
  const[bgB,setBgB]=useState("#F5F5F5");
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
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 0"}}>The same colour. Two backgrounds. Two completely different impressions.</p>
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
              <Tag color={T.brand}>EXPLORE - PROVE IT TO YOURSELF</Tag>
              <p style={{fontSize:13,color:T.muted,lineHeight:1.6,margin:"10px 0 14px"}}>Both grey squares below are the exact same colour: #888888. Change the backgrounds and watch them look different anyway.</p>
              <div style={{display:"flex",gap:10,marginBottom:14}}>
                <label style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
                  <span style={{fontSize:11,color:T.muted}}>Background A</span>
                  <input type="color" value={bgA} onChange={function(e){setBgA(e.target.value);}} style={{width:"100%",height:40,border:"none",background:"none",cursor:"pointer",borderRadius:8}}/>
                </label>
                <label style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
                  <span style={{fontSize:11,color:T.muted}}>Background B</span>
                  <input type="color" value={bgB} onChange={function(e){setBgB(e.target.value);}} style={{width:"100%",height:40,border:"none",background:"none",cursor:"pointer",borderRadius:8}}/>
                </label>
              </div>
              <div style={{display:"flex",gap:10}}>
                <div style={{flex:1,height:100,borderRadius:12,background:bgA,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:48,height:48,borderRadius:10,background:"#888888"}}/>
                </div>
                <div style={{flex:1,height:100,borderRadius:12,background:bgB,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:48,height:48,borderRadius:10,background:"#888888"}}/>
                </div>
              </div>
              <div style={{fontSize:11,color:T.dim,marginTop:10,textAlign:"center"}}>Both squares are #888888. Any perceived difference is the illusion at work, not a real colour change.</div>
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
                    <Tag color={myDone?(isCorrect?T.green:T.red):T.brand}>{"C"+(qi+1)+" of 5 - Real Case"}</Tag>
                    {myDone&&<span style={{fontSize:12,color:isCorrect?T.green:T.red,fontWeight:700}}>{isCorrect?"+5 pts":"0 pts"}</span>}
                  </div>
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.6,margin:"0 0 12px"}}>Is this scenario an example of simultaneous contrast?</p>
                  <div style={{display:"flex",gap:10,marginBottom:8}}>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c1,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid "+T.border}}><span style={{fontSize:10,color:"rgba(255,255,255,.5)"}}>BACKGROUND</span></div>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c2,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>ELEMENT</span></div>
                  </div>
                  <p style={{fontSize:11,color:T.dim,margin:"0 0 12px"}}>{brand.name}: {brand.hint}</p>
                  {!myRev&&(
                    <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
                      {["True","False"].map(function(opt){
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
