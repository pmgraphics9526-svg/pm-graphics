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

const LESSON_MODULE="COLOUR THEORY - TOPIC 08";
const LESSON_TITLE="Colour Psychology";
const LESSON_SUBTITLE="Faber Birren 1950 - Eva Heller 2000";

const STORY_PARA_1="In the 1950s, colour consultant Faber Birren began studying how colour affected human mood and behaviour - work that factories, paint manufacturers and advertisers eagerly adopted, hoping colour could be engineered to produce a desired feeling on demand.";
const STORY_PARA_2="Decades later, researcher Eva Heller surveyed thousands of people about which colours they associated with which emotions. The patterns were strong enough to guide real branding decisions - though she also found the associations shift depending on culture and context.";
const STORY_PARA_3="Together, this research turned colour into something closer to a language: a set of documented emotional associations a designer could choose deliberately, instead of picking a colour purely because it looked nice.";
const STORY_PROBLEM="You picked a colour for a brand, and someone said it felt wrong for the industry - too aggressive for a bank, too cold for a bakery. That reaction is not random. It is colour psychology working exactly as documented.";
const STORY_5Q=[
  {q:"What is it?",a:"The documented emotional and cultural associations attached to each hue - what people tend to feel or think when they see red, blue, green and so on."},
  {q:"Why does it exist?",a:"Colour communicates meaning before a single word is read, so understanding that meaning lets a designer choose colour on purpose instead of by accident."},
  {q:"How does it work?",a:"Repeated cultural exposure links hues to specific ideas over time - red to urgency, blue to trust, green to growth - strong enough to measure and predict."},
  {q:"How will you use it?",a:"Choose a brand or interface colour that reinforces the feeling the brand needs people to have, rather than one that quietly works against it."},
  {q:"What if you skip it?",a:"A financial app ends up in aggressive red, or a fire-safety warning ends up in calm blue - the colour actively fights the message instead of supporting it."},
];

const CONCEPT_SECTIONS=[
  {tag:"RED",tagColor:"#E94560",formula:"Urgency, passion, appetite",desc:"Strongly tied to urgency, energy, passion and appetite. Used heavily in sales, food branding and alert states because it demands immediate attention.",rule:"Powerful in small, deliberate doses - overused across a whole interface, red can tip from exciting into stressful."},
  {tag:"BLUE",tagColor:"#3EC6E0",formula:"Trust, calm, stability",desc:"The most commonly used colour among global banks, tech companies and healthcare brands, because it consistently reads as trustworthy, calm and professional.",rule:"A dependable default when a brand needs to feel safe and credible before anything else."},
  {tag:"GREEN",tagColor:T.green,formula:"Growth, nature, health",desc:"Tied to nature, growth, health and - in some cultures - money. A common choice for wellness, eco and finance brands wanting to feel natural or reassuring.",rule:"Muddy, desaturated greens can accidentally read as sickly rather than healthy - keep it clean."},
  {tag:"YELLOW & PURPLE",tagColor:"#E0C93E",formula:"Optimism/caution vs luxury/creativity",desc:"Yellow signals optimism and caution at once - it is a classic warning colour. Purple signals luxury and creativity, an association rooted in how historically rare and expensive purple dye once was.",rule:"Yellow rarely works as a large dominant field - it strains the eye and can read as cheap. Purple works best in small, deliberate doses of luxury signalling."},
  {tag:"CULTURAL CONTEXT",tagColor:T.brand,formula:"Meaning is not universal",desc:"White signals purity in the West but mourning in parts of Asia. Red signals danger in the West but luck and celebration in China. The same hue can carry opposite meanings.",rule:"Research your specific audience's cultural associations before assuming a universal meaning applies."},
];

function hueMeaning(h){
  const hh=((h%360)+360)%360;
  if(hh<20||hh>=340)return{label:"RED",words:"Urgency, passion, appetite"};
  if(hh<45)return{label:"ORANGE",words:"Energy, friendliness, enthusiasm"};
  if(hh<65)return{label:"YELLOW",words:"Optimism, caution, attention"};
  if(hh<170)return{label:"GREEN",words:"Growth, nature, health"};
  if(hh<250)return{label:"BLUE",words:"Trust, calm, stability"};
  if(hh<290)return{label:"PURPLE",words:"Luxury, creativity, royalty"};
  return{label:"PINK / MAGENTA",words:"Playfulness, warmth, boldness"};
}
function hueToRgb(h){
  const hh=((h%360)+360)%360;
  const c=1,x=1-Math.abs(((hh/60)%2)-1);
  let r=0,g=0,b=0;
  if(hh<60){r=c;g=x;b=0;} else if(hh<120){r=x;g=c;b=0;} else if(hh<180){r=0;g=c;b=x;} else if(hh<240){r=0;g=x;b=c;} else if(hh<300){r=x;g=0;b=c;} else {r=c;g=0;b=x;}
  return "rgb("+Math.round(r*255)+","+Math.round(g*255)+","+Math.round(b*255)+")";
}

