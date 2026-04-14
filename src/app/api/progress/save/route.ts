import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const session = await getSession().catch(() => null);
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { score, total, subject, lessonId } = await req.json();

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({ success: true, mode: 'local-only' });
    }

    const { data: user } = await supabase
      .from('teachyoung_users')
      .select('id')
      .eq('lk_id', session.lkId)
      .limit(1)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Upsert quiz score
    await supabase.from('teachyoung_quiz_scores').insert({
      user_id: user.id,
      lk_id: session.lkId,
      lesson_id: lessonId || null,
      score,
      total,
      subject,
    });

    // Update streak/progress
    const today = new Date().toISOString().split('T')[0];
    const { data: progress } = await supabase
      .from('teachyoung_progress')
      .select('current_streak, longest_streak, last_activity_at, total_discoveries')
      .eq('lk_id', session.lkId)
      .limit(1)
      .single();

    const prog = progress as { current_streak: number; longest_streak: number; last_activity_at: string; total_discoveries: number } | null;

    let currentStreak = prog?.current_streak ?? 0;
    let longestStreak = prog?.longest_streak ?? 0;
    const lastActivity = prog?.last_activity_at
      ? new Date(prog.last_activity_at).toISOString().split('T')[0]
      : null;

    if (lastActivity !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      currentStreak = lastActivity === yesterday ? currentStreak + 1 : 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    }

    await supabase.from('teachyoung_progress').upsert({
      lk_id: session.lkId,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      total_discoveries: (prog?.total_discoveries ?? 0) + 1,
      last_activity_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'lk_id' });

    return NextResponse.json({ success: true, streak: currentStreak });
  } catch (e) {
    console.error('[save-progress] error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
