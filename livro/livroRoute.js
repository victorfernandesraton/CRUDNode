const router = require("express").Router();
const LivroService = require("./livroService");

router.get("/", async (req, res, send) => {
    try {
        const data = await LivroService.index({});
        res.render("show/livro", { data });
    } catch (error) {
        send(error);
    }
});

router.get("/create", (req, res, send) => {
    res.render("create/livro");
});

router.get("/delete/:id", async (req, res, send) => {
    const { id } = req.params;
    if (!id) {
        send(404, {
            error: "id is required",
        });
    }
    try {
        const data = await LivroService.deleteOne({ id });
        res.redirect("/livro");
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
    if (!id) {
        send(404, {
            error: "id is required",
        });
    }
    try {
        const data = await LivroService.findOne({ id });
        res.render("edit/livro", { data });
    } catch (error) {
        if (error.message.includes("book not found")) {
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
        const record = await LivroService.updateOne({
            id,
            livro: { ...req.body },
        });
        res.redirect(`/livro?u=${id}`);
    } catch (error) {
        send(error);
    }
});

router.post("/", async (req, res, send) => {
    console.log(req.body)
    try {
        const record = await LivroService.store({ livro: { ...req.body } });
        const data = await LivroService.index({});
        res.render("show/livro", { data });
    } 
    catch (error) {
        console.log(error)
        send(error);
        
    }
});

module.exports = router;
