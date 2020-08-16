class Rope
{
    constructor(root)
    {
        this.root = root;
        this.numPoints = 70;
        this.segLen = 5;
        this.points = [];
        for (let i = 0; i < this.numPoints; ++i)
        {
            this.points.push(new V2(root.pos.x + 0.5, Math.min((root.pos.y + this.segLen*i), gameHeight - 10)));
            this.points[i].xLast = this.points[i].x;
            this.points[i].yLast = this.points[i].y;
        }
    }

    Tick()
    {
        this.Simulate();

        for (let i = 0; i < 4; ++i)
        {
            this.Constrain();
        }
    }

    Simulate()
    {
        // Simualte
        for (let i = 0; i < this.numPoints; ++i)
        {
            let p = this.points[i];
            let vx = p.x - p.xLast;
            let vy = (p.y - p.yLast) + 0.1;
            p.xLast = p.x;
            p.yLast = p.y;
            p.x += vx;
            p.y += vy;

            p.y = Math.min(p.y, gameHeight - 10);
        }
        this.points[0].SetV(this.root.pos);
        this.points[this.numPoints - 1].Set(30, 200);
    }

    Constrain()
    {
        for (let i = 0; i < this.numPoints - 1; ++i)
        {
            let p1 = this.points[i];
            let p2 = this.points[i + 1];

            let delta = new V2(p1.x - p2.x, p1.y - p2.y);
            let d = delta.Len();
            if (d > 0)
            {
                let moveMul = (d - this.segLen) / d;

                let p1Ratio = i == 0 ? 0 : 0.5;
                let p2Ratio = i == 0 ? 1 : 0.5;
                let p1Move = new V2(delta.x*moveMul*p1Ratio, delta.y*moveMul*p1Ratio);
                let p2Move = new V2(delta.x*moveMul*p2Ratio, delta.y*moveMul*p2Ratio);
                p1.SubV(p1Move);
                p2.AddV(p2Move);
            }

            // Hack/test rope vs. hub
            // if ((p1.x >= hub.pos.x - 16 && p1.x <= hub.pos.x + 16) &&
            //     (p1.x >= hub.pos.y - 16 && p1.y <= hub.pos.y + 16))
            // {
            //     p1.y = hub.pos.y - 16;
            // }
        }

        // Hack
        this.points[this.numPoints - 1].Set(30, 200);
    }

    Draw()
    {
        for (let i = 0; i < this.numPoints - 1; ++i)
        {
            let p1 = this.points[i];
            let p2 = this.points[i + 1];
            DrawLine(p1.x, p1.y, p2.x, p2.y, "#000000FF");
        }
    }
}