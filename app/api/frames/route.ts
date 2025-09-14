import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const frameId = searchParams.get('frameId') || 'main';

  // Main frame - shows lottery interface
  if (frameId === 'main') {
    return NextResponse.json({
      frames: [
        {
          version: 'vNext',
          image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/image?frameId=main`,
          buttons: [
            {
              label: '🎫 Buy Tickets',
              action: 'post',
              target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames?action=buy-tickets`
            },
            {
              label: '🎯 View My Tickets',
              action: 'post',
              target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames?action=view-tickets`
            },
            {
              label: '🏆 Check Results',
              action: 'post',
              target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames?action=check-results`
            },
            {
              label: 'ℹ️ How It Works',
              action: 'post',
              target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames?action=how-it-works`
            }
          ],
          input: {
            text: 'Enter number of tickets (1-50)'
          },
          postUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames`
        }
      ]
    });
  }

  return NextResponse.json({ error: 'Invalid frame ID' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData } = body;

    if (!untrustedData) {
      return NextResponse.json({ error: 'Invalid frame data' }, { status: 400 });
    }

    const { buttonIndex, inputText, fid, castId } = untrustedData;
    const action = request.nextUrl.searchParams.get('action');

    // Handle different actions
    switch (action) {
      case 'buy-tickets':
        return handleBuyTickets(buttonIndex, inputText, fid);

      case 'view-tickets':
        return handleViewTickets(fid);

      case 'check-results':
        return handleCheckResults();

      case 'how-it-works':
        return handleHowItWorks();

      default:
        return NextResponse.json({
          frames: [
            {
              version: 'vNext',
              image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/image?frameId=main`,
              buttons: [
                {
                  label: '🎫 Buy Tickets',
                  action: 'post',
                  target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames?action=buy-tickets`
                },
                {
                  label: '🎯 View My Tickets',
                  action: 'post',
                  target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames?action=view-tickets`
                },
                {
                  label: '🏆 Check Results',
                  action: 'post',
                  target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames?action=check-results`
                },
                {
                  label: 'ℹ️ How It Works',
                  action: 'post',
                  target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames?action=how-it-works`
                }
              ],
              input: {
                text: 'Enter number of tickets (1-50)'
              },
              postUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames`
            }
          ]
        });
    }
  } catch (error) {
    console.error('Frame API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function handleBuyTickets(buttonIndex: number, inputText: string, fid: number) {
  const ticketCount = parseInt(inputText) || 1;
  const clampedCount = Math.max(1, Math.min(50, ticketCount));

  return NextResponse.json({
    frames: [
      {
        version: 'vNext',
        image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/image?frameId=buy-confirmation&count=${clampedCount}`,
        buttons: [
          {
            label: `✅ Confirm ${clampedCount} Ticket${clampedCount > 1 ? 's' : ''}`,
            action: 'tx',
            target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/tx/buy-tickets`,
            postUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames?action=purchase-complete`
          },
          {
            label: '⬅️ Back',
            action: 'post',
            target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames`
          }
        ],
        postUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames`
      }
    ]
  });
}

function handleViewTickets(fid: number) {
  return NextResponse.json({
    frames: [
      {
        version: 'vNext',
        image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/image?frameId=user-tickets&fid=${fid}`,
        buttons: [
          {
            label: '🎫 Buy More Tickets',
            action: 'post',
            target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames?action=buy-tickets`
          },
          {
            label: '🏆 Check Results',
            action: 'post',
            target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames?action=check-results`
          },
          {
            label: '⬅️ Back',
            action: 'post',
            target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames`
          }
        ],
        postUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames`
      }
    ]
  });
}

function handleCheckResults() {
  return NextResponse.json({
    frames: [
      {
        version: 'vNext',
        image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/image?frameId=results`,
        buttons: [
          {
            label: '🎫 Buy Tickets',
            action: 'post',
            target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames?action=buy-tickets`
          },
          {
            label: '🎯 View My Tickets',
            action: 'post',
            target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames?action=view-tickets`
          },
          {
            label: '⬅️ Back',
            action: 'post',
            target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames`
          }
        ],
        postUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames`
      }
    ]
  });
}

function handleHowItWorks() {
  return NextResponse.json({
    frames: [
      {
        version: 'vNext',
        image: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames/image?frameId=how-it-works`,
        buttons: [
          {
            label: '🎫 Buy Tickets',
            action: 'post',
            target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames?action=buy-tickets`
          },
          {
            label: '⬅️ Back',
            action: 'post',
            target: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames`
          }
        ],
        postUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/frames`
      }
    ]
  });
}

