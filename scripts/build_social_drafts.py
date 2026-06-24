from pathlib import Path
from datetime import datetime, timedelta
import json, random

BASE_DIR = Path(__file__).resolve().parent.parent
SOURCE_FILES = [
    BASE_DIR / 'marketing' / 'social-captions.md',
    BASE_DIR / 'marketing' / 'ad-copy.md',
]
OUT_DIR = BASE_DIR / 'marketing' / 'auto'
OUT_DIR.mkdir(parents=True, exist_ok=True)

today = datetime.now().date()

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
for i in range(14):
    d = today + timedelta(days=i)
    picks = random.sample(chunks, k=min(len(chunks), 3))
    days.append({
      'date': d.isoformat(),
      'posts': [
        {
          'platform': random.choice(['facebook', 'facebook', 'instagram', 'x', 'linkedin']),
          'text': p,
          'link': 'https://nogym30.netlify.app/',
          'schedule': '08:00',
          'cta': 'Start Now →',
          'price': '$17 launch'
        }
        for p in picks
      ]
    })

(OUT_DIR / 'daily_drafts.json').write_text(json.dumps({'generated_for': today.isoformat(), 'days': days}, indent=2), encoding='utf-8')
print(f"Built 14-day draft queue ({today})")
