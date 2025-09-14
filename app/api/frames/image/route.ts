import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const frameId = searchParams.get('frameId') || 'main';
  const count = searchParams.get('count') || '1';
  const fid = searchParams.get('fid') || '0';

  try {
    // Generate SVG image based on frame type
    const svg = generateFrameImage(frameId, count, fid);

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}

function generateFrameImage(frameId: string, count: string, fid: string): string {
  const width = 1200;
  const height = 630;

  switch (frameId) {
    case 'main':
      return generateMainFrame(width, height);

    case 'buy-confirmation':
      return generateBuyConfirmationFrame(width, height, count);

    case 'user-tickets':
      return generateUserTicketsFrame(width, height, fid);

    case 'results':
      return generateResultsFrame(width, height);

    case 'how-it-works':
      return generateHowItWorksFrame(width, height);

    default:
      return generateMainFrame(width, height);
  }
}

function generateMainFrame(width: number, height: number): string {
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="primary" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#bg)" />

      <!-- Title -->
      <text x="50%" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="url(#primary)">
        🎰 FairPlay Draws
      </text>

      <!-- Subtitle -->
      <text x="50%" y="180" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#e2e8f0">
        Your Transparent & Interactive Blockchain Lottery
      </text>

      <!-- Current Draw Info -->
      <rect x="100" y="250" width="400" height="200" fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" stroke-width="2" rx="10" />

      <text x="120" y="290" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#3b82f6">
        Current Draw #1
      </text>

      <text x="120" y="320" font-family="Arial, sans-serif" font-size="16" fill="#e2e8f0">
        Prize Pool: 1.5 ETH
      </text>

      <text x="120" y="350" font-family="Arial, sans-serif" font-size="16" fill="#e2e8f0">
        Ticket Price: 0.001 ETH
      </text>

      <text x="120" y="380" font-family="Arial, sans-serif" font-size="16" fill="#e2e8f0">
        Ends in: 23h 45m
      </text>

      <text x="120" y="410" font-family="Arial, sans-serif" font-size="16" fill="#e2e8f0">
        Total Tickets: 1,247
      </text>

      <!-- Action Buttons Preview -->
      <text x="600" y="300" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#e2e8f0">
        Choose an action:
      </text>

      <rect x="600" y="320" width="200" height="40" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" stroke-width="1" rx="5" />
      <text x="610" y="345" font-family="Arial, sans-serif" font-size="14" fill="#3b82f6">
        🎫 Buy Tickets
      </text>

      <rect x="600" y="370" width="200" height="40" fill="rgba(139, 92, 246, 0.2)" stroke="#8b5cf6" stroke-width="1" rx="5" />
      <text x="610" y="395" font-family="Arial, sans-serif" font-size="14" fill="#8b5cf6">
        🎯 View My Tickets
      </text>

      <!-- Provably Fair Badge -->
      <rect x="100" y="500" width="300" height="60" fill="rgba(6, 182, 212, 0.1)" stroke="#06b6d4" stroke-width="2" rx="30" />
      <text x="130" y="525" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#06b6d4">
        ✓ Provably Fair
      </text>
      <text x="130" y="545" font-family="Arial, sans-serif" font-size="12" fill="#e2e8f0">
        Verified randomness using blockchain
      </text>

      <!-- NFT Badge -->
      <rect x="450" y="500" width="250" height="60" fill="rgba(245, 101, 101, 0.1)" stroke="#f56565" stroke-width="2" rx="30" />
      <text x="480" y="525" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#f56565">
        🎨 NFT Tickets
      </text>
      <text x="480" y="545" font-family="Arial, sans-serif" font-size="12" fill="#e2e8f0">
        Ownable digital collectibles
      </text>
    </svg>
  `;
}

function generateBuyConfirmationFrame(width: number, height: number, count: string): string {
  const ticketCount = parseInt(count);
  const totalPrice = ticketCount * 0.001;

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#bg)" />

      <text x="50%" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#3b82f6">
        🎫 Confirm Purchase
      </text>

      <rect x="200" y="150" width="800" height="300" fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" stroke-width="2" rx="15" />

      <text x="220" y="200" font-family="Arial, sans-serif" font-size="24" fill="#e2e8f0">
        Tickets: ${ticketCount}
      </text>

      <text x="220" y="240" font-family="Arial, sans-serif" font-size="24" fill="#e2e8f0">
        Price per ticket: 0.001 ETH
      </text>

      <text x="220" y="280" font-family="Arial, sans-serif" font-size="24" fill="#e2e8f0">
        Total: ${totalPrice} ETH
      </text>

      <text x="220" y="340" font-family="Arial, sans-serif" font-size="18" fill="#06b6d4">
        ✓ You will receive NFT tickets
      </text>

      <text x="220" y="370" font-family="Arial, sans-serif" font-size="18" fill="#06b6d4">
        ✓ Provably fair random selection
      </text>

      <text x="220" y="400" font-family="Arial, sans-serif" font-size="18" fill="#06b6d4">
        ✓ Automatic prize distribution
      </text>

      <text x="50%" y="500" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#e2e8f0">
        Click "Confirm" to proceed with the transaction
      </text>
    </svg>
  `;
}

