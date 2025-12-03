/**
 * Advance Trackers API Route
 * 
 * POST /api/advance-trackers
 * Advances all children's trackers by 1 milestone AND sends daily story emails.
 * Called daily by Make.com scheduler.
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Milestone order for progression
const MILESTONE_ORDER = [
  'ELF_SORTING_STATION',
  'CANDY_CANE_FOREST',
  'REINDEER_RUNWAY',
  'AURORA_GATE',
  'SANTAS_DESK',
  'NORTH_POLE_WORKSHOP',
] as const

// Story text for each milestone
const MILESTONE_STORIES: Record<string, string> = {
  ELF_SORTING_STATION: "Your letter has arrived at the Elf Sorting Station! Jingles the Delivery Elf has been assigned as your letter's personal guide for this magical journey.",
  CANDY_CANE_FOREST: "Your letter is traveling through the enchanted Candy Cane Forest! The Sugar Sprites are cheering it on as Jingles guides it through the peppermint paths.",
  REINDEER_RUNWAY: "Your letter has reached Reindeer Runway! Dasher gave it an approving sniff, and Rudolph's nose glowed extra bright when he saw it.",
  AURORA_GATE: "Your letter is passing through the magnificent Aurora Gate! The northern lights wrapped around it, infusing it with extra North Pole magic.",
  SANTAS_DESK: "YOUR LETTER HAS BEEN DELIVERED! Santa himself read your letter with a warm smile and twinkling eyes. The magic of Christmas is now in full swing!",
  NORTH_POLE_WORKSHOP: "Your letter's journey is complete! It's now safely with Santa, who has shared your wishes with his team of master toymakers.",
}

// Daily story emails from Jingles the Elf
const DAILY_EMAILS = {
  // Day 1 - After arriving at Elf Sorting Station (milestoneIndex 0, moving to 1)
  1: {
    subject: "🍬 Traveling Through the Candy Cane Forest! 🍬",
    body: `Hello again, friend!

Jingles here with your daily letter update!

We made it to the Candy Cane Forest this morning, and OH MY SNOWBALLS, it's beautiful! The trees here aren't like regular trees - they're actual giant candy canes that twist up toward the sky, with peppermint leaves that tinkle like bells when the wind blows.

Your letter is doing wonderfully! I've got it tucked safely in my enchanted satchel, which keeps everything warm and protected from the occasional gumdrop rain shower (yes, it rains gumdrops here - the red ones are my favorite!).

We met some Sugar Sprites along the path today. They're tiny little creatures made of crystallized sugar who help guide travelers through the forest. They took one look at your letter and started cheering! They said they could sense all the love and Christmas wishes inside.

We're about halfway through the forest now, resting by a stream that flows with liquid candy cane. Tomorrow we'll reach the edge of the forest and head toward the Reindeer Runway!

Your letter keeps humming Christmas carols. I think it's excited!

Peppermint kisses and candy cane wishes,
🧝 Jingles

P.S. I tried to bring you a gumdrop but it melted in my pocket. Sorry about that!`
  },
  
  // Day 2 - At Candy Cane Forest, moving to Reindeer Runway (milestoneIndex 1, moving to 2)
  2: {
    subject: "🦌 Your Letter Just Met the Reindeer! 🦌",
    body: `GUESS WHAT GUESS WHAT GUESS WHAT!!!

It's Jingles, and I can barely hold my quill steady because I'm SO excited to tell you where we are!

THE REINDEER RUNWAY!

This is where Santa's famous reindeer live and train for their big Christmas Eve flight. And oh my jingle bells, they are even more magnificent in person! Their fur shimmers like starlight, and when they run, they leave little trails of sparkles behind them.

Your letter got a VERY special honor today. Dasher - yes, THE Dasher - came over to inspect our mail delivery. He sniffed your letter gently (reindeer can smell Christmas spirit, did you know that?) and gave an approving nod! Rudolph even stopped by during his evening practice flight. His nose really DOES glow that bright - I had to squint!

We're staying in the Reindeer Lodge tonight. It's a cozy cabin with a fireplace, and all the delivery elves gather here to share stories. Your letter is resting on a special velvet pillow by the fire.

Tomorrow we head to the Aurora Gateway - the most magical part of the journey!

With reindeer dust and starlight,
🧝 Jingles

P.S. Blitzen wanted me to tell you that you're doing a great job being good this year. Reindeer just KNOW these things!`
  },
  
  // Day 3 - At Reindeer Runway, moving to Aurora Gate (milestoneIndex 2, moving to 3)
  3: {
    subject: "🌌 The Northern Lights Are Guiding Us! 🌌",
    body: `Dear wonderful friend,

I'm writing to you tonight under the most spectacular sky you could ever imagine.

We've reached the Aurora Gateway, and I had to stop everything just to take it all in. The Northern Lights here aren't just IN the sky - they reach all the way down to the ground like shimmering curtains of green, purple, and gold. We're actually walking THROUGH them!

When your letter passed through the lights, something magical happened. The aurora wrapped around it like a gentle hug and infused it with extra North Pole magic. I saw it glow for a moment - this beautiful, warm golden light - and then settle back into my satchel with a happy little sigh.

This gateway is special because it's the final passage before Santa's village. Only letters filled with true Christmas spirit can pass through. The aurora can sense what's in your heart when you wrote your letter, and I'm proud to tell you...

Your letter passed with FLYING colors! Literally - a little rainbow shot out of my satchel when we crossed through!

Tomorrow is the big day. We'll arrive at Santa's Workshop, and I'll personally deliver your letter to the big man himself.

I'm getting a little emotional, honestly. I've carried thousands of letters over the years, but each one is special.

With aurora sparkles and grateful heart,
🧝 Jingles

P.S. I caught some aurora light in a jar for you. It's sitting on Santa's mantle now, glowing softly with your name on it.`
  },
  
  // Day 4 - At Aurora Gate, moving to Santa's Desk (milestoneIndex 3, moving to 4)
  4: {
    subject: "🎅 YOUR LETTER HAS BEEN DELIVERED TO SANTA! 🎅",
    body: `WE DID IT!!!

*throws confetti made of snowflakes*

Friend, I am OVERJOYED to tell you that your letter has officially been delivered to Santa's Workshop!

I placed it directly into Santa's hands this morning. You should have seen him! His eyes got that special twinkle (you know the one), and he settled into his big red chair by the fire to read it right away. Mrs. Claus brought him his special reading glasses - the ones with tiny stars on the frames - and a cup of cocoa.

I waited nearby (trying not to peek, but it was SO hard!) and when he finished reading, he looked up with the biggest, warmest smile. He patted the letter gently and said:

"This one. This is a GOOD one, Jingles."

Then he added your letter to his special stack - the ones he keeps closest to his desk while the elves work on their Christmas magic.

Your letter's journey is complete, but the magic is just beginning! Santa has read your wishes, knows about all the wonderful things you've done, and is already thinking about Christmas morning.

Thank you for letting me be your letter's guide. It has been the greatest honor of my 127 elf years.

May your Christmas be filled with wonder, love, and just the right amount of cookie crumbs.

Forever your friend,
🧝 Jingles the Delivery Elf

P.S. Santa says to keep being YOU. That's the best gift of all. 🎁

---

🎄 YOUR LETTER STATUS: ✅ DELIVERED TO SANTA'S WORKSHOP 🎄

Log in to see the final update: https://letterstosanta.vercel.app/tracker-login`
  },
}

// Send email via Make.com webhook (or you can use a direct email service)
async function sendStoryEmail(
  parentEmail: string,
  parentFirstName: string,
  childName: string,
  dayNumber: number
) {
  const emailData = DAILY_EMAILS[dayNumber as keyof typeof DAILY_EMAILS]
  if (!emailData) return

  // Personalize the subject with child's name
  const subject = `${childName}'s Letter Update: ${emailData.subject}`
  
  // Add greeting to body
  const body = `Hi ${parentFirstName}! Here's today's update on ${childName}'s letter:\n\n${emailData.body}`

  // Send via Make.com webhook for emails
  if (process.env.MAKE_WEBHOOK_DAILY_EMAIL) {
    try {
      await fetch(process.env.MAKE_WEBHOOK_DAILY_EMAIL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: parentEmail,
          subject,
          body,
          childName,
          parentFirstName,
          dayNumber,
        }),
      })
    } catch (error) {
      console.error(`Failed to send day ${dayNumber} email to ${parentEmail}:`, error)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization')
    const expectedToken = `Bearer ${process.env.CRON_SECRET || 'santa-cron-secret-2024'}`
    
    if (authHeader !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all children who haven't reached the final milestone
    const children = await db.child.findMany({
      where: {
        milestoneIndex: {
          lt: MILESTONE_ORDER.length - 1, // Not at final milestone yet
        },
      },
      include: {
        customer: true,
      },
    })

    let advancedCount = 0
    let emailsSent = 0

    // Advance each child's tracker by 1 milestone
    for (const child of children) {
      const newIndex = child.milestoneIndex + 1
      const newMilestone = MILESTONE_ORDER[newIndex]
      const newStory = MILESTONE_STORIES[newMilestone]

      await db.child.update({
        where: { id: child.id },
        data: {
          milestoneIndex: newIndex,
          currentMilestone: newMilestone,
          currentStoryText: newStory,
        },
      })

      advancedCount++

      // Send daily story email (days 1-4 send emails, day 5 is final)
      // Email number corresponds to the day they're moving TO
      if (newIndex >= 1 && newIndex <= 4) {
        await sendStoryEmail(
          child.customer.email,
          child.customer.firstName,
          child.name,
          newIndex
        )
        emailsSent++
      }
    }

    console.log(`Advanced ${advancedCount} trackers, sent ${emailsSent} emails`)

    return NextResponse.json({
      success: true,
      advancedCount,
      emailsSent,
      message: `Advanced ${advancedCount} trackers and sent ${emailsSent} story emails`,
    })
  } catch (error) {
    console.error('Advance trackers error:', error)
    return NextResponse.json(
      { error: 'Failed to advance trackers' },
      { status: 500 }
    )
  }
}
