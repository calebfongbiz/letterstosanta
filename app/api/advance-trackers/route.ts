/**
 * Advance Trackers API Route
 *
 * POST /api/advance-trackers
 * Called daily by Make.com to advance all trackers by one milestone
 * and send story emails to parents.
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { MILESTONE_ORDER } from '@/lib/types'

// Verify the request is from our cron job
function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`
  return authHeader === expectedToken
}

// Generate beautiful HTML email for Jingles story updates
function generateJinglesEmail(
  parentFirstName: string,
  childName: string,
  dayNumber: number,
  childId?: string,
  isMagicTier?: boolean
): { subject: string; html: string } {
  
  const stories: Record<number, { subject: string; location: string; emoji: string; story: string; signoff: string }> = {
    1: {
      subject: `🍬 ${childName}'s Letter is Traveling Through the Candy Cane Forest!`,
      location: "Candy Cane Forest",
      emoji: "🍬",
      story: `Hello again, friend!

Jingles here with your daily letter update!

We made it to the Candy Cane Forest this morning, and OH MY SNOWBALLS, it's beautiful! The trees here aren't like regular trees - they're actual giant candy canes that twist up toward the sky, with peppermint leaves that tinkle like bells when the wind blows.

Your letter is doing wonderfully! I've got it tucked safely in my enchanted satchel, which keeps everything warm and protected from the occasional gumdrop rain shower (yes, it rains gumdrops here - the red ones are my favorite!).

We met some Sugar Sprites along the path today. They're tiny little creatures made of crystallized sugar who help guide travelers through the forest. They took one look at your letter and started cheering! They said they could sense all the love and Christmas wishes inside.

We're about halfway through the forest now, resting by a stream that flows with liquid candy cane. Tomorrow we'll reach the edge of the forest and head toward the Reindeer Runway!

Your letter keeps humming Christmas carols. I think it's excited!`,
      signoff: "Peppermint kisses and candy cane wishes"
    },
    2: {
      subject: `🦌 ${childName}'s Letter Just Met the Reindeer!`,
      location: "Reindeer Runway",
      emoji: "🦌",
      story: `Guess where we are?! THE REINDEER RUNWAY!

This is where Santa's reindeer practice their flying and get ready for the big night. I just saw Dasher doing loop-de-loops, and Prancer was showing off her graceful landings.

But the BEST part? Rudolph himself came over to inspect your letter! His nose glowed so bright when he saw it - he said he could tell it was written with a really good heart. He gave it an official "Rudolph Approved" stamp with his glowing nose!

The runway is amazing - it's made of magical ice that sparkles like diamonds, and there are warm fires along the edges where the elves serve hot cocoa to travelers (I had three cups... don't tell anyone).

Your letter passed the Reindeer Inspection with flying colors! They said it's definitely going to make Santa smile.

Tomorrow we head to the Aurora Gate - the most magical checkpoint of all!`,
      signoff: "With jingle bells and reindeer dust"
    },
    3: {
      subject: `🌌 ${childName}'s Letter is Passing Through the Northern Lights!`,
      location: "Aurora Gate",
      emoji: "✨",
      story: `Oh my snowflakes, today was BREATHTAKING!

We reached the Aurora Gate, where the Northern Lights dance across the sky in ribbons of green, purple, and blue!

Your letter had to pass through the magical lights - it's like a special checkpoint that only the most heartfelt letters can cross. And guess what? Your letter started GLOWING! That means it's filled with so much love and Christmas spirit!

The lights whispered secrets as we passed through. They told me they've seen millions of letters over the years, and yours is truly special. The colors swirled around it like they were giving it a big, warm hug.

I caught a little piece of aurora light in a jar for you - it's sitting on Santa's mantle now, glowing softly with your name on it.

Tomorrow... we finally reach Santa's desk! I'm getting butterflies in my tummy just thinking about it!`,
      signoff: "With stardust and aurora dreams"
    },
    4: {
      subject: `🎅 ${childName}'s Letter Has Been DELIVERED TO SANTA!`,
      location: "Santa's Desk",
      emoji: "🎅",
      story: `WE DID IT! WE DID IT! *does happy elf dance*

Your letter is now sitting right on Santa's desk at the North Pole! I watched Santa pick it up with his big, warm hands. He put on his reading glasses (yes, Santa wears glasses for reading!), and you know what he did?

HE SMILED. That big, jolly, warm Santa smile that makes his eyes twinkle like stars.

He told me to tell you that he's so proud of all the good things you've done this year. Your letter made his heart feel as warm as hot cocoa by the fireplace.

Santa read every single word, and he's already making notes in his big book. He winked at me and said, "This one is going on the Nice List for sure!"

This has been the most magical journey, and I'm so glad I got to be your letter's guide. Thank you for trusting me with something so special!`,
      signoff: "With the biggest elf hug ever"
    }
  }

  const day = stories[dayNumber]
  if (!day) return { subject: '', html: '' }

  // Add Santa's response section for MAGIC tier on day 4
  let santaResponseSection = ''
  if (dayNumber === 4 && isMagicTier && childId) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://letterstosanta.vercel.app'
    santaResponseSection = `
                <tr>
                  <td style="padding: 0 40px 30px 40px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%); border-radius: 15px; border: 2px solid #d4af37;">
                      <tr>
                        <td style="padding: 25px; text-align: center;">
                          <p style="color: #d4af37; font-size: 20px; font-weight: bold; margin: 0 0 15px 0;">
                            🎁 Special Delivery! 🎁
                          </p>
                          <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            Santa has written a personal letter back to ${childName}!<br>
                            Plus, an Official Nice List Certificate is ready!
                          </p>
                          <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                            <tr>
                              <td style="padding: 5px;">
                                <a href="${baseUrl}/santa-letter/${childId}" style="display: inline-block; background-color: #d4af37; color: #1a1a2e; font-size: 16px; font-weight: bold; padding: 15px 25px; border-radius: 30px; text-decoration: none;">
                                  📜 View Santa's Letter
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 5px;">
                                <a href="${baseUrl}/certificate/${childId}" style="display: inline-block; background-color: #ffffff; color: #1a1a2e; font-size: 16px; font-weight: bold; padding: 15px 25px; border-radius: 30px; text-decoration: none;">
                                  ⭐ View Nice List Certificate
                                </a>
                              </td>
                            </tr>
                          </table>
                          <p style="color: #ffcccc; font-size: 14px; margin: 20px 0 0 0;">
                            Click the buttons above to view and print!
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #1a1a2e; font-family: Georgia, 'Times New Roman', serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1a1a2e;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <span style="font-size: 40px;">❄️ ⭐ ❄️</span>
            </td>
          </tr>
          <tr>
            <td>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #2d5a4a 0%, #1e3d32 100%); border-radius: 20px; border: 3px solid #d4af37;">
                <tr>
                  <td style="background-color: #d4af37; height: 8px; border-radius: 17px 17px 0 0;"></td>
                </tr>
                <tr>
                  <td align="center" style="padding: 30px 20px 10px 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="background-color: #c41e3a; border-radius: 30px; padding: 10px 25px;">
                          <span style="color: #ffffff; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
                            ${day.emoji} ${day.location} ${day.emoji}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="background-color: #c41e3a; width: 80px; height: 80px; border-radius: 50%; text-align: center; vertical-align: middle; border: 4px solid #d4af37; font-size: 40px;">
                          🧝
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 0 40px 20px 40px;">
                    <h1 style="color: #d4af37; font-size: 28px; margin: 0; font-style: italic;">
                      A Message from Jingles!
                    </h1>
                    <p style="color: #a8d5ba; font-size: 16px; margin: 10px 0 0 0;">
                      Special Update for ${childName}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 40px 30px 40px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: rgba(255,255,255,0.1); border-radius: 15px; border: 1px solid rgba(255,255,255,0.2);">
                      <tr>
                        <td style="padding: 25px;">
                          <p style="color: #ffffff; font-size: 17px; line-height: 1.8; margin: 0 0 20px 0;">
                            Dear ${childName},
                          </p>
                          <p style="color: #e8e8e8; font-size: 16px; line-height: 1.9; margin: 0; white-space: pre-line;">${day.story}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${santaResponseSection}
                <tr>
                  <td style="padding: 0 40px 30px 40px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 20px; text-align: center;">
                          <p style="color: #a8d5ba; font-size: 16px; font-style: italic; margin: 0 0 10px 0;">
                            ${day.signoff},
                          </p>
                          <p style="color: #d4af37; font-size: 22px; margin: 0;">
                            🧝 Jingles the Elf
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 40px 30px 40px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: rgba(0,0,0,0.2); border-radius: 10px;">
                      <tr>
                        <td style="padding: 15px; text-align: center;">
                          <p style="color: #a8d5ba; font-size: 14px; margin: 0;">
                            📍 Day ${dayNumber} of 4 • ${dayNumber === 4 ? '🎉 Journey Complete!' : `${4 - dayNumber} day${4 - dayNumber === 1 ? '' : 's'} until delivery!`}
                          </p>
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 10px;">
                            <tr>
                              <td style="background-color: rgba(255,255,255,0.2); border-radius: 10px; padding: 3px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" style="width: ${dayNumber * 25}%;">
                                  <tr>
                                    <td style="background: linear-gradient(90deg, #165b33, #d4af37, #c41e3a); height: 10px; border-radius: 8px;"></td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #1a1a2e; padding: 20px; text-align: center; border-radius: 0 0 17px 17px;">
                    <p style="color: #666; font-size: 12px; margin: 0;">
                      This magical message was sent from the North Pole 🎄<br>
                      Letters to Santa™ • ${new Date().getFullYear()}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { subject: day.subject, html }
}

// Story text for each milestone
const STORY_TEXT: Record<string, string> = {
  'ELF_SORTING_STATION': 'Your letter has arrived at the Elf Sorting Station! The elves are carefully preparing it for its magical journey to Santa.',
  'CANDY_CANE_FOREST': 'Your letter is traveling through the enchanted Candy Cane Forest, where the trees are made of peppermint!',
  'REINDEER_RUNWAY': 'The reindeer have spotted your letter! They\'re giving it a special inspection before it continues to Santa.',
  'AURORA_GATE': 'Your letter passed through the magical Northern Lights and it started GLOWING with Christmas spirit!',
  'SANTAS_DESK': 'YOUR LETTER HAS BEEN DELIVERED! Santa is reading it right now with a big smile on his face!',
  'NORTH_POLE_WORKSHOP': 'Journey complete! Santa has your letter and is preparing something special for you!'
}

export async function POST(request: NextRequest) {
  // Verify authentication
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Find all children whose milestone can be advanced
    const children = await db.child.findMany({
      where: {
        milestoneIndex: {
          lt: 5 // Less than final milestone (NORTH_POLE_WORKSHOP)
        }
      },
      include: {
        customer: true
      }
    })

    let advancedCount = 0
    let emailsSent = 0

    for (const child of children) {
      const newIndex = child.milestoneIndex + 1
      const newMilestone = MILESTONE_ORDER[newIndex]
      const newStoryText = STORY_TEXT[newMilestone] || ''

      // Update the child's milestone
      await db.child.update({
        where: { id: child.id },
        data: {
          milestoneIndex: newIndex,
          currentMilestone: newMilestone,
          currentStoryText: newStoryText
        }
      })

      advancedCount++

      // Send story email for days 1-4 (indices 1-4)
      if (newIndex >= 1 && newIndex <= 4) {
        const webhookUrl = process.env.MAKE_WEBHOOK_DAILY_EMAIL
        
        if (webhookUrl) {
          try {
            const isMagicTier = child.customer.tier === 'MAGIC'
            const { subject, html } = generateJinglesEmail(
              child.customer.firstName,
              child.name,
              newIndex,
              child.id,
              isMagicTier
            )

            await fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: child.customer.email,
                subject: subject,
                html: html,
                childName: child.name,
                parentFirstName: child.customer.firstName,
                dayNumber: newIndex
              })
            })

            emailsSent++
          } catch (emailError) {
            console.error(`Failed to send email for child ${child.id}:`, emailError)
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      advancedCount,
      emailsSent,
      message: `Advanced ${advancedCount} trackers and sent ${emailsSent} story emails`
    })

  } catch (error) {
    console.error('Advance trackers error:', error)
    return NextResponse.json(
      { error: 'Failed to advance trackers' },
      { status: 500 }
    )
  }
}
