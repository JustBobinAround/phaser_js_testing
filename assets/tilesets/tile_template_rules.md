# Tile Template Rules

- Each tile is 64x64 pixels
- The black sections of the template are what should be "filled in"
- Each "connecting edge center" of a tile will be at the 32 pixel mark
- Each connecting edge should overfill by **exactly** 2 solid pixels past the 32 pixel mark.

### Start with template
![template_tile_example](/assets/tilesets/tile_template.png)
### Fill with pattern
![template_tile_example](/assets/tilesets/dirt.png)
### At the connection between two tiles, make sure each tile over extends by 2 pixels
![template_tile_example](/assets/tilesets/template_tile_example.png)