const QUESTION_BANK=[
  {id:"p1",q:"Red is most commonly associated with which emotions in branding?",opts:["Urgency, passion and appetite","Calm and trust","Luxury and royalty","Sadness and mourning"],ans:"Urgency, passion and appetite",exp:"Red is strongly tied to urgency, passion and appetite in Western marketing."},
  {id:"p2",q:"Blue is most commonly associated with which emotions in branding?",opts:["Trust and calm","Urgency and danger","Luxury and exclusivity","Playfulness and chaos"],ans:"Trust and calm",exp:"Blue is the most widely used colour among banks and tech companies for its trust and calm associations."},
  {id:"p3",q:"Green is most commonly associated with which themes?",opts:["Growth, nature and health","Danger and urgency","Royalty and luxury","Mourning"],ans:"Growth, nature and health",exp:"Green is strongly linked to nature, growth and wellbeing."},
  {id:"p4",q:"Yellow is most commonly associated with which combination of themes?",opts:["Optimism and caution","Trust and stability","Luxury and royalty","Sadness"],ans:"Optimism and caution",exp:"Yellow carries both a cheerful optimism and a warning/caution association."},
  {id:"p5",q:"Purple is most commonly associated with which themes?",opts:["Luxury, creativity and royalty","Urgency and danger","Growth and nature","Trust and stability"],ans:"Luxury, creativity and royalty",exp:"Purple's historical rarity as a dye ties it to luxury and royalty."},
  {id:"p6",q:"Black is most commonly associated with which themes in branding?",opts:["Power, elegance and sophistication","Growth and freshness","Warning and caution","Playfulness"],ans:"Power, elegance and sophistication",exp:"Black is a common choice for luxury branding due to its sophisticated, powerful feel."},
  {id:"p7",q:"White is most commonly associated with which themes in Western branding?",opts:["Purity, simplicity and cleanliness","Urgency and danger","Luxury and royalty","Playfulness"],ans:"Purity, simplicity and cleanliness",exp:"White reads as clean, pure and minimal in most Western contexts."},
  {id:"p8",q:"Who pioneered colour psychology research in the 1950s, applied to industry and marketing?",opts:["Faber Birren","Johannes Itten","Josef Albers","Isaac Newton"],ans:"Faber Birren",exp:"Faber Birren's research connected colour to mood and behaviour in applied settings."},
  {id:"p9",q:"Who conducted large-scale surveys on colour-emotion associations, published around 2000?",opts:["Eva Heller","Faber Birren","Robert Bringhurst","Ellen Lupton"],ans:"Eva Heller",exp:"Eva Heller's survey research documented colour-emotion associations across large populations."},
  {id:"p10",q:"Why might a fire-safety warning avoid using calm blue?",opts:["Blue's calm association works against the urgency the warning needs","Blue is illegal to use in safety signage","Blue cannot be printed on warning labels","There is no real reason"],ans:"Blue's calm association works against the urgency the warning needs",exp:"A calming colour undercuts the sense of urgency a warning is meant to create."},
  {id:"p11",q:"Why is blue the most common colour among global banks and tech companies?",opts:["It signals trust, stability and professionalism","It is the cheapest colour to produce","It is legally required for financial branding","It has no particular association at all"],ans:"It signals trust, stability and professionalism",exp:"Blue's trust association makes it a safe, dependable default for these industries."},
  {id:"p12",q:"Why do many sale or clearance signs use red?",opts:["Red creates a sense of urgency that encourages quick action","Red is the cheapest ink to print","Red is required by retail law","Red has no psychological effect"],ans:"Red creates a sense of urgency that encourages quick action",exp:"Red's urgency association is deliberately used to drive fast purchasing decisions."},
  {id:"p13",q:"Why might a wellness or eco-brand choose green as a primary colour?",opts:["Green is strongly associated with nature, health and growth","Green is the least expensive pigment","Green has no meaningful association","Green is required for environmental branding"],ans:"Green is strongly associated with nature, health and growth",exp:"Green's natural, healthy associations align directly with wellness and eco branding goals."},
  {id:"p14",q:"Why is yellow rarely used as a large dominant background colour in professional branding?",opts:["Large fields of yellow can feel harsh and hard to read, and can read as cheap if overused","Yellow cannot be reproduced digitally","Yellow is banned in professional contexts","There is no real reason"],ans:"Large fields of yellow can feel harsh and hard to read, and can read as cheap if overused",exp:"Yellow works best in small doses rather than as a large dominant field."},
  {id:"p15",q:"Why does purple often signal luxury?",opts:["Purple dye was historically rare and expensive, tying it to royalty and wealth","Purple is the most common colour in nature","Purple is the cheapest modern pigment","There is no historical basis for this association"],ans:"Purple dye was historically rare and expensive, tying it to royalty and wealth",exp:"The historic cost of purple dye created a lasting association with luxury and status."},
  {id:"p16",q:"Are colour-emotion associations identical across every culture?",opts:["No, many associations shift significantly by culture and context","Yes, they are completely universal everywhere","Yes, but only for red and blue","No, colour has no cultural meaning anywhere"],ans:"No, many associations shift significantly by culture and context",exp:"Colour meaning is culturally shaped, not a fixed universal law."},
  {id:"p17",q:"In some Asian cultures, white is traditionally associated with which theme, unlike its Western meaning?",opts:["Mourning and funerals","Celebration and luck","Wealth and royalty","Danger and warning"],ans:"Mourning and funerals",exp:"White carries a mourning association in several Asian cultural traditions, contrasting with its Western purity meaning."},
  {id:"p18",q:"In Chinese culture, red is traditionally associated with which theme?",opts:["Luck and celebration","Danger and warning only","Mourning","Sadness"],ans:"Luck and celebration",exp:"Red carries strong positive associations with luck and celebration in Chinese culture."},
  {id:"p19",q:"Why must a designer research their specific target audience before choosing a colour based on psychology?",opts:["Meaning is not universal, and assuming a Western meaning for a different culture can backfire","Research is legally required for every project","Colour psychology only applies to Western audiences","There is no need to research this ever"],ans:"Meaning is not universal, and assuming a Western meaning for a different culture can backfire",exp:"Colour associations vary enough by culture that assumptions can misfire badly."},
  {id:"p20",q:"A financial app feels risky and aggressive to users. Which colour choice most likely caused this?",opts:["Heavy use of bright, saturated red","Heavy use of calm blue","Heavy use of soft green","Heavy use of white"],ans:"Heavy use of bright, saturated red",exp:"Red's urgent, aggressive association can undermine a financial app's need to feel safe."},
  {id:"p21",q:"Colour psychology is best described as:",opts:["Documented patterns of emotional and cultural association with colour, useful but not an exact universal science","An exact, unbreakable law that applies identically everywhere","A random set of unproven guesses","A rule about which hues are legally allowed together"],ans:"Documented patterns of emotional and cultural association with colour, useful but not an exact universal science",exp:"It is evidence-based but not a rigid, universal formula."},
  {id:"p22",q:"Which colour is most associated with caution and warning signage worldwide, alongside black?",opts:["Yellow","Blue","Purple","White"],ans:"Yellow",exp:"Yellow paired with black is a globally recognised caution signal."},
  {id:"p23",q:"Why do many food brands use red and orange together?",opts:["These colours are associated with appetite stimulation and energy","These colours are the cheapest to print on packaging","These colours are legally required for food branding","These colours have no relevant association"],ans:"These colours are associated with appetite stimulation and energy",exp:"Red and orange's energetic, appetite-linked associations are widely used in food branding."},
  {id:"p24",q:"Why might a spa or meditation app avoid bright red as its primary colour?",opts:["Red's high-energy, urgent association works against a calm, relaxing brand feeling","Red is technically impossible to render on mobile screens","Red is only usable in print","There is no reason to avoid it"],ans:"Red's high-energy, urgent association works against a calm, relaxing brand feeling",exp:"A calming brand needs a colour whose psychology supports relaxation, not urgency."},
  {id:"p25",q:"Green's association with money is most specifically tied to which historical detail?",opts:["The colour of US dollar bills, though this link is not universal outside the US","Green being the rarest pigment historically","A universal global banking law","Green being impossible to counterfeit"],ans:"The colour of US dollar bills, though this link is not universal outside the US",exp:"The money association with green is culturally specific, largely rooted in US currency."},
  {id:"p26",q:"A tech startup wants to feel creative and innovative without seeming overly expensive. Which colour association fits, used in smaller doses?",opts:["Purple","Bright red","Pure black only","Bright yellow at full saturation"],ans:"Purple",exp:"Purple's creativity association fits, while smaller doses avoid an overly luxurious feel."},
  {id:"p27",q:"Why is black commonly used in luxury fashion branding?",opts:["Black is associated with sophistication, elegance and exclusivity","Black is the cheapest colour to print","Black has no psychological association","Black is required by fashion industry regulation"],ans:"Black is associated with sophistication, elegance and exclusivity",exp:"Black's association with elegance supports a premium, exclusive brand feeling."},
  {id:"p28",q:"Why is white commonly used in minimalist tech and wellness branding?",opts:["White is associated with simplicity, cleanliness and calm","White is the only colour screens can display","White is required for accessibility compliance","White has no meaningful association"],ans:"White is associated with simplicity, cleanliness and calm",exp:"White's clean, calm association fits a minimalist brand feeling well."},
  {id:"p29",q:"A children's toy brand uses bright red, yellow and blue together. This combination is most associated with:",opts:["Playfulness, energy and approachability for a young audience","Luxury and sophistication","Mourning and seriousness","Professional trust for adults"],ans:"Playfulness, energy and approachability for a young audience",exp:"Bright primary colours are strongly linked to playful, youthful energy."},
  {id:"p30",q:"Which colour is most commonly avoided as a background for long paragraphs of body text, due to poor legibility and a harsh feeling?",opts:["Yellow","Blue","Grey","Black"],ans:"Yellow",exp:"Large fields of yellow can strain the eye and feel harsh for extended reading."},
  {id:"p31",q:"Colour psychology research is useful for designers primarily because:",opts:["It gives evidence-based starting points for the emotional tone a colour is likely to communicate","It removes the need for any other design decision","It guarantees a specific sales outcome","It replaces the need for a colour wheel entirely"],ans:"It gives evidence-based starting points for the emotional tone a colour is likely to communicate",exp:"That is the core practical benefit of studying colour psychology."},
  {id:"p32",q:"What is the risk of treating colour psychology as an absolute, unbreakable rule?",opts:["Associations vary by individual, culture and context, so it should guide rather than dictate every decision","There is no risk, it is always exact","It only applies to logos, never interfaces","It cannot be applied to digital design at all"],ans:"Associations vary by individual, culture and context, so it should guide rather than dictate every decision",exp:"Colour psychology is a strong guide, not a rigid formula that overrides all judgement."},
  {id:"p33",q:"A brand's target audience skews toward a culture with different colour associations than the designer's own. What should the designer do?",opts:["Research and prioritise the target audience's cultural associations","Always use their own personal cultural associations","Ignore colour psychology entirely","Use only black and white to avoid the issue"],ans:"Research and prioritise the target audience's cultural associations",exp:"The audience's cultural context should guide the decision, not the designer's own assumptions."},
  {id:"p34",q:"Which colour is most associated with growth and environmentally-friendly messaging?",opts:["Green","Red","Black","Yellow"],ans:"Green",exp:"Green's nature and growth association makes it the default choice for eco-messaging."},
  {id:"p35",q:"Which colour is most historically associated with royalty, due to the rarity of its original dye?",opts:["Purple","Blue","Orange","Grey"],ans:"Purple",exp:"Purple dye's historic rarity and cost created its lasting royal association."},
  {id:"p36",q:"A hospital wants to feel calm and trustworthy rather than clinical and cold. Which colour family commonly supports this?",opts:["Blue and soft green tones","Bright red tones","Bright yellow tones","Pure black tones"],ans:"Blue and soft green tones",exp:"Blue and soft green both carry calm, trustworthy, healing associations suited to healthcare."},
  {id:"p37",q:"Why might overusing red across an entire interface risk making users feel anxious rather than energised?",opts:["Sustained exposure to a high-urgency colour can tip from exciting into stressful","Red always feels calming in large amounts","Users cannot perceive red for long periods","There is no risk of this happening"],ans:"Sustained exposure to a high-urgency colour can tip from exciting into stressful",exp:"A little urgency is exciting; constant urgency can become fatiguing or anxiety-inducing."},
  {id:"p38",q:"A brand wants to feel bold, exciting and youthful using colour psychology. Which colour is a common starting point?",opts:["Orange or red","Pale blue","Soft grey","Muted brown"],ans:"Orange or red",exp:"Orange and red both carry energetic, bold, youthful associations."},
  {id:"p39",q:"A brand wants to feel calm, dependable and mature using colour psychology. Which colour is a common starting point?",opts:["Blue","Bright red","Bright yellow","Hot pink"],ans:"Blue",exp:"Blue's calm, dependable association fits a mature, steady brand feeling."},
  {id:"p40",q:"What historical factor made purple dye expensive and rare before synthetic dyes existed?",opts:["It was extracted from a rare sea snail, making it costly to produce","It was the most common plant pigment available","It could only be grown in one small region briefly each year","There was no real scarcity, it is a myth"],ans:"It was extracted from a rare sea snail, making it costly to produce",exp:"Historic purple dye production was genuinely rare and labour-intensive, driving up its cost and status."},
  {id:"p41",q:"Colour psychology should generally be treated as:",opts:["A strong, evidence-based starting point, verified against the specific brand and audience","An absolute universal law with no exceptions","Irrelevant to modern digital design","A replacement for choosing a colour harmony scheme"],ans:"A strong, evidence-based starting point, verified against the specific brand and audience",exp:"It is a reliable guide to be checked against context, not blindly applied."},
  {id:"p42",q:"Which colour is often chosen for urgent call-to-action buttons because of its association with immediacy?",opts:["Red or orange","Pale blue","Soft grey","Pure white"],ans:"Red or orange",exp:"Red and orange's urgency associations make them common choices for high-priority actions."},
  {id:"p43",q:"Which colour is often chosen for a success or confirmed state in an interface?",opts:["Green","Red","Purple","Yellow"],ans:"Green",exp:"Green's positive, go-ahead association fits confirmation and success states well."},
  {id:"p44",q:"Which colour is often chosen for an error or danger state in an interface?",opts:["Red","Green","Blue","Purple"],ans:"Red",exp:"Red's danger and urgency association makes it the standard choice for error states."},
  {id:"p45",q:"Which colour is often chosen for a warning or caution state in an interface?",opts:["Yellow or amber","Blue","Purple","White"],ans:"Yellow or amber",exp:"Yellow and amber carry the classic caution association used in warning states."},
  {id:"p46",q:"A luxury skincare brand pairs deep purple with gold. Which psychological association is this leaning on?",opts:["Luxury, richness and exclusivity","Urgency and danger","Growth and nature","Playfulness for children"],ans:"Luxury, richness and exclusivity",exp:"Purple and gold together strongly reinforce a luxury, exclusive brand feeling."},
  {id:"p47",q:"What differentiates colour psychology from colour harmony?",opts:["Psychology is about the emotional meaning of a hue; harmony is about how hues relate to each other on the wheel","They are the exact same concept with different names","Harmony is about emotion, psychology is about wheel angles","Psychology only applies to logos, harmony only to posters"],ans:"Psychology is about the emotional meaning of a hue; harmony is about how hues relate to each other on the wheel",exp:"The two are separate design tools that answer different questions."},
  {id:"p48",q:"The core practical value of colour psychology for a designer is:",opts:["Choosing colour deliberately to reinforce the emotional tone a brand needs","Guaranteeing a specific financial outcome for every project","Replacing the need for typography decisions","Making every design use exactly the same colour"],ans:"Choosing colour deliberately to reinforce the emotional tone a brand needs",exp:"That is the entire practical value of understanding colour psychology."},
  {id:"p49",q:"Why is it risky to assume every audience shares the same colour associations as the designer?",opts:["Cultural and individual differences mean associations are not universal","There is no risk, associations are always identical","Only Western audiences experience colour psychology","Colour psychology does not apply to non-Western brands"],ans:"Cultural and individual differences mean associations are not universal",exp:"Assuming universality is one of the most common colour psychology mistakes."},
  {id:"p50",q:"In one sentence, colour psychology is:",opts:["The documented, though culturally variable, emotional associations each colour tends to carry","A fixed universal rule identical in every country","A replacement for choosing a colour harmony scheme","An exact science with zero exceptions"],ans:"The documented, though culturally variable, emotional associations each colour tends to carry",exp:"That is the complete summary of this lesson's core idea."},
];

