import{useState,useRef,useMemo}from"react";

const T={bg:"#FFFCF9",panel:"#FFFFFF",panel2:"#FFFFFF",border:"#FFE6D4",text:"#1B1410",muted:"#5B4E46",dim:"#5B4E46",brand:"#FF6E2E",white:"#1B1410",green:"#2DC653",red:"#B7360E"};

function hslToHex(h,s,l){
  h/=360;s/=100;l/=100;
  const f=(n)=>{const k=(n+h*12)%12;const a=s*Math.min(l,1-l);return l-a*Math.max(-1,Math.min(k-3,9-k,1));};
  const toHex=(x)=>Math.round(x*255).toString(16).padStart(2,"0");
  return "#"+toHex(f(0))+toHex(f(8))+toHex(f(4));
}

function Card({children,style={}}){
  return <div style={{background:T.panel2,borderTop:"1px solid "+T.border,borderRight:"1px solid "+T.border,borderBottom:"1px solid "+T.border,borderLeft:"1px solid "+T.border,borderRadius:16,padding:22,boxShadow:"0 16px 34px -12px rgba(27,20,16,.08)",...style}}>{children}</div>;
}
function Tag({children,color}){
  return <span style={{fontSize:11,letterSpacing:3,color:color||T.brand,fontWeight:700}}>{children}</span>;
}
function Nav({onBack,onNext,nextLabel,nextDisabled}){
  return(
    <div style={{display:"flex",gap:16,marginTop:40,borderTop:"1px solid #FFE6D4",paddingTop:24}}>
      {onBack&&<button onClick={onBack} style={{flex:1,padding:"14px",fontSize:"16px",fontWeight:600,background:"transparent",color:"#1B1410",border:"1.5px solid #1B1410",borderRadius:"999px",cursor:"pointer"}}>Back</button>}
      <button onClick={nextDisabled?undefined:onNext} style={{flex:2,padding:"14px",fontSize:"16px",fontWeight:700,background:nextDisabled?"#FFE6D4":"#FF6E2E",color:nextDisabled?"#5B4E46":"#FFFFFF",border:"none",borderRadius:"999px",boxShadow:nextDisabled?"none":"0 10px 24px -8px rgba(232,90,27,.65)",opacity:nextDisabled?0.5:1,cursor:nextDisabled?"not-allowed":"pointer"}}>{nextLabel||"Continue"}</button>
    </div>
  );
}

