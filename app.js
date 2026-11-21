/* Atelier CRM live demo. Everything runs in the visitor's own browser tab: each visitor gets a private sandbox,
   nothing is sent anywhere, and it resets when they sign out, after the idle time, or when the tab is closed. */
(function () {
  "use strict";
  var CFG = window.DEMO_CONFIG, STATUSES = window.DEMO_STATUSES, OPEN = window.DEMO_OPEN, LANGS = window.DEMO_LANGS;
  var KEY = "atelier-demo-sandbox-v1";
  var S = null;            // the sandbox state (null = not signed in)
  var idleTimer = null, tickTimer = null, callRun = 0;

  function $(s, r) { return (r || document).querySelector(s); }
  function unitFor(n) { var u = P().unit; return Number(n) === 1 ? (u === "people" ? "person" : u.replace(/s$/, "")) : u; }
  function P() { return window.DEMO_PRESETS[(S && S.preset) || "general"]; }
  function typeOptions(sel) {
    return window.DEMO_PRESET_ORDER.map(function (k) { return '<option value="' + k + '"' + (k === sel ? " selected" : "") + ">" + esc(window.DEMO_PRESETS[k].label) + "</option>"; }).join("");
  }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(n) { return "$" + Number(n || 0).toLocaleString("en-US"); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-"); }
  function pill(st) { return '<span class="pill s-' + slug(st) + '">' + esc(st) + "</span>"; }
  function first(n) { return String(n || "").split(" ")[0] || "there"; }
  function nowStr() { var d = new Date(); return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); }
  function daysAgoStr(n) { var d = new Date(Date.now() - n * 864e5); return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); }
  function toast(msg) { var t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove("on"); }, 2800); }

  /* ---------------------------------------------------------------- sandbox lifecycle */
  function build(key) {
    key = window.DEMO_PRESETS[key] ? key : "general";
    var PR = window.DEMO_PRESETS[key];
    var s = { preset: key, user: { email: "", pass: "" }, clients: [], nextId: 1, drafts: [], calls: [], last: Date.now(), view: "card", recording: true };
    var hex = function (n) { var o = ""; for (var i = 0; i < n; i++) o += "0123456789abcdef"[Math.floor(Math.random() * 16)]; return o; };
    s.user.email = "demo-" + hex(8) + "@demo.local";
    s.user.pass = hex(4) + "-" + hex(4) + "-" + hex(4);
    window.DEMO_BASE.forEach(function (r, i) {
      var c = { id: s.nextId++, name: r[0], email: r[1], phone: r[2], country: r[3], guests: PR.sizes[i], exp: PR.interests[i], budget: PR.budgets[i], page: r[4], ref: r[5],
        status: r[6], value: Math.round(window.DEMO_BASE_VALUES[i] * PR.f / 100) * 100, created: Date.now() - r[7] * 864e5, owner: r[8], notes: [], tasks: [], timeline: [], msgs: [], calls: [] };
      c.timeline.push({ w: daysAgoStr(r[7]), t: "Enquiry received through " + (r[4] === "/contact" ? "the Contact Us form" : "the website enquiry form") + " (" + r[4] + ")" });
      if (r[6] !== "New Enquiry") c.timeline.push({ w: daysAgoStr(Math.max(r[7] - 1, 0)), t: "Status changed to " + r[6] });
      c.tasks.push({ id: 1, title: "Reply to " + r[0], due: daysAgoStr(r[7] - 1), done: r[6] !== "New Enquiry" });
      (window.DEMO_THREADS[i] || []).forEach(function (m, k) { c.msgs.push({ dir: m[0], text: m[1].split("{i}").join(PR.interests[i].toLowerCase()), w: daysAgoStr(Math.max(r[7] - k, 0)) }); });
      s.clients.push(c);
    });
    return s;
  }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  function load() { try { var j = sessionStorage.getItem(KEY); return j ? JSON.parse(j) : null; } catch (e) { return null; } }
  function wipe() { S = null; try { sessionStorage.removeItem(KEY); } catch (e) { } stopTimers(); callRun++; }
  function touch() { if (!S) return; S.last = Date.now(); save(); }
  function stopTimers() { clearInterval(tickTimer); clearTimeout(idleTimer); }
  function startTimers() {
    stopTimers();
    tickTimer = setInterval(function () {
      if (!S) return;
      var left = CFG.idleMinutes * 60000 - (Date.now() - S.last);
      if (left <= 0) { wipe(); route("Your sandbox was reset after a quiet period. Start a new one any time."); return; }
      var el = $("#idle"); if (el) el.textContent = Math.floor(left / 60000) + ":" + ("0" + Math.floor(left % 60000 / 1000)).slice(-2);
    }, 1000);
  }
  document.addEventListener("click", touch, true);
  document.addEventListener("keydown", touch, true);

  /* ---------------------------------------------------------------- helpers over the data */
  function byId(id) { for (var i = 0; i < S.clients.length; i++) if (S.clients[i].id === id) return S.clients[i]; return null; }
  function addTimeline(c, t) { c.timeline.unshift({ w: nowStr(), t: t }); }
  function setStatus(c, st) { if (c.status === st) return; addTimeline(c, "Status changed from " + c.status + " to " + st); c.status = st; }
  function lastContact(c) { var t = c.created; return t; }
  function openTasks() { var o = []; S.clients.forEach(function (c) { c.tasks.forEach(function (t) { if (!t.done) o.push({ c: c, t: t }); }); }); return o; }
  function firstName(c) { return first(c.name); }

  /* ---------------------------------------------------------------- the simulated sales assistant */
  function moneyBad(body, allowed) {
    var ok = {}, m;
    (allowed.match(/\d[\d,\.]*/g) || []).forEach(function (n) { ok[n.replace(/[,\.]+$/, "").replace(/,/g, "")] = 1; });
    var re = /[$€£]\s?(\d[\d,]*(?:\.\d+)?)/g;
    while ((m = re.exec(body))) { if (!ok[m[1].replace(/,/g, "")]) return m[0]; }
    return "";
  }
  function writeDraft(c, reason) {
    var f = firstName(c), lastIn = null;
    c.msgs.forEach(function (m) { if (m.dir === "in") lastIn = m; });
    var body;
    if (reason === "reply") {
      body = "Hello " + f + ", thank you for writing to us about your " + c.exp.toLowerCase() + ". " +
        P().pitch + " " +
        "Would a short call this week suit you?";
    } else {
      body = "Hello " + f + ", I wanted to check that you received our reply about your " + c.exp.toLowerCase() + ". " +
        "If it helps, a free consultation call is a good way to shape the plan. Would you like us to arrange one?";
    }
    return { id: Date.now() + Math.floor(Math.random() * 999), clientId: c.id, reason: reason, body: body, blocked: moneyBad(body, P().profile + " " + c.budget) };
  }
  function sendMessage(c, text, auto) {
    c.msgs.push({ dir: "out", text: text, w: nowStr() });
    addTimeline(c, (auto ? "Follow-up" : "Reply") + " sent by email");
    c.tasks.forEach(function (t) { if (/^Reply to/.test(t.title)) t.done = true; });
    if (c.status === "New Enquiry") setStatus(c, "Contacted");
  }

  /* ---------------------------------------------------------------- views */
  var NAV = [["dashboard", "Overview"], ["clients", "Clients"], ["tasks", "Tasks"], ["insights", "Insights"], ["ai", "AI assistant"], ["calls", "Call agent"], ["privacy", "Privacy and security"], ["get", "Get the app"]];

  function shell(active, inner) {
    var nav = NAV.map(function (n) {
      var cnt = n[0] === "tasks" ? '<span class="count">' + openTasks().length + "</span>" : n[0] === "ai" ? (S.drafts.length ? '<span class="count">' + S.drafts.length + "</span>" : "") : "";
      return '<a href="#/' + n[0] + '" class="' + (active === n[0] ? "on" : "") + '">' + n[1] + cnt + "</a>";
    }).join("");
    return '<div class="demo-banner"><b>Demo sandbox.</b> Fictional data only. Your changes stay in this browser tab and everything resets when you sign out, after ' + CFG.idleMinutes +
      ' quiet minutes, or when you close the tab. Idle reset in <b id="idle">--:--</b>.</div>' +
      '<div class="layout"><aside class="side"><div class="logo"><img src="logo.png" alt="" class="lg">Atelier<small>CLIENT RELATIONS</small></div><nav class="nav">' + nav + '</nav>' +
      '<div class="me"><b>Demo Visitor</b>' + esc(S.user.email) + '<div class="field" style="margin:10px 0 8px"><label>Kind of business</label><select id="ptype2">' + typeOptions(S.preset) + '</select></div><a href="#/signout" id="signout">Sign out and reset</a></div></aside>' +
      '<main class="main"><div class="content">' + inner + '</div><div class="foot">Atelier CRM <span>&middot;</span> demo with fictional data <span>&middot;</span> Created by OneUni Global</div></main></div>';
  }

  function vDashboard() {
    var total = S.clients.length, open = S.clients.filter(function (c) { return OPEN.indexOf(c.status) > -1; });
    var pipe = open.reduce(function (a, c) { return a + c.value; }, 0);
    var stat = STATUSES.map(function (st) { return [st, S.clients.filter(function (c) { return c.status === st; }).length]; });
    var mx = Math.max.apply(null, stat.map(function (x) { return x[1]; }).concat([1]));
    var src = {}; S.clients.forEach(function (c) { var k = c.ref || "direct"; src[k] = (src[k] || 0) + 1; });
    var srcRows = Object.keys(src).sort(function (a, b) { return src[b] - src[a]; });
    var latest = S.clients.slice().sort(function (a, b) { return b.created - a.created; }).slice(0, 5);
    var tasks = openTasks().slice(0, 5);
    return '<div class="top"><div><h1>Good day, Demo</h1><p>Here is where your clients stand today.</p></div><a class="btn" href="#/clients">Open clients</a></div>' +
      '<div class="grid g4"><div class="card kpi"><div class="n">' + total + '</div><div class="l">Clients</div></div><div class="card kpi"><div class="n">' + open.length + '</div><div class="l">Open enquiries</div></div>' +
      '<div class="card kpi"><div class="n">' + money(pipe) + '</div><div class="l">Open pipeline</div></div><div class="card kpi"><div class="n">' + openTasks().length + '</div><div class="l">Open tasks</div></div></div>' +
      '<div class="grid g22" style="margin-top:16px"><div class="card"><h3>Pipeline</h3>' + stat.map(function (x) {
        return '<div class="hb"><span>' + esc(x[0]) + '</span><i style="width:' + Math.round(x[1] / mx * 100) + '%"></i><em>' + x[1] + "</em></div>";
      }).join("") + '</div><div class="card"><h3>Where clients come from</h3>' + srcRows.map(function (k) {
        return '<div class="hb"><span>' + esc(k) + '</span><i style="width:' + Math.round(src[k] / total * 100) + '%"></i><em>' + src[k] + "</em></div>";
      }).join("") + "</div></div>" +
      '<div class="grid g22" style="margin-top:16px"><div class="card"><h3>Latest enquiries</h3><table>' + latest.map(function (c) {
        return '<tr><td><a href="#/client/' + c.id + '">' + esc(c.name) + "</a><br><small class=\"mut\">" + esc(c.exp) + "</small></td><td>" + pill(c.status) + "</td></tr>";
      }).join("") + '</table></div><div class="card"><h3>Open tasks</h3>' + (tasks.length ? "<table>" + tasks.map(function (x) {
        return '<tr><td><a href="#/client/' + x.c.id + '">' + esc(x.t.title) + "</a></td><td class=\"mut\">" + esc(x.t.due) + "</td></tr>";
      }).join("") + "</table>" : '<p class="mut">All caught up.</p>') + "</div></div>";
  }

  var F = { q: "", st: "" };
  function vClients() {
    var list = S.clients.filter(function (c) {
      var hay = (c.name + " " + c.email + " " + c.country + " " + c.exp + " " + c.page).toLowerCase();
      return (!F.q || hay.indexOf(F.q.toLowerCase()) > -1) && (!F.st || c.status === F.st);
    }).sort(function (a, b) { return b.created - a.created; });
    var body;
    if (!list.length) body = '<div class="card"><p class="mut">No clients match.</p></div>';
    else if (S.view === "card") body = '<div class="cards">' + list.map(function (c) {
      return '<a class="lead-card" href="#/client/' + c.id + '"><div class="nm">' + esc(c.name) + '</div><div class="meta">' + esc(c.exp) + " &middot; " + esc(c.country) + '</div><div class="meta">' +
        c.guests + " " + unitFor(c.guests) + " &middot; " + esc(c.budget) + '</div><div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center">' + pill(c.status) + '<b class="gold">' + money(c.value) + "</b></div></a>";
    }).join("") + "</div>";
    else body = '<div class="card"><table><tr><th>Client</th><th>Experience</th><th>Country</th><th>Status</th><th>Value</th></tr>' + list.map(function (c) {
      return '<tr><td><a href="#/client/' + c.id + '">' + esc(c.name) + "</a></td><td>" + esc(c.exp) + "</td><td>" + esc(c.country) + "</td><td>" + pill(c.status) + "</td><td>" + money(c.value) + "</td></tr>";
    }).join("") + "</table></div>";
    return '<div class="top"><div><h1>Clients</h1><p>' + list.length + ' of ' + S.clients.length + ' shown. Search, filter and open any client.</p></div><div><button id="addc">Add client</button></div></div>' +
      '<div class="card" style="margin-bottom:16px"><div class="row"><div><label>Search</label><input id="fq" value="' + esc(F.q) + '" placeholder="Name, country, experience, page"></div>' +
      '<div><label>Status</label><select id="fs"><option value="">All statuses</option>' + STATUSES.map(function (s) { return "<option" + (F.st === s ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + '</select></div>' +
      '<div><label>View</label><select id="fv"><option value="card"' + (S.view === "card" ? " selected" : "") + '>Cards</option><option value="table"' + (S.view === "table" ? " selected" : "") + '>Table</option></select></div></div></div>' + body;
  }

  var TAB = "conv";
  function vClient(id) {
    var c = byId(id); if (!c) return '<div class="card"><p>That client is not in your sandbox. <a href="#/clients">Back to clients</a></p></div>';
    var tabs = [["conv", "Conversation"], ["time", "Timeline"], ["tasks", "Tasks"], ["notes", "Notes"], ["calls", "Calls"]];
    var pane = "";
    if (TAB === "conv") {
      pane = (c.msgs.length ? c.msgs.map(function (m) { return '<div class="bub ' + m.dir + '"><small>' + (m.dir === "in" ? esc(firstName(c)) : "You") + " &middot; " + esc(m.w) + "</small>" + esc(m.text) + "</div>"; }).join("") : '<p class="mut">No messages yet. Write the first one below.</p>') +
        '<div class="field" style="margin-top:14px"><label>Reply by email</label><textarea id="reply" placeholder="Write a reply"></textarea></div>' +
        '<div class="row2"><button id="send">Send reply</button><button class="ghost" id="aidraft">Ask the AI assistant for a draft</button><button class="ghost" id="aibrief">Brief me on this client</button></div><div id="aiout"></div>';
    } else if (TAB === "time") pane = '<div class="tl">' + c.timeline.map(function (x) { return "<div><b>" + esc(x.w) + "</b> " + esc(x.t) + "</div>"; }).join("") + "</div>";
    else if (TAB === "tasks") pane = (c.tasks.length ? "<table>" + c.tasks.map(function (t) { return '<tr><td><input type="checkbox" class="chk" data-t="' + t.id + '"' + (t.done ? " checked" : "") + ' style="width:auto"></td><td' + (t.done ? ' class="mut" style="text-decoration:line-through"' : "") + ">" + esc(t.title) + '</td><td class="mut">' + esc(t.due) + "</td></tr>"; }).join("") + "</table>" : '<p class="mut">No tasks.</p>') +
      '<div class="row" style="margin-top:12px"><input id="nt" placeholder="New task, for example: Send the proposal"><button id="addt" style="flex:0 0 auto">Add task</button></div>';
    else if (TAB === "notes") pane = (c.notes.length ? c.notes.map(function (n) { return '<div class="bub out"><small>' + esc(n.w) + "</small>" + esc(n.text) + "</div>"; }).join("") : '<p class="mut">No notes yet.</p>') +
      '<div class="field" style="margin-top:12px"><textarea id="nn" placeholder="Add a private note for your team"></textarea></div><button id="addn">Save note</button>';
    else pane = c.calls.length ? c.calls.map(callCard).join("") : '<p class="mut">No calls filed yet. Try the <a href="#/calls">call agent</a> to see one filed here.</p>';
    return '<div class="top"><div><a href="#/clients" class="mut">&larr; Clients</a><h1>' + esc(c.name) + "</h1><p>" + esc(c.exp) + " &middot; " + esc(c.country) + " &middot; owner " + esc(c.owner) + "</p></div><div>" + pill(c.status) + "</div></div>" +
      '<div class="grid g2"><div class="card"><div class="tabs">' + tabs.map(function (t) { return '<a href="#" class="tab' + (TAB === t[0] ? " on" : "") + '" data-tab="' + t[0] + '">' + t[1] + "</a>"; }).join("") + "</div>" + pane + "</div>" +
      '<div class="card"><h3>Details</h3><dl class="dl"><dt>Email</dt><dd>' + esc(c.email) + "</dd><dt>Phone</dt><dd>" + esc(c.phone) + "</dd><dt>" + esc(P().interest) + "</dt><dd>" + esc(c.exp) + "</dd><dt>" + esc(P().size) + "</dt><dd>" + c.guests + "</dd><dt>Budget</dt><dd>" + esc(c.budget) + "</dd><dt>Came from</dt><dd>" + esc(c.page) + (c.ref ? " via " + esc(c.ref) : "") + "</dd></dl>" +
      '<div class="field"><label>Status</label><select id="cst">' + STATUSES.map(function (s) { return "<option" + (c.status === s ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + '</select></div>' +
      '<div class="field"><label>Deal value (USD)</label><input id="cval" type="number" value="' + c.value + '"></div></div></div>';
  }

  function vTasks() {
    var o = openTasks();
    return '<div class="top"><div><h1>Tasks</h1><p>Every follow-up, assigned to a person.</p></div></div><div class="card">' + (o.length ? "<table><tr><th></th><th>Task</th><th>Client</th><th>Due</th></tr>" + o.map(function (x) {
      return '<tr><td><input type="checkbox" class="gchk" data-c="' + x.c.id + '" data-t="' + x.t.id + '" style="width:auto"></td><td>' + esc(x.t.title) + '</td><td><a href="#/client/' + x.c.id + '">' + esc(x.c.name) + '</a></td><td class="mut">' + esc(x.t.due) + "</td></tr>";
    }).join("") + "</table>" : '<p class="mut">All caught up. Open a client to add a task.</p>') + "</div>";
  }

  function vInsights() {
    function group(fn) { var g = {}; S.clients.forEach(function (c) { var k = fn(c) || "direct"; g[k] = g[k] || { n: 0, v: 0 }; g[k].n++; g[k].v += c.value; }); return g; }
    function block(title, g) {
      var ks = Object.keys(g).sort(function (a, b) { return g[b].v - g[a].v; }), mx = Math.max.apply(null, ks.map(function (k) { return g[k].v; }).concat([1]));
      return '<div class="card"><h3>' + title + "</h3>" + ks.map(function (k) { return '<div class="hb"><span>' + esc(k) + '</span><i style="width:' + Math.round(g[k].v / mx * 100) + '%"></i><em>' + g[k].n + " &middot; " + money(g[k].v) + "</em></div>"; }).join("") + "</div>";
    }
    return '<div class="top"><div><h1>Insights</h1><p>Clients and deal value by page, referrer, country and status.</p></div></div><div class="grid g22">' +
      block("By page", group(function (c) { return c.page; })) + block("By referrer", group(function (c) { return c.ref; })) + block("By country", group(function (c) { return c.country; })) + block("By status", group(function (c) { return c.status; })) + "</div>";
  }

  function vAI() {
    var drafts = S.drafts.map(function (d) {
      var c = byId(d.clientId); if (!c) return "";
      return '<div class="card" style="margin-bottom:12px"><div class="row2"><b>' + esc(c.name) + '</b><span class="pill">' + (d.reason === "reply" ? "Reply draft" : "Follow-up draft") + "</span>" + (d.blocked ? '<span class="pill s-lost">Blocked</span>' : '<span class="pill s-confirmed">Needs your approval</span>') + "</div>" +
        (d.blocked ? '<p class="bad">Blocked: the draft quoted ' + esc(d.blocked) + ", which is not in your facts.</p>" : "") +
        '<textarea data-d="' + d.id + '" class="dbody">' + esc(d.body) + '</textarea><div class="row2" style="margin-top:8px">' +
        (d.blocked ? "" : '<button class="dsend" data-d="' + d.id + '">Approve and send</button>') + '<button class="ghost ddel" data-d="' + d.id + '">Dismiss</button></div></div>';
    }).join("");
    return '<div class="top"><div><h1>AI assistant</h1><p>Drafts replies and gentle follow-ups from your own facts. A person approves each one.</p></div></div>' +
      '<div class="note">In this demo the writing is simulated so it works for everyone with no setup. In the real product you choose a free local model (LM Studio or Ollama, nothing leaves your computer) or a cloud model with your own key.</div>' +
      '<div class="grid g22"><div class="card"><h3>Engine and mode</h3><div class="field"><label>Where the AI runs</label><select disabled><option>Local AI (LM Studio or Ollama) - free</option><option>Cloud AI (your own API key)</option></select></div>' +
      '<div class="field"><label>Mode</label><select disabled><option>Draft for approval (replies are never sent automatically)</option><option>Send follow-ups automatically, 08:00 to 20:00, daily limit</option></select></div>' +
      '<div class="field"><label>Business profile (the only facts it may use)</label><textarea readonly>' + esc(P().profile) + "</textarea></div></div>" +
      '<div class="card"><h3>Its rules</h3><ul class="rules"><li>Uses only the client file and your business profile</li><li>Any money amount that is not in your facts blocks the draft</li><li>Never leaves placeholders or says it is an AI</li><li>Writes in the language the client used</li><li>Stops for anyone who says stop, unsubscribe or not interested</li><li>Follow-ups are limited by days of quiet, touches per client and a daily cap</li></ul></div></div>' +
      '<div class="card" style="margin-top:16px"><h3>Try the safety check</h3><p class="mut">Paste or type a message. If it quotes a price that is not in the business profile, it is blocked, just as the real assistant does.</p><textarea id="gtext" placeholder="For example: We can offer you this for $777."></textarea><div class="row2" style="margin-top:8px"><button id="gbtn">Check message</button></div><div id="gout"></div></div>' +
      '<div class="top" style="margin-top:22px"><div><h3>Drafts waiting for you</h3></div><div><button id="sweep">Check for quiet clients</button></div></div>' + (drafts || '<div class="card"><p class="mut">No drafts yet. Press "Check for quiet clients" to see follow-ups written for clients who have gone quiet.</p></div>');
  }

  function callCard(x) {
    return '<div class="card" style="margin-bottom:12px"><div class="row2"><b>' + esc(x.title) + '</b><span class="pill">' + esc(x.langs) + '</span><span class="mut">' + esc(x.w) + "</span></div>" +
      '<h4>Summary for staff</h4><div class="sum">' + x.summary + '</div><h4>Transcript</h4>' + x.turns.map(function (t) { return '<div class="bub ' + (t.who === "caller" ? "in" : "out") + '" dir="auto"><small>' + (t.who === "caller" ? "Caller" : "Agent") + "</small>" + esc(t.text) + "</div>"; }).join("") + "</div>";
  }
  function vCalls() {
    var opts = LANGS.map(function (l) { return '<option value="' + l.code + '">' + l.name + "</option>"; }).join("");
    var cl = '<option value="new">New caller (from their WhatsApp number)</option>' + S.clients.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + "</option>"; }).join("");
    return '<div class="top"><div><h1>Call agent</h1><p>Answers calls in real time, speaks the caller\'s language and files everything on the client.</p></div></div>' +
      '<div class="note">Simulated call: no real phone or microphone is used here. The real agent speaks through your own computer and local AI model.</div>' +
      '<div class="grid g22"><div class="card"><h3>Start a simulated call</h3><div class="field"><label>Who is calling</label><select id="cwho">' + cl + '</select></div>' +
      '<div class="row"><div class="field"><label>Caller speaks (first question)</label><select id="cl1">' + opts + '</select></div><div class="field"><label>Then switches to (second question)</label><select id="cl2">' + opts.replace('value="en"', 'value="en"') + '</select></div></div>' +
      '<div class="field"><label><input type="checkbox" id="crec" style="width:auto"' + (S.recording ? " checked" : "") + '> Recording on (the agent first says the call is being recorded)</label></div><button id="callgo">Start call</button> <button class="ghost" id="callstop" style="display:none">Hang up</button></div>' +
      '<div class="card"><h3>What it can do</h3><ul class="rules"><li><b>10 languages:</b> ' + LANGS.map(function (l) { return l.name; }).join(", ") + '</li><li>Or <b>detect the caller\'s language</b> each time they speak, even if they switch mid-call</li><li>Answers only from your facts, otherwise hands over to a person</li><li>Files the transcript, a staff summary and a call-back task</li><li>Never dials out, has no tools, can be paused for 10 minutes</li></ul></div></div>' +
      '<div class="card" style="margin-top:16px"><h3>Live call</h3><div id="callbox" class="callbox"><p class="mut">Press "Start call" to watch the agent answer.</p></div></div>' +
      '<h3 style="margin-top:22px">Calls filed in this sandbox</h3>' + (S.calls.length ? S.calls.map(callCard).join("") : '<div class="card"><p class="mut">No calls yet.</p></div>');
  }

  function vPrivacy() {
    var rows = [["Who holds my client data?", "You do. It lives in one file on your own computer or server, with no vendor cloud and no per-user subscription."],
      ["Does it send my data to an AI company?", "Only if you choose a cloud AI and paste your own key. With a local AI the conversation stays on your machine. The AI is off until you switch it on."],
      ["Do calls leave my computer?", "The call agent's speech recognition, AI model and voice run on your computer, and its service accepts only local connections."],
      ["Where are passwords and keys kept?", "Encrypted. The master key is wrapped with your Windows account, so copying the data folder to another computer does not open them."],
      ["How are team passwords protected?", "Salted hashes, a 10 character minimum, lockout after 5 wrong attempts, sign-in rate limits and an optional authenticator-app two-step sign-in."],
      ["Can staff see everything?", "No. People see only the clients assigned to them unless allowed, and email and phone can be masked per person."],
      ["Who did what?", "An audit log records sign-ins, settings changes, call pauses and other sensitive actions."],
      ["Can the AI say something wrong or pushy?", "It uses only your facts, invented prices are blocked by the program, replies need human approval, and it stops for anyone who asks."],
      ["What cannot be promised?", "No software is unbreakable. Someone signed in to your computer can use the app, and call recordings rely on the computer's user account."]];
    return '<div class="top"><div><h1>Privacy and security</h1><p>The concerns clients ask about, and how Atelier CRM answers them.</p></div></div><div class="card"><table>' +
      rows.map(function (r) { return "<tr><td><b>" + r[0] + "</b></td><td>" + r[1] + "</td></tr>"; }).join("") + "</table></div>";
  }

  function vGet() {
    var u = CFG.contactUrl;
    return '<div class="top"><div><h1>Get Atelier CRM</h1><p>Self-hosted, no per-seat fee, set up with you. Tell us how enquiries reach you today and we will reply.</p></div><a class="btn" href="' + esc(u) + '" target="_blank" rel="noopener">Open the form in a new tab</a></div>' +
      '<div class="card" style="padding:0;overflow:hidden"><iframe src="' + esc(u) + '" title="Contact form" style="width:100%;height:1100px;border:0;background:#fff" loading="lazy"></iframe></div>' +
      '<p class="mut" style="margin-top:10px">If the form does not show above, use "Open the form in a new tab". It is the same contact form as the DWJ Automations blog, so your message reaches us directly and no email app is needed.</p>';
  }

  function vLanding(msg) {
    return '<div class="land"><img src="logo.png" alt="" class="lg2"><h1>Atelier CRM</h1><p class="lead">A CRM for any business that wins clients through enquiries: agencies, real estate, clinics, shops, schools, events, travel and more. Choose your kind of business, then try the real screens with fictional clients in your own sandbox.</p>' +
      (msg ? '<div class="flash">' + esc(msg) + "</div>" : "") +
      '<div class="field" style="max-width:340px;margin:0 auto 14px;text-align:left"><label>Your kind of business</label><select id="ptype">' + typeOptions("general") + '</select></div><button id="start" class="big">Start my demo sandbox</button><p class="mut">No sign-up. We create a temporary account for you. It resets when you sign out, after ' + CFG.idleMinutes + ' quiet minutes, or when you close the tab. Many people can try it at the same time and never see each other\'s changes.</p>' +
      '<div class="feat"><div><b>One card per client</b><br>Every enquiry, message, call, task and note in one place.</div><div><b>AI sales assistant</b><br>Drafts replies and follow-ups from your facts, with your approval.</div><div><b>Call agent, 10 languages</b><br>Answers calls, detects the caller\'s language and files the call.</div><div><b>Private by design</b><br>Your data stays on your own computer. No per-seat fee.</div></div></div>';
  }

  /* ---------------------------------------------------------------- calls (scripted, clearly simulated) */
  function runCall() {
    var run = ++callRun, box = $("#callbox"), l1 = LANGS.filter(function (l) { return l.code === $("#cl1").value; })[0], l2 = LANGS.filter(function (l) { return l.code === $("#cl2").value; })[0];
    var who = $("#cwho").value, rec = $("#crec").checked; S.recording = rec; save();
    var turns = [], steps = [];
    var greet = (rec ? "This call is being recorded. " : "") + "Hello, this is Sara from " + P().brand + ". How can I help you?";
    steps.push(["agent", greet, null]);
    steps.push(["caller", l1.q1, l1]); steps.push(["agent", l1.a1, l1]);
    steps.push(["caller", l2.q2, l2]); steps.push(["agent", l2.h, l2]);
    box.innerHTML = '<div class="mut">Ringing...</div>'; $("#callgo").style.display = "none"; $("#callstop").style.display = "";
    var i = 0;
    function next() {
      if (run !== callRun || !$("#callbox")) return;
      if (i >= steps.length) return finish();
      var s = steps[i++], t = { who: s[0], text: s[1] }; turns.push(t);
      var chip = s[0] === "caller" && s[2] ? '<span class="chip">Detected language: ' + s[2].name + "</span>" : "";
      var voiceBtn = s[2] && s[0] === "agent" ? ' <a href="#" class="say" data-l="' + s[2].bcp + '" data-t="' + esc(s[1]) + '">hear it</a>' : "";
      box.innerHTML += '<div class="bub ' + (s[0] === "caller" ? "in" : "out") + '" dir="auto"><small>' + (s[0] === "caller" ? "Caller" : "Agent") + "</small>" + esc(s[1]) + voiceBtn + chip + "</div>";
      setTimeout(next, 1500);
    }
    function finish() {
      var c = who === "new" ? null : byId(Number(who)), name = c ? c.name : "Unknown caller (WhatsApp)", langs = l1.name === l2.name ? l1.name : l1.name + " then " + l2.name;
      var summary = "<ul><li><b>Wants:</b> opening hours, then to speak to a person about a payment.</li><li><b>Agent already said:</b> open Monday to Friday, 9 am to 5 pm.</li><li><b>Open:</b> the payment question, which the agent cannot answer.</li>" +
        "<li><b>Suggested next step:</b> call back today on this number.</li><li><b>Tone:</b> calm and polite.</li><li><b>Languages heard:</b> " + esc(langs) + "</li></ul>" +
        '<p class="mut" dir="auto">Caller\'s last words, word for word: ' + esc(l2.q2) + "</p>";
      var rec2 = { title: "Call with " + name, langs: langs, w: nowStr(), summary: summary, turns: turns };
      if (!c) { c = { id: S.nextId++, name: name, email: "", phone: "+44 7700 900999", country: "Unknown", guests: 1, exp: "Phone enquiry", budget: "-", page: "WhatsApp call", ref: "", status: "New Enquiry", value: 0, created: Date.now(), owner: "Maya", notes: [], tasks: [], timeline: [{ w: nowStr(), t: "New client created from a WhatsApp call" }], msgs: [], calls: [] }; S.clients.push(c); }
      c.calls.unshift(rec2); S.calls.unshift(rec2);
      addTimeline(c, "Call answered by the call agent (" + langs + ")");
      c.tasks.push({ id: Date.now(), title: "Call this client back now. The call agent could not answer: payment question", due: "Today", done: false });
      save();
      box.innerHTML += '<div class="flash">Call ended. The transcript, staff summary and a call-back task were filed on ' + esc(name) + ".</div>";
      $("#callstop").style.display = "none"; $("#callgo").style.display = "";
      setTimeout(function () { if ((location.hash || "").indexOf("calls") > -1) render(); }, 1800);
    }
    setTimeout(next, 1200);
  }

  /* ---------------------------------------------------------------- render + events */
  function render() {
    var app = $("#app"), h = (location.hash || "#/").replace(/^#\/?/, ""), parts = h.split("/"), p = parts[0] || "dashboard";
    if (!S) { app.innerHTML = vLanding(render.msg); render.msg = ""; var b = $("#start"); if (b) b.onclick = function () { S = build($("#ptype") ? $("#ptype").value : "general"); save(); startTimers(); location.hash = "#/dashboard"; render(); }; return; }
    if (p === "signout") { wipe(); render.msg = "You signed out and the sandbox was wiped. Start a new one any time."; location.hash = "#/"; return; }
    var inner = "", active = p;
    if (p === "client") { inner = vClient(Number(parts[1])); active = "clients"; }
    else if (p === "clients") inner = vClients(); else if (p === "tasks") inner = vTasks(); else if (p === "insights") inner = vInsights();
    else if (p === "ai") inner = vAI(); else if (p === "calls") inner = vCalls(); else if (p === "privacy") inner = vPrivacy(); else if (p === "get") inner = vGet();
    else { inner = vDashboard(); active = "dashboard"; }
    app.innerHTML = shell(active, inner); window.scrollTo(0, 0); bind(p, parts);
    var el = $("#idle"); if (el) { var left = CFG.idleMinutes * 60000 - (Date.now() - S.last); el.textContent = Math.floor(left / 60000) + ":" + ("0" + Math.floor(left % 60000 / 1000)).slice(-2); }
  }
  function route(msg) { render.msg = msg || ""; if (location.hash === "#/" || location.hash === "") render(); else location.hash = "#/"; }
  function on(sel, ev, fn) { var e = $(sel); if (e) e.addEventListener(ev, fn); }
  function all(sel, ev, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), function (e) { e.addEventListener(ev, function (x) { fn(e, x); }); }); }

  function bind(p, parts) {
    if (p === "clients") {
      on("#fq", "input", function (e) { F.q = e.target.value; var pos = e.target.selectionStart; render(); var q = $("#fq"); q.focus(); q.setSelectionRange(pos, pos); });
      on("#fs", "change", function (e) { F.st = e.target.value; render(); });
      on("#fv", "change", function (e) { S.view = e.target.value; save(); render(); });
      on("#addc", "click", addClientModal);
    }
    if (p === "client") {
      var c = byId(Number(parts[1])); if (!c) return;
      all(".tab", "click", function (e, ev) { ev.preventDefault(); TAB = e.getAttribute("data-tab"); render(); });
      on("#cst", "change", function (e) { setStatus(c, e.target.value); save(); toast("Status updated"); render(); });
      on("#cval", "change", function (e) { c.value = Math.max(0, Number(e.target.value) || 0); addTimeline(c, "Deal value set to " + money(c.value)); save(); toast("Deal value saved"); });
      on("#send", "click", function () { var t = $("#reply").value.trim(); if (!t) return toast("Write a reply first"); sendMessage(c, t, false); save(); toast("Reply sent (demo: nothing leaves your browser)"); render(); });
      on("#aidraft", "click", function () { var d = writeDraft(c, "reply"); $("#aiout").innerHTML = '<div class="note" style="margin-top:12px"><b>AI draft, needs your approval.</b> Simulated in this demo.' + (d.blocked ? '<br><span class="bad">Blocked: it quoted ' + esc(d.blocked) + ", which is not in your facts.</span>" : "") + "</div>"; if (!d.blocked) { $("#reply").value = d.body; } });
      on("#aibrief", "click", function () {
        var last = ""; c.msgs.forEach(function (m) { if (m.dir === "in") last = m.text; });
        $("#aiout").innerHTML = '<div class="note" style="margin-top:12px"><b>Briefing (private team note, never sent to the client)</b><ul><li><b>Wants:</b> ' + esc(c.exp) + " for " + c.guests + " guests, budget " + esc(c.budget) + ".</li><li><b>Came from:</b> " + esc(c.page) + (c.ref ? " via " + esc(c.ref) : "") + ".</li><li><b>Status:</b> " + esc(c.status) + ".</li><li><b>Last message from client:</b> " + (last ? esc(last) : "none yet") + "</li><li><b>Suggested next step:</b> " + (c.status === "New Enquiry" ? "reply today and offer a free consultation call." : "keep the conversation moving toward a proposal.") + "</li></ul></div>";
      });
      all(".chk", "change", function (e) { c.tasks.forEach(function (t) { if (t.id === Number(e.getAttribute("data-t"))) t.done = e.checked; }); save(); render(); });
      on("#addt", "click", function () { var t = $("#nt").value.trim(); if (!t) return; c.tasks.push({ id: Date.now(), title: t, due: "Tomorrow", done: false }); addTimeline(c, "Task added: " + t); save(); render(); });
      on("#addn", "click", function () { var t = $("#nn").value.trim(); if (!t) return; c.notes.unshift({ text: t, w: nowStr() }); addTimeline(c, "Note added"); save(); render(); });
    }
    if (p === "tasks") all(".gchk", "change", function (e) { var c = byId(Number(e.getAttribute("data-c"))); c.tasks.forEach(function (t) { if (t.id === Number(e.getAttribute("data-t"))) t.done = true; }); save(); toast("Task done"); render(); });
    if (p === "ai") {
      on("#gbtn", "click", function () { var t = $("#gtext").value, bad = moneyBad(t, P().profile); $("#gout").innerHTML = bad ? '<div class="flash bad" style="margin-top:10px">Blocked. This message quotes ' + esc(bad) + ", which is not in your business profile.</div>" : '<div class="flash" style="margin-top:10px">Passes the check. It quotes no amount that is missing from your facts.</div>'; });
      on("#sweep", "click", function () {
        var quiet = S.clients.filter(function (c) { return OPEN.indexOf(c.status) > -1 && Date.now() - c.created > 2 * 864e5 && !S.drafts.some(function (d) { return d.clientId === c.id; }); }).slice(0, 3);
        if (!quiet.length) return toast("No quiet clients right now");
        quiet.forEach(function (c) { S.drafts.push(writeDraft(c, "nurture")); }); save(); toast(quiet.length + " follow-up drafts written"); render();
      });
      all(".dsend", "click", function (e) { var d = S.drafts.filter(function (x) { return x.id === Number(e.getAttribute("data-d")); })[0], ta = document.querySelector('.dbody[data-d="' + d.id + '"]'); var c = byId(d.clientId); sendMessage(c, ta.value, true); S.drafts = S.drafts.filter(function (x) { return x !== d; }); save(); toast("Approved and sent (demo)"); render(); });
      all(".ddel", "click", function (e) { S.drafts = S.drafts.filter(function (x) { return x.id !== Number(e.getAttribute("data-d")); }); save(); render(); });
    }
    if (p === "calls") {
      $("#cl2").value = "ur"; $("#cl1").value = "en";
      on("#callgo", "click", runCall); on("#callstop", "click", function () { callRun++; $("#callbox").innerHTML += '<div class="flash">Call ended early.</div>'; $("#callstop").style.display = "none"; $("#callgo").style.display = ""; });
    }
    on("#ptype2", "change", function (e) {
      var u = S.user; S = build(e.target.value); S.user = u; save(); toast("Switched to " + P().label + ": sample clients and wording follow your choice"); location.hash = "#/clients"; render();
    });
    on("#signout", "click", function (ev) { ev.preventDefault(); location.hash = "#/signout"; });
  }
  function sayHandler(ev) {
    var a = ev.target.closest && ev.target.closest(".say"); if (!a) return; ev.preventDefault();
    try { var u = new SpeechSynthesisUtterance(a.getAttribute("data-t")); u.lang = a.getAttribute("data-l"); speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { toast("Your browser has no voice for this language"); }
  }
  function addClientModal() {
    var m = document.createElement("div"); m.className = "modal";
    m.innerHTML = '<div class="card box"><h3>Add a client</h3><div class="field"><label>Name</label><input id="mn"></div><div class="row"><div class="field"><label>Email</label><input id="me"></div><div class="field"><label>Country</label><input id="mc"></div></div>' +
      '<div class="row"><div class="field"><label>" + esc(P().interest) + "</label><input id="mx"></div><div class="field"><label>Deal value (USD)</label><input id="mv" type="number" value="5000"></div></div><div class="row2"><button id="mok">Add</button><button class="ghost" id="mno">Cancel</button></div></div>';
    document.body.appendChild(m);
    $("#mno").onclick = function () { m.remove(); };
    $("#mok").onclick = function () {
      var n = $("#mn").value.trim(); if (!n) return toast("Please add a name");
      var c = { id: S.nextId++, name: n, email: $("#me").value, phone: "", country: $("#mc").value || "-", guests: 2, exp: $("#mx").value || "New enquiry", budget: "-", page: "added by hand", ref: "", status: "New Enquiry", value: Number($("#mv").value) || 0, created: Date.now(), owner: "Maya", notes: [], tasks: [{ id: 1, title: "Reply to " + n, due: "Tomorrow", done: false }], timeline: [{ w: nowStr(), t: "Client added by hand" }], msgs: [], calls: [] };
      S.clients.push(c); save(); m.remove(); location.hash = "#/client/" + c.id;
    };
  }

  document.addEventListener("click", sayHandler);
  window.addEventListener("hashchange", function () { render(); });
  document.addEventListener("DOMContentLoaded", function () {
    S = load();
    if (S && Date.now() - S.last > CFG.idleMinutes * 60000) { wipe(); render.msg = "Your sandbox was reset after a quiet period. Start a new one any time."; }
    if (S) startTimers();
    render();
  });
})();
