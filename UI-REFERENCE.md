# UI Image Reference Register

This is the local visual reference for frontend implementation. Add every
generated UI image here before development starts. This file and the referenced
working images stay outside the assignment repository.

## How to use this file

1. Place images in `ui-references/images/` when possible.
2. Keep the original filename or rename it to the screen ID and a short state
   name; either is valid when the registered path is correct.
3. Update the Image path in the register below.
4. Set Status to `Approved` only when that image should guide implementation.
5. Add notes whenever the generated image contains something that should not be
   copied.
6. Keep only one Primary approved image for each screen state. Additional images
   can be marked `Supporting`.

Relative workspace paths are preferred. An absolute Windows path is also
acceptable when an image cannot be copied into this workspace.

## Reference priority

The images define visual direction only. Use this order when something conflicts:

1. The assignment defines required features.
2. `BUSINESS-LOGIC.md` defines product behaviour and scope.
3. `ARCHITECTURE.md` defines technical boundaries and state flow.
4. This file defines approved layout, hierarchy, spacing, colour, and visual tone.
5. Accessibility and responsive behaviour must remain correct even when an image
   does not show them.

Generated text may contain mistakes. Use approved application copy rather than
blindly copying text from an image. Never implement a screen as one large image.

## Global visual reference

| Item | Value |
| --- | --- |
| Primary design anchor | `ui-references/images/दुहाई_ शांत संगीत के साथ.png` |
| Primary language | Hindi |
| Secondary language | English |
| Target mobile viewport | 390 by 844 logical pixels |
| Visual character | Calm, warm, farmer friendly, modern, and uncluttered |
| Main navigation | Floating bottom navigation with Milking and History |
| Active session navigation | Replaced by the current session action dock |
| Large screen behaviour | Keep a focused mobile width instead of stretching into a dashboard |
| Reference status | All required screen states have an Approved primary image |

Change the Primary design anchor if another image becomes the best overall style
reference.

## Screen image register

Status values are `Pending`, `Approved`, `Rejected`, or `Superseded`.
Role values are `Primary` or `Supporting`.

| ID | Route or surface | State | Image path | Status | Role | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| UI-01 | `/` | Milking home, idle | `ui-references/images/दुहाई_ शांत संगीत के साथ.png` | Approved | Primary | Overall colour, spacing, language switch, and navigation anchor. |
| UI-02 | `/` | Session running | `ui-references/images/हिंदी दुहाई सत्र टाइमर.png` | Approved | Primary | Use the timer and active-session action dock; do not show bottom navigation during an active session. |
| UI-03 | `/` | Session paused | `ui-references/images/दुहाई रुकी हुई है.png` | Approved | Primary | Use approved product copy instead of copying the generated pause helper sentence verbatim. |
| UI-04 | `/` | Music playback failure | `ui-references/images/Hindi Dairy Milking Timer Interface.png` | Approved | Primary | Music failure must not stop or reset the milking timer. |
| UI-05 | `/` | Enter milk quantity | `ui-references/images/दूध सत्र सहेजें स्क्रीन.png` | Approved | Primary | Use the quantity-sheet layout; the underlying session must be stopped even if generated background copy suggests otherwise. |
| UI-06 | `/` | Invalid quantity | `ui-references/images/Hindi Milking Session Error Dialog.png` | Approved | Primary | Use as the inline validation layout reference; final text comes from the application dictionary. |
| UI-07 | `/` | Save failure and retry | `ui-references/images/Hindi Milking Session Error Screen.png` | Approved | Primary | Retain entered quantity for retry; the underlying session remains stopped. |
| UI-08 | `/` | Save success | `ui-references/images/सत्र सहेजा गया_ दुहाई ट्रैकर.png` | Approved | Primary | Success summary and next-action reference. |
| UI-09 | `/history` | History with records | `ui-references/images/हिंदी दुहाई इतिहास ऐप इंटरफ़ेस.png` | Approved | Primary | Preserve every required column; horizontal scrolling is acceptable on narrow screens. |
| UI-10 | `/history` | History loading | `ui-references/images/Hindi History Table Loading Screen.png` | Approved | Primary | Skeletons must keep the history table structure stable. |
| UI-11 | `/history` | Empty history | `ui-references/images/Hindi Milking History Empty State.png` | Approved | Primary | Primary action returns to Milking and starts through the normal flow. |
| UI-12 | `/history` | History request failure | `ui-references/images/Hindi Milking History Error Screen.png` | Approved | Primary | Keep Retry primary and navigation back to Milking available. |
| UI-13 | Quantity surface | Confirm session discard | `ui-references/images/हिंदी दुहाई सत्र छोड़ने की पुष्टि.png` | Approved | Primary | Use a modal confirmation; make the destructive action visually distinct. |

