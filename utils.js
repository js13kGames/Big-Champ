enemySpawnInfo = [];

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
    maxPlayerScore: 3,
    possibleEnemyTypes: [0,1,2],
    minSpawnCount: 1,
    maxSpawnCount: 1,
    minSpawnDelay: 0,
    maxSpawnDelay: 0,
    minNextDelay: 2.0,
    maxNextDelay: 2.0,
});
enemySpawnInfo.push({
    maxPlayerScore: 6,
    possibleEnemyTypes: [0,2,3],
    minSpawnCount: 2,
    maxSpawnCount: 2,
    minSpawnDelay: 1.5,
    maxSpawnDelay: 2.0,
    minNextDelay: 1.75,
    maxNextDelay: 2.0,
});
enemySpawnInfo.push({
    maxPlayerScore: 8,
    possibleEnemyTypes: [4],
    minSpawnCount: 1,
    maxSpawnCount: 1,
    minSpawnDelay: 0,
    maxSpawnDelay: 0,
    minNextDelay: 1.75,
    maxNextDelay: 1.75,
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
    possibleEnemyTypes: [3,3,4,4],
    minSpawnCount: 2,
    maxSpawnCount: 2,
    minSpawnDelay: 1.0,
    maxSpawnDelay: 1.25,
    minNextDelay: 1.5,
    maxNextDelay: 1.75,
});
enemySpawnInfo.push({
    maxPlayerScore: 30,
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
    possibleEnemyTypes: [1,2,3,4],
    minSpawnCount: 2,
    maxSpawnCount: 2,
    minSpawnDelay: 0.4,
    maxSpawnDelay: 0.6,
    minNextDelay: 1.35,
    maxNextDelay: 1.35,
});
enemySpawnInfo.push({
    maxPlayerScore: 50,
    possibleEnemyTypes: [0,1,2,3,4],
    minSpawnCount: 3,
    maxSpawnCount: 4,
    minSpawnDelay: 0.3,
    maxSpawnDelay: 0.5,
    minNextDelay: 1.15,
    maxNextDelay: 1.25,
});
enemySpawnInfo.push({
    maxPlayerScore: 100,
    possibleEnemyTypes: [0,1,2,3,4],
    minSpawnCount: 4,
    maxSpawnCount: 6,
    minSpawnDelay: 0.25,
    maxSpawnDelay: 0.45,
    minNextDelay: 1.1,
    maxNextDelay: 1.2,
});

enemyIdxBag = [];
lastSpawnInfoIdx = -1;
testScore = -1;
CreateEnemy = () =>
{
    // DEBUG
    // setTimeout(()=>{objs.push(new Enemy_DelayedAttack())}, 1000);
    // setTimeout(()=>{objs.push(new Enemy_SlowRun())}, 1500);
    // setTimeout(CreateEnemy, 6000);
    // return;

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
                do
                {
                    enemyIdx = Math.floor(Math.random()*es.possibleEnemyTypes.length);
                } while (enemyIdxBag.includes(enemyIdx));

                // Bag full = reset
                enemyIdxBag.push(enemyIdx);
                if (enemyIdxBag.length == es.possibleEnemyTypes.length)
                {
                    enemyIdxBag = [];
                }

                switch (es.possibleEnemyTypes[enemyIdx])
                {
                    case 0: setTimeout(()=>{objs.push(new Enemy_SlowRun())}, spawnDelay * 1000); break;
                    case 1: setTimeout(()=>{objs.push(new Enemy_FastRun())}, spawnDelay * 1000); break;
                    case 2: setTimeout(()=>{objs.push(new Enemy_DelayedAttack())}, spawnDelay * 1000); break;
                    case 3: setTimeout(()=>{objs.push(new Enemy_LongJump())}, spawnDelay * 1000); break;
                    case 4: setTimeout(()=>{objs.push(new Enemy_SlowBounce())}, spawnDelay * 1000); break;
                }

                spawnDelay += es.minSpawnDelay + (Math.random()*(es.maxSpawnDelay - es.minSpawnDelay))
            }

            let nextDelay = es.minNextDelay + (Math.random()*(es.maxNextDelay - es.minNextDelay))
            enemyTimer = setTimeout(CreateEnemy, (spawnDelay + nextDelay) * 1000);
            

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
