let enemySpawnInfo = [];

enemySpawnInfo.push({
    maxPlayerScore: 0,
    possibleEnemyTypes: [0],
    minSpawnCount: 1,
    maxSpawnCount: 1,
    minSpawnDelay: 0,
    maxSpawnDelay: 0,
    minNextDelay: 2.0,
    maxNextDelay: 2.5,
});
enemySpawnInfo.push({
    maxPlayerScore: 2,
    possibleEnemyTypes: [0,1,2],
    minSpawnCount: 1,
    maxSpawnCount: 1,
    minSpawnDelay: 0,
    maxSpawnDelay: 0,
    minNextDelay: 1.75,
    maxNextDelay: 1.75,
});
enemySpawnInfo.push({
    maxPlayerScore: 6,
    possibleEnemyTypes: [0,2,3,4],
    minSpawnCount: 2,
    maxSpawnCount: 2,
    minSpawnDelay: 0.25,
    maxSpawnDelay: 0.5,
    minNextDelay: 1.25,
    maxNextDelay: 1.25,
});
enemySpawnInfo.push({
    maxPlayerScore: 8,
    possibleEnemyTypes: [5,6],
    minSpawnCount: 1,
    maxSpawnCount: 1,
    minSpawnDelay: 0,
    maxSpawnDelay: 0,
    minNextDelay: 1.25,
    maxNextDelay: 1.5,
});
enemySpawnInfo.push({
    maxPlayerScore: 15,
    possibleEnemyTypes: [0,0,1,1,2,2,3,3,4],
    minSpawnCount: 2,
    maxSpawnCount: 2,
    minSpawnDelay: 0.75,
    maxSpawnDelay: 1.0,
    minNextDelay: 1.5,
    maxNextDelay: 1.75,
});
enemySpawnInfo.push({
    maxPlayerScore: 20,
    possibleEnemyTypes: [3,3,4,4,6,8],
    minSpawnCount: 2,
    maxSpawnCount: 2,
    minSpawnDelay: 1.0,
    maxSpawnDelay: 1.25,
    minNextDelay: 1.5,
    maxNextDelay: 1.75,
});
enemySpawnInfo.push({
    maxPlayerScore: 25,
    possibleEnemyTypes: [0,1,2,3,4],
    minSpawnCount: 2,
    maxSpawnCount: 3,
    minSpawnDelay: 0.5,
    maxSpawnDelay: 0.75,
    minNextDelay: 1.75,
    maxNextDelay: 1.75,
});
enemySpawnInfo.push({
    maxPlayerScore: 35,
    possibleEnemyTypes: [1,2,3,4,1,2,3,4,7,8,6],
    minSpawnCount: 2,
    maxSpawnCount: 2,
    minSpawnDelay: 0.4,
    maxSpawnDelay: 0.6,
    minNextDelay: 1.35,
    maxNextDelay: 1.35,
});
enemySpawnInfo.push({
    maxPlayerScore: 50,
    possibleEnemyTypes: [0,1,2,3,4,0,1,2,3,4,0,1,2,3,4,5,7,9],
    minSpawnCount: 3,
    maxSpawnCount: 4,
    minSpawnDelay: 0.3,
    maxSpawnDelay: 0.5,
    minNextDelay: 1.15,
    maxNextDelay: 1.25,
});
enemySpawnInfo.push({
    maxPlayerScore: 100,
    possibleEnemyTypes: [0,1,2,3,4,0,1,2,3,4,0,1,2,3,4,0,1,2,3,4,5,6,7,8,9],
    minSpawnCount: 4,
    maxSpawnCount: 6,
    minSpawnDelay: 0.25,
    maxSpawnDelay: 0.45,
    minNextDelay: 1.1,
    maxNextDelay: 1.2,
});

