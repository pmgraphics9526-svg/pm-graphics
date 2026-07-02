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

const LESSON_MODULE="COLOUR THEORY - TOPIC 04";
const LESSON_TITLE="RGB, CMYK, HEX and Pantone";
const LESSON_SUBTITLE="Pantone Matching System 1963 - W3C Web Colour Standards";

const STORY_PARA_1="In the 1850s and 60s, physicist James Clerk Maxwell proved that any colour the human eye can see could be created by mixing red, green and blue light in different intensities. That single discovery became the basis of every screen ever built since - televisions, monitors, phones. Screens do not contain paint. They contain tiny red, green and blue lights.";
const STORY_PARA_2="Printers had the opposite problem. Paper does not emit light - it reflects it. To create colour on paper, you have to subtract wavelengths using ink, not add light. The printing industry settled on cyan, magenta and yellow ink, plus a fourth ink - true black - because mixing cyan, magenta and yellow alone only ever produced a muddy brown, never a real black.";
const STORY_PARA_3="Designers still needed one more thing: a way to guarantee a brand colour looked identical whether it was printed by a factory in Vietnam or a print shop in Delhi. In 1963, Pantone standardised a numbered library of physical colour swatches to solve exactly that. Around the same time, the early web added HEX - a simple six-character code - as a shorthand for writing RGB values directly into code.";
const STORY_PROBLEM="You picked a colour on your screen, sent the file to a printer, and it came back looking dull and wrong - nothing like what you designed. That gap between what a screen shows and what a printer produces is exactly the problem RGB, CMYK, HEX and Pantone exist to solve.";
const STORY_5Q=[
  {q:"What is it?",a:"Four systems for defining the same colour: RGB and HEX for screens, CMYK for print, Pantone for guaranteed exact matching anywhere."},
  {q:"Why does it exist?",a:"Screens emit light, paper reflects ink, and different factories need to reproduce the exact same brand colour - each of those needs its own system."},
  {q:"How does it work?",a:"RGB adds red, green and blue light. CMYK subtracts cyan, magenta, yellow and black ink from white paper. HEX is RGB written as a six-character code. Pantone assigns one fixed number to one exact physical colour."},
  {q:"How will you use it?",a:"RGB and HEX for anything on screen. CMYK for anything printed. Pantone when a brand colour must match exactly across many different vendors or materials."},
  {q:"What if you skip it?",a:"You send a screen colour straight to a printer with no conversion, and the result comes back duller, shifted, and off-brand."},
];

const CONCEPT_SECTIONS=[
  {tag:"RGB",tagColor:T.brand,formula:"Red + Green + Blue - Light",desc:"An additive, light-based model used for anything seen on a screen - websites, apps, video. Each channel runs 0 to 255. Mixing all three channels at full strength makes white light.",rule:"Use RGB for anything that will only ever be seen on a screen - never for anything going to a printing press."},
  {tag:"CMYK",tagColor:"#3EC6E0",formula:"Cyan + Magenta + Yellow + Key(Black) - Ink",desc:"A subtractive, ink-based model used for anything physically printed. Each channel runs 0 to 100 percent. Black (K) is added separately because cyan, magenta and yellow ink alone only ever make a muddy brown, never a true black.",rule:"Always convert to CMYK before sending a design to a printing press - skipping this is the most common reason printed colours look wrong."},
  {tag:"HEX",tagColor:"#B08CFF",formula:"#RRGGBB",desc:"A six-character shorthand for an RGB value, written in hexadecimal (0 to 9, then A to F). It is exactly the same colour as its RGB equivalent, just written for code.",rule:"HEX is not a separate colour system. #FF7A00 and rgb(255,122,0) are the identical colour, only written differently."},
  {tag:"PANTONE",tagColor:T.green,formula:"PMS [Number]",desc:"A physical library of numbered, pre-mixed colour swatches, built so one brand colour reproduces identically across different printers, factories, fabrics and materials anywhere in the world.",rule:"Reach for Pantone only when a colour must match exactly across many different vendors - not for anything that stays purely on screen."},
];

