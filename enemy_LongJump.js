class Enemy_LongJump extends Enemy
{
    constructor()
    {
        super();
        this.color = "#FF0";
        this.pos.Set(this.pos.x + 80, this.pos.y);
        this.vel.Set(-20, -20);
        this.angle = -10;
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
    }
}
