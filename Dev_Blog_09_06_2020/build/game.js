//'use strict';

// Config ---------------------------------------------------------------------
let gameWidth = 800;
let gameHeight = 450;
let gameScale = 1.0;

// Constants ------------------------------------------------------------------
let Deg2Rad = Math.PI/180.0;
let Rad2Deg = 180.0/Math.PI;

// Initialization -------------------------------------------------------------
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

// Input (mouse/touch only!) --------------------------------------------------
let touch = {x: 0, y: 0, up: false, down: false, held: false, lastDown: 10000}
window.addEventListener("mousedown", e => { touch.up = false, touch.down = true; touch.held = true; SetTouchPos(e); e.preventDefault(); }, { capture: false, passive: false });
window.addEventListener("mouseup", e => { touch.up = true; touch.down = false; touch.held = false; e.preventDefault(); }, { capture: false, passive: false });
window.addEventListener("touchstart", e => { touch.up = false; touch.down = true; touch.held = true; SetTouchPos(e.touches[0]); e.preventDefault(); }, { capture: false, passive: false });
window.addEventListener("touchend", e => { touch.up = true; touch.down = false; touch.held = false; e.preventDefault(); }, { capture: false, passive: false });
window.addEventListener("touchcancel", e => { touch.up = true; touch.down = false; touch.held = false; e.preventDefault(); }, { capture: false, passive: false });
let SetTouchPos = (event) => { touch.x = event.pageX - canvas.offsetLeft; touch.y = event.pageY - canvas.offsetTop; }

// Audio (restart Zzfx audio context on user input) ---------------------------
document.documentElement.addEventListener("mousedown", () => { if (zzfxX.state !== 'running') {zzfxX.resume();} });
document.documentElement.addEventListener("touchstart", () => { if (zzfxX.state !== 'running') {zzfxX.resume();} });

// Rendering ------------------------------------------------------------------
let PushMatrix = (x, y, angle = 0) => { ctx.save(); ctx.translate(x, y); ctx.rotate(angle * Deg2Rad); }
let PopMatrix = () => { ctx.restore(); }

let DrawLine = (x1, y1, x2, y2, color, width = 1.0) =>
{
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
}

let DrawBezierLine = (x1, y1, x2, y2, c1x, c1y, c2x, c2y, color, width) =>
{
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(c1x, c1y, c2x, c2y, x2, y2);
    ctx.stroke();
    ctx.restore();
}

let DrawRect = (x, y, width, height, color, angle = 0.0) =>
{
    let hw = width * 0.5;
    let hh = height * 0.5;

    ctx.save();
    ctx.translate(x + 0.5, y + 0.5);
    ctx.rotate(angle * Deg2Rad);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-hw, -hh);
    ctx.lineTo(hw, -hh);
    ctx.lineTo(hw, hh);
    ctx.lineTo(-hw, hh);
    ctx.lineTo(-hw, -hh);
    ctx.fill();
    ctx.restore();
}

let DrawCircle = (x, y, radius, color, startAngle = 0, endAngle = 2*Math.PI) =>
{
    ctx.save();
    ctx.translate(x + 0.5, y + 0.5);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.fill();
    ctx.restore();
}

let DrawText = (text, x, y, fontSize = 12, fillStyle = "#FFF", angle = 0, fontName = "Arial", fontStyle = "", align = "left", baseline = "bottom", outlineWidth = 0, outlineColor = "#000") =>
{
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * Deg2Rad);
    ctx.font = `${fontStyle} ${fontSize}px ${fontName}`;
    ctx.fillStyle = fillStyle;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    if (outlineWidth > 0)
    {
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = outlineWidth;
        ctx.lineJoin = "round";
        ctx.strokeText(text, 0, 0);
    }
    ctx.fillText(text, 0, 0);
    ctx.restore();
}

// Math -----------------------------------------------------------------------
class V2
{
    constructor(x, y) { this.x = x != undefined ? x : 0; this.y = y != undefined ? y : 0; }
    Set(x, y) { this.x = x; this.y = y; }
    SetV(v) { this.x = v.x; this.y = v.y; }
    SetToFrom(v1, v2) { this.x = v2.x - v1.x; this.y = v2.y - v1.y; }
    AddV(v) { this.x += v.x; this.y += v.y }
    SubV(v) { this.x -= v.x; this.y -= v.y }
    MulS(s) { this.x *= s; this.y *= s; }
    DivS(s) { this.x /= s; this.y /= s; }
    DistTo(v) { return Math.sqrt(this.DistToSq(v)); }
    DistToSq(v) { let dx = this.x - v.x; let dy = this.y - v.y; return dx*dx + dy*dy; }
    Len() { return Math.sqrt(this.LenSq()); }
    LenSq() { return this.x*this.x + this.y*this.y; }
    Normalize() { let len = this.Len(); this.x /= len; this.y /= len; }
}

// Main loop + State management -----------------------------------------------
let tkState = null;
let tkNextState = null;
let Enter = 0; let Tick = 1; let Draw = 2; let Exit = 3;
let clearColor = "#1A1A1AFF";
let gameLoopFixedTimeStep = 1/60;
let gameLoopFrameTimeAccum = 0;
let previousGameLoopTime = undefined;
let GameLoop = (curTime) =>
{
    window.requestAnimationFrame(GameLoop);

    // Mobile screen size adjustments
    FitToScreen();

    let deltaTime = Math.min((curTime - (previousGameLoopTime || curTime)) / 1000.0, 0.2);  // Cap to 200ms (5fps)
    gameLoopFrameTimeAccum += deltaTime;

    // Fixed tick
    while (gameLoopFrameTimeAccum > gameLoopFixedTimeStep)
    {
        gameLoopFrameTimeAccum -= gameLoopFixedTimeStep;

        // Switch states?
        if (tkNextState != null)
        {
            if (tkState != null) { tkState(Exit); }
            tkState = tkNextState;
            tkNextState = null;
            if (tkState != null) { tkState(Enter); }
        }

        // Tick state
        if (tkState)
        {
            tkState(Tick);
        }

        // Update/Clear per-frame input values
        if (touch.down) { touch.lastDown = 1; }
        else { ++touch.lastDown; }
        touch.up = false;
        touch.down = false;
    }

    // Clear canvas
    ctx.rect(0, 0, gameWidth, gameHeight);
    ctx.fillStyle = clearColor;
    ctx.fill();

    // Draw state
    if (tkState)
    {
        tkState(Draw);
    }

    previousGameLoopTime = curTime;
}

