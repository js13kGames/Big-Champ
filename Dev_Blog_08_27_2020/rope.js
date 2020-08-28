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

        this.Collide();
    }

    Simulate()
    {
        for (let i = 0; i < this.numPoints; ++i)
        {
            let p = this.points[i];
            let vx = (p.x - p.xLast) + Math.cos(Date.now())*0.02;
            let vy = (p.y - p.yLast) + Math.sin(Date.now())*0.02;// + 0.2;
            p.xLast = p.x;
            p.yLast = p.y;
            p.x += vx;
            p.y += vy;
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

                let p1Ratio = i == 0 ? 0 : 0.25;
                let p2Ratio = i == 0 ? 0.5 : 0.25;
                let p1Move = new V2(delta.x*moveMul*p1Ratio, delta.y*moveMul*p1Ratio);
                let p2Move = new V2(delta.x*moveMul*p2Ratio, delta.y*moveMul*p2Ratio);
                p1.SubV(p1Move);
                p2.AddV(p2Move);

                if (i == 0)
                {
                    p1Ratio = 0.005;
                    let p1Move = new V2(delta.x*moveMul*p1Ratio, delta.y*moveMul*p1Ratio);
                    //plug.vel.SubV(p1Move);
                }
            }
        }

        // Hack
        this.points[this.numPoints - 1].Set(30, 200);
    }

    Collide()
    {
        for (let i = 0; i < this.numPoints; ++i)
        {
            let p = this.points[i];
            
            // Bottom of screen
            p.y = Math.min(p.y, gameHeight - 10);

            let dir = new V2(p.x - hub.pos.x, p.y - hub.pos.y);
            let lenSq = dir.LenSq();
            if (lenSq < 16*16)
            {
                let len = Math.sqrt(lenSq);
                dir.Normalize();
                dir.MulS(16);
                p.SetV(hub.pos);
                p.AddV(dir);
            }

            // Hack/test rope vs. hub
            // let dx = p.x - hub.pos.x;
            // let dy = p.y - hub.pos.y;            
            // if (dx > -16 && dx < 16 && dy > -16 && dy < 16)
            // {
            //     if (Math.abs(dx) > Math.abs(dy))
            //     {
            //         if (dx < 0)
            //         {
            //             p.x = hub.pos.x - 16;
            //         }
            //         else
            //         {
            //             p.x = hub.pos.x + 16;
            //         }
            //     }
            //     else
            //     {
            //         if (dy < 0)
            //         {
            //             p.y = hub.pos.y - 16;
            //         }
            //         else
            //         {
            //             p.y = hub.pos.y + 16;
            //         }
            //     }
            // }
        }
    }

    Draw()
    {
        for (let i = 0; i < this.numPoints - 1; ++i)
        {
            let p1 = this.points[i];
            let p2 = this.points[i + 1];
            DrawLine(p1.x, p1.y, p2.x, p2.y, "#000000FF", 3.0);
        }
    }
}