function rgbToHex(r,g,b){
  const toHex=function(n){return n.toString(16).padStart(2,"0").toUpperCase();};
  return "#"+toHex(r)+toHex(g)+toHex(b);
}
function rgbToCmyk(r,g,b){
  const rf=r/255,gf=g/255,bf=b/255;
  const k=1-Math.max(rf,gf,bf);
  const denom=1-k;
  const c=denom===0?0:(1-rf-k)/denom;
  const m=denom===0?0:(1-gf-k)/denom;
  const y=denom===0?0:(1-bf-k)/denom;
  return {c:Math.round(c*100),m:Math.round(m*100),y:Math.round(y*100),k:Math.round(k*100)};
}

const QUESTION_BANK=[
  {id:"c1",q:"What does RGB stand for?",opts:["Red Green Blue","Right Grey Black","Rich Grey Blend","Red Grey Beige"],ans:"Red Green Blue",exp:"RGB is the additive light model used for screens."},
  {id:"c2",q:"What does CMYK stand for?",opts:["Cyan Magenta Yellow Key","Colour Mix Yield Key","Cyan Maroon Yellow Khaki","Clear Magenta Yellow Kelvin"],ans:"Cyan Magenta Yellow Key",exp:"CMYK is the subtractive ink model used for print, where Key means black."},
  {id:"c3",q:"RGB is primarily used for:",opts:["Screens and digital displays","Printed packaging","Fabric dyeing","Paint mixing"],ans:"Screens and digital displays",exp:"RGB is built for light-emitting screens, not physical print."},
  {id:"c4",q:"CMYK is primarily used for:",opts:["Printed material","Websites","Mobile app icons","Video playback"],ans:"Printed material",exp:"CMYK is the standard model for physical printing presses."},
  {id:"c5",q:"RGB is what type of colour model?",opts:["Additive","Subtractive","Numbered","Physical"],ans:"Additive",exp:"RGB adds light together to create colour."},
  {id:"c6",q:"CMYK is what type of colour model?",opts:["Subtractive","Additive","Numbered","Digital-only"],ans:"Subtractive",exp:"CMYK subtracts light by absorbing wavelengths with ink."},
  {id:"c7",q:"In RGB, mixing full red, green and blue light produces:",opts:["White","Black","Grey","Yellow"],ans:"White",exp:"Adding all three light channels at full strength produces white light."},
  {id:"c8",q:"In CMYK, using no ink at all on white paper produces:",opts:["White (blank paper)","Black","Grey","Cyan"],ans:"White (blank paper)",exp:"With no ink applied, the paper's own white shows through."},
  {id:"c9",q:"A HEX code always starts with which symbol?",opts:["#","%","&","@"],ans:"#",exp:"HEX codes are always written with a leading hash symbol."},
  {id:"c10",q:"How many characters follow the # in a standard HEX code?",opts:["6","4","8","3"],ans:"6",exp:"A standard HEX code has six characters: two each for red, green and blue."},
  {id:"c11",q:"HEX code #FFFFFF represents which colour?",opts:["White","Black","Red","Grey"],ans:"White",exp:"FF is the maximum value in hex, so all three channels at max makes white."},
  {id:"c12",q:"HEX code #000000 represents which colour?",opts:["Black","White","Blue","Green"],ans:"Black",exp:"00 is the minimum value in hex, so all three channels at zero makes black."},
  {id:"c13",q:"HEX is essentially a shorthand for:",opts:["RGB values written in hexadecimal","A separate colour model unrelated to RGB","Pantone numbers","CMYK percentages"],ans:"RGB values written in hexadecimal",exp:"HEX and RGB describe the exact same colour, just in different notations."},
  {id:"c14",q:"What does the K stand for in CMYK?",opts:["Key (black)","Kelvin","Khaki","Keystone"],ans:"Key (black)",exp:"K refers to the key plate, historically the black printing plate."},
  {id:"c15",q:"Why is black (K) added separately in CMYK instead of just mixing C, M and Y?",opts:["Mixing cyan, magenta and yellow ink alone only produces a muddy brown, not true black","Black ink is cheaper than coloured ink","Printers cannot mix three inks at once","Black is not actually needed in CMYK"],ans:"Mixing cyan, magenta and yellow ink alone only produces a muddy brown, not true black",exp:"A dedicated black ink gives cleaner, truer blacks and sharper text."},
  {id:"c16",q:"What company created the standardised colour matching system called Pantone?",opts:["Pantone","Adobe","W3C","IBM"],ans:"Pantone",exp:"The Pantone Matching System is the company's own standardised colour library."},
  {id:"c17",q:"Roughly when was the Pantone Matching System introduced?",opts:["1963","1901","1995","2010"],ans:"1963",exp:"Pantone introduced its standardised matching system in 1963."},
  {id:"c18",q:"What is the main purpose of the Pantone system?",opts:["To guarantee a colour reproduces identically across different printers, materials and manufacturers","To make colours brighter on screen","To replace RGB entirely","To generate random colour palettes"],ans:"To guarantee a colour reproduces identically across different printers, materials and manufacturers",exp:"Pantone exists purely to solve exact colour matching across different production sources."},
  {id:"c19",q:"A packaging designer needs a brand colour to match exactly across ten factories worldwide. Which system solves this?",opts:["Pantone","RGB","HEX","None of these can help"],ans:"Pantone",exp:"Pantone numbers are built specifically to guarantee this kind of cross-vendor matching."},
  {id:"c20",q:"Which colour model would a front-end developer typically write directly into CSS code?",opts:["HEX","CMYK","Pantone","None, code cannot hold colour"],ans:"HEX",exp:"HEX is the standard way to specify exact colours in web code."},
  {id:"c21",q:"Which colour model does a magazine's printing press use to physically reproduce a page?",opts:["CMYK","RGB","HEX","Pantone only, always"],ans:"CMYK",exp:"Standard print production runs on CMYK ink separations."},
  {id:"c22",q:"A designer picks a bright colour in RGB, then sends the file straight to a printer with no conversion. What usually happens?",opts:["The printed colour looks duller or different than what was seen on screen","The colour prints identically every time","The printer automatically fixes it perfectly","Nothing changes at all"],ans:"The printed colour looks duller or different than what was seen on screen",exp:"Without proper CMYK conversion, colours commonly shift once printed."},
  {id:"c23",q:"Why can some vivid RGB colours not be perfectly reproduced in CMYK?",opts:["Ink pigment cannot reproduce the same colour range that emitted light can","CMYK actually has a wider range than RGB","RGB and CMYK are exactly identical in range","Printers refuse to print bright colours"],ans:"Ink pigment cannot reproduce the same colour range that emitted light can",exp:"CMYK has a smaller colour gamut than RGB, so some screen colours cannot be matched exactly in print."},
  {id:"c24",q:"In an RGB value written as (255,0,0), what colour does this represent?",opts:["Pure red","Pure blue","Pure green","Black"],ans:"Pure red",exp:"Full red channel with zero green and blue gives pure red."},
  {id:"c25",q:"In a HEX value written as #FF0000, what colour does this represent?",opts:["Pure red","Pure green","Pure blue","White"],ans:"Pure red",exp:"FF in the red position with 00 in green and blue gives pure red - the same colour as RGB (255,0,0)."},
  {id:"c26",q:"What is the RGB range for each channel (Red, Green, Blue)?",opts:["0 to 255","0 to 100","0 to 999","1 to 16"],ans:"0 to 255",exp:"Each RGB channel is measured from 0 to 255."},
  {id:"c27",q:"What is the typical CMYK range for each channel?",opts:["0 to 100 percent","0 to 255","0 to 16","1 to 10"],ans:"0 to 100 percent",exp:"CMYK channels are measured as percentages from 0 to 100."},
  {id:"c28",q:"A brand's logo must appear identically on a coffee cup, a delivery truck and a store sign made by three different manufacturers. Which system solves this?",opts:["Pantone","RGB","HEX","CMYK alone"],ans:"Pantone",exp:"Only Pantone guarantees exact matching across unrelated manufacturers and materials."},
  {id:"c29",q:"A HEX code and its equivalent RGB value represent:",opts:["Exactly the same colour, just written differently","Two different colours","A colour only visible in print","A Pantone-only colour"],ans:"Exactly the same colour, just written differently",exp:"HEX is simply RGB rewritten in hexadecimal notation."},
  {id:"c30",q:"Which of these four systems is primarily about matching a physical swatch rather than defining colour numerically?",opts:["Pantone","RGB","HEX","CMYK"],ans:"Pantone",exp:"Pantone is built around a physical library of swatches, not a numeric formula."},
  {id:"c31",q:"A website's background colour is written in code as #161616. What system is this using?",opts:["HEX, which maps directly to RGB","CMYK","Pantone","None of these"],ans:"HEX, which maps directly to RGB",exp:"Any #RRGGBB code is a HEX value, directly equivalent to an RGB value."},
  {id:"c32",q:"Which colour model is based on light being emitted directly toward your eyes?",opts:["RGB","CMYK","Pantone","None of these"],ans:"RGB",exp:"Screens emit red, green and blue light directly - that is the RGB model."},
  {id:"c33",q:"Which colour model is based on light bouncing off a printed surface after ink absorbs part of it?",opts:["CMYK","RGB","HEX","Pantone"],ans:"CMYK",exp:"Printed colour works by ink absorbing certain wavelengths and reflecting the rest."},
  {id:"c34",q:"If you increase all three RGB channels equally toward 255, the colour:",opts:["Gets lighter, moving toward white","Gets darker, moving toward black","Stays exactly the same","Turns into a Pantone colour"],ans:"Gets lighter, moving toward white",exp:"More light in every channel pushes the colour toward white."},
  {id:"c35",q:"If you increase all four CMYK channels equally toward 100 percent, the colour:",opts:["Gets darker, moving toward black","Gets lighter, moving toward white","Stays exactly the same","Turns transparent"],ans:"Gets darker, moving toward black",exp:"More ink coverage absorbs more light, pushing the colour toward black."},
  {id:"c36",q:"What is the main risk of skipping CMYK conversion before sending a design to print?",opts:["Colours can shift or look duller once printed","The file will not open at all","The printer will reject the job automatically","Nothing, RGB always prints identically"],ans:"Colours can shift or look duller once printed",exp:"Print vendors expect CMYK values - skipping conversion risks unexpected colour shifts."},
  {id:"c37",q:"What is the main risk of only ever using Pantone names without knowing their RGB or HEX equivalents?",opts:["The brand colour will not translate correctly to screens or websites","Nothing, Pantone works everywhere automatically","Pantone colours cannot be used in branding","Print jobs will fail"],ans:"The brand colour will not translate correctly to screens or websites",exp:"Pantone is a physical matching system - digital use still needs a proper RGB or HEX equivalent."},
  {id:"c38",q:"A single Pantone colour is identified by:",opts:["A unique number in the Pantone library","A random hex string","A CMYK percentage only","A screen brightness setting"],ans:"A unique number in the Pantone library",exp:"Each Pantone swatch has one fixed, unique reference number."},
  {id:"c39",q:"Which system would you never write directly into a website's CSS code?",opts:["Pantone","HEX","RGB","Both HEX and RGB work in CSS"],ans:"Pantone",exp:"Pantone numbers reference physical swatches, not something a browser can render directly."},
  {id:"c40",q:"A phone app icon that will only ever be seen on screens should be designed and exported using:",opts:["RGB or HEX","CMYK","Pantone","Grayscale only"],ans:"RGB or HEX",exp:"Anything screen-only belongs in the RGB or HEX system."},
  {id:"c41",q:"A trade show banner that will be physically printed should be exported using:",opts:["CMYK","RGB","HEX only","Pantone is always mandatory, never CMYK"],ans:"CMYK",exp:"Physical print production is built around CMYK ink separations."},
  {id:"c42",q:"Which colour system uses letters A through F in addition to numbers?",opts:["HEX","RGB","CMYK","Pantone"],ans:"HEX",exp:"Hexadecimal notation uses 0 to 9 and then A to F to represent values."},
  {id:"c43",q:"What number base does HEX colour notation use?",opts:["Base 16 (hexadecimal)","Base 10 (decimal)","Base 2 (binary)","Base 8 (octal)"],ans:"Base 16 (hexadecimal)",exp:"HEX is short for hexadecimal, a base-16 numbering system."},
  {id:"c44",q:"Why do professional brand guidelines usually list a colour in RGB, HEX, CMYK and Pantone together?",opts:["Each format is needed for a different medium - screen, code, print and exact physical matching","It is required by law","Only one of the four actually works","To make the document look longer"],ans:"Each format is needed for a different medium - screen, code, print and exact physical matching",exp:"Listing all four lets any team - web, print, manufacturing - use the correct format for their medium."},
  {id:"c45",q:"A bright neon green in RGB is converted to CMYK for printing, and the printed result looks flatter. Why?",opts:["CMYK ink cannot reproduce the same vivid range that RGB light can","CMYK always looks brighter than RGB","The printer made a random error","Neon colours cannot exist in RGB either"],ans:"CMYK ink cannot reproduce the same vivid range that RGB light can",exp:"Some RGB colours fall outside what CMYK ink can physically reproduce."},
  {id:"c46",q:"Beyond print and packaging, Pantone colours are also commonly used in:",opts:["Fashion, plastics and paint manufacturing","Only web design","Only mobile app design","Only video editing"],ans:"Fashion, plastics and paint manufacturing",exp:"Pantone matching extends well beyond paper printing into many physical industries."},
  {id:"c47",q:"What is the purpose of giving a colour a Pantone number instead of just calling it blue?",opts:["A name like blue is subjective, but a Pantone number refers to one exact, standardised colour","Numbers are required for legal reasons only","Blue cannot be printed without a number","Pantone numbers replace RGB entirely"],ans:"A name like blue is subjective, but a Pantone number refers to one exact, standardised colour",exp:"Pantone numbers remove ambiguity - everyone reproducing that number gets the identical colour."},
  {id:"c48",q:"Which format would you send to a professional printing press for a business card?",opts:["CMYK","RGB","HEX only","JPEG colour space is irrelevant"],ans:"CMYK",exp:"Print production expects CMYK-ready files."},
  {id:"c49",q:"Which format would a front-end developer use to set a website button's colour?",opts:["HEX","CMYK","Pantone","None, browsers cannot render colour"],ans:"HEX",exp:"HEX (or RGB) is the standard way colours are set in web code."},
  {id:"c50",q:"The single biggest reason four different colour systems exist is:",opts:["Screens, print, code and physical manufacturing each reproduce colour differently, so each needs its own accurate system","Designers like having more choices","Only Pantone is actually necessary","HEX replaced the need for the other three"],ans:"Screens, print, code and physical manufacturing each reproduce colour differently, so each needs its own accurate system",exp:"Each medium physically produces colour in a different way, so each needs a matching system to stay accurate."},
];

