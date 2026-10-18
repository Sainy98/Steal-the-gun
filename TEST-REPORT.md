# Bump Bandits — executed verification

Date: 18 October 2026.

## Passed

- `npm run check`: JavaScript syntax checks for server entry, engine and browser client.
- `npm test`: **22 tests passed, 0 failed**.
- `BACKEND_URL=https://example.onrender.com npm run build:vercel`: static frontend export completed. That URL was test configuration only; it is not a deployed game URL and the generated `dist/` is excluded from the delivery ZIP.

The 22 tests cover:

1. Match startup and distinct shuffled starting weapons.
2. Input validation and rejection of client-provided positions/scores.
3. Cannon recoil, ammunition and cooldown.
4. Exact weapon-object/ammo exchange and swap lock.
5. Ordinary contact and spawn-shield behavior.
6. Unarmed-to-armed exchange.
7. Capturing short jump input edges before the next physics tick.
8. Double-jump limit.
9. Throw/pickup ammunition preservation.
10. All six weapon attack paths and finite physics state.
11. Projectile knockback and attacker attribution.
12. Balloon lift and projectile popping.
13. Elimination, knockout credit and a single round reward.
14. Platform collapse and round timeout.
15. Private server fields excluded from public snapshots.
16. Complete eight-round ranking and exact ties.
17. A complete seeded four-CPU tournament with finite physics and bounded object counts, advanced at simulation speed.
18. Four independent real WebSocket clients: join, room capacity, invalid code, ready, host permissions, actual dash-contact swap, reconnect, duplicate-tab replacement, results, rematch and command idempotency.
19. Explicitly labelled CPU practice.
20. WebSocket origin rejection and configured-origin acceptance.
21. Optional disk checkpoint restoration after server restart.
22. Frontend document ID linkage and absence of runtime CDN scripts.

The network tests run a listening HTTP/WebSocket server and independent clients. They are not mock multiplayer. The full tournament engine test advances the simulation clock quickly; it is not a timed human playtest.

## Release packaging

**Passed:** the source archive was extracted into a fresh temporary folder. Its own server served the HTML, JavaScript, CSS, icon, configuration and health endpoint, then accepted a real WebSocket connection and started a four-player room containing one human session and three labelled CPUs. No files outside the extracted archive were required.

## Not verified here

- Browser interaction, screenshot/visual QA, or real-phone playtesting.
- Browser-specific touch, audio-unlock and vibration behavior.
- Render or Vercel deployment in the user's accounts.
- Internet multiplayer latency, load at scale, competitive balance, human enjoyment or replay demand.
- Penetration testing or a security audit of the vendored transport dependency.

A required browser-control capability was not available in this managed environment. No browser was installed or substituted. Deployment files and API/network tests are not presented as live hosting verification.

## Known practical limits

- One authoritative server instance; no horizontal room routing.
- Default memory storage resets rooms on process restart. Persistent `DATA_DIR` checkpoints are optional and may lose changes since the last checkpoint after a crash.
- Custom arcade circle/platform physics, not articulated ragdolls. Platforms are one-way from below.
- Snapshot smoothing, not full rollback/client prediction; latency is noticeable in action combat.
- CPU opponents use simple heuristics.
- Touch aim assist is intended for casual play, not equalized competitive esports input.
- Normal inactivity/host-sleep behavior depends on the selected hosting plan.
