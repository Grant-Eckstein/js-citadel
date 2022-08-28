const express = require("express");
const Post = require("./Post");
const router = express.Router();

// Get all posts
router.get("/posts", async (req, res) => {
    const posts = await Post.find();
    res.send(posts);
});

router.post("/posts", async (req, res) => {
    const post = new Post({
        title: req.query.title,
        content: req.query.content,
    });
    console.log(post.title);
    await post.save();
    res.send(post);
});

router.get("/posts/:id", async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id });
        res.send(post);
    } catch {
        res.status(404);
        res.send({ error: "Post doesn't exist!" });
    }
});

router.patch("/posts/:id", async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id });

        if (req.query.title) {
            post.title = req.query.title;
        }

        if (req.query.content) {
            post.content = req.query.content;
        }

        await post.save();
        res.send(post);
    } catch {
        res.status(404);
        res.send({ error: "Post doesn't exist!" });
    }
});

router.delete("/posts/:id", async (req, res) => {
	try {
		await Post.deleteOne({ _id: req.params.id });
		res.status(204).send();
	} catch {
		res.status(404);
		res.send({ error: "Post doesn't exist!" });
	}
});

module.exports = router;