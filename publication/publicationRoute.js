const router = require("express").Router();
const PublicationService = require("./publicationService");

router.get("/", async (req, res, send) => {
    try {
        // l: limit per page
        // o: offset
        // q: query
        // f: filter by (in query)
        const {q, f, l, p} = req.query;
        const {url} = req;
        let sendData = {
            limit: parseInt(l) || 10,
        };
        let filter = {};
        if (q && f) {
            filter[f] = q;
        }
        if (p) {
            sendData.offset = (p - 1)*sendData.limit;
        }
        const {data, metadata} = await PublicationService.index({...sendData, filter});
        res.render("show/publication", { data, metadata: {...metadata, url} });
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
        const {data} = await PublicationService.findOne({ id });
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
        const {data, metadata} = await PublicationService.index({});
        res.render("show/publication", { data, metadata });
    } catch (error) {
        send(error);
    }
});

module.exports = router;
