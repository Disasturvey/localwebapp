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
                            <h1>Simple Statistics</h1>
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
    handleClickRemove: function(){
        Questions.remove(this.props.question._id)
    },
    render: function(){
        var question = this.props.question
        return <div key={question._id} className="row">
            <div className="col-xs-1">
                { 1+ this.props.idx }
            </div>
            <div className="col-xs-10">
                { question.text }
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
        Questions.insert({
            text: React.findDOMNode(this.refs.text).value
        })
        React.findDOMNode(this.refs.text).value = ""
    },
    render: function(){
        return (
            <form onSubmit={this.handleSubmit} className="form-horizontal">
                <div className="form-group">
                    <label className="col-sm-2 control-label">New Question</label>{ " "}
                    <div className="col-sm-10">
                        <input required type="text" className="form-control" placeholder="New Question" ref="text" />
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">Audiofile</label>{ " "}
                    <div className="col-sm-10">
                        <input required type="file" ref="audio" />
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