function generateUserTicketsFrame(width: number, height: number, fid: string): string {
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#bg)" />

      <text x="50%" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#3b82f6">
        🎯 Your Tickets
      </text>

      <text x="50%" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#e2e8f0">
        User ID: ${fid}
      </text>

      <!-- Mock ticket display -->
      <rect x="100" y="160" width="300" height="120" fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" stroke-width="2" rx="10" />
      <text x="120" y="190" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#3b82f6">
        Ticket #42
      </text>
      <text x="120" y="220" font-family="Arial, sans-serif" font-size="16" fill="#e2e8f0">
        Draw #1 • Active
      </text>
      <text x="120" y="250" font-family="Arial, sans-serif" font-size="14" fill="#06b6d4">
        NFT ID: 12345
      </text>

      <rect x="450" y="160" width="300" height="120" fill="rgba(245, 101, 101, 0.1)" stroke="#f56565" stroke-width="2" rx="10" />
      <text x="470" y="190" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#f56565">
        Ticket #156
      </text>
      <text x="470" y="220" font-family="Arial, sans-serif" font-size="16" fill="#e2e8f0">
        Draw #1 • Winner! 🏆
      </text>
      <text x="470" y="250" font-family="Arial, sans-serif" font-size="14" fill="#06b6d4">
        NFT ID: 12346
      </text>

      <text x="50%" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#e2e8f0">
        Total Tickets: 2 • Winners: 1
      </text>
    </svg>
  `;
}

function generateResultsFrame(width: number, height: number): string {
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#bg)" />

      <text x="50%" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#3b82f6">
        🏆 Latest Results
      </text>

      <rect x="200" y="120" width="800" height="200" fill="rgba(245, 101, 101, 0.1)" stroke="#f56565" stroke-width="2" rx="15" />

      <text x="220" y="160" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#f56565">
        🎉 Draw #1 Complete!
      </text>

      <text x="220" y="200" font-family="Arial, sans-serif" font-size="20" fill="#e2e8f0">
        Winning Ticket: #1,247
      </text>

      <text x="220" y="240" font-family="Arial, sans-serif" font-size="20" fill="#e2e8f0">
        Winner: 0x742d...3f2a
      </text>

      <text x="220" y="280" font-family="Arial, sans-serif" font-size="20" fill="#e2e8f0">
        Prize: 1.247 ETH
      </text>

      <text x="50%" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#06b6d4">
        ✓ Verified using provably fair randomness
      </text>

      <text x="50%" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#06b6d4">
        ✓ All transactions on Base blockchain
      </text>
    </svg>
  `;
}

function generateHowItWorksFrame(width: number, height: number): string {
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#bg)" />

      <text x="50%" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#3b82f6">
        ℹ️ How FairPlay Draws Works
      </text>

      <rect x="100" y="100" width="1000" height="500" fill="rgba(59, 130, 246, 0.05)" stroke="#3b82f6" stroke-width="1" rx="10" />

      <text x="120" y="140" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#3b82f6">
        1. 🎫 Buy Tickets
      </text>
      <text x="140" y="165" font-family="Arial, sans-serif" font-size="16" fill="#e2e8f0">
        Purchase lottery tickets as NFTs on the Base blockchain
      </text>

      <text x="120" y="200" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#3b82f6">
        2. 🎯 Enter Draws
      </text>
      <text x="140" y="225" font-family="Arial, sans-serif" font-size="16" fill="#e2e8f0">
        Your NFT tickets automatically enter the current draw
      </text>

      <text x="120" y="260" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#3b82f6">
        3. 🎰 Provably Fair Selection
      </text>
      <text x="140" y="285" font-family="Arial, sans-serif" font-size="16" fill="#e2e8f0">
        Winner selected using blockchain hash + user seed for transparency
      </text>

      <text x="120" y="320" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#3b82f6">
        4. 🏆 Claim Winnings
      </text>
      <text x="140" y="345" font-family="Arial, sans-serif" font-size="16" fill="#e2e8f0">
        Winners can claim their prizes directly to their wallet
      </text>

      <text x="120" y="380" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#3b82f6">
        5. 🎨 NFT Collectibles
      </text>
      <text x="140" y="405" font-family="Arial, sans-serif" font-size="16" fill="#e2e8f0">
        Keep your tickets as unique digital collectibles
      </text>

      <text x="50%" y="480" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#06b6d4">
        Built on Base • Provably Fair • NFT-Powered
      </text>
    </svg>
  `;
}

