import { Scene } from 'phaser';

function to_icardinal(c) {
    return {
        'N': 0,
        'E': 1,
        'S': 2,
        'W': 3
    }[c];
}
function from_icardinal(i) {
    return [
        'N',
        'E',
        'S',
        'W'
    ][i];
}

function to_str_cord(x,y) {
    return x.toString() + ':' + y.toString();
}

function from_str_cord(str_cord) {
    var cords = str_cord.split(':');
    return cord(parseInt(cords[0]), parseInt(cords[1]));
}

function cord(x, y) {
    return {
        x: x,
        y: y,
        to_str_cord: function() {
            return this.x.toString() + ':' + this.y.toString();
        },
        delta: function(dx, dy) {
            return cord(this.x + dx, this.y + dy);
        }
    };
}


function rand_cardinal() {
    return from_icardinal(rand_int(4));
}

function rand_cord(w, h) {
    return cord(rand_int(w), rand_int(h));
}

function rand_int(length) {
  return Math.floor(Math.random() * length);
}

function random_ibool() {
    return Math.random() > 0.5 ? 1 : 0;
}

function is_bound(n, len) {
    return (n == 0) || (n == (len - 1));
}

function pre_gen_world(w, h) {
    var world = [];
    var unused = { };
    for(var j = 0; j < h; j++) {
        world.push([]);
        for(var i = 0; i < w; i++) {
            if(is_bound(j, h) || is_bound(i, w)) {
                world[j].push(1);
            } else {
                unused[to_str_cord(j,i)] = true;
                world[j].push(0);
            }
        }
    }

    return {
        world: world,
        unused: unused
    };    
}

