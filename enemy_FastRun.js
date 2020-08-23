class Enemy_FastRun extends Enemy
{
    constructor()
    {
        super();
        this.color = "#600";
    }

    MoveToPlayer()
    {
        this.pos.x -= 6;
    }
}