---
"clockify-tracker": patch
---

Reduce timer polling and cache the signed-in user. Respect Clockify API rate limits with request cooldowns, suppress repeated error notifications, and preserve the last timer state when synchronization fails. Prevent automatic tracking and Pomodoro transitions after failed synchronization. Issue: #92
