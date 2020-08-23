class Enemy_SlowRun extends Enemy
{
    constructor()
    {
        super();
        this.color = "#F00";
    }

    MoveToPlayer()
    {
        this.pos.x -= 3;
    }
}