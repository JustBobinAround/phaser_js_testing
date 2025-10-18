# Requirements to run
nix package manager (currently version 25.05)

### How to enter nix shell
Within the repo's root directory, enter the following:
```bash
nix-shell
```

This will install what is needed to run the game server locally and also the tiled program.

# How to run game locally
Once within a nix shell and within the root directory of the repo, use the `make` command:
```bash
[nix-shell:~/projects/wheres_the_sky]$ make
python -m http.server
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

