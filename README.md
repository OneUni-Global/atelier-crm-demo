# Atelier CRM - live demo

An interactive demo that runs entirely in the visitor's own browser. Safe to host publicly on GitHub Pages: it contains only fictional clients, no real data, no keys and no server.

**How the sandbox works**
- A visitor presses "Start my demo sandbox". No sign-up: a temporary account is created in their own browser tab.
- All their changes (status, replies, tasks, notes, new clients, simulated calls, AI drafts) live only in that tab.
- It resets when they sign out, after the idle time, or when they close the tab. Any number of people can use it at once and never see each other's changes, because nothing is shared or sent anywhere.

**Any kind of business:** the visitor chooses their kind of business (general, agency or B2B services, real estate, clinic and beauty, shop or wholesale, school and coaching, events and hospitality, travel and tourism) when they start, and can switch inside the sandbox. The sample clients, the words on the client card and the facts the AI may use all follow the choice. The presets are in `data.js` (`DEMO_PRESETS`).

**What it shows:** client cards and profiles, conversation, timeline, tasks, notes, insights, the AI sales assistant (simulated, with the real price-safety rule), the call agent (simulated, 10 languages with language detection) and the privacy answers. A "Get the app" form lets buyers contact the owner.

**Settings** (top of `data.js`, `DEMO_CONFIG`)
- `idleMinutes`: how many quiet minutes before a sandbox resets (default 10).
- `contactEmail`: where the "Get the app" form opens an email to.
- `contactEndpoint`: optional form service address (for example Formspree) so the form sends without opening an email app.

**Host it on GitHub Pages:** put these files in a repository, then Settings > Pages > deploy from the main branch, root folder.

**Honest note:** the AI writing and the calls are scripted in this demo so it works for everyone with no setup. The real Atelier CRM uses your own local or cloud AI model and a real voice service.

Created by OneUni Global. Designed and directed by Junaid
