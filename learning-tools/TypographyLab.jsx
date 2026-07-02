import{useState,useRef,useEffect}from"react";
const T={bg:"#FDF8F0",panel:"#FFFFFF",panel2:"#FFFFFF",border:"#E8DFCF",text:"#3A342A",muted:"#6B6258",dim:"#A79C8C",brand:"#FF7A00",white:"#1A1512",green:"#1E9E5A",red:"#D2334F"};

const FONTS=[
  {name:"Playfair Display",stack:"'Playfair Display', serif",cat:"Display Serif",g:"Playfair+Display:wght@400;700;900",vibe:"Luxury, fashion, editorial"},
  {name:"Cormorant Garamond",stack:"'Cormorant Garamond', serif",cat:"Display Serif",g:"Cormorant+Garamond:wght@400;500;600",vibe:"Elegant, refined, premium"},
  {name:"Lora",stack:"'Lora', serif",cat:"Serif",g:"Lora:wght@400;500;600;700",vibe:"Readable, warm, literary"},
  {name:"Merriweather",stack:"'Merriweather', serif",cat:"Serif",g:"Merriweather:wght@400;700;900",vibe:"Trustworthy, classic, long-read"},
  {name:"Source Serif 4",stack:"'Source Serif 4', serif",cat:"Serif",g:"Source+Serif+4:wght@400;600;700",vibe:"Modern editorial, clean"},
  {name:"EB Garamond",stack:"'EB Garamond', serif",cat:"Serif",g:"EB+Garamond:wght@400;500;600",vibe:"Scholarly, timeless, book"},
  {name:"Inter",stack:"'Inter', sans-serif",cat:"Neo-Grotesque",g:"Inter:wght@400;500;600;700",vibe:"UI standard, neutral, crisp"},
  {name:"Manrope",stack:"'Manrope', sans-serif",cat:"Geometric Sans",g:"Manrope:wght@400;500;700;800",vibe:"Modern, friendly tech"},
  {name:"Poppins",stack:"'Poppins', sans-serif",cat:"Geometric Sans",g:"Poppins:wght@400;500;600;700",vibe:"Geometric, bold, contemporary"},
  {name:"Work Sans",stack:"'Work Sans', sans-serif",cat:"Sans",g:"Work+Sans:wght@400;500;600;700",vibe:"Versatile, balanced, modern"},
  {name:"DM Sans",stack:"'DM Sans', sans-serif",cat:"Geometric Sans",g:"DM+Sans:wght@400;500;700",vibe:"Low-contrast geometric, clean"},
  {name:"Space Grotesk",stack:"'Space Grotesk', sans-serif",cat:"Geometric Sans",g:"Space+Grotesk:wght@400;500;700",vibe:"Techy, distinctive, startup"},
  {name:"Plus Jakarta Sans",stack:"'Plus Jakarta Sans', sans-serif",cat:"Geometric Sans",g:"Plus+Jakarta+Sans:wght@400;500;600;700",vibe:"Premium SaaS, polished"},
  {name:"Outfit",stack:"'Outfit', sans-serif",cat:"Geometric Sans",g:"Outfit:wght@400;500;600;700",vibe:"Minimal, geometric, sleek"},
  {name:"Sora",stack:"'Sora', sans-serif",cat:"Geometric Sans",g:"Sora:wght@400;500;600;700",vibe:"Futuristic, tech, bold"},
  {name:"Figtree",stack:"'Figtree', sans-serif",cat:"Sans",g:"Figtree:wght@400;500;600;700",vibe:"Friendly, rounded, warm"},
  {name:"Libre Franklin",stack:"'Libre Franklin', sans-serif",cat:"Grotesque",g:"Libre+Franklin:wght@400;500;600;700",vibe:"American, editorial, strong"},
  {name:"Bricolage Grotesque",stack:"'Bricolage Grotesque', sans-serif",cat:"Display Sans",g:"Bricolage+Grotesque:wght@400;600;700;800",vibe:"Quirky, characterful, modern"},
  {name:"Fraunces",stack:"'Fraunces', serif",cat:"Display Serif",g:"Fraunces:wght@400;500;600;700",vibe:"Soft serif, warm, boutique"},
  {name:"JetBrains Mono",stack:"'JetBrains Mono', monospace",cat:"Mono",g:"JetBrains+Mono:wght@400;500;700",vibe:"Code, technical, precise"},
];

