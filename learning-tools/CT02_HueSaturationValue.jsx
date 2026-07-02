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

function HSVSlider({hue,sat,val,onHue,onSat,onVal}){
  function hsvToHex(h,s,v){
    s/=100;v/=100;
    const f=(n)=>{const k=(n+h/60)%6;return v-v*s*Math.max(0,Math.min(k,4-k,1));};
    const toHex=(x)=>Math.round(x*255).toString(16).padStart(2,"0");
    return "#"+toHex(f(5))+toHex(f(3))+toHex(f(1));
  }
  const hex=hsvToHex(hue,sat,val);
  const hueOnly=hsvToHex(hue,100,100);
  const satLow=hsvToHex(hue,0,val);
  const satHigh=hsvToHex(hue,100,val);
  const valLow=hsvToHex(hue,sat,0);
  const valHigh=hsvToHex(hue,sat,100);
  return(
    <div>
      <div style={{width:"100%",height:80,borderRadius:12,background:hex,marginBottom:16,border:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:13,fontWeight:700,color:val>50?"#0A0A0A":"#F0F0F0",fontFamily:"monospace"}}>{hex.toUpperCase()}</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:T.brand,fontWeight:700}}>HUE</span>
            <span style={{fontSize:12,color:T.muted}}>{hue} degrees</span>
          </div>
          <div style={{position:"relative",height:12,borderRadius:6,background:"linear-gradient(90deg,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)",marginBottom:4}}>
            <input type="range" min={0} max={360} value={hue} onChange={function(e){onHue(+e.target.value);}} style={{position:"absolute",inset:0,width:"100%",opacity:0,cursor:"pointer",height:"100%"}}/>
            <div style={{position:"absolute",top:"50%",left:(hue/360*100)+"%",transform:"translate(-50%,-50%)",width:18,height:18,borderRadius:"50%",background:"#fff",border:"2px solid #0A0A0A",pointerEvents:"none"}}/>
          </div>
          <div style={{fontSize:11,color:T.dim}}>The colour identity — its position on the wheel. Change hue = change the colour.</div>
        </div>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:"#A855F7",fontWeight:700}}>SATURATION</span>
            <span style={{fontSize:12,color:T.muted}}>{sat}%</span>
          </div>
          <div style={{position:"relative",height:12,borderRadius:6,background:"linear-gradient(90deg,"+satLow+","+satHigh+")",marginBottom:4}}>
            <input type="range" min={0} max={100} value={sat} onChange={function(e){onSat(+e.target.value);}} style={{position:"absolute",inset:0,width:"100%",opacity:0,cursor:"pointer",height:"100%"}}/>
            <div style={{position:"absolute",top:"50%",left:(sat)+"%",transform:"translate(-50%,-50%)",width:18,height:18,borderRadius:"50%",background:"#fff",border:"2px solid #0A0A0A",pointerEvents:"none"}}/>
          </div>
          <div style={{fontSize:11,color:T.dim}}>The intensity/purity. 100% = vivid. 0% = grey. Same hue, different energy.</div>
        </div>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:"#4A9EFF",fontWeight:700}}>VALUE</span>
            <span style={{fontSize:12,color:T.muted}}>{val}%</span>
          </div>
          <div style={{position:"relative",height:12,borderRadius:6,background:"linear-gradient(90deg,"+valLow+","+valHigh+")",marginBottom:4}}>
            <input type="range" min={0} max={100} value={val} onChange={function(e){onVal(+e.target.value);}} style={{position:"absolute",inset:0,width:"100%",opacity:0,cursor:"pointer",height:"100%"}}/>
            <div style={{position:"absolute",top:"50%",left:(val)+"%",transform:"translate(-50%,-50%)",width:18,height:18,borderRadius:"50%",background:"#fff",border:"2px solid #0A0A0A",pointerEvents:"none"}}/>
          </div>
          <div style={{fontSize:11,color:T.dim}}>The lightness. 100% = white light. 0% = black. Controls contrast and readability.</div>
        </div>
      </div>
    </div>
  );
}

