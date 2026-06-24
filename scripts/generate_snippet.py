from pathlib import Path
import json
import random
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parent.parent
SOURCE_FILES = [
    BASE_DIR / 'marketing' / 'social-captions.md',
    BASE_DIR / 'marketing' / 'ad-copy.md',
]
OUT_DIR = BASE_DIR / 'marketing' / 'auto'
OUT_DIR.mkdir(parents=True, exist_ok=True)

today = datetime.now().strftime('%Y-%m-%d')

chunks = []
for path in SOURCE_FILES:
    text = path.read_text(encoding='utf-8')
    for line in text.splitlines():
        line = line.strip()
        if line.startswith('#'):
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

short = [c for c in chunks if len(c) <= 120]

if not short:
    short = chunks

picked = random.sample(short, k=min(len(short), 5))

out_text = f"# No-Gym 30 — Daily Snippet ({today})\n\n"
for i, line in enumerate(picked, start=1):
    out_text += f"{i}. {line}\n"

(OUT_DIR / 'daily_snippet.md').write_text(out_text, encoding='utf-8')

payload = {
  'date': today,
  'snippets': picked,
  'cta': 'Start Now →',
  'link': 'https://nogym30.netlify.app/',
  'price': '$17 launch'
}
(OUT_DIR / 'daily_drafts.json').write_text(json.dumps(payload, indent=2), encoding='utf-8')

print(f"Generated {len(picked)} snippet(s) for {today}")
