import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { IELTS_READING_EXERCISES } from "../data/ieltsReadingExercises.js";
import { WRITING_TASKS } from "../data/writingTasks.js";

const MIN_EXERCISES = 5;
const MIN_SECONDS = 30;
const pick = (items, count) => [...items].sort(() => Math.random() - .5).slice(0, count);
const answerFor = (q) => q.type === "tfng" ? q.statements.map((s) => s.answer) : q.answer;
const publicQuestion = (q) => {
  const { answer, statements, ...rest } = q;
  return { ...rest, statements: statements?.map(({ answer: _answer, ...s }) => s) };
};

export default function IeltsChallengePage({ challengeId }) {
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState(challengeId ? "lobby" : "home");
  const [match, setMatch] = useState(null);
  const [players, setPlayers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [skill, setSkill] = useState("reading");
  const [count, setCount] = useState(5);
  const [seconds, setSeconds] = useState(60);
  const [pin, setPin] = useState("");

  async function load(id = challengeId) {
    if (!supabase || !id) return;
    const [{ data: m, error: mError }, { data: p }, { data: q }, { data: a }] = await Promise.all([
      supabase.from("ielts_challenges").select("*").eq("id", id).single(),
      supabase.from("ielts_challenge_players").select("*").eq("challenge_id", id).order("seat"),
      supabase.from("ielts_challenge_questions").select("*").eq("challenge_id", id).order("position"),
      supabase.from("ielts_challenge_answers").select("*").eq("challenge_id", id).eq("user_id", user?.id).order("position"),
    ]);
    if (mError) { setError("This challenge is unavailable. Check the link or ask the host for a new PIN."); return; }
    setMatch(m); setPlayers(p || []); setQuestions(q || []); setAnswers(a || []);
    if (m.status === "active") setMode("match");
    if (m.status === "completed") setMode("results");
  }

  useEffect(() => { if (user && challengeId) load(); }, [user, challengeId]);
  useEffect(() => {
    if (!supabase || !challengeId) return;
    const channel = supabase.channel("ielts-challenge-" + challengeId)
      .on("postgres_changes", { event: "*", schema: "public", table: "ielts_challenges", filter: "id=eq." + challengeId }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "ielts_challenge_players", filter: "challenge_id=eq." + challengeId }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "ielts_challenge_answers", filter: "challenge_id=eq." + challengeId }, () => load())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [challengeId, user]);

  async function create() {
    setError("");
    if (!user) return setError("Sign in to create an IELTS challenge.");
    if (count < MIN_EXERCISES || seconds < MIN_SECONDS) return setError("Choose at least 5 exercises and 30 seconds per exercise.");
    const source = skill === "reading" ? IELTS_READING_EXERCISES : WRITING_TASKS;
    if (count > source.length) return setError("This skill does not yet have enough exercises for that challenge length.");
    setBusy(true);
    const selected = pick(source, count);
    const packets = skill === "reading" ? selected.map(publicQuestion) : selected.map((task) => ({ id: task.id, title: task.title, prompt: task.prompt, minWords: task.minWords }));
    const keys = skill === "reading" ? selected.map(answerFor) : selected.map(() => null);
    const { data, error: rpcError } = await supabase.rpc("create_ielts_challenge", { p_skill: skill, p_exercise_count: count, p_seconds_per_exercise: seconds, p_questions: packets, p_answers: keys });
    setBusy(false);
    if (rpcError) return setError(rpcError.message);
    window.location.hash = "#/ielts/1v1/" + data;
  }

  async function join() {
    setError(""); setBusy(true);
    const { data, error: rpcError } = await supabase.rpc("join_ielts_challenge", { p_pin: pin.trim() });
    setBusy(false);
    if (rpcError) return setError(rpcError.message);
    window.location.hash = "#/ielts/1v1/" + data;
  }

  if (authLoading) return <Shell><p>Loading your ScholarCompass account…</p></Shell>;
  if (!user) return <Shell><h1 className="section__title">IELTS 1v1 Challenge</h1><p className="section__lede">Challenge a classmate on real IELTS Reading or Writing practice.</p><p className="leaderboard-page__signin-note"><a href="#/signin">Sign in</a> to create or join a challenge.</p></Shell>;
  if (challengeId && !match) return <Shell><p>{error || "Loading challenge…"}</p></Shell>;
  if (mode === "match") return <Match match={match} players={players} questions={questions} answers={answers} onError={setError} onDone={() => load()} />;
  if (mode === "results") return <Results match={match} players={players} userId={user.id} />;
  if (challengeId) return <Lobby match={match} players={players} userId={user.id} error={error} />;
  return <Shell>
    <a className="detail__back" href="#/category/ielts">← Back to IELTS</a>
    <div className="section__head"><h1 className="section__title">IELTS 1v1 Challenge</h1><p className="section__lede">Create a live, two-player challenge using the same question set and a shared server-timed clock.</p></div>
    <div style={grid}>
      <Card><h2>Create a challenge</h2><label>IELTS skill<select value={skill} onChange={e => setSkill(e.target.value)}><option value="reading">Reading</option><option value="writing">Writing</option></select></label><label>Exercises (minimum 5)<input type="number" min="5" max={skill === "writing" ? 5 : IELTS_READING_EXERCISES.length} value={count} onChange={e => setCount(Number(e.target.value))} /></label><label>Seconds per exercise (minimum 30)<input type="number" min="30" value={seconds} onChange={e => setSeconds(Number(e.target.value))} /></label><button className="btn btn--accent" disabled={busy} onClick={create}>{busy ? "Creating…" : "Create 1v1 challenge"}</button></Card>
      <Card><h2>Join a challenge</h2><p style={{color:"var(--ink-soft)", marginBottom:16}}>Enter the four-digit PIN shared by your opponent.</p><label>Challenge PIN<input inputMode="numeric" maxLength="4" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ""))} placeholder="0000" /></label><button className="btn btn--ghost" style={{borderColor:"var(--line)", color:"var(--heading)"}} disabled={busy || pin.length !== 4} onClick={join}>Join 1v1</button></Card>
    </div>{error && <p style={{color:"var(--status-red)", marginTop:16}}>{error}</p>}
  </Shell>;
}

