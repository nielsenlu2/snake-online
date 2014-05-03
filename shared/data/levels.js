'use strict';

xss.data.levels = [
    {image: xss.data.levelImages.blank, animation: function() {
        return [
            new xss.animation.RotatingLine(31, 16, 12)
        ];
    }},
    {image: xss.data.levelImages.lines, animation: function() {
        return [
            new xss.animation.RotatingLine(31, 16, 12)
        ];
    }},
    {image: xss.data.levelImages.crosshair},
    {image: xss.data.levelImages.poles},
    {image: xss.data.levelImages.traps},
    {image: xss.data.levelImages.noise},
    {image: xss.data.levelImages.tetris},
    {image: xss.data.levelImages.space_invaders},
    {image: xss.data.levelImages.onion_jack},
    {image: xss.data.levelImages.pacman},
    {image: xss.data.levelImages.borobudur},
    {image: xss.data.levelImages.destination},
    {image: xss.data.levelImages.break_out},
    {image: xss.data.levelImages.pong}
];