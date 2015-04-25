var IndexComponent = ReactMeteor.createClass({
    templateName: "indexComponent",
    startMeteorSubscriptions: function(){
        Meteor.subscribe("Answers")
        Meteor.subscribe("Questions")
    },
    getInitialState: function(){
        return {}
    },
    getMeteorState: function() {
        return {
            answers:    Answers.find({}).fetch(),
            questions:  Questions.find({}).fetch()
        };
    },
    render: function(){
        return (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="page-header">
                            <h1>Overview</h1>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="page-header">
                            <h1>Questions</h1>
                            <QuestionForm />
                        </div>


                        { this.state.questions.map(function(question, idx){
                            return <QuestionComponent key={question._id} idx={idx} question={question} />
                        })}
                    </div>
                </div>
            </div>
        )
    }
})

var QuestionComponent = ReactMeteor.createClass({
    handleClickRemove: function(e){
        Questions.remove(this.props.question._id)
    },
    handlePlayAudio: function(e){
        e.preventDefault()
        var question = this.props.question
        window.open(Audios.find(question.audio._id).fetch()[0].url(),'_blank')
    },
    render: function(){
        var question = this.props.question
        return <div key={question._id} className="row">
            <div className="col-xs-1">
                { 1 + this.props.idx }
            </div>
            <div className="col-xs-9">
                { question.text }
            </div>
            <div className="col-xs-1">
                <span onClick={this.handlePlayAudio} style={{ cursor: "pointer" }} className="glyphicon glyphicon-play" aria-hidden="true"></span>
            </div>
            <div className="col-xs-1">
                <span onClick={this.handleClickRemove} style={{cursor: "pointer" }}> &times;</span>
            </div>
        </div>

    }
})

var QuestionForm = ReactMeteor.createClass({
    handleSubmit: function(e){
        e.preventDefault()
        
        var files = React.findDOMNode(this.refs.audio).files
        for (var i = 0 ; i < files.length ; i++) {
            var file = files[i]
            var audioObj = Audios.insert(file)
            Questions.insert({
                text:   React.findDOMNode(this.refs.text).value,
                audio:  audioObj
            })
        }
    },
    render: function(){
        return (
            <form onSubmit={this.handleSubmit} className="form-horizontal">
                <div className="form-group">
                    <label className="col-sm-2 control-label">New Question</label>{ " " }
                    <div className="col-sm-10">
                        <input required type="text" className="form-control" placeholder="New Question" ref="text" />
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">Audiofile</label>{ " "}
                    <div className="col-sm-10">
                        <input name="bla" required type="file" ref="audio" />
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label"></label>{ " "}
                    <div className="col-sm-10">
                        <button type="submit" className="btn btn-primary">Add</button>
                    </div>
                </div>
            </form>
        )
    }
})