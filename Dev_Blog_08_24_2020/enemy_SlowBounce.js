class Enemy_SlowBounce extends Enemy
{
    constructor()
    {
        super();
        this.color = "#00F";
        this.pos.Set(this.pos.x + 70, this.pos.y);
        this.vel.Set(-5, -8);
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