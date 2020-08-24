class Enemy_SlowBounce extends Enemy
{
    constructor()
    {
        super();
        this.color = "#00F";
        this.vel.Set(-4, -8);
    }

    MoveToPlayer()
    {
        this.vel.y += 0.4;

        super.MoveToPlayer();

        if (this.pos.y >= 148)
        {
            this.pos.y = 148;
            this.vel.y = -8;
        }
    }
}