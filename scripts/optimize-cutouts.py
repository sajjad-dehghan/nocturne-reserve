from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
originals = root / 'design' / 'assets'
originals.mkdir(parents=True, exist_ok=True)
for source in (root / 'public' / 'assets').glob('product-*.png'):
    Image.open(source).save(source.with_suffix('.webp'), quality=96, method=6)
    source.replace(originals / source.name)