const QUESTION_BANK=[
  {id:"q1",q:"Hue refers to:",opts:["How light or dark a colour is","The pure colour itself - its position on the wheel","How saturated or vivid a colour is","The mix of grey in a colour"],ans:"The pure colour itself - its position on the wheel",exp:"Hue is simply the colour identity - Red, Blue, Yellow-Green. It is the position on the colour wheel before any lightness or saturation changes are applied."},
  {id:"q2",q:"Value in colour theory refers to:",opts:["The cost of a colour in print","The hue position on the wheel","The lightness or darkness of a colour","The saturation level"],ans:"The lightness or darkness of a colour",exp:"Value = lightness or darkness. High value = light (close to white). Low value = dark (close to black). Value contrast is what makes text readable against a background."},
  {id:"q3",q:"Saturation refers to:",opts:["How light or dark a colour is","The purity and intensity of a colour","Which hue the colour is","How warm or cool a colour feels"],ans:"The purity and intensity of a colour",exp:"Saturation = colour intensity. 100% saturated = vivid pure colour. 0% = grey. Reducing saturation adds grey to a colour, making it more muted and sophisticated."},
  {id:"q4",q:"Two colours have the same hue but one looks washed out. What is different?",opts:["Their value is different","Their hue is different","Their saturation is different","Their temperature is different"],ans:"Their saturation is different",exp:"If the hue is identical but one looks washed out, saturation is the difference. Lower saturation adds grey to the colour, reducing its intensity and vividness."},
  {id:"q5",q:"Two colours have the same hue and saturation but one is much darker. What is different?",opts:["Saturation","Hue position","Value","Temperature"],ans:"Value",exp:"Value controls lightness and darkness. Same hue, same saturation, different value = the same colour at different brightness levels. This is how shadows and highlights work."},
  {id:"q6",q:"A fully desaturated colour (0% saturation) becomes:",opts:["Black","White","A shade of grey","Transparent"],ans:"A shade of grey",exp:"At 0% saturation, all colour information is removed. The result is grey - the specific shade of grey depends on the value. High value + no saturation = light grey. Low value = dark grey."},
  {id:"q7",q:"Which of these describes a colour with high saturation and low value?",opts:["A pale pastel","A vivid bright colour","A deep rich dark colour","A neutral grey"],ans:"A deep rich dark colour",exp:"High saturation = pure vivid colour. Low value = dark. Together they produce a deep, rich, intense dark colour - like deep burgundy or navy. This combination is used in premium and luxury branding."},
  {id:"q8",q:"Which of these describes a colour with low saturation and high value?",opts:["A vivid neon","A deep dark shade","A pale washed-out pastel","A neutral black"],ans:"A pale washed-out pastel",exp:"Low saturation = reduced intensity (greyed). High value = light. Together they produce soft pastel colours. This is how baby pink, powder blue, and mint green are created."},
  {id:"q9",q:"Changing only the hue of a colour while keeping saturation and value the same will:",opts:["Make the colour lighter","Make the colour darker","Change the colour identity but keep the same energy level","Remove all colour information"],ans:"Change the colour identity but keep the same energy level",exp:"Hue is only the colour name - Red, Blue, Green. If you change only the hue, you get a different colour but with the same level of intensity and brightness. The energy feels similar."},
  {id:"q10",q:"A designer wants to make a colour look more premium and sophisticated. What adjustment should they make?",opts:["Increase saturation","Reduce saturation slightly","Increase value","Reduce hue"],ans:"Reduce saturation slightly",exp:"Slightly reduced saturation removes the raw vividness of a colour, making it feel more refined and sophisticated. Pure 100% saturated primaries feel bold and unrefined. Muted versions feel premium. This is why luxury brands avoid fully saturated colours."},
  {id:"q11",q:"What is the relationship between hue, saturation, and value?",opts:["They all control the same thing","They are three independent properties that together define any colour","Hue controls both saturation and value","Value is a subset of saturation"],ans:"They are three independent properties that together define any colour",exp:"Hue, Saturation, and Value are three completely independent axes. Any colour in existence can be described by its position on all three. Change one without changing the others and you get a different but related colour."},
  {id:"q12",q:"Albert Munsell developed his colour system in which decade?",opts:["1860s","1880s","1900s","1930s"],ans:"1900s",exp:"Albert Munsell published his colour system in 1905. He was an art teacher frustrated that students had no precise language to describe colour. He created Hue, Value, and Chroma (similar to saturation) as three measurable dimensions."},
  {id:"q13",q:"In Munsell's system, what did he call the property equivalent to saturation?",opts:["Chroma","Intensity","Purity","Brilliance"],ans:"Chroma",exp:"Munsell used the term Chroma for colour intensity, equivalent to what we call saturation today. His Hue-Value-Chroma system became the foundation of modern scientific colour description."},
  {id:"q14",q:"Which property of colour is most responsible for making text readable on a background?",opts:["Hue difference","Saturation difference","Value (lightness) difference","Temperature difference"],ans:"Value (lightness) difference",exp:"Readability depends almost entirely on value contrast. Two colours can be completely different hues but identical in lightness - result is zero contrast and unreadable text. Value difference is what creates contrast."},
  {id:"q15",q:"A brand uses the exact same hue at 100% saturation for both text and background, just in different shades. The text is nearly invisible. Why?",opts:["The hue is wrong","The saturation is too high","There is no value contrast between text and background","The font is too small"],ans:"There is no value contrast between text and background",exp:"Even with identical hue and maximum saturation, text can be invisible if the value (lightness) of text and background are too similar. Value contrast - not hue contrast - is what creates readable text."},
  {id:"q16",q:"What happens when you increase the saturation of any colour?",opts:["It gets lighter","It gets darker","It becomes more vivid and intense","It shifts toward a different hue"],ans:"It becomes more vivid and intense",exp:"Increasing saturation moves a colour away from grey toward its pure, vivid form. A muted olive green becomes a vivid bright green. The hue stays the same, only the intensity changes."},
  {id:"q17",q:"What happens when you decrease the value of any colour?",opts:["It becomes more vivid","It shifts to a different hue","It becomes darker","It becomes more muted"],ans:"It becomes darker",exp:"Decreasing value makes a colour darker, moving it toward black. The hue and saturation remain unchanged - only the lightness decreases. This is how shadows are created from any base colour."},
  {id:"q18",q:"A tint of a colour is created by:",opts:["Adding black to the colour","Adding grey to the colour","Adding white to the colour","Reducing saturation"],ans:"Adding white to the colour",exp:"A tint is made by adding white to a colour. This increases value while keeping the hue the same. Baby pink is a tint of red. Sky blue is a tint of blue. Covered in detail in CT03 - Tint, Tone, Shade."},
  {id:"q19",q:"A shade of a colour is created by:",opts:["Adding white to the colour","Adding grey to the colour","Adding black to the colour","Increasing saturation"],ans:"Adding black to the colour",exp:"A shade is made by adding black to a colour. This decreases value while keeping the hue. Navy is a shade of blue. Maroon is a shade of red. Covered in detail in CT03 - Tint, Tone, Shade."},
  {id:"q20",q:"Which HSV property does the colour wheel in CT01 primarily represent?",opts:["Saturation","Value","Hue","All three equally"],ans:"Hue",exp:"The colour wheel shows hue - the identity of each colour and its position relative to others. Saturation and value are not shown on the standard colour wheel. They are separate dimensions."},
  {id:"q21",q:"In Photoshop and Figma colour pickers, the horizontal axis of the colour square controls:",opts:["Hue","Saturation","Value","Temperature"],ans:"Saturation",exp:"In most digital colour pickers, the large square shows saturation on the horizontal axis (left = desaturated/grey, right = fully saturated) and value on the vertical axis (up = light, down = dark)."},
  {id:"q22",q:"In Photoshop and Figma colour pickers, the vertical axis of the colour square controls:",opts:["Hue","Saturation","Value","Temperature"],ans:"Value",exp:"The vertical axis of the colour picker square controls value. Top = maximum lightness (white). Bottom = minimum lightness (black). This is independent of which hue or saturation is selected."},
  {id:"q23",q:"Two colours look identical in black and white but completely different in colour. What is different about them?",opts:["Only their value","Only their saturation","Only their hue","Their hue and/or saturation but not their value"],ans:"Their hue and/or saturation but not their value",exp:"If two colours look identical when converted to black and white (greyscale), it means they have the same value (lightness). They only differ in hue and/or saturation. This is a common accessibility problem."},
  {id:"q24",q:"A colour at maximum value (100%) is:",opts:["Black","Pure grey","White","The most vivid version of that hue"],ans:"White",exp:"At maximum value (100%), any colour becomes white regardless of its hue and saturation. Value at 100% means maximum lightness = white. This is why adding white to any colour creates a tint."},
  {id:"q25",q:"A colour at minimum value (0%) is:",opts:["Black","Pure grey","White","The most vivid version of that hue"],ans:"Black",exp:"At minimum value (0%), any colour becomes black regardless of hue and saturation. Value at 0% means no lightness = black. This is why adding black to any colour creates a shade."},
  {id:"q26",q:"Which HSV property determines if a colour feels vivid or muted?",opts:["Hue","Value","Saturation","All three equally"],ans:"Saturation",exp:"Saturation determines vivid vs muted. High saturation = vivid, energetic, obvious. Low saturation = muted, sophisticated, refined. This is the primary tool for making colours feel more or less intense."},
  {id:"q27",q:"Which HSV property determines if a colour feels light or dark?",opts:["Hue","Value","Saturation","Temperature"],ans:"Value",exp:"Value determines light vs dark. High value = light colours (pastels, whites). Low value = dark colours (shadows, deep tones). Value is the primary driver of contrast in any design."},
  {id:"q28",q:"Which HSV property determines what colour family a colour belongs to?",opts:["Hue","Value","Saturation","Chroma"],ans:"Hue",exp:"Hue determines colour family - Red, Blue, Green, Yellow etc. Even if saturation is 0% (grey) or value is 0% (black), the hue tells you which colour family it belongs to when saturation and value are restored."},
  {id:"q29",q:"A monochromatic colour palette uses variations of:",opts:["Multiple hues at the same value","One hue at different values and saturations","Multiple saturations of complementary colours","One value at multiple hues"],ans:"One hue at different values and saturations",exp:"Monochromatic = one hue. The variation comes from changing value (lighter/darker) and saturation (more or less vivid). This creates a cohesive palette from a single hue."},
  {id:"q30",q:"Which of these colour pairs has the same hue but different values?",opts:["Red and Blue","Navy Blue and Sky Blue","Pure Red and Desaturated Red","Orange and Yellow"],ans:"Navy Blue and Sky Blue",exp:"Navy Blue and Sky Blue are both Blue hue, but Navy has very low value (dark) while Sky Blue has high value (light). Same hue, same or similar saturation, different value."},
  {id:"q31",q:"Why do photographers convert photos to greyscale to check composition?",opts:["To see the colours more clearly","To check value contrast without colour distraction","To increase saturation","To check hue relationships"],ans:"To check value contrast without colour distraction",exp:"Greyscale removes hue and saturation, leaving only value. This reveals whether a composition has strong light-to-dark contrast. A photo with poor value contrast will look flat even in full colour."},
  {id:"q32",q:"A colour with high saturation and high value is likely to appear:",opts:["Deep and rich","Pale and washed out","Vivid and bright","Dark and moody"],ans:"Vivid and bright",exp:"High saturation = full intensity. High value = maximum lightness. Together they produce vivid, bright colours - like neon yellow or bright cyan. These are the most energetic colour combinations."},
  {id:"q33",q:"A colour with low saturation and low value is likely to appear:",opts:["Vivid and bright","Dark and muted","Pale and washed out","Pure and clean"],ans:"Dark and muted",exp:"Low saturation = greyed/muted. Low value = dark. Together they produce dark, muted colours - like charcoal, dark olive, or deep muted burgundy. Sophisticated and subdued."},
  {id:"q34",q:"Which HSV property does adding grey to a colour primarily affect?",opts:["Hue","Value","Saturation","None - grey has no effect"],ans:"Saturation",exp:"Adding grey to a colour reduces its saturation without significantly changing its hue or value. A tone is created by adding grey. This is different from adding white (increases value) or black (decreases value)."},
  {id:"q35",q:"In the HSB colour model used in most software, what does the B stand for?",opts:["Blue","Brightness","Balance","Base"],ans:"Brightness",exp:"HSB stands for Hue, Saturation, Brightness - where Brightness is equivalent to Value. Some software uses HSB, some uses HSV. They refer to the same three-axis system of colour description."},
  {id:"q36",q:"A designer wants to create a dark version of orange for a shadow effect. Which property should they reduce?",opts:["Hue","Saturation","Value","Temperature"],ans:"Value",exp:"To create a darker version of any colour while keeping it recognisably the same colour, reduce value. This is how shadow colours are created from base colours - same hue, same or slightly increased saturation, lower value."},
  {id:"q37",q:"A designer wants to create a highlight version of blue. Which property should they increase?",opts:["Hue","Saturation","Value","Temperature"],ans:"Value",exp:"To create a lighter, highlight version of any colour, increase value. This moves the colour toward white while keeping the hue. Same hue, same saturation, higher value = lighter, brighter version."},
  {id:"q38",q:"Which of these is NOT a dimension of colour in the HSV model?",opts:["Hue","Saturation","Value","Temperature"],ans:"Temperature",exp:"Temperature (warm vs cool) is a perceptual quality of colour, not a dimension in the HSV model. HSV has exactly three dimensions: Hue (identity), Saturation (intensity), Value (lightness). Temperature is covered in CT05."},
  {id:"q39",q:"Two colours with identical hue and value but different saturation will:",opts:["Look identical","Have different lightness levels","Have the same overall energy but different vividness","Belong to different colour families"],ans:"Have the same overall energy but different vividness",exp:"Identical hue = same colour family. Identical value = same lightness level. Different saturation = different intensity. One will look vivid, one will look muted - but both will be equally light or dark."},
  {id:"q40",q:"Why do most professional design tools use HSB or HSL instead of RGB for colour selection?",opts:["RGB is more accurate","HSB is easier to understand intuitively","RGB cannot display all colours","HSB uses less processing power"],ans:"HSB is easier to understand intuitively",exp:"RGB values (0-255 for each channel) are not intuitive for designers. HSB maps to how humans think about colour - what colour is it (hue), how vivid (saturation), how light or dark (brightness/value). Much more natural for creative decisions."},
  {id:"q41",q:"A brand colour is described as vivid red. A designer accidentally uses a desaturated version. What changed?",opts:["The hue changed","The value changed","The saturation changed - the colour lost its vividness","Both hue and value changed"],ans:"The saturation changed - the colour lost its vividness",exp:"A desaturated red has the same hue and value as vivid red, but lower saturation. It appears as a dusty, muted, or washed-out red instead of a vivid one. Brand colour consistency requires matching all three: hue, saturation, and value."},
  {id:"q42",q:"Which colour theorist is most associated with formalizing HSV as a design tool?",opts:["Moses Harris","Johannes Itten","Albert Munsell","Josef Albers"],ans:"Albert Munsell",exp:"Albert Munsell (1858-1918) formalized the three-axis colour description system. His Hue-Value-Chroma model is the direct ancestor of the HSV/HSB system used in all modern design software."},
  {id:"q43",q:"Josef Albers taught colour theory at which institution?",opts:["Bauhaus only","Yale University","Royal College of Art","Both Bauhaus and Yale"],ans:"Both Bauhaus and Yale",exp:"Josef Albers taught at the Bauhaus in Germany and later at Yale University in the USA after emigrating. His book Interaction of Color (1963) remains one of the most important colour theory texts ever written."},
  {id:"q44",q:"A colour appears different when placed on a black background vs a white background. Which HSV property is being affected perceptually?",opts:["Hue","Saturation","Value","All three"],ans:"Value",exp:"When the same colour is placed on black vs white, its perceived lightness changes. On black it appears lighter; on white it appears darker. This is a value perception effect - the colour's actual HSV values are unchanged, but it is perceived differently."},
  {id:"q45",q:"What does it mean when a designer says a colour palette is too saturated?",opts:["The colours are too dark","The colours are too vivid and intense, competing for attention","The colours are too light","The hues are too similar"],ans:"The colours are too vivid and intense, competing for attention",exp:"When a palette is too saturated, every colour is fighting for attention at full intensity. Nothing recedes. The result is visual noise. The fix is to reduce saturation on secondary and background colours, reserving high saturation for the most important elements."},
  {id:"q46",q:"In HSV, which value produces pure black regardless of hue and saturation?",opts:["V = 100","V = 50","V = 0","S = 0"],ans:"V = 0",exp:"When Value = 0, the result is always pure black, regardless of what hue or saturation is set. No light = black. This is why any colour, when given V=0, becomes black."},
  {id:"q47",q:"Which combination produces a pure white in the HSV model?",opts:["H=0, S=0, V=100","H=0, S=100, V=100","H=0, S=0, V=0","H=0, S=100, V=0"],ans:"H=0, S=0, V=100",exp:"Pure white = S=0 (no saturation, so no colour) and V=100 (maximum brightness). Hue is irrelevant when saturation is 0. Any colour with S=0, V=100 produces white."},
  {id:"q48",q:"A designer is looking at two versions of a logo. In greyscale, they look identical. In colour, one is red and one is blue. What does this tell us?",opts:["The logos use the same hue","The logos have the same value","The logos have different saturation levels","The logos are identical"],ans:"The logos have the same value",exp:"If two colours look identical in greyscale (black and white), they have the same value (lightness). The greyscale conversion strips out hue and saturation, leaving only value. Same greyscale = same value."},
  {id:"q49",q:"Which HSV property would a designer adjust to make a colour look more faded or vintage?",opts:["Increase hue","Reduce saturation","Increase value","Reduce hue"],ans:"Reduce saturation",exp:"The vintage or faded look is achieved by reducing saturation. Old photographs and vintage designs have muted, low-saturation colours because dyes and pigments fade over time, losing their intensity. Designers replicate this by desaturating colours."},
  {id:"q50",q:"A colour picker shows H:200, S:80, V:60. If you change only S to 20, what changes?",opts:["The colour becomes lighter","The colour becomes a different hue","The colour becomes more muted and less vivid","The colour becomes darker"],ans:"The colour becomes more muted and less vivid",exp:"Reducing saturation from 80 to 20 while keeping H (hue) and V (value) the same makes the colour less vivid and more muted. The hue remains identifiable as blue (H:200) and the lightness stays the same (V:60), but the intensity drops significantly."},
];

