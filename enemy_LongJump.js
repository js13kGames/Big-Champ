class Enemy_LongJump extends Enemy
{
    constructor()
    {
        super();
        this.color = "#FF0";
        this.pos.Set(this.pos.x + 40, this.pos.y);
        this.vel.Set(-10, -10);
        this.angle = -10;
    }

    MoveToPlayer()
    {
        this.vel.y += 0.5;

        super.MoveToPlayer();

        if (this.pos.y >= 148)
        {
            this.pos.y = 148;
            this.vel.y = -9;
        }
    }
}