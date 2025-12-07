/**
 * Get Child Data API (Public)
 * 
 * GET /api/child/[childId]
 * Returns child data for Santa letter and certificate pages
 * Uses Claude AI to generate personalized Santa letter
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import Anthropic from '@anthropic-ai/sdk'

// Cache for generated letters to avoid regenerating on every page load
const letterCache = new Map<string, string>()

async function generateSantaLetter(
  childName: string,
  wishlist: string | null,
  goodThings: string | null,
  petsAndFamily: string | null
): Promise<string> {
  const client = new Anthropic()
  
  const prompt = `You are Santa Claus writing a warm, personal letter to a child named ${childName}. 

Here's what you know about this child:
- Wishlist: ${wishlist || 'Not specified'}
- Good things they've done: ${goodThings || 'Not specified'}  
- Pets and family: ${petsAndFamily || 'Not specified'}

Write a heartfelt letter from Santa that:
1. Starts with "Ho Ho Ho, Dear ${childName}!"
2. Mentions you received their wonderful letter
3. If they shared good deeds, praise them specifically for those (make it sound natural, not just listing)
4. If they shared wishes, acknowledge them warmly without promising specific gifts
5. If they mentioned pets/family, include a warm mention of them
6. Encourage them to keep being kind and believing in Christmas magic
7. Sign off as Santa Claus with a P.S. about the reindeer

Keep it warm, magical, and about 200-250 words. Write naturally as if Santa is speaking from the heart - don't just insert their words verbatim. Make it feel personal and special.

Return ONLY the letter text, no additional commentary.`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      { role: 'user', content: prompt }
    ]
  })

  const textBlock = message.content.find(block => block.type === 'text')
  return textBlock ? textBlock.text : ''
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  try {
    const { childId } = await params

    const child = await db.child.findUnique({
      where: { id: childId },
      include: {
        customer: true,
        letter: true,
      },
    })

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    // Only allow MAGIC tier to access
    if (child.customer.tier !== 'MAGIC') {
      return NextResponse.json({ error: 'MAGIC tier required' }, { status: 403 })
    }

    // Generate or retrieve cached Santa letter
    let santaLetter: string | undefined = letterCache.get(childId)
    
    if (!santaLetter && process.env.ANTHROPIC_API_KEY) {
      try {
        santaLetter = await generateSantaLetter(
          child.name,
          child.letter?.wishlist || null,
          child.letter?.goodThings || null,
          child.letter?.petsAndFamily || null
        )
        // Cache the generated letter
        letterCache.set(childId, santaLetter)
      } catch (error) {
        console.error('Error generating Santa letter:', error)
        // Fall back to basic letter if AI fails
        santaLetter = undefined
      }
    }

    return NextResponse.json({
      id: child.id,
      name: child.name,
      santaLetter: santaLetter || null,
      letter: child.letter ? {
        wishlist: child.letter.wishlist,
        goodThings: child.letter.goodThings,
        petsAndFamily: child.letter.petsAndFamily,
      } : null,
    })

  } catch (error) {
    console.error('Get child error:', error)
    return NextResponse.json({ error: 'Failed to fetch child' }, { status: 500 })
  }
}