let actualWidth = -1;
let actualHeight = -1;
let FitToScreen = () =>
{
    // Calculate desired screen size
    let aspectRatio = canvas.width / canvas.height;
    let newWidth = window.innerWidth;
    let newHeight = window.innerWidth / aspectRatio;
    if (newHeight > window.innerHeight)
    {
        newHeight = window.innerHeight;
        newWidth = newHeight * aspectRatio;
    }

    // Apply it
    if (newWidth !== actualWidth || newHeight !== actualHeight)
    {
        canvas.style.width = newWidth+"px";
        canvas.style.height = newHeight+"px";

        actualWidth = newWidth;
        actualHeight = newHeight;
    }

    // Keep window scrolled to the top
    window.scrollTo(0, 0);
}

// Start it up!
window.requestAnimationFrame(GameLoop);
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
    possibleEnemyTypes: [5],
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

let DrawHud = () =>
{
    for (let i = 0; i < 3; ++i)
    {
        DrawRect(40 + (40*i), 32, 28, 28, "#000");
        DrawRect(40 + (40*i), 32, 20, 20, player.health > i ? "#F00" : "#444");
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
let PlayerStateIdle = 0;
let PlayerStateBelly = 1;
let PlayerStateHit = 2;
let PlayerStateDead = 3;
let PlayerStateIntro = 4;

let BellyBounceTime = 45;
let BellyBounceAttackTime = 8;

let PlayerHitTime = 20;

class Player
{
    constructor()
    {
        this.pos = new V2(200, -280);
        this.bellyOffset = new V2(0, 0);
        this.bellyOffset.xLast = 0;
        this.bellyOffset.yLast = 0;
        this.dizzyVFXTimer = undefined;

        this.Reset();
    }

    Reset()
    {
        this.health = 3;
        this.score = 0;
        this.isHighScore = false;
        clearInterval(this.dizzyVFXTimer);
    }

    Tick()
    {
        switch (this.state)
        {
            case PlayerStateIdle:
            {
                if (touch.down && tkState != RenderTest)
                {
                    this.BellyBounce();
                }
            } break;

            case PlayerStateBelly:
            {
                this.timer--;
                if (this.timer == 0)
                {
                    this.Idle();
                }

                if (touch.lastDown <= 3 && this.hitConfirm && IsEnemyInBounceZone())
                {
                    // re-animate belly bounce here...
                    this.BellyBounce();
                }
            } break;

            case PlayerStateHit:
            {
                if (touch.lastDown <= 5 && this.health > 0 && IsEnemyInBounceZone())
                {
                        this.BellyBounce();
                }
                else
                {
                    this.timer--;
                    if (this.timer == 0)
                    {
                        if (this.health == 0)
                        {
                            this.bellyOffset.x = 10;
                            this.bellyOffset.y = 10;
                            tkNextState = GameOver;
                            this.state = PlayerStateDead;
                            //this.dizzyVFXTimer = setInterval(() => SpawnParticle(this.pos.x, this.pos.y), 1000);

                            zzfx(...[,,56,,.08,.46,3,2.52,,,,,,1.7,.7,.1,,.62,.01]); // Hit 68
                        }
                        else
                        {
                            this.Idle();
                        }
                    }
                }
            } break;

            case PlayerStateDead:
            {

            } break;

            case PlayerStateIntro:
            {
                let startingY = -280;
                let landingY = 280;
                this.pos.Set(this.pos.x, landingY - (landingY - startingY)*(this.timer / 22));

                this.timer--;
                if (this.timer == 0)
                {
                    this.Idle();
                    this.bellyOffset.xLast = 0;
                    this.bellyOffset.yLast = 0;
                    this.bellyOffset.x = 5;
                    this.bellyOffset.y = 15;

                    zzfx(...[,,309,,.02,.32,2,.47,,,,,,1.1,.7,,.15,.99,.09]); // Hit 180
                    zzfx(...[,,511,.31,.1,1.75,4,2.74,.6,.6,,,,.7,,.2,,.75,.09]); // Explosion 239
                }
            } break;
        }

        this.UpdateBellyPhysics();
    }

    Idle()
    {
        this.pos = new V2(200, 280);
        this.angle = 0;
        this.timer = 0;
        this.hitConfirm = false;
        this.state = PlayerStateIdle;
    }

    Intro()
    {
        this.pos.Set(200, -280);
        this.timer = 22;
        this.state = PlayerStateIntro;
        zzfx(...[,,806,.05,.08,.47,2,.62,-2.8,3.1,,,,,,,.04,.63,.01]); // Jump 229
    }

    BellyBounce()
    {
        this.hitConfirm = false;
        this.bellyOffset.xLast = 0;
        this.bellyOffset.yLast = 0;
        this.bellyOffset.x = 15;
        this.bellyOffset.y = 15;
        this.timer = BellyBounceTime;
        this.state = PlayerStateBelly;

        zzfx(...[,,596,.05,,.09,1,.18,,-2.7,-4,.17,.11,,-2.1,,.1,,.02]); // Blip 48
    }

    IsBellyBounceAttacking()
    {
        return (this.state == PlayerStateBelly) &&
               ((this.timer >= BellyBounceTime - BellyBounceAttackTime));// || (this.hitConfirm && this.timer >= 7));
    }

    OnBounce(enemy)
    {
        //this.timer = 15;
        this.hitConfirm = true;
        this.bellyOffset.xLast = 0;
        this.bellyOffset.yLast = 0;
        this.bellyOffset.x = 15;
        this.bellyOffset.y = 15;
        this.score++;

        let highScore = localStorage.getItem("bigchamp.highscore");
        if (highScore == null || highScore < this.score)
        {
            localStorage.setItem("bigchamp.highscore", this.score);
            this.isHighScore = true;
        }

        zzfx(...[,,235,,,.12,,.15,-4.2,-6.7,,,,1.4,,.1,,.85,.04]); // Hit 87

        if (this.score % 10 == 0)
        {
            zzfx(...[,,714,.38,.15,1,4,4.72,.7,.2,,,,.1,.9,.2,,.89]); // Explosion 255
        }
    }

    OnHit(enemy)
    {
        if (this.health > 0)
        {
            this.timer = 15;
            this.health--;
            this.timer = PlayerHitTime;
            this.state = PlayerStateHit;
            this.bellyOffset.x = 5;
            this.bellyOffset.y = 5;

            zzfx(...[,,272,,,.16,3,2.99,-1.7,1.6,,,,1.4,-0.7,.2,,.68,.03]); // Hit 54
        }
    }

    UpdateBellyPhysics()
    {
        // Super duper simple one-pointer verlet integration

        // Simulate
        let vx = (this.bellyOffset.x - this.bellyOffset.xLast);
        let vy = (this.bellyOffset.y - this.bellyOffset.yLast);
        this.bellyOffset.xLast = this.bellyOffset.x;
        this.bellyOffset.yLast = this.bellyOffset.y;
        this.bellyOffset.x += vx;
        this.bellyOffset.y += vy;

        // Constrain
        let d = this.bellyOffset.Len();
        if (d > 0)
        {
            let restLength = 0;
            let springRatio = 0.2;
            let moveMul = (d - restLength) / d;
            let move = new V2(this.bellyOffset.x*moveMul*springRatio, this.bellyOffset.y*moveMul*springRatio);
            this.bellyOffset.SubV(move);
        }
    }

    Draw()
    {
        PushMatrix(this.pos.x, this.pos.y, this.angle);

        // What follows is the DUMBEST way to draw the player...

        this.skinColor = "#DC774F";
        this.outlineColor = "#A3583A";
        this.bootColor = "#111";
        this.outfitColor = "#111";
        this.eyeColor = "#FFF";
        this.pupilColor = "#000";
        this.mouthColor = "#500";
        this.lacesColor = "#FFF";

        switch (this.state)
        {
            case PlayerStateIdle:
            {
                this.DrawLeg(66, 24, 0);        // Left leg
                this.DrawBody(0, 0, 0);         // Body
                this.DrawHead(-10, -90, 0);     // Head
                this.DrawOutfit(0, 0, 0);       // Outfit
                this.DrawLeg(-20, 24, 0);       // Right leg
                this.DrawArm(-68, -20, 0);      // Arm
            } break;

            case PlayerStateBelly:
            {
                this.DrawLeg(90, 35, 30);       // Left leg
                this.DrawBody(40, -20, -15);    // Body
                this.DrawHead(-5, -100, -40);   // Head
                this.DrawOutfit(40, -20, -15);  // Outfit
                this.DrawLeg(25, 35, 30);       // Right leg
                this.DrawArm(-30, -22, 10);     // Arm
            } break;

            case PlayerStateHit:
            {
                this.DrawLeg(26, 14, -30);        // Left leg
                this.DrawBody(-20, 5, 0);         // Body
                this.DrawHead(-10, -80, 20);     // Head
                this.DrawOutfit(-20, 5, 0);       // Outfit
                this.DrawLeg(-50, 24, -35);       // Right leg
                this.DrawArm(-88, -15, -50);      // Arm
            } break;

            case PlayerStateDead:
            {
                this.DrawLeg(-6, 24, -60);        // Left leg
                this.DrawBody(-40, 15, 0);         // Body
                this.DrawHead(-20, -60, 40 + Math.sin(Date.now()*0.001)*5);     // Head
                this.DrawOutfit(-40, 15, 0);       // Outfit
                this.DrawLeg(-80, 42, -60);       // Right leg
                this.DrawArm(-108, -5, -20);      // Arm
            } break;

            case PlayerStateIntro:
            {
                this.DrawLeg(66, 24, -30);        // Left leg
                this.DrawBody(0, 0, 0);         // Body
                this.DrawHead(-10, -90, 0);     // Head
                this.DrawOutfit(0, 0, 0);       // Outfit
                this.DrawLeg(-20, 45, 30);       // Right leg
                this.DrawArm(-64, -25, 30);      // Arm
            } break;
        }

        PopMatrix();
    }

    DrawLeg(x, y, angle)
    {
        PushMatrix(x + this.bellyOffset.x*0.5, y + this.bellyOffset.y*0.5, angle);
        DrawCircle(-10, 8, 20, this.skinColor);     // Rounded top of leg
        DrawRect(-20, 46, 40, 60, this.skinColor);  // Leg
        DrawRect(-20, 56, 42, 42, this.bootColor);  // Boot
        DrawRect(-10, 45, 14, 4, this.lacesColor);  // Top lace
        DrawRect(-10, 55, 14, 4, this.lacesColor);  // Middle lace
        DrawRect(-10, 65, 14, 4, this.lacesColor);  // Bottom lace
        PopMatrix();
    }

    DrawBody(x, y, angle)
    {
        PushMatrix(x + this.bellyOffset.x, y + this.bellyOffset.y, angle);
        DrawCircle(0, 0, 80 + this.bellyOffset.x*1, this.skinColor, Math.PI, Math.PI*2);   // Torso
        DrawCircle(24, -10, 6, this.outlineColor);  // Right nipple
        DrawCircle(-4, -10, 6, this.outlineColor);  // Left nipple
        PopMatrix();
    }

    DrawOutfit(x, y, angle)
    {
        PushMatrix(x + this.bellyOffset.x, y + this.bellyOffset.y, angle);
        DrawBezierLine(-46, -58, -20, 20, -10, -20, -10, 20, this.outfitColor, 20); // Shoulder strap
        DrawCircle(-32, -9,28, this.outlineColor); // Armpit shadow
        DrawCircle(0, 0, 80 + this.bellyOffset.x*1, this.outfitColor, 0, Math.PI); // Outfit bottom
        PopMatrix();
    }

    DrawArm(x, y, angle)
    {
        PushMatrix(x + this.bellyOffset.x*0.5, y + this.bellyOffset.y*0.5, angle);
        DrawCircle(0, 0, 28, this.skinColor);   // Upper
        DrawCircle(-6, 16, 20, this.skinColor); // Lower
        PopMatrix();
    }

    DrawHead(x, y, angle)
    {
        PushMatrix(x + this.bellyOffset.x*0.5, y + this.bellyOffset.y*0.5, angle);

        DrawRect(0, 0, 70, 70, this.skinColor); // Head

        switch (this.state)
        {
            case PlayerStateIdle:
            case PlayerStateIntro:
            {
                DrawRect(4, 0, 12, 20, this.eyeColor);   // Left eye
                DrawRect(22, 0, 12, 20, this.eyeColor);   // Right eye
                DrawRect(6, 4, 8, 12, this.pupilColor);  // Left pupil
                DrawRect(24, 4, 8, 12, this.pupilColor);  // Right pupil
                DrawRect(10, 20, 40, 4, this.mouthColor);   // Mouth
            } break;

            case PlayerStateBelly:
            {
                DrawRect(4, 0, 12, 20, this.eyeColor);   // Left eye
                DrawRect(22, 0, 12, 20, this.eyeColor);   // Right eye
                DrawRect(5, 4, 10, 12, this.pupilColor);  // Left pupil
                DrawRect(23, 4, 10, 12, this.pupilColor);  // Right pupil
                DrawRect(10, 20, 40, 10, this.mouthColor);   // Mouth
            } break;

            case PlayerStateHit:
            {
                DrawRect(4, 0, 12, 20, this.eyeColor);   // Left eye
                DrawRect(22, 0, 12, 20, this.eyeColor);   // Right eye
                DrawRect(0, 4, 10, 12, this.pupilColor);  // Left pupil
                DrawRect(28, -3, 10, 12, this.pupilColor);  // Right pupil
                DrawRect(10, 20, 40, 10, this.mouthColor);   // Mouth
            } break;

            case PlayerStateDead:
            {
                DrawRect(4, 0, 4, 20, this.pupilColor, 45);   // Left eye (x)
                DrawRect(4, 0, 4, 20, this.pupilColor, -45);   // Left eye (x)
                DrawRect(22, 0, 4, 20, this.pupilColor, 45);   // Right eye (x)
                DrawRect(22, 0, 4, 20, this.pupilColor, -45);   // Right eye (x)
                DrawRect(10, 20, 40, 10, this.mouthColor);   // Mouth
            } break;
        }

        PopMatrix();
    }
}
let EnemyStateMoveToPlayer = 0;
let EnemyStateBounceOff = 1;

let EnemyStyleLowerShorts = 0;
let EnemyStyleLowerPants = 1;

let EnemyStyleUpperNone = 0;
let EnemyStyleUpperTankTop = 1;

let EnemyStyleHeadBald = 0;
let EnemyStyleHeadShortHair = 1;
let EnemyStyleHeadLongHair = 2;
let EnemyStyleHeadMask = 3;

let EnemyFrameIdle = 0;
let EnemyFrameRun01 = 1;
let EnemyFrameRun02 = 2;
let EnemyFrameRun03 = 3;
let EnemyFrameBounceOff = 4;
let EnemyFrameSpin = 5;
let EnemyFrameJump = 6;

let EnemyAnimIdle = { frames: [EnemyFrameIdle], counts: [1] };
let EnemyAnimRun = { frames: [EnemyFrameRun01, EnemyFrameRun02, EnemyFrameRun03, EnemyFrameRun02], counts: [9, 9, 9, 9] };
let EnemyAnimBounceOff = { frames: [EnemyFrameBounceOff], counts: [1] };
let EnemyAnimSpin = { frames: [EnemyFrameSpin], counts: [1] };
let EnemyAnimJump = { frames: [EnemyFrameJump], counts: [1] };

class Enemy
{
    constructor()
    {
        this.pos = new V2(840, 310);
        this.vel = new V2(0, 0);
        this.state = EnemyStateMoveToPlayer;
        this.angle = 0;
        this.color = "000";
        this.bounceThreshold = player.pos.x + 90;
        this.damageThreshold = player.pos.x - 0;
        this.bounceOffAngleAdj = 0;

        // Rendering vars
        this.styleLower = EnemyStyleLowerShorts;
        this.styleUpper = EnemyStyleUpperTankTop;
        this.styleHead = EnemyStyleHeadMask;
        this.skinColor = "#DC774F";
        this.outlineColor = "#A3583A";
        this.outfitColor = "#B00";
        this.bootColor = "#B00";
        this.lacesColor = "#FFF";
        this.eyeColor = "#000";
        this.hairColor = "#663508";
        this.maskColor1 = "#B00";
        this.maskColor2 = "#FFF";
        this.chairColor = "#666";

        // Animation
        this.frame = EnemyFrameIdle;
        this.SetAnim(EnemyAnimRun);
    }

    Tick()
    {
        switch(this.state)
        {
            case EnemyStateMoveToPlayer:
            {
                this.MoveToPlayer();

                if (this.pos.x <= this.bounceThreshold && player.IsBellyBounceAttacking())
                {
                    this.BounceOff();
                }
                else if (this.pos.x <= this.damageThreshold && !player.IsBellyBounceAttacking())
                {
                    player.OnHit(this);
                    this.KillSelf();
                    SpawnParticle(this.pos.x - Math.random()*20, this.pos.y - Math.random()*20, ParticleTypeHit);
                }
            } break;

            case EnemyStateBounceOff:
            {
                this.pos.AddV(this.vel);
                this.vel.y += 0.8;
                this.angle += this.bounceOffAngleAdj;

                if (this.pos.y > gameHeight)
                {
                    this.KillSelf();
                }
            } break;
        }

        this.Animate();
    }

    Animate()
    {
        this.curAnimFrameCount++;
        if (this.curAnimFrameCount >= this.anim.counts[this.curAnimFrame])
        {
            this.curAnimFrameCount = 0;
            this.curAnimFrame++;
            if (this.curAnimFrame >= this.anim.frames.length)
            {
                this.curAnimFrame = 0;
            }
        }

        this.frame = this.anim.frames[this.curAnimFrame];
    }

    SetAnim(anim)
    {
        this.anim = anim;
        this.curAnimFrameCount = 0;
        this.curAnimFrame = 0;
    }

    MoveToPlayer()
    {
        this.pos.AddV(this.vel);
    }

    BounceOff()
    {
        this.vel.Set(7 + Math.random()*5.0, -11 - Math.random()*4.0);
        this.bounceOffAngleAdj = 4 + Math.random()*5;
        if (Math.random() < 0.4)
        {
            this.vel.x = -this.vel.x;
            this.vel.y *= 1.5;
            this.bounceOffAngleAdj = -this.bounceOffAngleAdj;
        }
        this.state = EnemyStateBounceOff;
        this.SetAnim(EnemyAnimBounceOff);
        
        player.OnBounce(this);
    }

    KillSelf()
    {
        // Todo make global
        let idx = objs.indexOf(this);
        if (idx > -1)
        {
            objs.splice(idx, 1);
        }
    }

    IsInBounceZone()
    {
        return this.state == EnemyStateMoveToPlayer && this.pos.x <= this.bounceThreshold + 20;
    }

    Draw()
    {
        PushMatrix(this.pos.x, this.pos.y, this.angle);
        switch (this.frame)
        {
            case EnemyFrameIdle:
            {
                this.DrawLeg(-23, 43, 0);   // Right leg
                this.DrawBody(0, 0, 0);     // Body
                this.DrawHead(-10, -60, 0); // Head
                this.DrawOutfit(0, 0, 0);   // Outift
                this.DrawLeg(27, 43, 0);    // Left leg
                this.DrawArm(20, -15, 0);      // Arm
            } break;

            case EnemyFrameRun01:
            {
                PushMatrix(0, 0, -5);
                this.DrawLeg(-23, 43, 20);   // Right leg
                this.DrawArm(-30, -25, -55);      // Arm
                this.DrawBody(0, 0, 0);     // Body
                this.DrawHead(-10, -60, 0); // Head
                this.DrawOutfit(0, 0, 0);   // Outift
                this.DrawLeg(10, 43, -40);    // Left leg
                this.DrawArm(20, -25, 55);      // Arm
                PopMatrix();
            } break;

            case EnemyFrameRun02:
            {
                PushMatrix(0, -15, -5);
                this.DrawLeg(-23, 43, 0);   // Right leg
                this.DrawArm(-30, -25, 0);      // Arm
                this.DrawBody(0, 0, 0);     // Body
                this.DrawHead(-10, -60, 0); // Head
                this.DrawOutfit(0, 0, 0);   // Outift
                this.DrawLeg(10, 43, 0);    // Left leg
                this.DrawArm(20, -25, 0);      // Arm
                PopMatrix();
            } break;

            case EnemyFrameRun03:
            {
                PushMatrix(0, 0, -5);
                this.DrawLeg(-23, 43, -20);   // Right leg
                this.DrawArm(-30, -25, 55);      // Arm
                this.DrawBody(0, 0, 0);     // Body
                this.DrawHead(-10, -60, 0); // Head
                this.DrawOutfit(0, 0, 0);   // Outift
                this.DrawLeg(10, 43, 40);    // Left leg
                this.DrawArm(20, -25, -55);      // Arm
                PopMatrix();
            } break;

            case EnemyFrameBounceOff:
            {
                PushMatrix(0, 0, -5);
                this.DrawLeg(-23, 43, 70);   // Right leg
                this.DrawArm(-30, -25, 120);      // Arm
                this.DrawBody(0, 0, 0);     // Body
                this.DrawHead(-10, -60, 0); // Head
                this.DrawOutfit(0, 0, 0);   // Outift
                this.DrawLeg(10, 43, -70);    // Left leg
                this.DrawArm(20, -25, -120);      // Arm
                PopMatrix();
            } break;

            case EnemyFrameSpin:
            {
                PushMatrix(0, 0, -5);
                this.DrawLeg(-23, 33, 120);   // Right leg
                this.DrawArm(-30, -25, 45);      // Arm
                this.DrawBody(0, 0, 0);     // Body
                this.DrawHead(-15, -55, -20); // Head
                this.DrawOutfit(0, 0, 0);   // Outift
                this.DrawLeg(10, 33, 120);    // Left leg
                this.DrawArm(20, -25, 45);      // Arm
                PopMatrix();
            } break;

            case EnemyFrameJump:
            {
                PushMatrix(0, 0, -5);
                this.DrawLeg(-23, 33, 30);   // Right leg
                this.DrawArm(-30, -25, 110);      // Arm
                this.DrawBody(0, 0, 0);     // Body
                this.DrawHead(-10, -60, 5); // Head
                this.DrawOutfit(0, 0, 0);   // Outift
                this.DrawLeg(10, 33, -30);    // Left leg
                this.DrawArm(20, -25, 45);      // Arm
                this.DrawChair(-80, -60, 0);
                PopMatrix();
            } break;
        }
        PopMatrix();

        // DEBUG
        //DrawLine(this.bounceThreshold, 0, this.bounceThreshold, gameHeight, "#0F0");
        //DrawLine(this.damageThreshold, 0, this.damageThreshold, gameHeight, "#F00");
    }

    DrawBody(x, y, angle)
    {
        PushMatrix(x, y, angle);
        DrawRect(-5, 0, 60, 80, this.skinColor);   // Torso
        PopMatrix();
    }

    DrawOutfit(x, y, angle)
    {
        PushMatrix(x, y, angle);
        switch (this.styleLower)
        {
            case EnemyStyleLowerShorts:
            case EnemyStyleLowerPants:
            {
                DrawRect(-5, 35, 60, 30, this.outfitColor);   // Shorts
            } break;
        }

        switch (this.styleUpper)
        {
            case EnemyStyleUpperTankTop:
            {
                DrawRect(-5, 0, 60, 40, this.outfitColor);
                DrawRect(-25, -20, 10, 40, this.outfitColor);
                DrawRect(0, -20, 10, 40, this.outfitColor);
            } break;
        }

        PopMatrix();
    }

    DrawLeg(x, y, angle)
    {
        PushMatrix(x, y, angle);

        let legColor = this.skinColor;

        // Use pants?
        switch(this.styleLower)
        {
            case EnemyStyleLowerPants:
            {
                legColor = this.outfitColor;
            } break;
        }

        DrawCircle(0, 0, 13, legColor);     // Rounded top of leg
        DrawRect(0, 15, 26, 30, legColor);  // Leg
        DrawRect(0, 25, 26, 25, this.bootColor);  // Boot
        DrawRect(-5, 20, 10, 4, this.lacesColor);  // Top lace
        DrawRect(-5, 27, 10, 4, this.lacesColor);  // Middle lace
        //DrawRect(-5, 34, 10, 4, this.lacesColor);  // Bottom lace

        PopMatrix();
    }

    DrawHead(x, y, angle)
    {
        PushMatrix(x, y, angle);

        DrawRect(0, 0, 50, 50, (this.styleHead == EnemyStyleHeadMask) ? this.maskColor1 : this.skinColor); // Head

        switch(this.styleHead)
        {
            case EnemyStyleHeadShortHair:
            {
                DrawRect(0, -20, 50, 10, this.hairColor);   // Top hair
                DrawRect(20, -15, 10, 20, this.hairColor);   // Back hair
            } break;

            case EnemyStyleHeadLongHair:
            {
                DrawRect(0, -20, 50, 10, this.hairColor);   // Top hair
                DrawRect(20, -15, 10, 20, this.hairColor);   // Back hair
                DrawRect(30, -5, 10, 20, this.hairColor);   // Back hair 2
                DrawRect(38, -5, 10, 25, this.hairColor);   // Back hair 2
            } break;

            case EnemyStyleHeadMask:
            {
                DrawRect(-3, 0, 32, 20, this.maskColor2); // Mask color around eyes
            } break;
        }

        DrawRect(-12, 0, 9, 15, this.eyeColor);   // Left eye
        DrawRect(5, 0, 9, 15, this.eyeColor);   // Right eye

        PopMatrix();
    }

    DrawArm(x, y, angle)
    {
        PushMatrix(x, y, angle);
        DrawCircle(-1.5, 1.5, 19, this.outlineColor); // Armpit shadow
        DrawCircle(-1.5, 13.5, 12, this.outlineColor); // Armpit shadow
        DrawCircle(0, 0, 19, this.skinColor);   // Upper
        DrawCircle(0, 12, 12, this.skinColor); // Lower
        PopMatrix();
    }

    DrawChair(x, y, angle)
    {
        PushMatrix(x, y, angle);
        
        PushMatrix(-2, 2, 0);
        DrawRect(0, 0, 60, 35, "#000");
        DrawRect(0, -40, 60, 20, "#000");
        DrawRect(-25, 0, 10, 75, "#000");
        DrawRect(25, 0, 10, 75, "#000");
        PopMatrix();

        DrawRect(0, 0, 60, 35, this.chairColor);
        DrawRect(0, -40, 60, 20, this.chairColor);
        DrawRect(-25, 0, 10, 75, this.chairColor);
        DrawRect(25, 0, 10, 75, this.chairColor);
        PopMatrix();
    }
}
class Enemy_SlowRun extends Enemy
{
    constructor()
    {
        super();
        this.vel.Set(-12, 0);

        this.styleLower = EnemyStyleLowerShorts;
        this.styleUpper = EnemyStyleUpperNone;
        this.styleHead = EnemyStyleHeadShortHair;
        this.skinColor = "#DC774F";
        this.outlineColor = "#A3583A";
        this.outfitColor = "#B00";
        this.bootColor = "#B00";
        this.lacesColor = "#FFF";
        this.eyeColor = "#000";
        this.hairColor = "#663508";
        this.SetAnim(EnemyAnimRun);
    }
}
class Enemy_FastRun extends Enemy
{
    constructor()
    {
        super();
        this.vel.Set(-18, 0);
        
        this.styleLower = EnemyStyleLowerPants;
        this.styleUpper = EnemyStyleUpperTankTop;
        this.styleHead = EnemyStyleHeadBald;
        this.skinColor = "#D8A79E";
        this.outlineColor = "#AA8077";
        this.outfitColor = "#025930";
        this.bootColor = "#025930";
        this.lacesColor = "#FFF";
        this.eyeColor = "#000";
        this.hairColor = "#663508";
        this.SetAnim(EnemyAnimRun);
    }
}
class Enemy_SlowBounce extends Enemy
{
    constructor()
    {
        super();
        this.color = "#00F";
        this.pos.Set(this.pos.x + 140, this.pos.y);
        this.vel.Set(-10, -16);

        this.styleLower = EnemyStyleLowerShorts;
        this.styleUpper = EnemyStyleUpperNone;
        this.styleHead = EnemyStyleHeadMask;
        this.skinColor = "#CF7B41";
        this.outlineColor = "#87502B";
        this.outfitColor = "#CCC";
        this.bootColor = "#CCC";
        this.lacesColor = "#000";
        this.eyeColor = "#000";
        this.maskColor1 = "#CCC";
        this.maskColor2 = "#BB0";
        this.SetAnim(EnemyAnimSpin);

        this.isBouncing = true;
    }

    MoveToPlayer()
    {
        this.vel.y += 0.8;

        super.MoveToPlayer();

        if (this.pos.y >= 296)
        {
            this.pos.y = 296;
            this.vel.y = -16;

            if (this.pos.x < gameWidth)
            {
                this.isBouncing = false;
                this.SetAnim(EnemyAnimJump);
                this.angle = -30;
                zzfx(...[,,144,.01,,.12,1,1.53,9.2,,,,,,,.1,,.62,.04]); // Jump 175
            }
        }

        if (this.isBouncing)
        {
            this.angle -= 10;
        }
    }
}
class Enemy_DelayedAttack extends Enemy
{
    constructor()
    {
        super();
        this.vel.Set(-12, 0);
        this.subState = 0;
        this.subTimer = 0;

        this.styleLower = EnemyStyleLowerShorts;
        this.styleUpper = EnemyStyleUpperTankTop;
        this.styleHead = EnemyStyleHeadLongHair;
        this.skinColor = "#A86741";
        this.outlineColor = "#6D432A";
        this.outfitColor = "#00B";
        this.bootColor = "#00B";
        this.lacesColor = "#FFF";
        this.eyeColor = "#000";
        this.hairColor = "#111";
        this.SetAnim(EnemyAnimRun);
    }

    MoveToPlayer()
    {
        super.MoveToPlayer();

        switch (this.subState)
        {
            case 0:
            {
                if (this.pos.x <= 640)
                {
                    this.pos.x = 640;
                    this.vel.x = 0;
                    this.subState = 1;
                    this.subTimer = 40;
                }
            } break;

            case 1:
            {
                if (Math.floor(this.subTimer / 10) % 2 == 0)
                {
                    this.pos.Set(640, 296);
                    this.angle = 0;
                }
                else
                {
                    this.pos.Set(640, 284);
                    this.angle = this.subTimer > 20 ? -15 : 15;
                }

                this.subTimer--;
                if (this.subTimer == 0)
                {
                    this.subState = 2;
                    this.pos.y = 296;
                    this.vel.x = -20;
                }
            } break;

            case 2:
            {

            } break;
        }
    }
}
class Enemy_LongJump extends Enemy
{
    constructor()
    {
        super();
        this.color = "#FF0";
        this.pos.Set(this.pos.x + 80, this.pos.y);
        this.vel.Set(-20, -20);
        this.angle = -10;

        this.styleLower = EnemyStyleLowerShorts;
        this.styleUpper = EnemyStyleUpperTankTop;
        this.styleHead = EnemyStyleHeadMask;
        this.skinColor = "#C17920";
        this.outlineColor = "#935C19";
        this.outfitColor = "#6D59C8";
        this.bootColor = "#6D59C8";
        this.lacesColor = "#FFF";
        this.eyeColor = "#000";
        this.hairColor = "#663508";
        this.maskColor1 = "#6D59C8";
        this.maskColor2 = "#FFF";
        this.SetAnim(EnemyAnimSpin);
    }

    MoveToPlayer()
    {
        this.vel.y += 1.0;

        super.MoveToPlayer();

        if (this.pos.y >= 296)
        {
            this.pos.y = 296;
            this.vel.y = -18;
        }

        this.angle -= 10;
    }
}
let player = new Player();

let objs = [];
objs.push(player);

// Create a song
let song = [[[,0,130.81,,2,,,,,,,,,,,,,0.7,0.05],[2,0,261.62,,2,,1,,,,,,0.2,,,,0.01,0.8,0.1],[4,0,523.25,,2,,1,,,,,,0.2,,,,0.01,0.5,0.01],[,0,261.62,0.1,1,0.5,,,,,,,,1,,,,0.5,0.1],[1,0,65.4,0.02,1,,,0.1,,,,,0.2,,,,,0.4,0.05],[,0,65.4,0.05,0.3,0.4,2,0.4,,,,,,0.2,,0.06,,0.7,0.05],[3,0,65.4,,1,,1,2,,,,,0.2,,,0.1,0.2,0.2,0.1,0.8],[,0,84,,,0.1,,0.7,,,,0.5,,6.7,1,0.05],[,0,2200,,,0.04,3,2,,,800,0.02,,4.8,,0.01,0.1],[0.8,0,2100,,,0.3,3,3,,,-400,,,2],[,0,360,,,0.12,2,2,,,,,,9,,0.1],[3,0,130.81,,0.5,0.5,,2,,,,,0.01,,,,0.2,0.5,0.1,0.4],[,,1046.5,,,0.05,,27,13,,,0.3],[,0,60,0.05,,0.06,3,0.7,2,-24,,,,,,,0.01],[,0,1046.5,,0.01,,1,,,,523.25,0.03,,,,0.09,0.1],[,0,261.62,0.01,1,,,,-32,,,,0.2,,,0.2,0.01,,,1]],[[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[8,0,,,32,0,0,,32,,0,,32,,0,,32,],[9,0,,,,,32,-1,,,,,,,32,-1,,]],[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[8,0,,,32,0,0,,32,,0,,32,,0,,32,],[9,0,,,,,32,-1,,,,,,,32,-1,,],[5,0,16,-1,16,16,20,-1,16,-1,20,-1,16,-1,20,-1,21,-1]],[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[8,0,,,32,0,0,,32,,0,,32,,0,,32,],[9,0,,,,,32,-1,,,,,,,32,-1,,],[5,0,16,-1,16,-1,0,0,16,16,16,-1,16,-1,0,0,0,0],[10,0,35,0,0,0,0,0,35,35,35,0,0,0,35,0,35,0]],[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[8,0,,,32,0,0,,32,,0,,32,,0,,32,],[9,0,,,,,32,-1,,,,,,,32,-1,,],[5,0,16,-1,19,-1,21,19,21,19,-1,23,22,21,16,-1,16,-1]],[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[8,0,,,32,0,0,,32,,0,,32,,0,,32,],[9,0,,,,,32,-1,,,,,,,32,-1,,],[5,0,22,0,0,,21,0,0,0,19,0,0,21,16,-1,16,-1]],[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[8,0,,,32,0,0,,32,,0,,32,,0,,32,],[9,0,,,,,32,-1,,,,,,,32,-1,,],[5,0,16,-1,16,16,20,-1,16,-1,20,-1,16,-1,20,-1,21,-1],[10,0,35,0,0,0,0,0,35,35,35,0,0,0,35,0,35,0]],[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[9,0,,,,,32,-1,,,,,,,32,-1,,],[5,0,16,-1,19,-1,21,19,21,19,-1,23,22,21,16,-1,16,-1]],[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[9,0,,,,,32,-1,,,,,,,32,-1,,],[5,0,16,-1,16,-1,0,0,16,16,16,-1,16,-1,0,0,0,0],[10,0,35,0,0,0,0,0,35,35,35,0,0,0,35,0,35,0]],[[7,0,32,0,0,0,32,0,0,0,32,0,0,0,32,0,0,0],[8,0,,,32,0,0,,32,,0,,32,,0,,32,],[9,0,,,,,32,-1,,,,,,,32,-1,,],[5,0,16,-1,16,-1,0,0,16,16,16,-1,16,-1,0,0,0,0]]],[0,0,1,1,1,1,2,2,3,2,4,2,2,3,2,4,5,5,5,5,6,7,6,7,1,1,1,1,5,4,4,8],125];
let mySongData = zzfxM(...song);
let myAudioNode = undefined;
let musicOn = true;
let sfxOn = true;

let TouchState = (reason) =>
{
    switch (reason)
    {
        case Tick:
        {
            if (touch.down)
            {
                myAudioNode = zzfxP(...mySongData);
                myAudioNode.loop = true;
                tkNextState = MainMenu;
            }
        } break;

        case Draw:
        {
            DrawText("Tap", gameWidth*0.5, gameHeight*0.5, 36, "#FFF", 0, "Arial", "Bold", "center", "center", 12);
        } break;
    }
}

let MainMenu = (reason) =>
{
    switch (reason)
    {
        case Enter:
        {
            isFrenzy = false;
            setTimeout(() => {zzfx(...[,0,587,,,.28,3,.07,,,,,,,,.1,,.62,.1]);}, 0);
            setTimeout(() => {zzfx(...[,0,587,,,.28,3,.07,,,,,,,,.1,,.62,.1]);}, 250);
            setTimeout(() => {zzfx(...[,0,587,,,.28,3,.07,,,,,,,,.1,,.62,.1]);}, 500);
        } break;

        case Tick:
        {
            if (touch.down)
            {
                if (touch.x >= actualWidth*0.78 && touch.y >= actualHeight*0.80)
                {
                    let oldSfxOn = sfxOn;
                    sfxOn = true;
                    zzfx(...[,,523,.01,,.07,3,.11,46,10,,,,,,.1,.03,.32,.01]); // Blip 11
                    sfxOn = oldSfxOn;

                    if (sfxOn && musicOn)
                    {
                        sfxOn = false;
                        musicOn = false;
                        myAudioNode.stop();
                    }
                    else if (!sfxOn && !musicOn)
                    {
                        sfxOn = true;
                        musicOn = false;
                    }
                    else if (sfxOn)
                    {
                        sfxOn = false;
                        musicOn = true;
                        myAudioNode = zzfxP(...mySongData); myAudioNode.loop = true;
                    }
                    else
                    {
                        sfxOn = true;
                        musicOn = true;
                    }
                }
                else
                {
                    tkNextState = IntroState;
                }
            }
        } break;

        case Draw:
        {
            DrawBackground();
            objs.forEach(o => o.Draw());
            let bounceIdx = Date.now() % 400;
            let color = "#FF6A00";
            if (bounceIdx < 75)
            {
                color = "#FFD800";
            }
            else if (bounceIdx < 150)
            {
                color = "#FFA000";
            }
            let size = 90 + Math.abs(Math.sin((bounceIdx / 400)*Math.PI))*1.5;
            DrawText("Big Champ", gameWidth*0.5, gameHeight*0.3, size, "#FFF", 0, "Arial", "Bold", "center", "center", 20, color);
            DrawText("Big Champ", gameWidth*0.5, gameHeight*0.3, size, "#FFF", 0, "Arial", "Bold", "center", "center", 12, "#000");
            DrawText("Weighing in at 404 lbs!", gameWidth*0.5, gameHeight*0.45, 32, "#FFF", 0, "Arial", "Bold", "center", "center", 9, "#000");
            if (Date.now()%800 < 600)
            {
                DrawText("- Tap To Start -", gameWidth*0.5, gameHeight*0.85, 32, "#FFD800", 0, "Arial", "Bold", "center", "center", 9);
            }

            let sfxDisplay = "SFX: " + (sfxOn ? "Yes" : "No");
            DrawText(sfxDisplay, gameWidth - 20, gameHeight*0.9, 24, "#FFF", 0, "Arial", "Bold", "right", "center", 7);
            let musicDisplay = "MUSIC: " + (musicOn ? "Yes" : "No");
            DrawText(musicDisplay, gameWidth - 20, gameHeight*0.97, 24, "#FFF", 0, "Arial", "Bold", "right", "center", 7);

        } break;
    }
}

let IntroState = (reason) =>
{
    switch (reason)
    {
        case Enter:
        {
            player.Reset();
            player.Intro();
        } break;

        case Tick:
        {
            objs.forEach(o => o.Tick());
            if (player.state == PlayerStateIdle)
            {
                tkNextState = GameState
            }
        } break;

        case Draw:
        {
            DrawBackground();
            objs.forEach(o => o.Draw());
            DrawHud();
        } break;
    }
}

let GameState = (reason) =>
{
    switch (reason)
    {
        case Enter:
        {
            setTimeout(CreateEnemy, 2000);
        } break;

        case Tick:
        {
            objs.forEach(o => o.Tick());
        } break;

        case Draw:
        {
            DrawBackground();
            objs.forEach(o => o.Draw());
            DrawHud();
            DrawParticles();
        } break;
    }
}

let gameOverState = 0;
let gameOverTimer;
let GameOver = (reason) =>
{
    switch (reason)
    {
        case Enter:
        {
            clearTimeout(enemyTimer);
            gameOverState = 0;
            gameOverTimer = setInterval(() =>
            {
                if (gameOverState < 10)
                {
                    gameOverState++;
                    if (gameOverState == 2 || gameOverState == 4 || gameOverState == 6)
                    {
                        zzfx(...[,,1983,,,.06,,.53,-68,,,,,,9,.2]); // Blip 664
                    }
                    else if (gameOverState == 8 && player.isHighScore)
                    {
                        zzfx(...[,,703,.02,.03,.19,,.92,-8,,,,,,,.1,,.63,.07]); // Jump 813
                        setTimeout(() => {zzfx(...[,,703,.02,.03,.19,,.92,-8,,,,,,,.1,,.63,.07]);}, 200);
                        setTimeout(() => {zzfx(...[,,703,.02,.03,.19,,.92,-8,,,,,,,.1,,.63,.07]);}, 400);
                        setTimeout(() => {zzfx(...[,,511,.31,.1,1.75,4,2.74,.6,.6,,,,.7,,.2,,.75,.09]);}, 600);
                    }
                }
            }, 250);
        } break;

        case Exit:
        {
            clearInterval(gameOverTimer);
        } break;

        case Tick:
        {
            if (gameOverState >= 8 && touch.down)
            {
                tkNextState = MainMenu;
            }

            objs.forEach(o => o.Tick());
        } break;

        case Draw:
        {
            DrawBackground();
            objs.forEach(o => o.Draw());
            DrawParticles();
            
            if (gameOverState >= 2)
            {
                DrawText("Game Over", gameWidth*0.5, gameHeight*0.3, 72, "#DB0000", 0, "Arial", "Bold", "center", "center", 12);
            }

            if (gameOverState >= 4)
            {
                DrawText("Eliminations: " + player.score, gameWidth*0.5, gameHeight*0.42, 36, "#FFF", 0, "Arial", "Bold", "center", "center", 8);
            }

            if (gameOverState >= 6)
            {
                let highScore = localStorage.getItem("bigchamp.highscore");
                if (highScore == null)
                {
                    highScore = 0;
                }
                DrawText("Best: " + highScore, gameWidth*0.5, gameHeight*0.52, 36, "#FFF", 0, "Arial", "Bold", "center", "center", 8);
            }
            
            if (gameOverState >= 8)
            {
                if (player.isHighScore)
                {
                    DrawText("New Best!", gameWidth*0.5, gameHeight*0.63, 36 + Math.abs(Math.sin(Date.now()*0.005))*10.0, "#04D84E", -10, "Arial", "Bold", "center", "center", 10);
                }
            }
        } break;
    }
}

let RenderTest = (reason) =>
{
    switch (reason)
    {
        case Enter:
        {
            player.Reset();
            objs.push(new Enemy_SlowRun());
            objs[1].pos.x = 600;
            objs[1].pos.y = 300;
            objs[1].SetAnim(EnemyAnimJump);
        } break;

        case Tick:
        {
            player.Tick();
            if (touch.down)
            {
                player.state++;
                if (player.state > PlayerStateDead)
                {
                    player.state = PlayerStateIdle;
                }
                //player.OnHit();

                SpawnParticle(gameWidth*0.5, gameHeight*0.5, ParticleTypeHit);
            }
            objs[1].Animate();
        } break;

        case Draw:
        {
            DrawBackground();
            objs.forEach(o => o.Draw());
            DrawHud();
            DrawParticles();
        } break;
    }
}

// Start initial state
tkNextState = TouchState;//RenderTest;//MainMenu;
