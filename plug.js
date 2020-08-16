let PlugStateIdle = 0;
let PlugStateThrowing = 1;
let PlugStateConnected = 2;

class Plug
{
    constructor()
    {
        this.Reset();
    }

    Reset()
    {
        this.pos = new V2(60, 170);
        this.vel = new V2();
        this.dragOrig = new V2();
        this.angle = 0;
        this.state = PlugStateIdle;
    }

    Tick()
    {
        switch (this.state)
        {
            case PlugStateIdle:
            {
                if (touch.down)
                {
                    this.dragOrig.SetV(touch);
                }
                if (touch.up)
                {
                    this.vel.SetToFrom(touch, this.dragOrig);
                    this.vel.ClampMax(10);
                    this.state = PlugStateThrowing;
                }
            } break;

            case PlugStateThrowing:
            {
                this.pos.AddV(this.vel);
                this.vel.y += 0.25;
                this.angle = Math.atan2(this.vel.y, this.vel.x) * Rad2Deg;

                // Connect to hub?
                let dSq = this.pos.DistSq(hub.pos);
                if (dSq < 24*24)
                {
                    this.state = PlugStateConnected;
                }

                // Debug reset
                if (this.pos.x > gameWidth || this.pos.x < 0 || this.pos.y > gameHeight || this.pos.y < 0)
                {
                    this.Reset();
                }
            } break;

            case PlugStateConnected:
            {
                // Debug reset
                if (touch.up)
                {
                    this.Reset();
                }
            } break;
        }
    }

    Draw()
    {
        DrawRect(this.pos.x, this.pos.y, 24, 16, "#888", this.angle);
    }
}