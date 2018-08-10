angular.module('newsFeedModule', ['userServices', 'authServices'])
app.controller('newsFeedCtrl', function (Auth, $http, $location) {
    _t = this;
    this.message = "Works Fine!";
    this.newPost = {}
    this.feed = [];
    this.moment = moment;
    this.comments_data = new Map();
    Auth.getUser().then(function (user) {
            _t.current_user = user.data.email
        })
        .catch(function (e) {

        });
    $http.get('/api/feed').then(function (feeds) {
            _t.feed = feeds.data;
            console.log(_t.feed)
        })
        .catch(function (err) {
            console.log(err)
        })

    this.submitPost = function () {

        $http.post('/api/feed', _t.newPost).then(function (result) {
                _t.feed.unshift(result.data)
            })
            .catch(function (err) {
                console.log(err)
            })
            $location.path("/");
    }
    this.comment_new = null;
    this.addComment = function (id) {
        $http.post('/api/comments/'+id,{content:_t.comment_new}).then(function (res) {
            if (_t.comments_data.has(id)) {
                var c = _t.comments_data.get(id);
                c.push(res.data);
                _t.comments_data.set(id,c);
            } else {
                
                _t.comments_data.set(id, [res.data]);
            }
        })
    }

    this.deleteComment = function (id,post_id,index) {
        if (confirm('Are You Sure ?')) {
            $http.delete('/api/comments/'+id).then(function (res) {
                if (_t.comments_data.has(post_id)) {
                    var c = _t.comments_data.get(post_id);
                    c.splice(index,1);
                    _t.comments_data.set(post_id, c);
                }
            })
        }
    }

    this.getComments = function (id) {
        $http.get('/api/comments/' + id).then(function (res) {
            console.log(res);
            _t.comments_data.set(id,res.data)
            console.log(_t.comments_data.get(id));
        })
    }

    this.deletePost = function (id, index) {
        if (confirm('Are You Sure ?')) {
            _t.feed.splice(index, 1);
            $http.delete('/api/feed/' + id)
                .then(function (res) {

                })
                .catch(function (e) {

                })
        }
    }
});