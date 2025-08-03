import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

// Initialize Replicate - will use env variable if available
const replicate = process.env.REPLICATE_API_TOKEN ? new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
}) : null;

interface BundleOutfitParams {
  tieColor: string;
  tieStyle: 'bowtie' | 'classic' | 'skinny' | 'slim';
  suitColor: string;
  shirtColor: string;
  occasion: 'wedding' | 'business' | 'prom' | 'casual';
}

export async function POST(request: NextRequest) {
  try {
    // Check if Replicate is configured
    if (!replicate) {
      return NextResponse.json(
        { 
          error: 'Image generation not configured',
          message: 'REPLICATE_API_TOKEN not found in environment variables'
        },
        { status: 503 }
      );
    }

    const { tieColor, tieStyle, suitColor, shirtColor, occasion }: BundleOutfitParams = await request.json();

    // Validate inputs
    if (!tieColor || !tieStyle || !suitColor || !shirtColor || !occasion) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Build detailed prompt for outfit generation
    const styleDescriptions = {
      bowtie: 'elegant pre-tied bow tie',
      classic: 'traditional 3.25 inch wide necktie',
      skinny: 'modern 2.75 inch skinny tie',
      slim: 'contemporary 2.25 inch slim tie'
    };

    const occasionSettings = {
      wedding: 'elegant wedding photography with soft romantic lighting',
      business: 'professional business portrait with clean corporate background',
      prom: 'stylish prom photography with modern youthful energy',
      casual: 'relaxed lifestyle photography with natural lighting'
    };

    const prompt = `Professional fashion photography of a well-dressed male model wearing:
    - A perfectly fitted ${suitColor} suit
    - Crisp ${shirtColor} dress shirt
    - ${tieColor} ${styleDescriptions[tieStyle]}
    ${occasionSettings[occasion]}, studio lighting, full outfit visible, clean white background, high-end fashion catalog style, sharp focus on clothing details, 8K resolution, professional menswear photography`;

    const negativePrompt = "blurry, amateur, bad quality, wrinkled clothes, poor fit, messy, dark shadows, overexposed, text, watermark, logo";

    // Generate image using Stable Diffusion
    const output = await replicate.run(
      "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      {
        input: {
          prompt,
          negative_prompt: negativePrompt,
          width: 768,
          height: 1024,
          num_outputs: 1,
          num_inference_steps: 30,
          guidance_scale: 7.5,
          scheduler: "K_EULER"
        }
      }
    );

    // Process output
    const imageUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({
      success: true,
      imageUrl,
      outfit: {
        tieColor,
        tieStyle,
        suitColor,
        shirtColor,
        occasion
      },
      prompt,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating bundle outfit:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate outfit',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Test endpoint to check if Replicate is configured
export async function GET() {
  return NextResponse.json({
    configured: !!process.env.REPLICATE_API_TOKEN,
    message: process.env.REPLICATE_API_TOKEN 
      ? 'Replicate is configured and ready' 
      : 'Replicate API token not found. Add REPLICATE_API_TOKEN to .env.local'
  });
}