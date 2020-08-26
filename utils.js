enemyFuncs = []
enemyFuncs.push({prob:1, func:()=>{objs.push(new Enemy_SlowRun())}});
enemyFuncs.push({prob:1, func:()=>{objs.push(new Enemy_FastRun())}});
enemyFuncs.push({prob:1, func:()=>{objs.push(new Enemy_SlowBounce())}});
enemyFuncs.push({prob:1, func:()=>{objs.push(new Enemy_DelayedAttack())}});
enemyFuncs.push({prob:1, func:()=>{objs.push(new Enemy_LongJump())}});

let enemyFuncsTotalProb = 0;
enemyFuncs.forEach(ef => enemyFuncsTotalProb += ef.prob);

CreateEnemy = () =>
{
    let curProb = 0.0;
    let desiredProb = Math.random();
    for (let i = 0; i < enemyFuncs.length; ++i)
    {
        curProb += enemyFuncs[i].prob / enemyFuncsTotalProb;
        if (desiredProb <= curProb)
        {
            let count = Math.random() < 0.25 ? 2 : 1;//Math.floor(Math.random()*2.99) + 1;
            for (let c = 0; c < count; ++c)
            {
                setTimeout(enemyFuncs[i].func, (250 + Math.random()*250)*c);
            }
            break;
        }
    }
}

DrawBackground = () =>
{
    let ropeWidth = 15;

    PushMatrix(0, -player.bellyOffset.y*0.25, 0);

    // Blue ropes
    DrawLine(100, 280, 810, 280, "#3A50BD", ropeWidth);
    DrawLine(100, 280, -10, 460, "#3A50BD", ropeWidth);

    // White ropes
    DrawLine(100, 240, 810, 240, "#EDF7F7", ropeWidth);
    DrawLine(100, 240, -10, 420, "#EDF7F7", ropeWidth);

    // Red ropes
    DrawLine(100, 200, 810, 200, "#CE3B2F", ropeWidth);
    DrawLine(100, 200, -10, 380, "#CE3B2F", ropeWidth);

    // Turnbuckle
    DrawLine(110, 190, 110, 315, "#111", 30.0);

    // Outline around gray mat
    ctx.beginPath();
    ctx.moveTo(95, 315);
    ctx.lineTo(15, 450);
    ctx.lineTo(810, 450);
    ctx.lineTo(810, 315);
    ctx.closePath();
    ctx.fillStyle = "#83839E";
    ctx.fill();

    // Gray mat
    ctx.beginPath();
    ctx.moveTo(100, 320);
    ctx.lineTo(25, 450);
    ctx.lineTo(810, 450);
    ctx.lineTo(810, 320);
    ctx.closePath();
    ctx.fillStyle = "#BFBEE5";
    ctx.fill();

    PopMatrix();
}