let enemyTimer;
let enemyIdxBag = [];
let lastSpawnInfoIdx = -1;
let testScore = -1;
let isFrenzy = false;
let frenzyCooldown = 0;
let CreateEnemy = () =>
{
    // DEBUG
    // setTimeout(()=>{objs.push(new Enemy_DelayedAttack())}, 1000);
    // setTimeout(()=>{objs.push(new Enemy_SlowRun())}, 1500);
    // setTimeout(CreateEnemy, 6000);
    // return;

    isFrenzy = false;

    for (let i = 0; i < enemySpawnInfo.length; ++i)
    {
        let es = enemySpawnInfo[i];

        if (testScore != undefined && testScore > 0)
        {
            player.score = testScore;
        }

        if (player.score <= es.maxPlayerScore || i == (enemySpawnInfo.length - 1))
        {
            // New enemy bag?
            if (i != lastSpawnInfoIdx)
            {
                lastSpawnInfoIdx = i;
                enemyIdxBag = [];
            }

            let spawnCountRange = es.maxSpawnCount - es.minSpawnCount;
            let spawnCount = es.minSpawnCount + Math.floor((Math.random()*spawnCountRange) + 0.5);
            let spawnDelay = 0.0;
            for (let c = 0; c < spawnCount; ++c)
            {
                // Pick random enemy that hasn't already been chosen (in our bag)
                let enemyIdx = -1;
                let timeout = 100;
                do
                {
                    enemyIdx = Math.floor(Math.random()*es.possibleEnemyTypes.length);
                    --timeout;
                } while ((enemyIdxBag.includes(enemyIdx) || (es.possibleEnemyTypes[enemyIdx] >= 5 && frenzyCooldown > 0)) && timeout > 0);

                // Bag full = reset
                enemyIdxBag.push(enemyIdx);
                if (enemyIdxBag.length == es.possibleEnemyTypes.length)
                {
                    enemyIdxBag = [];
                }

                switch (es.possibleEnemyTypes[enemyIdx])
                {
                    case 0: setTimeout(()=>{objs.push(new Enemy_SlowRun()); PlayEnemySpawnSFX(); }, spawnDelay * 1000); break;
                    case 1: setTimeout(()=>{objs.push(new Enemy_FastRun()); PlayEnemySpawnSFX(); }, spawnDelay * 1000); break;
                    case 2: setTimeout(()=>{objs.push(new Enemy_DelayedAttack()); PlayEnemySpawnSFX(); }, spawnDelay * 1000); break;
                    case 3: setTimeout(()=>{objs.push(new Enemy_LongJump()); PlayEnemySpawnSFX(); }, spawnDelay * 1000); break;
                    case 4: setTimeout(()=>{objs.push(new Enemy_SlowBounce()); PlayEnemySpawnSFX(); }, spawnDelay * 1000); break;

                    case 5:
                    {
                        for (let f = 0; f < 6; ++f)
                        {
                            setTimeout(()=>{objs.push(new Enemy_SlowRun()); PlayEnemySpawnSFX(); }, 2000 + f*400);
                        }
                        c = spawnCount;
                        spawnDelay = 5;
                        isFrenzy = true;
                    } break;

                    case 6:
                    {
                        for (let f = 0; f < 7; ++f)
                        {
                            setTimeout(()=>{objs.push(new Enemy_LongJump()); PlayEnemySpawnSFX(); }, 2000 + f*400);
                        }
                        c = spawnCount;
                        spawnDelay = 5;
                        isFrenzy = true;
                    } break;

                    case 7:
                    {
                        for (let f = 0; f < 7; ++f)
                        {
                            setTimeout(()=>{objs.push(new Enemy_SlowBounce()); PlayEnemySpawnSFX(); }, 2000 + f*400);
                        }
                        c = spawnCount;
                        spawnDelay = 5;
                        isFrenzy = true;
                    } break;

                    case 8:
                    {
                        for (let f = 0; f < 8; ++f)
                        {
                            setTimeout(()=>{objs.push(new Enemy_FastRun()); PlayEnemySpawnSFX(); }, 2000 + f*300);
                        }
                        c = spawnCount;
                        spawnDelay = 5;
                        isFrenzy = true;
                    } break;

                    case 9:
                    {
                        for (let f = 0; f < 6; ++f)
                        {
                            setTimeout(()=>{objs.push(new Enemy_DelayedAttack()); PlayEnemySpawnSFX(); }, 2000 + f*300);
                        }
                        c = spawnCount;
                        spawnDelay = 5;
                        isFrenzy = true;
                    } break;
                }

                spawnDelay += es.minSpawnDelay + (Math.random()*(es.maxSpawnDelay - es.minSpawnDelay))
            }

            let nextDelay = es.minNextDelay + (Math.random()*(es.maxNextDelay - es.minNextDelay))

            if (player.healthTimer <= 0)
            {
                player.healthTimer = 20;
                if (player.health < 3)
                {
                    setTimeout(()=>
                    {
                        objs.push(new Enemy_LongJump());
                        objs[objs.length - 1].isHeart = true;
                        zzfx(...[,,60,.03,.01,.33,1,.53,-5.7,,,,,,,,,.76]);
                    }, (spawnDelay * 1000) + 1250);
                    nextDelay += 2.5;
                }
            }

            enemyTimer = setTimeout(CreateEnemy, (spawnDelay + nextDelay) * 1000);

            break;
        }
    }

    if (isFrenzy)
    {
        frenzyCooldown = 5;

        setTimeout(()=>{zzfx(...[,,71,.04,.04,.25,2,1.53,1.1,,,,,,,.1,,.99])}, 0);
        setTimeout(()=>{zzfx(...[,,71,.04,.04,.25,2,1.53,1.1,,,,,,,.1,,.99])}, 300);
        setTimeout(()=>{zzfx(...[,,71,.04,.04,.25,2,1.53,1.1,,,,,,,.1,,.99])}, 600);
        setTimeout(()=>{zzfx(...[,,71,.04,.04,.25,2,1.53,1.1,,,,,,,.1,,.99])}, 900);
    }
    else
    {
        --frenzyCooldown;
    }
}