const PAIRINGS=[
  {h:0,b:2,label:"Playfair + Lora",vibe:"Luxury Editorial",note:"High-fashion magazine feel. Dramatic headline, warm readable body."},
  {h:8,b:6,label:"Poppins + Inter",vibe:"Modern Startup",note:"Clean geometric headline, neutral UI body. The SaaS standard."},
  {h:1,b:5,label:"Cormorant + EB Garamond",vibe:"Refined Boutique",note:"All-serif elegance. Wedding, beauty, premium brands."},
  {h:11,b:10,label:"Space Grotesk + DM Sans",vibe:"Tech Forward",note:"Distinctive techy headline, clean geometric body. Web3 / dev tools."},
  {h:18,b:2,label:"Fraunces + Lora",vibe:"Warm Editorial",note:"Soft characterful serif pairing. Boutique, food, lifestyle."},
  {h:12,b:6,label:"Plus Jakarta + Inter",vibe:"Premium SaaS",note:"Polished product feel. Modern dashboards & landing pages."},
  {h:3,b:9,label:"Merriweather + Work Sans",vibe:"Trusted Classic",note:"Credible serif headline, versatile sans body. News, finance."},
  {h:17,b:15,label:"Bricolage + Figtree",vibe:"Friendly Creative",note:"Characterful headline, warm rounded body. Agencies, creators."},
];

const GOOGLE_FONTS="https://fonts.googleapis.com/css2?"+FONTS.map(f=>"family="+f.g).join("&")+"&display=swap";

function Card({children,style={}}){return <div style={{background:T.panel2,border:`1px solid ${T.border}`,borderRadius:16,padding:20,...style}}>{children}</div>}
function Tag({children,color=T.brand}){return <span style={{fontSize:11,letterSpacing:3,color,fontWeight:700}}>{children}</span>}

