# BUMP BANDITS

**Bad gun? Bump someone.**

A playable 2–4 player browser arena brawler. Dash into a rival to swap weapons, including remaining ammo. Recoil, knockback, bouncing shots, double jumps and collapsing platforms create short chaotic fights. The server controls all game physics and scores.

## Start here: easiest way to publish

Use **one Render Web Service** to host the complete game. The same public URL serves the browser interface and its WebSocket multiplayer server.

1. Unzip this project.
2. Upload the contents of the `Bump-Bandits` folder into a new GitHub repository. `package.json`, `render.yaml`, `public/`, `server/` and `vendor/` must be at the repository root.
3. In Render, choose **New → Web Service**, connect that repository, and choose the Node runtime.
4. Set the build command to `npm ci --ignore-scripts`.
5. Set the start command to `npm start`.
6. Set the health-check path to `/health` if the dashboard requests one.
7. Keep the service at **one instance**. Do not scale it to multiple instances.
8. Deploy. Open the actual HTTPS URL Render gives you.
9. Click **Solo vs 3 CPUs** to try the game, or create a room and send the invite link to friends.

You can instead use Render's Blueprint flow to read the included `render.yaml`. Choose an appropriate service plan in your own account; the project does not purchase hosting or claim a free plan will always remain awake. A sleeping service can take time to respond. Hosting limits and prices can change.

There is no frontend build step on Render. All required game assets and the MIT-licensed WebSocket transport are included. No API key, game account, CDN, image service, database subscription or AI service is required.

## Run locally

Install Node.js **22 or newer**.

    npm start

Open `http://localhost:3000`.

To play on phones connected to the same Wi-Fi, open `http://YOUR-COMPUTER-LAN-IP:3000` on each phone. Allow port 3000 through your firewall. `localhost` on a phone refers to that phone, not the computer running the server.

`npm ci --ignore-scripts` can be run first, but there are no registry dependencies to fetch: the WebSocket library is vendored under `vendor/ws` with its license.

Tests:

    npm test
    npm run check

## Optional: frontend on Vercel, multiplayer server on Render

**This package's Vercel configuration deploys the frontend only.** Its authoritative physics server remains on Render. It is not a full Vercel serverless multiplayer implementation.

1. Deploy the full project on Render first and copy its real HTTPS URL.
2. Import the same GitHub repository in Vercel.
3. Set `BACKEND_URL` in Vercel's build environment to your Render URL, for example `https://your-actual-service.onrender.com`. This is a placeholder: replace it with the real URL.
4. `vercel.json` selects `npm run build:vercel` and the `dist` output directory. Use the project root, not the `public` folder, as Vercel's root directory.
5. Deploy the Vercel frontend. Copy its final public origin.
6. Add that exact origin to Render's `ALLOWED_ORIGINS`, for example `https://your-actual-game.vercel.app`, then redeploy/restart Render.
7. Open the Vercel URL and verify two separate players can create and join the same room.

Multiple permitted frontend origins can be separated by commas. Add a custom frontend domain as another exact origin if used. Vercel preview deployments have different origins and must be added explicitly if you want to test them. Do not add wildcard origins.

The Vercel build writes the backend origin into `dist/config.js`. This URL is public configuration, not a secret. The settings panel also permits setting a backend URL before joining a room.

Vercel's platform capabilities evolve; this project intentionally uses a single continuously running Render process for its room simulation rather than relying on beta function behavior or cross-instance coordination.

## Controls

Desktop:

- **A / D** or **left / right arrows**: move.
- **Space / W / up arrow**: jump. Press again for a double jump.
- **Mouse**: aim.
- **Left mouse**: fire. Hold for repeat shots within the weapon's server-enforced cooldown.
- **Shift**: dash. Dash into another player to exchange weapons.
- **E**: exchange with a nearby ground weapon.
- **Q / right mouse**: throw your weapon. Thrown weapons can knock players back before settling.

Touch:

- Left pad: move.
- **Jump**: jump/double-jump.
- **Fire**: hold for nearest-opponent aim assist; drag away from the button center to aim manually.
- **Bump**: dash horizontally in your movement/facing direction.
- **Pick**: exchange with a nearby ground weapon.
- **Throw**: throw the held weapon.

Touch controls can be enabled manually in settings. Portrait uses a camera that follows your bandit; landscape shows more of the arena. Audio is opt-in and must be enabled with the music-note button. Vibration is best-effort and only works in browsers/devices that support it. Reduced-motion settings suppress screen shake and reduce particles. The settings/help menu does not pause an online match.

## Rules