let IsEnemyInBounceZone = () =>
{
    for (let i = 1; i < objs.length; ++i)
    {
        if (objs[i].IsInBounceZone != undefined && objs[i].IsInBounceZone())
        {
            return true;
        }
    }

    return false;
}

let PlayEnemySpawnSFX = () =>
{
    zzfx(...[,,90,.01,,.09,,2.92,,-43,53,.01,.01,,,,,.74,.02]); // Blip 167
}

let crowd = [];
let crowdColors = ["#331C16", "#400101", "#2A110A", "#28251E", "#152833", "#333015", "#06280D"];
for (let i = 0; i < 300; ++i)
{
    crowd.push(
    {
        x: Math.random()*gameWidth,
        y: Math.random()*gameHeight*0.5,
        col: Math.floor(Math.random() * crowdColors.length),
        off: Math.random(),
        spd: Math.random()*0.003
    });
}
let flashes = [];
let nextFlashTime = Math.floor(Math.random()*100);
let DrawCrowd = () =>
{
    crowd.forEach(c =>
    {
        DrawRect(c.x, c.y + Math.abs(Math.sin(Date.now()*(0.001+c.spd) + c.off)*3), 10, 10, crowdColors[c.col]);
    });

    for (let i = 0; i < flashes.length; ++i)
    {
        let f = flashes[i];
        let a = "F";
        if (f.t < 2) { a = "4"; }
        else if (f.t < 5) { a = "8"; }
        else if (f.t < 10) { a = "A"; }
        DrawRect(f.x, f.y, 25, 25, "#FFF" + a);
        f.t--;
        if (f.t <= 0)
        {
            flashes.splice(i, 1);
        }
    }

    // Start new flashes
    nextFlashTime--;
    if (nextFlashTime <= 0)
    {
        nextFlashTime = Math.floor(Math.random()*50);
        flashes.push({x: Math.random()*gameWidth, y: Math.random()*gameHeight*0.3, t: 15});
    }
}

let DrawBackground = () =>
{
    let ropeWidth = 15;

    // Crowd
    DrawCrowd();

    // Stadium wall
    DrawRect(gameWidth*0.5, gameHeight*0.5, gameWidth, 100, "#383838");

    PushMatrix(0, -player.bellyOffset.y*0.25, 0);

    // Blue ropes
    DrawLine(100, 280, 810, 280, "#3A50BD", ropeWidth);
    DrawLine(100, 280, -10, 460, "#3A50BD", ropeWidth*0.9);

    // White ropes
    DrawLine(100, 240, 810, 240, "#EDF7F7", ropeWidth);
    DrawLine(100, 240, -10, 405, "#EDF7F7", ropeWidth*0.9);

    // Red ropes
    DrawLine(100, 200, 810, 200, "#CE3B2F", ropeWidth);
    DrawLine(100, 200, -10, 355, "#CE3B2F", ropeWidth*0.9);

    // Turnbuckle
    DrawLine(110, 190, 110, 315, "#111", 30.0);

    // Outline around gray mat
    ctx.beginPath();
    ctx.moveTo(95, 315);
    ctx.lineTo(15, 460);
    ctx.lineTo(810, 460);
    ctx.lineTo(810, 315);
    ctx.closePath();
    ctx.fillStyle = "#83839E";
    ctx.fill();

    // Gray mat
    ctx.beginPath();
    ctx.moveTo(100, 320);
    ctx.lineTo(25, 460);
    ctx.lineTo(810, 460);
    ctx.lineTo(810, 320);
    ctx.closePath();
    ctx.fillStyle = "#BFBEE5";
    ctx.fill();

    PopMatrix();
}

