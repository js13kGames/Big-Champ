enemyFuncs = []
enemyFuncs.push({prob:1, func:()=>{objs.push(new Enemy_SlowRun())}});
enemyFuncs.push({prob:1, func:()=>{objs.push(new Enemy_FastRun())}});
enemyFuncs.push({prob:1, func:()=>{objs.push(new Enemy_SlowBounce())}});
enemyFuncs.push({prob:100, func:()=>{objs.push(new Enemy_DelayedAttack())}});

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
            enemyFuncs[i].func();
            break;
        }
    }
    //objs.push(new Enemy_SlowRun());
}