# HAR Studio

Site static pentru Har Studio și Har Academy, Târgoviște. HTML, CSS și JavaScript, fără framework, pachete sau instalare. `index.html` se află în rădăcină.

Repository: [Tibidinu1031/harstudio](https://github.com/Tibidinu1031/harstudio).

Adresa GitHub Pages: [tibidinu1031.github.io/harstudio](https://tibidinu1031.github.io/harstudio/).

## Publicare pe GitHub Pages

1. Creează un repository GitHub și încarcă fișierele din acest folder. Păstrează `index.html`, fișierele `.css` și `.js`, `.nojekyll` și folderul `assets` direct în rădăcina repository-ului.
2. În repository, deschide **Settings → Pages**.
3. La **Build and deployment**, selectează **Deploy from a branch**.
4. Selectează branch-ul **main**, folderul **/(root)** și apasă **Save**.
5. Deschide adresa afișată de GitHub după publicare.

Toate căile către resurse sunt relative. Site-ul funcționează atât pe un domeniu propriu, cât și la `https://utilizator.github.io/nume-repository/`. Nu este necesar un build sau un fișier de configurare pentru rulare.

Metadatele `og:url`, `og:image`, adresa canonică și URL-ul JSON-LD sunt configurate pentru `https://tibidinu1031.github.io/harstudio/`. Dacă schimbi repository-ul sau folosești un domeniu propriu, actualizează aceste adrese în `index.html`. Resursele paginii păstrează căi relative.

## Previzualizare locală

Poți deschide `index.html` direct în browser. Pentru o previzualizare HTTP, rulează din acest folder:

```sh
python -m http.server 4173
```

Deschide `http://localhost:4173`.

## Personalizare

- `index.html`: texte, date de contact, Google Maps, legături sociale și metadate.
- `style.css`: culori în `:root`, tipografie, geometrie, animații și layout responsive.
- `ornaments.css` și `assets/drafting-grid.svg`: rețeaua vizibilă de linii și puncte, chenare, marcaje simetrice și variantele pentru fundalurile închise.
- `app.js`: galeria, filtrele, asocierea fotografiilor cu postările originale și interacțiunile.
- `booking.css`, `booking.js`, `calendar-core.js`: calendarul de cereri, regulile de dată și oră și pregătirea mesajului pentru salon.
- `assets/`: fotografii și fonturi servite local.

Galeria se navighează prin săgețile de pe ecran, tastele stânga/dreapta după focalizarea galeriei și glisare pe mobil. Click pe imaginea centrală deschide vizualizarea mărită. Escape închide dialogurile. Preferința de mișcare redusă a sistemului este respectată. Combinația de taste Alt+Tab rămâne controlată de sistemul de operare; efectul vizual al galeriei este inspirat de schimbarea între ferestre.

Toate butoanele de programare, inclusiv cel din hero, duc la secțiunea **Programări**. Butoanele din servicii preselectează serviciul corespunzător. Vizitatorul alege ziua, ora preferată și, opțional, numele. Calendarul folosește ora României, blochează zilele trecute și validează orele care au trecut pentru ziua curentă. Navigarea tastaturii include săgețile, Home, End, PageUp și PageDown.

**Pregătește cererea** generează mesajul care poate fi copiat și trimis de vizitator pe Instagram. Apelul telefonic rămâne o opțiune directă. Alegerea datei nu indică un loc liber și nu creează o rezervare confirmată. Disponibilitatea și tariful sunt confirmate de salon. Nu se stochează nume sau programări și nu se trimite nimic automat; clipboard-ul este folosit doar la apăsarea butonului de copiere.

## Fotografii și informații

Fotografiile și cadrele din clipuri provin de pe contul public [@har_studio17](https://www.instagram.com/har_studio17/). Sunt păstrate local pentru a evita expirarea adreselor CDN. Fiecare fotografie din galerie are legătură către postarea originală. Afișul masterclassului este prezentat ca material de arhivă, nu ca eveniment viitor. Vezi `ASSETS.md` pentru sursele exacte.

Adresa și telefonul provin din brief. Harta Google indică adresa furnizată: Strada Constantin Brâncoveanu 67, Târgoviște. Orele de funcționare și prețurile nu au fost adăugate deoarece nu au fost confirmate.

## Verificări și previzualizare găzduită

```sh
node scripts/verify.mjs
node --test scripts/booking.test.cjs
```

`scripts/prepare-site.mjs` și `.openai/hosting.json` sunt folosite numai pentru publicarea previzualizării Sites. GitHub Pages servește direct fișierele din rădăcină și nu are nevoie de ele.
