import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const session = await getSession().catch(() => null);
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { subject, imageUrl, lessonData, depthMode, type } = await req.json();

    if (!subject || !lessonData) {
      return NextResponse.json({ error: 'Missing subject or lesson data' }, { status: 400 });
    }

    const recordType: 'lesson' | 'repurpose' = type === 'repurpose' ? 'repurpose' : 'lesson';

    const supabase = createServerClient();
    if (!supabase) {
      // No Supabase configured — return success without persisting
      return NextResponse.json({ success: true, mode: 'local-only' });
    }

    // Get user_id from teachyoung_users
    const { data: user } = await supabase
      .from('teachyoung_users')
      .select('id')
      .eq('lk_id', session.lkId)
      .limit(1)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const insertPayload: Record<string, unknown> = {
      user_id: user.id,
      lk_id: session.lkId,
      subject,
      image_url: imageUrl || null,
      lesson_data: lessonData,
      depth_mode: depthMode || 'standard',
      type: recordType,
    };

    let { data: lesson, error } = await supabase
      .from('teachyoung_lessons')
      .insert(insertPayload)
      .select('id')
      .limit(1)
      .single();

    // Backwards compat: if the `type` column doesn't exist yet, retry without it.
    if (error && /column .*type/i.test(error.message || '')) {
      delete insertPayload.type;
      const retry = await supabase
        .from('teachyoung_lessons')
        .insert(insertPayload)
        .select('id')
        .limit(1)
        .single();
      lesson = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error('[save-lesson] error:', error);
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }

    return NextResponse.json({ success: true, lessonId: lesson?.id, type: recordType });
  } catch (e) {
    console.error('[save-lesson] error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