const CB_TYPE="topic";
const CB_QUESTIONS=[
  {q:"Red is most associated with:",opts:["Urgency, passion and appetite","Calm and trust","Luxury and royalty","Mourning"],ans:"Urgency, passion and appetite",exp:"Red carries strong urgency and appetite associations."},
  {q:"Blue is most associated with:",opts:["Trust and calm","Urgency and danger","Playfulness","Luxury"],ans:"Trust and calm",exp:"Blue is the classic trust-and-calm colour, favoured by banks and tech companies."},
  {q:"Green is most associated with:",opts:["Growth, nature and health","Danger","Royalty","Sadness"],ans:"Growth, nature and health",exp:"Green ties strongly to nature, growth and wellbeing."},
  {q:"Yellow carries which double association?",opts:["Optimism and caution","Trust and luxury","Danger and mourning","Growth and royalty"],ans:"Optimism and caution",exp:"Yellow signals cheerful optimism while also functioning as a caution colour."},
  {q:"Purple is most associated with:",opts:["Luxury and royalty","Urgency","Growth","Trust"],ans:"Luxury and royalty",exp:"Purple's historic rarity ties it to luxury and royal status."},
  {q:"Who pioneered applied colour psychology research in the 1950s?",opts:["Faber Birren","Johannes Itten","Eva Heller","Josef Albers"],ans:"Faber Birren",exp:"Birren's research connected colour to behaviour and mood in industry."},
  {q:"Who conducted large-scale colour-emotion surveys published around 2000?",opts:["Eva Heller","Faber Birren","Robert Bringhurst","Miles Tinker"],ans:"Eva Heller",exp:"Heller's surveys documented widespread colour-emotion associations."},
  {q:"Why do sale signs commonly use red?",opts:["It creates urgency that drives quick action","It is the cheapest ink","It is legally mandatory","It has no psychological effect"],ans:"It creates urgency that drives quick action",exp:"Red's urgency association is used deliberately to speed up buying decisions."},
  {q:"Why might a wellness brand choose green?",opts:["Green is tied to nature, health and growth","Green is the cheapest colour","Green has no relevant meaning","Green is legally required for wellness brands"],ans:"Green is tied to nature, health and growth",exp:"Green's natural associations align with wellness branding goals."},
  {q:"Are colour associations identical across all cultures?",opts:["No, they vary significantly by culture and context","Yes, always identical everywhere","Yes, but only for primary colours","No, colour has no meaning in any culture"],ans:"No, they vary significantly by culture and context",exp:"Colour meaning is culturally shaped, not universally fixed."},
  {q:"In parts of Asia, white is traditionally associated with:",opts:["Mourning and funerals","Celebration","Wealth","Warning"],ans:"Mourning and funerals",exp:"This contrasts with white's purity association in Western culture."},
  {q:"In Chinese culture, red is traditionally associated with:",opts:["Luck and celebration","Mourning","Danger only","Sadness"],ans:"Luck and celebration",exp:"Red carries strong positive associations with luck in Chinese culture."},
  {q:"A financial app feels aggressive and risky. Which colour likely caused this?",opts:["Bright, saturated red","Calm blue","Soft green","White"],ans:"Bright, saturated red",exp:"Red's aggressive, urgent association can undermine trust in financial contexts."},
  {q:"Which colour is a global standard for caution and warning signage?",opts:["Yellow","Blue","Purple","White"],ans:"Yellow",exp:"Yellow paired with black is a universally recognised caution signal."},
  {q:"Why is black common in luxury fashion branding?",opts:["It is associated with sophistication and exclusivity","It is the cheapest colour to produce","It has no real association","It is legally required"],ans:"It is associated with sophistication and exclusivity",exp:"Black's elegant association supports a premium brand feeling."},
  {q:"Why is white common in minimalist tech branding?",opts:["It is associated with simplicity and cleanliness","It is the only colour screens display","It is required for accessibility","It has no real meaning"],ans:"It is associated with simplicity and cleanliness",exp:"White's clean, simple association fits minimalist design goals."},
  {q:"Which colour is commonly used for error states in interfaces?",opts:["Red","Green","Blue","Purple"],ans:"Red",exp:"Red's danger association makes it standard for error messaging."},
  {q:"Which colour is commonly used for success states in interfaces?",opts:["Green","Red","Yellow","Purple"],ans:"Green",exp:"Green's positive, go-ahead association fits confirmation states."},
  {q:"Which colour is commonly used for warning states in interfaces?",opts:["Yellow or amber","Blue","Purple","White"],ans:"Yellow or amber",exp:"Yellow and amber carry the classic caution association."},
  {q:"Why is yellow rarely used as a large background field?",opts:["It can feel harsh and hard to read at large scale","It is impossible to print","It has no association at all","It is only usable in logos"],ans:"It can feel harsh and hard to read at large scale",exp:"Yellow works best in small, deliberate doses rather than large fields."},
  {q:"A children's toy brand uses bright red, yellow and blue. This combination signals:",opts:["Playfulness and youthful energy","Luxury and sophistication","Mourning","Professional seriousness"],ans:"Playfulness and youthful energy",exp:"Bright primaries are strongly linked to playful, energetic feelings."},
  {q:"What is the main risk of treating colour psychology as an unbreakable rule?",opts:["Associations vary by culture and context, so it should guide rather than dictate","There is no risk, it is always exact","It cannot apply to digital design","It only applies to packaging"],ans:"Associations vary by culture and context, so it should guide rather than dictate",exp:"Colour psychology should inform decisions, not replace all judgement."},
  {q:"What differentiates colour psychology from colour harmony?",opts:["Psychology is about emotional meaning; harmony is about wheel relationships","They are identical concepts","Harmony is about emotion only","Psychology only applies to fonts"],ans:"Psychology is about emotional meaning; harmony is about wheel relationships",exp:"The two are separate tools answering different design questions."},
  {q:"A hospital wants to feel calm rather than clinical. Which colour family fits?",opts:["Blue and soft green","Bright red","Bright yellow","Pure black"],ans:"Blue and soft green",exp:"Both carry calm, trustworthy, healing associations suited to healthcare."},
  {q:"The core practical value of colour psychology is:",opts:["Choosing colour deliberately to reinforce a brand's emotional tone","Guaranteeing a specific sales result","Replacing typography decisions","Making every brand look the same"],ans:"Choosing colour deliberately to reinforce a brand's emotional tone",exp:"That is the entire practical value of studying colour psychology."},
];