const CB_QUESTIONS=[
  {id:"cb1",q:"A colour has H:0 (Red), S:100%, V:100%. You reduce only the Value to 30%. What do you get?",opts:["A pale pink","A dark rich red","A grey","A brighter red"],ans:"A dark rich red",exp:"Keeping hue (Red) and saturation (100%) but reducing value to 30% gives a dark, deep red - like burgundy or maroon. Value controls lightness/darkness."},
  {id:"cb2",q:"A colour has H:240 (Blue), S:100%, V:100%. You reduce only Saturation to 0%. What do you get?",opts:["Black","White","A shade of grey","Pure blue"],ans:"A shade of grey",exp:"At S=0% with V=100%, all colour information is removed and you get light grey. The hue no longer matters when saturation is zero."},
  {id:"cb3",q:"Two colours: one is H:120, S:80, V:90 and the other is H:120, S:80, V:30. What is different?",opts:["Their hue","Their saturation","Their value - one is much lighter, one is much darker","Nothing, they are the same colour"],ans:"Their value - one is much lighter, one is much darker",exp:"Same hue (120 = Green), same saturation (80%), but V:90 is a bright light green while V:30 is a dark deep green. Value is the only difference."},
  {id:"cb4",q:"A designer wants the brand orange to feel more sophisticated and less loud. What should they adjust?",opts:["Increase the value","Reduce the saturation slightly","Change the hue","Reduce the value to zero"],ans:"Reduce the saturation slightly",exp:"Slightly reducing saturation takes the raw vividness out of orange without changing what it is. The result is a more refined, sophisticated version of the same colour. Luxury brands use this technique."},
  {id:"cb5",q:"Which colour has the highest value? A: H:0, S:50, V:20 — B: H:200, S:80, V:90 — C: H:60, S:100, V:60",opts:["A","B","C","They are all the same"],ans:"B",exp:"Value (V) determines lightness. V:20 (A) is dark. V:60 (C) is medium. V:90 (B) is the brightest. Highest value = lightest colour, regardless of hue or saturation."},
  {id:"cb6",q:"Which colour has the lowest saturation? A: H:0, S:90, V:50 — B: H:120, S:15, V:70 — C: H:240, S:60, V:40",opts:["A","B","C","They are all the same"],ans:"B",exp:"Saturation: A=90%, B=15%, C=60%. B has the lowest saturation at 15%, making it the most muted and grey-like of the three, even though its value is the highest."},
  {id:"cb7",q:"A designer converts their design to greyscale and notices two important elements look almost identical. What is the problem?",opts:["The hues are too similar","The saturation is too high","The value (lightness) of the two elements is too similar","The colours are complementary"],ans:"The value (lightness) of the two elements is too similar",exp:"Greyscale only shows value. If elements look identical in greyscale, they have the same lightness. Even if they are different hues, they will have poor contrast and compete with each other."},
  {id:"cb8",q:"A brand colour is described as vivid teal. Which HSV range best describes it?",opts:["H:170-190, S:10-30, V:50-70","H:170-190, S:80-100, V:70-90","H:0-20, S:80-100, V:70-90","H:170-190, S:80-100, V:10-30"],ans:"H:170-190, S:80-100, V:70-90",exp:"Teal sits around H:170-190 (between green and blue). Vivid = high saturation (80-100%). Not dark, not light = medium-high value (70-90%). Correct answer gives vivid, bright teal."},
  {id:"cb9",q:"Which adjustment creates a pastel version of any colour?",opts:["Increase saturation, keep value","Decrease saturation to near 0, increase value high","Decrease value to near 0","Keep all values the same"],ans:"Decrease saturation to near 0, increase value high",exp:"Pastels = low saturation (muted, greyed) + high value (light). The combination produces soft, washed-out, delicate colours. Baby pink, mint green, lavender are all pastels."},
  {id:"cb10",q:"A photographer says a photo has flat lighting. In HSV terms, what does this mean?",opts:["The hues are too similar","The saturation is too low","The value range is too narrow - not enough contrast between lights and darks","The colours are too vivid"],ans:"The value range is too narrow - not enough contrast between lights and darks",exp:"Flat lighting in photography means there is little difference between the lightest and darkest parts of the image. In HSV terms, the value range is too compressed. Adding contrast means stretching the value range - darker darks and lighter lights."},
  {id:"cb11",q:"Two designs use the exact same hue. One feels energetic, one feels calm. What is different?",opts:["Their value","Their saturation - the energetic one is more saturated","Their hue - they must be slightly different","Their temperature"],ans:"Their saturation - the energetic one is more saturated",exp:"Same hue but different energy = different saturation. High saturation = vivid, energetic, attention-grabbing. Low saturation = muted, calm, sophisticated. Saturation directly controls the energy level of a colour."},
  {id:"cb12",q:"What value level would you assign to pure white?",opts:["V = 0","V = 50","V = 100","V depends on the hue"],ans:"V = 100",exp:"Pure white = maximum brightness = V = 100. White is achieved when value is at maximum, regardless of hue or saturation (though typically S=0 as well). V=100 is the ceiling of the brightness dimension."},
  {id:"cb13",q:"A colour at H:60, S:100, V:100 is vivid yellow. What does H:60, S:100, V:0 produce?",opts:["Dark yellow","Brown","Black","Dark grey"],ans:"Black",exp:"V=0 always produces black, regardless of hue and saturation. No brightness = no colour perception = black. This is why any colour taken to V=0 becomes black."},
  {id:"cb14",q:"A designer wants to create a shadow colour for a vivid green button. What is the correct approach?",opts:["Use black as shadow","Use a darker, slightly more saturated version of the same green hue","Use a complementary red","Use grey"],ans:"Use a darker, slightly more saturated version of the same green hue",exp:"Good shadow colours stay in the same hue family as the object. Reduce value (darker) and optionally increase saturation slightly. Using black or grey creates a lifeless shadow. Keeping the hue creates a natural, realistic shadow."},
  {id:"cb15",q:"Which of these best describes a tone of a colour?",opts:["A colour with black added","A colour with white added","A colour with grey added","A colour at maximum saturation"],ans:"A colour with grey added",exp:"A tone is created by adding grey to a colour. This reduces saturation without significantly changing value. Tones are muted versions of colours - neither lighter nor darker, just less intense. Covered in detail in CT03."},
  {id:"cb16",q:"A client asks for a colour that feels both professional and vibrant. Which combination of properties would achieve this?",opts:["Low saturation, low value","High saturation, medium-high value","Low saturation, high value","High saturation, very low value"],ans:"High saturation, medium-high value",exp:"Professional + vibrant = high saturation (vivid, not muted) + medium-high value (bright but not washed out). Very high value would make it look pale; very low value would make it look dark and heavy. Medium-high value keeps it bright and professional."},
  {id:"cb17",q:"A brand has a specific navy blue: H:230, S:70, V:35. A junior designer uses H:230, S:70, V:80. What is wrong?",opts:["The hue is wrong","The saturation is wrong","The value is wrong - the colour is too light","Nothing is wrong"],ans:"The value is wrong - the colour is too light",exp:"Navy blue has low value (dark). V:80 is too light - it would produce a medium blue, not navy. Brand colours require all three HSV values to match precisely. V:35 (dark) to V:80 (medium) is a significant difference."},
  {id:"cb18",q:"Which HSV property creates the most impact on contrast between two colours?",opts:["Hue difference","Saturation difference","Value difference","Temperature difference"],ans:"Value difference",exp:"Value difference creates the strongest contrast perception. Black and white (maximum value difference) is the highest contrast possible. Hue difference alone, without value difference, creates weak contrast. Value is the foundation of all contrast in design."},
  {id:"cb19",q:"A UI designer needs a disabled state for a button. The active state is H:200, S:90, V:70. What should the disabled state be?",opts:["H:200, S:90, V:30","H:200, S:20, V:70","H:20, S:90, V:70","H:200, S:90, V:100"],ans:"H:200, S:20, V:70",exp:"A disabled state should look muted and inactive - same hue and value (so it is recognisably the same button), but much lower saturation. S:20 makes it look grey and inactive while retaining its colour identity."},
  {id:"cb20",q:"An artist mixes paint and notices the more colours they add, the muddier it gets. In HSV terms, what is happening?",opts:["Value is increasing","Hue is shifting","Saturation is decreasing as pigments mix","Value is decreasing"],ans:"Saturation is decreasing as pigments mix",exp:"Physical pigment mixing is subtractive. Each pigment absorbs light. Adding more pigments means more light absorption and less saturation. The result is a muddy, low-saturation colour. This is different from mixing light (additive), where mixing increases brightness."},
  {id:"cb21",q:"Which property should a designer use to ensure their colour palette has visible hierarchy?",opts:["Varying hues only","Varying saturation only","Varying value to create light-to-dark contrast","Varying temperature only"],ans:"Varying value to create light-to-dark contrast",exp:"Visual hierarchy requires contrast. Value contrast - differences in lightness - is the most powerful tool for creating hierarchy. Backgrounds are light or dark; foreground elements contrast with them. Hue and saturation support but value leads."},
  {id:"cb22",q:"A colour described as dusty rose has which approximate HSV profile?",opts:["H:350, S:90, V:80","H:350, S:25, V:80","H:350, S:25, V:20","H:350, S:90, V:20"],ans:"H:350, S:25, V:80",exp:"Dusty rose = pinkish-red hue (H:350), muted/desaturated (S:25 - the dusty quality comes from low saturation), and relatively light (V:80 - rose, not dark). Low saturation and high value together create the soft, vintage quality of dusty rose."},
  {id:"cb23",q:"A designer is building a dark mode interface. Which value range should backgrounds use?",opts:["V: 80-100","V: 50-70","V: 5-20","V: 0 only"],ans:"V: 5-20",exp:"Dark mode backgrounds should have very low value (dark) but not pure black (V=0). V:5-20 gives rich dark backgrounds with slight colour personality - like dark navy, dark grey, or near-black. Pure black (V=0) can feel harsh."},
  {id:"cb24",q:"Two designers argue about a colour. One calls it teal, the other calls it blue-green. They agree it is vivid and medium-light. What HSV property do they agree on?",opts:["Hue","Saturation and Value","Hue, Saturation and Value","None"],ans:"Saturation and Value",exp:"They disagree on hue (teal vs blue-green - these are close but different names). They agree it is vivid (high saturation) and medium-light (medium-high value). So they agree on saturation and value, but not the exact hue."},
  {id:"cb25",q:"Which HSV adjustment best replicates the effect of adding more light to a scene in photography?",opts:["Increase saturation","Increase value","Reduce hue","Reduce saturation"],ans:"Increase value",exp:"In photography, more light = higher brightness. In HSV terms, brightness = value. Increasing value simulates adding light to a scene - colours become lighter and brighter. This is directly analogous to increasing exposure in photography."},
];

