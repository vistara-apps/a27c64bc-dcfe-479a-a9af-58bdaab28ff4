# FairPlay Draws - Deployment Guide

This guide covers deploying the FairPlay Draws application to production.

## Prerequisites

- Node.js 18+
- npm or yarn
- Base network account with ETH for gas fees
- OnchainKit API key from Coinbase Developer Platform
- Vercel account (recommended for Next.js deployment)

## 1. Smart Contract Deployment

### Deploy to Base Network

1. **Install Foundry** (for contract deployment):
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Deploy contracts**:
   ```bash
   cd contracts
   forge create --rpc-url https://mainnet.base.org \
                --private-key YOUR_PRIVATE_KEY \
                FairPlayLottery.sol:FairPlayLottery

   forge create --rpc-url https://mainnet.base.org \
                --private-key YOUR_PRIVATE_KEY \
                FairPlayTicket.sol:FairPlayTicket
   ```

3. **Note contract addresses** for environment variables.

### Verify Contracts (Optional)

```bash
forge verify-contract --chain-id 8453 \
                     --etherscan-api-key YOUR_ETHERSCAN_API_KEY \
                     CONTRACT_ADDRESS \
                     FairPlayLottery.sol:FairPlayLottery
```

## 2. Environment Configuration

Create `.env.local` with:

```env
# Base Network Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# OnchainKit API Key
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key

# Smart Contract Addresses
NEXT_PUBLIC_LOTTERY_CONTRACT=0x...
NEXT_PUBLIC_NFT_CONTRACT=0x...

# Farcaster Configuration (for Frames)
FARCASTER_APP_FID=your_app_fid
FARCASTER_APP_MNEMONIC=your_app_mnemonic
```

## 3. Application Deployment

### Option A: Vercel (Recommended)

1. **Connect GitHub repository to Vercel**
2. **Configure build settings**:
   - Framework: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next

3. **Add environment variables** in Vercel dashboard

4. **Deploy**: Push to main branch or deploy manually

### Option B: Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 4. Farcaster Frame Setup

1. **Create Farcaster Frame**:
   - Go to Farcaster Frame developer portal
   - Create new Frame with URL: `https://your-domain.vercel.app/api/frames`

2. **Configure Frame metadata**:
   - Title: FairPlay Draws
   - Description: Transparent Blockchain Lottery
   - Image: Your frame preview image

## 5. Base Mini App Configuration

1. **Register as Base Mini App**:
   - Submit application to Base App Store
   - Provide app metadata and screenshots

2. **Mini App requirements**:
   - Mobile-optimized UI
   - Wallet connection integration
   - Base network compatibility

## 6. Post-Deployment Checklist

- [ ] Smart contracts deployed and verified
- [ ] Environment variables configured
- [ ] Application deployed successfully
- [ ] Farcaster Frame working
- [ ] Base Mini App registered
- [ ] Domain SSL certificate valid
- [ ] Wallet connections tested
- [ ] Transaction flows verified

## 7. Monitoring & Maintenance

### Key Metrics to Monitor:
- Transaction success rate
- User wallet connection rate
- Draw participation numbers
- Gas fee optimization

### Regular Tasks:
- Monitor contract events
- Update prize pools
- Handle user support tickets
- Security audits (quarterly)

## 8. Troubleshooting

### Common Issues:

**Wallet Connection Failed**
- Check OnchainKit API key
- Verify Base network configuration
- Test with different wallets

**Transaction Reverted**
- Check contract balance
- Verify gas limits
- Review contract logic

**Frame Not Loading**
- Check Frame URL accessibility
- Verify metadata format
- Test with Farcaster client

## 9. Security Considerations

- Regular smart contract audits
- Private key management
- Rate limiting on API endpoints
- Input validation on all user inputs
- Secure environment variable handling

## 10. Support

For deployment issues:
- Check Vercel deployment logs
- Review Base network explorer
- Test contracts on Base testnet first
- Join Base developer Discord for support

