from pathlib import Path
import json, sys, random
from datetime import datetime, timedelta

BASE_DIR = Path(__file__).resolve().parent.parent
SOURCE_FILES = [
    BASE_DIR / 'marketing' / 'social-captions.md',
    BASE_DIR / 'marketing' / 'ad-copy.md',
    BASE_DIR / 'marketing' / 'fb-calendar-2week.md',
]
OUT_DIR = BASE_DIR / 'marketing' / 'fb'
OUT_DIR.mkdir(parents=True, exist_ok=True)

week_offset = int(sys.argv[1]) if len(sys.argv) > 1 else 0
today = datetime.now().date() + timedelta(weeks=week_offset)
week_start = today - timedelta(days=today.weekday())  # Monday

chunks = []
for path in SOURCE_FILES:
    text = path.read_text(encoding='utf-8')
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith('#'):
            continue
        if line.startswith('-') or line.startswith('*'):
            line = line.lstrip('-*').strip()
        if not line:
            continue
        if any(bad in line.lower() for bad in ['goldmine', 'dive into', 'boost', 'unlock', 'unleash']):
            continue
        if len(line) > 280:
            line = line[:277] + '...'
        chunks.append(line)

chunks = list(dict.fromkeys(chunks))

days = []
for i in range(7):
    d = week_start + timedelta(days=i)
    day_name = d.strftime('%A')
    time_slots = ['08:00', '12:00', '18:00']
    posts = []
    used = set()
    for slot in time_slots:
        pool = [c for c in chunks if c not in used]
        if not pool:
            pool = chunks
        text = random.choice(pool)
        used.add(text)
        posts.append({
          'platform': 'facebook',
          'day': day_name,
          'date': d.isoformat(),
          'time': slot,
          'text': text,
          'link': 'https://nogym30.netlify.app/',
          'cta': 'Start Now →',
          'price': '$17 launch'
        })
    days.append({'date': d.isoformat(), 'day': day_name, 'posts': posts})

payload = {
  'generated_at': datetime.now().isoformat(),
  'week_of': week_start.isoformat(),
  'brand': 'No-Gym 30',
  'link': 'https://nogym30.netlify.app/',
  'checkout': 'https://www.paypal.com/ncp/payment/SZ6G72LDYJDAL',
  'days': days,
}

out_path = OUT_DIR / f'schedule-{week_start.isoformat()}.json'
out_path.write_text(json.dumps(payload, indent=2), encoding='utf-8')
print(f"Wrote {out_path}")
