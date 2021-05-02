let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

let loadImage = (src, callback) => {
    let img = document.createElement("img");
    img.onload = () => callback(img);    
    img.src = src;
};

let imagePath = (photoNumber, move) => {
    return "finisher/images/" + move + "/" + photoNumber + ".png";
};

let photos = {
    idle: [1, 2, 3, 4, 5, 6, 7, 8],
    kick: [1, 2, 3, 4, 5, 6, 7],
    punch: [1, 2, 3, 4, 5, 6, 7],
    block: [1, 2, 3, 4, 5, 6, 7, 8, 9]
};

let loadImages =(callback) => {
    let images = { idle: [], kick: [], punch: [], block: [] };
    let imagesToLoad = 0;

    ["idle", "kick", "punch", "block"].forEach((move) => {
        let movePhotos = photos[move];
        imagesToLoad = imagesToLoad + movePhotos.length;

        movePhotos.forEach((photoNumber) => {
            let path = imagePath(photoNumber, move);

            loadImage(path, (image) => {
                images[move][photoNumber - 1] = image;
                imagesToLoad = imagesToLoad - 1;
    
                if (imagesToLoad === 0) {
                    callback(images);
                }
            });
        });
    });
};

let animate = (ctx, images, move, callback) => {
    images[move].forEach((image, index) => {
        setTimeout(() => {
            ctx.clearRect(0, 0, 500, 500);
            ctx.drawImage(image, 0, 0, 500, 500);
        }, index * 100);
    });

    setTimeout(callback, images[move].length * 100);
};

loadImages((images) => {
    let queuedmoves = [];

    let extra = () => {
        let selectedMove;

        if (queuedmoves.length === 0) {
            selectedMove = "idle";
        } 
        else {
            selectedMove = queuedmoves.shift();
        }

        animate(ctx, images, selectedMove, extra);
    };

    extra();

    document.getElementById("kick").onclick = () => {
        queuedmoves.push("kick");
    };

    document.getElementById("punch").onclick = () => {
        queuedmoves.push("punch");
    };

    document.getElementById("block").onclick = () => {
        queuedmoves.push("block");
    };

    document.addEventListener("keyup", (event) => {
        const key = event.key;

        if (key === "ArrowLeft") {
            queuedmoves.push("kick");
        } else if (key === "ArrowRight") {
            queuedmoves.push("punch");
        } else if (key === "ArrowUp") {
            queuedmoves.push("block");
        }
    });
});