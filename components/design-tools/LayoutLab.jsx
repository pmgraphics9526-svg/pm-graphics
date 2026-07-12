import{useState,useRef}from"react";
const T={bg:"#0B0B0B",panel:"#1A1A1A",panel2:"#1A1A1A",border:"rgba(255,255,255,0.1)",text:"#EDEDED",muted:"#AAAAAA",dim:"#999999",brand:"#FF7A00",white:"#FFFFFF",green:"#3ECB71",red:"#FF5C7A",blue:"#5B9CFF"};
// Canvas-local colours: the artboard mockups intentionally stay light/white
// paper regardless of site theme, so they don't read off T.border/T.panel2.
const CV_BORDER="#E8DFCF",CV_PANEL="#FFFFFF";

const GRID_TYPES=[
  {id:"manuscript",name:"Manuscript",cols:1,icon:"▬",desc:"Single column. Books, documentation, long-form articles.",useCase:"Best for: blog posts, articles, readability-first layouts.",rules:{col:1,gutterMin:0,gutterMax:0,marginMin:40,lineH:1.6}},
  {id:"col2",name:"2 Column",cols:2,icon:"▬▬",desc:"Two equal columns. Sidebars, comparison layouts.",useCase:"Best for: sidebars, two-panel apps, before/after.",rules:{col:2,gutterMin:16,gutterMax:32,marginMin:20,lineH:1.5}},
  {id:"col3",name:"3 Column",cols:3,icon:"▬▬▬",desc:"Three equal columns. Cards, features, team grids.",useCase:"Best for: product cards, feature sections, portfolios.",rules:{col:3,gutterMin:16,gutterMax:24,marginMin:16,lineH:1.5}},
  {id:"col4",name:"4 Column",cols:4,icon:"▬▬▬▬",desc:"Four columns. Dashboards, dense card layouts.",useCase:"Best for: dashboards, e-commerce, image galleries.",rules:{col:4,gutterMin:12,gutterMax:20,marginMin:12,lineH:1.4}},
  {id:"col12",name:"12 Column",cols:12,icon:"12",desc:"Web standard. Full responsive flexibility.",useCase:"Best for: full websites, responsive layouts, complex UIs.",rules:{col:12,gutterMin:16,gutterMax:32,marginMin:16,lineH:1.5}},
  {id:"asymmetric",name:"Asymmetric",cols:2,icon:"▬══",desc:"1:2 unequal split. Dynamic editorial feel.",useCase:"Best for: hero sections, feature highlights, news sites.",rules:{col:2,gutterMin:20,gutterMax:40,marginMin:16,lineH:1.5}},
  {id:"modular",name:"Modular",cols:3,icon:"⊞",desc:"Columns + rows = cells. Magazine, poster layouts.",useCase:"Best for: editorial design, poster, mixed content.",rules:{col:3,gutterMin:12,gutterMax:20,marginMin:16,lineH:1.5}},
];

const GUTTER_PRESETS=[
  {label:"Tight",val:8},{label:"Normal",val:16},{label:"Comfortable",val:24},{label:"Airy",val:40},
];

