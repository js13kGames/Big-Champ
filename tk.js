'use strict';

// Config ---------------------------------------------------------------------
let gameWidth = 800;
let gameHeight = 450;
let gameScale = 1.0;

// Constants ------------------------------------------------------------------
let Deg2Rad = Math.PI/180.0;
let Rad2Deg = 180.0/Math.PI;

// Initialization -------------------------------------------------------------
let canvas = document.createElement("canvas");
canvas.setAttribute("width", gameWidth);
canvas.setAttribute("height", gameHeight);
canvas.style.width = `${gameWidth * gameScale}px`;
canvas.style.height = `${gameHeight * gameScale}px`;
//canvas.style.backgroundColor = "#FFFFFFFF";
//canvas.style.imageRendering = "pixelated";
document.getElementById("game").appendChild(canvas);
let ctx = canvas.getContext('2d');
//ctx.imageSmoothingEnabled = false;

// Input (mouse/touch only!) --------------------------------------------------
let touch = { x: 0, y: 0, up: false, down: false, held: false, lastDown: 10000 }
window.addEventListener("mousedown", e => { touch.up = false, touch.down = true; touch.held = true; }, false);
window.addEventListener("mouseup", e => { touch.up = true; touch.down = false; touch.held = false }, false);
window.addEventListener("mousemove", e => { SetTouchPos(e); e.preventDefault(); }, false );
window.addEventListener("touchstart", e => { SetTouchPos(e.touches[0]); touch.up = false; touch.down = true; touch.held = true; e.preventDefault(); }, false );
window.addEventListener("touchend", e => { touch.up = true; touch.down = false; touch.held = false; e.preventDefault(); }, false );
window.addEventListener("touchcancel", e => { touch.up = true; touch.down = false; touch.held = false; e.preventDefault(); }, false );
window.addEventListener("touchmove", e => { SetTouchPos(e.touches[0]); e.preventDefault(); }, false );
let SetTouchPos = (e) =>
{
    touch.x = (e.pageX - canvas.offsetLeft) / gameScale;
    touch.y = (e.pageY - canvas.offsetTop) / gameScale;
}

// Rendering ------------------------------------------------------------------
let PushMatrix = (x, y, angle = 0) =>
{
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * Deg2Rad);
}

let PopMatrix = () =>
{
    ctx.restore();
}

let LoadSprite = (name) =>
{
    sprite = new Image();
    sprite.src = name;
    return sprite;
}

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

let DrawSprite = (image, x, y, xScale = 1.0, yScale = 1.0, angle = 0.0) =>
{
    let w = image.width * xScale;
    let h = image.height * yScale;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * Deg2Rad);
    ctx.drawImage(image, -w*0.5, -h*0.5, w, h);
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