Delete unused rows or add a Supporting row when you have more than one useful
image for the same state. Do not add new product features only because an image
generator placed them in a mockup.

## Detailed screen notes

Add one block below for any screen that needs clarification. Copy the template
and replace the placeholders.

```text
### UI-XX: Screen name

Image path:
Approval status:

Must match:
* Layout and hierarchy:
* Colours and surfaces:
* Component shape and spacing:
* Icon treatment:

May adapt:
* Generated text corrections:
* Responsive changes:
* Accessibility changes:

Interaction notes:
* Primary action:
* Secondary action:
* Navigation behaviour:
* Loading or error behaviour:

Motion notes:
* Entry or exit transition:
* Press feedback:
* Reduced motion behaviour:

Do not copy:
* Any incorrect or invented element:
```

## Shared component references

Use this section when one cropped image is the clearest reference for a shared
component.

| Component | Image path | Status | Notes |
| --- | --- | --- | --- |
| Floating bottom navigation | `ui-references/images/दुहाई_ शांत संगीत के साथ.png` | Approved | Milking and History only |
| Active session action dock | `ui-references/images/हिंदी दुहाई सत्र टाइमर.png` | Approved | Pause or Resume and Stop |
| Language switch | `ui-references/images/दुहाई_ शांत संगीत के साथ.png` | Approved | Hindi selected by default |
| Timer surface | `ui-references/images/हिंदी दुहाई सत्र टाइमर.png` | Approved | Large tabular numbers |
| Quantity bottom sheet | `ui-references/images/दूध सत्र सहेजें स्क्रीन.png` | Approved | Short numeric form with litres |
| History table | `ui-references/images/हिंदी दुहाई इतिहास ऐप इंटरफ़ेस.png` | Approved | All required columns remain available |
| Error message | `ui-references/images/Hindi Milking Session Error Screen.png` | Approved | Calm, clear, and retryable |
| Confirmation dialog | `ui-references/images/हिंदी दुहाई सत्र छोड़ने की पुष्टि.png` | Approved | Safe action and destructive action are distinct |

## Implementation rules for image references

* Read every Approved image before building its screen.
* Use the Primary design anchor to keep colour, spacing, and component styling
  consistent across states.
* Use Supporting images only for the specific detail described in Notes.
* Treat missing desktop designs as responsive implementation work, not permission
  to invent a dashboard.
* Preserve the approved behaviour when a static image cannot show interaction.
* Use semantic HTML and real text. Images are references, not application content.
* Use shadcn primitives where they fit and implement the final appearance in code.
* Keep animation short and purposeful, and support reduced motion.
* Do not copy watermarks, fake system controls, browser chrome, device frames, or
  accidental image generation artifacts.
* Do not commit this file or generated working mockups with the assignment.

## Ready for implementation checklist

* [x] Every referenced image path exists and opens correctly.
* [x] The Primary design anchor is marked Approved.
* [x] Every required screen state has one Approved Primary image or a written note
  saying which approved image to reuse.
* [ ] Generated Hindi and English text has been checked separately.
* [x] Any elements that must not be copied are recorded in Notes.
* [x] Shared component references are recorded when useful.
* [x] The images do not introduce features outside the assignment.
