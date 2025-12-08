import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET: 이벤트 조회
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    let whereClause: any = { userId: user.id };

    // 년도와 월 필터링
    if (year && month) {
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);
      const startDate = `${yearNum}-${String(monthNum + 1).padStart(2, '0')}-01`;
      const endDate = `${yearNum}-${String(monthNum + 1).padStart(2, '0')}-31`;

      whereClause.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: 이벤트 생성
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, notes, date, color, groupId, startDate, endDate, events } = body;

    // 다중 이벤트 생성 (날짜 범위)
    if (events && Array.isArray(events)) {
      const createdEvents = await prisma.$transaction(
        events.map((event: any) =>
          prisma.event.create({
            data: {
              title: event.title,
              notes: event.notes,
              date: event.date,
              color: event.color,
              groupId: event.groupId,
              startDate: event.startDate,
              endDate: event.endDate,
              userId: user.id,
            },
          })
        )
      );

      return NextResponse.json(createdEvents, { status: 201 });
    }

    // 단일 이벤트 생성
    const event = await prisma.event.create({
      data: {
        title,
        notes,
        date,
        color,
        groupId,
        startDate,
        endDate,
        userId: user.id,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: 이벤트 삭제
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // 본인의 이벤트인지 확인
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event || event.userId !== user.id) {
      return NextResponse.json({ error: 'Event not found or unauthorized' }, { status: 404 });
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: 이벤트 수정
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { id, title, notes, date, color } = body;

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // 본인의 이벤트인지 확인
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event || event.userId !== user.id) {
      return NextResponse.json({ error: 'Event not found or unauthorized' }, { status: 404 });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        notes,
        date,
        color,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