const BRAND_BANK=[
  {name:"Coca-Cola",c1:"#F40009",c2:"#FFFFFF",hint:"A bold red used globally to feel exciting and energetic",ans:"energy",exp:"Coca-Cola's red leans on the urgency and energy association of the colour."},
  {name:"Facebook",c1:"#1877F2",c2:"#FFFFFF",hint:"A calm blue used to feel safe, trustworthy and dependable",ans:"trust",exp:"Facebook's blue leans directly on blue's trust and calm association."},
  {name:"Spotify",c1:"#1DB954",c2:"#191414",hint:"A fresh green used to feel alive, growing and natural against a dark background",ans:"nature",exp:"Spotify's green draws on green's fresh, growth-related association."},
  {name:"PayPal",c1:"#003087",c2:"#0070E0",hint:"A deep blue used across the platform to feel secure and trustworthy for handling money",ans:"trust",exp:"PayPal's blue leans on trust and security, essential for a financial product."},
  {name:"McDonald's",c1:"#DA291C",c2:"#FFC72C",hint:"Red and yellow used together to feel energetic, fast and appetite-driven",ans:"energy",exp:"McDonald's red and yellow lean on energy and appetite stimulation."},
  {name:"Starbucks",c1:"#00704A",c2:"#FFFFFF",hint:"A deep green used globally to feel natural, calm and premium",ans:"nature",exp:"Starbucks green draws on nature and calm, reinforcing a natural, premium feel."},
  {name:"Cadbury",c1:"#452169",c2:"#FFFFFF",hint:"A rich purple used consistently to feel indulgent and premium",ans:"luxury",exp:"Cadbury's purple leans on purple's luxury and indulgence association."},
  {name:"T-Mobile",c1:"#E20074",c2:"#FFFFFF",hint:"A bold magenta used to feel bold, playful and different from typical telecom branding",ans:"playful",exp:"T-Mobile's magenta breaks from typical telecom blue to feel bold and playful instead."},
  {name:"LinkedIn",c1:"#0A66C2",c2:"#FFFFFF",hint:"A professional blue used to feel credible and trustworthy for a career-focused platform",ans:"trust",exp:"LinkedIn's blue leans on trust and professionalism, fitting a career platform."},
  {name:"Airbnb",c1:"#FF5A5F",c2:"#FFFFFF",hint:"A warm coral used to feel welcoming, friendly and approachable for travellers",ans:"playful",exp:"Airbnb's coral leans on warmth and friendliness rather than strict formality."},
  {name:"Tiffany & Co.",c1:"#0ABAB5",c2:"#FFFFFF",hint:"A custom trademarked blue used to feel exclusive and premium across every product",ans:"luxury",exp:"Tiffany Blue is used specifically to reinforce an exclusive, luxury brand feeling."},
  {name:"Whole Foods",c1:"#00674B",c2:"#FFFFFF",hint:"A deep green used to feel natural, healthy and organic across all packaging",ans:"nature",exp:"Whole Foods green leans directly on nature and health associations."},
  {name:"Netflix",c1:"#E50914",c2:"#000000",hint:"A striking red against black used to feel dramatic and exciting for entertainment",ans:"energy",exp:"Netflix's red leans on excitement and drama fitting an entertainment brand."},
  {name:"American Express",c1:"#016FD0",c2:"#D4AF37",hint:"Blue paired with gold accents on premium cards to feel prestigious and trustworthy at once",ans:"luxury",exp:"The gold accents on Amex's premium cards lean specifically on the luxury association."},
  {name:"Duolingo",c1:"#58CC02",c2:"#FFFFFF",hint:"A bright, friendly green mascot and interface used to feel approachable and fun for daily learning",ans:"playful",exp:"Duolingo's green and mascot design lean on friendliness and playfulness for habit-building."},
];

