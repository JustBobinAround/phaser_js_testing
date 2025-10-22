import { Scene } from 'phaser';

export class DevMainMenu extends Scene {
    constructor() {
        super('DevMainMenu');
    }

    create() {
        var font = {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        };
        
        this.add.text(512, 32, 'DevMainMenu (PICK A SCENE)', font)
            .setOrigin(0.5);

        this.buttons = {}

        var delta = 32*3;
        for(var idx in this.game.config.sceneConfig) {
            const scene = this.game
                .config
                .sceneConfig[idx]
                .name;
                
            this.buttons[scene] = this.add.text(512, delta, scene, { fontSize: '32px', fill: '#fff' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => {
                    this.scene.start(scene);
                });
            
            delta += 32;
        }
    }
}

