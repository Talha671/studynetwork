var Comments = require('../../models/comments');
module.exports = function (router) {
    router.get('/comments/:id', async function (req, res) {
        try {
            console.log(req.params.id)
            var comm = await Comments.find({feed_id:req.params.id}).lean();
            res.send(comm);
        } catch (e) {
            res.send({ err: 'Error Getting Comments' })
        }
    })
    router.post('/comments/:id', async function (req, res) {
        try {
            var insert = req.body;
            insert.feed_id = req.params.id;
            insert.user_email = req.decoded.email;
            var comm = await new Comments(insert).save();
            res.send(comm);
        } catch (e) {
            res.send({ status: false, message:e})
        }
    })
    router.delete('/comments/:id', async function (req, res) {
        try {            
            var comm = await Comments.findOneAndRemove({_id:req.params.id,user_email:req.decoded.email});
            res.send(comm);
        } catch (e) {
            res.send({ status: false, message:e}).status(400)
        }
    })
}