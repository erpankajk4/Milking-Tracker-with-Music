# Milking Tracker with Music: Business Logic

## 1. Product overview

Milking Tracker with Music is a mobile first web application for dairy farmers.
It must be easy to understand even when the farmer has limited experience with
web applications.

It helps a farmer:

1. Start and time a milking session.
2. Play calming music during the session.
3. Pause and resume the timer and music together.
4. Record how much milk was collected.
5. Review earlier milking sessions.
6. Use the complete application in English or Hindi.

The application has one simple purpose. It records milking sessions while music
plays for the cattle.

## 2. Main user

The only user defined by the assignment is the dairy farmer.

The interface must use familiar words, large controls, and a clear step by step
flow. Important actions must use visible text labels. An icon alone is not enough.

No customer, administrator, login, account, farm, or cattle profile is defined.

## 3. Complete farmer journey

### Step 1: Open the landing page

The farmer sees:

* A clear `Start Milking` button.
* A link to the Milking History page.

The page must be simple, uncluttered, and easy to use on a mobile phone.

### Step 2: Start milking

When the farmer selects `Start Milking`:

* The application attempts to start the provided calming music directly from
  the farmer's button tap.
* A large timer starts counting.
* Pause and Stop controls become available.
* The session start time is recorded.

Music and the timer begin as one action. The timer is the source of truth for
the milking record. If music cannot play, the timer continues, the application
shows a clear message, and the farmer can select `Retry Music`.

### Step 3: Pause the session

When the farmer selects Pause:

* The music pauses.
* The timer pauses.

Neither continues while the session is paused.

### Step 4: Resume the session

When the farmer selects Resume:

* The music continues from its paused state.
* The timer continues from its paused value.

### Step 5: Stop the session

When the farmer selects Stop:

* The current session ends.
* Stop is allowed while the session is running or paused.
* The music stops and resets for the next session.
* The final timer value is kept as the session duration.
* The session end time is recorded.
* The farmer is asked to enter the quantity of milk collected.

Because the timer itself pauses, paused time is not part of the saved duration.

### Step 6: Save the session

The completed session contains:

* Start time.
* End time.
* Duration in seconds.
* Milk quantity in litres entered by the farmer.

Milk quantity is required, must be a finite number, may contain decimals, and
must be greater than zero. There is no invented maximum quantity.

The frontend sends this information to `POST /sessions`. The backend validates
the request and stores the session in MongoDB.

If saving fails, the stopped session and entered quantity stay available. The
farmer sees a simple error and can retry. The Save action is disabled while a
request is running so one tap cannot create duplicate requests.

Closing the quantity form does not silently lose the session. The farmer can
return to it or explicitly discard the session after confirming that choice.

### Step 7: View milking history

When the farmer opens Milking History:

* The frontend requests real session data from `GET /sessions`.
* The backend reads the stored sessions from MongoDB.
* The frontend shows the returned sessions in a table.
* The newest sessions appear first.

The table contains these columns:

| Column | What it shows |
| --- | --- |
| Date | The calendar date of the session |
| Start Time | When milking started |
| End Time | When milking stopped |
| Duration | The final timer duration |
| Milk Collected | The quantity entered after stopping |

The history must not use sample, dummy, or hardcoded session records.

## 4. Core business rules

| Rule | Required behaviour |
| --- | --- |
| Start | Start music and the timer together |
| Pause | Pause music and the timer together |
| Resume | Resume music and the timer together |
| Stop | Stop music, end the session, and ask for milk quantity |
| Save | Validate and send the completed session to the backend |
| Save failure | Keep all stopped session data and allow retry |
| Audio failure | Keep the timer running, show the failure, and allow music retry |
| History | Read real sessions from the backend, newest first |
| Data source | MongoDB is the permanent source of session data |

During normal playback, the same farmer action controls the timer and music.
There is no separate music Pause or Resume control. A real audio failure is the
only exception: it must not erase or stop an otherwise valid milking record.

The session follows this simple state flow:

```text
idle -> running <-> paused
running or paused -> awaiting quantity -> saving -> saved
```

Stop can move either `running` or `paused` to `awaiting quantity`. A save
failure returns to `awaiting quantity` with the entered data preserved.

## 5. Session data

Each saved session uses the following business data:

| Field | Meaning |
| --- | --- |
| `id` | Unique identity of the stored session |
| `start_time` | UTC date and time when Start Milking was selected |
| `end_time` | UTC date and time when Stop was selected |
| `duration` | Active milking time, stored as whole seconds |
| `milk_quantity` | Litres of milk entered by the farmer |
| `created_at` | UTC time when the database record was created |

The assignment request for `POST /sessions` contains `start_time`, `end_time`,
`duration`, and `milk_quantity`. The assignment suggests `id` and `created_at`
as database fields.

Paused time is excluded from `duration`, so duration may be shorter than the
time between `start_time` and `end_time`. The timer derives active time from
timestamps instead of treating visual timer ticks as the stored value.

The backend accepts a session only when:

* Start and end are valid timestamps.
* End is later than start.
* Duration is a whole number of zero or more seconds.
* Duration does not exceed the total time between start and end.
* Milk quantity is finite and greater than zero.
* Every required field is present.

## 6. Language and ease of use

