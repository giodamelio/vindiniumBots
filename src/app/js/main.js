var React = require("react");
var Router = require("react-router");

var Route = Router.Route,
    DefaultRoute = Router.DefaultRoute,
    Link=Router.Link;

var App = require("./App");
var Dashboard = require("./Dashboard");
var Runner = require("./Runner");

// Define our routes
var routes = (
    <Route name="app" path="/" handler={App}>
        <DefaultRoute handler={Dashboard}/>
        <Route name="dashboard" path="/" handler={Dashboard} />
        <Route name="runner" handler={Runner} />
    </Route>
);

// Startup the app
Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(
        <Handler />,
        document.getElementById("app")
    );
});

