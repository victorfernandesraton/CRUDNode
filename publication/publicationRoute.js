const router = require("express").Router();
const PublicationService = require("./publicationService");

router.get("/", async (req, res, send) => {
    try {
        const {q, f} = req.query;
        let filter = {};
        if (q && f) {
            filter[f] = q;
        }       
        const data = await PublicationService.index({filter});
        res.render("show/publication", { data });
    } catch (error) {
        send(error);
    }
});
router.get("/create", (req, res, send) => {
    res.render("create/publication");
});

router.get("/delete/:id", async (req, res, send) => {
    const { id } = req.params;
    if (!id) {
        send(404, {
            error: "id is required",
        });
    }
    try {
        const data = await PublicationService.deleteOne({ id });
        res.redirect("/pub");
    } catch (error) {
        if (error.message.includes("publication not found")) {
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
        const data = await PublicationService.findOne({ id });
        res.render("edit/publication", { data });
    } catch (error) {
        if (error.message.includes("publication not found")) {
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
        const record = await PublicationService.updateOne({
            id,
            publication: { ...req.body },
        });
        res.redirect(`/pub?u=${id}`);
    } catch (error) {
        send(error);
    }
});

router.post("/", async (req, res, send) => {
    try {
        const record = await PublicationService.store({ publication: { ...req.body } });
        const data = await PublicationService.index({});
        res.render("show/publication", { data });
    } catch (error) {
        send(error);
    }
});

module.exports = router;