const CB_TYPE="topic";
const CB_QUESTIONS=[
  {q:"Which colour model is additive, light-based?",opts:["RGB","CMYK","Pantone","None of these"],ans:"RGB",exp:"RGB adds red, green and blue light together."},
  {q:"Which colour model is subtractive, ink-based?",opts:["CMYK","RGB","HEX","Pantone"],ans:"CMYK",exp:"CMYK subtracts light by absorbing wavelengths with ink."},
  {q:"Which format is written as a hash followed by six characters?",opts:["HEX","RGB","CMYK","Pantone"],ans:"HEX",exp:"HEX codes are always in the format #RRGGBB."},
  {q:"Which system assigns a fixed reference number to one exact physical colour?",opts:["Pantone","RGB","HEX","CMYK"],ans:"Pantone",exp:"Pantone numbers reference exact, standardised physical swatches."},
  {q:"Full white in RGB is written as:",opts:["(255,255,255)","(0,0,0)","(100,100,100)","(255,0,0)"],ans:"(255,255,255)",exp:"All three channels at maximum strength produce white light."},
  {q:"Full black in RGB is written as:",opts:["(0,0,0)","(255,255,255)","(0,0,255)","(100,100,100)"],ans:"(0,0,0)",exp:"All three channels at zero produce no light at all - black."},
  {q:"Which system would you use for a company's app icon?",opts:["RGB or HEX","CMYK","Pantone","None, icons need no colour system"],ans:"RGB or HEX",exp:"App icons only ever appear on screens, so RGB or HEX is correct."},
  {q:"Which system would you use for a company's printed packaging box?",opts:["CMYK","RGB","HEX only","Neither"],ans:"CMYK",exp:"Physical packaging is produced using CMYK ink."},
  {q:"Ten vendors in different countries must produce the exact same brand colour. Which system solves this?",opts:["Pantone","RGB","HEX","CMYK alone"],ans:"Pantone",exp:"Pantone exists specifically to guarantee cross-vendor exact matching."},
  {q:"HEX colour codes are a shorthand written in which numeral system?",opts:["Hexadecimal (base 16)","Decimal (base 10)","Binary (base 2)","Roman numerals"],ans:"Hexadecimal (base 16)",exp:"HEX literally means hexadecimal, using 0-9 and A-F."},
  {q:"Why does CMYK include black (K) separately from cyan, magenta and yellow?",opts:["Because C+M+Y alone only produce a muddy brown, not true black","Because black ink is unnecessary","Because printers cannot use four inks","Because K stands for a colour, not black"],ans:"Because C+M+Y alone only produce a muddy brown, not true black",exp:"A dedicated black ink is needed for clean blacks and sharp text."},
  {q:"A designer exports a logo in RGB and hands it to a print vendor. What should happen first?",opts:["Convert it to CMYK before sending","Send it exactly as is, no changes needed","Convert it to Pantone only","Nothing, RGB prints perfectly every time"],ans:"Convert it to CMYK before sending",exp:"Print vendors work in CMYK - sending unconverted RGB risks colour shifts."},
  {q:"What does the C in CMYK stand for?",opts:["Cyan","Colour","Chroma","Contrast"],ans:"Cyan",exp:"C is the cyan ink channel in the CMYK model."},
  {q:"What does the M in CMYK stand for?",opts:["Magenta","Maroon","Mixed","Medium"],ans:"Magenta",exp:"M is the magenta ink channel in the CMYK model."},
  {q:"What does the Y in CMYK stand for?",opts:["Yellow","Yield","Your brand colour","Youthful tone"],ans:"Yellow",exp:"Y is the yellow ink channel in the CMYK model."},
  {q:"A colour looks vivid on screen but flat once printed. It has likely gone outside which gamut?",opts:["CMYK gamut","RGB gamut","Pantone gamut","HEX gamut"],ans:"CMYK gamut",exp:"CMYK ink cannot reproduce every colour that RGB light can display."},
  {q:"Pantone is best described as a system for:",opts:["Exact colour matching across materials and manufacturers","Making colours brighter on screen","Replacing RGB entirely","Random palette generation"],ans:"Exact colour matching across materials and manufacturers",exp:"Pantone's entire purpose is guaranteed, exact colour reproduction."},
  {q:"HEX and RGB values for the same colour are:",opts:["Identical, just written differently","Always slightly different colours","Only related in print, not on screen","Unrelated systems"],ans:"Identical, just written differently",exp:"HEX is simply RGB rewritten in hexadecimal form."},
  {q:"A front-end developer styling a website button will most likely use:",opts:["HEX","CMYK","Pantone","None of these apply to code"],ans:"HEX",exp:"HEX is the standard way to define exact colours in web code."},
  {q:"A print shop preparing a poster for the press will most likely use:",opts:["CMYK","RGB","HEX","Pantone is the only option ever"],ans:"CMYK",exp:"Standard print production runs on the CMYK ink model."},
  {q:"A swatch book used by fashion, paint and plastic manufacturers to match one exact colour is a:",opts:["Pantone book","RGB chart","HEX palette","CMYK sheet"],ans:"Pantone book",exp:"Pantone swatch books are used across many physical manufacturing industries."},
  {q:"If RGB values increase toward (255,255,255), the colour becomes:",opts:["Lighter, toward white","Darker, toward black","Unchanged","More saturated only"],ans:"Lighter, toward white",exp:"Higher RGB values add more light, moving the colour toward white."},
  {q:"If CMYK values increase toward 100 percent on all channels, the colour becomes:",opts:["Darker, toward black","Lighter, toward white","Unchanged","More transparent"],ans:"Darker, toward black",exp:"More ink coverage absorbs more light, darkening the result."},
  {q:"The primary reason RGB and CMYK produce different-looking results for the same design is:",opts:["One is made of emitted light, the other of light-absorbing ink","They are actually identical systems","RGB is only for print","CMYK is only for screens"],ans:"One is made of emitted light, the other of light-absorbing ink",exp:"Light and ink behave fundamentally differently, which is why conversion between them is needed."},
  {q:"Why might a brand list four different colour codes (RGB, HEX, CMYK, Pantone) for the same brand colour?",opts:["Because each is needed for a different medium - screen, code, print and exact physical matching","Because designers cannot agree on one system","Because only one of the four actually works","To make the brand guide look more complete"],ans:"Because each is needed for a different medium - screen, code, print and exact physical matching",exp:"Listing all four ensures every team uses the version correct for their medium."},
];

