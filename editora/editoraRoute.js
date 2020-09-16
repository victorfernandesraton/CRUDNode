const router = require("express").Router();
const EditoraService = require("./editoraService");

router.get("/", async (req, res, send) => {
    try {
        const data = await EditoraService.index({});
        res.render("show/editora", { data });
    }catch (error) {
        send(error);
    }
});

router.get("/create", (req, res, send) => {
    res.render("create/editora");
});

router.get("/delete/:id", async (req, res, send) => {
    const { id } = req.params;
    if (!id) {
        send(404, {
            error: "id is required",
        });
    }
    try {
        const data = await EditoraService.deleteOne({ id });
        res.redirect("/user");
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

router.get("/edit/:id", async (req, res, send) => {
    const { id } = req.params;
    if(!id) {
        send(404, {
            error: "id is required",
        });
    }
    try {
        const data = await EditoraService.findOne({ id });
        res.render("edit/editora", { data });
    }catch (error) {
        if (error.message.includes("editora not found")) {
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
        send(404, {
            error: "id is required",
        });
    }
    try {
        const record = await EditoraService.updateOne({
            id,
            user: { ...req.body },
        });
        res.redirect(`/user?u=${id}`);
    } catch (error) {
        send(error);
    }
});

router.post("/", async (req,res, send) => {
    try {
        const record = await EditoraService.store({ editora: { ...req.body } });
        const data = await EditoraService.index({});
        res.render("show/editora", { data });
    } catch (error) {
        send(error);
    }
});
module.exports = router;