const BRAND_BANK=[
  {name:"Tiffany",c1:"#0ABAB5",c2:"#FFFFFF",hint:"Specific Blue-Green tertiary, high value, medium saturation",ans:"high value medium saturation",exp:"Tiffany Blue is not fully saturated. It sits at medium saturation and high value - bright but not vivid. This gives it a premium, refined quality rather than looking cheap or garish."},
  {name:"Hermès",c1:"#FF6600",c2:"#FFFFFF",hint:"Red-Orange, high saturation, high value",ans:"high saturation high value",exp:"Hermès uses a vivid, bright Red-Orange at high saturation and high value. The combination creates energy and confidence without being dark or muted. The high value keeps it from feeling heavy."},
  {name:"Cadbury",c1:"#4B0082",c2:"#EDB200",hint:"Deep Violet - low value, high saturation",ans:"low value high saturation",exp:"Cadbury's purple is deep and rich - high saturation but very low value (dark). The low value creates luxury and depth. Combined with gold, it communicates premium quality and richness."},
  {name:"Coca-Cola",c1:"#F40009",c2:"#FFFFFF",hint:"Pure Red at high saturation and high value",ans:"high saturation high value",exp:"Coca-Cola red is vivid and bright - maximum saturation and high value. This creates urgency, energy, and appetite. The high value keeps it bright and visible rather than dark."},
  {name:"Barbie",c1:"#E0218A",c2:"#FFFFFF",hint:"Hot Pink - high saturation, high value",ans:"high saturation high value",exp:"Barbie pink is high saturation (vivid, intense) and high value (bright). The combination creates maximum energy and playfulness. Low saturation would have made it dull; low value would have made it dark and heavy."},
  {name:"Supreme",c1:"#FF0000",c2:"#FFFFFF",hint:"Pure Red at S=100, V=100",ans:"maximum saturation maximum value",exp:"Supreme uses pure red at maximum saturation and maximum value - the most vivid, brightest red possible. This creates the maximum visual impact. It works because they use it sparingly on a white background."},
  {name:"Chanel",c1:"#000000",c2:"#FFFFFF",hint:"Black and White - extreme values, zero saturation",ans:"zero saturation maximum value contrast",exp:"Chanel uses black (V=0, S=0) and white (V=100, S=0). Zero saturation, maximum value contrast. The absence of hue and saturation creates pure, timeless luxury through value contrast alone."},
  {name:"Google",c1:"#4285F4",c2:"#FFFFFF",hint:"Blue at medium saturation and high value",ans:"medium saturation high value",exp:"Google blue is at medium saturation - vivid but not aggressive. High value keeps it bright and approachable. The balance communicates trustworthiness and approachability rather than dominance."},
  {name:"Spotify",c1:"#1DB954",c2:"#191414",hint:"Vivid green at high saturation against near-black",ans:"high saturation against very low value",exp:"Spotify green is high saturation (vivid) against near-black (very low value). The extreme value contrast between the green and the background makes the green appear even more vivid - a value contrast amplification effect."},
  {name:"Pastel Brand",c1:"#FFB3BA",c2:"#BAFFC9",hint:"Two pastels - low saturation, high value",ans:"low saturation high value",exp:"Pastel palettes use low saturation and high value for all colours. The result is gentle, soft, and approachable. Used by brands targeting gentleness, care, and femininity. Both low saturation and high value work together to create the pastel quality."},
  {name:"Louis Vuitton",c1:"#8B6914",c2:"#1A1A1A",hint:"Gold on near-black - medium saturation, medium value",ans:"medium saturation medium value",exp:"Louis Vuitton gold sits at medium saturation and medium value - not too vivid, not too dark. Against near-black it creates maximum value contrast. The restrained saturation of the gold signals refinement rather than garishness."},
  {name:"Mint Brand",c1:"#98FF98",c2:"#FFFFFF",hint:"Mint green - low saturation, very high value",ans:"low saturation very high value",exp:"Mint green has very low saturation (almost grey-green) and very high value (close to white). This produces the fresh, clean, light quality of mint. Used by wellness and health brands for its calming, gentle feel."},
  {name:"Nike",c1:"#111111",c2:"#FFFFFF",hint:"Near-black and white - extreme value contrast, near-zero saturation",ans:"extreme value contrast",exp:"Nike uses near-black (not pure black) and white. The near-black at very low value and saturation, against white at maximum value, creates the strongest possible contrast. Bold, confident, simple."},
  {name:"Instagram",c1:"#833AB4",c2:"#FD1D1D",hint:"Purple to Red gradient - high saturation across different hues, similar value",ans:"high saturation similar value",exp:"Instagram uses high saturation across multiple hues in its gradient. The saturation stays consistently high across the hues. The similar value level across the gradient keeps it from feeling disjointed - consistent energy level throughout."},
  {name:"Airbnb",c1:"#FF5A5F",c2:"#FFFFFF",hint:"Coral red - medium-high saturation, high value",ans:"medium-high saturation high value",exp:"Airbnb coral is at medium-high saturation (vivid but not aggressive) and high value (bright and welcoming). The balance between vividness and lightness creates warmth and approachability - perfect for a hospitality brand."},
];

