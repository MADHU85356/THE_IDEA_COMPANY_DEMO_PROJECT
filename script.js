const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const today = new Date();
const fmtDate = d => new Date(d + 'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
const monthShort = d => new Date(d + 'T12:00:00').toLocaleDateString('en-IN',{month:'short'});
const dayNum = d => new Date(d + 'T12:00:00').getDate();
const escapeHTML = s => String(s ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initialData = {
 trainings:[
  {id:1,title:'Python for Data Analysis',category:'Analytics',level:'Beginner',duration:'4 weeks',mode:'Online',description:'Learn to work with data using Python, Pandas, and practical analysis exercises.',skills:['Python','Pandas','Data cleaning'],cover:'purple',symbol:'Py',date:'2026-11-12'},
  {id:2,title:'Frontend Web Development',category:'Technology',level:'Beginner',duration:'6 weeks',mode:'Online',description:'Build responsive websites with HTML, CSS, JavaScript, and accessibility basics.',skills:['HTML','CSS','JavaScript'],cover:'blue',symbol:'</>',date:'2026-11-15'},
  {id:3,title:'SQL & Database Essentials',category:'Technology',level:'Beginner',duration:'3 weeks',mode:'Hybrid',description:'Understand queries, joins, grouping, and relational database design.',skills:['SQL','MySQL','Queries'],cover:'green',symbol:'SQL',date:'2026-11-18'},
  {id:4,title:'Communication for Careers',category:'Career',level:'Beginner',duration:'2 weeks',mode:'Online',description:'Practice interviews, professional communication, and workplace collaboration.',skills:['Interviewing','Speaking','Teamwork'],cover:'orange',symbol:'Aa',date:'2026-11-20'},
  {id:5,title:'UI/UX Design Foundations',category:'Design',level:'Intermediate',duration:'4 weeks',mode:'Online',description:'Explore user journeys, wireframes, design systems, and interactive prototypes.',skills:['Wireframes','Prototyping','UX'],cover:'pink',symbol:'✦',date:'2026-11-22'},
  {id:6,title:'Applied Machine Learning',category:'Technology',level:'Advanced',duration:'8 weeks',mode:'Online',description:'Explore model training, evaluation, and responsible ML workflows.',skills:['Python','ML','Evaluation'],cover:'teal',symbol:'ML',date:'2026-11-25'}
 ],
 jobs:[
  {id:1,title:'Data Analyst Intern',company:'BrightPath Analytics',location:'Remote',type:'Internship',salary:'₹10,000 / month',experience:'Fresher',deadline:'2026-11-18',skills:['Python','SQL','Excel'],eligibility:'Students or recent graduates with basic Python and SQL knowledge.',description:'Support the analytics team by cleaning datasets, preparing reports, and communicating findings.'},
  {id:2,title:'Junior Frontend Developer',company:'PixelNest Labs',location:'Hyderabad',type:'Full-time',salary:'₹3–4 LPA',experience:'0–1 years',deadline:'2026-11-22',skills:['HTML','CSS','JavaScript'],eligibility:'Basic web development knowledge and a portfolio or academic project.',description:'Build and maintain responsive user interfaces and collaborate with design and engineering teams.'},
  {id:3,title:'Python Developer Intern',company:'CodeSpring',location:'Remote',type:'Internship',salary:'₹8,000 / month',experience:'Fresher',deadline:'2026-11-25',skills:['Python','Flask','Git'],eligibility:'Comfortable with Python fundamentals and willing to learn in a team.',description:'Assist with small Python applications, APIs, testing, and documentation.'},
  {id:4,title:'QA Testing Trainee',company:'QualityBridge',location:'Bengaluru',type:'Full-time',salary:'₹2.8–3.5 LPA',experience:'Fresher',deadline:'2026-11-30',skills:['Manual Testing','Test Cases','SQL'],eligibility:'Strong attention to detail and understanding of software testing fundamentals.',description:'Create test cases, report bugs clearly, and help validate web application releases.'}
 ],
 events:[
  {id:1,title:'Data Analytics Career Workshop',type:'Workshop',date:'2026-11-10',time:'11:00 AM',deadline:'2026-11-08',location:'Online',seats:120,registered:42,description:'A practical session on data projects, portfolio building, and presenting insights to recruiters.',cover:'purple',symbol:'▥'},
  {id:2,title:'Building Your First Web App',type:'Webinar',date:'2026-11-14',time:'04:00 PM',deadline:'2026-11-12',location:'Online',seats:200,registered:96,description:'Learn the basic workflow for creating and publishing a responsive web application.',cover:'blue',symbol:'</>'},
  {id:3,title:'Campus Career Connect',type:'Networking',date:'2026-11-20',time:'10:30 AM',deadline:'2026-11-17',location:'Hyderabad',seats:80,registered:58,description:'Meet peers, discuss career paths, and learn how to prepare for entry-level opportunities.',cover:'orange',symbol:'✦'}
 ]
};
function loadData(){
 try{
  const saved=JSON.parse(localStorage.getItem('campusConnectData')||'null');
  if(saved) return {...initialData,...saved};
 }catch(e){}
 return JSON.parse(JSON.stringify(initialData));
}
let data=loadData();
let activePage='overview', currentModalType='', editingId=null, toastTimer;
let savedJobs=new Set(JSON.parse(localStorage.getItem('ccSavedJobs')||'[]'));
let savedTraining=new Set(JSON.parse(localStorage.getItem('ccSavedTraining')||'[]'));
let registeredEvents=new Set(JSON.parse(localStorage.getItem('ccRegisteredEvents')||'[]'));
let currentContact='Coordinator';
let chats=JSON.parse(localStorage.getItem('ccChats')||'null')||{
 Coordinator:[{mine:false,text:'Welcome! I’m your program coordinator. Let me know if you need help with training or events.',time:'10:05 AM'},{mine:false,text:'The Data Analytics Career Workshop registration is open. Check the EMS section for the deadline.',time:'10:06 AM'}],
 'Career Team':[{mine:false,text:'Hi! New internship opportunities are available in the Job Descriptions section.',time:'Yesterday'}],
 Support:[{mine:false,text:'Welcome to CampusConnect support. How can we help you today?',time:'Yesterday'}]
};
function persist(){localStorage.setItem('campusConnectData',JSON.stringify(data));localStorage.setItem('ccSavedJobs',JSON.stringify([...savedJobs]));localStorage.setItem('ccSavedTraining',JSON.stringify([...savedTraining]));localStorage.setItem('ccRegisteredEvents',JSON.stringify([...registeredEvents]));localStorage.setItem('ccChats',JSON.stringify(chats));}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600)}
function go(page){activePage=page;$$('.page').forEach(p=>p.classList.toggle('active',p.id===`page-${page}`));$$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));$('#crumb').textContent=({overview:'Overview',training:'Training',jobs:'Job descriptions',events:'Events (EMS)',chat:'Chat'})[page]||'Overview';$('.sidebar').classList.remove('open');if(page==='chat')renderChat();window.scrollTo({top:0,behavior:'smooth'});}
$$('[data-page]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.page)));
$$('[data-goto]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.goto)));
$('#mobileMenu').addEventListener('click',()=>$('.sidebar').classList.toggle('open'));
document.addEventListener('click',e=>{if(window.innerWidth<=900&&$('.sidebar').classList.contains('open')&&!e.target.closest('.sidebar')&&!e.target.closest('#mobileMenu'))$('.sidebar').classList.remove('open')});
$('#helpBtn').addEventListener('click',()=>toast('Help centre: this is a demo. Contact your workspace coordinator for support.'));
$('#notificationsBtn').addEventListener('click',()=>toast('You’re all caught up! Check the Events and Chat sections for updates.'));

function renderStats(){
 $('#trainingStat').textContent=String(data.trainings.length).padStart(2,'0');
 $('#jobStat').textContent=String(data.jobs.length).padStart(2,'0');
 $('#eventStat').textContent=String(data.events.length).padStart(2,'0');
 $('#messageStat').textContent='02';
 renderUpcoming();
}
function renderUpcoming(){
 const list=[...data.events].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3);
 $('#upcomingList').innerHTML=list.length?list.map(e=>`<div class="upcoming-item"><div class="date-box"><strong>${dayNum(e.date)}</strong><small>${monthShort(e.date)}</small></div><div><h3>${escapeHTML(e.title)}</h3><p>${escapeHTML(e.time)} · ${escapeHTML(e.location)}</p></div><span class="deadline">Register by ${fmtDate(e.deadline)}</span></div>`).join(''):'<div class="empty-state">No upcoming events yet.</div>';
}
function renderTraining(){
 const q=$('#trainingSearch').value.toLowerCase(),cat=$('#trainingCategory').value,level=$('#trainingLevel').value;
 const rows=data.trainings.filter(t=>(`${t.title} ${t.category} ${t.description} ${t.skills.join(' ')}`).toLowerCase().includes(q)&&(cat==='all'||t.category===cat)&&(level==='all'||t.level===level));
 $('#trainingResultCount').textContent=`${rows.length} program${rows.length===1?'':'s'}`;
 $('#trainingGrid').innerHTML=rows.length?rows.map(t=>`<article class="training-card"><div class="card-cover cover-${escapeHTML(t.cover||'purple')}"><span class="badge">${escapeHTML(t.category)}</span><button class="bookmark ${savedTraining.has(t.id)?'saved':''}" data-save-training="${t.id}" aria-label="Save training">${savedTraining.has(t.id)?'★':'☆'}</button><span class="cover-symbol">${escapeHTML(t.symbol||'✦')}</span></div><div class="card-body"><div class="card-meta"><span>◷ ${escapeHTML(t.duration)}</span><span>·</span><span>${escapeHTML(t.level)}</span><span>·</span><span>${escapeHTML(t.mode||'Online')}</span></div><h3>${escapeHTML(t.title)}</h3><p>${escapeHTML(t.description)}</p><div class="chip-row">${t.skills.slice(0,3).map(s=>`<span class="chip">${escapeHTML(s)}</span>`).join('')}</div><div class="card-footer"><small>Starts ${fmtDate(t.date||'2026-11-12')}</small><button class="btn primary" data-enroll="${t.id}">View & enroll →</button></div></div></article>`).join(''):'<div class="empty-state"><strong>No training programs found</strong>Try changing your search or filters.</div>';
}
function renderJobs(){
 const q=$('#jobSearch').value.toLowerCase(),type=$('#jobType').value,loc=$('#jobLocation').value;
 const rows=data.jobs.filter(j=>(`${j.title} ${j.company} ${j.skills.join(' ')} ${j.description}`).toLowerCase().includes(q)&&(type==='all'||j.type===type)&&(loc==='all'||j.location===loc));
 $('#jobResultCount').textContent=`${rows.length} opportunit${rows.length===1?'y':'ies'}`;
 $('#jobsList').innerHTML=rows.length?rows.map(j=>`<article class="job-card"><div class="company-logo">${escapeHTML(j.company.split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase())}</div><div class="job-main"><h3>${escapeHTML(j.title)}</h3><div class="company-line">${escapeHTML(j.company)} · ${escapeHTML(j.location)}</div><div class="job-tags"><span>${escapeHTML(j.type)}</span><span>${escapeHTML(j.experience)}</span><span>⌖ ${escapeHTML(j.location)}</span>${j.skills.slice(0,3).map(s=>`<span>${escapeHTML(s)}</span>`).join('')}</div><p>${escapeHTML(j.description)}</p></div><div class="job-side"><strong>${escapeHTML(j.salary)}</strong><small>Apply by ${fmtDate(j.deadline)}</small><div class="job-actions"><button class="save-job ${savedJobs.has(j.id)?'saved':''}" data-save-job="${j.id}" aria-label="Save job">${savedJobs.has(j.id)?'★':'☆'}</button><button class="btn primary" data-job-details="${j.id}">View details</button></div></div></article>`).join(''):'<div class="empty-state"><strong>No jobs found</strong>Try a different role, company, or filter.</div>';
}
function renderEvents(){
 const q=$('#eventSearch').value.toLowerCase(),type=$('#eventType').value,status=$('#eventStatus').value;
 const rows=data.events.filter(e=>(`${e.title} ${e.type} ${e.location} ${e.description}`).toLowerCase().includes(q)&&(type==='all'||e.type===type)&&(status==='all'||(status==='registered'?registeredEvents.has(e.id):!registeredEvents.has(e.id))));
 $('#eventResultCount').textContent=`${rows.length} upcoming event${rows.length===1?'':'s'}`;
 $('#eventsGrid').innerHTML=rows.length?rows.map(e=>{const closed=e.deadline<today.toISOString().slice(0,10);const registered=registeredEvents.has(e.id);return `<article class="event-card"><div class="card-cover cover-${escapeHTML(e.cover||'orange')}"><span class="badge">${escapeHTML(e.type)}</span><span class="cover-symbol">${escapeHTML(e.symbol||'◷')}</span></div><div class="card-body"><div class="card-meta"><span>◷ ${fmtDate(e.date)}</span><span>·</span><span>${escapeHTML(e.time)}</span></div><h3>${escapeHTML(e.title)}</h3><p>${escapeHTML(e.description)}</p><div class="event-info"><span>⌖ ${escapeHTML(e.location)}</span><span>♧ ${e.registered||0} / ${e.seats||100} participants</span><span>▣ Deadline: ${fmtDate(e.deadline)}</span></div><div class="card-footer"><span class="deadline-tag ${closed?'closed':''}">${closed?'Deadline passed':registered?'You’re registered':`Register by ${fmtDate(e.deadline)}`}</span><button class="btn ${registered?'secondary':'primary'}" data-register="${e.id}" ${closed&&!registered?'disabled':''}>${registered?'Registered ✓':closed?'Closed':'Register now'}</button></div></div></article>`}).join(''):'<div class="empty-state"><strong>No events found</strong>Try another search or filter.</div>';
}
['trainingSearch','trainingCategory','trainingLevel'].forEach(id=>$('#'+id).addEventListener(id==='trainingSearch'?'input':'change',renderTraining));
['jobSearch','jobType','jobLocation'].forEach(id=>$('#'+id).addEventListener(id==='jobSearch'?'input':'change',renderJobs));
['eventSearch','eventType','eventStatus'].forEach(id=>$('#'+id).addEventListener(id==='eventSearch'?'input':'change',renderEvents));
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-save-training]');if(t){const id=Number(t.dataset.saveTraining);savedTraining.has(id)?savedTraining.delete(id):savedTraining.add(id);persist();renderTraining();toast(savedTraining.has(id)?'Training saved to your list.':'Training removed from saved list.');return}
 const j=e.target.closest('[data-save-job]');if(j){const id=Number(j.dataset.saveJob);savedJobs.has(id)?savedJobs.delete(id):savedJobs.add(id);persist();renderJobs();toast(savedJobs.has(id)?'Job saved for later.':'Job removed from saved list.');return}
 const en=e.target.closest('[data-enroll]');if(en){const item=data.trainings.find(x=>x.id===Number(en.dataset.enroll));if(item)showDetails('Training details',item,`<p><b>Category:</b> ${escapeHTML(item.category)}</p><p><b>Level:</b> ${escapeHTML(item.level)}</p><p><b>Duration:</b> ${escapeHTML(item.duration)}</p><p><b>Skills:</b> ${item.skills.map(escapeHTML).join(', ')}</p><p>${escapeHTML(item.description)}</p>`,()=>{savedTraining.add(item.id);persist();renderTraining();closeModal();toast(`You’re enrolled in ${item.title} (demo).`)} ,'Enroll in program');return}
 const reg=e.target.closest('[data-register]');if(reg){const id=Number(reg.dataset.register),item=data.events.find(x=>x.id===id);if(!item)return;if(registeredEvents.has(id)){toast('You are already registered for this event.');return}if(item.deadline<today.toISOString().slice(0,10)){toast('Registration deadline has passed.');return}registeredEvents.add(id);item.registered=(item.registered||0)+1;persist();renderEvents();renderStats();toast(`Registration confirmed for ${item.title}!`);return}
 const jd=e.target.closest('[data-job-details]');if(jd){const item=data.jobs.find(x=>x.id===Number(jd.dataset.jobDetails));if(item)showDetails(item.title,item,`<p><b>Company:</b> ${escapeHTML(item.company)}</p><p><b>Location:</b> ${escapeHTML(item.location)}</p><p><b>Type:</b> ${escapeHTML(item.type)} · <b>Pay:</b> ${escapeHTML(item.salary)}</p><p><b>Eligibility:</b> ${escapeHTML(item.eligibility)}</p><p><b>Required skills:</b> ${item.skills.map(escapeHTML).join(', ')}</p><p><b>Responsibilities:</b> ${escapeHTML(item.description)}</p><p><b>Apply by:</b> ${fmtDate(item.deadline)}</p>`,()=>{closeModal();toast('Application noted in this demo. Use the company’s official application process to apply.');},'Mark as interested');return}
});
function showDetails(title,item,html,onAction,actionText){$('#modalTitle').textContent=title;$('#modalFields').innerHTML=`<div class="field full">${html}</div>`;$('#itemForm').dataset.mode='details';$('#itemForm').dataset.action=actionText;$('#itemForm').onsubmit=e=>{e.preventDefault();onAction()};$('#itemForm .modal-actions')?.remove();$('#itemForm').insertAdjacentHTML('beforeend',`<div class="modal-actions"><button type="button" class="btn secondary" id="cancelModal">Close</button><button type="submit" class="btn primary">${escapeHTML(actionText)}</button></div>`);$('#cancelModal').onclick=closeModal;$('#modalBackdrop').classList.add('show')}
const schemas={
 training:{title:'training program',fields:[['title','Program name','text',true],['category','Category','select',true,['Technology','Career','Analytics','Design']],['level','Level','select',true,['Beginner','Intermediate','Advanced']],['duration','Duration','text',true],['mode','Mode','select',true,['Online','Hybrid','In-person']],['date','Start date','date',true],['skills','Skills (comma separated)','text',true],['description','Description','textarea',true]]},
 job:{title:'job description',fields:[['title','Job title','text',true],['company','Company name','text',true],['location','Location','select',true,['Remote','Hyderabad','Bengaluru']],['type','Job type','select',true,['Internship','Full-time','Part-time']],['salary','Salary / stipend','text',true],['experience','Experience level','text',true],['deadline','Application deadline','date',true],['skills','Required skills (comma separated)','text',true],['eligibility','Eligibility criteria','textarea',true],['description','Responsibilities / description','textarea',true]]},
 event:{title:'event',fields:[['title','Event name','text',true],['type','Event type','select',true,['Workshop','Webinar','Networking','Competition']],['date','Event date','date',true],['time','Event time','text',true],['deadline','Registration deadline','date',true],['location','Location','select',true,['Online','Hyderabad','Bengaluru']],['seats','Participant capacity','number',true],['description','Event description','textarea',true]]}
};
function openForm(type,id=null){
 currentModalType=type;editingId=id;const schema=schemas[type],item=id?data[{training:'trainings',job:'jobs',event:'events'}[type]].find(x=>x.id===id):{};
 $('#modalTitle').textContent=`${id?'Edit':'Add'} ${schema.title}`;$('#itemForm').dataset.mode='edit';$('#itemForm').onsubmit=saveForm;
 $('#modalFields').innerHTML=schema.fields.map(([name,label,kind,required,options])=>{let value=item?.[name]??(name==='date'?'2026-11-28':name==='deadline'?'2026-11-30':name==='time'?'11:00 AM':name==='seats'?100:'');if(name==='skills'&&Array.isArray(value))value=value.join(', ');const full=kind==='textarea'||name==='skills'||name==='description'||name==='eligibility';let control='';if(kind==='select')control=`<select name="${name}" ${required?'required':''}>${options.map(o=>`<option ${value===o?'selected':''}>${o}</option>`).join('')}</select>`;else if(kind==='textarea')control=`<textarea name="${name}" ${required?'required':''}>${escapeHTML(value)}</textarea>`;else control=`<input name="${name}" type="${kind}" value="${escapeHTML(value)}" ${required?'required':''} ${kind==='number'?'min="1"':''}/>`;return `<div class="field ${full?'full':''}"><label>${label}${required?' *':''}</label>${control}</div>`}).join('');
 $('#itemForm .modal-actions')?.remove();$('#itemForm').insertAdjacentHTML('beforeend','<div class="modal-actions"><button type="button" class="btn secondary" id="cancelModal">Cancel</button><button type="submit" class="btn primary">Save details</button></div>');$('#cancelModal').onclick=closeModal;$('#modalBackdrop').classList.add('show');
}
function saveForm(e){e.preventDefault();const type=currentModalType,schema=schemas[type],fd=new FormData(e.target),obj={};schema.fields.forEach(([name])=>{let v=fd.get(name);if(name==='skills')v=String(v).split(',').map(s=>s.trim()).filter(Boolean);if(name==='seats')v=Number(v);obj[name]=v});if(type==='training'){obj.cover=['purple','blue','green','orange','pink','teal'][Math.floor(Math.random()*6)];obj.symbol=obj.category==='Analytics'?'Py':obj.category==='Technology'?'</>':'✦';obj.mode=obj.mode||'Online'}if(type==='job'){}if(type==='event'){obj.cover=['purple','blue','orange','green'][Math.floor(Math.random()*4)];obj.symbol='◷';obj.registered=0}const key={training:'trainings',job:'jobs',event:'events'}[type];if(editingId){const index=data[key].findIndex(x=>x.id===editingId);if(index>=0)data[key][index]={...data[key][index],...obj}}else{obj.id=Math.max(0,...data[key].map(x=>x.id))+1;data[key].push(obj)}persist();closeModal();refreshAll();toast(`${schema.title[0].toUpperCase()+schema.title.slice(1)} ${editingId?'updated':'added'} successfully.`)}
function closeModal(){$('#modalBackdrop').classList.remove('show');$('#itemForm').onsubmit=null;$('#itemForm').dataset.mode='';$('#modalFields').innerHTML='';$('#itemForm .modal-actions')?.remove();editingId=null}
$('#closeModal').addEventListener('click',closeModal);$('#cancelModal').addEventListener('click',closeModal);$('#modalBackdrop').addEventListener('click',e=>{if(e.target.id==='modalBackdrop')closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
$('#addTrainingBtn').addEventListener('click',()=>openForm('training'));$('#addJobBtn').addEventListener('click',()=>openForm('job'));$('#addEventBtn').addEventListener('click',()=>openForm('event'));

function renderChat(){
 const messages=chats[currentContact]||[];
 $('#chatMessages').innerHTML=`<div class="message-date">Today</div>`+messages.map(m=>`<div class="message ${m.mine?'mine':''}"><div class="message-bubble">${escapeHTML(m.text)}</div><time>${escapeHTML(m.time)}</time></div>`).join('');
 $('#chatMessages').scrollTop=$('#chatMessages').scrollHeight;
 $('#chatTitle').textContent=currentContact==='Coordinator'?'Program Coordinator':currentContact;
 $('#chatAvatar').textContent=currentContact==='Coordinator'?'CC':currentContact==='Career Team'?'CT':'?';
 const active=$(`.contact[data-contact="${currentContact}"]`);$$('.contact').forEach(c=>c.classList.toggle('active',c===active));
}
$$('.contact[data-contact]').forEach(c=>c.addEventListener('click',()=>{currentContact=c.dataset.contact;renderChat()}));
$('#chatForm').addEventListener('submit',e=>{e.preventDefault();const text=$('#chatInput').value.trim();if(!text)return;chats[currentContact]??=[];const time=new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});chats[currentContact].push({mine:true,text,time});persist();$('#chatInput').value='';renderChat();setTimeout(()=>{if(currentContact==='Coordinator'){chats.Coordinator.push({mine:false,text:'Thanks for your message! This demo stores your message locally. A real chat would deliver it to the coordinator.',time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})});persist();renderChat()}},650)}); 
$('#contactSearch').addEventListener('input',e=>{$$('.contact[data-contact]').forEach(c=>c.style.display=c.textContent.toLowerCase().includes(e.target.value.toLowerCase())?'flex':'none')});
$('#clearChatBtn').addEventListener('click',()=>{if(confirm(`Clear the local conversation with ${currentContact}?`)){chats[currentContact]=[];persist();renderChat();toast('Conversation cleared.')}});
$('#chatInfoBtn').addEventListener('click',()=>toast('Demo chat: messages are stored only in this browser using localStorage.'));
$('#attachBtn').addEventListener('click',()=>toast('File attachments are not enabled in this mockup.'));
function refreshAll(){renderStats();renderTraining();renderJobs();renderEvents();renderChat()}
refreshAll();
