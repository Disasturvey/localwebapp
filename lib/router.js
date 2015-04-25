Router.configure({
    layoutTemplate: 'appBody'
})

Router.route("/", function(){
    this.render("indexComponent")
})

Router.route("/api/", { where: "server" })
.get(function(){
    this.response.setHeader('Content-Type', 'application/json');
    this.response.end(JSON.stringify({a: 1}))
})
.post(function(){
    this.response.setHeader('Content-Type', 'application/json');
    this.request.body
    
    Response.insert({

    })
    this.response.end(JSON.stringify({notice: "success"}))
})