function Lobby({ match, players, userId, error }) {
 const isCreator = match.creator_id === userId;
 return <Shell><a className="detail__back" href="#/ielts/1v1">← Leave challenge hub</a><div className="section__head"><h1 className="section__title">Challenge lobby</h1><p className="section__lede">{players.length === 2 ? "Both players are here. Starting the shared match…" : "Waiting for your opponent to enter the PIN."}</p></div><div style={grid}><Card><span style={eyebrow}>{match.status}</span><h2>IELTS {match.skill}</h2><p>{match.exercise_count} exercises · {match.seconds_per_exercise}s each</p><div style={pinBox}>{isCreator ? match.pin : "••••"}</div><p style={{color:"var(--ink-soft)"}}>{isCreator ? "Share this PIN with one opponent." : "You joined successfully. Keep this page open."}</p></Card><Card><h2>Players</h2>{[1,2].map(seat => { const p=players.find(x=>x.seat===seat); return <p key={seat} style={{padding:"12px 0", borderBottom:"1px solid var(--line)"}}>{p ? (p.user_id === userId ? "You" : "Opponent") : "Waiting for opponent…"} <span style={{float:"right", color:"var(--ink-soft)"}}>{p ? "Connected" : ""}</span></p>})}</Card></div>{error && <p style={{color:"var(--status-red)"}}>{error}</p>}</Shell>;
}