The farmer must be able to use the full application in English or Hindi.

The application must provide a clear way to change language. The selected
language applies to all text that the farmer sees, including:

* Page titles and navigation.
* Start, Pause, Resume, Stop, Save, and History actions.
* Timer and music status messages.
* The milk quantity prompt and its field guidance.
* History table headings.
* Loading, empty, success, validation, and error messages.

Changing language must not stop, reset, or change the current milking session.
It must not change any saved session data.

Hindi is selected on the first visit. A language choice is remembered in the
browser for later visits. Language does not appear in the page URL. Dates,
times, and numbers use `en-IN` for English and `hi-IN` for Hindi in the
farmer's device timezone. Stored API and MongoDB values remain language neutral.

Both languages follow the same simple interface:

* Use short and familiar words.
* Show one clear main action at a time.
* Use large touch friendly buttons.
* Keep forms short.
* Do not depend on colour or icons alone to explain an action.
* Avoid technical words in farmer facing messages.

## 7. Mobile app like experience

The product runs in a web browser, but the farmer facing experience must feel
like a simple mobile application.

* Each screen has one clear purpose.
* The main content uses the available phone height instead of looking like a
  small desktop website.
* Important controls are large, easy to tap, and placed within comfortable thumb
  reach.
* Navigation, page titles, and back actions stay consistent.
* Button presses, loading, disabled actions, success, and errors give immediate
  visible feedback.
* The experience must not depend on hovering a mouse.
* Phone safe areas must not cover navigation or session controls.
* On a larger screen, the interface stays focused instead of stretching into a
  large dashboard.
* The required history remains a table. On a narrow phone, the table may scroll
  inside its own area without hiding any required column.

### Floating bottom navigation

The main navigation is a floating bar near the bottom of the phone screen.

* It provides direct access to Milking and History.
* Each destination uses both an icon and a visible text label.
* Labels are translated into English and Hindi.
* The current destination is clearly highlighted.
* The active highlight moves smoothly when the destination changes.
* A tapped item gives short visual feedback.
* The navigation sits above the phone safe area and never covers the timer,
  session controls, forms, or history content.
* Movement is reduced or removed when the farmer prefers reduced motion.

The navigation should look calm, modern, rounded, and visually separate from
the page while remaining easy to read.

The normal Milking and History navigation is available while no session is in
progress. While a session is running, paused, awaiting quantity, or saving, the
navigation is replaced by the controls for that session. The farmer cannot open
History and accidentally leave an unfinished session. Normal navigation returns
after the session is saved or explicitly discarded.

Mobile app like does not automatically mean an installable app, offline support,
push notifications, or a native Android or iOS application.

## 8. System responsibilities

### Frontend

The Next.js frontend:

* Shows the landing page and history page.
* Controls the timer and music.
* Collects milk quantity after Stop.
* Sends completed session data to the backend.
* Displays session data returned by the backend.
* Keeps the session unchanged when the language changes.
* Shows honest loading, empty, audio failure, save failure, and retry states.

### Backend

The Node.js and Express backend:

* Provides `POST /sessions` to save a session.
* Provides `GET /sessions` to return sessions.
* Validates incoming data.
* Stores and reads session records through MongoDB.
* Handles API errors properly.
* Returns created records from `POST /sessions` with HTTP `201`.
* Returns a newest first array from `GET /sessions` with HTTP `200`.

### Database

MongoDB permanently stores the milking session records. Music files are not
session data and are not stored in MongoDB.

## 9. End to end data flow

```text
Farmer starts milking
  -> timer starts and music playback is attempted
  -> farmer may pause and resume
  -> farmer stops the session from running or paused
  -> music stops and the timer freezes
  -> farmer enters milk quantity in litres
  -> frontend sends POST /sessions
  -> backend validates the session
  -> MongoDB stores the session
  -> frontend requests GET /sessions
  -> history table shows real stored sessions, newest first
```

## 10. Music and recovery boundaries

The application uses one provided calming track. It repeats while an active
session is running and stops on Pause or Stop. The application does not add a
track picker, playlist, upload, independent music controls, or its own volume
control. The farmer can use the device volume.

The active session survives language changes and normal updates inside the
application. Recovery after a full browser refresh or browser close is outside
this assignment. The product must not claim that an unsaved session can be
recovered after leaving the application.

## 11. Scope boundaries

The following features are not needed for this assignment:

* Authentication, accounts, roles, or access control.
* Farmer, farm, or cattle profiles.
* Editing or deleting saved sessions.
* History pagination.
* PWA installation or offline synchronization.
* Push notifications or background audio after closing the application.
* Music selection, playlists, streaming, or uploads.
* Analytics, dashboards, or milk yield predictions.

Keeping these features out preserves the assignment's simple one day scope.

## 12. Completion condition

The business journey is complete when a farmer can:

1. Start a session with music and a timer.
2. Pause and resume both together.
3. Stop and enter milk quantity.
4. Save the completed session through the backend.
5. Use the floating bottom navigation to open History and see the saved MongoDB record in the required table.
6. Complete the same journey in both English and Hindi without losing session state.
7. Complete the journey comfortably on a phone without needing desktop controls.
8. Recover from audio or save failure without silently losing session data.
