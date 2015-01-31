var React = require("react");
var page = require("page");

var Router = React.createClass({
    // Render the current component
    render: function() {
        return this.state.component;
    },

    // Start with an empty div
    getInitialState: function() {
        return {
            component: <div />
        };
    },

    // Define our routes
    componentDidMount: function() {
        this.props.routes.forEach((route) => {
            var url = route[0];
            var Component = route[1];

            page(url, (ctx) => {
                this.setState({ 
                    component: <Component params={ctx.params} querystring={ctx.querystring} /> 
                });
            });
        });

        page.start();
    }
});

module.exports = Router;

