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
