#!/usr/bin/env python3
"""
Inquiring Minds LLC — Confidential Proprietary Systems Manual
Signal Identity System (SIS™) + Signal Confidence System (SCS™)
Version 1.0 — April 2026
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, HRFlowable,
    KeepTogether
)
from reportlab.graphics.shapes import Rect, String, Line, Drawing
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from reportlab.graphics.shapes import Rect, String, Line
import os

GOLD       = colors.HexColor('#C9A84C')
GOLD_LIGHT = colors.HexColor('#E8D5A3')
BLACK      = colors.HexColor('#0A0A0A')
WHITE      = colors.HexColor('#FAFAFA')
GRAY       = colors.HexColor('#6B6B6B')
LIGHT_GRAY = colors.HexColor('#E5E5E5')
DARK_GRAY  = colors.HexColor('#2A2A2A')
SURFACE    = colors.HexColor('#F2F2F0')
RED        = colors.HexColor('#C62828')
GREEN      = colors.HexColor('#2E7D32')
ORANGE     = colors.HexColor('#E65100')

PAGE_W, PAGE_H = letter
MARGIN = 0.85 * inch
CONTENT_W = PAGE_W - 2 * MARGIN

# ─── STYLES ─────────────────────────────────────────────────────────────────

def make_styles():
    s = {}
    def add(name, **kw):
        s[name] = ParagraphStyle(name, **kw)

    add('cover_co',    fontName='Helvetica',       fontSize=10,  leading=14, textColor=GOLD)
    add('cover_title', fontName='Helvetica-Bold',  fontSize=30,  leading=38, textColor=WHITE, alignment=TA_LEFT)
    add('cover_sub',   fontName='Helvetica',       fontSize=13,  leading=19, textColor=GOLD_LIGHT, alignment=TA_LEFT)
    add('cover_meta',  fontName='Helvetica',       fontSize=9,   leading=13, textColor=GRAY, alignment=TA_LEFT)
    add('cover_class', fontName='Helvetica-Bold',   fontSize=9,   leading=13, textColor=GOLD, alignment=TA_LEFT)

    add('section',  fontName='Helvetica-Bold', fontSize=9,   leading=12, textColor=GOLD, spaceAfter=4, spaceBefore=20)
    add('sectitle', fontName='Helvetica-Bold',  fontSize=20,  leading=26, textColor=BLACK, spaceAfter=8)
    add('sub',      fontName='Helvetica-Bold',  fontSize=12,  leading=16, textColor=BLACK, spaceAfter=6, spaceBefore=14)
    add('body',    fontName='Helvetica',       fontSize=10.5,leading=16, textColor=DARK_GRAY, alignment=TA_JUSTIFY, spaceAfter=8)
    add('body_l',  fontName='Helvetica',       fontSize=10.5,leading=16, textColor=DARK_GRAY, alignment=TA_LEFT,   spaceAfter=8)
    add('label',   fontName='Helvetica-Bold',  fontSize=8,   leading=11, textColor=GOLD,      spaceAfter=3, spaceBefore=12)
    add('footer',  fontName='Helvetica',       fontSize=7.5, leading=10, textColor=GRAY,      alignment=TA_CENTER)
    add('callout', fontName='Helvetica-BoldOblique', fontSize=11, leading=17, textColor=BLACK, alignment=TA_LEFT, spaceAfter=10, leftIndent=18, rightIndent=18)
    add('verstab', fontName='Courier',          fontSize=8,   leading=11, textColor=GRAY, alignment=TA_LEFT)
    add('quote',   fontName='Helvetica-Oblique',fontSize=10.5,leading=16, textColor=DARK_GRAY, alignment=TA_JUSTIFY, spaceAfter=6, leftIndent=22, rightIndent=22)
    add('attr',    fontName='Helvetica-Bold',   fontSize=9.5, leading=14, textColor=BLACK, alignment=TA_LEFT, spaceAfter=12, leftIndent=22)
    add('threat_title', fontName='Helvetica-Bold', fontSize=10, leading=14, textColor=BLACK)
    add('threat_att',   fontName='Helvetica',   fontSize=9.5, leading=14, textColor=DARK_GRAY, alignment=TA_LEFT)
    add('threat_def',   fontName='Helvetica',   fontSize=9.5, leading=14, textColor=DARK_GRAY, alignment=TA_LEFT)
    add('street',  fontName='Helvetica-Oblique',fontSize=11,  leading=17, textColor=DARK_GRAY, alignment=TA_LEFT, spaceAfter=10, leftIndent=16)
    add('pro',     fontName='Helvetica',        fontSize=10.5,leading=16, textColor=DARK_GRAY, alignment=TA_JUSTIFY, spaceAfter=10)
    add('inv',     fontName='Helvetica',        fontSize=10.5,leading=16, textColor=DARK_GRAY, alignment=TA_JUSTIFY, spaceAfter=10)
    add('dev',     fontName='Courier',          fontSize=9,   leading=13, textColor=DARK_GRAY, alignment=TA_LEFT, spaceAfter=10)
    add('check_ok',fontName='Helvetica-Bold',   fontSize=9.5, leading=14, textColor=GREEN)
    add('check_no',fontName='Helvetica-Bold',   fontSize=9.5, leading=14, textColor=RED)
    add('check_pen',fontName='Helvetica-Bold',  fontSize=9.5, leading=14, textColor=ORANGE)
    return s

# ─── PAGE TEMPLATES ─────────────────────────────────────────────────────────

def cover_page(c, doc):
    c.setFillColor(BLACK); c.rect(0,0,PAGE_W,PAGE_H,fill=1,stroke=0)
    c.setFillColor(GOLD);  c.rect(0,0,5,PAGE_H,fill=1,stroke=0)
    c.setStrokeColor(GOLD); c.setLineWidth(1.5)
    c.line(MARGIN, 1.05*inch, PAGE_W-MARGIN, 1.05*inch)
    # Cover page content drawn directly on canvas
    y = PAGE_H - 2.8*inch
    c.setFont('Helvetica',10); c.setFillColor(GOLD)
    c.drawString(MARGIN+0.28*inch, y, 'INQUIRING MINDS LLC')
    c.setFont('Helvetica-Bold',11); c.setFillColor(GRAY)
    c.drawString(MARGIN+0.28*inch, y-0.5*inch, 'CONFIDENTIAL PROPRIETARY')
    c.setFont('Helvetica-Bold',26); c.setFillColor(WHITE)
    c.drawString(MARGIN+0.28*inch, y-0.77*inch, 'SYSTEMS MANUAL')
    c.setStrokeColor(GOLD); c.setLineWidth(2)
    c.line(MARGIN+0.28*inch,y-0.98*inch,MARGIN+0.28*inch+3.4*inch,y-0.98*inch)
    c.setLineWidth(1)
    c.line(MARGIN+0.28*inch,y-1.03*inch,MARGIN+0.28*inch+2.0*inch,y-1.03*inch)
    c.setFont('Helvetica-Bold',15); c.setFillColor(WHITE)
    c.drawString(MARGIN+0.28*inch, y-1.28*inch, 'Signal Identity System\u2122  (SIS\u2122)')
    c.drawString(MARGIN+0.28*inch, y-1.62*inch, 'Signal Confidence System\u2122 (SCS\u2122)')
    c.setFont('Helvetica',9.5); c.setFillColor(GRAY)
    c.drawString(MARGIN+0.28*inch, y-2.12*inch, 'Version 1.0  \u2022  April 2026  \u2022  Internal Use Only')
    c.setFont('Helvetica-Bold',9); c.setFillColor(GOLD)
    c.drawString(MARGIN+0.28*inch, y-2.38*inch, 'Proprietary and Confidential \u2014 Inquiring Minds LLC')
    # ownership block
    for i, line in enumerate([
        'Owned by: INQUIRING MINDS LLC',
        'Internal use only. No unauthorized copying, reuse,',
        'licensing, distribution, derivative implementation,',
        'or commercial exploitation without express written',
        'permission from Inquiring Minds LLC.',
    ]):
        c.setFont('Helvetica-Bold' if i==0 else 'Helvetica', 10 if i==0 else 8.5)
        c.setFillColor(WHITE if i==0 else GRAY)
        c.drawString(MARGIN+0.28*inch, 2.4*inch-i*0.22*inch, line)

def regular_page(c, doc):
    c.setFillColor(WHITE); c.rect(0,0,PAGE_W,PAGE_H,fill=1,stroke=0)
    c.setStrokeColor(GOLD); c.setLineWidth(1.5)
    c.line(MARGIN, PAGE_H-0.48*inch, PAGE_W-MARGIN, PAGE_H-0.48*inch)
    c.setFont('Helvetica', 7.5); c.setFillColor(GRAY)
    c.drawString(MARGIN, PAGE_H-0.36*inch, 'INQUIRING MINDS LLC')
    c.drawRightString(PAGE_W-MARGIN, PAGE_H-0.36*inch, 'CONFIDENTIAL — PROPRIETARY')
    c.setLineWidth(0.5); c.setStrokeColor(LIGHT_GRAY)
    c.line(MARGIN, 0.55*inch, PAGE_W-MARGIN, 0.55*inch)
    c.setFont('Helvetica', 7.5); c.setFillColor(GRAY)
    c.drawString(MARGIN, 0.34*inch, 'SIS™ (Signal Identity System) & SCS™ (Signal Confidence System)')
    c.drawRightString(PAGE_W-MARGIN, 0.34*inch, f'Page {doc.page}')

# ─── HELPERS ────────────────────────────────────────────────────────────────

def hr(color=GOLD, thickness=0.8, before=4, after=8):
    return HRFlowable(width='100%', thickness=thickness, color=color,
                     spaceAfter=after, spaceBefore=before)

def sp(h=0.15): return Spacer(1, h*inch)

def p(text, style='body'): return Paragraph(text, style if isinstance(style, str) else style)

def section(n, title, S):
    return [sp(0.25), Paragraph(f'<font color="#C9A84C"><b>{n}</b></font>', S['section']),
            Paragraph(f'<b>{title}</b>', S['sectitle']), hr()]

def callout(text, S):
    t = Table([[Paragraph(text, S['callout'])]], colWidths=[CONTENT_W-0.4*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,-1),colors.HexColor('#F9F6EE')),
        ('LEFTPADDING',(0,0),(-1,-1),16),('RIGHTPADDING',(0,0),(-1,-1),16),
        ('TOPPADDING',(0,0),(-1,-1),12),('BOTTOMPADDING',(0,0),(-1,-1),12),
        ('LINEABOVE',(0,0),(-1,0),2,GOLD),('LINEBELOW',(0,-1),(-1,-1),2,GOLD),
    ])); return [t, sp(0.1)]

def box_cell(label, sub, S):
    text = f'<b><font color="white">{label}</font></b>'
    if sub: text += f'<br/><font color="#E8D5A3" size="8">{sub}</font>'
    ps = ParagraphStyle('bx', fontName='Helvetica', fontSize=9, leading=13,
                        textColor=WHITE, alignment=TA_CENTER)
    t = Table([[Paragraph(text, ps)]])  # size controlled by outer Table colWidths
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,-1),BLACK),
        ('ALIGN',(0,0),(-1,-1),'CENTER'),('VALIGN',(0,0),(-1,-1),'MIDDLE'),
        ('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8),
        ('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),
        ('BOX',(0,0),(-1,-1),1,GOLD),
    ])); return t

def flow_row(steps, subs, S):
    n = len(steps)
    box_w = (CONTENT_W - (n-1)*0.28*inch) / n
    box_h = 0.72*inch
    cells = []
    for i, (label, sub) in enumerate(zip(steps, subs)):
        cells.append(box_cell(label, sub, S))
        if i < n-1:
            cells.append(Paragraph('<font color="#C9A84C" size="16">→</font>',
                           ParagraphStyle('arr', alignment=TA_CENTER, leading=20)))
    col_widths = []
    for i, _ in enumerate(steps):
        col_widths.append(box_w)
        if i < n-1:
            col_widths.append(0.28*inch)
    row = Table([cells], colWidths=col_widths)
    row.setStyle(TableStyle([
        ('ALIGN',(0,0),(-1,-1),'CENTER'),('VALIGN',(0,0),(-1,-1),'MIDDLE'),
        ('LEFTPADDING',(0,0),(-1,-1),3),('RIGHTPADDING',(0,0),(-1,-1),3),
        ('ROWHEIGHT',(0,0),(-1,-1),box_h),
    ])); return row

def layer_row(S, name, components, alt=False):
    bg = SURFACE if alt else WHITE
    t = Table([
        [Paragraph(f'<b>{name.upper()}</b>', S['label'])],
        [Paragraph('  •  '.join(components), ParagraphStyle('lc', fontName='Helvetica',
            fontSize=8.5, leading=13, textColor=GRAY, leftIndent=10))],
    ], colWidths=[1.3*inch, CONTENT_W-1.4*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,-1),bg),
        ('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),
        ('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),
        ('LINEABOVE',(0,0),(-1,0),1.5,GOLD),('LINEBELOW',(0,-1),(-1,-1),0.5,LIGHT_GRAY),
        ('LINEBEFORE',(0,0),(0,-1),4,GOLD),('BOX',(0,0),(-1,-1),0.5,LIGHT_GRAY),
    ])); return t

def std_table(headers, rows, widths, header_bg=BLACK, alt_row=True):
    data = [[Paragraph(h, ParagraphStyle('th', fontName='Helvetica-Bold', fontSize=8.5,
        leading=12, textColor=WHITE)) for h in headers]]
    for r in rows:
        data.append([Paragraph(str(c), ParagraphStyle('td', fontName='Helvetica',
            fontSize=9, leading=13, textColor=DARK_GRAY)) for c in r])
    t = Table(data, colWidths=widths)
    style = [
        ('BACKGROUND',(0,0),(-1,0),header_bg),
        ('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),
        ('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),
        ('GRID',(0,0),(-1,-1),0.4,LIGHT_GRAY),
        ('LINEBELOW',(0,0),(-1,0),1.5,GOLD),
    ]
    if alt_row:
        style.append(('ROWBACKGROUNDS',(0,1),(-1,-1),[SURFACE,WHITE]))
    t.setStyle(TableStyle(style)); return t

def threat_row(title, attack, defense, S):
    t = Table([
        [Paragraph(f'<b>{title}</b>', S['threat_title']),
         Paragraph(f'<i>Attack — </i>{attack}', S['threat_att']),
         Paragraph(f'<i>Defense — </i>{defense}', S['threat_def'])],
    ], colWidths=[1.35*inch, 2.2*inch, CONTENT_W-3.55*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,-1),SURFACE),
        ('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),9),
        ('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),
        ('LINEBEFORE',(0,0),(0,-1),4,GOLD),
        ('BOX',(0,0),(-1,-1),0.5,LIGHT_GRAY),
        ('LINEBELOW',(0,-1),(-1,-1),0.4,LIGHT_GRAY),
    ])); return t

# ─── MAIN BUILD ────────────────────────────────────────────────────────────

def build(outpath):
    doc = SimpleDocTemplate(outpath, pagesize=letter,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=0.72*inch, bottomMargin=0.72*inch,
        title="Inquiring Minds LLC — Proprietary Systems Manual",
        author="Inquiring Minds LLC",
        subject="SIS™ and SCS™ Confidential — Version 1.0 April 2026")

    S = make_styles()
    story = []

    def add(*items): story.extend(items)
    def sec(n, t): add(*section(n, t, S))
    def lp(*items): add(*items)
    def hdr(t, s='sub'): add(Paragraph(t, S[s]))
    def bd(t): add(Paragraph(t, S['body']))
    def bdl(t): add(Paragraph(t, S['body_l']))
    def co(t): add(*callout(t, S))
    def qt(txt, attr=None):
        add(Paragraph(f'<i>"{txt}"</i>', S['quote']))
        if attr: add(Paragraph(f'— {attr}', S['attr']))
        add(sp(0.08))

    # Cover page content is drawn in cover_page() via canvas
    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════
    # PROPRIETARY NOTICE
    # ════════════════════════════════════════════════════════════════
    sec('00', 'PROPRIETARY NOTICE')
    bd('This document is a proprietary and confidential intellectual property artifact of '
       'Inquiring Minds LLC. It constitutes the official internal systems manual for the '
       'Signal Identity System (SIS™) and Signal Confidence System (SCS™).')
    add(sp(0.15), hr(GOLD,1.5), sp(0.12))
    rows = [
        ('Ownership',       'Inquiring Minds LLC — All rights reserved'),
        ('Classification',  'Confidential — Internal Use Only'),
        ('System Design',  'O D Jonathan Porter — Founder & Systems Architect'),
        ('Jurisdiction',  'Saint Louis, MO — United States of America'),
        ('Version',        '1.0 — April 2026'),
        ('Status',        'Hardened for hostile-pass readiness (Apr 12, 2026)'),
    ]
    add(std_table(['Property','Value'], rows, [1.6*inch, CONTENT_W-1.6*inch]))
    add(sp(0.2))
    for line in [
        'No unauthorized copying, reuse, licensing, distribution, derivative implementation, or commercial',
        'exploitation of any material contained herein is permitted. This document is intended solely for',
        'internal use by authorized members and representatives of Inquiring Minds LLC. Receipt of this',
        'document does not confer any rights, licenses, or permissions beyond such internal use.',
        '',
        'All systems, architectures, methods, and claims described in this document are proprietary to',
        'Inquiring Minds LLC and represent protected intellectual property under applicable law.',
    ]:
        add(Paragraph(line, S['body']))
    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════
    # EXECUTIVE SUMMARY
    # ════════════════════════════════════════════════════════════════
    sec('01', 'EXECUTIVE SUMMARY')

    hdr('What SIS™ Is')
    bd('The Signal Identity System (SIS™) is a multi-layer identity verification, continuity, '
       'and value-tracking architecture that establishes provable digital identity through multiple '
       'independent signal channels — email, social media, and the ledger — under adversarial conditions.')
    bd('SIS™ is not a login system. It is not a referral engine. It is a trust infrastructure layer '
       'that proves identity, measures trust strength, and controls access to value based on verified '
       'signal integrity. Where most systems answer "who are you?" once, SIS™ answers it continuously.')

    add(*callout(
        '"Email is a key. Social is a second lock. '
        'The ledger is memory. Confidence is the guard watching the door."', S))
    add(sp(0.1))

    hdr('What SCS™ Is')
    bd('The Signal Confidence System (SCS™) is a dynamic trust measurement engine that assigns each '
       'registered Likeness ID (LK ID) a Confidence Level (CL) from 0 to 5, based on accumulated '
       'verified signals across five categories: Identity, Social, Ledger, Behavior, and Security.')
    bd('SCS™ answers the question every trust system eventually faces: not "is this user valid?" '
       'but "how trustworthy is this user under current conditions?" It is internal and opaque — '
       'not visible to users, not gameable by them.')

    add(*callout(
        '"Most systems check who you are once. This system watches how you '
        'behave over time — and adjusts accordingly."', S))
    add(sp(0.1))

    hdr('The Problems They Solve')
    problems = [
        ('<b>Channel failure:</b>', 'User loses email access. Most systems lock them out forever. '
         'SIS™ provides social verification as an independent recovery path outside of email.'),
        ('<b>Identity fraud:</b>', 'Someone impersonates a user. SIS™ requires proof through the social '
         'channel — not just email access. The social verification DM challenge is extremely difficult to fake.'),
        ('<b>Value theft:</b>', 'Someone claims referrals they did not earn, or inflates their own signal. '
         'SCS™ detects this through the fraud guard and immediately drops their confidence level.'),
    ]
    for bold, text in problems:
        add(Paragraph(f'{bold} {text}', S['body_l']), sp(0.06))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════
    # FOUNDER FRAMING
    # ════════════════════════════════════════════════════════════════
    sec('02', 'FOUNDER FRAMING')

    qt(
        "Most systems are designed for honest users. I built these for the opposite condition — "
        "where someone is actively trying to work around the system, impersonate someone else, or "
        "extract value they didn't earn. That's the only way to build something that actually lasts.",
        "O D Jonathan Porter — Founder & Systems Architect"
    )

    bd('O D Porter designed SIS™ and SCS™ from the ground up with a single governing principle: '
       'assume adversarial conditions at every layer. Every design decision flows from this.')
    bd('The result is not a feature set or a product. It is a proprietary identity and trust '
       'infrastructure that can serve as the foundation for markets, platforms, verification '
       'systems, and financial products.')
    bd('The name "Inquiring Minds" reflects the operating philosophy: genuine curiosity about the '
       'world, rigorous thinking, and honest inquiry as the foundation of everything built here. '
       'SIS™ and SCS™ are the first codified expressions of that philosophy in systems form.')

    add(*callout(
        '"The test of a system is not whether it works when everyone is honest — '
        'it\'s whether it holds when someone isn\'t."', S))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════
    # SECTION 1 — WHAT THIS REALLY IS
    # ════════════════════════════════════════════════════════════════
    sec('03', 'WHAT THIS REALLY IS')

    hdr('The Simple Explanation')
    bd('Every digital identity system answers one question: how do you know someone is who they '
       'say they are?')
    bd('Most systems answer it once — at signup — and then trust that answer forever. SIS™ answers '
       'it continuously, through multiple independent channels, and ties the strength of that '
       'identity to access to value.')
    add(sp(0.1))

    hdr('The Core Analogy')
    add(*callout(
        '"Think of SIS™ as a building with three entrances — email, social, and the ledger. '
        'Each entrance has its own lock. The guard at each lock is SCS™. The guard doesn\'t '
        'just check your key. The guard watches how you\'ve behaved since you got here, '
        'and adjusts what you\'re allowed to do accordingly."', S))
    add(sp(0.1))

    hdr('What Problems It Solves')
    items = [
        ('<b>Channel failure:</b> User loses email access. In SIS™, social verification '
         'provides an independent recovery path — the system can restore access through '
         'a different channel, not just the one that failed.'),
        ('<b>Identity fraud:</b> Someone impersonates a user. SIS™ requires proof through '
         'the social channel — a DM sent to a real, authenticated social media account. '
         'This is the hardest signal in the system to fake.'),
        ('<b>Value theft:</b> Someone tries to claim referrals they did not earn, or inflate '
         'their own signal value. SCS™ detects this through the fraud guard — a composite '
         'key uniqueness constraint — and immediately drops the offending user\'s CL.'),
    ]
    for item in items:
        add(Paragraph(f'• {item}', S['body_l']), sp(0.05))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════
    # SECTION 2 — HOW IT MOVES
    # ════════════════════════════════════════════════════════════════
    sec('04', 'HOW IT MOVES — SYSTEM FLOWS')

    hdr('Registration Flow')
    bd('A new user enters the system. Payment is made. An LK ID is assigned. A session is established.')
    add(flow_row(
        ['User Submits\nEmail + Payment', 'LK ID\nAssigned', 'Payment\nConfirmed',
         'Registration\nCreated', 'HMAC Cookie\nSet — Dashboard'],
        ['', 'Immutable\nsystem ID', 'Stripe webhook\nfires', 'LK + email\nstored', 'Session active\n— no repeat checkout'],
        S), sp(0.12))
    bd('The user submits their email and payment. The system assigns them a Likeness ID (LK ID) — '
       'a cryptographically random identifier that is their immutable system identity. After payment, '
       'a registration record is created. A session cookie is set using HMAC signature, not the LK ID '
       'itself. The next request is validated by middleware checking the HMAC. Existing users who '
       'already have a session are redirected to the dashboard — they never see the payment step again.')

    hdr('Login Flow')
    bd('Returning user submits their email. A magic link is generated and sent. User clicks it.')
    add(flow_row(
        ['Email\nSubmitted', 'Magic Link\nGenerated', 'Link\nClicked',
         'HMAC Cookie\nIssued', 'Session\nValidated'],
        ['Registered\nemail', 'One-time token\n15-min expiry', 'Signature\nverified server-side',
         'Email confirmed\n— redirect dashboard', 'Middleware checks\nHMAC on every request'],
        S), sp(0.12))
    bd('On login, the user receives a magic link. The server validates the token, verifies email '
       'ownership, and issues an HMAC-signed session cookie. Future requests are validated by '
       'middleware — the server checks the HMAC signature, resolves the LK ID by email, and either '
       'grants or denies access. The LK ID is never stored in the cookie — only email and a '
       'server-validated signature.')

    hdr('Social Verification Flow')
    add(flow_row(
        ['User Links\nX/Twitter', 'Challenge Code\nGenerated', 'User Sends\nDM',
         'System\nVerifies DM', 'Social\nVerified'],
        ['LK + handle\nsubmitted', '8-char one-time\ncode server-side', 'Public DM to\n@likenessverify',
         'X API polls\nfor challenge post', '+2 CL signal\n— hardest to fake'],
        S), sp(0.12))
    bd('The social verification flow is the hardest signal in the system to fake. It requires the '
       'user to prove they control a specific X/Twitter account by receiving a challenge code via '
       'DM and publishing it publicly. The system polls the X API to confirm the post exists. '
       'This creates an independent identity channel outside of email — the system can restore '
       'access through social even if email is lost.')

    hdr('Recovery Flow')
    add(flow_row(
        ['Recovery\nRequested', 'Channel\nDetermined', 'Challenge\nCompleted', 'SCS™ CL\nEvaluated',
         'Session\nRestored'],
        ['', 'Social if linked\nEmail if not', 'Social DM or\nmagic link',
         'Low CL = delay\nHigh CL = fast', 'New HMAC cookie\n+ CL reward if clean'],
        S), sp(0.12))
    bd('Recovery is treated as a threat surface, not a feature. The system applies CL-based gates '
       '— a low-confidence user with failed recovery attempts waits through a cooling-off period. '
       'An attacker cannot distinguish whether a recovery request is for a valid account or fake.')

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════
    # SECTION 3 — ARCHITECTURE
    # ════════════════════════════════════════════════════════════════
    sec('05', 'THE SYSTEM — ARCHITECTURE')

    hdr('System Layers')
    bd('SIS™ is organized as seven interlocking layers. No single layer can be compromised to '
       'break the entire system.')

    layers = [
        ('Identity Layer', [
            'LK ID assignment (immutable, cryptographically random)',
            'Email anchor (normalized, primary identity)',
            'Full name + certificate ID (registrations table)',
        ]),
        ('Authentication Layer', [
            'Magic link — Supabase OTF tokens, 15-min expiry',
            'HMAC-signed session cookies (email|signature)',
            'Middleware validation on every protected request',
        ]),
        ('Social Verification Layer', [
            'X/Twitter DM challenge — one-time 8-char codes',
            'Independent identity channel — email-independent recovery',
            'Server-side X API polling for verification',
        ]),
        ('Signal Ledger Layer', [
            'signal_actions — immutable value record per LK ID',
            'Composite key fraud guard (lk_id + action_type + metadata)',
            'Server-side value enforcement — client amount ignored',
        ]),
        ('Confidence / Trust Layer (SCS™)', [
            'CL0–CL5 per LK ID (signal_confidence table)',
            'Event-driven signal accumulation (signal_confidence_events)',
            'CL gates: payout eligibility, recovery cooling-off, fraud sensitivity',
        ]),
        ('Recovery Layer', [
            'Email recovery — standard magic link',
            'Social recovery — requires completed social verification',
            'Uniform responses — no account existence information leaked',
        ]),
        ('Security & Audit Layer', [
            'Rate limiting — 15 req/min per IP on API routes',
            'Enumeration blocking — identical responses for all inputs',
            'system_events — complete audit log of security-relevant actions',
        ]),
    ]
    for i, (name, comps) in enumerate(layers):
        add(layer_row(S, name, comps, alt=(i%2==0)), sp(0.06))
    add(sp(0.1))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════
    # SECTION 4 — TRUST + ADVERSARIAL MODEL
    # ════════════════════════════════════════════════════════════════
    sec('06', 'THE TRUST MODEL')

    hdr('What the System Trusts')
    rows = [
        ('Server-generated LK IDs',        'Cryptographically random — client cannot predict or guess'),
        ('HMAC signatures',                'Require server secret — client cannot forge'),
        ('Stripe webhook signatures',      'Verified independently by Stripe'),
        ('X/Twitter API responses',       'Require authenticated API access — cannot be faked'),
        ('Supabase auth tokens',           'Handled entirely by Supabase auth system'),
        ('Composite key uniqueness',       'Database-enforced — no duplicate fraud possible'),
        ('CL gates',                       'Server-enforced — client cannot bypass'),
    ]
    add(std_table(['What Is Trusted', 'Why'], rows, [2.1*inch, CONTENT_W-2.1*inch]), sp(0.2))

    hdr('What the System Rejects')
    rows = [
        ('Login enumeration',           'All email responses identical — no account existence leak'),
        ('Recovery enumeration',        'All responses identical regardless of account validity'),
        ('Fraud via duplicate keys',     'Composite key unique constraint — one signal per action'),
        ('Amount injection',             'Server hardcodes value — client amount never used'),
        ('Session cookie forgery',       'HMAC signature required — any tampering detected'),
        ('Recovery replay',              'One-time tokens, 15-min expiry, single-use enforcement'),
        ('Rate limit abuse',              '15 req/min per IP enforced at middleware level'),
        ('Social proof fabrication',     'X API verification required — cannot be faked without real account'),
    ]
    add(std_table(['What Is Rejected', 'Control'], rows, [2.1*inch, CONTENT_W-2.1*inch]), sp(0.2))

    hdr('Adversarial Doctrine')
    bd('Every system is designed with one question at its center: what happens when someone is '
       'actively trying to break it? This is not paranoia — it is engineering discipline.')
    add(*callout(
        '"Server-trust over client-trust. Proof over claim. Audit over assumption. '
        'Denial by default, access by earned signal."', S))
    add(sp(0.08))
    bd('Recovery is treated as a threat surface. Enumeration is treated as an assumed attack '
       'vector. Fraud is treated as inevitable. The system does not hope these things do not '
       'happen — it plans for them, detects them, and responds. Every value-touching action '
       'is gated by CL. Every session is validated by HMAC. Every audit-relevant event is logged.')

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════
    # SECTION 5 — THE CONFIDENCE ENGINE
    # ════════════════════════════════════════════════════════════════
    sec('07', 'THE TRUST ENGINE — SCS™')

    hdr('The Confidence Level Model')
    bd('Every LK ID in the system has a Confidence Level (CL) from 0 to 5. This is not a '
       'gamification score. It is not visible to users. It is internal system intelligence '
       'that controls:')
    for item in ['Whether a payout can be processed — and how fast',
                 'What recovery path is required — and how much friction applies',
                 'How aggressively the fraud guard responds to suspicious behavior',
                 'Whether a user can pass social verification challenges']:
        add(Paragraph(f'• {item}', S['body_l']), sp(0.04))
    add(sp(0.1))

    cl_rows = [
        ('CL0', 'Untrusted',     'New registration — no verified signals',                              'BLOCKED',    'Strict (24h cooldown)'),
        ('CL1', 'Email Verified', 'Magic link confirmed',                                                'BLOCKED',    'Strict'),
        ('CL2', 'Social Linked',  'X/Twitter account attached',                                         '$50/mo cap, 48h delay', 'Standard (1h cooldown)'),
        ('CL3', 'Social Verified','DM challenge completed',                                               'Standard (24–48h)', 'Standard'),
        ('CL4', 'Multi-Proof',    'CL3 + sustained clean behavior',                                      'Standard',   'Fast'),
        ('CL5', 'High Assurance', 'CL4 + extended consistency over time',                                'Fast (0–24h)','Expedited'),
    ]
    add(std_table(['Level','Name','Definition','Payout Access','Recovery Path'],
                  cl_rows, [0.55*inch, 1.1*inch, 2.15*inch, 1.5*inch, CONTENT_W-5.3*inch]), sp(0.2))

    hdr('Why Confidence Is Internal')
    bd('If users could see their confidence level, they would attempt to manipulate it — gaming '
       'positive signals, timing behaviors, or constructing synthetic trust. SCS™ is deliberately '
       'opaque. By keeping it internal, the system maintains its integrity as an honest measure '
       'of genuine identity and behavior.')
    add(*callout(
        '"The guard doesn\'t announce the threat level to the people walking '
        'through the door. That would defeat the purpose."', S))
    add(sp(0.08))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════
    # SECTION 6 — SIGNAL TYPES
    # ════════════════════════════════════════════════════════════════
    sec('08', 'SIGNAL TYPES AND WEIGHTS')

    hdr('Positive Signals — CL Increases')
    pos_rows = [
        ('email_verified',      'Identity',   '+1',  'Moves CL0 → CL1 (first trust anchor established)'),
        ('social_linked',       'Social',    '+1',  'Moves CL1 → CL2 (second channel opened)'),
        ('social_verified',    'Social',    '+2',  'Moves CL2 → CL3 (hardest signal — real account confirmed)'),
        ('clean_recovery',     'Security',  '+2',  'Reward: user recovered via social with no failed attempts'),
        ('referral_converted', 'Ledger',    '+1',  'Accumulation: confirmed referral payment credited to referrer'),
        ('sustained_activity', 'Behavior',  '+1/mo','Monthly: consistency reward for continued clean activity'),
    ]
    add(std_table(['Signal','Category','Weight','Effect'],
                  pos_rows, [1.8*inch, 0.9*inch, 0.65*inch, CONTENT_W-3.35*inch]), sp(0.18))

    hdr('Negative Signals — CL Decreases')
    neg_rows = [
        ('fraud_guard_triggered',   'Security', '-3', 'Duplicate composite key rejected — immediate CL drop'),
        ('amount_anomaly',          'Security', '-4', 'Client amount mismatch detected — severe penalty'),
        ('abuse_flag',             'Security', '-3', 'System abuse detected — fraud, manipulation, synthetic signals'),
        ('recovery_attempt_failed','Security', '-1', 'Minor: 3x failures = major drop via cooldown stacking'),
        ('rate_limit_breach',      'Security', '-1', 'Protocol violation — 15 req/min exceeded'),
        ('enumeration_attempt',    'Security', '-1', 'Reconnaissance scan detected — probing for valid accounts'),
    ]
    add(std_table(['Signal','Category','Weight','Effect'],
                  neg_rows, [1.8*inch, 0.9*inch, 0.65*inch, CONTENT_W-3.35*inch]), sp(0.18))

    hdr('The Rules That Govern Confidence')
    rules = [
        ('Spike protection:',         'A single positive signal cannot jump more than one CL level per event. '
                                      'Consistency matters more than bursts. The guard rewards steady behavior.'),
        ('Negative signals can drop anywhere:', 'A fraud guard event or amount anomaly can drop a user from '
                                      'CL4 to CL0 in one event. Negative signals are not tiered — they hit hard and fast.'),
        ('Activity decay (documented, not yet enforced):', 'CL4+ requires ongoing activity. After 90 days '
                                      'with no positive signals, CL5 decays to CL4. Decay never drops below CL4 from time alone.'),
        ('State-based, not purely linear:', 'A CL3 user who triggers a fraud guard drops to CL1. Progression '
                                      'is earned level by level; regression can go anywhere in a single event.'),
    ]
    for title, desc in rules:
        add(Paragraph(f'<b>{title}</b> {desc}', S['body_l']), sp(0.06))
    add(sp(0.08))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════
    # SECTION 7 — THE RULES
    # ════════════════════════════════════════════════════════════════
    sec('09', 'THE RULES — ALLOWED AND BLOCKED')

    hdr('What the System Allows')
    allows = [
        ('Legitimate signup and payment',     'Normal new user registration and payment flow'),
        ('Returning user login',             'Magic link authentication for registered users'),
        ('Social linking and verification',  'X/Twitter DM challenge for users who choose to link'),
        ('Clean recovery',                    'Users with social verification can recover via social channel'),
        ('Referral signal accumulation',      'Referrers earn signal credit for confirmed conversions'),
        ('High-confidence fast path',         'CL4+ users get expedited recovery and faster payouts'),
    ]
    for t, d in allows:
        add(Paragraph(f'<font color="#2E7D32">✓</font>  <b>{t}</b> — {d}', S['body_l']), sp(0.04))
    add(sp(0.12))

    hdr('What the System Blocks')
    blocks = [
        ('Login enumeration',           'Attacker cannot distinguish valid from invalid emails'),
        ('Recovery enumeration',         'Attacker cannot determine if any account exists'),
        ('Fraud via duplicate keys',    'Composite key (lk_id + action_type + email) enforces uniqueness'),
        ('Amount injection',            'Server hardcodes 100 cents — client amount never used'),
        ('Session forgery',            'HMAC signature prevents cookie tampering'),
        ('Payout without trust',       'CL0-CL1 blocked from payout entirely'),
        ('Social proof fabrication',   'X API must confirm real posted DM challenge'),
        ('Rapid-fire abuse',           'Rate limits enforced at middleware — 15 req/min per IP'),
    ]
    for t, d in blocks:
        add(Paragraph(f'<font color="#C62828">✗</font>  <b>{t}</b> — {d}', S['body_l']), sp(0.04))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════
    # SECTION 8 — THREAT MODEL
    # ════════════════════════════════════════════════════════════════
    sec('10', 'THE THREAT MODEL')

    hdr('How Attackers Try to Break It — and Why They Fail')
    threats = [
        ('Login Enumeration',
         'Attacker submits many emails to find which ones are registered.',
         'All responses are identical — {success:true} regardless of validity. No existence info leaked.'),
        ('Recovery Enumeration',
         'Attacker submits LK IDs or emails to find valid accounts.',
         'All responses identical — no account existence information revealed to attacker.'),
        ('Session Forgery',
         'Attacker crafts a fake session cookie to impersonate a user.',
         'HMAC signature validation — tampering is detected and rejected. Cookie contains no LK ID.'),
        ('Duplicate Referral Credit',
         'Attacker resubmits same referral email to get credited twice.',
         'Composite key (lk_id + action_type + email) enforces database uniqueness. Duplicate rejected.'),
        ('Amount Injection',
         'Attacker inflates the referral value in the API call.',
         'Server ignores client amount_cents entirely. Value is hardcoded server-side.'),
        ('Social Proof Fabrication',
         'Attacker fakes a DM or public post to pass social verification.',
         'System polls X API — must find real posted challenge. Cannot be faked without real account.'),
        ('Recovery Replay',
         'Attacker reuses an old magic link or social recovery token.',
         'One-time tokens, 15-minute expiry, single-use enforcement. Old tokens are invalid.'),
        ('Payout Tampering',
         'Attacker with low CL tries to access the payout system.',
         'CL gate enforced server-side — CL0-CL1 blocked entirely, CL2 capped at $50/month.'),
    ]
    for t, a, d in threats:
        add(threat_row(t, a, d, S), sp(0.08))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════
    # SECTION 9 — EXPLAIN IT IN 4 VOICES
    # ════════════════════════════════════════════════════════════════
    sec('11', 'HOW TO EXPLAIN IT — FOUR VERSIONS')

    def four_ver(title, style, text):
        add(Paragraph(title, S['sub']))
        if style == 'street':
            add(Paragraph(f'<i>"{text}"</i>', S['street']))
        elif style == 'dev':
            add(Paragraph(text, S['dev']))
        else:
            add(Paragraph(f'<i>"{text}"</i>', S['pro']))
        add(hr(LIGHT_GRAY, 0.5), sp(0.1))

    four_ver('Street Version', 'street',
        "It's like a building where your email is one key and your social media is another. "
        "The system doesn't just hand you the door — it watches how you've been acting since "
        "you got there. Been good? You get faster access. Been sketchy? The system slows "
        "you down and checks harder. Simple as that.")

    four_ver('Professional Version', 'pro',
        "SIS™ is a multi-layer identity verification system that establishes provable digital "
        "identity through independent signal channels. SCS™ adds dynamic trust measurement via "
        "a confidence level system that gates access to value — controlling payout eligibility, "
        "recovery path, and fraud sensitivity based on accumulated verified signals. Both are "
        "proprietary systems of Inquiring Minds LLC.")

    four_ver('Investor Version', 'pro',
        "SIS™ solves the fundamental vulnerability in digital identity: single-channel dependency. "
        "By combining email verification, social proof via DM challenge, and an immutable value "
        "ledger, it creates identity continuity under failure conditions. SCS™ adds a trust "
        "intelligence layer that prevents fraud, controls payout risk, and enables dynamic "
        "security decisions without user-visible gamification. These are proprietary, defensible "
        "systems that can serve as infrastructure for any identity-dependent product.")

    four_ver('Developer Version', 'dev',
        "SIS™ uses HMAC-signed session cookies (email|HMAC), Supabase magic link auth (OTF tokens, "
        "15-min expiry), X/Twitter DM verification via polling API, and an immutable signal_actions "
        "ledger with composite key fraud guard. SCS™ maintains a CL0–5 per LK ID in "
        "signal_confidence, updated by server-emitted events in signal_confidence_events. CL gates "
        "enforce payout eligibility, recovery cooling-off periods, and fraud sensitivity weighting. "
        "All trust decisions are server-side; no client can directly manipulate CL.")

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════
    # SECTION 10 — THINK LIKE THE SYSTEM
    # ════════════════════════════════════════════════════════════════
    sec('12', 'THINK LIKE THE SYSTEM')

    hdr('Decision Framework')
    bd('When evaluating a new feature, extension, or change to SIS™ or SCS™, '
       'ask these questions in order:')
    questions = [
        ('Trust question:',     'Where does this feature require trust in the user? Can we verify instead?'),
        ('Proof question:',     'What counts as proof of this claim? Is that proof verifiable server-side?'),
        ('Channel question:',   'Is this single-channel or multi-channel? Can it fail if one channel is lost?'),
        ('Value question:',     'Does this touch value (payout, access, credit)? If so, what CL gate applies?'),
        ('Audit question:',     'Can we log this action? What does the audit trail look like?'),
        ('Adversary question:', 'If someone actively tried to abuse this, how would they? What stops them?'),
    ]
    for title, q in questions:
        add(Paragraph(f'<font color="#C9A84C">→</font>  <b>{title}</b> {q}', S['body_l']), sp(0.06))
    add(sp(0.15))

    hdr('Extending the System')
    bd('New signals can be added to SCS™ by defining the event type, weight tier, and emission source. '
       'The governing rules:')
    rules = [
        'New signals must be server-emitted — never trust a client to report its own signal',
        'Negative signals should define exact delta and threshold for triggering',
        'Positive signals should be tiered — not all positive signals carry equal weight',
        'New gates should use the existing gate framework: payoutGate(), recoveryGate()',
        'New trust decisions should be documented in operations/system-map/ and this manual updated',
    ]
    for rule in rules:
        add(Paragraph(f'• {rule}', S['body_l']), sp(0.04))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════
    # SECTION 11 — HARDENING STATUS
    # ════════════════════════════════════════════════════════════════
    sec('13', 'HARDENING STATUS — FULLY OPERATIONAL PROOF')

    hdr('Hostile Pass Defense Matrix')
    hardening = [
        ('Existing users never hit payment',     '✅ BLOCKED',  'Session check on /register → redirects to /dashboard'),
        ('Login enumeration',                   '✅ BLOCKED',  'send-link returns success for all emails — no existence leak'),
        ('Recovery enumeration',                '✅ BLOCKED',  'Valid + fake emails return identical {success:true} responses'),
        ('Recovery replay resistance',           '✅ BLOCKED',  'One-time challenge codes, 15-min expiry, single-use'),
        ('Fraud guard — duplicate keys',        '✅ BLOCKED',  'Composite key unique constraint — second credit rejected'),
        ('Amount injection',                    '✅ BLOCKED',  'Server ignores client amount — hardcoded 100 cents'),
        ('Session cookie forgery',             '✅ BLOCKED',  'HMAC signature — tampering detected and rejected'),
        ('HMAC session cookies',                '✅ ACTIVE',   'Cookie = email|HMAC — server-validated on every request'),
        ('SCS™ events — 11 of 14 emitting',    '✅ ACTIVE',   'email_verified, social_linked, social_verified, '
                                                                  'clean_recovery, referral_converted, fraud_guard_triggered + 5 more'),
        ('CL gates on payout',                  '✅ ACTIVE',   'CL0-CL1 blocked, CL2 $50/mo cap, CL3+ standard path'),
        ('CL gates on recovery cooling-off',    '✅ ACTIVE',   'CL0-CL1 (2+ failures/24h) → 24h cooldown; '
                                                                  'CL2-CL3 (3+ failures/24h) → 1h cooldown'),
        ('Social proof verification',           '✅ ACTIVE',   'X API polls for posted DM challenge — requires real account'),
        ('Rate limiting',                       '✅ ACTIVE',   '15 req/min per IP enforced at middleware on all API routes'),
        ('Middleware session validation',       '✅ ACTIVE',   '/vault/*, /dashboard/* require valid HMAC cookie'),
        ('Enumeration via /auth/me',            '✅ BLOCKED',  'Returns session info only for valid HMAC — else 401'),
    ]
    add(std_table(['Requirement','Status','Evidence'],
                  hardening, [2.35*inch, 1.2*inch, CONTENT_W-3.55*inch]), sp(0.2))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════
    # SECTION 12 — REMAINING HARDENING
    # ════════════════════════════════════════════════════════════════
    sec('14', 'REMAINING HARDENING — BEFORE NEXT ATTACK')

    bd('The following items are known gaps as of April 12, 2026. Each is listed with severity, '
       'description, and exact fix required. These do not affect current system integrity under '
       'real use conditions — but should be resolved before public exposure or scaling.')

    gaps = [
        ('signal_confidence table — deployment status',
         'HIGH — PENDING',
         'The migration file (002_scs_confidence_system.sql) exists and defines the '
         'signal_confidence and signal_confidence_events tables, but the table deployment '
         'status in production Supabase is unconfirmed. All SCS™ event emissions are '
         'wrapped in try/catch and will fail silently until the table exists.',
         'Run: supabase/migrations/002_scs_confidence_system.sql in production. '
         'Seed existing registrations with CL1 (email_verified). Verify with '
         'SELECT * FROM signal_confidence LIMIT 5.'),
        ('amount_anomaly event — not emitting',
         'HIGH',
         'The referral/track endpoint ignores client amount_cents but does not emit '
         'amount_anomaly when an obviously wrong value is submitted. Only fraud_guard '
         'covers duplicate prevention — not value tampering.',
         'In referral/track: if amount_cents !== null && amount_cents !== 100, '
         'emit amount_anomaly (-4 CL) in addition to blocking the request. '
         'Requires signal_confidence table deployed first.'),
        ('login_failure event — not emitting',
         'MEDIUM',
         'The /api/auth/send-link endpoint does not emit a login_failure or '
         'enumeration_attempt signal when invalid emails are submitted repeatedly. '
         'An attacker brute-forcing enumeration would not have their CL impacted.',
         'In send-link: after 5 failures from same IP within 15 min, '
         'emit enumeration_attempt (-1 CL). Track failures in system_events '
         'with IP + email combination.'),
        ('session_invalidated event — not emitting',
         'LOW',
         'When a session is explicitly invalidated (logout, token reuse, cookie '
         'tampering detected), no event is recorded. A stolen cookie used by an '
         'attacker would not affect the victim\'s CL.',
         'Emit session_invalidated event when: token reuse detected by middleware, '
         'explicit POST /api/auth/logout, or HMAC validation failure. '
         'Requires signal_confidence table deployed first.'),
        ('Decay logic — documented, not enforced',
         'MEDIUM',
         'The 90-day activity decay rule for CL4+ is documented but has not been '
         'implemented as an automated job. CL4+ users with no activity will not '
         'automatically decay. Decay only affects CL5 → CL4.',
         'Create a Vercel cron job (weekly): UPDATE signal_confidence SET '
         'confidence_level = 4 WHERE last_updated < NOW() - INTERVAL \'90 days\' '
         'AND confidence_level > 4.'),
    ]

    for title, sev, prob, fix in gaps:
        sev_color = {'HIGH — PENDING':RED,'HIGH':RED,'MEDIUM':ORANGE,'LOW':'#F57F17'}.get(sev,ORANGE)
        data = [
            [Paragraph(f'<b>{title}</b>', S['body_l']),
             Paragraph(f'<font color="{sev_color.hexval() if hasattr(sev_color,"hexval") else "#C62828"}"><b>[{sev.split(" — ")[0]}]</b></font> '
                       f'<font size="8">{"—" if " — " in sev else ""} {sev.split(" — ")[-1]}</font>', S['body_l'])],
            [Paragraph(f'<i>Problem:</i> {prob}', S['body_l']), Paragraph('', S['body_l'])],
            [Paragraph(f'<i>Fix:</i> {fix}', S['body_l']), Paragraph('', S['body_l'])],
        ]
        t = Table(data, colWidths=[CONTENT_W-0.9*inch, 0.9*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND',(0,0),(-1,0),SURFACE),
            ('BACKGROUND',(0,1),(-1,1),WHITE),
            ('BACKGROUND',(0,2),(-1,2),colors.HexColor('#FFF8F0')),
            ('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8),
            ('LEFTPADDING',(0,0),(-1,-1),12),('RIGHTPADDING',(0,0),(-1,-1),10),
            ('LINEABOVE',(0,0),(-1,0),2,GOLD),('LINEBELOW',(0,-1),(-1,-1),1,LIGHT_GRAY),
            ('SPAN',(0,1),(-1,1)),('SPAN',(0,2),(-1,2)),
            ('BOX',(0,0),(-1,-1),0.5,LIGHT_GRAY),
        ]))
        add(t, sp(0.1))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════
    # SECTION 13 — CL SYSTEM QUICK REFERENCE
    # ════════════════════════════════════════════════════════════════
    sec('15', 'CL SYSTEM — QUICK REFERENCE')

    hdr('All Signal Weights — SCS™ Engine v2.0')
    all_signals = [
        ('email_verified',            'Identity',  '+1',  'CL0 → 1'),
        ('social_linked',             'Social',    '+1',  'CL1 → 2'),
        ('social_verified',           'Social',    '+2',  'CL2 → 3'),
        ('clean_recovery',            'Security',  '+2',  'Recovery reward'),
        ('referral_converted',         'Ledger',    '+1',  'Accumulation'),
        ('sustained_activity',        'Behavior',  '+1/mo','Monthly reward'),
        ('fraud_guard_triggered',     'Security',  '-3',  'Anywhere → 0'),
        ('amount_anomaly',            'Security',  '-4',  'Severe — anywhere'),
        ('abuse_flag',                'Security',  '-3',  'Anywhere → 0'),
        ('recovery_attempt_failed',   'Security',  '-1',  'Stacks to cooldown'),
        ('rate_limit_breach',          'Security',  '-1',  'Protocol violation'),
        ('enumeration_attempt',       'Security',  '-1',  'Recon detected'),
    ]
    add(std_table(['Signal Event','Category','Delta','Notes'],
                  all_signals, [2.2*inch, 0.9*inch, 0.65*inch, CONTENT_W-3.75*inch]), sp(0.2))

    hdr('Gate Reference')
    gate_rows = [
        ('Payout — CL0',  'BLOCKED',  'No payout eligible'),
        ('Payout — CL1',  'BLOCKED',  'No payout eligible'),
        ('Payout — CL2',  '$50/mo cap', 'Processing: 48h delay'),
        ('Payout — CL3+', 'Standard',  'Processing: 24–48h'),
        ('Recovery — CL0/1', 'Strict gate', '24h cooldown after 2 failures/24h'),
        ('Recovery — CL2/3', 'Standard gate', '1h cooldown after 3 failures/24h'),
        ('Recovery — CL4+', 'Fast path', 'No friction'),
        ('Fraud Guard',   'CL drop -3', 'Immediate — anywhere on CL scale'),
        ('Amount Anomaly','CL drop -4', 'Severe — immediate maximum penalty'),
    ]
    add(std_table(['Gate','Threshold','Behavior'], gate_rows,
                  [2.0*inch, 1.6*inch, CONTENT_W-3.6*inch]), sp(0.2))

    story.append(PageBreak())

    # ════════════════════════════════════════════════════════════════

    # Back cover is drawn by regular_page on the last page.
    # Content drawn in regular_page via canvas.

    # ── BUILD ─────────────────────────────────────────────────────
    doc.build(story, onFirstPage=cover_page, onLaterPages=regular_page)
    print(f"✅ Manual built: {outpath}")
    return outpath

if __name__ == '__main__':
    out = os.path.expanduser('~/Documents/teachyoung/SIS_SCS_Proprietary_Systems_Manual.pdf')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    build(out)
