# Project memory

## Product intent & audience

- Web platform for AI roleplay chats with selectable characters.
- Audience includes Android users on low-end devices, plus tablets and desktops.
- Phase 1 complete: architecture, catalog/UI, responsive/perf optimization. Phase 2 (backend, AI, auth, payments) not started.

## Brand personality & voice

- Professional, polished, production-worthy presentation. Stable over experimental.

## Visual design & UX direction

- Dark theme with emerald accents; preserve visual quality across devices.
- Breakpoints covered: 320, 360, 375, 390, 430, 768, 1024, 1440 px.
- No horizontal overflow; grids collapse to one column on small screens; trends carousel uses safe min-width for 320 px.
- Touch targets ≥ 44 px (search, filters, favorites, "Chatear", back button, bottom nav).
- Text inputs use 16 px font to prevent Android auto-zoom.
- Bottom nav spacing accounts for device gesture/system bars.
- Images: responsive request sizes (cards ~400px, trends ~320px, profile ~800px), lazy loading, async decoding, `loading="lazy"`.
- Image fallback: gradient avatar with character initials on load failure.
- Motion: heavy zoom/jump animations desktop-only; light tactile feedback on mobile. All transitions disabled when `prefers-reduced-motion` is active.
- Android text-size auto-adjust disabled to respect design.
- Existing components: Layout, Header, BottomNav, Avatar, CharacterCard; pages: Home, Explore, Character profile, Chat, Profile, Character creator (last three provisional).

## Decisions, constraints & rationale

- Do not rebuild project or change tech stack; surgical edits only to preserve working features.
- No new dependencies for UI/themes/icons; use lucide-react and Tailwind.
- Favorites persisted via localStorage.
- Search + combinable filters verified working after optimizations.
- Chat, profile, and character creation views remain placeholders for later phases.
- Not yet integrated: Supabase, Firebase, AI APIs, auth, payments, new DBs.

## Open questions & assumptions

- No physical Android device/browser in environment; responsive checks were code-based, not hardware-tested.
- Actual AI chat behavior and backend integration deferred to Phase 2.