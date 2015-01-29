var SayHello = React.createClass({
    render: function(){
        if (this.props.name) {
            return React.DOM.h1(null, "Hello " + this.props.name + "!");
        } else {
            return React.DOM.h1(null, "Hello World!");
        }
    }
});

React.renderComponent(
    SayHello({name: "Gio"}),
    document.getElementById("app")
);