const STEPS=[{n:1,label:"Story"},{n:2,label:"Concept"},{n:3,label:"Play"},{n:4,label:"Challenge"},{n:5,label:"Takeaway"}];
function StepBar({step,setStep}){
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:48,position:"relative",maxWidth:"500px",margin:"0 auto 48px"}}>
      <div style={{position:"absolute",top:"11px",left:0,right:0,height:2,background:"#FFE6D4",zIndex:0}}/>
      {STEPS.map(function(s,i){
        const isPast=step>s.n;
        const isCurrent=step===s.n;
        return(
          <div key={s.n} style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
            <button onClick={()=>{if(s.n<=step)setStep(s.n);}} style={{width:24,height:24,borderRadius:"50%",background:isPast||isCurrent?"#FF6E2E":"#FFFFFF",border:isPast||isCurrent?"2px solid #FF6E2E":"2px solid #FFE6D4",display:"flex",alignItems:"center",justifyContent:"center",cursor:s.n<=step?"pointer":"default",padding:0,color:isPast||isCurrent?"#FFFFFF":"#5B4E46",fontSize:10,fontWeight:700,outline:"none",transition:"all 0.3s"}}>
              {isPast?"\u2713":s.n}
            </button>
            <span style={{fontSize:11,fontWeight:600,color:isCurrent?"#1B1410":"#5B4E46",textTransform:"uppercase",letterSpacing:1}}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

const SLICES=12;
const SNAMES=["Red","Red-Orange","Orange","Yellow-Orange","Yellow","Yellow-Green","Green","Blue-Green","Blue","Blue-Violet","Violet","Red-Violet"];
const STYPES={0:"Primary",4:"Primary",8:"Primary",2:"Secondary",6:"Secondary",10:"Secondary"};
function sliceColor(i){return hslToHex((i/SLICES)*360,82,52);}
function slicePath(i,cx,cy,r,inner){
  const a1=(i/SLICES)*2*Math.PI-Math.PI/2;
  const a2=((i+1)/SLICES)*2*Math.PI-Math.PI/2;
  const x1=cx+inner*Math.cos(a1),y1=cy+inner*Math.sin(a1);
  const x2=cx+r*Math.cos(a1),y2=cy+r*Math.sin(a1);
  const x3=cx+r*Math.cos(a2),y3=cy+r*Math.sin(a2);
  const x4=cx+inner*Math.cos(a2),y4=cy+inner*Math.sin(a2);
  return "M"+x1+","+y1+" L"+x2+","+y2+" A"+r+","+r+" 0 0,1 "+x3+","+y3+" L"+x4+","+y4+" A"+inner+","+inner+" 0 0,0 "+x1+","+y1+"Z";
}
function ColourWheel({selected,onSelect,highlight,size,locked}){
  const hl=highlight||[];
  const sz=size||260;
  const cx=sz/2,cy=sz/2,r=sz*0.42,inner=sz*0.21;
  return(
    <svg width={sz} height={sz} style={{cursor:locked?"default":"pointer",maxWidth:"100%"}}>
      {Array.from({length:SLICES},function(_,i){
        const op=hl.length===0?(selected===null||selected===i?1:0.25):(hl.includes(i)?1:0.18);
        return(
          <path key={i} d={slicePath(i,cx,cy,r,inner)} fill={sliceColor(i)} opacity={op}
            stroke={T.bg} strokeWidth={2.5}
            onClick={function(){if(!locked)onSelect(selected===i?null:i);}}/>
        );
      })}
      <circle cx={cx} cy={cy} r={inner-1} fill={T.bg}/>
      {selected!==null&&selected!==undefined&&(
        <g>
          <circle cx={cx} cy={cy} r={inner-2} fill={sliceColor(selected)}/>
          <text x={cx} y={cy-4} textAnchor="middle" fontSize={9} fill={T.bg} fontWeight={700}>{SNAMES[selected]}</text>
          <text x={cx} y={cy+9} textAnchor="middle" fontSize={8} fill={T.bg} opacity={0.8}>{STYPES[selected]||"Tertiary"}</text>
        </g>
      )}
    </svg>
  );
}

const QUESTION_BANK=[
  {id:"q1",q:"Which of these is a PRIMARY colour?",opts:["Orange","Green","Blue","Violet"],ans:"Blue",exp:"Blue cannot be created by mixing other colours. Orange (Red+Yellow), Green (Yellow+Blue), and Violet (Blue+Red) are all secondary colours.",whl:[8]},
  {id:"q2",q:"What colour do you get by mixing Red + Yellow?",opts:["Violet","Orange","Brown","Blue-Green"],ans:"Orange",exp:"Red + Yellow = Orange. Orange is a secondary colour sitting exactly between Red and Yellow on the wheel.",whl:[0,4,2]},
  {id:"q3",q:"Which colour is directly opposite to Blue on the wheel?",opts:["Green","Violet","Orange","Yellow"],ans:"Orange",exp:"Blue and Orange are exactly 180 degrees apart - a true complementary pair. This is why sunsets look so dramatic against a blue sky.",whl:[8,2]},
  {id:"q4",q:"Tertiary colours are created by mixing:",opts:["Two adjacent secondary colours","Equal parts of all three primaries","A primary and a neighbouring secondary","Two secondary colours"],ans:"A primary and a neighbouring secondary",exp:"Tertiary = primary + its adjacent secondary. Red + Orange = Red-Orange. All tertiary names are hyphenated - they reference both parents.",whl:[0,2,1]},
  {id:"q5",q:"How many tertiary colours exist on the standard 12-colour wheel?",opts:["3","4","6","12"],ans:"6",exp:"There are exactly 6 tertiary colours: Red-Orange, Yellow-Orange, Yellow-Green, Blue-Green, Blue-Violet, Red-Violet. They fill the 6 gaps between primaries and secondaries.",whl:[1,3,5,7,9,11]},
  {id:"q6",q:"How many total colours are on the standard Itten colour wheel?",opts:["6","8","12","16"],ans:"12",exp:"The 12-colour wheel has 3 primaries, 3 secondaries, and 6 tertiaries. Johannes Itten established this as the standard for design education at the Bauhaus.",whl:[]},
  {id:"q7",q:"What colour do you get by mixing Yellow + Blue?",opts:["Orange","Violet","Green","Brown"],ans:"Green",exp:"Yellow + Blue = Green. Green is a secondary colour sitting exactly between Yellow and Blue on the wheel.",whl:[4,8,6]},
  {id:"q8",q:"What colour do you get by mixing Red + Blue?",opts:["Orange","Violet","Green","Brown"],ans:"Violet",exp:"Red + Blue = Violet. Violet is a secondary colour sitting between Red and Blue on the wheel.",whl:[0,8,10]},
  {id:"q9",q:"Which of these is a SECONDARY colour?",opts:["Red","Blue","Yellow","Green"],ans:"Green",exp:"Green is created by mixing Yellow + Blue - two primaries. Red, Blue, and Yellow are primary colours that cannot be mixed from others.",whl:[6]},
  {id:"q10",q:"The colour directly opposite Red on the wheel is:",opts:["Orange","Blue","Green","Violet"],ans:"Green",exp:"Red (position 0) and Green (position 6) are exactly 180 degrees apart - a complementary pair. This is one of the most powerful contrasts in design.",whl:[0,6]},
  {id:"q11",q:"Yellow-Green is an example of a:",opts:["Primary colour","Secondary colour","Tertiary colour","Neutral colour"],ans:"Tertiary colour",exp:"Yellow-Green is made by mixing Yellow (primary) with Green (secondary). The hyphenated name confirms it is tertiary - referencing both parents.",whl:[5]},
  {id:"q12",q:"Which colour is the complement of Yellow?",opts:["Orange","Green","Violet","Blue"],ans:"Violet",exp:"Yellow (position 4) and Violet (position 10) are exactly 180 degrees apart on the wheel - a complementary pair.",whl:[4,10]},
  {id:"q13",q:"Which colour is the complement of Red?",opts:["Orange","Blue","Green","Violet"],ans:"Green",exp:"Red (position 0) and Green (position 6) are directly opposite. This complementary pair is used in Christmas branding, Italian flags, and traffic signals.",whl:[0,6]},
  {id:"q14",q:"Moses Harris painted the first colour wheel in which century?",opts:["16th century","17th century","18th century","19th century"],ans:"18th century",exp:"Moses Harris painted his colour wheel in 1766 - the 18th century. He was an entomologist classifying insect wing colours, not a designer.",whl:[]},
  {id:"q15",q:"Johannes Itten taught at which famous design school?",opts:["Yale","RCA","Bauhaus","Central Saint Martins"],ans:"Bauhaus",exp:"Itten taught at the Bauhaus in Germany (1919-1923). His colour theory course became the foundation of all modern design colour education.",whl:[]},
  {id:"q16",q:"Red-Orange sits between which two colours on the wheel?",opts:["Red and Yellow","Red and Orange","Orange and Yellow-Orange","Red-Violet and Orange"],ans:"Red and Orange",exp:"Red-Orange sits between Red (primary, position 0) and Orange (secondary, position 2) at position 1. It is made by mixing these two.",whl:[0,2,1]},
  {id:"q17",q:"Which of these is NOT a tertiary colour?",opts:["Red-Orange","Yellow-Green","Blue-Violet","Orange"],ans:"Orange",exp:"Orange is a secondary colour (Red + Yellow). Tertiary colours are always hyphenated: Red-Orange, Yellow-Green, Blue-Violet. No hyphen = not tertiary.",whl:[2]},
  {id:"q18",q:"Itten refined the colour wheel for design education in which decade?",opts:["1890s","1920s","1950s","1980s"],ans:"1920s",exp:"Itten taught his colour course at the Bauhaus from 1919-1923. His teaching method standardised colour education for designers worldwide.",whl:[]},
  {id:"q19",q:"Which brand uses Blue-Green as its signature colour?",opts:["Coca-Cola","Tiffany and Co","FedEx","Hermes"],ans:"Tiffany and Co",exp:"Tiffany Blue is a specific Blue-Green tertiary - Pantone 1837. Trademarked since 1845, one of the first and most recognised brand colours in the world.",whl:[7]},
  {id:"q20",q:"Which brand uses Red-Orange as its primary colour?",opts:["Tiffany and Co","Apple","Hermes","IBM"],ans:"Hermes",exp:"Hermes uses a specific Red-Orange tertiary (close to Pantone 165) across all products. Not pure Red, not pure Orange - a tertiary that feels more refined than either primary.",whl:[1]},
  {id:"q21",q:"Yellow-Orange position on the 12-colour wheel is:",opts:["Position 1","Position 3","Position 5","Position 7"],ans:"Position 3",exp:"Red=0, Red-Orange=1, Orange=2, Yellow-Orange=3, Yellow=4, Yellow-Green=5, Green=6, Blue-Green=7, Blue=8, Blue-Violet=9, Violet=10, Red-Violet=11.",whl:[3]},
  {id:"q22",q:"Which colour family do most premium brands prefer for their palettes?",opts:["Primary colours","Secondary colours","Tertiary colours","Neutral colours only"],ans:"Tertiary colours",exp:"Raw primaries feel obvious and unrefined. Tiffany uses Blue-Green, Hermes uses Red-Orange, not pure Blue or Red. Tertiary colours carry more sophistication.",whl:[1,3,5,7,9,11]},
  {id:"q23",q:"Which school made colour theory a mandatory foundation course?",opts:["Yale University","The Bauhaus","Central Saint Martins","Rhode Island School of Design"],ans:"The Bauhaus",exp:"The Bauhaus (1919-1933) in Germany made colour theory mandatory for all students. Itten, Klee, and Kandinsky all taught colour there.",whl:[]},
  {id:"q24",q:"How many PRIMARY colours are on the traditional colour wheel?",opts:["2","3","4","6"],ans:"3",exp:"There are exactly 3 primary colours: Red, Yellow, and Blue. They are equally spaced at 120 degrees apart on the wheel. Everything else is mixed from these three.",whl:[0,4,8]},
  {id:"q25",q:"How many SECONDARY colours are on the colour wheel?",opts:["2","3","4","6"],ans:"3",exp:"There are exactly 3 secondary colours: Orange (Red+Yellow), Green (Yellow+Blue), Violet (Blue+Red). Each sits exactly between its two parent primaries.",whl:[2,6,10]},
  {id:"q26",q:"Which colour is the complement of Orange?",opts:["Yellow","Red","Blue","Green"],ans:"Blue",exp:"Orange (position 2) and Blue (position 8) are exactly 180 degrees apart - a complementary pair. This is one of the most powerful contrast combinations in design.",whl:[2,8]},
  {id:"q27",q:"Which colour is the complement of Green?",opts:["Blue","Yellow","Orange","Red"],ans:"Red",exp:"Green (position 6) and Red (position 0) are directly opposite on the wheel. Maximum complementary contrast - used in stop/go signals and Christmas branding.",whl:[6,0]},
  {id:"q28",q:"Which colour is the complement of Violet?",opts:["Blue","Green","Yellow","Orange"],ans:"Yellow",exp:"Violet (position 10) and Yellow (position 4) are exactly 180 degrees apart. A less obvious but powerful complementary pair used in luxury and creative branding.",whl:[10,4]},
  {id:"q29",q:"FedEx uses purple and orange. What colour wheel relationship is this?",opts:["Analogous","Triadic","Complementary","Monochromatic"],ans:"Complementary",exp:"Purple (Blue-Violet area) and Orange are near-complementary - almost directly opposite on the wheel. High contrast that grabs attention even on a moving vehicle.",whl:[2,10]},
  {id:"q30",q:"IKEA uses blue and yellow. What colour wheel relationship is this?",opts:["Analogous","Triadic","Complementary","Monochromatic"],ans:"Complementary",exp:"Blue (position 8) and Yellow (position 4) are complementary - opposite on the wheel. IKEA uses this for maximum contrast. It also references the Swedish flag.",whl:[8,4]},
  {id:"q31",q:"Blue-Green is positioned between which two colours on the wheel?",opts:["Blue and Violet","Green and Blue","Yellow-Green and Blue","Blue and Blue-Violet"],ans:"Green and Blue",exp:"Blue-Green sits between Green (position 6) and Blue (position 8) at position 7. It is the tertiary made by mixing these two.",whl:[6,8,7]},
  {id:"q32",q:"Red-Violet is positioned between which two colours on the wheel?",opts:["Red and Orange","Violet and Blue-Violet","Red and Violet","Violet and Red-Orange"],ans:"Red and Violet",exp:"Red-Violet sits between Red (position 0) and Violet (position 10) at position 11. It is the tertiary made by mixing these two.",whl:[0,10,11]},
  {id:"q33",q:"How many colours on the wheel are neither primary nor secondary?",opts:["3","4","6","9"],ans:"6",exp:"The 6 tertiary colours are neither primary nor secondary: Red-Orange, Yellow-Orange, Yellow-Green, Blue-Green, Blue-Violet, Red-Violet.",whl:[1,3,5,7,9,11]},
  {id:"q34",q:"Which of these correctly lists the three PRIMARY colours?",opts:["Red, Orange, Yellow","Red, Yellow, Blue","Red, Green, Blue","Yellow, Green, Violet"],ans:"Red, Yellow, Blue",exp:"The three traditional primary colours are Red, Yellow, and Blue. These are the RYB primaries used in painting, art education, and Itten colour theory.",whl:[0,4,8]},
  {id:"q35",q:"Which of these correctly lists the three SECONDARY colours?",opts:["Orange, Green, Violet","Red, Yellow, Blue","Orange, Blue, Violet","Green, Orange, Blue"],ans:"Orange, Green, Violet",exp:"The three secondary colours are Orange (Red+Yellow), Green (Yellow+Blue), and Violet (Blue+Red). Each is mixed from two primaries.",whl:[2,6,10]},
  {id:"q36",q:"A colour directly opposite another on the wheel is called its:",opts:["Analogous colour","Tertiary colour","Complementary colour","Split colour"],ans:"Complementary colour",exp:"Two colours directly opposite each other on the wheel (180 degrees apart) are called complementary colours. They create maximum contrast when placed together.",whl:[]},
  {id:"q37",q:"Which of the following is a tertiary colour?",opts:["Red","Orange","Blue-Green","Green"],ans:"Blue-Green",exp:"Blue-Green is a tertiary colour made by mixing Blue (primary) with Green (secondary). The hyphenated name is the key - tertiaries always reference both parents.",whl:[7]},
  {id:"q38",q:"Moses Harris was by profession a:",opts:["Painter","Architect","Entomologist","Printer"],ans:"Entomologist",exp:"Moses Harris was an entomologist - a scientist who studies insects. He created the first colour wheel in 1766 to classify wing colours, not as a design tool.",whl:[]},
  {id:"q39",q:"Which colour sits at position 0 on the 12-colour wheel?",opts:["Violet","Orange","Red","Yellow"],ans:"Red",exp:"Red is at position 0 - the starting point of the 12-colour wheel. From here: Red-Orange=1, Orange=2, Yellow-Orange=3, Yellow=4, and so on around the wheel.",whl:[0]},
  {id:"q40",q:"Which colour sits at position 6 on the 12-colour wheel?",opts:["Blue","Violet","Yellow","Green"],ans:"Green",exp:"Green is at position 6 - directly opposite Red (position 0). This makes Red and Green a complementary pair. Position 6 is always the complement of position 0.",whl:[6]},
  {id:"q41",q:"Blue-Violet is an example of a:",opts:["Primary colour","Secondary colour","Tertiary colour","Complementary colour"],ans:"Tertiary colour",exp:"Blue-Violet is made by mixing Blue (primary) with Violet (secondary). The hyphenated name tells you both parents. All tertiary names follow this pattern.",whl:[9]},
  {id:"q42",q:"Which statement about complementary colours is correct?",opts:["They are adjacent on the wheel","They are 90 degrees apart","They are 180 degrees apart","They are the same hue"],ans:"They are 180 degrees apart",exp:"Complementary colours are always exactly 180 degrees apart on the wheel - directly opposite each other. This position creates maximum colour contrast.",whl:[]},
  {id:"q43",q:"Tiffany uses Blue-Green. Hermes uses Red-Orange. What do these have in common?",opts:["Both are primary colours","Both are secondary colours","Both are tertiary colours","Both are complementary colours"],ans:"Both are tertiary colours",exp:"Blue-Green and Red-Orange are both tertiary colours. Premium brands favour tertiaries over primaries because they feel more refined and sophisticated.",whl:[1,7]},
  {id:"q44",q:"Which colour is made by mixing Yellow + Orange?",opts:["Red-Orange","Yellow-Orange","Yellow-Green","Orange-Red"],ans:"Yellow-Orange",exp:"Yellow (primary) + Orange (secondary) = Yellow-Orange (tertiary). It sits between Yellow and Orange on the wheel at position 3.",whl:[4,2,3]},
  {id:"q45",q:"Which colour is made by mixing Blue + Violet?",opts:["Blue-Green","Red-Violet","Blue-Violet","Violet-Blue"],ans:"Blue-Violet",exp:"Blue (primary) + Violet (secondary) = Blue-Violet (tertiary). It sits between Blue and Violet on the wheel at position 9.",whl:[8,10,9]},
  {id:"q46",q:"On the 12-colour wheel, primaries are spaced how far apart?",opts:["60 degrees","90 degrees","120 degrees","180 degrees"],ans:"120 degrees",exp:"The three primaries (Red, Yellow, Blue) are equally spaced at 120 degrees apart. This equal spacing is what gives the wheel its mathematical structure.",whl:[0,4,8]},
  {id:"q47",q:"Which of these pairs are complementary colours?",opts:["Red and Orange","Blue and Blue-Green","Yellow and Violet","Red-Orange and Yellow-Orange"],ans:"Yellow and Violet",exp:"Yellow (position 4) and Violet (position 10) are exactly 180 degrees apart - a true complementary pair. The others are all adjacent colours.",whl:[4,10]},
  {id:"q48",q:"A colour made by mixing two primaries is called:",opts:["A tertiary colour","A primary colour","A secondary colour","A complementary colour"],ans:"A secondary colour",exp:"Secondary colours are made by mixing two primaries. Orange = Red+Yellow. Green = Yellow+Blue. Violet = Blue+Red. Three secondaries, each from two primaries.",whl:[]},
  {id:"q49",q:"Which position on the wheel is Blue?",opts:["Position 4","Position 6","Position 8","Position 10"],ans:"Position 8",exp:"Blue is at position 8. Its complement Orange is at position 2 (exactly 6 positions away = 180 degrees). Knowing positions helps you find complements quickly.",whl:[8]},
  {id:"q50",q:"The colour wheel was created to organise colours by:",opts:["How expensive they are to produce","Their popularity in art history","Their mathematical relationships to each other","How they look on screen vs print"],ans:"Their mathematical relationships to each other",exp:"The colour wheel organises colours by their mathematical relationships - which colours mix to make which, and which are opposite each other. It is a map of colour relationships.",whl:[]},
];

const BRAND_BANK=[
  {name:"FedEx",c1:"#4D148C",c2:"#FF6600",hint:"Purple + Orange",ans:"complementary",exp:"FedEx uses purple and orange - near-complementary colours almost directly opposite on the wheel. High contrast grabs attention even on a moving truck."},
  {name:"McDonald's",c1:"#DA291C",c2:"#FFC72C",hint:"Red + Yellow",ans:"analogous",exp:"Red and Yellow are analogous - adjacent warm colours. Together they stimulate appetite and create urgency. Every major fast food chain uses this intentionally."},
  {name:"Instagram",c1:"#833AB4",c2:"#FD1D1D",hint:"Purple + Red",ans:"analogous",exp:"Instagram uses analogous warm-to-cool colours: Purple, Red, Orange, Yellow. Analogous palettes feel vibrant yet harmonious - perfect for a creative platform."},
  {name:"Spotify",c1:"#191414",c2:"#1DB954",hint:"Black + Green",ans:"complementary",exp:"Spotify uses near-black with vivid Green accent. The green pops against the dark background due to high value contrast. The green is a tertiary Yellow-Green."},
  {name:"Tiffany",c1:"#0ABAB5",c2:"#FFFFFF",hint:"Blue-Green + White",ans:"analogous",exp:"Tiffany Blue is a specific Blue-Green tertiary (Pantone 1837). Against white it creates a clean, luxurious analogous feel. Trademarked since 1845."},
  {name:"Barbie",c1:"#E0218A",c2:"#FFFFFF",hint:"Hot Pink + White",ans:"monochromatic",exp:"Barbie uses a single vivid Red-Violet (hot pink) hue at maximum saturation against white. One hue, varied by value - textbook monochromatic."},
  {name:"IKEA",c1:"#0051BA",c2:"#FFDA1A",hint:"Blue + Yellow",ans:"complementary",exp:"IKEA uses Blue and Yellow - a true complementary pair. Also references the Swedish flag. High contrast, highly visible, globally recognised."},
  {name:"Cadbury",c1:"#4B0082",c2:"#FFFFFF",hint:"Deep Violet + White",ans:"monochromatic",exp:"Cadbury uses deep Violet as a single dominant hue. Against white it feels rich and premium. Violet communicates luxury - perfect for premium chocolate."},
  {name:"Starbucks",c1:"#00704A",c2:"#FFFFFF",hint:"Green + White",ans:"monochromatic",exp:"Starbucks uses a single deep Green. Cool colour communicating freshness, nature, and calm. Against white the monochromatic approach feels clean and premium."},
  {name:"Hermes",c1:"#FF6600",c2:"#FFFFFF",hint:"Red-Orange + White",ans:"monochromatic",exp:"Hermes uses a specific Red-Orange tertiary (Pantone 165) - not pure Red, not pure Orange. More refined than either primary. One of the most recognised luxury colour decisions."},
  {name:"Twitter/X",c1:"#1DA1F2",c2:"#FFFFFF",hint:"Sky Blue + White",ans:"monochromatic",exp:"Twitter uses a single sky Blue hue against white. Blue communicates trust, openness, and communication. The monochromatic approach keeps the interface calm and focused."},
  {name:"WhatsApp",c1:"#25D366",c2:"#FFFFFF",hint:"Green + White",ans:"monochromatic",exp:"WhatsApp uses a fresh mid-Green - a tertiary Yellow-Green. Against white it communicates connection, nature, and positivity. Monochromatic but different hue from Starbucks."},
  {name:"YouTube",c1:"#FF0000",c2:"#FFFFFF",hint:"Pure Red + White",ans:"monochromatic",exp:"YouTube uses pure Red - a primary colour at maximum saturation. Against white it creates maximum urgency and energy. Red = action, play, excitement."},
  {name:"LinkedIn",c1:"#0A66C2",c2:"#FFFFFF",hint:"Deep Blue + White",ans:"monochromatic",exp:"LinkedIn uses a deep professional Blue against white. Blue communicates trust, authority, and professionalism. Perfect for a career and business platform."},
  {name:"Snapchat",c1:"#FFFC00",c2:"#000000",hint:"Yellow + Black",ans:"complementary",exp:"Snapchat uses Yellow and Black - high value contrast complementary feel. Yellow communicates youth and energy. Black grounds it. Together they create a bold, memorable identity."},
];

export default function CT01ColourWheel(){
  const[step,setStep]=useState(1);
  const[answers,setAnswers]=useState({});
  const[revealed,setRevealed]=useState({});
  const[chalBDone,setChalBDone]=useState(false);
  const[chalCDone,setChalCDone]=useState(false);
  const[chalBIdx,setChalBIdx]=useState(0);
  const[chalCIdx,setChalCIdx]=useState(0);
  const[cbAnswers,setCbAnswers]=useState({});
  const[cbAnswered,setCbAnswered]=useState({});
  const[ccAnswers,setCcAnswers]=useState({});
  const[ccRevealed,setCcRevealed]=useState({});
  const[ccAnswered,setCcAnswered]=useState({});
  const top=useRef(null);

  function go(n){setStep(n);if(top.current)top.current.scrollIntoView({behavior:"smooth"});}
  const[exploreSelected,setExploreSelected]=useState(null);
  const compOf=function(i){return(i+6)%12;};

  const CB_SET=useMemo(function(){
    const pool=[0,1,2,3,4,5,6,7,8,9,10,11,0,2,4,6,8,10,1,3,5,7,9,11,3,7];
    return [...pool].sort(function(){return Math.random()-0.5;}).slice(0,5);
  },[]);
  const CC_SET=useMemo(function(){
    return [...BRAND_BANK].sort(function(){return Math.random()-0.5;}).slice(0,5);
  },[]);
  const QS=useMemo(function(){
    return [...QUESTION_BANK].sort(function(){return Math.random()-0.5;}).slice(0,10);
  },[]);

  const playScore=QS.filter(function(q){return answers[q.id]===q.ans;}).length;
  const allRevealed=QS.every(function(q){return revealed[q.id];});
  const cbScore=CB_SET.filter(function(t,i){return cbAnswered[i]&&cbAnswers[i]===compOf(t);}).length;
  const ccScore=CC_SET.filter(function(b,i){return ccAnswered[i]&&ccAnswers[i]===b.ans;}).length;
  const total=Math.round((playScore/QS.length)*50+cbScore*5+ccScore*5);
  const bothDone=chalBDone&&chalCDone;

  return(
    <div ref={top} style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"var(--font-inter), system-ui, sans-serif",padding:"60px 20px 80px"}}>
      <div style={{width:"100%",maxWidth:1200,boxSizing:"border-box",padding:"0 48px",margin:"0 auto"}}>
        <div style={{marginBottom:48, textAlign:"center"}}>
          <Tag>COLOUR THEORY - TOPIC 01</Tag>
          <h1 className="font-display" style={{fontFamily:"var(--font-fraunces), serif",fontSize:48,margin:"16px 0 8px",color:T.white,letterSpacing:"-0.02em"}}>The Colour Wheel</h1>
          <p style={{fontSize:15,color:T.dim,margin:0}}>Moses Harris 1766 &mdash; Johannes Itten 1961</p>
        </div>
        <StepBar step={step} setStep={go}/>

        {step===1&&(
          <div>
            <Card style={{marginBottom:18,borderLeft:"4px solid "+T.brand}}>
              <Tag>THE STORY</Tag>
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 14px"}}>In 1766, a British entomologist named <span style={{color:T.brand,fontWeight:700}}>Moses Harris</span> was trying to classify insect wing colours. He listed them in a straight line — Red, Orange, Yellow, Green, Blue, Violet. But he noticed a problem. Red and Violet, sitting at opposite ends, were actually related. There was a colour between them — Red-Violet — that the straight line could not show.</p>
              <p style={{fontSize:15,color:T.muted,lineHeight:1.75,margin:"0 0 12px"}}>So he bent the line into a circle. The ends met. Red-Violet appeared. Every colour now had a visible relationship with every other colour. The colour wheel was born — not as a design tool, but as a scientist trying to solve a classification problem.</p>
              <p style={{fontSize:15,color:T.muted,lineHeight:1.75,margin:"0 0 12px"}}>Nearly 200 years later, <span style={{color:T.white,fontWeight:700}}>Johannes Itten</span> at the Bauhaus took this wheel and made it the foundation of design education. His insight was simple: colour is not a collection of individual colours. It is a system of relationships. Every colour only means something in relation to what is around it.</p>
              <div style={{background:"#FFF6EF",borderLeft:"4px solid #FF8A47",borderRadius:"0 12px 12px 0",padding:20,marginTop:24}}>
                <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#E85A1B",fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  You have seen this problem before
                </div>
                <div style={{fontSize:15,color:"#1B1410",lineHeight:1.7}}>Every poster that felt uncomfortable. Every logo where the colours clashed. Every design that looked busy and unresolved. In almost every case — the designer picked colours without knowing where they sat on the wheel. They had no map. They were guessing.</div>
              </div>
            </Card>
            <Card style={{marginBottom:24,background:"#FFF6EF",border:"1px solid #FFE6D4"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#E85A1B",fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                WHAT THIS MEANS FOR YOU
              </div>
              <p style={{fontSize:15,color:"#5B4E46",lineHeight:1.7,margin:"10px 0 20px"}}>The colour wheel is a thinking tool — not a software feature, not a design trend. It lives in your head. Whatever you are designing, wherever you are working, the wheel helps you make colour decisions you can actually explain and defend.</p>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {[
                  {q:"What is it?",a:"12 colours arranged in a circle showing their relationships to each other."},
                  {q:"Why does it exist?",a:"Because a straight spectrum cannot show how colours relate. A circle can."},
                  {q:"How does it work?",a:"Opposite colours = maximum contrast. Adjacent colours = harmony. 120 degrees apart = balanced trio."},
                  {q:"How will you use it?",a:"Every time you pick a colour — ask where it sits on the wheel. Then decide what relationship you want with the other colours in your design."},
                  {q:"What if you skip it?",a:"You pick by gut feeling. Sometimes it works. You cannot explain why. You cannot fix it when it does not work."},
                ].map(function(item){
                  return(
                    <div key={item.q} style={{background:"#FFFFFF",borderRadius:12,padding:16,display:"flex",gap:16,alignItems:"flex-start",boxShadow:"0 8px 24px -12px rgba(27,20,16,.08)",border:"1px solid #FFE6D4"}}>
                      <div style={{fontSize:13,color:"#FF6E2E",fontWeight:700,flexShrink:0,minWidth:140}}>{item.q}</div>
                      <div style={{fontSize:14,color:"#1B1410",lineHeight:1.6}}>{item.a}</div>
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
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 0"}}>The wheel has a structure. Understanding the structure is understanding colour relationships.</p>
            </Card>

            <Card style={{marginBottom:14}}>
              <Tag color={T.brand}>WHY A CIRCLE</Tag>
              <p style={{fontSize:13.5,color:T.muted,lineHeight:1.65,margin:"10px 0 10px"}}>Colours exist as a spectrum from Red to Violet in a straight line. But Red and Violet are related. Bend the line into a circle and they connect through Red-Violet. Now every colour has a measurable relationship with every other colour. That is the only reason it is a circle.</p>
              <div style={{display:"flex",gap:4,margin:"0 0 8px"}}>
                {["#E63946","#FF4500","#FF7A00","#FFA500","#FFD60A","#9ACD32","#2DC653","#008B8B","#3A86FF","#4169E1","#7B2FBE","#C71585"].map(function(c,i){return <div key={i} style={{flex:1,height:24,borderRadius:3,background:c}}/>;}) }
              </div>
              <div style={{fontSize:11,color:T.dim,textAlign:"center",marginBottom:10}}>Straight spectrum — Red and Violet are disconnected at opposite ends</div>
              <div style={{fontSize:12.5,color:T.dim,background:T.panel,borderRadius:8,padding:"8px 12px"}}>When this line bends into a circle — Red and Violet meet through Red-Violet. Every colour gets a position. Every position has a relationship with every other position.</div>
            </Card>

            <Card style={{marginBottom:14}}>
              <Tag color={T.brand}>PRIMARY COLOURS</Tag>
              <div style={{display:"flex",gap:6,margin:"12px 0"}}>
                {["#E63946","#FFD60A","#3A86FF"].map(function(d,i){return <div key={i} style={{flex:1,height:34,borderRadius:8,background:d}}/>;}) }
              </div>
              <div style={{fontSize:12.5,color:T.muted,marginBottom:8}}>Red - Yellow - Blue</div>
              <p style={{fontSize:13.5,color:T.muted,lineHeight:1.65,margin:"0 0 8px"}}>These three cannot be created by mixing other colours. They are the source. Everything else on the wheel is made from combinations of these three. They sit at 120 degrees from each other — equally spaced, no two are adjacent.</p>
              <div style={{fontSize:12.5,color:T.dim,background:T.panel,borderRadius:8,padding:"8px 12px"}}>If primaries did not exist, the wheel could not exist. Everything flows from these three.</div>
            </Card>

            <Card style={{marginBottom:14}}>
              <Tag color="#A5C9CA">SECONDARY COLOURS</Tag>
              <div style={{display:"flex",gap:6,margin:"12px 0"}}>
                {["#FF7A00","#2DC653","#7B2FBE"].map(function(d,i){return <div key={i} style={{flex:1,height:34,borderRadius:8,background:d}}/>;}) }
              </div>
              <div style={{fontSize:12.5,color:T.muted,marginBottom:8}}>Orange = Red+Yellow — Green = Yellow+Blue — Violet = Blue+Red</div>
              <p style={{fontSize:13.5,color:T.muted,lineHeight:1.65,margin:"0 0 8px"}}>Mix any two primaries and you get a secondary. They sit exactly at the midpoint between their two parent primaries on the wheel. Three primaries produce three secondaries.</p>
              <div style={{fontSize:12.5,color:T.dim,background:T.panel,borderRadius:8,padding:"8px 12px"}}>Each secondary sits directly opposite a primary. Orange is opposite Blue. Green is opposite Red. Violet is opposite Yellow. This is the origin of complementary contrast.</div>
            </Card>

            <Card style={{marginBottom:14}}>
              <Tag color="#C9A5A5">TERTIARY COLOURS</Tag>
              <div style={{display:"flex",gap:6,margin:"12px 0"}}>
                {["#FF4500","#FFA500","#9ACD32","#008B8B","#4169E1","#C71585"].map(function(d,i){return <div key={i} style={{flex:1,height:34,borderRadius:8,background:d}}/>;}) }
              </div>
              <div style={{fontSize:12.5,color:T.muted,marginBottom:8}}>Red-Orange — Yellow-Orange — Yellow-Green — Blue-Green — Blue-Violet — Red-Violet</div>
              <p style={{fontSize:13.5,color:T.muted,lineHeight:1.65,margin:"0 0 8px"}}>Mix a primary with the secondary next to it and you get a tertiary. Six tertiaries fill the remaining gaps. They always have hyphenated names — because they reference both parents.</p>
              <div style={{fontSize:12.5,color:T.dim,background:T.panel,borderRadius:8,padding:"8px 12px"}}>The more mixing that happens, the less obvious and more refined a colour feels. This is why Hermes uses Red-Orange not pure Red. Tiffany uses Blue-Green not pure Blue. Tertiary = more sophisticated.</div>
            </Card>

            <Card style={{marginBottom:14}}>
              <Tag color={T.green}>COMPLEMENTARY — THE KEY RELATIONSHIP</Tag>
              <p style={{fontSize:13.5,color:T.muted,lineHeight:1.65,margin:"10px 0 12px"}}>Two colours sitting exactly opposite each other on the wheel — 180 degrees apart — are complementary. This is the most important relationship the wheel reveals.</p>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                {[[0,6],[4,10],[8,2]].map(function(pair,i){
                  return(
                    <div key={i} style={{flex:1}}>
                      <div style={{display:"flex",gap:3,marginBottom:4}}>
                        <div style={{flex:1,height:30,borderRadius:6,background:sliceColor(pair[0])}}/>
                        <div style={{flex:1,height:30,borderRadius:6,background:sliceColor(pair[1])}}/>
                      </div>
                      <div style={{fontSize:9,color:T.dim,textAlign:"center"}}>{SNAMES[pair[0]]}+{SNAMES[pair[1]]}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <div style={{background:T.panel,borderRadius:8,padding:10}}>
                  <div style={{fontSize:12,color:T.green,fontWeight:700,marginBottom:4}}>What it does</div>
                  <div style={{fontSize:12.5,color:T.muted,lineHeight:1.6}}>Complementary colours create maximum contrast. Each makes the other appear more vivid. This is why they grab attention and why brands use them for CTAs and highlights.</div>
                </div>
                <div style={{background:T.panel,borderRadius:8,padding:10}}>
                  <div style={{fontSize:12,color:T.brand,fontWeight:700,marginBottom:4}}>How to use it</div>
                  <div style={{fontSize:12.5,color:T.muted,lineHeight:1.6}}>One colour as dominant (large areas), its complement as accent (key element only). Never both at equal weight — it creates tension that is hard to read.</div>
                </div>
              </div>
            </Card>

            <Card style={{marginBottom:18}}>
              <Tag color={T.brand}>EXPLORE THE WHEEL — DO THIS NOW</Tag>
              <p style={{fontSize:13.5,color:T.muted,lineHeight:1.65,margin:"10px 0 6px"}}>Do not skip this. Three taps. Each one builds a permanent mental model.</p>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
                {[
                  "Step 1 — Tap Red. Find its complement. Remember it.",
                  "Step 2 — Tap Yellow. Find its complement. Remember it.",
                  "Step 3 — Tap any Tertiary. Read its name. Notice the hyphen.",
                ].map(function(s,i){
                  return(
                    <div key={i} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 12px",background:T.panel,borderRadius:8}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:T.brand,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#0A0A0A",flexShrink:0}}>{i+1}</div>
                      <div style={{fontSize:12.5,color:T.muted}}>{s}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
                <ColourWheel selected={exploreSelected} onSelect={function(v){setExploreSelected(v);}} highlight={[]} size={260} locked={false}/>
              </div>
              {exploreSelected!==null?(
                <div style={{background:T.panel,borderRadius:12,padding:14}}>
                  <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:10}}>
                    <div style={{width:36,height:36,borderRadius:8,background:sliceColor(exploreSelected),flexShrink:0}}/>
                    <div>
                      <div style={{fontSize:16,fontWeight:700,color:T.white}}>{SNAMES[exploreSelected]}</div>
                      <div style={{fontSize:12,color:T.brand,fontWeight:700,marginTop:2}}>{STYPES[exploreSelected]||"Tertiary"}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center",padding:"10px 12px",background:T.panel2,borderRadius:10}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,color:T.dim,marginBottom:4}}>COMPLEMENT — 180 degrees opposite</div>
                      <div style={{fontSize:14,fontWeight:700,color:T.white}}>{SNAMES[(exploreSelected+6)%12]}</div>
                      <div style={{fontSize:11,color:T.muted,marginTop:2}}>{STYPES[(exploreSelected+6)%12]||"Tertiary"}</div>
                    </div>
                    <div style={{width:36,height:36,borderRadius:8,background:sliceColor((exploreSelected+6)%12),flexShrink:0}}/>
                  </div>
                  <div style={{fontSize:12,color:T.dim,marginTop:8,textAlign:"center"}}>These two colours are exactly 180 degrees apart on the wheel.</div>
                </div>
              ):(
                <div style={{textAlign:"center",padding:"20px 0",borderRadius:10,background:T.panel}}>
                  <div style={{fontSize:13,color:T.brand,fontWeight:700,marginBottom:4}}>Tap a colour above to begin</div>
                  <div style={{fontSize:12,color:T.dim}}>Start with Red — position 0</div>
                </div>
              )}
            </Card>

            <Nav onBack={function(){go(1);}} onNext={function(){go(3);}} nextLabel="Test yourself"/>
          </div>
        )}

        {step===3&&(
          <div>
            <Card style={{marginBottom:18,borderLeft:"4px solid "+T.brand}}>
              <Tag>PLAY - 10 QUESTIONS</Tag>
              <p style={{fontSize:16,color:T.white,lineHeight:1.65,margin:"10px 0 6px"}}>Answer all 10. Each correct = 5 points. Answer is locked on selection - choose carefully.</p>
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
                  {isRev&&q.whl&&q.whl.length>0&&(
                    <div style={{display:"flex",justifyContent:"center",marginBottom:12,padding:"12px 0",background:T.panel,borderRadius:12}}>
                      <ColourWheel selected={null} onSelect={function(){}} highlight={q.whl} size={150} locked={true}/>
                    </div>
                  )}
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
                          onClick={function(){
                            if(!isRev&&!picked){
                              setAnswers(function(p){return Object.assign({},p,{[q.id]:opt});});
                            }
                          }}
                          style={{padding:"11px 16px",background:bg,border:"1px solid "+bc,borderRadius:10,color:fc,cursor:(isRev||picked)?"default":"pointer",textAlign:"left",fontSize:13.5,lineHeight:1.5}}
                        >{opt}</button>
                      );
                    })}
                  </div>
                  {picked&&!isRev&&(
                    <button
                      onClick={function(){setRevealed(function(p){return Object.assign({},p,{[q.id]:true});});}}
                      style={{width:"100%",padding:12,background:T.brand,border:"none",borderRadius:10,color:"#0A0A0A",fontWeight:700,cursor:"pointer",fontSize:14,marginTop:12}}
                    >Reveal answer</button>
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
              <p style={{fontSize:16,color:T.white,lineHeight:1.65,margin:"10px 0 4px"}}>5 wheel + 5 brand challenges. Complete each to unlock the next. First tap is final.</p>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10}}>
                <div style={{flex:1,height:5,background:T.panel,borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",background:T.brand,borderRadius:3,width:((chalBIdx+chalCIdx)/10*100)+"%",transition:"width .3s"}}/>
                </div>
                <span style={{fontSize:11,color:T.brand,fontWeight:700,flexShrink:0}}>{chalBIdx+chalCIdx}/10</span>
              </div>
            </Card>

            {CB_SET.map(function(target,qi){
              const prevDone=qi===0?true:!!cbAnswered[qi-1];
              if(!prevDone)return null;
              const myAns=cbAnswers[qi];
              const myDone=!!cbAnswered[qi];
              const isCorrect=myAns===compOf(target);
              return(
                <Card key={"cb"+qi} style={{marginBottom:14,opacity:myDone?0.65:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <Tag color={myDone?(isCorrect?T.green:T.red):T.brand}>{"B"+(qi+1)+" of 5 - Find the Complement"}</Tag>
                    {myDone&&<span style={{fontSize:12,color:isCorrect?T.green:T.red,fontWeight:700}}>{isCorrect?"+5 pts":"0 pts"}</span>}
                  </div>
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.6,margin:"0 0 14px"}}>Highlighted: <span style={{color:T.white,fontWeight:700}}>{SNAMES[target]}</span>. Tap its complement - 180 degrees away. First tap is final.</p>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
                    <ColourWheel
                      selected={myAns!==undefined?myAns:null}
                      onSelect={function(v){
                        if(myDone||myAns!==undefined)return;
                        const na=Object.assign({},cbAnswers);na[qi]=v;setCbAnswers(na);
                        const nd=Object.assign({},cbAnswered);nd[qi]=true;setCbAnswered(nd);
                        setChalBIdx(qi+1);
                        if(qi===4)setChalBDone(true);
                      }}
                      highlight={myAns!==undefined?[target,myAns]:[target]}
                      size={240}
                      locked={myDone||myAns!==undefined}
                    />
                  </div>
                  {myAns!==undefined&&(
                    <div style={{background:isCorrect?"rgba(45,198,83,.1)":"rgba(233,69,96,.1)",border:"1px solid "+(isCorrect?T.green:T.red),borderRadius:12,padding:14}}>
                      <div style={{fontWeight:700,color:isCorrect?T.green:T.red,marginBottom:6}}>{isCorrect?"Correct! +5 pts":"Wrong - 0 pts"}</div>
                      <div style={{fontSize:13,color:T.muted,lineHeight:1.6}}>
                        {isCorrect
                          ?(SNAMES[target]+" and "+SNAMES[compOf(target)]+" are exactly 180 degrees apart.")
                          :("The complement of "+SNAMES[target]+" is "+SNAMES[compOf(target)]+".")}
                      </div>
                      {!myDone&&<button onClick={function(){const nd=Object.assign({},cbAnswered);nd[qi]=true;setCbAnswered(nd);setChalBIdx(qi+1);if(qi===4)setChalBDone(true);}} style={{marginTop:10,padding:"8px 18px",background:T.green,border:"none",borderRadius:8,color:"#0A0A0A",fontWeight:700,fontSize:13,cursor:"pointer"}}>Next</button>}
                    </div>
                  )}
                </Card>
              );
            })}

            {chalBDone&&CC_SET.map(function(brand,qi){
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
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.6,margin:"0 0 12px"}}>What colour wheel relationship does this brand use?</p>
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
                      {!myDone&&<button onClick={function(){const n=Object.assign({},ccAnswered);n[qi]=true;setCcAnswered(n);setChalCIdx(qi+1);if(qi===4)setChalCDone(true);}} style={{padding:"8px 18px",background:T.green,border:"none",borderRadius:8,color:"#0A0A0A",fontWeight:700,fontSize:13,cursor:"pointer"}}>Next</button>}
                    </div>
                  )}
                </Card>
              );
            })}

            {!chalBDone&&(
              <div style={{textAlign:"center",padding:20,color:T.dim,fontSize:13}}>Complete all 5 wheel challenges to unlock Brand challenges</div>
            )}
            <Nav onBack={function(){go(3);}} onNext={function(){go(5);}} nextLabel={bothDone?"See takeaway":"Complete all challenges"} nextDisabled={!bothDone}/>
          </div>
        )}

        {step===5&&(
          <div>
            <Card style={{marginBottom:16,background:"rgba(255,122,0,.06)",borderLeft:"4px solid "+T.brand}}>
              <Tag>KEY TAKEAWAY</Tag>
              <p style={{fontSize:21,color:T.white,fontFamily:"Georgia,serif",lineHeight:1.5,margin:"12px 0 0"}}>The colour wheel is not a decoration. It is a map. Every professional colour decision is made with this map in hand.</p>
            </Card>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
              {[
                {t:"For brand design",b:"Before picking any colour, place it on the wheel. Is it primary, secondary, or tertiary? What is its complement? A primary feels obvious. A tertiary feels refined. Know the difference before you choose."},
                {t:"For client conversations",b:"When a client says the design needs to pop — they mean complementary contrast. When they say something feels off — check the wheel. The wheel gives you a language to explain colour decisions instead of saying it just feels right."},
                {t:"Train your eye daily",b:"Look at every logo, every brand, every poster around you. Ask — where does each colour sit on the wheel? What is its relationship to the other colours? This is how professionals think. Do it every day until it becomes automatic."},
              ].map(function(item){
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
                <div style={{fontSize:12.5,color:T.dim,lineHeight:1.6,paddingLeft:12,borderLeft:"2px solid "+T.border}}>Moses Harris - The Natural System of Colours (1766). Public domain.</div>
                <div style={{fontSize:12.5,color:T.dim,lineHeight:1.6,paddingLeft:12,borderLeft:"2px solid "+T.border}}>Johannes Itten - The Art of Color (1961). Bauhaus standard.</div>

              </div>
            </Card>
            <Nav onBack={function(){go(4);}} onNext={function(){go(1);}} nextLabel="Lesson Complete"/>
          </div>
        )}


      </div>
    </div>
  );
}
