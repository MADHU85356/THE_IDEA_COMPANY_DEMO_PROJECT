# CampusConnect — Events & Training Mockup

A responsive front-end prototype for the requested Training, Job Description, EMS (Event Management System), and Chat modules.

## Run it
1. Extract `unstop_events_training_mockup.zip`.
2. Open `index.html` in a modern browser.
3. No build step or server is required.

## Features
- Responsive dashboard and sidebar navigation.
- Training cards, search, category/level filters, save controls, and an Add Training form.
- Job descriptions with search and filters, detailed eligibility/skills, save-for-later, and Add Job form.
- EMS event cards, search/type/status filters, event creation, registration deadline display, and demo registration.
- Chat interface with three conversations, message sending, local auto-reply for the coordinator, and clear conversation.
- Data and actions persist in the browser using localStorage.
- Form validation, empty states, toast notifications, and modal dialogs.

## Important limitations
- This is a front-end demo only. It does not connect to Unstop or a real backend.
- Chat messages are local to the browser and are not sent to real users.
- Event registration and job interest are simulated.
- All sample companies, roles, events, and training programs are fictional demo content.
- The design is an original student-workspace concept inspired by common dashboard patterns; it is not an exact copy of Unstop branding or interface.
- Google Fonts are loaded from the internet; fallback fonts are included.

## Reset demo data
In your browser, open Developer Tools → Application/Storage → Local Storage and clear the entries beginning with `campusConnect` or `cc`. Reload the page.
