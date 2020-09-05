const router = require("express").Router();

const UserService = require("./userService");

router.get("/", async (req, res, send) => {
    try {
        const data = await UserService.index({});
        res.render("show/user", { data });
    } catch (error) {
        send(error);
    }
});

router.get("/edit/:id", async (req, res, send) => {
    const { id } = req.params;
    if (!id) {
        res.send(404, {
            error: "id is required",
        });
    }
    try {
        const data = await UserService.findOne({ id });
        res.render("edit/user", { data });
    } catch (error) {
        if (error.message.includes("user not found")) {
            res.status(404).json({
                data: "not found",
            });
        } else {
            send(error);
        }
    }
});

router.post("/:id", async (req, res, send) => {
    const { id } = req.params;
    if (!id) {
        res.send(404, {
            error: "id is required",
        });
    }
    try {
        const record = await UserService.updateOne({
            id,
            user: { ...req.body },
        });
        res.redirect(`/user?u=${id}`);
        // const data = await UserService.index({});
    } catch (error) {
        send(error);
    }
});

router.post("/", async (req, res, send) => {
    try {
        const record = await UserService.store({ user: { ...req.body } });
        const data = await UserService.index({});
        res.render("show/user", { data });
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;
