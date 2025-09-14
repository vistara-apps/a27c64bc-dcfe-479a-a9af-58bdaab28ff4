# FairPlay Draws - Transparent Blockchain Lottery

A Next.js Base Mini App for transparent, fair, and engaging lottery draws leveraging blockchain technology.

## Features

- 🎲 **Provably Fair Draws** - Verifiable randomness using blockchain technology
- 🎨 **Interactive Animations** - Engaging draw animations with futuristic UI
- 🎫 **NFT Tickets** - Lottery tickets as collectible NFTs on Base network
- 💰 **Bulk Discounts** - Save more when buying multiple tickets
- 📱 **Mobile-First** - Optimized for mobile experience in Base App
- 🔗 **Seamless Wallet Integration** - Connect with Base-compatible wallets

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base Network (Ethereum L2)
- **Wallet Integration**: MiniKit + OnchainKit
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **TypeScript**: Full type safety

## Getting Started

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd fairplay-draws
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Add your OnchainKit API key from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/products/onchainkit)

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in Base App or browser:**
   - Base App: Add as Mini App
   - Browser: http://localhost:3000

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main page
│   ├── providers.tsx      # MiniKit & OnchainKit providers
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── DrawInterface.tsx  # Main draw interface
│   ├── DrawAnimation.tsx  # Animated draw visualization
│   ├── TicketPurchase.tsx # Ticket purchasing component
│   ├── UserTickets.tsx    # User's ticket collection
│   └── ...               # Other UI components
├── lib/                   # Utilities and types
│   ├── types.ts          # TypeScript interfaces
│   ├── utils.ts          # Helper functions
│   └── constants.ts      # App constants
└── public/               # Static assets
```

## Design System

The app uses a futuristic, blockchain-inspired design system:

- **Colors**: Blue/purple gradient with cyan accents
- **Typography**: Clean, modern font hierarchy
- **Components**: Neon borders, glow effects, holographic backgrounds
- **Animations**: Smooth transitions and engaging draw animations

## Smart Contracts

The app requires two smart contracts on Base network:

1. **Lottery Contract**: Handles draw logic and prize distribution
2. **NFT Contract**: Mints ticket NFTs for users

Deploy contracts and update addresses in `.env.local`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, please open an issue or contact the development team.
