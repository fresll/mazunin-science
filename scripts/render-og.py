"""Render the composed SVG to an optimized RGB PNG using CairoSVG and Pillow."""
import io
import sys
import cairosvg
from PIL import Image

png = cairosvg.svg2png(url=sys.argv[1], output_width=1200, output_height=630)
with Image.open(io.BytesIO(png)) as image:
    image.convert('RGB').save(sys.argv[2], 'PNG', optimize=True)
