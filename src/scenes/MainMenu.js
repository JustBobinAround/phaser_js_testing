import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    preload() {
        this.load.audio('test_music', '/assets/music_samples/store_or_town_music_sample.wav');
    }

    create() {
        this.add.image(512, 384, 'background');

        var music = this.sound.add('test_music');

        music.setLoop(true);
        music.play();

        // this.add.image(512, 300, 'logo');
        
        var font = {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        };
        
        this.add.text(512, 300, 'Where\'s the sky?', font)
            .setOrigin(0.5);

        this.add.text(512, 460, 'Main Menu', font)
            .setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
