const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const speedSlider = document.getElementById("simSpeed");

ctx.fillStyle = "black";

var deltaT = 1;
const g = 6.674 * (10 ** -11);
const fps = 60;
const maxY = 1000;


bodies = [
    {
        id: "Earth",
        x: 500,
        y: 500,
        mass: 7 * (10 ** 6),
        xVelocity: 0,
        yVelocity: 0,
    },
    {
        id: "Moon1",
        x: 100,
        y: 500,
        mass: 7 * (10 ** 5),
        xVelocity: 0,
        yVelocity: 0.00,
    },
    {
        id: "Moon2",
        x: 300,
        y: 500,
        mass: 7 * (10 ** 5),
        xVelocity: 0,
        yVelocity: 0.00,
    },
    {
        id: "Moon3",
        x: 100,
        y: 900,
        mass: 7 * (10 ** 5),
        xVelocity: 0,
        yVelocity: 0.00,
    },
    {
        id: "Moon4",
        x: 900,
        y: 500,
        mass: 7 * (10 ** 5),
        xVelocity: 0,
        yVelocity: 0.00,
    },
    {
        id: "Moon5",
        x: 900,
        y: 900,
        mass: 7 * (10 ** 5),
        xVelocity: 0,
        yVelocity: 0.00,
    },
];


const calculateThickness = (bodies) =>
{
    bodies.forEach((body) =>
    {
        body.thickness = Math.sqrt(body.mass / 10000);
    });
};


const drawFrame = (bodies) =>
{
    bodies.forEach((body) =>
    {
        const buffer = 10;
        const bodyCenterX = body.x;
        const bodyCenterY = maxY - body.y;

        ctx.beginPath();
        ctx.arc(bodyCenterX, bodyCenterY, body.thickness, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.font = "16px Arial";
        ctx.fillText(body.id, bodyCenterX + body.thickness + buffer, bodyCenterY);
    });

};


const calculateVelocity = (bodies, deltaT) =>
{
    bodies.forEach((body) =>
    {
        var sumXForce = 0;
        var sumYForce = 0;

        bodies.forEach((otherBody) =>
        {
            if (body.id != otherBody.id)
            {
                // Caculate angle to each body.
                const deltaX = otherBody.x - body.x;
                const deltaY = otherBody.y - body.y;

                const force = (g * body.mass * otherBody.mass) / ((deltaX ** 2) + (deltaY ** 2));

                var angle;
                if (deltaX == 0)
                {
                    angle = deltaY > 0 ? -Math.PI / 2 : Math.PI / 2;
                }
                else
                {
                    angle = deltaX > 0 ? (Math.PI + Math.atan(deltaY / deltaX)) : Math.atan(deltaY / deltaX);
                }

                const xForceComponent = -force * Math.cos(angle);
                const yForceComponent = -force * Math.sin(angle);

                sumXForce += xForceComponent;
                sumYForce += yForceComponent;
            }

        });

        // Calculate velocity from delta t and sum of forces.
        body.xVelocity += ((sumXForce / body.mass) * deltaT);
        body.yVelocity += ((sumYForce / body.mass) * deltaT);
    });

};


const moveBodies = (bodies, deltaT) =>
{
    bodies.forEach((body) =>
    {
        body.x += body.xVelocity * deltaT;
        body.y += body.yVelocity * deltaT;
    });

    bodies.forEach((body1, idx1) =>
    {
        bodies.forEach((body2, idx2) =>
        {
            if (body1 != body2)
            {
                const approxSquareThickness = Math.sqrt(2) * body1.thickness / 2;

                if (body1.x <= body2.x + approxSquareThickness &&
                    body1.x >= body2.x - approxSquareThickness &&
                    body1.y <= body2.y + approxSquareThickness &&
                    body1.y >= body2.y - approxSquareThickness)
                {
                    // Collision
                    // Conserve momentum and combine objects.
                    const finalMass = body1.mass + body2.mass;
                    const finalXVelocity = ((body1.mass * body1.xVelocity) + (body2.mass * body2.xVelocity)) / finalMass;
                    const finalYVelocity = ((body1.mass * body1.yVelocity) + (body2.mass * body2.yVelocity)) / finalMass;

                    // Set body2 to be combined body.
                    bodies[idx2].id += (" + " + body1.id);
                    bodies[idx2].xVelocity = finalXVelocity;
                    bodies[idx2].yVelocity = finalYVelocity;
                    bodies[idx2].mass = finalMass;

                    bodies.splice(idx1, 1);
                }
            }
        });

    });

};


speedSlider.addEventListener("input", () =>
{
    deltaT = speedSlider.value;
});

// Calculate physics
setInterval(() =>
{
    calculateVelocity(bodies, deltaT);
    moveBodies(bodies, deltaT);
    calculateThickness(bodies);
}, 1);

// Render frame
setInterval(() =>
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFrame(bodies);
}, (1 / fps) * 1000);