export default function CT02HueSaturationValue(){
  const[step,setStep]=useState(1);
  const[hue,setHue]=useState(200);
  const[sat,setSat]=useState(80);
  const[val,setVal]=useState(70);
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
  const top=useRef(null);
  function go(n){setStep(n);if(top.current)top.current.scrollIntoView({behavior:"smooth"});}

  const QS=useMemo(function(){
    return [...QUESTION_BANK].sort(function(){return Math.random()-0.5;}).slice(0,10);
  },[]);
  const CB_SET=useMemo(function(){
    return [...CB_QUESTIONS].sort(function(){return Math.random()-0.5;}).slice(0,5);
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
          <Tag>COLOUR THEORY - TOPIC 02</Tag>
          <h1 style={{fontSize:30,fontFamily:"Georgia,serif",margin:"10px 0 6px",lineHeight:1.1,color:T.white}}>Hue, Saturation and Value</h1>
          <p style={{fontSize:12.5,color:T.dim,margin:0}}>Albert Munsell 1905 - Josef Albers 1963</p>
        </div>
        <StepBar step={step} setStep={go}/>

        {step===1&&(
          <div>
            <Card style={{marginBottom:18,borderLeft:"4px solid "+T.brand}}>
              <Tag>THE STORY</Tag>
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 14px"}}>In 1905, an American art teacher named <span style={{color:T.brand,fontWeight:700}}>Albert Munsell</span> was frustrated. His students could not agree on what a colour actually was. One called it light blue. Another called it sky blue. Another called it pale blue. They were describing the same colour — but with no shared language, every conversation about colour was guesswork.</p>
              <p style={{fontSize:15,color:T.muted,lineHeight:1.75,margin:"0 0 12px"}}>So Munsell built a system. He measured colour across three independent axes: Hue (the colour identity), Value (its lightness or darkness), and Chroma (its intensity). For the first time, any colour in existence could be described precisely — not approximately, but exactly. His system became the foundation of every colour tool built since.</p>
              <p style={{fontSize:15,color:T.muted,lineHeight:1.75,margin:"0 0 12px"}}>In 1963, <span style={{color:T.white,fontWeight:700}}>Josef Albers</span> published Interaction of Color — showing that the same colour looks completely different depending on its context. His work proved that Hue, Saturation, and Value are not just technical measurements. They are the mechanism of visual perception itself.</p>
              <div style={{background:"#FFF0F2",border:"1px solid #FFE0E3",borderRadius:10,padding:14}}>
                <div style={{fontSize:12,color:T.red,fontWeight:700,marginBottom:6}}>You have seen this problem before</div>
                <div style={{fontSize:13.5,color:T.muted,lineHeight:1.7}}>Every time you picked a colour and it looked wrong — too harsh, too flat, too washed out, too dark — you were changing the wrong property. You changed the colour when you should have changed the brightness. Or you changed the brightness when you should have changed the intensity. Without knowing HSV, colour correction is always a guess.</div>
              </div>
            </Card>
            <Card style={{marginBottom:14}}>
              <Tag color={T.green}>WHAT THIS MEANS FOR YOU</Tag>
              <p style={{fontSize:14,color:T.muted,lineHeight:1.7,margin:"10px 0 14px"}}>HSV is the language of colour adjustment. Every colour picker in every tool you will ever use is built on these three properties.</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {q:"What is it?",a:"Three independent properties that together define any colour: Hue (identity), Saturation (intensity), Value (lightness)."},
                  {q:"Why does it exist?",a:"Because colour has no single axis. You cannot describe red precisely without knowing how vivid it is and how dark it is."},
                  {q:"How does it work?",a:"Change Hue = change the colour. Change Saturation = change the vividness. Change Value = change the lightness. Each works independently."},
                  {q:"How will you use it?",a:"Every time you adjust a colour in any tool — you are using HSV. Knowing what each axis does means you fix colour problems in one move instead of random trial and error."},
                  {q:"What if you skip it?",a:"You will keep adjusting colours randomly. A colour that is too dark needs its Value raised — not its Hue changed. Without HSV, you will change the wrong thing every time."},
                ].map(function(item){
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
              <p style={{fontSize:17,color:T.white,lineHeight:1.7,margin:"10px 0 0"}}>Every colour in existence can be described by exactly three numbers. These are the three properties every designer must understand.</p>
            </Card>

            <Card style={{marginBottom:14}}>
              <Tag color={T.brand}>HUE — THE COLOUR IDENTITY</Tag>
              <p style={{fontSize:13.5,color:T.muted,lineHeight:1.65,margin:"10px 0 10px"}}>Hue is the colour itself — its position on the colour wheel. Red is a hue. Blue is a hue. Yellow-Green is a hue. Hue answers the question: what colour is it?</p>
              <div style={{display:"flex",gap:4,marginBottom:10}}>
                {[0,30,60,90,120,150,180,210,240,270,300,330].map(function(h,i){
                  function hsvToHex(hh,s,v){s/=100;v/=100;const f=(n)=>{const k=(n+hh/60)%6;return v-v*s*Math.max(0,Math.min(k,4-k,1));};const toHex=(x)=>Math.round(x*255).toString(16).padStart(2,"0");return "#"+toHex(f(5))+toHex(f(3))+toHex(f(1));}
                  return <div key={i} style={{flex:1,height:32,borderRadius:4,background:hsvToHex(h,100,100)}}/>;
                })}
              </div>
              <div style={{fontSize:11,color:T.dim,textAlign:"center",marginBottom:10}}>12 hues — same saturation (100%), same value (100%), only hue changes</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <div style={{background:T.panel,borderRadius:8,padding:10}}>
                  <div style={{fontSize:12,color:T.brand,fontWeight:700,marginBottom:4}}>Key rule</div>
                  <div style={{fontSize:12.5,color:T.muted,lineHeight:1.6}}>Hue alone does not determine how a colour looks in use. A red can be vivid or muted, light or dark. Hue is just the starting identity.</div>
                </div>
                <div style={{background:T.panel,borderRadius:8,padding:10}}>
                  <div style={{fontSize:12,color:T.brand,fontWeight:700,marginBottom:4}}>In practice</div>
                  <div style={{fontSize:12.5,color:T.muted,lineHeight:1.6}}>When a client says the logo colour is wrong, they rarely mean the hue. They usually mean the saturation or value. Learn to ask: is the colour wrong, or just too dark, or too muted?</div>
                </div>
              </div>
            </Card>

            <Card style={{marginBottom:14}}>
              <Tag color="#A855F7">SATURATION — THE INTENSITY</Tag>
              <p style={{fontSize:13.5,color:T.muted,lineHeight:1.65,margin:"10px 0 10px"}}>Saturation is how vivid or muted a colour is. At 100% saturation, a colour is at its purest, most intense state. At 0%, it becomes grey. Saturation answers: how much colour is there?</p>
              <div style={{marginBottom:10}}>
                <div style={{display:"flex",gap:3,marginBottom:4}}>
                  {[100,80,60,40,20,0].map(function(s,i){
                    function hsvToHex(hh,ss,v){ss/=100;v/=100;const f=(n)=>{const k=(n+hh/60)%6;return v-v*ss*Math.max(0,Math.min(k,4-k,1));};const toHex=(x)=>Math.round(x*255).toString(16).padStart(2,"0");return "#"+toHex(f(5))+toHex(f(3))+toHex(f(1));}
                    return <div key={i} style={{flex:1,height:40,borderRadius:6,background:hsvToHex(200,s,80),display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,color:"rgba(255,255,255,.7)"}}>{s}%</span></div>;
                  })}
                </div>
                <div style={{fontSize:11,color:T.dim,textAlign:"center"}}>Same hue (Blue), same value — only saturation changes left to right</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <div style={{background:T.panel,borderRadius:8,padding:10}}>
                  <div style={{fontSize:12,color:"#A855F7",fontWeight:700,marginBottom:4}}>Key rule</div>
                  <div style={{fontSize:12.5,color:T.muted,lineHeight:1.6}}>Most amateur designs use saturation that is too high. Reducing saturation slightly on secondary elements makes the primary element feel more important. Not everything should be at 100%.</div>
                </div>
                <div style={{background:T.panel,borderRadius:8,padding:10}}>
                  <div style={{fontSize:12,color:"#A855F7",fontWeight:700,marginBottom:4}}>In practice</div>
                  <div style={{fontSize:12.5,color:T.muted,lineHeight:1.6}}>Premium and luxury brands almost never use 100% saturation. Hermes orange, Tiffany blue — both are at medium saturation. The restraint signals sophistication.</div>
                </div>
              </div>
            </Card>

            <Card style={{marginBottom:14}}>
              <Tag color="#4A9EFF">VALUE — THE LIGHTNESS</Tag>
              <p style={{fontSize:13.5,color:T.muted,lineHeight:1.65,margin:"10px 0 10px"}}>Value is how light or dark a colour is. At 100% value, the colour is at maximum brightness. At 0%, it becomes black. Value answers: how light or dark is it?</p>
              <div style={{marginBottom:10}}>
                <div style={{display:"flex",gap:3,marginBottom:4}}>
                  {[100,80,60,40,20,0].map(function(v,i){
                    function hsvToHex(hh,s,vv){s/=100;vv/=100;const f=(n)=>{const k=(n+hh/60)%6;return vv-vv*s*Math.max(0,Math.min(k,4-k,1));};const toHex=(x)=>Math.round(x*255).toString(16).padStart(2,"0");return "#"+toHex(f(5))+toHex(f(3))+toHex(f(1));}
                    return <div key={i} style={{flex:1,height:40,borderRadius:6,background:hsvToHex(200,80,v),display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,color:v>40?"rgba(0,0,0,.6)":"rgba(255,255,255,.7)"}}>{v}%</span></div>;
                  })}
                </div>
                <div style={{fontSize:11,color:T.dim,textAlign:"center"}}>Same hue (Blue), same saturation — only value changes left to right</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <div style={{background:T.panel,borderRadius:8,padding:10}}>
                  <div style={{fontSize:12,color:"#4A9EFF",fontWeight:700,marginBottom:4}}>Key rule</div>
                  <div style={{fontSize:12.5,color:T.muted,lineHeight:1.6}}>Value is the most important property for readability and contrast. Text and background must have sufficient value difference — not just hue difference. This is the foundation of accessibility.</div>
                </div>
                <div style={{background:T.panel,borderRadius:8,padding:10}}>
                  <div style={{fontSize:12,color:"#4A9EFF",fontWeight:700,marginBottom:4}}>In practice</div>
                  <div style={{fontSize:12.5,color:T.muted,lineHeight:1.6}}>Convert any design to greyscale. If elements disappear or look the same, they have the same value. Fix value contrast first, then worry about hue and saturation.</div>
                </div>
              </div>
            </Card>

            <Card style={{marginBottom:14}}>
              <Tag color={T.green}>HOW THE THREE WORK TOGETHER</Tag>
              <p style={{fontSize:13.5,color:T.muted,lineHeight:1.65,margin:"10px 0 10px"}}>Any colour is defined by all three simultaneously. Changing one changes the colour without changing the others.</p>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  {label:"Navy Blue",h:230,s:70,v:35,note:"Same hue as Sky Blue — lower value makes it dark"},
                  {label:"Sky Blue",h:200,s:60,v:85,note:"Same hue family — higher value makes it light"},
                  {label:"Steel Blue",h:210,s:25,v:65,note:"Similar hue — lower saturation makes it muted"},
                  {label:"Electric Blue",h:220,s:100,v:100,note:"Same hue family — max saturation + max value = vivid"},
                ].map(function(c){
                  function hsvToHex(hh,s,v){s/=100;v/=100;const f=(n)=>{const k=(n+hh/60)%6;return v-v*s*Math.max(0,Math.min(k,4-k,1));};const toHex=(x)=>Math.round(x*255).toString(16).padStart(2,"0");return "#"+toHex(f(5))+toHex(f(3))+toHex(f(1));}
                  const hex=hsvToHex(c.h,c.s,c.v);
                  return(
                    <div key={c.label} style={{display:"flex",gap:12,alignItems:"center",background:T.panel,borderRadius:10,padding:10}}>
                      <div style={{width:44,height:44,borderRadius:8,background:hex,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,color:T.white,fontWeight:700,marginBottom:2}}>{c.label}</div>
                        <div style={{fontSize:11,color:T.dim,marginBottom:2}}>H:{c.h} S:{c.s}% V:{c.v}%</div>
                        <div style={{fontSize:11,color:T.muted}}>{c.note}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card style={{marginBottom:18}}>
              <Tag color={T.brand}>EXPLORE — DO THIS NOW</Tag>
              <p style={{fontSize:13.5,color:T.muted,lineHeight:1.65,margin:"10px 0 6px"}}>Do not skip this. Move each slider independently. Watch what changes and what stays the same.</p>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
                {[
                  "Step 1 — Change Hue only. Notice the colour identity shifts but energy stays similar.",
                  "Step 2 — Change Saturation only. Notice it gets vivid or muted but not lighter or darker.",
                  "Step 3 — Change Value only. Notice it gets lighter or darker but the colour stays the same.",
                ].map(function(s,i){
                  return(
                    <div key={i} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 12px",background:T.panel,borderRadius:8}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:T.brand,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#0A0A0A",flexShrink:0}}>{i+1}</div>
                      <div style={{fontSize:12.5,color:T.muted}}>{s}</div>
                    </div>
                  );
                })}
              </div>
              <HSVSlider hue={hue} sat={sat} val={val} onHue={setHue} onSat={setSat} onVal={setVal}/>
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
              <p style={{fontSize:16,color:T.white,lineHeight:1.65,margin:"10px 0 4px"}}>5 HSV practice + 5 brand challenges. Complete each to unlock the next. First answer is final.</p>
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
                    <Tag color={myDone?(isCorrect?T.green:T.red):T.brand}>{"B"+(qi+1)+" of 5 - HSV Practice"}</Tag>
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
                  <p style={{fontSize:14,color:T.muted,lineHeight:1.6,margin:"0 0 12px"}}>Which HSV description best matches this brand colour decision?</p>
                  <div style={{display:"flex",gap:10,marginBottom:8}}>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c1,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>BRAND COLOUR</span></div>
                    <div style={{flex:1,height:68,borderRadius:10,background:brand.c2,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid "+T.border}}><span style={{fontSize:10,color:"rgba(0,0,0,.4)"}}>BACKGROUND</span></div>
                  </div>
                  <p style={{fontSize:11,color:T.dim,margin:"0 0 12px"}}>Hint: {brand.hint}</p>
                  {!myRev&&(
                    <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
                      {["high saturation high value","high saturation low value","low saturation high value","low saturation low value"].map(function(opt){
                        return(
                          <button key={opt}
                            onClick={function(){if(!myAns){const n=Object.assign({},ccAnswers);n[qi]=opt;setCcAnswers(n);}}}
                            style={{padding:"10px 14px",background:myAns===opt?"rgba(255,122,0,.15)":T.panel,border:"1px solid "+(myAns===opt?T.brand:T.border),borderRadius:10,color:myAns===opt?T.brand:T.muted,cursor:myAns?"default":"pointer",textAlign:"left",fontSize:13.5,textTransform:"capitalize"}}
                          >{opt}</button>
                        );
                      })}
                      {myAns&&<button onClick={function(){const n=Object.assign({},ccRevealed);n[qi]=true;setCcRevealed(n);}} style={{padding:11,background:T.brand,border:"none",borderRadius:10,color:"#0A0A0A",fontWeight:700,cursor:"pointer",fontSize:14,marginTop:4}}>Reveal answer</button>}
                    </div>
                  )}
                  {myRev&&(
                    <div style={{background:isCorrect?"rgba(45,198,83,.08)":"rgba(233,69,96,.08)",border:"1px solid "+(isCorrect?T.green:T.red),borderRadius:12,padding:14}}>
                      <div style={{fontWeight:700,color:isCorrect?T.green:T.red,marginBottom:6}}>{isCorrect?"Correct! +5 pts":"Wrong - 0 pts. Answer: "+brand.ans}</div>
                      <div style={{fontWeight:700,color:T.white,marginBottom:4}}>This is {brand.name}.</div>
                      <div style={{fontSize:13,color:T.muted,lineHeight:1.65,marginBottom:10}}>{brand.exp}</div>
                      {!myDone&&<button onClick={function(){const n=Object.assign({},ccAnswered);n[qi]=true;setCcAnswered(n);setCcIdx(qi+1);if(qi===4)setCcDone(true);}} style={{padding:"8px 18px",background:T.green,border:"none",borderRadius:8,color:"#0A0A0A",fontWeight:700,fontSize:13,cursor:"pointer"}}>Next</button>}
                    </div>
                  )}
                </Card>
              );
            })}

            {!cbDone&&(
              <div style={{textAlign:"center",padding:20,color:T.dim,fontSize:13}}>Complete all 5 HSV challenges to unlock Brand challenges</div>
            )}
            <Nav onBack={function(){go(3);}} onNext={function(){go(5);}} nextLabel={bothDone?"See takeaway":"Complete all challenges"} nextDisabled={!bothDone}/>
          </div>
        )}

        {step===5&&(
          <div>
            <Card style={{marginBottom:16,background:"rgba(255,122,0,.06)",borderLeft:"4px solid "+T.brand}}>
              <Tag>KEY TAKEAWAY</Tag>
              <p style={{fontSize:21,color:T.white,fontFamily:"Georgia,serif",lineHeight:1.5,margin:"12px 0 0"}}>Every colour problem has a cause. Hue, Saturation, or Value. Know which one to fix and you fix it in one move.</p>
            </Card>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
              {[
                {t:"For colour correction",b:"When a colour looks wrong, diagnose before you adjust. Is it the wrong colour (hue)? Too vivid or too dull (saturation)? Too light or too dark (value)? One axis at a time."},
                {t:"For building palettes",b:"A palette is not just different hues. It is different values and saturations of related hues. Vary value to create hierarchy. Vary saturation to create visual weight. Hue alone is not enough."},
                {t:"For brand consistency",b:"A brand colour is defined by all three numbers. Navy blue and sky blue are the same hue. They are not the same colour. When maintaining brand consistency, you need all three: hue, saturation, and value."},
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
                <div style={{fontSize:12.5,color:T.dim,lineHeight:1.6,paddingLeft:12,borderLeft:"2px solid "+T.border}}>Albert Munsell - A Color Notation (1905). First systematic three-axis colour description.</div>
                <div style={{fontSize:12.5,color:T.dim,lineHeight:1.6,paddingLeft:12,borderLeft:"2px solid "+T.border}}>Josef Albers - Interaction of Color (1963). Yale University Press.</div>
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