- Maximum four participants, a mix of humans and explicitly labelled CPUs.
- Human players join by room code without registering.
- Eight rounds per match; each fight lasts at most 60 simulation seconds, with a three-second opening countdown and a short intermission.
- A seeded shuffle gives distinct starting weapons from the six-weapon pool to the active players. Fresh weapons drop during the fight.
- You are eliminated for the current round if you fall beyond the arena's boundaries. You return in the next round.
- Damage increases your knockback meter rather than reducing a health bar. Higher meter means stronger knockback.
- Last survivor receives one round win. Simultaneous elimination of everybody is a draw. At the 60-second cap, surviving players with the lowest rounded knockback meter share the win.
- Platforms start disappearing after 35 seconds, then again after 43 and 50 seconds. Visual warnings precede each stage. Map 2 loses its lower side platforms, so do not stay there.
- Dash cooldown: 1.8 seconds. A successful dash-contact swaps the complete weapon objects, including ammo, and locks both players against another swap for 0.9 seconds.
- Ordinary contact does not swap weapons. Spawn protection temporarily prevents both hits and swaps.
- An unarmed player can exchange empty hands for a rival's gun. Unarmed players retain a short-range shove attack.
- Projectiles already fired remain attributed to their original shooter; swapping a gun does not transfer old projectiles or knockout credit.
- Ground weapon exchanges preserve ammo. Throwing away an empty gun does not refill it.
- Match ranking: round wins, then knockouts, then fewer falls. Exact ties share victory.
- CPU practice and lobby-added CPUs use the same server physics and weapon rules. They are heuristic opponents, not human substitutes or advanced AI.

## Six weapons and three arenas

1. **Recoil Cannon**: strong impact and strong backward recoil.
2. **Spring Glove**: short-range knockback with unlimited charges.
3. **Bowling Launcher**: gravity-driven bouncing balls; they can hit the original shooter after a grace period.
4. **Bubble Blaster**: briefly lifts and slows a target; control is reduced, not fully disabled.
5. **Vacuum Gun**: pulls nearby targets and loose weapons inside an aiming cone.
6. **Balloon Launcher**: temporary upward lift; attached balloons can be popped by projectiles.

Arenas: **Skyyard**, **Bounce Borough**, **Junk Junction**. They rotate across the eight rounds. Platforms are one-way from below. Player bodies collide and transfer momentum; the game uses a compact custom arcade physics solver. It is not an articulated ragdoll simulator or a full general-purpose rigid-body engine. The floppy visual style is rendered separately from authoritative collision bodies.

## Reconnection and optional restart persistence

A random room session token is saved in the browser and hashed on the server. Refreshing the page restores that same player while the room exists. Opening the same session in another tab replaces the old connection without adding another player.

- A temporary disconnect clears held controls. The bandit remains in the match while other humans are connected and can still be eliminated.
- If every human disconnects, simulation pauses. CPU players do not keep an empty room running.
- The host role transfers to an online human when needed.
- If a lobby starts while a human is disconnected, that disconnected participant is excluded from the new match. They cannot join that match late.
- Rooms expire after 20 minutes with no connected humans. Explicitly leaving ends that room session.

**Default room storage is in memory.** Without persistent storage, a process restart/redeploy loses rooms. To recover room snapshots across restarts, attach a persistent disk on Render and set `DATA_DIR` to a directory on it, for example `/var/data/bump-bandits`. Checkpoints are atomically written approximately every two seconds and on graceful shutdown. Recovery is bounded by the latest checkpoint: a sudden crash may lose up to the last checkpoint interval. Do not put the checkpoint on ephemeral storage and claim restart durability.

Stay on one server instance. Horizontal scaling would require room routing and shared coordination, which this version intentionally does not implement.

## Architecture and source map

- `server/game.mjs`: pure authoritative simulation, weapon effects, platform collisions, knockback, swaps, CPU controls, round and match scoring.
- `server/index.mjs`: HTTP assets, real WebSockets, room/session identity, command permissions, message limits, server loop, checkpointing.
- `public/app.js`: Canvas 2D rendering, interpolation/extrapolation, generated sound, particles, controls and UI.
- `public/index.html` / `public/style.css`: home, lobby, arena HUD, results, rules, settings and responsive/touch layouts.
- `public/config.js`: same-origin backend by default.
- `scripts/build-vercel.mjs`: copies static assets and embeds the configured Render backend origin.
- `tests/`: engine and real network integration tests.
- `vendor/ws/`: unmodified WebSocket transport, version 8.18.0, MIT licensed.

Simulation runs at a fixed 60 Hz; snapshots are broadcast around 20 Hz; browser inputs normally transmit at 30 Hz. Clients send inputs, not authoritative positions, scores, ownership or hits. Snapshot rendering smooths state but does not implement full rollback netcode. Keep the server near your players. High latency can make action combat less responsive.

Payload and per-connection message limits, origin checks and command validation are included. This is not a penetration-tested or large-scale hosted service. Monitor CPU and bandwidth before increasing traffic. The server's basic connection/create limits are deliberately conservative, and proxy/NAT environments can share an IP budget.

## What was tested

See `TEST-REPORT.md` for exact executed checks and remaining verification limits. Automated independent WebSocket clients are real network tests, but they are not browser playtests or real-phone usability tests.

## License and credits

Original game code is provided under the included MIT license. The third-party WebSocket library retains its own copyright/license in `vendor/ws/LICENSE`. All visual game art is drawn in code; audio is generated locally by Web Audio. No external artwork, copyrighted characters, commercial sound assets or runtime CDN is required.

## Before sharing your public link

1. Test Solo vs 3 CPUs and enable audio from a real user gesture.
2. Open two independent browser profiles/devices and create/join by room code.
3. Verify a dash swap changes both weapons and carries the remaining ammo.
4. Refresh one player and verify its identity and position recover.
5. Complete one human match, inspect the scoreboard, and open a rematch.
6. Try a real phone in portrait and landscape.
7. If using Vercel, test its final frontend origin against Render's allowlist.
8. Record these human/browser checks separately from the included automated test results.
