class Enemy_SlowBounce extends Enemy
{
    constructor()
    {
        super();
        this.color = "#00F";
        this.pos.Set(this.pos.x + 140, this.pos.y);
        this.vel.Set(-10, -16);
    }

    MoveToPlayer()
    {
        this.vel.y += 0.8;

        super.MoveToPlayer();

        if (this.pos.y >= 296)
        {
            this.pos.y = 296;
            this.vel.y = -16;
        }
    }
}