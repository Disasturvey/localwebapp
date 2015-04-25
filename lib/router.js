Router.configure({
    layoutTemplate: 'appBody'
})

Router.route("/", function(){
    this.render("indexComponent")
})

Router.route("/api/", { where: "server" })
.post(function(){
    this.response.setHeader('Content-Type', 'application/json')
    var texts = this.request.body.texts || []
    this.response.end(JSON.stringify({ notice: texts }))
})