import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      spiritualPath,
      primaryChallenge,
      investmentLevel,
      ninetyDayGoal,
      oneThingHelp,
      answers,
      userAgent,
    } = body;

    // Validate required fields
    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: fullName, email, phone' },
        { status: 400 }
      );
    }

    // Save to Supabase
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('quiz_submissions')
      .insert({
        full_name: fullName,
        email,
        phone,
        spiritual_path: spiritualPath || null,
        primary_challenge: primaryChallenge || null,
        investment_level: investmentLevel || null,
        ninety_day_goal: ninetyDayGoal || null,
        one_thing_help: oneThingHelp || null,
        answers,
        user_agent: userAgent,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save submission' },
        { status: 500 }
      );
    }

    // Send Slack webhook notification
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `New Heart Path Assessment!\nName: ${fullName}\nEmail: ${email}\nSpiritual Path: ${spiritualPath}\nChallenge: ${primaryChallenge}\nInvestment: ${investmentLevel}`,
          }),
        });
      } catch (slackError) {
        console.error('Slack notification failed:', slackError);
      }
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('Quiz submit error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
