# 🌱 Spaardoel Plant Tracker

Een interactieve spaardoel applicatie met plant visualisatie voor kinderen. Kinderen kunnen hun spaardoelen instellen en zien hoe hun virtuele plant groeit naarmate ze geld sparen.

## ✨ Functies

- **Plant Visualisatie**: SVG-gebaseerde plant die groeit op basis van spaarvoortgang
- **Meerdere Plant Types**: Zonnebloem, roos, tulp en madeliefje
- **Gebruikersprofielen**: Ouder en kind accounts
- **Deelbare Links**: Ouders kunnen bijdrage-links delen met familie
- **Real-time Updates**: Live voortgang tracking
- **Responsive Design**: Werkt op desktop en mobiel
- **Veilige Authenticatie**: NextAuth.js integratie

## 🚀 Installatie

### Vereisten

- Node.js 18+ 
- npm of yarn
- SQLite database (voor development)

### Setup

1. **Clone de repository**
   ```bash
   git clone https://github.com/ancproggrams/spaardoel-plant-tracker.git
   cd spaardoel-plant-tracker
   ```

2. **Installeer dependencies**
   ```bash
   cd app
   npm install --legacy-peer-deps
   ```

3. **Environment variabelen**
   ```bash
   cp .env.example .env.local
   ```
   
   Vul de volgende variabelen in:
   ```
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   DATABASE_URL="file:./dev.db"
   ```

4. **Database setup**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start de applicatie**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in je browser.

## 🏗️ Project Structuur

```
app/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authenticatie pagina's
│   ├── dashboard/         # Dashboard voor ouders/kinderen
│   ├── goals/             # Spaardoel beheer
│   └── settings/          # Gebruikersinstellingen
├── components/            # React componenten
│   ├── plant-visualization.tsx  # Plant SVG component
│   ├── progress-card.tsx        # Voortgang weergave
│   └── ui/                      # UI componenten
├── lib/                   # Utilities en configuratie
├── prisma/               # Database schema
└── hooks/                # Custom React hooks
```

## 🌱 Plant Visualisatie

De plant groeit in verschillende stadia:

- **0-10%**: Zaad
- **10-25%**: Spruitje
- **25-50%**: Kleine plant
- **50-75%**: Middelgrote plant
- **75-95%**: Grote plant
- **95-100%**: Bloeiende plant
- **100%**: Plant met vruchten

## 🔧 Development

### Beschikbare Scripts

```bash
npm run dev          # Start development server
npm run build        # Build voor productie
npm run start        # Start productie server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Database Commands

```bash
npx prisma studio    # Open database browser
npx prisma generate  # Genereer Prisma client
npx prisma db push   # Push schema naar database
npx prisma db seed   # Seed database met test data
```

## 🚀 Deployment

### Vercel (Aanbevolen)

1. Push naar GitHub
2. Connect repository in Vercel
3. Configureer environment variabelen
4. Deploy automatisch bij elke push

### Andere Platforms

De app kan gedeployed worden op elke platform die Next.js ondersteunt:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## 🤝 Bijdragen

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/nieuwe-functie`)
3. Commit je wijzigingen (`git commit -m 'Voeg nieuwe functie toe'`)
4. Push naar de branch (`git push origin feature/nieuwe-functie`)
5. Open een Pull Request

## 📝 Licentie

Dit project is gelicenseerd onder de MIT Licentie - zie het [LICENSE](LICENSE) bestand voor details.

## 🐛 Bug Reports

Gevonden een bug? [Open een issue](https://github.com/ancproggrams/spaardoel-plant-tracker/issues) met:

- Beschrijving van het probleem
- Stappen om te reproduceren
- Verwacht gedrag
- Screenshots (indien van toepassing)
- Browser/OS informatie

## 📞 Contact

Voor vragen of suggesties, open een issue of neem contact op via GitHub.

---

Gemaakt met ❤️ voor kinderen die leren sparen