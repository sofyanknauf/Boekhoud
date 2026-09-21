# Boekhouding

Een eenvoudige boekhoudapp voor een eenmanszaak: facturen en offertes, klanten, uitgaven met bonnetjes, bankimport (CSV), btw-aangifte per kwartaal, belastingschatting, urenregistratie, investeringen, aanmaningen, jaaroverzicht en back-up.

- **Frontend:** één `index.html`, geen build-stap. Draait op GitHub Pages als installeerbare webapp (PWA), ook offline.
- **Backend:** Supabase (database, login en opslag voor bonnetjes).

## 1. Supabase instellen (±5 minuten)

1. Maak een project aan op [supabase.com](https://supabase.com). Kies regio **Frankfurt (eu-central-1)**, dan blijft je data in de EU.
2. Ga naar **SQL Editor → New query**, plak de inhoud van `supabase/schema.sql` en klik **Run**.
3. Ga naar **Authentication → Sign In / Providers → Email** en laat Email aanstaan.
4. Ga naar **Project Settings → API** en kopieer:
   - de **Project URL**
   - de **anon public** key
5. Zet die twee in `config.js`.

> De anon-key mag in je code staan, want de database is afgeschermd met Row Level Security. Zet **nooit** de `service_role`-key in dit project.

## 2. Online zetten met GitHub Pages

1. Maak een nieuwe repository op GitHub, bijvoorbeeld `boekhouding`.
2. Upload `index.html`, `config.js`, `manifest.webmanifest`, `sw.js`, `README.md` en de mappen `icons` en `supabase`. **Niet** het back-upbestand, daar staat je administratie in.
3. Ga naar **Settings → Pages**, kies bij *Source* **Deploy from a branch**, branch `main`, map `/ (root)`, en klik **Save**.
4. Na een minuut staat je app op `https://<jouw-gebruikersnaam>.github.io/boekhouding/`.
5. Terug in Supabase: **Authentication → URL Configuration**. Zet die GitHub-URL bij **Site URL** en ook bij **Redirect URLs**. Dan werken de bevestigingsmail en "wachtwoord vergeten".

## 3. Eerste keer openen

1. Open je app en kies **Account maken**. Klik op de link in de bevestigingsmail en log in.
2. Ga naar het **tandwiel → Jaarafsluiting → Back-up terugzetten** en kies `backup-2026-09-21.json`. Al je facturen, klanten, transacties en uren staan dan in Supabase.
3. Zet de app op je beginscherm:
   - **iPhone:** open de app in Safari → **Deel** → **Zet op beginscherm**.
   - **Android:** Chrome toont zelf **Installeren**, of via het menu → **App installeren**.

   Daarna opent hij als losse app, zonder adresbalk, met je eigen icoon. Lang drukken op het icoon (Android) geeft snelkoppelingen naar nieuwe factuur, uitgave en uren.

## Webapp en offline

- De app werkt ook zonder internet. Wat je dan invoert, wordt op je telefoon bewaard en automatisch naar Supabase gestuurd zodra je weer online bent. Bovenin staat dan "Offline".
- **Nieuwe versie online zetten:** pas je iets aan in `index.html` of `config.js`, verhoog dan in `sw.js` de regel `const VERSION = 'v1'` naar `'v2'` (enzovoort). De app toont dan "Nieuwe versie beschikbaar → Bijwerken".
- Animaties staan uit als je telefoon "Beperk beweging" aan heeft staan.

## Goed om te weten

- **Eén account per persoon.** Wil je niet dat anderen een account kunnen maken, zet dan na je eigen registratie in Supabase **Authentication → Sign In / Providers → Allow new users to sign up** uit.
- **Back-ups.** Supabase maakt op het gratis plan geen back-ups die je zelf kunt terugzetten. Maak daarom elke maand een back-up via het jaaroverzicht in de app.
- **Bonnetjes** worden privé opgeslagen in de bucket `bonnetjes`, per gebruiker in een eigen map.
- **Gmail-koppeling** werkte alleen in de Claude-versie. In deze versie gebruik je de knop E-mail (opent je mailapp) of WhatsApp.
- **Tarieven** voor de belastingschatting zijn die van 2026. Controleer ze elk jaar in het tandwiel.