// Audio (ZzFX: https://github.com/KilledByAPixel/ZzFX) -----------------------
// ZzFXMicro - Zuper Zmall Zound Zynth 
const ZZFX=new class{constructor(){this.x=this.CreateAudioContext(),this.volume=.3,this.sampleRate=44100,this.samples=0}Play(a){var t=a&&"object"==typeof a?this.SoundToArray(a):arguments;return t=this.BuildSamples(...t),this.PlaySamples(t)}PlaySamples(a){const t=this.x.createBuffer(1,a.length,this.sampleRate),n=this.x.createBufferSource();return t.getChannelData(0).set(a),n.buffer=t,n.connect(this.x.destination),n.start(),this.samples=a,n}BuildSamples(a=1,t=.05,n=220,e=0,r=0,o=.1,h=0,s=1,d=0,m=0,i=0,u=0,M=0,l=0,c=0,p=0,f=0,S=1,B=0){let x=2*Math.PI;var y=this.sampleRate;let C=d*=500*x/y**2,b=(0<c?1:-1)*x/4;t=n*=(1+2*t*Math.random()-t)*x/y,m*=500*x/y**3,c*=x/y,i*=x/y,u*=y,M*=y,y=(e=99+e*y)+(B*=y)+(r*=y)+(o*=y)+(f*=y);let v=[],A=0,P=0,R=0,T=1,w=0,g=0,k=0;for(;R<y;v[R++]=k)++g>100*p&&(g=0,k=A*n*Math.sin(P*c-b),k=h?1<h?2<h?3<h?Math.sin((k%x)**3):Math.max(Math.min(Math.tan(k),1),-1):1-(2*k/x%2+2)%2:1-4*Math.abs(Math.round(k/x)-k/x):Math.sin(k),k=(0<k?1:-1)*Math.abs(k)**s,k*=a*this.volume*(R<e?R/e:R<e+B?1-(R-e)/B*(1-S):R<e+B+r?S:R<y-f?(y-R-f)/o*S:0),k=f?k/2+(f>R?0:(R<y-f?1:(R-y)/f)*v[R-f|0]/2):k),A+=1-l+1e9*(Math.sin(R)+1)%2*l,P+=1-l+1e9*(Math.sin(R)**2+1)%2*l,n+=d+=m,T&&++T>u&&(n+=i,t+=i,T=0),M&&++w>M&&(n=t,d=C,w=1,T=T||1);return v}BuildRandomSound(a=1,t=1,n=.05){const e=Math.random()**3/4*a,r=Math.random()**3/4*a,o=Math.random()**3/4*a,h=e+r+o+(a*=Math.random()**3/4);return this.BuildSound(t,n,2e3*Math.random()**2,e,o,a,5*Math.random()|0,3*Math.random()**2,99*(.5>Math.random()?Math.random():0)**3*(.5>Math.random()&&Math.random()?1:-1),99*(.5>Math.random()?Math.random():0)**3*(.5>Math.random()&&Math.random()?1:-1),1e3*(.5>Math.random()?Math.random():0)**2*(.5>Math.random()&&Math.random()?1:-1),Math.random()**2*h,(.5>Math.random()?Math.random():0)*h,(.5>Math.random()?Math.random():0)**4,9*(.5>Math.random()?Math.random():0)**3*(.5>Math.random()&&Math.random()?1:-1),(.5>Math.random()?Math.random():0)**4,(.5>Math.random()?Math.random():0)**3/2,1-(.5>Math.random()?Math.random():0),r)}BuildSound(a=1,t=.05,n=220,e=0,r=0,o=.1,h=0,s=1,d=0,m=0,i=0,u=0,M=0,l=0,c=0,p=0,f=0,S=1,B=0){return{volume:a,randomness:t,frequency:n,attack:e,sustain:r,release:o,shape:h,shapeCurve:s,slide:d,deltaSlide:m,pitchJump:i,pitchJumpTime:u,repeatTime:M,noise:l,modulation:c,bitCrush:p,delay:f,sustainVolume:S,decay:B}}GetNote(a=0,t=440){return t*2**(a/12)}SoundToArray(a){const t=this.BuildSound(),n=[];for(const e in t)n.push(a[e]);return n}CreateAudioContext(){const a=new(AudioContext||webkitAudioContext);return a.a=a.createBufferSource,a.createBufferSource=(t=a.a())=>(t.start=t.start||(t=>a.noteOn(t)),t.stop=t.stop||(t=>a.noteOff(t)),t),a}};function zzfx(){return ZZFX.Play(...arguments)};

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
    DistTo(v)
    {
        return Math.sqrt(this.DistToSq(v));
    }
    DistToSq(v)
    {
        let dx = this.x - v.x;
        let dy = this.y - v.y;
        return dx*dx + dy*dy;
    }
    Len()
    {
        return Math.sqrt(this.LenSq());
    }
    LenSq()
    {
       return this.x*this.x + this.y*this.y; 
    }
    Normalize()
    {
        let len = this.Len();
        this.x /= len;
        this.y /= len;
    }
    ClampMax(maxLen)
    {
        let lenSq = this.LenSq();
        if (lenSq > maxLen*maxLen)
        {
            let len = Math.sqrt(lenSq);
            this.x = (this.x / len) * maxLen;
            this.y = (this.y / len) * maxLen;
        }
    }
}


// Main loop + State management -----------------------------------------------
let state = null;
let nextState = null;
let Enter = 0; let Tick = 1; let Draw = 2; let Exit = 3;
let clearColor = "#1A1A1AFF";
let gameLoopFixedTimeStep = 1/60;
let gameLoopFrameTimeAccum = 0;
let previousGameLoopTime = undefined;
let GameLoop = (curTime) =>
{
    window.requestAnimationFrame(GameLoop);

    FitToScreen();

    let deltaTime = Math.min((curTime - (previousGameLoopTime || curTime)) / 1000.0, 0.2);  // Cap to 200ms (5fps)
    gameLoopFrameTimeAccum += deltaTime;

    while (gameLoopFrameTimeAccum > gameLoopFixedTimeStep)
    {
        gameLoopFrameTimeAccum -= gameLoopFixedTimeStep;

        // Switch states?
        if (nextState != null)
        {
            if (state != null) { state(Exit); }
            state = nextState;
            nextState = null;
            if (state != null) { state(Enter); }
        }

        // Tick state
        if (state)
        {
            state(Tick);
        }

        // Update/Clear per-frame input values
        if (touch.down)
        {
            touch.lastDown = 1;
        }
        else
        {
            ++touch.lastDown;
        }
        touch.up = false;
        touch.down = false;
    }

    // Clear canvas
    ctx.rect(0, 0, gameWidth, gameHeight);
    ctx.fillStyle = clearColor;
    ctx.fill();

    // Draw state
    if (state)
    {
        state(Draw);
    }

    previousGameLoopTime = curTime;
}

let actualWidth = -1;
let actualHeight = -1;
let FitToScreen = () =>
{
    let aspectRatio = canvas.width / canvas.height;
    let newWidth = window.innerWidth;
    let newHeight = window.innerWidth / aspectRatio;

    //console.log(window.innerWidth + "x" + window.innerHeight);

    if (newHeight > window.innerHeight)
    {
        newHeight = window.innerHeight;
        newWidth = newHeight * aspectRatio;
    }

    if (newWidth !== actualWidth || newHeight !== actualHeight)
    {
        canvas.style.width = newWidth+"px";
        canvas.style.height = newHeight+"px";

        actualWidth = newWidth;
        actualHeight = newHeight;

        //console.log("newWidth" + newWidth + " actualWidth: " + actualWidth);
    }

    window.scrollTo(0, 0);
}

// Start it up!
window.requestAnimationFrame(GameLoop);
