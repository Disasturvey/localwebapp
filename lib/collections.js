Answers = new Mongo.Collection("answers")
Questions = new Mongo.Collection("questions")
Devices = new Mongo.Collection("devices")

Audios = new FS.Collection("audios", {
    stores: [new FS.Store.FileSystem("audios", {path: "~/uploads"})]
});
Images = new FS.Collection("images", {
    stores: [new FS.Store.FileSystem("images", {path: "~/uploads"})]
})

Audios.allow({
    download: function(){
        return true
    }
})