export default function TypographyLab(){
  const[mode,setMode]=useState("tester");
  const[headFont,setHeadFont]=useState(0);
  const[bodyFont,setBodyFont]=useState(6);
  const[size,setSize]=useState(16);
  const[weight,setWeight]=useState(400);
  const[lh,setLh]=useState(1.5);
  const[tracking,setTracking]=useState(0);
  const[catFilter,setCatFilter]=useState("All");
  const[headText,setHeadText]=useState("The Art of Typography");
  const[bodyText,setBodyText]=useState("Good typography is invisible. When it works perfectly, the reader doesn't notice the type — they notice only the words. Every decision either helps the reader or quietly works against them.");
  const[activePairing,setActivePairing]=useState(null);
  const[suggestionsOpen,setSuggestionsOpen]=useState(false);
  const ref=useRef(null);

  useEffect(()=>{
    const id="typolab-fonts";
    if(!document.getElementById(id)){
      const link=document.createElement("link");
      link.id=id;link.rel="stylesheet";link.href=GOOGLE_FONTS;
      document.head.appendChild(link);
    }
  },[]);

  const hf=FONTS[headFont];
  const bf=FONTS[bodyFont];
  const charCount=Math.round(520*0.6/(size*0.5));
  const lineColor=charCount<45?T.red:charCount<=75?T.green:T.brand;
  const cats=["All",...Array.from(new Set(FONTS.map(f=>f.cat)))];
  const applyPairing=(p)=>{setActivePairing(p);setHeadFont(PAIRINGS[p].h);setBodyFont(PAIRINGS[p].b);setSuggestionsOpen(false);};

  const FontPicker=({selected,onSelect})=>(
    <div>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setCatFilter(c)} style={{padding:"4px 10px",borderRadius:14,border:`1px solid ${catFilter===c?T.brand:T.border}`,background:catFilter===c?"rgba(255,122,0,.12)":"transparent",color:catFilter===c?T.brand:T.dim,fontSize:10.5,cursor:"pointer"}}>{c}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:260,overflowY:"auto"}}>
        {FONTS.map((f,i)=>(catFilter==="All"||f.cat===catFilter)&&(
          <button key={i} onClick={()=>onSelect(i)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 13px",borderRadius:10,border:`1px solid ${selected===i?T.brand:T.border}`,background:selected===i?"rgba(255,122,0,.10)":T.panel,cursor:"pointer",textAlign:"left"}}>
            <span style={{fontFamily:f.stack,fontSize:16,color:selected===i?T.white:T.muted}}>{f.name}</span>
            <span style={{fontSize:10,color:T.dim,flexShrink:0,marginLeft:8}}>{f.cat}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={ref} style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'Inter',system-ui,sans-serif",padding:"32px 18px 60px"}}>
      <style>{`
        .tl-grid{display:grid;grid-template-columns:1fr;gap:20px;max-width:500px;margin:0 auto;}
        .tl-head{max-width:500px;margin:0 auto 24px;}
        .tl-wide{max-width:500px;margin:0 auto;}
        @media(min-width:860px){
          .tl-grid{grid-template-columns:1fr 1fr;gap:32px;max-width:1100px;align-items:start;}
          .tl-head{max-width:1100px;margin:0 auto 28px;}
          .tl-wide{max-width:1100px;margin:0 auto;}
        }
      `}</style>

      <div className="tl-head">
        <Tag>TYPOGRAPHY · INTERACTIVE TOOL</Tag>
        <h1 style={{fontSize:30,fontFamily:"'Playfair Display',Georgia,serif",margin:"10px 0 6px",color:T.white}}>Typography Lab</h1>
        <p style={{fontSize:13,color:T.dim,margin:"0 0 16px"}}>20 premium fonts · test, pair, and learn what each choice communicates — live.</p>
        <div style={{display:"flex",gap:8}}>
          {[["tester","Type Tester"],["pairing","Pairing Lab"]].map(([k,l])=>(
            <button key={k} onClick={()=>{setMode(k);setCatFilter("All");}} style={{padding:"10px 20px",borderRadius:12,border:`1px solid ${mode===k?T.brand:T.border}`,background:mode===k?"rgba(255,122,0,.12)":"transparent",color:mode===k?T.brand:T.muted,fontWeight:700,fontSize:13,cursor:"pointer"}}>{l}</button>
          ))}
        </div>
      </div>

      {mode==="tester"&&(
        <div className="tl-grid">
          {/* LEFT: Preview + Edit */}
          <div>
            <Card style={{marginBottom:16}}>
              <div style={{fontSize:10,color:T.dim,letterSpacing:2,marginBottom:12}}>LIVE PREVIEW · {bf.name}</div>
              <div style={{background:"#FFFFFF",borderRadius:12,padding:20,border:`1px solid ${T.border}`}}>
                <div style={{fontFamily:bf.stack,fontSize:size,fontWeight:weight,lineHeight:lh,letterSpacing:`${tracking}em`,color:T.white,transition:"all .12s"}}>{bodyText}</div>
              </div>
              <div style={{fontSize:11.5,color:T.dim,marginTop:10}}>💡 {bf.vibe}</div>
            </Card>
            <Card style={{marginBottom:16}}>
              <div style={{fontSize:10,color:T.dim,letterSpacing:2,marginBottom:10}}>EDIT TEXT</div>
              <textarea value={bodyText} onChange={e=>setBodyText(e.target.value)} rows={4} style={{width:"100%",background:T.panel,border:`1px solid ${T.border}`,borderRadius:10,padding:12,color:T.text,fontSize:13,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}}/>
            </Card>
            <div style={{borderLeft:`3px solid ${T.brand}`,paddingLeft:16,color:T.muted,fontSize:13.5,lineHeight:1.7}}>Try dropping size below 16px — notice how it gets hard to read on mobile. Set line-height to 1.0 — see how lines stick together.</div>
          </div>

          {/* RIGHT: Typeface + Controls */}
          <div>
            <Card style={{marginBottom:16}}>
              <div style={{fontSize:10,color:T.dim,letterSpacing:2,marginBottom:10}}>CHOOSE TYPEFACE</div>
              <FontPicker selected={bodyFont} onSelect={setBodyFont}/>
            </Card>
            <Card>
              <div style={{fontSize:10,color:T.dim,letterSpacing:2,marginBottom:14}}>CONTROLS</div>
              {[
                ["Size",size,setSize,11,40,1,"px",size,size<16?"⚠ below mobile minimum":size>28?"display size":"✓ body range"],
                ["Weight",weight,setWeight,100,900,100,"",weight,weight<400?"light":weight>700?"heavy":"normal"],
                ["Line Height",lh,setLh,1.0,2.2,0.05,"",lh.toFixed(2),lh<1.4?"tight":lh>1.7?"loose":"✓ comfortable"],
                ["Tracking",tracking,setTracking,-0.05,0.2,0.01,"em",tracking.toFixed(2),tracking<0?"tight":tracking>0.1?"wide":"normal"],
              ].map(([label,val,set,mn,mx,stp,unit,disp,hint])=>(
                <div key={label} style={{marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontSize:12,color:T.muted}}>{label}</span>
                    <span style={{fontSize:11,fontFamily:"monospace",color:T.brand}}>{disp}{unit} · {hint}</span>
                  </div>
                  <input type="range" min={mn} max={mx} step={stp} value={val} onChange={e=>set(parseFloat(e.target.value))} style={{width:"100%",accentColor:T.brand}}/>
                </div>
              ))}
              <div style={{paddingTop:4,borderTop:`1px solid ${T.border}`}}>
                <div style={{fontSize:11,color:T.dim,marginBottom:6}}>Estimated line length</div>
                <div style={{fontSize:13,fontWeight:700,color:lineColor}}>{charCount} characters/line · {charCount<45?"too short":charCount<=75?"optimal range":"too wide"}</div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {mode==="pairing"&&(
        <div>
          <div className="tl-grid">
            {/* LEFT: Live preview + Edit text */}
            <div>
              <Card style={{marginBottom:16}}>
                <div style={{fontSize:10,color:T.dim,letterSpacing:2,marginBottom:12}}>LIVE PAIRING · {hf.name} + {bf.name}</div>
                <div style={{background:"#FFFFFF",borderRadius:12,padding:20,border:`1px solid ${T.border}`}}>
                  <div style={{fontFamily:hf.stack,fontSize:28,fontWeight:700,color:T.white,lineHeight:1.2,marginBottom:10}}>{headText}</div>
                  <div style={{fontFamily:bf.stack,fontSize:15,color:T.muted,lineHeight:1.6}}>{bodyText}</div>
                </div>
              </Card>
              <Card>
                <div style={{fontSize:10,color:T.dim,letterSpacing:2,marginBottom:10}}>EDIT TEXT</div>
                <input value={headText} onChange={e=>setHeadText(e.target.value)} style={{width:"100%",background:T.panel,border:`1px solid ${T.border}`,borderRadius:10,padding:11,color:T.text,fontSize:13,marginBottom:8,boxSizing:"border-box"}} placeholder="Headline"/>
                <textarea value={bodyText} onChange={e=>setBodyText(e.target.value)} rows={3} style={{width:"100%",background:T.panel,border:`1px solid ${T.border}`,borderRadius:10,padding:11,color:T.text,fontSize:13,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}} placeholder="Body text"/>
              </Card>
            </div>

            {/* RIGHT: Font pickers + Pairing check */}
            <div>
              <Card style={{marginBottom:16}}>
                <div style={{fontSize:10,color:T.dim,letterSpacing:2,marginBottom:10}}>HEADLINE FONT</div>
                <FontPicker selected={headFont} onSelect={i=>{setHeadFont(i);setActivePairing(null);}}/>
              </Card>
              <Card style={{marginBottom:16}}>
                <div style={{fontSize:10,color:T.dim,letterSpacing:2,marginBottom:10}}>BODY FONT</div>
                <FontPicker selected={bodyFont} onSelect={i=>{setBodyFont(i);setActivePairing(null);}}/>
              </Card>
              <Card>
                <div style={{fontSize:10,color:T.dim,letterSpacing:2,marginBottom:10}}>PAIRING CHECK</div>
                {(()=>{
                  const sameFont=headFont===bodyFont;
                  const sameCat=hf.cat===bf.cat;
                  let verdict,color,msg;
                  if(sameFont){verdict="✓ Safe";color=T.green;msg="Same family — impossible to clash. Use weight & size for hierarchy.";}
                  else if(sameCat&&hf.cat!=="Mono"){verdict="⚠ Risky";color=T.brand;msg="Both fonts are "+hf.cat+" — they may be too similar. Pair different categories for clearer contrast.";}
                  else{verdict="✓ Good contrast";color=T.green;msg="Different categories ("+hf.cat+" head + "+bf.cat+" body) — clear contrast with harmony. Professional combination.";}
                  return <div style={{background:`${color}14`,border:`1px solid ${color}`,borderRadius:10,padding:14}}>
                    <div style={{fontWeight:700,color,marginBottom:6,fontSize:14}}>{verdict}</div>
                    <div style={{fontSize:13,color:T.muted,lineHeight:1.6}}>{msg}</div>
                  </div>;
                })()}
              </Card>
            </div>
          </div>

          {/* Suggestions — full width */}
          <div className="tl-wide" style={{marginTop:40,paddingTop:28,borderTop:`1px solid ${T.border}`}}>
            <button onClick={()=>setSuggestionsOpen(!suggestionsOpen)} style={{width:"100%",padding:"14px 18px",background:suggestionsOpen?"rgba(255,122,0,0.1)":T.panel2,border:`1px solid ${suggestionsOpen?T.brand:T.border}`,borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:suggestionsOpen?16:0,transition:"all 0.15s"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:16}}>✨</span>
                <div style={{textAlign:"left"}}>
                  <div style={{fontSize:13,fontWeight:700,color:suggestionsOpen?T.brand:T.white}}>Premium Font Pairings</div>
                  <div style={{fontSize:11,color:T.dim,marginTop:2}}>8 pro configs — one tap to apply to your canvas</div>
                </div>
              </div>
              <span style={{fontSize:18,color:suggestionsOpen?T.brand:T.dim,transition:"transform 0.15s",display:"inline-block",transform:suggestionsOpen?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
            </button>
            {suggestionsOpen&&(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {PAIRINGS.map((p,i)=>(
                  <div key={i} style={{padding:"12px 14px",background:activePairing===i?"rgba(255,122,0,0.08)":T.panel2,border:`1px solid ${activePairing===i?T.brand:T.border}`,borderRadius:10,display:"flex",alignItems:"center",gap:12}}>
                    <div style={{fontSize:11,color:T.dim,fontWeight:700,minWidth:22,textAlign:"right",fontFamily:"monospace"}}>{String(i+1).padStart(2,"0")}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                        <span style={{fontFamily:FONTS[p.h].stack,fontSize:13,color:T.white,fontWeight:700}}>{p.label}</span>
                        <span style={{fontSize:9,letterSpacing:2,color:T.brand,fontWeight:700,background:"rgba(255,122,0,0.1)",padding:"2px 6px",borderRadius:3}}>{p.vibe}</span>
                      </div>
                      <div style={{fontSize:11,color:T.dim,lineHeight:1.5}}>{p.note}</div>
                    </div>
                    <button onClick={()=>applyPairing(i)} style={{padding:"7px 14px",background:activePairing===i?T.green:T.brand,border:"none",borderRadius:8,color:"#FFFFFF",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>
                      {activePairing===i?"Applied ✓":"Apply"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