let DrawHeart = (x, y, size, color) =>
{
    PushMatrix(x, y, 0);
    DrawCircle(-size*0.23, -size*0.25, size*0.75, "#000");
    DrawCircle(size*0.23, -size*0.25, size*0.75, "#000");
    DrawRect(-size*0.38, -size*0.08, size*1.2, size*1.0, "#000", 45.0);
    DrawRect(size*0.38, -size*0.08, size*1.2, size*1.0, "#000", -45.0);
    DrawRect(0, size*0.11, size*1.25, size*1.25, "#000", 45.0);

    DrawCircle(-size*0.23, -size*0.25, size*0.5, color);
    DrawCircle(size*0.23, -size*0.25, size*0.5, color);
    DrawRect(-size*0.38, -size*0.08, size, size*0.5, color, 45.0);
    DrawRect(size*0.38, -size*0.08, size, size*0.5, color, -45.0);
    DrawRect(0, size*0.11, size*0.75, size*0.75, color, 45.0);
    PopMatrix();
}

let DrawHud = () =>
{
    for (let i = 0; i < 3; ++i)
    {
        DrawHeart(50 + (55*i), 40, 20, player.health > i ? "#F00" : "#444");
    }

    DrawText(player.score.toString(), gameWidth - 40, 50, 40, "#FFF", 0, "Arial", "Bold", "right", "center", 8);

    if (isFrenzy)
    {
        DrawText("Wrestler Rush!", gameWidth*0.5, gameHeight*0.2, 36 + Math.abs(Math.sin(Date.now()*0.0075))*10.0, "#FFD800", -2, "Arial", "Bold", "center", "center", 10);
    }
}

let particles = [];
let ParticleTypeHit = 0;
let ParticleTypeDizzy = 1;
let SpawnParticle = (x, y, type) =>
{
    switch (type)
    {
        case ParticleTypeHit:
        {
            let randAngle = Math.random()*360;
            particles.push({x: x, y: y, vx: 0, vy: 0, w: 50, h: 50, vw: 4, vh: 4, a: randAngle, va: 1, lifetime: 10, t: 0, c: "#FFF"});
            particles.push({x: x, y: y, vx: 0, vy: 0, w: 50, h: 50, vw: 4, vh: 4, a: randAngle + 45, va: 1, lifetime: 10, t: 0, c: "#FFF"});
        } break;

        case ParticleTypeDizzy:
        {
            let randAngle = Math.random()*360;
            particles.push({x: x, y: y, vx: 0, vy: 0, w: 10, h: 10, vw: 2, vh: 2, a: randAngle, va: 1, lifetime: 10, t: 0, c: "#FFF"});
            particles.push({x: x, y: y, vx: 0, vy: 0, w: 10, h: 10, vw: 2, vh: 2, a: randAngle + 45, va: 1, lifetime: 10, t: 0, c: "#FFF"});
        } break;
    }
}

let DrawParticles = () =>
{
    for (let i = 0; i < particles.length; ++i)
    {
        let p = particles[i];
        PushMatrix(p.x, p.y, p.a);
        let alpha = 1.0 - Math.min(Math.max(p.t / p.lifetime, 0.0), 1.0);
        alpha = Math.min(Math.floor(alpha*16), 15);
        let aValues = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
        let color = p.c + aValues[alpha];
        DrawRect(0, 0, p.w, p.h, color);
        PopMatrix();

        p.x += p.vx;
        p.y += p.vy;
        p.a += p.va;
        p.w += p.vw;
        p.h += p.vh;

        p.t++;
        if (p.t >= p.lifetime)
        {
            particles.splice(i, 1);
            --i;
        }
    }
}
