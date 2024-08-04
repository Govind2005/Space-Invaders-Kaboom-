kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1],
})

loadSprite('spaceship','./assets/spaceship.png')
loadSprite('alien','./assets/alien.png')
loadSprite('wall','./assets/wall.png')

scene("defeat",(args)=> {
    add([
        text("you lose\n\n" + args),
        origin('center'),
        pos(width()/2,height()/2),
        scale(3)
    ])
})
scene("victory",(args)=> {
    add([
        text("you win\n\n" + args),
        origin('center'),
        pos(width()/2,height()/2),
        scale(3)
    ])
})

scene("game", () => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const map = [
        '/                  . . . . . . . .             . . . . . . . .             /',
        '/                                                                          /',
        '/                                                                          /',
        '/                       . . . . . . . .             . . . . . . . .        /',
        '/                                                                          /',
        '/                                                                          /',
        '/                  . . . . . . . .             . . . . . . . .             /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
        '/                                                                          /',
    ]

    const levelCfg = {
        width: 20,
        height: 20,
        '.': [sprite('alien'),solid(),scale(0.1),'alien'],
        '/': [sprite('wall'),solid(),scale(0.1),'wall'],
    }

    let ALIEN_SPEED = 250;
    const LEVEL_DOWN = 1500;
    let REBOUND = -1000;
    action('alien', (a) => {
        a.move(ALIEN_SPEED,0)
    })
    collides('alien','wall', () => {
        every('alien', (a) => {
            a.move(REBOUND,LEVEL_DOWN)
        })
        REBOUND *= -1;
        ALIEN_SPEED *= -1;
    })

    const gameLevel = addLevel(map,levelCfg)
    const player = add([
        sprite('spaceship'),
        solid(),
        pos(width()/2,height()-100),
        origin('center'),
        scale(0.25),
    ])

    const PLAYER_SPEED = 200

    keyDown('left', () => {
        player.move(-PLAYER_SPEED,0)
    })
    keyDown('right', () => {
        player.move(PLAYER_SPEED,0)
    })

   

    const score = add([
        text('0'),
        pos(50,50),
        layer('ui'),
        {
            value: 0,
        },
        scale(5)
    ])

    const TIME = 30

    const timer = add([
        text('0'),
        pos(100,100),
        scale(4),
        layer('ui'),
        {
            time: TIME
        }
    ])

    timer.action(() => {
        timer.time -= dt()
        timer.text = timer.time.toFixed(0)
        if(timer.time <= 0)
        {
            
            go('defeat',score.value)
        }
    })

    function attack(p) {
        add([
            rect(6,18),
            pos(p),
            origin('center'),
            color(0.5,0.5,1),
            'bullet'
        ])
    }

    const BULLET_SPEED = 300;
    let gone = 0

    action('bullet', (b) => {
        b.move(0,-BULLET_SPEED)
        if(b.pos.y < 0)destroy(b)
    })

    keyDown('up', () => {
        if(gone % 10 == 0)
        {
            attack(player.pos.add(0,-30))
        }
        gone++
    })

    collides('alien','bullet', (a,b) =>{
        destroy(b);
        destroy(a);
        score.value++;
        score.text = score.value
        if(score.value >= 48)go('victory',score.value)
    })

})
 
start("game")