function Match({ match, players, questions, answers, onError, onDone }) {
 const { user } = useAuth(); const [now,setNow]=useState(Date.now()); const [value,setValue]=useState(null); const [busy,setBusy]=useState(false);
 useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id)},[]);
 const mine=players.find(p=>p.user_id===user.id); const pos=mine?.current_exercise || 0; const question=questions[pos]?.payload;
 const deadline=new Date(match.started_at).getTime()+(pos+1)*match.seconds_per_exercise*1000; const remaining=Math.max(0, Math.ceil((deadline-now)/1000));
 useEffect(()=>{setValue(question?.type === "tfng" ? Array(question.statements.length).fill(null) : "");},[pos, question?.id]);
 useEffect(()=>{if(remaining===0 && question && !busy) submit(null)},[remaining, pos]);
 async function submit(forced) { if(!question || busy) return; setBusy(true); const answer=forced === null ? null : value; const {error}=await supabase.rpc("submit_ielts_challenge_answer",{p_challenge_id:match.id,p_position:pos,p_answer:answer}); setBusy(false); if(error) onError(error.message); else onDone(); }
 if(!question) return <Shell><h1 className="section__title">Challenge complete</h1><p className="section__lede">Waiting for your opponent to finish.</p></Shell>;
 return <Shell><div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"center",marginBottom:24}}><div><span style={eyebrow}>IELTS {match.skill} · {pos+1}/{match.exercise_count}</span><h1 className="section__title">Your challenge</h1></div><strong style={{fontSize:28,color:remaining<15?"var(--status-red)":"var(--heading)"}}>{Math.floor(remaining/60)}:{String(remaining%60).padStart(2,"0")}</strong></div><Card>{question.passage && <p style={{whiteSpace:"pre-wrap",lineHeight:1.65,marginBottom:24}}>{question.passage}</p>}<Question q={question} value={value} setValue={setValue}/><button className="btn btn--accent" disabled={busy || !answered(question,value)} onClick={()=>submit()}>{busy?"Submitting…":"Lock in answer"}</button><p style={{marginTop:12,color:"var(--ink-soft)",fontSize:13}}>Your answer is submitted once and scored on the server. The timer does not reset on refresh.</p></Card></Shell>;
}
function Question({q,value,setValue}) {
 if(q.type==="mc"||q.type==="matching") return <><p style={{fontWeight:700,marginBottom:16}}>{q.question || "Choose the best heading."}</p>{q.options||q.headings?.map(h=>({id:h.id,text:h.text})).map(opt=><label key={opt.id} style={option}><input type="radio" checked={value===opt.id} onChange={()=>setValue(opt.id)}/>{opt.id}. {opt.text}</label>)}</>;
 if(q.type==="tfng") return <>{q.statements.map((s,i)=><div key={i} style={{marginBottom:16}}><p>{i+1}. {s.text}</p>{["TRUE","FALSE","NOT GIVEN"].map(v=><label key={v} style={{...option,display:"inline-flex",width:"auto",marginRight:8}}><input type="radio" checked={value?.[i]===v} onChange={()=>{const n=[...value];n[i]=v;setValue(n)}}/>{v}</label>)}</div>)}</>;
 if(q.type==="completion") return <><p style={{fontWeight:700,marginBottom:16}}>{q.prompt}</p><input value={value} onChange={e=>setValue(e.target.value)} placeholder="Your answer" /></>;
 return <><h2>{q.title}</h2><p style={{lineHeight:1.65,margin:"16px 0"}}>{q.prompt}</p><textarea rows="12" value={value} onChange={e=>setValue(e.target.value)} placeholder="Write your response…" /></>;
}
function Results({match,players,userId}){return <Shell><a className="detail__back" href="#/ielts/1v1">← New challenge</a><div className="section__head"><h1 className="section__title">Challenge results</h1><p className="section__lede">Final results for this IELTS {match.skill} match.</p></div><div style={grid}>{players.map(p=><Card key={p.user_id}><span style={eyebrow}>{p.user_id===userId?"You":"Opponent"}</span><h2>{p.score} / {match.exercise_count}</h2><p style={{color:"var(--ink-soft)"}}>{p.current_exercise} exercises completed · {p.completed_at?"Finished":"Still in progress"}</p></Card>)}</div></Shell>}
const Shell=({children})=><section className="section board"><div className="section__inner" style={{maxWidth:920}}>{children}</div></section>;
const Card=({children})=><div style={{background:"var(--white)",border:"1px solid var(--line)",borderRadius:16,padding:24,boxShadow:"var(--shadow-card)",display:"flex",flexDirection:"column",gap:16}}>{children}</div>;
const grid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}; const eyebrow={display:"inline-block",fontSize:12,fontWeight:800,letterSpacing:".06em",textTransform:"uppercase",color:"var(--blue-500)"};const pinBox={fontSize:42,fontWeight:800,letterSpacing:".14em",padding:"18px 0"};const option={display:"flex",gap:10,padding:12,border:"1px solid var(--line)",borderRadius:10,marginBottom:10,cursor:"pointer"};const answered=(q,v)=>q.type==="tfng"?v?.every(Boolean):q.kind==="writing"?v.trim().length>=30:!!v;