const BRAND_BANK=[
  {name:"Tiffany & Co.",c1:"#0ABAB5",c2:"#FFFFFF",hint:"A custom robin-egg blue trademarked and matched precisely across every box, bag and storefront worldwide, regardless of who manufactures them",ans:"pantone",exp:"Tiffany Blue is a custom Pantone colour, licensed and matched so it looks identical on every material Tiffany uses anywhere in the world."},
  {name:"T-Mobile",c1:"#E20074",c2:"#FFFFFF",hint:"A bright magenta trademarked by the company and matched precisely across every store, uniform and piece of signage worldwide",ans:"pantone",exp:"T-Mobile's magenta is matched to a specific Pantone reference, which is central to how the company protects and reproduces the colour globally."},
  {name:"Cadbury",c1:"#452169",c2:"#FFFFFF",hint:"A deep purple famously trademarked in several countries and matched precisely across all chocolate packaging worldwide",ans:"pantone",exp:"Cadbury's purple is tied to a specific Pantone reference, part of a well-known trademark dispute over the exact shade."},
  {name:"UPS",c1:"#351C15",c2:"#FFCC00",hint:"A deep brown nicknamed Pullman Brown, matched precisely across every delivery truck and uniform worldwide",ans:"pantone",exp:"UPS brown is a Pantone-matched colour, chosen specifically so it looks identical on every truck regardless of manufacturer."},
  {name:"Home Depot",c1:"#F96302",c2:"#FFFFFF",hint:"A bright orange matched precisely across every store sign, apron and truck in every country the company operates in",ans:"pantone",exp:"Home Depot's orange is Pantone-matched to guarantee identical signage across thousands of independently built stores."},
  {name:"McDonald's",c1:"#FFC72C",c2:"#DA291C",hint:"A red and yellow combination matched precisely at every restaurant worldwide, regardless of local printer or sign manufacturer",ans:"pantone",exp:"McDonald's red and yellow are Pantone-matched globally so every restaurant looks identical no matter who built the signage."},
  {name:"Coca-Cola",c1:"#F40009",c2:"#FFFFFF",hint:"A red matched precisely across cans, trucks and billboards produced by completely different manufacturers around the world",ans:"pantone",exp:"Coca-Cola's red relies on Pantone matching to stay visually identical across every material and country it appears in."},
  {name:"Spotify",c1:"#1DB954",c2:"#191414",hint:"A green defined directly as a six-character code and used throughout the company's website and app source code",ans:"hex",exp:"Spotify's green is used as a HEX value directly inside CSS and app code - the exact same colour, written for developers."},
  {name:"Slack",c1:"#4A154B",c2:"#FFFFFF",hint:"An aubergine purple defined directly as a six-character code and used throughout the company's web app interface",ans:"hex",exp:"Slack's purple exists in its design system as a HEX value, used directly in the web app's styling."},
  {name:"Netflix",c1:"#E50914",c2:"#000000",hint:"A red defined directly as a six-character code and used throughout the company's website styling",ans:"hex",exp:"Netflix's red is a HEX value used directly in the site's CSS, identical in meaning to its RGB equivalent."},
  {name:"Duolingo",c1:"#58CC02",c2:"#FFFFFF",hint:"A green app icon that only ever needs to display correctly on phone screens and app store listings, never in print",ans:"rgb",exp:"Because the icon only exists on screens, it is built and exported entirely in the RGB colour space."},
  {name:"Instagram",c1:"#E1306C",c2:"#F77737",hint:"A gradient app icon that only ever needs to render correctly on phone and tablet screens, never physically printed",ans:"rgb",exp:"Instagram's icon gradient is defined and rendered entirely in RGB, since it is a screen-only asset."},
  {name:"A cereal brand's packaging",c1:"#FFC72C",c2:"#E4002B",hint:"A breakfast cereal box design approved on screen, then sent to a factory press to be physically printed onto thousands of boxes",ans:"cmyk",exp:"Any design going onto a physically printed box must be converted to CMYK before it reaches the printing press."},
  {name:"A festival poster print run",c1:"#7B2CBF",c2:"#F9C80E",hint:"A music festival poster designed on a laptop screen, then printed by the thousands for walls and lamp posts across the city",ans:"cmyk",exp:"Large physical print runs like posters are produced using CMYK ink separations, not the RGB values used to design them."},
  {name:"IKEA",c1:"#0058A3",c2:"#FFDA1A",hint:"A blue and yellow combination matched precisely across every store sign, catalogue print and product tag in every country",ans:"pantone",exp:"IKEA's blue and yellow are Pantone-matched to stay consistent across stores, catalogues and packaging worldwide."},
];