const LAYOUT_SUGGESTIONS=[
  {name:"SaaS Landing Page",grid:"asymmetric",gutter:32,margin:24,cols:2,tag:"Web",note:"1:2 split — headline left, hero visual right. Z-pattern flow."},
  {name:"Blog Article",grid:"manuscript",gutter:0,margin:40,cols:1,tag:"Content",note:"Single column, wide margins. Maximum readability."},
  {name:"E-commerce Grid",grid:"col4",gutter:16,margin:16,cols:4,tag:"Shop",note:"4 equal columns, tight gutter. Dense product display."},
  {name:"Dashboard",grid:"col12",gutter:16,margin:16,cols:12,tag:"App",note:"12-col flexibility. Mix 4+4+4 or 8+4 for sidebar."},
  {name:"Portfolio",grid:"col3",gutter:20,margin:20,cols:3,tag:"Creative",note:"3-column card grid. Comfortable breathing room."},
  {name:"News Homepage",grid:"asymmetric",gutter:24,margin:20,cols:2,tag:"Editorial",note:"Heavy hero left, stack of stories right. F-pattern."},
  {name:"Mobile App UI",grid:"col2",gutter:12,margin:16,cols:2,tag:"Mobile",note:"2 columns, tight gutter. Thumb-friendly card layout."},
  {name:"Agency Homepage",grid:"modular",gutter:16,margin:24,cols:3,tag:"Creative",note:"Modular cells. Mix image + text blocks freely."},
  {name:"Documentation",grid:"col2",gutter:32,margin:32,cols:2,tag:"Docs",note:"Sidebar (1) + content (2). Generous gutter for clarity."},
  {name:"Luxury Brand",grid:"manuscript",gutter:0,margin:64,cols:1,tag:"Premium",note:"Single column, huge margins. Space = price signal."},
  {name:"Pricing Page",grid:"col3",gutter:16,margin:24,cols:3,tag:"Web",note:"3 equal pricing cards. Consistent alignment."},
  {name:"Magazine Spread",grid:"modular",gutter:12,margin:16,cols:3,tag:"Editorial",note:"3×3 cells. Mix feature image + captions + pull quotes."},
  {name:"Team / About",grid:"col4",gutter:20,margin:24,cols:4,tag:"Web",note:"4-up team cards. Equal weight, consistent spacing."},
  {name:"Feature Section",grid:"col2",gutter:40,margin:24,cols:2,tag:"Web",note:"2 columns, airy gutter. Icon left, description right."},
  {name:"Analytics Dashboard",grid:"col12",gutter:12,margin:12,cols:12,tag:"App",note:"12-col grid. 6+3+3 or 4+4+4 for mixed widget sizes."},
  {name:"Newsletter",grid:"manuscript",gutter:0,margin:32,cols:1,tag:"Email",note:"Single column. 600px max-width, 32px side margins."},
  {name:"Startup Hero",grid:"col2",gutter:24,margin:20,cols:2,tag:"Web",note:"Headline+CTA left (1), product mockup right (1)."},
  {name:"Photo Gallery",grid:"col3",gutter:8,margin:8,cols:3,tag:"Creative",note:"3-col grid, minimal gutter. Images breathe in columns."},
  {name:"Fintech App",grid:"col12",gutter:16,margin:20,cols:12,tag:"App",note:"12-col. Dense data layout. 3+9 sidebar+content split."},
  {name:"Restaurant / Menu",grid:"col2",gutter:32,margin:28,cols:2,tag:"Premium",note:"2 col, generous gutter. Left: category. Right: items."},
];

