let EnemyStateMoveToPlayer = 0;
let EnemyStateBounceOff = 1;

class Enemy
{
    constructor()
    {
        this.pos = new V2(840, 296);
        this.vel = new V2(0, 0);
        this.state = EnemyStateMoveToPlayer;
        this.angle = 0;
        this.color = "000";
    }

    Tick()
    {
        switch(this.state)
        {
            case EnemyStateMoveToPlayer:
            {
                this.MoveToPlayer();

                if (this.pos.x <= player.pos.x + 30)
                {
                    if (player.IsBellyBounceAttacking())
                    {
                        this.BounceOff();
                    }
                    else
                    {
                        player.OnHit(this);
                        this.KillSelf();
                    }
                }
            } break;

            case EnemyStateBounceOff:
            {
                this.pos.AddV(this.vel);
                this.vel.y += 0.8;
                this.angle += 5 + Math.random()*5;

                if (this.pos.y > gameHeight)
                {
                    this.KillSelf();
                }
            } break;
        }
    }

    MoveToPlayer()
    {
        this.pos.AddV(this.vel);
    }

    BounceOff()
    {
        this.vel.Set(8 + Math.random()*4.0, -10 - Math.random()*4.0);
        if (Math.random() < 0.2)
        {
            this.vel.x = -this.vel.x;
            this.vel.y *= 2;
        }
        this.state = EnemyStateBounceOff;
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

        //CreateEnemy();
    }

    Draw()
    {
        PushMatrix(this.pos.x, this.pos.y, this.angle);
        DrawRect(0, 0, 64, 64, this.color);
        PopMatrix();
    }
}