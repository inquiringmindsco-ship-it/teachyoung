import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { createServerClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const session = await getSession().catch(() => null);
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json({ lessons: [], mode: 'unconfigured' });
  }

  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20');

  const typeFilter = req.nextUrl.searchParams.get('type'); // 'lesson' | 'repurpose' | null

  let query = supabase
    .from('teachyoung_lessons')
    .select('id, subject, image_url, depth_mode, created_at, type, lesson_data')
    .eq('lk_id', session.lkId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (typeFilter === 'lesson' || typeFilter === 'repurpose') {
    query = query.eq('type', typeFilter);
  }

  let { data: lessons, error } = await query;

  // Backwards compat: if `type` column missing, retry without it.
  if (error && /column .*type/i.test(error.message || '')) {
    const retry = await supabase
      .from('teachyoung_lessons')
      .select('id, subject, image_url, depth_mode, created_at, lesson_data')
      .eq('lk_id', session.lkId)
      .order('created_at', { ascending: false })
      .limit(limit);
    lessons = (retry.data || []).map((l: any) => ({ ...l, type: 'lesson' as const }));
    error = retry.error;
  }

  if (error) {
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
  }

  return NextResponse.json({ lessons: lessons || [] });
}
