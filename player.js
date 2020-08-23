let PlayerStateIdle = 0;
let PlayerStateBelly = 1;

let BellyBounceTime = 30;
let BellyBounceAttackTime = 10;

class Player
{
    constructor()
    {
        this.Reset();
    }

    Reset()
    {
        this.Idle();
        this.angle = 0;
        this.state = PlayerStateIdle;
        this.timer = 0;
    }

    Tick()
    {
        switch (this.state)
        {
            case PlayerStateIdle:
            {
                if (touch.down)
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
            } break;
        }
    }

    Idle()
    {
        this.pos = new V2(100, 140);
        this.angle = 0;
        this.state = PlayerStateIdle;
    }

    BellyBounce()
    {
        this.pos = new V2(120, 130);
        this.angle = -15;
        this.timer = BellyBounceTime;
        this.state = PlayerStateBelly;
    }

    IsBellyBounceAttacking()
    {
        return (this.state == PlayerStateBelly) && (this.timer >= BellyBounceTime - BellyBounceAttackTime);
    }

    Draw()
    {
        PushMatrix(this.pos.x, this.pos.y, this.angle);
        DrawRect(0, 0, 48, 48, "#0F0");
        PopMatrix();
    }
}