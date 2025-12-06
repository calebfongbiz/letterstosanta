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
  dayNumber: number
): { subject: string; html: string } {
  
  const stories: Record<number, { subject: string; location: string; emoji: string; story: string; signoff: string }> = {
    1: {
      subject: `🍬 ${childName}'s Letter is in the Candy Cane Forest!`,
      location: "Candy Cane Forest",
      emoji: "🍬",
      story: `The most amazing thing happened today! Your letter floated right into the Candy Cane Forest, where the trees are made of real, swirly peppermint sticks that reach all the way up to the clouds!

I met some Sugar Sprites who sprinkled your letter with extra sparkle dust. They said your letter smells like Christmas cookies and hot cocoa - that means it's EXTRA special!

The path ahead leads to the Reindeer Runway. I can already hear the jingle bells in the distance!`,
      signoff: "Sweet wishes and peppermint kisses"
    },
    2: {
      subject: `🦌 ${childName}'s Letter Just Met the Reindeer!`,
      location: "Reindeer Runway",
      emoji: "🦌",
      story: `You won't believe what happened today! We made it to the Reindeer Runway, and guess who was there? DASHER AND DANCER!

They did the official Reindeer Inspection (it's a real thing, I promise!). Dasher sniffed your letter and his nose twitched with happiness. Dancer did a little hop - that's how reindeer say "This letter is APPROVED!"

Even Rudolph flew by and his nose glowed extra bright when he saw your letter. Tomorrow we head to the Aurora Gate - the most magical checkpoint of all!`,
      signoff: "With jingle bells and reindeer dust"
    },
    3: {
      subject: `🌌 ${childName}'s Letter is Passing Through the Northern Lights!`,
      location: "Aurora Gate",
      emoji: "✨",
      story: `Oh my snowflakes, today was BREATHTAKING! We reached the Aurora Gate, where the Northern Lights dance across the sky in ribbons of green, purple, and blue!

Your letter had to pass through the magical lights - it's like a special checkpoint that only the most heartfelt letters can cross. And guess what? Your letter started GLOWING! That means it's filled with so much love and Christmas spirit!

The lights whispered that Santa is going to love reading this one. Tomorrow... we finally reach Santa's desk!`,
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

This has been the most magical journey, and I'm so glad I got to be your letter's guide!`,
      signoff: "With the biggest elf hug ever"
    }
  }

  const day = stories[dayNumber]
  if (!day) return { subject: '', html: '' }

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
                <tr>
                  <td align="center" style="padding: 0 40px 30px 40px;">
                    <p style="color: #d4af37; font-size: 18px; font-style: italic; margin: 0;">
                      ${day.signoff},
                    </p>
                    <p style="color: #ffffff; font-size: 22px; font-weight: bold; margin: 10px 0 0 0;">
                      🎄 Jingles the Elf 🎄
                    </p>
                    <p style="color: #a8d5ba; font-size: 14px; margin: 5px 0 0 0;">
                      Official Letter Guide, North Pole Mail Division
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 40px 30px 40px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="background-color: rgba(255,255,255,0.2); border-radius: 10px; padding: 15px;">
                          <p style="color: #a8d5ba; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0; text-align: center;">
                            Letter Journey Progress
                          </p>
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="background-color: rgba(255,255,255,0.3); border-radius: 5px; height: 10px;">
                                <table role="presentation" width="${(dayNumber + 1) * 20}%" cellspacing="0" cellpadding="0">
                                  <tr>
                                    <td style="background: linear-gradient(90deg, #165b33, #d4af37, #c41e3a); border-radius: 5px; height: 10px;"></td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          <p style="color: #ffffff; font-size: 11px; margin: 8px 0 0 0; text-align: center;">
                            ${dayNumber === 4 ? '🎉 DELIVERED!' : `Day ${dayNumber + 1} of 5 - ${4 - dayNumber} day${4 - dayNumber !== 1 ? 's' : ''} until delivery!`}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #d4af37; height: 8px; border-radius: 0 0 17px 17px;"></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 30px 20px;">
              <p style="color: #888888; font-size: 12px; margin: 0;">
                ❄️ This magical message was sent from the North Pole ❄️
              </p>
              <p style="color: #666666; font-size: 11px; margin: 10px 0 0 0;">
                Letters to Santa™ • Keeping the magic alive
              </p>
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
  ELF_SORTING_STATION: "Your letter has just begun its magical journey! Jingles the Elf has been assigned as your letter's personal guide.",
  CANDY_CANE_FOREST: "Your letter is floating through the Candy Cane Forest! The Sugar Sprites are sprinkling it with extra sparkle dust.",
  REINDEER_RUNWAY: "Dasher and Dancer have officially approved your letter! Even Rudolph's nose glowed extra bright.",
  AURORA_GATE: "Your letter passed through the magical Northern Lights and it started GLOWING with Christmas spirit!",
  SANTAS_DESK: "DELIVERED! Santa has read your letter and he smiled his big, jolly smile. He's so proud of you!",
  NORTH_POLE_WORKSHOP: "Your letter's journey is complete! Santa has added it to his very special stack."
}

export async function POST(request: NextRequest) {
  // Verify authentication
  if (!verifyAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Get all children who haven't reached the final milestone
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
      // Day 0 = ELF_SORTING_STATION (no email, starting point)
      // Day 1 = CANDY_CANE_FOREST (email 1)
      // Day 2 = REINDEER_RUNWAY (email 2)
      // Day 3 = AURORA_GATE (email 3)
      // Day 4 = SANTAS_DESK (email 4)
      // Day 5 = NORTH_POLE_WORKSHOP (no email, journey complete)
      if (newIndex >= 1 && newIndex <= 4) {
        const webhookUrl = process.env.MAKE_WEBHOOK_DAILY_EMAIL
        
        if (webhookUrl) {
          try {
            const { subject, html } = generateJinglesEmail(
              child.customer.firstName,
              child.name,
              newIndex
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