function GridCanvas({type,gutter,margin,showGuides}){
  const g=GRID_TYPES.find(x=>x.id===type)||GRID_TYPES[0];
  const isAsym=type==="asymmetric";
  const cols=g.cols>6?6:g.cols;

  return(
    <div style={{background:CV_PANEL,borderRadius:10,padding:margin,border:`1px solid ${CV_BORDER}`,position:"relative",minHeight:150,overflow:"hidden"}}>
      {showGuides&&(
        <div style={{position:"absolute",inset:0,display:"flex",padding:margin,gap:0,pointerEvents:"none"}}>
          {isAsym?(
            <>
              <div style={{flex:1,background:"rgba(255,122,0,0.07)",border:"1px dashed rgba(255,122,0,0.25)",marginRight:gutter/2,borderRadius:2}}/>
              <div style={{flex:2,background:"rgba(255,122,0,0.07)",border:"1px dashed rgba(255,122,0,0.25)",marginLeft:gutter/2,borderRadius:2}}/>
            </>
          ):Array.from({length:cols}).map((_,i)=>(
            <div key={i} style={{flex:1,background:"rgba(255,122,0,0.07)",border:"1px dashed rgba(255,122,0,0.25)",marginLeft:i>0?gutter/2:0,marginRight:i<cols-1?gutter/2:0,borderRadius:2}}/>
          ))}
        </div>
      )}
      <div style={{position:"relative",zIndex:1}}>
        {type==="manuscript"&&(
          <div style={{maxWidth:"65%",margin:"0 auto"}}>
            <div style={{height:11,background:T.brand,borderRadius:3,marginBottom:12,width:"75%",opacity:0.85}}/>
            <div style={{height:6,background:CV_BORDER,borderRadius:2,marginBottom:5}}/>
            <div style={{height:6,background:CV_BORDER,borderRadius:2,marginBottom:5,width:"92%"}}/>
            <div style={{height:6,background:CV_BORDER,borderRadius:2,marginBottom:5,width:"86%"}}/>
            <div style={{height:6,background:CV_BORDER,borderRadius:2,marginBottom:18,width:"94%"}}/>
            <div style={{height:6,background:"#E3D8C4",borderRadius:2,marginBottom:5}}/>
            <div style={{height:6,background:"#E3D8C4",borderRadius:2,marginBottom:5,width:"88%"}}/>
            <div style={{height:6,background:"#E3D8C4",borderRadius:2,width:"72%"}}/>
          </div>
        )}
        {type==="col2"&&(
          <div style={{display:"flex",gap:gutter}}>
            <div style={{flex:1}}>
              <div style={{height:9,background:T.brand,borderRadius:3,marginBottom:10,width:"80%",opacity:0.85}}/>
              <div style={{height:5,background:CV_BORDER,borderRadius:2,marginBottom:5}}/>
              <div style={{height:5,background:CV_BORDER,borderRadius:2,marginBottom:5,width:"85%"}}/>
              <div style={{height:5,background:CV_BORDER,borderRadius:2,width:"90%"}}/>
            </div>
            <div style={{flex:1}}>
              <div style={{height:9,background:CV_BORDER,borderRadius:3,marginBottom:10,width:"65%"}}/>
              <div style={{height:5,background:"#E3D8C4",borderRadius:2,marginBottom:5}}/>
              <div style={{height:5,background:"#E3D8C4",borderRadius:2,marginBottom:5,width:"78%"}}/>
              <div style={{height:22,background:"rgba(255,122,0,0.12)",borderRadius:5,marginTop:10,border:`1px solid rgba(255,122,0,0.3)`}}/>
            </div>
          </div>
        )}
        {type==="asymmetric"&&(
          <div style={{display:"flex",gap:gutter}}>
            <div style={{flex:1}}>
              <div style={{height:9,background:T.brand,borderRadius:3,marginBottom:10,width:"85%",opacity:0.85}}/>
              <div style={{height:5,background:CV_BORDER,borderRadius:2,marginBottom:5}}/>
              <div style={{height:5,background:CV_BORDER,borderRadius:2,marginBottom:14,width:"80%"}}/>
              <div style={{height:22,background:T.brand,borderRadius:5,opacity:0.8,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{height:4,width:"50%",background:"#FFFFFF",borderRadius:2,opacity:0.5}}/></div>
            </div>
            <div style={{flex:2}}>
              <div style={{height:40,background:"rgba(255,122,0,0.08)",borderRadius:6,border:`1px dashed rgba(255,122,0,0.2)`,marginBottom:10}}/>
              <div style={{height:5,background:"#E3D8C4",borderRadius:2,marginBottom:5}}/>
              <div style={{height:5,background:"#EDE4D3",borderRadius:2,width:"80%"}}/>
            </div>
          </div>
        )}
        {type==="col3"&&(
          <div style={{display:"flex",gap:gutter}}>
            {[T.brand,"#D9CDB8","#C9BCA0"].map((bg,i)=>(
              <div key={i} style={{flex:1,background:CV_PANEL,borderRadius:6,padding:8,border:`1px solid ${CV_BORDER}`}}>
                <div style={{height:26,background:bg,borderRadius:4,marginBottom:8,opacity:i===0?0.8:0.35}}/>
                <div style={{height:5,background:CV_BORDER,borderRadius:2,marginBottom:4}}/>
                <div style={{height:5,background:CV_BORDER,borderRadius:2,width:"70%"}}/>
              </div>
            ))}
          </div>
        )}
        {type==="col4"&&(
          <div style={{display:"flex",gap:gutter}}>
            {[0,1,2,3].map(i=>(
              <div key={i} style={{flex:1,background:CV_PANEL,borderRadius:4,padding:6,border:`1px solid ${CV_BORDER}`}}>
                <div style={{height:18,background:i===0?T.brand:CV_BORDER,borderRadius:3,marginBottom:6,opacity:i===0?0.8:0.35}}/>
                <div style={{height:4,background:"#E3D8C4",borderRadius:2,marginBottom:3}}/>
                <div style={{height:4,background:"#EDE4D3",borderRadius:2,width:"65%"}}/>
              </div>
            ))}
          </div>
        )}
        {type==="col12"&&(
          <div>
            <div style={{display:"flex",gap:gutter/2,marginBottom:gutter/2}}>
              {Array.from({length:6}).map((_,i)=>(
                <div key={i} style={{flex:1,height:7,background:CV_BORDER,borderRadius:2,opacity:0.4}}/>
              ))}
            </div>
            <div style={{display:"flex",gap:gutter/2,marginBottom:gutter/2}}>
              <div style={{flex:4,background:CV_PANEL,borderRadius:4,padding:8,border:`1px solid ${CV_BORDER}`}}>
                <div style={{height:7,background:T.brand,borderRadius:2,marginBottom:6,width:"80%",opacity:0.8}}/>
                <div style={{height:4,background:CV_BORDER,borderRadius:2,marginBottom:4}}/>
                <div style={{height:4,background:"#E3D8C4",borderRadius:2,width:"85%"}}/>
              </div>
              <div style={{flex:4,background:CV_PANEL,borderRadius:4,padding:8,border:`1px solid ${CV_BORDER}`}}>
                <div style={{height:7,background:CV_BORDER,borderRadius:2,marginBottom:6,width:"70%",opacity:0.6}}/>
                <div style={{height:4,background:"#E3D8C4",borderRadius:2,marginBottom:4}}/>
                <div style={{height:4,background:"#EDE4D3",borderRadius:2,width:"80%"}}/>
              </div>
              <div style={{flex:4,background:CV_PANEL,borderRadius:4,padding:8,border:`1px solid ${CV_BORDER}`}}>
                <div style={{height:7,background:CV_BORDER,borderRadius:2,marginBottom:6,width:"60%",opacity:0.5}}/>
                <div style={{height:4,background:"#E3D8C4",borderRadius:2,marginBottom:4}}/>
                <div style={{height:4,background:"#EDE4D3",borderRadius:2,width:"75%"}}/>
              </div>
            </div>
            <div style={{display:"flex",gap:gutter/2}}>
              {Array.from({length:6}).map((_,i)=>(
                <div key={i} style={{flex:1,height:5,background:i===0?T.brand:"#EDE4D3",borderRadius:2,opacity:i===0?0.6:0.25}}/>
              ))}
            </div>
          </div>
        )}
        {type==="modular"&&(
          <div style={{display:"flex",flexDirection:"column",gap:gutter/2}}>
            {[0,1,2].map(row=>(
              <div key={row} style={{display:"flex",gap:gutter/2}}>
                {[0,1,2].map(col=>(
                  <div key={col} style={{flex:1,background:row===0&&col===0?"rgba(255,122,0,0.25)":row===0?"rgba(255,122,0,0.1)":CV_PANEL,borderRadius:3,height:32,border:`1px solid ${row===0&&col===0?"rgba(255,122,0,0.4)":CV_BORDER}`,opacity:row===2?0.5:1}}/>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CheckRow({pass,label,good,bad}){
  return(
    <div style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 12px",background:pass?"rgba(45,198,83,0.05)":"rgba(233,69,96,0.05)",borderRadius:8,border:`1px solid ${pass?"rgba(45,198,83,0.18)":"rgba(233,69,96,0.12)"}`}}>
      <div style={{width:20,height:20,borderRadius:"50%",background:pass?"rgba(45,198,83,0.15)":"rgba(233,69,96,0.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:10,fontWeight:800,color:pass?T.green:T.red,marginTop:1}}>{pass?"✓":"✗"}</div>
      <div>
        <div style={{fontSize:12,fontWeight:700,color:pass?T.green:T.red,marginBottom:2}}>{label}</div>
        <div style={{fontSize:11,color:T.dim,lineHeight:1.5}}>{pass?good:bad}</div>
      </div>
    </div>
  );
}

export default function LayoutLab(){
  const[section,setSection]=useState("pick");
  const[gridType,setGridType]=useState("col3");
  const[gutter,setGutter]=useState(16);
  const[margin,setMargin]=useState(16);
  const[showGuides,setShowGuides]=useState(true);
  const[checkerCols,setCheckerCols]=useState(3);
  const[checkerGutter,setCheckerGutter]=useState(16);
  const[checkerMargin,setCheckerMargin]=useState(16);
  const[checkerBaseline,setCheckerBaseline]=useState(8);
  const[checkerLineH,setCheckerLineH]=useState(1.5);
  const[checkerBodySize,setCheckerBodySize]=useState(16);
  const ref=useRef(null);
  const[suggestionsOpen,setSuggestionsOpen]=useState(false);
  const[appliedSuggestion,setAppliedSuggestion]=useState(null);

  function applySuggestion(s){
    setGridType(s.grid);setGutter(s.gutter);setMargin(s.margin);
    setAppliedSuggestion(s.name);setSuggestionsOpen(false);setSection("pick");
    setTimeout(()=>ref.current?.scrollIntoView({behavior:"smooth"}),50);
  }

  const activeGrid=GRID_TYPES.find(g=>g.id===gridType)||GRID_TYPES[2];
  const col12ok=[1,2,3,4,6,12].includes(checkerCols);
  const gutterOk=checkerGutter%4===0&&checkerGutter>=8;
  const marginOk=checkerMargin>=12;
  const baselineOk=checkerBaseline%4===0;
  const lineHOk=checkerLineH>=1.4&&checkerLineH<=2.0;
  const bodySizeOk=checkerBodySize>=14&&checkerBodySize<=18;
  const checks=[col12ok,gutterOk,marginOk,baselineOk,lineHOk,bodySizeOk];
  const score=checks.filter(Boolean).length;

  return(
    <div ref={ref} style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'Inter',system-ui,sans-serif",padding:"28px 18px 80px"}}>
      <style>{`
        .ll-wrap{max-width:500px;margin:0 auto;}
        .ll-grid{display:grid;grid-template-columns:1fr;gap:20px;}
        @media(min-width:860px){
          .ll-wrap{max-width:1100px;}
          .ll-grid{grid-template-columns:1fr 1fr;gap:36px;align-items:start;}
        }
      `}</style>

      <div className="ll-wrap">
        {/* Header */}
        <div style={{marginBottom:26}}>
          <div style={{fontSize:11,letterSpacing:3,color:T.brand,fontWeight:700,marginBottom:8}}>LAYOUT & COMPOSITION · TOOL</div>
          <h1 style={{fontSize:30,fontFamily:"Georgia,serif",margin:"0 0 5px",color:T.white}}>LayoutLab</h1>
          <p style={{fontSize:12,color:T.dim,margin:0}}>Pick your grid · Check if it&apos;s right · Apply a suggestion</p>
        </div>

        {/* Section toggle */}
        <div style={{display:"flex",gap:0,marginBottom:28,background:T.panel2,borderRadius:12,padding:4,border:`1px solid ${T.border}`}}>
          {[{id:"pick",label:"Pick Your Grid"},{id:"check",label:"Is It Good?"}].map(s=>(
            <button key={s.id} onClick={()=>setSection(s.id)} style={{flex:1,padding:"12px 8px",background:section===s.id?T.brand:"transparent",border:"none",borderRadius:9,color:section===s.id?"#FFFFFF":T.muted,cursor:"pointer",fontSize:13,fontWeight:700,transition:"all 0.15s"}}>{s.label}</button>
          ))}
        </div>

        {section==="pick"&&(
          <div className="ll-grid">
            {/* LEFT: Grid type selector */}
            <div>
              {appliedSuggestion&&(
                <div style={{padding:"10px 14px",background:"rgba(45,198,83,0.08)",border:"1px solid rgba(45,198,83,0.25)",borderRadius:10,marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:14}}>✓</span>
                  <div style={{flex:1,fontSize:12,color:T.green,fontWeight:600}}>{appliedSuggestion} applied</div>
                  <button onClick={()=>setAppliedSuggestion(null)} style={{background:"none",border:"none",color:T.dim,cursor:"pointer",fontSize:12}}>✕</button>
                </div>
              )}
              <div style={{fontSize:11,letterSpacing:3,color:T.dim,fontWeight:700,marginBottom:12}}>GRID TYPE</div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {GRID_TYPES.map(g=>(
                  <button key={g.id} onClick={()=>setGridType(g.id)} style={{padding:"12px 14px",background:gridType===g.id?"rgba(255,122,0,0.09)":T.panel2,border:`1px solid ${gridType===g.id?T.brand:T.border}`,borderRadius:10,textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"border-color 0.12s"}}>
                    <div style={{fontSize:10,color:gridType===g.id?T.brand:T.dim,fontWeight:800,fontFamily:"monospace",minWidth:28,textAlign:"center"}}>{g.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,color:gridType===g.id?T.brand:T.white,fontWeight:700,marginBottom:2}}>{g.name}</div>
                      <div style={{fontSize:11,color:T.dim,lineHeight:1.4}}>{g.desc}</div>
                    </div>
                    {gridType===g.id&&<div style={{width:7,height:7,borderRadius:"50%",background:T.brand,flexShrink:0}}/>}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Spacing + Live preview + info */}
            <div>
              <div style={{fontSize:11,letterSpacing:3,color:T.dim,fontWeight:700,marginBottom:12}}>SPACING</div>
              <div style={{background:T.panel2,borderRadius:12,padding:16,border:`1px solid ${T.border}`,marginBottom:20}}>
                <div style={{marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontSize:13,color:T.muted}}>Gutter (column gap)</span>
                    <span style={{fontSize:13,fontWeight:700,color:T.brand}}>{gutter}px</span>
                  </div>
                  <div style={{display:"flex",gap:6,marginBottom:10}}>
                    {GUTTER_PRESETS.map(p=>(
                      <button key={p.label} onClick={()=>setGutter(p.val)} style={{flex:1,padding:"6px 2px",background:gutter===p.val?"rgba(255,122,0,0.15)":T.panel,border:`1px solid ${gutter===p.val?T.brand:T.border}`,borderRadius:6,color:gutter===p.val?T.brand:T.dim,cursor:"pointer",fontSize:10,fontWeight:700}}>{p.label}</button>
                    ))}
                  </div>
                  <input type="range" min={4} max={48} step={4} value={gutter} onChange={e=>setGutter(Number(e.target.value))} style={{width:"100%",accentColor:T.brand}}/>
                </div>
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontSize:13,color:T.muted}}>Page margin</span>
                    <span style={{fontSize:13,fontWeight:700,color:T.brand}}>{margin}px</span>
                  </div>
                  <input type="range" min={8} max={64} step={4} value={margin} onChange={e=>setMargin(Number(e.target.value))} style={{width:"100%",accentColor:T.brand}}/>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
                    <span style={{fontSize:10,color:T.dim}}>8px mobile min</span>
                    <span style={{fontSize:10,color:T.dim}}>64px desktop</span>
                  </div>
                </div>
              </div>

              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{fontSize:11,letterSpacing:3,color:T.dim,fontWeight:700}}>LIVE PREVIEW</div>
                <button onClick={()=>setShowGuides(!showGuides)} style={{padding:"5px 12px",background:showGuides?"rgba(255,122,0,0.15)":T.panel,border:`1px solid ${showGuides?T.brand:T.border}`,borderRadius:6,color:showGuides?T.brand:T.muted,cursor:"pointer",fontSize:11,fontWeight:700}}>{showGuides?"Grid ON":"Grid OFF"}</button>
              </div>
              <GridCanvas type={gridType} gutter={gutter} margin={margin} showGuides={showGuides}/>
              <div style={{marginTop:10,padding:"10px 14px",background:"rgba(255,122,0,0.05)",borderRadius:8,border:"1px solid rgba(255,122,0,0.15)"}}>
                <div style={{fontSize:12,color:T.brand,fontWeight:700,marginBottom:3}}>{activeGrid.name}</div>
                <div style={{fontSize:12,color:T.dim,lineHeight:1.5}}>{activeGrid.useCase}</div>
              </div>
            </div>
          </div>
        )}

        {section==="check"&&(
          <div className="ll-grid">
            {/* LEFT: Input sliders */}
            <div>
              <div style={{background:T.panel2,borderRadius:12,padding:18,border:`1px solid ${T.border}`}}>
                <div style={{fontSize:11,letterSpacing:3,color:T.dim,fontWeight:700,marginBottom:16}}>ENTER YOUR VALUES</div>
                {[
                  {label:"Columns",val:checkerCols,set:setCheckerCols,min:1,max:12,step:1,unit:""},
                  {label:"Gutter",val:checkerGutter,set:setCheckerGutter,min:4,max:64,step:4,unit:"px"},
                  {label:"Page margin",val:checkerMargin,set:setCheckerMargin,min:4,max:80,step:4,unit:"px"},
                  {label:"Baseline unit",val:checkerBaseline,set:setCheckerBaseline,min:4,max:16,step:4,unit:"px"},
                  {label:"Body size",val:checkerBodySize,set:setCheckerBodySize,min:11,max:24,step:1,unit:"px"},
                ].map(({label,val,set,min,max,step,unit})=>(
                  <div key={label} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:13,color:T.muted}}>{label}</span>
                      <span style={{fontSize:13,fontWeight:700,color:T.brand}}>{val}{unit}</span>
                    </div>
                    <input type="range" min={min} max={max} step={step} value={val} onChange={e=>set(Number(e.target.value))} style={{width:"100%",accentColor:T.brand}}/>
                  </div>
                ))}
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:13,color:T.muted}}>Line height</span>
                    <span style={{fontSize:13,fontWeight:700,color:T.brand}}>{checkerLineH.toFixed(1)}</span>
                  </div>
                  <input type="range" min={1.0} max={2.2} step={0.1} value={checkerLineH} onChange={e=>setCheckerLineH(Number(e.target.value))} style={{width:"100%",accentColor:T.brand}}/>
                </div>
              </div>
            </div>

            {/* RIGHT: Score + checks + live preview */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16,padding:16,background:score===6?"rgba(45,198,83,0.06)":score>=4?"rgba(255,122,0,0.06)":"rgba(233,69,96,0.06)",borderRadius:12,border:`1px solid ${score===6?"rgba(45,198,83,0.22)":score>=4?"rgba(255,122,0,0.22)":"rgba(233,69,96,0.2)"}`}}>
                <div style={{fontSize:44,fontWeight:800,color:score===6?T.green:score>=4?T.brand:T.red,fontFamily:"Georgia,serif",lineHeight:1}}>{score}<span style={{fontSize:20,color:T.dim}}>/6</span></div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:score===6?T.green:score>=4?T.brand:T.red,marginBottom:3}}>
                    {score===6?"Perfect composition ✓":score>=4?"Good — fix the issues below":"Needs work before designing"}
                  </div>
                  <div style={{fontSize:12,color:T.dim,lineHeight:1.5}}>{score===6?"All rules pass. You're ready to design.":score>=4?"A few rules failing. Quick fixes needed.":"Multiple violations will cause visual problems."}</div>
                </div>
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                <CheckRow pass={col12ok} label="Column count"
                  good={`${checkerCols} columns — divides into clean equal sections. ✓`}
                  bad={`${checkerCols} columns won't divide evenly. Use 1, 2, 3, 4, 6, or 12.`}/>
                <CheckRow pass={gutterOk} label="Gutter on 4px grid"
                  good={`${checkerGutter}px gutter — on the 4px grid. ✓`}
                  bad={`${checkerGutter}px is not divisible by 4. Use ${Math.round(checkerGutter/4)*4}px.`}/>
                <CheckRow pass={marginOk} label="Page margin"
                  good={`${checkerMargin}px margin — enough breathing room. ✓`}
                  bad={`${checkerMargin}px is too tight. Minimum 12px mobile, 80px+ desktop.`}/>
                <CheckRow pass={baselineOk} label="Baseline on 4px grid"
                  good={`${checkerBaseline}px baseline — on the 4px grid. ✓`}
                  bad={`${checkerBaseline}px is not on the 4px grid. Use 4, 8, or 16px.`}/>
                <CheckRow pass={bodySizeOk} label="Body font size"
                  good={`${checkerBodySize}px — within the readable range (14–18px). ✓`}
                  bad={`${checkerBodySize}px body. ${checkerBodySize<14?"Too small — minimum 14px for readability.":"Over 18px is display text, not body."}`}/>
                <CheckRow pass={lineHOk} label="Line height"
                  good={`${checkerLineH.toFixed(1)} — comfortable reading range (1.4–2.0). ✓`}
                  bad={`${checkerLineH.toFixed(1)} — ${checkerLineH<1.4?"Too tight. Lines feel cramped below 1.4.":"Too loose. Lines feel disconnected above 2.0."}`}/>
              </div>

              <div style={{background:T.panel2,borderRadius:10,padding:14,border:`1px solid ${T.border}`}}>
                <div style={{fontSize:11,letterSpacing:3,color:T.dim,fontWeight:700,marginBottom:10}}>LIVE PREVIEW AT YOUR VALUES</div>
                <div style={{background:CV_PANEL,borderRadius:8,padding:checkerMargin,border:`1px solid ${CV_BORDER}`}}>
                  <div style={{display:"flex",gap:checkerGutter,marginBottom:checkerGutter}}>
                    {Array.from({length:Math.min(checkerCols,4)}).map((_,i)=>(
                      <div key={i} style={{flex:1,background:CV_PANEL,borderRadius:4,padding:checkerBaseline,border:`1px solid ${CV_BORDER}`}}>
                        <div style={{height:checkerBodySize*1.15,background:i===0?T.brand:CV_BORDER,borderRadius:3,marginBottom:checkerBaseline/2,opacity:i===0?0.8:0.4}}/>
                        <div style={{height:checkerBodySize*0.65,background:"#E3D8C4",borderRadius:2,marginBottom:Math.round(checkerBaseline*checkerLineH/2),width:"88%"}}/>
                        <div style={{height:checkerBodySize*0.65,background:"#EDE4D3",borderRadius:2,width:"72%"}}/>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:checkerGutter}}>
                    {Array.from({length:Math.min(checkerCols,4)}).map((_,i)=>(
                      <div key={i} style={{flex:1,height:checkerBaseline*2,background:CV_PANEL,borderRadius:3,border:`1px solid ${CV_BORDER}`}}/>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions — full width */}
        <div style={{marginTop:40,paddingTop:28,borderTop:`1px solid ${T.border}`}}>
          <button onClick={()=>setSuggestionsOpen(!suggestionsOpen)} style={{width:"100%",padding:"14px 18px",background:suggestionsOpen?"rgba(255,122,0,0.1)":T.panel2,border:`1px solid ${suggestionsOpen?T.brand:T.border}`,borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:suggestionsOpen?16:0,transition:"all 0.15s"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:16}}>⊞</span>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:13,fontWeight:700,color:suggestionsOpen?T.brand:T.white}}>Premium Layout Suggestions</div>
                <div style={{fontSize:11,color:T.dim,marginTop:2}}>20 pro configs — one tap to apply to your grid</div>
              </div>
            </div>
            <span style={{fontSize:18,color:suggestionsOpen?T.brand:T.dim,transition:"transform 0.15s",display:"inline-block",transform:suggestionsOpen?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
          </button>
          {suggestionsOpen&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {LAYOUT_SUGGESTIONS.map((s,i)=>(
                <div key={s.name} style={{padding:"12px 14px",background:appliedSuggestion===s.name?"rgba(255,122,0,0.08)":T.panel2,border:`1px solid ${appliedSuggestion===s.name?T.brand:T.border}`,borderRadius:10,display:"flex",alignItems:"center",gap:12}}>
                  <div style={{fontSize:11,color:T.dim,fontWeight:700,minWidth:22,textAlign:"right",fontFamily:"monospace"}}>{String(i+1).padStart(2,"0")}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                      <span style={{fontSize:13,color:T.white,fontWeight:700}}>{s.name}</span>
                      <span style={{fontSize:9,letterSpacing:2,color:T.brand,fontWeight:700,background:"rgba(255,122,0,0.1)",padding:"2px 6px",borderRadius:3}}>{s.tag}</span>
                    </div>
                    <div style={{fontSize:11,color:T.dim,marginBottom:3}}>{s.note}</div>
                    <div style={{fontSize:10,color:T.dim}}>
                      {GRID_TYPES.find(g=>g.id===s.grid)?.name} · Gutter {s.gutter}px · Margin {s.margin}px
                    </div>
                  </div>
                  <button onClick={()=>applySuggestion(s)} style={{padding:"7px 14px",background:appliedSuggestion===s.name?T.green:T.brand,border:"none",borderRadius:8,color:"#FFFFFF",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>
                    {appliedSuggestion===s.name?"Applied ✓":"Apply"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