const TAKEAWAY_QUOTE="Screens emit light, paper absorbs ink, code needs text, and brands need exactness - four mediums, four colour systems.";
const TAKEAWAY_POINTS=[
  {t:"Match the system to the medium",b:"RGB and HEX for anything on a screen. CMYK for anything printed. Pantone for anything that must match exactly across many different vendors."},
  {t:"Always convert before you print",b:"Never send a raw RGB or HEX file straight to a printing press - convert to CMYK first, or the colours will shift."},
  {t:"Keep every version of your brand colour on hand",b:"A real brand guide lists the RGB, HEX, CMYK and Pantone value for every colour, so any team can grab the correct one instantly."},
];

const SOURCES=[
  "Pantone LLC - Pantone Matching System (1963). Standardised numbered colour library for exact cross-material matching.",
  "W3C - Web Colour Standards. Defines HEX and RGB colour specification for the web.",
];

export default function CT04RgbCmykHexPantone(){
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
  const[rr,setRr]=useState(255);
  const[gg,setGg]=useState(122);
  const[bb,setBb]=useState(0);
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

  const hexVal=rgbToHex(rr,gg,bb);
  const cmykVal=rgbToCmyk(rr,gg,bb);

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
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 0"}}>Four systems. One goal: the same colour, everywhere it needs to appear.</p>
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
              <Tag color={T.brand}>EXPLORE - ONE COLOUR, FOUR SYSTEMS</Tag>
              <p style={{fontSize:13,color:T.muted,lineHeight:1.6,margin:"10px 0 14px"}}>Drag the sliders and watch the same colour written in RGB, HEX and CMYK at once.</p>
              {[
                {label:"Red",val:rr,set:setRr},
                {label:"Green",val:gg,set:setGg},
                {label:"Blue",val:bb,set:setBb},
              ].map(function(row){
                return(
                  <div key={row.label} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:12,color:T.muted}}>{row.label}</span>
                      <span style={{fontSize:12,color:T.brand,fontWeight:700}}>{row.val}</span>
                    </div>
                    <input type="range" min="0" max="255" value={row.val} onChange={function(e){row.set(Number(e.target.value));}} style={{width:"100%"}}/>
                  </div>
                );
              })}
              <div style={{height:64,borderRadius:10,background:"rgb("+rr+","+gg+","+bb+")",border:"1px solid "+T.border,marginBottom:14}}/>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <div style={{background:T.panel,borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:T.dim}}>RGB</span><span style={{fontSize:12.5,color:T.white,fontFamily:"monospace"}}>{"rgb("+rr+", "+gg+", "+bb+")"}</span></div>
                <div style={{background:T.panel,borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:T.dim}}>HEX</span><span style={{fontSize:12.5,color:T.white,fontFamily:"monospace"}}>{hexVal}</span></div>
                <div style={{background:T.panel,borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:T.dim}}>CMYK</span><span style={{fontSize:12.5,color:T.white,fontFamily:"monospace"}}>{cmykVal.c+"% "+cmykVal.m+"% "+cmykVal.y+"% "+cmykVal.k+"%"}</span></div>
                <div style={{background:T.panel,borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:T.dim}}>PANTONE</span><span style={{fontSize:11.5,color:T.dim}}>Needs a physical swatch book - cannot be calculated</span></div>
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
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.6,margin:"0 0 12px"}}>Which colour system is most responsible for how this brand keeps this colour consistent?</p>
                  <div style={{display:"flex",gap:10,marginBottom:8}}>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c1,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>COLOUR 1</span></div>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c2,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid "+T.border}}><span style={{fontSize:10,color:"rgba(0,0,0,.4)"}}>COLOUR 2</span></div>
                  </div>
                  <p style={{fontSize:11,color:T.dim,margin:"0 0 12px"}}>Hint: {brand.hint}</p>
                  {!myRev&&(
                    <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
                      {["RGB","CMYK","HEX","Pantone"].map(function(opt){
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
                      <div style={{fontWeight:700,color:isCorrect?T.green:T.red,marginBottom:6}}>{isCorrect?"Correct! +5 pts":"Wrong - 0 pts. Answer: "+brand.ans.toUpperCase()}</div>
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