const TAKEAWAY_QUOTE="Colour speaks before a single word is read - choose what it says on purpose.";
const TAKEAWAY_POINTS=[
  {t:"Match the hue to the feeling you need",b:"Every major hue carries a documented emotional lean - urgency, trust, luxury, nature, caution. Start there before picking a colour on taste alone."},
  {t:"Check the culture, not just the colour",b:"The same hue can mean opposite things in different cultures. Research your specific audience before assuming a universal meaning."},
  {t:"Use it as a guide, not a cage",b:"Colour psychology is evidence-based, not an unbreakable law - verify it against your actual brand and audience rather than applying it blindly."},
];

const SOURCES=[
  "Faber Birren - Color Psychology and Color Therapy (1950). Early applied research linking colour to mood and behaviour.",
  "Eva Heller - Psychology of Color (2000). Large-scale survey research on colour-emotion associations.",
];

export default function CT08ColourPsychology(){
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
  const[hue,setHue]=useState(0);
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

  const meaning=hueMeaning(hue);

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
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 0"}}>Every hue carries a documented emotional lean. Choose it on purpose.</p>
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
              <Tag color={T.brand}>EXPLORE - WHAT DOES IT SAY</Tag>
              <p style={{fontSize:13,color:T.muted,lineHeight:1.6,margin:"10px 0 14px"}}>Drag around the wheel and see the emotional association update live.</p>
              <input type="range" min="0" max="359" value={hue} onChange={function(e){setHue(Number(e.target.value));}} style={{width:"100%",marginBottom:14}}/>
              <div style={{height:70,borderRadius:12,background:hueToRgb(hue),border:"1px solid "+T.border,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:800,color:"#0A0A0A",background:"rgba(255,255,255,.55)",padding:"4px 12px",borderRadius:20}}>{meaning.label}</span>
              </div>
              <div style={{fontSize:12.5,color:T.muted,textAlign:"center"}}>{meaning.words}</div>
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
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.6,margin:"0 0 12px"}}>Which emotional association is this brand's core colour leaning on?</p>
                  <div style={{display:"flex",gap:10,marginBottom:8}}>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c1,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>CORE COLOUR</span></div>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c2,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid "+T.border}}><span style={{fontSize:10,color:"rgba(0,0,0,.4)"}}>SECOND COLOUR</span></div>
                  </div>
                  <p style={{fontSize:11,color:T.dim,margin:"0 0 12px"}}>Hint: {brand.hint}</p>
                  {!myRev&&(
                    <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
                      {["Trust","Energy","Luxury","Nature","Playful"].map(function(opt){
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
