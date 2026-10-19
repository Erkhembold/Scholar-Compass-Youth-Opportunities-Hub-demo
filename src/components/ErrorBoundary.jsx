import { Component } from "react";

// Catches a crash inside one page so the rest of the site (header, footer,
// navigation) keeps working instead of the whole tab turning white. Shows
// what went wrong in plain text so it can be reported, and lets the person
// recover with one click. The App gives it a `key` per route, so moving to
// another page clears the error automatically.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Page crashed:", error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const message = String(error?.message || error || "Unknown error");
    return (
      <section className="section">
        <div className="section__inner" role="alert">
          <h1 className="section__title">This page could not be shown</h1>
          <p className="section__lede">
            Something unexpected went wrong. The rest of ScholarCompass still works.
          </p>
          <p className="section__lede">
            <a className="btn btn--accent" href="#/" onClick={() => this.setState({ error: null })}>
              Go to home
            </a>{" "}
            <button type="button" className="btn btn--ghost" onClick={() => window.location.reload()}>
              Reload this page
            </button>
          </p>
          <p className="friend-note" style={{ textAlign: "left" }}>
            Details for support: {message}
          </p>
        </div>
      </section>
    );
  }
}