function rand_wall() {
    var wall_type = rand_int(4);
    var wall_cardinal = rand_int(4);

    return [
        [
            [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
            [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
            [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
            [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
        ],
        [
            [
                [0, 1, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
            [
                [0, 0, 0],
                [0, 0, 1],
                [0, 0, 0]
            ],
            [
                [0, 0, 0],
                [1, 0, 0],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
        ],
        [
            [
                [0, 1, 0],
                [0, 0, 1],
                [0, 0, 0]
            ],
            [
                [0, 0, 0],
                [0, 0, 1],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 0, 0],
                [0, 1, 0]
            ],
            [
                [0, 1, 0],
                [1, 0, 0],
                [0, 0, 0]
            ],
        ],
        [
            [
                [0, 1, 0],
                [1, 0, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 0, 1],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 0, 1],
                [0, 1, 0]
            ],
            [
                [0, 1, 0],
                [1, 0, 0],
                [0, 1, 0]
            ],
        ]
    ][wall_type][wall_cardinal];
}

function remove_unused(unused, x, y) {
    var str_cord = to_str_cord(x, y);
    var was_unused = false;

    if(unused[str_cord]) {
        delete unused[str_cord];
        was_unused = true;
    }

    return was_unused;
}

function apply_wall_mask(unused, world, wall_mask, x, y) {
    world[y][x] |= wall_mask[1][1];
    remove_unused(unused, x, y);

    

    world[y - 1][x] |= wall_mask[0][1];
    remove_unused(unused, x, y - 1);
    world[y][x + 1] |= wall_mask[1][2];
    remove_unused(unused, x + 1, y);
    world[y + 1][x] |= wall_mask[2][1];
    remove_unused(unused, x, y + 1);
    world[y][x - 1] |= wall_mask[1][0];
    remove_unused(unused, x - 1, y);
}

function next_best_cord(unused, local_open, world, unused_cord) {
    if(world[unused_cord.y - 1][unused_cord.x] == 0) {
        local_open[unused_cord.delta(0, -1).to_str_cord()];
    }
    if(world[unused_cord.y][unused_cord.x + 1] == 0) {
        local_open[unused_cord.delta(1, 0).to_str_cord()];
    }
    if(world[unused_cord.y + 1][unused_cord.x] == 0) {
        local_open[unused_cord.delta(0, 1).to_str_cord()];
    }
    if(world[unused_cord.y][unused_cord.x - 1] == 0) {
        local_open[unused_cord.delta(-1, 0).to_str_cord()];
    }
    var local_str_opens = Object.keys(local_open);
    var next_best = false;
    if(local_str_opens.length > 0) {
        next_best = local_str_opens[rand_int(local_str_opens.length)];
        delete local_open[next_best];
    }

    return next_best;
}

function handle_unused_cord(root_cords, unused, local_open, world, unused_cord) {
    delete unused[unused_cord];
    unused_cord = from_str_cord(unused_cord);
    world[unused_cord.y][unused_cord.x] = 0;
    var wall_mask = rand_wall();
    apply_wall_mask(unused, world, wall_mask, unused_cord.x, unused_cord.y);
    var next_cord = next_best_cord(unused, local_open, world, unused_cord);

    if(next_cord) {
        handle_unused_cord(root_cords, unused, local_open, world, next_cord);
    } else {
        gen_world(root_cords, unused, world);
    }
}

function gen_world(root_cords, unused, world) {
    var unused_str_cords = Object.keys(unused);

    if(unused_str_cords.length > 0) {
        var unused_cord = unused_str_cords[rand_int(unused_str_cords.length)];
        root_cords[unused_cord] = true;
        handle_unused_cord(root_cords, unused, {}, world, unused_cord);
    }
}

function has_wall_mask(mask, world, x, y) {
    var has_mask = true;
    for(var dy = -1; dy < 2 && has_mask; dy++) {
        for(var dx = -1; dx < 2 && has_mask; dx++) {
            has_mask = world[y+dy][x+dx] == mask[dy+1][dx+1];            
        }
    }

    return has_mask;
} 

function gen_mask_map() {
    return [
        [
            [0, 0, 0],
            [1, 1, 0],
            [1, 1, 0],
        ],
        [
            [0, 1, 1],
            [0, 1, 1],
            [0, 1, 1],
        ],
        [
            [1, 1, 0],
            [1, 1, 1],
            [1, 1, 1],
        ],
        [
            [0, 0, 0],
            [1, 1, 1],
            [1, 1, 1],
        ],
        [
            [1, 1, 0],
            [1, 1, 1],
            [0, 1, 1],
        ],
        [
            [0, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ],
        [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ],
        [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 0],
        ],
        [
            [0, 1, 1],
            [0, 1, 1],
            [0, 0, 0],
        ],
        [
            [1, 1, 1],
            [1, 1, 1],
            [0, 0, 0],
        ],
        [
            [1, 1, 1],
            [1, 1, 1],
            [0, 1, 1],
        ],
        [
            [1, 1, 0],
            [1, 1, 0],
            [1, 1, 0],
        ],
        [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
        [
            [0, 0, 0],
            [0, 1, 1],
            [0, 1, 1],
        ],
        [
            [0, 1, 1],
            [1, 1, 1],
            [1, 1, 0],
        ],
        [
            [1, 1, 0],
            [1, 1, 0],
            [0, 0, 0],
        ]
    ];
}

function edge_case_map(idx) {
	return [
		11,
		9,
		1,
		3,
		11,
		9,
		1,
		3,
    15,
    8,
    13,
    0
	][idx];
}

function gen_mask_map_edge_case() {
    return [
        [
            [1, 1, 1],
            [1, 1, 0],
            [1, 1, 0],
        ],
        [
            [1, 1, 1],
            [1, 1, 1],
            [0, 0, 1],
        ],
        [
            [0, 1, 1],
            [0, 1, 1],
            [1, 1, 1],
        ],
        [
            [1, 0, 0],
            [1, 1, 1],
            [1, 1, 1],
        ],
        
        [
            [1, 1, 0],
            [1, 1, 0],
            [1, 1, 1],
        ],
        [
            [1, 1, 1],
            [1, 1, 1],
            [1, 0, 0],
        ],
        [
            [1, 1, 1],
            [0, 1, 1],
            [0, 1, 1],
        ],
        [
            [0, 0, 1],
            [1, 1, 1],
            [1, 1, 1],
        ],
        
        [
            [1, 1, 0],
            [1, 1, 0],
            [0, 0, 1],
        ],
        [
            [0, 1, 1],
            [0, 1, 1],
            [1, 0, 0],
        ],
        [
            [1, 0, 0],
            [0, 1, 1],
            [0, 1, 1],
        ],
        [
            [0, 0, 1],
            [1, 1, 0],
            [1, 1, 0],
        ],
    ];
}

function find_mask(mask_map, edge_cases, world, x, y) {
    var found_idx = false;
    for(var idx in mask_map) {
        if(has_wall_mask(mask_map[idx], world, x, y)) {
            found_idx = idx;
            break;            
        }
    }

    if(!found_idx) {
        for(var idx in edge_cases) {
            if(has_wall_mask(edge_cases[idx], world, x, y)) {
                found_idx = idx;
                break;            
            }
        }
        if(found_idx) {
            found_idx = edge_case_map(found_idx);
        } else {
            found_idx = 12; //empty
        }
    }

    return found_idx;
}

function calc_display_tiles(world) {
    var mask_map = gen_mask_map();    
    var edge_cases = gen_mask_map_edge_case();
    var display = [];
    display.push([]);
    for(var j = 1; j < world.length - 1; j++) {
        var row_len = world[j].length - 1;
        display.push([]);
        for(var i = 1; i < row_len; i++) {
            // var tile_code = world[j][i] == 1 ? 6 : 12;
            var tile_code = find_mask(mask_map, edge_cases, world, i, j);
            display[j].push(tile_code);
        }
    }

    return display;
}

function cord_displacement(a, b) {
    var dx = a.x-b.x;
    var dy = a.y-b.y;
    return Math.sqrt((dx*dx) + (dy*dy));
}

function gen_connection_map(root_cords) {
    var connection_map = {};
    var root_str_cords = Object.keys(root_cords);
    var first_connection;
    for(var i = 0; i < root_str_cords.length; i++) {
        if(i==0) {
            first_connection = root_str_cords[i];
        }
        delete root_cords[root_str_cords[i]];
        var a_cord = from_str_cord(root_str_cords[i]);
        var best_displacement = 1000000;
        var best_b = false;
        for(var root_cord in root_cords) {
            var b_cord = from_str_cord(root_cord);
            var displacement = cord_displacement(a_cord, b_cord);
            if(displacement < best_displacement) {
                best_displacement = displacement;
                best_b = b_cord;
            }
        }

        if(best_b) {
            connection_map[a_cord.to_str_cord()] = best_b;
        } else {
            break;
        }
    }

    return {
        connection_map: connection_map,
        first_connection: first_connection
    };
}

function is_closed_off(world, x, y) {
    return (world[y][x-1].toString() == 1)
        && (world[y+1][x].toString() == 1)
        && (world[y][x+1].toString() == 1)
        && (world[y-1][x].toString() == 1);
}

function make_connection(connection_map, root_cords, world, from) {
    console.log(from);
    if(connection_map[from]) {
        console.log(from);
        var to = connection_map[from];
        console.log(to);
        
        from = from_str_cord(from);
        if(to.x>from.x) {
            for(var i = from.x; i < to.x; i++) {
                world[from.y][i] = 0;
            }
            if(to.y>from.y) {
                for(var i = from.y; i < to.y; i++) {
                    world[i][to.x] = 0;
                }
            } else {
                for(var i = to.y; i < from.y; i++) {
                    world[i][to.x] = 0;
                }
            }
        } else {
            for(var i = to.x; i < from.x; i++) {
                world[to.y][i] = 0;
            }
            if(to.y>from.y) {
                for(var i = from.y; i < to.y; i++) {
                    world[i][to.x] = 0;
                }
            } else {
                for(var i = to.y; i < from.y; i++) {
                    world[i][to.x] = 0;
                }
            }
        }
        make_connection(connection_map, root_cords, world, to.to_str_cord());
    }
}

function clean_world(root_cords, world) {
    for(var j = 1; j < world.length - 1; j++) {
        for(var i = 1; i < world[j].length-1; i++) {
            if(is_closed_off(world, i, j)) {
                remove_unused(root_cords, i, j);
                world[j][i] = 1;
            }
        }
    }

    connect_rooms(world);
}

function bfs_room(rooms, visited, dirs, rows, cols, grid, r, c, id) {
    var queue = [[r, c]];
    var cells = [];
    visited[r][c] = true;

    while (queue.length) {
        var [x, y] = queue.shift();
        cells.push([x, y]);
        for (var [dx, dy] of dirs) {
            var nx = x + dx, ny = y + dy;
            if (
                nx >= 0 && nx < rows && ny >= 0 && ny < cols &&
                !visited[nx][ny] && grid[nx][ny] === 0
            ) {
                visited[nx][ny] = true;
                queue.push([nx, ny]);
            }
        }
    }
    rooms.push(cells);
}

function manhattan(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function connect_rooms(grid) {
    var rows = grid.length;
    var cols = grid[0].length;

    var dirs = [[1,0], [-1,0], [0,1], [0,-1]];

    var visited = Array.from({length: rows}, () => Array(cols).fill(false));
    var rooms = [];

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (!visited[i][j] && grid[i][j] === 0) {
                bfs_room(rooms, visited, dirs, rows, cols, grid, i, j);
            }
        }
    }

    if (rooms.length <= 1) return grid;


    var connected = [rooms[0]];
    var remaining = rooms.slice(1);

    while (remaining.length) {
        var best_dist = Infinity;
        var best_wall = null;
        var best_room_idx = -1;

        for (var i = 0; i < connected.length; i++) {
            for (var j = 0; j < remaining.length; j++) {
                for (var a of connected[i]) {
                    for (var b of remaining[j]) {
                        var dist = manhattan(a, b);
                        if (dist < best_dist) {
                            best_dist = dist;
                            best_wall = [a, b];
                            best_room_idx = j;
                        }
                    }
                }
            }
        }

        var [a, b] = best_wall;
        var [x, y] = a;

        while (x !== b[0] || y !== b[1]) {
            grid[x][y] = 0;
            
            if (x < b[0]) x++;
            else if (x > b[0]) x--;
            else if (y < b[1]) y++;
            else if (y > b[1]) y--;
            
            grid[x][y] = 0;
        }

        connected.push(remaining[best_room_idx]);
        remaining.splice(best_room_idx, 1);
    }
}

function upscale_world(world) {
  var rows = world.length;
  var cols = world[0].length;
  var result = [];

  for (let i = 0; i < rows; i++) {
    var new_row_1 = [];
    var new_row_2 = [];
    for (let j = 0; j < cols; j++) {
      var val = world[i][j];
      // Each cell becomes a 2x2 block
      new_row_1.push(val, val);
      new_row_2.push(val, val);
    }
    result.push(new_row_1, new_row_2);
  }

  return result;
}
function print_display(world) {
    var to_print = '';
    for(var j = 0; j < world.length; j++) {
        for(var i = 0; i < world[j].length; i++) {
            if(world[j][i]<10) {
                to_print+=' '+world[j][i]+',';
            } else if(world[j][i] == 12){
                to_print+='  ,';
            } else {
                to_print+=world[j][i]+',';
            }
        }
        to_print+='\n';
    }
    console.log(to_print);
}

function print_world(world) {
    var to_print = '';
    for(var j = 0; j < world.length; j++) {
        for(var i = 0; i < world[j].length; i++) {
            to_print+=world[j][i]==1?'#':'.';
        }
        to_print+='\n';
    }
    console.log(to_print);
}

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image("tilemap", "../assets/tilesets/castle_walls_stone_irone_pointed.png");
    }

    create() {
        var world_tilemap_and_unused = pre_gen_world(16,16);
        
        var world = world_tilemap_and_unused.world;
        var unused = world_tilemap_and_unused.unused;
        var root_cords = {};
        gen_world(root_cords, unused, world);
        clean_world(root_cords, world);
        print_world(world);
        world = upscale_world(world);
        print_world(world);
        
        // console.log(gen_connection_map(root_cords));
        var world_tilemap = calc_display_tiles(world);
        print_display(world_tilemap);
        // console.log(world_tilemap);

        const map = this.make.tilemap({ data: world_tilemap, tileWidth: 64, tileHeight: 64 });
        const tilemap = map.addTilesetImage("tilemap");
        const layer = map.createLayer(0, tilemap, 0, 0);

        this.input.mousePointer.motionFactor = 0.5;
        this.input.pointer1.motionFactor = 0.5;

        var cam = this.cameras.main;

        // cam.setZoom(2);

        // cam.setBounds(0, 0, map.displayWidth, map.displayHeight);

        this.input.on('pointermove', function (pointer) {
            if (!pointer.isDown) return;

            const { x, y } = pointer.velocity;

            cam.scrollX -= x / cam.zoom;
            cam.scrollY -= y / cam.zoom;
        });
        
        // this.input.once('pointerdown', () => {
        //     this.scene.start('GameOver');
        // });
    }
}
