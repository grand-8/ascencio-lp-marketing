# Landing pages Ascencio

Structure :

```
/assets
  /images       ← logo + photos équipe (optimisées une seule fois, réutilisées partout)
  /css          ← tokens.css (couleurs/typo/espacements) + components.css (styles des sections)
  /js           ← main.js (rail équipe, CTA collante mobile — vanilla JS, ~2 Ko)
/ia-qui-vide-metier
  index.html    ← thématique "l'IA vide ton métier de son sens"
/la-question-qui-revient
  index.html    ← thématique "crise existentielle 40-50 ans"
/licenciement-restructuration
  index.html    ← thématique "licenciement / restructuration"
/le-silence-numerique
  index.html    ← thématique "candidatures sans réponse"
/retour-conge-maternite
  index.html    ← thématique "retour de congé maternité"
/retour-du-burnout
  index.html    ← thématique "retour de burnout"
/tu-tiens-encore
  index.html    ← thématique "fatigue / épuisement latent"
/un-probleme-de-sens
  index.html    ← thématique "succès qui ne satisfait plus"
/politique-confidentialite
  index.html    ← page légale partagée, liée depuis le footer de chaque landing
index.html      ← redirection racine du sous-domaine → /un-probleme-de-sens/ (voir Déploiement)
CNAME           ← domaine personnalisé GitHub Pages (go.ascencio.ch)
```

Chaque dossier à la racine = **une thématique = une landing page**, toutes branchées sur le même `/assets`. Pas de variantes A/B par défaut : si une thématique en justifie un jour, dupliquer son dossier (`cp -r la-question-qui-revient la-question-qui-revient-b`) reste possible, mais ce n'est plus le standard.

## Pourquoi cette structure

- **Un seul CSS/JS partagé** : modifier `assets/css/components.css` met à jour le style de toutes les pages d'un coup. Chaque page reste néanmoins un fichier HTML **autonome et à plat** (pas d'inclusion client-side, pas de build) — c'est ce qui la rend rapide à charger dans le navigateur intégré d'Instagram/Facebook.
- **Sections = composants** : dans chaque `index.html`, les blocs sont délimités par des commentaires (`<!-- ===== Hero ===== -->`, `Mirror`, `Proposition`, `Team`, `Plan`, `Cost`, `Scarcity`, `FAQ`) et chacun a ses propres classes CSS (`.hero`, `.mirror-*`, `.team-*`, etc.).
- **Responsive à un seul breakpoint** (721px) : le mobile et le desktop sont **la même page HTML**, stylée par media queries.

## Créer une nouvelle thématique à partir d'un script MD

Chaque script de contenu (une thématique = un fichier `.md`) suit le même plan en 7 sections, chaque titre tagué `[specific]` (contenu propre à cette thématique) ou `[similar]` (on reprend le bloc existant tel quel, sans y toucher).

1. `cp -r ia-qui-vide-metier <nom-thematique>` (voir plus bas pour choisir le nom).
2. Parcourir cette table, section par section :

