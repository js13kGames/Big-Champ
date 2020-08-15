class Plug
{
    constructor()
    {
        this.Reset();
    }

    Reset()
    {
        this.x = 60;
        this.y = 170;
        this.angle = 0;
        this.isConnected = false;
        this.isThrowing = false;
    }

    Tick()
    {
        if (this.isConnected)
        {
            // Debug reset
            if (touch.up)
            {
                this.Reset();
            }
        }
        else if (this.isThrowing)
        {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.25;
            this.angle = Math.atan2(this.vy, this.vx) * Rad2Deg;

            // Connect to hub?
            let dx = hub.x - this.x;
            let dy = hub.y - this.y;
            let dSq = (dx*dx) + (dy*dy);
            if (dSq < 24*24)
            {
                this.isThrowing = false;
                this.isConnected = true;
            }

            // Debug reset
            if (this.x > gameWidth || this.x < 0 || this.y > gameHeight || this.y < 0)
            {
                this.Reset();
            }
        }
        else
        {
            if (touch.down)
            {
                this.xDragOrig = touch.x;
                this.yDragOrig = touch.y;
            }
            if (touch.up)
            {
                this.vx = (this.xDragOrig - touch.x);
                this.vy = (this.yDragOrig - touch.y);
                let dSq = (this.vx*this.vx) + (this.vy*this.vy);
                let vMax = 10;
                if (dSq > vMax*vMax)
                {
                    let d = Math.sqrt(dSq);
                    this.vx = (this.vx / d) * vMax;
                    this.vy = (this.vy / d) * vMax;
                }
                this.isThrowing = true;
            }
        }
    }

    Draw()
    {
        DrawRect(this.x, this.y, 24, 16, "#888", this.angle);
    }
}