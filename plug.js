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
        this.rope = new Rope(this);
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
                    this.vel.SetToFrom(touch, this.dragOrig) * 1.5;
                    this.vel.ClampMax(5);
                    this.state = PlugStateThrowing;
                }
            } break;

            case PlugStateThrowing:
            {
                this.pos.AddV(this.vel);
                //this.vel.y += 0.25;

                // Bounce/friction?
                if (this.pos.x < 0 || this.pos.x > gameWidth)
                {
                    this.vel.x = -this.vel.x*0.8;
                    this.vel.y *= 0.9;
                    this.pos.x = Math.max(Math.min(this.pos.x, gameWidth), 0);
                }
                if (this.pos.y < 0 || this.pos.y > gameHeight)
                {
                    this.vel.y = -this.vel.y*0.8;
                    this.vel.x *= 0.9;
                    this.pos.y = Math.max(Math.min(this.pos.y, gameHeight), 0);
                }

                // Face move direction
                this.angle = Math.atan2(this.vel.y, this.vel.x) * Rad2Deg;

                // Connect to hub?
                let dSq = this.pos.DistToSq(hub.pos);
                if (dSq < 20*20)
                {
                    this.pos.x = hub.pos.x - 2;
                    this.pos.y = hub.pos.y;
                    this.angle = 0;
                    this.state = PlugStateConnected;
                }
            } break;

            case PlugStateConnected:
            {
            } break;
        }

        this.rope.Tick();
    }

    Draw()
    {
        this.rope.Draw();
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.angle * Deg2Rad);
        DrawRect(0, 0, 16, 16, "#444");
        if (this.state != PlugStateConnected)
        {
            DrawRect(8, -3, 10, 2, "#444");
            DrawRect(8, 3, 10, 2, "#444");
        }
        ctx.restore();
    }
}