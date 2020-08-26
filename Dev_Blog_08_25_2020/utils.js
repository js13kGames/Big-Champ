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
    return;
    ctx.beginPath();
    ctx.moveTo(30, 100);
    ctx.lineTo(30, 150);
    ctx.lineTo(300, 300);
    ctx.lineTo(300, 300);
    ctx.closePath();
    ctx.fillStyle = "#BFBEE5";
    ctx.fill();
}