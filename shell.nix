{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    tiled
    python311
    git
    gnumake
  ];

  shellHook = ''
  '';
}
