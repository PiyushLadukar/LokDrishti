"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { getNationalRankings } from "@/lib/api";

/* ─── Inline SVG Icons ─────────────────────────────────────── */
const IC = {
  calendar:(c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
  msg:     (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>),
  mic:     (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>),
  bar:     (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
  star:    (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
  trend:   (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>),
  warn:    (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
  mute:    (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>),
  search:  (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  pin:     (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>),
  x:       (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  check:   (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  plus:    (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  zap:     (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
  chevL:   (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>),
  chevR:   (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>),
  award:   (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>),
  shield:  (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
  info:    (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2.5"/></svg>),
  users:   (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  arrow:   (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>),
  sliders: (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>),
  eye:     (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  build:   (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
  file:    (c="#64748B",s=16)=>(<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>),
} as const;
type ICKey = keyof typeof IC;

/* ─── Helpers ──────────────────────────────────────────────── */
const getLCI        = (m:any) => m.LCI_score  ?? 0;
const getAttendance = (m:any) => m.attendance ?? 0;
const getQuestions  = (m:any) => m.questions  ?? 0;
const getDebates    = (m:any) => m.debates    ?? 0;
const isSilent      = (m:any) => m.silent_flag === 1;

function grade(lci:number){
  if(lci>=0.75) return {g:"A",label:"Excellent", color:"#14532D",bg:"#F0FDF4",border:"#86EFAC",accent:"#16A34A",glow:"rgba(22,163,74,0.25)"};
  if(lci>=0.5)  return {g:"B",label:"Good",      color:"#1E3A8A",bg:"#EFF6FF",border:"#93C5FD",accent:"#2563EB",glow:"rgba(37,99,235,0.25)"};
  if(lci>=0.25) return {g:"C",label:"Average",   color:"#78350F",bg:"#FFFBEB",border:"#FCD34D",accent:"#D97706",glow:"rgba(217,119,6,0.25)"};
  if(lci>=0.1)  return {g:"D",label:"Below Avg", color:"#7C2D12",bg:"#FFF7ED",border:"#FDBA74",accent:"#EA580C",glow:"rgba(234,88,12,0.25)"};
  return             {g:"F",label:"Poor",      color:"#7F1D1D",bg:"#FEF2F2",border:"#FCA5A5",accent:"#DC2626",glow:"rgba(220,38,38,0.25)"};
}
function insights(mp:any,avgAtt:number,avgQ:number,avgDeb:number){
  const tips:{iconKey:ICKey;text:string;type:"good"|"warn"|"info"}[]=[];
  const att=getAttendance(mp),q=getQuestions(mp),deb=getDebates(mp);
  if(att>=0.95)               tips.push({iconKey:"star", text:"Top Attender",    type:"good"});
  if(q>avgQ*2)                tips.push({iconKey:"msg",  text:"Top 10% Speaker", type:"good"});
  if(deb>avgDeb*2)            tips.push({iconKey:"mic",  text:"Active Debater",  type:"good"});
  if(att<0.5)                 tips.push({iconKey:"warn", text:"Low Attendance",  type:"warn"});
  if(isSilent(mp))            tips.push({iconKey:"mute", text:"Never Spoke",     type:"warn"});
  if(att>=avgAtt&&q>=avgQ)    tips.push({iconKey:"trend",text:"Above Average",   type:"info"});
  return tips.slice(0,2);
}

/* ─── AnimCounter ──────────────────────────────────────────── */
function AnimCounter({target,suffix=""}:{target:number;suffix?:string}){
  const [val,setVal]=useState(0);
  useEffect(()=>{
    if(!target)return;
    let cur=0;const step=Math.ceil(target/55);
    const t=setInterval(()=>{cur=Math.min(cur+step,target);setVal(cur);if(cur>=target)clearInterval(t);},16);
    return()=>clearInterval(t);
  },[target]);
  return <>{val.toLocaleString()}{suffix}</>;
}

/* ─── Floating Particles ───────────────────────────────────── */
function Particles(){
  const particles = useMemo(()=>Array.from({length:22},(_,i)=>({
    id:i, x:Math.random()*100, y:Math.random()*100,
    size:Math.random()*3+1, dur:Math.random()*12+8,
    delay:Math.random()*6, opacity:Math.random()*0.35+0.08,
  })),[]);
  return(
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {particles.map(p=>(
        <div key={p.id} style={{
          position:"absolute",left:`${p.x}%`,top:`${p.y}%`,
          width:p.size,height:p.size,borderRadius:"50%",
          background:"rgba(255,255,255,0.7)",
          animation:`floatUp ${p.dur}s ${p.delay}s linear infinite`,
          opacity:p.opacity,
        }}/>
      ))}
    </div>
  );
}

/* ─── Parliament Hero Background ───────────────────────────── */
function HeroBg(){
  return(
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {/* Deep gradient base */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#020817 0%,#0A1628 30%,#0F2251 60%,#1a3a8f 85%,#1e4fd8 100%)"}}/>
      {/* Aurora glow blobs */}
      <div style={{position:"absolute",top:"-15%",left:"-10%",width:"65%",height:"70%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(29,78,216,0.45) 0%,transparent 65%)",filter:"blur(40px)",animation:"blobDrift1 14s ease-in-out infinite alternate"}}/>
      <div style={{position:"absolute",bottom:"-20%",right:"-8%",width:"55%",height:"65%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(109,40,217,0.3) 0%,transparent 65%)",filter:"blur(50px)",animation:"blobDrift2 18s ease-in-out infinite alternate"}}/>
      <div style={{position:"absolute",top:"30%",left:"30%",width:"40%",height:"40%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(245,158,11,0.08) 0%,transparent 65%)",filter:"blur(30px)",animation:"blobDrift3 22s ease-in-out infinite alternate"}}/>
      {/* Star field */}
      {Array.from({length:55},(_,i)=>{
        const x=((i*137.5)%100),y=((i*73.1)%100),s=Math.random()*1.5+0.4;
        return(<div key={i} style={{position:"absolute",left:`${x}%`,top:`${y}%`,width:s,height:s,borderRadius:"50%",background:"white",opacity:Math.random()*0.5+0.1,animation:`twinkle ${2+Math.random()*4}s ${Math.random()*4}s ease-in-out infinite alternate`}}/>);
      })}
      {/* Ashoka Chakra - large, top right */}
      <svg width="500" height="500" viewBox="0 0 500 500" style={{position:"absolute",top:-80,right:-80,opacity:0.055}}>
        <circle cx="250" cy="250" r="230" fill="none" stroke="white" strokeWidth="2.5"/>
        <circle cx="250" cy="250" r="36" fill="none" stroke="white" strokeWidth="5"/>
        {Array.from({length:24},(_,i)=>{const a=(i/24)*Math.PI*2;return(<line key={i} x1={250+48*Math.cos(a)} y1={250+48*Math.sin(a)} x2={250+224*Math.cos(a)} y2={250+224*Math.sin(a)} stroke="white" strokeWidth="2.5" strokeLinecap="round"/>);})}
        {Array.from({length:24},(_,i)=>{const a=(i/24)*Math.PI*2+Math.PI/24;return(<line key={`s${i}`} x1={250+60*Math.cos(a)} y1={250+60*Math.sin(a)} x2={250+205*Math.cos(a)} y2={250+205*Math.sin(a)} stroke="white" strokeWidth="1" opacity="0.4"/>);})}
      </svg>
      {/* Parliament dome wireframe - left */}
      <svg width="280" height="220" viewBox="0 0 280 220" style={{position:"absolute",bottom:0,left:-20,opacity:0.07}}>
        <path d="M20 220 Q140 20 260 220Z" fill="none" stroke="white" strokeWidth="1.5"/>
        <path d="M50 220 Q140 60 230 220" fill="none" stroke="white" strokeWidth="1"/>
        <path d="M80 220 Q140 100 200 220" fill="none" stroke="white" strokeWidth="0.8"/>
        <line x1="140" y1="20" x2="140" y2="220" stroke="white" strokeWidth="1.5"/>
        <line x1="20" y1="220" x2="260" y2="220" stroke="white" strokeWidth="2"/>
        {[180,160,140,120,100].map((y,i)=><line key={i} x1={20+i*22} y1={y} x2={260-i*22} y2={y} stroke="white" strokeWidth="0.5" opacity="0.5"/>)}
      </svg>
      {/* Horizontal scan lines */}
      <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.012) 3px,rgba(255,255,255,0.012) 4px)",pointerEvents:"none"}}/>
      {/* Grid overlay */}
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",backgroundSize:"60px 60px"}}/>
      {/* Tricolor bottom stripe */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"5px",background:"linear-gradient(90deg,#FF9933 33.3%,rgba(255,255,255,0.9) 33.3% 66.6%,#138808 66.6%)"}}/>
      <Particles/>
    </div>
  );
}

/* ─── Body Background ──────────────────────────────────────── */
function BodyBg(){
  return(
    <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,#F0F4FF 0%,#E8EFFE 40%,#F5F0FF 70%,#FFF8F0 100%)"}}/>
      {/* Ashoka Chakra corner watermarks */}
      <svg width="520" height="520" viewBox="0 0 520 520" style={{position:"absolute",top:-100,right:-100,opacity:0.028}}>
        <circle cx="260" cy="260" r="240" fill="none" stroke="#1E3A8A" strokeWidth="6"/>
        <circle cx="260" cy="260" r="36" fill="none" stroke="#1E3A8A" strokeWidth="6"/>
        {Array.from({length:24},(_,i)=>{const a=(i/24)*Math.PI*2;return(<line key={i} x1={260+48*Math.cos(a)} y1={260+48*Math.sin(a)} x2={260+234*Math.cos(a)} y2={260+234*Math.sin(a)} stroke="#1E3A8A" strokeWidth="3.5" strokeLinecap="round"/>);})}
      </svg>
      <svg width="340" height="340" viewBox="0 0 340 340" style={{position:"absolute",bottom:-60,left:-60,opacity:0.018}}>
        <circle cx="170" cy="170" r="158" fill="none" stroke="#92400E" strokeWidth="5"/>
        <circle cx="170" cy="170" r="24" fill="none" stroke="#92400E" strokeWidth="4"/>
        {Array.from({length:24},(_,i)=>{const a=(i/24)*Math.PI*2;return(<line key={i} x1={170+32*Math.cos(a)} y1={170+32*Math.sin(a)} x2={170+153*Math.cos(a)} y2={170+153*Math.sin(a)} stroke="#92400E" strokeWidth="2.5" strokeLinecap="round"/>);})}
      </svg>
      {/* Parliament columns */}
      <svg width="80" height="600" viewBox="0 0 80 600" style={{position:"absolute",top:"15%",left:0,opacity:0.04}}>
        {[10,28,46,64].map(x=>(<g key={x}><rect x={x-5} y="20" width="10" height="560" rx="5" fill="#1E3A8A"/><ellipse cx={x} cy="20" rx="9" ry="5" fill="#1E3A8A"/><rect x={x-13} y="572" width="26" height="14" rx="3" fill="#1E3A8A"/></g>))}
        <rect x="0" y="8" width="80" height="11" rx="2" fill="#1E3A8A"/>
      </svg>
      <svg width="80" height="600" viewBox="0 0 80 600" style={{position:"absolute",top:"15%",right:0,opacity:0.04}}>
        {[10,28,46,64].map(x=>(<g key={x}><rect x={x-5} y="20" width="10" height="560" rx="5" fill="#1E3A8A"/><ellipse cx={x} cy="20" rx="9" ry="5" fill="#1E3A8A"/><rect x={x-13} y="572" width="26" height="14" rx="3" fill="#1E3A8A"/></g>))}
        <rect x="0" y="8" width="80" height="11" rx="2" fill="#1E3A8A"/>
      </svg>
      {/* Scale of justice */}
      <svg width="110" height="110" viewBox="0 0 110 110" style={{position:"absolute",top:"38%",left:"1.5%",opacity:0.04}}>
        <line x1="55" y1="8" x2="55" y2="96" stroke="#1E3A8A" strokeWidth="3"/><line x1="18" y1="28" x2="92" y2="28" stroke="#1E3A8A" strokeWidth="3"/>
        <line x1="18" y1="28" x2="8" y2="52" stroke="#1E3A8A" strokeWidth="2"/><line x1="92" y1="28" x2="102" y2="52" stroke="#1E3A8A" strokeWidth="2"/>
        <ellipse cx="8" cy="52" rx="11" ry="6" fill="none" stroke="#1E3A8A" strokeWidth="2"/><ellipse cx="102" cy="52" rx="11" ry="6" fill="none" stroke="#1E3A8A" strokeWidth="2"/>
        <line x1="36" y1="96" x2="74" y2="96" stroke="#1E3A8A" strokeWidth="3"/>
      </svg>
      {/* Dot grid */}
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,#1E3A8A08 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
      {/* Tricolor top stripe */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:"linear-gradient(90deg,#FF9933 33.3%,rgba(0,0,0,0.1) 33.3% 66.6%,#138808 66.6%)",opacity:0.5}}/>
    </div>
  );
}

/* ─── Glowing Progress Bar ─────────────────────────────────── */
function Bar({value,max,avg,color}:{value:number;max:number;avg:number;color:string}){
  const pct=Math.min((value/(max||1))*100,100);
  const avgPct=Math.min((avg/(max||1))*100,100);
  return(
    <div style={{position:"relative",height:"7px",background:"rgba(0,0,0,0.06)",borderRadius:"4px",flex:1,overflow:"visible"}}>
      <div style={{position:"absolute",top:0,left:0,height:"100%",width:`${pct}%`,
        background:`linear-gradient(90deg,${color}cc,${color})`,borderRadius:"4px",
        transition:"width 0.9s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow:`0 0 10px ${color}80,0 0 4px ${color}40`}}/>
      <div style={{position:"absolute",top:"-5px",left:`${avgPct}%`,width:"2px",height:"17px",
        background:"#94A3B8",borderRadius:"1px",transform:"translateX(-50%)",
        boxShadow:"0 0 4px rgba(0,0,0,0.15)"}}/>
    </div>
  );
}

/* ─── Photo ────────────────────────────────────────────────── */
function Photo({name,url,size=72}:{name:string;url?:string;size?:number}){
  const [err,setErr]=useState(false);
  const words=(name||"?").trim().split(/\s+/);
  const ini=words.length>=2?(words[0][0]+words[words.length-1][0]).toUpperCase():words[0].slice(0,2).toUpperCase();
  const hues=[220,160,30,270,190,350];
  const hue=hues[ini.charCodeAt(0)%hues.length];
  const ring:React.CSSProperties={width:size,height:size,borderRadius:"50%",flexShrink:0,
    border:"3px solid white",boxShadow:`0 0 0 3px hsl(${hue},70%,80%),0 6px 20px rgba(0,0,0,0.15)`};
  if(url&&!err)return(<div style={{...ring,overflow:"hidden"}}><img src={`/api/proxy-image?url=${encodeURIComponent(url)}`} alt={name} onError={()=>setErr(true)} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}}/></div>);
  return(<div style={{...ring,background:`linear-gradient(135deg,hsl(${hue},65%,85%),hsl(${hue},55%,72%))`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',Georgia,serif",fontSize:size*0.33,fontWeight:800,color:`hsl(${hue},45%,28%)`}}>{ini}</div>);
}

/* ─── MP Card ──────────────────────────────────────────────── */
function MPCard({mp,maxQ,maxDeb,avgAtt,avgQ,avgDeb,photos,onCompare,compareList,animIdx}:any){
  const [hov,setHov]=useState(false);
  const lci=getLCI(mp),att=getAttendance(mp),q=getQuestions(mp),deb=getDebates(mp);
  const g=grade(lci);
  const attPct=att*100;
  const attC=attPct>=75?"#16A34A":attPct>=50?"#D97706":"#DC2626";
  const chips=insights(mp,avgAtt,avgQ,avgDeb);
  const inCmp=compareList.includes(mp.name);

  return(
    <div style={{opacity:0,animation:`cardPop 0.6s cubic-bezier(0.34,1.28,0.64,1) ${animIdx*0.08}s forwards`}}>
      <div style={{position:"relative"}}>
        {/* Glow ring on hover */}
        <div style={{position:"absolute",inset:-1,borderRadius:"24px",background:`linear-gradient(135deg,${g.accent}40,${g.accent}15)`,opacity:hov?1:0,transition:"opacity 0.3s",filter:`blur(8px)`,zIndex:-1}}/>

        <button onClick={e=>{e.preventDefault();onCompare(mp.name);}} style={{
          position:"absolute",top:16,right:16,zIndex:10,
          width:32,height:32,borderRadius:"50%",
          border:`2px solid ${inCmp?"#1E3A8A":"#CBD5E1"}`,
          background:inCmp?"#1E3A8A":"white",cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:inCmp?"0 2px 12px rgba(30,58,138,0.4)":"0 1px 4px rgba(0,0,0,0.1)",
          transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          transform:inCmp?"scale(1.2)":"scale(1)"}}>
          {inCmp?IC.check("white",14):IC.plus("#94A3B8",14)}
        </button>

        <Link href={`/mp/${encodeURIComponent(mp.name)}`} style={{textDecoration:"none"}}>
          <article onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
            background:hov?"rgba(255,255,255,0.98)":"rgba(255,255,255,0.92)",
            backdropFilter:"blur(20px)",
            WebkitBackdropFilter:"blur(20px)",
            borderRadius:"22px",
            border:`1.5px solid ${hov?g.border:"rgba(226,232,240,0.8)"}`,
            padding:"26px 26px 22px",cursor:"pointer",
            transition:"all 0.35s cubic-bezier(0.34,1.1,0.64,1)",
            boxShadow:hov
              ?`0 24px 64px rgba(30,58,138,0.16),0 8px 24px rgba(30,58,138,0.1),inset 0 1px 0 rgba(255,255,255,0.9)`
              :"0 4px 16px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.8)",
            transform:hov?"translateY(-8px) scale(1.02)":"translateY(0) scale(1)",
            display:"flex",flexDirection:"column",gap:"16px",
            position:"relative",overflow:"hidden"}}>

            {/* Animated gradient top accent */}
            <div style={{position:"absolute",top:0,left:0,right:0,height:"4px",borderRadius:"22px 22px 0 0",
              background:`linear-gradient(90deg,${g.accent},${g.accent}aa,${g.accent}44)`,
              boxShadow:`0 2px 8px ${g.accent}60`}}/>

            {/* Card shimmer sweep on hover */}
            <div style={{position:"absolute",top:0,left:hov?"-100%":"200%",width:"60%",height:"100%",
              background:"linear-gradient(105deg,transparent,rgba(255,255,255,0.35),transparent)",
              transform:"skewX(-20deg)",transition:"left 0.6s ease",pointerEvents:"none"}}/>

            {/* Header */}
            <div style={{display:"flex",gap:"14px",alignItems:"flex-start",paddingTop:"8px"}}>
              <div style={{position:"relative"}}>
                <Photo name={mp.name} url={photos[mp.name]} size={68}/>
                {/* Online status dot */}
                <div style={{position:"absolute",bottom:2,right:2,width:12,height:12,borderRadius:"50%",
                  background:g.accent,border:"2px solid white",boxShadow:`0 0 6px ${g.accent}`}}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:"16px",fontWeight:800,color:"#0F172A",lineHeight:1.2,
                  fontFamily:"'Playfair Display',Georgia,serif",
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{mp.name}</div>
                <div style={{display:"flex",alignItems:"center",gap:"4px",marginTop:"3px"}}>
                  {IC.pin("#94A3B8",11)}
                  <span style={{fontSize:"11px",color:"#64748B",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{mp.constituency}</span>
                </div>
                <div style={{display:"flex",gap:"4px",marginTop:"6px",flexWrap:"wrap"}}>
                  {mp.state&&<span style={{fontSize:"9px",background:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",color:"#1E40AF",borderRadius:"6px",padding:"3px 8px",fontWeight:700,border:"1px solid #BFDBFE",letterSpacing:"0.03em"}}>{mp.state}</span>}
                  {mp.party&&<span style={{fontSize:"9px",background:"#F8FAFC",color:"#475569",borderRadius:"6px",padding:"3px 8px",fontWeight:600,border:"1px solid #E2E8F0",maxWidth:"130px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{mp.party}</span>}
                </div>
              </div>
              {/* Grade badge */}
              <div style={{width:52,height:52,borderRadius:"16px",flexShrink:0,
                background:`linear-gradient(135deg,${g.bg},${g.border}44)`,
                border:`2px solid ${g.border}`,
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                boxShadow:`0 6px 20px ${g.glow},inset 0 1px 0 rgba(255,255,255,0.8)`,
                transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                transform:hov?"scale(1.15) rotate(-5deg)":"scale(1) rotate(0)"}}>
                <span style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"24px",fontWeight:900,color:g.color,lineHeight:1}}>{g.g}</span>
                <span style={{fontSize:"7px",fontWeight:800,color:g.accent,letterSpacing:"0.06em",textTransform:"uppercase",marginTop:"-2px"}}>{g.label}</span>
              </div>
            </div>

            {/* Chips */}
            {chips.length>0&&(
              <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
                {chips.map((c,i)=>(
                  <span key={i} style={{fontSize:"10px",fontWeight:700,borderRadius:"100px",padding:"3px 10px",
                    display:"flex",alignItems:"center",gap:"4px",
                    background:c.type==="good"?"linear-gradient(135deg,#F0FDF4,#DCFCE7)":c.type==="warn"?"linear-gradient(135deg,#FFFBEB,#FEF3C7)":"linear-gradient(135deg,#EFF6FF,#DBEAFE)",
                    color:c.type==="good"?"#15803D":c.type==="warn"?"#B45309":"#1D4ED8",
                    border:`1px solid ${c.type==="good"?"#86EFAC":c.type==="warn"?"#FCD34D":"#93C5FD"}`,
                    boxShadow:`0 1px 4px ${c.type==="good"?"rgba(22,163,74,0.15)":c.type==="warn"?"rgba(217,119,6,0.15)":"rgba(37,99,235,0.15)"}`}}>
                    {IC[c.iconKey](c.type==="good"?"#15803D":c.type==="warn"?"#B45309":"#1D4ED8",10)}{c.text}
                  </span>
                ))}
              </div>
            )}

            <div style={{height:"1px",background:"linear-gradient(90deg,transparent,rgba(203,213,225,0.6),transparent)"}}/>

            {/* Stats */}
            <div style={{display:"flex",flexDirection:"column",gap:"13px"}}>
              {([
                {label:"Attendance",val:attPct.toFixed(0)+"%",barV:att,barMax:1,barAvg:avgAtt,color:attC,ik:"calendar" as ICKey,ibg:"#F0FDF4"},
                {label:"Questions", val:String(q),           barV:q,  barMax:maxQ, barAvg:avgQ,  color:"#3B82F6",ik:"msg"  as ICKey,ibg:"#EFF6FF"},
                {label:"Debates",   val:String(deb),         barV:deb,barMax:maxDeb,barAvg:avgDeb,color:"#8B5CF6",ik:"mic"  as ICKey,ibg:"#F5F3FF"},
              ] as const).map(row=>(
                <div key={row.label}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"7px"}}>
                      <div style={{width:26,height:26,borderRadius:"8px",background:row.ibg,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
                        {IC[row.ik](row.color,13)}
                      </div>
                      <span style={{fontSize:"11px",color:"#64748B",fontWeight:600}}>{row.label}</span>
                    </div>
                    <span style={{fontSize:"15px",fontWeight:800,color:row.color,fontFamily:"'Playfair Display',Georgia,serif",
                      textShadow:`0 0 20px ${row.color}40`}}>{row.val}</span>
                  </div>
                  <Bar value={row.barV} max={row.barMax} avg={row.barAvg} color={row.color}/>
                </div>
              ))}
            </div>

            <div style={{height:"1px",background:"linear-gradient(90deg,transparent,rgba(203,213,225,0.6),transparent)"}}/>

            {/* Footer */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:"20px"}}>
                <div>
                  <div style={{fontSize:"8px",color:"#94A3B8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:"2px"}}>LCI Score</div>
                  <div style={{fontSize:"18px",fontWeight:800,color:g.color,fontFamily:"'Playfair Display',Georgia,serif",textShadow:`0 0 16px ${g.glow}`}}>{lci.toFixed(3)}</div>
                </div>
                {mp.national_rank&&(
                  <div>
                    <div style={{fontSize:"8px",color:"#94A3B8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:"2px"}}>Nat. Rank</div>
                    <div style={{fontSize:"18px",fontWeight:800,color:"#334155",fontFamily:"'Playfair Display',Georgia,serif"}}>#{Math.round(mp.national_rank)}</div>
                  </div>
                )}
              </div>
              <div style={{padding:"8px 16px",borderRadius:"100px",fontSize:"11px",fontWeight:700,
                border:`1.5px solid ${hov?g.accent:"#BFDBFE"}`,
                background:hov?`linear-gradient(135deg,${g.accent},${g.accent}dd)`:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",
                color:hov?"white":"#1E40AF",
                display:"flex",alignItems:"center",gap:"5px",
                transition:"all 0.25s cubic-bezier(0.34,1.2,0.64,1)",
                transform:hov?"scale(1.06)":"scale(1)",
                boxShadow:hov?`0 4px 16px ${g.glow}`:"none"}}>
                Profile{IC.arrow(hov?"white":"#1E40AF",12)}
              </div>
            </div>
          </article>
        </Link>
      </div>
    </div>
  );
}

/* ─── Compare Modal ────────────────────────────────────────── */
function CompareModal({list,mps,onClose}:{list:string[];mps:any[];onClose:()=>void}){
  const a=mps.find(m=>m.name===list[0]),b=mps.find(m=>m.name===list[1]);
  if(!a||!b)return null;
  const rows:{label:string;ik:ICKey;va:string;vb:string;na:number;nb:number}[]=[
    {label:"Attendance",ik:"calendar",va:`${(getAttendance(a)*100).toFixed(0)}%`,vb:`${(getAttendance(b)*100).toFixed(0)}%`,na:getAttendance(a),nb:getAttendance(b)},
    {label:"Questions", ik:"msg",     va:String(getQuestions(a)),vb:String(getQuestions(b)),na:getQuestions(a),nb:getQuestions(b)},
    {label:"Debates",   ik:"mic",     va:String(getDebates(a)),  vb:String(getDebates(b)),  na:getDebates(a),  nb:getDebates(b)  },
    {label:"LCI Score", ik:"bar",     va:getLCI(a).toFixed(4),   vb:getLCI(b).toFixed(4),   na:getLCI(a),      nb:getLCI(b)      },
    {label:"Nat. Rank", ik:"award",   va:`#${Math.round(a.national_rank??0)}`,vb:`#${Math.round(b.national_rank??0)}`,na:-(a.national_rank??999),nb:-(b.national_rank??999)},
    {label:"Grade",     ik:"star",    va:grade(getLCI(a)).g,     vb:grade(getLCI(b)).g,     na:getLCI(a),      nb:getLCI(b)      },
  ];
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(2,8,23,0.85)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(12px)",animation:"fadeIn 0.2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"rgba(255,255,255,0.97)",backdropFilter:"blur(20px)",borderRadius:"28px",padding:"40px",width:"min(720px,95vw)",maxHeight:"90vh",overflowY:"auto",animation:"modalPop 0.35s cubic-bezier(0.34,1.2,0.64,1)",boxShadow:"0 50px 120px rgba(2,8,23,0.3),0 0 0 1px rgba(255,255,255,0.5)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"32px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <div style={{width:42,height:42,borderRadius:"14px",background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",border:"1.5px solid #FCD34D",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(217,119,6,0.2)"}}>
              {IC.zap("#D97706",20)}
            </div>
            <div>
              <h2 style={{fontSize:"24px",fontWeight:800,color:"#0F172A",fontFamily:"'Playfair Display',Georgia,serif",margin:0,lineHeight:1}}>Head-to-Head</h2>
              <div style={{fontSize:"11px",color:"#94A3B8",marginTop:"2px"}}>Parliamentary performance comparison</div>
            </div>
          </div>
          <button onClick={onClose} style={{width:38,height:38,borderRadius:"50%",border:"1.5px solid #E2E8F0",background:"#F8FAFC",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}} onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background="#FEF2F2";}} onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="#F8FAFC";}}>
            {IC.x("#64748B",16)}
          </button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 70px 1fr",gap:"16px",alignItems:"center",marginBottom:"32px",padding:"20px",background:"#F8FAFC",borderRadius:"16px",border:"1px solid #E2E8F0"}}>
          {[a,b].map((mp,i)=>(
            <div key={i} style={{textAlign:i===0?"left":"right"}}>
              <div style={{fontSize:"19px",fontWeight:800,color:"#0F172A",fontFamily:"'Playfair Display',Georgia,serif"}}>{mp.name}</div>
              <div style={{fontSize:"12px",color:"#64748B",marginTop:"3px"}}>{mp.party}</div>
              <div style={{display:"inline-flex",alignItems:"center",gap:"6px",padding:"5px 14px",background:grade(getLCI(mp)).bg,border:`1.5px solid ${grade(getLCI(mp)).border}`,borderRadius:"10px",marginTop:"8px",boxShadow:`0 2px 8px ${grade(getLCI(mp)).glow}`}}>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:"20px",fontWeight:900,color:grade(getLCI(mp)).color}}>{grade(getLCI(mp)).g}</span>
                <span style={{fontSize:"10px",fontWeight:700,color:grade(getLCI(mp)).accent}}>{grade(getLCI(mp)).label}</span>
              </div>
            </div>
          ))}
          <div style={{textAlign:"center",fontSize:"16px",fontWeight:800,color:"#CBD5E1"}}>vs</div>
        </div>
        {rows.map(r=>{
          const aWins=r.na>=r.nb;
          return(
            <div key={r.label} style={{display:"grid",gridTemplateColumns:"1fr 120px 1fr",gap:"10px",alignItems:"center",padding:"12px 0",borderBottom:"1px solid #F1F5F9"}}>
              <div style={{fontSize:"14px",fontWeight:800,padding:"9px 16px",borderRadius:"12px",textAlign:"center",
                color:aWins?"#15803D":"#475569",background:aWins?"linear-gradient(135deg,#F0FDF4,#DCFCE7)":"#F8FAFC",
                border:aWins?"1px solid #86EFAC":"1px solid transparent",
                boxShadow:aWins?"0 2px 8px rgba(22,163,74,0.15)":"none"}}>{r.va}</div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px"}}>
                {IC[r.ik]("#94A3B8",15)}
                <span style={{fontSize:"9px",color:"#94A3B8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",textAlign:"center"}}>{r.label}</span>
              </div>
              <div style={{fontSize:"14px",fontWeight:800,padding:"9px 16px",borderRadius:"12px",textAlign:"center",
                color:!aWins?"#15803D":"#475569",background:!aWins?"linear-gradient(135deg,#F0FDF4,#DCFCE7)":"#F8FAFC",
                border:!aWins?"1px solid #86EFAC":"1px solid transparent",
                boxShadow:!aWins?"0 2px 8px rgba(22,163,74,0.15)":"none"}}>{r.vb}</div>
            </div>
          );
        })}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",marginTop:"20px",fontSize:"11px",color:"#CBD5E1"}}>
          {IC.shield("#CBD5E1",11)} Green = better performer on that metric
        </div>
      </div>
    </div>
  );
}

/* ─── Constituency Finder ──────────────────────────────────── */
function ConstituencyFinder({mps}:{mps:any[]}){
  const [q,setQ]=useState("");const [res,setRes]=useState<any[]>([]);
  useEffect(()=>{
    if(!q.trim()){setRes([]);return;}
    const sq=q.toLowerCase();
    setRes(mps.filter(m=>m.constituency?.toLowerCase().includes(sq)||m.name?.toLowerCase().includes(sq)).slice(0,4));
  },[q,mps]);
  return(
    <div style={{background:"rgba(255,255,255,0.9)",backdropFilter:"blur(16px)",borderRadius:"20px",padding:"22px",border:"1.5px solid rgba(226,232,240,0.8)",boxShadow:"0 4px 24px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.9)"}}>
      <div style={{display:"flex",alignItems:"center",gap:"9px",marginBottom:"5px"}}>
        <div style={{width:34,height:34,borderRadius:"11px",background:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",border:"1px solid #BFDBFE",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(37,99,235,0.15)"}}>
          {IC.pin("#1E40AF",17)}
        </div>
        <span style={{fontSize:"14px",fontWeight:800,color:"#0F172A"}}>Find Your Constituency</span>
      </div>
      <div style={{fontSize:"12px",color:"#64748B",marginBottom:"13px",paddingLeft:"43px"}}>Search by area or MP name</div>
      <div style={{position:"relative"}}>
        <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}>{IC.search("#94A3B8",15)}</div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="e.g. Nagpur, Lucknow…"
          style={{width:"100%",padding:"11px 14px 11px 38px",border:"1.5px solid #E2E8F0",borderRadius:"12px",fontSize:"13px",fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box" as any,color:"#0F172A",transition:"all 0.2s",background:"rgba(248,250,252,0.8)"}}
          onFocus={e=>{e.currentTarget.style.borderColor="#93C5FD";e.currentTarget.style.boxShadow="0 0 0 3px rgba(147,197,253,0.2)";}}
          onBlur={e=>{e.currentTarget.style.borderColor="#E2E8F0";e.currentTarget.style.boxShadow="none";}}/>
      </div>
      {res.length>0&&(
        <div style={{marginTop:"10px",display:"flex",flexDirection:"column",gap:"7px"}}>
          {res.map(mp=>{
            const gi=grade(getLCI(mp));
            return(
              <Link key={mp.name} href={`/mp/${encodeURIComponent(mp.name)}`} style={{textDecoration:"none"}}>
                <div style={{display:"flex",gap:"11px",alignItems:"center",padding:"11px 12px",background:"rgba(248,250,252,0.9)",borderRadius:"12px",border:"1px solid #E2E8F0",cursor:"pointer",transition:"all 0.2s"}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.background="#EFF6FF";(e.currentTarget as HTMLDivElement).style.borderColor="#BFDBFE";(e.currentTarget as HTMLDivElement).style.transform="translateX(3px)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.background="rgba(248,250,252,0.9)";(e.currentTarget as HTMLDivElement).style.borderColor="#E2E8F0";(e.currentTarget as HTMLDivElement).style.transform="translateX(0)";}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:"13px",fontWeight:700,color:"#0F172A"}}>{mp.name}</div>
                    <div style={{fontSize:"11px",color:"#64748B",marginTop:"2px"}}>{mp.constituency} · {mp.party}</div>
                    <div style={{display:"flex",gap:"10px",marginTop:"5px"}}>
                      {([["calendar","#16A34A",`${(getAttendance(mp)*100).toFixed(0)}%`],["msg","#1E40AF",String(getQuestions(mp))],["mic","#7C3AED",String(getDebates(mp))]] as [ICKey,string,string][]).map(([ik,c,v])=>(
                        <span key={ik} style={{fontSize:"10px",color:c,fontWeight:700,display:"flex",alignItems:"center",gap:"3px"}}>{IC[ik](c,9)}{v}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{width:36,height:36,borderRadius:"10px",background:gi.bg,border:`1.5px solid ${gi.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:"18px",fontWeight:800,color:gi.color,boxShadow:`0 2px 8px ${gi.glow}`}}>{gi.g}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Understand Section ───────────────────────────────────── */
function UnderstandSection(){
  const items:{ik:ICKey;title:string;bg:string;border:string;tc:string;ic:string;desc:string;glow:string}[]=[
    {ik:"calendar",title:"What is Attendance?",bg:"linear-gradient(135deg,#F0FDF4,#DCFCE7)",border:"#86EFAC",tc:"#166534",ic:"#16A34A",glow:"rgba(22,163,74,0.15)",desc:"The % of Parliament sessions an MP physically attended. Higher = more votes cast, more debates joined, more representation."},
    {ik:"msg",     title:"What are Questions?",bg:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",border:"#93C5FD",tc:"#1E40AF",ic:"#2563EB",glow:"rgba(37,99,235,0.15)",desc:"MPs submit written or oral questions to hold the government accountable. More questions = more active oversight."},
    {ik:"mic",     title:"What are Debates?",  bg:"linear-gradient(135deg,#F5F3FF,#EDE9FE)",border:"#C4B5FD",tc:"#5B21B6",ic:"#7C3AED",glow:"rgba(124,58,237,0.15)",desc:"MPs discuss bills, budgets and national issues. Debate participation shows how actively an MP voices opinions."},
    {ik:"bar",     title:"What is LCI Score?", bg:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",border:"#FCD34D",tc:"#78350F",ic:"#D97706",glow:"rgba(217,119,6,0.15)",desc:"The Lok Sabha Civic Index combines attendance, questions and debates into one score (0–1). Neutral, data-driven."},
  ];
  return(
    <div style={{background:"rgba(255,255,255,0.85)",backdropFilter:"blur(20px)",borderRadius:"28px",padding:"48px",border:"1.5px solid rgba(226,232,240,0.7)",marginTop:"72px",boxShadow:"0 8px 40px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.9)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-60,right:-60,width:240,height:240,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.08),transparent 70%)",pointerEvents:"none"}}/>
      <div style={{textAlign:"center",marginBottom:"40px"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:"7px",padding:"6px 18px",background:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",borderRadius:"100px",marginBottom:"16px",border:"1px solid #BFDBFE",boxShadow:"0 2px 8px rgba(37,99,235,0.1)"}}>
          {IC.info("#1E40AF",12)}
          <span style={{fontSize:"10px",fontWeight:800,color:"#1E40AF",textTransform:"uppercase",letterSpacing:"0.18em"}}>Understand Parliament</span>
        </div>
        <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"32px",fontWeight:800,color:"#0F172A",letterSpacing:"-0.5px"}}>What do these metrics mean?</div>
        <div style={{fontSize:"14px",color:"#64748B",marginTop:"8px"}}>Plain English explanations for every data point</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"16px"}}>
        {items.map(it=>(
          <div key={it.title} style={{background:it.bg,borderRadius:"18px",padding:"26px",border:`1.5px solid ${it.border}`,transition:"all 0.3s cubic-bezier(0.34,1.1,0.64,1)",cursor:"pointer",boxShadow:`0 4px 16px ${it.glow}`}}
            onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform="translateY(-5px) scale(1.02)";(e.currentTarget as HTMLDivElement).style.boxShadow=`0 12px 32px ${it.glow}`;}}
            onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform="none";(e.currentTarget as HTMLDivElement).style.boxShadow=`0 4px 16px ${it.glow}`;}}>
            <div style={{width:44,height:44,borderRadius:"14px",background:"rgba(255,255,255,0.9)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"15px",boxShadow:`0 4px 12px ${it.glow}`}}>
              {IC[it.ik](it.ic,22)}
            </div>
            <div style={{fontSize:"14px",fontWeight:800,color:it.tc,marginBottom:"10px"}}>{it.title}</div>
            <div style={{fontSize:"13px",color:"#475569",lineHeight:1.75}}>{it.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Stat Card (Hero) ─────────────────────────────────────── */
function HeroStat({n,suf,label,ik,c,bg}:{n:number;suf:string;label:string;ik:ICKey;c:string;bg:string}){
  const [hov,setHov]=useState(false);
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{padding:"22px",borderRadius:"20px",background:hov?`${bg.replace("0.08","0.14")}`:bg,
        border:`1px solid ${c}25`,backdropFilter:"blur(12px)",
        transition:"all 0.3s cubic-bezier(0.34,1.1,0.64,1)",
        transform:hov?"translateY(-4px) scale(1.04)":"none",
        boxShadow:hov?`0 16px 40px ${c}30,0 0 0 1px ${c}20`:"none"}}>
      <div style={{marginBottom:"10px"}}>{IC[ik](c,18)}</div>
      <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"36px",fontWeight:900,color:c,lineHeight:1,textShadow:`0 0 30px ${c}60`}}>
        <AnimCounter target={n} suffix={suf}/>
      </div>
      <div style={{fontSize:"10px",color:"rgba(255,255,255,0.45)",marginTop:"6px",lineHeight:1.5}}>{label}</div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function MPsPage(){
  const [mps,         setMps]         = useState<any[]>([]);
  const [photos,      setPhotos]      = useState<Record<string,string>>({});
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [stateF,      setStateF]      = useState("All");
  const [partyF,      setPartyF]      = useState("All");
  const [gradeF,      setGradeF]      = useState("All");
  const [attMin,      setAttMin]      = useState(0);
  const [silentF,     setSilentF]     = useState(false);
  const [sortBy,      setSortBy]      = useState<"rank"|"attendance"|"questions"|"debates"|"lci">("rank");
  const [page,        setPage]        = useState(1);
  const [showPanel,   setShowPanel]   = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [recentSearch,setRecentSearch]= useState<string[]>([]);
  const [showRecent,  setShowRecent]  = useState(false);
  const PER=9;

  useEffect(()=>{
    (async()=>{
      try{
        const first=await getNationalRankings(undefined,1,100);
        const total=first.total||544;let all=[...(first.data||[])];
        for(let p=2;p<=Math.ceil(total/100);p++){const r=await getNationalRankings(undefined,p,100);all=[...all,...(r.data||[])];}
        setMps(all);
      }catch{}setLoading(false);
    })();
    fetch("/mp_photos.json").then(r=>r.json()).then(setPhotos).catch(()=>{});
  },[]);

  const avgAtt = useMemo(()=>mps.length?mps.reduce((s,m)=>s+getAttendance(m),0)/mps.length:0,[mps]);
  const avgQ   = useMemo(()=>mps.length?mps.reduce((s,m)=>s+getQuestions(m), 0)/mps.length:0,[mps]);
  const avgDeb = useMemo(()=>mps.length?mps.reduce((s,m)=>s+getDebates(m),   0)/mps.length:0,[mps]);
  const avgLCI = useMemo(()=>mps.length?mps.reduce((s,m)=>s+getLCI(m),       0)/mps.length:0,[mps]);
  const maxQ   = useMemo(()=>Math.max(...mps.map(m=>getQuestions(m)),1),[mps]);
  const maxDeb = useMemo(()=>Math.max(...mps.map(m=>getDebates(m)),1),[mps]);
  const states  = useMemo(()=>["All",...Array.from(new Set(mps.map(m=>m.state).filter(Boolean))).sort()],[mps]);
  const parties = useMemo(()=>["All",...Array.from(new Set(mps.map(m=>m.party).filter(Boolean))).sort()],[mps]);
  const photosN=Object.keys(photos).length;
  const silentCount=mps.filter(m=>isSilent(m)).length;

  const filtered=useMemo(()=>{
    let list=[...mps];
    if(silentF)list=list.filter(m=>isSilent(m));
    if(stateF!=="All")list=list.filter(m=>m.state===stateF);
    if(partyF!=="All")list=list.filter(m=>m.party===partyF);
    if(gradeF!=="All")list=list.filter(m=>grade(getLCI(m)).g===gradeF);
    if(attMin>0)list=list.filter(m=>getAttendance(m)*100>=attMin);
    if(search.trim()){const q=search.toLowerCase();list=list.filter(m=>m.name?.toLowerCase().includes(q)||m.state?.toLowerCase().includes(q)||m.party?.toLowerCase().includes(q)||m.constituency?.toLowerCase().includes(q));}
    list.sort((a,b)=>{
      if(sortBy==="rank")return(a.national_rank??999)-(b.national_rank??999);
      if(sortBy==="attendance")return getAttendance(b)-getAttendance(a);
      if(sortBy==="questions")return getQuestions(b)-getQuestions(a);
      if(sortBy==="debates")return getDebates(b)-getDebates(a);
      if(sortBy==="lci")return getLCI(b)-getLCI(a);
      return 0;
    });
    return list;
  },[mps,silentF,stateF,partyF,gradeF,attMin,search,sortBy]);

  const totalPages=Math.ceil(filtered.length/PER);
  const pageData=filtered.slice((page-1)*PER,page*PER);

  function handleCompare(name:string){setCompareList(prev=>{if(prev.includes(name))return prev.filter(n=>n!==name);if(prev.length>=2)return[prev[1],name];return[...prev,name];});}
  function handleSearch(val:string){setSearch(val);setPage(1);if(val.trim()&&!recentSearch.includes(val.trim()))setRecentSearch(prev=>[val.trim(),...prev].slice(0,5));}

  const selSt:React.CSSProperties={padding:"9px 30px 9px 12px",border:"1.5px solid rgba(226,232,240,0.9)",borderRadius:"10px",fontSize:"12px",color:"#334155",fontFamily:"'DM Sans',sans-serif",outline:"none",background:"rgba(255,255,255,0.9)",cursor:"pointer",fontWeight:500,appearance:"none",WebkitAppearance:"none" as any,backgroundImage:`url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 10px center",minWidth:"110px",backdropFilter:"blur(8px)"};

  const SORT_TABS=[
    {key:"rank"       as const,label:"By Rank",    ik:"award"    as ICKey},
    {key:"attendance" as const,label:"Attendance", ik:"calendar" as ICKey},
    {key:"lci"        as const,label:"LCI Score",  ik:"bar"      as ICKey},
    {key:"questions"  as const,label:"Questions",  ik:"msg"      as ICKey},
    {key:"debates"    as const,label:"Debates",    ik:"mic"      as ICKey},
  ];
  const QUICK=[
    {label:"Top Performers", ik:"star"    as ICKey,fn:()=>{setGradeF("A");setSortBy("lci");setPage(1);}},
    {label:"Low Performers", ik:"warn"    as ICKey,fn:()=>{setGradeF("F");setSortBy("lci");setPage(1);}},
    {label:"Best Attendance",ik:"calendar"as ICKey,fn:()=>{setSortBy("attendance");setAttMin(90);setPage(1);}},
    {label:"Most Questions", ik:"msg"     as ICKey,fn:()=>{setSortBy("questions");setPage(1);}},
    {label:"Silent MPs",     ik:"mute"    as ICKey,fn:()=>{setSilentF(true);setPage(1);}},
    {label:"Reset All",      ik:"x"       as ICKey,fn:()=>{setGradeF("All");setAttMin(0);setSilentF(false);setSortBy("rank");setSearch("");setPage(1);}},
  ];

  return(
    <div style={{minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",zoom:"0.92",background:"transparent",position:"relative"}}>
      <BodyBg/>

      {/* ══ HERO ══ */}
      <div style={{position:"relative",overflow:"hidden",minHeight:"480px"}}>
        <HeroBg/>
        <div style={{maxWidth:"1380px",margin:"0 auto",padding:"60px 52px 52px",position:"relative",zIndex:2}}>

          {/* Eyebrow */}
          <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"22px",animation:"heroFadeIn 0.8s ease both"}}>
            <div style={{display:"flex",gap:"3px"}}>
              {(["#FF9933","rgba(255,255,255,0.9)","#138808"] as const).map(c=>(<div key={c} style={{width:"22px",height:"3px",background:c,borderRadius:"2px",boxShadow:`0 0 8px ${c}`}}/>))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"7px",padding:"5px 16px",border:"1px solid rgba(255,255,255,0.18)",borderRadius:"100px",backdropFilter:"blur(12px)",background:"rgba(255,255,255,0.07)"}}>
              {IC.build("rgba(255,255,255,0.7)",12)}
              <span style={{fontSize:"10px",fontWeight:800,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",letterSpacing:"0.24em"}}>18th Lok Sabha · MP Directory</span>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"64px",alignItems:"start"}}>
            <div style={{animation:"heroFadeIn 0.9s ease 0.1s both"}}>
              <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"clamp(38px,5vw,72px)",fontWeight:900,color:"white",lineHeight:1.0,letterSpacing:"-2px",marginBottom:"18px"}}>
                Explore Your<br/>
                <span style={{color:"#F59E0B",position:"relative",display:"inline-block"}}>
                  Members of Parliament
                  <span style={{position:"absolute",bottom:"-6px",left:0,right:0,height:"3px",background:"linear-gradient(90deg,#F59E0B,#FCD34D,transparent)",borderRadius:"2px",boxShadow:"0 0 12px #F59E0B80"}}/>
                </span>
              </h1>
              <p style={{fontSize:"15px",color:"rgba(255,255,255,0.52)",lineHeight:1.95,maxWidth:"520px",marginBottom:"30px"}}>
                Track attendance, questions asked, debates participated and overall civic performance of all{" "}
                <strong style={{color:"white",fontWeight:700}}>544 MPs</strong> of the 18th Lok Sabha. Data-driven. Zero bias.
              </p>
              <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
                {photosN>0&&(
                  <div style={{display:"inline-flex",alignItems:"center",gap:"7px",padding:"7px 18px",background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:"100px",backdropFilter:"blur(8px)"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:"#22C55E",boxShadow:"0 0 10px #22C55E",animation:"pulse 2s ease infinite"}}/>
                    <span style={{fontSize:"11px",color:"#4ADE80",fontWeight:700}}>{photosN} photos loaded</span>
                  </div>
                )}
                <div style={{display:"inline-flex",alignItems:"center",gap:"7px",padding:"7px 18px",background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:"100px",backdropFilter:"blur(8px)"}}>
                  {IC.file("#FBBF24",12)}
                  <span style={{fontSize:"11px",color:"#FBBF24",fontWeight:700}}>PRS Legislative Research</span>
                </div>
              </div>
            </div>

            {/* Hero stat cards */}
            {!loading&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",minWidth:"310px",animation:"heroFadeIn 0.9s ease 0.2s both"}}>
                {([
                  {n:mps.length,            suf:"", label:"Members of Parliament",  ik:"users"    as ICKey,c:"#60A5FA",bg:"rgba(96,165,250,0.08)"},
                  {n:Math.round(avgAtt*100),suf:"%",label:"Average Attendance",     ik:"calendar" as ICKey,c:"#34D399",bg:"rgba(52,211,153,0.08)"},
                  {n:silentCount,           suf:"", label:"Low Participation MPs",  ik:"mute"     as ICKey,c:"#F87171",bg:"rgba(248,113,113,0.08)"},
                  {n:Math.round(avgQ),      suf:"", label:"Avg Questions Asked",    ik:"msg"      as ICKey,c:"#FBBF24",bg:"rgba(251,191,36,0.08)"},
                ] as const).map(s=>(<HeroStat key={s.label} {...s}/>))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ STICKY CONTROLS ══ */}
      <div style={{background:"rgba(255,255,255,0.88)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderBottom:"1px solid rgba(226,232,240,0.6)",position:"sticky",top:"62px",zIndex:40,boxShadow:"0 4px 24px rgba(30,58,138,0.08)"}}>
        <div style={{maxWidth:"1380px",margin:"0 auto",padding:"0 52px"}}>
          {/* Sort tabs */}
          <div style={{display:"flex",gap:0,borderBottom:"1px solid rgba(241,245,249,0.8)",overflowX:"auto"}}>
            {SORT_TABS.map(({key,label,ik})=>{
              const on=sortBy===key;
              return(
                <button key={key} onClick={()=>{setSortBy(key);setPage(1);}} style={{padding:"14px 22px",background:"none",border:"none",borderBottom:on?"3px solid #1E3A8A":"3px solid transparent",cursor:"pointer",fontSize:"12px",fontWeight:on?700:500,color:on?"#1E3A8A":"#64748B",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s",marginBottom:"-1px",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:"6px"}}>
                  {IC[ik](on?"#1E3A8A":"#94A3B8",13)} {label}
                </button>
              );
            })}
            {compareList.length>0&&(
              <button onClick={()=>compareList.length===2&&setShowCompare(true)} style={{marginLeft:"auto",padding:"8px 20px",alignSelf:"center",background:compareList.length===2?"linear-gradient(135deg,#1E3A8A,#2563EB)":"#EFF6FF",border:"none",borderRadius:"10px",cursor:compareList.length===2?"pointer":"default",fontSize:"11px",fontWeight:700,color:compareList.length===2?"white":"#1E40AF",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:"6px",boxShadow:compareList.length===2?"0 4px 16px rgba(30,58,138,0.3)":"none",transition:"all 0.2s"}}>
                {IC.zap(compareList.length===2?"white":"#1E40AF",13)}
                {compareList.length===2?"Compare Now":`Select ${2-compareList.length} more`}
              </button>
            )}
          </div>

          {/* Search + filters */}
          <div style={{display:"flex",gap:"8px",padding:"12px 0",flexWrap:"wrap",alignItems:"center"}}>
            <div style={{position:"relative",flex:"1 1 260px"}}>
              <div style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)"}}>{IC.search("#94A3B8",15)}</div>
              <input value={search} onChange={e=>handleSearch(e.target.value)}
                onFocus={()=>setShowRecent(true)} onBlur={()=>setTimeout(()=>setShowRecent(false),150)}
                placeholder="Search MP — name, constituency, state, party…"
                style={{width:"100%",padding:"10px 36px 10px 40px",border:"1.5px solid rgba(226,232,240,0.9)",borderRadius:"12px",fontSize:"13px",fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box" as any,color:"#0F172A",background:"rgba(248,250,252,0.9)",transition:"all 0.2s",backdropFilter:"blur(8px)"}}
                onKeyDown={e=>e.key==="Escape"&&setSearch("")}/>
              {search&&(<button onClick={()=>{setSearch("");setPage(1);}} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:2}}>{IC.x("#94A3B8",14)}</button>)}
              {showRecent&&recentSearch.length>0&&!search&&(
                <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"rgba(255,255,255,0.97)",backdropFilter:"blur(12px)",border:"1px solid #E2E8F0",borderRadius:"14px",padding:"8px",zIndex:50,boxShadow:"0 16px 40px rgba(0,0,0,0.12)"}}>
                  <div style={{fontSize:"9px",color:"#94A3B8",fontWeight:700,paddingLeft:"8px",marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.1em"}}>Recent</div>
                  {recentSearch.map(s=>(<div key={s} onClick={()=>handleSearch(s)} style={{padding:"7px 10px",fontSize:"12px",color:"#334155",cursor:"pointer",borderRadius:"8px",display:"flex",alignItems:"center",gap:"8px"}} onMouseEnter={e=>(e.currentTarget.style.background="#F8FAFC")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>{IC.search("#CBD5E1",11)} {s}</div>))}
                </div>
              )}
            </div>
            <select value={stateF} onChange={e=>{setStateF(e.target.value);setPage(1);}} style={selSt}>{states.slice(0,40).map(s=><option key={s}>{s}</option>)}</select>
            <select value={partyF} onChange={e=>{setPartyF(e.target.value);setPage(1);}} style={selSt}>{parties.slice(0,50).map(p=><option key={p}>{p}</option>)}</select>
            <select value={gradeF} onChange={e=>{setGradeF(e.target.value);setPage(1);}} style={selSt}>{["All","A","B","C","D","F"].map(g=><option key={g} value={g}>{g==="All"?"All Grades":`Grade ${g}`}</option>)}</select>
            <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
              <span style={{fontSize:"11px",color:"#64748B",fontWeight:600,whiteSpace:"nowrap"}}>Att ≥</span>
              <select value={attMin} onChange={e=>{setAttMin(Number(e.target.value));setPage(1);}} style={{...selSt,minWidth:"80px"}}>{[0,50,60,70,80,90,95].map(v=><option key={v} value={v}>{v===0?"Any":`${v}%`}</option>)}</select>
            </div>
            <button onClick={()=>setShowPanel(p=>!p)} style={{padding:"10px 16px",borderRadius:"10px",border:`1.5px solid ${showPanel?"#BFDBFE":"rgba(226,232,240,0.9)"}`,background:showPanel?"linear-gradient(135deg,#EFF6FF,#DBEAFE)":"rgba(255,255,255,0.9)",cursor:"pointer",fontSize:"12px",fontWeight:700,color:showPanel?"#1E40AF":"#64748B",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:"6px",transition:"all 0.2s",backdropFilter:"blur(8px)"}}>
              {IC.sliders(showPanel?"#1E40AF":"#64748B",13)} Filters{silentF&&<span style={{width:6,height:6,borderRadius:"50%",background:"#DC2626",boxShadow:"0 0 6px #DC2626"}}/>}
            </button>
            <button onClick={()=>{setSilentF(p=>!p);setPage(1);}} style={{padding:"10px 16px",borderRadius:"10px",border:`1.5px solid ${silentF?"#FCA5A5":"rgba(226,232,240,0.9)"}`,background:silentF?"linear-gradient(135deg,#FEF2F2,#FEE2E2)":"rgba(255,255,255,0.9)",cursor:"pointer",fontSize:"12px",fontWeight:700,color:silentF?"#DC2626":"#64748B",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:"6px",transition:"all 0.2s",backdropFilter:"blur(8px)"}}>
              {IC.mute(silentF?"#DC2626":"#64748B",13)} Silent MPs
            </button>
            <div style={{marginLeft:"auto",padding:"8px 14px",background:"rgba(248,250,252,0.9)",backdropFilter:"blur(8px)",borderRadius:"10px",border:"1px solid rgba(226,232,240,0.8)",fontSize:"11px",color:"#64748B",fontWeight:700,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:"5px"}}>
              {IC.eye("#94A3B8",12)} {filtered.length} / {mps.length} MPs
            </div>
          </div>

          {showPanel&&(
            <div style={{padding:"14px 0 18px",borderTop:"1px solid rgba(241,245,249,0.8)",display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"center",animation:"fadeIn 0.2s ease"}}>
              <span style={{fontSize:"10px",color:"#94A3B8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>Quick Filters</span>
              {QUICK.map(btn=>(
                <button key={btn.label} onClick={btn.fn} style={{padding:"7px 16px",borderRadius:"100px",border:"1.5px solid rgba(226,232,240,0.9)",background:"rgba(255,255,255,0.9)",cursor:"pointer",fontSize:"11px",fontWeight:600,color:"#334155",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:"5px",transition:"all 0.2s",backdropFilter:"blur(8px)"}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor="#BFDBFE";(e.currentTarget as HTMLButtonElement).style.background="linear-gradient(135deg,#EFF6FF,#DBEAFE)";(e.currentTarget as HTMLButtonElement).style.color="#1E40AF";(e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor="rgba(226,232,240,0.9)";(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.9)";(e.currentTarget as HTMLButtonElement).style.color="#334155";(e.currentTarget as HTMLButtonElement).style.transform="none";}}>
                  {IC[btn.ik]("#94A3B8",11)} {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div style={{maxWidth:"1380px",margin:"0 auto",padding:"36px 52px 80px",position:"relative",zIndex:1}}>

        {/* Avg strip */}
        {!loading&&(
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"28px"}}>
            {([
              {label:"Avg Attendance",v:`${(avgAtt*100).toFixed(1)}%`,ik:"calendar" as ICKey,c:"#16A34A",bg:"linear-gradient(135deg,#F0FDF4,#DCFCE7)",b:"#86EFAC"},
              {label:"Avg Questions", v:avgQ.toFixed(1),              ik:"msg"      as ICKey,c:"#1E40AF",bg:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",b:"#93C5FD"},
              {label:"Avg Debates",   v:avgDeb.toFixed(1),            ik:"mic"      as ICKey,c:"#7C3AED",bg:"linear-gradient(135deg,#F5F3FF,#EDE9FE)",b:"#C4B5FD"},
              {label:"Avg LCI",       v:avgLCI.toFixed(4),            ik:"bar"      as ICKey,c:"#D97706",bg:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",b:"#FCD34D"},
            ] as const).map(s=>(
              <div key={s.label} style={{display:"flex",alignItems:"center",gap:"8px",padding:"9px 18px",background:s.bg,borderRadius:"14px",border:`1px solid ${s.b}`,boxShadow:`0 2px 8px rgba(0,0,0,0.05)`,transition:"all 0.2s",cursor:"default"}}
                onMouseEnter={e=>(e.currentTarget.style.transform="translateY(-2px)")}
                onMouseLeave={e=>(e.currentTarget.style.transform="none")}>
                {IC[s.ik](s.c,13)}
                <span style={{fontSize:"11px",color:s.c,fontWeight:600}}>{s.label}</span>
                <span style={{fontSize:"15px",fontWeight:800,color:s.c,fontFamily:"'Playfair Display',Georgia,serif"}}>{s.v}</span>
              </div>
            ))}
            <div style={{display:"flex",alignItems:"center",gap:"6px",padding:"9px 14px",background:"rgba(255,255,255,0.8)",border:"1px solid rgba(226,232,240,0.8)",borderRadius:"14px",backdropFilter:"blur(8px)"}}>
              <div style={{width:10,height:2,background:"#94A3B8",borderRadius:1}}/>
              <span style={{fontSize:"10px",color:"#94A3B8",fontWeight:600}}>bar = national average</span>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading&&(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"130px 0",gap:"24px"}}>
            <div style={{position:"relative",width:70,height:70}}>
              <div style={{position:"absolute",inset:0,border:"3px solid rgba(30,58,138,0.1)",borderRadius:"50%"}}/>
              <div style={{position:"absolute",inset:0,border:"3px solid transparent",borderTop:"3px solid #1E3A8A",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
              <div style={{position:"absolute",inset:"8px",border:"2px solid transparent",borderTop:"2px solid #7C3AED",borderRadius:"50%",animation:"spin 1.2s linear infinite reverse"}}/>
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>{IC.build("#1E3A8A",24)}</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"16px",fontWeight:700,color:"#334155",fontFamily:"'Playfair Display',Georgia,serif"}}>Loading Parliament Data…</div>
              <div style={{fontSize:"13px",color:"#94A3B8",marginTop:"4px"}}>Fetching 544 parliamentary records</div>
            </div>
          </div>
        )}

        {!loading&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 296px",gap:"28px",alignItems:"start"}}>
            {/* Cards 3×3 */}
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"20px"}}>
                {pageData.map((mp,i)=>(
                  <MPCard key={mp.name} mp={mp} maxQ={maxQ} maxDeb={maxDeb}
                    avgAtt={avgAtt} avgQ={avgQ} avgDeb={avgDeb} photos={photos}
                    onCompare={handleCompare} compareList={compareList} animIdx={i}/>
                ))}
              </div>

              {filtered.length===0&&(
                <div style={{textAlign:"center",padding:"100px 40px",background:"rgba(255,255,255,0.8)",backdropFilter:"blur(16px)",borderRadius:"28px",border:"1.5px dashed #CBD5E1",boxShadow:"inset 0 2px 8px rgba(0,0,0,0.04)"}}>
                  <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#F1F5F9,#E2E8F0)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",boxShadow:"0 4px 16px rgba(0,0,0,0.08)"}}>{IC.search("#CBD5E1",30)}</div>
                  <div style={{fontSize:"17px",fontWeight:700,color:"#475569",marginBottom:"8px",fontFamily:"'Playfair Display',Georgia,serif"}}>No MPs found</div>
                  <div style={{fontSize:"13px",color:"#94A3B8",marginBottom:"24px"}}>Try adjusting your filters</div>
                  <button onClick={()=>{setGradeF("All");setAttMin(0);setSilentF(false);setSearch("");setPage(1);}} style={{padding:"11px 28px",background:"linear-gradient(135deg,#1E3A8A,#2563EB)",border:"none",borderRadius:"100px",color:"white",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"inline-flex",alignItems:"center",gap:"6px",boxShadow:"0 4px 16px rgba(30,58,138,0.3)"}}>
                    {IC.x("white",14)} Clear Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages>1&&(
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"44px",paddingTop:"26px",borderTop:"1px solid rgba(226,232,240,0.6)"}}>
                  <span style={{fontSize:"12px",color:"#94A3B8",fontWeight:500}}>Showing {(page-1)*PER+1}–{Math.min(page*PER,filtered.length)} of {filtered.length} MPs</span>
                  <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
                    <button onClick={()=>{setPage(p=>Math.max(1,p-1));window.scrollTo({top:300,behavior:"smooth"});}} disabled={page===1} style={{width:40,height:40,borderRadius:"12px",border:"1.5px solid rgba(226,232,240,0.9)",background:"rgba(255,255,255,0.9)",cursor:page===1?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:page===1?0.4:1,transition:"all 0.2s",backdropFilter:"blur(8px)"}} onMouseEnter={e=>{if(page!==1)(e.currentTarget as HTMLButtonElement).style.background="linear-gradient(135deg,#EFF6FF,#DBEAFE)";}} onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.9)";}}>
                      {IC.chevL("#334155",16)}
                    </button>
                    {Array.from({length:Math.min(7,totalPages)},(_,i)=>{
                      const p=Math.max(1,Math.min(page-3,totalPages-6))+i;
                      return(<button key={p} onClick={()=>{setPage(p);window.scrollTo({top:300,behavior:"smooth"});}} style={{width:40,height:40,borderRadius:"12px",border:`1.5px solid ${p===page?"#1E3A8A":"rgba(226,232,240,0.9)"}`,background:p===page?"linear-gradient(135deg,#1E3A8A,#2563EB)":"rgba(255,255,255,0.9)",cursor:"pointer",fontSize:"13px",fontWeight:p===page?700:400,color:p===page?"white":"#334155",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s",transform:p===page?"scale(1.1)":"scale(1)",boxShadow:p===page?"0 4px 14px rgba(30,58,138,0.3)":"none",backdropFilter:"blur(8px)"}}>{p}</button>);
                    })}
                    <button onClick={()=>{setPage(p=>Math.min(totalPages,p+1));window.scrollTo({top:300,behavior:"smooth"});}} disabled={page===totalPages} style={{width:40,height:40,borderRadius:"12px",border:"1.5px solid rgba(226,232,240,0.9)",background:"rgba(255,255,255,0.9)",cursor:page===totalPages?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:page===totalPages?0.4:1,transition:"all 0.2s",backdropFilter:"blur(8px)"}} onMouseEnter={e=>{if(page!==totalPages)(e.currentTarget as HTMLButtonElement).style.background="linear-gradient(135deg,#EFF6FF,#DBEAFE)";}} onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.9)";}}>
                      {IC.chevR("#334155",16)}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div style={{display:"flex",flexDirection:"column",gap:"18px",position:"sticky",top:"180px"}}>
              <ConstituencyFinder mps={mps}/>

              {/* Compare widget */}
              <div style={{background:"rgba(255,255,255,0.9)",backdropFilter:"blur(16px)",borderRadius:"20px",padding:"22px",border:"1.5px solid rgba(226,232,240,0.8)",boxShadow:"0 4px 20px rgba(0,0,0,0.05),inset 0 1px 0 rgba(255,255,255,0.9)"}}>
                <div style={{display:"flex",alignItems:"center",gap:"9px",marginBottom:"12px"}}>
                  <div style={{width:34,height:34,borderRadius:"11px",background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",border:"1px solid #FCD34D",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(217,119,6,0.2)"}}>{IC.zap("#D97706",17)}</div>
                  <span style={{fontSize:"14px",fontWeight:800,color:"#0F172A"}}>Compare MPs</span>
                </div>
                <div style={{fontSize:"12px",color:"#64748B",lineHeight:1.7,marginBottom:"14px"}}>Tap <strong style={{color:"#1E40AF"}}>+</strong> on any two cards to compare head-to-head.</div>
                {compareList.length>0&&(
                  <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                    {compareList.map(name=>(
                      <div key={name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",borderRadius:"10px",border:"1px solid #BFDBFE"}}>
                        <span style={{fontSize:"12px",fontWeight:700,color:"#1E40AF",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"185px"}}>{name}</span>
                        <button onClick={()=>setCompareList(p=>p.filter(n=>n!==name))} style={{background:"none",border:"none",cursor:"pointer",padding:2,flexShrink:0}}>{IC.x("#94A3B8",13)}</button>
                      </div>
                    ))}
                    {compareList.length===2&&(
                      <button onClick={()=>setShowCompare(true)} style={{padding:"12px",background:"linear-gradient(135deg,#1E3A8A,#2563EB)",border:"none",borderRadius:"12px",color:"white",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginTop:"4px",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",boxShadow:"0 6px 20px rgba(30,58,138,0.35)",transition:"all 0.2s"}}
                        onMouseEnter={e=>(e.currentTarget.style.transform="translateY(-2px)")} onMouseLeave={e=>(e.currentTarget.style.transform="none")}>
                        {IC.zap("white",14)} Compare Now
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Grade legend */}
              <div style={{background:"rgba(255,255,255,0.9)",backdropFilter:"blur(16px)",borderRadius:"20px",padding:"22px",border:"1.5px solid rgba(226,232,240,0.8)",boxShadow:"0 4px 20px rgba(0,0,0,0.05),inset 0 1px 0 rgba(255,255,255,0.9)"}}>
                <div style={{display:"flex",alignItems:"center",gap:"9px",marginBottom:"16px"}}>
                  <div style={{width:34,height:34,borderRadius:"11px",background:"linear-gradient(135deg,#F0FDF4,#DCFCE7)",border:"1px solid #86EFAC",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(22,163,74,0.2)"}}>{IC.award("#16A34A",17)}</div>
                  <span style={{fontSize:"14px",fontWeight:800,color:"#0F172A"}}>Grade Scale</span>
                </div>
                {(["A","B","C","D","F"] as const).map(g=>{
                  const gi=grade(g==="A"?0.8:g==="B"?0.6:g==="C"?0.35:g==="D"?0.15:0.05);
                  const cnt=mps.filter(m=>grade(getLCI(m)).g===g).length;
                  return(
                    <div key={g} style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 0",borderBottom:"1px solid rgba(241,245,249,0.8)"}}>
                      <div style={{width:34,height:34,borderRadius:"10px",background:`linear-gradient(135deg,${gi.bg},${gi.border}44)`,border:`1.5px solid ${gi.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:"17px",fontWeight:800,color:gi.color,boxShadow:`0 2px 8px ${gi.glow}`}}>{g}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:"12px",fontWeight:700,color:"#334155"}}>{gi.label}</div>
                        <div style={{fontSize:"10px",color:"#94A3B8"}}>{g==="A"?"LCI ≥ 0.75":g==="B"?"0.50–0.75":g==="C"?"0.25–0.50":g==="D"?"0.10–0.25":"< 0.10"}</div>
                      </div>
                      <span style={{fontSize:"14px",fontWeight:800,color:gi.accent,fontFamily:"'Playfair Display',Georgia,serif"}}>{cnt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Data source */}
              <div style={{padding:"20px",background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",backdropFilter:"blur(16px)",borderRadius:"20px",border:"1.5px solid #FDE68A",boxShadow:"0 4px 16px rgba(217,119,6,0.1)"}}>
                <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"10px"}}>
                  {IC.shield("#D97706",15)}
                  <span style={{fontSize:"10px",fontWeight:800,color:"#D97706",textTransform:"uppercase",letterSpacing:"0.14em"}}>Data Sources</span>
                </div>
                <div style={{fontSize:"12px",color:"#78350F",lineHeight:1.85}}>PRS Legislative Research<br/>Lok Sabha Official Records<br/><span style={{color:"#B45309",fontWeight:700,fontSize:"11px"}}>Zero editorial bias. Data only.</span></div>
              </div>
            </div>
          </div>
        )}

        {!loading&&<UnderstandSection/>}
      </div>

      {showCompare&&compareList.length===2&&<CompareModal list={compareList} mps={mps} onClose={()=>setShowCompare(false)}/>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes spin       { to{transform:rotate(360deg);} }
        @keyframes pulse      { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:.6} }
        @keyframes fadeIn     { from{opacity:0}to{opacity:1} }
        @keyframes modalPop   { from{transform:translateY(28px) scale(0.96);opacity:0}to{transform:translateY(0) scale(1);opacity:1} }
        @keyframes heroFadeIn { from{transform:translateY(-16px);opacity:0}to{transform:translateY(0);opacity:1} }
        @keyframes cardPop    { from{transform:translateY(24px) scale(0.95);opacity:0}to{transform:translateY(0) scale(1);opacity:1} }
        @keyframes floatUp    { 0%{transform:translateY(0) scale(1);opacity:0.15}50%{opacity:0.5}100%{transform:translateY(-100px) scale(0.5);opacity:0} }
        @keyframes twinkle    { from{opacity:0.1;transform:scale(0.8)}to{opacity:0.7;transform:scale(1.2)} }
        @keyframes blobDrift1 { from{transform:translate(0,0) scale(1)}to{transform:translate(50px,30px) scale(1.12)} }
        @keyframes blobDrift2 { from{transform:translate(0,0) scale(1)}to{transform:translate(-40px,-25px) scale(1.08)} }
        @keyframes blobDrift3 { from{transform:translate(0,0) scale(1)}to{transform:translate(30px,-40px) scale(1.15)} }

        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-track { background:rgba(241,245,249,0.5); }
        ::-webkit-scrollbar-thumb { background:#CBD5E1; border-radius:3px; }
        ::-webkit-scrollbar-thumb:hover { background:#94A3B8; }
      `}</style>
    </div>
  );
}