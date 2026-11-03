# Frizetto Barber Shop

Site static pentru Frizetto Barber Shop (CIP Barbering Co.), Calea București nr. 44, Brașov. HTML, CSS și JavaScript, fără framework, pachete sau instalare. `index.html` se află în rădăcină.

Repository propus: `Tibidinu1031/frizetto`, separat de site-ul Har Studio.

Adresa GitHub Pages propusă: `https://tibidinu1031.github.io/frizetto/`.

## Publicare pe GitHub Pages

1. Creează repository-ul `frizetto` pe GitHub și încarcă fișierele din acest folder. Păstrează `index.html`, fișierele `.css` și `.js`, `.nojekyll` și folderul `assets` direct în rădăcina repository-ului.
2. În repository, deschide **Settings → Pages**.
3. La **Build and deployment**, selectează **Deploy from a branch**.
4. Selectează branch-ul **main**, folderul **/(root)** și apasă **Save**.
5. Deschide adresa afișată de GitHub după publicare.

Toate căile către resurse sunt relative. Site-ul funcționează atât pe un domeniu propriu, cât și la `https://utilizator.github.io/nume-repository/`. Nu este necesar un build sau un fișier de configurare pentru rulare.

Metadatele `og:url`, `og:image`, adresa canonică și URL-urile JSON-LD sunt configurate pentru `https://tibidinu1031.github.io/frizetto/`. Dacă folosești alt repository sau un domeniu propriu, actualizează aceste adrese în `index.html`. Resursele paginii păstrează căi relative.

## Previzualizare locală

Poți deschide `index.html` direct în browser. Pentru o previzualizare HTTP, rulează din acest folder:

```sh
python -m http.server 4173
```

Deschide `http://localhost:4173`.

## Personalizare

- `index.html`: texte, date de contact, program, Google Maps, legături sociale și metadate.
- `style.css`: culori în `:root`, tipografie, geometrie, animații și layout responsive.
- `ornaments.css` și `assets/drafting-grid.svg`: liniile și punctele de intersecție, chenarele și variantele pentru fundalurile închise.
- `hero.css`: încadrarea meniului, hero-ului și bannerului în primul ecran pe toate dimensiunile; animația continuă a bannerului spre stânga, cu pauză la hover și respectarea preferinței de mișcare redusă.
- `intro.css`, `intro.js`: ecranul de deschidere cu logo-ul Frizetto.
- `app.js`: galeria, filtrele, asocierea fotografiilor cu postările originale și interacțiunile.
- `booking.css`, `booking.js`, `calendar-core.js`: calendarul de cereri, programul frizeriei, regulile de dată și oră și mesajul pentru WhatsApp.
- `assets/`: fotografii, straturile logo-ului și fonturi servite local.

## Ecranul de deschidere

La încărcare, logo-ul apare în centrul paginii, desenat pe straturi: rândul de sus, numele dezvăluit de o linie ca o lamă de brici, „BARBER SHOP” și mustața. Logo-ul se înclină după cursor, iar mustața se răsucește la hover sau la atingere. Ecranul se deschide în două panouri după aproximativ 3,6 secunde sau imediat la click, tastă, scroll sau glisare. Fiecare joacă cu mustața mai adaugă puțin timp, fără să depășească 8,5 secunde. Un script mic din `<head>` activează ecranul înainte de prima randare. Dacă JavaScript nu rulează, o animație CSS îl ascunde după 9 secunde. Cu mișcare redusă, logo-ul apare fără animații și dispare după 1,6 secunde.

Straturile logo-ului (`assets/logo-*.png`) și `assets/frizetto-logo.png` sunt extrase din logo-ul primit de la client. Cerneala a fost păstrată pe fundal transparent și mărită de trei ori.

## Programări

Toate butoanele de programare, inclusiv cel din hero, duc la secțiunea **Programări**. Butoanele din servicii preselectează serviciul corespunzător. Vizitatorul alege ziua, ora preferată și, opțional, numele. Calendarul folosește ora României, blochează zilele trecute și duminicile și validează ora după programul zilei: luni - vineri 10:00 - 19:00, sâmbătă 10:00 - 14:00. Navigarea cu tastatura include săgețile, Home, End, PageUp și PageDown și sare peste zilele închise.

**Pregătește cererea** generează mesajul, iar **Trimite pe WhatsApp** deschide conversația cu 0745 494 412 și mesajul deja completat. Mesajul poate fi copiat și trimis prin SMS. Apelul telefonic rămâne o opțiune directă. Alegerea datei nu indică un loc liber și nu creează o rezervare confirmată. Disponibilitatea și tariful sunt confirmate de frizerie. Nu se stochează nume sau programări și nu se trimite nimic automat.

Frizetto nu are profil MERO. Dacă își face unul, butoanele de programare pot trimite direct la profilul MERO.

## Fotografii și informații

Fotografiile provin de pe pagina publică [Frizetto Barber Shop](https://www.facebook.com/FRIZETTO/). Sunt păstrate local pentru a evita expirarea adreselor CDN. Fiecare fotografie din galerie are legătură către postarea originală. Vezi `ASSETS.md` pentru sursele exacte.

Adresa, telefonul, WhatsApp-ul și programul provin din profilul Google Business și din pagina de Facebook a frizeriei. Serviciile urmează lista de pe peretele frizeriei: tuns modern, tuns clasic, aranjat barbă, tuns și aranjat barbă. Prețurile nu au fost afișate, deoarece fotografia listei este din 2023 și nu se citește complet.

## Verificări și previzualizare găzduită

```sh
node scripts/verify.mjs
node --test scripts/booking.test.cjs
```

`scripts/prepare-site.mjs` și `.openai/hosting.json` sunt folosite numai pentru publicarea previzualizării Sites. GitHub Pages servește direct fișierele din rădăcină și nu are nevoie de ele.
