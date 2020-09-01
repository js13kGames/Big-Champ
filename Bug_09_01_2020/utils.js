enemyFuncs = [];
enemyFuncs.push({prob:1, func:()=>{objs.push(new Enemy_SlowRun())}});
enemyFuncs.push({prob:1, func:()=>{objs.push(new Enemy_FastRun())}});
enemyFuncs.push({prob:1, func:()=>{objs.push(new Enemy_SlowBounce())}});
enemyFuncs.push({prob:1, func:()=>{objs.push(new Enemy_DelayedAttack())}});
enemyFuncs.push({prob:1, func:()=>{objs.push(new Enemy_LongJump())}});

let enemyFuncsTotalProb = 0;
enemyFuncs.forEach(ef => enemyFuncsTotalProb += ef.prob);

enemySpawnInfo = [];
enemySpawnInfo.push({
    maxPlayerScore: 5,
    possibleEnemyTypes: [0],
    minSpawnCount: 1,
    maxSpawnCount: 1,
    minSpawnDelay: 0.5,
    maxSpawnDelay: 0.5,
    minNextDelay: 2.0,
    maxNextDelay: 2.0,
});

CreateEnemy = () =>
{
    for (let i = 0; i < enemySpawnInfo.length; ++i)
    {
        let es = enemySpawnInfo[i];
        if (player.score <= es.maxPlayerScore || i == (enemySpawnInfo.length - 1))
        {
            let spawnCountRange = es.maxSpawnCount - es.minSpawnCount;
            let spawnCount = es.minSpawnCount + Math.floor((Math.random()*spawnCountRange) + 0.5);
            let spawnDelay = 0.0;
            for (let c = 0; c < spawnCount; ++c)
            {
                let enemyIdx = Math.floor(Math.random()*es.possibleEnemyTypes.length);
                switch (enemyIdx)
                {
                    case 0: setTimeout(()=>{objs.push(new Enemy_SlowRun())}, spawnDelay); break;
                    case 1: setTimeout(()=>{objs.push(new Enemy_FastRun())}, spawnDelay); break;
                    case 2: setTimeout(()=>{objs.push(new Enemy_DelayedAttack())}, spawnDelay); break;
                    case 3: setTimeout(()=>{objs.push(new Enemy_LongJump())}, spawnDelay); break;
                    case 4: setTimeout(()=>{objs.push(new Enemy_SlowBounce())}, spawnDelay); break;
                }

                spawnDelay += es.minSpawnDelay + (Math.random()*(es.maxSpawnDelay - es.minSpawnDelay))
            }

            let nextDelay = es.minNextDelay + (Math.random()*(es.maxNextDelay - es.minNextDelay))
            setTimeout(CreateEnemy, spawnDelay + nextDelay);

            break;
        }
    }
    // let curProb = 0.0;
    // let desiredProb = Math.random();
    // for (let i = 0; i < enemyFuncs.length; ++i)
    // {
    //     curProb += enemyFuncs[i].prob / enemyFuncsTotalProb;
    //     if (desiredProb <= curProb)
    //     {
    //         let count = Math.random() < 0.25 ? 2 : 1;//Math.floor(Math.random()*2.99) + 1;
    //         //for (let c = 0; c < count; ++c)
    //         {
    //             //setTimeout(enemyFuncs[i].func, (250 + Math.random()*250)*c);
    //             enemyFuncs[i].func();

    //             zzfx(...[,,521,.02,,.09,,2.24,-11,-39,-961,.15,,.1,,,.01,,.03]); // Blip 153
    //         }
    //         break;
    //     }
    // }
}

crowd = [];
crowdColors = ["#331C16", "#400101", "#2A110A", "#28251E", "#152833", "#333015", "#06280D"];
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
flashes = [];
nextFlashTime = Math.floor(Math.random()*100);
DrawCrowd = () =>
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

DrawBackground = () =>
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

DrawHud = () =>
{
    for (let i = 0; i < 3; ++i)
    {
        DrawRect(40 + (40*i), 40, 28, 28, "#000");
        DrawRect(40 + (40*i), 40, 20, 20, player.health > i ? "#F00" : "#444");
    }

    DrawText(player.score.toString(), gameWidth - 40, 50, 40, "#FFF", 0, "Arial", "Bold", "right", "center", 8);
}
