# Bump Bandits — sabse easy publish steps

## Render par poora game

1. ZIP extract karo.
2. `Bump-Bandits` folder ke ANDAR ki files GitHub ke naye repository mein upload karo. `package.json` root par dikhna chahiye.
3. Render mein **New → Web Service** kholo aur woh repository connect karo.
4. Runtime **Node** rakho.
5. Build command: `npm ci --ignore-scripts`
6. Start command: `npm start`
7. Health check: `/health`
8. Sirf **one instance** rakho aur Deploy karo.
9. Render jo actual HTTPS link de, use open karo.
10. Pehle **SOLO VS 3 CPUs** try karo. Friends ke saath **Create Room → Copy Invite Link → sab Ready → Host Start**.

Render par isi ek service se frontend aur multiplayer backend dono chalenge. Hosting plan ki availability/cost tumhare account mein check karna. Sleeping service ko wake hone mein time lag sakta hai.

## Vercel bhi use karna hai?

Is package mein Vercel FRONTEND host karega aur Render MULTIPLAYER SERVER. Sirf ZIP Vercel par upload karne se backend nahi chalega.

- Pehle Render deploy karo.
- Vercel mein same repository import karo.
- Vercel environment variable `BACKEND_URL` mein Render ka actual HTTPS link dalo.
- Vercel deploy hone par uske actual origin ko Render ke `ALLOWED_ORIGINS` variable mein dalo.
- Render restart/redeploy karo.
- Ab Vercel link se game try karo.

## Apne computer par

Node.js 22+ install karo. Project folder mein terminal kholo:

    npm start

Browser mein `http://localhost:3000` kholo. Same Wi-Fi wale phone par computer ka LAN IP use karo, phone ka localhost nahi.

## Important

- Game package ready hai; tumhare Render/Vercel account par deployment abhi execute nahi hua hai.
- Real browser/mobile playtest abhi pending hai. Automated network aur engine tests ka report alag file mein hai.
- Restart ke baad room bachana hai toh Render persistent disk + `DATA_DIR` configure karo. Default memory mode mein restart par rooms reset honge.
- Vibration sirf supported devices/browsers par chalegi. Sound note button se on hota hai.
