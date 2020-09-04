// Config ---------------------------------------------------------------------
gameWidth = 800;
gameHeight = 450;
gameScale = 1.0;

// Constants ------------------------------------------------------------------
Deg2Rad = Math.PI/180.0;
Rad2Deg = 180.0/Math.PI;

// Initialization -------------------------------------------------------------
canvas = document.createElement("canvas");
canvas.setAttribute("width", gameWidth);
canvas.setAttribute("height", gameHeight);
canvas.style.width = `${gameWidth * gameScale}px`;
canvas.style.height = `${gameHeight * gameScale}px`;
//canvas.style.backgroundColor = "#FFFFFFFF";
//canvas.style.imageRendering = "pixelated";
document.getElementById("game").appendChild(canvas);
ctx = this.canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Input (mouse/touch only!) --------------------------------------------------
touch = { x: 0, y: 0, up: false, down: false, held: false, lastDown: 10000 }
canvas.addEventListener("mousedown", e => { touch.up = false, touch.down = true; touch.held = true; }, false);
canvas.addEventListener("mouseup", e => { touch.up = true; touch.down = false; touch.held = false }, false);
canvas.addEventListener("mousemove", e => { SetTouchPos(e); e.preventDefault(); }, false );
canvas.addEventListener("touchstart", e => { SetTouchPos(e.touches[0]); touch.up = false; touch.down = true; touch.held = true; e.preventDefault(); }, false );
canvas.addEventListener("touchend", e => { touch.up = true; touch.down = false; touch.held = false; e.preventDefault(); }, false );
canvas.addEventListener("touchcancel", e => { touch.up = true; touch.down = false; touch.held = false; e.preventDefault(); }, false );
canvas.addEventListener("touchmove", e => { SetTouchPos(e.touches[0]); e.preventDefault(); }, false );
SetTouchPos = (e) =>
{
    touch.x = (e.pageX - canvas.offsetLeft) / gameScale;
    touch.y = (e.pageY - canvas.offsetTop) / gameScale;
}

// Rendering ------------------------------------------------------------------
PushMatrix = (x, y, angle = 0) =>
{
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * Deg2Rad);
}

PopMatrix = () =>
{
    ctx.restore();
}

LoadSprite = (name) =>
{
    sprite = new Image();
    sprite.src = name;
    return sprite;
}

DrawLine = (x1, y1, x2, y2, color, width = 1.0) =>
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

DrawBezierLine = (x1, y1, x2, y2, c1x, c1y, c2x, c2y, color, width) =>
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

DrawRect = (x, y, width, height, color, angle = 0.0) =>
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

DrawCircle = (x, y, radius, color, startAngle = 0, endAngle = 2*Math.PI) =>
{
    ctx.save();
    ctx.translate(x + 0.5, y + 0.5);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.fill();
    ctx.restore();
}

DrawSprite = (image, x, y, xScale = 1.0, yScale = 1.0, angle = 0.0) =>
{
    let w = image.width * xScale;
    let h = image.height * yScale;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * Deg2Rad);
    ctx.drawImage(image, -w*0.5, -h*0.5, w, h);
    ctx.restore();
}

DrawText = (text, x, y, fontSize = 12, fillStyle = "#FFF", angle = 0, fontName = "Arial", fontStyle = "", align = "left", baseline = "bottom", outlineWidth = 0) =>
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
        ctx.strokeStyle = "#000";
        ctx.lineWidth = outlineWidth;
        ctx.lineJoin = "round";
        ctx.strokeText(text, 0, 0);
    }
    ctx.fillText(text, 0, 0);
    ctx.restore();
}

// Audio (ZzFX: https://github.com/KilledByAPixel/ZzFX) -----------------------
zzfxV=.3 // volume
zzfx=    // play sound
(t=1,a=.05,n=220,e=0,f=0,h=.1,M=0,r=1,z=0,o=0,i=0,s=0,u=0,x=0,c=0,d=0,X=0,b=1,m=0,l=44100,B=99+e*l,C=f*l,P=h*l,g=m*l,w=X*l,A=2*Math.PI,D=(t=>0<t?1:-1),I=B+g+C+P+w,S=(z*=500*A/l**2),V=(n*=(1+2*a*Math.random()-a)*A/l),j=D(c)*A/4,k=0,p=0,q=0,v=0,y=0,E=0,F=1,G=[],H=zzfxX.createBufferSource(),J=zzfxX.createBuffer(1,I,l))=>{for(H.connect(zzfxX.destination);q<I;G[q++]=E)++y>100*d&&(y=0,E=k*n*Math.sin(p*c*A/l-j),E=D(E=M?1<M?2<M?3<M?Math.sin((E%A)**3):Math.max(Math.min(Math.tan(E),1),-1):1-(2*E/A%2+2)%2:1-4*Math.abs(Math.round(E/A)-E/A):Math.sin(E))*Math.abs(E)**r*t*zzfxV*(q<B?q/B:q<B+g?1-(q-B)/g*(1-b):q<B+g+C?b:q<I-w?(I-q-w)/P*b:0),E=w?E/2+(w>q?0:(q<I-w?1:(q-I)/w)*G[q-w|0]/2):E),k+=1-x+1e9*(Math.sin(q)+1)%2*x,p+=1-x+1e9*(Math.sin(q)**2+1)%2*x,n+=z+=500*o*A/l**3,F&&++F>s*l&&(n+=i*A/l,V+=i*A/l,F=0),u&&++v>u*l&&(n=V,z=S,v=1,F=F||1);return J.getChannelData(0).set(G),H.buffer=J,H.start(),H},zzfxX=undefined
CreateAudioContext = () =>
{
    // Create audio context on first touch to avoid console warnings
    if (zzfxX == undefined)
    {
        zzfxX = new AudioContext;
    }
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
state = null;
nextState = null;
Enter = 0; Tick = 1; Draw = 2; Exit = 3;
clearColor = "#1A1A1AFF";
gameLoopFixedTimeStep = 1/60;
gameLoopFrameTimeAccum = 0;
previousGameLoopTime = undefined;
GameLoop = (curTime) =>
{
    window.requestAnimationFrame(GameLoop);

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

// Start it up!
window.requestAnimationFrame(GameLoop);