| Section MD | Tag | Bloc HTML (`data-component`) | Action |
|---|---|---|---|
| Hero | en général `[specific]` | `.hero` | Nouveau titre/sous-titre/CTA. Si le titre est court, ajouter `hero-title--lg` (voir plus bas) |
| Miroir + Méchant | en général `[specific]` | `.mirror-grid` dans `.color-block--cream` | S'il y a une liste de conséquences : garder `.mirror-eyebrow` + `.mirror-list` tel quel. Sinon : remplacer par `.mirror-quote` (voir plus bas) |
| Le guide / autorité | en général `[specific]` | `.proposition` | Nouveau texte + stat |
| Équipe | `[similar]` | `.team` | **Ne rien changer, même si le script propose autre chose.** Copier le bloc tel quel (HTML + `data-rail*`) — le carrousel (peek desktop, avancée carte-par-carte en mobile) dépend de sa structure exacte. Ignorer toute note du script suggérant de réordonner/prioriser des profils ou d'ajouter des bios (ex. "Alex") tant qu'elles ne sont pas déjà dans le gabarit de base |
| Le plan | `[similar]` | bloc `.color-block--lime` | Réutiliser la structure ; texte identique ou quasi |
| Coût de l'attente | en général `[specific]` | `.cost` | Nouveau titre + `.cost-list` + note de clôture. **Par défaut, l'eyebrow `.cost-eyebrow` va dans la colonne de droite, juste au-dessus de `.cost-list`** (pas au-dessus du titre) — voir plus bas |
| CTA final | `[similar]` | `.color-block--dark.scarcity` | Réutiliser la structure ; texte de réassurance ajustable |
| FAQ | en général `[specific]` | `.faq-list` | Réécrire les paires Q/R (le composant n'a pas de nombre fixe) |
| `<head>` | — | meta | `<title>`, `og:title`, `og:description`, meta description — à réécrire à chaque fois (hors `<main>`, facile à oublier) |

3. Les CTA réutilisent `https://calendly.com/ascencio-ch/30min` avec `target="_blank" rel="noopener noreferrer"`, sauf lien de réservation différent pour cette thématique.

### Modificateurs pour contenus de forme différente

- **`hero-title--lg`** — agrandit le titre du Hero (utile quand le texte est nettement plus court que la thématique de référence) : `<h1 class="hero-title hero-title--lg">`. Les valeurs sont à ajuster visuellement une fois posées sur le vrai titre.
- **`.mirror-quote` + `.mirror-grid--center`** — pour un bloc Miroir sans liste de conséquences, juste un ou deux paragraphes courts. Remplace `.mirror-eyebrow` + `.mirror-list` par une citation :
  ```html
  <div class="mirror-grid mirror-grid--center">
    <div><h2 class="mirror-title">…</h2></div>
    <blockquote class="mirror-quote">…</blockquote>
  </div>
  ```
- **Eyebrow de la section `.cost` dans la colonne de droite** — par défaut, `.cost-eyebrow` ("Ce que ça coûte d'attendre") se place au-dessus de `.cost-list`, pas au-dessus du titre :
  ```html
  <div class="cost-grid">
    <div>
      <h2 class="cost-title">…</h2>
    </div>
    <div>
      <div class="cost-eyebrow">Ce que ça coûte d'attendre</div>
      <div class="cost-list">…</div>
      <p class="cost-note">…</p>
    </div>
  </div>
  ```
  Aucun ajustement CSS requis : `.cost-title:first-child { margin-top: 0; }` et `.cost-eyebrow + .cost-list { margin-top: var(--space-md); }` dans `components.css` gèrent déjà l'alignement (vérifié pixel-parfait via `getBoundingClientRect()`).

### Choisir le nom du dossier

Éviter les noms qui étiquettent l'audience de façon clinique (âge, diagnostic). Préférer un extrait évocateur tiré du script lui-même (ex. `la-question-qui-revient`, tiré du bloc Miroir) — à valider avec l'utilisateur avant de créer le dossier.

## À remplacer avant mise en ligne

- `<meta property="og:image">` → une image de partage dédiée si besoin (actuellement une photo de l'équipe sert de repli).

Le conteneur Google Tag Manager (`GTM-M7S3R6W7`) est configuré dans tous les fichiers `index.html`. Le pixel Facebook et Google Analytics se configurent comme des tags **à l'intérieur** de ce conteneur (interface web GTM), pas en dur dans le HTML.

## Déploiement

Hébergé sur **GitHub Pages**, dépôt [`grand-8/ascencio-landing-marketing`](https://github.com/grand-8/ascencio-landing-marketing) (privé), branche `main`. Chaque `git push` sur `main` redéploie automatiquement en 1-2 minutes.

- **Domaine** : `go.ascencio.ch` (CNAME chez Infomaniak → `grand-8.github.io`), déclaré dans le fichier `CNAME` à la racine du dépôt.
- **Racine du sous-domaine** : GitHub Pages ne supporte pas de règles de redirection serveur (pas de `_redirects` comme Netlify/Cloudflare Pages). La racine (`index.html`) fait donc une redirection HTML (`<meta http-equiv="refresh">`) vers `/un-probleme-de-sens/`, la thématique par défaut.
- Réglages du dépôt : **Settings → Pages → Source : Deploy from a branch → `main` / `/ (root)`**.

## Prévisualiser en local

```bash
python3 -m http.server 8000
```
puis ouvrir `http://localhost:8000/<nom-thematique>/`.
